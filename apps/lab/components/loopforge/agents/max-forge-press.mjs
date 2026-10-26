/** Max-only authored control reach. Source-only candidate; no measured contact or visual pass.
 * Numeric transform utilities retained from the selected leg solver; that solver is unchanged.
 * All pose coordinates include native model transforms and exclude placement root. */
const EPS = 1e-12;
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
function fromTo(a,b){a=unit(a);b=unit(b);const d=dot(a,b);if(d<-.9999999999)throw Error('Max leg blend: antiparallel direction needs an authored pole');return unit([...cross(a,b),1+d]);}
function fk(h,pose){const w=[];for(let i=0;i<h.length;i++){const p=h[i].parent;if(p>=i)throw Error('Max leg blend: hierarchy is not parent-first');const m=compose(pose[i].p,pose[i].q,pose[i].s);w.push(p<0?m:mm(w[p],m));}return w;}
const clone=p=>p.map(n=>({p:n.p.slice(),q:n.q.slice(),s:n.s.slice()}));

export const FORGE_PRESS = Object.freeze({
 // Forge-relative time: the existing Writer ready/command turns prepare the
 // reach; the ram starts at zero, when the hand must already touch its control.
 preparationStart:-2.7,duration:6,raiseEnd:-1.4,touchAt:0,releaseAt:3.8,clearAt:4.2,recoverAt:5.8,
 maximumTorsoLeanRadians:35*Math.PI/180,reachReserveMetres:.01,
 hoverMetres:.045,raiseMetres:.20,approachMetres:.10,outwardMetres:.22,
 residualMetres:1e-6,
});
export const FORGE_PRESS_JOINTS=Object.freeze(['Spine02','Spine01','Spine','RightArm','RightForeArm','RightHand']);
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*x*(10+x*(-15+6*x));};
const interval=(x,a,b)=>ease((x-a)/(b-a));
const point=(m,p)=>add(position(m),dir(m,p));
function axisQuaternion(axis,angle){const a=unit(axis),s=Math.sin(angle/2);return [...mul(a,s),Math.cos(angle/2)];}
function curve(a,b,c,d,t){return add(add(mul(a,(1-t)**3),mul(b,3*(1-t)**2*t)),add(mul(c,3*(1-t)*t*t),mul(d,t**3)));}
function mixPose(a,b,t){
 if(t===0)return clone(a);if(t===1)return clone(b);
 return a.map((n,i)=>({
 p:n.p.every((v,j)=>v===b[i].p[j])?n.p.slice():lerp(n.p,b[i].p,t),
 s:n.s.every((v,j)=>v===b[i].s[j])?n.s.slice():lerp(n.s,b[i].s,t),
 q:n.q.every((v,j)=>v===b[i].q[j])?n.q.slice():mul(qs(n.q,b[i].q,t),norm(n.q)+(norm(b[i].q)-norm(n.q))*t),
}));}
function writeOrientation(h,pose,world,i,task){
 const parent=h[i].parent,local=mm(inverse(parent<0?identity():world[parent]),task),d=decompose(local);
 if(d.s.some((v,j)=>Math.abs(v-pose[i].s[j])>1e-5))throw Error('Max Forge: orientation would change native scale');
 pose[i].q=mul(d.q,norm(pose[i].q));
}
function leaned(h,pose,spine,axis,angle){
 const out=clone(pose),world=fk(h,out),d=decompose(world[spine]);
 writeOrientation(h,out,world,spine,compose(d.p,qm(axisQuaternion(axis,angle),d.q),d.s));
 return {pose:out,world:fk(h,out)};
}
/** control point/normal/forward are in placement-root local metres. handContactLocal
 * is a pinned native Hand-local point, not an inferred sole or a mesh contact pass.
 * The expected contact frame uses local -Z palm outward and local +Y fingers.
 * Caller must verify that convention against the actual loaded hand surface. */
