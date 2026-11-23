"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  SHIFT_TICKS,
  type PlayerView,
  type RoomId,
  type SupervisorId,
} from "@/lib/loopforge/first-shift/contract";
import { usePreference } from "@/lib/stepanoskin/preferences";
import { useFirstTurnRun } from "./useFirstTurnRun";
import TurnFloor from "./TurnFloor";
import PhaseInterlude from "./PhaseInterlude";
import { FactoryAudio } from "./audio";
import {
  Control,
  Instruments,
  Kicker,
  materialStyle,
  time,
  type Media,
} from "./ConsoleParts";
import {
  Debrief,
  Development,
  Dispatch,
  IncidentPanel,
  Intercom,
  Planning,
  Records,
  type Workspace,
} from "./ConsoleWorkspaces";
import AdviserSelection, { firstDayCandidates } from "./AdviserSelection";
import LeadershipCall from "./LeadershipCall";
import ThemeSettings from "./ThemeSettings";
import GraphicsSettings from "../graphics/GraphicsSettings";
import ProducerConsole from "./ProducerConsole";
import { useConsoleTheme } from "./ThemeProvider";
import { ConsoleBeacon, useConsoleSignals } from "./ConsoleSignals";
import { feedbackFor, type FeedbackId, type FeedbackAction } from "@/lib/loopforge/first-shift/feedback";
import { EvidencePanel } from "./StatusFeedback";
import s from "./first-shift.module.css";
import l from "./living-console.module.css";
const subscribeVisibility = (listener: () => void) => {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
};
const hiddenSnapshot = () => document.hidden,
  serverSnapshot = () => false;
