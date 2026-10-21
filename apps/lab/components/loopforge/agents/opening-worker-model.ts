import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import '@babylonjs/loaders/glTF/glTFFileLoader';
import '@babylonjs/loaders/glTF/2.0/Extensions/EXT_meshopt_compression';
import '@babylonjs/loaders/glTF/2.0/Extensions/EXT_texture_webp';
import '@babylonjs/loaders/glTF/2.0/Extensions/KHR_mesh_quantization';
import {MeshoptCompression} from '@babylonjs/core/Meshes/Compression/meshoptCompression';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {Vector3,Quaternion} from '@babylonjs/core/Maths/math.vector';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {CharacterStage} from '../factory-study/scene';
import type {ActorView} from '@/lib/loopforge/encounters/contract';
import type {WorkerSurface} from './worker-model';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {openingWorkerAsset,type OpeningWorkerId,type WorkerDetail} from '@/lib/loopforge/agents/opening-workers';
import delivery from '@/lib/loopforge/agents/opening-worker-delivery.json';
import {createPerformanceSampler} from './performance-sampler';
import {OpeningWorkerFinish} from './opening-worker-finish';
MeshoptCompression.Configuration.decoder.url=delivery.decoder.src;
/** One rig and bank per worker. Portraits and encounters sample the same baked tracks. */
export async function loadOpeningWorker(stage:CharacterStage,worker:OpeningWorkerId,detail:WorkerDetail,signal:AbortSignal,onFrame:(phase:number,ended:boolean)=>void=()=>{}){
 const {scene,shadow}=stage,file=openingWorkerAsset(worker,detail);
 const integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
 const response=await fetch(file.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)]),integrity,credentials:'same-origin'});
 if(!response.ok)throw Error(`Could not download ${worker}. Please retry.`);
 const bytes=new Uint8Array(await response.arrayBuffer());signal.throwIfAborted();
 const container=await LoadAssetContainerAsync(bytes,scene,{pluginExtension:'.glb',name:`${worker}-${detail}.glb`});
 if(signal.aborted){container.dispose();signal.throwIfAborted();}
 const root=new TransformNode(`${worker} placement`,scene);
 let lamp:DirectionalLight|null=null,guide:ReturnType<typeof MeshBuilder.CreateLineSystem>|null=null;
 try{
  if(container.skeletons.length!==1||container.skeletons[0].bones.length!==24||!file.clips.every(id=>container.animationGroups.some(g=>g.name===id)))throw Error(`${worker}'s rig or motion bank is incomplete.`);
  container.addAllToScene();container.rootNodes.forEach(n=>n.parent=root);container.animationGroups.forEach(g=>g.stop());
  const meshes=container.meshes.filter(m=>m.getTotalVertices()>0),hips=container.transformNodes.find(n=>n.name==='Hips');
  if(!hips)throw Error(`${worker}'s pelvis is missing.`);
  meshes.forEach(m=>{m.isPickable=false;m.receiveShadows=true;shadow.addShadowCaster(m);});
  const reviewSampler=createPerformanceSampler(container.animationGroups,'','source'),performer=createPerformanceSampler(container.animationGroups,'','y-up');
  lamp=new DirectionalLight(`${worker} inspection lamp`,new Vector3(.25,-.5,1),scene);lamp.diffuse=new Color3(.82,.9,1);lamp.intensity=2.5;lamp.includedOnlyMeshes=meshes;lamp.renderPriority=5;
  const materials=container.materials.filter((m):m is PBRMaterial=>m instanceof PBRMaterial).map(m=>{m.maxSimultaneousLights=6;return {m,texture:m.albedoTexture,mr:m.metallicTexture,normal:m.bumpTexture,color:m.albedoColor.clone(),metallic:m.metallic,roughness:m.roughness,paint:new OpeningWorkerFinish(m,worker)};});
  // The source exports treat painted panels as near-perfect metal. Retain maps,
  // but provide a reversible rough workshop finish under the shared room lights.
  let factoryFinish=worker!=='bob',normalDetail=detail!=='console';
  function normals(value:boolean){normalDetail=value;for(const {m,normal}of materials)m.bumpTexture=value?normal:null;stage.refresh();}
  normals(normalDetail);
  function finish(value:boolean){factoryFinish=value;for(const {m,metallic,roughness,paint}of materials){paint.enabled=value?1:0;m.metallic=value?Math.min(metallic??1,.35):metallic;m.roughness=value?Math.max(roughness??1,.65):roughness;}stage.refresh();}
  finish(factoryFinish);
  const groups=new Map(container.animationGroups.map(g=>[g.name,g]));
  let id='idle',phase=0,playing=false,speed=1,loop=true,centred=false,last=performance.now(),notifyAt=0,disposed=false;
  const anchor=new Vector3(),origin=new Vector3(),offset=new Vector3();
  const lines:Vector3[][]=[];for(let i=-10;i<=10;i++){lines.push([new Vector3(i*.1,.002,-1),new Vector3(i*.1,.002,1)],[new Vector3(-1,.002,i*.1),new Vector3(1,.002,i*.1)]);}
  guide=MeshBuilder.CreateLineSystem(`${worker} ground · 10 cm`,{lines},scene);guide.color=new Color3(.5,.64,.56);guide.alpha=.65;guide.isPickable=false;
  function duration(){const g=groups.get(id)!;return Math.max(.001,(g.to-g.from)/g.targetedAnimations[0].animation.framePerSecond);}
  function sample(){
   reviewSampler.sample({clip:id},phase*duration());root.position.copyFrom(anchor);root.computeWorldMatrix(true);
   if(centred){hips!.computeWorldMatrix(true);const p=hips!.getAbsolutePosition();root.position.x+=anchor.x-p.x;root.position.z+=anchor.z-p.z;}
   else{Vector3.TransformNormalToRef(origin,root.getWorldMatrix(),offset);root.position.x-=offset.x;root.position.z-=offset.z;}
   root.computeWorldMatrix(true);guide!.position.copyFrom(anchor);stage.refresh();
  }
  function clip(value:string){
   if(!groups.has(value))throw Error(`Missing ${worker} motion: ${value}`);playing=false;id=value;phase=0;origin.setAll(0);
   const following=centred;centred=false;sample();hips!.computeWorldMatrix(true);
   origin.copyFrom(hips!.getAbsolutePosition()).subtractInPlace(anchor);origin.rotateByQuaternionToRef(Quaternion.FromEulerAngles(0,-root.rotation.y,0),offset);origin.copyFrom(offset);origin.y=0;
   centred=following;sample();onFrame(0,false);
  }
  function room(value:'security'|'conveyor'){const p=value==='security'?[131,122]:[120.8,149.6];anchor.set(...worldPoint(p[0],p[1]));anchor.y=.015;stage.gate(true);sample();}
  const observer=scene.onBeforeRenderObservable.add(()=>{
   const now=performance.now(),dt=Math.min(.06,(now-last)/1000);last=now;if(!playing)return;
   const next=phase+dt*speed/duration(),ended=!loop&&next>=1;phase=loop?next%1:Math.min(1,next);if(ended)playing=false;sample();
   if(ended||now-notifyAt>100){notifyAt=now;onFrame(phase,ended);}
  });
  root.rotation.y=Math.PI;room('security');clip(id);
  return {
   file,clips:file.clips,duration,clip,room,finish,normals,
   play(value:boolean){if(value&&phase===1)phase=0;playing=value;last=performance.now();stage.refresh();},
   seek(value:number){phase=Math.max(0,Math.min(1,value));sample();},speed(value:number){speed=value;},loop(value:boolean){loop=value;},
   centre(value:boolean){centred=value;sample();},turn(value:number){root.rotation.y=Math.PI+value*Math.PI/180;sample();},
   light(value:boolean){lamp?.setEnabled(value);stage.refresh();},ground(value:boolean){guide?.setEnabled(value);stage.refresh();},
   surface(value:WorkerSurface){for(const {m,texture,mr,normal,color,metallic,roughness,paint}of materials){paint.enabled=value==='clay'||!factoryFinish?0:1;m.bumpTexture=value==='clay'||!normalDetail?null:normal;m.albedoTexture=value==='clay'?null:texture;m.metallicTexture=value==='clay'?null:mr;m.albedoColor=value==='clay'?new Color3(.4,.43,.42):color;m.metallic=value==='clay'?0:factoryFinish?Math.min(metallic??1,.35):metallic;m.roughness=value==='clay'?.85:factoryFinish?Math.max(roughness??1,.65):roughness;m.wireframe=value==='wireframe';}stage.refresh();},
   perform(view:ActorView,position:Vector3){if(!view.cue)return;playing=false;lamp?.setEnabled(false);guide?.setEnabled(false);performer.sample(view.cue,view.seconds,view.previous,view.blend);const from=view.previous?.yaw??view.yaw,delta=((view.yaw-from+540)%360)-180,t=Math.min(1,view.seconds/.4);root.rotation.y=Math.PI+(from+delta*t*t*(3-2*t))*Math.PI/180;root.position.copyFrom(position);root.computeWorldMatrix(true);},
   dispose(){if(disposed)return;disposed=true;scene.onBeforeRenderObservable.remove(observer);meshes.forEach(m=>shadow.removeShadowCaster(m));lamp?.dispose();guide?.dispose();container.dispose();root.dispose();}
  };
 }catch(error){lamp?.dispose();guide?.dispose();container.dispose();root.dispose();throw error;}
}
