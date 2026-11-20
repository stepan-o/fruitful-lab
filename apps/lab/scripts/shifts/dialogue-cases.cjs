require('./typescript.cjs');
const assert=require('node:assert/strict');
const {start,step,nextMorning,intent,admitCommand}=require('../../lib/loopforge/shifts/simulation.ts');
const {restorePoint,until}=require('../../lib/loopforge/shifts/replay.ts');
const {freshDialogue}=require('../../lib/loopforge/shifts/dialogue-state.ts');
const {crossed,openWindow,updateSpeech,cardContact,cardQuestions,observe,heard,phrase,partners,available,occupied,knows,workers}=require('../../lib/loopforge/shifts/dialogue.ts');
const {remember}=require('../../lib/loopforge/shifts/events.ts');
const {project}=require('../../lib/loopforge/shifts/wire.ts');
const {morningBids}=require('../../lib/loopforge/shifts/morning.ts');
const {workmates}=require('../../lib/loopforge/shifts/workmates.ts');
const {meters}=require('../../lib/loopforge/shifts/navigation.ts');
const {scenes,chats}=require('../../lib/loopforge/shifts/manuscript.json');
const checks=[];
function test(name,fn){fn();checks.push(name);console.log('PASS',name);}
function command(s,action,target,room){assert(admitCommand(s,intent(s,action+'-'+s.day,action,target,room)).accepted);}
function advance(s,condition){until(s,condition);return s;}
function eqAfterSave(s,condition){const copy=structuredClone(s);advance(s,condition);advance(copy,condition);assert.deepEqual(s,copy);}
function pairRoom(slot,pair){
  const s=start();command(s,'appoint','LIMEN','security');s.dialogue=freshDialogue(3241);
  s.dialogue.phase=slot==='departure'?'departure':'work';s.dialogue.order=workers;s.queue=[];
  for(const [i,id] of workers.entries()){
    s.world.agents[id].position=meters(110+i,125);
    s.tasks[id].duty='outside';s.tasks[id].path=[];
  }
  for(const [i,id] of pair.entries())place(s,id,i,slot);
  return s;
}
function place(s,id,i,slot){
  const p=meters(125.4+(i%3)*1.05,slot==='conveyor'?143:128-Math.floor(i/3)*1.1);
  s.world.agents[id].position=p;s.tasks[id].destination=p;s.tasks[id].path=[];
  s.tasks[id].duty=slot==='departure'?'departing':slot==='security'?'waiting':'working';
  if(slot==='security')s.queue.push(id);
  if(slot==='conveyor'){s.dialogue.posts[id]=p;s.dialogue.faces[id]='tray';}
}
function talk(s,n){while(n--){s.tick++;updateSpeech(s);cardContact(s);}}
function witness(s,id,key){remember(s,id,key,'controlled firsthand receipt',true);}
function slotEvents(s,slot){return s.dialogue.windows.filter(w=>w.slot===slot&&w.spent);}
const clone=structuredClone;
const spent=s=>s.marks.filter(e=>e.kind==='slot.spent').map(e=>e.text);
test('G5 · same raised lip, two reachable partners',()=>{
  const early=restorePoint('G5 · early cutoff'),late=restorePoint('G5 · late cutoff');
  const same=clone(late);same.dialogue.cutoff-=2;assert.deepEqual(same,early);
  for(const [s,key,id] of [[early,'K08','ben'],[late,'K10','ed']]){
    advance(s,r=>r.marks.some(e=>e.kind==='slot.spent'&&e.text===key));
    assert(partners(s,'departure','bob','ed')&&partners(s,'departure','bob','ben'));
    assert.equal(s.dialogue.intent.bob,id);
    assert.equal(!!s.world.agents.bob.beliefs['desk.lead'],key==='K10');
    eqAfterSave(s,r=>r.phase==='close');assert(knows(s,'bob',key==='K10'?'ed.invitation':'boot.lead'));
    assert.equal(s.world.props['bob:id'].location.agent,'ed');assert.equal(s.world.props['ed:id'].location.agent,'ed');
    assert.equal(slotEvents(s,'departure').length,1);assert.equal(spent(s).filter(k=>k==='K03').length,1);
  }
  assert.deepEqual(early.completed,late.completed);
});
test('4D/W1 · only the personal hand receipt changes ben’s decision',()=>{
  const a=restorePoint('4D · firsthand return'),b=restorePoint('W1 · reported return');
  assert.deepEqual(project(a),project(b));assert.deepEqual(a.tasks,b.tasks);assert.equal(a.dialogue.random,b.dialogue.random);
  const clean=clone(a.world.agents.ben.beliefs);delete clean['hand.return'];assert.deepEqual(clean,b.world.agents.ben.beliefs);
  for(const [s,goes] of [[a,true],[b,false]]){
    advance(s,r=>r.tasks.ben.choice!=='');assert(knows(s,'ben','jo.crossed.4')&&knows(s,'ben','jo.reported.return'));
    assert.equal(s.tasks.ben.choice,goes?'go':'stay');assert.equal(s.tasks.jo.choice,'go');
    advance(s,r=>r.dialogue.bellReached);
    assert.equal(s.marks.some(e=>e.day===4&&e.kind==='post.arrived'&&e.actor==='ben'),goes);
    assert.equal(knows(s,'mae','ben.reported.bob'),goes);
    assert.equal(s.pieces.filter(p=>p.status==='rack').length,0);
    assert.equal(s.called,'kit');
    const departed=s.marks.find(e=>e.day===4&&e.kind==='worker.followed'&&e.subject==='jo');
    assert(!s.marks.some(e=>e.seq>departed.seq&&e.kind==='speech.delivered'&&e.actor==='LIMEN'&&e.subject==='jo'));
  }
});
test('G1 · second distinct authorized crossing opens a single crowd opportunity',()=>{
  const s=pairRoom('security',['bob','jo','kit','ben']);
  s.dialogue.authorized=['sam','max'];crossed(s,'sam');crossed(s,'sam');crossed(s,'lou');assert.equal(s.dialogue.windows.length,0);
  crossed(s,'max');crossed(s,'max');assert.equal(s.dialogue.windows.length,1);assert.deepEqual(s.dialogue.passages,['sam','max']);
  assert(s.coverage.every(x=>!x));talk(s,2);assert.equal(slotEvents(s,'security').length,1);
  const empty=pairRoom('security',[]);empty.dialogue.authorized=['sam','max'];crossed(empty,'sam');crossed(empty,'max');talk(empty,30);assert.equal(slotEvents(empty,'security').length,0);
});
test('G2 · actual positions and assignments govern staffed neighbors',()=>{
  const s=pairRoom('conveyor',['ed','sam']);assert(partners(s,'conveyor','ed','sam'));s.tasks.ed.duty='cleared';
  assert(!partners(s,'conveyor','ed','sam'));s.tasks.ed.duty='working';
  s.dialogue.faces.ed='forge';assert(!partners(s,'conveyor','ed','sam'));s.dialogue.faces.ed='tray';
  s.world.agents.ed.position=meters(135,143);
  assert(!occupied(s,'ed'));assert(!partners(s,'conveyor','ed','sam'));
  const a=start('early'),b=start('late');for(const r of [a,b]){command(r,'appoint','STILETTO','security');advance(r,q=>q.dialogue.passages.length===10);}
  assert.notDeepEqual(a.dialogue.passages,b.dialogue.passages);for(const r of [a,b]){advance(r,q=>occupied(q,'ed')&&occupied(q,'gus'));assert(!r.case);}
});
test('G3 · one seeded winner and debit per physical work opportunity',()=>{
  const s=pairRoom('conveyor',['bob','mae','jo','kit','sam','ed']);
  witness(s,'sam','search');witness(s,'sam','ed.logged.card');openWindow(s,'conveyor','pause1');updateSpeech(s);
  const before=clone(s);talk(s,1);talk(before,1);assert.deepEqual(s,before);
  const after=clone(s);openWindow(s,'conveyor','pause1');talk(s,240);talk(after,240);assert.deepEqual(s,after);
  openWindow(s,'conveyor','pause2');talk(s,240);openWindow(s,'conveyor','pause3');talk(s,30);
  assert.equal(slotEvents(s,'conveyor').length,2);assert.equal(new Set(s.dialogue.windows.map(w=>w.id)).size,2);
});
test('G4 · each of seven workers can seek bob, ed or gus on sourced evidence',()=>{
  for(const id of workers.filter(x=>!['bob','ed','gus'].includes(x)))for(const clerk of ['bob','ed','gus']){
    const s=pairRoom('conveyor',[id,clerk]);const fact={bob:'saw.pass',ed:'saw.clerk.ed',gus:'saw.clerk.gus'}[clerk];
    for(const k of ['search','inquire.card',fact])witness(s,id,k);
    s.pass={holder:'bob',issuer:'Producer',day:2,valid:true};
    const can=()=>cardQuestions(s,'conveyor').some(x=>x.pair[0]===id&&x.pair[1]===clerk);
    assert(can());s.tasks[clerk].duty='clerk';assert(!can());s.tasks[clerk].duty='working';delete s.world.agents[id].beliefs[fact];assert(!can());
  }
});
test('G6 · only a clear view of the two edges licenses gus’s report',()=>{
  const a=pairRoom('conveyor',['gus','lou','ed']);a.lead='STILETTO';a.dialogue.errand='rack';
  for(const who of ['gus','lou','ed']){a.world.agents[who].position={gus:meters(134.9,143.8),lou:meters(134,143),ed:meters(134,142.1)}[who];a.tasks[who].destination=a.world.agents[who].position;a.dialogue.posts[who]=a.world.agents[who].position;}
  witness(a,'lou','search');const b=clone(a);b.dialogue.occluded.push('gus');workmates(a);workmates(b);
  assert(available(a,'K05','conveyor'));assert(!available(b,'K05','conveyor'));assert(!knows(a,'bob','lou.reports.edges'));
  delete b.world.agents.gus.beliefs['poor.pickup.view'];witness(b,'kit','search');assert(!available(b,'K07','conveyor'));
});
test('G7/G8 · release, loss of reach, first addressed phrase and overnight reset',()=>{
  const s=pairRoom('departure',['bob','ben']);openWindow(s,'departure','exit');updateSpeech(s);const before=clone(s);
  s.tasks.ben.duty='outside';talk(s,2);assert.equal(slotEvents(s,'departure').length,0);
  place(s,'ben',1,'departure');talk(s,2);assert.equal(slotEvents(s,'departure').length,1);
  talk(before,1);before.tasks.ben.duty='outside';talk(before,1);place(before,'ben',1,'departure');talk(before,200);
  assert.equal(spent(before).length,1);assert(!knows(before,'bob','boot.lead'));
  const lone=pairRoom('departure',['bob']);openWindow(lone,'departure','exit');talk(lone,90);assert.equal(spent(lone).length,0);
  talk(s,180);assert(knows(s,'bob','boot.lead'));s.phase='close';nextMorning(s);command(s,'appoint','LIMEN','security');
  assert.equal(s.dialogue.windows.length,0);assert(knows(s,'bob','boot.lead'));
});
test('G9 · an acknowledgment, a visible photograph and hand contact are separate',()=>{
  const s=pairRoom('departure',['bob','ed']);witness(s,'bob','sam.reports.pickup');openWindow(s,'departure','exit');updateSpeech(s);
  for(let i=0;i<200&&!knows(s,'bob','ed.acknowledged');i++)talk(s,1);
  assert(knows(s,'bob','ed.acknowledged'));assert(!knows(s,'bob','ed.admits.pickup'));assert.equal(s.world.props['bob:id'].location.agent,'ed');
  for(let i=0;i<200&&s.dialogue.transfer!=='recognized';i++)talk(s,1);
  assert.equal(s.dialogue.transfer,'recognized');assert.equal(s.world.props['bob:id'].location.agent,'ed');
  const away=clone(s);away.world.agents.ed.position=meters(135,144);talk(away,50);assert.equal(away.world.props['bob:id'].location.agent,'ed');
  talk(s,50);cardContact(s);assert.equal(s.world.props['bob:id'].location.agent,'bob');assert.equal(s.world.props['ed:id'].location.agent,'ed');
  assert(!knows(s,'bob','missing.original'));assert.equal(s.marks.filter(e=>e.kind==='credential.returned').length,1);
});
test('G10 · vision, hearing, acoustical masking and a second observer',()=>{
  const s=pairRoom('security',['jo','ben','kit']);s.dialogue.occluded=['kit'];
  assert(!observe(s,'jo','test.palm',s.world.agents.jo.position).includes('kit'));
  assert(heard(s,phrase('jo','He laid mine in my hand like an egg.','ben'),'security','4A').includes('kit'));
  s.dialogue.masked=['kit'];assert(!heard(s,phrase('jo','He laid mine in my hand like an egg.','ben'),'security','4A').includes('kit'));
  const a=restorePoint('G5 · early cutoff'),b=clone(a);
  for(let i=0;i<100;i++){project(a);project(a);step(a);step(b);}assert.deepEqual(a,b);
});
test('G11 · a recovered worker can seek company at work and outside',()=>{
  for(const [slot,pair,key] of [['conveyor',['bob','mae'],'V15'],['departure',['bob','ben'],'W05']]){
    const s=pairRoom(slot,pair);s.world.agents.bob.beliefs['missing.original'].value=false;
    openWindow(s,slot,'fresh');const away=clone(s);away.tasks[pair[1]].duty='outside';talk(s,200);talk(away,200);
    assert.deepEqual(spent(s),[key]);assert(s.dialogue.replied);assert.equal(spent(away).length,0);
  }
});
assert.equal(Object.keys(chats).length,60);assert.equal(Object.keys(scenes).filter(k=>!/^([CM])\d\d$/.test(k)).length,37);
console.log(checks.length+' matched groups passed');
