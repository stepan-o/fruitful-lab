import {subscription} from '../intro/protocol';
import {envelope,read,schema,type Frame} from './wire';
import {type Command,type Room} from './contract';
import {paint,loadArt,floorView,registerDesk,drawBidPortrait} from './painter';
import {loadSkin,payload,select,type ArtView,type Skin} from './skin';
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const button=(id:string)=>el<HTMLButtonElement>(id);
const hidden=(id:string,on:boolean)=>{const node=el(id);if(node.hidden!==on)node.hidden=on;};
const txt=(id:string,s:string)=>{const n=el(id);if(n.textContent!==s)n.textContent=s;};
let frame:Frame|undefined,playing=false,seq=0,serial=Promise.resolve(),room:Room='security',opened='',lastRoom='';
let art:Awaited<ReturnType<typeof loadArt>>={},recovery=false;
const canvas=el<HTMLCanvasElement>('room'),ctx=canvas.getContext('2d')!;
const worker=new Worker('kernel.js');
const post=(kind:string,p:object)=>worker.postMessage(envelope(kind,++seq,p));
const reportError=(e:unknown)=>txt('status','Playback issue · '+String(e));
let skin:Skin|undefined,view:ArtView|undefined,previewLead='',carry='',carryDay=0;
const bids=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-bid]'));
const cameras=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-room]'));
const orderButtons = [['faster','accelerate','LIMEN'],['slow','slow','STILETTO'],['rush','rush','STILETTO'],
  ['limen','endorse','LIMEN'],['stiletto','endorse','STILETTO']] as const;
