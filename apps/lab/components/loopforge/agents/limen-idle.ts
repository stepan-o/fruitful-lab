import {Quaternion,Vector3} from '@babylonjs/core/Maths/math.vector';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import clip from './generated/limen-idle.json';

export function createLimenIdle(nodes:TransformNode[]){
 const byName=new Map(nodes.map(n=>[n.name,n]));
 const base=clip.base.map(p=>({node:byName.get(p.name)!,position:Vector3.FromArray(p.translation),rotation:Quaternion.FromArray(p.rotation)}));
 const tracks=clip.joints.map(name=>byName.get(name)!);
 if(base.some(p=>!p.node)||tracks.some(n=>!n))throw new Error('LIMEN idle rig does not match its authored clip.');
 const a=Quaternion.Identity(),b=Quaternion.Identity();
 return (phase:number)=>{
  for(const p of base){p.node.position.copyFrom(p.position);p.node.rotationQuaternion??=Quaternion.Identity();p.node.rotationQuaternion.copyFrom(p.rotation);}
  const frame=Math.max(0,Math.min(1,phase))*(clip.frames.length-1),i=Math.floor(frame),j=Math.min(i+1,clip.frames.length-1),blend=frame-i;
  for(let n=0;n<tracks.length;n++){Quaternion.FromArrayToRef(clip.frames[i],n*4,a);Quaternion.FromArrayToRef(clip.frames[j],n*4,b);Quaternion.SlerpToRef(a,b,blend,tracks[n].rotationQuaternion!);}
 };
}
