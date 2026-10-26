/** @jest-environment node */
import {closeSync,openSync,readSync} from 'node:fs';
import path from 'node:path';
import {openingWorkerAsset,openingWorkers,type OpeningWorkerId,type WorkerDetail} from '../agents/opening-workers';
import {rehearsal,rehearsalView} from './rehearsals';
import {advance} from './kernel';
import type {MotionCue} from './contract';

// Read the actual GLB animation names without decoding geometry. The ordinary
// replay must only request motions delivered for that worker at every detail.
function deliveredNames(worker:OpeningWorkerId,detail:WorkerDetail){
 const file=openingWorkerAsset(worker,detail),fd=openSync(path.join(process.cwd(),'public',file.src),'r');
 try{
  const header=Buffer.alloc(20);expect(readSync(fd,header,0,20,0)).toBe(20);
  expect(header.readUInt32LE(0)).toBe(0x46546c67);expect(header.readUInt32LE(4)).toBe(2);
  expect(header.readUInt32LE(16)).toBe(0x4e4f534a);
  const bytes=Buffer.alloc(header.readUInt32LE(12));expect(readSync(fd,bytes,0,bytes.length,20)).toBe(bytes.length);
  const gltf=JSON.parse(bytes.toString('utf8')) as {animations:{name:string}[]};
  const names=new Set(gltf.animations.map(a=>a.name));
  for(const name of names)if(/(?:_Corrected|__corrected)$/.test(name))names.add(name.replace(/(?:_Corrected|__corrected)$/,''));
  if(names.has('idle'))names.add('Quiet_Wait');
  return names;
 }finally{closeSync(fd);}
}
const details:WorkerDetail[]=['portrait','floor','console'];
const banks=new Map(openingWorkers.map(worker=>[worker.id,details.map(detail=>({detail,names:deliveredNames(worker.id,detail)}))]));
function requireDelivered(worker:OpeningWorkerId,cue:MotionCue){
 if(cue.clip==='Max_Forge_Control_Press'){
  if(worker!=='max'||!cue.forgeQuiet)throw Error('Forge procedure lacks its Max endpoint contract');
  requireDelivered(worker,cue.forgeQuiet.start.cue);requireDelivered(worker,cue.forgeQuiet.end.cue);return;
 }
 for(const {detail,names}of banks.get(worker)!)if(!names.has(cue.clip))throw Error(`${worker}/${detail}: Missing performance: ${cue.clip}`);
}

it('keeps every current and blended worker cue executable through the complete ordinary day',()=>{
 const take=rehearsal('arrival','care'),seen=new Set<string>(),samMotions=new Set<string>();let world=take.world;
 while(world.tick<take.total){
  world=advance(world,take.registry,take.space,take.planner);
  for(const actor of rehearsalView(take,world).actors){
   if(!banks.has(actor.id as OpeningWorkerId))continue;
   for(const cue of [actor.cue,actor.previous?.cue]){
    if(!cue)continue;const key=actor.id+JSON.stringify(cue);if(seen.has(key))continue;seen.add(key);
    requireDelivered(actor.id as OpeningWorkerId,cue);if(actor.id==='sam')samMotions.add(cue.clip);
   }
  }
 }
 expect(world.events.filter(e=>e.kind==='cancelled'||e.kind==='rejected')).toEqual([]);
 expect(world.completed).toEqual(Object.keys(take.registry));
 expect(world.facts).toMatchObject({'day.stage':'night','line.output':3,'checkpoint.card-checked.sam':true,'assignment.sam':'conveyor'});
 expect(Object.values(world.agents).filter(a=>world.facts[`day.departed.${a.id}`]===true)).toHaveLength(12);
 expect(world.props?.['bob:id'].location).toMatchObject({kind:'stowed',agent:'ed'});
 expect(world.props?.['sam:id'].location).toMatchObject({kind:'stowed',agent:'sam'});
 for(const clip of ['Kneel_To_Help','Attend_Bob','Rise_From_Help','Push_Forward_and_Stop'])expect(samMotions.has(clip)).toBe(true);
 for(const clip of ['Draw_ID','ID_Ready','Stow_ID'])expect(samMotions.has(clip)).toBe(false);
});

it('rejects unavailable Sam card acting instead of silently accepting a missing-motion alias',()=>{
 expect(()=>requireDelivered('sam',{clip:'Draw_ID'})).toThrow('sam/portrait: Missing performance: Draw_ID');
 expect(()=>requireDelivered('sam',{clip:'unavailable-motion'})).toThrow('Missing performance: unavailable-motion');
});
