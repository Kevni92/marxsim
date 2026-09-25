(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  MS.buildMapViewModel = function buildMapViewModel(state, layer) {
    const snapshot = MS.buildSpatialSnapshot(state);
    const key = layer || 'industry';
    const raw = snapshot.map(d => {
      if (key==='labor') return d.labor > 0 ? Math.max(0,1-d.jobs/d.labor) : 0;
      if (key==='capital') return d.capital;
      if (key==='housing') return d.housingPressure;
      if (key==='environment') return d.pollution;
      return d.industry;
    });
    const min=Math.min(...raw), max=Math.max(...raw), span=Math.max(0.0001,max-min);
    return snapshot.map((d,i)=>Object.assign({},d,{layer:key,value:raw[i],normalized:clamp((raw[i]-min)/span,0,1)}));
  };

  MS.getLayerLegend=function(layer){return ({industry:['Industriebesatz','gering','hoch'],labor:['Arbeitslosigkeit','niedrig','hoch'],capital:['Kapitalstock','gering','hoch'],housing:['Wohnungsdruck','entspannt','angespannt'],environment:['Belastung','gering','hoch']})[layer]||['Intensität','gering','hoch'];};

  function fillFor(item) {
    const n=item.normalized;
    if (item.layer==='labor') return `rgba(118,53,42,${0.16+n*0.58})`;
    if (item.layer==='capital') return `rgba(91,78,38,${0.16+n*0.62})`;
    if (item.layer==='housing') return `rgba(142,96,54,${0.14+n*0.58})`;
    if (item.layer==='environment') return `rgba(72,84,58,${0.13+n*0.60})`;
    return `rgba(57,63,66,${0.12+n*0.68})`;
  }

  function firmPosition(geometry,f,i){const g=geometry.districts.find(x=>x.id===f.district);if(!g)return null;const angle=(i%5)*1.18,radius=18+(i%3)*9;return {x:g.label[0]+Math.cos(angle)*radius,y:g.label[1]+28+Math.sin(angle)*radius,g};}

  MS.renderRotfeldMap = function renderRotfeldMap(svg,state,layer) {
    if (!svg) return;
    const model=MS.buildMapViewModel(state,layer),byId=new Map(model.map(x=>[x.id,x])),geometry=MS.MAP_GEOMETRY;
    const districts=geometry.districts.map(g=>{const m=byId.get(g.id),selected=state.map&&state.map.selectedDistrict===g.id;return `<g class="district ${selected?'is-selected':''}" data-district="${g.id}"><polygon points="${g.points}" style="fill:${fillFor(m)}"/><text x="${g.label[0]}" y="${g.label[1]}">${g.name}</text><title>${g.name} — ${MS.getLayerLegend(layer)[0]} ${Number(m.value||0).toFixed(2)}</title></g>`;}).join('');
    const active=state.firms.filter(f=>f.active),positions=new Map();
    const firms=active.map((f,i)=>{const p=firmPosition(geometry,f,i);if(!p)return'';positions.set(f.id,p);const size=f.capital_stock>260?10:(f.capital_stock>150?8:6),klass=f.strike_intensity>0?'is-striking':'';return `<g class="firm-marker ${klass}" data-firm="${f.id}" tabindex="0"><rect x="${p.x-size}" y="${p.y-size}" width="${size*2}" height="${size*2}"/><title>${f.name} — ${f.employees.toFixed(0)} Beschäftigte — Gewinn ${Number(f.profit||0).toFixed(1)}</title></g>`;}).join('');
    const smoke=active.filter(f=>f.capital_stock>150).slice(0,10).map((f,i)=>{const p=positions.get(f.id);if(!p)return'';return `<g class="smoke-stack" transform="translate(${p.x+5} ${p.y-9})"><circle class="smoke smoke-${i%3}" r="4"/><circle class="smoke smoke-${(i+1)%3}" cy="-8" r="3"/></g>`;}).join('');
    const viewBox=MS.getMapViewBox?MS.getMapViewBox(state):geometry.viewBox;
    svg.setAttribute('viewBox',viewBox);
    svg.innerHTML=`<rect class="map-paper" x="0" y="0" width="1000" height="650"/>${districts}<g class="roads">${geometry.roads.map(d=>`<path d="${d}"/>`).join('')}</g><path class="river" d="${geometry.river}"/><path id="rail-path" class="rail" d="${geometry.rail}"/><circle class="train-marker" r="5"><animateMotion dur="18s" repeatCount="indefinite" path="${geometry.rail}"/></circle>${firms}${smoke}`;
    svg.querySelectorAll('[data-district]').forEach(node=>node.addEventListener('click',()=>{state.map.selectedDistrict=node.dataset.district;MS.renderRotfeldMap(svg,state,layer);if(typeof root.CustomEvent==='function')root.dispatchEvent(new CustomEvent('marxsim:district-selected',{detail:{districtId:node.dataset.district}}));}));
    svg.querySelectorAll('[data-firm]').forEach(node=>{const fire=e=>{e.stopPropagation();state.map.selectedFirm=node.dataset.firm;if(typeof root.CustomEvent==='function')root.dispatchEvent(new CustomEvent('marxsim:firm-selected',{detail:{firmId:node.dataset.firm}}));};node.addEventListener('click',fire);node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')fire(e);});});
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
