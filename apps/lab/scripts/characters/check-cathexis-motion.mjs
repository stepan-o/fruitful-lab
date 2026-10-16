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
// Preserve both originals, Hot Walk gait/dress/left contact and unrelated acting.
const armNames=new Set(['mixamorig:RightArm','mixamorig:RightForeArm','mixamorig:RightHand']);
const preserved=[];for(const a of root.listAnimations())for(const c of a.listChannels()){
 const node=c.getTargetNode().getName(),path=c.getTargetPath();
 if(a.getName()==='Happy_Sway_Corrected'||a.getName()==='Hot_Walk_Corrected'&&path==='rotation'&&armNames.has(node))continue;
 const s=c.getSampler();preserved.push([a.getName(),node,path,Array.from(s.getInput().getArray()),Array.from(s.getOutput().getArray())]);
}
preserved.sort((a,b)=>JSON.stringify(a.slice(0,3)).localeCompare(JSON.stringify(b.slice(0,3))));
assert.equal(digest(Buffer.from(JSON.stringify(preserved))),'1f4f407ccb53a020855d9e73affb3c2d45eaeeb73def682f89cca83ab28bc025','originals and preserved Hot Walk curves unchanged');
const corrected=audit.clips.filter(c=>c.clip.endsWith('Corrected'));assert.equal(corrected.reduce((n,c)=>n+c.samples,0),1907);
for(const c of corrected){assert.equal(c.costumeLegContactFrames,0);assert.equal(c.legLegContactFrames,0);assert.ok(c.maxLegKeyRotationStepRadians<.20);if(c.clip==='Hot_Walk_Corrected'){assert.ok(c.ankleLaneSeparationMaxM<.15,'no wide fixed stance');assert.ok(c.ankleLaneSeparationMaxM-c.ankleLaneSeparationMinM>.09,'curved recovery and central landing');assert.ok(c.kneeCentreDistanceMinM>.12,'knee armour passing clearance');}else{assert.ok(c.ankleLaneSeparationMinM>.15);assert.ok(c.kneeLaneSeparationMinM>.10);}assert.equal(c.endpointMaxM,0);assert.ok(c.footMinM>=0&&c.footMaxM<(c.clip==='Hot_Walk_Corrected'?.006:.004));}
assert.equal(audit.handContacts.hipSamples,701);assert.equal(audit.handContacts.templeSamples,318);
assert.ok(audit.handContacts.hipPalmErrorMaxM<.001);assert.ok(audit.handContacts.templePalmErrorMaxM<.001);
const stance=audit.motionQuality.find(c=>c.clip==='Happy_Sway_Corrected');
assert.equal(stance.soleSamples,1206);assert.ok(stance.maxSoleDriftM<.003,'planted sole surfaces stay within 3mm');assert.ok(stance.hipTravelRangeM[0]<.14,'calmer standing sway');
const arm=audit.motionQuality.find(c=>c.clip==='Hot_Walk_Corrected');
assert.ok(arm.rightArmMaxKeyStepDegrees['mixamorig:RightArm']<8,'no elbow-plane jump');assert.ok(arm.rightArmMaxKeyStepDegrees['mixamorig:RightForeArm']<6);assert.ok(arm.rightArmMaxKeyStepDegrees['mixamorig:RightHand']<13);
// Babylon inserts a non-indexed ancestor for the two-branch skirt skeleton.
const engine=new NullEngine(),scene=new Scene(engine);try{const c=await LoadAssetContainerAsync(bytes,scene,{pluginExtension:'.glb'});assert.deepEqual(c.meshes.filter(m=>m.getTotalVertices()>0).map(m=>[m.name,m.skeleton.bones.filter(b=>b.getIndex()>=0).length]),[['Source_Body',23],['Corrected_Body',29]]);c.dispose();}finally{scene.dispose();engine.dispose();}
console.log('CATHEXIS motion: 4 clips, shared geometry, 23/29 indexed joints, exact 1,907-pose audit hash, zero glTF errors.');
