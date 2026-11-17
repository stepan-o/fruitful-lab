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
const dialogue=[...fs.readFileSync(new URL('../DAY_ONE_INTRO.md',folder),'utf8')
  .matchAll(/^\*\*(\w+)\*\*\s+(.+)$/gm)].map(([,speaker,text])=>({speaker,text}));
const s=makeSequence(floor,dialogue);
const ids=Object.keys(s.cast);
const knots=[...new Set(Object.values(s.tracks).flat().map(k=>k.t))].sort((a,b)=>a-b);
const issues=new Map();
function violation(id,time,distance){
  const previous=issues.get(id);
  if(!previous||distance<previous.distance)issues.set(id,{id,time,distance});
}
const solid=[...floor.fixtures.filter(q=>q.kind!=='drain'),...floor.forgeHall.installations,
  ...floor.forgeHall.columns.map((rect,i)=>({id:'crane post '+i,rect}))];
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
assert(s.speech.slice(20,24).every(q=>q.start<86.2&&q.end>=90));
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
const request=s.speech.find(q=>q.speaker==='STILETTO' && q.text==='Hold that gate.');
assert(request,'the command is attached to the approved line');
assert(track[0].t>s.start && request.start<open && request.end<passage);
assert(samplePath(track,request.start).p[1]<hy && samplePath(track,passage+.8).p[1]>hy);
const stride=[];
for(let i=1;i<track.length && track[i-1].t<g.hold.end;i++){
  const a=track[i-1],b=track[i];
  if(b.t>a.t)stride.push(Math.hypot(b.p[0]-a.p[0],b.p[1]-a.p[1])/(b.t-a.t));
}
assert(Math.min(...stride)>1 && Math.max(...stride)-Math.min(...stride)<1e-8,
  'STILETTO keeps her walking pace from the street into Conveyor');
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


// Keep the material path continuous and the heavy traffic lanes clear of fixed equipment.
const hall=floor.forgeHall;
const keyed=items=>Object.fromEntries(items.map(item=>[item.id,item.rect]));
const plants=keyed(hall.installations), machines=keyed(floor.fixtures), roads=keyed(hall.runs);
const portal=floor.portals.find(p=>p.id==='dispatch-conveyor').rect;
assert.equal(roads.delivery.x,portal.x);
assert.equal(roads.delivery.w,portal.w);
assert(roads.delivery.y<=portal.y+portal.h);
const line=[plants.infeed,machines.intake,machines.wash,machines.belt,machines.forge,machines.output,plants['transfer-table']];
for(const [i,section] of line.entries()){
  assert(section.y<hall.carrierY && hall.carrierY<section.y+section.h);
  if(i)assert.equal(line[i-1].x+line[i-1].w,section.x,'carrier bed has a gap');
}
assert.equal(line.at(-1).x+line.at(-1).w,roads.outbound.x);
assert.equal(roads.outbound.y+roads.outbound.h,roads.transfer.y);
const overlaps=(a,b)=>a.x<b.x+b.w && b.x<a.x+a.w && a.y<b.y+b.h && b.y<a.y+a.h;
for(const road of Object.values(roads)){
  for(const obstacle of [...Object.values(plants),...Object.values(machines),...hall.columns]){
    assert(!overlaps(road,obstacle),'traffic lane overlaps fixed equipment');
  }
}
const press=markers.find(m=>m.id==='C4');
assert(hall.crane.base>press.height && hall.crane.base+hall.crane.height<15);
assert(press.rect.x>=hall.crane.rect.x && press.rect.x+press.rect.w<=hall.crane.rect.x+hall.crane.rect.w);
assert.equal(markers.filter(m=>m.room==='Forge hall').length,9);

// The reader serializes just the crossing. Leaving the line and walking home are ensemble actions.
const bell=s.beats.find(b=>b.name==='End of shift').at;
const moving=(id,t)=>samplePath(s.tracks[id],t).moving;
const position=(id,t)=>samplePath(s.tracks[id],t).p;
const between=(a,b,t)=>Math.hypot(...position(a,t).map((v,i)=>v-position(b,t)[i]));
const betweenPositions=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const resume=s.resume;
assert(s.departures.every(w=>!moving(w.id,bell-.01)),'the crew is still at work before the bell');
assert.equal(s.departures.filter(w=>moving(w.id,bell+1)).length,6,
  'six workers begin leaving while mae and kit shut down');
