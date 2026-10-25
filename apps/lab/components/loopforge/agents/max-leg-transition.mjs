/** Max-only task-space leg blend. No bank edits, floor offset or assumed stance.
 * Inputs are the actual sampler's old, next and blended local transforms.
 * Old/next ankle positions and foot orientations define the target; the existing
 * smoothstep weight is used once. Both leg lengths and the blended pelvis stay fixed.
 * Numerical reach is necessary, not sole clearance, anatomical or visual acceptance.
 */
const EPS = 1e-12;
export const CLIPS = new Set(['idle','Quiet_Wait','walking_2_inplace','Listening_Gesture','Push_Forward_and_Stop']);
export const LEGS = ['Left','Right'].flatMap(s=>['UpLeg','Leg','Foot','ToeBase'].map(j=>s+j));
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>Math.hypot(...a);
const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
function unit(v){const n=norm(v);if(!(n>EPS))throw Error('Max leg blend: degenerate direction');return mul(v,1/n);}
function finite(v,n){if(v.length!==n||v.some(x=>!Number.isFinite(x)))throw Error('Max leg blend: nonfinite transform');return v;}
const identity=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
const position=m=>m.slice(12,15);
function mm(a,b){const o=Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
function dir(m,v){return [0,1,2].map(i=>m[i]*v[0]+m[4+i]*v[1]+m[8+i]*v[2]);}
function inverse(m){
 const a=m[0],b=m[4],c=m[8],d=m[1],e=m[5],f=m[9],g=m[2],h=m[6],i=m[10];
 const det=a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g);
 if(Math.abs(det)<EPS)throw Error('Max leg blend: singular matrix');
 const n=[(e*i-f*h)/det,(f*g-d*i)/det,(d*h-e*g)/det,0,(c*h-b*i)/det,(a*i-c*g)/det,(b*g-a*h)/det,0,(b*f-c*e)/det,(c*d-a*f)/det,(a*e-b*d)/det,0,0,0,0,1];
 n.splice(12,3,...mul(dir(n,position(m)),-1));return n;
}
function qm(a,b){return [a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],a[3]*b[3]-dot(a.slice(0,3),b.slice(0,3))];}
function qs(a,b,t){a=unit(a);b=unit(b);let d=dot(a,b);if(d<0){b=mul(b,-1);d=-d;}if(d>.9995)return unit(lerp(a,b,t));const theta=Math.acos(Math.min(1,d));return unit(add(mul(a,Math.sin((1-t)*theta)/Math.sin(theta)),mul(b,Math.sin(t*theta)/Math.sin(theta))));}
function compose(p,q,s){
 const [x,y,z,w]=unit(q),xx=x*x,yy=y*y,zz=z*z,xy=x*y,xz=x*z,yz=y*z,wx=w*x,wy=w*y,wz=w*z;
 return [(1-2*(yy+zz))*s[0],2*(xy+wz)*s[0],2*(xz-wy)*s[0],0,2*(xy-wz)*s[1],(1-2*(xx+zz))*s[1],2*(yz+wx)*s[1],0,2*(xz+wy)*s[2],2*(yz-wx)*s[2],(1-2*(xx+yy))*s[2],0,...p,1];
}
function decompose(m){
 let x=m.slice(0,3),y=m.slice(4,7),z=m.slice(8,11),s=[norm(x),norm(y),norm(z)];
 if(s.some(v=>v<EPS))throw Error('Max leg blend: degenerate basis');
 if(dot(cross(x,y),z)<0)s[0]=-s[0];x=mul(x,1/s[0]);y=mul(y,1/s[1]);z=mul(z,1/s[2]);
 if(Math.max(Math.abs(dot(x,y)),Math.abs(dot(y,z)),Math.abs(dot(z,x)))>1e-5)throw Error('Max leg blend: sheared rig needs explicit handling');
 const m00=x[0],m01=y[0],m02=z[0],m10=x[1],m11=y[1],m12=z[1],m20=x[2],m21=y[2],m22=z[2];
 const trace=m00+m11+m22;let q;
 if(trace>0){const t=Math.sqrt(trace+1)*2;q=[(m21-m12)/t,(m02-m20)/t,(m10-m01)/t,t/4];}
 else if(m00>m11&&m00>m22){const t=Math.sqrt(1+m00-m11-m22)*2;q=[t/4,(m01+m10)/t,(m02+m20)/t,(m21-m12)/t];}
 else if(m11>m22){const t=Math.sqrt(1+m11-m00-m22)*2;q=[(m01+m10)/t,t/4,(m12+m21)/t,(m02-m20)/t];}
 else {const t=Math.sqrt(1+m22-m00-m11)*2;q=[(m02+m20)/t,(m12+m21)/t,t/4,(m10-m01)/t];}
 return {p:position(m),q:unit(q),s};
}
function orientBetween(a,b,t){const x=decompose(a),y=decompose(b);if(x.s.some((v,i)=>Math.abs(v-y.s[i])>1e-5))throw Error('Max leg blend: changing segment scale');return compose(lerp(x.p,y.p,t),qs(x.q,y.q,t),x.s);}
function fromTo(a,b){a=unit(a);b=unit(b);const d=dot(a,b);if(d<-.9999999999)throw Error('Max leg blend: antiparallel direction needs an authored pole');return unit([...cross(a,b),1+d]);}
function fk(h,pose){const w=[];for(let i=0;i<h.length;i++){const p=h[i].parent;if(p>=i)throw Error('Max leg blend: hierarchy is not parent-first');const m=compose(pose[i].p,pose[i].q,pose[i].s);w.push(p<0?m:mm(w[p],m));}return w;}
const clone=p=>p.map(n=>({p:n.p.slice(),q:n.q.slice(),s:n.s.slice()}));

