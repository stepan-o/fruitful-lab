import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import '@babylonjs/loaders/glTF/glTFFileLoader';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {Vector3,Quaternion} from '@babylonjs/core/Maths/math.vector';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {CharacterStage} from '../factory-study/scene';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import manifest from '@/lib/assets/generated/loopforge-worker-review.json';
import review from '@/lib/loopforge/agents/worker-review.json';
export type WorkerVersion='Source'|'Corrected';
export type WorkerSurface='textured'|'clay'|'wireframe';
export const workerFile=manifest.assets['worker-01-corrected'].variants[0];
export async function loadWorker(stage:CharacterStage,signal:AbortSignal,onFrame:(phase:number,ended:boolean)=>void){
 const {scene,shadow}=stage;
 const integrity='sha256-'+btoa(String.fromCharCode(...workerFile.sha256.match(/../g)!.map(x=>parseInt(x,16))));
 const response=await fetch(workerFile.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)]),integrity,credentials:'same-origin'});
 if(!response.ok)throw Error('The worker could not be downloaded. Please retry.');
 const bytes=new Uint8Array(await response.arrayBuffer());signal.throwIfAborted();
 const container=await LoadAssetContainerAsync(bytes,scene,{pluginExtension:'.glb',name:'worker-01-motion-review.glb'});
 if(signal.aborted){container.dispose();signal.throwIfAborted();}
 const root=new TransformNode('Worker 01 motion review',scene);
 let fill:DirectionalLight|null=null;
 try{
  if(!container.skeletons.some(s=>s.bones.length===34)||!review.clips.every(c=>container.animationGroups.some(g=>g.name===c.id+'_Corrected')))throw Error('The worker rig or motion bank is incomplete.');
  container.addAllToScene();container.rootNodes.forEach(n=>{n.parent=root;});container.animationGroups.forEach(g=>g.stop());
  const neutral=container.transformNodes.map(n=>({n,p:n.position.clone(),r:n.rotationQuaternion?.clone()??Quaternion.FromEulerVector(n.rotation),s:n.scaling.clone()}));
  const hips=container.transformNodes.find(n=>n.name==='Hips');if(!hips)throw Error('Worker pelvis missing.');
  const meshes=container.meshes.filter(m=>m.getTotalVertices()>0);
  const corrected=meshes.find(m=>m.name==='WorkerCorrected'),source=meshes.find(m=>m.name!=='WorkerCorrected');if(!source||!corrected)throw Error('Source/corrected bodies missing.');
  meshes.forEach(m=>{m.isPickable=false;m.receiveShadows=true;m.alwaysSelectAsActiveMesh=true;shadow.addShadowCaster(m);});
  fill=new DirectionalLight('Worker inspection lamp',new Vector3(.25,-.5,1),scene);fill.diffuse=new Color3(.82,.9,1);fill.intensity=2.5;fill.includedOnlyMeshes=meshes;fill.renderPriority=5;
  const appearance=container.materials.filter((m):m is PBRMaterial=>m instanceof PBRMaterial).map(m=>{m.maxSimultaneousLights=6;return {m,texture:m.albedoTexture,mr:m.metallicTexture,color:m.albedoColor.clone(),metallic:m.metallic,roughness:m.roughness};});
  let id='idle',version:WorkerVersion='Corrected',group=container.animationGroups.find(g=>g.name==='idle_Corrected')!,phase=0,playing=false,speed=1,loop=true,centred=false,last=performance.now(),notifyAt=0,disposed=false;
  const anchor=new Vector3(),origin=new Vector3(),offset=new Vector3();
  const lines:Vector3[][]=[];for(let i=-8;i<=8;i++){lines.push([new Vector3(i*.1,.001,-.8),new Vector3(i*.1,.001,.8)],[new Vector3(-.8,.001,i*.1),new Vector3(.8,.001,i*.1)]);}
  const guide=MeshBuilder.CreateLineSystem('Worker ground reference · 10 cm',{lines},scene);guide.color=new Color3(.5,.64,.56);guide.alpha=.65;guide.isPickable=false;

  function sample(){
   if(group)for(const track of group.targetedAnimations){
    const frame=group.from+(group.to-group.from)*phase,value=track.animation.evaluate(frame),target=track.target as TransformNode;
    if(track.animation.targetProperty==='rotationQuaternion')target.rotationQuaternion=(value as Quaternion).clone();
    else if(track.animation.targetProperty==='position')target.position.copyFrom(value as Vector3);
    else if(track.animation.targetProperty==='scaling')target.scaling.copyFrom(value as Vector3);
   }
   root.position.copyFrom(anchor);root.computeWorldMatrix(true);
   if(centred){hips!.computeWorldMatrix(true);const p=hips!.getAbsolutePosition();root.position.x+=anchor.x-p.x;root.position.z+=anchor.z-p.z;root.computeWorldMatrix(true);}
   else{Vector3.TransformNormalToRef(origin,root.getWorldMatrix(),offset);root.position.x-=offset.x;root.position.z-=offset.z;root.computeWorldMatrix(true);}
   guide.position.copyFrom(anchor);stage.refresh();
  }
  function duration(){return group?Math.max(.001,(group.to-group.from)/group.targetedAnimations[0].animation.framePerSecond):1;}
  const observer=scene.onBeforeRenderObservable.add(()=>{
   const now=performance.now(),dt=Math.min(.06,(now-last)/1000);last=now;if(!playing)return;
   const next=phase+dt*speed/duration(),ended=!loop&&next>=1;phase=loop?next%1:Math.min(1,next);if(ended)playing=false;sample();
   if(ended||now-notifyAt>100){notifyAt=now;onFrame(phase,ended);}
  });
  function room(value:'security'|'conveyor'){const point=value==='security'?[131,122]:[120.8,149.6];anchor.set(...worldPoint(point[0],point[1]));anchor.y=.015;stage.gate(true);sample();}
  function select(value:string,next:WorkerVersion,preserveTime=false){
   playing=false;if(!preserveTime)phase=0;id=value;version=next;
   for(const {n,p,r,s}of neutral){n.position.copyFrom(p);n.rotationQuaternion=r.clone();n.scaling.copyFrom(s);}
   group=container.animationGroups.find(g=>g.name===(id.startsWith('Hand_')?id:version==='Corrected'?id+'_Corrected':id))!;
   corrected!.setEnabled(version==='Corrected');source!.setEnabled(version==='Source');
   const saved=phase;phase=0;origin.setAll(0);const following=centred;centred=false;sample();hips!.computeWorldMatrix(true);
   origin.copyFrom(hips!.getAbsolutePosition()).subtractInPlace(anchor);origin.rotateByQuaternionToRef(Quaternion.FromEulerAngles(0,-root.rotation.y,0),offset);origin.copyFrom(offset);origin.y=0;
   centred=following;phase=saved;sample();onFrame(phase,false);
  }
  root.rotation.y=Math.PI;room('security');select(id,version);
  return {
   place(x:number,y:number,z:number,yaw:number){anchor.set(x,y,z);root.rotation.y=Math.PI+yaw*Math.PI/180;sample();},
   duration,
   clip(value:string){select(value,version);},version(value:WorkerVersion){select(id,value,true);},ground(value:boolean){guide.setEnabled(value);stage.refresh();},
   play(value:boolean){if(value&&phase===1)phase=0;playing=value&&!!group;last=performance.now();stage.refresh();},
   seek(value:number){phase=Math.max(0,Math.min(1,value));sample();},speed(value:number){speed=value;},loop(value:boolean){loop=value;},
   centre(value:boolean){centred=value;sample();},turn(degrees:number){root.rotation.y=Math.PI+degrees*Math.PI/180;sample();},room,
   light(value:boolean){fill?.setEnabled(value);stage.refresh();},
   surface(value:WorkerSurface){for(const {m,texture,mr,color,metallic,roughness} of appearance){m.albedoTexture=value==='clay'?null:texture;m.metallicTexture=value==='clay'?null:mr;m.albedoColor=value==='clay'?new Color3(.4,.43,.42):color;m.metallic=value==='clay'?0:metallic;m.roughness=value==='clay'?.85:roughness;m.wireframe=value==='wireframe';}stage.refresh();},
   dispose(){if(disposed)return;disposed=true;scene.onBeforeRenderObservable.remove(observer);meshes.forEach(m=>shadow.removeShadowCaster(m));fill?.dispose();guide.dispose();container.dispose();root.dispose();}
  };
 }catch(error){fill?.dispose();container.dispose();root.dispose();throw error;}
}
