import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {Quaternion} from '@babylonjs/core/Maths/math.vector';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {VertexBuffer} from '@babylonjs/core/Buffers/buffer';
import {VertexData} from '@babylonjs/core/Meshes/mesh.vertexData';
import type {BaseTexture} from '@babylonjs/core/Materials/Textures/baseTexture';
import {createEyeLenses} from './character-emission';
import {halfMaskGeometry,type FaceFit,type MaskCoverage} from '@/lib/loopforge/agents/cathexis-fit';
import type {CharacterStage} from '../factory-study/scene';
import type {InspectionFile,InspectionSurface} from './inspection-model';
type MaterialSnapshot={m:PBRMaterial;base:BaseTexture|null;mr:BaseTexture|null;normal:BaseTexture|null;color:Color3;metal:number|null;rough:number|null};
/** One rigid mask, shared by static and moving review. The original body stays intact. */
export function createFittedFace(stage:CharacterStage,parent:TransformNode,signal:AbortSignal,onMeshes:(meshes:AbstractMesh[])=>void,sourceCoordinates=false){
  let attachment:Awaited<ReturnType<typeof LoadAssetContainerAsync>>|null=null,seat:TransformNode|null=null,faceAbort:AbortController|null=null;
  let disposed=false,eyesOn=true;
  let currentSurface:InspectionSurface='textured';
  let edge:Mesh|null=null,edgeMaterial:PBRMaterial|null=null;
  const materials:MaterialSnapshot[]=[];
  let faceEyes:ReturnType<typeof createEyeLenses>|null=null;
  function eyes(value:boolean){eyesOn=value;faceEyes?.enabled(value);stage.refresh();}
  function surface(value:InspectionSurface){currentSurface=value;for(const {m,base,mr,normal,color,metal,rough} of materials){m.albedoTexture=value==='clay'?null:base;m.metallicTexture=value==='clay'?null:mr;m.bumpTexture=value==='clay'?null:normal;m.albedoColor=value==='clay'?new Color3(.46,.48,.44):color;m.metallic=value==='clay'?0:metal;m.roughness=value==='clay'?.85:rough;m.wireframe=value==='wireframe';}stage.refresh(true);}
  function clearFace(){
   faceEyes?.dispose();faceEyes=null;edge?.dispose();edge=null;edgeMaterial?.dispose();edgeMaterial=null;
   if(attachment){attachment.meshes.forEach(m=>stage.shadow.removeShadowCaster(m));attachment.dispose();attachment=null;}
   seat?.dispose();seat=null;materials.length=0;onMeshes([]);
   stage.refresh(true);
  }
  async function face(file:InspectionFile|null,fit?:FaceFit,coverage:MaskCoverage='full'){
   faceAbort?.abort();faceAbort=new AbortController();const abort=faceAbort;
   clearFace();if(!file||!fit)return;
   const integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
   const response=await fetch(file.src,{signal:AbortSignal.any([abort.signal,signal,AbortSignal.timeout(60000)]),integrity,credentials:'same-origin'});
   if(!response.ok)throw Error('Face could not be downloaded.');
   const bytes=new Uint8Array(await response.arrayBuffer());abort.signal.throwIfAborted();signal.throwIfAborted();
   const loaded=await LoadAssetContainerAsync(bytes,stage.scene,{pluginExtension:'.glb',name:'fitted-face.glb'});
   if(disposed||abort.signal.aborted||signal.aborted){loaded.dispose();throw new DOMException('Face loading cancelled','AbortError');}
   clearFace();attachment=loaded;loaded.addAllToScene();
   seat=new TransformNode('CATHEXIS replaceable face seat',stage.scene);seat.parent=parent;seat.position.set(...fit.position);seat.scaling.set(...fit.scale);seat.rotation.set(...(fit.rotation??[0,0,0]));
   // A moving head already inherits the body's glTF handedness conversion.
   // Do not apply the mask loader's conversion a second time beneath that head.
   loaded.rootNodes.forEach(n=>{if(sourceCoordinates&&n instanceof TransformNode&&n.name==='__root__'){n.scaling.setAll(1);n.rotationQuaternion=Quaternion.Identity();}n.parent=seat;});
   const faceMeshes=loaded.meshes.filter(m=>m.getTotalVertices()>0);faceMeshes.forEach(m=>{m.isPickable=false;m.receiveShadows=true;stage.shadow.addShadowCaster(m);});
   onMeshes(faceMeshes);
   if(coverage!=='full')for(const mesh of faceMeshes){
    if(!(mesh instanceof Mesh))continue;
    const {geometry,rim}=halfMaskGeometry({positions:Array.from(mesh.getVerticesData(VertexBuffer.PositionKind)!),normals:Array.from(mesh.getVerticesData(VertexBuffer.NormalKind)!),uvs:Array.from(mesh.getVerticesData(VertexBuffer.UVKind)!),indices:Array.from(mesh.getIndices()!)},coverage==='half-left'?1:-1);
    const data=new VertexData();Object.assign(data,geometry);data.applyToMesh(mesh);
    edge=new Mesh('Grace cut porcelain return',stage.scene);edge.parent=mesh;const wall=new VertexData();wall.positions=rim;wall.indices=Array.from({length:rim.length/3},(_,i)=>i);wall.normals=[];VertexData.ComputeNormals(wall.positions,wall.indices,wall.normals);wall.applyToMesh(edge);
    edgeMaterial=new PBRMaterial('Porcelain cut edge',stage.scene);edgeMaterial.albedoColor=new Color3(.38,.31,.21);edgeMaterial.metallic=.35;edgeMaterial.roughness=.72;edgeMaterial.backFaceCulling=false;edge.material=edgeMaterial;edge.isPickable=false;
   }
   for(const m of loaded.materials)if(m instanceof PBRMaterial){m.maxSimultaneousLights=6;materials.push({m,base:m.albedoTexture,mr:m.metallicTexture,normal:m.bumpTexture,color:m.albedoColor.clone(),metal:m.metallic,rough:m.roughness});}
   // Recess lenses behind the porcelain lip, with only the covered half lit here.
   // The body's own eyes remain in place on the exposed half.
   faceEyes=createEyeLenses(faceMeshes[0],fit.eyes,-.04,coverage==='full'?[1,-1]:coverage==='half-left'?[1]:[-1],.12);eyes(eyesOn);
   surface(currentSurface);stage.refresh(true);
  }

 return {face,eyes,surface,dispose(){if(disposed)return;disposed=true;faceAbort?.abort();clearFace();}};
}
