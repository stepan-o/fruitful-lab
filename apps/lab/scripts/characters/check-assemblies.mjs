import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
import {NodeIO} from '@gltf-transform/core';
import {validateBytes} from 'gltf-validator';
import {digest} from '../assets.mjs';
const read=path=>readFile(new URL('../../'+path,import.meta.url));
const manifest=JSON.parse(await read('lib/assets/generated/loopforge-character-modules.json'));
const file=manifest.assets['stiletto-welder'].variants[0],bytes=new Uint8Array(await read('public'+file.src));
assert.equal(digest(bytes),file.sha256);assert.equal(bytes.length,file.bytes);assert.ok(file.bytes<2500000);
assert.equal((await validateBytes(bytes)).issues.numErrors,0);
const io=new NodeIO(),welder=await io.readBinary(bytes),root=welder.getRoot(),primitive=root.listMeshes()[0].listPrimitives()[0];
assert.equal(root.listMeshes().length,1);assert.equal(root.listSkins().length,0);assert.equal(root.listAnimations().length,0);
assert.equal(primitive.getIndices().getCount()/3,4116);
for(const key of ['POSITION','NORMAL','TEXCOORD_0'])assert.ok(primitive.getAttribute(key).getArray().every(Number.isFinite));
const lo=primitive.getAttribute('POSITION').getMin([]),hi=primitive.getAttribute('POSITION').getMax([]);
assert.ok(Math.abs(lo[1])<1e-6&&Math.abs(hi[1]-.36)<1e-6,'collar at zero; nozzle along +Y at 36 cm');
assert.ok(hi[0]-lo[0]<.1&&hi[2]-lo[2]<.1,'fit module width');
const fitSource=await read('lib/loopforge/agents/cathexis-fit.ts');
const {cathexisSeatIndices,cathexisFits}=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(fitSource.toString())).toString('base64'));
const faces=JSON.parse(await read('lib/assets/generated/loopforge-cathexis-review.json'));
const body=await io.readBinary(new Uint8Array(await read('public'+faces.assets.body.variants[0].src))),p=body.getRoot().listMeshes()[0].listPrimitives()[0],pos=p.getAttribute('POSITION').getArray(),original=p.getIndices().getArray(),copy=original.slice(),seat=cathexisSeatIndices(pos,original);
assert.deepEqual(original,copy,'source indices remain immutable');
const kept=new Set();for(let i=0;i<seat.length;i+=3)kept.add(seat.slice(i,i+3).join(','));
let removed=0;
for(let i=0;i<original.length;i+=3){if(kept.has(Array.from(original.slice(i,i+3)).join(',')))continue;removed++;for(let k=0;k<3;k++){const v=original[i+k]*3;assert.ok(Math.abs(pos[v])<=.071&&pos[v+1]>=1.63&&pos[v+1]<=1.84&&pos[v+2]>=.115,'cut stays within central facial seat');}}
assert.ok(removed>0&&removed<1500,'bounded reversible face seat');
for(const [id,fit] of Object.entries(cathexisFits)){assert.ok(faces.assets[id]);assert.ok(fit.scale.every(v=>v>0&&v<.2));assert.ok(fit.position.every(Number.isFinite));assert.ok(fit.eyes.rx>0&&fit.eyes.ry>0);}
console.log(`Assemblies: 4116-triangle welder valid; five face fits; ${removed} central seat triangles omitted without mutating source.`);
