/** Fail delivery when review labels, skin or the motion bank no longer agree. */
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {validateBytes} from 'gltf-validator';
const data=JSON.parse(await readFile(new URL('../../lib/loopforge/agents/worker-review.json',import.meta.url),'utf8'));
const pack=JSON.parse(await readFile(new URL('../../lib/assets/generated/loopforge-worker-review.json',import.meta.url),'utf8'));
const file=pack.assets['worker-01'].variants[0],bytes=new Uint8Array(await readFile(new URL('../../public'+file.src,import.meta.url)));
assert.equal(bytes.length,file.bytes);assert.ok(bytes.length<8000000);
const validation=await validateBytes(bytes,{maxIssues:100});assert.equal(validation.issues.numErrors,0,JSON.stringify(validation.issues));
assert.ok(validation.issues.messages.every(m=>m.code==='NODE_SKINNED_MESH_NON_ROOT'),'Unexpected validator warning');
const io=new NodeIO(),json=(await io.binaryToJSON(bytes)).json;
assert.ok(json.buffers.every(b=>!b.uri));assert.ok(json.images.every(i=>i.bufferView!==undefined&&!i.uri));
const doc=await io.readBinary(bytes),root=doc.getRoot();
assert.equal(root.listSkins().length,1);assert.equal(root.listSkins()[0].listJoints().length,24);
assert.equal(root.listAnimations().length,19);assert.equal(data.clips.length,19);
assert.deepEqual(root.listAnimations().map(a=>a.getName()).sort(),data.clips.map(c=>c.id).sort());
assert.equal(data.clips.find(c=>c.id==='Hot_Walk').actor,'Cathexis');assert.equal(data.clips.find(c=>c.id==='Hot_Walk').label,'Hot Walk');
assert.deepEqual(data.missing,['afraid_recoil','work_cradle']);
let triangles=0;
for(const mesh of root.listMeshes())for(const p of mesh.listPrimitives()){
 triangles+=p.getIndices().getCount()/3;
 const count=p.getAttribute('POSITION').getCount();
 for(const key of ['POSITION','NORMAL','TEXCOORD_0','JOINTS_0','WEIGHTS_0','JOINTS_1','WEIGHTS_1'])assert.ok(p.getAttribute(key).getArray().every(Number.isFinite),key);
 const a=p.getAttribute('WEIGHTS_0').getArray(),b=p.getAttribute('WEIGHTS_1').getArray();
 for(let i=0;i<count;i++)assert.ok(Math.abs(a.slice(i*4,i*4+4).reduce((x,y)=>x+y,0)+b.slice(i*4,i*4+4).reduce((x,y)=>x+y,0)-1)<1e-4,'skin weight sum');
}
assert.equal(triangles,25893);
for(const a of root.listAnimations()){
 const clip=data.clips.find(c=>c.id===a.getName());let duration=0;
 for(const s of a.listSamplers()){
  const t=s.getInput().getArray();assert.ok(t.every(Number.isFinite));assert.ok(s.getOutput().getArray().every(Number.isFinite));assert.ok(t.every((x,i)=>i===0||x>t[i-1]));duration=Math.max(duration,t.at(-1));
 }
 assert.ok(Math.abs(duration-clip.duration)<.002,a.getName()+' duration');
 assert.ok(clip.markers.every(m=>m.time>=0&&m.time<=duration+.002));
}
console.log('Worker review: 19 named motions, 24 skin joints, 25,893 triangles, embedded maps, finite/normalized data and bounded review markers.');

