import {BoundingInfo} from '@babylonjs/core/Culling/boundingInfo';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {VertexData} from '@babylonjs/core/Meshes/mesh.vertexData';
import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial';
import type {Scene} from '@babylonjs/core/scene';
import calibration from './limen-blade-calibration.json';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';

// One opaque draw, 672 triangles. No particle allocation, light or extra postprocess.
// Local metres: +Y follows the emitter, which starts at 0.27 from the arm mount.
const vertexSource=`precision highp float;
attribute vec3 position; attribute vec2 uv;
uniform mat4 worldViewProjection; uniform float clock; uniform float surge;
varying float vCore; varying float vT;
void main(){
 float t=uv.x; float strand=uv.y; vec3 p=position;
 vCore=step(strand,0.5); vT=t;
 if(strand>0.5){
  float phase=strand*2.094;
  float spread=sin(t*3.14159)*(0.016+0.019*surge);
  float k=t*11.0-clock*3.1+phase;
  p.x+=spread*(sin(k)+0.23*sin(k*2.37+clock));
  p.z+=spread*(cos(k*0.83)+0.19*sin(k*3.13-clock));
 }else{
  p.x+=sin(t*3.14159)*0.003*sin(t*18.0-clock*1.7);
 }
 gl_Position=worldViewProjection*vec4(p,1.0);
}`;
const fragmentSource=`precision highp float;
uniform float clock; uniform float surge;
varying float vCore; varying float vT;
void main(){
 float current=0.88+0.12*sin(vT*38.0-clock*4.0);
 vec3 cyan=mix(vec3(0.04,0.8,0.95),vec3(0.45,1.6,1.7),vCore);
 gl_FragColor=vec4(cyan*current*(1.0+surge*0.65),1.0);
}`;
export function createLimenBlade(scene:Scene,parent:TransformNode){
 const mesh=new Mesh('LIMEN energy core and braids',scene),data=new VertexData();
 const positions:number[]=[],uvs:number[]=[],indices:number[]=[];
 for(let strand=0;strand<4;strand++){
  const first=positions.length/3,segments=21,sides=4;
  for(let ring=0;ring<=segments;ring++){
   const t=ring/segments,profile=Math.sin(Math.PI*Math.min(.99,t*.92+.06)),radius=(strand===0?.038:.003)*profile*(1-t*.92);
   for(let side=0;side<sides;side++){
    const angle=side*Math.PI/2;
    positions.push(Math.cos(angle)*radius,calibration.emitterStartMetres+t*(calibration.tipMetres-calibration.emitterStartMetres),Math.sin(angle)*radius*(strand===0?.46:1));uvs.push(t,strand);
   }
  }
  for(let ring=0;ring<segments;ring++)for(let side=0;side<sides;side++){
   const a=first+ring*sides+side,b=first+ring*sides+(side+1)%sides,c=a+sides,d=b+sides;
   indices.push(a,b,c,b,d,c);
  }
 }
 data.positions=positions;data.indices=indices;data.uvs=uvs;data.applyToMesh(mesh);
 mesh.parent=parent;mesh.isPickable=false;mesh.receiveShadows=false;
 // Conservative shader-displacement bounds; no CPU mesh updates per frame.
 mesh.setBoundingInfo(new BoundingInfo(new Vector3(-.07,.26,-.07),new Vector3(.07,.78,.07)));
 const material=new ShaderMaterial('LIMEN cyan current',scene,{vertexSource,fragmentSource},{attributes:['position','uv'],uniforms:['worldViewProjection','clock','surge']});
 material.backFaceCulling=false;mesh.material=material;
 return {sample(time:number,surge=0){material.setFloat('clock',time);material.setFloat('surge',surge);},enabled(value:boolean){mesh.setEnabled(value);},dispose(){mesh.dispose();material.dispose();}};
}
