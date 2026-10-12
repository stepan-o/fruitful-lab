"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { StudyHost } from "@/lib/loopforge/factory-study/host";
import { SHIFT_TICKS, initialStudy, type Command, type Phase, type StudyState } from "@/lib/loopforge/factory-study/kernel";
import transitionAssets from "@/lib/assets/generated/loopforge-time-transitions.json";
import type { FactoryScene, Focus, Framing, SceneReport } from "./scene";
import type { FactoryAudio } from "../first-shift/audio";
import { accessible, zone, FLOOR_SIZE, type ManagedRoomId } from "@/lib/loopforge/spatial/floor";
import { reservedArea } from "@/lib/loopforge/spatial/capacity";
import FloorPlan from "./FloorPlan";
import { ROOM_STAGING } from "@/lib/loopforge/spatial/equipment";
import styles from "./factory-study.module.css";

const PHASE_NAMES: Record<Phase, string> = { night: "Night", morning: "Morning", shift: "Shift start" };
const images = Object.fromEntries(Object.entries(transitionAssets.assets).map(([id, asset]) => [id, asset.variants.at(-1)!.src]));

/** One persistent camera/scene. Prebuilt floor; phase admission belongs to the host. */
export default function FactoryStudy() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const dock = useRef<HTMLElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const world = useRef<FactoryScene | null>(null);
  const host = useRef<StudyHost | null>(null);
  const audio = useRef<FactoryAudio | null>(null);
  const soundPending = useRef(false);
  const blocked = useRef(true);
  const inspecting = useRef(false);
  const cameraFocus = useRef<Focus>("lobby");
  const [framing, setFraming] = useState<Framing>("work");
  const [inspection, setInspection] = useState(false);
  const [state, setState] = useState<StudyState>(() => initialStudy());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState<Focus>("lobby");
  const [mapOpen, setMapOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [motion, setMotion] = useState(true);
  const [feeder, setFeeder] = useState(false);
  const [report, setReport] = useState<SceneReport | null>(null);
  const [notice, setNotice] = useState("");
  const [card, setCard] = useState<{ phase: Phase; day: number; key: string } | null>({ phase: "morning", day: 1, key: "1-morning" });
  const [loadedCard, setLoadedCard] = useState("");

  const send = useCallback((command: Command) => {
    if (blocked.current) return;
    const result = host.current?.send(command);
    if (result && !result.ok) setNotice(result.reason);
    else setNotice("");
  }, []);
  const look = useCallback((where: Focus) => { cameraFocus.current = where; world.current?.focus(where); setFocus(where); setFraming("work"); }, []);

  useEffect(() => {
    if (!canvas.current) return;
    let disposed = false;
    const fit = () => { if(dock.current && canvas.current) world.current?.inset(canvas.current.clientHeight-dock.current.getBoundingClientRect().top+12, (navigation.current?.getBoundingClientRect().bottom ?? 113)+12); };
    const size = new ResizeObserver(fit); if(dock.current) size.observe(dock.current); if(navigation.current) size.observe(navigation.current);
    const localHost = new StudyHost(); host.current = localHost;
    let lastEvent = 0, lastUiTick = -5, lastPhase = "1-morning";
    const unsubscribe = localHost.subscribe(s => {
      world.current?.update(s);
      const event = s.events.at(-1);
      if (event && event.id !== lastEvent) {
        audio.current?.cue(event.kind === "jam" ? "impact" : event.kind === "release" ? "release" : event.kind === "cycle" ? "batch" : event.kind === "phase" && s.phase === "night" ? "end" : "connect");
      }
      const phaseKey = `${s.day}-${s.phase}`;
      if (phaseKey !== lastPhase) {
        lastPhase = phaseKey; blocked.current = true; localHost.suspendClock();
        setMapOpen(false); setCard({ phase: s.phase, day: s.day, key: phaseKey });
      }
      if (s.tick - lastUiTick >= 5 || event?.id !== lastEvent || s.tick === 0) { setState(s); lastUiTick = s.tick; }
      lastEvent = event?.id ?? 0;
      audio.current?.machine(s.running && !s.jammed && !blocked.current, document.hidden, s.pace === "push");
    });
    void import("./scene").then(({ createFactoryScene }) => {
      if (disposed || !canvas.current) return;
      const renderer = createFactoryScene(canvas.current, setReport, look);
      world.current = renderer;
      renderer.update(localHost.snapshot); renderer.study(inspecting.current); renderer.focus(cameraFocus.current);
      fit();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.motion(!reduced); setMotion(!reduced); setReady(true);
    }).catch((cause: unknown) => { console.error("Factory study initialization failed", cause); if (!disposed) setError("The 3D view could not start. Please reload, or return to the console."); });
    const visibility = () => {
      if (document.hidden || blocked.current) localHost.suspendClock(); else localHost.resumeClock();
      const s = localHost.snapshot;
      audio.current?.machine(s.running && !s.jammed && !blocked.current, document.hidden, s.pace === "push");
    };
    document.addEventListener("visibilitychange", visibility);
    return () => { disposed = true; size.disconnect(); unsubscribe(); localHost.dispose(); host.current=null; world.current?.dispose(); world.current = null; audio.current?.close(); audio.current = null; document.removeEventListener("visibilitychange", visibility); };
  }, [look]);

  useEffect(() => {
    if (!card || !ready || loadedCard !== card.key) return;
    const timer = window.setTimeout(() => {
      setCard(null); blocked.current = false;
      if (!document.hidden) host.current?.resumeClock();
      const s = host.current?.snapshot;
      if (s) audio.current?.machine(s.running && !s.jammed, document.hidden, s.pace === "push");
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [card, ready, loadedCard]);

  useEffect(() => {
    // Decode the three small interludes ahead of their next appearance.
    for (const src of Object.values(images)) { const image = new Image(); image.src = src; void image.decode().catch(() => {}); }
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (document.querySelector("dialog[open]")) return;
      if (blocked.current || e.altKey || e.ctrlKey || e.metaKey || (e.target instanceof HTMLElement && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName))) return;
      if (e.key === "1") look("security"); if (e.key === "2") look("conveyor"); if (e.key === "3") look("wide");
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [look]);

  const toggleSound = async () => {
    if (soundPending.current) return;
    if (sound) { audio.current?.close(); audio.current = null; setSound(false); return; }
    soundPending.current = true;
    let player: FactoryAudio | null = null;
    try {
      const { FactoryAudio: Sound } = await import("../first-shift/audio");
      if (!host.current) return;
      player = new Sound(); await player.enable();
      const s = host.current?.snapshot;
      if (!s) { player.close(); return; }
      audio.current = player; setSound(true);
      player.machine(s.running && !s.jammed && !blocked.current, document.hidden, s.pace === "push");
    } catch { player?.close(); if (host.current) setNotice("Audio is unavailable. The scene can still run silently."); }
    finally { soundPending.current = false; }
  };
  const inspect = () => {
    const enabled = !inspecting.current; inspecting.current = enabled; setInspection(enabled); world.current?.study(enabled);
    blocked.current = enabled;
    if(enabled){host.current?.suspendClock();audio.current?.machine(false,false,false);look("conveyor");}
    else if(!document.hidden) host.current?.resumeClock();
  };
  const progress = Math.min(100, state.shiftTick / SHIFT_TICKS * 100);
  const status = state.phase === "night" ? "PRODUCTION STOPPED" : state.phase === "morning" ? "CREW READY" : state.jammed ? "LINE HELD" : state.running ? "LINE RUNNING" : "PAUSED";
  const sealed = !inspection && focus !== "wide" && !accessible(focus, state.unlockedRooms);
  const focusedRoom = focus !== "wide" ? zone(focus) : null;
  const staging = focus !== "wide" && focusedRoom?.kind === "managed" ? ROOM_STAGING[focus as ManagedRoomId] : null;
  const cardSrc = card ? images[card.phase] : undefined;

  return <main className={styles.stage} data-motion={motion ? "full" : "reduced"} data-jammed={state.jammed}>
    <canvas ref={canvas} className={styles.canvas} aria-label="Interactive 3D factory floor. Security and Lattice Forge are online; four later rooms are sealed. Drag to orbit, use two fingers or right drag to pan, pinch or scroll to zoom. Room focus buttons provide an alternative." />
    <div className={styles.vignette} aria-hidden="true" />
    <div className={styles.interface} inert={!ready || !!card}>
      <header className={styles.header}>
        <Link href="/stepanoskin/loopforge/play" className={styles.brand}>LOOPFORGE <span>FLOOR 01 / CALIBRATION</span></Link>
        <div className={styles.clock}>DAY {String(state.day).padStart(2, "0")} <b>{state.phase === "shift" ? "SHIFT" : PHASE_NAMES[state.phase].toUpperCase()}</b><i>{status}</i></div>
        <div className={styles.utilities}><button onClick={toggleSound} aria-pressed={sound}>Sound {sound ? "on" : "off"}</button><button onClick={() => { world.current?.motion(!motion); setMotion(!motion); }} aria-pressed={motion}>Motion {motion ? "on" : "reduced"}</button></div>
      </header>
      <nav ref={navigation} className={styles.rooms} aria-label="Camera focus">
        {([ ["wide", "↗", "Overview"], ["lobby", "L", "Lobby"], ["security", "01", "Security"], ["conveyor", "02", "Conveyor"] ] as const).map(([id, number, title]) => <button key={id} onClick={() => look(id)} aria-pressed={focus === id}><span>{number}</span>{title}</button>)}
        <button onClick={() => setMapOpen(true)} aria-haspopup="dialog"><span>⌗</span>Floor plan</button>
        <button onClick={inspect} aria-pressed={inspection}><span>◇</span>{inspection ? "Opening view" : "Equipment study"}</button>
        {focus !== "wide" && <button onClick={() => { const mode = framing === "work" ? "room" : "work"; world.current?.framing(mode); setFraming(mode); }} aria-pressed={framing === "room"}><span>⤢</span>{framing === "work" ? "Whole room" : "Work area"}</button>}
        {focus === "lobby" && <button onClick={() => { const mode = framing === "detail" ? "work" : "detail"; world.current?.framing(mode); setFraming(mode); }} aria-pressed={framing === "detail"}>{framing === "detail" ? "Back to hall" : "Inspect claim desk"}</button>}
      </nav>
      <div className={styles.readout}><span className={styles.liveDot} />{inspection ? "EQUIPMENT SCALE STUDY" : "FACTORY VIEW"}<small>{focusedRoom ? `${focusedRoom.name} · ${inspection ? "staged prototype" : sealed ? "sealed" : focusedRoom.kind === "support" ? "support space" : "online"}` : inspection ? "Study only · first-turn locks preserved" : "Floor 01 · 2 / 6 rooms online"}</small></div>
      <section ref={dock} className={`${styles.dock} ${inspection || focus === "lobby" ? styles.studyDock : ""}`} aria-label="Factory controls">
        {inspection ? <div className={styles.copy}>
          <span className={styles.eyebrow}>{focusedRoom ? `${focusedRoom.rect.w} × ${focusedRoom.rect.h} m` : `${FLOOR_SIZE.width} × ${FLOOR_SIZE.height} m`} / WORKER ≈ 1.9 m{focusedRoom && reservedArea(focusedRoom.id) > 0 ? ` / ${reservedArea(focusedRoom.id).toLocaleString("en-US")} m² RESERVED` : " / STAGED EQUIPMENT"}</span>
          <h1>{staging?.title ?? "The factory at working scale"}</h1>
          <p>{staging?.premise ?? "Inspect the proposed equipment in all six rooms. First-turn room locks remain unchanged."}</p>
          {staging && <details className={styles.interactionNote}><summary>Supervisor interaction space</summary><p>{staging.interaction}</p></details>}
        </div> : <div className={styles.copy}>
          <span className={styles.eyebrow}>{sealed ? "SEALED WING" : state.phase === "shift" ? `TEST CRADLES / ${String(state.cycles).padStart(3,"0")}` : "PREBUILT FACTORY"}</span>
          <h1>{sealed ? focusedRoom?.name : state.phase === "night" ? "The charging window." : state.phase === "morning" ? "The factory is ready." : state.jammed ? "The line has stopped." : state.running ? "Watch the chain work." : "Production paused."}</h1>
          <p>{sealed ? "This room is sealed. Its doors stay closed until the room is unlocked." : state.phase === "night" ? "Six hours to charge. The machinery remains in place." : state.phase === "morning" ? "Run the preview crew through Security and the conveyor. The factory is already equipped." : state.jammed ? "Release the test obstruction. Watch the gate, crew and drive respond together." : "Change the pace or test an obstruction. This preview does not create quota output."}</p>
        </div>}
        <div className={styles.controls}>{inspection ? <div className={styles.actions}><button className={styles.primary} onClick={() => setMapOpen(true)}>Inspect a room</button><button onClick={inspect}>Return to opening</button></div> : sealed ? <div className={styles.actions}><button className={styles.primary} onClick={() => look("security")}>Return to Security →</button><button onClick={() => setMapOpen(true)}>Floor plan</button></div> : <>
          <div className={styles.actions}>
            {state.phase === "night" && <button className={styles.primary} onClick={() => send({ type: "morning" })}>Finish night →</button>}
            {state.phase === "morning" && <button className={styles.primary} onClick={() => send({ type: "shift" })}>Start test shift →</button>}
            {state.phase === "shift" && <><button className={styles.secondary} onClick={() => send({ type: "running", value: !state.running })}>{state.running ? "Pause" : "Resume"}</button><div className={styles.paces} aria-label="Drive pace">{(["steady", "push"] as const).map(p => <button key={p} aria-pressed={state.pace === p} onClick={() => send({ type: "pace", value: p })}>{p === "steady" ? "Steady" : "Push"}</button>)}</div><button className={state.jammed ? styles.alarm : styles.secondary} disabled={!state.running && !state.jammed} onClick={() => send({ type: state.jammed ? "release" : "obstruct" })}>{state.jammed ? "Release obstruction" : "Test obstruction"}</button></>}
          </div>
        </>}
        </div>
        {state.phase === "shift" && <div className={styles.shiftProgress} role="progressbar" aria-label="Shift elapsed" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${progress}%` }} /></div>}
      </section>
      <footer className={styles.footer}><span>Drag to orbit · Right drag / two fingers to pan · Scroll / pinch to zoom</span><details className={styles.diagnostics}><summary>Study diagnostics</summary><div><b>{report ? `${report.fps} FPS · ${report.resolution}` : "Measuring renderer…"}</b><p>{report?.workers ?? 10} individual workers · {report?.active ?? "—"} active meshes<br />{report?.updateMs}ms pose · {report?.renderMs}ms render submission<br />{report?.renderer}<br />Tick {state.tick} · {state.unlockedRooms.length}/6 rooms online<br />{FLOOR_SIZE.width} × {FLOOR_SIZE.height} tiles · Local public fixture · No quota output</p><button onClick={() => { if(inspecting.current) inspect(); host.current?.reset(state.workers.length === 10 ? 100 : 10); look("lobby"); setCard({ phase: "morning", day: 1, key: `reset-${Date.now()}` }); blocked.current = true; }}>Restart with {state.workers.length === 10 ? 100 : 10} workers</button><p>Lobby claim cycles are staged visual examples; no wages are paid by this study.</p><button aria-pressed={feeder} onClick={() => { world.current?.feeder(!feeder); setFeeder(!feeder); }}>{feeder ? "Remove paper feeders" : "Fit paper feeders"}</button><Link href="/stepanoskin/loopforge/design#conveyor">Design & scope ↗</Link><Link href="/stepanoskin/loopforge/play/agent-test">Agent production test ↗</Link></div></details></footer>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      <span className={styles.sr} role="status">{state.events.at(-1)?.kind !== "cycle" ? state.events.at(-1)?.text : ""}</span>
    </div>
    <FloorPlan study={inspection} open={mapOpen} unlocked={state.unlockedRooms} onSelect={look} onClose={() => setMapOpen(false)} />
    {!ready && <div className={styles.loading}><span>LOOPFORGE</span><h1>{error || "Preparing the factory…"}</h1>{error && <Link href="/stepanoskin/loopforge/play">Return to the console</Link>}</div>}
    {ready && card && <div key={card.key} className={styles.timeCard} data-loaded={loadedCard === card.key} role="status" aria-label={`Day ${card.day}. ${PHASE_NAMES[card.phase]}.`}>
      {/* The authored transition is deliberately separate from the procedural world. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cardSrc} alt="" onLoad={async e => { const img = e.currentTarget; await img.decode().catch(() => {}); setLoadedCard(card.key); }} onError={() => setLoadedCard(card.key)} />
      <div><span>DAY {String(card.day).padStart(2, "0")}</span><h2>{PHASE_NAMES[card.phase]}</h2><i /></div>
    </div>}
  </main>;
}
