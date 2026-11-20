import {cutToSecurity} from './approach-edit';
import {channels,renderSpec,validEnvelope} from '../intro/protocol';
import {restorePoint,names,type Checkpoint} from './replay';
import {admitCommand,nextMorning,step} from './simulation';
import {type Run,type Command} from './contract';
import {full,diff,schema,engine,envelope,project,type Frame} from './wire';

let run=restorePoint('Morning bids'),frame:Frame|undefined,checkpoint:Checkpoint='Morning bids';
let saved:Run|undefined;
let readingHold=false,readingActive=false;
let cutTicks=0,savedCut=0;
let sequence=0,playing=false,connected=false,subscribed=false,serial=Promise.resolve();
const cache=new Map<Checkpoint,Run>();
function post(type:string,payload:object){self.postMessage(envelope(type,++sequence,payload));}
async function snapshot(){
  self.postMessage({local:'edit-clock',cutTicks});
  const b=await full(run);frame={tick:b.tick,hash:b.step_hash,scene:b.state};post('FULL_SNAPSHOT',b);
}
async function tick(){
  if(!playing||readingHold||!subscribed||!frame||run.phase!=='shift')return;
  if(!cutTicks&&!readingActive){
    cutTicks=cutToSecurity(run);
    if(cutTicks){await snapshot();return;}
  }
  step(run);
  const data=await diff(frame,run);
  frame={tick:run.tick,hash:data.step_hash,scene:project(run)};post('FRAME_DIFF',data);
  if(run.phase as string==='close'){playing=false;status();}
}
function status(){self.postMessage({local:'transport',playing,checkpoint});}
function queue(fn:()=>Promise<void>){serial=serial.then(fn).catch(e=>{playing=false;post('ERROR',{message:String(e)});status();});}
let lastTime=performance.now(),debt=0;
setInterval(()=>{
  const now=performance.now();debt=playing&&!readingHold?Math.min(500,debt+now-lastTime):0;lastTime=now;
  const steps=Math.floor(debt/50);debt-=steps*50;
  if(steps)queue(async()=>{for(let i=0;i<steps;i++)await tick();});
},25);
self.onmessage=e=>{const msg=e.data;queue(async()=>{
  if(msg.local==='reading-hold'&&subscribed){
    readingActive=!!msg.active;readingHold=!!msg.on;lastTime=performance.now();debt=0;return;
  }
  if(msg.local==='save-state'&&subscribed){saved=structuredClone(run);savedCut=cutTicks;self.postMessage({local:'saved',tick:run.tick});return;}
  if(msg.local==='load-state'&&saved&&subscribed){run=structuredClone(saved);cutTicks=savedCut;readingActive=false;self.postMessage({local:'reading-reset',saved:true});readingHold=false;playing=false;debt=0;await snapshot();status();return;}
  if(msg.local==='load'&&subscribed){
    if(!names.includes(msg.name))return;
    checkpoint=msg.name;
    if(!cache.has(checkpoint))cache.set(checkpoint,restorePoint(checkpoint));
    run=structuredClone(cache.get(checkpoint)!);cutTicks=0;readingActive=false;self.postMessage({local:'reading-reset'});readingHold=false;playing=false;debt=0;await snapshot();status();return;
  }
  if(msg.local==='play'&&subscribed){playing=!!msg.on&&run.phase==='shift';lastTime=performance.now();debt=0;status();return;}
  if(msg.local==='morning'&&subscribed&&nextMorning(run)){cutTicks=0;readingActive=false;self.postMessage({local:'reading-reset'});readingHold=false;playing=false;await snapshot();status();return;}
  if(msg.local==='inspect'&&subscribed){
    const actor=msg.actor;
    if(!Object.hasOwn(run.world.agents,actor))return;
    const beliefs=run.world.agents[actor].beliefs;
    const evidence=Object.entries(beliefs).filter(([key,b])=>b.value&&['desk.lead','anonymous.find','boot.lead','ed.invitation','hand.return','jo.reported.return','recognized.original','kit.reported.order','ben.reported.bob','jo.crossed.'+run.day].includes(key))
      .map(([key,b])=>key+' · '+b.mode+' · '+b.source);
    const receipts=run.marks.filter(e=>['speech.delivered','gesture.seen'].includes(e.kind)&&run.heard[e.seq]?.includes(actor)).slice(-6)
      .map(e=>'Day '+e.day+' · '+e.tick+' · '+e.actor+' · '+e.text);
    self.postMessage({local:'inspection',rows:run.thoughts.filter(t=>t.actor===actor).slice(-6),evidence,receipts});return;
  }
  if(!validEnvelope(msg))return;
  if(msg.msg_type==='VIEWER_HELLO'){
    if(!(msg.payload.supported_schema_versions as string[])?.includes(schema)){post('ERROR',{message:'Unsupported schema'});return;}
    connected=true;post('KERNEL_HELLO',{engine_id:engine,schema_version:schema,tick_hz:20,render_spec:renderSpec,channels});return;
  }
  if(connected&&msg.msg_type==='SUBSCRIBE'){
    if(msg.payload.stream!=='LIVE'||JSON.stringify(msg.payload.channels)!==JSON.stringify(channels)||msg.payload.diff_policy!=='DIFF_ONLY'){post('ERROR',{message:'Unsupported subscription'});return;}
    subscribed=true;post('SUBSCRIBED',{effective_stream:'LIVE',effective_channels:channels});await snapshot();status();return;
  }
  if(!subscribed)return;
  if(msg.msg_type==='DESYNC_REPORT'){await snapshot();return;}
  if(msg.msg_type==='INPUT_COMMAND'){
    const c=msg.payload.cmd as Command;
    if(!c||typeof c.id!=='string'){post('COMMAND_REJECTED',{reason:'Malformed command'});return;}
    const prior=run.history[c.id];
    const observation=Number(msg.payload.tick_target);
    if(!prior&&(!Number.isSafeInteger(observation)||observation>run.tick||run.tick-observation>12)){
      post('COMMAND_REJECTED',{client_cmd_id:c.id,reason:'Stale observation'});return;
    }
    const cmd={...c,tick:prior?.cmd.tick??run.tick};
    const result=admitCommand(run,cmd);
    post(result.accepted?'COMMAND_ACCEPTED':'COMMAND_REJECTED',{client_cmd_id:c.id,reason:result.reason,tick:cmd.tick});
    if(result.accepted){if(c.action==='appoint')playing=true;await snapshot();status();}
  }
});};
