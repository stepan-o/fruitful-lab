'use client';
import {useEffect,useRef,useState} from 'react';
import {clockText,dayTwoMinute} from '../../../lib/loopforge/shifts/factory-clock';
import {type Floor} from '../../../lib/loopforge/shifts/playthrough';
import {type Campaign,saveCampaign} from '../../../lib/loopforge/shifts/campaign-save';
import {ratings,needs} from '../../../lib/loopforge/shifts/station-line';
import {type Command,type Lead,type Room} from '../../../lib/loopforge/shifts/contract';
import {floorView,loadArt,paint,drawBidPortrait} from '../../../lib/loopforge/shifts/painter';
import {loadSkin,select} from '../../../lib/loopforge/shifts/skin';
import castArt from '../../../public/loopforge-design/sprite-briefs/reference/cast-art.843f7ebcb359c3ec.json';
import css from './shift-floor.module.css';

const art=()=>Promise.all([loadArt(''),loadSkin('/loopforge-design/days-2-4-art/v1/')]);
type Art=Awaited<ReturnType<typeof art>>;
function Bars({values,label}:{values:number[];label:string}){
  return <div className={css.bars} aria-label={label}><small>{label}</small>{['Force','Precision','Timing'].map((name,i)=>
    <div key={name} data-stat={name}><span>{['┃','⊕','◷'][i]} {name}</span><i aria-hidden="true">{[1,2,3,4,5].map(n=><b key={n} data-filled={n<=values[i]}/>)}</i><span>{values[i]}/5</span></div>)}</div>;
}
function Portrait({id,assets}:{id:string;assets:Art|null}){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const c=ref.current;if(!assets||!c)return;
    if(id==='LIMEN'||id==='STILETTO')drawBidPortrait(c,id,assets[0]);
  },[id,assets]);
  const portrait=castArt.portraits.find(p=>p.id===id);
  if(portrait)return <span className={css.portrait} aria-hidden="true" style={{backgroundImage:'url('+portrait.variants[0].src+')'}}/>;
  return <canvas ref={ref} width="36" height="35" aria-hidden="true"/>;
}
export default function ShiftFloor({run,onFinish,suspended,onClock}:{run:Campaign;onClock:(time:string)=>void;onFinish:()=>void;suspended:boolean}){
  const [floor,setFloor]=useState<Floor|null>(null),[assets,setAssets]=useState<Art|null>(null);
  const [room,setRoom]=useState<Room>(run.room),[bid,setBid]=useState<Lead|null>(null),[worker,setWorker]=useState('');
  const [notice,setNotice]=useState(''),[paused,setPaused]=useState(false),[caseOpen,setCaseOpen]=useState(false);
  const [destination,setDestination]=useState<number|null>(null);
  const [cutaway,setCutaway]=useState<Room|null>(null),[assignmentOpen,setAssignmentOpen]=useState(false);
  const ordersPaused=paused||suspended;
  const focusStation=destination??(floor?.manual?Math.max(0,floor.machines.findIndex(m=>m.canClear)):0);
  const [viewSize,resize]=useState(0);
  const signal=useRef<HTMLButtonElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null),host=useRef<Worker|null>(null);
  useEffect(()=>{
    let live=true,midpoint:ReturnType<typeof setTimeout>,reveal:ReturnType<typeof setTimeout>;
    art().then(bank=>{if(live)setAssets(bank);}).catch(e=>setNotice(String(e)));
    const w=new Worker(new URL('../../../lib/loopforge/shifts/playthrough.worker.ts',import.meta.url),{type:'module'});host.current=w;
    w.onerror=e=>setNotice(e.message||'The shift could not start.');
    w.onmessage=({data:m})=>{
      if(m.type!=='frame'){setNotice(m.reason);return;}
      const f:Floor=m.floor;
      if(m.cmd&&!run.progress.commands.some(c=>c.id===m.cmd.id))run.progress.commands.push(m.cmd);
      run.progress.tick=f.tick;
      if(run.shotSeq!==f.shotSeq){run.shotSeq=f.shotSeq;run.room=f.shot;clearTimeout(midpoint);clearTimeout(reveal);
        setCutaway(f.shot);
        midpoint=setTimeout(()=>setRoom(f.shot),650);
        reveal=setTimeout(()=>setCutaway(null),1800);
        setWorker('');setDestination(null);setAssignmentOpen(!!f.tutorial?.held);
      }
      const shiftLength=f.bell?(f.tutorial?4800:2400):0;
      const start=f.scene.world.start;
      onClock(clockText(dayTwoMinute(f.tick-start,shiftLength?f.bell-shiftLength-start:0,shiftLength,run.morningSeconds??0)));
      saveCampaign(run);setFloor(f);
    };
    w.postMessage({type:'join',source:run.source,progress:run.progress});
    return ()=>{live=false;clearTimeout(midpoint);clearTimeout(reveal);w.terminate();host.current=null;};
  },[run,onClock]);
  useEffect(()=>{
    const sync=()=>host.current?.postMessage({type:'suspend',on:paused||suspended||document.hidden});
    sync();document.addEventListener('visibilitychange',sync);return ()=>document.removeEventListener('visibilitychange',sync);
  },[paused,suspended]);
  useEffect(()=>{
    const c=canvas.current;if(!c)return;
    const observer=new ResizeObserver(()=>resize(n=>n+1));observer.observe(c);return ()=>observer.disconnect();
  },[floor?.scene.world.phase]);
  useEffect(()=>{
    const c=canvas.current,ctx=c?.getContext('2d');if(!ctx||!c||!floor||!assets||suspended)return;
    const w=Math.round(c.clientWidth),h=Math.round(c.clientHeight);if(!w||!h)return;
    if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
    const frame={tick:floor.tick,hash:'',scene:floor.scene},view=select(frame,room,'','');
    const speeches=floor.dialogue.filter(e=>e.room===room||room==='security'&&floor.scene.world.stage==='walk');
    const last=speeches.at(-1);
    view.speeches=last?speeches.filter(e=>e.tick===last.tick).map(e=>({seq:e.seq,tick:e.tick,speaker:e.actor,text:e.text,at:e.at,asset:'fl-bubble',nameplate:'fl-bubble-nameplate'})):[];
    if(signal.current){
      const bob=floor.scene.agents.find(a=>a.id==='bob');
      if(bob){
        const [x,y]=floorView(w,h,'security').xy(bob.x/1000,bob.y/1000);
        signal.current.style.left=Math.max(68,Math.min(w-68,x))+'px';
        signal.current.style.top=Math.max(68,Math.min(h-48,y+8))+'px';
      }
    }
    paint(ctx,w,h,floor.scene,room,floor.tick,assets[0],assets[1],view,{...floor,focusStation:window.matchMedia('(max-width:800px)').matches&&(!floor.tutorial||destination!==null)?focusStation:undefined});
  },[floor,assets,room,viewSize,suspended,focusStation,destination,caseOpen]);
  if(!floor)return <p role="status">{notice||'Connecting to the factory…'}</p>;
  const w=floor.scene.world, manual=floor.manual,selected=floor.workers.find(a=>a.id===worker&&a.available);
  const changeRoom=(r:Room)=>{setRoom(r);run.room=r;saveCampaign(run);setNotice('');};
  function send(action:Command['action'],target:string,incident:string,at:Room){
    if(!floor||ordersPaused)return;
    setNotice('');host.current?.postMessage({type:'command',cmd:{id:crypto.randomUUID(),day:2,tick:floor.tick,room:at,action,target,incident}});
  }
  const clock=Math.max(0,(floor.bell-floor.tick)/20),total=w.completed.length;
  if(w.phase==='briefing')return <main className={css.brief}>
    <small>DAY 2 · MORNING APPOINTMENT</small><h1>Post the supervisors</h1>
    <p>Week one · {total} / {run.quota} cortexes · Due Day 7</p>
    <div className={css.bids}>{(['LIMEN','STILETTO'] as const).map(id=><button key={id} aria-pressed={bid===id} onClick={()=>setBid(id)}>
      <Portrait id={id} assets={assets}/><strong>{id}</strong><q>{w.bids[id]}</q>
      <span>Security · {id}<br/>Conveyor · {id==='LIMEN'?'STILETTO':'LIMEN'}</span></button>)}</div>
    <button className={css.commit} disabled={!bid||ordersPaused} onClick={()=>bid&&send('appoint',bid,'morning','security')}>Commit assignment</button>
    {notice&&<p role="status">{notice}</p>}
  </main>;
  if(floor.closed)return <main className={css.brief}><small>DAY 2 · BELL</small><h1>Shift closed</h1>
    <p>{manual?'LIMEN':'STILETTO'} on Conveyor</p><h2>{floor.dayCount} new rack arrivals</h2>
    <p>Week one · {total} / {run.quota} cortexes · Due Day 7</p>
    <p>Day 1 contributed {run.source!.pieces.length}. {w.pass?'The daily pass has expired.':w.status==='detention'?'bob is released from custody.':''}</p>
    <button className={css.commit} onClick={onFinish}>Return to main menu</button></main>;
  const tutorial=floor.tutorial,lesson=tutorial?.held,controllable=!tutorial||tutorial.stage==='live';
  const showOrders=room==='conveyor'&&(lesson||controllable);
  const caseLive=w.status==='open';
  return <main className={css.floor} data-operators={room==="conveyor"&&w.stage==="work"}><header><div><small>DAY 2 · {w.stage==='work'?'SHIFT LIVE':'CREW ARRIVAL'}</small>
    <h1>{room==='security'?'Security':'Conveyor'} <span>/ {room==='security'?w.lead:manual?'LIMEN':'STILETTO'}</span></h1></div>
    <div className={css.meter}>{floor.bell?<strong>{clock.toFixed(2)} s to bell</strong>:<strong>Walk-in</strong>}<span>Rack +{floor.dayCount} · Week {total}/{run.quota}</span></div></header>
    <nav aria-label="Factory cameras">{(['security','conveyor'] as const).map(r=><button key={r} aria-pressed={room===r} disabled={!!lesson||!!cutaway} onClick={()=>changeRoom(r)}>{r==='security'?'Security':'Conveyor'}</button>)}
      <button onClick={()=>setPaused(p=>!p)}>{paused?'Resume':'Pause'}</button></nav>
    {paused&&<p role="status" className={css.pauseNote}>Shift paused. Resume play to issue an order.</p>}
    {notice&&<p role="status" className={css.pauseNote}>{notice}</p>}
    <div className={css.picture}>
    {cutaway&&<div className={css.cutaway} role="status">Meanwhile at {cutaway==='security'?'Security':'Conveyor'}</div>}
    {room==='security'&&caseLive&&!caseOpen&&<button ref={signal} className={css.eventPin} aria-label="Inspect bob’s missing ID at the desk" onClick={()=>setCaseOpen(true)}>⚑ bob · ID hold <b>{Math.max(0,Math.ceil((w.deadline-floor.tick)/20))} s</b></button>}
    <canvas className={css.stage} data-dialogue={w.stage!=='work'||room==='security'||floor.opening} ref={canvas} aria-label="Live factory floor with named workers and speech bubbles"/>
    </div>
    <div className={css.dock}>
    <div className={css.rail}><span>{w.spent?'Intervention spent':'1 intervention available'}</span>
      {caseLive&&<button onClick={()=>{changeRoom('security');setCaseOpen(true);}}>Missing ID · {Math.max(0,Math.ceil((w.deadline-floor.tick)/20))} s · Inspect</button>}
      {w.status==='pass'&&<strong role="status">bob · Daily pass granted · Cleared for Conveyor</strong>}
      {w.status==='detention'&&<strong role="status">bob · Detained until bell · Unavailable for Conveyor</strong>}
      {showOrders&&!manual&&!lesson&&<button aria-expanded={assignmentOpen} onClick={()=>setAssignmentOpen(v=>!v)}>{assignmentOpen?'Close assignments':'Assign crew'}</button>}</div>
    {room==='security'&&caseOpen&&caseLive&&<section className={css.case}><h2>bob is missing his ID</h2><p>Both desks are held. {Math.ceil((w.deadline-floor.tick)/20)} s until detention.</p>
      <button disabled={!!w.spent||ordersPaused} onClick={()=>send('issue-pass','bob',w.caseId,'security')}>Issue daily pass</button> <button disabled={!!w.spent||ordersPaused} onClick={()=>send('reject-pass','bob',w.caseId,'security')}>Reject pass · detain bob</button> <button onClick={()=>setCaseOpen(false)}>Keep watching</button></section>}
    {room==='conveyor'&&tutorial?.hint&&<aside className={css.instruction}><b>STILETTO</b> {tutorial.hint} {lesson?'· Clock held':'· Clock live'}</aside>}
    {room==='conveyor'&&w.stage==='work'&&(manual||lesson||showOrders&&assignmentOpen)&&<>
      {!manual&&<section className={css.crewSection}><h2>Assign the crew</h2><div className={css.crew}>{floor.workers.filter(a=>!lesson||tutorial.crew.includes(a.id)).map(a=><button key={a.id} disabled={!a.available} aria-pressed={worker===a.id} onClick={()=>setWorker(a.id)}>
        <Portrait id={a.id} assets={assets}/><b>{a.id}</b><small>{a.label}</small></button>)}</div>
        {selected&&<div className={css.selection}><strong>{selected.id} · {selected.label}</strong><Bars values={ratings[selected.id]} label="Worker stats"/></div>}</section>}
      <nav className={css.destinations} aria-label="Inspect a station">{floor.machines.map((m,i)=>
        <button key={m.name} aria-label={'Inspect '+m.title} aria-pressed={focusStation===i} onClick={()=>setDestination(i)}>
          {m.title}{manual&&m.canClear?' ●':''}</button>)}</nav>
      <div className={css.stations} data-lesson={!!lesson}>{floor.machines.map((m,i)=><section key={m.name} data-focused={focusStation===i}><h2>{m.title}</h2><b>{(lesson?tutorial.posts[i]:m.crew.join(' + '))||'Unstaffed'}</b>
        <p>{m.carrier?.replace('D2-','')||'Empty'} · {m.hold}</p>{manual?
        <button aria-label={'Clear '+m.title} disabled={!m.canClear||ordersPaused} onClick={()=>send('clear',m.name,m.carrier+'/'+m.caller,'conveyor')}>Clear</button>:
        <>{!lesson&&<><Bars values={needs[i]} label="Station needs"/><small data-work-rate={m.rate}>{m.cycleSeconds===null?'No crew at post':m.cycleSeconds.toFixed(2)+' s per carrier'}</small></>}
          <button disabled={!selected||ordersPaused} onClick={()=>send(lesson?'post':'assign',m.name,worker,'conveyor')}>{selected?'Send '+worker+' to '+m.title:'Select a worker'}</button></>}</section>)}</div></>}
    </div>
  </main>;
}
