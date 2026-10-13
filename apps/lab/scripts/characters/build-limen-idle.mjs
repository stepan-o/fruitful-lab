/** Offline two-bone posing. The browser only interpolates the baked rotations. */
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {Matrix,Quaternion,Vector3} from '@babylonjs/core/Maths/math.vector.js';
const pack=JSON.parse(await readFile(new URL('../../lib/assets/generated/loopforge-limen.json',import.meta.url),'utf8'));
assert.equal(pack.assets.limen.variants[0].sha256,'fcb4b356b7905de1bbd52a3f18e72d3de2cecbdef6b4c8cc009c578d2fbda0ee','Re-author idle against the new source body before baking');
const doc=await new NodeIO().read(new URL('../../public'+pack.assets.limen.variants[0].src,import.meta.url).pathname);
const nodes=doc.getRoot().listNodes(),joints=doc.getRoot().listSkins()[0].listJoints();
const rest=nodes.map(n=>({n,t:n.getTranslation(),r:n.getRotation(),s:n.getScale()}));
const calibration=JSON.parse(await readFile(new URL('../../components/loopforge/agents/limen-blade-calibration.json',import.meta.url),'utf8'));
const node=name=>nodes.find(n=>n.getName()==='mixamorig:'+name),v=a=>Vector3.FromArray(a);
const pos=n=>v(n.getWorldMatrix().slice(12,15));
const worldQ=n=>Quaternion.FromRotationMatrix(Matrix.FromArray(n.getWorldMatrix()).getRotationMatrix()).normalize();
function aim(n,child,target){
 const from=pos(child).subtract(pos(n)).normalize(),to=target.subtract(pos(n)).normalize(),delta=Quaternion.Identity();Quaternion.FromUnitVectorsToRef(from,to,delta);
 const q=worldQ(n),parent=n.getParentNode(),pq=parent?worldQ(parent):Quaternion.Identity();
 n.setRotation(pq.conjugate().multiply(delta.multiply(q)).normalize().asArray());
}
function arm(side,target,pole){
 const upper=node(side+'Arm'),lower=node(side+'ForeArm'),hand=node(side+'Hand'),s=pos(upper),a=Vector3.Distance(s,pos(lower)),b=Vector3.Distance(pos(lower),pos(hand)),d=target.subtract(s),distance=Math.min(a+b-.004,Math.max(Math.abs(a-b)+.004,d.length())),axis=d.normalize();
 const actual=s.add(axis.scale(distance)),along=(a*a-b*b+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,a*a-along*along));
 const perpendicular=pole.subtract(s);perpendicular.subtractInPlace(axis.scale(Vector3.Dot(perpendicular,axis))).normalize();
 const elbow=s.add(axis.scale(along)).add(perpendicular.scale(height));aim(upper,lower,elbow);aim(lower,hand,actual);
 return hand;
}
function handAim(n,direction){const matrix=Matrix.FromArray(n.getWorldMatrix()),from=Vector3.TransformNormal(new Vector3(0,1,0),matrix).normalize(),delta=Quaternion.Identity();Quaternion.FromUnitVectorsToRef(from,direction.normalize(),delta);n.setRotation(worldQ(n.getParentNode()).conjugate().multiply(delta.multiply(worldQ(n))).normalize().asArray());}
const smooth=(a,b,t)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x);};
const mix=(a,b,t)=>Vector3.Lerp(v(a),v(b),t);
const targetNames=['Spine2','Neck','Head','RightArm','RightForeArm','RightHand','LeftArm','LeftForeArm','LeftHand'];
const duration=11,fps=30,frames=[];let maxContactError=0;
for(let frame=0;frame<=duration*fps;frame++){
 const t=frame/fps;for(const {n,t,r,s} of rest)n.setTranslation(t).setRotation(r).setScale(s);
 const lift=smooth(1.1,2.9,t)*(1-smooth(8.4,10.5,t)),reach=smooth(3.2,4.3,t)*(1-smooth(6.4,7.4,t));
 const rHand=arm('Right',mix([-.34,1.015,.075],[-.075,1.29,.30],lift),v([-.7,1.08,-.03]));
 // Neutral wrist follows the forearm; preserve the authored blade socket.
 rHand.setRotation(rest.find(x=>x.n===rHand).r);
 const fore=node('RightForeArm'),fm=Matrix.FromArray(fore.getWorldMatrix()),socket=v(calibration.socketPositionCm);
 const contact=Vector3.TransformCoordinates(socket.add(new Vector3(0,13,5)),fm);
 const press=.018*(Math.exp(-(((t-4.75)/.15)**2))+Math.exp(-(((t-5.5)/.16)**2)));
 const wrist=contact.add(new Vector3(.12,.035-press,.03));
 const left=arm('Left',Vector3.Lerp(v([.32,1.015,.075]),wrist,reach),v([.72,1.02,.10]));
 if(reach>0){const before=left.getRotation();handAim(left,contact.subtract(pos(left)));left.setRotation(Quaternion.Slerp(Quaternion.FromArray(before),Quaternion.FromArray(left.getRotation()),reach).asArray());}
 if(reach>.999)maxContactError=Math.max(maxContactError,Vector3.Distance(pos(left),wrist));
 const head=node('Head'),front=nodes.find(n=>n.getName()==='headfront'),base=head.getRotation(),look=Vector3.TransformCoordinates(socket.add(new Vector3(0,43,0)),fm);
 aim(head,front,look);head.setRotation(Quaternion.Slerp(Quaternion.FromArray(base),Quaternion.FromArray(head.getRotation()),lift*.82).asArray());
 frames.push(targetNames.flatMap(name=>node(name).getRotation().map(x=>Number(x.toFixed(6)))));
}
assert.ok(maxContactError<.025,`left wrist exceeds contact reach: ${maxContactError}`);
assert.deepEqual(frames[0],frames.at(-1),'idle must loop');
for(const frame of frames){assert.ok(frame.every(Number.isFinite));for(let i=0;i<frame.length;i+=4)assert.ok(Math.abs(Math.hypot(...frame.slice(i,i+4))-1)<.00001,'normalized quaternion');}
const result={schema:'loopforge-authored-clip/1',id:'limen-emitter-check/1',sourceBodySha256:pack.assets.limen.variants[0].sha256,duration,fps,joints:targetNames.map(x=>'mixamorig:'+x),base:joints.map(n=>({name:n.getName(),translation:rest.find(x=>x.n===n).t,rotation:rest.find(x=>x.n===n).r})),frames};
const out=new URL('../../components/loopforge/agents/generated/limen-idle.json',import.meta.url),text=JSON.stringify(result)+'\n';
if(process.argv.includes('--check'))assert.equal(await readFile(out,'utf8'),text,'Regenerate LIMEN idle');else await writeFile(out,text);
console.log(`LIMEN idle: ${frames.length} baked poses; wrist target error ${(maxContactError*100).toFixed(2)} cm; ${text.length} bytes`);
