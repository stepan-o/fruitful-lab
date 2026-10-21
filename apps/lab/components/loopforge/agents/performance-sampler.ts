import {Quaternion,Vector3} from '@babylonjs/core/Maths/math.vector';
import type {AnimationGroup} from '@babylonjs/core/Animations/animationGroup';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import type {MotionCue,ActorView} from '@/lib/loopforge/encounters/contract';
/** Stateless sampling is shared by portraits and encounters. Seek order cannot change a pose. */
export function createPerformanceSampler(groups:AnimationGroup[],prefix='',rootMotion:'z-up'|'y-up'|'source'='z-up'){
 const channels=new Map<string,{target:TransformNode;path:string;value:Quaternion|Vector3}>();
 for(const group of groups)for(const {animation,target}of group.targetedAnimations){const path=animation.targetProperty,key=`${target.uniqueId}/${path}`;if(!channels.has(key))channels.set(key,{target,path,value:target[path].clone()});}
 const bank=new Map(groups.map(g=>[g.name.replace(prefix,'').replace(/_Corrected$/,''),g]));
 function evaluate(cue:MotionCue,seconds:number){
  const group=bank.get(cue.clip);if(!group)throw Error(`Missing performance: ${cue.clip}`);
  const fps=group.targetedAnimations[0].animation.framePerSecond,duration=(group.to-group.from)/fps;
  const time=(cue.start??0)+seconds*(cue.rate??1),t=cue.loop?((time%duration)+duration)%duration:Math.max(0,Math.min(duration,time));
  const result=new Map([...channels].map(([key,track])=>[key,{...track,value:track.value.clone()}]));
  for(const {animation,target}of group.targetedAnimations){
   const value=animation.evaluate(group.from+t*fps).clone() as Quaternion|Vector3;
   // The encounter owns horizontal travel. Imported FBX rigs use local Z-up;
   // the new GLB rigs use Y-up. Inspection keeps the source path intact.
   if(rootMotion!=='source'&&animation.targetProperty==='position'&&/(?:^|:)Hips$/.test(target.name)){(value as Vector3).x=0;if(rootMotion==='z-up')(value as Vector3).y=0;else (value as Vector3).z=0;}
   result.set(`${target.uniqueId}/${animation.targetProperty}`,{target:target as TransformNode,path:animation.targetProperty,value});
  }
  return [...result.values()];
 }
 return {sample(cue:MotionCue,seconds:number,previous?:ActorView['previous'],blend=1){
  const next=evaluate(cue,seconds),weight=blend*blend*(3-2*blend);
  const old=previous&&weight<1?new Map(evaluate(previous.cue,previous.seconds).map(t=>[`${t.target.uniqueId}/${t.path}`,t.value])):null;
  for(const t of next){const before=old?.get(`${t.target.uniqueId}/${t.path}`),value=before?(t.path==='rotationQuaternion'?Quaternion.Slerp(before as Quaternion,t.value as Quaternion,weight):Vector3.Lerp(before as Vector3,t.value as Vector3,weight)):t.value;
   if(t.path==='rotationQuaternion')t.target.rotationQuaternion!.copyFrom(value as Quaternion);
   else if(t.path==='position')t.target.position.copyFrom(value as Vector3);
   else if(t.path==='scaling')t.target.scaling.copyFrom(value as Vector3);
  }
 }};
}
