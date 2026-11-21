"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {clockText,dayOneMinute,openingMinute} from "../../../lib/loopforge/shifts/factory-clock";
import FirstShift from "./FirstShift";
import ProducerConsole from "./ProducerConsole";
import LeadershipCall from "./LeadershipCall";
import {endCampaign,freshCampaign,loadCampaign,saveCampaign,type Campaign} from "../../../lib/loopforge/shifts/campaign-save";
import type {PlayerView} from "../../../lib/loopforge/first-shift/contract";
import PlaybackBar from "./PlaybackBar";
import {PlaybackTape,type Speed} from "../../../lib/loopforge/shifts/playback";
const IntroPlayer=dynamic(()=>import("../intro/IntroPlayer"),{ssr:false});
const ShiftFloor=dynamic(()=>import("./ShiftFloor"),{ssr:false});
import ThemeProvider, { useConsoleTheme } from "./ThemeProvider";
import ThemeSettings from "./ThemeSettings";
import GraphicsSettings from "../graphics/GraphicsSettings";
import { ConsoleBeacon, ConsoleSignals } from "./ConsoleSignals";
import { Art, Control, Kicker, materialStyle, type Media } from "./ConsoleParts";
import s from "./themes.module.css";

type Props={media:Media;legacyReview?:boolean};
function GameSession({media,legacyReview=false}:Props) {
  const [legacyStarted,startLegacy]=useState(false);
  const [run,setRun]=useState<Campaign|null>(null), [menu, setMenu] = useState(true), [settings, setSettings] = useState(false);
  const [dev,setDev]=useState(false),[starting,setStarting]=useState(false),[error,setError]=useState("");
  const [clock,setClock]=useState(clockText(openingMinute));
  const [paused,setPaused]=useState(false),[speed,setSpeed]=useState<Speed>(1);
  const [revision,setRevision]=useState(0),[ahead,setAhead]=useState(0);
  const tape=useRef<PlaybackTape|null>(null),savedAt=useRef(0);
  const observe=useCallback((current:Campaign,presented?:number)=>{
    if(tape.current?.id!==current.id){tape.current=new PlaybackTape(current.id);tape.current.load(current);}
    tape.current.record(current,false,presented);
    if(performance.now()-savedAt.current>1500){tape.current.save();savedAt.current=performance.now();}
  },[]);
  useEffect(()=>{
    const flush=()=>tape.current?.save();
    window.addEventListener("pagehide",flush);
    return ()=>{flush();window.removeEventListener("pagehide",flush);};
  },[]);
  function play(){
    tape.current?.discardFuture();setPaused(false);
    if(menu){if(settings)closeSettings();enter();}
  }
  function seek(delta:number){
    if(!run)return;
    observe(run);
    const restored=tape.current!.seek(run,delta);
    const next=restored.run;
    let extra=restored.remaining;
    if(next.phase==="console"||next.phase==="call"){
      next.morningSeconds=(next.morningSeconds??0)+extra;extra=0;
    }
    if(settings)closeSettings();
    setMenu(false);setPaused(true);setAhead(extra);setRevision(n=>n+1);
    setClock(clockText(next.phase==="intro"?dayOneMinute(next.seconds):openingMinute+(next.morningSeconds??0)/60));
    saveCampaign(next);setRun(next);observe(next);tape.current?.save();
  }
  const shell=useRef<HTMLDivElement>(null);
  function present(full:boolean){
    const root=shell.current;
    if(!root)return;
    // Keep the viewport composition on devices that reserve full screen for video.
    if(full&&document.fullscreenEnabled&&!document.fullscreenElement)
      void root.requestFullscreen().catch(()=>{});
    if(!full&&document.fullscreenElement===root)void document.exitFullscreen().catch(()=>{});
  }
  const skipWorker=useRef<Worker|null>(null);
  useEffect(()=>{setDev(localStorage.getItem("loopforge.display")==="dev");return ()=>skipWorker.current?.terminate();},[]);
  useEffect(()=>{
    if(!run||menu||!["console","call"].includes(run.phase))return;
    setClock(clockText(openingMinute+(run.morningSeconds??0)/60));
    if(paused)return;
    const timer=window.setInterval(()=>{
      if(document.hidden)return;
      run.morningSeconds=(run.morningSeconds??0)+.25*speed;observe(run);saveCampaign(run);
      setClock(clockText(openingMinute+run.morningSeconds/60));
    },250);
    return ()=>window.clearInterval(timer);
  },[run,menu,paused,speed,observe]);
  function secondDay(){
    if(skipWorker.current)return;
    present(!dev);setStarting(true);setError("");
    const next=freshCampaign();
    const w=new Worker(new URL("../../../lib/loopforge/intro/host.worker.ts",import.meta.url),{type:"module"});
    skipWorker.current=w;
    function stop(){w.terminate();skipWorker.current=null;setStarting(false);}
    w.onerror=()=>{stop();setError("The shift could not start. Try again.");};
    w.onmessage=({data})=>{
      if(data.local==="failure"){stop();setError(data.message);return;}
      if(data.local!=="departure")return;
      next.source=data.source;next.phase="console";next.progress.tick=data.source.tick;
      setPaused(false);setAhead(0);observe(next);saveCampaign(next);setRun(next);setMenu(false);stop();
    };
    w.postMessage({local:"skip"});
  }
  const theme = useConsoleTheme()!;
  const start = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const settingsButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (settings) dialog.current?.showModal(); else dialog.current?.close(); }, [settings]);
  useEffect(() => { if (menu) start.current?.focus(); }, [menu]);
  function closeSettings() { setSettings(false); settingsButton.current?.focus(); }
  useEffect(()=>{if(!legacyReview){const current=loadCampaign();if(current){observe(current);setRun(current);}}},[legacyReview,observe]);
  function enter() {
    if(legacyReview){startLegacy(true);setMenu(false);return;}
    present(!dev);const current=run??freshCampaign();setPaused(false);setAhead(0);tape.current?.discardFuture();observe(current);saveCampaign(current);setRun(current);setMenu(false);
  }
  function phase(next:Campaign["phase"]) {
    if(!run)return;tape.current?.seal(run);const updated={...run,phase:next};setAhead(0);observe(updated);saveCampaign(updated);setRun(updated);
  }
  function finish(){if(run)sessionStorage.removeItem("loopforge.transport."+run.id);tape.current=null;endCampaign();setMenu(true);setRun(null);}
  const view:PlayerView={
    tick:run?.source?.tick??0,day:2,shiftTick:0,phase:"choose",cash:0,condition:100,
    workers:run?.source?.agents.filter(a=>a.character==="worker").length??0,
    quota:run?.quota??0,committed:run?.source?.pieces.length??0,produced:0,retained:0,losses:0,
    people:[],events:[],adviser:null,assignments:null,briefing:null,pending:null,
  };
  const toolbar=<PlaybackBar clock={clock} episode={menu?"LOOPFORGE":run?.phase==="intro"?"DAY 1":"DAY 2"}
    paused={menu||paused} speed={speed} canSeek={!!run&&!starting} onPlay={play} onPause={()=>setPaused(true)}
    onSpeed={setSpeed} onSeek={seek} onMenu={menu?undefined:()=>{if(run)tape.current?.seal(run);setMenu(true);}}/>;
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
        <button ref={start} className={s.startControl} disabled={theme.loading||starting} onClick={enter}>{run||legacyStarted ? "Resume shift" : legacyReview?"Start shift":"Enter factory"}<span>01 / TAKE CHARGE OF THE FACTORY</span></button>
        {!legacyReview&&<>
          <button className={s.dayTwo} disabled={starting||theme.loading} onClick={secondDay}>{starting?"Opening console…":"2nd day"}</button>
          <label className={s.displaySwitch}><span>Full screen</span><input type="checkbox" role="switch" aria-label="Dev mode" checked={dev} onChange={e=>{present(!e.target.checked);setDev(e.target.checked);localStorage.setItem("loopforge.display",e.target.checked?"dev":"normal");}}/><span>Dev mode</span></label>
          {error&&<p role="alert">{error}</p>}
        </>}
        <button ref={settingsButton} className={s.menuSetting} onClick={() => setSettings(true)}>Settings <span>Graphics / presentation</span></button>
        <Link href="/stepanoskin/loopforge" prefetch={false}>← Back to Loopforge</Link>
        <small className={s.sessionNote}>{run||legacyStarted ? "Your shift is paused. Resume to continue." : legacyReview?"First-turn review":"Days 1–2 · Week one"}</small>
        <small className={s.sessionNote}>{legacyReview?"Progress lasts while this page stays open.":"Progress is saved in this tab."}</small>
        {theme.error && <p role="alert">{theme.message}</p>}
      </section>
    </main>}
    {legacyReview&&legacyStarted&&<div hidden={menu} inert={menu}><FirstShift media={media} suspended={menu} onOpenMenu={()=>setMenu(true)}/></div>}
    {!menu&&run&&<>
      {run.phase==="intro"&&<IntroPlayer key={revision} campaign={{paused,speed,ahead,seconds:run.seconds,confirmed:run.confirmed??0,onProgress:(seconds,confirmed)=>{
        const confirmedChanged=run.confirmed!==confirmed;run.confirmed=confirmed;setClock(clockText(dayOneMinute(seconds)));
        if(confirmedChanged||Math.floor(seconds*4)!==Math.floor(run.seconds*4)){run.seconds=seconds;observe(run);saveCampaign(run);}
      },onDeparture:source=>{
        tape.current?.seal(run);run.source=source;run.progress={tick:source.tick,commands:[],guided:true};phase("console");
      }}}/>}
      {run.phase==="console"&&<div inert={paused}><ProducerConsole media={media} skin={theme.recipe.console} view={view} factoryTime={clock} incoming busy={false} effects active ticking={false}
        primaryLabel="Awaiting leadership" speed={speed} onLeadership={()=>phase("call")}
        onAdviser={()=>{}} onPrimary={()=>{}} onRoom={()=>{}} onInspect={()=>{}} onFeedback={()=>{}} onNavigate={()=>{}} onSpeed={()=>{}}/></div>}
      {run.phase==="call"&&<div inert={paused}><LeadershipCall key={revision} rack paused={paused} speed={speed} topic={run.callTopic??0} onTopic={topic=>{const updated={...run,callTopic:topic};observe(updated);saveCampaign(updated);setRun(updated);}} media={media} view={view} onClose={()=>phase("console")} onContinue={()=>phase("floor")}/></div>}
      {run.phase==="floor"&&<ShiftFloor key={revision} onClock={setClock} onProgress={observe} run={run} transport={{paused,speed}} ahead={ahead} onFinish={finish}/>}
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
