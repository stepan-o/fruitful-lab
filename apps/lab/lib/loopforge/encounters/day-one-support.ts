import type {Registry,World,Phase,Point,Performance} from './contract';
import {movementPerformance} from './shared-actions';
/** Selected D3 local assignments use the existing south aisle and common movement
 * admission. No hearing range, words, custody or station result is invented. */
export function stageDayOneSupport(registry:Registry,world:World){
 const positions:Record<string,Point>=Object.fromEntries(Object.values(world.agents).map(a=>[a.id,a.position]));
 const visits:Record<string,Point>={'S07-T06':[136000,108500],'S07-T10':[139000,108500],'S07-T13':[150300,107200],'S07-T15':[148000,108500],'S09-T02':[138000,108500]};
 const facing=(from:Point,to:Point)=>(Math.atan2(from[0]-to[0],to[1]-from[1])*180/Math.PI+360)%360;
 function travel(base:Phase,to:Point,prefix:string){
  if(base.perform.some(p=>p.to))throw Error('Support dialogue travel must precede a stationary turn');
  const phases:Phase[]=[],from=positions.stiletto;
  for(const [i,end] of [[from[0],108500],[to[0],108500],to].entries()){
   const target=end as Point,start=positions.stiletto,distance=Math.hypot(target[0]-start[0],target[1]-start[1]);if(distance<1)continue;
   const perform=base.perform.map(p=>p.agent==='stiletto'?movementPerformance('stiletto',target,{clip:'Quick_Walk',rate:1,loop:true,blend:.2},facing(start,target)):{...p});
   phases.push({id:`D3 ${prefix} / ${i+1}`,ticks:Math.max(10,Math.ceil(distance/1800*20)),framing:'conveyor-wide',attention:'flow',perform});positions.stiletto=target;
  }
  return phases;
 }
 for(const action of Object.values(registry)){
  const out:Phase[]=[];
  for(const phase of action.phases){
   const id=phase.turn?.id,target=id&&visits[id];if(target)out.push(...travel(phase,target,id));
   if(phase.turn?.kind==='speech'){
    const speech=phase.turn.speech,listener=speech.speaker==='stiletto'?speech.to[0]:speech.to.includes('stiletto')?speech.speaker:undefined;
    if(listener&&positions[listener])phase.perform=phase.perform.map(p=>p.agent==='stiletto'?{...p,yaw:facing(positions.stiletto,positions[listener])}:p);
   }
   if(action.id==='staffed-production'){
    const watch:Record<string,Point>={mae:[136500,104700],kit:[144500,104700],lou:[150600,104700],ben:[148500,105800]};
    phase.perform=phase.perform.map((p):Performance=>watch[p.agent]?{...p,yaw:facing(positions[p.agent],watch[p.agent]),motion:p.agent==='ben'?'idle':'listen',cue:{clip:p.agent==='ben'?'Quiet_Wait':'Listening_Gesture',start:0,rate:1,loop:false,blend:.25}}:p);
   }
   out.push(phase);for(const p of phase.perform)if(p.to)positions[p.agent]=p.to;
   // Return to the recipe's actual downstream root before production/departure.
   if(id==='S07-T08'||id==='S07-T11')out.push(...travel(phase,[positions.stiletto[0],107200],id+' clear the shared aisle'));
   if(id==='S07-T17'||id==='S09-T03')out.push(...travel(phase,[150300,107200],id+' return to supervision'));
  }
  action.phases=out;
 }
}
