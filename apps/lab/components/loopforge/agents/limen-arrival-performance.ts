import {Vector3,Quaternion,Matrix} from '@babylonjs/core/Maths/math.vector';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {CharacterStage} from '../factory-study/scene';
import type {Motion} from '@/lib/loopforge/encounters/contract';
/** Temporary rehearsal acting, not an approved replacement for a captured baton performance.
 * A rigid baton follows the left wrist; the right forearm retains LIMEN's cyan identity. */
export function createLimenArrivalPerformance(stage:CharacterStage,root:TransformNode){
 const nodes=root.getDescendants().filter(n=>'rotationQuaternion' in n) as TransformNode[];
 const get=(name:string)=>{const n=nodes.find(n=>n.name===`mixamorig:${name}`);if(!n)throw Error(`LIMEN joint missing: ${name}`);return n;};
 const upper=get('LeftArm'),lower=get('LeftForeArm'),hand=get('LeftHand');
 const metal=new StandardMaterial('LIMEN protocol baton',stage.scene);metal.diffuseColor=Color3.FromHexString('#283b43');metal.specularColor.set(.35,.4,.42);
 const band=new StandardMaterial('Baton pale steel grip',stage.scene);band.diffuseColor=Color3.FromHexString('#aab9bd');
 const baton=MeshBuilder.CreateCylinder('Protocol baton · temporary prop',{height:.72,diameter:.065,tessellation:10},stage.scene);baton.parent=hand;baton.scaling.setAll(100);baton.position.set(0,32,0);baton.material=metal;
 const grip=MeshBuilder.CreateCylinder('Baton grip',{height:.18,diameter:.085,tessellation:10},stage.scene);grip.parent=hand;grip.scaling.setAll(100);grip.position.set(0,3,0);grip.material=band;
 stage.shadow.addShadowCaster(baton);stage.shadow.addShadowCaster(grip);
 const point=(p:Vector3)=>{root.computeWorldMatrix(true);return Vector3.TransformCoordinates(p,root.getWorldMatrix());};
 const direction=(p:Vector3)=>Vector3.TransformNormal(p,root.getWorldMatrix()).normalize();
 function aim(node:TransformNode,child:TransformNode,target:Vector3){
  node.computeWorldMatrix(true);child.computeWorldMatrix(true);
  const parent=node.parent as TransformNode;parent.computeWorldMatrix(true);const inverse=Matrix.Invert(parent.getWorldMatrix());
  const from=Vector3.TransformNormal(child.getAbsolutePosition().subtract(node.getAbsolutePosition()),inverse).normalize(),to=Vector3.TransformNormal(target.subtract(node.getAbsolutePosition()),inverse).normalize();
  const delta=Quaternion.FromUnitVectorsToRef(from,to,Quaternion.Identity());
  node.rotationQuaternion=delta.multiply(node.rotationQuaternion!);node.computeWorldMatrix(true);
 }
 function reach(target:Vector3){
  upper.computeWorldMatrix(true);lower.computeWorldMatrix(true);hand.computeWorldMatrix(true);
  const a=upper.getAbsolutePosition().clone(),b=lower.getAbsolutePosition().clone(),c=hand.getAbsolutePosition().clone(),l1=Vector3.Distance(a,b),l2=Vector3.Distance(b,c),d=Math.max(.01,Math.min(l1+l2-.01,Vector3.Distance(a,target))),axis=target.subtract(a).normalize();
  const pole=direction(new Vector3(-1,-.25,.15));pole.subtractInPlace(axis.scale(Vector3.Dot(pole,axis))).normalize();
  const along=(l1*l1+d*d-l2*l2)/(2*d),elbow=a.add(axis.scale(along)).add(pole.scale(Math.sqrt(Math.max(0,l1*l1-along*along))));
  aim(upper,lower,elbow);aim(lower,hand,target);
 }
 return {sample(motion:Motion,seconds:number){
  const t=Math.max(0,Math.min(1,seconds)),s=t*t*(3-2*t);
  const target=motion==='strike'?Vector3.Lerp(new Vector3(-.6,1.75,.15),new Vector3(-.1,1.25,.48),s):motion==='warn'?new Vector3(-.65,1.65,.35):new Vector3(-.55,1.05,.15);
  reach(point(target));
  // Aim the baton out from the wrist, not through the body. Wrist inherits the source hand roll.
  const endpoint=point(motion==='strike'?new Vector3(.15,.95,1.55):motion==='warn'?new Vector3(-.7,2.4,.3):new Vector3(-.55,.35,.15));
  hand.computeWorldMatrix(true);const axis=endpoint.subtract(hand.getAbsolutePosition()).normalize(),parent=(hand.parent as TransformNode);parent.computeWorldMatrix(true);
  const local=Vector3.TransformNormal(axis,Matrix.Invert(parent.getWorldMatrix())).normalize();
  hand.rotationQuaternion=Quaternion.FromUnitVectorsToRef(Vector3.Up(),local,Quaternion.Identity());
  hand.computeWorldMatrix(true);
 },dispose(){stage.shadow.removeShadowCaster(baton);stage.shadow.removeShadowCaster(grip);baton.dispose();grip.dispose();metal.dispose();band.dispose();}};
}