const HELP = [
  [
    "Choose whose judgment you want.",
    "Your adviser chooses the day's priority and proposes the room assignments. Pick the person whose tradeoff you can live with. Their short statements tell you what matters to them right now.",
  ],
  [
    "Placement gives authority.",
    "In their own room, your adviser handles events without asking. In other rooms, they recommend a response and you decide. Swapping their proposed assignments is an override they will remember.",
  ],
  [
    "Watch what the factory confirms.",
    "The instruments report known facts. Supervisor speech is a perspective. Open a camera to inspect the room, or a receipt to see what happened and why.",
  ],
  [
    "The week has a quota.",
    "At dispatch, each finished robot either joins your workforce or goes toward delivery. That allocation is permanent. Keeping workers can build tomorrow's capacity; delivery secures the weekly requirement.",
  ],
  [
    "The console carries the signal.",
    "Green marks completed production. Red marks an accident. Amber asks for attention. Occasional cyan is idle light. Every consequential signal also has a visible record; sound is optional.",
  ],
];
export default function FirstShift({
  media,
  suspended = false,
  onOpenMenu,
}: {
  media: Media;
  suspended?: boolean;
  onOpenMenu?: () => void;
}) {
  const theme = useConsoleTheme(),
    signals = useConsoleSignals(),
    run = useFirstTurnRun();
  const v = run.view,
    { pending, error } = run;
  const incoming=Boolean(v?.floor.stage === "mandate");
  const [interlude,setInterlude]=useState<"night"|"morning"|"shift"|null>(null);
  const [seenCards,setSeenCards]=useState<string[]>([]);
  const closeInterlude=useCallback(()=>setInterlude(null),[]);
  const cardKey=!v?null:v.floor.stage==="mandate"?"morning":v.phase==="running"?"shift":v.phase==="complete"?"night":null;
  if(cardKey&&!seenCards.includes(cardKey)){setSeenCards([...seenCards,cardKey]);setInterlude(cardKey as "night"|"morning"|"shift");}
  const rawSend=run.send;
  const send: typeof run.send = useCallback((...args) => incoming ? Promise.resolve(false) : rawSend(...args),[incoming,rawSend]);
  const [candidate,setCandidate]=useState<string|null>(null);
  const [openingRecord,setOpeningRecord]=useState<PlayerView|null>(null);
  const [screen, setScreen] = useState<Workspace>("factory"),
    [person, setPerson] = useState<SupervisorId>("limen"),
    [room, setRoom] = useState<RoomId>("conveyor");
  const [swap, setSwap] = useState(false),
    [retain, setRetain] = useState(0),
    [confirm, setConfirm] = useState(false),
    [selected, setSelected] = useState<string | null>(null),
    [showBatches, setShowBatches] = useState(false),
    [project, setProject] = useState(0);
  const [paused, setPaused] = useState(false),
    [speed, setSpeed] = useState(1),
    [modal, setModal] = useState<
      "settings" | "help" | "incident" | "feedback" | null
    >(null),
    [help, setHelp] = useState(0),
    [feedbackId, setFeedbackId] = useState<FeedbackId>("quota");
  const [effects, setEffects] = usePreference("loopforge-first-shift-effects"),
    [sound, setSound] = useState(false),
    [audioError, setAudioError] = useState("");
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    hiddenSnapshot,
    serverSnapshot,
  );
  const audio = useRef<FactoryAudio | null>(null),
    prior = useRef<PlayerView | null>(null),
    dialog = useRef<HTMLDialogElement>(null),
    lastFocus = useRef<HTMLElement | null>(null),
    workspace = useRef<HTMLDivElement>(null);
  const ticking =
      v?.phase === "running" &&
      !paused &&
      !interlude &&
      !hidden &&
      !error &&
      !modal &&
      !suspended &&
      (screen === "factory" || screen === "room"),
    busy = pending || Boolean(error),
    publish = signals?.publish;
  useEffect(() => {
    if (v) publish?.(v);
  }, [v, publish]);
  const [phase, setPhase] = useState<string | null>(null);
  if (v && phase !== v.phase) {
    setPhase(v.phase);
    if (v.phase === "choose") {
      setScreen("factory");
      setOpeningRecord(v);
      setCandidate(null);
      setSwap(false);
      setRetain(0);
      setConfirm(false);
    }
    if (v.phase === "briefing") {
      setPerson(v.adviser!);
      setScreen("intercom");
    }
    if (v.phase === "ready") setScreen("factory");
    if (v.phase === "decision") setModal("incident");
    if (v.phase === "running") { setModal(null); if(phase === "ready"){setRoom("conveyor");setScreen("room");} }
    if (v.phase === "allocation") {
      setScreen("dispatch");
      setRetain(0);
      setConfirm(false);
    }
    if (v.phase === "complete") setScreen("debrief");
  }
  useEffect(() => {
    if (!ticking || pending) return;
    const timer = window.setTimeout(
      () => void send({ type: "advance" }),
      speed === 1 ? 900 : 300,
    );
    return () => window.clearTimeout(timer);
  }, [ticking, pending, v?.tick, send, speed]);
  useEffect(() => {
    if (modal) {
      if (!dialog.current?.open) {
        lastFocus.current = document.activeElement as HTMLElement;
        dialog.current?.showModal();
      }
    } else {
      dialog.current?.close();
      lastFocus.current?.focus({ preventScroll: true });
    }
  }, [modal]);
  useEffect(() => {
    if (!suspended) workspace.current?.focus({ preventScroll: true });
  }, [screen, suspended]);
  useEffect(
    () => () => {
      audio.current?.close();
    },
    [],
  );
  useEffect(() => {
    audio.current?.machine(
      Boolean(ticking),
      hidden || suspended,
      Boolean(v && v.condition < 75),
    );
  }, [ticking, hidden, suspended, v, sound]);
  useEffect(() => {
    const before = prior.current;
    prior.current = v;
    if (!v || !before || v.tick <= before.tick || !sound || hidden) return;
    if (v.losses > before.losses) audio.current?.cue("impact");
    else
      for (const event of v.events.slice(before.events.length)) {
        if (event.kind === "adviser") audio.current?.cue("connect");
        else if (["plan", "allocation", "resolution"].includes(event.kind))
          audio.current?.cue("commit");
        else if (event.kind === "incident") audio.current?.cue("strain");
        else if (event.kind === "production") audio.current?.cue("batch");
        else if (event.kind === "shift")
          audio.current?.cue(v.phase === "allocation" ? "end" : "release");
      }
  }, [v, sound, hidden]);
  async function toggleSound() {
    if (sound) {
      audio.current?.close();
      audio.current = null;
      setSound(false);
      return;
    }
    try {
      const next = new FactoryAudio();
      audio.current = next;
      await next.enable();
      setSound(true);
      setAudioError("");
      next.cue("connect");
    } catch {
      audio.current?.close();
      audio.current = null;
      setAudioError("Sound is unavailable. Factory feedback remains visible.");
    }
  }
  function openHelp(index = 0) {
    setHelp(index);
    setModal("help");
  }
  function records(id?: string) {
    setSelected(id ?? null);
    if (id && v?.events.find(e => e.id === id)?.kind === "production") setShowBatches(true);
    setModal(null);
    setScreen("records");
  }
  function inspectFeedback(id: FeedbackId) {
    if (incoming) return;
    setFeedbackId(id);
    setModal("feedback");
  }
  function feedbackAction(action: FeedbackAction) {
    if (incoming) return;
    if (action === "incident") { setModal("incident"); return; }
    setModal(null);
    if (action.startsWith("room:")) { setRoom(action.slice(5) as RoomId); setScreen("room"); }
    else if (action.startsWith("person:")) { setPerson(action.slice(7) as SupervisorId); setScreen("intercom"); }
    else setScreen(action as Workspace);
  }
  function restart() {
    setSeenCards([]);
    setPhase(null);
    setPaused(false);
    setModal(null);
    void run.restart();
  }
  return (
    <main
      className={`${s.shell} ${l.console}`}
      style={{ ...materialStyle(media), ...theme?.style }}
      data-theme={theme?.recipe.shell}
      data-quiet={!ticking || !effects}
      data-effects={effects}
      data-suspended={hidden || suspended || Boolean(modal)}
      data-phase={v?.phase}
      data-workspace={screen}
      data-alarm={v?.phase === "decision"}
    >
      {screen !== "leadership" && screen !== "factory" && <ConsoleBeacon active={!modal && !suspended} />}
      {screen !== "leadership" && screen !== "factory" && <header className={s.topbar}>
        <div className={s.dayMark}>
          <Kicker>Loopforge / Floor 01</Kicker>
          <b>
            DAY 01 <span>/ 07</span>
          </b>
          <span className={l.phaseLabel}>{!v ? "CONNECTING TO FLOOR 01" : v.phase === "choose" || v.phase === "briefing" || v.phase === "ready" ? "PRE-SHIFT / AWAITING ORDERS" : v?.phase === "decision" ? "SHIFT HELD / DECISION" : v?.phase === "running" ? ticking ? "SHIFT IN PROGRESS" : "SHIFT PAUSED" : "END OF SHIFT"}</span>
        </div>
        {v && (
          <Instruments
            media={media}
            view={v}
            onInspect={(id) => {
              inspectFeedback(id as FeedbackId);
            }}
          />
        )}
        <div className={s.topActions}>
          <button onClick={() => openHelp()}>Help</button>
          <button onClick={() => setModal("settings")}>Settings</button>
          {onOpenMenu && (
            <button disabled={pending} onClick={onOpenMenu}>
              Menu
            </button>
          )}
        </div>
      </header>}
      {screen === "factory" && <header className={s.producerSystem}><b>LOOPFORGE <small>DAY 01 / 07</small></b><nav aria-label="System controls"><button onClick={()=>openHelp()}>Help</button><button onClick={()=>setModal("settings")}>Settings</button>{onOpenMenu&&<button disabled={pending} onClick={onOpenMenu}>Menu</button>}</nav></header>}
      {error && (
        <div className={s.error} role="alert">
          <span>
            <b>Connection interrupted. The line is paused.</b> Your last
            confirmed choices are intact.
          </span>
          <Control disabled={pending} onClick={() => void run.recover()}>
            Reconnect
          </Control>
        </div>
      )}
      {interlude&&<PhaseInterlude key={cardKey??"card"} phase={interlude} onComplete={closeInterlude}/>}
      <div
        inert={Boolean(interlude)}
        className={s.workspace}
        ref={workspace}
        tabIndex={-1}
        data-workspace={screen}
      >
        {v ? (
          <>
            <TurnFloor view={v} media={media} room={room} onRoom={setRoom} onBack={()=>setScreen("factory")} send={rawSend} busy={busy} visible={(screen==="room")&&!suspended&&!hidden} playing={Boolean(ticking)} effects={effects} onIncident={()=>setModal("incident")} onPause={()=>setPaused(!paused)} onFeedback={()=>inspectFeedback(`room:${room}`)} />
            {screen !== "factory" && screen !== "leadership" && screen!=="room" && (
              <button
                className={s.backToWall}
                onClick={() => setScreen("factory")}
              >
                ← Camera wall
              </button>
            )}
            {screen === "factory" && <ProducerConsole
              media={media} view={v} skin={theme?.recipe.console ?? "foundry-desk"}
              incoming={incoming} busy={busy} effects={effects} active={!modal&&!suspended&&!hidden} ticking={Boolean(ticking)} speed={speed}
              primaryLabel={v.phase === "ready" ? "Start the line" : v.phase === "running" ? paused ? "Resume" : "Pause" : v.phase === "decision" ? "Respond to incident" : v.phase === "allocation" ? "Dispatch output" : v.phase === "complete" ? "Shift debrief" : "Awaiting orders"}
              onLeadership={()=>{audio.current?.cue("connect");setScreen("leadership");}}
              onAdviser={()=>{if(incoming)return;if(v.adviser){setPerson(v.adviser);setScreen(v.phase==="briefing"?"planning":"intercom");}else setScreen("advisers");}}
              onPrimary={()=>{if(incoming)return;if(v.phase==="ready")void send({type:"start_shift"});else if(v.phase==="running")setPaused(!paused);else if(v.phase==="decision")setModal("incident");else if(v.phase==="allocation")setScreen("dispatch");else if(v.phase==="complete")setScreen("debrief");}}
              onRoom={id=>{if(!incoming){setRoom(id);setScreen("room");}}}
              onInspect={id=>inspectFeedback(id as FeedbackId)} onFeedback={inspectFeedback}
              onNavigate={id=>{if(!incoming)setScreen(id);}} onSpeed={()=>setSpeed(speed===1?3:1)} />}
            {screen === "leadership" && <LeadershipCall media={media} view={v} effects={effects} onClose={()=>setScreen("factory")} onContinue={()=>{if(!incoming){setScreen("factory");return;}void rawSend({type:"acknowledge_mandate"}).then(ok=>{if(ok){audio.current?.cue("commit");setScreen("factory");signals?.impulse("attention");}});}} />}
            {screen === "advisers" && <AdviserSelection selectedId={candidate} onInspect={setCandidate} media={media} candidates={firstDayCandidates(v)} busy={busy} onHelp={() => openHelp()} onAppoint={(id) => {
              if (id === "limen" || id === "stiletto") void send({type:"choose_adviser", adviser:id});
            }} />}
            {screen === "intercom" && (
              <Intercom
                key={`${person}-${Boolean(v.adviser)}`}
                media={media}
                view={v}
                busy={busy}
                send={send}
                person={person}
                onPlan={() => setScreen("planning")}
                onOther={() =>
                  setPerson(person === "limen" ? "stiletto" : "limen")
                }
                onBack={() => setScreen("factory")}
              />
            )}
            {screen === "planning" && v.briefing && (
              <Planning
                media={media}
                view={v}
                busy={busy}
                send={send}
                swap={swap}
                onSwap={() => setSwap(!swap)}
                onBack={() => setScreen("intercom")}
                onHelp={() => openHelp(1)}
              />
            )}
            {screen === "dispatch" && (
              <Dispatch
                media={media}
                view={v}
                busy={busy}
                send={send}
                retain={retain}
                onRetain={setRetain}
                confirm={confirm}
                onConfirm={setConfirm}
              />
            )}
            {screen === "debrief" && (
              <Debrief
                media={media}
                view={v}
                onRecords={() => records()}
                onRestart={restart}
                opening={openingRecord}
                onFeedback={inspectFeedback}
              />
            )}
            {screen === "records" && (
              <Records
                media={media}
                view={v}
                selected={selected}
                onSelect={setSelected}
                batches={showBatches}
                onBatches={() => setShowBatches(!showBatches)}
                onExport={run.download}
              />
            )}
            {screen === "development" && (
              <Development
                media={media}
                selected={project}
                onSelect={setProject}
              />
            )}
          </>
        ) : (
          <div className={s.loading} role="status">
            <Kicker>Director access / floor 01</Kicker>
            <h1>Establishing the signal…</h1>
          </div>
        )}
      </div>
      {v && screen !== "leadership" && screen !== "factory" && screen!=="room" && (
        <footer className={s.commandRail}>
          <nav className={s.consoleNav} aria-label="Director console">
            {(["factory", "development", "records"] as const).map((id) => (
              <button
                key={id}
                aria-current={screen === id ? "page" : undefined}
                onClick={() => setScreen(id)}
              >
                {id === "factory"
                  ? "Factory"
                  : id === "records"
                    ? "Records"
                    : "Development"}
              </button>
            ))}
          </nav>
          <div className={s.transport}>
            <span>
              {time(v.shiftTick)}
              <small>
                {v.phase === "running"
                  ? ticking
                    ? " / RUNNING"
                    : " / PAUSED"
                  : v.phase === "decision"
                    ? " / RESPONSE"
                    : " / STANDBY"}
              </small>
            </span>
            <div
              className={s.shiftTrack}
              role="progressbar"
              aria-label="Shift progress"
              aria-valuemin={0}
              aria-valuemax={SHIFT_TICKS}
              aria-valuenow={v.shiftTick}
            >
              <i
                style={{ transform: `scaleX(${v.shiftTick / SHIFT_TICKS})` }}
              />
            </div>
            <small key={v.produced}>{v.produced} COMPLETED</small>
          </div>
          <div className={`${s.primaryOrder} ${l.order}`} data-required={v.phase === "choose" || v.phase === "ready" || v.phase === "decision"}>
            {v.phase === "ready" && <span className={l.orderContext}>Orders accepted · line waiting</span>}
            {v.phase === "choose" && screen !== "advisers" && (
              <Control tone="primary" onClick={() => setScreen("advisers")}>
                <span className={l.callLamp} aria-hidden="true" /> Choose adviser
              </Control>
            )}
            {v.phase === "briefing" &&
              screen !== "intercom" &&
              screen !== "planning" && (
                <Control
                  tone="primary"
                  onClick={() => {
                    setPerson(v.adviser!);
                    setScreen("planning");
                  }}
                >
                  Review placements
                </Control>
              )}
            {v.phase === "ready" && (
              <Control
                tone="primary"
                disabled={busy}
                onClick={() => {
                  setScreen("factory");
                  void send({ type: "start_shift" });
                }}
              >
                Start the line
              </Control>
            )}
            {v.phase === "running" && (
              <>
                <button
                  className={s.transportKey}
                  aria-pressed={paused}
                  onClick={() => {
                    setScreen("room");
                    setPaused(false);
                  }}
                >
                  Resume
                </button>
                <button
                  className={s.transportKey}
                  aria-label={`Playback speed ${speed} times`}
                  onClick={() => setSpeed(speed === 1 ? 3 : 1)}
                >
                  {speed}×
                </button>
              </>
            )}
            {v.phase === "decision" && (
              <Control tone="danger" onClick={() => setModal("incident")}>
                Respond to incident
              </Control>
            )}
            {v.phase === "allocation" && screen !== "dispatch" && (
              <Control tone="primary" onClick={() => setScreen("dispatch")}>
                Dispatch output
              </Control>
            )}
            {v.phase === "complete" && screen !== "debrief" && (
              <Control onClick={() => setScreen("debrief")}>
                Shift debrief
              </Control>
            )}
          </div>
        </footer>
      )}
      <div className={s.srOnly} role="status" aria-live="polite">
        {pending && v?.phase !== "running"
          ? "Confirming order…"
          : v?.events.filter((e) => e.kind !== "production").at(-1)?.title}
      </div>
      <dialog
        ref={dialog}
        className={s.modal}
        data-kind={modal}
        onCancel={() => setModal(null)}
        onClose={() => setModal(null)}
        aria-label={
          modal === "incident"
            ? "Incident response"
            : modal === "settings"
              ? "Game settings"
              : modal === "help"
                ? "Operator guidance"
                : "Status evidence"
        }
        onClick={(e) => {
          if (e.target === dialog.current) setModal(null);
        }}
      >
        <button
          className={s.closeModal}
          onClick={() => setModal(null)}
          aria-label="Close panel"
        >
          ×
        </button>
        <ConsoleBeacon active={Boolean(modal) && !suspended} />
        {modal === "incident" && v?.pending && (
          <IncidentPanel
            media={media}
            view={v}
            busy={busy}
            send={send}
            onEvidence={() => records()}
          />
        )}
        {modal === "settings" && (
          <>
            <Kicker>Loopforge / Settings</Kicker>
            <h1>Game settings.</h1>
            <GraphicsSettings expanded />
            <ThemeSettings
              disabled={pending}
              onPreview={() => setModal(null)}
            />
            <label className={s.toggle}>
              <input
                type="checkbox"
                checked={effects}
                onChange={(e) => setEffects(e.target.checked)}
              />{" "}
              Camera atmosphere & motion
            </label>
            <p>Reduced-motion preferences are always respected.</p>
            <Control onClick={() => void toggleSound()}>
              {sound ? "Mute factory sound" : "Enable factory sound"}
            </Control>
            {audioError && <p role="status">{audioError}</p>}
            <Link
              href="/stepanoskin/loopforge/design#sound-library"
              prefetch={false}
            >
              Sound library & credits ↗
            </Link>
            <Control tone="primary" onClick={() => setModal(null)}>
              Return to the console
            </Control>
          </>
        )}
        {modal === "help" && (
          <>
            <Kicker>
              Operator guidance / {help + 1} of {HELP.length}
            </Kicker>
            <h1>{HELP[help][0]}</h1>
            <p className={s.helpCopy}>{HELP[help][1]}</p>
            <div className={s.helpPages}>
              {HELP.map((_, i) => (
                <button
                  aria-label={`Guidance topic ${i + 1}`}
                  aria-pressed={i === help}
                  key={i}
                  onClick={() => setHelp(i)}
                >
                  0{i + 1}
                </button>
              ))}
            </div>
            <Control onClick={() => setModal(null)}>
              Return to the console
            </Control>
          </>
        )}
        {modal === "feedback" && v && <EvidencePanel media={media} signal={feedbackFor(v, feedbackId, openingRecord)} onAction={feedbackAction} onRecord={records} />}

      </dialog>
    </main>
  );
}
