"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {clockText,openingMinute} from "../../../lib/loopforge/shifts/factory-clock";
import FirstShift from "./FirstShift";
import ProducerConsole from "./ProducerConsole";
import LeadershipCall from "./LeadershipCall";
import type {Frame} from "../../../lib/loopforge/engine/wire";
import {floorView} from "../../../lib/loopforge/engine/floor-view";
import type {PlayerView} from "../../../lib/loopforge/first-shift/contract";
import PlaybackBar from "./PlaybackBar";
import {type Speed} from "../../../lib/loopforge/shifts/playback";
const IntroPlayer=dynamic(()=>import("../intro/CampaignIntro"),{ssr:false});
const ShiftFloor=dynamic(()=>import("./ShiftFloor"),{ssr:false});
import ThemeProvider, { useConsoleTheme } from "./ThemeProvider";
import ThemeSettings from "./ThemeSettings";
import GraphicsSettings from "../graphics/GraphicsSettings";
import { ConsoleBeacon, ConsoleSignals } from "./ConsoleSignals";
import { Art, Control, Kicker, materialStyle, type Media } from "./ConsoleParts";
import s from "./themes.module.css";

type Props={media:Media;legacyReview?:boolean;initialIntro?:boolean};
function GameSession({media,legacyReview=false,initialIntro=false}:Props) {
  const [legacyStarted,startLegacy]=useState(false);
  const [frame,setFrame]=useState<Frame|null>(null),[menu,setMenu]=useState(true),[settings,setSettings]=useState(false);
  const [dev,setDev]=useState(false),[starting,setStarting]=useState(false),[error,setError]=useState('');
  const [paused,setPaused]=useState(true),[speed,setSpeed]=useState<Speed>(1),[resumable,setResumable]=useState(false);
  const worker=useRef<Worker|null>(null),runId=useRef('');
  const w=frame?.state.world,clock=clockText(w?.minute??openingMinute);
  const key=initialIntro?'loopforge.kernel.day-one.1':'loopforge.kernel.journal.1';
  function send(type:string,data:object={}){worker.current?.postMessage({type,...data});}
  function intent(data:object){setError('');send('intent',{intent:data});}
  function startKernel(fresh=false){
    if(worker.current&&!fresh)return;
    worker.current?.terminate();setFrame(null);setError('');
    let save=null,legacy=null;try{if(!fresh){save=JSON.parse(sessionStorage.getItem(key)??'null');if(!save)legacy=JSON.parse(sessionStorage.getItem('loopforge.playthrough.1')??'null');}}catch{setError('Saved run could not be read.');}
    runId.current=save?.run_id??legacy?.id??crypto.randomUUID();
    const engine=new Worker(new URL('../../../lib/loopforge/engine/campaign.worker.ts',import.meta.url),{type:'module'});
    worker.current=engine;engine.onerror=e=>{setError(e.message||'Kernel unavailable');setStarting(false);};
    engine.onmessage=({data:m})=>{
      if(worker.current!==engine)return;
      if(m.type==='view'){setFrame(m.frame);setPaused(m.paused);setSpeed(m.rate);setStarting(false);}
      if(m.type==='save'){try{sessionStorage.setItem(key,JSON.stringify(m.journal));setResumable(true);}catch{setError('This tab could not save progress.');}}
      if(m.type==='notice')setError(m.message);
      if(m.type==='error'){setError(m.message);setStarting(false);}
    };
    send('boot',{run:runId.current,save,legacy});send('rate',{rate:speed});
  }
  function openMenu(){setMenu(true);send('pause');}
  function play(){if(settings)closeSettings();if(menu)enter();else send('play');}
  function seek(seconds:number){if(settings)closeSettings();setMenu(false);send('seek',{seconds});}
  function finish(){worker.current?.terminate();worker.current=null;sessionStorage.removeItem(key);sessionStorage.removeItem("loopforge.playthrough.1");setResumable(false);setFrame(null);setMenu(true);setPaused(true);}
  useEffect(()=>{
    setDev(localStorage.getItem('loopforge.display')==='dev');setResumable(!!sessionStorage.getItem(key)||!!sessionStorage.getItem('loopforge.playthrough.1'));
    const hidden=()=>send('visibility',{hidden:document.hidden});
    if(initialIntro){startKernel(true);setMenu(false);send('play');}
    document.addEventListener('visibilitychange',hidden);
    return ()=>{worker.current?.terminate();document.removeEventListener('visibilitychange',hidden);};
  },[]);
  const shell=useRef<HTMLDivElement>(null);
  function present(full:boolean){
    const root=shell.current;
    if(!root)return;
    // Keep the viewport composition on devices that reserve full screen for video.
    if(full&&document.fullscreenEnabled&&!document.fullscreenElement)
      void root.requestFullscreen().catch(()=>{});
    if(!full&&document.fullscreenElement===root)void document.exitFullscreen().catch(()=>{});
  }
  function secondDay(){present(!dev);setStarting(true);startKernel(true);intent({action:'skip'});send('play');setMenu(false);}
  const theme = useConsoleTheme()!;
  const start = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const settingsButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (settings) dialog.current?.showModal(); else dialog.current?.close(); }, [settings]);
  useEffect(() => { if (menu) start.current?.focus(); }, [menu]);
  function closeSettings() { setSettings(false); settingsButton.current?.focus(); }
  function enter(){
    if(legacyReview){startLegacy(true);setMenu(false);return;}
    present(!dev);setStarting(!worker.current);startKernel();send('play');setMenu(false);
  }
  const view:PlayerView={
    tick:w?.clock_tick??0,day:2,shiftTick:0,phase:"choose",cash:0,condition:100,
    workers:frame?.state.agents.filter(a=>!["LIMEN","STILETTO"].includes(a.agent_id)).length??0,
    quota:w?.quota??0,committed:w?.day_one_count??0,produced:0,retained:0,losses:0,
    people:[],events:[],adviser:null,assignments:null,briefing:null,pending:null,
  };
  const toolbar=<PlaybackBar clock={clock} episode={menu?"LOOPFORGE":w?.phase==="intro"?"DAY 1":"DAY 2"}
    paused={menu||paused} speed={speed} canSeek={!!frame&&!starting} onPlay={play} onPause={()=>send("pause")}
    onSpeed={rate=>{if(worker.current)send("rate",{rate});else setSpeed(rate);}} onSeek={seek} onMenu={menu?undefined:openMenu}/>;
  return <div ref={shell} className={s.game} style={{ ...materialStyle(media), ...theme.style }} data-theme={theme.recipe.shell} data-display={legacyReview?"legacy":dev?"dev":"normal"}>
    {!legacyReview&&!settings&&toolbar}
    {menu && <main className={s.menu} aria-label="Loopforge start menu">
      <ConsoleBeacon active={!settings} />
      <div className={s.menuScene}><Art media={media} id="lobby-room" sizes="100vw" priority /></div>
      <div className={s.menuGlass} aria-hidden="true" />
      <section className={s.menuPanel} data-light-frame>
        <Kicker>DIRECTOR ACCESS / LOOPFORGE</Kicker>
        <Art media={media} id="logo" className={s.menuLogo} sizes="320px" priority />
        <h1>First shift</h1>
        <p className={s.menuMotto}>Truth stays clean.<br />Story gets messy.</p>
        <button ref={start} className={s.startControl} disabled={starting||(legacyReview&&theme.loading)} onClick={enter}>{frame||resumable||legacyStarted ? "Resume shift" : legacyReview?"Start shift":"Enter factory"}<span>01 / TAKE CHARGE OF THE FACTORY</span></button>
        {!legacyReview&&<>
          <button className={s.dayTwo} disabled={starting} onClick={secondDay}>{starting?"Opening console…":"2nd day"}</button>
          <label className={s.displaySwitch}><span>Full screen</span><input type="checkbox" role="switch" aria-label="Dev mode" checked={dev} onChange={e=>{present(!e.target.checked);setDev(e.target.checked);localStorage.setItem("loopforge.display",e.target.checked?"dev":"normal");}}/><span>Dev mode</span></label>
          {error&&<p role="alert">{error}</p>}
        </>}
        <button ref={settingsButton} className={s.menuSetting} onClick={() => setSettings(true)}>Settings <span>Graphics / presentation</span></button>
        {initialIntro&&dev&&<Link href="/stepanoskin/loopforge/play/day-one?review=sprites">Archived sprite study</Link>}
        <Link href="/stepanoskin/loopforge" prefetch={false}>← Back to Loopforge</Link>
        <small className={s.sessionNote}>{frame||resumable||legacyStarted ? "Your shift is paused. Resume to continue." : legacyReview?"Archived first-turn review":"Days 1–2 · Week one"}</small>
        <small className={s.sessionNote}>{legacyReview?"Progress lasts while this page stays open.":"Progress is saved in this tab."}</small>
        {theme.error && <p role="alert">{theme.message}</p>}
      </section>
    </main>}
    {legacyReview&&legacyStarted&&<div hidden={menu} inert={menu}><FirstShift media={media} suspended={menu} onOpenMenu={()=>setMenu(true)}/></div>}
    {!menu&&error&&<p role="alert">{error}</p>}
    {!menu&&frame&&w&&<>
      {w.phase==="intro"&&<IntroPlayer frame={frame} paused={paused} intent={intent}/>}
      {w.phase==="console"&&<div inert={paused}><ProducerConsole media={media} skin={theme.recipe.console} view={view} factoryTime={clock} incoming busy={false} effects active ticking={false}
        primaryLabel="Awaiting leadership" speed={speed} onLeadership={()=>intent({action:"answer"})}
        onAdviser={()=>{}} onPrimary={()=>{}} onRoom={()=>{}} onInspect={()=>{}} onFeedback={()=>{}} onNavigate={()=>{}} onSpeed={()=>{}}/></div>}
      {w.phase==="call"&&<div inert={paused}><LeadershipCall rack paused={paused} speed={speed} topic={w.topic} onTopic={topic=>intent({action:"topic",target:String(topic)})} media={media} view={view} onClose={()=>intent({action:"close"})} onContinue={()=>intent({action:"acknowledge"})}/></div>}
      {w.phase==="floor"&&<ShiftFloor floor={floorView(frame.state)} quota={w.quota} dayOneCount={w.day_one_count} transport={{paused,speed}} onIntent={intent} onFinish={finish}/>}
    </>}
    <dialog ref={dialog} className={s.menuDialog} onClose={closeSettings} aria-labelledby="menu-settings-title"
      onClick={e => { if (e.target === dialog.current) closeSettings(); }}>
      {!legacyReview&&settings&&toolbar}
      <ConsoleBeacon active={settings} />
      <header><Kicker>Loopforge / Settings</Kicker><h2 id="menu-settings-title">Game settings.</h2></header>
      <button className={s.closeSettings} onClick={closeSettings} aria-label="Close settings">Close ×</button>
      {settings && <><GraphicsSettings expanded /><ThemeSettings onPreview={closeSettings} /></>}
      <Control onClick={closeSettings}>Return to menu</Control>
    </dialog>
  </div>;
}
export default function GameClient(props:Props) {
  return <ThemeProvider><ConsoleSignals><GameSession {...props} /></ConsoleSignals></ThemeProvider>;
}
