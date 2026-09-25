'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
['../src/config.js','../src/rng.js','../src/state.js','../src/map/mapModel.js','../src/sim/clock.js','../src/sim/population.js','../src/sim/labor.js','../src/sim/production.js','../src/sim/market.js','../src/sim/competition.js','../src/sim/investment.js','../src/sim/metrics.js','../src/sim/engine.js','../src/map/renderer.js'].forEach(p=>require(p));
const MS=globalThis.MarxSim,scenario=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/scenario.json'),'utf8'));
const state=MS.createGameState(scenario,4404); MS.runTicks(state,24); MS.updateSpatialEconomy(state);
assert.equal(state.districts.length,8,'Rotfeld must have eight districts');
assert.equal(state.map.parcels.length,64,'eight parcels per district expected');
for(const d of state.districts){assert.ok(Number.isFinite(d.residents)&&Number.isFinite(d.capital)&&Number.isFinite(d.housing_pressure));}
const model=MS.buildMapViewModel(state,'industry'); assert.equal(model.length,8); assert.ok(model.every(x=>x.normalized>=0&&x.normalized<=1));
const coal=state.districts.find(d=>d.id==='coal-hollow'), before=MS.scoreFirmLocation(state,coal,{sector:'goods'}); coal.access+=0.3; const after=MS.scoreFirmLocation(state,coal,{sector:'goods'}); assert.ok(after>before,'better access must improve location score');
const picked=MS.chooseFirmLocation(state,{sector:'goods'}); assert.ok(state.districts.some(d=>d.id===picked.id));
console.log(`Phase 4 OK: districts=${state.districts.length}, parcels=${state.map.parcels.length}, best goods site=${picked.name}`);
