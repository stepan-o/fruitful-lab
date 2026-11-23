import type {Action,Phase,Planner,World,Registry,Point,Performance,MotionCue,Speech,ProcessCue,Condition} from './contract';
import {conveyorControl,type ConveyorStation} from './arrival-layout';
/** Selection is replaceable; every selected action enters admit/advance/project. */
export function scriptedSelector(sequence:readonly string[],initiator:string):Planner{return {propose(world){if(world.active.length)return [];const next=sequence.find(id=>!world.done.includes(id));if(!next||sequence.slice(0,sequence.indexOf(next)).some(id=>!(world.completed??[]).includes(id)))return [];return [{id:next,action:next,initiator}];}};}
/** Bounded deterministic policy fixture, NOT a general belief/desire/intention planner. */
export function boundedPolicySelector(options:readonly {id:string;actor:string;after?:string;priority:number}[]):Planner{const stable=[...options].sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id));return {propose(world){if(world.active.length)return [];const next=stable.find(x=>!world.done.includes(x.id)&&(!x.after||world.completed?.includes(x.after)));return next?[{id:next.id,action:next.id,initiator:next.actor}]:[];}};}
export function movementPerformance(agent:string,to:Point,cue:MotionCue,yaw:number):Performance{return {agent,to,yaw,motion:cue.clip==='injured_walk'?'limp':'walk',cue};}
export function phaseSpeech(phase:Phase):Speech[]{return [...(phase.say??[]),...(phase.turn?.kind==='speech'?[phase.turn.speech]:[])];}
export function temporaryInspection(phase:Phase,applicant:string):Phase{return {...phase,credentialStatus:{actorId:applicant},transfers:phase.transfers?.filter(t=>t.prop!==applicant+':id'),perform:phase.perform.map(p=>p.agent===applicant?{...p,motion:'listen',cue:{clip:phase.id.includes('ID_Ready')?'Listening_Gesture':'Quiet_Wait',start:0,rate:1,loop:true,blend:.22}}:p)};}
export function strikeOutcome(phase:Phase,actor:string,target:string):Phase{return {...phase,completesWhen:[...(phase.completesWhen??[]),{agent:actor,near:target,within:2500}],effects:[...(phase.effects??[]),...((phase.effects??[]).some(e=>'fact'in e&&e.fact==='injury.'+target)?[]:[{fact:'injury.'+target,value:'limping'}])]};}
export function operationPhase(phase:Phase,process:ProcessCue):Phase{if(!Number.isInteger(process.from)||process.to!==process.from+1)throw Error('Invalid process transition');return {...phase,process};}
type Base={id:string;actor:string;ticks:number};
export type AgentRequest=Base&({kind:'move-point';point:Point}|{kind:'move-entity';target:string;offset:Point;within:number}|{kind:'interact';target:string;object:'security:register'}|{kind:'operate';station:ConveyorStation}|{kind:'speech';text:string;listeners:string[]}|{kind:'yell';text:string;listeners:string[]}|{kind:'strike';target:string});
/** Trusted host compiles a bounded typed request against current entity components.
 * No request can provide arbitrary effects, grants, renderer coordinates or a new world. */
export function individualAction(world:World,request:AgentRequest):Action{
 if(!['move-point','move-entity','interact','operate','speech','yell','strike'].includes(request.kind))throw Error('Unsupported individual action kind');
 const actor=world.agents[request.actor];if(!actor||!request.id||!Number.isInteger(request.ticks)||request.ticks<1||request.ticks>1200)throw Error('Invalid individual action');
 const room=actor.room,participants=[actor.id],resources:string[]=[],requires:Condition[]=[];
 const idle:Performance={agent:actor.id,motion:'idle',yaw:actor.yaw,cue:{clip:actor.character==='worker'?'Quiet_Wait':actor.character==='limen'?'Idle_11':'Alert',rate:1,loop:true}};
 let p:Phase={id:request.id+'/execute',ticks:request.ticks,perform:[idle]};
 if(request.kind==='move-point'||request.kind==='move-entity'){
  let point:Point;if(request.kind==='move-point')point=request.point;else{const target=world.agents[request.target];if(!target||!Number.isFinite(request.within)||request.within<850)throw Error('Invalid target');point=[target.position[0]+request.offset[0],target.position[1]+request.offset[1]];p.completesWhen=[{agent:actor.id,near:target.id,within:request.within}];}
  if(!point.every(Number.isSafeInteger))throw Error('Expected integer millimetres');const yaw=(Math.atan2(actor.position[0]-point[0],point[1]-actor.position[1])*180/Math.PI+360)%360;
  p.perform=[movementPerformance(actor.id,point,{clip:actor.character==='worker'?'walking_2_inplace':actor.character==='stiletto'?'Quick_Walk':'Confident_Strut',rate:1,loop:true},yaw)];
 }else if(request.kind==='speech'||request.kind==='yell'){
  if(!request.text.trim()||request.text.length>1000||request.listeners.some(id=>!world.agents[id]))throw Error('Invalid utterance');
  p.say=[{speaker:actor.id,to:[...request.listeners],text:request.text,seconds:request.ticks/20,channel:request.kind==='yell'?'shout':'local',act:'response',cause:'individual-action'}];
 }else if(request.kind==='operate'){
  const stations=['intake','wash','belt','forge'] as const,from=stations.indexOf(request.station);if(from<0)throw Error('Invalid station');requires.push({fact:'line.stage',equals:from});p=operationPhase({...p,effects:[{fact:'line.stage',value:from+1},...(from===3?[{fact:'line.output',value:Number(world.facts['line.output']??0)+1}]:[])]},{station:request.station,from,to:from+1,operator:{agent:actor.id,position:conveyorControl(request.station),within:180}});
  p.perform=[{...idle,motion:'listen',yaw:180,cue:{clip:'Push_Forward_and_Stop',start:.4,rate:1,loop:true}}];
 }else{
  const target=world.agents[request.target];if(!target)throw Error('Unknown recipient');participants.push(target.id);requires.push({agent:actor.id,near:target.id,within:request.kind==='strike'?2500:3200});
  if(request.kind==='strike'){if(!['limen','stiletto'].includes(actor.character))throw Error('Actor lacks strike authority');p=strikeOutcome({...p,perform:[{...idle,motion:'strike',cue:{clip:actor.character==='limen'?'Checkpoint_Strike':'Shouting_Angrily',rate:1}}]},actor.id,target.id);}
  else{if(!['limen','ed','gus'].includes(actor.id))throw Error('Actor lacks inspection authority');resources.push(request.object);requires.push({fact:'credential.valid.'+target.id,equals:true});p=temporaryInspection({...p,perform:[idle,{agent:target.id,motion:'listen',cue:{clip:'Quiet_Wait',rate:1}}],effects:[{fact:'checkpoint.card-checked.'+target.id,value:true},{fact:'checkpoint.cleared.'+target.id,value:true}]},target.id);}
 }
 return {id:request.id,room,adjacentRoom:room==='conveyor'?'security':room==='outside'?'lobby':room==='security'?'lobby':'security',additionalRooms:room==='conveyor'?['lobby']:room==='outside'?[]:['conveyor'],participants,resources,requires,reason:request.kind+' selected for '+actor.id,phases:[p]};
}
export function actionRegistry(world:World,requests:readonly AgentRequest[]):Registry{const registry:Registry={};for(const request of requests){if(registry[request.id])throw Error('Duplicate action id');registry[request.id]=individualAction(world,request);}return registry;}
