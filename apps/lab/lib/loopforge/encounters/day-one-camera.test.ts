import {authoredSetup,D6_EYES,departureCamera,exteriorEntranceVisible,selectedAuthoredSetup} from './day-one-camera';
import {arrival} from './arrival';
import type {ActorView,View} from './contract';
const actor=(id:string,y:number,visible=true):ActorView=>({id,name:id,character:id==='stiletto'?'stiletto':'worker',position:[124600,y*1000],visible,yaw:0,motion:'walk',seconds:0,action:'shift-departure'});
const day=(stage:NonNullable<View['dayOne']>['stage']):NonNullable<View['dayOne']>=>({stage,crew:0,stationOperators:{intake:null,wash:null,belt:null,forge:null},stationOccupancy:{intake:null,wash:null,belt:null,forge:null},tutorialOutputs:1,pairedOutputs:1,staffedOutputs:1,productionOutputs:3,departed:0,totalCast:12});
it('reconstructs each selected floor eye from the camera tuple',()=>{
 for(const view of Object.values(D6_EYES)){
  const [x,y,h,r,a,b]=authoredSetup(view);
  expect(x+r*Math.cos(a)*Math.sin(b)).toBeCloseTo(view.eye[0],8);
  expect(y-r*Math.sin(a)*Math.sin(b)).toBeCloseTo(view.eye[1],8);
  expect(h+r*Math.cos(b)).toBeCloseTo(view.eye[2],8);
 }
 expect(selectedAuthoredSetup('intake')?.slice(0,3)).toEqual([136.6,105.1,1.05]);
 expect(selectedAuthoredSetup('forge')?.slice(0,3)).toEqual([149,105,1.15]);
});
it('holds the exterior view until the last actual actor crosses, then follows that actor',()=>{
 const actors=[actor('bob',146,false),actor('sam',140),actor('stiletto',120)];
 expect(departureCamera({actors,dayOne:day('departure')})).toEqual(D6_EYES['exit-flow']);
 actors[2]=actor('stiletto',128);
 const camera=departureCamera({actors,dayOne:day('departure')})!;
 expect(camera.target).toEqual([124.6,128,1.2]);expect(camera.eye).toEqual([127.5,137,3.3]);
 expect(departureCamera({actors,dayOne:day('entry')})).toBeUndefined();
 expect(departureCamera({actors,dayOne:day('night')})).toBeUndefined();
 expect(exteriorEntranceVisible('exit-pair')).toBe(true);expect(exteriorEntranceVisible('exit-flow')).toBe(true);
});
it('binds the received exchanges and never routes departure through morning mean tracking',()=>{
 const t=arrival(),phases=Object.values(t.registry).flatMap(a=>a.phases),turn=(id:string)=>phases.find(p=>p.turn?.id===id)!;
 expect(turn('S04-T14').framing).toBe('clerk-register');expect(turn('S04-T15').framing).toBe('clerk-sorting');
 expect(turn('S05-T01').framing).toBe('pair-work-reply');expect(turn('S05-T13').framing).toBe('jo-work-reply');
 expect(turn('S08-T08').framing).toBe('output-reply');
 expect(turn('S09-T07').framing).toBe('exit-pair');expect(turn('S09-T08').framing).toBe('exit-pair');
 expect(t.registry['shift-departure'].phases.every(p=>p.framing!=='approach')).toBe(true);
 const after=t.registry['shift-departure'].phases.slice(t.registry['shift-departure'].phases.findIndex(p=>p.turn?.id==='S09-T08')+1);
 expect(after.some(p=>p.framing==='exit-flow')).toBe(true);
 expect(phases.filter(p=>p.turn)).toHaveLength(108);
});
