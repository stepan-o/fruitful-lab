import {subscription} from '../intro/protocol';
import {envelope,read,schema,type Frame} from './wire';
import {type Command,type Room} from './contract';
import {paint,loadArt,floorView} from './painter';
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const button=(id:string)=>el<HTMLButtonElement>(id);
const hidden=(id:string,on:boolean)=>{el(id).hidden=on;};
const txt=(id:string,s:string)=>{const n=el(id);if(n.textContent!==s)n.textContent=s;};
let frame:Frame|undefined,playing=false,seq=0,serial=Promise.resolve(),room:Room='security',opened='',lastRoom='';
let art:Awaited<ReturnType<typeof loadArt>>={},recovery=false;
const canvas=el<HTMLCanvasElement>('room'),ctx=canvas.getContext('2d')!;
const worker=new Worker('kernel.js');
const post=(kind:string,p:object)=>worker.postMessage(envelope(kind,++seq,p));
const reportError=(e:unknown)=>txt('status','Playback issue · '+String(e));
const action=(name:Command['action'],target:string,where:Room,incident:string)=>{
  if(!frame)return;
  const cmd:Command={id:'viewer-'+ ++seq,day:frame.scene.world.day,tick:frame.tick,action:name,target,room:where,incident};
  post('INPUT_COMMAND',{client_cmd_id:cmd.id,tick_target:cmd.tick,cmd});
};
function draw(){
  if(!frame||el('floor').hidden)return;
  const r=canvas.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);
  if(w<1||h<1)return;
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  paint(ctx,w,h,frame.scene,room,frame.tick,art);
  const signal=button('signal');
  if(!signal.hidden){
    const event=frame.scene.events.filter(e=>e.kind==='desk.signal').at(-1);
    if(event){
      const view=floorView(w,h,room);
      const [x,y]=view.xy(event.at[0]/1000,event.at[1]/1000);
      // Keep the control on the register face, below the workers and their nameplates.
      const left=Math.max(3,Math.min(w-69,x-2.25*view.scale-33));
      const top=Math.max(3,Math.min(h-52,y+1.25*view.scale));
      signal.style.left=left+'px';
      signal.style.top=top+'px';
    }
  }
}
function render(){
  if(!frame)return;
  el<HTMLSelectElement>('checkpoint').disabled=false;
  button('restore').disabled=false;
  const {scene,tick}=frame,w=scene.world,live=w.phase==='shift',sec=room==='security';
  hidden('brief',w.phase!=='briefing');hidden('floor',w.phase==='briefing');
  txt('clock','Day '+w.day+' · '+(w.phase==='briefing'?'Morning':Math.floor((tick-w.start)/20)+' s'));
  document.querySelectorAll<HTMLButtonElement>('[data-room]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.room===room)));
  txt('play',playing?'Pause':'Play 1×');button('play').disabled=!live;
  txt('policy',sec?(w.lead+' · '+(w.status==='open'?'Line held':w.quick?'Fast clearance':'Individual checks')):((w.lead==='LIMEN'?'STILETTO':'LIMEN')+' · '+w.pace));
  txt('mandate',w.spent?'Intervention spent':'Intervention ready');
  const open=live&&w.status==='open',show=open&&sec;
  hidden('signal',!show);el('signal').setAttribute('aria-expanded',String(show&&opened===w.caseId));hidden('decision',!show||opened!==w.caseId);
  button('pass').disabled=!!w.spent;txt('pass',w.spent?'Intervention spent':'Issue daily pass');
  hidden('end',w.phase!=='close');hidden('next',w.day>=4);
  const message=w.report?w.report.actor+' · '+w.report.text:'';
  if(show)txt('deadline',Math.ceil((w.deadline-tick)/20)+' s until LIMEN closes the case');
  hidden('report',!message);txt('report',message);
  const names=['Intake','Wash','Belt','Forge']; const signature=room+' '+w.coverage.join('|');
  hidden('staff',sec);
  if(lastRoom!==signature){const boxes=w.coverage.map((id,i)=>{const span=document.createElement('span'),b=document.createElement('b');b.textContent=names[i];span.append(b,id||'Uncovered');return span;});el('staff').replaceChildren(...boxes);lastRoom=signature;}
  const recent=scene.events.filter(e=>e.kind==='queue.advanced'&&tick-e.tick<80).at(-1);
  txt('cue',sec?(open?'LINE HELD · tap the desk signal':recent?recent.actor+' steps forward':w.called?'At the desk · '+w.called:'Security checkpoint'):('Rack · '+w.shiftOutput+' this shift'));
  hidden('faster',!live||!sec||w.lead!=='LIMEN'||w.quick||!w.waiting.length||w.pressure==='clash');
  hidden('slow',!live||sec||w.lead!=='LIMEN'||w.pace==='slow');
  hidden('rush',!live||sec||w.lead!=='LIMEN');
  for(const id of ['limen','stiletto'])hidden(id,!live||!sec||w.pressure!=='clash');
  for(const id of ['faster','slow','rush','limen','stiletto'])button(id).disabled=!!w.spent;
  txt('summary',w.shiftOutput+' finished this shift · '+w.completed.length+' completed since Day 1.');
  if(el<HTMLDetailsElement>('inspect').open){
    const list=scene.events.slice(-6).reverse().map(e=>{const li=document.createElement('li');li.textContent=e.seq+' · '+e.kind+' · '+e.actor+' '+e.subject+' '+e.text;return li;});
    el('log').replaceChildren(...list);
  }
  draw();
  window.dispatchEvent(new CustomEvent('loopforge:frame',{detail:frame}));
}
worker.onerror=e=>reportError(e.message);
worker.onmessage=e=>{const m=e.data;serial=serial.then(async()=>{
  if(m.local==='inspection'){el('traceOut').textContent=m.rows.map((v:{actor:string;intent:string;why:string})=>v.actor+' · '+v.intent+'\n'+v.why).join('\n')||'No recorded decision for this worker yet.';return;}
  if(m.local==='transport'){playing=m.playing;render();return;}
  switch(m.msg_type){
    case 'KERNEL_HELLO':post('SUBSCRIBE',subscription);break;
    case 'FULL_SNAPSHOT':case 'FRAME_DIFF':
      if(recovery&&m.msg_type==='FRAME_DIFF')return;
      try{frame=await read(frame,m.msg_type,m.payload);recovery=false;render();}
      catch{if(!recovery){recovery=true;post('DESYNC_REPORT',{issue:'EXTERNAL_HASH_MISMATCH'});}}break;
    case 'COMMAND_REJECTED':txt('status',m.payload.reason);break;
    case 'COMMAND_ACCEPTED':txt('status','');break;
    case 'ERROR':reportError(m.payload.message);break;
  }
}).catch(reportError);};
function bind(id:string,fn:()=>void){button(id).addEventListener('click',fn);}
function restore(){
  const name=el<HTMLSelectElement>('checkpoint').value;
  room=name==='Conveyor chat'?'conveyor':'security';opened='';txt('status','');txt('traceOut','');
  worker.postMessage({local:'load',name});
}
document.querySelectorAll<HTMLButtonElement>('[data-bid]').forEach(b=>b.onclick=()=>action('appoint',b.dataset.bid!,'security','morning'));
document.querySelectorAll<HTMLButtonElement>('[data-room]').forEach(b=>b.onclick=()=>{room=b.dataset.room as Room;render();});
bind('signal',()=>{if(!frame)return;opened=opened===frame.scene.world.caseId?'':frame.scene.world.caseId;render();if(opened)button('pass').disabled?button('watch').focus():button('pass').focus();});
bind('watch',()=>{opened='';render();button('signal').focus();});
bind('pass',()=>action('issue-pass','bob','security',frame!.scene.world.caseId));
bind('faster',()=>action('accelerate','LIMEN','security','D'+frame!.scene.world.day+'-checks'));
for(const k of ['slow','rush'] as const)bind(k,()=>action(k,'STILETTO','conveyor','D'+frame!.scene.world.day+'-pace'));
for(const k of ['limen','stiletto'])bind(k,()=>action('endorse',k.toUpperCase(),'security','D'+frame!.scene.world.day+'-clash'));
bind('play',()=>worker.postMessage({local:'play',on:!playing}));
bind('restore',restore);el('checkpoint').addEventListener('change',restore);
bind('next',()=>{opened='';room='security';worker.postMessage({local:'morning'});});
bind('trace',()=>worker.postMessage({local:'inspect',actor:el<HTMLSelectElement>('who').value}));
new ResizeObserver(draw).observe(canvas);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)worker.postMessage({local:'play',on:false});});
loadArt().then(images=>{art=images;draw();}).catch(()=>reportError('Sprite bank unavailable. Reload to retry.'));
txt('status','');post('VIEWER_HELLO',{viewer_name:'opening-shifts',supported_schema_versions:[schema]});
