/** Derive candidate portrait/floor/CCTV assets. Sources and motion timing stay intact. */
import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const require=createRequire(app+'/package.json');
const {NodeIO}=require('@gltf-transform/core');
const {ALL_EXTENSIONS}=require('@gltf-transform/extensions');
const {weld,dedup,prune,resample,textureCompress,meshopt}=require('@gltf-transform/functions');
const {MeshoptSimplifier,MeshoptEncoder,MeshoptDecoder}=require('meshoptimizer');
const sharp=require('sharp');
const [directory,...names]=process.argv.slice(2);
if(!directory||!names.length)throw Error('Usage: optimize-opening-workers.mjs <cast-directory> <worker...>');
await Promise.all([MeshoptSimplifier.ready,MeshoptEncoder.ready,MeshoptDecoder.ready]);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const levels=[{id:'portrait',ratio:1,error:0,texture:1024},{id:'floor',ratio:.34,error:.012,texture:512},{id:'console',ratio:.12,error:.035,texture:256}];
// Attribute-aware simplification can cross duplicated UV borders while preserving
// skin influence fields. Joint indices themselves are categorical; expand the four
// influences to dense per-bone weights before computing simplification error.
function reduce(doc,level,name){
 const jointCount=Math.max(...doc.getRoot().listSkins().map(s=>s.listJoints().length));
 for(const p of doc.getRoot().listMeshes().flatMap(m=>m.listPrimitives())){
  const pos=p.getAttribute('POSITION'),normal=p.getAttribute('NORMAL'),uv=p.getAttribute('TEXCOORD_0'),j=p.getAttribute('JOINTS_0').getArray(),w=p.getAttribute('WEIGHTS_0').getArray();
  const stride=5+jointCount,attributes=new Float32Array(pos.getCount()*stride);
  for(let v=0;v<pos.getCount();v++){
   attributes.set(normal.getArray().subarray(v*3,v*3+3),v*stride);
   attributes.set(uv.getArray().subarray(v*2,v*2+2),v*stride+3);
   for(let k=0;k<4;k++)attributes[v*stride+5+j[v*4+k]]+=w[v*4+k];
  }
  const head=doc.getRoot().listSkins()[0].listJoints().findIndex(n=>n.getName()==='Head');
  const locks=new Uint8Array(pos.getCount());
  // bob’s two large lenses carry his identity even on a tiny CCTV feed. Keep
  // their topology; preserve other faces’ seams instead of forcing a count.
  for(let v=0;v<pos.getCount();v++)if(attributes[v*stride+5+head]>.4)locks[v]=name==='bob'?1:2;
  const original=p.getIndices(),target=Math.floor(original.getCount()*level.ratio/3)*3;
  const [indices,error]=MeshoptSimplifier.simplifyWithAttributes(new Uint32Array(original.getArray()),pos.getArray(),3,attributes,stride,[.3,.3,.3,2,2,...Array(jointCount).fill(.5)],locks,target,level.error,['Permissive','RegularizeLight']);
  // Compact every attribute using one shared remap; no regenerated skin or UVs.
  const order=[...new Set(indices)],remap=new Uint32Array(pos.getCount());order.forEach((v,i)=>remap[v]=i);
  for(const semantic of p.listSemantics()){
   const a=p.getAttribute(semantic),n=a.getElementSize(),source=a.getArray(),out=new source.constructor(order.length*n);
   order.forEach((v,i)=>out.set(source.subarray(v*n,v*n+n),i*n));p.setAttribute(semantic,a.clone().setArray(out));
  }
  p.setIndices(original.clone().setArray(Uint16Array.from(indices,i=>remap[i])));
  console.log(JSON.stringify({simplification:level.id,triangles:indices.length/3,error}));
 }
}
const fitted=names.includes('--fitted');
for(const name of names.filter(n=>n!=='--fitted')){
 const folder=path.resolve(directory,name),source=path.join(folder,name+(fitted?'-motion-fitted-v1.glb':'-motion-candidate-v1.glb'));
 const original=await readFile(source),records=[];
 for(const level of levels){
  const doc=await io.readBinary(original);
  const clipNames=doc.getRoot().listAnimations().map(a=>a.getName());
  await doc.transform(weld());
  if(level.ratio<1)reduce(doc,level,name);
  await doc.transform(resample({tolerance:1e-4}),textureCompress({encoder:sharp,targetFormat:'webp',resize:[level.texture,level.texture],quality:92,effort:4}),dedup(),prune());
  const root=doc.getRoot(),prims=root.listMeshes().flatMap(m=>m.listPrimitives());
  const triangles=prims.reduce((n,p)=>n+(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3,0);
  await doc.transform(meshopt({encoder:MeshoptEncoder,level:'high',quantizePosition:16,quantizeTexcoord:14,quantizeWeights:12}));
  const byte=await io.writeBinary(doc),file=name+'-'+level.id+'-candidate-v1.glb';await writeFile(path.join(folder,file),byte);
  const record={level:level.id,file,bytes:byte.length,sha256:digest(byte),triangles,joints:root.listSkins().map(s=>s.listJoints().length),clips:clipNames,textures:root.listTextures().map(t=>({mimeType:t.getMimeType(),size:t.getSize()})),status:'candidate: visual and contact review pending'};
  records.push(record);console.log(JSON.stringify({worker:name,level:level.id,bytes:byte.length,triangles,clips:clipNames.length}));
 }
 await writeFile(path.join(folder,'delivery-candidates-v1.json'),JSON.stringify({worker:name,sourceSha256:digest(original),revision:'opening-worker-delivery/3',levels:records},null,2)+'\n');
}
