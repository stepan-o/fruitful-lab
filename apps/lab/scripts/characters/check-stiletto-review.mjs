/** Clearance evidence applies only to these exact published bytes and arm curves. */
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {validateBytes} from 'gltf-validator';
const read=async p=>JSON.parse(await readFile(new URL(p,import.meta.url),'utf8'));
const data=await read('../../lib/loopforge/agents/stiletto-review.json');
const pack=await read('../../lib/assets/generated/loopforge-stiletto-review.json');
const asset=pack.assets.stiletto.variants[0];
const bytes=await readFile(new URL('../../public'+asset.src,import.meta.url));
assert.equal(createHash('sha256').update(bytes).digest('hex'),data.sha256);
assert.equal(data.sha256,'ad84c17431f6eea244b9a15f46296f0da63d7ae9726e2f7d2622f9d522b6f97b');
assert.equal(bytes.length,11661248);assert.equal(asset.bytes,bytes.length);
const validation=await validateBytes(bytes,{maxIssues:100});assert.equal(validation.issues.numErrors,0);
assert.ok(validation.issues.messages.every(m=>m.code==='NODE_SKINNED_MESH_NON_ROOT'),'Unexpected validation warning');
const io=new NodeIO(),json=(await io.binaryToJSON(bytes)).json;
assert.ok(json.buffers.every(b=>!b.uri));assert.ok(json.images.every(i=>!i.uri&&i.bufferView!==undefined));
const root=(await io.readBinary(bytes)).getRoot();
assert.equal(root.listSkins().length,1);assert.equal(root.listSkins()[0].listJoints().length,24);
assert.equal(root.listAnimations().length,23);assert.equal(data.clips.length,18);
for(const side of ['Left','Right']){const blade=root.listNodes().find(n=>n.getName()===side+'Blade');assert.ok(blade);assert.equal(blade.getParentNode().getName(),side+'ForeArm');}
const full=await read('../../public'+pack.assets['clearance-audit'].variants[0].src);
assert.equal(full.sha256,data.sha256);assert.equal(full.sampleRateHz,120);assert.equal(full.correctedPoseCount,2335);
assert.equal(full.clips.reduce((sum,c)=>sum+c.corrected.frames,0),2335);
for(const c of data.clips){
 const original=root.listAnimations().find(a=>a.getName()===c.id);assert.ok(original,c.id);
 let duration=0;for(const s of original.listSamplers()){assert.ok(s.getInput().getArray().every(Number.isFinite));assert.ok(s.getOutput().getArray().every(Number.isFinite));duration=Math.max(duration,s.getInput().getArray().at(-1));}
 assert.ok(Math.abs(duration-c.duration)<.002,c.id+' duration');
 if(!c.corrected)continue;
 const proof=full.clips.find(x=>x.clip===c.id),{samples,...result}=proof.corrected;
 assert.equal(samples.length,0);assert.deepEqual(c.corrected.result,result);
 for(const k of ['bodyContactFrames','floorContactFrames','bladeContactFrames'])assert.equal(result[k],0);
 const corrected=root.listAnimations().find(a=>a.getName()===c.id+'__corrected');assert.ok(corrected);
 for(const channel of corrected.listChannels()){
  if(channel.getTargetPath()==='rotation'&&['LeftArm','RightArm','LeftForeArm','RightForeArm'].includes(channel.getTargetNode().getName()))continue;
  const src=original.listChannels().find(o=>o.getTargetNode()===channel.getTargetNode()&&o.getTargetPath()===channel.getTargetPath());assert.ok(src);
  assert.deepEqual(channel.getSampler().getInput().getArray(),src.getSampler().getInput().getArray());
  assert.deepEqual(channel.getSampler().getOutput().getArray(),src.getSampler().getOutput().getArray());
 }
}
console.log('STILETTO review: exact audited GLB, 18 originals + 5 corrected candidates, rigid forearm mounts, non-arm tracks preserved, 2,335 recorded corrected poses.');
