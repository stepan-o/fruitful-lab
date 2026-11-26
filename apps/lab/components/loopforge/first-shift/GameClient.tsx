"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {clockText,openingMinute} from "../../../lib/loopforge/shifts/factory-clock";
import FirstShift from "./FirstShift";
import type {Frame} from "../../../lib/loopforge/engine/wire";
import { WelcomeVoice } from "../../../lib/loopforge/engine/welcome-voice";
import { CampaignMusicPlayer, type PlaybackStatus } from "../../../lib/loopforge/engine/music-player";
import { campaignMusic, menuMusic } from "../../../lib/loopforge/engine/music-score";
import type { Room } from "../../../lib/loopforge/shifts/contract";
import PlaybackBar from "./PlaybackBar";
import {type Speed} from "../../../lib/loopforge/shifts/playback";
const DayTwo=dynamic(()=>import("./DayTwo"),{ssr:false});
const IntroPlayer=dynamic(()=>import("../intro/CampaignIntro"),{ssr:false});
import ThemeProvider, { useConsoleTheme } from "./ThemeProvider";
import ThemeSettings from "./ThemeSettings";
import GraphicsSettings from "../graphics/GraphicsSettings";
import { ConsoleBeacon, ConsoleSignals } from "./ConsoleSignals";
import { Art, Control, Kicker, materialStyle, type Media } from "./ConsoleParts";
import s from "./themes.module.css";

