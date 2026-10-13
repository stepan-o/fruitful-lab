/** Validate the shipped rig contract, not only glTF syntax. */
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {validateBytes} from 'gltf-validator';
const pack=JSON.parse(await readFile(new URL('../../lib/assets/generated/loopforge-agents.json',import.meta.url),'utf8'));
const file=async id=>new Uint8Array(await readFile(new URL('../../public'+pack.assets[id].variants[0].src,import.meta.url)));
const io=new NodeIO();let baseJoints;
for(const [id,asset] of Object.entries(pack.assets)){
 if(asset.kind!=='model')continue;
 const bytes=await file(id),validation=await validateBytes(bytes,{uri:id+'.glb',maxIssues:10});assert.equal(validation.issues.numErrors,0,id+' glTF validation');
 const json=await io.binaryToJSON(bytes);assert.ok(json.json.buffers.every(b=>!b.uri),'embedded buffers');assert.ok(json.json.images.every(i=>i.bufferView!==undefined&&!i.uri),'embedded textures');
 const doc=await io.readBinary(bytes),root=doc.getRoot(),rig=JSON.parse(new TextDecoder().decode(await file(id+'-rig'))),skin=root.listSkins()[0],joints=skin.listJoints().map(j=>j.getName());
 assert.deepEqual(joints,rig.bones,id+' bake joint order');assert.equal(joints.length,17);assert.equal(root.listMaterials().length,2);assert.deepEqual(root.listAnimations().map(a=>a.getName()).sort(),[...rig.clips].sort());
 if(id.startsWith('worker')){if(!baseJoints)baseJoints=joints;else assert.deepEqual(joints,baseJoints,'shared crowd rig');}
 for(const mesh of root.listMeshes())for(const p of mesh.listPrimitives()){
  for(const key of ['POSITION','NORMAL','JOINTS_0','WEIGHTS_0'])assert.ok(p.getAttribute(key),id+' '+key);
  if(p.getMaterial().getBaseColorTexture())assert.ok(p.getAttribute('TEXCOORD_0'),id+' textured surface UVs');
  for(const key of p.listSemantics()){const values=p.getAttribute(key).getArray();assert.ok(values.every(Number.isFinite),id+' finite '+key);}
  const weights=p.getAttribute('WEIGHTS_0').getArray();for(let i=0;i<weights.length;i+=4)assert.ok(Math.abs(weights[i]+weights[i+1]+weights[i+2]+weights[i+3]-1)<.0001,id+' normalized weights');
 }
 for(const a of root.listAnimations())for(const s of a.listSamplers()){assert.ok(s.getInput().getArray().every(Number.isFinite));assert.ok(s.getOutput().getArray().every(Number.isFinite));}
 assert.ok(rig.height>1.8&&rig.height<2.3,id+' human-scale bounds');
 console.log(id+': valid, 17 joints, 7 clips, embedded maps');
}
const baked=JSON.parse(new TextDecoder().decode(await file('worker-baked')));assert.equal(baked.width,72);assert.equal(baked.height,180);const raw=Buffer.from(baked.vertexData,'base64');assert.equal(raw.byteLength,207360);assert.ok(new Float32Array(raw.buffer,raw.byteOffset,raw.byteLength/4).every(Number.isFinite));
console.log('Shared animation texture: 203 KiB decoded, finite matrices.');
await import('./check-limen.mjs');

await import("./check-worker-review.mjs");
