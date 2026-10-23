import {reserve} from './reservations';
import {applyPropTransfers,propDefinitionError,propResources,propCustodian,custodyBelief} from './props';
import {TICK_MS,type World,type Registry,type Intent,type Action,type Active,type SpatialServices,type Event,type Planner,type View,type Point,type Condition,type ProcessCue} from './contract';
/** Copy mutable containers, share immutable evidence and coordinates. Historical
 * speech does not need serializing on every 20 Hz tick. Cancellation replaces
 * an event before changing its expiry; observations and poses stay immutable. */
const copy=(s:World):World=>({...s,
 agents:Object.fromEntries(Object.entries(s.agents).map(([id,a])=>[id,{...a,beliefs:{...a.beliefs},memory:[...a.memory]}])),
 props:s.props?{...s.props}:undefined,facts:{...s.facts},resources:[...s.resources],held:{...s.held},
 active:s.active.map(a=>({...a,intent:{...a.intent},origins:{...a.origins}})),
 done:[...s.done],events:[...s.events]
});
const actionRooms=(d:Action)=>[d.room,...(d.adjacentRoom?[d.adjacentRoom]:[]),...(d.additionalRooms??[])];
function roomsConnected(d:Action,s:World,space:SpatialServices){const rooms=actionRooms(d),reached=new Set([d.room]);for(let i=0;i<rooms.length;i++)for(const room of rooms)if(rooms.some(other=>reached.has(other)&&space.connected(other,room,s)))reached.add(room);return rooms.every(room=>reached.has(room));}
function emit(s:World,e:Omit<Event,'id'|'tick'>){s.events.push({...e,id:`event-${++s.sequence}`,tick:s.tick});if(s.events.length>512)s.events.shift();}
function free(s:World,id:string){for(const key of Object.keys(s.held))if(s.held[key]===id)delete s.held[key];}
function startPhase(s:World,a:Active,d:Action,space:SpatialServices){
 const phase=d.phases[a.phase];a.start=s.tick;a.origins={};
 for(const p of phase.perform){a.origins[p.agent]=s.agents[p.agent].position;if(p.yaw!==undefined)s.agents[p.agent].yaw=p.yaw;}
 for(const speech of phase.say??[]){
  const speaker=s.agents[speech.speaker];
  // Replace this actor's visible line, retaining the event and listeners' memories.
  s.events=s.events.map(e=>e.kind==='speech'&&e.agent===speaker.id&&(e.until??0)>s.tick?{...e,until:s.tick}:e);
  emit(s,{kind:'speech',action:a.intent.id,agent:speaker.id,detail:speech.text,speech,until:s.tick+Math.ceil(speech.seconds*1000/TICK_MS)});
  // An utterance is evidence of what a speaker says, not automatic world truth.
  for(const id of speech.to){const listener=s.agents[id];if(!listener||!space.canHear(speaker,listener,s,speech.channel))continue;
   if(speech.claim)listener.beliefs[speech.claim.fact]={value:speech.claim.value,source:speaker.id,mode:'reported',tick:s.tick};
   listener.memory=[...listener.memory,`${speaker.name}: ${speech.text}`].slice(-16);
   emit(s,{kind:'heard',action:a.intent.id,agent:id,detail:`Heard ${speaker.name}: ${speech.text}`});
  }
 }
}
/** Check simultaneous movement against the same proposed occupancy. Commit only
 * after every route passes, so participant order cannot change a crowd's motion. */
function routesClear(s:World,moves:readonly {agent:string;to:Point}[],space:SpatialServices){
 const proposed={...s,agents:{...s.agents}};
 for(const move of moves)proposed.agents[move.agent]={...s.agents[move.agent],position:move.to};
 return moves.every(move=>space.canTraverse(s.agents[move.agent],move.to,proposed));
}
function conditionHolds(s:World,c:Condition):boolean {
 if('prop'in c)return !!s.props?.[c.prop]&&(propCustodian(s,c.prop)===c.heldBy)===c.equals;
 if('near'in c){const a=s.agents[c.agent],b=s.agents[c.near];return !!a&&!!b&&Number.isFinite(c.within)&&c.within>=0&&Math.hypot(a.position[0]-b.position[0],a.position[1]-b.position[1])<=c.within;}
 return 'fact'in c?s.facts[c.fact]===c.equals:'belief'in c?s.agents[c.agent]?.beliefs[c.belief]?.value===c.equals:(s.agents[c.agent]?.[c.feeling]??-1)>=c.atLeast;
}
/** A machine can run only while its reserved operator occupies the control socket.
 * This belongs to world authority; animation playback cannot manufacture output. */
