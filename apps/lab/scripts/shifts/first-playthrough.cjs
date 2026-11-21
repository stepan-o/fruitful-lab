// Run from apps/lab with node scripts/shifts/first-playthrough.cjs.
require('./typescript.cjs');
const assert=require('node:assert/strict');
const {Intro}=require('../../lib/loopforge/intro/simulation.ts');
const {departure}=require('../../lib/loopforge/intro/shift-handoff.ts');
const {start,step,intent,admitCommand}=require('../../lib/loopforge/shifts/simulation.ts');
const {resume}=require('../../lib/loopforge/shifts/playthrough.ts');
const {availableWorker,rate,team}=require('../../lib/loopforge/shifts/station-line.ts');
const {propCustodian}=require('../../lib/loopforge/encounters/props.ts');
const intro=new Intro();while(!intro.finished)intro.step();
const source=departure(intro);assert.equal(source.pieces.length,3);
function appointment(lead){
  const s=start('early',source);
  command(s,intent(s,'appoint','appoint',lead,'security'));return s;
}
function command(s,c){const receipt=admitCommand(s,c);assert.ok(receipt.accepted,receipt.reason);return c;}
function until(s,condition){
  for(let i=0;i<7000;i++){if(condition())return;if(s.phase==='close')break;step(s);}
  throw Error('Missed checkpoint '+s.tick+' '+s.line.opening);
}
function snapshot(s){return {tick:s.tick,commands:Object.values(s.history).filter(r=>r.accepted).map(r=>r.cmd)};}
function close(s){until(s,()=>s.phase==='close');return s.completed.length-source.pieces.length;}
const wait=appointment('STILETTO');until(wait,()=>wait.line.handoff);
const remaining=(wait.dialogue.bell-wait.tick)/20;
assert.equal(wait.spent,null);assert.equal(wait.completed.length,4);
assert.equal(wait.line.cells[3].id,'D2-C2');assert.equal(wait.dialogue.passages.length,10);
assert.equal(propCustodian(wait.world,'bob:id'),'ed');assert.equal(propCustodian(wait.world,'ed:id'),'ed');
assert.ok(wait.world.agents.sam.beliefs['ed.admits.pickup']);assert.ok(!wait.world.agents.bob.beliefs['ed.admits.pickup']);
assert.equal(wait.dialogue.windows.filter(w=>w.slot==='conveyor'&&w.spent).length,1);
assert.equal(wait.marks.filter(e=>e.kind==='protocol.silence').length,2);
function clearForge(s){
  return command(s,{...intent(s,'clear-second','clear','forge','conveyor'),incident:'D2-C2/max'});
}
const clear=resume(source,snapshot(wait));assert.deepEqual(clear,wait);
const c=clearForge(clear);command(clear,c);
const ticks=[];
for(let i=0;i<60;i++){
  step(clear);if([9,49,59].includes(i))ticks.push(...clear.marks.filter(e=>e.tick===clear.tick&&['clear.received','handoff.finished','rack.arrival'].includes(e.kind)).map(e=>e.kind));
}
assert.deepEqual(ticks,['clear.received','handoff.finished','rack.arrival']);
assert.equal(close(clear),2);assert.equal(close(structuredClone(wait)),1);
console.log('LIMEN', {entry:wait.tick,bell:wait.dialogue.bell,remaining,arrivalAfterSeconds:3,clearWeek:clear.completed.length,watchWeek:4});
const base=appointment('LIMEN');until(base,()=>base.case?.status==='open');
function order(s,id,station){
  command(s,{...intent(s,'order-'+id+'-'+station,'assign',station,'conveyor'),incident:id});
}
function regular(pass,policy){
  const s=structuredClone(base),moves=[],ordered=new Set();
  if(pass)command(s,intent(s,'pass','issue-pass','bob','security'));
  while(s.phase==='shift'){
    for(const [id,station] of [['bob','wash'],['jo','belt']]){
      if(!ordered.has(id)&&availableWorker(s,id)){order(s,id,station);ordered.add(id);}
    }
    if(policy==='recover'&&!ordered.has('kit')&&availableWorker(s,'kit')){order(s,'kit','wash');ordered.add('kit');}
    if(policy==='move'&&!ordered.has('kit')&&availableWorker(s,'kit')){order(s,'kit','forge');ordered.add('kit');}
    if(policy==='move'&&!moves.length&&team(s,3).includes('kit')&&team(s,2).includes('jo')){
      moves.push([s.tick,rate(team(s,2),2),rate(team(s,3),3)]);order(s,'kit','belt');
    }
    if(policy==='move'&&moves.length===1&&team(s,2).includes('kit'))moves.push([s.tick,rate(team(s,2),2),rate(team(s,3),3)]);
    step(s);
  }
  const arrivals=s.marks.filter(e=>e.kind==='rack.arrival');
  console.log('STILETTO',{pass,policy,case:base.tick,bell:s.dialogue.bell,first:arrivals[0]?.tick,last:arrivals.at(-1)?.tick,day:arrivals.length,week:s.completed.length,moves});
  assert.equal(new Set(s.completed).size,s.completed.length);
  if(policy==='move')assert.deepEqual(moves.map(row=>row.slice(1)),[[88,138],[148,96]]);
  if(policy==='recover')assert.ok(arrivals.length>0);
  assert.deepEqual(resume(source,snapshot(s)),s);
  return arrivals.length;
}
assert.ok(regular(true,'matched')>0);assert.equal(regular(false,'matched'),0);
regular(false,'recover');regular(true,'move');

// Exercise the shipped worker message handler with the scheduler stopped.
// Each candidate is already legal in its matched live checkpoint.
const receipts=[];
let heartbeat;
global.self={postMessage:m=>receipts.push(m)};
const realInterval=global.setInterval;
try{
  global.setInterval=fn=>{heartbeat=fn;};
  require('../../lib/loopforge/shifts/playthrough.worker.ts');
}finally{global.setInterval=realInterval;}
function pausedOrder(s,cmd){
  const post=data=>self.onmessage({data});
  post({type:'join',source,progress:snapshot(s)});
  post({type:'suspend',on:true});
  receipts.length=0;
  post({type:'command',cmd});
  heartbeat();
  assert.deepEqual(receipts,[{type:'notice',id:cmd.id,accepted:false,reason:'Shift paused. Resume play to issue an order.'}]);
  post({type:'suspend',on:false});
  assert.equal(receipts.length,1,'Resume must not execute a rejected order');
  post({type:'command',cmd});
  assert.deepEqual(receipts[1].cmd,cmd);
  assert.equal(receipts[1].floor.tick,s.tick);
}
pausedOrder(base,intent(base,'paused-pass','issue-pass','bob','security'));
pausedOrder(wait,{...intent(wait,'paused-clear','clear','forge','conveyor'),incident:'D2-C2/max'});
const staffing=structuredClone(base);
command(staffing,intent(staffing,'admit-bob','issue-pass','bob','security'));
until(staffing,()=>availableWorker(staffing,'bob')&&staffing.dialogue.phase==='work');
pausedOrder(staffing,{...intent(staffing,'paused-wash','assign','wash','conveyor'),incident:'bob'});
console.log('Paused worker rejected all three orders and accepted each explicit retry.');
