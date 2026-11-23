/** Prepare the verified FBX audit bank as one compact, immutable review asset. */
import {readFile, writeFile, mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {weld, resample, dedup, prune} from '@gltf-transform/functions';
import {validateBytes} from 'gltf-validator';
import {buildPack, digest} from '../assets.mjs';
const source=process.argv[2];
if(!source)throw Error('Usage: node scripts/characters/import-worker-review.mjs <verified-worker-bank.glb>');
const bytes=await readFile(source);
assert.equal(digest(bytes),'6f751067eb1cad0cd9b5d92f22f802582e25a14f0ad8dc1c13d82ab63f7b95d0','Unreviewed intermediate bank');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS),doc=await io.readBinary(bytes),root=doc.getRoot();
assert.equal(root.listAnimations().length,19);assert.equal(root.listSkins()[0].listJoints().length,24);
for(const m of root.listMaterials())m.setEmissiveTexture(null).setEmissiveFactor([0,0,0]);
for(const t of root.listTextures())if(t.getMimeType()==='image/png')t.setImage(await sharp(t.getImage()).removeAlpha().jpeg({quality:94,mozjpeg:true}).toBuffer()).setMimeType('image/jpeg');
// Display names belong to the owner/catalog. Preserve the FBX alias in the provenance record.
root.listAnimations().find(a=>a.getName()==='Confident_Walk').setName('Hot_Walk');
await doc.transform(weld(),resample({tolerance:1e-5}),dedup(),prune());
const out=await io.writeBinary(doc),validation=await validateBytes(out,{maxIssues:1000});
assert.equal(validation.issues.numErrors,0,JSON.stringify(validation.issues.messages));
const dir=await mkdtemp(path.join(tmpdir(),'loopforge-worker-'));
await writeFile(path.join(dir,'worker.glb'),out);
await writeFile(path.join(dir,'catalog.json'),JSON.stringify({pack:'loopforge-worker-review',assets:{'worker-01':{kind:'model',source:path.join(dir,'worker.glb'),maxBytes:8000000}}}));
console.log(await buildPack(path.join(dir,'catalog.json')));
console.log(JSON.stringify({sourceBytes:bytes.length,runtimeBytes:out.length,sha256:digest(out),vertices:root.listMeshes()[0].listPrimitives()[0].getAttribute('POSITION').getCount(),clips:root.listAnimations().map(a=>a.getName()),validation:validation.issues},null,2));
