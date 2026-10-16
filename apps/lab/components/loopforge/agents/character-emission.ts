import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {VertexData} from '@babylonjs/core/Meshes/mesh.vertexData';
import {VertexBuffer} from '@babylonjs/core/Buffers/buffer';
import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial';
import {Constants} from '@babylonjs/core/Engines/constants';
import {Matrix,Vector3} from '@babylonjs/core/Maths/math.vector';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
export type EyePatch={x:number;y:number;rx:number;ry:number;zMin:number;slope?:number};
/** Paint emission onto the existing facial surface. One small overlay, depth tested,
 * no full-screen bloom or texture download. Optional rigid parent follows a head bone. */
export function createFaceEmission(source:AbstractMesh,patch:EyePatch,color:Color3,parent:TransformNode=source,offset=.002,bindToParent?:Matrix,centreLine?:{bottom:number;top:number;halfWidth:number}){
 const scene=source.getScene(),positions=source.getVerticesData(VertexBuffer.PositionKind)!,normals=source.getVerticesData(VertexBuffer.NormalKind)!,indices=source.getIndices()!;
 const out:number[]=[],uv:number[]=[],seamUv:number[]=[],tri:number[]=[];
 source.computeWorldMatrix(true);parent.computeWorldMatrix(true);
 const transform=bindToParent??source.getWorldMatrix().multiply(Matrix.Invert(parent.getWorldMatrix()));
 const point=new Vector3();
 for(let t=0;t<indices.length;t+=3){
  const face=[0,1,2].map(k=>indices[t+k]*3);
  const inVisor=face.some(i=>{const x=Math.abs(positions[i]),y=positions[i+1];return positions[i+2]>patch.zMin&&Math.abs(x-patch.x)<patch.rx*1.8&&Math.abs(y-patch.y-(x-patch.x)*(patch.slope??0))<patch.ry*2.5;});
  // A thin centre seam can cross a triangle without containing any of its vertices.
  const inSeam=centreLine&&face.some(i=>positions[i+2]>patch.zMin)
   &&Math.min(...face.map(i=>positions[i]))<centreLine.halfWidth*1.8
   &&Math.max(...face.map(i=>positions[i]))>-centreLine.halfWidth*1.8
   &&Math.min(...face.map(i=>positions[i+1]))<centreLine.top+.6
   &&Math.max(...face.map(i=>positions[i+1]))>centreLine.bottom;
  if(!inVisor&&!inSeam)continue;
  for(let k=0;k<3;k++){
   const i=indices[t+k]*3,x=positions[i],y=positions[i+1],z=positions[i+2];
   Vector3.TransformCoordinatesFromFloatsToRef(x+normals[i]*offset,y+normals[i+1]*offset,z+normals[i+2]*offset,transform,point);
   tri.push(out.length/3);out.push(point.x,point.y,point.z);uv.push((Math.abs(x)-patch.x)/patch.rx,(y-patch.y-(Math.abs(x)-patch.x)*(patch.slope??0))/patch.ry);
   seamUv.push(centreLine?x/centreLine.halfWidth:10,centreLine?(y-centreLine.bottom)/(centreLine.top-centreLine.bottom):-10);
  }
 }
 const mesh=new Mesh('Fitted facial emission',scene),data=new VertexData();data.positions=out;data.uvs=uv;data.uvs2=seamUv;data.indices=tri;data.applyToMesh(mesh);mesh.parent=parent;mesh.isPickable=false;
 const material=new ShaderMaterial('Facial lens glow',scene,{
  vertexSource:`precision highp float;attribute vec3 position;attribute vec2 uv;attribute vec2 uv2;uniform mat4 worldViewProjection;varying vec2 vUv;varying vec2 vSeam;void main(){vUv=uv;vSeam=uv2;gl_Position=worldViewProjection*vec4(position,1.0);}`,
  fragmentSource:`precision highp float;varying vec2 vUv;varying vec2 vSeam;uniform vec3 tint;
   void main(){
    float d=length(vUv);
    float seam=abs(vSeam.x)/mix(0.18,1.0,clamp(vSeam.y,0.0,1.0));
    float ends=smoothstep(0.0,0.12,vSeam.y)*(1.0-smoothstep(1.0,1.1,vSeam.y));
    float core=max(1.0-smoothstep(0.35,1.0,d),(1.0-smoothstep(0.35,1.0,seam))*ends);
    float halo=max(1.0-smoothstep(0.7,1.75,d),(1.0-smoothstep(0.7,1.75,seam))*ends)*0.15;
    if(core+halo<0.001)discard;
    gl_FragColor=vec4(mix(tint,vec3(1.0),core*0.55),core*0.94+halo);
   }`
 },{attributes:['position','uv','uv2'],uniforms:['worldViewProjection','tint'],needAlphaBlending:true});
 material.setColor3('tint',color);material.alphaMode=Constants.ALPHA_ADD;material.disableDepthWrite=true;material.backFaceCulling=false;mesh.material=material;
 return {enabled(value:boolean){mesh.setEnabled(value);},dispose(){mesh.dispose();material.dispose();}};
}

/** Small convex lenses fill actual eye apertures; the surrounding mask depth-tests them. */
export function createEyeLenses(parent:TransformNode,patch:EyePatch,depth:number,sides:number[]=[-1,1],bulge=1){
 const scene=parent.getScene(),mesh=new Mesh('CATHEXIS warm eye lenses',scene),data=new VertexData(),positions:number[]=[],uvs:number[]=[],indices:number[]=[];
 for(const side of sides){
  const base=positions.length/3;
  for(let ring=0;ring<=4;ring++)for(let i=0;i<12;i++){
   const r=ring/4,a=i/12*Math.PI*2,x=Math.cos(a)*r,y=Math.sin(a)*r;
   positions.push(side*patch.x+x*patch.rx,patch.y+y*patch.ry+side*x*patch.rx*(patch.slope??0),depth+Math.sqrt(1-r*r)*patch.ry*bulge);uvs.push(x,y);
  }
  for(let r=0;r<4;r++)for(let i=0;i<12;i++){const a=base+r*12+i,b=base+r*12+(i+1)%12;indices.push(a,b,a+12,b,b+12,a+12);}
 }
 data.positions=positions;data.uvs=uvs;data.indices=indices;data.applyToMesh(mesh);mesh.parent=parent;mesh.isPickable=false;
 const material=new ShaderMaterial('CATHEXIS amber lenses',scene,{vertexSource:`precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec2 vUv;void main(){vUv=uv;gl_Position=worldViewProjection*vec4(position,1.0);}`,fragmentSource:`precision highp float;varying vec2 vUv;void main(){float core=1.0-smoothstep(0.15,1.0,length(vUv));gl_FragColor=vec4(mix(vec3(1.0,0.28,0.015),vec3(1.0,0.9,0.5),core),1.0);}`},{attributes:['position','uv'],uniforms:['worldViewProjection']});material.backFaceCulling=false;mesh.material=material;
 return {enabled(value:boolean){mesh.setEnabled(value);},dispose(){mesh.dispose();material.dispose();}};
}
