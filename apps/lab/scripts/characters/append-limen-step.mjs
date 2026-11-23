/** Append the owner's Step_Back FBX take without changing the existing 17 motions or materials.
 * Input: fbx-motion-dump.c JSON; output uses the established immutable model pack. */
import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import path from 'node:path';import {tmpdir} from 'node:os';import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';import {validateBytes} from 'gltf-validator';
import {buildPack,digest} from '../assets.mjs';
const input=process.argv[2];if(!input)throw Error('Pass the audited Step_Back FBX JSON.');
const pack=JSON.parse(await readFile(new URL('../../lib/assets/generated/loopforge-limen-motions.json',import.meta.url),'utf8'));
const file=pack.assets.motions.variants[0],bytes=await readFile(new URL('../../public'+file.src,import.meta.url));
assert.equal(digest(bytes),file.sha256);
const io=new NodeIO(),doc=await io.readBinary(bytes),root=doc.getRoot(),data=JSON.parse(await readFile(input,'utf8'));
assert.ok(!root.listAnimations().some(a=>a.getName()==='Step_Back'),'Already imported; do not append twice');
const clip=data.clips.find(c=>c.name==='Step_Back');assert.ok(clip);assert.equal(root.listSkins()[0].listJoints().length,80);
const nodes=new Map(root.listNodes().map(n=>[n.getName(),n])),buffer=root.listBuffers()[0];
const frames=clip.frames.filter((_,i)=>i%2===0||i===clip.frames.length-1);
const time=doc.createAccessor('Step_Back time').setType('SCALAR').setBuffer(buffer).setArray(new Float32Array(frames.map(f=>f.t)));
const anim=doc.createAnimation('Step_Back');let channels=0;
for(let i=0;i<data.nodes.length;i++){
 const name=data.nodes[i].name;if(!name.startsWith('mixamorig:'))continue;
 const node=nodes.get(name);assert.ok(node,`Missing bone ${name}`);
 for(const [target,start,end,type]of [['translation',0,3,'VEC3'],['rotation',3,7,'VEC4'],['scale',7,10,'VEC3']]){
  const rows=frames.map(f=>f.local[i].slice(start,end));
  if(target==='rotation')for(let n=0;n<rows.length;n++){const q=rows[n],len=Math.hypot(...q);for(let j=0;j<4;j++)q[j]/=len;if(n&&q.reduce((s,v,j)=>s+v*rows[n-1][j],0)<0)for(let j=0;j<4;j++)q[j]*=-1;}
  const output=doc.createAccessor(`${name} ${target}`).setType(type).setBuffer(buffer).setArray(new Float32Array(rows.flat()));
  const sampler=doc.createAnimationSampler().setInput(time).setOutput(output).setInterpolation('LINEAR');
  anim.addSampler(sampler).addChannel(doc.createAnimationChannel().setSampler(sampler).setTargetNode(node).setTargetPath(target));channels++;
 }
}
const out=await io.writeBinary(doc),validation=await validateBytes(out,{maxIssues:30});
assert.equal(validation.issues.numErrors,0);assert.equal(validation.issues.numWarnings,0,JSON.stringify(validation.issues));
assert.ok(out.length<11000000);
const dir=await mkdtemp(path.join(tmpdir(),'limen-step-'));await writeFile(path.join(dir,'motions.glb'),out);
await writeFile(path.join(dir,'catalog.json'),JSON.stringify({pack:'loopforge-limen-motions',assets:{motions:{kind:'model',source:path.join(dir,'motions.glb'),maxBytes:11000000}}}));
console.log(await buildPack(path.join(dir,'catalog.json')));
console.log(JSON.stringify({clip:'Step_Back',seconds:clip.end-clip.start,samples:frames.length,channels,bytes:out.length,sha256:digest(out),priorSha256:file.sha256,oldClipCount:17,totalClipCount:root.listAnimations().length}));
