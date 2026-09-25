(function (root) {
  'use strict';
  const MS = root.MarxSim = root.MarxSim || {};
  function record(state, metric, delta, sourceId, reason) { state.causalLog.push({ tick:state.tick,metric,delta,sourceType:'firm',sourceId,reason }); }
  function acquireSalvage(state, failedFirm) {
    if (!state.rules.allowAcquisitions) return;
    const buyer=state.firms.filter(f=>f.active&&f.id!==failedFirm.id&&f.sector===failedFirm.sector&&f.cash>650).sort((a,b)=>(b.cash+b.capital_stock)-(a.cash+a.capital_stock))[0];
    if(!buyer) return;
    const transferredCapital=failedFirm.capital_stock*0.25, purchasePrice=transferredCapital*0.12;
    buyer.cash=Math.max(0,buyer.cash-purchasePrice); buyer.capital_stock+=transferredCapital; buyer.capacity+=failedFirm.capacity*0.10;
    record(state,'capital_stock',transferredCapital,buyer.id,`acquisition:${failedFirm.id}`);
    state.events.push({tick:state.tick,type:'acquisition',buyerId:buyer.id,failedFirmId:failedFirm.id});
  }
  function rationalize(state,firm,rng) {
    const wageBill=firm.employees*firm.wage_offer, wageShare=wageBill/Math.max(1,firm.revenue);
    const peers=state.firms.filter(f=>f.active&&f.sector===firm.sector&&f.id!==firm.id);
    const bestTechnology=peers.reduce((best,f)=>Math.max(best,f.technology),firm.technology);
    const pressure=wageShare>0.34||bestTechnology-firm.technology>0.04||firm.market_share<0.18;
    if(!pressure||firm.cash<1200||firm.profit<=0||rng.next()>0.38) return false;
    const investment=Math.min(280,firm.cash*0.08); firm.cash-=investment;
    const gain=0.015+investment*0.00012; firm.technology+=gain; firm.labor_productivity*=1+0.012+investment*0.000025; firm.max_jobs=Math.max(2,firm.max_jobs*0.992);
    state.economy.investmentThisTick+=investment; record(state,'technology',gain,firm.id,'rationalization');
    state.events.push({tick:state.tick,type:'rationalization',firmId:firm.id,investment}); return true;
  }
  function expand(state,firm,rng) {
    const confidence=firm.expected_demand/Math.max(1,firm.capacity);
    if(firm.cash<=850||firm.profit<=0||confidence<=0.18) return false;
    const investment=Math.min(firm.cash*MS.CONFIG.investmentShareOfCash*rng.range(0.85,1.10),firm.cash-500); if(investment<=0) return false;
    firm.cash-=investment; firm.capital_stock+=investment*0.55; firm.capacity+=investment*0.045; firm.max_jobs+=investment*0.004; state.economy.investmentThisTick+=investment;
    record(state,'capital_stock',investment*0.55,firm.id,'expansion'); return true;
  }
  function maybeFoundFirm(state,rng) {
    if(!state.rules.allowNewFirms||state.tick===0||state.tick%12!==0) return;
    for(const sector of state.sectors) {
      const firms=state.firms.filter(f=>f.active&&f.sector===sector.id); if(!firms.length||firms.length>=6) continue;
      const revenue=firms.reduce((s,f)=>s+f.revenue,0), profit=firms.reduce((s,f)=>s+Math.max(0,f.profit),0), margin=profit/Math.max(1,revenue);
      if(margin<0.08||rng.next()>Math.min(0.40,margin*1.6)) continue;
      const template=firms.slice().sort((a,b)=>b.profit-a.profit)[0];
      const fallback=state.districts.slice().sort((a,b)=>b.access-a.access)[rng.int(0,Math.min(1,state.districts.length-1))];
      const district=MS.chooseFirmLocation?MS.chooseFirmLocation(state,{sector:sector.id}):fallback;
      const serial=state.economy.nextFirmSerial++;
      const entrant={id:`${sector.id}-entrant-${serial}`,name:`${sector.name} Neugründung ${serial}`,sector:sector.id,district:district.id,cash:950,capital_stock:Math.max(70,template.reference_capital*0.55),reference_capital:Math.max(70,template.reference_capital*0.55),technology:Math.max(0.75,template.technology*0.93),capacity:Math.max(45,template.capacity*0.48),max_jobs:Math.max(28,template.max_jobs*0.45),labor_productivity:template.labor_productivity*0.92,base_productivity:template.base_productivity*0.90,wage_offer:template.wage_offer*0.97,wage_multiplier:template.wage_multiplier,job_security:0.66,price:template.price*rng.range(0.96,1.04),target_markup:template.target_markup,input_cost_per_unit:template.input_cost_per_unit*1.03,fixed_cost:template.fixed_cost*0.58,active:true,employees:0,desired_employees:0,inventory:0,output:0,sales:0,revenue:0,profit:0,expected_demand:Math.max(8,template.expected_demand*0.35),utilization:0,insolvency_months:0,age:0,trailing_sales:[],market_share:0};
      state.firms.push(entrant); state.events.push({tick:state.tick,type:'firm_founded',firmId:entrant.id,sector:sector.id,district:district.id});
    }
  }
  MS.runCapitalCycle=function runCapitalCycle(state,rng){
    state.economy.investmentThisTick=0; state.economy.bankruptciesThisTick=0;
    for(const firm of state.firms.slice()) if(firm.active&&firm.insolvency_months>=MS.CONFIG.insolvencyGraceMonths){firm.active=false;firm.employees=0;firm.desired_employees=0;firm.output=0;state.economy.bankruptciesThisTick+=1;state.events.push({tick:state.tick,type:'bankruptcy',firmId:firm.id});acquireSalvage(state,firm);}
    if(state.tick%3===0) for(const firm of state.firms) if(firm.active&&!rationalize(state,firm,rng)) expand(state,firm,rng);
    maybeFoundFirm(state,rng);
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
