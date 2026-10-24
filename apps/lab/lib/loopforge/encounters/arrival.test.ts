import {ARRIVAL_LAYOUT} from './arrival-layout';
import {rehearsal,replay} from './rehearsals';
import {advance,admit,cancel,project} from './kernel';
import {ARRIVAL_WORKERS} from './arrival';
import {arrivalSpace} from './arrival-layout';
import {phaseSpeech} from './shared-actions';
import {entryPlayback} from './entry-playback';
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
  const agents=Object.values(s.agents).filter(a=>s.facts[`day.departed.${a.id}`]!==true);for(let a=0;a<agents.length;a++)for(let b=a+1;b<agents.length;b++)minimum=Math.min(minimum,Math.hypot(agents[a].position[0]-agents[b].position[0],agents[a].position[1]-agents[b].position[1]));
 }
 expect(s.done).toEqual(Object.keys(t.registry));expect(s.done.slice(0,10)).toEqual(['morning','passage','bobs-turn','intake','wash','belt','forge','sam-second','helpers','first-output']);expect(s.active).toEqual([]);expect(s.held).toEqual({});expect(minimum).toBeGreaterThanOrEqual(850);
 expect(Object.keys(s.agents)).toHaveLength(12);for(const id of ARRIVAL_WORKERS)expect(s.agents[id].name).toBe(id);
 expect(spoken).toEqual(Object.values(t.registry).flatMap(a=>a.phases.flatMap(p=>phaseSpeech(p).map(v=>v.text))));
 expect(effects.filter(v=>v.includes('"fact":"injury.bob"'))).toHaveLength(1);
 expect(s.facts).toMatchObject({'injury.bob':'limping','security.clerks':2,'checkpoint.cleared.ed':true,'checkpoint.cleared.gus':true,'checkpoint.cleared.bob':true,'assignment.ed':'security','assignment.gus':'security','assignment.sam':'conveyor','conveyor.admitted':8,'checkpoint.workers-passed':8,'checkpoint.check-number':3,'checkpoint.current-applicant':'jo','line.stage':4,'line.output':3});
 expect(s.facts['day.stage']).toBe('night');expect(s.facts['line.tutorial-output']).toBe(1);expect(Object.values(s.agents).every(a=>s.facts[`day.departed.${a.id}`]===true)).toBe(true);expect(project(s,t.registry).actors.every(a=>a.visible===false)).toBe(true);
 expect(ARRIVAL_WORKERS.filter(id=>s.agents[id].room==='outside')).toHaveLength(10);expect(advance(s,t.registry,t.space,t.planner).agents).toEqual(s.agents);
});
it('STILETTO passes during bob’s recovery, before LIMEN recruits the helpers',()=>{
 const t=take(),s=replay(t,startOf(t,'bob gets up as STILETTO arrives')),v=project(s,t.registry);
 expect(s.facts['checkpoint.cleared.ed']).toBeUndefined();expect(s.facts['checkpoint.cleared.gus']).toBeUndefined();expect(s.facts['checkpoint.cleared.bob']).toBeUndefined();
 expect(v.actors.find(a=>a.id==='bob')).toMatchObject({motion:'recover',cue:{clip:'Checkpoint_Get_Up'}});
 for(const p of t.registry.passage.phases)expect(p.perform.find(a=>a.agent==='stiletto')).toMatchObject({motion:'walk',cue:{clip:'Quick_Walk'}});
 expect(startOf(t,'Who cares about this factory?')).toBeGreaterThan(startOf(t,'bob reaches Conveyor'));
});
it('clearance opens the route only for the checked worker',()=>{
 const t=take(),bob=t.world.agents.bob;bob.position=[123000,112500];
 expect(arrivalSpace.canTraverse(bob,[123000,110000],t.world)).toBe(false);t.world.facts['checkpoint.cleared.ed']=true;expect(arrivalSpace.canTraverse(bob,[123000,110000],t.world)).toBe(false);
 t.world.facts['checkpoint.cleared.bob']=true;expect(arrivalSpace.canTraverse(bob,[123000,110000],t.world)).toBe(true);expect(arrivalSpace.canHear(t.world.agents.limen,bob,t.world,'shout')).toBe(true);
});
it('interrupting the swing cannot award injury or advance to the checks',()=>{
 const t=take(),s=cancel(replay(t,startOf(t,'Blade contact')),'morning');expect(s.facts['injury.bob']).toBeUndefined();expect(s.held).toEqual({});expect(t.planner.propose(s)).toEqual([]);
 expect(admit(s,{id:'helpers',action:'helpers',initiator:'limen'},t.registry,t.space).events.at(-1)?.kind).toBe('rejected');
});
it('cuts at dramatic turns and keeps deterministic public performance',()=>{
 const t=take(),shots:string[]=[];for(const a of Object.values(t.registry).slice(0,10))for(const p of a.phases)if(p.framing!==shots.at(-1))shots.push(p.framing!);
 expect(shots.slice(0,8)).toEqual(['approach','limen-emphasis','workers-reverse','limen-emphasis','impact','card','passage','threshold']);expect(shots).toEqual(expect.arrayContaining(['sam-inspection','checkpoint','intake','wash','belt','forge']));expect(t.registry['doorway-threat'].phases.find(p=>p.id==='STILETTO demands the rest of the shift')?.framing).toBe('doorway-pressure');const at=startOf(t,'LIMEN yields the threshold')+8,a=project(replay(t,at),t.registry);expect(a).toEqual(project(replay(t,at),t.registry));
 expect(a.actors.find(v=>v.id==='limen')?.cue?.clip).toBe('Step_Back');expect(JSON.stringify(a)).not.toMatch(/beliefs|stress|trust|memory/);expect(JSON.stringify(t.registry)).not.toMatch(/baton|All_Night_Dance|Boxing_Warmup/);
 const bob=t.world.agents.bob,to=t.registry.morning.phases[0].perform.find(p=>p.agent==='bob')!.to!;expect(to[1]).toBeLessThan(bob.position[1]);expect(bob.yaw).toBe(180);
});
it('revoking an earned clearance interrupts the crossing before the doorway',()=>{
 const t=take();let s=replay(t,startOf(t,'ed crosses after clearance'));s.facts['checkpoint.cleared.ed']=false;
 for(let i=0;i<80&&!s.events.some(e=>e.kind==='cancelled');i++)s=advance(s,t.registry,t.space);
 expect(s.events.some(e=>e.kind==='cancelled'&&e.action==='helpers')).toBe(true);expect(s.agents.ed.room).toBe('lobby');expect(s.held).toEqual({});
});
it('keeps sam attending bob while ed picks up and stows the card',()=>{
 const t=take();
 for(const name of ['ed collects bob’s card while Sam kneels','ed lifts as Sam finishes kneeling','ed lifts the card','ed keeps the found card']){
  const v=project(replay(t,startOf(t,name)+20),t.registry);
  expect(v.actors.find(a=>a.id==='bob')?.cue).toMatchObject({clip:'Electrocuted_Fall',start:6.333,rate:0});
  expect(v.actors.find(a=>a.id==='sam')?.cue).toMatchObject({clip:name.includes('kneel')?'Kneel_To_Help':'Attend_Bob',rootMotion:'preserve'});
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
 const t=take();expect(entryPlayback(t.registry).endTick/20).toBeLessThanOrEqual(140);expect(t.total/20).toBeLessThanOrEqual(1200);
 const phases=Object.values(t.registry).flatMap(a=>a.phases);
 expect(phases.filter(p=>p.turn)).toHaveLength(108);expect(phases.filter(p=>p.turn?.kind==='reaction-only')).toHaveLength(13);
 for(const [name,seconds] of [['ed collects bob’s card while Sam kneels',1.5],['ed stows bob’s card',1.6]] as const){
  const p=phases.find(p=>p.id===name)!,c=p.perform.find(p=>p.agent==='ed')!.cue!;
  expect((c.start??0)+p.ticks/20*(c.rate??1)).toBeCloseTo(seconds,5);
  expect(p.transfers).toHaveLength(1);
 }
 expect(phases.find(p=>p.id==='Blade contact')!.perform.find(p=>p.agent==='bob')!.cue?.rate).toBe(1);
});

it('operates each machine only from its physical control socket, with STILETTO nearby',()=>{
 const t=take();let s=t.world;const visited=new Set<string>();
 for(let i=0;i<t.total;i++){
  s=advance(s,t.registry,t.space,t.planner);const v=project(s,t.registry),p=v.process?.active;if(!p||p.staffing||s.facts['line.tutorial-output']===1)continue;
  visited.add(p.station);const bob=s.agents[p.operator.agent],stiletto=s.agents.stiletto;
  expect(bob.room).toBe('conveyor');expect(stiletto.room).toBe('conveyor');
  expect(Math.hypot(bob.position[0]-p.operator.position[0],bob.position[1]-p.operator.position[1])).toBeLessThanOrEqual(p.operator.within);
  expect(Math.hypot(bob.position[0]-stiletto.position[0],bob.position[1]-stiletto.position[1])).toBeLessThan(4000);
  const angle=stiletto.yaw*Math.PI/180,dx=bob.position[0]-stiletto.position[0],dy=bob.position[1]-stiletto.position[1];
  expect((-Math.sin(angle)*dx+Math.cos(angle)*dy)/Math.hypot(dx,dy)).toBeGreaterThan(.9);
 }
 expect([...visited]).toEqual(['intake','wash','belt','forge']);
});
it('interrupts machine work if the operator leaves before the cycle completes',()=>{
 const t=take();
 for(const phase of ['bob seats the brain','bob runs the wash','bob starts the main belt','bob compresses the first brain']){
  let s=replay(t,startOf(t,phase)+8);const stage=s.facts['line.stage'];
  s.agents.bob.position=[s.agents.bob.position[0],108000];
  expect(project(s,t.registry).process?.active).toBeUndefined();
  s=advance(s,t.registry,t.space,t.planner);
  expect(s.events.at(-1)?.kind).toBe('cancelled');expect(s.facts['line.stage']).toBe(stage);expect(s.facts['line.output']).toBe(0);expect(s.held).toEqual({});expect(t.planner.propose(s)).toEqual([]);
 }
});


it('routes every arrival through the clear main entrance before they spread around Security',()=>{
 const t=take(),positions=Object.fromEntries(Object.values(t.world.agents).map(a=>[a.id,a.position]));
 const {axis,min,max}=ARRIVAL_LAYOUT.mainEntry;
 for(const action of Object.values(t.registry))for(const phase of action.phases)for(const p of phase.perform){
  if(!p.to)continue;const from=positions[p.agent],to=p.to;
  if(from&&(from[1]/1000<axis)!==(to[1]/1000<axis)){
   const ratio=(axis*1000-from[1])/(to[1]-from[1]),x=(from[0]+(to[0]-from[0])*ratio)/1000;
   expect(x).toBeGreaterThan(min+.45);expect(x).toBeLessThan(max-.45);
  }
  positions[p.agent]=to;
 }
});


it('performs the temporary Sam check before clearance without inventing physical card transfer',()=>{
 const t=take(),start=startOf(t,'sam’s credential record is checked'),before=replay(t,start);
 expect(before.facts['line.output']).toBe(1);expect(before.facts['checkpoint.card-checked.sam']).toBeUndefined();expect(before.facts['checkpoint.cleared.sam']).toBeUndefined();
 expect(before.props?.['sam:id'].location).toMatchObject({kind:'stowed',agent:'sam'});
 const after=replay(t,start+12);expect(after.facts['checkpoint.card-checked.sam']).toBe(true);expect(after.facts['checkpoint.cleared.sam']).toBe(true);expect(after.facts['checkpoint.workers-passed']).toBe(2);
 const phases=t.registry['sam-second'].phases;expect(phases.flatMap(p=>p.transfers??[]).filter(p=>p.prop==='sam:id')).toEqual([]);
 expect(phases.flatMap(p=>p.perform.filter(v=>v.agent==='sam'&&['Draw_ID','Stow_ID'].includes(v.cue?.clip??'')))).toEqual([]);
 expect(after.props?.['bob:id'].location).toMatchObject({kind:'stowed',agent:'ed'});expect(project(before,t.registry).credentialStatus?.actorId).toBe('sam');
});

it('keeps bob’s presented card in its fitted pose during the greeting',()=>{
 const t=take(),v=project(replay(t,startOf(t,'A card held ready')+10),t.registry);
 expect(v.actors.find(a=>a.id==='bob')?.cue?.clip).toBe('ID_Ready');
});
