(function(root){'use strict';const MS=root.MarxSim=root.MarxSim||{};
function finite(value,seen){if(typeof value==='number')return Number.isFinite(value);if(!value||typeof value!=='object')return true;seen=seen||new Set();if(seen.has(value))return true;seen.add(value);if(Array.isArray(value))return value.every(v=>finite(v,seen));return Object.entries(value).filter(([k])=>!k.startsWith('_')).every(([,v])=>finite(v,seen));}
function coupledSectors(scenario){const sectors=scenario.sectors||[],ids=new Set(sectors.map(s=>s.id));if(sectors.length<5)return false;return sectors.every(s=>{const req=s.input_requirements||{};return Object.keys(req).length>0&&Object.keys(req).every(id=>ids.has(id)&&id!==s.id);});}
function anyConcentration(state){return Object.values(state.economy.concentration||{}).some(c=>(c.hhi||0)>.30||(c.top1||0)>.55);}
function crisis(state){return (state.events||[]).some(e=>e.type==='bankruptcy')||(state.metrics.history||[]).some(m=>(m.profit||0)<0&&(m.inventory||0)>(m.sales||0));}
function endogenous(state){const h=state.metrics.history||[];if(h.length<12)return false;const wages=h.map(x=>x.averageWage||0),spread=Math.max(...wages)-Math.min(...wages),prices=state.firms.filter(f=>f.active).map(f=>f.price);return spread>1e-4&&prices.length>1&&prices.every(Number.isFinite)&&Math.max(...prices)-Math.min(...prices)>1e-3;}
function theoryLinked(state){if(typeof MS.getTheoryCards!=='function')return false;const cards=MS.getTheoryCards(state);return cards.length>=8&&cards.every(c=>c.evidence&&c.evidence.targetType&&c.evidence.targetId&&c.evidence.detail);}
function saveExportable(state){if(typeof MS.serializeState!=='function'||typeof MS.deserializeState!=='function')return false;try{const copy=MS.deserializeState(MS.serializeState(state,false));return copy.tick===state.tick&&copy.rngState===state.rngState;}catch(e){return false;}}
MS.evaluateReleaseCriteria=function(state,scenario,evidence){const e=evidence||{},policies=MS.REFORMS?Object.keys(MS.REFORMS).length:0,events=state.events||[],criteria=[
{id:1,label:'Komplette Partie ohne Fehler',pass:state.tick>=240&&finite(state)},
{id:2,label:'Mindestens fünf gekoppelte Branchen',pass:coupledSectors(scenario)},
{id:3,label:'Mindestens sechs politische Instrumente',pass:policies>=6},
{id:4,label:'Räumliche Entwicklung sichtbar',pass:state.districts.length>=6&&state.map&&Array.isArray(state.map.parcels)&&state.map.parcels.length>=48},
{id:5,label:'Firmen agieren autonom',pass:state.firms.every(f=>'expected_demand'in f&&'desired_employees'in f)&&typeof MS.runCapitalCycle==='function'},
{id:6,label:'Löhne und Preise reagieren endogen',pass:endogenous(state)},
{id:7,label:'Rationalisierung wirkt auf Arbeit',pass:events.some(x=>x.type==='rationalization')||!!e.rationalization},
{id:8,label:'Krise kann emergent entstehen',pass:crisis(state)||!!e.crisis},
{id:9,label:'Konzentration kann emergent entstehen',pass:anyConcentration(state)||!!e.concentration},
{id:10,label:'Streiks können emergent entstehen',pass:events.some(x=>x.type==='strike_started')||!!e.strike},
{id:11,label:'Kausalinspektor erklärt Kennzahlen',pass:(state.causalLog||[]).some(c=>c.metric!=='structure'&&c.reason)},
{id:12,label:'Theorie-Karten mit Spieldaten verknüpft',pass:theoryLinked(state)},
{id:13,label:'Spielstand exportierbar',pass:saveExportable(state)},
{id:14,label:'Identischer Seed reproduzierbar',pass:!!e.deterministic},
{id:15,label:'GitHub-Pages-Deployment grün',pass:!!e.pagesDeployment}
];return {version:'1.0.0',passed:criteria.every(c=>c.pass),passedCount:criteria.filter(c=>c.pass).length,total:criteria.length,criteria};};
MS.coupledSectorCriteria=coupledSectors;
})(typeof globalThis!=='undefined'?globalThis:window);
