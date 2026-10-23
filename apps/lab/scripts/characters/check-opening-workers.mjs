import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {MeshoptDecoder} from 'meshoptimizer';
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const delivery=JSON.parse(await readFile(path.join(app,'lib/loopforge/agents/opening-worker-delivery.json'),'utf8'));
const manifest=JSON.parse(await readFile(path.join(app,'lib/assets/generated/loopforge-opening-workers.json'),'utf8'));
await MeshoptDecoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const hashes=new Set();let count=0;
for(const [worker,data]of Object.entries(delivery.workers)){
 let clipTimes=null,previous=Infinity;
 for(const level of ['portrait','floor','console']){
  const meta=data.levels[level],file=manifest.assets[`${worker}-${level}`].variants[0],bytes=await readFile(path.join(app,'public',file.src));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256);assert.equal(bytes.length,file.bytes);assert(!hashes.has(file.sha256));hashes.add(file.sha256);
  const root=(await io.readBinary(bytes)).getRoot(),skins=root.listSkins(),animations=root.listAnimations();
  assert.equal(skins.length,1);assert.equal(skins[0].listJoints().length,24);
  assert.deepEqual(animations.map(a=>a.getName()),meta.clips);
  const times=animations.map(a=>({name:a.getName(),end:Math.max(...a.listSamplers().map(s=>s.getInput().getMax([])[0]))}));
  if(clipTimes)assert.deepEqual(times,clipTimes);else clipTimes=times;
  const triangles=root.listMeshes().reduce((sum,m)=>sum+m.listPrimitives().reduce((n,p)=>n+p.getIndices().getCount()/3,0),0);
  assert.equal(triangles,meta.triangles);assert(triangles<previous);previous=triangles;
  assert(root.listTextures().every(t=>t.getMimeType()==='image/webp'));
  for(const animation of animations)for(const channel of animation.listChannels()){
   assert(channel.getTargetNode());const output=channel.getSampler().getOutput().getArray();assert(output.every(Number.isFinite));
  }
  count++;
 }
}
const decoder=await readFile(path.join(app,'public',delivery.decoder.src));assert.equal(createHash('sha256').update(decoder).digest('hex'),delivery.decoder.sha256);
console.log(`${count} optimized banks verified: separate bodies, 24-joint skins, complete identical clip timing across detail levels, finite channels and local decoder integrity.`);
