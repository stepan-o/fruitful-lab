// Run with node scripts/shifts/owner-playtest.cjs from apps/lab.
require('./typescript.cjs');
const assert=require('node:assert/strict');
const {Session}=require('../../lib/loopforge/intro/session.ts');
const {Intro}=require('../../lib/loopforge/intro/simulation.ts');
const {departure}=require('../../lib/loopforge/intro/shift-handoff.ts');
const {score}=require('../../lib/loopforge/intro/floor.ts');
const {tutorialOrders}=require('../../lib/loopforge/intro/playable-score.ts');
const {start,step,admitCommand,intent}=require('../../lib/loopforge/shifts/simulation.ts');
const {held}=require('../../lib/loopforge/shifts/stiletto-tutorial.ts');
const {resume}=require('../../lib/loopforge/shifts/playthrough.ts');
const {clockText,closingMinute}=require('../../lib/loopforge/shifts/factory-clock.ts');
const stations=['intake','wash','belt','forge'];
function advance(s,predicate){
  for(let n=0;n<12000;n++){if(predicate())return;if(held(s)||s.phase==='close')break;step(s);}
  throw Error('Missed checkpoint at '+s.tick+' ('+s.tutorial?.stage+')');
}
function command(s,action,who,station){
  const cmd=intent(s,'order-'+Object.keys(s.history).length,action,station??who,station?'conveyor':'security');
  if(station)cmd.incident=who;
  if(action==='reject-pass')cmd.incident=s.case.id;
  const result=admitCommand(s,cmd);assert.ok(result.accepted,result.reason);
}
async function main(){
  const h=new Session(()=>{},'test');h.configure(0);h.state='live';
  for(let i=0;i<tutorialOrders.length;i++){
    h.playing=true;h.awaitingBaseline=false;await h.progress(score.duration);
    assert.equal(h.sim.world.tick,tutorialOrders[i].tick);assert.ok(h.waiting);assert.equal(h.playing,false);
    assert.equal(h.confirm(i+1),false);assert.ok(h.confirm(i));assert.equal(h.confirm(i),false);
  }
  h.awaitingBaseline=false;await h.progress(score.duration);
  const source=departure(h.sim),skip=new Intro(undefined,undefined,true);
  while(!skip.finished)skip.step();
  assert.deepEqual(source,departure(skip));
  assert.equal(source.pieces.length,3);assert.equal(source.props['bob:id'].location.agent,'ed');
  const s=start('early',source);s.guided=true;command(s,'appoint','LIMEN');
  advance(s,()=>held(s));
  assert.deepEqual(s.tutorial.crew,['sam','max']);
  for(const [policy,pattern] of [['pass',[0,0,1,1]],['reject',[0,1,0,1]],['timeout',[0,1,1,0]]]){
    const run=structuredClone(s),t=run.tutorial;
    const tick=run.tick;step(run);assert.equal(run.tick,tick);
    stations.forEach((name,i)=>command(run,'post',t.crew[pattern[i]],name));
    advance(run,()=>run.case?.status==='open');assert.equal(run.line.shot,'security');
    if(policy!=='timeout')command(run,policy==='pass'?'issue-pass':'reject-pass','bob');
    advance(run,()=>held(run));
    assert.equal(run.case.status,policy==='pass'?'pass':'detention');
    assert.equal(t.crew.length,policy==='pass'?5:4);assert.equal(run.tasks.ed.duty,'clerk');assert.equal(run.tasks.gus.duty,'clerk');
    stations.forEach((name,i)=>command(run,'post',t.crew[i],name));
    advance(run,()=>t.stage==='live');
    assert.ok(run.completed.length-t.baseline>=2);assert.equal(run.line.shot,'conveyor');
    const newWorker=run.dialogue.passages.find(id=>!t.crew.includes(id));command(run,'assign',newWorker,'wash');
    const snapshot={guided:true,tick:run.tick,commands:Object.values(run.history).filter(r=>r.accepted).map(r=>r.cmd)};
    assert.deepEqual(resume(source,snapshot),run);
    advance(run,()=>run.phase==='close');console.log(policy,run.completed.length-source.pieces.length,'rack arrivals');
  }
  const swapped=start('early',source);swapped.guided=true;command(swapped,'appoint','STILETTO');
  advance(swapped,()=>!!swapped.line.handoff);assert.equal(swapped.completed.length,4);
  assert.equal(swapped.tutorial,undefined);assert.ok(swapped.marks.some(e=>e.text.startsWith('Did you know that')));
  assert.match(clockText(closingMinute),/^\d\d:\d\d$/);
  console.log('Eight Day 1 holds, equivalent skip, saved replay and both appointments passed.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
