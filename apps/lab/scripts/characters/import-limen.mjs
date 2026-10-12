/** Reproducible, offline Meshy -> embedded GLB runtime derivative. No source master is deployed. */
import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,resample} from '@gltf-transform/functions';
import sharp from 'sharp';
import {validateBytes} from 'gltf-validator';
import {buildPack,digest} from '../assets.mjs';
const source=process.argv[2];
if(!source)throw new Error('Usage: node scripts/characters/import-limen.mjs <limen_rigged.glb>');
const bytes=await readFile(source);
assert.equal(digest(bytes),'5cf991bb1be950dae7d2ba92353488562b7c6c2742cdfc169eef5febe7b220ef','Unexpected source revision; review the source before updating this importer.');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS),doc=await io.readBinary(bytes),root=doc.getRoot();
assert.equal(root.listSkins()[0].listJoints().length,23);
for(const material of root.listMaterials()){
 // The source uses its colour map as full-surface emission; it is not an emissive mask.
 material.setEmissiveTexture(null).setEmissiveFactor([0,0,0]).setMetallicFactor(.35).setRoughnessFactor(.6);
 for(const extension of material.listExtensions())material.setExtension(extension.extensionName,null);
}
for(const texture of root.listTextures()){
 texture.setImage(await sharp(texture.getImage()).resize({width:2048,height:2048,fit:'inside',withoutEnlargement:true}).removeAlpha().jpeg({quality:88,mozjpeg:true}).toBuffer()).setMimeType('image/jpeg');
}
for(const animation of root.listAnimations())if(animation.getName()==='Armature|clip0|baselayer')animation.setName('Rest');
for(const extension of root.listExtensionsUsed())extension.dispose();
await doc.transform(resample(),dedup(),prune());
const out=await io.writeBinary(doc),validation=await validateBytes(out,{maxIssues:20});
assert.equal(validation.issues.numErrors,0,JSON.stringify(validation.issues.messages));
const dir=await mkdtemp(path.join(tmpdir(),'loopforge-limen-'));
await writeFile(path.join(dir,'limen.glb'),out);
const catalog={pack:'loopforge-limen',assets:{limen:{kind:'model',source:path.join(dir,'limen.glb'),maxBytes:5000000}}};
await writeFile(path.join(dir,'catalog.json'),JSON.stringify(catalog));
console.log(await buildPack(path.join(dir,'catalog.json')));
console.log(JSON.stringify({sourceBytes:bytes.length,runtimeBytes:out.length,sha256:digest(out),triangles:root.listMeshes().reduce((n,m)=>n+m.listPrimitives().reduce((n,p)=>n+p.getIndices().getCount()/3,0),0),joints:root.listSkins()[0].listJoints().length,clips:root.listAnimations().map(a=>a.getName()),validation:validation.issues},null,2));
