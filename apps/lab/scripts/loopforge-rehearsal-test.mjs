import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { gateTipAt, makeSequence, samplePath } from '../../../docs/loopforge/game-design/day-one-sequence.mjs';
import { makeBuildMarkers } from '../../../docs/loopforge/game-design/day-one-build-markers.mjs';
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

// Check the raised boom against every route, including the return through Security.
// Its overhead extent changes monotonically within each lift or drop. The longest
// projection over each interval conservatively contains the entire moving arm.
const g=s.gate, [hx,hy]=g.hinge;
const times=new Set(knots);
for(const [start,open,release,closed] of g.openings){
  for(const [a,b] of [[start,open],[release,closed]]){
    if(!Number.isFinite(b))continue;
    times.add(a);times.add(b);
    for(let t=a;t<b;t+=1/60)times.add(t);
  }
}
const gateTimes=[...times].sort((a,b)=>a-b);
for(let i=1;i<gateTimes.length;i++){
  const a=gateTimes[i-1],b=gateTimes[i];
  const arm={minX:hx,maxX:Math.max(gateTipAt(g,a)[0],gateTipAt(g,b)[0]),minY:hy,maxY:hy};
  for(const id of ids){
    const from=samplePath(s.tracks[id],a).p,to=samplePath(s.tracks[id],b).p;
    assert(segmentBoxDistanceSquared(from,to,arm)>=(NAVIGATION_ROOT_RADIUS_MM/1000)**2,
      id+' clips the gate at '+a);
  }
}

const track=s.tracks.STILETTO;
const crossing=track.findIndex((key,i)=>i>0 && track[i-1].p[1]<hy && key.p[1]>=hy);
assert(crossing>0,'STILETTO must cross the Security gate');
const before=track[crossing-1], after=track[crossing];
const passage=before.t+(after.t-before.t)*(hy-before.p[1])/(after.p[1]-before.p[1]);
const [sx,sy]=samplePath(track,passage).p;
assert(sx>hx+.5 && sx<hx+g.length-.4,'cross inside the span of the raised boom');
const mark=samplePath(s.tracks.LIMEN,passage).p;
const open=g.openings[0][1];
assert.deepEqual(samplePath(track,open-.5).p,samplePath(track,open).p,'wait until the gate is up');
assert(passage>open && passage<g.hold.end);
assert.deepEqual(samplePath(s.tracks.LIMEN,g.hold.start).p,mark,'LIMEN has reached the post');
assert.deepEqual(samplePath(s.tracks.LIMEN,g.hold.end).p,mark,'hold position until STILETTO clears the threshold');
assert((sx-mark[0])*(hx-mark[0])+(sy-mark[1])*(hy-mark[1])<0,'cross behind LIMEN as he faces the controls');
let clearance=Infinity;
for(let i=1;i<knots.length;i++){
  const a=Math.max(24.6,knots[i-1]),b=Math.min(40.5,knots[i]);
  if(b<=a)continue;
  const ends=id=>[a,b].map(t=>samplePath(s.tracks[id],t).p);
  clearance=Math.min(clearance,Math.sqrt(simultaneousDistanceSquared(...ends('STILETTO'),...ends('LIMEN'))));
}
assert(clearance>2,'allow room for both supervisors and their blades');
const markers=makeBuildMarkers(floor,s);
assert.equal(new Set(markers.map(m=>m.id)).size,markers.length);
for(const {rect,base,height} of markers)assert(rect.w>0 && rect.h>0 && height>=0 && Number.isFinite(base));
console.log('STILETTO crossed behind LIMEN at',passage.toFixed(2),'s. Closest approach',clearance.toFixed(2),'m.');
