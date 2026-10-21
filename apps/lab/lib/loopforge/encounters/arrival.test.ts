import {rehearsal,replay} from './rehearsals';
import {advance,admit,cancel,project} from './kernel';
import {ARRIVAL_WORKERS} from './arrival';
import {arrivalSpace} from './arrival-layout';
const take=()=>rehearsal('arrival','care');
function startOf(t:ReturnType<typeof take>,name:string){let n=1;for(const a of Object.values(t.registry))for(const p of a.phases){if(p.id===name)return n;n+=p.ticks;}throw Error(name);}
it('performs the cast script without route cancellation and retains injury, checks and assignments',()=>{
 const t=take();let s=t.world,minimum=Infinity,lastSequence=0;const spoken:string[]=[],effects:string[]=[];
 for(let i=0;i<t.total;i++){
  s=advance(s,t.registry,t.space,t.planner);
  for(const e of s.events.filter(e=>Number(e.id.split('-')[1])>lastSequence)){
   if(['cancelled','rejected'].includes(e.kind))throw Error(`${e.kind} at ${s.tick}: ${e.action} / ${e.detail} / ${JSON.stringify(project(s,t.registry).actors.map(a=>({id:a.id,pos:a.position,action:a.action})))}`);
   if(e.kind==='speech')spoken.push(e.detail);if(e.kind==='effect')effects.push(e.detail);
  }lastSequence=s.sequence;
  const agents=Object.values(s.agents);for(let a=0;a<agents.length;a++)for(let b=a+1;b<agents.length;b++)minimum=Math.min(minimum,Math.hypot(agents[a].position[0]-agents[b].position[0],agents[a].position[1]-agents[b].position[1]));
 }
 expect(s.done).toEqual(['morning','first-checks','passage','bobs-turn']);expect(s.active).toEqual([]);expect(s.held).toEqual({});expect(minimum).toBeGreaterThanOrEqual(850);
 expect(Object.keys(s.agents)).toHaveLength(12);for(const id of ARRIVAL_WORKERS)expect(s.agents[id].name).toBe(id);
 expect(spoken).toEqual(Object.values(t.registry).flatMap(a=>a.phases.flatMap(p=>(p.say??[]).map(v=>v.text))));
 expect(effects.filter(v=>v.includes('"fact":"injury.bob"'))).toHaveLength(1);
 expect(s.facts).toMatchObject({'injury.bob':'limping','security.clerks':2,'checkpoint.cleared.ed':true,'checkpoint.cleared.gus':true,'checkpoint.cleared.bob':true,'assignment.ed':'security','assignment.gus':'security','assignment.sam':'conveyor','conveyor.admitted':1});
 expect(s.agents.ed.room).toBe('security');expect(s.agents.gus.room).toBe('security');expect(s.agents.stiletto.room).toBe('conveyor');expect(s.agents.bob.room).toBe('security');
 expect(ARRIVAL_WORKERS.filter(id=>s.agents[id].room==='lobby')).toHaveLength(7);expect(advance(s,t.registry,t.space,t.planner).agents).toEqual(s.agents);
});
it('STILETTO passes after the first two checks while bob remains down',()=>{
 const t=take(),s=replay(t,startOf(t,'The main door opens behind them')),v=project(s,t.registry);
 expect(s.facts['checkpoint.cleared.ed']).toBe(true);expect(s.facts['checkpoint.cleared.gus']).toBe(true);expect(s.facts['checkpoint.cleared.bob']).toBeUndefined();
 expect(v.actors.find(a=>a.id==='bob')).toMatchObject({motion:'fall',cue:{clip:'Electrocuted_Fall',rate:0}});
 for(const p of t.registry.passage.phases.slice(0,-1))expect(p.perform.find(a=>a.agent==='stiletto')).toMatchObject({motion:'walk',cue:{clip:'Quick_Walk'}});
 expect(startOf(t,'bob gets his sound leg underneath')).toBeGreaterThan(startOf(t,'STILETTO enters Conveyor'));
});
it('clearance opens the route only for the checked worker',()=>{
 const t=take(),bob=t.world.agents.bob;bob.position=[123000,112500];
 expect(arrivalSpace.canTraverse(bob,[123000,110000],t.world)).toBe(false);t.world.facts['checkpoint.cleared.ed']=true;expect(arrivalSpace.canTraverse(bob,[123000,110000],t.world)).toBe(false);
 t.world.facts['checkpoint.cleared.bob']=true;expect(arrivalSpace.canTraverse(bob,[123000,110000],t.world)).toBe(true);expect(arrivalSpace.canHear(t.world.agents.limen,bob,t.world,'shout')).toBe(true);
});
it('interrupting the swing cannot award injury or advance to the checks',()=>{
 const t=take(),s=cancel(replay(t,startOf(t,'Blade contact')),'morning');expect(s.facts['injury.bob']).toBeUndefined();expect(s.held).toEqual({});expect(t.planner.propose(s)).toEqual([]);
 expect(admit(s,{id:'first-checks',action:'first-checks',initiator:'limen'},t.registry,t.space).events.at(-1)?.kind).toBe('rejected');
});
it('cuts at dramatic turns and keeps deterministic public performance and deterministic public performance',()=>{
 const t=take(),shots:string[]=[];for(const a of Object.values(t.registry))for(const p of a.phases)if(p.framing!==shots.at(-1))shots.push(p.framing!);
 expect(shots).toEqual(['approach','assembly','impact','card','assembly','passage','threshold','aftermath','threshold']);const at=startOf(t,'LIMEN yields the threshold')+8,a=project(replay(t,at),t.registry);expect(a).toEqual(project(replay(t,at),t.registry));
 expect(a.actors.find(v=>v.id==='limen')?.cue?.clip).toBe('Step_Back');expect(JSON.stringify(a)).not.toMatch(/beliefs|stress|trust|memory/);expect(JSON.stringify(t.registry)).not.toMatch(/baton|All_Night_Dance|Boxing_Warmup/);
 const bob=t.world.agents.bob,to=t.registry.morning.phases[0].perform.find(p=>p.agent==='bob')!.to!;expect(to[1]).toBeLessThan(bob.position[1]);expect(bob.yaw).toBe(180);
});
it('revoking an earned clearance interrupts the crossing before the doorway',()=>{
 const t=take();let s=replay(t,startOf(t,'ed crosses after clearance'));s.facts['checkpoint.cleared.ed']=false;
 for(let i=0;i<80&&!s.events.some(e=>e.kind==='cancelled');i++)s=advance(s,t.registry,t.space);
 expect(s.events.some(e=>e.kind==='cancelled'&&e.action==='first-checks')).toBe(true);expect(s.agents.ed.room).toBe('lobby');expect(s.held).toEqual({});
});
it('keeps bob down and sam attending continuously while the others handle IDs',()=>{
 const t=take();
 for(const name of ['Everyone prepares their IDs','ed lifts the card','STILETTO passes without stopping']){
  const v=project(replay(t,startOf(t,name)+20),t.registry);
  expect(v.actors.find(a=>a.id==='bob')?.cue).toMatchObject({clip:'Electrocuted_Fall',start:6.333,rate:0});
  expect(v.actors.find(a=>a.id==='sam')?.cue).toMatchObject({clip:'Attend_Bob',loop:true,rootMotion:'preserve'});
  expect(v.props?.find(p=>p.id==='sam:id')).toBeUndefined();
 }
});