export function sampleMaxForgePress({hierarchy,quietStart,quietEnd,control,seconds,fittedLeanRadians}){
 if(!Number.isFinite(seconds))throw Error('Max Forge: invalid phase time');
 if(quietStart.length!==hierarchy.length||quietEnd.length!==hierarchy.length)throw Error('Max Forge: incomplete quiet pose');
 for(const p of [quietStart,quietEnd])for(const n of p){finite(n.p,3);finite(n.q,4);finite(n.s,3);}
 finite(control.point,3);finite(control.normal,3);finite(control.forward,3);finite(control.handContactLocal,3);
 const t=Math.max(FORGE_PRESS.preparationStart,Math.min(FORGE_PRESS.duration,seconds)),settle=interval(t,FORGE_PRESS.preparationStart,FORGE_PRESS.recoverAt);
 const base=mixPose(quietStart,quietEnd,settle),pose=clone(base),names=new Map(hierarchy.map((n,i)=>[n.name,i]));
 if(names.size!==hierarchy.length)throw Error('Max Forge: duplicate node names');
 const ids=FORGE_PRESS_JOINTS.map(n=>{const i=names.get(n);if(i===undefined)throw Error('Max Forge: missing '+n);return i;});
 const [,, ,arm,elbow,hand]=ids;
 if(hierarchy[elbow].parent!==arm||hierarchy[hand].parent!==elbow)throw Error('Max Forge: unexpected arm chain');
 // Lower body is the existing immutable quiet support pose, never the Push lunge.
 for(let i=0;i<hierarchy.length;i++)if(/^(Hips|(?:Left|Right)(?:UpLeg|Leg|Foot|ToeBase))$/.test(hierarchy[i].name)){
  if(['p','q','s'].some(k=>quietStart[i][k].some((v,j)=>v!==quietEnd[i][k][j])))throw Error('Max Forge: quiet support endpoints differ');
 }
 if(t===FORGE_PRESS.preparationStart||t>=FORGE_PRESS.recoverAt)return {pose,applied:false,phase:t===FORGE_PRESS.preparationStart?'ready':'recovered',contactExpected:false};
 const up=unit(control.normal),toward=unit(sub(control.forward,mul(up,dot(control.forward,up))));
 const weight=t<=FORGE_PRESS.raiseEnd?interval(t,FORGE_PRESS.preparationStart,FORGE_PRESS.raiseEnd):t<FORGE_PRESS.clearAt?1:1-interval(t,FORGE_PRESS.clearAt,FORGE_PRESS.recoverAt);
 const baseWorld=fk(hierarchy,base),startWorld=fk(hierarchy,quietStart),endWorld=fk(hierarchy,quietEnd);
 const trunk=ids.slice(0,3).sort((a,b)=>a-b),leanAxis=unit(cross(up,toward));
 const handBase=decompose(baseWorld[hand]),x=unit(cross(toward,up));
 const desired=decompose([...mul(x,handBase.s[0]),0,...mul(toward,handBase.s[1]),0,...mul(up,handBase.s[2]),0,0,0,0,1]);
 // A mixed-weight extremum cannot be predicted by the rigid Hand transform.
 // When measurement supplies a rigid supporting facet, align its actual normal
 // with the control plane. Signed scale is included by inverse-transpose.
 if(control.handContactNormalLocal){
  finite(control.handContactNormalLocal,3);
  const normalScaled=unit(control.handContactNormalLocal.map((v,i)=>v/handBase.s[i]));
  desired.q=unit(qm(desired.q,fromTo(normalScaled,[0,0,-1])));
 }
 const contactOrientation=compose([0,0,0],desired.q,handBase.s);
 // Retained CPU skin crosses the exact plane by up to1.95 micrometres
 // near approach/release after float32 transform encoding. Keep the true
 // control fixed and author0.1mm source clearance, inside its unchanged2mm
 // contact band. Actual full-skin scene checks remain mandatory.
 const surfacePoint=add(control.point,mul(up,.0001));
 const contactWrist=sub(surfacePoint,dir(contactOrientation,control.handContactLocal));
 // This is one bounded endpoint fit, not a sequence of pose variants. Determine
 // a fixed whole-action bend from both quiet endpoints; never stretch the arm.
 function requiredLean(endpoint){
  const canReach=angle=>{const {world:w}=leaned(hierarchy,endpoint,trunk[0],leanAxis,angle);
   const a=position(w[arm]),e=position(w[elbow]),r=position(w[hand]);
   return norm(sub(contactWrist,a))<=norm(sub(e,a))+norm(sub(r,e))-FORGE_PRESS.reachReserveMetres;};
  if(canReach(0))return 0;
  let lo=0,hi=FORGE_PRESS.maximumTorsoLeanRadians;
  if(!canReach(hi))throw Error('Max Forge: actual control unreachable within authored torso bound');
  for(let k=0;k<18;k++){const mid=(lo+hi)/2;if(canReach(mid))hi=mid;else lo=mid;}
  return hi;
 }
 const torsoLean=fittedLeanRadians??Math.max(requiredLean(quietStart),requiredLean(quietEnd));
 if(!Number.isFinite(torsoLean)||torsoLean<0||torsoLean>FORGE_PRESS.maximumTorsoLeanRadians)throw Error('Max Forge: invalid fitted torso lean');
 const trunkPose=leaned(hierarchy,base,trunk[0],leanAxis,torsoLean*weight);
 pose[trunk[0]].q=trunkPose.pose[trunk[0]].q;let world=trunkPose.world;
 // One intentional raise, normal approach, held contact and withdrawal. No button
 // penetration/depression is invented: the visible control surface remains fixed.
 const start=point(startWorld[hand],control.handContactLocal),end=point(endWorld[hand],control.handContactLocal);
 const left=names.get('LeftArm');if(left===undefined)throw Error('Max Forge: missing contralateral shoulder');
 const shoulderLine=sub(position(startWorld[arm]),position(startWorld[left]));
 const routeOut=unit(sub(shoulderLine,mul(up,dot(shoulderLine,up))));
 // The failed direct raise crossed thigh then torso. Both cubic control points
 // now stay outboard before the hand enters the control corridor. Return uses
 // the same spatial corridor in reverse; authored phase boundaries are fixed.
 const outboard=mul(routeOut,FORGE_PRESS.outwardMetres);
 const hover=add(surfacePoint,mul(up,FORGE_PRESS.hoverMetres));let contact,phase;
 if(t<=FORGE_PRESS.raiseEnd){
  contact=curve(start,add(add(start,mul(up,FORGE_PRESS.raiseMetres)),outboard),add(sub(hover,mul(toward,FORGE_PRESS.approachMetres)),outboard),hover,interval(t,FORGE_PRESS.preparationStart,FORGE_PRESS.raiseEnd));phase='raise';
 }else if(t<FORGE_PRESS.touchAt){contact=lerp(hover,surfacePoint,interval(t,FORGE_PRESS.raiseEnd,FORGE_PRESS.touchAt));phase='approach';}
 else if(t<=FORGE_PRESS.releaseAt){contact=surfacePoint.slice();phase='press';}
 else if(t<FORGE_PRESS.clearAt){contact=lerp(surfacePoint,hover,interval(t,FORGE_PRESS.releaseAt,FORGE_PRESS.clearAt));phase='release';}
 else{contact=curve(hover,add(sub(hover,mul(toward,FORGE_PRESS.approachMetres)),outboard),add(add(end,mul(up,FORGE_PRESS.raiseMetres)),outboard),end,interval(t,FORGE_PRESS.clearAt,FORGE_PRESS.recoverAt));phase='recover';}
 const handTask=compose([0,0,0],qs(handBase.q,desired.q,weight),handBase.s);
 const wrist=sub(contact,dir(handTask,control.handContactLocal)),shoulder=position(world[arm]);
 const initialElbow=position(world[elbow]),initialWrist=position(world[hand]);
 const upper=norm(sub(initialElbow,shoulder)),lower=norm(sub(initialWrist,initialElbow)),reach=norm(sub(wrist,shoulder));
 if(reach>upper+lower||reach<Math.abs(upper-lower)||reach<EPS)throw Error(`Max Forge: unreachable wrist at ${t}s: ${reach} outside [${Math.abs(upper-lower)},${upper+lower}]`);
 const outward=unit(sub(position(world[arm]),position(world[left]))),axis=unit(sub(wrist,shoulder));
 const nativePole=sub(initialElbow,shoulder),authoredPole=mul(unit(add(outward,mul(up,-.5))),upper);
 const poleWeight=t<=FORGE_PRESS.raiseEnd?interval(t,FORGE_PRESS.preparationStart,FORGE_PRESS.preparationStart+.65):
  t<FORGE_PRESS.clearAt?1:1-interval(t,FORGE_PRESS.recoverAt-.65,FORGE_PRESS.recoverAt);
 const pole=lerp(nativePole,authoredPole,poleWeight),bend=unit(sub(pole,mul(axis,dot(pole,axis))));
 const along=(upper*upper+reach*reach-lower*lower)/(2*reach),height=Math.sqrt(Math.max(0,upper*upper-along*along));
 const elbowTarget=add(shoulder,add(mul(axis,along),mul(bend,height)));
 function pointJoint(i,child,target){
  const parent=hierarchy[i].parent,inv=inverse(parent<0?identity():world[parent]),origin=position(world[i]);
  const a=dir(inv,sub(position(world[child]),origin)),b=dir(inv,sub(target,origin)),magnitude=norm(pose[i].q);
  pose[i].q=mul(unit(qm(fromTo(a,b),pose[i].q)),magnitude);world=fk(hierarchy,pose);
 }
 pointJoint(arm,elbow,elbowTarget);pointJoint(elbow,hand,wrist);
 handTask.splice(12,3,...wrist);writeOrientation(hierarchy,pose,world,hand,handTask);world=fk(hierarchy,pose);
 const actualContact=point(world[hand],control.handContactLocal),residual=norm(sub(actualContact,contact));
 if(residual>FORGE_PRESS.residualMetres)throw Error('Max Forge: contact-point solve residual '+residual);
 const allowed=new Set(ids);
 for(let i=0;i<pose.length;i++)for(const key of ['p','q','s'])if(key!=='q'||!allowed.has(i)){
  if(pose[i][key].some((v,j)=>v!==base[i][key][j]))throw Error('Max Forge: protected transform changed');
 }
 return {pose,applied:true,phase,contactExpected:phase==='press',contactPoint:actualContact,contactTarget:contact,wristTarget:wrist,elbowTarget,
  reach,reachLimit:upper+lower,reachSlack:upper+lower-reach,contactResidual:residual,torsoLeanRadians:torsoLean*weight,
  support:'unchanged quiet lower-body pose; loaded foot/scene contact and rendered support unverified',
  contact:'pinned palm proxy solved; actual hand mesh/button contact requires affected validation'};
}

