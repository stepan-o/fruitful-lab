import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import '@babylonjs/loaders/glTF/glTFFileLoader';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import {Vector3,Quaternion,Matrix} from '@babylonjs/core/Maths/math.vector';
import {RawTexture} from '@babylonjs/core/Materials/Textures/rawTexture';
import {Texture} from '@babylonjs/core/Materials/Textures/texture';
import {BakedVertexAnimationManager} from '@babylonjs/core/BakedVertexAnimation/bakedVertexAnimationManager';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {AssetContainer,InstantiatedEntries} from '@babylonjs/core/assetContainer';
import type {AnimationGroup} from '@babylonjs/core/Animations/animationGroup';
import type {CharacterStage} from '../factory-study/scene';
import type {Actor,TestView} from '@/lib/loopforge/agents/production-test';
import manifest from '@/lib/assets/generated/loopforge-agents.json';
import {worldPoint} from '@/lib/loopforge/spatial/floor';

type Rig = {rest:Record<string,number[]>; sizes:{upper:number;lower:number}; bones:string[]; clips:string[]};
type Pack = {container:AssetContainer;rig:Rig};
type Puppet = {root:TransformNode;entry:InstantiatedEntries;nodes:Map<string,TransformNode>;clip:AnimationGroup|null;appearance:string;hands:Record<string,Vector3>};
export type CastReport={mode:'skeletal'|'hybrid';actors:number;loadedBytes:number;bakedBytes:number;loadMs:number;puppets:number;crowdGroups:number;contactErrorMm:number};
const groups=['worker','worker-ribbed','worker-plated'];
const wp=(p:readonly number[])=>new Vector3(...worldPoint(p[0]/1000,p[2]/1000)).add(new Vector3(0,p[1]/1000,0));
export async function loadCast(stage:CharacterStage,signal:AbortSignal,progress:(s:string)=>void){
 const {scene,shadow}=stage,started=performance.now(),packs=new Map<string,Pack>(),puppets=new Map<string,Puppet>();let bytes=0,disposed=false,mode:'skeletal'|'hybrid'='hybrid';
 const resources:AssetContainer[]=[];
 async function fetchAsset(id:string){const entry=manifest.assets[id as keyof typeof manifest.assets].variants[0];const integrity='sha256-'+btoa(String.fromCharCode(...entry.sha256.match(/../g)!.map(x=>parseInt(x,16))));const r=await fetch(entry.src,{signal,integrity,credentials:'omit'});if(!r.ok)throw new Error(`Unable to load ${id}`);bytes+=entry.bytes;return r;}
 try{
  // Bounded sequential decode prevents eight simultaneous GLB parsers on phones.
  for(const name of [...groups,'limen','stiletto',...groups.map(x=>x+'-low')]){progress('Loading '+name.replaceAll('-',' ')+'…');const raw=await (await fetchAsset(name)).arrayBuffer();if(signal.aborted)throw new DOMException('Aborted','AbortError');const container=await LoadAssetContainerAsync(new Uint8Array(raw),scene,{pluginExtension:'.glb',name:name+'.glb'});resources.push(container);const rig=await (await fetchAsset(name+'-rig')).json() as Rig;
   if(!container.skeletons.length||!rig.bones.every(n=>container.skeletons[0].bones.some(b=>b.name===n))||!rig.clips.every(c=>container.animationGroups.some(g=>g.name===c)))throw new Error('Character rig is incomplete');packs.set(name,{container,rig});
  }
  const baked=await (await fetchAsset('worker-baked')).json() as {vertexData:string;width:number;height:number};const binary=Uint8Array.from(atob(baked.vertexData),c=>c.charCodeAt(0)),floats=new Float32Array(binary.buffer);
  if(baked.width!==72||baked.height!==180||floats.length!==baked.width*baked.height*4||!floats.every(Number.isFinite))throw new Error('Invalid baked animation');
  // Export reflects X when converting this left-handed authored rig to glTF.
  for(let i=0;i<floats.length;i++){const k=i%16;if((k%4===0)!==(Math.floor(k/4)===0))floats[i]*=-1;}
  const texture=RawTexture.CreateRGBATexture(floats,baked.width,baked.height,scene,false,false,Texture.NEAREST_NEAREST,1),manager=new BakedVertexAnimationManager(scene);manager.texture=texture;manager.time=0;
  const batches: {kind:string;meshes:Mesh[];root:TransformNode;entry:InstantiatedEntries;matrices:Float32Array;params:Float32Array;count:number}[]=[];
  function make(kind:string,id:string):Puppet {const pack=packs.get(kind)!;const root=new TransformNode(id,scene),entry=pack.container.instantiateModelsToScene(n=>id+'/'+n,false,{doNotInstantiate:true});entry.rootNodes.forEach(n=>{n.parent=root;});entry.animationGroups.forEach(g=>g.stop());const nodes=new Map<string,TransformNode>();for(const b of entry.skeletons[0].bones){const node=b.getTransformNode();if(node)nodes.set(b.name.split('/').at(-1)!,node);}for(const m of root.getChildMeshes()){m.isPickable=false;m.receiveShadows=true;shadow.addShadowCaster(m);}return {root,entry,nodes,clip:null,appearance:kind,hands:{}};}
  for(const kind of groups){const p=make(kind+'-low','crowd/'+kind),meshes=p.root.getChildMeshes().filter(m=>m instanceof Mesh&&m.getTotalVertices()>0) as Mesh[];for(const mesh of meshes){mesh.bakedVertexAnimationManager=manager;mesh.alwaysSelectAsActiveMesh=true;shadow.removeShadowCaster(mesh);mesh.thinInstanceSetBuffer('matrix',new Float32Array(0),16,false);}batches.push({kind,meshes,root:p.root,entry:p.entry,matrices:new Float32Array(0),params:new Float32Array(0),count:0});}
  const cradle=new TransformNode('reserved brain cradle',scene),metal=new PBRMaterial('cradle brass',scene);metal.albedoColor=Color3.FromHexString('#655839').toLinearSpace();metal.metallic=.65;metal.roughness=.66;
  const flesh=new PBRMaterial('test cortex',scene);flesh.albedoColor=Color3.FromHexString('#745244').toLinearSpace();flesh.metallic=.05;flesh.roughness=.6;
  const tray=MeshBuilder.CreateBox('cradle tray',{width:.72,height:.055,depth:.48},scene);tray.material=metal;tray.parent=cradle;
  for(const side of [-1,1]){const handle=MeshBuilder.CreateTorus('cradle handle',{diameter:.17,thickness:.024,tessellation:12},scene);handle.rotation.z=Math.PI/2;handle.position.set(side*.32,.075,0);handle.material=metal;handle.parent=cradle;}
  const brain=MeshBuilder.CreateSphere('test cortical mass',{diameter:.36,segments:12},scene);brain.scaling.set(1.4,.85,1);brain.position.y=.16;brain.material=flesh;brain.parent=cradle;
  for(let i=0;i<16;i++){const fold=MeshBuilder.CreateTorus('cortical fold',{diameter:.13,thickness:.024,tessellation:10},scene);fold.rotation.set(i*.9,i*.6,i*.31);fold.position.set(Math.sin(i*2.1)*.19,.16+Math.cos(i*.8)*.095,Math.cos(i*2.1)*.12);fold.material=flesh;fold.parent=cradle;}
  const dockPaint=new PBRMaterial('dock enamel',scene);dockPaint.albedoColor=Color3.FromHexString('#30463f').toLinearSpace();dockPaint.metallic=.45;dockPaint.roughness=.78;const docks=new TransformNode('reserved transfer docks',scene);for(const x of [120000,122000]){const top=MeshBuilder.CreateBox('dock surface',{width:.82,height:.10,depth:.56},scene);top.material=metal;top.position.copyFrom(wp([x,965,150100]));top.parent=docks;for(const side of [-1,1]){const leg=MeshBuilder.CreateBox('dock leg',{width:.08,height:.92,depth:.44},scene);leg.material=dockPaint;leg.position.copyFrom(wp([x+side*300,460,150100]));leg.parent=docks;}}
  const credential=MeshBuilder.CreateBox('worker credential',{width:.095,height:.07,depth:.008},scene);credential.material=metal;
  let contactError=0,previous:TestView|null=null,current:TestView|null=null,received=performance.now(),paused=true,frameMode='';
  function destroy(p:Puppet){for(const m of p.root.getChildMeshes())shadow.removeShadowCaster(m);p.entry.dispose();p.root.dispose();}
  function pose(p:Puppet,a:Actor,t:number){const clipName=a.clip,group=p.entry.animationGroups.find(g=>g.name.endsWith('/'+clipName)||g.name===clipName)!;
   if(group!==p.clip){p.clip=group;}for(const track of group.targetedAnimations){const value=track.animation.evaluate(t*30),target=track.target as TransformNode;if(track.animation.targetProperty==='rotationQuaternion')target.rotationQuaternion=value.clone();else if(track.animation.targetProperty==='position')target.position.copyFrom(value);}
   if(a.stride!==undefined){const wave=Math.sin(a.stride*Math.PI*2);for(const side of ['L','R']){const sign=side==='L'?1:-1;p.nodes.get('thigh'+side)!.rotationQuaternion=Quaternion.RotationYawPitchRoll(0,0,wave*.22*sign);p.nodes.get('shin'+side)!.rotationQuaternion=Quaternion.RotationYawPitchRoll(0,Math.max(0,-wave*sign)*.24,0);}}
   p.root.position.copyFrom(wp(a.position));p.root.rotationQuaternion=Quaternion.RotationYawPitchRoll(a.yaw/1000,0,0);p.root.computeWorldMatrix(true);
  }
  /** Two-link joint correction, in imported node space. End target is an actual prop handle. */
  function handTo(p:Puppet,side:'L'|'R',world:Vector3){const u=p.nodes.get('upper'+side)!,l=p.nodes.get('lower'+side)!,h=p.nodes.get('hand'+side)!;if(!u||!l||!h)return;
   u.computeWorldMatrix(true);const parent=u.parent as TransformNode;parent.computeWorldMatrix(true);const inv=Matrix.Invert(parent.getWorldMatrix()),target=Vector3.TransformCoordinates(world,inv).subtract(u.position),L1=l.position.length(),L2=h.position.length(),distance=Math.min(L1+L2-.001,Math.max(.02,target.length())),direction=target.normalizeToNew();
   const pole=new Vector3(side==='L'?-.3:.3,-1,.4),bend=pole.subtract(direction.scale(Vector3.Dot(pole,direction))).normalize();const along=(L1*L1+distance*distance-L2*L2)/(2*distance),elbow=direction.scale(along).add(bend.scale(Math.sqrt(Math.max(0,L1*L1-along*along))));
   const q1=Quaternion.FromUnitVectorsToRef(l.position.normalizeToNew(),elbow.normalizeToNew(),new Quaternion());u.rotationQuaternion=q1;const fore=target.subtract(elbow);const localFore=Vector3.TransformNormal(fore,Matrix.FromQuaternionToRef(q1.conjugate(),Matrix.Identity())).normalize();l.rotationQuaternion=Quaternion.FromUnitVectorsToRef(h.position.normalizeToNew(),localFore,new Quaternion());u.computeWorldMatrix(true);l.computeWorldMatrix(true);h.computeWorldMatrix(true);p.hands[side]=h.getAbsolutePosition().clone();contactError=Math.max(contactError,Vector3.Distance(p.hands[side],world)*1000);
  }
  const identity=Vector3.One();
  function draw(){if(disposed||!current)return;const view=current,alpha=paused?1:Math.min(1,(performance.now()-received)/50),active=view.active?.worker;contactError=0;
   const retained=new Set<string>(),crowd=new Map(groups.map(g=>[g,[] as Actor[]]));
   for(const a of view.actors){const old=previous?.actors.find(x=>x.id===a.id),actor={...a,position:old?a.position.map((v,i)=>old.position[i]+(v-old.position[i])*alpha) as unknown as Actor['position']:a.position};const isClose=!a.id.startsWith('worker')||a.id===active;
    if(mode==='hybrid'&&!isClose){crowd.get(a.appearance)!.push(actor);continue;}
    retained.add(a.id);let p=puppets.get(a.id);const kind=isClose?a.appearance:a.appearance+'-low';if(p&&p.appearance!==kind){destroy(p);puppets.delete(a.id);p=undefined;}if(!p){p=make(kind,a.id);puppets.set(a.id,p);}pose(p,actor,a.phase);
   }
   for(const [id,p] of puppets)if(!retained.has(id)){destroy(p);puppets.delete(id);}
   for(const batch of batches){const list=mode==='hybrid'?crowd.get(batch.kind)!:[],changed=batch.count!==list.length;if(changed){batch.count=list.length;batch.matrices=new Float32Array(list.length*16);batch.params=new Float32Array(list.length*4);}const {matrices,params}=batch;list.forEach((a,i)=>{const q=Quaternion.RotationYawPitchRoll(a.yaw/1000,0,0),mat=Matrix.Compose(identity,q,wp(a.position));const base=batch.meshes[0].computeWorldMatrix(true);base.multiply(mat).multiply(Matrix.Invert(base)).copyToArray(matrices,i*16);const first=a.clip==='walk'?60:0;params.set([first,first+59,Math.floor(a.phase*60),0],i*4);});for(const mesh of batch.meshes){mesh.setEnabled(list.length>0);if(list.length){if(changed){mesh.thinInstanceSetBuffer('matrix',matrices,16,false);mesh.thinInstanceSetBuffer('bakedVertexAnimationSettingsInstanced',params,4,false);}else{mesh.thinInstanceBufferUpdated('matrix');mesh.thinInstanceBufferUpdated('bakedVertexAnimationSettingsInstanced');}}}}
   docks.setEnabled(view.active?.kind==='transfer');cradle.setEnabled(view.room==='conveyor'&&view.active?.kind==='transfer');cradle.position.copyFrom(wp(view.propPosition));cradle.computeWorldMatrix(true);credential.setEnabled(view.active?.kind==='gate'&&view.actors.find(x=>x.id===active)?.clip==='present');
   if(active){const worker=puppets.get(active)!;if(view.active?.kind==='transfer'&&view.actors.find(a=>a.id===active)?.clip==='carry'){const elapsed=view.tick-view.active.start,reach=Math.min(1,Math.max(0,(elapsed-40)/15),Math.max(0,(200-elapsed)/20));for(const side of ['L','R'] as const){const hand=worker.nodes.get('hand'+side)!;hand.computeWorldMatrix(true);const target=cradle.position.add(new Vector3(side==='L'?-.32:.32,.075,0));handTo(worker,side,Vector3.Lerp(hand.getAbsolutePosition(),target,reach));}}
    if(credential.isEnabled()){const contact=wp([126000,1300,126650]);handTo(worker,'R',contact);credential.position.copyFrom(contact);const supervisor=puppets.get('limen');if(supervisor)handTo(supervisor,'L',contact.add(new Vector3(-.02,-.07,0)));}
   }
   stage.gate(view.gateOpen);
  }
  const observer=scene.onBeforeRenderObservable.add(draw),loadMs=performance.now()-started;
  return {update(view:TestView,freeze:boolean){previous=current;current=view;received=performance.now();paused=freeze;},mode(value:'skeletal'|'hybrid'){mode=value;frameMode=value;},report():CastReport{return {mode,actors:current?.actors.length??0,loadedBytes:bytes,bakedBytes:floats.byteLength,loadMs,puppets:puppets.size,crowdGroups:mode==='hybrid'?3:0,contactErrorMm:Math.round(contactError)};},dispose(){if(disposed)return;disposed=true;scene.onBeforeRenderObservable.remove(observer);for(const p of puppets.values())destroy(p);puppets.clear();for(const b of batches){b.entry.dispose();b.root.dispose();}docks.dispose();cradle.dispose(false,true);credential.dispose();metal.dispose();flesh.dispose();dockPaint.dispose();manager.dispose(false);texture.dispose();resources.forEach(c=>c.dispose());frameMode='';},get modeName(){return frameMode||mode;}};
 }catch(error){resources.forEach(c=>c.dispose());throw error;}
}