it('faces worker locomotion along its route before settling into the next pose',()=>{
 const t=take(),positions=Object.fromEntries(Object.values(t.world.agents).map(a=>[a.id,a.position]));
 for(const action of Object.values(t.registry))for(const phase of action.phases)for(const p of phase.perform){
  if(p.to&&ARRIVAL_WORKERS.includes(p.agent as typeof ARRIVAL_WORKERS[number])&&['walk','limp'].includes(p.motion)){
   const from=positions[p.agent],dx=p.to[0]-from[0],dy=p.to[1]-from[1],length=Math.hypot(dx,dy);
   if(length){const angle=p.yaw!*Math.PI/180;expect((-Math.sin(angle)*dx+Math.cos(angle)*dy)/length).toBeGreaterThan(.999);}
  }
  if(p.to)positions[p.agent]=p.to;
 }
});

it('keeps the opening concise without speeding up contact time independently of custody',()=>{
 const t=take();expect(t.total/20).toBeLessThanOrEqual(140);
 const phases=Object.values(t.registry).flatMap(a=>a.phases);
 expect(phases.flatMap(p=>p.say??[]).length).toBeLessThanOrEqual(32);
 for(const [name,seconds] of [['ed collects bob’s card',1.5],['ed stows bob’s card',1.6],['ed reaches for his own card',2]] as const){
  const p=phases.find(p=>p.id===name)!,c=p.perform.find(p=>p.agent==='ed')!.cue!;
  expect((c.start??0)+p.ticks/20*(c.rate??1)).toBeCloseTo(seconds,5);
  expect(p.transfers).toHaveLength(1);
 }
 expect(phases.find(p=>p.id==='Blade contact')!.perform.find(p=>p.agent==='bob')!.cue?.rate).toBe(1);
});
