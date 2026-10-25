import {arrival} from '@/lib/loopforge/encounters/arrival';
import {replay} from '@/lib/loopforge/encounters/rehearsals';
import {project} from '@/lib/loopforge/encounters/kernel';
import {createMotionProbe,MOTION_CASES,type RetainedMotionCast} from './motion-probe';
import {snapshotMotion} from './motion-snapshot';
import {actor,context,fixture,rendered,testSource} from './motion-test-fixture';

function setup(){
 const v=rendered([actor('max'),actor('jo')]),c=context(v);
 const spy=jest.fn((id:string)=>snapshotMotion(fixture(id).input,testSource));
 const cast:RetainedMotionCast={renderedView:()=>v,motionSnapshot:spy};
 return {v,c,cast,spy};
}
it('pairs retained presentation with authoritative history and copies both without mutation',()=>{
 const {v,c,cast,spy}=setup();const before=JSON.stringify(c);
 c.authoritativeProjection=rendered(v.actors.map(a=>({...a,seconds:0})));
 const input=JSON.stringify(c),result=createMotionProbe().snapshot('A3-01',['max','jo'],cast,c);
 expect(result.renderedView.actors[0].seconds).toBe(.4);expect(result.authoritativeProjection.actors[0].seconds).toBe(0);
 expect(JSON.stringify(c)).toBe(input);expect(before).not.toBe(input);expect(spy).toHaveBeenCalledTimes(2);
 v.actors[0].seconds=40;expect(result.renderedView.actors[0].seconds).toBe(.4);
 expect(result.authorState).toEqual(c.authorState);expect(result.authorState).not.toBe(c.authorState);
});
it.each(['active world','active reading','no manual pause','missing ID','duplicate ID','duplicate rendered ID','missing actor','missing cast','missing identity','tick drift'])('stops on %s before any worker call and cannot retry',problem=>{
 const {v,c,cast,spy}=setup();let ids=['max','jo'],available:RetainedMotionCast|null=cast;
 if(problem==='active world')c.playing=true;
 if(problem==='active reading'){c.readingActive=true;c.readingPaused=false;}
 if(problem==='no manual pause')c.userPaused=false;
 if(problem==='missing ID')ids=['max'];
 if(problem==='duplicate ID')ids=['max','max'];
 if(problem==='duplicate rendered ID')v.actors.push(v.actors[0]);
 if(problem==='missing actor')v.actors.pop();
 if(problem==='missing cast')available=null;
 if(problem==='missing identity')c.source={...c.source,sourceHashes:{}};
 if(problem==='tick drift')c.authoritativeProjection={...v,tick:101};
 const probe=createMotionProbe();expect(()=>probe.snapshot('A3-01',ids,available,c)).toThrow('A3');expect(spy).not.toHaveBeenCalled();
 expect(probe.status().stopped).toBe(true);expect(()=>probe.snapshot('A3-01',['max','jo'],cast,context(v))).toThrow('no retry');
});
it('charges a failed worker call and stops before the next actor',()=>{
 const {c,cast,spy}=setup();spy.mockImplementationOnce(()=>{throw Error('missing core joint');});
 const probe=createMotionProbe();expect(()=>probe.snapshot('A3-01',['max','jo'],cast,c)).toThrow('missing core joint');
 expect(probe.status()).toMatchObject({exports:0,workerCalls:1,stopped:true});expect(spy).toHaveBeenCalledTimes(1);
});
it('enforces the worker cap before calling a batch and never allows a larger configured cap',()=>{
 const {c,cast,spy}=setup();const probe=createMotionProbe(1);
 expect(()=>probe.snapshot('A3-01',['max','jo'],cast,c)).toThrow('cap exhausted');expect(spy).not.toHaveBeenCalled();
 expect(()=>createMotionProbe(33)).toThrow('1..32');
});
it('admits only eight ordered exports and exactly twenty actor snapshots',()=>{
 const probe=createMotionProbe();let tick=100;
 for(const spec of MOTION_CASES){
  const actors=spec.actors.map(id=>actor(id));const v=rendered(actors);v.tick=tick;v.phase=spec.phase;
  if(spec.id==='A3-03'||spec.id==='A3-04')actors[0].cue={clip:'Electrocuted_Fall',rate:0,start:6.333};
  if(spec.id==='A3-03')actors[1].cue={clip:'Attend_Bob'};
  if(spec.id==='A3-06'){v.credentialStatus={actorId:'max',verified:false};actors[0].cue={clip:'Listening_Gesture'};}
  if(spec.id==='A3-07'||spec.id==='A3-08'){
   actors.forEach(a=>a.action='shift-departure/3');
   const stations={intake:null,wash:null,belt:null,forge:null};
   v.dayOne={stage:'departure',crew:8,stationOperators:stations,stationOccupancy:stations,tutorialOutputs:1,pairedOutputs:1,staffedOutputs:1,productionOutputs:3,departed:0,totalCast:12};
  }
  const cast:RetainedMotionCast={renderedView:()=>v,motionSnapshot:id=>snapshotMotion(fixture(id).input,testSource)};
  const c=context(v);const before=JSON.stringify(c);
  expect(probe.snapshot(spec.id,spec.actors,cast,c).caseId).toBe(spec.id);expect(JSON.stringify(c)).toBe(before);
  tick+=6;
 }
 expect(probe.status()).toMatchObject({exports:8,workerCalls:20,stopped:false});
 const {c,cast}=setup();expect(()=>probe.snapshot('A3-01',['max','jo'],cast,c)).toThrow('export cap exhausted');
});
it('rejects a phase or clip boundary in a six-tick comparison',()=>{
 const {c,cast,v}=setup();const probe=createMotionProbe();probe.snapshot('A3-01',['max','jo'],cast,c);
 v.tick+=6;v.actors[0].cue={clip:'other'};
 expect(()=>probe.snapshot('A3-02',['max','jo'],cast,c)).toThrow('phase/clip boundary');
});


