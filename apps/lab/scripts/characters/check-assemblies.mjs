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
const {halfMaskGeometry,cathexisFits}=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(fitSource.toString())).toString('base64'));
const faces=JSON.parse(await read('lib/assets/generated/loopforge-cathexis-review.json'));
const area=g=>{let sum=0;for(let i=0;i<g.indices.length;i+=3){const v=[0,1,2].map(k=>g.positions.slice(g.indices[i+k]*3,g.indices[i+k]*3+3)),u=v[1].map((x,k)=>x-v[0][k]),w=v[2].map((x,k)=>x-v[0][k]);sum+=Math.hypot(u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0])/2;}return sum;};
for(const id of ['grace-3k','grace-8k']){
 const doc=await io.readBinary(new Uint8Array(await read('public'+faces.assets[id].variants[0].src))),p=doc.getRoot().listMeshes()[0].listPrimitives()[0];
 const source={positions:Array.from(p.getAttribute('POSITION').getArray()),normals:Array.from(p.getAttribute('NORMAL').getArray()),uvs:Array.from(p.getAttribute('TEXCOORD_0').getArray()),indices:Array.from(p.getIndices().getArray())},before=structuredClone(source);
 const halves=[1,-1].map(side=>{
  const {geometry:g,rim}=halfMaskGeometry(source,side);
  assert.ok(g.indices.length>0&&rim.length>0);assert.equal(rim.length%9,0);
  assert.ok([...g.positions,...g.normals,...g.uvs,...rim].every(Number.isFinite));
  assert.equal(g.normals.length,g.positions.length);assert.equal(g.uvs.length,g.positions.length/3*2);
  for(let i=0;i<g.positions.length;i+=3){assert.ok(g.positions[i]*side>=0,'all clipped vertices on retained half');assert.ok(Math.abs(Math.hypot(...g.normals.slice(i,i+3))-1)<1e-6,'interpolated normals normalized');}
  assert.ok(g.indices.every(i=>i>=0&&i<g.positions.length/3));
  return g;
 });
 assert.deepEqual(source,before,'source geometry is immutable');
 assert.ok(Math.abs(area(halves[0])+area(halves[1])-area(source))<1e-5,'both halves partition the original surface without holes or duplication');
}
const triangle={positions:[-1,0,0,1,0,0,0,1,0],normals:[0,0,1,0,0,1,0,0,1],uvs:[0,0,1,0,.5,1],indices:[0,1,2]};
const clipped=halfMaskGeometry(triangle,1).geometry;
for(let i=0;i<clipped.positions.length/3;i++)if(clipped.positions[i*3]===0&&clipped.positions[i*3+1]===0)assert.equal(clipped.uvs[i*2],.5,'seam interpolates source UVs');
for(const [id,fit] of Object.entries(cathexisFits)){assert.ok(faces.assets[id]);assert.ok(fit.scale.every(v=>v>0&&v<.2));assert.ok(fit.position.every(Number.isFinite));}
console.log('Assemblies: 4116-triangle welder valid; both Grace budgets partition correctly into finite, textured halves without mutating sources.');
