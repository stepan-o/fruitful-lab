import {Vector3,Matrix} from '@babylonjs/core/Maths/math.vector';
import type {View} from '@/lib/loopforge/encounters/contract';
import {openingWorkers,type OpeningWorkerId} from '@/lib/loopforge/agents/opening-workers';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {loadOpeningWorker} from './opening-worker-model';
import {loadLimenMotions} from './limen-motion-model';
import {loadStiletto} from './stiletto-model';
import {createCredentialProps} from './credential-props';
import type {RehearsalStage} from './arrival-stage';
/** The encounter and individual review use the same ten rigs and baked banks. */
export async function loadArrivalCast(floor:RehearsalStage,signal:AbortSignal){
 const stage=floor.characterStage(),workers=new Map<OpeningWorkerId,Awaited<ReturnType<typeof loadOpeningWorker>>>();
 let limen:Awaited<ReturnType<typeof loadLimenMotions>>|null=null,stiletto:Awaited<ReturnType<typeof loadStiletto>>|null=null;
 let props:ReturnType<typeof createCredentialProps>|undefined;
 function dispose(){props?.dispose();workers.forEach(w=>w.dispose());limen?.dispose();stiletto?.dispose();}
 try{
  // Bound decode/upload work on older hardware; do not create ten WebGL upload bursts.
  for(const worker of openingWorkers){signal.throwIfAborted();const model=await loadOpeningWorker(stage,worker.id,'floor',signal);workers.set(worker.id,model);model.light(false);model.ground(false);model.normals(false);}
  limen=await loadLimenMotions(stage,signal,()=>{},()=>{});limen.play(false);limen.light(false);limen.clip('Alert');limen.seek(0);
  stiletto=await loadStiletto(stage,signal,()=>{});stiletto.play(false);stiletto.light(false);stiletto.flame(false);stiletto.visor(true);
  const median=[...workers.values()].map(w=>w.presentation.standingHeight).sort((a,b)=>a-b)[5],supervisorHeight=median*1.5;
  for(const model of [limen,stiletto]){const body=model.presentation.bodyMeshes.reduce((a,b)=>a.getTotalVertices()>b.getTotalVertices()?a:b);body.computeWorldMatrix(true);const b=body.getBoundingInfo().boundingBox;model.presentation.root.scaling.setAll(supervisorHeight/(b.maximumWorld.y-b.minimumWorld.y));}
  props=createCredentialProps(stage.scene,openingWorkers.map(w=>w.id),(id,side)=>workers.get(id as OpeningWorkerId)?.presentation.hand(side));
  let view:View|null=null;const position=Vector3.Zero();
  return {
   update(next:View){view=next;for(const a of next.actors){if(a.character==='worker'){const p=worldPoint(a.position[0]/1000,a.position[1]/1000);position.set(p[0],.015,p[2]);workers.get(a.id as OpeningWorkerId)?.perform(a,position);}else if(a.character==='limen')limen!.perform(a);else if(a.character==='stiletto')stiletto!.perform(a);}props!.update(next.props??[],next.tick);stage.refresh();},
   anchors(){if(!view||!stage.scene.activeCamera)return [];const scene=stage.scene,engine=scene.getEngine(),camera=scene.activeCamera!,viewport=camera.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight());return view.actors.map(a=>{const p=worldPoint(a.position[0]/1000,a.position[1]/1000),height=a.motion==='fall'?.65:a.character==='worker'?(workers.get(a.id as OpeningWorkerId)?.presentation.standingHeight??median)+.2:supervisorHeight+.25,v=Vector3.Project(new Vector3(p[0],height,p[2]),Matrix.IdentityReadOnly,scene.getTransformMatrix(),viewport);return {id:a.id,x:100*v.x/engine.getRenderWidth(),y:100*v.y/engine.getRenderHeight(),visible:v.z>0&&v.z<1&&v.x>=0&&v.x<=engine.getRenderWidth()&&v.y>=0&&v.y<=engine.getRenderHeight()};});},
   dispose
  };
 }catch(e){dispose();throw e;}
}
