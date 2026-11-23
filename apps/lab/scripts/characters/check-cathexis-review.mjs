import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {validateBytes} from 'gltf-validator';
import {digest} from '../assets.mjs';
const bank=JSON.parse(await readFile(new URL('../../lib/loopforge/agents/cathexis-review.json',import.meta.url),'utf8'));
const manifest=JSON.parse(await readFile(new URL('../../lib/assets/generated/loopforge-cathexis-review.json',import.meta.url),'utf8'));
assert.equal(bank.assets.length,6);assert.equal(bank.intake.length,8);
for(const asset of bank.assets){
 const file=manifest.assets[asset.id].variants[0],bytes=new Uint8Array(await readFile(new URL('../../public'+file.src,import.meta.url)));
 assert.equal(digest(bytes),asset.sha256);assert.equal(bytes.length,asset.bytes);
 const validation=await validateBytes(bytes,{maxIssues:20});assert.equal(validation.issues.numErrors,0,asset.id);
 const doc=await new NodeIO().readBinary(bytes),root=doc.getRoot();assert.equal(root.listSkins().length,0);assert.equal(root.listAnimations().length,0);
 assert.equal(root.listMeshes().length,1);assert.equal(root.listMaterials().length,1);
 const p=root.listMeshes()[0].listPrimitives()[0];assert.equal(p.getIndices().getCount()/3,asset.triangles);
 for(const s of ['POSITION','NORMAL','TEXCOORD_0'])assert.ok(p.getAttribute(s).getArray().every(Number.isFinite));
 const pos=p.getAttribute('POSITION').getArray();let lo=Infinity,hi=-Infinity;for(let i=1;i<pos.length;i+=3){lo=Math.min(lo,pos[i]);hi=Math.max(hi,pos[i]);}assert.ok(Math.abs(lo)<.003&&Math.abs(hi-1.9)<.003,'normalized inspection bounds');
 assert.equal(!!root.listMaterials()[0].getNormalTexture(),asset.normalMap);
 if(!asset.derived)assert.equal(asset.triangles,asset.sourceTriangles);
 console.log(asset.id+': valid static asset, '+asset.triangles+' triangles, '+bytes.length+' bytes');
}
