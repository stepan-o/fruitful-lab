import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {VertexData} from '@babylonjs/core/Meshes/mesh.vertexData';
import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial';
import {Constants} from '@babylonjs/core/Engines/constants';
import {PointLight} from '@babylonjs/core/Lights/pointLight';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
/** Two 8-sided flame envelopes in one draw. No particles or shadow pass. */
export function createWelderFlame(parent:AbstractMesh,litMeshes:AbstractMesh[]){
 const scene=parent.getScene(),mesh=new Mesh('Welder pilot / active flame',scene),data=new VertexData(),positions:number[]=[],uvs:number[]=[],indices:number[]=[];
 for(let shell=0;shell<2;shell++){
  const base=positions.length/3;
  for(let ring=0;ring<=8;ring++)for(let side=0;side<8;side++){
   const t=ring/8,a=side/8*Math.PI*2,r=(shell?.019:.009)*(1-t)*(.8+Math.sin(t*Math.PI)*.35);
   positions.push(Math.cos(a)*r,.355+t*(shell?.22:.11),Math.sin(a)*r);uvs.push(t,shell);
  }
  for(let r=0;r<8;r++)for(let s=0;s<8;s++){const a=base+r*8+s,b=base+r*8+(s+1)%8;indices.push(a,b,a+8,b,b+8,a+8);}
 }
 data.positions=positions;data.uvs=uvs;data.indices=indices;data.applyToMesh(mesh);mesh.parent=parent;mesh.isPickable=false;
 const material=new ShaderMaterial('Welder blue-white flow',scene,{vertexSource:`precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 worldViewProjection;uniform float clock;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.x+=sin(clock*24.0+uv.x*18.0)*0.003*uv.x;p.z+=cos(clock*29.0+uv.x*15.0)*0.002*uv.x;p.y=0.355+(p.y-0.355)*(0.94+0.06*sin(clock*21.0));gl_Position=worldViewProjection*vec4(p,1.0);}`,fragmentSource:`precision highp float;varying vec2 vUv;uniform float clock;void main(){float core=1.0-vUv.y;float flow=0.8+0.2*sin(vUv.x*40.0-clock*42.0);vec3 tint=mix(vec3(0.07,0.36,1.0),vec3(0.7,0.96,1.0),core);gl_FragColor=vec4(tint, mix(0.45,0.95,core)*(1.0-smoothstep(0.55,1.0,vUv.x))*flow);}`},{attributes:['position','uv'],uniforms:['worldViewProjection','clock'],needAlphaBlending:true});
 material.alphaMode=Constants.ALPHA_ADD;material.disableDepthWrite=true;material.backFaceCulling=false;mesh.material=material;material.setFloat('clock',0);
 const light=new PointLight('Welder local bounce',new Vector3(0,.39,0),scene);light.parent=parent;light.diffuse=new Color3(.25,.65,1);light.range=.65;light.intensity=.3;light.renderPriority=9;light.includedOnlyMeshes=litMeshes;
 return {enabled(value:boolean){mesh.setEnabled(value);light.setEnabled(value);},sample(time:number){material.setFloat('clock',time);light.intensity=.3+.025*Math.sin(time*21);},dispose(){light.dispose();mesh.dispose();material.dispose();}};
}
