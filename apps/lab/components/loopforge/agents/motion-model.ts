import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import '@babylonjs/loaders/glTF/glTFFileLoader';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {Vector3,Quaternion} from '@babylonjs/core/Maths/math.vector';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {CharacterStage} from '../factory-study/scene';
import type {InspectionFile,InspectionSurface} from './inspection-model';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
export type MotionVersion='Source'|'Corrected';
export type InspectionMotion={file:InspectionFile;triangles:number;joints:number;extraJoints:number;revision:string;record:string;note:string;clips:{id:string;label:string;source:string;duration:number;markers:{label:string;time:number}[]}[]};
/** Shared baked-motion adapter. Source and corrected skins share geometry/materials;
 * only the selected mesh renders. All costume solving happens offline. */
export async function loadMotionModel(stage:CharacterStage,bank:InspectionMotion,signal:AbortSignal,onFrame:(phase:number,ended:boolean)=>void){
 const {scene,shadow}=stage,file=bank.file;
 const integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
 const response=await fetch(file.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)]),integrity,credentials:'same-origin'});
 if(!response.ok)throw Error('The motion bank could not be downloaded.');
 const bytes=new Uint8Array(await response.arrayBuffer());signal.throwIfAborted();
 const container=await LoadAssetContainerAsync(bytes,scene,{pluginExtension:'.glb',name:'character-motion-review.glb'});
 if(signal.aborted){container.dispose();signal.throwIfAborted();}
 const root=new TransformNode('Motion inspection subject',scene);let fill:DirectionalLight|null=null;
 try{
  const meshes=container.meshes.filter(m=>m.getTotalVertices()>0),source=meshes.find(m=>m.name==='Source_Body'),corrected=meshes.find(m=>m.name==='Corrected_Body');
  if(!source||!corrected||source.skeleton?.bones.filter(b=>b.getIndex()>=0).length!==bank.joints||corrected.skeleton?.bones.filter(b=>b.getIndex()>=0).length!==bank.joints+bank.extraJoints)throw Error('The source/corrected rig bank is incomplete.');
  for(const clip of bank.clips)for(const version of ['Source','Corrected'])if(!container.animationGroups.some(g=>g.name===`${clip.id}_${version}`))throw Error(`Missing ${clip.label} ${version} clip.`);
  container.addAllToScene();container.rootNodes.forEach(n=>{n.parent=root;});container.animationGroups.forEach(g=>g.stop());
  const neutral=container.transformNodes.map(n=>({n,p:n.position.clone(),r:n.rotationQuaternion?.clone()??Quaternion.FromEulerVector(n.rotation),s:n.scaling.clone()}));
  const hips=container.transformNodes.find(n=>n.name==='mixamorig:Hips');if(!hips)throw Error('Motion pelvis missing.');
  meshes.forEach(m=>{m.isPickable=false;m.receiveShadows=true;m.alwaysSelectAsActiveMesh=true;shadow.addShadowCaster(m);});
  fill=new DirectionalLight('Motion inspection lamp',new Vector3(.25,-.5,1),scene);fill.diffuse=new Color3(.94,.92,.87);fill.intensity=2.5;fill.includedOnlyMeshes=meshes;fill.renderPriority=5;
  const appearance=container.materials.filter((m):m is PBRMaterial=>m instanceof PBRMaterial).map(m=>{m.maxSimultaneousLights=6;return {m,texture:m.albedoTexture,mr:m.metallicTexture,color:m.albedoColor.clone(),metallic:m.metallic,roughness:m.roughness};});
  let id=bank.clips[0].id,version:MotionVersion='Corrected',group=container.animationGroups.find(g=>g.name===`${id}_${version}`),phase=0,playing=false,speed=1,loop=true,last=performance.now(),notifyAt=0,disposed=false;
  const anchor=new Vector3();
  function sample(){
   if(group)for(const track of group.targetedAnimations){
    const frame=group.from+(group.to-group.from)*phase,value=track.animation.evaluate(frame),target=track.target as TransformNode;
    if(track.animation.targetProperty==='rotationQuaternion')target.rotationQuaternion=(value as Quaternion).clone();
    else if(track.animation.targetProperty==='position')target.position.copyFrom(value as Vector3);
    else if(track.animation.targetProperty==='scaling')target.scaling.copyFrom(value as Vector3);
   }
   root.position.copyFrom(anchor);root.computeWorldMatrix(true);hips!.computeWorldMatrix(true);
   const p=hips!.getAbsolutePosition();root.position.x+=anchor.x-p.x;root.position.z+=anchor.z-p.z;root.computeWorldMatrix(true);stage.refresh();
  }
  function select(clip:string,next:MotionVersion,preserveTime=false){
   playing=false;if(!preserveTime)phase=0;id=clip;version=next;
   for(const {n,p,r,s}of neutral){n.position.copyFrom(p);n.rotationQuaternion=r.clone();n.scaling.copyFrom(s);}
   group=container.animationGroups.find(g=>g.name===`${id}_${version}`);source!.setEnabled(version==='Source');corrected!.setEnabled(version==='Corrected');sample();onFrame(phase,false);
  }
  const observer=scene.onBeforeRenderObservable.add(()=>{
   const now=performance.now(),dt=Math.min(.06,(now-last)/1000);last=now;if(!playing||!group)return;
   const duration=bank.clips.find(c=>c.id===id)?.duration??1,next=phase+dt*speed/duration,ended=!loop&&next>=1;
   phase=loop?next%1:Math.min(1,next);if(ended)playing=false;sample();
   if(ended||now-notifyAt>100){notifyAt=now;onFrame(phase,ended);}
  });
  function room(value:'security'|'conveyor'){const point=value==='security'?[131,122]:[120.8,149.6];anchor.set(...worldPoint(point[0],point[1]));anchor.y=.015;stage.gate(true);sample();}
  root.rotation.y=Math.PI;room('security');select(id,version);
  return {
   motion:{select,play(value:boolean){if(value&&phase===1)phase=0;playing=value&&!!group;last=performance.now();stage.refresh();},seek(value:number){phase=Math.max(0,Math.min(1,value));sample();},speed(value:number){speed=value;},loop(value:boolean){loop=value;}},
   // Equipment stays in the separate fitting mode until moving-seat clearance is reviewed.
   async face(){},eyes(){},room,turn(degrees:number){root.rotation.y=Math.PI+degrees*Math.PI/180;sample();},
   light(value:boolean){fill?.setEnabled(value);stage.refresh(true);},
   surface(value:InspectionSurface){for(const {m,texture,mr,color,metallic,roughness}of appearance){m.albedoTexture=value==='clay'?null:texture;m.metallicTexture=value==='clay'?null:mr;m.albedoColor=value==='clay'?new Color3(.46,.48,.44):color;m.metallic=value==='clay'?0:metallic;m.roughness=value==='clay'?.85:roughness;m.wireframe=value==='wireframe';}stage.refresh(true);},
   dispose(){if(disposed)return;disposed=true;scene.onBeforeRenderObservable.remove(observer);meshes.forEach(m=>shadow.removeShadowCaster(m));fill?.dispose();container.dispose();root.dispose();}
  };
 }catch(error){fill?.dispose();container.dispose();root.dispose();throw error;}
}
