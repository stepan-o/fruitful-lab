import {reserve} from './reservations';
import {TICK_MS,type World,type Registry,type Intent,type Action,type Active,type SpatialServices,type Event,type Planner,type View} from './contract';
const copy=(s:World):World=>JSON.parse(JSON.stringify(s));
function emit(s:World,e:Omit<Event,'id'|'tick'>){s.events.push({...e,id:`event-${++s.sequence}`,tick:s.tick});if(s.events.length>512)s.events.shift();}
function free(s:World,id:string){for(const key of Object.keys(s.held))if(s.held[key]===id)delete s.held[key];}
function startPhase(s:World,a:Active,d:Action,space:SpatialServices){
 const phase=d.phases[a.phase];a.start=s.tick;a.origins={};
 for(const p of phase.perform){a.origins[p.agent]=s.agents[p.agent].position;if(p.yaw!==undefined)s.agents[p.agent].yaw=p.yaw;}
 for(const speech of phase.say??[]){
  const speaker=s.agents[speech.speaker];
  emit(s,{kind:'speech',action:a.intent.id,agent:speaker.id,detail:speech.text,speech,until:s.tick+Math.ceil(speech.seconds*1000/TICK_MS)});
  // An utterance is evidence of what a speaker says, not automatic world truth.
  for(const id of speech.to){const listener=s.agents[id];if(!listener||!space.canHear(speaker,listener,s,speech.channel))continue;
   if(speech.claim)listener.beliefs[speech.claim.fact]={value:speech.claim.value,source:speaker.id,mode:'reported',tick:s.tick};
   listener.memory=[...listener.memory,`${speaker.name}: ${speech.text}`].slice(-16);
   emit(s,{kind:'heard',action:a.intent.id,agent:id,detail:`Heard ${speaker.name}: ${speech.text}`});
  }
 }
}
function rejection(s:World,i:Intent,d:Action|undefined,space:SpatialServices):string|null {
 if(!d)return 'Unknown action.';
 if(d.adjacentRoom&&!space.connected(d.room,d.adjacentRoom,s))return 'Rooms are not connected.';
 if(!d.participants.includes(i.initiator))return 'Initiator is not a participant.';
 if(d.participants.some(id=>!s.agents[id]||![d.room,d.adjacentRoom].includes(s.agents[id].room)))return 'Participants must be in the action room.';
 if(d.resources.some(id=>!s.resources.includes(id)))return 'Station or prop is unavailable.';
 if(d.requires.some(c=>'fact'in c?s.facts[c.fact]!==c.equals:'belief'in c?s.agents[c.agent]?.beliefs[c.belief]?.value!==c.equals:(s.agents[c.agent]?.[c.feeling]??-1)<c.atLeast))return 'Preconditions changed.';
 if(!d.phases.length||d.phases.some(p=>!Number.isInteger(p.ticks)||p.ticks<1||p.perform.some(v=>!d.participants.includes(v.agent))||(p.say??[]).some(v=>!d.participants.includes(v.speaker))))return 'Invalid action definition.';
 // Validate every authored path against the supplied navigation service before taking ownership.
 for(const p of d.phases)for(const v of p.perform)if(v.to&&!space.canTraverse(s.agents[v.agent],v.to,s))return 'Reserved route is not traversable.';
 return null;
}
export function admit(world:World,intent:Intent,registry:Registry,space:SpatialServices):World {
 if(world.done.includes(intent.id)||world.active.some(a=>a.intent.id===intent.id))return world;
 const s=copy(world),d=registry[intent.action],invalid=rejection(s,intent,d,space);
 const held=invalid?null:reserve([...d.participants.map(id=>`actor:${id}`),...d.resources],intent.id,s.held);
 if(invalid||!held){emit(s,{kind:'rejected',action:intent.id,agent:intent.initiator,detail:invalid??'Participants or station are already reserved.'});return s;}
 s.held=held;const a:Active={intent:{...intent},phase:0,start:s.tick,origins:{}};s.active.push(a);
 emit(s,{kind:'admitted',action:intent.id,agent:intent.initiator,detail:d.reason});startPhase(s,a,d,space);return s;
}
export function cancel(world:World,id:string):World {
 const found=world.active.find(a=>a.intent.id===id);if(!found)return world;
 const s=copy(world);free(s,id);s.active=s.active.filter(a=>a.intent.id!==id);s.done.push(id);
 // Already spoken/heard information persists; pending physical outcomes are not committed.
 for(const e of s.events)if(e.kind==='speech'&&e.action===id)e.until=s.tick;
 emit(s,{kind:'cancelled',action:id,detail:'Action interrupted; resources released. Earlier observations remain.'});return s;
}
export function advance(world:World,registry:Registry,space:SpatialServices,planner?:Planner):World {
 let s=copy(world);s.tick++;
 for(const id of s.active.map(a=>a.intent.id)){
  const a=s.active.find(a=>a.intent.id===id);if(!a)continue;
  const d=registry[a.intent.action],p=d.phases[a.phase];
  if((d.adjacentRoom&&!space.connected(d.room,d.adjacentRoom,s))||d.participants.some(id=>![d.room,d.adjacentRoom].includes(s.agents[id]?.room))){s=cancel(s,a.intent.id);continue;}
  const t=Math.min(1,(s.tick-a.start)/p.ticks);
  let blocked=false;
  for(const v of p.perform)if(v.to){const from=a.origins[v.agent],next:readonly[number,number]=[Math.round(from[0]+(v.to[0]-from[0])*t),Math.round(from[1]+(v.to[1]-from[1])*t)];if(!space.canTraverse(s.agents[v.agent],next,s)){blocked=true;break;}s.agents[v.agent].position=next;const room=space.roomAt?.(next);if(room)s.agents[v.agent].room=room;}
  if(blocked){s=cancel(s,a.intent.id);continue;}
  if(t<1)continue;
  for(const e of p.effects??[]){
   if('fact'in e){s.facts[e.fact]=e.value;for(const id of d.participants)s.agents[id].beliefs[e.fact]={value:e.value,source:a.intent.id,mode:'observed',tick:s.tick};}
   else {const actor=s.agents[e.agent];actor.stress=Math.max(0,Math.min(100,actor.stress+(e.stress??0)));actor.trust=Math.max(0,Math.min(100,actor.trust+(e.trust??0)));if(e.remember)actor.memory=[...actor.memory,e.remember].slice(-16);}
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
 return {framing:s.active[0]?registry[s.active[0].intent.action].phases[s.active[0].phase].framing:undefined,tick:s.tick,actors:Object.values(s.agents).map(agent=>{
  const a=s.active.find(v=>registry[v.intent.action].participants.includes(agent.id));
  const completed=[...s.events].reverse().find(e=>e.kind==='completed'&&registry[e.detail]?.participants.includes(agent.id));
  const settled=completed?registry[completed.detail].phases.at(-1):undefined;
  const last=settled??Object.values(registry).find(d=>d.participants.includes(agent.id))?.phases[0];
  const p=a?registry[a.intent.action].phases[a.phase]:last,v=p?.perform.find(v=>v.agent===agent.id);
  const previous=a?(a.phase>0?registry[a.intent.action].phases[a.phase-1]:settled??null):null;
  const prior=previous?.perform.find(p=>p.agent===agent.id)?.cue;
  const seconds=(a?s.tick-a.start:settled?.ticks??0)*TICK_MS/1000;
  const continuous=v?.cue&&prior&&v.cue.clip===prior.clip&&(v.cue.rate??1)===(prior.rate??1)&&Math.abs((v.cue.start??0)-((prior.start??0)+previous!.ticks*TICK_MS/1000*(prior.rate??1)))<.001;
  const blend=v?.cue&&prior&&!continuous?(v.cue.blend===0?1:Math.min(1,seconds/(v.cue.blend??.35))):1;
  return {cue:v?.cue,previous:prior?{cue:prior,seconds:previous!.ticks*TICK_MS/1000,yaw:previous!.perform.find(p=>p.agent===agent.id)?.yaw}:undefined,blend,id:agent.id,name:agent.name,character:agent.character,position:agent.position,yaw:agent.yaw,motion:v?.motion??'idle',seconds,action:a?`${a.intent.id}/${a.phase}`:'idle'};
 }),bubbles:s.events.filter(e=>e.kind==='speech'&&(e.until??0)>s.tick&&!!e.speech).slice(-2).map(e=>({id:e.id,speaker:e.speech!.speaker,to:e.speech!.to,text:e.speech!.text,act:e.speech!.act})),gateOpen:s.facts['gate.open']===true,drive:s.facts['drive.mode']??'steady',phase:s.active.map(a=>registry[a.intent.action].phases[a.phase].id).join(' · ')||(s.tick===0?'Ready for the first count.':'The exchange has settled.'),finished};
}
