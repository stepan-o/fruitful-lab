import {rehearsal,replay} from './rehearsals';
import {advance,admit,cancel,project} from './kernel';
import {ARRIVAL_WORKERS} from './arrival';
import {arrivalSpace} from './arrival-layout';
it('stages ten workers, admits nobody, commits a single strike and waits for the queue before IDs',()=>{
 const take=rehearsal('arrival','care');let s=take.world;let minimum=Infinity;
 for(let i=0;i<take.total;i++){
  s=advance(s,take.registry,take.space,take.planner);
  expect(s.events.some(e=>e.kind==='rejected'||e.kind==='cancelled')).toBe(false);
  expect(project(s,take.registry).bubbles.length).toBeLessThanOrEqual(1);
  const agents=Object.values(s.agents);
  for(let a=0;a<agents.length;a++)for(let b=a+1;b<agents.length;b++)minimum=Math.min(minimum,Math.hypot(agents[a].position[0]-agents[b].position[0],agents[a].position[1]-agents[b].position[1]));
  for(const id of ARRIVAL_WORKERS)expect(s.agents[id].room).toBe('lobby');
 }
 expect(minimum).toBeGreaterThanOrEqual(850);expect(s.done).toEqual(['arrival','ids']);expect(s.active).toEqual([]);expect(s.held).toEqual({});
 expect(Object.keys(s.agents)).toHaveLength(11);expect(s.facts['checkpoint.ids-requested']).toBe(true);expect(s.facts['portal.lobby-security.open']).toBe(false);
 expect(s.events.filter(e=>e.kind==='effect'&&e.detail.includes('"value":"limping"'))).toHaveLength(1);
 const script=Object.values(take.registry).flatMap(a=>a.phases.flatMap(p=>(p.say??[]).map(s=>s.text)));
 expect(s.events.filter(e=>e.kind==='speech').map(e=>e.detail)).toEqual(script);
 expect(script).toEqual(expect.arrayContaining(['STOP AND WAIT HERE!!','HEY YOU I SAID STOP!!!!','EVERYONE PREPARE YOUR IDs']));
 expect(s.agents[ARRIVAL_WORKERS[0]].trust).toBe(38);
 expect(s.agents[ARRIVAL_WORKERS[1]].trust).toBe(47);
 for(const id of ARRIVAL_WORKERS){expect(s.agents[id].beliefs['checkpoint.instruction']).toMatchObject({value:'prepare-ids',source:'limen',mode:'reported'});expect(s.facts[`queue.${id}.settled`]).toBe(true);}
 expect(project(s,take.registry).actors.find(a=>a.id===ARRIVAL_WORKERS[0])?.cue?.clip).toBe('injured_walk');
 expect(replay(take,take.total)).toEqual(s);
 expect(advance(s,take.registry,take.space,take.planner).agents).toEqual(s.agents);
});
it('a blocked door prevents traversal but does not prevent LIMEN being heard through it',()=>{
 const t=rehearsal('arrival','care'),w=t.world.agents[ARRIVAL_WORKERS[0]];w.position=[123000,112500];
 expect(arrivalSpace.canTraverse(w,[123000,110000],t.world)).toBe(false);
 expect(arrivalSpace.canHear(t.world.agents.limen,w,t.world,'shout')).toBe(true);
 t.world.facts['portal.lobby-security.open']=true;expect(arrivalSpace.canTraverse(w,[123000,110000],t.world)).toBe(true);
 t.world.facts['portal.lobby-security.audible']=false;expect(arrivalSpace.canHear(t.world.agents.limen,w,t.world,'shout')).toBe(false);
});
it('cancelled swing does not award a hit or advance to the ID announcement',()=>{
 const t=rehearsal('arrival','care'),contact=1+t.registry.arrival.phases.slice(0,13).reduce((n,p)=>n+p.ticks,0),s=cancel(replay(t,contact),'arrival');
 expect(s.facts[`injury.${ARRIVAL_WORKERS[0]}`]).toBeUndefined();expect(s.held).toEqual({});expect(t.planner.propose(s)).toEqual([]);
 expect(admit(s,{id:'ids',action:'ids',initiator:'limen'},t.registry,t.space).events.at(-1)?.kind).toBe('rejected');
});
it('the opening projection contains public acting and speech, not private consequences',()=>{
 const t=rehearsal('arrival','care'),s=replay(t,310);expect(JSON.stringify(project(s,t.registry))).not.toMatch(/beliefs|stress|trust|memory/);
});

