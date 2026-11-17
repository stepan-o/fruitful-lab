import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { makeSequence, samplePath } from '../../../docs/loopforge/game-design/day-one-sequence.mjs';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const folder = new URL('../../../docs/loopforge/game-design/',import.meta.url);
const floor = JSON.parse(fs.readFileSync(new URL('day-one-geometry.json',folder)));
const navigation = fileURLToPath(new URL('../lib/loopforge/encounters/arrival-navigation.ts',import.meta.url));
const compiled = ts.transpileModule(fs.readFileSync(navigation,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const navigationExports={};
new Function('exports','require',compiled)(navigationExports,require);
const {simultaneousDistanceSquared,segmentBoxDistanceSquared,NAVIGATION_ROOT_RADIUS_MM,NAVIGATION_ROOT_SEPARATION_MM}=navigationExports;
const dialogue=fs.readFileSync(new URL('../DAY_ONE_INTRO.md',folder),'utf8').split('\n').filter(l=>l.startsWith('**'));
const s=makeSequence(floor,dialogue);
const ids=Object.keys(s.cast);
const knots=[...new Set(Object.values(s.tracks).flat().map(k=>k.t))].sort((a,b)=>a-b);
const issues=new Map();
function violation(id,time,distance){
  const previous=issues.get(id);
  if(!previous||distance<previous.distance)issues.set(id,{id,time,distance});
}
const solid=floor.fixtures.filter(q=>q.kind!=='drain');
// Actual wall segments, split at the apertures used by the episode.
function wall(x,y,w,h){solid.push({id:'wall '+[x,y],rect:{x,y,w,h}});}
wall(80,128,45,0);wall(131,128,25,0);
for(const x of [80,112]){wall(x,96,0,5);wall(x,107,0,21);}
wall(8,128,floor.exit.x-8,0);wall(floor.exit.x+floor.exit.w,128,80-(floor.exit.x+floor.exit.w),0);
for(let k=1;k<knots.length;k++){
  const start=knots[k-1],end=knots[k];
  const positions=ids.map(id=>[start,end].map(t=>samplePath(s.tracks[id],t).p));
  ids.forEach((id,i)=>{
    const [a,b]=positions[i];
    for(const q of solid){
      const {x,y,w,h}=q.rect;
      const d=Math.sqrt(segmentBoxDistanceSquared(a,b,{minX:x,maxX:x+w,minY:y,maxY:y+h}));
      if(d<NAVIGATION_ROOT_RADIUS_MM/1000-1e-8)violation(id+' / '+q.id,start,d);
    }
    for(let j=0;j<i;j++){
      const d=Math.sqrt(simultaneousDistanceSquared(a,b,...positions[j]));
      if(d<NAVIGATION_ROOT_SEPARATION_MM/1000-1e-8)violation(id+' / '+ids[j],start,d);
    }
  });
}
console.log('Duration',s.duration,'edits',s.cuts,'end',s.end,'tallies',s.tallies);
if(issues.size)console.table([...issues.values()].map(q=>({...q,time:q.time.toFixed(2),distance:q.distance.toFixed(2)})));
assert.equal(issues.size,0,'swept clearance');
assert.equal(ids.length,12);
assert.equal(s.tallies.length,8);
assert.equal(s.products.length,3);
assert(s.speech.slice(22,26).every(q=>q.start<86.2&&q.end>=90));
for(const id of ids)assert(samplePath(s.tracks[id],s.end).p[1]>floor.exit.y);
for(const product of s.products)assert(samplePath(product.keys,s.end).p[0]>=134);
console.log('Passed all routes, return counts, volunteer overlap and product arrivals.');
