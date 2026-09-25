(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  MS.updatePopulation = function updatePopulation(state, rng) {
    for (const h of state.households) {
      const drift = h.monthly_growth || 0;
      const variation = rng.range(-0.00015, 0.00015);
      h.population = Math.max(1, h.population * (1 + drift + variation));
      h.workers_available = Math.max(0, h.population * (h.labor_participation || 0));
      h.workers_employed = 0;
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
