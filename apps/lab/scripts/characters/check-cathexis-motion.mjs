/** Guard the delivered motion contract and the exact bytes behind clearance evidence. */
import {readFile} from 'node:fs/promises';import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';import {validateBytes} from 'gltf-validator';import {digest} from '../assets.mjs';
import {NullEngine} from '@babylonjs/core/Engines/nullEngine.js';import {Scene} from '@babylonjs/core/scene.js';import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader.js';import '@babylonjs/loaders/glTF/index.js';
const manifest=JSON.parse(await readFile(new URL('../../lib/assets/generated/loopforge-cathexis-motion.json',import.meta.url),'utf8'));
const file=manifest.assets['cathexis-motion'].variants[0],bytes=new Uint8Array(await readFile(new URL('../../public'+file.src,import.meta.url)));
const audit=JSON.parse(await readFile(new URL('../../lib/loopforge/agents/cathexis-motion-audit.json',import.meta.url),'utf8'));
assert.equal(digest(bytes),file.sha256);assert.equal(bytes.length,file.bytes);assert.equal(audit.runtimeSHA256,file.sha256);
const validation=await validateBytes(bytes,{maxIssues:100});assert.equal(validation.issues.numErrors,0);
const root=(await new NodeIO().readBinary(bytes)).getRoot(),meshes=root.listMeshes();assert.equal(meshes.length,2);assert.deepEqual(root.listSkins().map(s=>s.listJoints().length),[23,29]);
assert.deepEqual(root.listAnimations().map(a=>a.getName()),['Hot_Walk_Source','Hot_Walk_Corrected','Happy_Sway_Source','Happy_Sway_Corrected']);
const p=meshes.map(m=>m.listPrimitives()[0]);assert.equal(p[0].getIndices().getCount()/3,51031);assert.equal(p[0].getIndices(),p[1].getIndices());
for(const name of ['POSITION','NORMAL','TEXCOORD_0'])assert.equal(p[0].getAttribute(name),p[1].getAttribute(name),'shared unchanged '+name);
for(const primitive of p){for(const key of primitive.listSemantics())assert.ok(primitive.getAttribute(key).getArray().every(Number.isFinite));const ws=primitive.getAttribute('WEIGHTS_0').getArray();for(let i=0;i<ws.length;i+=4)assert.ok(Math.abs(ws[i]+ws[i+1]+ws[i+2]+ws[i+3]-1)<1e-5);}
for(const animation of root.listAnimations())for(const sampler of animation.listSamplers()){
 const values=sampler.getOutput().getArray();assert.ok(values.every(Number.isFinite));
 if(animation.getName().endsWith('Corrected')){const n=sampler.getOutput().getElementSize();for(let k=0;k<n;k++)assert.ok(Math.abs(values[k]-values[values.length-n+k])<1e-6,'closed endpoint');}
}
const corrected=audit.clips.filter(c=>c.clip.endsWith('Corrected'));assert.equal(corrected.reduce((n,c)=>n+c.samples,0),1907);
for(const c of corrected){assert.equal(c.costumeLegContactFrames,0);assert.equal(c.endpointMaxM,0);assert.ok(c.footMinM>=0&&c.footMaxM<.004);}
assert.equal(audit.handContacts.hipSamples,701);assert.equal(audit.handContacts.templeSamples,318);
assert.ok(audit.handContacts.hipPalmErrorMaxM<.001);assert.ok(audit.handContacts.templePalmErrorMaxM<.001);
// Babylon inserts a non-indexed ancestor for the two-branch skirt skeleton.
const engine=new NullEngine(),scene=new Scene(engine);try{const c=await LoadAssetContainerAsync(bytes,scene,{pluginExtension:'.glb'});assert.deepEqual(c.meshes.filter(m=>m.getTotalVertices()>0).map(m=>[m.name,m.skeleton.bones.filter(b=>b.getIndex()>=0).length]),[['Source_Body',23],['Corrected_Body',29]]);c.dispose();}finally{scene.dispose();engine.dispose();}
console.log('CATHEXIS motion: 4 clips, shared geometry, 23/29 indexed joints, exact 1,907-pose audit hash, zero glTF errors.');
