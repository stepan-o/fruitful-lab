/** Revision-specific offline extraction. Source masters never enter a runtime pack. */
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {compactPrimitive,dedup,prune,simplify,tangents,unweld,weld} from '@gltf-transform/functions';
import {MeshoptSimplifier} from 'meshoptimizer';
import {generateTangents} from 'mikktspace';
import sharp from 'sharp';
import {validateBytes} from 'gltf-validator';
import {digest} from '../assets.mjs';
export async function prepareBladeHousing(source,destination){
 const bytes=await readFile(source);
 assert.equal(digest(bytes),'c65ba4fd8556e5203e5f7314c5a6c2877ff70c7806101da4a3e77ecf0e789f0f','Unreviewed blade source');
 const io=new NodeIO(),doc=await io.readBinary(bytes),root=doc.getRoot();
 assert.equal(root.listMeshes().length,1);
 const primitive=root.listMeshes()[0].listPrimitives()[0],position=primitive.getAttribute('POSITION').getArray(),uv=primitive.getAttribute('TEXCOORD_0').getArray(),indices=primitive.getIndices().getArray();
 const image=await sharp(primitive.getMaterial().getBaseColorTexture().getImage()).raw().toBuffer({resolveWithObject:true});
 function isEnergy(i){
  const x=Math.max(0,Math.min(image.info.width-1,Math.round(uv[i*2]*image.info.width))),y=Math.max(0,Math.min(image.info.height-1,Math.round(uv[i*2+1]*image.info.height))),q=(y*image.info.width+x)*image.info.channels;
  return image.data[q+1]>82&&image.data[q+2]>82&&image.data[q]<image.data[q+1]*.85;
 }
 // This source fuses energy to metal. Keep the mechanical emitter/rear accents;
 // discard the sculpted blade and cyan forward strands before simplification.
 const kept=[];
 for(let t=0;t<indices.length;t+=3){
  const a=indices[t],b=indices[t+1],c=indices[t+2];
  if(Math.min(position[a*3],position[b*3],position[c*3])<-.10)continue;
  if(Math.max(position[a*3],position[b*3],position[c*3])<.38&&isEnergy(a)&&isEnergy(b)&&isEnergy(c))continue;
  kept.push(a,b,c);
 }
 primitive.getIndices().setArray(new Uint32Array(kept));compactPrimitive(primitive);
 await doc.transform(weld(),simplify({simplifier:MeshoptSimplifier,ratio:5000/(kept.length/3),error:.04}));
 const p=primitive.getAttribute('POSITION').getArray(),n=primitive.getAttribute('NORMAL').getArray();
 // Metres, local +Y toward the tip, origin at the rear forearm mount.
 for(let i=0;i<p.length;i+=3){const x=p[i],y=p[i+1],nx=n[i],ny=n[i+1];p[i]=y*.36;p[i+1]=(.65-x)*.36;p[i+2]*=.36;n[i]=ny;n[i+1]=-nx;}
 for(const texture of root.listTextures())texture.setImage(await sharp(texture.getImage()).resize({width:1024,height:1024,fit:'inside',withoutEnlargement:true}).jpeg({quality:90}).toBuffer()).setMimeType('image/jpeg');
 primitive.getMaterial().setMetallicFactor(.7).setRoughnessFactor(.85);
 await doc.transform(unweld(),tangents({generateTangents}),weld(),dedup(),prune());
 // A collapsed UV can yield a zero tangent after reduction. Supply an
 // orthonormal fallback only for that vertex; keep MikkTSpace everywhere else.
 const ta=primitive.getAttribute('TANGENT').getArray(),na=primitive.getAttribute('NORMAL').getArray();
 for(let i=0;i<ta.length;i+=4){
  if(Math.hypot(ta[i],ta[i+1],ta[i+2])>.5)continue;
  const j=i/4*3,nx=na[j],ny=na[j+1],nz=na[j+2];
  let x=Math.abs(ny)<.9?nz:0,y=Math.abs(ny)<.9?0:-nz,z=Math.abs(ny)<.9?-nx:ny;
  const length=Math.hypot(x,y,z);assert.ok(length>.001);ta[i]=x/length;ta[i+1]=y/length;ta[i+2]=z/length;ta[i+3]=1;
 }
 root.listMeshes()[0].setName('LIMEN forearm emitter');
 const out=await io.writeBinary(doc),report=await validateBytes(out,{maxIssues:20});
 assert.equal(report.issues.numErrors,0,JSON.stringify(report.issues.messages));
 const triangles=primitive.getIndices().getCount()/3;assert.ok(triangles<=5000);assert.ok(out.length<=1200000);
 await writeFile(destination,out);
 return {sourceBytes:bytes.length,sourceTriangles:indices.length/3,triangles,runtimeBytes:out.length,sha256:digest(out),validation:report.issues};
}
