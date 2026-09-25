(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  MS.runProduction = function runProduction(state) {
    for (const firm of state.firms) {
      if (!firm.active) {
        firm.output = 0;
        continue;
      }
      const capitalFactor = Math.pow(Math.max(0.05, firm.capital_stock / firm.reference_capital), 1 - MS.CONFIG.alpha);
      const laborFactor = Math.pow(Math.max(0, firm.employees), MS.CONFIG.alpha);
      const potential = firm.base_productivity * 0.10 * firm.technology * laborFactor * capitalFactor;
      firm.output = Math.max(0, Math.min(firm.capacity, potential));
      firm.inventory = Math.max(0, firm.inventory + firm.output);
      firm.age += 1;
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
