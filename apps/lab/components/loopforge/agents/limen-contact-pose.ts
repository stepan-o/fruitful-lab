import {Quaternion,Vector3} from '@babylonjs/core/Maths/math.vector';
import type {AnimationGroup} from '@babylonjs/core/Animations/animationGroup';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import type {ActorView,MotionCue} from '@/lib/loopforge/encounters/contract';

/** Blade-aware wrist and recoil shoulder poses on the rebuilt 24-joint LIMEN.
 * Evaluate both corrected source poses before the existing transition blend.
 * No previous-frame state, attachment movement, rig edits or inverse kinematics.
 * These three clips remain candidates pending actual-shot visual review.
 */
export function createLimenContactPose(groups:AnimationGroup[],nodes:TransformNode[]){
 const targets=['RightHand','LeftArm'].map(name=>{
  const node=nodes.find(n=>n.name===name);
  if(!node?.rotationQuaternion)throw Error(`LIMEN contact joint missing: ${name}`);
  return {name,node,rest:node.rotationQuaternion.clone(),next:Quaternion.Identity(),old:Quaternion.Identity()};
 });
 const bank=new Map(groups.map(group=>[group.name,{group,tracks:targets.map(t=>group.targetedAnimations.find(a=>a.target===t.node&&a.animation.targetProperty==='rotationQuaternion')?.animation)}]));
 const wrist=Quaternion.RotationAxis(Vector3.Forward(),1.2),shoulder=Quaternion.RotationAxis(Vector3.Forward(),.5);
 function evaluate(cue:MotionCue,seconds:number,index:number,out:Quaternion){
  const entry=bank.get(cue.clip);
  if(!entry)throw Error(`LIMEN contact clip missing: ${cue.clip}`);
  const {group,tracks}=entry,track=tracks[index],fps=group.targetedAnimations[0].animation.framePerSecond,duration=(group.to-group.from)/fps;
  const time=(cue.start??0)+seconds*(cue.rate??1),t=cue.loop&&duration>0?((time%duration)+duration)%duration:Math.max(0,Math.min(duration,time));
  out.copyFrom(track?track.evaluate(group.from+t*fps)as Quaternion:targets[index].rest);
  // Keep the emitting hand folded clear of the unmodified forearm current.
  if(index===0&&(cue.clip==='Shouting_Angrily'||cue.clip==='Checkpoint_Strike'))out.multiplyToRef(wrist,out);
  // Open the whole left arm during the recoil; elbow and wrist follow together.
  if(index===1&&cue.clip==='Step_Back')out.multiplyToRef(shoulder,out);
 }
 return {sample(cue:MotionCue,seconds:number,previous?:ActorView['previous'],blend=1){
  const weight=blend*blend*(3-2*blend),mix=!!previous&&weight<1;
  targets.forEach((target,index)=>{
   evaluate(cue,seconds,index,target.next);
   if(mix){evaluate(previous!.cue,previous!.seconds,index,target.old);Quaternion.SlerpToRef(target.old,target.next,weight,target.node.rotationQuaternion!);}
   else target.node.rotationQuaternion!.copyFrom(target.next);
  });
 }};
}
