import type {Agent,Value} from './contract';
import {CONVEYOR_STATIONS,conveyorControl,type ConveyorStation} from './arrival-layout';
export type DayOneStage='entry'|'tutorial'|'staffing'|'production'|'output'|'departure'|'night';
export type DayOneState={stage:DayOneStage;crew:number;stationOperators:Record<ConveyorStation,string|null>;stationOccupancy:Record<ConveyorStation,string|null>;tutorialOutputs:number;pairedOutputs:number;staffedOutputs:number;productionOutputs:number;departed:number;totalCast:number};
/** Player-visible progress only: no private belief, stress or card-holder knowledge. */
export function dayOneState(facts:Record<string,Value>,agents:Record<string,Agent>):DayOneState|undefined{
 if(facts['day.number']!==1)return undefined;
 const stages:DayOneStage[]=['entry','tutorial','staffing','production','output','departure','night'];
 const stage=facts['day.stage'];if(!stages.includes(stage as DayOneStage))throw Error('Invalid Day 1 stage');
 const count=(key:string)=>{const n=facts[key]??0;if(typeof n!=='number'||!Number.isInteger(n)||n<0)throw Error('Invalid day counter '+key);return n;};
 return {stage:stage as DayOneStage,crew:Object.keys(agents).filter(id=>facts[`line.crew.${id}`]===true).length,
  stationOperators:Object.fromEntries(CONVEYOR_STATIONS.map(s=>[s.id,typeof facts[`line.operator.${s.id}`]==='string'?facts[`line.operator.${s.id}`]:null])) as Record<ConveyorStation,string|null>,
  // Physical presence grants no operating authority. The paired cycle moves its operators between
  // controls; departure retains assignments until each person actually exits.
  stationOccupancy:Object.fromEntries(CONVEYOR_STATIONS.map(s=>{
   const point=conveyorControl(s.id),a=Object.values(agents).filter(a=>a.room==='conveyor'&&facts[`day.departed.${a.id}`]!==true&&Math.hypot(a.position[0]-point[0],a.position[1]-point[1])<=180).sort((a,b)=>a.id.localeCompare(b.id))[0];
   return [s.id,a?.id??null];
  })) as Record<ConveyorStation,string|null>,
  tutorialOutputs:count('line.tutorial-output'),pairedOutputs:count('line.paired-output'),staffedOutputs:count('line.staffed-output'),productionOutputs:count('line.output'),departed:Object.keys(agents).filter(id=>facts[`day.departed.${id}`]===true).length,totalCast:Object.keys(agents).length};
}

/** Direct review jumps use the same registry/world. They are never replay acceptance. */
export function dayOneReviewPoints(registry:import('./contract').Registry){
 const points:{id:string;label:string;tick:number;shot:import('./contract').SceneFraming}[]=[];let tick=1;
 for(const action of Object.values(registry))for(const phase of action.phases){
  if(phase.id==='The morning walk')points.push({id:'lobby',label:'Review Lobby',tick,shot:'approach'});
  if(phase.id==='ed takes the register station')points.push({id:'security',label:'Review Security',tick:tick+phase.ticks-1,shot:'checkpoint'});
  if(phase.id==='One worker for a whole line')points.push({id:'conveyor',label:'Review Conveyor',tick,shot:'conveyor-wide'});
  for(const effect of phase.effects??[])if('fact'in effect&&effect.fact==='day.stage'&&['production','output','departure','night'].includes(String(effect.value))){
   const id=String(effect.value);if(!points.some(p=>p.id===id))points.push({id,label:`Review ${id}`,tick:tick+phase.ticks,shot:phase.framing??'conveyor-wide'});
  }
  tick+=phase.ticks;
 }
 return points;
}
