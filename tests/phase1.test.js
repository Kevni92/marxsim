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
const scenario = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/scenario.json'), 'utf8'));

function run(seed) {
  const state = MS.createGameState(scenario, seed);
  MS.runTicks(state, 240);
  return state;
}

function projection(state) {
  return {
    tick: state.tick,
    date: state.date,
    rngState: state.rngState,
    firms: state.firms.map(f => ({ id: f.id, active: f.active, cash: f.cash, capital_stock: f.capital_stock, employees: f.employees, price: f.price, inventory: f.inventory })),
    households: state.households.map(h => ({ id: h.id, population: h.population, money: h.money })),
    metrics: state.metrics.history
  };
}

function assertFinite(value, trail = 'root') {
  if (typeof value === 'number') {
    assert.ok(Number.isFinite(value), `non-finite number at ${trail}`);
    return;
  }
  if (Array.isArray(value)) return value.forEach((v, i) => assertFinite(v, `${trail}[${i}]`));
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) assertFinite(v, `${trail}.${k}`);
  }
}

const a = run(1337);
const b = run(1337);
assert.deepEqual(projection(a), projection(b), 'same seed must be bit-for-bit deterministic');
assert.equal(a.tick, 240);
assert.equal(a.metrics.history.length, 240);
assertFinite(a);

for (const h of a.households) {
  assert.ok(h.population >= 0 && h.money >= 0 && h.workers_available >= 0 && h.workers_employed >= 0);
}
for (const f of a.firms) {
  assert.ok(f.cash >= 0 && f.capital_stock >= 0 && f.inventory >= 0 && f.employees >= 0 && f.capacity >= 0);
}

const initialCapital = new Map(scenario.firms.map(f => [f.id, f.capital_stock]));
assert.ok(a.firms.some(f => initialCapital.has(f.id) && f.capital_stock > initialCapital.get(f.id)), 'at least one firm should accumulate capital');
assert.ok(a.firms.some(f => !f.active), 'at least one fragile firm should be able to close');
assert.ok(a.metrics.history.some(m => m.output > 0 && m.sales > 0 && m.employment > 0), 'economy must produce, employ and sell');
assert.ok(a.metrics.history.some(m => m.investment > 0), 'investment cycle must occur');

console.log(`Phase 1 OK: ${a.date.year}-${String(a.date.month).padStart(2, '0')}, active firms=${a.firms.filter(f => f.active).length}, capital=${a.metrics.history.at(-1).capital.toFixed(2)}`);
