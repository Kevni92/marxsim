(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  MS.MAP_GEOMETRY = Object.freeze({
    viewBox: '0 0 1000 650',
    river: 'M -20 118 C 170 150 240 270 400 250 C 560 228 650 130 1020 178',
    rail: 'M 20 565 L 960 88',
    roads: ['M 80 310 L 920 310','M 420 40 L 455 610','M 165 85 L 835 565'],
    districts: [
      { id:'north-fields', name:'Nordfelder', points:'55,55 335,45 360,180 84,208', label:[185,120] },
      { id:'hill-quarter', name:'Höhenviertel', points:'360,55 610,40 620,190 365,180', label:[485,115] },
      { id:'coal-hollow', name:'Kohlensenke', points:'620,42 930,62 908,214 622,190', label:[770,125] },
      { id:'riverside', name:'Flussviertel', points:'80,212 365,184 390,330 95,350', label:[220,268] },
      { id:'old-market', name:'Alter Markt', points:'390,195 615,194 632,345 392,330', label:[505,265] },
      { id:'rail-yard', name:'Bahnhofswerk', points:'635,215 908,215 885,365 635,345', label:[760,285] },
      { id:'foundry', name:'Gießereiviertel', points:'92,355 390,335 405,602 70,590', label:[230,470] },
      { id:'south-gardens', name:'Südgärten', points:'410,350 885,370 920,595 410,605', label:[660,485] }
    ]
  });

  function defaults(d) {
    return Object.assign({
      access:0.5, land_cost:0.7, housing_capacity:400, base_rent:0.14, rent:0.14,
      land_value:1, pollution:0.05, road_level:0, rail_level:0, service_level:0,
      resource_bonus:0, industry_bonus:0, tax_rate:0, residents:0, labor_supply:0,
      jobs:0, employment:0, capital:0, housing_pressure:0, vacancy:1, industry_intensity:0
    }, d);
  }

  MS.initializeSpatialState = function initializeSpatialState(state) {
    state.districts = state.districts.map(defaults);
    state.map = state.map || { initialized:false, parcels:[], selectedLayer:'industry', selectedDistrict:null };
    if (!state.map.initialized) {
      state.map.parcels = [];
      for (const district of state.districts) {
        for (let i=0;i<8;i+=1) {
          state.map.parcels.push({
            id:`${district.id}-p${i+1}`,
            district:district.id,
            use:i < 3 ? 'housing' : (i < 6 ? 'mixed' : 'industry'),
            occupied:false,
            landValue:district.land_value
          });
        }
      }
      state.map.initialized = true;
    }
    return state;
  };

  MS.updateSpatialEconomy = function updateSpatialEconomy(state) {
    MS.initializeSpatialState(state);
    for (const d of state.districts) {
      const households = state.households.filter(h => h.district === d.id);
      const firms = state.firms.filter(f => f.active && f.district === d.id);
      d.residents = households.reduce((s,h)=>s+h.population,0);
      d.labor_supply = households.reduce((s,h)=>s+h.workers_available,0);
      d.employment = households.reduce((s,h)=>s+h.workers_employed,0);
      d.jobs = firms.reduce((s,f)=>s+f.employees,0);
      d.capital = firms.reduce((s,f)=>s+f.capital_stock,0);
      d.industry_intensity = firms.reduce((s,f)=>s+f.output,0) / Math.max(1,d.housing_capacity*0.2);
      d.housing_pressure = d.residents / Math.max(1,d.housing_capacity);
      d.vacancy = clamp(1-d.housing_pressure,0,1);
      const industrialLoad = firms.reduce((s,f)=>s+f.output,0) / 900;
      d.pollution = clamp(d.pollution*0.94 + industrialLoad*0.06,0,1);
      for (const p of state.map.parcels.filter(p=>p.district===d.id)) p.landValue = d.land_value;
    }
    return state;
  };

  MS.scoreFirmLocation = function scoreFirmLocation(state, district, spec) {
    const firms = state.firms.filter(f=>f.active && f.district===district.id);
    const labor = district.labor_supply || state.households.filter(h=>h.district===district.id).reduce((s,h)=>s+h.workers_available,0);
    const laborScore = clamp(labor/220,0,1.4);
    const congestion = clamp(firms.length/5,0,1);
    const resource = (spec && spec.sector === 'goods') ? (district.resource_bonus||0)*0.35 : 0;
    const industryFit = (district.industry_bonus||0)*0.22;
    return district.access*1.35 + laborScore*0.75 + resource + industryFit - district.land_cost*0.55 - (district.tax_rate||0)*1.5 - congestion*0.22;
  };

  MS.chooseFirmLocation = function chooseFirmLocation(state, spec) {
    MS.updateSpatialEconomy(state);
    return state.districts.slice().sort((a,b)=>MS.scoreFirmLocation(state,b,spec)-MS.scoreFirmLocation(state,a,spec))[0];
  };

  MS.buildSpatialSnapshot = function buildSpatialSnapshot(state) {
    MS.updateSpatialEconomy(state);
    return state.districts.map(d=>({
      id:d.id,name:d.name,access:d.access,residents:d.residents,labor:d.labor_supply,jobs:d.jobs,
      capital:d.capital,rent:d.rent,landValue:d.land_value,pollution:d.pollution,
      housingPressure:d.housing_pressure,industry:d.industry_intensity
    }));
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
