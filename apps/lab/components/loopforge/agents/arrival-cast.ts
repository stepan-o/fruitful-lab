import {Vector3,Matrix} from '@babylonjs/core/Maths/math.vector';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {View} from '@/lib/loopforge/encounters/contract';
import {ARRIVAL_WORKERS} from '@/lib/loopforge/encounters/arrival';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {loadWorkerCrowd} from './worker-crowd';
import {loadLimenMotions} from './limen-motion-model';
import {ReadabilityMaterial} from './readability-material';
import type {RehearsalStage} from './arrival-stage';
export async function loadArrivalCast(floor:RehearsalStage,signal:AbortSignal){
 const stage=floor.characterStage(),colours:PBRMaterial[]=[];let workers:Awaited<ReturnType<typeof loadWorkerCrowd>>|null=null,limen:Awaited<ReturnType<typeof loadLimenMotions>>|null=null;
 try{
  workers=await loadWorkerCrowd(stage,10,signal,{clips:['idle','Listening_Gesture','walking_2_inplace','injured_walk','Electrocuted_Fall','Checkpoint_Get_Up']});
  const original=workers.bodies[0].mesh.material;
  if(original instanceof PBRMaterial){for(const [i,colour] of ['#3081c0','#3d7297','#235d86'].entries()){const material=original.clone(`Worker blue ${i}`);colours.push(material);new ReadabilityMaterial(material).set(colour,100);}workers.bodies.forEach((a,i)=>a.mesh.material=colours[i%3]);}
  limen=await loadLimenMotions(stage,signal,()=>{},()=>{});limen.play(false);limen.light(false);limen.clip('Alert');limen.seek(0);
  // Source geometry has metre limbs; use its actual standing height, not a centimetre-rig assumption.
  const worker=workers.bodies[0].mesh;worker.computeWorldMatrix(true);const bounds=worker.getBoundingInfo().boundingBox,wh=bounds.maximumWorld.y-bounds.minimumWorld.y;
  const body=limen.presentation.bodyMeshes.reduce((a,b)=>a.getTotalVertices()>b.getTotalVertices()?a:b);body.computeWorldMatrix(true);const lb=body.getBoundingInfo().boundingBox;
  limen.presentation.root.scaling.setAll(wh*1.3/(lb.maximumWorld.y-lb.minimumWorld.y));
  let view:View|null=null;const position=Vector3.Zero();
  return {
   update(next:View){view=next;for(const a of next.actors){const p=worldPoint(a.position[0]/1000,a.position[1]/1000);if(a.character==='worker'){position.set(p[0],.015,p[2]);workers!.perform(ARRIVAL_WORKERS.indexOf(a.id),a,position);}else limen!.perform(a);}stage.refresh();},
   anchors(){if(!view||!stage.scene.activeCamera)return [];const scene=stage.scene,engine=scene.getEngine(),camera=scene.activeCamera!,viewport=camera.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight());return view.actors.map(a=>{const p=worldPoint(a.position[0]/1000,a.position[1]/1000),height=a.motion==='fall'?1.05:a.character==='limen'?2.8:2.15,v=Vector3.Project(new Vector3(p[0],height,p[2]),Matrix.IdentityReadOnly,scene.getTransformMatrix(),viewport);return {id:a.id,x:100*v.x/engine.getRenderWidth(),y:100*v.y/engine.getRenderHeight(),visible:v.z>0&&v.z<1};});},
   dispose(){workers?.dispose();limen?.dispose();colours.forEach(m=>m.dispose(false,false));}
  };
 }catch(e){workers?.dispose();limen?.dispose();colours.forEach(m=>m.dispose(false,false));throw e;}
}
