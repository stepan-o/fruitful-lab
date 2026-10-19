import {rehearsal,replay} from './rehearsals';
import {advance,admit,cancel,project} from './kernel';
import {ARRIVAL_WORKERS} from './arrival';
import {arrivalSpace} from './arrival-layout';
it('stages ten workers, admits nobody, commits a single strike and waits for the queue before IDs',()=>{
 const take=rehearsal('arrival','care');let s=take.world;let minimum=Infinity;
 for(let i=0;i<take.total;i++){
  s=advance(s,take.registry,take.space,take.planner);
  expect(s.events.some(e=>e.kind==='rejected'||e.kind==='cancelled')).toBe(false);
  const agents=Object.values(s.agents);
  for(let a=0;a<agents.length;a++)for(let b=a+1;b<agents.length;b++)minimum=Math.min(minimum,Math.hypot(agents[a].position[0]-agents[b].position[0],agents[a].position[1]-agents[b].position[1]));
  for(const id of ARRIVAL_WORKERS)expect(s.agents[id].room).toBe('lobby');
 }
 expect(minimum).toBeGreaterThanOrEqual(850);expect(s.done).toEqual(['arrival','ids']);expect(s.active).toEqual([]);expect(s.held).toEqual({});
 expect(Object.keys(s.agents)).toHaveLength(11);expect(s.facts['checkpoint.ids-requested']).toBe(true);expect(s.facts['portal.lobby-security.open']).toBe(false);
 expect(s.events.filter(e=>e.kind==='effect'&&e.detail.includes('"value":"limping"'))).toHaveLength(1);
 expect(s.events.filter(e=>e.kind==='speech').map(e=>e.detail)).toEqual(['STOP AND WAIT HERE!!','HEY YOU I SAID STOP!!!!','EVERYONE PREPARE YOUR IDs']);
 for(const id of ARRIVAL_WORKERS){expect(s.agents[id].beliefs['checkpoint.instruction']).toMatchObject({value:'prepare-ids',source:'limen',mode:'reported'});expect(s.facts[`queue.${id}.settled`]).toBe(true);}
 expect(project(s,take.registry).actors.filter(a=>a.character==='worker').every(a=>a.motion==='idle')).toBe(true);
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
 const t=rehearsal('arrival','care'),s=cancel(replay(t,290),'arrival');
 expect(s.facts[`injury.${ARRIVAL_WORKERS[0]}`]).toBeUndefined();expect(s.held).toEqual({});expect(t.planner.propose(s)).toEqual([]);
 expect(admit(s,{id:'ids',action:'ids',initiator:'limen'},t.registry,t.space).events.at(-1)?.kind).toBe('rejected');
});
it('the opening projection contains public acting and speech, not private consequences',()=>{
 const t=rehearsal('arrival','care'),s=replay(t,310);expect(JSON.stringify(project(s,t.registry))).not.toMatch(/beliefs|stress|trust|memory/);
});
