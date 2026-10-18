import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import '@babylonjs/loaders/glTF/glTFFileLoader';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {Quaternion,Vector3} from '@babylonjs/core/Maths/math.vector';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {Skeleton} from '@babylonjs/core/Bones/skeleton';
import {AnimationGroup} from '@babylonjs/core/Animations/animationGroup';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {CharacterStage} from '../factory-study/scene';
import manifest from '@/lib/assets/generated/loopforge-worker-review.json';
const file=manifest.assets['worker-01-corrected'].variants[0];
const motions=['walking_2_inplace','Confused_Scratch','Listening_Gesture','Carry_Heavy_Object_Walk_inplace','idle','Discuss_While_Moving'];
/** One download and shared GPU geometry/materials. Each actor owns its rig and pose. */
export async function loadWorkerCrowd(stage:CharacterStage,count:number,signal:AbortSignal){
 const integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
 const response=await fetch(file.src,{integrity,signal:AbortSignal.any([signal,AbortSignal.timeout(60000)])});
 if(!response.ok)throw Error('Worker bank download failed.');
 const bytes=new Uint8Array(await response.arrayBuffer());signal.throwIfAborted();
 const source=await LoadAssetContainerAsync(bytes,stage.scene,{pluginExtension:'.glb',name:'worker-crowd-bank.glb'});
 const actors:{root:TransformNode;entry:ReturnType<typeof source.instantiateModelsToScene>;mesh:Mesh;group:AnimationGroup;hips:TransformNode;anchor:Vector3;duration:number}[]=[];
 function dispose(){for(const a of actors){stage.shadow.removeShadowCaster(a.mesh);a.entry.dispose();a.root.dispose();}source.dispose();}
 try{
  signal.throwIfAborted();source.animationGroups.forEach(g=>g.stop());
  const body=source.meshes.find(m=>m.name==='WorkerCorrected');
  if(!body||body.skeleton?.bones.length!==34)throw Error('Approved 34-joint worker missing.');
  for(const m of source.materials)if(m instanceof PBRMaterial)m.maxSimultaneousLights=4;
  for(let i=0;i<count;i++){
   const clip=motions[i%motions.length]+'_Corrected';
   const entry=source.instantiateModelsToScene(n=>`${i}:${n}`,false,{doNotInstantiate:true,predicate:e=>
    e instanceof Skeleton?e===body.skeleton:e instanceof AnimationGroup?e.name===clip:e instanceof Mesh?e.getTotalVertices()===0||e===body:true});
   const root=new TransformNode(`worker-${i}`,stage.scene);entry.rootNodes.forEach(n=>n.parent=root);
   const mesh=root.getChildMeshes().find(m=>m.getTotalVertices()>0) as Mesh;
   const group=entry.animationGroups[0],hips=root.getDescendants().find(n=>n.name===`${i}:Hips`) as TransformNode;
   if(!mesh||!hips||!group||entry.skeletons.length!==1){entry.dispose();root.dispose();throw Error('Independent worker rig could not be created.');}
   group.stop();mesh.receiveShadows=true;mesh.isPickable=false;mesh.alwaysSelectAsActiveMesh=true;stage.shadow.addShadowCaster(mesh);
   actors.push({root,entry,mesh,group,hips,anchor:Vector3.Zero(),duration:(group.to-group.from)/group.targetedAnimations[0].animation.framePerSecond});
  }
  if(new Set(actors.map(a=>a.mesh.skeleton)).size!==count||new Set(actors.map(a=>a.mesh.geometry)).size!==1)throw Error('Crowd sharing/independence invariant failed.');
  return {
   place(origin:Vector3){actors.forEach((a,i)=>{a.anchor.copyFrom(origin).addInPlaceFromFloats((i%6-2.5)*1.8,.015,(Math.floor(i/6)-1.5)*1.85);a.root.rotation.y=Math.PI;});},
   sample(seconds:number){for(const [i,a] of actors.entries()){
    const phase=(seconds/a.duration+i*.137)%1,frame=a.group.from+(a.group.to-a.group.from)*phase;
    for(const track of a.group.targetedAnimations){const target=track.target as TransformNode,value=track.animation.evaluate(frame);
     if(track.animation.targetProperty==='rotationQuaternion')target.rotationQuaternion!.copyFrom(value as Quaternion);
     else if(track.animation.targetProperty==='position')target.position.copyFrom(value as Vector3);
     else if(track.animation.targetProperty==='scaling')target.scaling.copyFrom(value as Vector3);
    }
    a.root.position.copyFrom(a.anchor);a.root.computeWorldMatrix(true);a.hips.computeWorldMatrix(true);
    const hip=a.hips.getAbsolutePosition();a.root.position.x+=a.anchor.x-hip.x;a.root.position.z+=a.anchor.z-hip.z;
   }},
   manifest:{src:file.src,sha256:file.sha256,bytes:file.bytes,count,trianglesPerWorker:25893,jointsPerWorker:34,motions,independentSkeletons:count,sharedGeometries:1},dispose,
  };
 }catch(e){dispose();throw e;}
}
