import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {Document,NodeIO} from '@gltf-transform/core';
import {weld,simplify,dedup,prune} from '@gltf-transform/functions';
import {MeshoptSimplifier} from 'meshoptimizer';
import {validateBytes} from 'gltf-validator';
import {buildPack,digest} from '../assets.mjs';
const root=process.argv[2];if(!root)throw Error('Usage: node scripts/characters/import-cathexis-review.mjs <private-intake-directory>');
const intake=JSON.parse(await fs.readFile(path.join(root,'intake.json'),'utf8'));
const names={body:'Body · clean A-pose','grace-3k':'Grace · 3k candidate','grace-8k':'Grace · 8k candidate','mechanism-grimace':'Mechanism · grimace','mechanism-fury':'Mechanism · fury','mechanism-distress':'Mechanism · distress'};
const result=[],pack={pack:'loopforge-cathexis-review',assets:{}};
for(const source of intake){
 if(source.id.includes('master'))continue;
 const id=source.id,dir=path.join(root,id),paths=await fs.readdir(dir),buf=await fs.readFile(path.join(dir,'geometry.bin'));
 assert.equal(buf.byteLength,source.triangles*3*8*4);
 const raw=new Float32Array(buf.buffer,buf.byteOffset,buf.byteLength/4),n=raw.length/8,pos=new Float32Array(n*3),normal=new Float32Array(n*3),uv=new Float32Array(n*2);
 const h=source.max[1]-source.min[1],scale=1.9/h,cx=(source.max[0]+source.min[0])/2,cz=(source.max[2]+source.min[2])/2;
 for(let i=0;i<n;i++){for(let k=0;k<3;k++){pos[i*3+k]=(raw[i*8+k]-[cx,source.min[1],cz][k])*scale;normal[i*3+k]=raw[i*8+k+3];}uv[i*2]=raw[i*8+6];uv[i*2+1]=raw[i*8+7];}
 const doc=new Document(),buffer=doc.createBuffer(),scene=doc.createScene(id),mat=doc.createMaterial(id).setMetallicFactor(1).setRoughnessFactor(1).setDoubleSided(true);
 const size=id==='body'?2048:1024;
 const get=suffix=>paths.find(p=>p.endsWith(suffix));
 const base=paths.find(p=>p.endsWith('.png')&&!/_metallic|_roughness|_normal/.test(p));
 const tex=async(file,name,isNormal=false)=>{const data=await sharp(path.join(dir,file)).resize(size,size,{fit:'inside'}).removeAlpha().jpeg({quality:isNormal?97:93,mozjpeg:true}).toBuffer();return doc.createTexture(name).setImage(data).setMimeType('image/jpeg');};
 mat.setBaseColorTexture(await tex(base,'base-color'));
 const metallic=await sharp(path.join(dir,get('_metallic.png'))).resize(size,size).greyscale().raw().toBuffer();
 const roughness=await sharp(path.join(dir,get('_roughness.png'))).resize(size,size).greyscale().raw().toBuffer();
 const mr=new Uint8Array(size*size*3);for(let i=0;i<size*size;i++){mr[i*3]=255;mr[i*3+1]=roughness[i];mr[i*3+2]=metallic[i];}
 const mrimg=await sharp(mr,{raw:{width:size,height:size,channels:3}}).jpeg({quality:95,mozjpeg:true}).toBuffer();mat.setMetallicRoughnessTexture(doc.createTexture('metallic-roughness').setImage(mrimg).setMimeType('image/jpeg'));
 const normalFile=get('_normal.png');if(normalFile)mat.setNormalTexture(await tex(normalFile,'normal',true));
 const acc=(name,type,data)=>doc.createAccessor(name).setType(type).setArray(data).setBuffer(buffer);
 const prim=doc.createPrimitive().setAttribute('POSITION',acc('positions','VEC3',pos)).setAttribute('NORMAL',acc('normals','VEC3',normal)).setAttribute('TEXCOORD_0',acc('uv','VEC2',uv)).setMaterial(mat);
 scene.addChild(doc.createNode(id).setMesh(doc.createMesh(id).addPrimitive(prim)));
 await doc.transform(weld());
 if(id.startsWith('mechanism'))await doc.transform(simplify({simplifier:MeshoptSimplifier,ratio:12000/source.triangles,error:.01}));
 await doc.transform(dedup(),prune());
 // Simplification can remove extremal vertices; keep inspection framing consistent.
 const display=prim.getAttribute('POSITION').getArray();
 let bottom=Infinity,top=-Infinity;
 for(let i=1;i<display.length;i+=3){bottom=Math.min(bottom,display[i]);top=Math.max(top,display[i]);}
 const displayCorrection=1.9/(top-bottom);
 for(let i=0;i<display.length;i+=3){display[i]*=displayCorrection;display[i+1]=(display[i+1]-bottom)*displayCorrection;display[i+2]*=displayCorrection;}
 const output=await new NodeIO().writeBinary(doc),valid=await validateBytes(output,{maxIssues:100});assert.equal(valid.issues.numErrors,0,JSON.stringify(valid.issues));
 const triangles=prim.getIndices().getCount()/3,filename=path.join(dir,'review.glb');await fs.writeFile(filename,output);
 pack.assets[id]={kind:'model',source:filename,maxBytes:8000000};
 result.push({id,label:names[id],sourceTriangles:source.triangles,triangles,vertices:prim.getAttribute('POSITION').getCount(),bytes:output.length,sha256:digest(output),sourceArchive:source.archive,sourceSha256:source.fbxSha256,sourceBounds:{min:source.min,max:source.max},displayScale:scale,textureSize:size,normalMap:!!normalFile,skinJoints:source.skinJoints,clips:source.clips,derived:id.startsWith('mechanism'),note:id.startsWith('mechanism')?'Locally simplified inspection derivative. Source master retained; final remesh and fit pending.':id==='body'?'Unrigged source body. No normal map in the 50k download.':'Source geometry retained. Compare both Grace versions from the same camera.'});
 console.log(id,source.triangles,'→',triangles,output.length);
}
const audit={revision:'cathexis-first-intake-2026-10-14-v1',intake,assets:result,scope:'Separate unrigged assets. Each normalized to 1.9 units for isolated inspection, not shared physical dimensions. No fitted assembly, animation, mechanical jaw or gameplay integration.'};
await fs.writeFile(path.join(root,'review.json'),JSON.stringify(audit,null,2)+'\n');
await fs.writeFile(path.join(root,'catalog.json'),JSON.stringify(pack,null,2));
if(!process.argv.includes('--no-publish'))console.log(await buildPack(path.join(root,'catalog.json')));
