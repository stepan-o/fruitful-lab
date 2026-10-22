import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';import path from 'node:path';
const app=path.resolve('apps/lab'),require=createRequire(app+'/package.json');const {NodeIO}=require('@gltf-transform/core');const sharp=require('sharp');const io=new NodeIO();
const base=await io.read('output/room-kit/brain-v1.glb'),source=base.getRoot().listMeshes()[0].listPrimitives()[0];
const digest=a=>createHash('sha256').update(new Uint8Array(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const result={};
for(const state of ['dirty','pressed']){
 const file='output/room-kit/brain-'+state+'-v1.glb',doc=await io.read(file),p=doc.getRoot().listMeshes()[0].listPrimitives()[0];
 for(const sem of ['POSITION','TEXCOORD_0'])if(digest(p.getAttribute(sem).getArray())!==digest(source.getAttribute(sem).getArray()))throw Error(state+' changed '+sem+'; cannot reuse maps');
 const indices=p.getIndices().getArray(),original=source.getIndices().getArray();if(indices.length!==original.length||!indices.every((v,i)=>v===original[i]))throw Error(state+' changed topology');
 const texture=p.getMaterial().getBaseColorTexture(),bytes=await sharp(texture.getImage()).resize(512,512,{fit:'inside',withoutEnlargement:true}).webp({quality:90,effort:4}).toBuffer(),hash=digest(bytes);
 await writeFile(app+'/public/media/files/'+hash+'.webp',bytes);
 result[state]={src:'/media/files/'+hash+'.webp',sha256:hash,bytes:bytes.length,textureSize:512,sourceSha256:digest(await readFile(file)),uvVerified:true};
}
const manifestPath=app+'/lib/loopforge/rooms/room-kit.json',manifest=JSON.parse(await readFile(manifestPath,'utf8'));manifest.brainStates=result;
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');await writeFile('docs/loopforge/production/model-briefs/room-kit/brain/material-delivery-v1.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
