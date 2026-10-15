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
import manifest from '@/lib/assets/generated/loopforge-stiletto-review.json';
import review from '@/lib/loopforge/agents/stiletto-review.json';
import modules from '@/lib/assets/generated/loopforge-character-modules.json';
import {createWelderFlame} from './welder-flame';
import {createFaceEmission} from './character-emission';
import type {Mesh} from '@babylonjs/core/Meshes/mesh';
export type StilettoTools='both'|'left'|'right'|'none'|'welders'|'blade-welder'|'welder-blade';
export const welderFile=modules.assets['stiletto-welder'].variants[0];
export type StilettoSurface='textured'|'clay'|'wireframe';
export const stilettoFile=manifest.assets.stiletto.variants[0];
export async function loadStiletto(stage:CharacterStage,signal:AbortSignal,onFrame:(phase:number,ended:boolean)=>void){
 const {scene,shadow}=stage;
 const integrity='sha256-'+btoa(String.fromCharCode(...stilettoFile.sha256.match(/../g)!.map(x=>parseInt(x,16))));
 const response=await fetch(stilettoFile.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)]),integrity,credentials:'same-origin'});
 if(!response.ok)throw Error('The stiletto could not be downloaded. Please retry.');
 const bytes=new Uint8Array(await response.arrayBuffer());signal.throwIfAborted();
 const container=await LoadAssetContainerAsync(bytes,scene,{pluginExtension:'.glb',name:'stiletto-01-motion-review.glb'});
 if(signal.aborted){container.dispose();signal.throwIfAborted();}
 const root=new TransformNode('Stiletto 01 motion review',scene);
 let fill:DirectionalLight|null=null;
 let toolContainer:Awaited<ReturnType<typeof LoadAssetContainerAsync>>|null=null,welderPromise:Promise<void>|null=null;
 const welders:Mesh[]=[];let toolMode:StilettoTools='both',appearanceMode:StilettoSurface='textured',highlighted=false,flameEnabled=true,fxMotion=true,fxTime=0;
 const flames:ReturnType<typeof createWelderFlame>[]=[];let visor:ReturnType<typeof createFaceEmission>|null=null;
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 try{
  if(container.skeletons[0]?.bones.length!==24||!review.clips.every(c=>container.animationGroups.some(g=>g.name===c.id)&&(!c.corrected||container.animationGroups.some(g=>g.name===c.id+'__corrected'))))throw Error('The stiletto rig or motion bank is incomplete.');
  container.addAllToScene();container.rootNodes.forEach(n=>{n.parent=root;});container.animationGroups.forEach(g=>g.stop());
  if(!container.meshes.some(m=>m.name==='LeftBlade')||!container.meshes.some(m=>m.name==='RightBlade'))throw Error('Blade attachments missing.');
  const neutral=container.transformNodes.map(n=>({n,p:n.position.clone(),r:n.rotationQuaternion?.clone()??Quaternion.FromEulerVector(n.rotation),s:n.scaling.clone()}));
  const head=container.transformNodes.find(n=>n.name==='Head'),body=container.meshes.find(m=>m.name==='char1');
  const headBone=container.skeletons[0].bones.find(b=>b.name==='Head');
  if(!head||!body||!headBone||!['Left','Right'].every(side=>container.transformNodes.some(n=>n.name===side+'ForeArm')))throw Error('Character attachment anchors missing.');
  // Skin bind space differs from the skinned mesh node transform. Attach in head bind space.
  visor=createFaceEmission(body,{x:2.5,y:170.9,rx:2.9,ry:.55,zMin:5,slope:.19},new Color3(1,.025,.045),head,.08,headBone.getAbsoluteInverseBindMatrix(),{bottom:159.5,top:170.9,halfWidth:.4});
  const hips=container.transformNodes.find(n=>n.name==='Hips');if(!hips)throw Error('Stiletto pelvis missing.');
  const meshes=container.meshes.filter(m=>m.getTotalVertices()>0);
  meshes.forEach(m=>{m.isPickable=false;m.receiveShadows=true;m.alwaysSelectAsActiveMesh=true;shadow.addShadowCaster(m);});
  fill=new DirectionalLight('Stiletto inspection lamp',new Vector3(.25,-.5,1),scene);fill.diffuse=new Color3(.82,.9,1);fill.intensity=2.5;fill.includedOnlyMeshes=meshes;fill.renderPriority=5;
  const appearance=container.materials.filter((m):m is PBRMaterial=>m instanceof PBRMaterial).map(m=>{m.maxSimultaneousLights=6;return {m,texture:m.albedoTexture,mr:m.metallicTexture,color:m.albedoColor.clone(),metallic:m.metallic,roughness:m.roughness};});
  let group=container.animationGroups.find(g=>g.name==='Running__corrected')!,phase=.2/review.clips.find(c=>c.id==='Running')!.duration,playing=false,speed=1,loop=true,centred=true,last=performance.now(),notifyAt=0,disposed=false;
  const anchor=new Vector3();
  function sample(){
   if(group)for(const track of group.targetedAnimations){
    const frame=group.from+(group.to-group.from)*phase,value=track.animation.evaluate(frame),target=track.target as TransformNode;
    if(track.animation.targetProperty==='rotationQuaternion')target.rotationQuaternion=(value as Quaternion).clone();
    else if(track.animation.targetProperty==='position')target.position.copyFrom(value as Vector3);
    else if(track.animation.targetProperty==='scaling')target.scaling.copyFrom(value as Vector3);
   }
   root.position.copyFrom(anchor);root.computeWorldMatrix(true);
   if(centred){hips!.computeWorldMatrix(true);const p=hips!.getAbsolutePosition();root.position.x+=anchor.x-p.x;root.position.z+=anchor.z-p.z;root.computeWorldMatrix(true);}
   stage.refresh();
  }
  function duration(){return group?Math.max(.001,(group.to-group.from)/group.targetedAnimations[0].animation.framePerSecond):1;}
  const observer=scene.onBeforeRenderObservable.add(()=>{
   const now=performance.now(),dt=Math.min(.06,(now-last)/1000);last=now;if(flameEnabled){if(fxMotion&&!reducedMotion.matches)fxTime+=dt;flames.forEach(f=>f.sample(fxTime));}if(!playing)return;
   const next=phase+dt*speed/duration(),ended=!loop&&next>=1;phase=loop?next%1:Math.min(1,next);if(ended)playing=false;sample();
   if(ended||now-notifyAt>100){notifyAt=now;onFrame(phase,ended);}
  });
  function room(value:'security'|'conveyor'){const point=value==='security'?[131,122]:[120.8,149.6];anchor.set(...worldPoint(point[0],point[1]));anchor.y=.015;stage.gate(true);sample();}
  root.rotation.y=Math.PI;room('security');
  function applyTools(){
   for(const [index,side] of ['Left','Right'].entries()){
    const blade=toolMode==='both'||toolMode===side.toLowerCase()||toolMode===(index===0?'blade-welder':'welder-blade');
    const welder=toolMode==='welders'||toolMode===(index===0?'welder-blade':'blade-welder');
    container.meshes.find(m=>m.name===side+'Blade')?.setEnabled(blade);welders[index]?.setEnabled(welder);flames[index]?.enabled(welder&&flameEnabled);
   }stage.refresh(true);
  }
  function surface(value:StilettoSurface){appearanceMode=value;for(const {m,texture,mr,color,metallic,roughness} of appearance){m.albedoTexture=value==='clay'?null:texture;m.metallicTexture=value==='clay'?null:mr;m.albedoColor=value==='clay'?new Color3(.4,.43,.42):color;m.metallic=value==='clay'?0:metallic;m.roughness=value==='clay'?.85:roughness;m.wireframe=value==='wireframe';}stage.refresh(true);}
  function highlight(value:boolean){highlighted=value;for(const {m} of appearance)if(m.name==='blade'||m.name==='welder')m.emissiveColor=value?new Color3(.45,.09,.025):Color3.Black();stage.refresh();}
  async function loadWelders(){
   const integrity='sha256-'+btoa(String.fromCharCode(...welderFile.sha256.match(/../g)!.map(x=>parseInt(x,16))));
   const response=await fetch(welderFile.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)]),integrity,credentials:'same-origin'});
   if(!response.ok)throw Error('Welder module could not be downloaded.');
   const bytes=new Uint8Array(await response.arrayBuffer());signal.throwIfAborted();
   const loaded=await LoadAssetContainerAsync(bytes,scene,{pluginExtension:'.glb',name:'stiletto-welder.glb'});
   if(disposed||signal.aborted){loaded.dispose();throw Error('Welder loading cancelled.');}
   const source=loaded.meshes.find(m=>m.getTotalVertices()>0) as Mesh|undefined;
   if(!source){loaded.dispose();throw Error('Welder geometry missing.');}
   toolContainer=loaded;loaded.addAllToScene();
   for(const [index,side] of ['Left','Right'].entries()){
    const mesh=index===0?source:source.clone('RightWelder',null,true)!;
    mesh.name=side+'Welder';mesh.parent=container.transformNodes.find(n=>n.name===side+'ForeArm')!;
    // Imported rig uses centimetres. Prop uses metres, +Y from collar to nozzle.
    mesh.position.set(0,34,0);mesh.scaling.setAll(100);mesh.rotationQuaternion=Quaternion.RotationAxis(Vector3.Up(),index*Math.PI);
    mesh.isPickable=false;mesh.receiveShadows=true;mesh.alwaysSelectAsActiveMesh=true;shadow.addShadowCaster(mesh);meshes.push(mesh);welders.push(mesh);flames.push(createWelderFlame(mesh,meshes));
   }
   for(const m of loaded.materials)if(m instanceof PBRMaterial){m.maxSimultaneousLights=6;appearance.push({m,texture:m.albedoTexture,mr:m.metallicTexture,color:m.albedoColor.clone(),metallic:m.metallic,roughness:m.roughness});}
   if(fill)fill.includedOnlyMeshes=meshes;surface(appearanceMode);highlight(highlighted);applyTools();
  }

  return {
   clip(value:string,keepPhase=false){playing=false;if(!keepPhase)phase=0;for(const {n,p,r,s} of neutral){n.position.copyFrom(p);n.rotationQuaternion=r.clone();n.scaling.copyFrom(s);}group=container.animationGroups.find(g=>g.name===value)!;sample();onFrame(phase,false);},
   play(value:boolean){if(value&&phase===1)phase=0;playing=value&&!!group;last=performance.now();stage.refresh();},
   seek(value:number){phase=Math.max(0,Math.min(1,value));sample();},speed(value:number){speed=value;},loop(value:boolean){loop=value;},
   centre(value:boolean){centred=value;sample();},turn(degrees:number){root.rotation.y=Math.PI+degrees*Math.PI/180;sample();},room,
   async tools(value:StilettoTools){if(['welders','blade-welder','welder-blade'].includes(value)&&!welders.length){welderPromise??=loadWelders().catch(error=>{welderPromise=null;throw error;});await welderPromise;}if(disposed)return;toolMode=value;applyTools();},
   highlight,visor(value:boolean){visor?.enabled(value);stage.refresh();},flame(value:boolean){flameEnabled=value;applyTools();},effectsMotion(value:boolean){fxMotion=value;stage.refresh();},
   light(value:boolean){fill?.setEnabled(value);stage.refresh();},
   surface,
   dispose(){if(disposed)return;disposed=true;scene.onBeforeRenderObservable.remove(observer);meshes.forEach(m=>shadow.removeShadowCaster(m));fill?.dispose();visor?.dispose();flames.forEach(f=>f.dispose());welders.forEach(m=>m.dispose());toolContainer?.dispose();container.dispose();root.dispose();}
  };
 }catch(error){fill?.dispose();visor?.dispose();flames.forEach(f=>f.dispose());container.dispose();root.dispose();throw error;}
}