/** Prepare once from immutable actual-loader quiet poses and the measured scene
 * control frame. No first-frame world geometry or previous playback is cached.
 * A changed rig, detail, placement or control requires a new preparation. */
export function prepareMaxForgePress({hierarchy,quietStart,quietEnd,control}){
 const inputs={hierarchy:hierarchy.map(n=>({...n})),quietStart:clone(quietStart),quietEnd:clone(quietEnd),
  control:{point:control.point.slice(),normal:control.normal.slice(),forward:control.forward.slice(),handContactLocal:control.handContactLocal.slice(),...(control.handContactNormalLocal?{handContactNormalLocal:control.handContactNormalLocal.slice()}:{})}};
 const fit=sampleMaxForgePress({...inputs,seconds:FORGE_PRESS.touchAt});
 return {fittedLeanRadians:fit.torsoLeanRadians,
  sample(seconds){return sampleMaxForgePress({...inputs,seconds,fittedLeanRadians:fit.torsoLeanRadians});}};
}

/** Fit one actual rigid contact point and support normal against the COMPLETE
 * measured hand/wrist reference surface. Candidate-face eligibility is separate
 * from the volume: every vertex on any triangle with positive Hand influence
 * participates, including low/zero-Hand neighboring corners. This does not
 * broaden the runtime collision exemption. */
