"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ProducerConsole from "./ProducerConsole";
import LeadershipCall from "./LeadershipCall";
import {endCampaign,freshCampaign,loadCampaign,saveCampaign,type Campaign} from "../../../lib/loopforge/shifts/campaign-save";
import type {PlayerView} from "../../../lib/loopforge/first-shift/contract";
import floorStyle from "./shift-floor.module.css";
const IntroPlayer=dynamic(()=>import("../intro/IntroPlayer"),{ssr:false});
const ShiftFloor=dynamic(()=>import("./ShiftFloor"),{ssr:false});
import ThemeProvider, { useConsoleTheme } from "./ThemeProvider";
import ThemeSettings from "./ThemeSettings";
import GraphicsSettings from "../graphics/GraphicsSettings";
import { ConsoleBeacon, ConsoleSignals } from "./ConsoleSignals";
import { Art, Control, Kicker, materialStyle, type Media } from "./ConsoleParts";
import s from "./themes.module.css";

function GameSession({ media }: { media: Media }) {
  const [run,setRun]=useState<Campaign|null>(null), [menu, setMenu] = useState(true), [settings, setSettings] = useState(false);
  const theme = useConsoleTheme()!;
  const start = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const settingsButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (settings) dialog.current?.showModal(); else dialog.current?.close(); }, [settings]);
  useEffect(() => { if (menu) start.current?.focus(); }, [menu]);
  function closeSettings() { setSettings(false); settingsButton.current?.focus(); }
  useEffect(()=>{setRun(loadCampaign());},[]);
  function enter() {
    const current=run??freshCampaign();saveCampaign(current);setRun(current);setMenu(false);
  }
  function phase(next:Campaign["phase"]) {
    if(!run)return;const updated={...run,phase:next};saveCampaign(updated);setRun(updated);
  }
  function finish(){endCampaign();setMenu(true);setRun(null);}
  const view:PlayerView={
    tick:run?.source?.tick??0,day:2,shiftTick:0,phase:"choose",cash:0,condition:100,
    workers:run?.source?.agents.filter(a=>a.character==="worker").length??0,
    quota:run?.quota??0,committed:run?.source?.pieces.length??0,produced:0,retained:0,losses:0,
    people:[],events:[],adviser:null,assignments:null,briefing:null,pending:null,
  };
  return <div className={s.game} style={{ ...materialStyle(media), ...theme.style }} data-theme={theme.recipe.shell}>
    {menu && <main className={s.menu} aria-label="Loopforge start menu">
      <ConsoleBeacon active={!settings} />
      <div className={s.menuScene}><Art media={media} id="lobby-room" sizes="100vw" priority /></div>
      <div className={s.menuGlass} aria-hidden="true" />
      <section className={s.menuPanel} data-light-frame>
        <Kicker>DIRECTOR ACCESS / LOOPFORGE</Kicker>
        <Art media={media} id="logo" className={s.menuLogo} sizes="320px" priority />
        <h1>First shift</h1>
        <p className={s.menuMotto}>Truth stays clean.<br />Story gets messy.</p>
        <button ref={start} className={s.startControl} disabled={theme.loading} onClick={enter}>{run ? "Resume shift" : "Enter factory"}<span>01 / TAKE CHARGE OF THE FACTORY</span></button>
        <button ref={settingsButton} className={s.menuSetting} onClick={() => setSettings(true)}>Settings <span>Graphics / presentation</span></button>
        <Link href="/stepanoskin/loopforge" prefetch={false}>← Back to Loopforge</Link>
        <small className={s.sessionNote}>{run ? "Your shift is paused. Resume to continue." : "Days 1–2 · Week one"}</small>
        <small className={s.sessionNote}>Progress is saved in this tab.</small>
        {theme.error && <p role="alert">{theme.message}</p>}
      </section>
    </main>}
    {!menu&&run&&<>
      <div className={floorStyle.toolbar}><span>{run.phase==="intro"?"DAY 1 · FIRST SHIFT":run.phase==="console"?"DAY 2 · LEADERSHIP CALLING":"DAY 2 · PRODUCER CONSOLE"}</span><button onClick={()=>setMenu(true)}>Main menu</button></div>
      {run.phase==="intro"&&<IntroPlayer campaign={{seconds:run.seconds,onProgress:seconds=>{
        if(Math.floor(seconds*4)!==Math.floor(run.seconds*4)){run.seconds=seconds;saveCampaign(run);}
      },onDeparture:source=>{
        run.source=source;run.progress={tick:source.tick,commands:[]};phase("console");
      }}}/>}
      {run.phase==="console"&&<ProducerConsole media={media} skin={theme.recipe.console} view={view} incoming busy={false} effects active ticking={false}
        primaryLabel="Awaiting leadership" speed={1} onLeadership={()=>phase("call")}
        onAdviser={()=>{}} onPrimary={()=>{}} onRoom={()=>{}} onInspect={()=>{}} onFeedback={()=>{}} onNavigate={()=>{}} onSpeed={()=>{}}/>}
      {run.phase==="call"&&<LeadershipCall rack media={media} view={view} onClose={()=>phase("console")} onContinue={()=>phase("floor")}/>}
      {run.phase==="floor"&&<ShiftFloor run={run} suspended={menu} onFinish={finish}/>}
    </>}
    <dialog ref={dialog} className={s.menuDialog} onClose={closeSettings} aria-labelledby="menu-settings-title"
      onClick={e => { if (e.target === dialog.current) closeSettings(); }}>
      <ConsoleBeacon active={settings} />
      <header><Kicker>Loopforge / Settings</Kicker><h2 id="menu-settings-title">Game settings.</h2></header>
      <button className={s.closeSettings} onClick={closeSettings} aria-label="Close settings">Close ×</button>
      {settings && <><GraphicsSettings expanded /><ThemeSettings onPreview={closeSettings} /></>}
      <Control onClick={closeSettings}>Return to menu</Control>
    </dialog>
  </div>;
}
export default function GameClient({ media }: { media: Media }) {
  return <ThemeProvider><ConsoleSignals><GameSession media={media} /></ConsoleSignals></ThemeProvider>;
}
