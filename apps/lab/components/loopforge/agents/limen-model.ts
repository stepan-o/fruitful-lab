import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import '@babylonjs/loaders/glTF/glTFFileLoader';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {Vector3,Quaternion} from '@babylonjs/core/Maths/math.vector';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {CharacterStage} from '../factory-study/scene';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import manifest from '@/lib/assets/generated/loopforge-limen.json';
import {createLimenBlade} from './limen-blade';
import {createLimenIdle} from './limen-idle';
import {limenIdleDuration,limenIdleCue} from '@/lib/loopforge/agents/limen-idle-cues';
import calibration from './limen-blade-calibration.json';

export type LimenClip='Idle'|'Rest'|'Walking'|'Running';
export type LimenSurface='textured'|'clay'|'wireframe';
export const limenFile=manifest.assets.limen.variants[0];
export const bladeFile=manifest.assets['blade-housing'].variants[0];
export async function loadLimen(stage:CharacterStage,signal:AbortSignal,onFrame:(phase:number)=>void){
 const {scene,shadow}=stage;
 async function download(file:typeof limenFile){
  const integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
  const response=await fetch(file.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(30000)]),integrity,credentials:'same-origin'});
  if(!response.ok)throw new Error('LIMEN could not be downloaded. Please retry.');
  const raw=await response.arrayBuffer();signal.throwIfAborted();return new Uint8Array(raw);
 }
 const [bodyBytes,bladeBytes]=await Promise.all([download(limenFile),download(bladeFile)]);
 const container=await LoadAssetContainerAsync(bodyBytes,scene,{pluginExtension:'.glb',name:'limen-body-v2.glb'});
 if(signal.aborted){container.dispose();signal.throwIfAborted();}
 let housing:Awaited<ReturnType<typeof LoadAssetContainerAsync>>|null=null;
 let energy:ReturnType<typeof createLimenBlade>|null=null;
 const root=new TransformNode('LIMEN model review',scene);
 let fill:DirectionalLight|null=null;const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 try{
  if(container.skeletons[0]?.bones.length!==23||!(['Rest','Walking','Running'] as const).every(n=>container.animationGroups.some(g=>g.name===n)))throw new Error('The LIMEN rig or animation package is incomplete.');
  container.addAllToScene();
  container.rootNodes.forEach(n=>{n.parent=root;});
  container.animationGroups.forEach(g=>g.stop());
  const forearm=container.transformNodes.find(n=>n.name==='mixamorig:RightForeArm');
  if(!forearm)throw new Error('LIMEN’s right forearm socket is missing.');
  const socket=new TransformNode('LIMEN rigid forearm socket',scene);socket.parent=forearm;
  // The imported joint hierarchy uses centimetres. Child equipment uses metres.
  socket.scaling.setAll(100);socket.position.copyFromFloats(calibration.socketPositionCm[0],calibration.socketPositionCm[1],calibration.socketPositionCm[2]);
  housing=await LoadAssetContainerAsync(bladeBytes,scene,{pluginExtension:'.glb',name:'limen-emitter.glb'});
  signal.throwIfAborted();housing.addAllToScene();
  for(const n of housing.rootNodes){n.parent=socket;if(n instanceof TransformNode){n.scaling.setAll(1);n.rotationQuaternion=Quaternion.Identity();}}
  energy=createLimenBlade(scene,socket);energy.sample(0);

  const meshes=[...container.meshes,...housing.meshes].filter(m=>m.getTotalVertices()>0);
  meshes.forEach(m=>{m.isPickable=false;m.receiveShadows=true;m.alwaysSelectAsActiveMesh=true;shadow.addShadowCaster(m);});
  fill=new DirectionalLight('LIMEN inspection lamp',new Vector3(.25,-.5,1),scene);fill.diffuse=new Color3(.82,.9,1);fill.intensity=2.5;fill.includedOnlyMeshes=meshes;fill.renderPriority=5;
  const materials=[...container.materials,...housing.materials].filter((m):m is PBRMaterial=>m instanceof PBRMaterial);
  // The room has five lights; reserve one slot for this model-only inspection key.
  materials.forEach(m=>{m.maxSimultaneousLights=6;});
  const appearance=materials.map(m=>({m,texture:m.albedoTexture,color:m.albedoColor.clone(),metallic:m.metallic,roughness:m.roughness}));
  let effectTime=0,pulseAt=-100,energyEnabled=true,reducedOverride=false;
  const sampleIdle=createLimenIdle(container.transformNodes);
  let clip:LimenClip='Idle',phase=0,playing=false,speed=1,last=performance.now(),notifyAt=0,disposed=false;
  function sample(){
   if(clip==='Idle'){sampleIdle(phase);root.computeWorldMatrix(true);stage.refresh();return;}
   const group=container.animationGroups.find(g=>g.name===clip)!;
   for(const track of group.targetedAnimations){
    const frame=group.from+(group.to-group.from)*phase,value=track.animation.evaluate(frame),target=track.target as TransformNode;
    if(track.animation.targetProperty==='rotationQuaternion')target.rotationQuaternion=(value as Quaternion).clone();
    else if(track.animation.targetProperty==='position')target.position.copyFrom(value as Vector3);
    else if(track.animation.targetProperty==='scaling')target.scaling.copyFrom(value as Vector3);
   }
   root.computeWorldMatrix(true);stage.refresh();
  }
  function duration(){
   if(clip==='Idle')return limenIdleDuration;
   const group=container.animationGroups.find(g=>g.name===clip)!;
   return Math.max(.001,(group.to-group.from)/group.targetedAnimations[0].animation.framePerSecond);
  }
  function effect(){
   const reduced=reducedOverride||reducedMotion.matches;
   const cue=clip==='Idle'?limenIdleCue(phase*limenIdleDuration,reduced):{power:1,adjust:0,surge:0};
   const age=effectTime-pulseAt,manual=Math.max(0,1-Math.abs(age-.25)/.25);
   energy?.sample(reduced?0:effectTime,reduced?0:Math.max(cue.surge,manual),cue.power,cue.adjust);
  }
  const observer=scene.onBeforeRenderObservable.add(()=>{
   const now=performance.now(),dt=Math.min(.06,(now-last)/1000);last=now;
   if(!playing)return;
   effectTime+=dt*speed;
   if(clip!=='Rest'){
    phase=(phase+dt*speed/duration())%1;sample();
   }
   effect();
   if(now-notifyAt>100){notifyAt=now;onFrame(phase);}
  });
  function room(value:'security'|'conveyor'){
   const point=value==='security'?[131,122]:[120.8,149.6];
   root.position.set(...worldPoint(point[0],point[1]));root.position.y=.015;root.rotation.y=Math.PI;stage.gate(true);stage.refresh();
  }
  room('security');sample();
  return {
   place(x:number,y:number,z:number,yaw:number){root.position.set(x,y,z);root.rotation.y=Math.PI+yaw*Math.PI/180;sample();},
   duration,
   clip(value:LimenClip){clip=value;phase=0;effectTime=0;pulseAt=-100;sample();effect();onFrame(0);},
   play(value:boolean){playing=value;last=performance.now();stage.refresh();},
   seek(value:number){phase=Math.max(0,Math.min(1,value));effectTime=phase*duration();pulseAt=-100;sample();effect();},
   speed(value:number){speed=value;},
   reduced(value:boolean){reducedOverride=value;effect();stage.refresh();},
   blade(value:boolean){energyEnabled=value;socket.setEnabled(value);stage.refresh();},
   pulse(){if(energyEnabled){pulseAt=effectTime;stage.refresh();}},
   turn(degrees:number){root.rotation.y=Math.PI+degrees*Math.PI/180;stage.refresh();},
   room,
   light(value:boolean){fill?.setEnabled(value);stage.refresh();},
   surface(value:LimenSurface){for(const {m,texture,color,metallic,roughness} of appearance){m.albedoTexture=value==='clay'?null:texture;m.albedoColor=value==='clay'?new Color3(.4,.43,.42):color;m.metallic=value==='clay'?0:metallic;m.roughness=value==='clay'?.85:roughness;m.wireframe=value==='wireframe';}stage.refresh();},
   dispose(){if(disposed)return;disposed=true;scene.onBeforeRenderObservable.remove(observer);meshes.forEach(m=>shadow.removeShadowCaster(m));fill?.dispose();energy?.dispose();housing?.dispose();container.dispose();root.dispose();}
  };
 }catch(error){fill?.dispose();energy?.dispose();housing?.dispose();container.dispose();root.dispose();throw error;}
}