function action(name:Command['action'],target:string){
  if(!frame)return;
  const cmd=payload(frame,room,opened,name,target,'viewer-'+ ++seq);
  if(cmd)post('INPUT_COMMAND',cmd);
}
function decorate(id:string,asset:string|null|undefined){
  if(asset)skin?.decorate(el(id),asset);
}
function draw(){
  if(!frame||!skin||!view||el('floor').hidden)return;
  const r=canvas.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);
  if(w<1||h<1)return;
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  paint(ctx,w,h,frame.scene,room,frame.tick,art,skin,view);
  const signal=button('signal');
  if(!signal.hidden){
    const camera=floorView(w,h,room);
    const [x,foot]=camera.xy(...registerDesk);
    // Desk art has its origin at the foot. Put the marker pivot on the
    // register face, keeping the 44 px control centred over its visible sign.
    const y=foot-.44*camera.scale;
    signal.style.left=Math.max(2,Math.min(w-46,Math.round(x-22)))+'px';
    signal.style.top=Math.max(2,Math.min(h-46,Math.round(y-33)))+'px';
  }
}
function render(){
  if(!frame)return;
  el<HTMLSelectElement>('checkpoint').disabled=false;
  button('restore').disabled=false;
  const {scene,tick}=frame,w=scene.world,live=w.phase==='shift',sec=room==='security';
  hidden('brief',w.phase!=='briefing');hidden('floor',w.phase==='briefing');
  txt('clock','Day '+w.day+' · '+(w.phase==='briefing'?'Morning':Math.floor((tick-w.start)/20)+' s'));
  view=select(frame,room,opened,previewLead);
  cameras.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.room===room)));
  for(const bid of view.bids){
    const button=bids.find(b=>b.dataset.bid===bid.lead)!;
    button.setAttribute('aria-pressed',String(previewLead===bid.lead));
    skin?.decorate(button,bid.asset);
  }
  decorate('chassis','co-briefing-chassis');
  decorate('commit','co-commit-ready');
  button('commit').disabled=!previewLead;
  hidden('carry',w.phase!=='briefing'||w.day===2);
  if(w.phase==='briefing'&&w.day>2){
    decorate('carry','co-next-shift');
    txt('carry','Day '+w.day+' · '+w.completed.length+' carried in. '+(carryDay===w.day-1?carry:''));
  }
  decorate('sec-room','co-room-security');decorate('belt-room','co-room-conveyor');
  txt('play',playing?'Pause':'Play 1×');button('play').disabled=!live;
  if(w.phase!=='briefing'){
    const bid=view.bids.find(b=>b.lead===w.lead)!;
    decorate('assignment','co-bid-committed');
    txt('assignment','Security · '+bid.security+'   /   Conveyor · '+bid.conveyor);
  }
  txt('policy',sec?(w.status==='open'?'Line held':w.quick?'Fast clearance':'Individual checks'):w.pace);
  txt('mandate',w.spent?'Intervention spent':'Intervention ready');
  const open=live&&w.status==='open',hasCase=sec&&!!w.caseId, panel=view.panel;
  hidden('signal',!hasCase);hidden('decision',!panel);
  el('signal').setAttribute('aria-expanded',String(!!panel));
  decorate('desk-icon',view.signal??'sec-signal-report');
  decorate('decision',panel?.asset);decorate('pass','co-commit-ready');
  hidden('pass',!open);button('pass').disabled=!panel?.mayIssue;
  txt('pass',w.spent?'Intervention spent':'Issue daily pass');
  txt('case-heading',open?'bob is missing his ID':w.status==='pass'?'Daily pass · bob':'Security custody · bob');
  el('signal').setAttribute('aria-label',open?'Open desk signal':'Inspect Security report');
  txt('case-detail',open?'The line is held. A pass admits bob through today’s bell.':w.report?.text??'');
  txt('deadline',open?Math.ceil((w.deadline-tick)/20)+' s until LIMEN closes the case':'');
  const pass=view.pass;
  const original=view.returnedOriginal.at(-1);
  hidden('document',(!pass||pass.day!==w.day)&&!original);
  hidden('original',!original);
  if(original)decorate('original-art','sec-id-bob');
  hidden('pass-record',!pass||pass.day!==w.day);
  if(pass){decorate('credential',pass.asset);
    txt('card-holder',pass.holder);txt('card-issuer',pass.issuer);txt('card-day','Shift '+pass.day);txt('credential-text',pass.holder+' · issued by '+pass.issuer+'\nDay '+pass.day+' · '+(w.pass?.valid?'valid through the bell':'expired at the bell'));}
  hidden('custody',!view.custodyInsert);
  if(view.custodyInsert){decorate('custody-art',view.custodyInsert);txt('custody-text',view.custodyInsert==='sec-custody-held'?'Held through the bell':'Released at the bell');}
  hidden('end',w.phase!=='close');hidden('next',w.day>=4);
  txt('speech-text',view.speeches.map(s=>s.speaker+' · '+s.text+(s.asset==='fl-bubble-interrupted'?' (interrupted)':'')).join(' '));
  const report=view.reports.at(-1);
  hidden('report',!report);decorate('report','co-witness-slip');
  txt('report',report?report.speaker+' · Security · '+report.text:'');
  const decisions=scene.events.filter(e=>e.kind==='worker.choice');
  hidden('response',!sec||!decisions.length);
  txt('response',decisions.map(e=>e.actor+' '+(e.text==='go'?'left the line':'stayed')).join(' · '));
  const names=['Intake','Wash','Belt','Forge']; const signature=room+' '+w.coverage.join('|');
  hidden('staff',sec);
  if(lastRoom!==signature){const boxes=w.coverage.map((id,i)=>{const span=document.createElement('span'),b=document.createElement('b');b.textContent=names[i];span.append(b,id||'Uncovered');return span;});el('staff').replaceChildren(...boxes);lastRoom=signature;}
  const recent=scene.events.filter(e=>e.kind==='queue.advanced'&&tick-e.tick<80).at(-1);
  txt('cue',sec?(open?'LINE HELD · tap the desk signal':recent?recent.actor+' steps forward':w.called?'At the desk · '+w.called:'Security checkpoint'):('Rack · '+w.shiftOutput+' this shift'));
  const orders=view.choices.filter(c=>c.action!=='appoint'&&c.action!=='issue-pass');
  hidden('order-panel',!orders.length);decorate('order-panel',orders[0]?.asset);
  txt('order-title',w.pressure==='clash'&&sec?'Conflicting orders':sec?'Security checks':'Conveyor pace');
  for(const [id,action,target] of orderButtons){
    const choice=view.choices.find(c=>c.action===action&&c.target===target);
    hidden(id,!choice);button(id).disabled=!choice?.enabled;
  }
  if(w.phase==='close'){
    decorate('end','co-close-docket');decorate('summary','co-output-ticket');
    decorate('attendance','co-attendance-ticket');decorate('overnight','co-overnight');
    txt('summary',w.shiftOutput+' finished this shift · '+w.completed.length+' completed since Day 1.');
    txt('attendance','At the bell · '+w.coverage.filter(Boolean).length+' of 4 controls staffed.');
    const released=scene.events.some(e=>e.kind==='custody.release');
    carry=w.pass?.day===w.day?'bob’s daily pass expired.':released?'bob was released from custody.':'';
    carryDay=w.day;
    txt('overnight',(carry+' '+(w.day===4?'End of Day 4.':'Day '+(w.day+1)+' follows.')).trim());
  }
  if(el<HTMLDetailsElement>('inspect').open){
    decorate('traceOut','co-review-instrument');
    const last=scene.events.at(-1)?.seq.toString()??'';
    if(el('log').dataset.last!==last){
    el('log').dataset.last=last;
    const list=scene.events.slice(-6).reverse().map(e=>{const li=document.createElement('li');li.textContent=e.seq+' · '+e.kind+' · '+e.actor+' '+e.subject+' '+e.text;return li;});
    el('log').replaceChildren(...list);
    }
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
      try{frame=await read(frame,m.msg_type,m.payload);recovery=false;}
      catch{if(!recovery){recovery=true;post('DESYNC_REPORT',{issue:'EXTERNAL_HASH_MISMATCH'});}break;}
      render();break;
    case 'COMMAND_REJECTED':txt('status',m.payload.reason);break;
    case 'COMMAND_ACCEPTED':txt('status','');break;
    case 'ERROR':reportError(m.payload.message);break;
  }
}).catch(reportError);};
function bind(id:string,fn:()=>void){button(id).addEventListener('click',fn);}
function restore(){
  const name=el<HTMLSelectElement>('checkpoint').value;
  previewLead='';carryDay=0;room=name==='Conveyor chat'?'conveyor':'security';opened='';txt('status','');txt('traceOut','');
  delete el('log').dataset.last;
  worker.postMessage({local:'load',name});
}
bids.forEach(b=>b.onclick=()=>{previewLead=b.dataset.bid!;render();});
bind('commit',()=>action('appoint',previewLead));
cameras.forEach(b=>b.onclick=()=>{room=b.dataset.room as Room;render();});
function closeReport(){opened='';render();button('signal').focus();}
bind('signal',()=>{
  if(!frame)return;
  if(opened===frame.scene.world.caseId){closeReport();return;}
  opened=frame.scene.world.caseId;render();
  (view?.panel?.mayIssue?button('pass'):button('watch')).focus();
});
bind('watch',closeReport);
el('decision').addEventListener('keydown',e=>{if(e.key==='Escape')closeReport();});
bind('pass',()=>action('issue-pass','bob'));
for(const [id,name,target] of orderButtons)bind(id,()=>action(name,target));
bind('play',()=>worker.postMessage({local:'play',on:!playing}));
bind('restore',restore);el('checkpoint').addEventListener('change',restore);
bind('next',()=>{opened='';previewLead='';room='security';worker.postMessage({local:'morning'});});
bind('trace',()=>worker.postMessage({local:'inspect',actor:el<HTMLSelectElement>('who').value}));
new ResizeObserver(draw).observe(canvas);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)worker.postMessage({local:'play',on:false});});
Promise.all([loadArt(),loadSkin()]).then(([images,bank])=>{art=images;skin=bank;
  for(const lead of ['LIMEN','STILETTO'] as const){
    decorate('slot-'+lead,'co-supervisor-slot');
    drawBidPortrait(el('slot-'+lead).querySelector('canvas')!,lead,images);
  }
  const part=document.createElement('span');
  for(const [variable,id] of [['--console-focus','co-focus-ring'],['--desk-focus','sec-focus-ring'],['--pressed','co-commit-pressed']]){
    bank.decorate(part,id);document.documentElement.style.setProperty(variable,part.style.getPropertyValue('--art-image'));
  }
  render();}).catch(()=>reportError('Sprite bank unavailable. Reload to retry.'));
txt('status','');post('VIEWER_HELLO',{viewer_name:'opening-shifts',supported_schema_versions:[schema]});
