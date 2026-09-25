(function(root){'use strict';const MS=root.MarxSim=root.MarxSim||{};
MS.getLatestCauseTick=function(state){return (state.causalLog||[]).reduce((m,c)=>Math.max(m,c.tick||0),0);};
MS.getMetricCauses=function(state,metric,tick,limit){const targetTick=tick==null?MS.getLatestCauseTick(state):tick,all=(state.causalLog||[]),byId=new Map(all.map(c=>[c.id,c]));return all.filter(c=>c.tick===targetTick&&(!metric||c.metric===metric)).sort((a,b)=>Math.abs(b.delta||0)-Math.abs(a.delta||0)).slice(0,limit||6).map(c=>{const chain=[];let p=c.parentCause,guard=0;while(p&&byId.has(p)&&guard++<8){const parent=byId.get(p);chain.push(parent);p=parent.parentCause;}return Object.assign({},c,{chain});});};
MS.getTopCauses=function(state,limit){const tick=MS.getLatestCauseTick(state);return MS.getMetricCauses(state,null,tick,limit||8).filter(c=>c.metric!=='structure'||c.eventType);};
MS.formatCause=function(c){if(!c)return 'Keine Ursache erfasst';const d=Number(c.delta||0),signed=d>0?'+':'';return `${c.reason}${Math.abs(d)>1e-9?` · ${signed}${d.toFixed(Math.abs(d)<1?3:1)}`:''}`;};
})(typeof globalThis!=='undefined'?globalThis:window);
