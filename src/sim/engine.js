(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};

  MS.simulateTick = function simulateTick(state) {
    const rng = new MS.SeededRng(state.rngState);
    MS.updatePopulation(state, rng);
    MS.updateCostOfLiving(state);
    MS.updateLaborMarket(state);
    MS.runProduction(state);
    MS.clearGoodsMarket(state);
    MS.updateCompetition(state);
    MS.runCapitalCycle(state, rng);
    if (MS.updateSpatialEconomy) MS.updateSpatialEconomy(state);
    if (MS.updateHousingAndLand) MS.updateHousingAndLand(state, rng);
    if (MS.updatePolitics) MS.updatePolitics(state, rng);
    MS.advanceClock(state);
    MS.captureMetrics(state);
    state.rngState = rng.getState();
    return state;
  };

  MS.runTicks = function runTicks(state, count) {
    for (let i = 0; i < count; i += 1) MS.simulateTick(state);
    return state;
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
