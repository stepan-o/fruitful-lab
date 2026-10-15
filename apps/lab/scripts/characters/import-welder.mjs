import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
const W=resolve(import.meta.dirname,'../..');
const req=createRequire(W+'/package.json');
const {NodeIO,Document}=req('@gltf-transform/core'),{copyToDocument,unpartition,prune}=req('@gltf-transform/functions'),{validateBytes}=req('gltf-validator');
const source=process.argv[2];if(!source)throw Error('Pass the retained low-poly welder conversion GLB.');
const io=new NodeIO(),src=await io.read(source),doc=new Document(),mesh=copyToDocument(doc,src,[src.getRoot().listMeshes()[0]]).get(src.getRoot().listMeshes()[0]);
const p=mesh.listPrimitives()[0];if(p.getIndices().getCount()/3!==4116)throw Error('Expected the 4116-triangle delivery, not the high-resolution master');
const pos=p.getAttribute('POSITION'),n=p.getAttribute('NORMAL').getArray(),a=pos.getArray(),min=pos.getMin([]),max=pos.getMax([]),s=.36/(max[0]-min[0]);
for(let i=0;i<a.length;i+=3){const x=a[i],y=a[i+1],nx=n[i],ny=n[i+1];a[i]=y*s;a[i+1]=(max[0]-x)*s;a[i+2]*=s;n[i]=ny;n[i+1]=-nx;}
doc.createScene('Welder module').addChild(doc.createNode('WelderModule').setMesh(mesh));mesh.setName('STILETTO rigid welder');p.getMaterial().setName('welder');await doc.transform(unpartition(),prune());const bytes=await io.writeBinary(doc);const validation=await validateBytes(bytes);if(validation.issues.numErrors)throw Error(JSON.stringify(validation.issues));
await fs.mkdir('/tmp/loopforge-assemblies',{recursive:true});await fs.writeFile('/tmp/loopforge-assemblies/welder.glb',bytes);
await fs.writeFile('/tmp/loopforge-assemblies/catalog.json',JSON.stringify({pack:'loopforge-character-modules',assets:{'stiletto-welder':{kind:'model',source:'/tmp/loopforge-assemblies/welder.glb',maxBytes:2500000}}}));
console.log({triangles:p.getIndices().getCount()/3,bytes:bytes.length,sourceBounds:[min,max],length:.36});
const {buildPack}=await import(W+'/scripts/assets.mjs');console.log(await buildPack('/tmp/loopforge-assemblies/catalog.json'));
