/** Authored intention providers for repeatable scenes. No timeline can bypass admission. */
import {contains,zone,PORTALS} from '../spatial/floor';
import {ENCOUNTER_VERSION,type Agent,type Action,type World,type Registry,type Planner,type SpatialServices,type Motion,type Phase,type Speech} from './contract';
import {arrival} from './arrival';
import {advance,project} from './kernel';
export type Study='security'|'conveyor'|'threshold'|'arrival';
export type RoomStudy='security'|'conveyor';
export type Choice='care'|'pressure';
export const studies=[{id:'arrival' as const,title:'The first morning count',subtitle:'DAY ONE · Lobby → Security',choices:[]},{id:'threshold' as const,title:'Your workers are still here',subtitle:'DAY ONE · the shared doorway',choices:['Back LIMEN’s procedure','Back STILETTO’s urgency']},{id:'security' as const,title:'The name on the list',subtitle:'LIMEN · clearance and confidence',choices:['Verify the record','Allow this exception']},{id:'conveyor' as const,title:'The line can wait',subtitle:'STILETTO · pressure and willingness to speak',choices:['Ease the drive','Keep pushing']}];
const W='worker-07';
function actor(id:string,name:string,character:Agent['character'],room:RoomStudy,x:number,z:number,yaw:number):Agent{return {id,name,character,room,position:[x,z],yaw,beliefs:{},stress:28,trust:50,memory:[]};}
/** Deliberately limited authored-lane service. Full obstacle/portal navigation remains a port to implement. */
export const rehearsalSpace:SpatialServices={
 connected(a,b){return PORTALS.some(p=>(p.a===a&&p.b===b)||(p.a===b&&p.b===a));},
 canTraverse(agent,to,world){return to.every(Number.isFinite)&&contains(zone(agent.room).rect,{x:to[0]/1000,y:to[1]/1000})&&Object.values(world.agents).every(other=>other.id===agent.id||other.room!==agent.room||Math.hypot(other.position[0]-to[0],other.position[1]-to[1])>=800);},
 canHear(speaker,listener,world,channel='local'){
  const distance=Math.hypot(speaker.position[0]-listener.position[0],speaker.position[1]-listener.position[1]);
  if(speaker.room===listener.room)return distance<=(channel==='shout'?12000:6000);
  if(channel!=='shout'||world.facts['portal.security-conveyor.open']!==true||distance>12000)return false;
  return PORTALS.some(p=>p.id==='security-conveyor'&&[p.a,p.b].includes(speaker.room)&&[p.a,p.b].includes(listener.room)&&[speaker,listener].every(a=>Math.min(Math.hypot(a.position[0]-p.start.x*1000,a.position[1]-p.start.y*1000),Math.hypot(a.position[0]-p.end.x*1000,a.position[1]-p.end.y*1000))<=6000));
 }
};
export function rehearsal(study:Study,choice:Choice){
 if(study==='arrival')return arrival();
 if(study==='threshold')return doorway(choice);
 const security=study==='security',S=security?'limen':'stiletto',x=security?131000:120800,z=security?122000:149600;
 const worker=actor(W,'SEVEN','worker',study,x-1000,z-1400,0),supervisor=actor(S,security?'LIMEN':'STILETTO',S,study,x+1200,z,90);
 const world:World={version:ENCOUNTER_VERSION,tick:0,sequence:0,agents:{[W]:worker,[S]:supervisor},facts:{'gate.open':false,'credential.valid':true,'drive.mode':'push','queue.pressure':'high','player.directive':choice},resources:[`${study}:conversation`,`${study}:work-slot`],held:{},active:[],done:[],events:[]};
 // The worker observes a local condition. Supervisors must hear it before their response can be admitted.
 worker.beliefs[security?'clearance.missing':'queue.pressure']={value:security?true:'high',source:security?'checkpoint-display':'workstation-buffer',mode:'observed',tick:0};
 const pose=(agent:string,motion:Motion,yaw?:number)=>({agent,motion,...(yaw!==undefined?{yaw}:{})});
 const say=(speaker:string,text:string,act:Speech['act'],claim?:Speech['claim']):Speech=>({speaker,to:[speaker===W?S:W],text,act,claim,cause:security?'clearance.missing':'queue.pressure',seconds:4.5});
 const phases=(id:string,seconds:number,wm:Motion,sm:Motion,speech?:Speech,effects?:Phase['effects']):Phase=>({id,ticks:seconds*20,perform:[pose(W,wm,-90),pose(S,sm,90)],say:speech?[speech]:[],effects});
 const registry:Registry={};
 const add=(id:string,requires:Action['requires'],p:Phase[],reason:string)=>{registry[id]={id,room:study,participants:[W,S],resources:[`${study}:conversation`],requires,reason,phases:p};};
 add('approach',[],[{id:'A worker asks for attention',ticks:48,perform:[{agent:W,motion:'walk',to:[x-1000,z],yaw:0},pose(S,'idle',90)]}], 'Reach the reserved conversation position.');
 add('report',[],[
  phases('The problem is voiced',5,'listen','listen',say(W,security?"I'm on the shift list. The gate disagrees.":"The next one arrives before I've set this one down.",'report',{fact:security?'clearance.missing':'queue.pressure',value:security?true:'high'})),
  phases('A request, not a number',5,'scratch','listen',say(W,security?'Am I in trouble?':'Can we slow it a little?','request'))
 ],'The worker wants permission to continue without a mistake.');
 const requires:Action['requires']=[{agent:S,belief:security?'clearance.missing':'queue.pressure',equals:security?true:'high'},{fact:'player.directive',equals:choice},...(security&&choice==='care'?[{fact:'credential.valid',equals:true}]:[])];
 const response=security?(choice==='care'?'Wait. I will check the record.':'An exception. Go through; I will record it.'):(choice==='care'?'Fine. Give the line a breath.':'The line is moving. So are you.');
 const effect:Phase['effects']=security?[{fact:'gate.open',value:true},{fact:'clearance.method',value:choice==='care'?'verified':'exception'},{agent:W,stress:choice==='care'?-10:2,trust:choice==='care'?8:-2,remember:choice==='care'?'Waiting brought an explanation.':'An exception worked today.'}]:[{fact:'drive.mode',value:choice==='care'?'steady':'push'},{agent:W,stress:choice==='care'?-10:14,trust:choice==='care'?8:-12,remember:choice==='care'?'Reporting the queue changed the pace.':'Reporting the queue earned a threat.'}];
 add('respond',requires,[
  phases('The supervisor responds',security?8:choice==='care'?8:21,'listen',!security&&choice==='pressure'?'threaten':'idle',say(S,response,'instruction')),
  phases(security?'The checkpoint releases':'The drive responds',2,'listen','listen',undefined,effect)
 ],security?(choice==='care'?'LIMEN checks the available credential record before releasing SEVEN.':'The producer permits an exception; LIMEN records it.'):(choice==='care'?'The producer eases drive pressure after the report.':'STILETTO prioritizes the producer’s output directive over the worker’s request.'));
 const result=security?(choice==='care'?"Right. I'll wait for the green next time.":"So… sometimes the list doesn't matter?"):(choice==='care'?"You listened. I'll tell you if it backs up again.":"Understood. I'll keep it to myself.");
 add('aftermath',[{fact:security?'gate.open':'drive.mode',equals:security?true:choice==='care'?'steady':'push'}],[
  phases('The worker reveals what changed',5,'listen','listen',say(W,result,'response',{fact:'worker-07.future-report',value:choice==='care'?'willing':'reluctant'})),
  phases('The supervisor hears the consequence',4,'settle','listen',say(S,security?(choice==='care'?'You are cleared. That is what the check is for.':'An exception is not a rule.'):(choice==='care'?'Good. Before it stops next time.':'I said keep moving.'),'acknowledge'))
 ],'The worker voices a subjective interpretation. Hearing it updates the supervisor’s belief; it is not omniscient truth.');
 const sequence=['approach','report','respond','aftermath'];
 const planner:Planner={propose(s){if(s.active.length)return [];const id=sequence.find(id=>!s.done.includes(id));return id?[{id,action:id,initiator:id==='respond'?S:W}]:[];}};
 const total=1+Object.values(registry).reduce((sum,a)=>sum+a.phases.reduce((n,p)=>n+p.ticks,0),0);
 const beats=[{label:'The report',tick:70},{label:'The response',tick:270},{label:'What stays with SEVEN',tick:total-150}];
 return {world,registry,planner,space:rehearsalSpace,total,beats,study,choice,room:study,anchor:[x/1000,z/1000] as const};
}
export function replay(take:ReturnType<typeof rehearsal>,tick:number){
 if(!Number.isInteger(tick)||tick<0||tick>take.total)throw Error('Invalid rehearsal tick.');
 let s=take.world;for(let i=0;i<tick;i++)s=advance(s,take.registry,take.space,take.planner);
 return s;
}
export function rehearsalView(take:ReturnType<typeof rehearsal>,world:World){return project(world,take.registry,world.tick>=take.total);}

