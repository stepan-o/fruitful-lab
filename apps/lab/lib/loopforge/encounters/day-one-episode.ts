import {SHIFT_ROUTES,CONVEYOR_OUTTAKE_SOCKET} from '../rooms/arrival-room-layout';
import {journeyPhases,routeSegments} from './day-one-routes';
import type {World,Registry,Performance,Phase,Point,Action,SceneFraming} from './contract';
import {conveyorControl,CONVEYOR_STATIONS} from './arrival-layout';
import {staffedProduction,type DayOneOperators} from './day-one-production';
/** Mechanical continuation recipe. Director/Level must review the exact assignments,
 * routes and pacing in the combined candidate; these use current authored lanes. */
export const DAY_ONE_OPERATORS:DayOneOperators={intake:'bob',wash:'sam',belt:'jo',forge:'max'};
export const DAY_ONE_CREW=['bob','sam','jo','max','mae','kit','lou','ben'] as const;
const waiting:Record<string,Point>={mae:[136000,109600],kit:[139000,109600],lou:[CONVEYOR_OUTTAKE_SOCKET[0]*1000,CONVEYOR_OUTTAKE_SOCKET[1]*1000],ben:[148000,109600]};
export function appendDayOne(world:World,registry:Registry,sequence:string[],authored:Record<string,Point>){
 const ids=Object.keys(world.agents),positions={...authored};let cleared=3;
 // Move jo's existing authored exchange into the paired cycle. Recompute actual
 // starting positions from the remaining registry, not removed future endpoints.
 const third=registry['third-check'].phases;delete registry['third-check'];sequence.splice(sequence.indexOf('third-check'),1);
 Object.assign(positions,Object.fromEntries(Object.values(world.agents).map(a=>[a.id,a.position])));
 for(const id of sequence)for(const phase of registry[id].phases)for(const pose of phase.perform)if(pose.to)positions[pose.agent]=pose.to;
 const poses=():Performance[]=>ids.map(agent=>({agent,motion:'idle',yaw:agent==='limen'?0:180,cue:{clip:agent==='limen'?'Idle_11':agent==='stiletto'?'Alert':'Quiet_Wait',rate:1,loop:true,blend:.25}}));
 function add(id:string,phases:Phase[],requires:Action['requires']=[]){registry[id]={id,room:'lobby',adjacentRoom:'security',additionalRooms:['conveyor','outside'],participants:ids,resources:world.resources,requires,reason:id,phases};sequence.push(id);}
 function travel(agent:string,route:Point[],prefix:string,shot:SceneFraming):Phase[]{return route.flatMap((to,i)=>{
  const from=positions[agent],distance=Math.hypot(to[0]-from[0],to[1]-from[1]);if(distance<1)return [];
  const yaw=(Math.atan2(from[0]-to[0],to[1]-from[1])*180/Math.PI+360)%360,seconds=distance/1000/(agent==='bob'?1.35:1.8);positions[agent]=to;
  const perform=poses().map(p=>p.agent===agent?{...p,motion:agent==='bob'?'limp' as const:'walk' as const,to,yaw,cue:{clip:agent==='stiletto'?'Quick_Walk':agent==='limen'?'Confident_Strut':agent==='bob'?'injured_walk':'walking_2_inplace',rate:1,loop:true,blend:.2}}:p);
  return [{id:`${prefix} / ${i+1}`,ticks:Math.max(10,Math.ceil(seconds*20)),attention:'flow' as const,framing:shot,perform}];
 });}
 const target=(agent:string):Point=>{const station=CONVEYOR_STATIONS.find(s=>DAY_ONE_OPERATORS[s.id]===agent);return station?conveyorControl(station.id):waiting[agent];};
 function arrive(agent:string,route:Point[],prefix:string){
  const t=target(agent),station=CONVEYOR_STATIONS.find(s=>DAY_ONE_OPERATORS[s.id]===agent);
  const phases=travel(agent,[...route,[t[0],108500],t],prefix,'conveyor-wide');
  phases.push({id:`${agent} takes a shift position`,ticks:20,framing:'conveyor-wide',perform:poses(),effects:[{fact:`line.crew.${agent}`,value:true},...(station?[{fact:`line.operator.${station.id}`,value:agent}]:[])]});return phases;
 }
 // Two operators travel between their own controls. Four-operator staffing is
 // still mandatory for the later staffed cycle, never weakened for this mode.
 const pair:Phase[]=[{id:'bob and sam start the second workpiece',ticks:20,framing:'conveyor-wide',perform:poses(),effects:[{fact:'day.stage',value:'production'},{fact:'line.stage',value:0},{fact:'line.batch',value:2},{fact:'line.crew.bob',value:true},{fact:'line.crew.sam',value:true},{fact:'line.operator.intake',value:'bob'},{fact:'line.operator.wash',value:'sam'}]}];
 const work=(station:typeof CONVEYOR_STATIONS[number]['id'],agent:string,from:number):Phase=>({id:`The paired ${station} operates`,ticks:120,framing:station,perform:poses().map(p=>p.agent===agent?{...p,motion:'listen',cue:{clip:'Push_Forward_and_Stop',start:.4,rate:1,blend:.2}}:p),process:{station,from,to:from+1,operator:{agent,position:conveyorControl(station),within:180}},effects:[{fact:'line.stage',value:from+1},...(from===3?[{fact:'line.output',value:2},{fact:'line.paired-output',value:1},{fact:'line.history.paired-2',value:true}]:[])]});
 const toControl=(agent:string,station:typeof CONVEYOR_STATIONS[number]['id'])=>{const t=conveyorControl(station);return travel(agent,[[positions[agent][0],108500],[t[0],108500],t],`${agent} reaches paired ${station}`,station);};
 pair.push(...toControl('bob','intake'),work('intake','bob',0),...toControl('sam','wash'),work('wash','sam',1));
 // jo's third clearance and visible travel happen while the second cycle is in
 // flight, after Wash starts and before Forge. No teleport or skipped custody.
 pair.push(...third);for(const phase of third)for(const p of phase.perform)if(p.to)positions[p.agent]=p.to;
 const quiet=()=>poses();
 const cardPhase=(agent:string,clip:string,start:number,ticks:number):Phase=>({id:`${agent} ${clip} / ${start}`,ticks,framing:'sam-inspection',attention:'flow',perform:quiet().map(p=>p.agent===agent?{...p,yaw:180,cue:{clip,start,rate:1.6,blend:.22}}:p)});
 function inspect(agent:string,count:number){const hand={kind:'hand' as const,agent,socket:'right' as const},stored={kind:'stowed' as const,agent};
  const draw=cardPhase(agent,'Draw_ID',0,25);draw.transfers=[{prop:agent+':id',from:stored,to:hand}];
  const ready=cardPhase(agent,'ID_Ready',0,30);ready.perform.find(p=>p.agent===agent)!.cue!.rate=1;ready.effects=[{fact:`checkpoint.cleared.${agent}`,value:true},{fact:`checkpoint.card-checked.${agent}`,value:true},{fact:'checkpoint.workers-passed',value:count}];
  const stow=cardPhase(agent,'Stow_ID',0,20);stow.transfers=[{prop:agent+':id',from:hand,to:stored}];
  return [draw,cardPhase(agent,'Draw_ID',2,20),ready,stow,cardPhase(agent,'Stow_ID',1.6,25)];
 }
 pair.push(...inspect('jo',3),...travel('jo',[[125300,112000],[124500,108300],[124500,104500],[129000,104500],[133200,104400],[133300,108500],[141000,108500]],'jo joins during the paired cycle','conveyor-wide'));
 // Writer's four local turns bind after this actual aisle arrival. Staffing only
 // commits after the remaining Belt approach, never early to justify dialogue.
 pair.push({id:'jo joins bob and sam during cycle two',ticks:20,framing:'jo-work-reply',perform:poses()});
 pair.push(...travel('jo',[[144500,108500],conveyorControl('belt')],'jo completes the Belt approach','belt'));
 pair.push({id:'jo reaches the paired Belt control',ticks:20,framing:'belt',perform:poses(),effects:[{fact:'line.crew.jo',value:true},{fact:'line.operator.belt',value:'jo'},{fact:'conveyor.admitted',value:3}]});
 // jo steps to a waiting position while bob completes this cycle at Belt.
 pair.push(...travel('jo',[[145800,109600]],'jo waits for the staffed handover','belt'),...toControl('bob','belt'),work('belt','bob',2),...toControl('sam','forge'),work('forge','sam',3));
 add('paired-production',pair,[{fact:'line.tutorial-output',equals:1},{fact:'checkpoint.cleared.sam',equals:true},{fact:'security.clerks',equals:2}]);
 const maxRoute:Point[]=[[120000,positions.max[1]],[120000,113500],[123900,112400]];
 const threat=journeyPhases(world,positions,[{agent:'stiletto',startTick:0,segments:routeSegments(positions.stiletto,[[134800,107200],[133200,106100],[133200,104600],[131100,104600]],'STILETTO goes to the Security doorway')},{agent:'max',startTick:0,segments:routeSegments(positions.max,maxRoute,'max approaches for the fourth check')}],poses,'doorway-pressure');
 threat[0].effects=[...(threat[0].effects??[]),{fact:'security.connector-reserved',value:true}];
 const shout:Phase={id:'STILETTO demands the rest of the shift',ticks:150,framing:'doorway-pressure',perform:poses(),say:[{speaker:'stiletto',to:['limen','ed','gus'],channel:'shout',text:"IF YOU DON'T GET ME THOSE WORKERS IN THE NEXT 20 MINUTES I'LL USE YOUR MANURE-FILLED BRAINS TOWARDS THE QUOTA",seconds:12,act:'instruction',cause:'line.paired-output',delivery:{tone:'outburst'}}]};
 const checking=inspect('max',4),stow=checking[3];
 checking.splice(3,1,{...stow,id:'max Stow_ID / 0 during doorway threat',ticks:15,transfers:undefined},{...stow,id:'max Stow_ID / 1.2 after doorway threat',ticks:5,perform:stow.perform.map(p=>p.agent==='max'?{...p,cue:{...p.cue!,start:1.2}}:p)});
 let offset=0;for(const phase of [shout,...checking,{id:'The next card is put away',ticks:10,framing:'security-check-reverse' as const,perform:poses()}]){
  phase.framing=offset===0?'doorway-pressure':'security-check-reverse';
  phase.perform=phase.perform.map(p=>p.agent==='stiletto'?{...p,yaw:270,motion:'threaten',cue:{clip:'Shouting_Angrily',start:offset/20,rate:1,blend:.22}}:p.agent==='limen'?{...p,yaw:30,motion:'listen',cue:{clip:'Stand_and_Chat',start:offset/20,rate:1,loop:true,blend:.22}}:p);
  threat.push(phase);offset+=phase.ticks;
 }
 threat.push({id:'STILETTO lowers the blade before retreat',ticks:20,framing:'security-check-reverse',perform:poses(),effects:[{fact:'security.threat-gesture-resolved',value:true}]});
 threat.push(...travel('stiletto',[[133200,104600],[133200,106100],[134800,107200],[150300,107200]],'STILETTO clears the shared connector','security-check-reverse'));
 threat.at(-1)!.effects=[{fact:'security.connector-reserved',value:false}];
 add('doorway-threat',threat,[{fact:'line.paired-output',equals:1},{fact:'credential.valid.max',equals:true}]);
 cleared=4;
 add('shift-staffing-start',[{id:'The line needs its shift',ticks:30,framing:'conveyor-wide',perform:poses(),effects:[{fact:'day.stage',value:'staffing'}]},...arrive('bob',[[144500,108500]],'bob returns to Intake'),...arrive('sam',[[148500,108500]],'sam takes Brain Wash'),...arrive('jo',[[145800,108500]],'jo takes Main Belt')],[{fact:'checkpoint.cleared.jo',equals:true},{fact:'line.paired-output',equals:1}]);
 for(const agent of DAY_ONE_CREW.filter(id=>!['bob','sam','jo'].includes(id))){
  const p=positions[agent],approach:Point[]=p[0]>126000?[[130000,p[1]],[130000,115500],[125300,115500],[123900,112400]]:[[120000,p[1]],[120000,113500],[123900,112400]];
  const approachPhases=agent==='max'?[]:travel(agent,approach,`${agent} approaches Security`,'checkpoint');
  add(`admit-${agent}`,[...approachPhases,...(agent==='max'?[]:inspect(agent,++cleared)),...arrive(agent,[[125300,112000],[124500,108300],[124500,104500],[129000,104500],[133200,104400],[133300,108500]],`${agent} joins Conveyor`)],[{fact:`credential.valid.${agent}`,equals:true},{fact:'security.connector-reserved',equals:false},...(agent==='max'?[{fact:'checkpoint.cleared.max',equals:true}]:[])]);
 }
 add('shift-ready',[{id:'All four stations have their operators',ticks:60,framing:'conveyor-wide',attention:'hold',inputLabel:'Start the staffed line',perform:poses(),effects:[{fact:'line.staffed',value:true},{fact:'conveyor.admitted',value:8}]}]);
 const production=staffedProduction(DAY_ONE_OPERATORS,ids,world.resources,poses());registry[production.id]=production;sequence.push(production.id);
 const departure:Phase[]=[{id:'The shift ends after the first operational output',ticks:40,framing:'conveyor-wide',perform:poses(),effects:[{fact:'day.stage',value:'departure'},{fact:'line.staffed',value:false},{fact:'line.feed-stopped',value:true},{fact:'line.drive-stopped',value:true},{fact:'line.in-flight',value:false}]}];
 const leaving=[...DAY_ONE_CREW,'ed','gus','limen','stiletto'].map(agent=>{
  const from=positions[agent],station=CONVEYOR_STATIONS.find(s=>DAY_ONE_OPERATORS[s.id]===agent);
  const route:Point[]=from[0]>132000?[[from[0],108500],[135000,108500],[134000,106100],[133200,104400],[129000,104500],[124500,104500],[124500,108300]]:agent==='gus'?[[124500,108300]]:agent==='limen'?[[125300,112000]]:[[125300,108300]];
  const prefix=routeSegments(from,route,`${agent} leaves the work area`),exitPoints=SHIFT_ROUTES.departure.slice(5).map(p=>[p[0]*1000,p[1]*1000] as Point);
  if(agent==='sam')exitPoints[2]=[124800,121000];
  const exit=routeSegments(route.at(-1)!,exitPoints,`${agent} leaves the factory`);
  exit.at(-1)!.effects=[{fact:`day.departed.${agent}`,value:true},{fact:`line.crew.${agent}`,value:false},...(station?[{fact:`line.operator.${station.id}`,value:false}]:[])];
  return {agent,prefix,exit,prefixTicks:prefix.reduce((n,s)=>n+s.ticks,0)};
 });
 const firstExit=Math.max(...leaving.map(a=>a.prefixTicks));
 // D3: actual shared exit exchange, not a long-distance workstation reply.
 const holdIndex=(agent:string)=>{const a=leaving.find(a=>a.agent===agent)!,n=a.exit.findIndex(s=>s.to?.[0]===124800&&s.to[1]===(agent==='sam'?121000:123000));if(n<0)throw Error('Missing actual departure conversation waypoint');return n+1;};
 const leadAt=(agent:string)=>{const a=leaving.find(a=>a.agent===agent)!;return firstExit+(agent==='sam'?80:0)+a.exit.slice(0,holdIndex(agent)).reduce((n,s)=>n+s.ticks,0);};
 const together=Math.max(leadAt('bob'),leadAt('sam'));
 for(const agent of ['bob','sam']){
  const a=leaving.find(a=>a.agent===agent)!,wait=together-leadAt(agent);
  a.exit.splice(holdIndex(agent),0,...(wait?[{id:`${agent} waits at the actual exit`,ticks:wait}]:[]),
   {id:agent==='bob'?'D3 exit exchange first line / bob':'sam holds the exit conversation',ticks:34},
   {id:agent==='bob'?'bob holds the exit conversation':'D3 exit exchange second line / sam',ticks:34});
 }
 departure.push(...journeyPhases(world,positions,leaving.map((a,i)=>({agent:a.agent,startTick:firstExit+i*80+(i>1?160:0)-a.prefixTicks,segments:[...a.prefix,...a.exit]})),poses,'approach'));
 add('shift-departure',departure,[{fact:'line.output',equals:3}]);
 add('day-one-night',[{id:'The factory at night',ticks:80,framing:'approach',perform:poses(),effects:[{fact:'day.stage',value:'night'},{fact:'day.complete',value:true}]}],[{fact:'line.output',equals:3},{fact:'line.feed-stopped',equals:true},{fact:'line.drive-stopped',equals:true},{fact:'line.in-flight',equals:false},{fact:'line.staffed',equals:false},...ids.map(id=>({fact:`day.departed.${id}`,equals:true}))]);
}
