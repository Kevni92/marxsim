'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

[
  '../src/config.js', '../src/rng.js', '../src/state.js',
  '../src/sim/clock.js', '../src/sim/population.js', '../src/sim/labor.js',
  '../src/sim/production.js', '../src/sim/market.js', '../src/sim/competition.js', '../src/sim/investment.js',
  '../src/sim/metrics.js', '../src/sim/engine.js'
].forEach(p => require(p));

const MS = globalThis.MarxSim;
const baseScenario = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/scenario.json'), 'utf8'));
const clone = x => JSON.parse(JSON.stringify(x));

function run({ demand = 1, participation = 1, ticks = 36 } = {}) {
  const scenario = clone(baseScenario);
  scenario.sectors.forEach(s => { s.external_demand_money *= demand; });
  scenario.households.forEach(h => { h.labor_participation *= participation; });
  const state = MS.createGameState(scenario, 4242);
  MS.runTicks(state, ticks);
  return state;
}

function totalInvestment(state) {
  return state.metrics.history.reduce((sum, m) => sum + m.investment, 0);
}

const lowDemand = run({ demand: 0.25 });
const normalDemand = run();
const highDemand = run({ demand: 2.5 });
const low = lowDemand.metrics.history.at(-1);
const normal = normalDemand.metrics.history.at(-1);
const high = highDemand.metrics.history.at(-1);

assert.ok(high.employment > normal.employment && normal.employment > low.employment, 'employment must respond to demand');
assert.ok(totalInvestment(highDemand) > totalInvestment(normalDemand), 'strong demand must induce more investment');
assert.ok(totalInvestment(normalDemand) > totalInvestment(lowDemand), 'weak demand must suppress investment');
assert.ok(low.inventory > high.inventory, 'weak demand must leave more unsold inventory');
assert.ok(low.profit < normal.profit, 'weak demand must reduce aggregate profit');

const scarceLabor = run({ participation: 0.20 });
const abundantLabor = run({ participation: 1.50 });
const scarce = scarceLabor.metrics.history.at(-1);
const abundant = abundantLabor.metrics.history.at(-1);
assert.ok(scarce.unemploymentRate < abundant.unemploymentRate, 'scarce labor must reduce unemployment');
assert.ok(scarce.averageWage > abundant.averageWage, 'scarce labor must push wage offers upward');

for (const state of [lowDemand, normalDemand, highDemand, scarceLabor, abundantLabor]) {
  for (const firm of state.firms.filter(f => f.active)) assert.ok(firm.price > 0 && Number.isFinite(firm.price));
}

console.log(`Phase 2 OK: employment ${low.employment.toFixed(0)} -> ${normal.employment.toFixed(0)} -> ${high.employment.toFixed(0)}, wage scarcity premium ${(scarce.averageWage / abundant.averageWage).toFixed(2)}x`);
