(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  const clone = (value) => JSON.parse(JSON.stringify(value));

  MS.createGameState = function createGameState(scenario, seed) {
    const data = clone(scenario);
    return {
      version: MS.CONFIG.version,
      scenarioId: data.id,
      seed: Number(seed) >>> 0,
      rngState: Number(seed) >>> 0,
      tick: 0,
      date: { year: data.startYear || MS.CONFIG.startYear, month: data.startMonth || MS.CONFIG.startMonth },
      districts: data.districts,
      sectors: data.sectors,
      households: data.households.map(h => Object.assign({
        workers_available: 0,
        workers_employed: 0,
        money: 0,
        wage_income: 0,
        capital_income: 0,
        benefits: 0,
        rent: 0,
        food_spend: 0,
        discretionary_spend: 0
      }, h)),
      firms: data.firms.map(f => Object.assign({
        active: true,
        employees: 0,
        desired_employees: 0,
        inventory: 0,
        output: 0,
        sales: 0,
        revenue: 0,
        profit: 0,
        expected_demand: f.capacity * 0.72,
        utilization: 0,
        insolvency_months: 0,
        age: 0,
        trailing_sales: []
      }, f)),
      economy: {
        costOfLiving: 1,
        unemploymentRate: 0.12,
        averageWage: 0,
        pendingCapitalIncome: 0,
        investmentThisTick: 0,
        bankruptciesThisTick: 0
      },
      publicFinance: {
        cash: 20000,
        taxRevenue: 0,
        expenses: 0
      },
      policies: {
        minimumWage: 0,
        corporateTaxRate: MS.CONFIG.corporateTaxRate
      },
      metrics: { history: [] },
      events: [],
      causalLog: []
    };
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