export function measureMaxPalmContact(triangles,referenceLocal,referenceMesh){
 finite(referenceLocal,3);
 if(!referenceMesh||referenceMesh.space!=='RightHand-local-native'||referenceMesh.complete!==true)
  throw Error('Max Forge: complete measured reference mesh required');
 const {vertices,triangles:indices,metresPerHandUnit}=referenceMesh;
 if(!Array.isArray(vertices)||!vertices.length||!Array.isArray(indices)||!indices.length||
  !Number.isFinite(metresPerHandUnit)||metresPerHandUnit<=EPS)
  throw Error('Max Forge: invalid reference mesh/scale');
 const weights=vertices.map(v=>{
  finite(v.point,3);
  if(!Array.isArray(v.influences)||!v.influences.length)throw Error('Max Forge: missing full vertex influences');
  let hand=0;
  for(const influence of v.influences){
   if(typeof influence.bone!=='string'||!Number.isFinite(influence.weight)||influence.weight<0)
    throw Error('Max Forge: invalid reference influence');
   if(influence.bone==='RightHand')hand+=influence.weight;
  }
  return hand;
 });
 const selectedIndices=new Set(),forbiddenIndices=new Set();let positiveHandFaces=0;
 for(const tri of indices){
  if(tri.length!==3||tri.some(i=>!Number.isInteger(i)||i<0||i>=vertices.length))throw Error('Max Forge: incomplete reference topology');
  if(!tri.some(i=>weights[i]>0))continue;
  positiveHandFaces++;
  for(const i of tri)selectedIndices.add(i);
  if(tri.some(i=>weights[i]<.95))for(const i of tri)forbiddenIndices.add(i);
 }
 if(!selectedIndices.size)throw Error('Max Forge: reference has no hand/wrist volume');
 const envelope=[...selectedIndices].map(i=>({point:vertices[i].point,forbidden:forbiddenIndices.has(i)}));
 const candidates=[],seen=new Set();
 for(const face of triangles){
  if(face.handWeights.length!==3||face.handWeights.some(w=>w!==1))continue;
  if(face.points.length!==3)throw Error('Max Forge: incomplete rigid contact face');
  face.points.forEach(p=>finite(p,3));
  for(let corner=0;corner<3;corner++){
   const point=face.points[corner],key=JSON.stringify(point);if(seen.has(key))continue;seen.add(key);
   if(![...selectedIndices].some(i=>weights[i]===1&&norm(sub(vertices[i].point,point))<=1e-6))
    throw Error('Max Forge: rigid contact point absent from full reference mesh');
   candidates.push({face,corner,point});
  }
 }
 if(!candidates.length)throw Error('Max Forge: no actual rigid contact point');
 // A45-degree authored contact-normal limit is an additional rejection bound.
 // Minimize tilt from local-Z-down via a two-dimensional convex half-plane fit.
 // The sqrt(2) term conservatively enforces the new2mm reference clearance
 // for forbidden faces throughout the unit slope disk; it is not a gate waiver.
 const forbiddenGapNative=.002/metresPerHandUnit,normalLimitSlope=1;
 function clip(poly,dx,dy,bound){
  const out=[];
  for(let i=0;i<poly.length;i++){
   const a=poly[i],b=poly[(i+1)%poly.length],da=dx*a[0]+dy*a[1]-bound,db=dx*b[0]+dy*b[1]-bound;
   if(da<=1e-10)out.push(a);
   if((da<0&&db>0)||(db<0&&da>0)){const t=da/(da-db);out.push(lerp(a,b,t));}
  }
  return out;
 }
 let best;
 for(const candidate of candidates){
  let polygon=[[-1,-1],[1,-1],[1,1],[-1,1]],originAllowed=true;
  for(const vertex of envelope){
   const [dx,dy,dz]=sub(vertex.point,candidate.point),gap=vertex.forbidden?forbiddenGapNative*Math.SQRT2:0,bound=dz-gap;
   if(bound<0)originAllowed=false;
   polygon=clip(polygon,dx,dy,bound);if(!polygon.length)break;
  }
  if(!polygon.length)continue;
  const choices=originAllowed?[[0,0]]:[];
  for(let i=0;i<polygon.length;i++){
   const a=polygon[i],b=polygon[(i+1)%polygon.length],edge=sub(b,a),ll=dot(edge,edge),t=ll>EPS?clamp(-dot(a,edge)/ll):0;
   choices.push(add(a,mul(edge,t)));
  }
  choices.sort((a,b)=>norm(a)-norm(b));const xy=choices[0],slope=norm(xy);
  if(slope>normalLimitSlope+1e-10)continue;
  const normal=unit([...xy,-1]);let valid=true,minForbiddenGap=Infinity;
  for(const vertex of envelope){
   const distance=dot(normal,sub(vertex.point,candidate.point));
   if(distance>(vertex.forbidden?-forbiddenGapNative:0)+1e-6){valid=false;break;}
   if(vertex.forbidden)minForbiddenGap=Math.min(minForbiddenGap,-distance*metresPerHandUnit);
  }
  if(valid&&(!best||slope<best.slope))best={...candidate,normal,slope,minForbiddenGap};
 }
 if(!best)throw Error('Max Forge: no rigid contact plane clears complete measured wrist within45degrees');
 const barycentric=[0,0,0];barycentric[best.corner]=1;
 return {triangle:best.face.id,barycentric,handWeights:best.face.handWeights.slice(),point:best.point.slice(),
  handContactNormalLocal:best.normal.slice(),method:'rigid surface contact; complete mixed-wrist support-plane fit',candidateFaces:triangles.length,
  clearanceFit:{referenceMeshVertices:vertices.length,handWristVertices:selectedIndices.size,forbiddenVertices:forbiddenIndices.size,positiveHandFaces,
   normalTiltDegrees:Math.atan(best.slope)*180/Math.PI,maximumNormalTiltDegrees:45,requiredForbiddenGapMetres:.002,
   minimumMeasuredForbiddenGapMetres:Number.isFinite(best.minForbiddenGap)?best.minForbiddenGap:null},
  limits:'Reference geometry only; actual weighted hand/wrist, all mixed-body/scene, unchanged2mm contact and moving review must still pass.'};
}

