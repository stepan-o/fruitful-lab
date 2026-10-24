import {admit,advance,cancel,project} from './kernel';
import {rehearsal,replay,rehearsalSpace} from './rehearsals';
const intent={id:'one',action:'approach',initiator:'worker-07'};
it('atomically reserves actors and station, rejects conflicting work, and ignores duplicate IDs',()=>{
 const t=rehearsal('security','care'),a=admit(t.world,intent,t.registry,t.space);
 expect(Object.values(a.held)).toEqual(['one','one','one']);
 const b=admit(a,{...intent,id:'two'},t.registry,t.space);expect(b.active).toHaveLength(1);expect(b.events.at(-1)?.kind).toBe('rejected');
 expect(admit(a,intent,t.registry,t.space)).toBe(a);expect(t.world.active).toHaveLength(0);
});
it('a supervisor cannot respond to a report that has not been heard',()=>{
 const t=rehearsal('security','care'),s=admit(t.world,{id:'respond',action:'respond',initiator:'limen'},t.registry,t.space);
 expect(s.active).toHaveLength(0);expect(s.events.at(-1)?.detail).toBe('Preconditions changed.');
});
it('speech creates attributed belief, never overwrites the world fact',()=>{
 const t=rehearsal('conveyor','care');t.world.facts['queue.pressure']='low';
 const s=admit(t.world,{id:'report',action:'report',initiator:'worker-07'},t.registry,t.space);
 expect(s.facts['queue.pressure']).toBe('low');expect(s.agents.stiletto.beliefs['queue.pressure']).toMatchObject({value:'high',source:'worker-07',mode:'reported'});
});
it('absent or out-of-range agents cannot hear and cannot supply missing perception',()=>{
 const t=rehearsal('security','care');t.world.agents.limen.position=[140000,122000];
 const s=admit(t.world,{id:'report',action:'report',initiator:'worker-07'},t.registry,t.space);
 expect(s.agents.limen.beliefs['clearance.missing']).toBeUndefined();
 expect(rehearsalSpace.canHear(t.world.agents.limen,{...t.world.agents['worker-07'],room:'conveyor'},t.world)).toBe(false);
});
it('interruption releases all resources, keeps earlier speech, and does not commit later effects',()=>{
 const t=rehearsal('security','care'),s=replay(t,300),id=s.active[0].intent.id,c=cancel(s,id);
 expect(Object.keys(c.held)).toHaveLength(0);expect(c.facts['gate.open']).toBe(false);expect(c.agents.limen.beliefs['clearance.missing'].mode).toBe('reported');
 expect(cancel(c,id)).toBe(c);expect(c.events.at(-1)?.kind).toBe('cancelled');
});
it('a blocked route is rejected before an actor or slot is reserved',()=>{
 const t=rehearsal('security','care'),s=admit(t.world,intent,t.registry,{...t.space,canTraverse:()=>false});expect(s.held).toEqual({});expect(s.active).toEqual([]);
});
it.each(['security','conveyor'] as const)('%s replays both branches deterministically with different remembered consequences',study=>{
 const care=rehearsal(study,'care'),pressure=rehearsal(study,'pressure'),a=replay(care,care.total),b=replay(pressure,pressure.total);
 expect(a).toEqual(replay(care,care.total));expect(a.active).toHaveLength(0);expect(b.active).toHaveLength(0);expect(a.held).toEqual({});
 expect(a.agents['worker-07'].trust).toBeGreaterThan(b.agents['worker-07'].trust);
 expect(a.agents[study==='security'?'limen':'stiletto'].beliefs['worker-07.future-report'].value).toBe('willing');
 expect(b.agents[study==='security'?'limen':'stiletto'].beliefs['worker-07.future-report'].value).toBe('reluctant');
 const after=advance(a,care.registry,care.space,care.planner);expect(after.agents).toEqual(a.agents);expect(after.done).toEqual(a.done);
});
it('projects speech and performance without private reasoning or mind values',()=>{
 const t=rehearsal('security','care'),s=replay(t,70),v=project(s,t.registry);expect(v.bubbles).toHaveLength(1);expect(v.bubbles[0].speaker).toBe('worker-07');
 expect(JSON.stringify(v)).not.toMatch(/beliefs|stress|trust|memory|reason/);
});
it('a camera-free replay/seek cannot mutate the original world or award completion twice',()=>{
 const t=rehearsal('conveyor','pressure'),before=JSON.stringify(t.world);replay(t,t.total);replay(t,70);expect(JSON.stringify(t.world)).toBe(before);expect(()=>replay(t,-1)).toThrow();expect(()=>replay(t,.5)).toThrow();
});

