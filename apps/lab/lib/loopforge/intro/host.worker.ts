import {departure} from './shift-handoff';
import {envelope} from './protocol';
import {Session} from './session';
const port=self as unknown as {postMessage:(m:unknown)=>void;onmessage:((e:MessageEvent)=>void)|null};
const session=new Session(m=>port.postMessage(m),crypto.randomUUID());
let offset=0,anchor=0,busy=Promise.resolve(),timer:ReturnType<typeof setTimeout>|undefined;
function schedule(){
  clearTimeout(timer);
  if(!session.playing)return;
  timer=setTimeout(()=>enqueue(async()=>{await session.progress(offset+(performance.now()-anchor)/1000);schedule();}),30);
}
function enqueue(task:()=>Promise<void>){busy=busy.then(task).catch(e=>{session.playing=false;port.postMessage({local:'failure',message:String(e)});});}
port.onmessage=({data})=>enqueue(async()=>{
  if(data?.local==='campaign'){session.configure(data.confirmed);return;}
  if(data?.local==='station'){
    if(session.confirm(data.index)){offset=session.sim.seconds;anchor=performance.now();schedule();}
    return;
  }
  if(data?.local==='skip'){
    clearTimeout(timer);session.playing=false;
    if(!session.guided)session.configure(0);
    while(!session.sim.finished)session.sim.step();
    port.postMessage({local:'departure',source:departure(session.sim)});return;
  }
  if(data?.local==='departure'&&session.sim.finished){port.postMessage({local:'departure',source:departure(session.sim)});return;}
  if(data?.local==='applied'){session.applied(data.tick,data.hash);return;}
  if(data?.local==='restart-play'){
    await session.locate(0);
    await session.receive(envelope('INPUT_COMMAND',0,{client_cmd_id:'restart-'+session.history().length,tick_target:0,cmd:{type:'VIEW_CONTROL',payload:{hint:'PLAY'}}}));
  }else if(data?.local==='locate'){await session.locate(data.seconds);}
  else if(data?.local==='inspect'){port.postMessage({local:'trace',rows:session.sim.trace.slice(-16)});return;}
  else await session.receive(data);
  offset=session.sim.seconds;anchor=performance.now();schedule();
});