/** Bridge into the real sampler's reusable Quaternion/Vector3 output arrays.
 * Engine invokes this only for the explicit Max_Forge_Control_Press procedure,
 * after setting the actual placement root. Banks and other actors are untouched. */
export function createMaxForgePressAdapter(channels,placementRoot){
 const nodes=[],index=new Map();
 function include(node){
  if(node===placementRoot)return -1;if(!node)throw Error('Max Forge: node outside placement root');
  if(index.has(node))return index.get(node);const parent=include(node.parent),i=nodes.length;
  nodes.push({node,parent});index.set(node,i);return i;
 }
 for(const c of channels)include(c.target);
 const hierarchy=nodes.map(({node,parent})=>({name:node.name,parent}));
 const rest=nodes.map(({node})=>{
  if(!node.rotationQuaternion&&norm(node.rotation.asArray())>EPS)throw Error('Max Forge: explicit quaternion required');
  return {p:node.position.asArray(),q:node.rotationQuaternion?.asArray()??[0,0,0,1],s:node.scaling.asArray()};
 });
 function pose(values){const out=clone(rest);channels.forEach((c,i)=>{
  const n=out[index.get(c.target)],v=values[i].asArray();
  if(c.path==='position')n.p=v;else if(c.path==='rotationQuaternion')n.q=v;else if(c.path==='scaling')n.s=v;
  else throw Error('Max Forge: unsupported channel '+c.path);
 });return out;}
 let key='',prepared;
 return {sample(quietStartValues,quietEndValues,seconds,controlWorld,result){
  if(result.length!==channels.length)throw Error('Max Forge: incomplete sampler output');
  placementRoot.computeWorldMatrix(true);const matrix=Array.from(placementRoot.getWorldMatrix().asArray());
  const inv=inverse(matrix),start=pose(quietStartValues),end=pose(quietEndValues);
  const control={point:point(inv,controlWorld.point),normal:unit(dir(inv,controlWorld.normal)),
   forward:unit(dir(inv,controlWorld.forward)),handContactLocal:controlWorld.handContactLocal.slice(),
   ...(controlWorld.handContactNormalLocal?{handContactNormalLocal:controlWorld.handContactNormalLocal.slice()}:{})};
  const signature=JSON.stringify({matrix,control,start,end});
  if(signature!==key){const next=prepareMaxForgePress({hierarchy,quietStart:start,quietEnd:end,control});prepared=next;key=signature;}
  const solved=prepared.sample(seconds);
  const values=channels.map(c=>{const n=solved.pose[index.get(c.target)];return c.path==='rotationQuaternion'?n.q:c.path==='position'?n.p:n.s;});
  for(let i=0;i<values.length;i++)result[i].copyFromFloats(...values[i]);
  return {...solved,placementWorld:matrix,controlFrame:control};
 }};
}

