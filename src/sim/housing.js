(function(root){'use strict';const MS=root.MarxSim=root.MarxSim||{};const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function scoreHousing(d){return d.access*0.95+(d.service_level||0)*0.50-d.rent*1.8-d.pollution*0.55-clamp(d.housing_pressure-1,0,2)*0.65;}
  function migrate(state){
    if(state.tick===0||state.tick%12!==0||state.households.length>24) return;
    const candidates=state.households.filter(h=>h.class==='workers'&&h.population>80);
    for(const h of candidates){
      const home=state.districts.find(d=>d.id===h.district); if(!home) continue;
      const best=state.districts.slice().sort((a,b)=>scoreHousing(b)-scoreHousing(a))[0];
      if(!best||best.id===home.id||scoreHousing(best)-scoreHousing(home)<0.24||best.housing_pressure>1.12) continue;
      const moved=h.population*0.025; h.population-=moved;
      let target=state.households.find(x=>x.class===h.class&&x.district===best.id&&x.migration_group);
      if(!target){target=Object.assign({},h,{id:`${h.id}-m${state.tick}-${best.id}`,district:best.id,population:0,money:0,wage_income:0,capital_income:0,benefits:0,rent:0,food_spend:0,discretionary_spend:0,workers_available:0,workers_employed:0,migration_group:true});state.households.push(target);}
      target.population+=moved; state.events.push({tick:state.tick,type:'household_migration',from:home.id,to:best.id,population:moved});
    }
  }
  MS.updateHousingAndLand=function updateHousingAndLand(state,rng){
    if(MS.updateSpatialEconomy) MS.updateSpatialEconomy(state);
    for(const d of state.districts){
      const pressure=d.residents/Math.max(1,d.housing_capacity); d.housing_pressure=pressure;
      const rentTarget=d.base_rent*clamp(0.70+pressure*0.72+d.access*0.18+(d.service_level||0)*0.10,0.62,2.6);
      d.rent=Math.max(0.02,d.rent+(rentTarget-d.rent)*0.08);
      const landTarget=Math.max(0.15,0.28+d.access*0.72+d.rent*1.35+clamp(pressure-0.65,0,1.5)*0.38-d.pollution*0.32);
      d.land_value+= (landTarget-d.land_value)*0.06; d.land_cost=Math.max(0.18,d.land_value*0.72);
      d.housing_investment=0;
      if(state.tick%3===0&&pressure>0.90&&d.rent>d.base_rent*0.98){
        const build=Math.min(18,2+(pressure-0.85)*22); d.housing_capacity+=build; d.housing_investment=build; state.events.push({tick:state.tick,type:'housing_construction',districtId:d.id,capacity:build});
      }
    }
    for(const h of state.households){const d=state.districts.find(x=>x.id===h.district);if(d)h.rent_per_capita=d.rent;}
    migrate(state); if(MS.updateSpatialEconomy) MS.updateSpatialEconomy(state); return state;
  };
})(typeof globalThis!=='undefined'?globalThis:window);
