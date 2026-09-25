(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  function weightedAveragePrice(state, sectorId) {
    const firms = state.firms.filter(f => f.active && f.sector === sectorId);
    if (!firms.length) return 1;
    return firms.reduce((sum, f) => sum + f.price, 0) / firms.length;
  }

  MS.updateCostOfLiving = function updateCostOfLiving(state) {
    const food = weightedAveragePrice(state, 'food');
    const textiles = weightedAveragePrice(state, 'textiles');
    const goods = weightedAveragePrice(state, 'goods');
    state.economy.costOfLiving = Math.max(0.1, food * 0.58 + textiles * 0.24 + goods * 0.18);
  };

  function bookHouseholdIncome(state) {
    const avgWage = state.economy.averageWage;
    const totalPositiveProfit = state.firms.reduce((s, f) => s + Math.max(0, f.profit), 0);
    const capitalPool = state.economy.pendingCapitalIncome + totalPositiveProfit * 0.05;
    const capitalistWeight = state.households.reduce((s, h) => s + (h.capital_income_weight || 0), 0) || 1;

    for (const h of state.households) {
      h.wage_income = h.workers_employed * avgWage;
      h.capital_income = capitalPool * ((h.capital_income_weight || 0) / capitalistWeight);
      const unemployed = Math.max(0, h.workers_available - h.workers_employed);
      h.benefits = unemployed * state.economy.costOfLiving * (h.benefit_rate || 0);
      h.rent = h.population * h.rent_per_capita;
      const gross = h.wage_income + h.capital_income + h.benefits;
      const disposable = Math.max(0, gross - h.rent);
      const spend = disposable * h.consumption_propensity;
      h.food_spend = spend * 0.50;
      h.discretionary_spend = spend - h.food_spend;
      h.money = Math.max(0, h.money + gross - h.rent - spend);
    }
  }

  function demandMoneyBySector(state) {
    const result = { food: 0, textiles: 0, goods: 0 };
    for (const sector of state.sectors) result[sector.id] += sector.external_demand_money || 0;
    for (const h of state.households) {
      const discretionary = h.discretionary_spend;
      result.food += h.food_spend;
      result.textiles += discretionary * 0.60;
      result.goods += discretionary * 0.40;
    }
    return result;
  }

  MS.clearGoodsMarket = function clearGoodsMarket(state) {
    bookHouseholdIncome(state);
    const demandMoney = demandMoneyBySector(state);
    state.publicFinance.taxRevenue = 0;
    state.economy.pendingCapitalIncome = 0;

    for (const sector of state.sectors) {
      const firms = state.firms.filter(f => f.active && f.sector === sector.id);
      if (!firms.length) continue;
      const avgPrice = firms.reduce((s, f) => s + f.price, 0) / firms.length;
      const totalDemandUnits = avgPrice > 0 ? demandMoney[sector.id] / avgPrice : 0;
      const weights = firms.map(f => Math.pow(avgPrice / Math.max(0.05, f.price), 2) * (0.3 + Math.min(1, f.inventory / Math.max(1, f.capacity))));
      const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;

      firms.forEach((firm, index) => {
        const potentialSales = totalDemandUnits * weights[index] / totalWeight;
        firm.sales = Math.max(0, Math.min(firm.inventory, potentialSales));
        firm.inventory = Math.max(0, firm.inventory - firm.sales);
        firm.revenue = firm.sales * firm.price;

        const wages = firm.employees * firm.wage_offer;
        const inputs = firm.output * firm.input_cost_per_unit;
        const depreciation = firm.capital_stock * MS.CONFIG.depreciationRateMonthly;
        const operatingCost = wages + inputs + depreciation + firm.fixed_cost * 0.35;
        const pretax = firm.revenue - operatingCost;
        const tax = Math.max(0, pretax) * state.policies.corporateTaxRate;
        firm.profit = pretax - tax;
        state.publicFinance.taxRevenue += tax;
        state.publicFinance.cash += tax;

        const rawCash = firm.cash + firm.profit;
        firm.cash = Math.max(0, rawCash);
        if (rawCash <= 0 && firm.profit < 0) firm.insolvency_months += 1;
        else if (firm.profit > 0) firm.insolvency_months = Math.max(0, firm.insolvency_months - 1);

        firm.utilization = firm.capacity > 0 ? Math.min(1.5, firm.sales / firm.capacity) : 0;
        firm.trailing_sales.push(firm.sales);
        if (firm.trailing_sales.length > 12) firm.trailing_sales.shift();
        const recent = firm.trailing_sales.reduce((s, v) => s + v, 0) / firm.trailing_sales.length;
        firm.expected_demand = Math.max(0, recent * 0.70 + potentialSales * 0.30);

        const inventoryRatio = firm.capacity > 0 ? firm.inventory / firm.capacity : 0;
        let signal = 0;
        if (inventoryRatio > 0.8) signal -= MS.CONFIG.priceAdjustmentLimit;
        else if (inventoryRatio > 0.45) signal -= 0.015;
        if (firm.utilization > 0.88) signal += 0.02;
        const targetMarkupPrice = Math.max(0.05, (operatingCost / Math.max(1, firm.output)) * (1 + firm.target_markup));
        const targetSignal = (targetMarkupPrice - firm.price) / Math.max(0.05, firm.price);
        signal += Math.max(-0.015, Math.min(0.015, targetSignal));
        signal = Math.max(-MS.CONFIG.priceAdjustmentLimit, Math.min(MS.CONFIG.priceAdjustmentLimit, signal));
        firm.price = Math.max(0.05, firm.price * (1 + signal));
      });
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