it('doorway speech needs an open connected portal and a listener nearby',()=>{
 const t=rehearsal('threshold','care'),{limen,stiletto}=t.world.agents;
 stiletto.position=[125000,128700];
 expect(t.space.canHear(stiletto,limen,t.world,'shout')).toBe(true);
 expect(t.space.canHear(stiletto,limen,t.world,'local')).toBe(false);
 limen.position=[145000,110000];expect(t.space.canHear(stiletto,limen,t.world,'shout')).toBe(false);
 limen.position=[125000,126400];t.world.facts['portal.security-conveyor.open']=false;
 expect(t.space.canHear(stiletto,limen,t.world,'shout')).toBe(false);
});
it('a supervisor cannot reply before hearing the other room’s report',()=>{
 const t=rehearsal('threshold','care'),s=admit(t.world,{id:'answer',action:'answer',initiator:'limen'},t.registry,t.space);
 expect(s.active).toEqual([]);expect(s.events.at(-1)?.detail).toBe('Preconditions changed.');
});
it('unconnected rooms reject an encounter before reservation',()=>{
 const t=rehearsal('threshold','care'),s=admit(t.world,{id:'approach',action:'approach',initiator:'stiletto'},t.registry,{...t.space,connected:()=>false});
 expect(s.held).toEqual({});expect(s.events.at(-1)?.detail).toBe('Rooms are not connected.');
});
it('day-one disagreement records both motives and producer backing without creating crew or output',()=>{
 const t=rehearsal('threshold','care'),s=replay(t,t.total),other=rehearsal('threshold','pressure'),b=replay(other,other.total);
 expect(s.active).toEqual([]);expect(s.held).toEqual({});expect(s.done).toHaveLength(7);
 expect(s.agents.limen.beliefs['stiletto.priority'].value).toBe('quota');
 expect(s.agents.stiletto.beliefs['limen.priority'].value).toBe('procedure');
 expect(s.agents.stiletto.trust).toBeLessThan(b.agents.stiletto.trust);
 expect(s.agents.limen.trust).toBeGreaterThan(b.agents.limen.trust);
 expect(s.facts['conveyor.crew']).toBe(0);expect(s.facts.output).toBeUndefined();
 expect(s).toEqual(replay(t,t.total));
});

it('moves a group atomically against proposed occupancy, regardless of performer order',()=>{
 const run=(reverse:boolean,blocked=false)=>{
  const t=rehearsal('security','care'),ids=Object.keys(t.world.agents).slice(0,2),[a,b]=ids;
  t.world.agents[a].position=[0,0];t.world.agents[b].position=[1000,0];
  const perform=ids.map((agent,i)=>({agent,motion:'walk' as const,to:[(i+1)*1000,0] as const}));
  t.registry.move={id:'move',room:t.world.agents[a].room,participants:ids,resources:[],requires:[],reason:'Move together',phases:[{id:'step',ticks:1,perform:reverse?perform.reverse():perform}]};
  const space={...t.space,canTraverse:(agent:typeof t.world.agents[string],to:readonly[number,number],world:typeof t.world)=>!Object.values(world.agents).some(other=>other.id!==agent.id&&Math.hypot(other.position[0]-to[0],other.position[1]-to[1])<850)};
  const admitted=admit(t.world,{id:'move',action:'move',initiator:a},t.registry,space);expect(admitted.active).toHaveLength(1);
  const next=advance(admitted,t.registry,blocked?{...space,canTraverse:agent=>agent.id!==b}:space);
  return {positions:ids.map(id=>next.agents[id].position),last:next.events.at(-1)?.kind};
 };
 expect(run(false)).toEqual({positions:[[1000,0],[2000,0]],last:'completed'});expect(run(true)).toEqual(run(false));
 expect(run(false,true)).toEqual({positions:[[0,0],[1000,0]],last:'cancelled'});
});

it('advancing and cancelling cannot mutate any prior snapshot or shared speech',()=>{
 const t=rehearsal('security','care'),state=replay(t,300),saved=JSON.stringify(state);
 const freeze=(value:unknown)=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.freeze(value);Object.values(value).forEach(freeze);}};
 freeze(state);
 expect(()=>advance(state,t.registry,t.space,t.planner)).not.toThrow();
 const next=cancel(state,state.active[0].intent.id);
 expect(JSON.stringify(state)).toBe(saved);
 expect(next.events.filter(e=>e.kind==='speech'&&e.action===state.active[0].intent.id).every(e=>e.until===state.tick)).toBe(true);
});


