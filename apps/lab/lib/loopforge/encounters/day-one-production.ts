import {conveyorControl,CONVEYOR_STATIONS,type ConveyorStation} from './arrival-layout';
import type {Action,Performance,Point,ProcessCue,MotionCue} from './contract';
export type DayOneOperators=Record<ConveyorStation,string>;
// The Max source is a push-and-stop take, not a cyclic work loop. Play its
// source .4..2.5999999046325684 exactly once over the existing six-second phase.
// The endpoint is the stored float32 duration in all three Max delivery banks.
const maxForgePush:MotionCue={clip:'Push_Forward_and_Stop',start:.4,rate:(2.5999999046325684-.4)/6,loop:false,blend:.2};
/** The Director supplies assignments and chronology. This builds actual work,
 * not a visual output counter: every phase is guarded by all staffed controls. */
export function staffedProduction(operators:DayOneOperators,participants:string[],resources:string[],rest:Performance[]):Action{
 const ids=CONVEYOR_STATIONS.map(s=>operators[s.id]);
 if(new Set(ids).size!==4||ids.some(id=>!participants.includes(id)))throw Error('Four distinct present operators required');
 const staffing=CONVEYOR_STATIONS.map(s=>({agent:operators[s.id],position:conveyorControl(s.id),within:180}));
 const guard=(station:ConveyorStation,from:number):ProcessCue=>({station,from,to:from+1,operator:staffing.find(p=>p.agent===operators[station])!,staffing});
 return {id:'staffed-production',room:'conveyor',adjacentRoom:'security',additionalRooms:['lobby'],participants,resources,
  requires:[{fact:'line.staffed',equals:true},{fact:'line.output',equals:2},...CONVEYOR_STATIONS.flatMap(s=>[{fact:`line.operator.${s.id}`,equals:operators[s.id]},{fact:`line.crew.${operators[s.id]}`,equals:true}])],
  reason:'A staffed crew moves its first operational workpiece through all four guarded stations.',
  phases:[
   {id:'The staffed line starts its first batch',ticks:60,framing:'conveyor-wide',perform:rest,effects:[{fact:'day.stage',value:'production'},{fact:'line.stage',value:0},{fact:'line.batch',value:3}]},
   ...CONVEYOR_STATIONS.map((s,i)=>({id:`The staffed ${s.id} operates`,ticks:120,framing:s.id,perform:rest.map(p=>p.agent===operators[s.id]?{agent:p.agent,motion:'listen' as const,yaw:180,cue:p.agent==='max'&&s.id==='forge'?{...maxForgePush}:{clip:'Push_Forward_and_Stop',start:.4,rate:1,loop:true,blend:.2}}:p),process:guard(s.id,i),effects:[{fact:'line.stage',value:i+1},{fact:`line.operational.${s.id}`,value:true},...(i===3?[{fact:'line.output',value:3},{fact:'line.staffed-output',value:1},{fact:'line.history.staffed-3',value:true},{fact:'day.stage',value:'output'}]:[])]})),
   {id:'The first operational output is ready',ticks:100,framing:'forge',attention:'hold',inputLabel:'End the shift',perform:rest},
  ]};
}
/** Occupancy is explicit data; route planning and physical validation remain separate. */
export function stationStaffing(operators:DayOneOperators):ReadonlyArray<{agent:string;position:Point;within:number}>{return CONVEYOR_STATIONS.map(s=>({agent:operators[s.id],position:conveyorControl(s.id),within:180}));}
