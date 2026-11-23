require('./typescript.cjs');
const assert=require('node:assert/strict');
const {start,intent,admitCommand,nextMorning}=require('../../lib/loopforge/shifts/simulation.ts');
const {restorePoint,until}=require('../../lib/loopforge/shifts/replay.ts');
const {morningBids}=require('../../lib/loopforge/shifts/morning.ts');
const {knows,available}=require('../../lib/loopforge/shifts/dialogue.ts');
const {scenes}=require('../../lib/loopforge/shifts/manuscript.json');

const checked=new Set();
function verify(id,condition){assert(condition,id);checked.add(id);}
function order(s,action,target,room='security'){
  assert(admitCommand(s,intent(s,action+'-'+s.day,action,target,room)).accepted);
}
const today=(s,kind)=>s.marks.filter(e=>e.day===s.day&&e.kind===kind);
const words=(s,text)=>today(s,'speech.delivered').find(e=>e.text===text);
const spent=(s,key)=>today(s,'slot.spent').some(e=>e.text===key);
const close=s=>until(s,r=>r.phase==='close');
const clone=structuredClone;

const s=start();
verify('2P',morningBids(s).LIMEN===scenes['2P'][0][1]);
order(s,'appoint','LIMEN');
until(s,r=>r.case?.status==='open');
const welcome=words(s,scenes['2B'][0][1]);
verify('2A',words(s,scenes['2A'][0][1]).tick<welcome.tick);
verify('2B',welcome.tick<today(s,'queue.called')[0].tick&&s.heard[welcome.seq].includes('bob'));
verify('2C',today(s,'register.entry').length===1&&knows(s,'sam','ed.logged.card')&&!knows(s,'bob','ed.logged.card'));
const detained=clone(s);close(detained);
verify('P1',today(detained,'custody.admitted').length===1&&today(detained,'custody.release').length===1);
order(s,'issue-pass','bob');close(s);
verify('2D',spent(s,'K01')&&today(s,'pass.issued').length===1&&today(s,'pass.expired').length===1);
verify('2E',today(s,'check.return').length===1&&knows(s,'LIMEN','against.protocol')&&knows(s,'jo','desk.released'));
verify('2F',spent(s,'K03')&&spent(s,'V01')&&today(s,'chat.interrupted').length===1);
verify('2G',spent(s,'K08')&&knows(s,'bob','boot.lead'));
verify('H2',!knows(s,'bob','desk.lead')&&s.world.props['bob:id'].location.agent==='ed');
const late=restorePoint('G5 · late cutoff');close(late);
verify('H1',spent(late,'K10')&&knows(late,'bob','ed.invitation')&&late.world.props['bob:id'].location.agent==='ed');

nextMorning(late);order(late,'appoint','LIMEN');until(late,r=>r.dialogue.phase==='work');
assert.equal(late.world.props['bob:id'].location.agent,'bob','ed keeps the next-morning appointment');

