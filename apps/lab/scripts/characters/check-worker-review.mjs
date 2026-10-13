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
