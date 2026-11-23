import {shots,order} from './shots.js';
const getJSON=async url=>{const res=await fetch(url);if(!res.ok)throw Error('Could not open '+url);return res.json();};
const [project,art]=await Promise.all([getJSON('projection.json'),getJSON('art.json')]);
const screen=document.querySelector('#screen');
let bid='LIMEN', paused=false, audio=false, trail=[],picked=null;
const stations=['Intake','Wash','Belt','Forge'];
const quotes={LIMEN:'We have to stick to the Protocol. No need to change anything.',STILETTO:'Give me the gate, send LIMEN to conveyor. It took him two helpers to count to eight.'};
const safe=t=>String(t??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const go=(id,label,cls='key')=>`<a class="${cls}" href="index.html#${id}" data-go="${id}">${label}</a>`;
const act=(action,label,cls='quiet',extra='')=>`<button type="button" class="${cls}" data-act="${action}" ${extra}>${label}</button>`;
const activeId=()=>Object.hasOwn(shots,location.hash.slice(1))?location.hash.slice(1):'console';
const artLayer=(name,cls='')=>`<div class="illustration ${cls}" style="background-image:url('${art[name]}')"></div>`;
const chip=(text)=>`<span class="code">${text}</span>`;
const cue=(s)=>`<span class="eyeline">${s}</span>`;
const frameData=id=>project.screens[shots[id]?.key||id];
function sample(key,device){
  const record=project.screens[key].devices[device], sheet=Math.floor(record.index/project.batchSize);
  return `background-image:url('${device}-${sheet}.webp');background-size:100% ${project.batchSize*100}%;background-position:0 ${(record.index%project.batchSize)*100/(project.batchSize-1)}%`;
}
function consoleView(device){
  const portrait=device==='tall', names=['Conveyor','Security'],keys=['standby-line','standby-desk'];
  const pans=portrait?[[2.8,10.2,45.6,18.3],[51.4,10.2,45.3,18.3]]:[[2.8,6.9,30.4,23.9],[34.2,6.9,31.7,23.9]];
  return artLayer(portrait?'foundry-desk-mobile':'foundry-desk','desk')+pans.map(([x,y,w,h],i)=>`<div class="mini-feed" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%;${sample(keys[i],'wide')}"><span>0${i+1} / ${names[i]}</span></div>`).join('')+
    `<div class="desk-title">${cue('Day 02 · Before shift')}<h1>Operator’s console</h1></div>
     <div class="receiver-action">${cue('Incoming · Leadership')}${go('handover','Answer receiver ↗','lightkey')}</div>`;
}
function cinema(id,device) {
  const incident=id==='case'||id==='expired',quota=id==='quota', expired=id==='expired';
  const header=incident?'CAM 02 &nbsp;/&nbsp; Security':'Week 01 &nbsp;/&nbsp; Leadership';
  const title=incident?'Missing ID':quota?'60 cortexes':'The handover';
  const titleLine=incident?'Checkpoint incident':quota?'Weekly quota · Due Day 07':'Opening mandate';
  const words=incident?(expired?'The decision window has closed. bob is held until the bell.':'Admit bob until the bell. Uses today’s one intervention.'):quota?'“60 finished cortexes. End of the week. How you get there is your responsibility.”':'“Two departments operational. The rest waiting for a director who can make this place produce.”';
  const next=incident?(expired?'hold-desk':'grant-desk'):(quota?'appointment':'quota');
  return artLayer(incident?'event-'+device:'leadership-call',incident?'incident-art':'leadership-art')+`<div class="cinema-fade"></div><header class="cinema-head">${chip(header)}${go(incident?(expired?'hold-desk':'returned'):'console',incident?'↶ Security':'↶ Console','backlink')}</header>
    <div class="cinema-foot"><div>${cue(titleLine)}<h1>${title}</h1>${incident?act('audio','≋ Desk exchange','exchange'):`<p class="ledger-line">3 on the rack · ${quota?'Due at week’s end':'10 workers'}</p>`}</div>
    <div class="cinema-action"><p>${words}</p>${go(next,incident?(expired?'Return to camera':'Issue day pass →'):(quota?'Acknowledge quota →':'Receive the quota →'))}</div></div>
    ${incident&&audio?`<aside class="transcript">${cue('Desk exchange')}<p><b>LIMEN</b> I recognize the leg. Have you got the card?</p><p><b>bob</b> No, sir.</p><p><b>LIMEN</b> No ID. Hold both desks.</p>${act('audio','Close transcript')}</aside>`:''}`;
}
function appointment(board) {
  return artLayer('dispatch-room','dispatch')+`<div class="posting-shade"></div><header class="posting-title">${cue('Day 02 / Morning appointment')}<h1>Post the supervisors</h1></header><div class="proposals">${['LIMEN','STILETTO'].map(id=>{
    const other=id==='LIMEN'?'STILETTO':'LIMEN';return `<button class="bid ${id===bid?'selected':''}" data-bid="${id}" aria-pressed="${id===bid}"><img src="${art[id.toLowerCase()+'-portrait']}" alt=""><span class="bid-copy">${cue('Security')}<strong>${id}</strong><span>Conveyor · ${other}</span></span></button>`;
  }).join('')}</div><div class="bid-footer"><p><b>${bid}</b> “${quotes[bid]}”</p>${go(bid==='LIMEN'?'walk':'swap-walk','Commit assignment →')}</div>`;
}
function stats(title,values){
  return `<div class="statset"><strong>${safe(title)}</strong>${['Force','Precision','Timing'].map((n,i)=>`<span class="stat s${i}"><span>${n}</span><i style="--v:${values[i]*20}%"></i><em>${values[i]}/5</em></span>`).join('')}</div>`;
}
function roomView(shot,f,device,board){
  const sec=f.room==='security', id=shot.id, rep=id.startsWith('hold')?'hold':'grant', data=f.devices[device];
  const active=shot.post||null, single=shot.single, staffing=shot.staffing, clear=shot.clear;
  const sameSec=shot.cameraReturn|| (id==='ready'?'ready-security':staffing?rep+'-security':null);
  const mode=shot.chapter==='LIMEN on Conveyor'?'LIMEN':'STILETTO';
  const boss=sec?(mode==='LIMEN'?'STILETTO':'LIMEN'):mode;
  const meter=f.toBell===null?'Crew arrival':Math.floor(f.toBell/60)+':'+String(Math.floor(f.toBell%60)).padStart(2,'0')+' to bell';
  const clock=f.toBell===null?'Walk-in':meter;
  let html=`<div class="world"><div class="floor-art" style="${sample(shot.key||id,device)}"></div>`;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const speech=f.speech;
  if(speech && !active && !single && !staffing && !shot.incident && !clear && !shot.cameraReturn && !['stroke','rack','intake-result'].includes(id)){
    let [x,y]=data.actors[speech.who]||[50,65];
    const onScreen=x>=0&&x<=100&&y>=12&&y<=95;
    html+=`<div class="speech ${x>58?'left-speech':''}" style="left:${clamp(onScreen?x:29,device==='tall'?25:15,device==='tall'?71:82)}%;top:${clamp(onScreen?y-9:34,25,67)}%"><b>${safe(speech.who)}</b>${safe(speech.words)}</div>`;
  }
  if(shot.incident){
    const [x,y]=data.actors.bob;
    if(speech && data.actors[speech.who]) {
      const [sx,sy]=data.actors[speech.who];
      html+=`<div class="speech case-speech" style="left:${sx}%;top:${sy+2}%"><b>${safe(speech.who)}</b>${safe(speech.words)}</div>`;
    }
    html+=`<a class="case-target" style="left:${x}%;top:${y}%" href="index.html#case" data-go="case" aria-label="Inspect bob’s missing-ID case"><i></i><b>bob <em>Missing ID ↗</em></b></a>`;
  }
  if(clear||active||single){
    f.machines.forEach((m,i)=>{
      const [x,y]=data.stations[i];if(x<0||x>100)return;
      const ready=clear&&m.ready,assigned=f.posts?.[i],chosen=active&&active[1]===i;
      const key=ready?(i===0?'intake-call':'calling'):chosen?shot.next:null;
      const action=clear?(ready?'Clear':'Empty'):(chosen?'Post '+active[0]:assigned||'Open');
      const words=`<small>${m.name}</small>${clear&&ready?`<strong>${m.caller||m.crew[0]} · ${m.load.replace('D2-','')}</strong>`:''}<b>${action}</b>`;
      const style=`left:${clamp(x,device==='tall'?12:8,91)}%;top:${clamp(y+(device==='tall'?(i%2?8:-10):12),23,77)}%`;
      html+=key?`<a href="index.html#${key}" data-go="${key}" class="socket ${ready||chosen?'armed':''}" style="${style}">${words}</a>`:`<span class="socket" style="${style}">${words}</span>`;
    });
  }
  html+='</div><div class="glass-tone"></div>';
  html+=`<header class="room-head"><div>${chip(sec?'CAM 02':'CAM 01')}<strong>${sec?'Security':'Conveyor'}</strong><small>${boss}</small></div><div class="floor-time"><span>DAY 02</span><strong>${clock}</strong></div></header>`;
  const control=board?'':act('pause','Ⅱ','pause','aria-label="Pause shift"');
  const otherCamera=sameSec?go(sameSec,sec?'Conveyor ↗':'Security ↗','switchcam'):'';
  const status=active||single?'Posting hold':sec?(f.spent?'Intervention spent':'1 intervention available'):'Rack +'+f.day+' · Week '+f.week+'/60';
  html+=`<footer class="floor-foot"><span>${status}</span><div>${otherCamera}${control}</div></footer>`;
  if(active||single){
    const roster=(f.crew||[]), who=active?.[0] ||'sam';
    html+=`<div class="orders">${cue(single||id.includes('last-post')?'One worker per station':'Two workers · two posts each')}<div class="roster">${roster.map(k=>`<span class="worker ${k===who?'picked':''}">${safe(k)}</span>`).join('')}</div>${active?`<p>${safe(who)} → ${stations[active[1]]}</p>`:`<p>${rep==='grant'?'bob is available for Wash.':'bob is in custody. max can cover Wash.'}</p>`}</div>`;
  } else if(staffing){
    const worker=picked||'kit',crew=f.workers.filter(w=>w[0]!=='bob'||rep==='grant');
    html+=`<div class="crew-order"><div class="crew-picker">${cue('Assign crew')}<select aria-label="Inspect eligible worker">${crew.map(([name])=>`<option ${name===worker?'selected':''}>${safe(name)}</option>`).join('')}</select></div><div class="ratings">${stats(worker,project.ratings[worker])}${stats('Belt needs',project.needs[2])}</div>${worker==='kit'?go(shot.next,'Send kit to Belt →','thin-key'):'<small>Review example · select kit to see the order</small>'}</div>`;
  } else if(id.endsWith('-move')){
    html+=`<div class="order-receipt">${cue('Crew order')}<strong>kit → Belt</strong><p>${safe(f.workers.find(r=>r[0]==='kit')?.[1])}</p>${id==='hold-move'?go('relief','Post mae to Forge →','thin-key'):''}</div>`;
  } else if(['calling','stroke','rack','inspection','intake-call','intake-result','relief','grant-desk','hold-desk','grant-two','hold-two'].includes(id)){
    const labels={calling:['Forge / C2','Call sent · max'],stroke:['Forge / C2','Loaded stroke'],rack:['Rack arrival','C2 received'],inspection:['Protocol','LIMEN inspecting'], 'intake-call':['Intake / C3','Call sent · sam'],'intake-result':['Wash / C3','Waiting for clearance'],relief:['Forge','mae at the post'],'grant-desk':['Day pass issued','bob admitted until the bell'],'hold-desk':['Case closed','bob held until the bell'],'grant-two':['Rack','Two further arrivals'],'hold-two':['Rack','Two further arrivals']};
    const [sub,label]=labels[id];html+=`<div class="order-receipt">${cue(sub)}<strong>${label}</strong></div>`;
  }
  return html;
}
function bell(id,f){
  const manual=shots[id].chapter==='LIMEN on Conveyor', outcome=f.case==='pass'?'bob’s day pass has expired.':f.case==='detention'?'bob is released from custody.':'All ten workers passed Security.';
  return artLayer('logistics-room','receipt-art')+`<div class="paper-shade"></div><div class="close-slip">${cue('Loopforge / Rack register')}<h1>Day 2 closed</h1><p class="slip-sub">${manual?'LIMEN':'STILETTO'} on Conveyor</p><div class="tally"><strong>+${f.day}</strong><span>new rack arrivals</span></div><div class="weekcount"><b>${f.week} / ${project.quota}</b><div><i style="width:${f.week/project.quota*100}%"></i></div><small>Week 01 · Due Day 07</small></div><p>Day 1 carried in ${project.carry}. ${outcome}</p><a class="thin-key" href="/stepanoskin/loopforge/play">Return to main menu ↗</a></div>`;
}
function paint(node,id,device,board=false) {
  const shot=shots[id],f=frameData(id);node.dataset.device=device;
  let html;
  if(id==='console')html=consoleView(device);
  else if(['quota','handover','case','expired'].includes(id))html=cinema(id,device);
  else if(id==='appointment')html=appointment(board);
  else if(shot.bell)html=bell(id,f);
  else html=roomView(shot,f,device,board);
  node.innerHTML=html+(paused&&!board?`<div class="pause-mask"><div>${cue('Operator transport')}<h2>Shift paused</h2><p>Resume to issue an order.</p>${act('pause','Resume shift','key')}</div></div>`:'');
}
const meta=document.querySelector('#note');
function show(){
  const id=activeId(),s=shots[id], forced=new URLSearchParams(location.search).get('device');
  const tall=forced==='phone'||(forced!=='desktop'&&screen.clientWidth/screen.clientHeight<.91);
  document.body.dataset.preview=forced||'auto';
  paint(screen,id,tall?'tall':'wide');document.title=s.title+' · Day 2 · Loopforge';
  document.querySelector('#where').textContent=s.title;
  document.querySelector('#prev').disabled=id==='console'&&!trail.length;
  document.querySelector('#next').textContent=s.bell?'Restart ↺':'Next →';
  const choices={appointment:[['walk','LIMEN at Security'],['swap-walk','STILETTO at Security']],case:[['returned','Return without spending'],['expired','Expiry while reading']],returned:[['case','Reopen case'],['hold-desk','Watch the case expire']],ready:[['watch-bell','Watch to the bell'],['intake-call','Call Intake'],['calling','Call Forge']], 'hold-move':[['hold-bell','Leave Forge uncovered'],['relief','Restore coverage']]};
  meta.innerHTML=`${cue(s.chapter)}<h2>${s.title}</h2><p>${s.note}</p><div>${(choices[id]||[]).map(([target,title])=>go(target,title,'option')).join('')}</div>`;
}
function visit(id){if(paused||!shots[id]||id===activeId())return;trail.push(activeId());location.hash=id;}
function previous(){if(paused)return;const id=activeId(),prior=trail.pop()||order[Math.max(0,order.indexOf(id)-1)];location.hash=prior;}
if(screen) {
  const reset=()=>{paused=false;audio=false;picked=null;show();};window.addEventListener('hashchange',reset);
  document.querySelector('#viewer').addEventListener('click',e=>{
    const bidTarget=e.target.closest('[data-bid]'),link=e.target.closest('[data-go]'),button=e.target.closest('[data-act]');
    if(link){e.preventDefault();visit(link.dataset.go);}
    else if(bidTarget){bid=bidTarget.dataset.bid;show();}
    else if(button){if(button.dataset.act==='pause')paused=!paused;else if(button.dataset.act==='audio')audio=!audio;show();screen.querySelector(paused?'.pause-mask button':button.dataset.act==='audio'?'.exchange':'.pause')?.focus({preventScroll:true});}
  });
  screen.addEventListener('change',e=>{if(e.target.matches('select')){picked=e.target.value;show();screen.querySelector('select')?.focus({preventScroll:true});}});
  document.querySelector('#next').onclick=()=>{const id=activeId();visit(id==='appointment'&&bid==='STILETTO'?'swap-walk':shots[id].next);};
  document.querySelector('#prev').onclick=previous;
  document.querySelector('#notes').onclick=e=>{meta.hidden=!meta.hidden;e.currentTarget.setAttribute('aria-expanded',String(!meta.hidden));};
  window.addEventListener('keydown',e=>{
    if(e.target.closest('select,button,a')||e.ctrlKey||e.altKey||e.metaKey)return;
    if(e.key==='ArrowRight')document.querySelector('#next').click();
    if(e.key==='ArrowLeft')previous();
    if(e.key==='Escape'&&(paused||audio)){paused=false;audio=false;show();}
  });
  function setClean(on) {
    document.body.classList.toggle('clean',on);
    document.querySelector('.reviewbar').hidden=on;
    document.querySelector('#restore').hidden=!on;
    document.querySelector('#clean').setAttribute('aria-pressed',String(on));
    if(on){meta.hidden=true;document.querySelector('#notes').setAttribute('aria-expanded','false');}
  }
  document.querySelector('#clean').onclick=()=>setClean(true);
  document.querySelector('#restore').onclick=()=>setClean(false);
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('clean'))setClean(false);});
  new ResizeObserver(show).observe(screen);show();
} else {
  const board=document.querySelector('#board'),chapters=[...new Set(order.map(id=>shots[id].chapter))];
  document.querySelector('#chapters').innerHTML=chapters.map((c,i)=>`<a href="#chapter-${i}">${safe(c)}</a>`).join('');
  // Fixed native artboards are scaled for comparison; open either drawing at its own size.
  const scale=new ResizeObserver(entries=>entries.forEach(({target,contentRect})=>{
    target.firstElementChild.style.transform='scale('+contentRect.width/(target.dataset.device==='wide'?960:390)+')';
  }));
  const observer=new IntersectionObserver(entries=>entries.forEach(({isIntersecting,target})=>{
    if(!isIntersecting)return;observer.unobserve(target);
    for(const preview of target.querySelectorAll('.board-preview'))paint(preview.firstElementChild,target.id,preview.dataset.device,true);
  }),{rootMargin:'800px'});
  for(const [i,chapter] of chapters.entries()){
    const section=document.createElement('section');section.id='chapter-'+i;
    section.innerHTML=`<h2>${chapter}</h2>`;board.append(section);
    for(const id of order.filter(id=>shots[id].chapter===chapter)){
      const row=document.createElement('article');row.id=id;
      row.innerHTML=`<div class="pair"><div class="board-preview" data-device="wide"><div class="screen" inert></div><a href="index.html?device=desktop#${id}" aria-label="Open desktop drawing: ${shots[id].title}"></a></div><div class="board-preview" data-device="tall"><div class="screen" inert></div><a href="index.html?device=phone#${id}" aria-label="Open phone drawing: ${shots[id].title}"></a></div></div><h3>${shots[id].title}</h3><p>${shots[id].note}</p>`;
      section.append(row);observer.observe(row);for(const preview of row.querySelectorAll('.board-preview'))scale.observe(preview);
    }
  }
}
