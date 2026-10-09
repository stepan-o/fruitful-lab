"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { StudyHost } from "@/lib/loopforge/factory-study/host";
import { FIXTURES, SHIFT_TICKS, initialStudy, type Command, type Fixture, type Phase, type StudyState } from "@/lib/loopforge/factory-study/kernel";
import transitionAssets from "@/lib/assets/generated/loopforge-time-transitions.json";
import type { FactoryScene, Focus, SceneReport } from "./scene";
import type { FactoryAudio } from "../first-shift/audio";
import styles from "./factory-study.module.css";

const EQUIPMENT: Record<Fixture, { name: string; purpose: string; number: string }> = {
  terminal: { name: "Clearance terminal", purpose: "Register the crew before anyone reaches the line.", number: "01" },
  gate: { name: "Access gate", purpose: "The scanner holds workers until Security clears them.", number: "02" },
  drive: { name: "Conveyor drive", purpose: "Connect the motor to put the test line in motion.", number: "03" },
};
const PHASE_NAMES: Record<Phase, string> = { night: "Night", morning: "Morning", shift: "Shift start" };
const images = Object.fromEntries(Object.entries(transitionAssets.assets).map(([id, asset]) => [id, asset.variants.at(-1)!.src]));

/** One persistent camera/scene. Build is a viewer tool; phase admission belongs to the host. */
export default function FactoryStudy() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const dock = useRef<HTMLElement>(null);
  const world = useRef<FactoryScene | null>(null);
  const host = useRef<StudyHost | null>(null);
  const audio = useRef<FactoryAudio | null>(null);
  const soundPending = useRef(false);
  const tool = useRef<{ enabled: boolean; selected: Fixture | null }>({ enabled: false, selected: null });
  const blocked = useRef(true);
  const [state, setState] = useState<StudyState>(() => initialStudy());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [building, setBuilding] = useState(false);
  const [selected, setSelected] = useState<Fixture | null>(null);
  const [focus, setFocus] = useState<Focus>("security");
  const [sound, setSound] = useState(false);
  const [motion, setMotion] = useState(true);
  const [report, setReport] = useState<SceneReport | null>(null);
  const [notice, setNotice] = useState("");
  const [card, setCard] = useState<{ phase: Phase; day: number; key: string } | null>({ phase: "night", day: 1, key: "1-night" });
  const [loadedCard, setLoadedCard] = useState("");

  const setTool = useCallback((enabled: boolean, fixture: Fixture | null = null) => {
    tool.current = { enabled, selected: fixture };
    world.current?.build(enabled, fixture);
    setBuilding(enabled); setSelected(fixture);
  }, []);
  const send = useCallback((command: Command) => {
    if (blocked.current) return;
    const result = host.current?.send(command);
    if (result && !result.ok) setNotice(result.reason);
    else setNotice("");
  }, []);
  const place = useCallback((fixture: Fixture) => {
    if (blocked.current || !tool.current.enabled || tool.current.selected !== fixture) return;
    const result = host.current?.send({ type: "install", fixture });
    if (result?.ok) setTool(true);
    else if (result) setNotice(result.reason);
  }, [setTool]);
  const look = useCallback((where: Focus) => { world.current?.focus(where); setFocus(where); }, []);

  useEffect(() => {
    if (!canvas.current) return;
    let disposed = false;
    const fit = () => { if(dock.current && canvas.current) world.current?.inset(canvas.current.clientHeight-dock.current.getBoundingClientRect().top+12); };
    const size = new ResizeObserver(fit); if(dock.current) size.observe(dock.current);
    const localHost = new StudyHost(); host.current = localHost;
    let lastEvent = 0, lastUiTick = -5, lastPhase = "1-night";
    const unsubscribe = localHost.subscribe(s => {
      world.current?.update(s);
      const event = s.events.at(-1);
      if (event && event.id !== lastEvent) {
        audio.current?.cue(event.kind === "installed" ? "commit" : event.kind === "jam" ? "impact" : event.kind === "release" ? "release" : event.kind === "cycle" ? "batch" : event.kind === "phase" && s.phase === "night" ? "end" : "connect");
      }
      const phaseKey = `${s.day}-${s.phase}`;
      if (phaseKey !== lastPhase) {
        lastPhase = phaseKey; blocked.current = true; localHost.suspendClock();
        setTool(false); setCard({ phase: s.phase, day: s.day, key: phaseKey });
      }
      if (s.tick - lastUiTick >= 5 || event?.id !== lastEvent || s.tick === 0) { setState(s); lastUiTick = s.tick; }
      lastEvent = event?.id ?? 0;
      audio.current?.machine(s.running && !s.jammed && !blocked.current, document.hidden, s.pace === "push");
    });
    void import("./scene").then(({ createFactoryScene }) => {
      if (disposed || !canvas.current) return;
      const renderer = createFactoryScene(canvas.current, place, setReport);
      world.current = renderer;
      renderer.update(localHost.snapshot); renderer.focus("security");
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
  }, [place, setTool]);

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
      if (blocked.current || e.altKey || e.ctrlKey || e.metaKey || (e.target instanceof HTMLElement && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName))) return;
      if (e.key === "Escape") setTool(tool.current.selected ? true : false);
      if (e.key.toLowerCase() === "b" && host.current?.snapshot.phase === "night") { e.preventDefault(); setTool(!tool.current.enabled); }
      if (e.key === "1") look("security"); if (e.key === "2") look("line"); if (e.key === "3") look("wide");
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [look, setTool]);

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
  const next = FIXTURES[state.installed.length];
  const progress = Math.min(100, state.shiftTick / SHIFT_TICKS * 100);
  const status = state.phase === "night" ? "PRODUCTION STOPPED" : state.phase === "morning" ? "CREW READY" : state.jammed ? "LINE HELD" : state.running ? "LINE RUNNING" : "PAUSED";
  const choose = (fixture: Fixture) => { setTool(true, fixture); look(fixture === "drive" ? "line" : "security"); };
  const cardSrc = card ? images[card.phase] : undefined;

  return <main className={styles.stage} data-motion={motion ? "full" : "reduced"} data-jammed={state.jammed}>
    <canvas ref={canvas} className={styles.canvas} aria-label="Interactive 3D Security and Lattice Forge. Drag to orbit, use two fingers or right drag to pan, pinch or scroll to zoom. Room focus buttons provide an alternative." />
    <div className={styles.vignette} aria-hidden="true" />
    <div className={styles.interface} inert={!ready || !!card}>
      <header className={styles.header}>
        <Link href="/stepanoskin/loopforge/play" className={styles.brand}>LOOPFORGE <span>COMMISSIONING STUDY</span></Link>
        <div className={styles.clock}>DAY {String(state.day).padStart(2, "0")} <b>{state.phase === "shift" ? "SHIFT" : PHASE_NAMES[state.phase].toUpperCase()}</b><i>{status}</i></div>
        <div className={styles.utilities}><button onClick={toggleSound} aria-pressed={sound}>Sound {sound ? "on" : "off"}</button><button onClick={() => { world.current?.motion(!motion); setMotion(!motion); }} aria-pressed={motion}>Motion {motion ? "on" : "reduced"}</button></div>
      </header>
      <nav className={styles.rooms} aria-label="Camera focus">
        {([ ["security", "01", "Security"], ["line", "02", "Lattice Forge"], ["wide", "↗", "Overview"] ] as const).map(([id, number, title]) => <button key={id} onClick={() => look(id)} aria-pressed={focus === id}><span>{number}</span>{title}</button>)}
      </nav>
      <div className={styles.readout}><span className={styles.liveDot} />{building ? "CONSTRUCTION TOOL" : "FACTORY VIEW"}<small>Same floor. Same camera.</small></div>
      <section ref={dock} className={styles.dock} aria-label={building ? "Construction controls" : "Factory controls"}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>{state.phase === "night" ? `NIGHT WORK / ${state.installed.length} OF 3 INSTALLED` : state.phase === "morning" ? "COMMISSIONING CREW" : `TEST CRADLES / ${String(state.cycles).padStart(3,"0")}`}</span>
          <h1>{state.phase === "night" ? building ? selected ? `Place the ${EQUIPMENT[selected].name.toLowerCase()}` : next ? "Choose the next installation" : "The line is ready" : next ? "Bring the factory online" : "Night maintenance window" : state.phase === "morning" ? "Everything in its place." : state.jammed ? "The line has stopped." : state.running ? "Watch the chain work." : "Production paused."}</h1>
          <p>{state.phase === "night" ? selected ? "Click the illuminated socket, or confirm below. Escape cancels." : building ? next ? EQUIPMENT[next].purpose : "Leave build mode to begin the morning handover." : next ? "Enter build mode to fit Security’s clearance equipment." : "The crew charges for six hours. Equipment stays where you built it." : state.phase === "morning" ? "Run the test crew through Security and the conveyor. Eighteen factory hours play in one minute." : state.jammed ? "Release the test obstruction. Watch the gate, crew and drive respond together." : "Change the pace or test an obstruction. Every movement follows the live commissioning state."}</p>
        </div>
        <div className={styles.controls}>
          {building && next && <div className={styles.equipment}>{FIXTURES.map((f, i) => <button key={f} disabled={f !== next} aria-pressed={selected === f} onClick={() => choose(f)}><span>{state.installed.includes(f) ? "✓" : EQUIPMENT[f].number}</span><b>{EQUIPMENT[f].name}</b><small>{state.installed.includes(f) ? "Installed" : i > state.installed.length ? "Next" : selected === f ? "Preview in place" : "Select to place"}</small></button>)}</div>}
          <div className={styles.actions}>
            {state.phase === "night" && <button className={building ? styles.secondary : styles.primary} onClick={() => setTool(!building)}>{building ? "Leave build mode" : "Build"}<kbd>B</kbd></button>}
            {selected && <button className={styles.primary} onClick={() => place(selected)}>Place {EQUIPMENT[selected].name.toLowerCase()}</button>}
            {state.phase === "night" && !next && !building && <button className={styles.primary} onClick={() => send({ type: "morning" })}>Finish night →</button>}
            {state.phase === "morning" && <button className={styles.primary} onClick={() => send({ type: "shift" })}>Start test shift →</button>}
            {state.phase === "shift" && <><button className={styles.secondary} onClick={() => send({ type: "running", value: !state.running })}>{state.running ? "Pause" : "Resume"}</button><div className={styles.paces} aria-label="Drive pace">{(["steady", "push"] as const).map(p => <button key={p} aria-pressed={state.pace === p} onClick={() => send({ type: "pace", value: p })}>{p === "steady" ? "Steady" : "Push"}</button>)}</div><button className={state.jammed ? styles.alarm : styles.secondary} disabled={!state.running && !state.jammed} onClick={() => send({ type: state.jammed ? "release" : "obstruct" })}>{state.jammed ? "Release obstruction" : "Test obstruction"}</button></>}
          </div>
        </div>
        {state.phase === "shift" && <div className={styles.shiftProgress} role="progressbar" aria-label="Shift elapsed" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${progress}%` }} /></div>}
      </section>
      <footer className={styles.footer}><span>Drag to orbit · Right drag / two fingers to pan · Scroll / pinch to zoom</span><details className={styles.diagnostics}><summary>Study diagnostics</summary><div><b>{report ? `${report.fps} FPS · ${report.resolution}` : "Measuring renderer…"}</b><p>{report?.workers ?? 10} individual workers · {report?.active ?? "—"} active meshes<br />{report?.updateMs}ms pose · {report?.renderMs}ms render submission<br />{report?.renderer}<br />Tick {state.tick} · Local public fixture · No quota output</p><button onClick={() => { host.current?.reset(state.workers.length === 10 ? 100 : 10); setTool(false); setCard({ phase: "night", day: 1, key: `reset-${Date.now()}` }); blocked.current = true; }}>Restart with {state.workers.length === 10 ? 100 : 10} workers</button><Link href="/stepanoskin/loopforge/design#conveyor">Design & scope ↗</Link></div></details></footer>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      <span className={styles.sr} role="status">{state.events.at(-1)?.kind !== "cycle" ? state.events.at(-1)?.text : ""}</span>
    </div>
    {!ready && <div className={styles.loading}><span>LOOPFORGE</span><h1>{error || "Preparing the factory…"}</h1>{error && <Link href="/stepanoskin/loopforge/play">Return to the console</Link>}</div>}
    {ready && card && <div key={card.key} className={styles.timeCard} data-loaded={loadedCard === card.key} role="status" aria-label={`Day ${card.day}. ${PHASE_NAMES[card.phase]}.`}>
      {/* The authored transition is deliberately separate from the procedural world. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cardSrc} alt="" onLoad={async e => { const img = e.currentTarget; await img.decode().catch(() => {}); setLoadedCard(card.key); }} onError={() => setLoadedCard(card.key)} />
      <div><span>DAY {String(card.day).padStart(2, "0")}</span><h2>{PHASE_NAMES[card.phase]}</h2><i /></div>
    </div>}
  </main>;
}
