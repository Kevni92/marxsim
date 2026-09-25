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

  function fillFor(item) {
    const n=item.normalized;
    if (item.layer==='labor') return `rgba(118,53,42,${0.16+n*0.58})`;
    if (item.layer==='capital') return `rgba(91,78,38,${0.16+n*0.62})`;
    if (item.layer==='housing') return `rgba(142,96,54,${0.14+n*0.58})`;
    if (item.layer==='environment') return `rgba(72,84,58,${0.13+n*0.60})`;
    return `rgba(57,63,66,${0.12+n*0.68})`;
  }

  MS.renderRotfeldMap = function renderRotfeldMap(svg,state,layer) {
    if (!svg) return;
    const model=MS.buildMapViewModel(state,layer);
    const byId=new Map(model.map(x=>[x.id,x]));
    const geometry=MS.MAP_GEOMETRY;
    const districts=geometry.districts.map(g=>{
      const m=byId.get(g.id);
      const selected=state.map && state.map.selectedDistrict===g.id;
      return `<g class="district ${selected?'is-selected':''}" data-district="${g.id}"><polygon points="${g.points}" style="fill:${fillFor(m)}"/><text x="${g.label[0]}" y="${g.label[1]}">${g.name}</text></g>`;
    }).join('');
    const firms=state.firms.filter(f=>f.active).map((f,i)=>{
      const g=geometry.districts.find(x=>x.id===f.district); if(!g) return '';
      const angle=(i%5)*1.18, radius=18+(i%3)*9, x=g.label[0]+Math.cos(angle)*radius, y=g.label[1]+28+Math.sin(angle)*radius;
      const size=f.capital_stock>260?10:(f.capital_stock>150?8:6);
      return `<g class="firm-marker" data-firm="${f.id}"><rect x="${x-size}" y="${y-size}" width="${size*2}" height="${size*2}"/><title>${f.name} — ${f.employees.toFixed(0)} Beschäftigte</title></g>`;
    }).join('');
    svg.setAttribute('viewBox',geometry.viewBox);
    svg.innerHTML=`<rect class="map-paper" x="0" y="0" width="1000" height="650"/>${districts}<g class="roads">${geometry.roads.map(d=>`<path d="${d}"/>`).join('')}</g><path class="river" d="${geometry.river}"/><path class="rail" d="${geometry.rail}"/>${firms}`;
    svg.querySelectorAll('[data-district]').forEach(node=>node.addEventListener('click',()=>{
      state.map.selectedDistrict=node.dataset.district;
      MS.renderRotfeldMap(svg,state,layer);
      if (typeof root.CustomEvent==='function') root.dispatchEvent(new CustomEvent('marxsim:district-selected',{detail:{districtId:node.dataset.district}}));
    }));
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
