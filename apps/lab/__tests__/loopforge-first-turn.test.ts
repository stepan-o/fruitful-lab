/** @jest-environment node */
import { initialState, step, project, replay, type State } from '@/lib/loopforge/first-turn/kernel';
import { canonical, PROTOCOL, SCHEMA, ENGINE, type Command, type RunRequest } from '@/lib/loopforge/first-turn/contract';
import { respond, viewHash, parseRequest } from '@/lib/loopforge/first-turn/server';
import { applyRecord } from '@/lib/loopforge/first-turn/viewer';
import { workforceTotals } from '@/lib/loopforge/first-shift/workers';
const runId='12345678-1234-4123-8123-123456789012';
const opening:Command[]=[{type:'acknowledge_mandate'},{type:'choose_adviser',adviser:'limen'}];
function setup(adviser:'limen'|'stiletto',workers=24){
 const commands:Command[]=[{type:'acknowledge_mandate'},{type:'choose_adviser',adviser}];
 let state=replay(7,commands,workers);
 const send=(c:Command)=>{state=step(state,c);commands.push(c);};
 send({type:'approve_plan',assignments:state.daily.briefing!.assignments});send({type:'start_shift'});
 return {commands,send,current:()=>state};
}
function finish(run:ReturnType<typeof setup>){
 for(let n=0;n<70 && run.current().daily.phase!=='allocation';n++){
  const pending=run.current().daily.pending;
  run.send(pending?{type:'resolve_incident',incident:pending.id,response:pending.recommendation}:{type:'advance'});
 }
 expect(run.current().daily.phase).toBe('allocation');return run.current();
}
const request=(commands:Command[]=[]):RunRequest=>({protocol:PROTOCOL,schema_version:SCHEMA,engine_version:ENGINE,run_id:runId,seed:7,initial_workers:24,commands,baseline:null});
test('prebuilt opening preserves funds, has no assignments, and still requires the leadership call',()=>{
 const first=initialState(7),before=canonical(first);
 expect(first.floor.stage).toBe('mandate');expect(first.floor.installed).toEqual(['terminal','gate','drive']);
 expect(first.daily.cash).toBe(240);expect(first.daily.assignments).toBeNull();expect(first.daily.adviser).toBeNull();
 expect(()=>step(first,{type:'choose_adviser',adviser:'limen'})).toThrow();
 expect(step(first,{type:'acknowledge_mandate'}).floor.stage).toBe('day');expect(canonical(first)).toBe(before);
 for(const c of [{type:'install',fixture:'drive'},{type:'buy_outtake'},{type:'finish_build'}])expect(()=>parseRequest({...request(),commands:[c]})).toThrow();
 expect(()=>parseRequest({...request(),schema_version:'loopforge_first_turn_1',engine_version:'first-turn-1.0.0'})).toThrow();
});
test.each([10,24,100])('%i workers remain unique visible bodies backed by private component records',count=>{
 const s=setup('limen',count).current(),v=project(s);
 expect(v.floor.actors).toHaveLength(count);expect(new Set(v.floor.actors.map(a=>a.id)).size).toBe(count);
 expect(new Set(v.floor.actors.map(a=>`${a.x}:${a.y}`)).size).toBe(count);
 expect(v.floor.actors.every(a=>s.daily.workers.body[a.id as keyof typeof s.daily.workers.body])).toBe(true);
 for(const secret of ['psychology','conditioning','unconditioned','confidence','loyalty','memories','traces','rng'])expect(JSON.stringify(v)).not.toContain(secret);
});
test('one command advances exactly twenty fixed ticks without mutating its input',()=>{
 const s=setup('stiletto').current(),copy=canonical(s),next=step(s,{type:'advance'});
 expect(next.floor.simTick-s.floor.simTick).toBe(20);expect(next.daily.shiftTick).toBe(1);expect(next.revision).toBe(s.revision+1);expect(canonical(s)).toBe(copy);
});
test.each(['limen','stiletto'] as const)('%s completes a deterministic run with conserved output and dispatch payment',adviser=>{
 const run=setup(adviser),s=finish(run),before=workforceTotals(s.daily.workers);
 expect(before.produced).toBeGreaterThan(0);expect(s.floor.released).toBe(before.produced);expect(replay(7,run.commands)).toEqual(s);
 const settled=step(s,{type:'commit_output',retain:2}),after=workforceTotals(settled.daily.workers);
 expect(settled.daily.workers.order).toEqual(s.daily.workers.order);expect(after.retained+after.committed).toBe(before.produced);
 expect(settled.daily.cash-s.daily.cash).toBe(after.committed*12);expect(settled.floor.stage).toBe('settled');
 expect(()=>step(settled,{type:'commit_output',retain:0})).toThrow();
});
test('open intake and push expose finite buffers and wear; no output appears through a full exit',()=>{
 const fast=setup('stiletto'),slow=setup('stiletto');fast.send({type:'set_operation',feed:'open',drive:'push'});
 const states:State[]=[];
 for(let n=0;n<48 && fast.current().daily.phase!=='allocation';n++){
  const p=fast.current().daily.pending;fast.send(p?{type:'resolve_incident',incident:p.id,response:p.recommendation}:{type:'advance'});states.push(fast.current());
 }
 expect(states.every(s=>s.floor.intake<=6&&s.floor.outtake<=3&&s.floor.assembly<80)).toBe(true);
 expect(states.some(s=>s.floor.blocked)).toBe(true);
 expect(fast.current().daily.condition).toBeLessThan(finish(slow).daily.condition);
 expect(workforceTotals(fast.current().daily.workers).produced).toBe(fast.current().floor.released);
});
test('adviser authority follows assigned room, and decision pauses reject operation commands',()=>{
 const run=setup('limen');run.send({type:'set_operation',feed:'open',drive:'push'});
 const s=finish(run),resolutions=s.daily.events.filter(e=>e.kind==='resolution');
 expect(resolutions.some(e=>e.actor==='limen'&&e.room==='conveyor')).toBe(true);
 expect(resolutions.some(e=>e.actor==='director'&&e.room==='security')).toBe(true);
 const pending=setup('stiletto');pending.send({type:'set_operation',feed:'open',drive:'push'});
 for(let n=0;n<48&&pending.current().daily.phase==='running';n++)pending.send({type:'advance'});
 if(pending.current().daily.pending)expect(()=>step(pending.current(),{type:'set_operation',feed:'metered',drive:'steady'})).toThrow();
});
test('snapshot and diff rebuild the same projection and fail closed on forged state or protocol',async()=>{
 let receipt=await applyRecord(null,respond(request()),runId,async v=>viewHash(v));
 for(let i=1;i<=opening.length;i++){
  const m=respond({...request(opening.slice(0,i)),baseline:{tick:receipt.view.tick,step_hash:receipt.hash}});
  receipt=await applyRecord(receipt,m,runId,async v=>viewHash(v));expect(receipt.view).toEqual(project(replay(7,opening.slice(0,i))));
  await expect(applyRecord(receipt,m,runId,async v=>viewHash(v))).rejects.toThrow();
 }
 expect(()=>respond({...request(opening),baseline:{tick:2,step_hash:'0'.repeat(64)}})).toThrow('baseline_mismatch');
 expect(()=>respond({...request(),protocol:'old'})).toThrow();
 expect(()=>parseRequest({...request(),commands:[{type:'set_operation',feed:'infinite',drive:'push'}]})).toThrow();
 expect(()=>parseRequest({...request(),commands:[{type:'produce',count:99}]})).toThrow();
});

test('closing intake clears accumulated work and cannot manufacture from an empty supply',()=>{
 const run=setup('stiletto',24);run.send({type:'set_operation',feed:'open',drive:'push'});
 for(let i=0;i<9;i++)run.send({type:'advance'});
 run.send({type:'set_operation',feed:'hold',drive:'steady'});
 for(let i=0;i<25;i++){const p=run.current().daily.pending;run.send(p?{type:'resolve_incident',incident:p.id,response:p.recommendation}:{type:'advance'});}
 const before=run.current();expect(before.floor.intake).toBe(0);expect(before.floor.outtake).toBe(0);
 run.send({type:'advance'});expect(run.current().floor.released).toBe(before.floor.released);
});