it('replaces visible speech without erasing what was said or heard',()=>{
 const t=rehearsal('arrival','care');let s=t.world;
 for(let tick=0;tick<t.total;tick++){
  s=advance(s,t.registry,t.space,t.planner);
  const bubbles=project(s,t.registry).bubbles;
  expect(new Set(bubbles.map(b=>b.speaker)).size).toBe(bubbles.length);
 }
 const lines=s.events.filter(e=>e.kind==='speech'&&e.agent==='limen');
 expect(lines.some(e=>e.detail.includes('Welcome to Loopforge'))).toBe(true);
 expect(lines.length).toBeGreaterThan(2);
 expect(s.sequence).toBeGreaterThan(512);
 expect(s.events).toHaveLength(s.sequence);
 expect(s.events.some(e=>e.kind==='heard'&&e.detail.includes('Welcome to Loopforge'))).toBe(true);
 expect(s.events.some(e=>e.kind==='heard')).toBe(true);
});

// Current Conveyor has one workpiece in flight. Selection must not bypass the
// same transition and reservation rules used by the authored episode.
function processFixture(){
 const t=rehearsal('conveyor','care'),actor='worker-07',other='stiletto';
 t.world.facts['line.stage']=0;t.world.facts['line.output']=0;
 const make=(id:string,agent:string,from:number,setup=false):import('./contract').Action=>({id,room:'conveyor',participants:[agent],resources:[],requires:[],reason:'Current single-workpiece operation',phases:[...(setup?[{id:id+'/setup',ticks:2,perform:[{agent,motion:'idle' as const}]}]:[]),{id:id+'/process',ticks:3,perform:[{agent,motion:'idle'}],process:{station:from===0?'intake':'wash',from,to:from+1,operator:{agent,position:t.world.agents[agent].position,within:180}},effects:[{fact:'line.stage',value:from+1}]}]});
 t.registry.first=make('first',actor,0);t.registry.second=make('second',other,1,true);
 return {...t,actor,other,make};
}
it('rejects a stale process stage without reserving or manufacturing a result',()=>{
 const t=processFixture();t.world.facts['line.stage']=2;
 const s=admit(t.world,{id:'first',action:'first',initiator:t.actor},t.registry,t.space);
 expect(s.active).toEqual([]);expect(s.held).toEqual({});expect(s.facts['line.stage']).toBe(2);expect(s.events.at(-1)?.kind).toBe('rejected');
});
it('cancels if the actual workpiece stage changes before the process finishes',()=>{
 const t=processFixture(),s=admit(t.world,{id:'first',action:'first',initiator:t.actor},t.registry,t.space);
 expect(s.active).toHaveLength(1);const changed={...s,facts:{...s.facts,'line.stage':2}};
 const next=advance(changed,t.registry,t.space);expect(next.active).toEqual([]);expect(next.held).toEqual({});expect(next.facts['line.stage']).toBe(2);expect(next.facts['line.output']).toBe(0);expect(next.events.at(-1)?.kind).toBe('cancelled');expect(s.facts['line.stage']).toBe(0);
});
it('reserves the current single workpiece across setup and frees it after completion',()=>{
 const t=processFixture();let s=admit(t.world,{id:'first',action:'first',initiator:t.actor},t.registry,t.space);
 const conflict=admit(s,{id:'second',action:'second',initiator:t.other},t.registry,t.space);
 expect(conflict.active).toHaveLength(1);expect(conflict.events.at(-1)?.kind).toBe('rejected');
 for(let i=0;i<3;i++)s=advance(s,t.registry,t.space);
 expect(s.facts['line.stage']).toBe(1);expect(s.held).toEqual({});
 s=admit(s,{id:'second',action:'second',initiator:t.other},t.registry,t.space);expect(s.active).toHaveLength(1);
 for(let i=0;i<5;i++)s=advance(s,t.registry,t.space);
 expect(s.facts['line.stage']).toBe(2);expect(s.held).toEqual({});expect(s.completed).toEqual(['first','second']);
});
it('rejects a non-adjacent machine transition rather than accepting arbitrary process metadata',()=>{
 const t=processFixture();t.registry.first.phases[0].process!.to=3;
 const s=admit(t.world,{id:'first',action:'first',initiator:t.actor},t.registry,t.space);expect(s.active).toEqual([]);expect(s.held).toEqual({});expect(s.facts['line.stage']).toBe(0);
});
