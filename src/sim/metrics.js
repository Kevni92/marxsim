(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  MS.captureMetrics = function captureMetrics(state) {
    const active = state.firms.filter(f => f.active);
    const population = state.households.reduce((s, h) => s + h.population, 0);
    const employment = active.reduce((s, f) => s + f.employees, 0);
    const output = active.reduce((s, f) => s + f.output, 0);
    const sales = active.reduce((s, f) => s + f.sales, 0);
    const revenue = active.reduce((s, f) => s + f.revenue, 0);
    const profit = active.reduce((s, f) => s + f.profit, 0);
    const capital = active.reduce((s, f) => s + f.capital_stock, 0);
    const inventory = active.reduce((s, f) => s + f.inventory, 0);

    state.metrics.history.push({
      tick: state.tick,
      year: state.date.year,
      month: state.date.month,
      population,
      employment,
      unemploymentRate: state.economy.unemploymentRate,
      averageWage: state.economy.averageWage,
      costOfLiving: state.economy.costOfLiving,
      output,
      sales,
      revenue,
      profit,
      capital,
      inventory,
      investment: state.economy.investmentThisTick,
      activeFirms: active.length,
      bankruptcies: state.economy.bankruptciesThisTick,
      concentration: JSON.parse(JSON.stringify(state.economy.concentration))
    });
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
