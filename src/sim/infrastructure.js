(function(root){'use strict';const MS=root.MarxSim=root.MarxSim||{};
  const COSTS={road:1000,rail:3000,publicHousing:1800,sanitation:1200};
  MS.INFRASTRUCTURE_COSTS=Object.freeze(COSTS);
  MS.buildInfrastructure=function buildInfrastructure(state,districtId,type){
    const d=state.districts.find(x=>x.id===districtId); if(!d) return {ok:false,reason:'district'};
    const cost=COSTS[type]; if(!cost) return {ok:false,reason:'type'}; if(state.publicFinance.cash<cost) return {ok:false,reason:'funds'};
    state.publicFinance.cash-=cost; state.publicFinance.expenses+=cost;
    if(type==='road'){d.road_level=(d.road_level||0)+1;d.access=Math.min(1.35,d.access+0.08);}
    if(type==='rail'){d.rail_level=(d.rail_level||0)+1;d.access=Math.min(1.45,d.access+0.18);d.industry_bonus=(d.industry_bonus||0)+0.12;}
    if(type==='publicHousing'){d.housing_capacity+=140;d.service_level=(d.service_level||0)+0.05;}
    if(type==='sanitation'){d.service_level=(d.service_level||0)+0.16;d.pollution=Math.max(0,d.pollution-0.18);}
    state.events.push({tick:state.tick,type:'infrastructure_built',districtId,type,cost});
    state.causalLog.push({tick:state.tick,metric:type==='publicHousing'?'housing_capacity':'access',delta:type==='rail'?0.18:(type==='road'?0.08:0),sourceType:'public',sourceId:districtId,reason:`infrastructure:${type}`});
    if(MS.updateSpatialEconomy) MS.updateSpatialEconomy(state); return {ok:true,cost,district:d};
  };
})(typeof globalThis!=='undefined'?globalThis:window);
