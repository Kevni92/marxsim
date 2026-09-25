(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  MS.updateLaborMarket = function updateLaborMarket(state) {
    const active = state.firms.filter(f => f.active);
    const laborSupply = state.households.reduce((sum, h) => sum + h.workers_available, 0);
    const previousUnemployment = state.economy.unemploymentRate;
    const basket = state.economy.costOfLiving;

    for (const firm of active) {
      const laborProductivity = Math.max(0.5, firm.labor_productivity * firm.technology);
      const demandSignal = Math.max(firm.expected_demand, firm.capacity * 0.45);
      firm.desired_employees = clamp(Math.ceil(demandSignal / laborProductivity), 1, firm.max_jobs);

      let marketFactor = 1;
      if (previousUnemployment > 0.15) marketFactor -= 0.07;
      else if (previousUnemployment < 0.04) marketFactor += 0.08;
      else if (previousUnemployment < 0.08) marketFactor += 0.03;

      const profitFactor = firm.profit > 150 ? 1.02 : (firm.profit < 0 ? 0.98 : 1);
      const target = Math.max(state.policies.minimumWage, basket * 0.24 * firm.wage_multiplier * marketFactor * profitFactor);
      firm.wage_offer += (target - firm.wage_offer) * MS.CONFIG.wageAdjustment;
      firm.wage_offer = Math.max(0.1, firm.wage_offer);
      firm.employees = 0;
    }

    let remaining = laborSupply;
    active.sort((a, b) => (b.wage_offer * b.job_security) - (a.wage_offer * a.job_security));
    for (const firm of active) {
      const hires = Math.min(firm.desired_employees, remaining);
      firm.employees = Math.max(0, hires);
      remaining -= hires;
    }

    const employed = laborSupply - remaining;
    const ratio = laborSupply > 0 ? employed / laborSupply : 0;
    for (const h of state.households) {
      h.workers_employed = h.workers_available * ratio;
    }

    state.economy.unemploymentRate = laborSupply > 0 ? clamp(remaining / laborSupply, 0, 1) : 0;
    const wageBill = active.reduce((sum, f) => sum + f.employees * f.wage_offer, 0);
    state.economy.averageWage = employed > 0 ? wageBill / employed : 0;
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
