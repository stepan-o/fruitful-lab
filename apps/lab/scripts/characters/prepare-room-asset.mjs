#!/usr/bin/env node
/** Reproducible room delivery: retain geometry, resize maps, compress vertices,
 * export hash-addressed GLB and a signed-URL-free provenance record. */
import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const [asset,input,sizeArg='1024']=process.argv.slice(2);
if(!asset||!input||!/^[-a-z0-9]+$/.test(asset))throw Error('Usage: prepare-room-asset.mjs asset source.glb [texture-size]');
const size=Number(sizeArg);if(![256,512,1024,2048].includes(size))throw Error('Unsupported texture size');
const app=process.cwd().endsWith('/apps/lab')?process.cwd():path.resolve('apps/lab');
const repo=path.resolve(app,'../..'),require=createRequire(app+'/package.json');
const {NodeIO}=require('@gltf-transform/core');const {ALL_EXTENSIONS}=require('@gltf-transform/extensions');
const {weld,dedup,prune,textureCompress,meshopt}=require('@gltf-transform/functions');
const {MeshoptEncoder,MeshoptDecoder}=require('meshoptimizer');const sharp=require('sharp');
await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready]);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const source=await readFile(input),doc=await io.readBinary(source);
await doc.transform(weld(),textureCompress({encoder:sharp,targetFormat:'webp',resize:[size,size],quality:90,effort:4}),dedup(),prune(),meshopt({encoder:MeshoptEncoder,level:'high'}));
const bytes=await io.writeBinary(doc),hash=createHash('sha256').update(bytes).digest('hex');
await writeFile(app+'/public/media/files/'+hash+'.glb',bytes);
const record={revision:'room-kit/1',asset,src:'/media/files/'+hash+'.glb',sha256:hash,bytes:bytes.length,sourceSha256:createHash('sha256').update(source).digest('hex'),triangles:doc.getRoot().listMeshes().flatMap(m=>m.listPrimitives()).reduce((n,p)=>n+p.getIndices().getCount()/3,0),textureSize:size,status:'candidate; fit and visual review pending'};
const folder=repo+'/docs/loopforge/production/model-briefs/room-kit/'+asset;await mkdir(folder,{recursive:true});
await writeFile(folder+'/delivery-v1.json',JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify(record));