/** Day-one precursor: an actual missing crew motivates a walk to the shared portal. */
function doorway(choice:Choice){
 const limen=actor('limen','LIMEN','limen','security',126500,126400,0);
 const stiletto=actor('stiletto','STILETTO','stiletto','conveyor',126500,132000,180);
 stiletto.beliefs['conveyor.crew']={value:0,source:'empty-workstations',mode:'observed',tick:0};
 const world:World={version:ENCOUNTER_VERSION,tick:0,sequence:0,agents:{limen,stiletto},facts:{'conveyor.crew':0,'portal.security-conveyor.open':true,'security.waiting':20,'security.clerks':4,'player.adviser':choice==='care'?'limen':'stiletto'},resources:['security-conveyor:threshold'],held:{},active:[],done:[],events:[]};
 const poses=(sm:Motion='listen')=>[{agent:'limen',motion:'idle' as Motion,yaw:0},{agent:'stiletto',motion:sm,yaw:180}];
 const speech=(speaker:string,text:string,claim?:Speech['claim']):Speech=>({speaker,to:[speaker==='limen'?'stiletto':'limen'],channel:'shout',text,claim,act:claim?'report':'response',cause:'conveyor.crew',seconds:5});
 const phase=(id:string,text:string,speaker:string,claim?:Speech['claim'],effects?:Phase['effects']):Phase=>({id,ticks:120,perform:poses(),say:[speech(speaker,text,claim)],effects});
 const registry:Registry={};
 const add=(id:string,requires:Action['requires'],phases:Phase[],reason:string,participants=['stiletto','limen'])=>{registry[id]={id,room:'conveyor',adjacentRoom:'security',participants,resources:['security-conveyor:threshold'],requires:[{fact:'portal.security-conveyor.open',equals:true},...requires],reason,phases};};
 add('approach',[{agent:'stiletto',belief:'conveyor.crew',equals:0}],[{id:'STILETTO leaves the idle line',ticks:100,perform:[{agent:'stiletto',motion:'walk',to:[126500,128700],yaw:180}]}],'Empty workstations motivate a visit to the connected Security entrance.',['stiletto']);
 add('ask',[{agent:'stiletto',belief:'conveyor.crew',equals:0}],[phase('The empty line gets a voice','My line is ready. Where are my workers?','stiletto',{fact:'conveyor.crew',value:0})],'Ask the supervisor responsible for worker admission.');
 add('answer',[{agent:'limen',belief:'conveyor.crew',equals:0}],[phase('LIMEN defends the checkpoint','Four are checking papers. The rest are being checked.','limen',{fact:'security.clerks',value:4})],'LIMEN has heard the missing-crew report.');
 add('protest',[{agent:'stiletto',belief:'security.clerks',equals:4}],[phase('Their priorities collide','Leadership asked for robots. Not immaculate paperwork.','stiletto',{fact:'stiletto.priority',value:'quota'})],'STILETTO now knows some operators are processing paperwork.');
 add('defend',[{agent:'limen',belief:'stiletto.priority',equals:'quota'}],[phase('Procedure answers ambition','Leadership needs a factory still standing next week.','limen',{fact:'limen.priority',value:'procedure'},[{agent:'stiletto',stress:10,trust:-4,remember:'LIMEN kept operators at Security while my line stood empty.'},{agent:'limen',stress:4,trust:-4,remember:'STILETTO pressed for speed before clearance was complete.'}])],'LIMEN answers the stated quota priority with his own weekly goal.');
 add('backing',[{agent:'stiletto',belief:'limen.priority',equals:'procedure'}],[phase('Who the producer backed',choice==='care'?'The producer backed the procedure. You will get cleared workers.':'The producer wants output. Send them as soon as they clear.',choice==='care'?'limen':'stiletto',undefined,[{agent:choice==='care'?'stiletto':'limen',stress:4,trust:-3,remember:choice==='care'?'The producer backed LIMEN while my line waited.':'The producer backed STILETTO’s urgency during my inspection.'}])],'The producer’s briefing priority colours the disagreement; it does not teleport workers.');
 add('departure',[],[{id:'Back to a line that is still waiting',ticks:100,perform:[{agent:'stiletto',motion:'walk',to:[126500,132000],yaw:0}]}],'Return to the line with the dispute unresolved.',['stiletto']);
 const order=['approach','ask','answer','protest','defend','backing','departure'];
 const planner:Planner={propose(s){if(s.active.length)return [];const id=order.find(id=>!s.done.includes(id));return id?[{id,action:id,initiator:id==='answer'||id==='defend'?'limen':'stiletto'}]:[];}};
 return {world,registry,planner,space:rehearsalSpace,total:801,beats:[{label:'Where are my workers?',tick:125},{label:'The procedural answer',tick:245},{label:'The producer’s backing',tick:605}],study:'threshold' as const,choice,room:'security' as const,anchor:[126.5,127.5] as const};
}
