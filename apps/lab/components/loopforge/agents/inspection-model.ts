import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import '@babylonjs/loaders/glTF/glTFFileLoader';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {createEyeLenses,type EyePatch} from './character-emission';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {CharacterStage} from '../factory-study/scene';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {VertexBuffer} from '@babylonjs/core/Buffers/buffer';
import {cathexisSeatIndices,type FaceFit} from '@/lib/loopforge/agents/cathexis-fit';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
export type InspectionFile={src:string;sha256:string;bytes:number};
export type InspectionSurface='textured'|'clay'|'wireframe';
/** Shared static-asset adapter. No rig, animation or physical fit is inferred. */
export async function loadInspectionModel(stage:CharacterStage,file:InspectionFile,signal:AbortSignal,prepareFaceSeat=false,eyePatch?:EyePatch){
 const integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
 const response=await fetch(file.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)]),integrity,credentials:'same-origin'});
 if(!response.ok)throw Error('The selected asset could not be downloaded.');
 const bytes=new Uint8Array(await response.arrayBuffer());signal.throwIfAborted();
 const container=await LoadAssetContainerAsync(bytes,stage.scene,{pluginExtension:'.glb',name:'static-asset-review.glb'});
 if(signal.aborted){container.dispose();signal.throwIfAborted();}
 const root=new TransformNode('Inspection subject',stage.scene);let fill:DirectionalLight|null=null;
 try{
  if(container.skeletons.length||container.animationGroups.length)throw Error('Expected an unrigged static inspection asset.');
  container.addAllToScene();container.rootNodes.forEach(n=>{n.parent=root;});
  const meshes=container.meshes.filter(m=>m.getTotalVertices()>0);if(!meshes.length)throw Error('The asset contains no visible mesh.');
  meshes.forEach(m=>{m.isPickable=false;m.receiveShadows=true;stage.shadow.addShadowCaster(m);});
  fill=new DirectionalLight('Asset inspection lamp',new Vector3(.25,-.5,1),stage.scene);fill.diffuse=new Color3(.94,.92,.87);fill.intensity=2.5;fill.includedOnlyMeshes=meshes;fill.renderPriority=5;
  const materials=container.materials.filter((m):m is PBRMaterial=>m instanceof PBRMaterial).map(m=>{m.maxSimultaneousLights=6;return {m,base:m.albedoTexture,mr:m.metallicTexture,normal:m.bumpTexture,color:m.albedoColor.clone(),metal:m.metallic,rough:m.roughness};});
  function room(value:'security'|'conveyor'){const p=value==='security'?[131,122]:[120.8,149.6];root.position.set(...worldPoint(p[0],p[1]));root.position.y=.015;stage.gate(true);stage.refresh();}
  root.rotation.y=Math.PI;room('security');let disposed=false;
  let attachment:Awaited<ReturnType<typeof LoadAssetContainerAsync>>|null=null,seat:TransformNode|null=null,faceAbort:AbortController|null=null;
  let currentSurface:InspectionSurface='textured';
  const original=meshes.filter((m):m is Mesh=>m instanceof Mesh).map(m=>({m,indices:Array.from(m.getIndices()??[])}));
  const trimmed=prepareFaceSeat?original.map(({m,indices})=>({m,indices:cathexisSeatIndices(m.getVerticesData(VertexBuffer.PositionKind)!,indices)})):[];
  const baseMaterials=[...materials];
  let eyesOn=true,faceEyes:ReturnType<typeof createEyeLenses>|null=null;
  const bodyEyes=eyePatch?createEyeLenses(meshes[0],eyePatch,prepareFaceSeat?.174:eyePatch.zMin):null;
  function eyes(value:boolean){eyesOn=value;bodyEyes?.enabled(value&&!attachment);faceEyes?.enabled(value);stage.refresh();}
  function surface(value:InspectionSurface){currentSurface=value;for(const {m,base,mr,normal,color,metal,rough} of materials){m.albedoTexture=value==='clay'?null:base;m.metallicTexture=value==='clay'?null:mr;m.bumpTexture=value==='clay'?null:normal;m.albedoColor=value==='clay'?new Color3(.46,.48,.44):color;m.metallic=value==='clay'?0:metal;m.roughness=value==='clay'?.85:rough;m.wireframe=value==='wireframe';}stage.refresh(true);}
  function clearFace(){
   faceEyes?.dispose();faceEyes=null;bodyEyes?.enabled(eyesOn);
   if(attachment){attachment.meshes.forEach(m=>stage.shadow.removeShadowCaster(m));attachment.dispose();attachment=null;}
   seat?.dispose();seat=null;materials.splice(0,materials.length,...baseMaterials);if(fill)fill.includedOnlyMeshes=meshes;
   for(const {m,indices} of original)m.setIndices(indices);stage.refresh(true);
  }
  async function face(file:InspectionFile|null,fit?:FaceFit){
   faceAbort?.abort();faceAbort=new AbortController();const abort=faceAbort;
   clearFace();if(!file||!fit)return;
   const integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
   const response=await fetch(file.src,{signal:AbortSignal.any([abort.signal,signal,AbortSignal.timeout(60000)]),integrity,credentials:'same-origin'});
   if(!response.ok)throw Error('Face could not be downloaded.');
   const bytes=new Uint8Array(await response.arrayBuffer());abort.signal.throwIfAborted();signal.throwIfAborted();
   const loaded=await LoadAssetContainerAsync(bytes,stage.scene,{pluginExtension:'.glb',name:'fitted-face.glb'});
   if(disposed||abort.signal.aborted||signal.aborted){loaded.dispose();throw new DOMException('Face loading cancelled','AbortError');}
   clearFace();attachment=loaded;loaded.addAllToScene();
   seat=new TransformNode('CATHEXIS replaceable face seat',stage.scene);seat.parent=root;seat.position.set(...fit.position);seat.scaling.set(...fit.scale);seat.rotation.set(...(fit.rotation??[0,0,0]));
   loaded.rootNodes.forEach(n=>n.parent=seat);
   const faceMeshes=loaded.meshes.filter(m=>m.getTotalVertices()>0);faceMeshes.forEach(m=>{m.isPickable=false;m.receiveShadows=true;stage.shadow.addShadowCaster(m);});
   if(fill)fill.includedOnlyMeshes=[...meshes,...faceMeshes];
   for(const {m,indices} of trimmed)m.setIndices(indices);
   for(const m of loaded.materials)if(m instanceof PBRMaterial){m.maxSimultaneousLights=6;materials.push({m,base:m.albedoTexture,mr:m.metallicTexture,normal:m.bumpTexture,color:m.albedoColor.clone(),metal:m.metallic,rough:m.roughness});}
   faceEyes=createEyeLenses(faceMeshes[0],fit.eyes,fit.eyes.zMin);eyes(eyesOn);
   surface(currentSurface);stage.refresh(true);
  }

  return {room,turn(deg:number){root.rotation.y=Math.PI+deg*Math.PI/180;stage.refresh();},light(value:boolean){fill?.setEnabled(value);stage.refresh(true);},
   surface,face,eyes,

   dispose(){if(disposed)return;disposed=true;faceAbort?.abort();clearFace();bodyEyes?.dispose();meshes.forEach(m=>stage.shadow.removeShadowCaster(m));fill?.dispose();container.dispose();root.dispose();}
  };
 }catch(error){fill?.dispose();container.dispose();root.dispose();throw error;}
}