type Props={media:Media;legacyReview?:boolean;initialIntro?:boolean};
function GameSession({media,legacyReview=false,initialIntro=false}:Props) {
  const [hydrated,setHydrated]=useState(false);
  const [legacyStarted,startLegacy]=useState(false);
  const [frame,setFrame]=useState<Frame|null>(null),[menu,setMenu]=useState(true),[settings,setSettings]=useState(false);
  const [dev,setDev]=useState(false),[starting,setStarting]=useState(false),[error,setError]=useState('');
  const [paused,setPaused]=useState(true),[speed,setSpeed]=useState<Speed>(1),[resumable,setResumable]=useState(false);
  const worker=useRef<Worker|null>(null),runId=useRef('');
  const w=frame?.state.world,clock=clockText(w?.minute??openingMinute);
  const welcomeElement = useRef<HTMLAudioElement>(null);
  const voice = useRef<WelcomeVoice | null>(null);
  const [welcomeEnabled, setWelcomeEnabled] = useState(true);
  const [voicing, setVoicing] = useState(false);
  const music = useRef<CampaignMusicPlayer | null>(null);
  const [musicStatus, setMusicStatus] = useState<PlaybackStatus>("ready");
  const [camera, setCamera] = useState<{ room: Room; seq: number } | null>(null);
  const floor = w?.floor;
  const room = floor && !floor.held && camera?.seq === floor.shotSeq ? camera.room : floor?.shot ?? "security";
  const seeks = useRef(0), skipping = useRef(false);
  function chooseRoom(room: Room) {
    if (floor) setCamera({room, seq: floor.shotSeq});
  }
  function toggleMusic() {
    if (musicStatus === "playing") {
      music.current?.mute();
      try { localStorage.setItem("loopforge.music.muted", "yes"); } catch {}
    } else {
      try { localStorage.removeItem("loopforge.music.muted"); } catch {}
      void music.current?.enable();
    }
  }
  const key=initialIntro?'loopforge.kernel.day-one.1':'loopforge.kernel.journal.1';
  function send(type:string,data:object={}){worker.current?.postMessage({type,...data});}
  const inFlight=useRef<string|null>(null),[pending,setPending]=useState(false);
  function clearPending(){inFlight.current=null;setPending(false);}
  function intent(data:object){
    if(inFlight.current||!worker.current)return;
    if ("action" in data && data.action === "skip") {
      skipping.current = true;
      voice.current?.reset();
      music.current?.reset();
    }
    const id=crypto.randomUUID();inFlight.current=id;setPending(true);setError('');
    send('intent',{intent:data,id});
  }
  function startKernel(fresh=false){
    if(worker.current&&!fresh)return;
    worker.current?.terminate();clearPending();setFrame(null);setError('');
    let save=null,legacy=null;try{if(!fresh){save=JSON.parse(sessionStorage.getItem(key)??'null');if(!save)legacy=JSON.parse(sessionStorage.getItem('loopforge.playthrough.1')??'null');}}catch{setError('Saved run could not be read.');}
    seeks.current = 0;
    skipping.current = false;
    setCamera(null);
    music.current?.reset(!save && !legacy);
    voice.current?.reset(true);
    runId.current=save?.run_id??legacy?.id??crypto.randomUUID();
    const engine=new Worker(new URL('../../../lib/loopforge/engine/campaign.worker.ts',import.meta.url),{type:'module'});
    worker.current=engine;engine.onerror=e=>{if(worker.current!==engine)return;music.current?.reset();voice.current?.reset();clearPending();setError(e.message||'Kernel unavailable');setStarting(false);};
    engine.onmessage=({data:m})=>{
      if(worker.current!==engine)return;
      if(m.type==='view'){
        if (m.seeked) seeks.current = Math.max(0, seeks.current - 1);
        if (m.recovered || m.seeked) { music.current?.reset(); voice.current?.reset(); }
        if (m.frame.state.world.phase !== "intro") skipping.current = false;
        setFrame(m.frame);setPaused(m.paused);setSpeed(m.rate);setStarting(false);}
      if(m.type==='save'){try{sessionStorage.setItem(key,JSON.stringify(m.journal));setResumable(true);}catch{setError('This tab could not save progress.');}}
      if(m.type==='receipt'&&m.id===inFlight.current){clearPending();if(m.rejection){skipping.current=false;setError(m.rejection);}}
      if(m.type==='notice'){seeks.current=0;setError(m.message);}
      if(m.type==='error'){seeks.current=0;skipping.current=false;music.current?.reset();clearPending();setError(m.message);setStarting(false);}
    };
    send('boot',{run:runId.current,save,legacy});send('rate',{rate:speed});
  }
  function openMenu(){setCamera(null);setMenu(true);send('pause');}
  function play(){if(settings)closeSettings();if(menu)enter();else send('play');}
  function seek(seconds: number) {
    if (settings) closeSettings();
    seeks.current++;
    voice.current?.reset();
    setCamera(null);
    music.current?.reset();
    setMenu(false);
    send('seek', {seconds});
  }
  function finish(){voice.current?.reset(true);setCamera(null);worker.current?.terminate();worker.current=null;sessionStorage.removeItem(key);sessionStorage.removeItem("loopforge.playthrough.1");setResumable(false);setFrame(null);setMenu(true);setPaused(true);}
  useEffect(()=>{
    // The server-rendered menu must not accept clicks before its handlers exist.
    setHydrated(true);
    setDev(localStorage.getItem('loopforge.display')==='dev');setResumable(!!sessionStorage.getItem(key)||!!sessionStorage.getItem('loopforge.playthrough.1'));
    if (!legacyReview) {
      if (welcomeElement.current) voice.current = new WelcomeVoice(welcomeElement.current);
      try { setWelcomeEnabled(localStorage.getItem("loopforge.welcome.muted") !== "yes"); } catch {}
      music.current = new CampaignMusicPlayer(setMusicStatus);
      music.current.visibility(!document.hidden);
      try { if (localStorage.getItem("loopforge.music.muted") === "yes") music.current.mute(); } catch {}
    }
    const hidden=()=>{
      if (document.hidden) voice.current?.reset();
      music.current?.visibility(!document.hidden);
      send('visibility',{hidden:document.hidden});
    };
    if(initialIntro){startKernel(true);setMenu(false);send('play');}
    document.addEventListener('visibilitychange',hidden);
    return ()=>{voice.current?.reset();voice.current=null;music.current?.dispose();music.current=null;worker.current?.terminate();document.removeEventListener('visibilitychange',hidden);};
  },[]);
  useEffect(() => {
    if (legacyReview) return;
    if (menu) {
      voice.current?.reset();
      music.current?.update(menuMusic(settings), false);
    } else if (frame && !seeks.current && !skipping.current) {
      voice.current?.update(frame, room, !document.hidden && !paused && welcomeEnabled);
      const view = campaignMusic(frame, room);
      if (voicing && view.surface === "security") view.speech = true;
      music.current?.update(view, paused);
    }
  }, [frame, menu, settings, room, paused, legacyReview, welcomeEnabled, voicing]);
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
  useEffect(() => { if (menu&&hydrated) start.current?.focus(); }, [menu,hydrated]);
  function closeSettings() { setSettings(false); settingsButton.current?.focus(); }
  function enter(){
    if(legacyReview){startLegacy(true);setMenu(false);return;}
    present(!dev);setStarting(!worker.current);startKernel();send('play');setMenu(false);
  }
  const toolbar=<PlaybackBar clock={clock} episode={menu?"LOOPFORGE":w?.phase==="intro"?"DAY 1":"DAY 2"}
    disabled={!hydrated}
    paused={menu||paused} speed={speed} canSeek={!!frame&&!starting} onPlay={play} onPause={()=>send("pause")}
    onSpeed={rate=>{if(worker.current)send("rate",{rate});else setSpeed(rate);}} onSeek={seek} onMenu={menu?undefined:openMenu}/>;
  const musicButton = !legacyReview && <button type="button" data-music-control
    className={s.musicControl} disabled={!hydrated} onClick={toggleMusic}>
    {musicStatus === "playing" ? "Mute music" : musicStatus === "unavailable" ? "Retry music" : "Play music"}
  </button>;
  return <div ref={shell} onClickCapture={event => {
    if ((musicStatus === "ready" || musicStatus === "playing") && !(event.target as Element).closest("[data-music-control]"))
      void music.current?.enable();
  }} className={s.game} style={{ ...materialStyle(media), ...theme.style }} data-day-two={!menu&&!!w&&w.phase!=="intro"} data-theme={theme.recipe.shell} data-display={legacyReview?"legacy":dev?"dev":"normal"}>
    {!legacyReview && <audio ref={welcomeElement} preload="none" src="/loopforge-shifts/limen-welcome.mp3"
      onPlaying={() => setVoicing(true)} onEnded={() => setVoicing(false)} onPause={() => setVoicing(false)}/>}
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
        <button ref={start} className={s.startControl} disabled={!hydrated||starting||(legacyReview&&theme.loading)} onClick={enter}>{frame||resumable||legacyStarted ? "Resume shift" : legacyReview?"Start shift":"Enter factory"}<span>01 / TAKE CHARGE OF THE FACTORY</span></button>
        {!legacyReview&&<>
          <button className={s.dayTwo} disabled={!hydrated||starting} onClick={secondDay}>{starting?"Opening console…":"2nd day"}</button>
          <label className={s.displaySwitch}><span>Full screen</span><input type="checkbox" role="switch" aria-label="Dev mode" disabled={!hydrated} checked={dev} onChange={e=>{present(!e.target.checked);setDev(e.target.checked);localStorage.setItem("loopforge.display",e.target.checked?"dev":"normal");}}/><span>Dev mode</span></label>
          {error&&<p role="alert">{error}</p>}
        </>}
        <div className={s.menuPreferences}><button ref={settingsButton} className={s.menuSetting} disabled={!hydrated} onClick={() => setSettings(true)}>Settings <span>Graphics / presentation</span></button>{musicButton}</div>
        {initialIntro&&dev&&<Link href="/stepanoskin/loopforge/play/day-one?review=sprites">Archived sprite study</Link>}
        <Link href="/stepanoskin/loopforge" prefetch={false}>← Back to Loopforge</Link>
        <small className={s.sessionNote}>{frame||resumable||legacyStarted ? "Your shift is paused. Resume to continue." : legacyReview?"Archived first-turn review":"Days 1–2 · Week one"}</small>
        <small className={s.sessionNote}>{legacyReview?"Progress lasts while this page stays open.":"Progress is saved in this tab."}</small>
        {theme.error && <p role="alert">{theme.message}</p>}
      </section>
    </main>}
    {legacyReview&&legacyStarted&&<div hidden={menu} inert={menu}><FirstShift media={media} suspended={menu} onOpenMenu={()=>setMenu(true)}/></div>}
    {!menu&&error&&<p className={s.commandError} role="alert">{error}</p>}
    {!menu&&frame&&w&&<>
      {w.phase==="intro"&&<IntroPlayer frame={frame} paused={paused} intent={intent}/>}
      {w.phase!=="intro"&&<DayTwo frame={frame} paused={paused} pending={pending} onIntent={intent} onFinish={finish} room={room} chooseRoom={chooseRoom}/>}
    </>}
    <dialog ref={dialog} className={s.menuDialog} onClose={closeSettings} aria-labelledby="menu-settings-title"
      onClick={e => { if (e.target === dialog.current) closeSettings(); }}>
      {!legacyReview&&settings&&toolbar}
      <ConsoleBeacon active={settings} />
      <header><Kicker>Loopforge / Settings</Kicker><h2 id="menu-settings-title">Game settings.</h2></header>
      <button className={s.closeSettings} onClick={closeSettings} aria-label="Close settings">Close ×</button>
      {settings && <>{musicButton}{!legacyReview && <label className={s.voiceSetting}>
        <input type="checkbox" checked={welcomeEnabled} onChange={e => {
          setWelcomeEnabled(e.target.checked);
          try { localStorage.setItem("loopforge.welcome.muted", e.target.checked ? "no" : "yes"); } catch {}
        }}/>Hear LIMEN’s greeting</label>}<GraphicsSettings expanded /><ThemeSettings onPreview={closeSettings} /></>}
      <Control onClick={closeSettings}>Return to menu</Control>
    </dialog>
  </div>;
}
export default function GameClient(props:Props) {
  return <ThemeProvider><ConsoleSignals><GameSession {...props} /></ConsoleSignals></ThemeProvider>;
}
