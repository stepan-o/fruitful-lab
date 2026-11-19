// Exercise the shipping TypeScript engine in plain Node, including the browser wire contract.
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const assert=require('node:assert/strict');
const test=require('node:test');
const ts=require('typescript');
require.extensions['.ts']=(mod,name)=>mod._compile(ts.transpileModule(fs.readFileSync(name,'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}
}).outputText,name);
const {Intro}=require('../lib/loopforge/intro/simulation.ts');
const {tickAt,editTick,score,geom,audible}=require('../lib/loopforge/intro/floor.ts');
const {projectIntro}=require('../lib/loopforge/intro/projection.ts');
const {Session}=require('../lib/loopforge/intro/session.ts');
const {envelope,engine,schema,subscription,digest,canonical,quantize,reconstruct,operations}=require('../lib/loopforge/intro/protocol.ts');
const {offlineFrame}=require('../lib/loopforge/intro/artifacts.ts');
const golden=require('../lib/loopforge/intro/golden.json');
const until=(s,n)=>{while(s.world.tick<n)s.step();};
const sha=s=>createHash('sha256').update(s).digest('hex');

test('approved edit, concurrent dialogue, all three item histories, custody and departure',async()=>{
  const s=new Intro();
  for(const [t,expected] of golden.checkpoints){until(s,t);assert.equal(await digest(projectIntro(s)),expected);}
  assert.equal(s.finished,true);
  assert.equal(s.world.events.filter(e=>e.kind==='speech').length,45);
  assert.equal(s.world.agents.bob.beliefs['prop.bob:id.holder'].value,'floor');
  assert.equal(s.world.agents.ed.beliefs['prop.bob:id.holder'].value,'ed');
  assert.equal(s.world.props['bob:id'].owner,'bob');
  assert.equal(s.world.props['bob:id'].location.agent,'ed');
  assert.equal(s.world.props['max:id'].location.agent,'max');
  for(const piece of s.pieces){
    assert.equal(piece.stage,4);
    for(const station of ['intake','wash','belt','forge'])assert(s.world.completed.includes(piece.id+'-'+station));
    assert.equal(s.world.facts[piece.id+'.socket'],4);
  }
  for(const a of Object.values(s.world.agents))assert.equal(a.room==='outside',a.id===a.id.toLowerCase(),a.id);
  const voices=new Intro();until(voices,tickAt(87));assert.equal(projectIntro(voices).events.length,4);
  const walking=new Intro();until(walking,20);assert(walking.routes.max.moving&&projectIntro(walking).events.some(e=>e.speaker==='max'));
  assert(Math.abs(score.duration-190.60391778732966)<1e-9);
});
test('invalid physical contact, alternative intention, interrupted production and hearing',()=>{
  const missed=new Intro();until(missed,tickAt(26.2));missed.world.agents.LIMEN.position=[90000,123000];until(missed,tickAt(28));assert.equal(missed.world.facts['injury.bob'],undefined);
  assert(missed.trace.some(e=>e.plan==='strike'&&/Preconditions/.test(e.reason)));
  const guard=new Intro();until(guard,tickAt(29.8));guard.world.agents.ed.position=[121300,129460];until(guard,tickAt(30.8));assert(guard.world.completed.includes('watch-card'));assert.equal(guard.world.props['bob:id'].location.kind,'floor');
  const halt=new Intro();until(halt,tickAt(52));halt.world.agents.bob.position=[111000,142000];until(halt,tickAt(77));assert.equal(halt.pieces[0].stage,0);assert(halt.trace.some(e=>e.plan==='cortex-1-intake'&&e.reason.startsWith('Interrupted')));
  const jam=new Intro();until(jam,tickAt(109.05));jam.world.agents.bob.position=[110000,142000];
  until(jam,tickAt(110));assert.equal(jam.world.facts['press.jammed'],true);
  const unheard=new Intro();until(unheard,tickAt(50));delete unheard.world.agents.bob.beliefs['heard.line.13'];
  until(unheard,tickAt(62));assert.equal(unheard.pieces[0].stage,0);
  assert(!audible({position:[1000,1000]},{position:[30000,1000]}));
  assert(audible({position:[120000,140000]},{position:[120600,140000]}));
  const denied=new Intro();denied.world.facts['blocked.LIMEN']=true;until(denied,tickAt(44));assert.equal(denied.world.facts['gate.staffed'],undefined);assert(denied.routes.bob.elapsed<denied.world.tick);
});
test('canonical byte fixtures, ordered diffs, gaps, external hashes and offline replay',async()=>{
  assert.deepEqual(golden.q1e3.map(([x])=>quantize(x)),golden.q1e3.map(([,q])=>q));
  assert.throws(()=>canonical({x:Infinity}));assert.equal(canonical({b:1,a:-0}),'{"a":0,"b":1}');
  const {records,index}=golden.offline;
  const load=async p=>new TextEncoder().encode(JSON.stringify(records[p]));
  const frame=await offlineFrame(index,2,load);assert.equal(frame.hash,await digest(frame.state));
  assert.equal(frame.hash,golden.offlineEnd);
  await assert.rejects(offlineFrame(index,2,async()=>new Uint8Array([0])),/checksum/);
  const extra=structuredClone(records['0.json']);extra.payload.state.agents[0].future='ignored';
  assert.equal(await digest(reconstruct(null,extra).state),records['0.json'].payload.step_hash);
  extra.payload.state.agents[0].facing='INVALID';assert.throws(()=>reconstruct(null,extra),/INVALID_PAYLOAD/);
  const zero=reconstruct(null,records['0.json']);assert.throws(()=>reconstruct(zero,records['2.json']),/TICK_GAP/);
  const live=new Intro();until(live,2);assert.deepEqual(frame.state,projectIntro(live));
});
test('admission ordering, command rejection, recovery, baseline acknowledgement and deterministic scrubbing',async()=>{
  const messages=[];const s=new Session(m=>messages.push(m),'00000000-0000-4000-8000-000000000001');let seq=0;
  const send=(type,p)=>s.receive(envelope(type,++seq,p));
  await send('SUBSCRIBE',subscription);assert.equal(messages.pop().msg_type,'ERROR');
  await send('VIEWER_HELLO',{viewer_name:'test',viewer_version:'1',supported_schema_versions:[schema]});
  await send('SUBSCRIBE',{...subscription,channels:['AGENTS','AGENTS']});assert.equal(messages.pop().msg_type,'ERROR');
  await send('SUBSCRIBE',subscription);assert.deepEqual(messages.filter(m=>m.msg_type).map(m=>m.msg_type),['KERNEL_HELLO','SUBSCRIBED','FULL_SNAPSHOT']);
  let m=messages.findLast(m=>m.msg_type==='FULL_SNAPSHOT');s.applied(m.payload.tick,m.payload.step_hash);
  const cmd={client_cmd_id:'1',tick_target:0,cmd:{type:'VIEW_CONTROL',payload:{hint:'PLAY'}}};
  await send('INPUT_COMMAND',{...cmd,cmd:{type:'MOVE'}});assert.equal(messages.pop().msg_type,'COMMAND_REJECTED');
  await send('INPUT_COMMAND',cmd);await send('INPUT_COMMAND',cmd);assert.equal(s.history().length,1);
  let frame=reconstruct(null,m);messages.length=0;await s.progress(.2);
  for(const d of messages.filter(m=>m.msg_type==='FRAME_DIFF'))frame=reconstruct(frame,d);
  assert.deepEqual(frame.state,projectIntro(s.sim));assert.equal(frame.hash,await digest(frame.state));
  await send('DESYNC_REPORT',{tick:frame.tick,issue:'TICK_GAP'});
  m=messages.findLast(m=>m.msg_type==='FULL_SNAPSHOT');await s.progress(.4);assert.equal(s.sim.world.tick,frame.tick);s.applied(frame.tick,m.payload.step_hash);
  await send('REPLAY_BEGIN',{delivery:'CONTINUOUS'});assert.equal(messages.pop().msg_type,'ERROR');
  await s.locate(132);const state=projectIntro(s.sim);await s.locate(2);await s.locate(132);assert.deepEqual(projectIntro(s.sim),state);
  assert(!JSON.stringify(state).includes('beliefs'));
});