it('keeps the warning, physical contact, fall, recovery and limp ordered and seekable',()=>{
 const t=rehearsal('arrival','care'),phases=t.registry.arrival.phases;
 const names=phases.map(p=>p.id),contact=names.indexOf('Blade contact');
 const before=1+phases.slice(0,contact).reduce((n,p)=>n+p.ticks,0),hit=before+phases[contact].ticks;
 expect(replay(t,hit-1).facts[`injury.${ARRIVAL_WORKERS[0]}`]).toBeUndefined();
 expect(replay(t,hit).facts[`injury.${ARRIVAL_WORKERS[0]}`]).toBe('limping');
 expect(project(replay(t,hit),t.registry).actors.find(a=>a.id===ARRIVAL_WORKERS[0])?.cue?.clip).toBe('Electrocuted_Fall');
 expect(names.indexOf('The worker gets back up')).toBeGreaterThan(contact);
 expect(names.indexOf('The cost walks back into the queue')).toBeGreaterThan(names.indexOf('The worker gets back up'));
 const clips=new Set(phases.map(p=>p.perform.find(v=>v.agent==='limen')!.cue!.clip));expect(clips.size).toBe(8);
 expect(JSON.stringify(t.registry)).not.toMatch(/baton|All_Night_Dance|Boxing_Warmup/);
 // A random seek must reconstruct the same previous pose without requiring playback history.
 const tick=before+1,a=project(replay(t,tick),t.registry),b=project(replay(t,tick),t.registry);
 expect(a).toEqual(b);expect(a.actors.find(a=>a.id==='limen')?.previous?.cue.clip).toBe('Axe_Spin_Attack');
});
it('keeps the hesitant question audible through the nearby open checkpoint',()=>{
 const t=rehearsal('arrival','care'),w=t.world.agents[ARRIVAL_WORKERS[0]];w.position=[124000,114500];
 expect(arrivalSpace.canHear(w,t.world.agents.limen,t.world,'local')).toBe(true);
 w.position=[124000,121000];expect(arrivalSpace.canHear(w,t.world.agents.limen,t.world,'local')).toBe(false);
});
it('holds the last performed pose when an intent ID differs from its action definition',()=>{
 const t=rehearsal('arrival','care');let s=admit(t.world,{id:'morning-take-001',action:'arrival',initiator:'limen'},t.registry,t.space);
 const ticks=t.registry.arrival.phases.reduce((n,p)=>n+p.ticks,0);
 for(let i=0;i<ticks;i++)s=advance(s,t.registry,t.space);
 const actor=project(s,t.registry).actors.find(a=>a.id==='limen')!;
 expect(s.done).toEqual(['morning-take-001']);expect(actor.cue?.clip).toBe('Stand_and_Chat');expect(actor.seconds).toBe(3.3);
});


it('holds the group camera across dialogue and cuts only for the incident and aftermath',()=>{
 const t=rehearsal('arrival','care');let s=t.world,previous:string|undefined;const shots:string[]=[];
 for(let i=0;i<t.total;i++){
  s=advance(s,t.registry,t.space,t.planner);const v=project(s,t.registry);
  if(v.framing&&v.framing!==previous){shots.push(v.phase);previous=v.framing;}
 }
 expect(shots).toEqual(['Keep your number ready','One mistakes the count for permission','The cost walks back into the queue']);
 const limen=s.agents.limen,worker=s.agents[ARRIVAL_WORKERS[0]],yaw=limen.yaw*Math.PI/180;
 expect(Math.sin(yaw)*(worker.position[0]-limen.position[0])+Math.cos(yaw)*(worker.position[1]-limen.position[1])).toBeGreaterThan(0);
});
it('preserves delivery and elapsed speech time across a seek without changing hearing or outcomes',()=>{
 const t=rehearsal('arrival','care'),s=replay(t,180),bubble=project(s,t.registry).bubbles[0];
 expect(bubble.delivery).toMatchObject({tone:'command',emphasis:['STOP','WAIT HERE']});
 expect(bubble.age).toBeCloseTo(.95);
 for(const action of Object.values(t.registry))for(const p of action.phases)for(const speech of p.say??[])delete speech.delivery;
 const plain=replay(t,180);expect(plain.agents).toEqual(s.agents);expect(plain.facts).toEqual(s.facts);
});
