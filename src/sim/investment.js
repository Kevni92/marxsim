(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  MS.runCapitalCycle = function runCapitalCycle(state, rng) {
    state.economy.investmentThisTick = 0;
    state.economy.bankruptciesThisTick = 0;

    for (const firm of state.firms) {
      if (!firm.active) continue;

      if (firm.insolvency_months >= MS.CONFIG.insolvencyGraceMonths) {
        firm.active = false;
        firm.employees = 0;
        firm.desired_employees = 0;
        firm.output = 0;
        state.economy.bankruptciesThisTick += 1;
        state.events.push({ tick: state.tick, type: 'bankruptcy', firmId: firm.id });
        continue;
      }

      if (state.tick % 3 !== 0) continue;
      const demandConfidence = firm.expected_demand / Math.max(1, firm.capacity);
      const canInvest = firm.cash > 850 && firm.profit > 0 && demandConfidence > 0.18;
      if (!canInvest) continue;

      const caution = rng.range(0.85, 1.10);
      const investment = Math.min(firm.cash * MS.CONFIG.investmentShareOfCash * caution, firm.cash - 500);
      if (investment <= 0) continue;
      firm.cash -= investment;
      firm.capital_stock += investment * 0.55;
      firm.capacity += investment * 0.045;
      firm.max_jobs += investment * 0.004;
      state.economy.investmentThisTick += investment;
      state.causalLog.push({ tick: state.tick, metric: 'capital_stock', delta: investment * 0.55, sourceType: 'firm', sourceId: firm.id, reason: 'expansion' });
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
