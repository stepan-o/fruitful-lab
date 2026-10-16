/** Publish only the two inspected FBX auditions; the approved motion pack stays intact. */
import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {prune,dedup,weld} from '@gltf-transform/functions';import {validateBytes} from 'gltf-validator';
import {buildPack,digest} from '../assets.mjs';
const input=process.argv[2];if(!input)throw Error('Pass the baked source/corrected audition GLB.');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS),doc=await io.readBinary(await readFile(input));
for(const mesh of doc.getRoot().listMeshes())for(const p of mesh.listPrimitives())for(const set of [0,1]){
 const j=p.getAttribute('JOINTS_'+set)?.getArray(),w=p.getAttribute('WEIGHTS_'+set)?.getArray();if(j&&w)for(let i=0;i<j.length;i++)if(w[i]===0)j[i]=0;
}
await doc.transform(weld(),prune(),dedup());const root=doc.getRoot();
assert.equal(root.listMeshes().length,2);assert.deepEqual(root.listSkins().map(s=>s.listJoints().length),[23,29]);
assert.deepEqual(root.listAnimations().map(a=>a.getName()),['Mirror_Viewing_Source','Red_Carpet_Walk_Source','Mirror_Viewing_Corrected','Red_Carpet_Walk_Corrected']);
const bytes=await io.writeBinary(doc),validation=await validateBytes(bytes,{maxIssues:100});
assert.equal(validation.issues.numErrors,0,JSON.stringify(validation.issues));
const dir=await mkdtemp(path.join(tmpdir(),'cathexis-auditions-'));await writeFile(path.join(dir,'auditions.glb'),bytes);
await writeFile(path.join(dir,'catalog.json'),JSON.stringify({pack:'loopforge-cathexis-auditions',assets:{'cathexis-auditions':{kind:'model',source:path.join(dir,'auditions.glb'),maxBytes:14500000}}}));
console.log(await buildPack(path.join(dir,'catalog.json')));
console.log(JSON.stringify({sha256:digest(bytes),bytes:bytes.length,validation:{errors:validation.issues.numErrors,warnings:validation.issues.numWarnings},clips:root.listAnimations().map(a=>a.getName())}));
