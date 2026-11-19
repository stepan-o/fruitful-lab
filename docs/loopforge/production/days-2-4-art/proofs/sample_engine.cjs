// Export PUBLIC observations used by the illustration, from an optional concurrent ENGINE checkout.
const path = require('node:path');
const fs = require('node:fs');
const { createHash } = require('node:crypto');
const repository = path.resolve(process.argv[2]);
const dest = process.argv[3] || path.join(__dirname,'sampled-scenes.json');
const shifts = path.join(repository,'apps/lab/lib/loopforge/shifts');
require(path.join(repository,'apps/lab/scripts/shifts/typescript.cjs'));
const {start,intent,admitCommand,step} = require(path.join(shifts,'simulation.ts'));
const {until,restorePoint} = require(path.join(shifts,'replay.ts'));
const {project} = require(path.join(shifts,'wire.ts'));
const sha = filename => createHash('sha256').update(fs.readFileSync(path.join(shifts,filename))).digest('hex');
function command(s,action,target,room) {
  const reply=admitCommand(s,intent(s,'proof-'+action+'-'+target,action,target,room));
  if(!reply.accepted) throw Error(reply.reason);
}
function tick(s,n) { for(let i=0;i<n;i++)step(s); }
function shot(s) {
  const onFloor = Object.values(s.world.agents);
  return {
    tick:s.tick, day:s.day,
    agents:Object.fromEntries(onFloor.map(a=>[a.id,{positionMm:a.position,room:a.room,moving:s.tasks[a.id].moving}])),
    coverage:s.coverage,receipt:s.marks.filter(m=>m.kind==='report.received').at(-1)?.text,
  };
}
const samples={};
const failed=restorePoint('Missing ID');
samples['desk-signal']=shot(failed);
samples['desk-open']=shot(failed);
for(const [key,pass] of [['pass-issued',true],['custody',false]]){
  const run=structuredClone(failed);
  if(pass)command(run,'issue-pass','bob','security');
  until(run,s=>s.marks.some(m=>m.kind==='queue.advanced'));tick(run,12);
  samples[key]=shot(run);
  until(run,s=>s.tick===6100);samples[key].washFollowup={tick:run.tick,coverage:project(run).world.coverage};
}
for(const [key,slow] of [['reply-delivered',true],['reply-cut',false]]){
  const run=restorePoint('Conveyor chat');
  if(slow)command(run,'slow','STILETTO','conveyor');
  until(run,s=>s.chat==='finished'||s.chat==='interrupted');
  samples[key]={...shot(run),speech:run.marks.filter(m=>m.kind==='speech.delivered'&&m.room==='conveyor').slice(-3).map(m=>({speaker:m.actor,line:m.text,tick:m.tick}))};
}
for(const [key,lead] of [['line-clear','STILETTO'],['line-rushed','LIMEN']]){
  const run=start('late');command(run,'appoint',lead,'security');
  until(run,s=>s.marks.some(m=>m.kind==='handoff.started'&&m.anchor==='control.belt'&&m.subject==='D2-C1'));
  const image=shot(run);const first=run.marks.filter(m=>m.kind==='handoff.started'&&m.anchor==='control.belt').at(-1);
  until(run,s=>s.phase==='close');
  samples[key]={...image,firstHandoff:first.text,firstActor:first.actor,close:{tick:run.tick,cumulative:run.completed.length,
    occupants:project(run).items.filter(item=>item.status==='rack').map(p=>({id:p.id,at:p.at})),new:run.pieces.filter(piece=>piece.status==='rack').map(p=>({id:p.id,at:p.at})),coverage:run.coverage}};
}
for(const [key,lead] of [['crew-decides',null],['back-limen','LIMEN'],['back-stiletto','STILETTO']]){
  const run=restorePoint('Conflicting orders');
  const restoredAt=run.tick;
  if(lead)command(run,'endorse',lead,'security');
  const atCall=project(run);
  const publicEvent=lead?atCall.events.find(m=>m.kind==='endorsement.public'):null;
  const offRoom=atCall.agents.find(a=>a.id==='mae');
  const hearing=publicEvent?{tick:publicEvent.tick,eventSeq:publicEvent.seq,
    heard:[...run.heard[publicEvent.seq]],outside:atCall.agents.filter(a=>!run.heard[publicEvent.seq].includes(a.id)).map(a=>a.id)}:null;
  if(lead && (hearing.tick!==restoredAt || hearing.outside.join(',')!=='mae' || !hearing.heard.includes('sam')))throw Error('Reassess reviewer’s witness comparison on this source');
  if(offRoom.room!=='conveyor'||offRoom.duty!=='standing')throw Error('Recompose the outfeed inset for changed staging');
  const callFeed={tick:run.tick,featured:{id:offRoom.id,positionMm:[offRoom.x,offRoom.y],duty:offRoom.duty,room:offRoom.room},
    pressOperator:atCall.world.coverage[3],rack:atCall.items.filter(i=>i.status==='rack').map(i=>({id:i.id,at:i.at}))};
  until(run,s=>s.marks.some(m=>m.kind==='clash.resolved'));tick(run,7);
  samples[key]={...shot(run),restoredAt,callFeed,reviewOnlyHearing:hearing,orders:run.marks.filter(m=>m.kind==='speech.delivered'&&['The crew stays here. Checks first.','Crew. On the line. With me.'].includes(m.text)).map(m=>({speaker:m.actor,line:m.text,tick:m.tick})),
    publicBacking:run.marks.find(m=>m.kind==='endorsement.public')?.text??null,
    decisions:run.marks.filter(m=>m.kind==='worker.choice').map(m=>({worker:m.actor,action:m.text}))};
}
const data={sourceFiles:Object.fromEntries(['simulation.ts','replay.ts','conveyor.ts','navigation.ts','contract.ts','events.ts','wire.ts','inheritance.json'].map(p=>[p,sha(p)])),classification:'Read-only public scene observations from the TypeScript working source, plus a clearly tagged developer-only hearing record for the art review. The screenshots are authored illustrations of these observations.',samples};
fs.writeFileSync(dest,JSON.stringify(data,null,2)+'\n');