// Cleanup revision: source geometry, skin and all source samples stay intact.
const repairedFile=pack.assets['worker-01-corrected'].variants[0];
const repairedBytes=new Uint8Array(await readFile(new URL('../../public'+repairedFile.src,import.meta.url)));
const {createHash}=await import('node:crypto');
assert.equal(repairedBytes.length,repairedFile.bytes);assert.ok(repairedBytes.length<12000000);
assert.equal(createHash('sha256').update(repairedBytes).digest('hex'),repairedFile.sha256);
const repairedValidation=await validateBytes(repairedBytes,{maxIssues:100});assert.equal(repairedValidation.issues.numErrors,0,JSON.stringify(repairedValidation.issues));
const fixedDoc=await io.readBinary(repairedBytes),fixed=fixedDoc.getRoot();
assert.deepEqual(fixed.listSkins().map(s=>s.listJoints().length).sort((a,b)=>a-b),[24,34]);
assert.equal(fixed.listAnimations().length,41);
const sourceSkin=fixed.listSkins().find(s=>s.listJoints().length===24),correctedSkin=fixed.listSkins().find(s=>s.listJoints().length===34);
assert.deepEqual(sourceSkin.getInverseBindMatrices().getArray(),root.listSkins()[0].getInverseBindMatrices().getArray());
assert.deepEqual(sourceSkin.listJoints().map(n=>n.getName()),root.listSkins()[0].listJoints().map(n=>n.getName()));
assert.deepEqual(correctedSkin.listJoints().slice(0,24).map(n=>n.getName()),sourceSkin.listJoints().map(n=>n.getName()));
for(const skin of fixed.listSkins())for(const joint of skin.listJoints())assert.ok(joint.getName());
const srcNode=fixed.listNodes().find(n=>n.getSkin()===sourceSkin),newNode=fixed.listNodes().find(n=>n.getName()==='WorkerCorrected');
assert.equal(newNode.getSkin(),correctedSkin);
for(const key of ['POSITION','NORMAL','TEXCOORD_0','JOINTS_0','JOINTS_1','WEIGHTS_0','WEIGHTS_1'])assert.deepEqual(srcNode.getMesh().listPrimitives()[0].getAttribute(key).getArray(),root.listMeshes()[0].listPrimitives()[0].getAttribute(key).getArray(),`Source ${key} changed`);
assert.deepEqual(srcNode.getMesh().listPrimitives()[0].getIndices().getArray(),newNode.getMesh().listPrimitives()[0].getIndices().getArray());
for(const a of root.listAnimations()){
 const exact=fixed.listAnimations().find(x=>x.getName()===a.getName());assert.ok(exact);
 for(const channel of a.listChannels()){
  const x=exact.listChannels().find(c=>c.getTargetNode().getName()===channel.getTargetNode().getName()&&c.getTargetPath()===channel.getTargetPath());assert.ok(x);
  assert.deepEqual(x.getSampler().getInput().getArray(),channel.getSampler().getInput().getArray(),'Source timing changed');assert.deepEqual(x.getSampler().getOutput().getArray(),channel.getSampler().getOutput().getArray(),'Source motion changed');
 }
 const corrected=fixed.listAnimations().find(x=>x.getName()===a.getName()+'_Corrected');assert.ok(corrected);
 for(const f of correctedSkin.listJoints().slice(24))assert.ok(corrected.listChannels().some(c=>c.getTargetNode()===f&&c.getTargetPath()==='rotation'),'Every clip must reset finger posture');
}
for(const a of fixed.listAnimations())for(const s of a.listSamplers()){assert.ok(s.getInput().getArray().every(Number.isFinite));assert.ok(s.getOutput().getArray().every(Number.isFinite));}
const p=newNode.getMesh().listPrimitives()[0],j0=p.getAttribute('JOINTS_0').getArray(),j1=p.getAttribute('JOINTS_1').getArray(),w0=p.getAttribute('WEIGHTS_0').getArray(),w1=p.getAttribute('WEIGHTS_1').getArray(),weighted=new Set();
for(let i=0;i<j0.length;i++){assert.ok(j0[i]<34&&j1[i]<34);if(w0[i]>0)weighted.add(j0[i]);if(w1[i]>0)weighted.add(j1[i]);}
for(let i=24;i<34;i++)assert.ok(weighted.has(i),'Unused finger joint');
for(let i=0;i<w0.length;i+=4)assert.ok(Math.abs([...w0.slice(i,i+4),...w1.slice(i,i+4)].reduce((a,b)=>a+b,0)-1)<1e-4);
const audit=JSON.parse(await readFile(new URL('../../lib/loopforge/agents/worker-cleanup.json',import.meta.url),'utf8'));
assert.equal(audit.sha256,repairedFile.sha256,'Clearance audit does not belong to this asset');assert.equal(audit.sampleRate,120);assert.equal(audit.clips.length,19);
assert.ok(audit.clips.every(c=>c.samples>0&&c.correctedContactFrames===0),'Unresolved exported-mesh contacts');
console.log('Worker cleanup: exact source preservation, 19 corrected clips, 10 weighted finger hinges, 3 hand studies, 120 Hz clearance report pinned to this GLB.');