assert(s.departures.every(w=>moving(w.id,s.call-.01)),'the shout catches all eight in motion');
for(const worker of s.departures){
  assert(position(worker.id,s.call)[1]<position(worker.id,bell)[1]-2,
    worker.id+' has visibly left the station before the shout');
  assert(!moving(worker.id,s.call+.4),worker.id+' briefly freezes at the shout');
  assert(worker.at-worker.brake>=.7 && worker.at-worker.brake<=1.3,
    worker.id+' recovers after a momentary freeze');
  assert(moving(worker.id,worker.at+.01),worker.id+' resumes during the replies');
  assert(worker.at<s.dismissal-3,worker.id+' is already leaving before STILETTO dismisses them');
  for(let t=worker.at+.01;t<s.dismissal+2.6;t+=.1){
    const pace=betweenPositions(position(worker.id,t),position(worker.id,t+.01))/.01;
    assert(pace>=.8-1e-8,worker.id+' keeps a visible walking pace through the exchange');
  }
}
assert(s.departures.every(w=>moving(w.id,s.call+1.5)),
  'all eight are moving again as the replies overlap');
const endSpeech=s.speech.filter(q=>q.start>=bell && q.start<s.dismissal+1);
const [bellCue,...endCall]=endSpeech;
assert.equal(bellCue.speaker,'BELL');
assert.equal(bellCue.start,bell);
assert(bellCue.end-bellCue.start>=1 && endCall[0].start-bellCue.start>=2.5,
  'give the bell and the walkout time to land before STILETTO speaks');
assert.equal(endCall.length,6);
assert.equal(endCall[0].speaker,'STILETTO');
assert.equal(endCall.at(-1).speaker,'STILETTO');
assert.match(endCall.at(-1).text,/SHIFT’S OVER/);
const replies=endCall.slice(1,5);
assert(Math.min(...replies.map(q=>q.end))-Math.max(...replies.map(q=>q.start))>=2.5,
  'all four replies share a readable overlap before dismissal');
for(const reply of replies){
  assert(moving(reply.speaker,reply.start+.05),reply.speaker+' answers while walking');
}
assert(s.departures.every(w=>moving(w.id,s.dismissal+.1)),
  'STILETTO calls the dismissal after a crew that keeps walking');