function processReady(s:World,p:ProcessCue|undefined){
 if(!p)return true;
 const a=s.agents[p.operator.agent];return !!a&&Math.hypot(a.position[0]-p.operator.position[0],a.position[1]-p.operator.position[1])<=p.operator.within;
}
function rejection(s:World,i:Intent,d:Action|undefined,space:SpatialServices):string|null {
 if(!d)return 'Unknown action.';
 if(!roomsConnected(d,s,space))return 'Rooms are not connected.';
 if(!d.participants.includes(i.initiator))return 'Initiator is not a participant.';
 if(d.participants.some(id=>!s.agents[id]||!actionRooms(d).includes(s.agents[id].room)))return 'Participants must be in the action room.';
 if(d.resources.some(id=>!s.resources.includes(id)))return 'Station or prop is unavailable.';
 if(d.requires.some(c=>!conditionHolds(s,c)))return 'Preconditions changed.';
 if(d.phases.some(p=>p.effects?.some(e=>'fact'in e?e.observedBy?.some(id=>!d.participants.includes(id)):!d.participants.includes(e.agent))))return 'Invalid effect observer.';
 if(d.phases.some(p=>p.process&&(!d.participants.includes(p.process.operator.agent)||!Number.isFinite(p.process.operator.within)||p.process.operator.within<0||!p.process.operator.position.every(Number.isFinite))))return 'Invalid machine operator.';
 if(!d.phases.length||d.phases.some(p=>!Number.isInteger(p.ticks)||p.ticks<1||p.perform.some(v=>!d.participants.includes(v.agent))||(p.say??[]).some(v=>!d.participants.includes(v.speaker))))return 'Invalid action definition.';
 // Admission validates the first phase. Later paths are checked as they execute,
 // against clearance and positions established by earlier phases. Predicting
 // every future route from the initial world wrongly rejects earned admission.
 const propError=propDefinitionError(s,d);if(propError)return propError;
 if(!processReady(s,d.phases[0].process))return 'Machine operator is away from the controls.';
 const moves=d.phases[0].perform.flatMap(v=>v.to?[{agent:v.agent,to:v.to}]:[]);
 if(!routesClear(s,moves,space))return 'Reserved route is not traversable.';
 return null;
}
export function admit(world:World,intent:Intent,registry:Registry,space:SpatialServices):World {
 if(world.done.includes(intent.id)||world.active.some(a=>a.intent.id===intent.id))return world;
 const s=copy(world),d=registry[intent.action],invalid=rejection(s,intent,d,space);
 const held=invalid?null:reserve([...d.participants.map(id=>`actor:${id}`),...d.resources,...propResources(d)],intent.id,s.held);
 if(invalid||!held){emit(s,{kind:'rejected',action:intent.id,agent:intent.initiator,detail:invalid??'Participants or station are already reserved.'});return s;}
 s.held=held;const a:Active={intent:{...intent},phase:0,start:s.tick,origins:{}};s.active.push(a);
 emit(s,{kind:'admitted',action:intent.id,agent:intent.initiator,detail:d.reason});startPhase(s,a,d,space);return s;
}
export function cancel(world:World,id:string):World {
 const found=world.active.find(a=>a.intent.id===id);if(!found)return world;
 const s=copy(world);free(s,id);s.active=s.active.filter(a=>a.intent.id!==id);s.done.push(id);
 // Already spoken/heard information persists; pending physical outcomes are not committed.
 s.events=s.events.map(e=>e.kind==='speech'&&e.action===id?{...e,until:s.tick}:e);
 emit(s,{kind:'cancelled',action:id,detail:'Action interrupted; resources released. Earlier observations remain.'});return s;
}
export function advance(world:World,registry:Registry,space:SpatialServices,planner?:Planner):World {
 let s=copy(world);s.tick++;
 for(const id of s.active.map(a=>a.intent.id)){
  const a=s.active.find(a=>a.intent.id===id);if(!a)continue;
  const d=registry[a.intent.action],p=d.phases[a.phase];
  if(!roomsConnected(d,s,space)||d.participants.some(id=>!actionRooms(d).includes(s.agents[id]?.room))){s=cancel(s,a.intent.id);continue;}
  if(!processReady(s,p.process)){s=cancel(s,a.intent.id);continue;}
  const t=Math.min(1,(s.tick-a.start)/p.ticks);
  const moves=p.perform.flatMap(v=>{if(!v.to)return [];const from=a.origins[v.agent],to:Point=[Math.round(from[0]+(v.to[0]-from[0])*t),Math.round(from[1]+(v.to[1]-from[1])*t)];return [{agent:v.agent,to}];});
  if(!routesClear(s,moves,space)){s=cancel(s,a.intent.id);continue;}
  for(const move of moves){s.agents[move.agent].position=move.to;const room=space.roomAt?.(move.to);if(room)s.agents[move.agent].room=room;}
  if(!processReady(s,p.process)){s=cancel(s,a.intent.id);continue;}
  if(t<1)continue;
  if(d.requires.some(c=>('prop'in c||'near'in c)&&!conditionHolds(s,c))){s=cancel(s,a.intent.id);continue;}
  const transfers=applyPropTransfers(s,p.transfers??[]);
  if(transfers===null){s=cancel(s,a.intent.id);continue;}
  if(p.transfers?.length){s.props=transfers;for(const transfer of p.transfers){
   // Ownership grants no knowledge. Only actors who perceive this contact learn custody.
   for(const id of transfer.observedBy??[])s.agents[id].beliefs[custodyBelief(transfer.prop)]={value:propCustodian(s,transfer.prop)??'floor',source:a.intent.id,mode:'observed',tick:s.tick};
   emit(s,{kind:'prop-transferred',action:a.intent.id,detail:JSON.stringify(transfer)});
  }}
  for(const e of p.effects??[]){
   if('fact'in e){s.facts[e.fact]=e.value;for(const id of e.observedBy??d.participants)s.agents[id].beliefs[e.fact]={value:e.value,source:a.intent.id,mode:'observed',tick:s.tick};}
   else {const actor=s.agents[e.agent];if(e.observe)actor.beliefs[e.observe.fact]={value:e.observe.value,source:a.intent.id,mode:'observed',tick:s.tick};actor.stress=Math.max(0,Math.min(100,actor.stress+(e.stress??0)));actor.trust=Math.max(0,Math.min(100,actor.trust+(e.trust??0)));if(e.remember)actor.memory=[...actor.memory,e.remember].slice(-16);}
   emit(s,{kind:'effect',action:a.intent.id,detail:JSON.stringify(e)});
  }
  if(++a.phase<d.phases.length)startPhase(s,a,d,space);
  else{free(s,a.intent.id);s.active=s.active.filter(v=>v.intent.id!==a.intent.id);s.done.push(a.intent.id);emit(s,{kind:'completed',action:a.intent.id,detail:d.id});}
 }
 for(const i of planner?.propose(s)??[])s=admit(s,i,registry,space);
 return s;
}
/** Player projection deliberately excludes beliefs, stress, trust and internal reasoning. */
export function project(s:World,registry:Registry,finished=false):View {
 const completedByActor=new Map<string,Event>();
 for(let i=s.events.length-1;i>=0;i--){const e=s.events[i];if(e.kind==='completed')for(const id of registry[e.detail]?.participants??[])if(!completedByActor.has(id))completedByActor.set(id,e);}
 const machine=s.active.map(a=>({a,p:registry[a.intent.action].phases[a.phase]})).find(v=>v.p.process&&processReady(s,v.p.process));
 return {process:typeof s.facts['line.stage']==='number'?{stage:s.facts['line.stage'],output:Number(s.facts['line.output']??0),active:machine?.p.process,progress:machine?Math.min(1,(s.tick-machine.a.start)/machine.p.ticks):0}:undefined,framing:s.active[0]?registry[s.active[0].intent.action].phases[s.active[0].phase].framing:undefined,tick:s.tick,actors:Object.values(s.agents).map(agent=>{
  const a=s.active.find(v=>registry[v.intent.action].participants.includes(agent.id));
  const completed=completedByActor.get(agent.id);
  const settled=completed?registry[completed.detail].phases.at(-1):undefined;
  const last=settled??Object.values(registry).find(d=>d.participants.includes(agent.id))?.phases[0];
  const p=a?registry[a.intent.action].phases[a.phase]:last,v=p?.perform.find(v=>v.agent===agent.id);
  const previous=a?(a.phase>0?registry[a.intent.action].phases[a.phase-1]:settled??null):null;
  const prior=previous?.perform.find(p=>p.agent===agent.id)?.cue;
  const seconds=(a?s.tick-a.start:settled?.ticks??0)*TICK_MS/1000;
  const continuous=v?.cue&&prior&&v.cue.clip===prior.clip&&(v.cue.rate??1)===(prior.rate??1)&&Math.abs((v.cue.start??0)-((prior.start??0)+previous!.ticks*TICK_MS/1000*(prior.rate??1)))<.001;
  const blend=v?.cue&&prior&&!continuous?(v.cue.blend===0?1:Math.min(1,seconds/(v.cue.blend??.35))):1;
  return {cue:v?.cue,previous:prior?{cue:prior,seconds:previous!.ticks*TICK_MS/1000,yaw:previous!.perform.find(p=>p.agent===agent.id)?.yaw}:undefined,blend,id:agent.id,name:agent.name,character:agent.character,position:agent.position,yaw:agent.yaw,motion:v?.motion??'idle',seconds,action:a?`${a.intent.id}/${a.phase}`:'idle'};
 }),props:Object.values(s.props??{}).filter(p=>p.location.kind!=='stowed'),bubbles:s.events.filter(e=>e.kind==='speech'&&(e.until??0)>s.tick&&!!e.speech).slice(-2).map(e=>({id:e.id,speaker:e.speech!.speaker,to:e.speech!.to,text:e.speech!.text,act:e.speech!.act,delivery:e.speech!.delivery,age:(s.tick-e.tick)*TICK_MS/1000})),gateOpen:s.facts['gate.open']===true,drive:s.facts['drive.mode']??'steady',phase:s.active.map(a=>registry[a.intent.action].phases[a.phase].id).join(' · ')||(s.tick===0?'Ready for the first count.':'The exchange has settled.'),finished};
}
