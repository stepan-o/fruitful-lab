/** Reproducible, offline Meshy -> embedded GLB runtime derivative. No source master is deployed. */
import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,resample} from '@gltf-transform/functions';
import {prepareBladeHousing} from './prepare-limen-blade.mjs';
import sharp from 'sharp';
import {validateBytes} from 'gltf-validator';
import {buildPack,digest} from '../assets.mjs';
const source=process.argv[2],bladeSource=process.argv[3];
if(!source||!bladeSource)throw new Error('Usage: node scripts/characters/import-limen.mjs <limen-body-v2.glb> <limen-blade-master.glb>');
const bytes=await readFile(source);
assert.equal(digest(bytes),'2085f27c0264c417b876ee038919175712fd7fcc02c6c2601c1b2d65325a0ad4','Unexpected source revision; review the source before updating this importer.');
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
const blade=await prepareBladeHousing(bladeSource,path.join(dir,'blade-housing.glb'));
const catalog={pack:'loopforge-limen',assets:{limen:{kind:'model',source:path.join(dir,'limen.glb'),maxBytes:5000000},'blade-housing':{kind:'model',source:path.join(dir,'blade-housing.glb'),maxBytes:1200000}}};
console.log({blade});
await writeFile(path.join(dir,'catalog.json'),JSON.stringify(catalog));
console.log(await buildPack(path.join(dir,'catalog.json')));
console.log(JSON.stringify({sourceBytes:bytes.length,runtimeBytes:out.length,sha256:digest(out),triangles:root.listMeshes().reduce((n,m)=>n+m.listPrimitives().reduce((n,p)=>n+p.getIndices().getCount()/3,0),0),joints:root.listSkins()[0].listJoints().length,clips:root.listAnimations().map(a=>a.getName()),validation:validation.issues},null,2));
