import {Vector3,Matrix} from '@babylonjs/core/Maths/math.vector';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {View} from '@/lib/loopforge/encounters/contract';
import {ARRIVAL_WORKERS} from '@/lib/loopforge/encounters/arrival';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {loadWorkerCrowd} from './worker-crowd';
import {loadLimen} from './limen-model';
import {ReadabilityMaterial} from './readability-material';
import {createLimenArrivalPerformance} from './limen-arrival-performance';
import type {RehearsalStage} from './arrival-stage';
export async function loadArrivalCast(floor:RehearsalStage,signal:AbortSignal){
 const stage=floor.characterStage();let workers:Awaited<ReturnType<typeof loadWorkerCrowd>>|null=null,limen:Awaited<ReturnType<typeof loadLimen>>|null=null,acting:ReturnType<typeof createLimenArrivalPerformance>|null=null;
 try{
  workers=await loadWorkerCrowd(stage,10,signal,{clips:['idle','walking_2_inplace','injured_walk']});
  for(const material of new Set(workers.bodies.map(a=>a.mesh.material)))if(material instanceof PBRMaterial){const paint=new ReadabilityMaterial(material);paint.set('#3081c0',100);}
  limen=await loadLimen(stage,signal,()=>{});limen.play(false);limen.light(false);limen.clip('Idle');limen.seek(0);
  const worker=workers.bodies[0].mesh;worker.computeWorldMatrix(true);const bounds=worker.getBoundingInfo().boundingBox,wh=bounds.maximumWorld.y-bounds.minimumWorld.y;
  const body=limen.presentation.bodyMeshes.reduce((a,b)=>a.getTotalVertices()>b.getTotalVertices()?a:b);body.computeWorldMatrix(true);const lb=body.getBoundingInfo().boundingBox;
  limen.presentation.root.scaling.setAll(wh*1.3/(lb.maximumWorld.y-lb.minimumWorld.y));
  acting=createLimenArrivalPerformance(stage,limen.presentation.root);
  let view:View|null=null;const position=Vector3.Zero();
  return {
   update(next:View){view=next;
    for(const a of next.actors){const p=worldPoint(a.position[0]/1000,a.position[1]/1000);
     if(a.character==='worker'){
      const index=ARRIVAL_WORKERS.indexOf(a.id),clip=a.motion==='walk'?'walking_2_inplace':a.motion==='limp'?'injured_walk':'idle';
      position.set(p[0],.015,p[2]);workers!.pose(index,clip,a.seconds+(clip==='idle'?index*.39:0),position,a.yaw);
      // Brief readable recoil until a proper hit reaction is delivered. No unrelated catalog gesture.
      const root=workers!.bodies[index].root;root.rotation.x=a.motion==='recoil'?-.18*Math.sin(Math.PI*Math.min(1,a.seconds/.8)):0;
     }else{
      limen!.seek(0);limen!.place(p[0],.015,p[2],a.yaw);limen!.turn(a.yaw);acting!.sample(a.motion,a.seconds);
     }
    }
    stage.refresh();
   },
   anchors(){if(!view||!stage.scene.activeCamera)return [];const scene=stage.scene,engine=scene.getEngine(),camera=scene.activeCamera!,viewport=camera.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight());return view.actors.map(a=>{const p=worldPoint(a.position[0]/1000,a.position[1]/1000),v=Vector3.Project(new Vector3(p[0],a.character==='limen'?2.8:2.15,p[2]),Matrix.IdentityReadOnly,scene.getTransformMatrix(),viewport);return {id:a.id,x:100*v.x/engine.getRenderWidth(),y:100*v.y/engine.getRenderHeight(),visible:v.z>0&&v.z<1};});},
   dispose(){acting?.dispose();workers?.dispose();limen?.dispose();}
  };
 }catch(e){acting?.dispose();workers?.dispose();limen?.dispose();throw e;}
}