nextMorning(s);verify('3P',morningBids(s).STILETTO===scenes['3P'][0][1]);
order(s,'appoint','LIMEN');until(s,r=>r.dialogue.phase==='work');
verify('3A',!!words(s,scenes['3A'][0][1]));
verify('3B',knows(s,'LIMEN','two.hands.one.card')&&!!words(s,scenes['3B'][4][1]));
verify('3C',available(s,'K02','security')&&!s.pass.valid);
const accel=clone(s),bruise=clone(s);
order(accel,'accelerate','LIMEN');close(accel);
verify('P2',!!words(accel,scenes.P2[0][1])&&!today(accel,'check.return').length);
nextMorning(accel);verify('N1',morningBids(accel).LIMEN===scenes.N1[0][1]);
order(accel,'appoint','LIMEN');until(accel,r=>r.dialogue.phase==='work');assert(words(accel,scenes.N1[1][1]));
order(bruise,'rush','STILETTO','conveyor');close(bruise);
verify('A1',bruise.dialogue.injury==='heard'&&knows(bruise,'LIMEN','mae.injury.report')&&knows(bruise,'LIMEN','saw.bruise'));
const blinded=clone(bruise);delete blinded.world.agents.LIMEN.beliefs['saw.bruise'];
assert.notEqual(morningBids(bruise).LIMEN,morningBids(blinded).LIMEN);
close(s);
verify('3D',knows(s,'jo','hand.return')&&knows(s,'kit','hand.return')&&!knows(s,'bob','hand.return'));
verify('3E',spent(s,'V03')&&knows(s,'LIMEN','reckless'));
verify('3F',available(s,'W02','departure')&&knows(s,'mae','tray.set'));
nextMorning(s);verify('4P',morningBids(s).LIMEN===scenes['4P'][0][1]);
order(s,'appoint','LIMEN');until(s,r=>r.pressure==='clash');
verify('4A',knows(s,'ben','jo.reported.return')&&today(s,'gesture.seen').some(e=>e.text==='demonstrated.open.palm'));
verify('4B',!!words(s,scenes['4B'][4][1]));
verify('4C',spent(s,'Q06')&&spent(s,'V02'));
for(const lead of ['LIMEN','STILETTO']){
  const endorsed=clone(s);order(endorsed,'endorse',lead);close(endorsed);
  if(lead==='LIMEN')verify('E1',!today(endorsed,'worker.followed').length);
  else verify('E2',spent(endorsed,'E2')&&!spent(endorsed,'V06')&&endorsed.world.agents.mae.beliefs['kit.reported.order'].source.includes('Producer#'));
}
close(s);verify('4D',s.tasks.ben.choice==='go'&&s.tasks.jo.choice==='go');
verify('4E',spent(s,'V06')&&knows(s,'mae','ben.reported.bob'));
verify('4F',s.called==='kit'&&s.pieces.every(p=>p.status!=='rack')&&available(s,'W01','departure'));
const report=restorePoint('W1 · reported return');close(report);
verify('W1',report.tasks.ben.choice==='stay'&&!knows(report,'mae','ben.reported.bob'));

const swapped=start();order(swapped,'appoint','STILETTO');until(swapped,r=>r.dialogue.bellReached);
verify('S1',swapped.dialogue.passages.length===10&&!swapped.case&&!!words(swapped,scenes['2B'][0][1]));
verify('S2',!!words(swapped,scenes.S2[0][1])&&today(swapped,'rack.arrival').length>0);
verify('R2',spent(swapped,'K04')&&spent(swapped,'K05')&&knows(swapped,'sam','ed.admits.pickup')&&!knows(swapped,'bob','ed.admits.pickup'));
const missed=clone(swapped);missed.dialogue.masked.push('bob');close(missed);
nextMorning(missed);order(missed,'appoint','STILETTO');until(missed,r=>r.dialogue.phase==='work');
verify('R3',!!words(missed,scenes.R3[0][1])&&knows(missed,'bob','sam.reports.pickup'));
close(swapped);nextMorning(swapped);order(swapped,'appoint','STILETTO');close(swapped);
verify('Q1',spent(swapped,'V12')&&spent(swapped,'W03')&&knows(swapped,'jo','elbow.helped'));
assert(knows(swapped,'bob','sam.reports.pickup') && swapped.world.props['bob:id'].location.agent==='ed');
nextMorning(swapped);order(swapped,'appoint','STILETTO');until(swapped,r=>r.dialogue.phase==='work');
verify('R4',today(swapped,'photo.recognized')[0].tick<today(swapped,'credential.returned')[0].tick&&swapped.world.props['bob:id'].location.agent==='bob');
assert.deepEqual([...checked].sort(),Object.keys(scenes).filter(k=>!/^([CM])\d\d$/.test(k)).sort());
console.log(checked.size+' conditional scene readings passed: '+[...checked].join(', '));
