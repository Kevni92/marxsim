'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

[
  '../src/config.js', '../src/rng.js', '../src/state.js',
  '../src/sim/clock.js', '../src/sim/population.js', '../src/sim/labor.js',
  '../src/sim/production.js', '../src/sim/market.js', '../src/sim/competition.js',
  '../src/sim/investment.js', '../src/sim/metrics.js', '../src/sim/engine.js'
].forEach(p => require(p));

const MS = globalThis.MarxSim;
const base = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/scenario.json'), 'utf8'));
const clone = x => JSON.parse(JSON.stringify(x));

const duel = clone(base);
duel.rules = { allowNewFirms: false, allowAcquisitions: false };
duel.sectors = duel.sectors.filter(s => s.id === 'textiles');
duel.sectors[0].external_demand_money = 520;
const source = base.firms.find(f => f.id === 'textile-a');
const a = Object.assign(clone(source), { id: 'duel-a', name: 'Duel A', technology: 1.18, cash: 1800, capital_stock: 180, reference_capital: 180, capacity: 110, max_jobs: 80, price: 5.4 });
const b = Object.assign(clone(source), { id: 'duel-b', name: 'Duel B', technology: 1.00, cash: 1800, capital_stock: 180, reference_capital: 180, capacity: 110, max_jobs: 80, price: 5.4 });
duel.firms = [a, b];

const duelState = MS.createGameState(duel, 991);
MS.runTicks(duelState, 120);
const winner = duelState.firms.find(f => f.id === 'duel-a');
const follower = duelState.firms.find(f => f.id === 'duel-b');
assert.ok(winner.capital_stock > follower.capital_stock, 'productivity advantage should compound into more capital');
assert.ok(winner.market_share > follower.market_share, 'productivity advantage should create a larger market share');

const longRun = MS.createGameState(clone(base), 7711);
MS.runTicks(longRun, 480);
for (const metric of longRun.metrics.history.filter((_, i) => i % 60 === 0)) {
  for (const sector of Object.values(metric.concentration)) {
    assert.ok(sector.hhi >= 0 && sector.hhi <= 1 + 1e-9);
    assert.ok(sector.top1 >= 0 && sector.top1 <= 1 + 1e-9);
    assert.ok(sector.top3 >= sector.top1 && sector.top3 <= 1 + 1e-9);
  }
}
assert.ok(longRun.events.some(e => ['rationalization', 'acquisition', 'firm_founded'].includes(e.type)), 'competition must generate structural events');
const hhiSeries = longRun.metrics.history.map(m => m.concentration.textiles && m.concentration.textiles.hhi).filter(Number.isFinite);
assert.ok(Math.max(...hhiSeries) - Math.min(...hhiSeries) > 0.02, 'concentration must be endogenous rather than fixed');

console.log(`Phase 3 OK: duel share ${(winner.market_share * 100).toFixed(1)}% vs ${(follower.market_share * 100).toFixed(1)}%, structural events=${longRun.events.length}`);
