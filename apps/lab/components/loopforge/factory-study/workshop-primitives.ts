import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {Vector3,Quaternion} from '@babylonjs/core/Maths/math.vector';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import type {Scene} from '@babylonjs/core/scene';
import type {WorkshopTools,Mat,V} from './floor-scene';
type Palette=Pick<WorkshopTools,'iron'|'dark'|'brass'|'copper'|'green'|'floorMat'|'amber'|'quiet'|'cyan'|'ridge'>;
/** Small batched-room adapter for the same equipment archetypes used by the full floor. */
export function workshopPrimitives(scene:Scene,palette:Palette):WorkshopTools{
 const v=(p:V)=>new Vector3(...p);
 function finish(mesh:Mesh,material:Mat,position:V,parent?:TransformNode){mesh.material=material;mesh.position.set(...position);mesh.parent=parent??null;mesh.receiveShadows=true;mesh.isPickable=false;return mesh;}
 const box=(name:string,size:V,pos:V,mat:Mat,parent?:TransformNode)=>finish(MeshBuilder.CreateBox(name,{width:size[0],height:size[1],depth:size[2]},scene),mat,pos,parent);
 const cylinder=(name:string,r:number,h:number,pos:V,mat:Mat,parent?:TransformNode,tessellation=12)=>finish(MeshBuilder.CreateCylinder(name,{diameter:r*2,height:h,tessellation},scene),mat,pos,parent);
 const pipe=(name:string,points:V[],radius:number,mat:Mat,parent?:TransformNode)=>finish(MeshBuilder.CreateTube(name,{path:points.map(v),radius,tessellation:8,cap:Mesh.CAP_ALL},scene),mat,[0,0,0],parent);
 return {...palette,box,cylinder,pipe,
  sphere(name,diameter,pos,mat,parent,scale=[1,1,1],segments=12){const m=finish(MeshBuilder.CreateSphere(name,{diameter,segments},scene),mat,pos,parent);m.scaling.set(...scale);return m;},
  ring:(name,radius,thickness,pos,mat,parent)=>finish(MeshBuilder.CreateTorus(name,{diameter:radius*2,thickness,tessellation:16},scene),mat,pos,parent),
  bar(name,a,b,radius,mat,parent){const pa=v(a),pb=v(b),delta=pb.subtract(pa),m=cylinder(name,radius,delta.length(),[0,0,0],mat,parent,8);m.position.copyFrom(pa.add(pb).scale(.5));m.rotationQuaternion=Quaternion.FromUnitVectorsToRef(Vector3.Up(),delta.normalize(),new Quaternion());return m;},
  sign(text,sub,width,pos,parent){
   box('cast sign backing',[width+.12,.7,.08],pos,palette.brass,parent);
   const tex=new DynamicTexture(text,{width:1024,height:256},scene,true),ctx=tex.getContext()as CanvasRenderingContext2D;ctx.fillStyle='#13201c';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#99834d';ctx.lineWidth=5;ctx.strokeRect(12,12,1000,232);ctx.textAlign='center';ctx.fillStyle='#cebd86';ctx.font='bold 86px Georgia';ctx.fillText(text,512,120,970);ctx.font='26px monospace';ctx.fillStyle='#91a49a';ctx.fillText(sub,512,195,970);tex.update();
   const m=new StandardMaterial(text+' plate',scene);m.diffuseTexture=tex;m.emissiveColor=new Color3(.18,.18,.14);m.specularColor=Color3.Black();finish(MeshBuilder.CreatePlane(text,{width,height:.64,sideOrientation:Mesh.DOUBLESIDE},scene),m,[pos[0],pos[1],pos[2]-.05],parent);
  }
 };
}
