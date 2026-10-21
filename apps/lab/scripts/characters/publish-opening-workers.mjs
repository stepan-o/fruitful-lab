import {readFile,writeFile,mkdtemp,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {buildPack} from '../assets.mjs';
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const source=path.resolve(process.argv[2]??path.join(app,'../../output/opening-cast'));
const workers='bob sam ed jo gus max mae kit lou ben'.split(' '),assets={},records={};
for(const name of workers){
 const report=JSON.parse(await readFile(path.join(source,name,'delivery-candidates-v1.json'),'utf8'));
 records[name]={revision:report.revision,levels:{},status:'Motion transfer candidate; per-character fitting and visual acceptance pending.'};
 for(const level of report.levels){
  const id=`${name}-${level.level}`,file=path.join(source,name,level.file),bytes=await readFile(file);
  if(createHash('sha256').update(bytes).digest('hex')!==level.sha256)throw Error(`Stale report for ${id}`);
  assets[id]={kind:'model',source:file,maxBytes:3000000};
  records[name].levels[level.level]={triangles:level.triangles,joints:level.joints[0],clips:level.clips};
 }
}
const temp=await mkdtemp(path.join(tmpdir(),'opening-workers-'));
const catalog=path.join(temp,'catalog.json');await writeFile(catalog,JSON.stringify({pack:'loopforge-opening-workers',assets}));
await buildPack(catalog);
const decoder=await readFile(path.join(app,'node_modules/meshoptimizer/meshopt_decoder.cjs'));
const hash=createHash('sha256').update(decoder).digest('hex'),url=`/vendor/meshopt/meshopt-decoder.${hash.slice(0,16)}.js`;
await mkdir(path.join(app,'public/vendor/meshopt'),{recursive:true});
await writeFile(path.join(app,'public',url),decoder);
await writeFile(path.join(app,'public/vendor/meshopt/LICENSE.txt'),await readFile(path.join(app,'node_modules/meshoptimizer/LICENSE.md')));
await writeFile(path.join(app,'lib/loopforge/agents/opening-worker-delivery.json'),JSON.stringify({revision:'opening-worker-review/1',decoder:{src:url,sha256:hash,version:'meshoptimizer 1.3.0 (MIT)'},workers:records},null,2)+'\n');
console.log(`Prepared ${workers.length} worker banks × 3 detail levels; local decoder ${hash.slice(0,16)}.`);
