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
uniform mat4 worldViewProjection; uniform float clock; uniform float surge; uniform float power; uniform float adjust; uniform float approvedPalette;
varying float vCore; varying float vT; varying float vStrand; varying vec3 vEnergyColor;
// Cosmetic, seekable per-strand noise; never consumes simulation RNG.
float toneHash(float slot,float strand){return fract(sin(slot*127.1+strand*311.7)*43758.5453);}
vec3 energyTone(float tone){
 vec3 jade=vec3(0.025,1.16,0.51),cyan=vec3(0.015,1.02,1.38);
 vec3 blue=vec3(0.13,0.52,1.65),violet=vec3(0.68,0.34,1.52);
 jade=mix(jade,vec3(0.01,0.66,0.32),approvedPalette);
 cyan=mix(cyan,vec3(0.005,0.57,0.78),approvedPalette);
 blue=mix(blue,vec3(0.07,0.32,1.05),approvedPalette);
 violet=mix(violet,vec3(0.42,0.20,0.95),approvedPalette);
 vec3 colour=mix(jade,cyan,smoothstep(0.0,0.38,tone));
 colour=mix(colour,blue,smoothstep(0.38,0.78,tone));
 return mix(colour,violet,smoothstep(0.78,1.0,tone));
}
void main(){
 float t=uv.x; float strand=uv.y; vec3 p=position;
 vCore=step(strand,0.5); vT=t; vStrand=strand;
 // Independent staggered tonal changes, with brief holds and smooth transitions.
 // Evaluate once per vertex, not a random palette lookup for every fragment.
 float epoch=clock*(1.25+strand*0.19)+strand*0.73;
 float slot=floor(epoch),blend=smoothstep(0.18,0.86,fract(epoch));
 float tone=mix(toneHash(slot,strand),toneHash(slot+1.0,strand),blend);
 tone=clamp(tone+0.075*sin(t*15.0-clock*9.0+strand*2.1),0.0,1.0);
 vEnergyColor=mix(energyTone(tone),mix(vec3(0.32,1.12,1.3),vec3(0.008,0.56,0.70),approvedPalette),vCore);
 float flow=clock*4.0;
 if(strand>0.5){
  float phase=strand*2.094;
  float packet=pow(0.5+0.5*sin(t*10.0-flow*5.0+phase),3.0);
  float spread=sin(t*3.14159)*(0.027+0.016*packet+0.009*surge);
  float k=t*12.0-flow*6.1+phase;
  p.x+=spread*(sin(k)+0.23*sin(k*2.37+flow));
  p.z+=spread*(cos(k*0.83)+0.19*sin(k*3.13-flow));
 }else{
  p.x+=sin(t*3.14159)*0.008*sin(t*14.0-flow*3.7);
  p.z+=sin(t*3.14159)*0.005*cos(t*11.0-flow*4.1);
 }
 p.y=0.27+(p.y-0.27)*power; p.xz*=power;
 gl_Position=worldViewProjection*vec4(p,1.0);
}`;
const fragmentSource=`precision highp float;
uniform float clock; uniform float surge; uniform float power; uniform float adjust; uniform float approvedPalette;
varying float vCore; varying float vT; varying float vStrand; varying vec3 vEnergyColor;
void main(){
 // Fast outward current travels along the blade; its core never strobes off.
 float phase=vT*32.0-clock*34.0+vStrand*2.1;
 float crest=pow(0.5+0.5*sin(phase),4.0);
 float current=mix(0.86+0.14*sin(phase)+0.22*crest,0.95+0.05*sin(phase),vCore);
 gl_FragColor=vec4(vEnergyColor*current*(1.0+surge*0.45)*power,1.0);
}`;
export function createLimenBlade(scene:Scene,parent:TransformNode){
 const mesh=new Mesh('LIMEN energy core and braids',scene),data=new VertexData();
 const positions:number[]=[],uvs:number[]=[],indices:number[]=[];
 for(let strand=0;strand<4;strand++){
  const first=positions.length/3,segments=21,sides=4;
  for(let ring=0;ring<=segments;ring++){
   const t=ring/segments,profile=Math.sin(Math.PI*Math.min(.99,t*.92+.06)),radius=(strand===0?.019:.007)*profile*(1-t*.92);
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
 mesh.setBoundingInfo(new BoundingInfo(new Vector3(-.08,.26,-.08),new Vector3(.08,.78,.08)));
 const material=new ShaderMaterial('LIMEN cyan current',scene,{vertexSource,fragmentSource},{attributes:['position','uv'],uniforms:['worldViewProjection','clock','surge','power','adjust','approvedPalette']});
 material.backFaceCulling=false;mesh.material=material;material.setFloat('approvedPalette',1);
 return {palette(approved:boolean){material.setFloat('approvedPalette',approved?1:0);},sample(time:number,surge=0,power=1,adjust=0){mesh.setEnabled(power>.005);material.setFloat('clock',time);material.setFloat('surge',surge);material.setFloat('power',power);material.setFloat('adjust',adjust);},dispose(){mesh.dispose();material.dispose();}};
}