// Use the production projection at the actual failed browser tick. This catches
// the previous bare-name fixture agreeing with its equally incorrect guard.
const departureTake=arrival(),departureWorld=replay(departureTake,15000);
function actualDeparture(){
 const v=project(departureWorld,departureTake.registry),c=context(v);
 c.authorState=departureWorld;
 c.activePhases=departureWorld.active.map(a=>({action:a.intent.action,phase:departureTake.registry[a.intent.action].phases[a.phase].id,remainingTicks:departureTake.registry[a.intent.action].phases[a.phase].ticks-(departureWorld.tick-a.start)}));
 const spy=jest.fn((id:string)=>snapshotMotion(fixture(id).input,testSource));
 const cast:RetainedMotionCast={renderedView:()=>v,motionSnapshot:spy};
 const probe=createMotionProbe();
 for(const [i,spec] of MOTION_CASES.slice(0,6).entries()){
  const actors=spec.actors.map(id=>actor(id)),prior=rendered(actors);prior.tick=100+i*6;prior.phase=spec.phase;
  if(spec.id==='A3-03'||spec.id==='A3-04')actors[0].cue={clip:'Electrocuted_Fall',rate:0,start:6.333};
  if(spec.id==='A3-03')actors[1].cue={clip:'Attend_Bob'};
  if(spec.id==='A3-06'){prior.credentialStatus={actorId:'max',verified:false};actors[0].cue={clip:'Listening_Gesture'};}
  probe.snapshot(spec.id,spec.actors,{renderedView:()=>prior,motionSnapshot:spy},context(prior));
 }
 spy.mockClear();
 return {v,c,cast,spy,probe};
}
it('admits the production-projected departure at the actual failed tick without rewriting action identities',()=>{
 const {v,c,cast,spy,probe}=actualDeparture(),active=departureWorld.active.find(a=>a.intent.action==='shift-departure')!;
 expect(active).toBeDefined();expect(v.tick).toBe(15000);expect(v.dayOne?.stage).toBe('departure');
 const ids=MOTION_CASES[6].actors;
 for(const id of ids)expect(v.actors.find(a=>a.id===id)?.action).toBe(`${active.intent.id}/${active.phase}`);
 expect(active.phase).toBeGreaterThanOrEqual(0);
 const before=JSON.stringify({v,c}),result=probe.snapshot('A3-07',ids,cast,c);
 expect(result.renderedView.actors).toEqual(v.actors);expect(JSON.stringify({v,c})).toBe(before);
 expect(spy.mock.calls.map(call=>call[0])).toEqual(['max','jo','mae']);
 expect(probe.status()).toMatchObject({exports:7,workerCalls:17,stopped:false});
});
it.each(['wrong stage','wrong action','bare action','nonnumeric phase','extra suffix','hidden worker','missing worker'])('rejects %s at departure before further worker calls and permanently stops',problem=>{
 const {v,c,cast,spy,probe}=actualDeparture(),max=v.actors.find(a=>a.id==='max')!;
 if(problem==='wrong stage')v.dayOne={...v.dayOne!,stage:'production'};
 if(problem==='wrong action')max.action='doorway-threat/13';
 if(problem==='bare action')max.action='shift-departure';
 if(problem==='nonnumeric phase')max.action='shift-departure/no-phase';
 if(problem==='extra suffix')max.action='shift-departure/1/extra';
 if(problem==='hidden worker')max.visible=false;
 if(problem==='missing worker')v.actors=v.actors.filter(a=>a.id!=='mae');
 expect(()=>probe.snapshot('A3-07',MOTION_CASES[6].actors,cast,c)).toThrow('A3');
 expect(spy).not.toHaveBeenCalled();expect(probe.status()).toMatchObject({exports:6,workerCalls:14,stopped:true});
 expect(()=>probe.snapshot('A3-07',MOTION_CASES[6].actors,cast,c)).toThrow('no retry');
});