for(const [id,off] of Object.entries(s.shutdown)){
  assert(!moving(id,off-.01) && !moving(id,off+.01),id+' finishes at the controls before walking away');
  const departure=s.departures.find(worker=>worker.id===id);
  assert(off<resume && moving(id,departure.at+.01));
}
assert(s.departures.every(w=>w.at<=resume+.25),'the brief freeze resolves across the whole crew');
const lastCheck=s.tallies.at(-1);
for(const [i,t] of s.tallies.entries()){
  assert.deepEqual(position('ed',t),position('ed',bell),'ed stays at the register');
  if(i)assert(t-s.tallies[i-1]>=.45-1e-8);
  assert(s.departures.some(w=>between('ed',w.id,t)<1.5),'the worker passes the clerk');
}
assert(lastCheck-s.tallies[0]<4,'complete all eight checkouts briskly');
const ending=s.speech.filter(q=>q.start>=bell);
let spokenThrough=ending[0].end;
for(const line of ending.slice(1)){
  const gap=s.editTime(line.start)-s.editTime(spokenThrough);
  assert(gap<1.4,'keep the ending dialogue connected');
  if(line.start>s.dismissal)assert(gap<1,'handoff straight from dismissal to register to yard');
  spokenThrough=Math.max(spokenThrough,line.end);
}
assert(s.duration-s.editTime(bell)<28,'keep the whole bell-to-blackout ending compact');
assert(moving('LIMEN',lastCheck+1.8) && !moving('ed',lastCheck+1.8));
const [morningCut,cut]=s.cuts;
assert.equal(s.cuts.length,2);
const morning=s.beats[0], gateBeat=s.beats.find(b=>b.name==='At the gate');
assert.equal(s.worldTime(0),morning.at);
assert.equal(s.editTime(morning.at),0);
assert.equal(s.worldTime(s.editTime(morningCut.at)),morningCut.to);
assert.equal(gateBeat.at,s.speech[4].start);
const entrants=ids.filter(id=>id!==id.toUpperCase());
assert.equal(entrants.length,10);
const frontTimes=[];
for(const id of [...entrants,'STILETTO']){
  const keys=s.tracks[id].filter(key=>key.t<=request.end);
  assert(keys[0].p[1]>floor.exit.y+4,id+' must begin in the yard');
  function crossing(axis,edge,sign){
    const i=keys.findIndex((key,i)=>i>0 && sign*(keys[i-1].p[axis]-edge)<0 && sign*(key.p[axis]-edge)>=0);
    assert(i>0,id+' must cross '+edge);
    const a=keys[i-1],b=keys[i],f=(edge-a.p[axis])/(b.p[axis]-a.p[axis]);
    return {t:a.t+(b.t-a.t)*f,across:a.p[1-axis]+(b.p[1-axis]-a.p[1-axis])*f};
  }
  const front=crossing(1,floor.exit.y,-1), radius=NAVIGATION_ROOT_RADIUS_MM/1000;
  assert(front.across>=floor.exit.x+radius && front.across<=floor.exit.x+floor.exit.w-radius);
  if(id==='STILETTO'){
    assert(track[0].t>morningCut.at && front.t<morningCut.to,'the supervisor enters in the omitted stretch of travel');
  }else{
    assert(front.t<morningCut.at,id+' must enter the front door on camera');
  }
  frontTimes.push(front.t);
  let prior=front.t;
  for(const pid of ['lobby-dispatch','dispatch-security']){
    const {x,y,w,h}=floor.portals.find(p=>p.id===pid).rect;
    const next=crossing(0,x+w/2,1);
    assert(next.t>prior && next.across>=y+radius && next.across<=y+h-radius);
    prior=next.t;
  }
}
assert(frontTimes.at(-1)>Math.max(...frontTimes.slice(0,-1)),'STILETTO follows the entire crew inside');
const walkingLines=s.speech.slice(0,4);
assert.equal(walkingLines[0].start,s.start);
assert.equal(walkingLines[0].speaker,'max');
assert.equal(s.speech[4].speaker,'LIMEN');
for(const [i,q] of walkingLines.entries()){
  assert(q.end<=morningCut.at || q.start>=morningCut.to,'finish the line before cutting');
  assert(moving(q.speaker,q.start) && moving(q.speaker,q.end-.01),'speak in motion');
  if(i)assert(s.editTime(q.start)-s.editTime(walkingLines[i-1].end)<.85,'keep the conversation moving');
  assert(between(q.speaker,'max',q.start)<4,'the speakers are within earshot');
}
assert(!s.speech.some(q=>q.start<gateBeat.at && q.end>morningCut.to),
  'the final approach to LIMEN stays silent');
assert(s.editTime(gateBeat.at)-s.editTime(walkingLines.at(-1).end)>3,
  'give the arrival several silent beats');
for(const t of [s.start+.2,morningCut.at-.01,morningCut.to+.01,gateBeat.at]){
  assert(Math.abs(s.worldTime(s.editTime(t))-t)<1e-7);
}
assert(cut.at>lastCheck && cut.to<s.yard);
for(const t of [bell,lastCheck,cut.to+.01,s.yard,s.end]){
  assert(Math.abs(s.worldTime(s.editTime(t))-t)<1e-7,'seek across the Dispatch cut');
}
for(let t=s.yard;t<s.yard+9.4;t+=.25){
  assert(moving('max',t) && moving('gus',t) && between('max','gus',t)<2,'the pair walk in step');
}
assert(ids.filter(id=>moving(id,s.yard)).length>=8,'the yard should have other people in motion');
const laugh=s.cues.find(c=>c.label==='laughs first').start;
assert(position('ed',laugh)[1]>floor.exit.y && between('ed','max',laugh)<8,'ed can hear max outside');
console.log('Passed hall material flow, road clearances, concurrent shutdown, register and walking exchange.');

const threat=s.speech.find(q=>q.text.startsWith("IF YOU DON'T GET ME"));
assert(threat && threat.end-threat.start>=6.5 && threat.end-threat.start<7);
assert(samplePath(s.tracks.max,threat.end+.05).moving,'max acts as the threat ends');
assert(s.gate.openings.some(([start,open])=>start<=threat.end && open>=threat.end));