/** Pure numeric entry point shared by the runtime adapter and reserved checker. */
export function solveLegBlend({hierarchy,previous,destination,blended,weight}){
 if(!(weight>=0&&weight<=1))throw Error('Max leg blend: invalid weight');
 if([previous,destination,blended].some(x=>x.length!==hierarchy.length))throw Error('Max leg blend: pose size mismatch');
 for(const p of [previous,destination,blended])for(const n of p){finite(n.p,3);finite(n.q,4);finite(n.s,3);}
 const result=clone(blended),sides=[];
 if(weight===0||weight===1)return {pose:result,sides,applied:false};
 const names=new Map(hierarchy.map((n,i)=>[n.name,i]));
 if(names.size!==hierarchy.length)throw Error('Max leg blend: duplicate node name');
 const dependencies=new Set();
 for(const name of LEGS){let i=names.get(name);if(i===undefined)throw Error('Max leg blend: missing exact leg node');while(i>=0&&!dependencies.has(i)){dependencies.add(i);i=hierarchy[i].parent;}}
 // Quiet-to-Quiet and identical lower-body poses do not need IK. Preserve them
 // exactly, including straight knees for which no bend plane can be recovered.
 if([...dependencies].every(i=>['p','q','s'].every(k=>previous[i][k].every((v,j)=>v===destination[i][k][j]))))return {pose:result,sides,applied:false};
 const before=fk(hierarchy,previous),after=fk(hierarchy,destination);let world=fk(hierarchy,result);
 for(const side of ['Left','Right']){
  const ids=['UpLeg','Leg','Foot','ToeBase'].map(j=>names.get(side+j));
  if(ids.some(i=>i===undefined))throw Error('Max leg blend: missing exact leg node');
  const [hip,knee,foot,toe]=ids;
  if(hierarchy[knee].parent!==hip||hierarchy[foot].parent!==knee||hierarchy[toe].parent!==foot)throw Error('Max leg blend: unexpected chain');
  const hipP=position(world[hip]),kneeP=position(world[knee]),ankleP=position(world[foot]);
  const target=lerp(position(before[foot]),position(after[foot]),weight),axis=unit(sub(target,hipP));
  const l1=norm(sub(kneeP,hipP)),l2=norm(sub(ankleP,kneeP)),reach=norm(sub(target,hipP));
  if(reach>l1+l2||reach<Math.abs(l1-l2)||reach<EPS)throw Error(`Max leg blend: ${side} unreachable target ${reach} outside [${Math.abs(l1-l2)},${l1+l2}]`);
  const pole= sub(lerp(position(before[knee]),position(after[knee]),weight),hipP);
  const bend=unit(sub(pole,mul(axis,dot(pole,axis))));
  const along=(l1*l1+reach*reach-l2*l2)/(2*reach),height=Math.sqrt(Math.max(0,l1*l1-along*along));
  const targetKnee=add(hipP,add(mul(axis,along),mul(bend,height)));
  function pointBone(bone,child,targetPoint){
   const p=hierarchy[bone].parent,parent=p<0?identity():world[p],inv=inverse(parent),origin=position(world[bone]);
   const current=dir(inv,sub(position(world[child]),origin)),desired=dir(inv,sub(targetPoint,origin));
   result[bone].q=unit(qm(fromTo(current,desired),result[bone].q));world=fk(hierarchy,result);
  }
  pointBone(hip,knee,targetKnee);pointBone(knee,foot,target);
  // Restore the interpolated task orientation after changing the upstream chain.
  // The shared loader reflection is handled by signed decomposition, never a
  // guessed handedness toggle or a global rotation of the actor.
  for(const joint of [foot,toe]){
   const task=orientBetween(before[joint],after[joint],weight);
   task.splice(12,3,...position(world[joint]));
   const parent=hierarchy[joint].parent,local=mm(inverse(parent<0?identity():world[parent]),task),d=decompose(local);
   if(d.s.some((v,i)=>Math.abs(v-result[joint].s[i])>1e-5))throw Error('Max leg blend: local scale would change');
   result[joint].q=d.q;world=fk(hierarchy,result);
  }
  const ankleError=norm(sub(position(world[foot]),target));
  if(ankleError>1e-6)throw Error('Max leg blend: ankle solve residual '+ankleError);
  sides.push({side,targetAnkle:target,targetKnee,reach,minimumReach:Math.abs(l1-l2),maximumReach:l1+l2,reachSlack:l1+l2-reach,ankleError,stanceInferred:false});
 }
 return {pose:result,sides,applied:true};
}

