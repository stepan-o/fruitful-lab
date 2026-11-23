import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {MeshoptDecoder} from 'meshoptimizer';
import {validateBytes} from 'gltf-validator';
import {digest} from '../assets.mjs';
await MeshoptDecoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const pack=JSON.parse(await readFile(new URL('../../lib/assets/generated/loopforge-limen-motions.json',import.meta.url),'utf8'));
const expected=['Checkpoint_Strike','Right_Hand_Sword_Slash','Agree_Gesture','Alert','All_Night_Dance','Angry_Ground_Stomp','Arise','Axe_Breathe_and_Look_Around','Axe_Spin_Attack','Boxing_Warmup','Confident_Strut','Confused_Scratch','Idle_02','Idle_11','Injured_Walk','Shouting_Angrily','Shrug','Stand_and_Chat','Step_Back','air_squat'].sort();
for(const [id,count,max]of [['motions',31213,5000000],['motions-floor',17991,3000000],['motions-overview',7995,1800000]]){
 const file=pack.assets[id].variants[0],bytes=await readFile(new URL('../../public'+file.src,import.meta.url));
 assert.equal(digest(bytes),file.sha256);assert.equal(bytes.length,file.bytes);assert.ok(bytes.length<max);
 const validation=await validateBytes(bytes,{maxIssues:100});assert.equal(validation.issues.numErrors,0);
 assert.ok(validation.issues.messages.filter(i=>i.severity===1).every(i=>i.code==='NODE_SKINNED_MESH_NON_ROOT'));
 const doc=await io.readBinary(bytes),root=doc.getRoot();
 assert.equal(root.listSkins().length,1);assert.equal(root.listSkins()[0].listJoints().length,24);
 assert.deepEqual(root.listAnimations().map(a=>a.getName()).sort(),expected);
 assert.equal(root.listMeshes().length,1);const p=root.listMeshes()[0].listPrimitives()[0];assert.equal(p.getIndices().getCount()/3,count);
 for(const s of ['POSITION','NORMAL','TEXCOORD_0','JOINTS_0','WEIGHTS_0'])assert.ok(p.getAttribute(s),s);
 const weights=p.getAttribute('WEIGHTS_0').getArray();for(let i=0;i<weights.length;i+=4)assert.ok(Math.abs(weights.slice(i,i+4).reduce((a,b)=>a+b,0)-1)<.00001);
 for(const a of root.listAccessors())assert.ok(a.getArray().every(Number.isFinite));
 assert.ok(root.listSkins()[0].listJoints().some(j=>j.getName()==='RightForeArm'));
 assert.equal(root.listTextures().length,3);assert.ok(p.getMaterial().getNormalTexture());assert.ok(p.getMaterial().getMetallicRoughnessTexture());
 console.log(`LIMEN ${id}: 20 clips, ${count} triangles, 24 joints, ${(bytes.length/1048576).toFixed(2)} MiB, verified embedded PBR.`);
}
