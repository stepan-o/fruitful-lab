require('./typescript.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {performance}=require('node:perf_hooks');
const {start,admitCommand,intent,step,nextMorning,deskWindowTicks}=require('../../lib/loopforge/shifts/simulation.ts');
const {restorePoint,until}=require('../../lib/loopforge/shifts/replay.ts');
const {full,hash,project,diff,read,schema,envelope}=require('../../lib/loopforge/shifts/wire.ts');
const dir=path.resolve(__dirname,'../../public/loopforge-shifts/fixtures');
const writing=process.argv.includes('--write');
const write=(file,data)=>{
  const bytes=JSON.stringify(data)+'\n';
  if(writing){fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,file),bytes);}
  else assert.equal(fs.readFileSync(path.join(dir,file),'utf8'),bytes,file);
};
const scenarios=[
  ['missing-pass','Missing ID','issue-pass','bob','security'],
  ['missing-detention','Missing ID'],
  ['morning-limen','Morning bids','appoint','LIMEN','security'],
  ['morning-stiletto','Morning bids','appoint','STILETTO','security'],
  ['chat-rushed','Conveyor chat'],
  ['chat-slow','Conveyor chat','slow','STILETTO','conveyor'],
  ['clash-unaided','Conflicting orders'],
  ['clash-limen','Conflicting orders','endorse','LIMEN','security'],
  ['clash-stiletto','Conflicting orders','endorse','STILETTO','security']
];
async function main(){
 const results=[],outcomes={},cache=new Map();
 for(const [key,name,action,target,room] of scenarios){
  if(!cache.has(name))cache.set(name,restorePoint(name));
  const run=structuredClone(cache.get(name)),at=run.tick,seq=run.marks.at(-1)?.seq??0;
  const initial=await full(run),priorHash=await hash(run),commands=[];
  const cmd=action?intent(run,'compare-'+key,action,target,room):null;
  if(cmd){assert(admitCommand(run,cmd).accepted);commands.push(envelope('INPUT_COMMAND',1,{client_cmd_id:cmd.id,tick_target:cmd.tick,cmd}));}
  const baseline=await full(run),f=await read(undefined,'FULL_SNAPSHOT',baseline);
  step(run);const delta=await diff(f,run);assert.equal((await read(f,'FRAME_DIFF',delta)).hash,await hash(project(run)));
  const restore=structuredClone(run);until(run,r=>r.phase==='close');until(restore,r=>r.phase==='close');
  assert.equal(await hash(restore),await hash(run));
  const events=run.marks.filter(e=>e.seq>seq);
  assert(events.every((e,i)=>e.seq===seq+i+1&&e.tick>=at&&e.at.every(Number.isSafeInteger)));
  const result={file:key+'.json',scenario:name,initial_private_hash:priorHash,initial_public_hash:initial.step_hash,
   terminal_public_hash:await hash(project(run)),rack_this_shift:run.pieces.filter(p=>p.status==='rack').length,
   end_tick:run.tick};
  const fixture={schema_version:schema,scenario:name,day:run.day,initial,commands,accepted_baseline:baseline,
   hearing_by_event:Object.fromEntries(Object.entries(run.heard).filter(([id])=>Number(id)>seq)),first_diff:envelope('FRAME_DIFF',2,delta),events,terminal:await full(run),result};
  write(result.file,fixture);results.push(result);outcomes[key]={run,events,cmd};
 }
 for(const [a,b] of [[0,1],[2,3],[4,5],[6,7],[6,8]])assert.equal(results[a].initial_private_hash,results[b].initial_private_hash);
 const pass=outcomes['missing-pass'],jail=outcomes['missing-detention'];
 const advanced=pass.events.find(e=>e.kind==='queue.advanced');
 assert.equal(advanced.actor,'jo');
 for(const p of [pass,jail]){
  const resolved=p.events.find(e=>e.kind==='case.resolved');
  assert(p.events.find(e=>e.kind==='queue.advanced').seq>resolved.seq);
 }
 assert(jail.run.marks.some(e=>e.kind==='handoff.finished'&&e.seq<jail.events.find(e=>e.kind==='case.resolved').seq));
 const occupiedHold=start('early');
 admitCommand(occupiedHold,intent(occupiedHold,'hold-appointment','appoint','LIMEN','security'));
 occupiedHold.nextIntake=occupiedHold.tick+6000;
 until(occupiedHold,r=>r.case?.status==='open');
 // An Intake operation can become ready during precisely the same Security hold.
 occupiedHold.nextIntake=occupiedHold.tick;
 until(occupiedHold,r=>r.marks.some(e=>e.tick>r.case.opened&&e.kind==='handoff.finished'));
 assert.equal(occupiedHold.case.status,'open');
 assert(jail.events.some(e=>e.kind==='report.received'&&e.actor==='LIMEN'));
 assert(!jail.events.some(e=>e.kind==='station.coverage'&&e.actor==='bob'));
 assert(jail.events.some(e=>e.kind==='custody.release'));assert(pass.events.some(e=>e.kind==='pass.expired'));
 const repeat=structuredClone(pass.run);nextMorning(repeat);
 repeat.nextQueue=['sam','max','bob','jo','kit','mae','lou','ben'];
 assert(admitCommand(repeat,intent(repeat,'d3-bid','appoint','LIMEN','security')).accepted);
 // Check renewal on a route with no earlier expedition or peer demand.


 until(repeat,r=>r.case?.status==='open');
 const renewal=intent(repeat,'renew','issue-pass','bob','security');
 assert(admitCommand(repeat,renewal).accepted);assert(admitCommand(repeat,renewal).accepted);
 assert.equal(repeat.marks.filter(e=>e.day===3&&e.kind==='pass.issued').length,1);
 assert.equal(repeat.world.props['bob:id'].location.agent,'ed');
 const spent=start();admitCommand(spent,intent(spent,'morning','appoint','LIMEN','security'));
 admitCommand(spent,intent(spent,'line','slow','STILETTO','conveyor'));
 until(spent,r=>r.case?.status==='open');assert(!admitCommand(spent,intent(spent,'no-pass','issue-pass','bob','security')).accepted);
 until(spent,r=>r.case?.status==='detention');
 const late=restorePoint('Missing ID');const stale=intent(late,'late','issue-pass','bob','security');until(late,r=>r.case?.status==='detention');
 assert(!admitCommand(late,{...stale,tick:late.tick}).accepted);assert.equal(late.spent,null);
 const skip=outcomes['morning-stiletto'];assert(!skip.events.some(e=>e.kind==='desk.signal'));
 assert(skip.events.some(e=>e.kind==='handoff.wait'));
 const rushed=outcomes['chat-rushed'],slow=outcomes['chat-slow'];
 assert(rushed.events.some(e=>e.kind==='chat.interrupted'));assert(!rushed.run.world.agents.bob.beliefs['desk.lead']);
 assert(slow.run.world.agents.bob.beliefs['desk.lead']);
 for(const sample of [rushed,slow])assert.equal(sample.run.world.props['bob:id'].location.agent,'ed');
 const cl=outcomes['clash-stiletto'].run,endorse=cl.marks.find(e=>e.kind==='endorsement.public');
 assert(!cl.heard[endorse.seq].includes('mae'));assert(!cl.world.agents.mae.beliefs['back.4']);
 assert(cl.marks.some(e=>e.kind==='worker.choice'&&e.text==='stay'));assert(cl.marks.some(e=>e.kind==='worker.choice'&&e.text==='go'));
 assert.equal(cl.world.agents.LIMEN.beliefs.reckless.value,true);
 const pulse=restorePoint('Conveyor chat'),times=[],before=process.memoryUsage().heapUsed;
 for(let i=0;i<650;i++){const t=performance.now();step(pulse);await hash(project(pulse));times.push(performance.now()-t);}
 times.sort((a,b)=>a-b);
 write('index.json',{schema_version:schema,hz:20,units:'integer millimetres',day_one_tick:5463,fixtures:results});
 console.log('All deterministic comparisons passed. 650 simulation + public hash ticks, p95 '+times[617].toFixed(2)+' ms, process heap delta '+((process.memoryUsage().heapUsed-before)/1048576).toFixed(1)+' MiB.');
 for(const x of results)console.log(x.file,x.rack_this_shift,x.terminal_public_hash.slice(0,12));
 console.log('Security decision window',deskWindowTicks/20,'seconds');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
