import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Vector3,Vector4,Quaternion} from '@babylonjs/core/Maths/math.vector';
import type {Scene} from '@babylonjs/core/scene';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import type {SceneProp,PropLocation} from '@/lib/loopforge/encounters/contract';
import grips from '@/lib/loopforge/agents/opening-worker-grips.json';
import sockets from '@/lib/loopforge/agents/opening-worker-sockets.json';
import {worldPoint} from '@/lib/loopforge/spatial/floor';

/** Ten small meshes share one 512² atlas/material. Only the encounter's public
 * custody projection can place them; this view has no ownership side effects. */
export function createCredentialProps(scene:Scene,owners:readonly string[],hand:(id:string,side:'left'|'right')=>TransformNode|undefined){
 const texture=new DynamicTexture('Factory admission cards',{width:512,height:512},scene,false),ctx=texture.getContext() as CanvasRenderingContext2D;
 ctx.fillStyle='#d1c8a4';ctx.fillRect(0,0,512,512);
 const material=new StandardMaterial('Worn cream admission card',scene);material.diffuseTexture=texture;material.specularColor=Color3.Black();material.emissiveColor=new Color3(.18,.17,.12);
 const cards=new Map(owners.map((owner,i)=>{
  const x=i%4*128,y=Math.floor(i/4)*128;
  ctx.fillStyle='#364a4e';ctx.fillRect(x+5,y+5,118,25);ctx.fillStyle='#ded3a8';ctx.font='bold 10px monospace';ctx.fillText('LOOPFORGE',x+13,y+22);
  ctx.fillStyle='#344447';ctx.fillRect(x+10,y+39,29,37);ctx.fillStyle='#3f94ac';ctx.beginPath();ctx.arc(x+24,y+51,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#344447';ctx.font='bold 19px monospace';ctx.fillText(owner,x+46,y+59);
  ctx.fillRect(x+46,y+71,67,3);ctx.fillRect(x+10,y+86,103,2);ctx.font='10px monospace';ctx.fillText(String(i+1).padStart(3,'0')+' / WORKER',x+10,y+104);
  const uv=new Vector4(x/512,1-(y+128)/512,(x+128)/512,1-y/512);
  const mesh=MeshBuilder.CreateBox(owner+' admission card',{width:.18,height:.13,depth:.003,faceUV:Array.from({length:6},()=>uv)},scene);
  mesh.material=material;mesh.isPickable=false;mesh.setEnabled(false);return [owner+':id',mesh] as const;
 }));texture.update();
 const edgeRotations=new Map(Object.entries(grips).map(([id,g])=>[id,Quaternion.FromArray(g.edge.quaternion)]));
 const scale=Vector3.One(),fromPosition=Vector3.Zero(),toPosition=Vector3.Zero(),fromScale=Vector3.One(),toScale=Vector3.One(),fromRotation=Quaternion.Identity(),toRotation=Quaternion.Identity();
 function place(card:ReturnType<typeof MeshBuilder.CreateBox>,p:PropLocation){
  card.rotationQuaternion=null;
  if(p.kind==='stowed')return false;
  if(p.kind==='floor'){
   card.parent=null;card.scaling.setAll(1);const q=worldPoint(p.position[0]/1000,p.position[1]/1000);card.position.set(q[0],.018,q[2]);card.rotation.set(Math.PI/2,p.yaw*Math.PI/180,0);
  }else{
   const socket=hand(p.agent,p.socket);if(!socket)return false;
   card.parent=socket;socket.computeWorldMatrix(true);socket.getWorldMatrix().decompose(scale);
   card.scaling.set(1/Math.abs(scale.x),1/Math.abs(scale.y),1/Math.abs(scale.z));
   const offset=sockets[p.agent as keyof typeof sockets]?.[p.socket]??[0,10,-4];
   const edge=p.grip==='edge'&&p.socket==='right'?grips[p.agent as keyof typeof grips]?.edge:undefined;
   if(edge){card.position.copyFromFloats(edge.position[0],edge.position[1],edge.position[2]);card.rotationQuaternion=edgeRotations.get(p.agent)!;}
   else{card.position.set(offset[0],p.grip==='edge'?offset[1]*2.1:offset[1],offset[2]);card.rotation.set(0,p.socket==='right'?0:Math.PI,0);}
  }
  card.computeWorldMatrix(true);return true;
 }
 return {
  update(props:readonly SceneProp[],tick:number){
   cards.forEach(card=>card.setEnabled(false));
   for(const prop of props){
    const card=cards.get(prop.id);if(!card||!place(card,prop.location))continue;
    const age=prop.previous?(tick-prop.previous.tick)*.05:1;
    // A brief deterministic lift/turn joins the fixed floor pose to the moving
    // hand. Seeking reconstructs it from custody history, not a cached frame.
    if(prop.previous&&age<.3&&prop.previous.location.kind!=='stowed'){
     card.getWorldMatrix().decompose(toScale,toRotation,toPosition);
     if(place(card,prop.previous.location)){
      card.getWorldMatrix().decompose(fromScale,fromRotation,fromPosition);
      const t=Math.max(0,age/.3),ease=t*t*(3-2*t);card.parent=null;
      Vector3.LerpToRef(fromPosition,toPosition,ease,card.position);Vector3.LerpToRef(fromScale,toScale,ease,card.scaling);
      card.rotationQuaternion=Quaternion.Slerp(fromRotation,toRotation,ease);card.computeWorldMatrix(true);
     }
    }
    card.setEnabled(true);
   }
  },
  dispose(){cards.forEach(card=>card.dispose());material.dispose();texture.dispose();}
 };
}

/** A shallow, open-top credential sleeve. The baked hand curve inserts the
 * paper behind its front plate before custody becomes stowed. */
export function createCredentialSleeve(scene:Scene,worker:string,hips:TransformNode){
 const fit=grips[worker as keyof typeof grips]?.pouch;if(!fit)return;
 const material=new StandardMaterial(worker+' credential sleeve',scene);material.diffuseColor=Color3.FromHexString('#294652');material.specularColor=new Color3(.12,.14,.15);
 const panels=[
  {size:[.22,.17,.012],at:[0,0,.025]},
  {size:[.22,.17,.008],at:[0,0,-.025]},
  {size:[.012,.17,.05],at:[-.105,0,0]},
  {size:[.012,.17,.05],at:[.105,0,0]},
  {size:[.22,.012,.05],at:[0,-.079,0]},
  {size:[.16,.035,.028],at:[.14,.055,-.04]},
 ].map(({size,at},i)=>{const m=MeshBuilder.CreateBox(worker+' sleeve panel '+i,{width:size[0],height:size[1],depth:size[2]},scene);m.position.set(at[0],at[1],at[2]);m.material=material;return m;});
 const mesh=Mesh.MergeMeshes(panels,true,true)!;mesh.name=worker+' belt sleeve';mesh.parent=hips;mesh.position.copyFromFloats(fit.position[0],fit.position[1],fit.position[2]);mesh.rotationQuaternion=Quaternion.FromArray(fit.quaternion);
 const scale=Vector3.One();hips.computeWorldMatrix(true).decompose(scale);mesh.scaling.set(1/Math.abs(scale.x),1/Math.abs(scale.y),1/Math.abs(scale.z));mesh.isPickable=false;mesh.receiveShadows=true;
 return {mesh,dispose(){mesh.dispose();material.dispose();}};
}
