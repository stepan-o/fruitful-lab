/** Ship-time contract for the vendor rig; independent of the 17-joint authored worker rig. */
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import sharp from 'sharp';
import {validateBytes} from 'gltf-validator';
const pack=JSON.parse(await readFile(new URL('../../lib/assets/generated/loopforge-limen.json',import.meta.url),'utf8'));
const file=pack.assets.limen.variants[0],bytes=new Uint8Array(await readFile(new URL('../../public'+file.src,import.meta.url)));
assert.ok(bytes.length<5000000);
const report=await validateBytes(bytes,{maxIssues:20});assert.equal(report.issues.numErrors,0);
assert.ok(report.issues.messages.every(m=>m.code==='NODE_SKINNED_MESH_NON_ROOT'),'Review any new validator warning');
const io=new NodeIO(),json=(await io.binaryToJSON(bytes)).json;
assert.ok(json.buffers.every(b=>!b.uri)&&json.images.every(i=>i.bufferView!==undefined&&!i.uri));
const doc=await io.readBinary(bytes),root=doc.getRoot();
assert.equal(root.listSkins().length,1);const joints=root.listSkins()[0].listJoints();assert.equal(joints.length,23);
for(const n of ['Hips','Head','LeftHand','RightHand','LeftFoot','RightFoot'])assert.ok(joints.some(j=>j.getName()==='mixamorig:'+n));
assert.deepEqual(root.listAnimations().map(a=>a.getName()).sort(),['Rest','Running','Walking']);
for(const a of root.listAccessors())assert.ok(a.getArray().every(Number.isFinite),'Non-finite model data');
let triangles=0;
for(const m of root.listMeshes())for(const p of m.listPrimitives()){
 triangles+=p.getIndices().getCount()/3;
 for(const s of ['POSITION','NORMAL','TEXCOORD_0','JOINTS_0','WEIGHTS_0'])assert.ok(p.getAttribute(s));
 const weights=p.getAttribute('WEIGHTS_0').getArray(),ids=p.getAttribute('JOINTS_0').getArray();
 for(let i=0;i<weights.length;i+=4)assert.ok(Math.abs(weights[i]+weights[i+1]+weights[i+2]+weights[i+3]-1)<.0001);
 assert.ok(ids.every(i=>i>=0&&i<23));
}
assert.equal(triangles,42354);assert.equal(root.listMaterials().length,1);
assert.equal(root.listMaterials()[0].getEmissiveTexture(),null);
assert.equal(root.listTextures().length,1);const texture=await sharp(root.listTextures()[0].getImage()).metadata();assert.equal(texture.width,2048);assert.equal(texture.height,2048);
console.log(`Meshy LIMEN: ${triangles} triangles, 23 joints, Rest/Walking/Running, ${(bytes.length/1048576).toFixed(2)} MiB; embedded, finite, normalized.`);
const housing=pack.assets['blade-housing'].variants[0],housingBytes=new Uint8Array(await readFile(new URL('../../public'+housing.src,import.meta.url)));
assert.ok(housingBytes.length<1200000);
const housingReport=await validateBytes(housingBytes,{maxIssues:20});assert.equal(housingReport.issues.numErrors,0);assert.equal(housingReport.issues.numWarnings,0);
const housingDoc=await io.readBinary(housingBytes),housingRoot=housingDoc.getRoot();
assert.equal(housingRoot.listSkins().length,0);assert.equal(housingRoot.listAnimations().length,0);assert.equal(housingRoot.listMeshes().length,1);
const primitive=housingRoot.listMeshes()[0].listPrimitives()[0];assert.ok(primitive.getIndices().getCount()/3<=5000);assert.ok(primitive.getAttribute('TANGENT'));
for(const a of housingRoot.listAccessors())assert.ok(a.getArray().every(Number.isFinite));
assert.equal(housingRoot.listTextures().length,3);
for(const t of housingRoot.listTextures()){const meta=await sharp(t.getImage()).metadata();assert.ok(meta.width<=1024&&meta.height<=1024);}
assert.ok(primitive.getAttribute('POSITION').getMax([])[1]<.4,'Housing +Y is local metres, not source scene units');
console.log(`LIMEN housing: ${primitive.getIndices().getCount()/3} triangles, retained material maps, generated tangents, ${(housingBytes.length/1048576).toFixed(2)} MiB.`);

await import('./check-limen-clearance.mjs');
