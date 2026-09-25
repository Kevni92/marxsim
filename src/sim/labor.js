(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function commuteFactor(state, homeDistrictId, workDistrictId) {
    if (homeDistrictId === workDistrictId) return 1;
    const home = state.districts.find(d => d.id === homeDistrictId);
    const work = state.districts.find(d => d.id === workDistrictId);
    const access = Math.min(home ? home.access : 0.5, work ? work.access : 0.5);
    return 0.55 + access * 0.35;
  }

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

    const remaining = new Map();
    for (const h of state.households) {
      h.workers_employed = 0;
      remaining.set(h.id, h.workers_available);
    }

    active.sort((a, b) => (b.wage_offer * b.job_security) - (a.wage_offer * a.job_security));
    for (const firm of active) {
      let vacancies = firm.desired_employees;
      const candidates = state.households
        .map(h => ({ h, commute: commuteFactor(state, h.district, firm.district) }))
        .sort((a, b) => b.commute - a.commute);

      for (const candidate of candidates) {
        if (vacancies <= 0) break;
        const available = remaining.get(candidate.h.id) || 0;
        if (available <= 0) continue;
        const accessible = available * candidate.commute;
        const hires = Math.min(vacancies, accessible);
        firm.employees += hires;
        candidate.h.workers_employed += hires;
        remaining.set(candidate.h.id, Math.max(0, available - hires));
        vacancies -= hires;
      }
    }

    const employed = active.reduce((sum, f) => sum + f.employees, 0);
    const unemployed = Math.max(0, laborSupply - employed);
    state.economy.unemploymentRate = laborSupply > 0 ? clamp(unemployed / laborSupply, 0, 1) : 0;
    const wageBill = active.reduce((sum, f) => sum + f.employees * f.wage_offer, 0);
    state.economy.averageWage = employed > 0 ? wageBill / employed : 0;
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
