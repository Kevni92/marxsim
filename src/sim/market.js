(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {}, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  function weightedAveragePrice(state, sectorId) {
    const firms = state.firms.filter(f => f.active && f.sector === sectorId);
    if (!firms.length) return 1;
    const sales=firms.reduce((s,f)=>s+f.sales,0);
    return sales>0?firms.reduce((s,f)=>s+f.price*f.sales,0)/sales:firms.reduce((sum, f) => sum + f.price, 0) / firms.length;
  }

  MS.updateCostOfLiving = function updateCostOfLiving(state) {
    const explicit=state.sectors.filter(s=>(s.living_cost_weight||0)>0);
    if(explicit.length){const weight=explicit.reduce((s,x)=>s+x.living_cost_weight,0)||1;state.economy.costOfLiving=Math.max(.1,explicit.reduce((s,x)=>s+weightedAveragePrice(state,x.id)*x.living_cost_weight,0)/weight);return;}
    const food = weightedAveragePrice(state, 'food'), textiles = weightedAveragePrice(state, 'textiles'), goods = weightedAveragePrice(state, 'goods');
    state.economy.costOfLiving = Math.max(0.1, food * 0.58 + textiles * 0.24 + goods * 0.18);
  };

  function bookHouseholdIncome(state) {
    const avgWage = state.economy.averageWage, totalPositiveProfit = state.firms.reduce((s, f) => s + Math.max(0, f.profit), 0), capitalPool = state.economy.pendingCapitalIncome + totalPositiveProfit * 0.05, capitalistWeight = state.households.reduce((s, h) => s + (h.capital_income_weight || 0), 0) || 1;
    for (const h of state.households) {
      h.wage_income = h.workers_employed * avgWage; h.capital_income = capitalPool * ((h.capital_income_weight || 0) / capitalistWeight);
      const unemployed = Math.max(0, h.workers_available - h.workers_employed); h.benefits = unemployed * state.economy.costOfLiving * (h.benefit_rate || 0); h.rent = h.population * h.rent_per_capita;
      const gross = h.wage_income + h.capital_income + h.benefits, disposable = Math.max(0, gross - h.rent), spend = disposable * h.consumption_propensity;
      h.food_spend = spend * 0.50; h.discretionary_spend = spend - h.food_spend; h.money = Math.max(0, h.money + gross - h.rent - spend);
    }
  }

  function demandMoneyBySector(state) {
    const result={};state.sectors.forEach(s=>{result[s.id]=s.external_demand_money||0;});
    const hasExplicit=state.sectors.some(s=>(s.household_basic_share||0)>0||(s.household_discretionary_share||0)>0);
    for(const h of state.households){if(hasExplicit){for(const s of state.sectors){result[s.id]+=h.food_spend*(s.household_basic_share||0)+h.discretionary_spend*(s.household_discretionary_share||0);}}else{result.food=(result.food||0)+h.food_spend;result.textiles=(result.textiles||0)+h.discretionary_spend*.60;result.goods=(result.goods||0)+h.discretionary_spend*.40;}}
    for(const firm of state.firms.filter(f=>f.active)){const sector=state.sectors.find(s=>s.id===firm.sector),req=sector&&sector.input_requirements||{},budget=Math.max(0,firm.output*(firm.input_cost_per_unit||0));for(const [supplier,share] of Object.entries(req)){if(result[supplier]==null)result[supplier]=0;result[supplier]+=budget*Math.max(0,Number(share)||0);}}
    return result;
  }
  MS.demandMoneyBySector=demandMoneyBySector;

  MS.clearGoodsMarket = function clearGoodsMarket(state) {
    bookHouseholdIncome(state); const demandMoney = demandMoneyBySector(state); state.economy.sectorDemandMoney=Object.assign({},demandMoney); state.publicFinance.taxRevenue = 0; state.economy.pendingCapitalIncome = 0; state.economy.inputAvailability=state.economy.inputAvailability||{};
    for (const sector of state.sectors) {
      const firms = state.firms.filter(f => f.active && f.sector === sector.id);
      if (!firms.length){state.economy.inputAvailability[sector.id]=.55;continue;}
      const avgPrice = firms.reduce((s, f) => s + f.price, 0) / firms.length, totalDemandUnits = avgPrice > 0 ? (demandMoney[sector.id]||0) / avgPrice : 0, weights = firms.map(f => Math.pow(avgPrice / Math.max(0.05, f.price), 2) * (0.3 + Math.min(1, f.inventory / Math.max(1, f.capacity)))), totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
      firms.forEach((firm, index) => {
        const potentialSales = totalDemandUnits * weights[index] / totalWeight; firm.sales = Math.max(0, Math.min(firm.inventory, potentialSales)); firm.inventory = Math.max(0, firm.inventory - firm.sales); firm.revenue = firm.sales * firm.price;
        const wages = firm.employees * firm.wage_offer, inputs = firm.output * firm.input_cost_per_unit, depreciation = firm.capital_stock * MS.CONFIG.depreciationRateMonthly, operatingCost = wages + inputs + depreciation + firm.fixed_cost * 0.35, pretax = firm.revenue - operatingCost, tax = Math.max(0, pretax) * state.policies.corporateTaxRate;
        firm.profit = pretax - tax; state.publicFinance.taxRevenue += tax; state.publicFinance.cash += tax; const rawCash = firm.cash + firm.profit; firm.cash = Math.max(0, rawCash); if (rawCash <= 0 && firm.profit < 0) firm.insolvency_months += 1; else if (firm.profit > 0) firm.insolvency_months = Math.max(0, firm.insolvency_months - 1);
        firm.utilization = firm.capacity > 0 ? Math.min(1.5, firm.sales / firm.capacity) : 0; firm.trailing_sales.push(firm.sales); if (firm.trailing_sales.length > 12) firm.trailing_sales.shift(); const recent = firm.trailing_sales.reduce((s, v) => s + v, 0) / firm.trailing_sales.length; firm.expected_demand = Math.max(0, recent * 0.70 + potentialSales * 0.30);
        const inventoryRatio = firm.capacity > 0 ? firm.inventory / firm.capacity : 0; let signal = 0; if (inventoryRatio > 0.8) signal -= MS.CONFIG.priceAdjustmentLimit; else if (inventoryRatio > 0.45) signal -= 0.015; if (firm.utilization > 0.88) signal += 0.02; const targetMarkupPrice = Math.max(0.05, (operatingCost / Math.max(1, firm.output)) * (1 + firm.target_markup)), targetSignal = (targetMarkupPrice - firm.price) / Math.max(0.05, firm.price); signal += Math.max(-0.015, Math.min(0.015, targetSignal)); signal = Math.max(-MS.CONFIG.priceAdjustmentLimit, Math.min(MS.CONFIG.priceAdjustmentLimit, signal)); firm.price = Math.max(0.05, firm.price * (1 + signal));
      });
      const sold=firms.reduce((s,f)=>s+f.sales,0);state.economy.inputAvailability[sector.id]=totalDemandUnits>0?clamp(sold/totalDemandUnits,.55,1.05):1;
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