/** Optional Max-only hook. No Babylon import or sampling occurs in this module. */
export function createMaxLegTransition(channels,placementRoot){
 const nodes=[],index=new Map();
 function include(node){if(node===placementRoot)return -1;if(!node)throw Error('Max leg blend: node outside placement root');if(index.has(node))return index.get(node);const parent=include(node.parent),i=nodes.length;nodes.push({node,parent});index.set(node,i);return i;}
 for(const c of channels)include(c.target);
 const hierarchy=nodes.map(({node,parent})=>({name:node.name,parent}));
 const rest=nodes.map(({node})=>{
  if(!node.rotationQuaternion&&norm(node.rotation.asArray())>EPS)throw Error('Max leg blend: explicit quaternion required for nonzero Euler transform');
  return {p:node.position.asArray(),q:node.rotationQuaternion?.asArray()??[0,0,0,1],s:node.scaling.asArray()};
 });
 const legs=new Set(LEGS),byChannel=channels.map(c=>index.get(c.target));
 function valuesPose(values){const p=clone(rest);channels.forEach((c,i)=>{const v=values[i].asArray(),n=p[byChannel[i]];if(c.path==='position')n.p=v;else if(c.path==='scaling')n.s=v;else if(c.path==='rotationQuaternion')n.q=v;});return p;}
 return {apply(cue,previousCue,old,next,weight){
  if(!previousCue||weight===0||weight===1||!CLIPS.has(cue.clip)||!CLIPS.has(previousCue.clip))return {applied:false};
  const current=nodes.map(({node})=>({p:node.position.asArray(),q:node.rotationQuaternion?.asArray()??[0,0,0,1],s:node.scaling.asArray()}));
  const solved=solveLegBlend({hierarchy,previous:valuesPose(old),destination:valuesPose(next),blended:current,weight});
  // Identical poses return the native, potentially nonunit quaternion unchanged.
  if(!solved.applied)return solved;
  // Preserve the sampled magnitude to avoid a skin-matrix jump at bypasses.
  // Prepare both legs before committing so encoding rejection remains atomic.
  const corrections=nodes.flatMap(({node},i)=>{
   if(!legs.has(node.name))return [];
   const magnitude=norm(current[i].q);
   if(!(magnitude>EPS)||!Number.isFinite(magnitude))throw Error('Max leg blend: invalid sampled quaternion magnitude');
   return [{node,q:finite(solved.pose[i].q.map(value=>value*magnitude),4)}];
  });
  for(const {node,q} of corrections)node.rotationQuaternion.copyFromFloats(...q);
  return solved;
 }};
}
