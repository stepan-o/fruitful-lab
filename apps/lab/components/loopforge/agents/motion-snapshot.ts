import type {ActorView} from '@/lib/loopforge/encounters/contract';

/** Temporary A3 read-only adapter. No loading, posing, seeking, timers or listeners. */
interface Value {asArray():readonly number[]}
interface MatrixValue {m:ArrayLike<number>}
export interface MotionNode {
 name:string;uniqueId:number;parent:{name:string;uniqueId:number}|null;
 position:Value;rotation:Value;rotationQuaternion:Value|null;scaling:Value;
 computeWorldMatrix(force:boolean):unknown;getWorldMatrix():MatrixValue;
}
export interface MotionGroup {
 name:string;from:number;to:number;targetedAnimations:readonly {
  target:unknown;animation:{name:string;targetProperty:string;framePerSecond:number;evaluate(frame:number):unknown};
 }[];
}
export interface MotionScene {
 activeCamera:{viewport:{toGlobal(width:number,height:number):{x:number;y:number;width:number;height:number}}}|null;
 getTransformMatrix():MatrixValue;
 getEngine():{getRenderWidth():number;getRenderHeight():number};
}
export type MotionSource={baseTree:string;sourceTree:string|null;revision:string;sourceHashes:Readonly<Record<string,string>>;deploymentCommit:string|null};
export type MotionInput={worker:string;file:{src:string;sha256:string};root:MotionNode;nodes:readonly MotionNode[];groups:readonly MotionGroup[];scene:MotionScene;view:ActorView;standingHeight:number;sourceHeight:number};
export const CORE_JOINTS=['Hips','Head','LeftArm','LeftForeArm','LeftHand','RightArm','RightForeArm','RightHand','LeftFoot','RightFoot'] as const;
const wanted=new Set<string>([...CORE_JOINTS,'Spine02','Spine01','Spine','neck','LeftShoulder','RightShoulder','LeftUpLeg','LeftLeg','RightUpLeg','RightLeg']);
export function finite(values:ArrayLike<number>,size?:number):number[]{
 const result=Array.from(values);
 if((size!==undefined&&result.length!==size)||result.some(x=>!Number.isFinite(x)))throw Error('A3 nonfinite or malformed transform/sample');
 return result;
}
function copy(value:unknown,size:number){
 if(!value||typeof value!=='object'||!('asArray' in value)||typeof value.asArray!=='function')throw Error('A3 missing vector/quaternion channel');
 const array:unknown=value.asArray();
 if(!Array.isArray(array)&&!ArrayBuffer.isView(array))throw Error('A3 malformed vector/quaternion');
 const values=finite(Array.from(array as ArrayLike<number>),size);
 if(size===4&&Math.hypot(...values)<1e-12)throw Error('A3 zero quaternion');
 return values;
}
function unit(q:readonly number[]){const n=Math.hypot(...q);if(!Number.isFinite(n)||n<1e-12)throw Error('A3 degenerate quaternion');return q.map(x=>x/n);}
function slerp(a:number[],b:number[],t:number){
 a=unit(a);b=unit(b);let d=a.reduce((s,x,i)=>s+x*b[i],0);
 if(d<0){b=b.map(x=>-x);d=-d;}
 if(d>.9995)return unit(a.map((x,i)=>x+(b[i]-x)*t));
 const angle=Math.acos(Math.min(1,d)),sin=Math.sin(angle);
 return finite(a.map((x,i)=>(Math.sin((1-t)*angle)*x+Math.sin(t*angle)*b[i])/sin),4);
}
function angularError(a:readonly number[],b:readonly number[]){const x=unit(a),y=unit(b);return finite([2*Math.acos(Math.min(1,Math.abs(x.reduce((s,v,i)=>s+v*y[i],0))))*180/Math.PI])[0];}
function project(p:number[],scene:MotionScene){
 const camera=scene.activeCamera;if(!camera)throw Error('A3 no active camera');
 const m=finite(scene.getTransformMatrix().m,16),w=p[0]*m[3]+p[1]*m[7]+p[2]*m[11]+m[15];
 if(!Number.isFinite(w)||Math.abs(w)<1e-12)throw Error('A3 invalid projection divisor');
 const q=finite([0,1,2].map(i=>(p[0]*m[i]+p[1]*m[i+4]+p[2]*m[i+8]+m[i+12])/w));
 const engine=scene.getEngine(),width=engine.getRenderWidth(),height=engine.getRenderHeight();finite([width,height]);
 if(width<=0||height<=0)throw Error('A3 empty render canvas');
 const v=camera.viewport.toGlobal(width,height);finite([v.x,v.y,v.width,v.height]);
 const xy=finite([v.x+(q[0]+1)*v.width/2,v.y+(1-q[1])*v.height/2]);
 return {x:xy[0],y:xy[1],normalizedDeviceDepth:q[2],clipW:w,renderWidth:width,renderHeight:height,coordinates:'render-canvas pixels; convert through canvasRect; not an occlusion test'};
}
export function snapshotMotion(input:MotionInput,source:MotionSource){
 const {worker,file,root,nodes,groups,scene,view,standingHeight,sourceHeight}=input;
 if(!['bob','sam','ed','max','jo','mae'].includes(worker)||view.id!==worker)throw Error('A3 actor binding mismatch');
 if(!view.cue)throw Error('A3 explicit live motion cue required');
 finite([view.seconds,view.cue.start??0,view.cue.rate??1,view.blend??1,standingHeight,sourceHeight]);
 if(standingHeight<=0||sourceHeight<=0||view.seconds<0||(view.blend??1)<0||(view.blend??1)>1)throw Error('A3 invalid height or cue time');
 const bank=new Map(groups.map(g=>[g.name,g]));if(bank.size!==groups.length)throw Error('A3 duplicate group names');
 for(const g of groups)if(/(?:_Corrected|__corrected)$/.test(g.name))bank.set(g.name.replace(/(?:_Corrected|__corrected)$/,''),g);
 if(bank.has('idle'))bank.set('Quiet_Wait',bank.get('idle')!);
 const group=bank.get(view.cue.clip);if(!group?.targetedAnimations.length)throw Error('A3 missing selected group/tracks');
 const fps=group.targetedAnimations[0].animation.framePerSecond;finite([fps,group.from,group.to]);
 if(fps<=0||group.to<group.from)throw Error('A3 invalid group timing');
 const duration=(group.to-group.from)/fps,raw=(view.cue.start??0)+view.seconds*(view.cue.rate??1);
 const time=view.cue.loop&&duration>0?((raw%duration)+duration)%duration:Math.max(0,Math.min(duration,raw));
 const frame=group.from+time*fps,quietFrame=group.from+Math.min(.2,duration)*fps;finite([duration,raw,time,frame,quietFrame]);
 const targets=nodes.filter(n=>wanted.has(n.name)),byName=new Map(targets.map(n=>[n.name,n]));
 if(byName.size!==targets.length||new Set(targets.map(n=>n.uniqueId)).size!==targets.length)throw Error('A3 duplicate joint names/IDs');
 for(const name of CORE_JOINTS)if(!byName.has(name))throw Error('A3 missing core joint '+name);
 const selected=group.targetedAnimations.filter(t=>targets.some(n=>n===t.target));
 const trackKeys=new Set<string>();
 for(const t of selected){
  const target=targets.find(n=>n===t.target)!;
  const key=target.uniqueId+'/'+t.animation.targetProperty;
  if(trackKeys.has(key))throw Error('A3 duplicate target channel');trackKeys.add(key);
 }
 for(const name of CORE_JOINTS)if(!trackKeys.has(byName.get(name)!.uniqueId+'/rotationQuaternion'))throw Error('A3 missing core rotation track '+name);
 if(!trackKeys.has(byName.get('Hips')!.uniqueId+'/position'))throw Error('A3 missing pelvis position track');
 const comparable=!view.previous||(view.blend??1)>=1;
 // Refresh derived matrices only. Local transforms, animation state and View are never written.
 root.computeWorldMatrix(true);
 const joints=targets.map(n=>{
  n.computeWorldMatrix(true);const matrix=finite(n.getWorldMatrix().m,16),world=matrix.slice(12,15);
  return {name:n.name,uniqueId:n.uniqueId,parentName:n.parent?.name??null,parentId:n.parent?.uniqueId??null,localPosition:copy(n.position,3),localQuaternion:n.rotationQuaternion?copy(n.rotationQuaternion,4):null,localEuler:copy(n.rotation,3),localScale:copy(n.scaling,3),worldMatrix:matrix,worldPosition:world,screen:project(world,scene)};
 });
 const tracks=selected.map(({animation,target:rawTarget})=>{
  const target=targets.find(n=>n===rawTarget)!,path=animation.targetProperty;
  if(path!=='rotationQuaternion'&&path!=='position'&&path!=='scaling')throw Error('A3 unexpected channel '+path);
  finite([animation.framePerSecond]);if(animation.framePerSecond<=0)throw Error('A3 invalid track FPS');
  const size=path==='rotationQuaternion'?4:3,rawValue=copy(animation.evaluate(frame),size);let expected=rawValue.slice();
  if(view.cue!.clip==='Quiet_Wait'){
   const base=copy(animation.evaluate(quietFrame),size),amount=/(?:Hips|UpLeg|Leg|Foot|Toe)/i.test(target.name)?0:/Head|Neck/i.test(target.name)?.18:.08;
   expected=path==='rotationQuaternion'?slerp(base,rawValue,amount):base;
  }
  if(path==='position'&&/(?:^|:)Hips$/.test(target.name)&&view.cue!.rootMotion!=='preserve'){expected[0]=0;expected[2]=0;}
  const live=copy(target[path],size),error=comparable?(path==='rotationQuaternion'?angularError(expected,live):Math.hypot(...expected.map((x,i)=>x-live[i]))):null;
  if(error!==null)finite([error]);
  return {joint:target.name,targetId:target.uniqueId,path,animationName:animation.name,animationFps:animation.framePerSecond,rawValue,expectedUnblendedValue:expected,liveValue:live,comparable,error,errorUnit:path==='rotationQuaternion'?'degrees':'target-local units (not normalized world metres)'};
 });
 const jointsByName=new Map(joints.map(j=>[j.name,j])),arms:Record<string,number>={};
 for(const side of ['Left','Right']){
  const a=jointsByName.get(side+'Arm')!,h=jointsByName.get(side+'Hand')!,d=h.worldPosition.map((x,i)=>x-a.worldPosition[i]),length=Math.hypot(...d);
  if(length<1e-12)throw Error('A3 degenerate arm vector');
  arms[side]=finite([Math.acos(Math.max(-1,Math.min(1,-d[1]/length)))*180/Math.PI])[0];
 }
 return {schema:'engine.motion-snapshot/1',source,actor:worker,asset:{src:file.src,sha256:file.sha256},standingHeight,sourceHeight,view:JSON.parse(JSON.stringify(view)) as ActorView,selectedGroup:group.name,groupFrom:group.from,groupTo:group.to,fps,duration,rawSourceSeconds:raw,sampledSourceSeconds:time,frame,comparison:'Unblended expectation only; blended rows have no error verdict',root:{position:copy(root.position,3),rotation:copy(root.rotation,3),scale:copy(root.scaling,3),worldMatrix:finite(root.getWorldMatrix().m,16)},armAngleFromWorldDownDegrees:arms,joints,tracks,untrackedJoints:joints.filter(j=>!tracks.some(t=>t.targetId===j.uniqueId)).map(j=>j.name),limits:['No skin, mesh contact, actor-visibility or pose acceptance','World matrices are Babylon column-major arrays','Track equality does not validate inverse bind matrices']};
}
export type MotionSnapshot=ReturnType<typeof snapshotMotion>;
