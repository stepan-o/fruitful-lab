/** Sampled skin/axis regression. This is not swept-volume or paired-contact certification. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {NodeIO} from '@gltf-transform/core';
import {Quaternion} from '@babylonjs/core/Maths/math.vector.js';
const pack=JSON.parse(await readFile(new URL('../../lib/assets/generated/loopforge-limen.json',import.meta.url),'utf8'));
const calibration=JSON.parse(await readFile(new URL('../../components/loopforge/agents/limen-blade-calibration.json',import.meta.url),'utf8'));
const doc=await new NodeIO().read(new URL('../../public'+pack.assets.limen.variants[0].src,import.meta.url).pathname),root=doc.getRoot(),skin=root.listSkins()[0],joints=skin.listJoints(),inv=skin.getInverseBindMatrices(),primitive=root.listMeshes()[0].listPrimitives()[0],pos=primitive.getAttribute('POSITION'),ids=primitive.getAttribute('JOINTS_0'),weights=primitive.getAttribute('WEIGHTS_0'),indices=primitive.getIndices().getArray(),forearm=joints.find(j=>j.getName()==='mixamorig:RightForeArm');
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,k)=>a.map(v=>v*k),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],tx=(m,p)=>[0,1,2].map(i=>m[i]*p[0]+m[i+4]*p[1]+m[i+8]*p[2]+m[i+12]);
const rest=root.listNodes().map(n=>[n,n.getTranslation(),n.getRotation(),n.getScale()]);
const legIds=joints.map((j,i)=>/UpLeg|Leg|Foot|Toe/.test(j.getName())?i:-1).filter(i=>i>=0),legVertices=[];
for(let i=0;i<pos.getCount();i++){const id=ids.getElement(i,[]),w=weights.getElement(i,[]);if(w.reduce((s,x,k)=>s+(legIds.includes(id[k])?x:0),0)>.5)legVertices.push(i);}
const legs=new Set(legVertices),legTriangles=[];for(let i=0;i<indices.length;i+=3)if([indices[i],indices[i+1],indices[i+2]].some(v=>legs.has(v)))legTriangles.push([indices[i],indices[i+1],indices[i+2]]);
function hit(a,b,v0,v1,v2){const d=sub(b,a),e1=sub(v1,v0),e2=sub(v2,v0),h=cross(d,e2),det=dot(e1,h);if(Math.abs(det)<1e-10)return false;const f=1/det,s=sub(a,v0),u=f*dot(s,h);if(u<0||u>1)return false;const q=cross(s,e1),v=f*dot(d,q);if(v<0||u+v>1)return false;const t=f*dot(e2,q);return t>=0&&t<=1;}
function dist(p,a,b){const d=sub(b,a),t=Math.max(0,Math.min(1,dot(sub(p,a),d)/dot(d,d)));return Math.sqrt(dot(sub(p,add(a,mul(d,t))),sub(p,add(a,mul(d,t)))));}
for(const animation of root.listAnimations().filter(a=>a.getName()!=='Rest')){
 let min=Infinity,worst=0,hits=0;const duration=Math.max(...animation.listSamplers().map(s=>s.getInput().getMax([])[0]));
 for(let frame=0;frame<=72;frame++){
  for(const [n,t,r,s] of rest)n.setTranslation(t).setRotation(r).setScale(s);
  for(const channel of animation.listChannels()){
   const sampler=channel.getSampler(),time=frame/72*duration,times=sampler.getInput().getArray(),values=sampler.getOutput(),node=channel.getTargetNode();let i=0;while(i<times.length-2&&times[i+1]<time)i++;
   const a=values.getElement(i,[]),b=values.getElement(Math.min(i+1,times.length-1),[]),t=Math.max(0,Math.min(1,(time-times[i])/(times[i+1]-times[i]||1)));
   if(channel.getTargetPath()==='rotation')node.setRotation(Quaternion.Slerp(Quaternion.FromArray(a),Quaternion.FromArray(b),t).asArray());else if(channel.getTargetPath()==='translation')node.setTranslation(a.map((v,k)=>v+(b[k]-v)*t));else node.setScale(a.map((v,k)=>v+(b[k]-v)*t));
  }
  const mats=joints.map(j=>j.getWorldMatrix()),fore=forearm.getWorldMatrix(),a=tx(fore,add(calibration.socketPositionCm,[0,100*calibration.emitterStartMetres,0])),b=tx(fore,add(calibration.socketPositionCm,[0,100*calibration.tipMetres,0]));const vertices=new Map();
  function vertex(i){if(vertices.has(i))return vertices.get(i);const id=ids.getElement(i,[]),w=weights.getElement(i,[]),p=pos.getElement(i,[]);let out=[0,0,0];for(let k=0;k<4;k++)if(w[k])out=add(out,mul(tx(mats[id[k]],tx(inv.getElement(id[k],[]),p)),w[k]));vertices.set(i,out);return out;}
  for(const i of legVertices){const d=dist(vertex(i),a,b);if(d<min){min=d;worst=frame/72;}}
  for(const tri of legTriangles)if(hit(a,b,...tri.map(vertex)))hits++;
 }
 assert.equal(hits,0,animation.getName()+' blade axis crosses a leg triangle');
 assert.ok(min>.055,animation.getName()+' needs a renewed blade-clearance review');
 console.log({clip:animation.getName(),samples:73,bladeAxisTriangleIntersections:hits,nearestLegVertexMetres:min,phase:worst});
}
