import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import './gltf-delivery';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {Vector3,Quaternion} from '@babylonjs/core/Maths/math.vector';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {CharacterStage} from '../factory-study/scene';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import manifest from '@/lib/assets/generated/loopforge-limen-motions.json';
import bodyManifest from '@/lib/assets/generated/loopforge-limen.json';
import {limenMotion,limenMotions,type LimenMotionId} from '@/lib/loopforge/agents/limen-motions';
import {type LimenPalette} from '@/lib/loopforge/agents/limen-palette';
import {createLimenBlade} from './limen-blade';
import {createPerformanceSampler} from './performance-sampler';
import {createLimenContactPose} from './limen-contact-pose';
import type {ActorView} from '@/lib/loopforge/encounters/contract';
import type {LimenSurface} from './limen-model';

export const limenMotionFile=manifest.assets.motions.variants[0];
/** Shared source performer for inspection and the scripted checkpoint. Approved legacy clips remain separate. */
export async function loadLimenMotions(stage:CharacterStage,signal:AbortSignal,onFrame:(phase:number)=>void,onEnd:()=>void,detail:'portrait'|'floor'|'overview'='portrait'){
 const file=detail==='portrait'?limenMotionFile:manifest.assets[detail==='floor'?'motions-floor':'motions-overview'].variants[0];
 const {scene,shadow}=stage;
 async function download(file:typeof limenMotionFile){
  const integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
  const r=await fetch(file.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(30000)]),integrity,credentials:'same-origin'});
  if(!r.ok)throw Error('LIMEN’s motion bank could not be downloaded. Please retry.');
  const bytes=new Uint8Array(await r.arrayBuffer());signal.throwIfAborted();return bytes;
 }
 const [bytes,bladeBytes]=await Promise.all([download(file),download(bodyManifest.assets['blade-housing'].variants[0])]);
 const body=await LoadAssetContainerAsync(bytes,scene,{pluginExtension:'.glb',name:'limen-landing-2026-10-22.glb'});
 let housing:Awaited<ReturnType<typeof LoadAssetContainerAsync>>|undefined,energy:ReturnType<typeof createLimenBlade>|undefined,fill:DirectionalLight|undefined;
 const root=new TransformNode('LIMEN source motion review',scene),reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 let observer:ReturnType<typeof scene.onBeforeRenderObservable.add>|undefined,disposed=false;
 const meshes:typeof body.meshes=[];
 function dispose(){if(disposed)return;disposed=true;if(observer)scene.onBeforeRenderObservable.remove(observer);meshes.forEach(m=>shadow.removeShadowCaster(m));fill?.dispose();energy?.dispose();housing?.dispose();body.dispose();root.dispose();}
 try{
  signal.throwIfAborted();
  if(body.skeletons[0]?.bones.length!==24||!limenMotions.every(m=>body.animationGroups.some(a=>a.name===m.id)))throw Error('The LIMEN source motion bank is incomplete.');
  body.addAllToScene();body.rootNodes.forEach(n=>{n.parent=root;});body.animationGroups.forEach(a=>a.stop());
  const contactPose=createLimenContactPose(body.animationGroups,body.transformNodes);
  const forearm=body.transformNodes.find(n=>n.name==='RightForeArm');
  if(!forearm)throw Error('The right forearm attachment is missing.');
  const socket=new TransformNode('LIMEN candidate forearm emitter',scene);socket.parent=forearm;
  // The rebuilt Meshy rig uses centimetres; equipment geometry uses metres.
  socket.scaling.setAll(100);socket.position.set(8,0,-4);
  housing=await LoadAssetContainerAsync(bladeBytes,scene,{pluginExtension:'.glb',name:'limen-emitter.glb'});signal.throwIfAborted();housing.addAllToScene();
  for(const n of housing.rootNodes){n.parent=socket;if(n instanceof TransformNode){n.scaling.setAll(1);n.rotationQuaternion=Quaternion.Identity();}}
  // This body's longer forearm needs the energy to begin at the wrist.
  const energyMount=new TransformNode('LIMEN visible wrist current',scene);energyMount.parent=socket;
  energyMount.scaling.set(1.8,1.45,1.8);energyMount.position.y=.39-.27*1.45;
  energy=createLimenBlade(scene,energyMount);
  meshes.push(...[...body.meshes,...housing.meshes].filter(m=>m.getTotalVertices()>0));
  meshes.forEach(m=>{m.isPickable=false;m.receiveShadows=true;m.alwaysSelectAsActiveMesh=true;shadow.addShadowCaster(m);});
  fill=new DirectionalLight('LIMEN motion inspection lamp',new Vector3(.25,-.5,1),scene);fill.diffuse=new Color3(.82,.9,1);fill.intensity=2.5;fill.includedOnlyMeshes=meshes;fill.renderPriority=5;
  const materials=[...body.materials,...housing.materials].filter((m):m is PBRMaterial=>m instanceof PBRMaterial);materials.forEach(m=>{m.maxSimultaneousLights=6;m.metallic=Math.min(m.metallic??1,.65);m.roughness=Math.max(m.roughness??1,.55);});
  const appearance=materials.map(m=>({m,texture:m.albedoTexture,color:m.albedoColor.clone(),metallic:m.metallic,roughness:m.roughness}));
  // Keep the rebuilt skull, dark joints and armour material separation.
  // Pale-steel paint remains a reference option on the legacy body only.
  let palette:LimenPalette='approved',clip:LimenMotionId='Shouting_Angrily',phase=0,playing=false,loop=false,speed=1,last=performance.now(),notifyAt=0,reduced=false,effectTime=0,pulseAt=-100;
  function appearanceUpdate(){energy?.palette(palette==='approved');stage.refresh();}
  function duration(){const a=body.animationGroups.find(a=>a.name===clip)!;return (a.to-a.from)/a.targetedAnimations[0].animation.framePerSecond;}
  function sample(){
   const a=body.animationGroups.find(a=>a.name===clip)!;
   for(const {animation,target}of a.targetedAnimations){const v=animation.evaluate(a.from+(a.to-a.from)*phase);if(animation.targetProperty==='rotationQuaternion')target.rotationQuaternion=(v as Quaternion).clone();else if(animation.targetProperty==='position')target.position.copyFrom(v as Vector3);else if(animation.targetProperty==='scaling')target.scaling.copyFrom(v as Vector3);}
   contactPose.sample({clip},phase*duration());
   root.computeWorldMatrix(true);const quiet=reduced||reducedMotion.matches;energy?.sample(quiet?0:effectTime,quiet?0:Math.max(0,1-Math.abs(effectTime-pulseAt-.25)/.25),1,0);stage.refresh();
  }
  observer=scene.onBeforeRenderObservable.add(()=>{
   const now=performance.now(),dt=Math.min(.06,(now-last)/1000);last=now;if(!playing)return;
   effectTime+=dt*speed;const next=phase+dt*speed/duration();phase=loop?next%1:Math.min(1,next);sample();
   if(!loop&&next>=1){playing=false;onFrame(1);onEnd();}else if(now-notifyAt>100){notifyAt=now;onFrame(phase);}
  });
  function room(value:'security'|'conveyor'){const p=value==='security'?[131,122]:[120.8,149.6];root.position.set(...worldPoint(p[0],p[1]));root.position.y=.015;root.rotation.y=Math.PI;stage.gate(true);stage.refresh();}
  room('security');appearanceUpdate();sample();
  const performanceSampler=createPerformanceSampler(body.animationGroups,'','y-up');
  return {
   presentation:{root,bodyMeshes:body.meshes.filter(m=>m.getTotalVertices()>0)},
   perform(actor:ActorView){if(!actor.cue)return;playing=false;performanceSampler.sample(actor.cue,actor.seconds,actor.previous,actor.blend);contactPose.sample(actor.cue,actor.seconds,actor.previous,actor.blend);const p=worldPoint(actor.position[0]/1000,actor.position[1]/1000);root.position.set(p[0],.015,p[2]);// Imported glTF faces -Z; encounter yaw zero faces the queue along +Z.
    root.rotation.y=Math.PI+actor.yaw*Math.PI/180;root.computeWorldMatrix(true);energy?.sample(reducedMotion.matches?0:actor.seconds,actor.motion==='strike'?.8:0,1,0);stage.refresh();},
   duration,clip(value:string){if(!limenMotion(value))throw Error('Unknown LIMEN motion');clip=value as LimenMotionId;phase=0;effectTime=0;pulseAt=-100;sample();onFrame(0);},
   play(value:boolean){if(value&&phase>=1)phase=0;playing=value;last=performance.now();sample();},
   seek(value:number){phase=Math.max(0,Math.min(1,value));effectTime=phase*duration();sample();},
   repeat(value:boolean){loop=value;},speed(value:number){speed=value;},
   reduced(value:boolean){reduced=value;sample();},blade(value:boolean){socket.setEnabled(value);stage.refresh();},pulse(){pulseAt=effectTime;stage.refresh();},
   turn(value:number){root.rotation.y=Math.PI+value*Math.PI/180;stage.refresh();},room,light(value:boolean){fill?.setEnabled(value);stage.refresh();},
   palette(value:LimenPalette){palette=value;appearanceUpdate();},
   surface(value:LimenSurface){for(const {m,texture,color,metallic,roughness} of appearance){m.albedoTexture=value==='clay'?null:texture;m.albedoColor=value==='clay'?new Color3(.4,.43,.42):color;m.metallic=value==='clay'?0:metallic;m.roughness=value==='clay'?.85:roughness;m.wireframe=value==='wireframe';}appearanceUpdate();},
   dispose,
  };
 }catch(e){dispose();throw e;}
}
