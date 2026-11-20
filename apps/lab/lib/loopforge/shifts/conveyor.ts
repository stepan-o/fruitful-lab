import {admit,advance} from '../encounters/kernel';
import {operationPhase} from '../encounters/shared-actions';
import type {Action,SpatialServices} from '../encounters/contract';
import {audible,geom} from '../intro/floor';
import {Hz,stations,stationOwners,type Run} from './contract';
import {mark,say,thought} from './events';
import {controls,returnSpot,dist,go,meters} from './navigation';

const space:SpatialServices={connected:(a,b)=>a===b,canTraverse:()=>false,canHear:(a,b,_w,c)=>audible(a,b,c==='shout')};
function operator(s:Run,i:number){
  return Object.values(s.world.agents).find(a=>s.tasks[a.id].duty==='working'&&dist(a.position,controls[i])<=300)?.id??'';
}
export function production(s:Run){
  for(let i=0;i<stations.length;i++){
    const id=operator(s,i);
    if(s.coverage[i]!==id){
      s.coverage[i]=id;mark(s,'station.coverage','conveyor','control.'+stations[i],controls[i],id,stations[i],id?'Operator at control':'Uncovered');
    }
  }
  s.world=advance(s.world,s.rules,space);
  for(const p of s.pieces){
    if(p.status==='rack')continue;
    const stage=Number(s.world.facts[p.id+'.stage']);
    if(stage>p.stage){
      p.stage=stage;p.status='travel';p.ready=s.tick+16;
      const i=stage-1;mark(s,'handoff.finished','conveyor','control.'+stations[i],controls[i],s.coverage[i],p.id,stations[i]);
    }
    if(p.status==='travel'){
      const slot=geom.contact.outputSlots[s.completed.length%geom.contact.outputSlots.length];
      const target=stage===4?meters(slot[0],slot[1]):meters(geom.stations[stage].x,geom.forgeHall.carrierY);
      const left=Math.max(1,p.ready-s.tick+1);
      p.at=[p.at[0]+Math.round((target[0]-p.at[0])/left),p.at[1]+Math.round((target[1]-p.at[1])/left)];
      if(s.tick<p.ready)continue;
      p.at=target;
      if(stage===4){
        p.status='rack';s.completed.push(p.id);
        mark(s,'rack.arrival','conveyor','rack.output',target,'',p.id,'Finished cortex');
        continue;
      }
      p.status='process';
    }
    const i=p.stage,id=s.coverage[i],key=p.id+'-'+i;
    if(s.world.active.some(a=>a.intent.action===key))continue;
    if(!id){
      const workers=Object.keys(s.tasks).filter(a=>s.tasks[a].duty==='working');
      if(workers.length===1&&s.tasks[workers[0]].station!==i&&s.dialogue.order.length===1&&s.tasks[stationOwners[i]].duty!=='detained'){
        const worker=workers[0];s.tasks[worker].station=i;s.tasks[worker].duty='cleared';go(s,worker,controls[i]);
      }
      continue;
    }
    if(s.pace==='all-clear'&&s.stageClear!==key){
      if(s.announced!==key){s.announced=key;p.ready=s.tick+36;mark(s,'handoff.wait','conveyor','control.'+stations[i],controls[i],id,p.id,'Awaiting all-clear');}
      if(s.tick<p.ready)continue;
      const ev=say(s,'LIMEN',['Intake, all clear.','Wash, all clear.','Belt, all clear.','Forge, all clear.'][i],'conveyor','clear.'+key,[id]);
      if(!s.heard[ev.seq].includes(id)){p.ready=s.tick+20;continue;}
      s.stageClear=key;
    }
    const ticks=s.pace==='pushed'?26:s.pace==='rushed'?36:s.pace==='slow'?63:48;
    const phase=operationPhase({id:key,ticks,perform:[],effects:[{fact:p.id+'.stage',value:i+1}]},
      {station:stations[i],from:i,to:i+1,workpiece:p.id,operator:{agent:id,position:controls[i],within:350}});
    const action:Action={id:key,room:'conveyor',resources:[stations[i]],participants:[id],requires:[],phases:[phase],reason:'Operate '+stations[i]};
    s.rules[key]=action;
    const attempt=key+'@'+s.tick;
    s.world=admit(s.world,{id:attempt,action:key,initiator:id},s.rules,space);
    if(s.world.active.some(a=>a.intent.id===attempt)){
      s.world.agents[id].stress+=s.pace==='pushed'?3:s.pace==='rushed'?2:1;
      s.injuryExposure+=s.pace==='pushed'?3:s.pace==='rushed'?2:0;
      mark(s,'handoff.started','conveyor','control.'+stations[i],controls[i],id,p.id,s.pace);
    }
  }
  if(s.tick>=s.nextIntake&&s.dialogue.bell-s.tick>275&&s.coverage[0]&&!s.pieces.some(p=>p.status!=='rack')){
    const id='D'+s.day+'-C'+ ++s.nextPiece;
    s.world.facts[id+'.stage']=0;
    s.pieces.push({id,stage:0,status:'process',ready:s.tick,at:meters(geom.stations[0].x,geom.forgeHall.carrierY)});
    s.nextIntake=s.tick+20;
  }
}
