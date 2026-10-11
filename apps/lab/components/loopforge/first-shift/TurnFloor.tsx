'use client';
import { useEffect, useRef, useState } from 'react';
import { PRICES, type Command, type Fixture, type PlayerView } from '@/lib/loopforge/first-turn/contract';
import { floorPresentation } from '@/lib/loopforge/first-turn/presentation';
import type { FactoryScene, Focus, SceneReport } from '../factory-study/scene';
import { Control, Kicker, Tape, name, roomName, time, type Media } from './ConsoleParts';
import { SupervisorSignal } from './StatusFeedback';
import s from './turn-floor.module.css';

const names:Record<Fixture,string>={terminal:'Clearance terminal',gate:'Access gate',drive:'Conveyor drive'};
const descriptions:Record<Fixture,string>={terminal:'Every worker needs a record before they reach the line.',gate:'Control the threshold between clearance and production.',drive:'Bring the starter line online. The room still has space to grow.'};
const order:Fixture[]=['terminal','gate','drive'];
export default function TurnFloor({view,media,room,onRoom,onBack,send,busy,visible,playing,effects,onIncident,onPause,onFeedback}:{view:PlayerView;media:Media;room:'security'|'conveyor';onRoom:(r:'security'|'conveyor')=>void;onBack:()=>void;send:(c:Command)=>Promise<boolean>;busy:boolean;visible:boolean;playing:boolean;effects:boolean;onIncident:()=>void;onPause:()=>void;onFeedback:()=>void}) {
  const canvas=useRef<HTMLCanvasElement>(null), world=useRef<FactoryScene|null>(null), outer=useRef<HTMLDivElement>(null);
  const [report,setReport]=useState<SceneReport|null>(null),[attempt,setAttempt]=useState(0);
  const [ready,setReady]=useState(false),[error,setError]=useState(''),[angle,setAngle]=useState(0),[wide,setWide]=useState(false),[operating,setOperating]=useState(false);
  const [buildRoom,setBuildRoom]=useState<Focus>('lobby'),[selected,setSelected]=useState<Fixture|null>(null);
  const latest=useRef({view,send,playing,selected});
  useEffect(()=>{latest.current={view,send,playing,selected};},[view,send,playing,selected]);
  const night=view.floor.stage==='night';
  const focused=night?buildRoom:room;
  useEffect(()=>{
    let disposed=false;
    void import('../factory-study/scene').then(({createFactoryScene})=>{
      if(disposed||!canvas.current)return;
      const renderer=createFactoryScene(canvas.current, fixture=>{const current=latest.current;if(current.selected===fixture)void current.send({type:'install',fixture}).then(ok=>{if(ok)setSelected(null);});},setReport,()=>{});
      world.current=renderer;renderer.isolate(true);renderer.update(floorPresentation(latest.current.view,latest.current.playing));renderer.inset(0,0);setReady(true);
    }).catch(()=>{if(!disposed)setError('The floor signal could not start. Your confirmed run is intact.');});
    return()=>{disposed=true;world.current?.dispose();world.current=null;};
  },[attempt]);
  useEffect(()=>{const element=outer.current;if(!element)return;const observer=new ResizeObserver(entries=>setWide(entries[0].contentRect.width>=950));observer.observe(element);return()=>observer.disconnect();},[]);
  useEffect(()=>{if(ready){world.current?.update(floorPresentation(view,playing));}},[view,playing,ready]);
  useEffect(()=>{if(ready){world.current?.focus(focused);world.current?.cctv(!night&&!operating,angle,wide&&!operating);world.current?.inset(0,0);if(operating)world.current?.framing('detail');}},[focused,night,operating,angle,wide,ready]);
  useEffect(()=>{world.current?.build(night,selected);},[night,selected,ready]);
  useEffect(()=>{world.current?.motion(effects);},[effects,ready]);
  useEffect(()=>{world.current?.active(visible);},[visible,ready]);
  const next=order[view.floor.installed.length];
  const choose=(fixture:Fixture)=>{setBuildRoom(fixture==='drive'?'conveyor':'security');setSelected(fixture);};
  const install=async()=>{if(selected&&await send({type:'install',fixture:selected}))setSelected(null);};
  const change=(feed:PlayerView['floor']['feed'],drive:PlayerView['floor']['drive'])=>void send({type:'set_operation',feed,drive});
  const operator=view.assignments?.[room];
  return <section ref={outer} className={s.floor} hidden={!visible} aria-label={night?'Opening night construction':'Live room floor'} data-operating={operating} data-night={night} data-motion={effects}>
    <header className={s.heading}><div><Kicker>{night?'NIGHT ZERO / COMMISSIONING':`FLOOR 01 / ${playing?'LIVE SHIFT':'HELD'}`}</Kicker><h1>{night?buildRoom==='lobby'?'Welcome to Loopforge.':buildRoom==='security'?'Commission Security.':'Wake the line.':roomName(room)}</h1></div>
      {!night&&<div className={s.roomSelector}>{(['security','conveyor'] as const).map(id=><button key={id} aria-pressed={room===id} onClick={()=>onRoom(id)}>{roomName(id)}</button>)}<button onClick={()=>{setOperating(false);onBack();}}>← Producer console</button></div>}
    </header>
    <div className={s.roomBody}>
      <div className={s.feedFrame} data-triple={!night&&!operating&&wide}>
        <canvas ref={canvas} tabIndex={0} aria-label={night?'Factory construction. Drag to orbit; scroll or pinch to zoom. Use the equipment controls to select and confirm the marked socket.':`Live ${roomName(room)}. Three camera angles of the same room.`} />
        <div className={s.glass} aria-hidden="true" />
        <span className={s.rec}><i />{night?'COMMISSIONING':playing?'REC':'HELD'} · {night?'00':`0${angle+1}`}<small>{night?'PRODUCTION DISCONNECTED':`DAY 01 · ${time(view.shiftTick)} · ${view.produced} COMPLETED`}</small></span>
        {!ready&&<div className={s.signal} role="status">{error||'Connecting the floor signal…'}</div>}
        {error&&<button className={s.recover} onClick={()=>{setError('');setReady(false);setAttempt(n=>n+1);}}>Reconnect floor</button>}
        {!night&&!operating&&wide&&<div className={s.alternateTargets}>{[1,2].map(n=><button key={n} onClick={()=>setAngle((angle+n)%3)} aria-label={`Promote camera ${(angle+n)%3+1}`}><Tape>{['FLOW / ARRIVAL','WORK / CONTACT','EXIT / THRESHOLD'][(angle+n)%3]}</Tape></button>)}</div>}
        {!night&&<nav className={s.angleRail} aria-label="Room camera angle">{['Flow','Work','Exit'].map((label,i)=><button key={label} aria-pressed={angle===i&&!operating} onClick={()=>{setOperating(false);setAngle(i);}}>0{i+1} {label}</button>)}{view.phase==='running'&&<button onClick={onPause}>{playing?'Pause shift':'Resume shift'}</button>}</nav>}
        {night&&selected&&<div className={s.placement}><Tape>PLACEMENT PREVIEW</Tape><strong>{names[selected]}</strong><span>¤ {PRICES[selected]} · fixed commissioning socket</span><Control onClick={()=>void install()} disabled={busy||!ready}>Install {names[selected]}</Control><button onClick={()=>setSelected(null)}>Cancel preview</button></div>}
      </div>
      <aside className={s.deck} aria-label={night?'Commissioning controls':operating?'Line operating controls':'Room status'}>
        {night?<>
          {selected&&<div className={s.mobilePlacement}><Tape>PLACEMENT PREVIEW</Tape><strong>{names[selected]}</strong><Control onClick={()=>void install()} disabled={busy||!ready}>Install {names[selected]}</Control><button onClick={()=>setSelected(null)}>Cancel preview</button></div>}
          <div className={s.funds}><small>AVAILABLE FUNDS</small><b>¤ {view.cash}</b></div>
          <ol className={s.installations}>{order.map((fixture,i)=><li key={fixture} data-done={view.floor.installed.includes(fixture)}><span>{view.floor.installed.includes(fixture)?'✓':`0${i+1}`}</span><div><strong>{names[fixture]}</strong><small>{fixture==='drive'?'Lattice Forge':'Security'} · ¤ {PRICES[fixture]}</small></div></li>)}</ol>
          {buildRoom==='lobby'?<><p>The factory is yours. Start at Security; nobody reaches the line without passing its gate.</p><Control tone="primary" onClick={()=>{setBuildRoom('security');choose('terminal');}}>Enter Security →</Control></>:next?<><Kicker>{selected?'READY TO INSTALL':'NEXT INSTALLATION'}</Kicker><h2>{names[next]}</h2><p>{descriptions[next]}</p><Control onClick={()=>choose(next)} disabled={busy||!ready}>{selected===next?'Focus marked socket':`Place ${names[next]} →`}</Control></>:<><Kicker>STARTER CHAIN READY</Kicker><h2>Keep the reserve.<br/>Or widen the exit.</h2><p>The outtake attachment clears two cradles per cycle. It costs ¤ 60 that you could keep for later construction.</p><Control onClick={()=>void send({type:'buy_outtake'})} disabled={busy||view.floor.attachment||view.cash<60}>{view.floor.attachment?'Outtake attachment installed':'Install outtake attachment · ¤ 60'}</Control><Control tone="primary" disabled={busy} onClick={()=>void send({type:'finish_build'})}>End construction → Morning</Control></>}
        </>:<>
          <Kicker>{operator?`${name(operator)} / ROOM OPERATOR`:'NO SUPERVISOR ASSIGNED'}</Kicker>
          {operator&&<SupervisorSignal media={media} view={view} person={operator} compact onOpen={onFeedback} />}
          <div className={s.process} aria-label="Production chain">
            <div data-warning={view.floor.intake>=5}><small>INTAKE</small><b>{view.floor.intake}<em>/ 6</em></b><span>waiting cradles</span></div>
            <div><small>ASSEMBLY</small><b>{Math.min(100,Math.floor(view.floor.assembly/80*100))}<em>%</em></b><span>current brain</span></div>
            <div data-warning={view.floor.blocked}><small>OUTTAKE</small><b>{view.floor.outtake}<em>/ 3</em></b><span>awaiting clearance</span></div>
          </div>
          <p className={s.concern} role="status">{view.floor.concern}</p>
          {view.pending?<Control tone="danger" onClick={onIncident}>Respond to {view.pending.title} →</Control>:view.phase==='running'?operating?<>
            <fieldset disabled={busy}><legend>Intake valve <span>SUPPLY</span></legend><div className={s.switches}><button aria-pressed={view.floor.feed==='metered'} disabled={view.floor.feed==='metered'} onClick={()=>change('metered',view.floor.drive)}>Metered<small>One cradle / 4s</small></button><button aria-pressed={view.floor.feed==='open'} disabled={view.floor.feed==='open'} onClick={()=>change('open',view.floor.drive)}>Open<small>One cradle / 1s</small></button></div><button className={s.hold} aria-pressed={view.floor.feed==='hold'} disabled={view.floor.feed==='hold'} onClick={()=>change('hold',view.floor.drive)}>Close intake<small>Let existing work clear</small></button></fieldset>
            <fieldset disabled={busy}><legend>Drive governor <span>EFFORT</span></legend><div className={s.switches}><button aria-pressed={view.floor.drive==='steady'} disabled={view.floor.drive==='steady'} onClick={()=>change(view.floor.feed,'steady')}>Steady<small>Preserve headroom</small></button><button aria-pressed={view.floor.drive==='push'} disabled={view.floor.drive==='push'} onClick={()=>change(view.floor.feed,'push')}>Push<small>+50% work · more wear</small></button></div></fieldset>
            <small className={s.receipt}>{busy?'Transmitting order…':`Confirmed · ${view.floor.feed} intake / ${view.floor.drive} drive`}</small>
            <button className={s.return} onClick={()=>setOperating(false)}>Return to CCTV →</button>
          </>:<Control tone="primary" onClick={()=>{onRoom('conveyor');setOperating(true);}}>Take the line controls →</Control>:<p>Prepare the assignments and start the shift from the producer console.</p>}
          <div className={s.totals}><span>COMPLETED <b>{view.produced}</b></span><span>LINE CONDITION <b>{view.condition}%</b></span></div>
          <small>{view.floor.attachment?'Outtake attachment · two per clearance cycle':'Standard outtake · one per clearance cycle'}</small>
        </>}
        <details className={s.quality}><summary>Signal quality</summary><output>{report?`${report.fps} frames/s · ${report.resolution}\nFrame interval p95 ${report.p95} ms / p99 ${report.p99} ms\n${report.drawCalls} draw calls · ${report.triangles?.toLocaleString()} triangles across all cameras\n${report.workers} bodies · CPU ${report.renderMs+report.updateMs} ms\n${report.renderer}`:'Measuring…'}</output></details>
      </aside>
    </div>
  </section>;
}
