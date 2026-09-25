(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  MS.simulateTick = function simulateTick(state) {
    const rng = new MS.SeededRng(state.rngState);

    MS.updatePopulation(state, rng);                    // 1 population
    MS.updateCostOfLiving(state);                       // 2 living costs
    MS.updateLaborMarket(state);                        // 3-4 wages + matching
    MS.runProduction(state);                            // 5-6 production + inventory
    MS.clearGoodsMarket(state);                         // 7-9 demand, sales, prices, profit
    MS.updateCompetition(state);                        // market shares / concentration
    MS.runCapitalCycle(state, rng);                     // 10-11 insolvency + quarterly investment
    MS.advanceClock(state);
    MS.captureMetrics(state);                           // 16 metrics / causes

    state.rngState = rng.getState();
    return state;
  };

  MS.runTicks = function runTicks(state, count) {
    for (let i = 0; i < count; i += 1) MS.simulateTick(state);
    return state;
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
