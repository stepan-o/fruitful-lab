import {createMaxLegTransition} from './max-leg-transition.mjs';
import {Quaternion,Vector3} from '@babylonjs/core/Maths/math.vector';
import type {AnimationGroup} from '@babylonjs/core/Animations/animationGroup';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import type {MotionCue,ActorView} from '@/lib/loopforge/encounters/contract';
/** Stateless pose results, reusable work buffers. Seeking never depends on the preceding sample. */
export function createPerformanceSampler(groups:AnimationGroup[],prefix='',rootMotion:'z-up'|'y-up'|'source'='z-up',maxLegRoot?:TransformNode){
 const indices=new Map<string,number>(),channels:{target:TransformNode;path:string;rest:Quaternion|Vector3}[]=[];
 for(const group of groups)for(const {animation,target}of group.targetedAnimations){const path=animation.targetProperty,key=`${target.uniqueId}/${path}`;if(!indices.has(key)){indices.set(key,channels.length);channels.push({target,path,rest:target[path].clone()});}}
 const prepared=new Map(groups.map(group=>[group,{group,tracks:group.targetedAnimations.map(({animation,target})=>({animation,index:indices.get(`${target.uniqueId}/${animation.targetProperty}`)!,hips:rootMotion!=='source'&&animation.targetProperty==='position'&&/(?:^|:)Hips$/.test(target.name)}))}]));
 const bank=new Map(groups.map(g=>[g.name.replace(prefix,''),prepared.get(g)!]));
 for(const g of groups)if(/(?:_Corrected|__corrected)$/.test(g.name))bank.set(g.name.replace(prefix,'').replace(/(?:_Corrected|__corrected)$/, ''),prepared.get(g)!);
 // Quiet_Wait is a deterministic restrained derivative of the approved idle.
 const quiet=bank.get('idle');if(quiet)bank.set('Quiet_Wait',quiet);
 // Quiet crowd poses reuse one immutable contact pose. Legs and hips remain
 // planted; do not resample their identical curves on every world tick.
 const quietBase=new Map<(typeof channels)[number]['target'],Map<string,Quaternion|Vector3>>();
 if(quiet){const group=quiet.group,fps=quiet.tracks[0].animation.framePerSecond,frame=group.from+Math.min(.2,(group.to-group.from)/fps)*fps;
  for(const {animation,index}of quiet.tracks){const {target,path}=channels[index];let paths=quietBase.get(target);if(!paths){paths=new Map();quietBase.set(target,paths);}paths.set(path,(animation.evaluate(frame)as Quaternion|Vector3).clone());}
 }
 const next=channels.map(t=>t.rest.clone()),old=channels.map(t=>t.rest.clone());
 const maxLegBlend=maxLegRoot?createMaxLegTransition(channels,maxLegRoot):undefined;
 function evaluate(cue:MotionCue,seconds:number,result:(Quaternion|Vector3)[]){
  const entry=bank.get(cue.clip);if(!entry)throw Error(`Missing performance: ${cue.clip}`);
  const {group,tracks}=entry,fps=tracks[0].animation.framePerSecond,duration=(group.to-group.from)/fps;
  const time=(cue.start??0)+seconds*(cue.rate??1),t=cue.loop&&duration>0?((time%duration)+duration)%duration:Math.max(0,Math.min(duration,time));
  for(let i=0;i<channels.length;i++){if(channels[i].path==='rotationQuaternion')(result[i]as Quaternion).copyFrom(channels[i].rest as Quaternion);else(result[i]as Vector3).copyFrom(channels[i].rest as Vector3);}
  for(const {animation,index,hips}of tracks){
   const channel=channels[index],base=cue.clip==='Quiet_Wait'?quietBase.get(channel.target)?.get(channel.path):undefined;
   if(base){
    const name=channel.target.name,amount=/(?:Hips|UpLeg|Leg|Foot|Toe)/i.test(name)?0:/Head|Neck/i.test(name)?.18:.08;
    if(channel.path==='rotationQuaternion'){
     if(amount===0)(result[index]as Quaternion).copyFrom(base as Quaternion);
     else Quaternion.SlerpToRef(base as Quaternion,animation.evaluate(group.from+t*fps)as Quaternion,amount,result[index]as Quaternion);
    }else(result[index]as Vector3).copyFrom(base as Vector3);
   }else{
    const value=animation.evaluate(group.from+t*fps)as Quaternion|Vector3;
    if(channel.path==='rotationQuaternion')(result[index]as Quaternion).copyFrom(value as Quaternion);else(result[index]as Vector3).copyFrom(value as Vector3);
   }
   // Locomotion travel belongs to the encounter. A planted interaction may retain
   // its baked balance shift around that anchor; portraits preserve all source travel.
   if(hips&&cue.rootMotion!=='preserve'){const p=result[index]as Vector3;p.x=0;if(rootMotion==='z-up')p.y=0;else p.z=0;}
  }
 }
 return {sample(cue:MotionCue,seconds:number,previous?:ActorView['previous'],blend=1){
  const weight=blend*blend*(3-2*blend),mix=!!previous&&weight<1;
  evaluate(cue,seconds,next);if(mix)evaluate(previous!.cue,previous!.seconds,old);
  for(let i=0;i<channels.length;i++){
   const {target,path}=channels[i];
   if(path==='rotationQuaternion'){if(mix)Quaternion.SlerpToRef(old[i]as Quaternion,next[i]as Quaternion,weight,target.rotationQuaternion!);else target.rotationQuaternion!.copyFrom(next[i]as Quaternion);}
   else if(path==='position'||path==='scaling'){const out=path==='position'?target.position:target.scaling;if(mix)Vector3.LerpToRef(old[i]as Vector3,next[i]as Vector3,weight,out);else out.copyFrom(next[i]as Vector3);}
  }
  if(mix)maxLegBlend?.apply(cue,previous!.cue,old,next,weight);
 }};
}
