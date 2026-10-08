"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  ChevronLeft,
  CirclePause,
  CirclePlay,
  Eye,
  Factory,
  FileText,
  LockKeyhole,
  Radio,
  Settings2,
  ShieldCheck,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import AssetImage from "@/components/media/AssetImage";
import type { ImageAsset } from "@/lib/assets/types";
import {
  SHIFT_TICKS,
  type Assignments,
  type PlayerView,
  type RoomId,
  type SupervisorId,
} from "@/lib/loopforge/first-shift/contract";
import { useRun } from "./useRun";
import { FactoryAudio } from "./audio";
import { usePreference } from "@/lib/stepanoskin/preferences";
const visibilitySubscribe = (listener: () => void) => {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
};
const hiddenSnapshot = () => document.hidden;
const visibleOnServer = () => false;
import styles from "./first-shift.module.css";

type Media = Record<string, ImageAsset>;
const label = (id: SupervisorId | null) =>
  id === "limen" ? "LIMEN" : id === "stiletto" ? "STILETTO" : "Unassigned";
const roomName = (room: RoomId) =>
  room === "conveyor" ? "Lattice Forge" : "Security";
const roomRole = (room: RoomId) =>
  room === "conveyor" ? "Conveyor / production" : "Access / compliance";

function Shot({
  media,
  id,
  className,
  eager = false,
  sizes = "(max-width: 760px) 100vw, 65vw",
}: {
  media: Media;
  id: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <AssetImage
      asset={media[id]}
      alt=""
      className={className}
      sizes={sizes}
      preload={eager}
    />
  );
}
function Camera({
  media,
  view,
  room,
  compact = false,
  onOpen,
}: {
  media: Media;
  view: PlayerView;
  room: RoomId;
  compact?: boolean;
  onOpen?: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = frame.current;
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries)
        entry.target.setAttribute(
          "data-on-screen",
          String(entry.isIntersecting),
        );
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  const operator = view.assignments?.[room];
  const image = operator
    ? room === "conveyor"
      ? operator === "limen"
        ? "limen-conveyor"
        : "stiletto-conveyor-success-1"
      : `${operator}-security`
    : room === "conveyor"
      ? "forge"
      : "security";
  const incident = view.pending?.room === room;
  const resolution = [...view.events]
    .reverse()
    .find((e) => e.kind === "resolution" && e.room === room);
  return (
    <div
      ref={frame}
      className={`${styles.camera} ${compact ? styles.compactCamera : ""}`}
      data-alert={incident}
    >
      <Shot
        key={image}
        media={media}
        id={image}
        eager={!compact}
        sizes={
          compact
            ? "(max-width: 760px) 50vw, 27vw"
            : "(max-width: 760px) 100vw, 65vw"
        }
      />
      <div className={styles.glass} aria-hidden="true" />
      <div className={styles.sweep} aria-hidden="true" />
      <div className={styles.cameraHead}>
        <span>
          <i className={styles.rec} /> REC{" "}
          <b>CAM {room === "conveyor" ? "01" : "02"}</b>
        </span>
        <span>{incident ? "ATTENTION" : "SIGNAL STABLE"}</span>
      </div>
      {!compact && (
        <div className={styles.reticle} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
      )}
      <div className={styles.cameraFoot}>
        <div>
          <small>{roomRole(room)}</small>
          <h3>{roomName(room)}</h3>
          <span>
            {operator
              ? `${label(operator)} ${operator === view.adviser ? "· delegated authority" : "· room supervisor"}`
              : "Awaiting first assignment"}
          </span>
        </div>
        {onOpen && (
          <button onClick={onOpen} aria-label={`Open ${roomName(room)} camera`}>
            <Eye size={17} /> Inspect
          </button>
        )}
        {!onOpen && (
          <span className={styles.feedTime}>
            DAY 01
            <br />
            {String(Math.floor(view.shiftTick / 4) + 6).padStart(2, "0")}:
            {String((view.shiftTick % 4) * 15).padStart(2, "0")}
          </span>
        )}
      </div>
      {!compact && resolution && (
        <div className={styles.cameraNotice} key={resolution.id}>
          <span className={styles.kicker}>Latest room record</span>
          <p>{resolution.title}</p>
        </div>
      )}
    </div>
  );
}
function StatStrip({ view }: { view: PlayerView }) {
  return (
    <div className={styles.stats} aria-label="Confirmed factory facts">
      <div>
        <span>AVAILABLE FUNDS</span>
        <strong>¤ {view.cash}</strong>
        <small>Development reserve</small>
      </div>
      <div>
        <span>WORKFORCE</span>
        <strong>
          <Users size={19} /> {view.workers}
        </strong>
        <small>Basic workers</small>
      </div>
      <div>
        <span>LINE CONDITION</span>
        <strong>
          {view.condition}
          <em>/100</em>
        </strong>
        <small>
          {view.condition >= 75 ? "Operational" : "Wear accumulating"}
        </small>
      </div>
      <div className={styles.quotaStat}>
        <span>WEEKLY DELIVERY</span>
        <strong>
          {view.committed}
          <em> / {view.quota}</em>
        </strong>
        <small>Due end of day 7</small>
      </div>
    </div>
  );
}
function Seal() {
  return (
    <div className={styles.seal} aria-hidden="true">
      <Factory size={31} strokeWidth={1} />
      <span>LF / 01</span>
    </div>
  );
}

export default function FirstShift({ media }: { media: Media }) {
  const run = useRun(),
    v = run.view;
  const { send, pending, error } = run;
  const [intro, setIntro] = useState<"arrival" | "handover" | null>("arrival");
  const [screen, setScreen] = useState<"factory" | "records" | "development">(
    "factory",
  );
  const [paused, setPaused] = useState(false),
    [speed, setSpeed] = useState(1);
  const hidden = useSyncExternalStore(
    visibilitySubscribe,
    hiddenSnapshot,
    visibleOnServer,
  );
  const [effects, setEffects] = usePreference("loopforge-first-shift-effects");
  const [settings, setSettings] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomId | null>(null),
    [swap, setSwap] = useState(false),
    [retain, setRetain] = useState(0);
  const [confirmAllocation, setConfirmAllocation] = useState(false);
  const [sound, setSound] = useState(false),
    [audioError, setAudioError] = useState("");
  const audio = useRef<FactoryAudio | null>(null),
    priorView = useRef<PlayerView | null>(null);
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
      setAudioError(
        "Sound is unavailable in this browser. All feedback remains visible.",
      );
    }
  }
  useEffect(
    () => () => {
      audio.current?.close();
    },
    [],
  );
  useEffect(() => {
    const before = priorView.current;
    priorView.current = v;
    if (!v || !before || v.tick <= before.tick || !sound || hidden) return;
    if (v.losses > before.losses) audio.current?.cue("impact");
    else
      for (const event of v.events.slice(before.events.length)) {
        if (event.kind === "adviser") audio.current?.cue("connect");
        else if (
          event.kind === "plan" ||
          event.kind === "allocation" ||
          event.kind === "resolution"
        )
          audio.current?.cue("commit");
        else if (event.kind === "incident") audio.current?.cue("strain");
        else if (event.kind === "production") audio.current?.cue("batch");
        else if (event.kind === "shift")
          audio.current?.cue(v.phase === "allocation" ? "end" : "release");
      }
  }, [v, sound, hidden]);
  const running = v?.phase === "running",
    strained = v !== null && v.condition < 75;
  useEffect(() => {
    audio.current?.machine(
      running && !paused && !settings && screen === "factory",
      hidden,
      strained,
    );
  }, [running, strained, paused, hidden, settings, screen, sound]);
  const heading = useRef<HTMLHeadingElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    cameraDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (settings) dialog.current?.showModal();
    else dialog.current?.close();
  }, [settings]);
  useEffect(() => {
    if (
      v?.phase !== "running" ||
      paused ||
      hidden ||
      error ||
      pending ||
      screen !== "factory" ||
      settings
    )
      return;
    const timer = window.setTimeout(
      () => void send({ type: "advance" }),
      speed === 1 ? 900 : 300,
    );
    return () => window.clearTimeout(timer);
  }, [
    v?.tick,
    v?.phase,
    paused,
    hidden,
    error,
    pending,
    send,
    speed,
    screen,
    settings,
  ]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!intro) heading.current?.focus({ preventScroll: true });
  }, [v?.phase, intro, screen]);
  useEffect(() => {
    if (selectedRoom && v?.phase === "choose")
      cameraDialog.current?.showModal();
  }, [selectedRoom, v?.phase]);
  const quiet =
    hidden ||
    !effects ||
    paused ||
    settings ||
    v?.phase !== "running" ||
    screen !== "factory";
  const assignments: Assignments | null = v?.briefing
    ? swap
      ? {
          conveyor: v.briefing.assignments.security,
          security: v.briefing.assignments.conveyor,
        }
      : v.briefing.assignments
    : null;
  const activeRoom = v?.pending?.room ?? selectedRoom ?? "conveyor";
  const chapter =
    v?.phase === "choose"
      ? "Choose your adviser"
      : v?.phase === "briefing"
        ? "The morning brief"
        : v?.phase === "ready"
          ? "Your first arrangement"
          : v?.phase === "decision"
            ? "Your decision is needed"
            : v?.phase === "allocation"
              ? "Where do they go?"
              : v?.phase === "complete"
                ? "The first day leaves a mark."
                : "The shift is in their hands.";
  function reset() {
    setIntro("arrival");
    setScreen("factory");
    setSwap(false);
    setRetain(0);
    setPaused(false);
    setConfirmAllocation(false);
    setSelectedRoom(null);
    void run.restart();
  }
  return (
    <main
      className={styles.shell}
      data-quiet={quiet}
      data-effects={effects}
      data-alarm={v?.phase === "decision"}
      data-strain={Boolean(v && v.condition < 75)}
    >
      <div className={styles.ambient} aria-hidden="true" />
      <header className={styles.topbar}>
        <Link href="/stepanoskin/loopforge" className={styles.brand}>
          <ChevronLeft size={16} />
          <span>
            LOOPFORGE<small>DIRECTOR’S CONSOLE</small>
          </span>
        </Link>
        <div className={styles.dayMark}>
          <span>ACT I / FIRST SHIFT</span>
          <strong>
            DAY <b>01</b>
            <em> / 07</em>
          </strong>
        </div>
        <div className={styles.topActions}>
          <span className={styles.prototype}>FIRST-TURN PLAYTEST</span>
          <button
            onClick={() => void toggleSound()}
            aria-label={sound ? "Mute factory sound" : "Enable factory sound"}
            aria-pressed={sound}
          >
            {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => setSettings(true)}
            aria-label="Open display settings"
          >
            <Settings2 size={18} />
          </button>
        </div>
      </header>
      {run.error && (
        <div className={styles.error} role="alert">
          <strong>Connection interrupted.</strong> {run.error}
          <button onClick={() => void run.recover()} disabled={run.pending}>
            Reconnect to confirmed state
          </button>
        </div>
      )}
      {intro === "arrival" ? (
        <section className={styles.arrival}>
          <div className={styles.arrivalImage}>
            <Shot media={media} id="entrance" eager sizes="100vw" />
            <div className={styles.glass} />
          </div>
          <div className={styles.arrivalCopy}>
            <p className={styles.kicker}>LOOPFORGE / ACT I</p>
            <h1>
              The factory
              <br />
              is yours.
            </h1>
            <p>
              The line can run.
              <br />
              The supervisors disagree about how.
              <br />
              The quota is already waiting.
            </p>
            <button
              className={styles.primary}
              onClick={() => setIntro("handover")}
              disabled={!v || run.pending}
            >
              {run.pending
                ? "Connecting to the factory…"
                : "Report for your first shift"}
              <ArrowRight size={18} />
            </button>
            <span className={styles.arrivalNote}>
              One day. Two advisers. Your first consequences.
            </span>
          </div>
          <div className={styles.arrivalFooter}>
            <span>TRUTH STAYS CLEAN. STORY GETS MESSY.</span>
            <Link href="/stepanoskin/loopforge/design">Game design ↗</Link>
          </div>
        </section>
      ) : intro === "handover" && v ? (
        <section className={styles.handover}>
          <div className={styles.handoverArt}>
            <Shot media={media} id="factory" eager />
            <span className={styles.imageCaption}>
              LOOPFORGE / FLOOR 01 / DIRECTOR ACCESS GRANTED
            </span>
          </div>
          <div className={styles.handoverPaper}>
            <Seal />
            <span className={styles.kicker}>Handover / Week 01</span>
            <h1>Your first order.</h1>
            <p className={styles.lead}>
              Deliver <b>60 robots</b> by the end of the week.
            </p>
            <p>
              The Conveyor and Security are available. The rest of the floor is
              sealed. Neither supervisor has an assignment yet.
            </p>
            <div className={styles.handoverRules}>
              <div>
                <b>01</b>
                <p>
                  <strong>Choose whom to trust.</strong>Your adviser proposes
                  the plan and guides responses all day.
                </p>
              </div>
              <div>
                <b>02</b>
                <p>
                  <strong>Give them authority.</strong>In their assigned room,
                  they act without asking. Elsewhere, you can override.
                </p>
              </div>
              <div>
                <b>03</b>
                <p>
                  <strong>Commit what you make.</strong>Keep new workers or send
                  them to the quota. Each day’s split is final.
                </p>
              </div>
            </div>
            <button className={styles.primary} onClick={() => setIntro(null)}>
              Enter the director’s console
              <ArrowRight size={18} />
            </button>
            <small className={styles.note}>
              A first-turn prototype. Figures are provisional; the week
              continues beyond this slice.
            </small>
          </div>
        </section>
      ) : v ? (
        <>
          <StatStrip view={v} />
          <nav className={styles.nav} aria-label="Director’s console screens">
            <div>
              {(["factory", "development", "records"] as const).map((id) => (
                <button
                  key={id}
                  aria-current={screen === id ? "page" : undefined}
                  onClick={() => setScreen(id)}
                >
                  {id === "factory" ? (
                    <Factory size={16} />
                  ) : id === "records" ? (
                    <FileText size={16} />
                  ) : (
                    <LockKeyhole size={16} />
                  )}
                  {id === "factory"
                    ? "Factory"
                    : id === "records"
                      ? "Shift record"
                      : "Development"}
                </button>
              ))}
            </div>
            <span>
              <i className={styles.statusDot} />{" "}
              {v.phase === "running" && !paused && screen === "factory"
                ? "SHIFT RUNNING"
                : v.phase === "decision"
                  ? "AWAITING YOUR DECISION"
                  : "TIME PAUSED"}
            </span>
          </nav>
          {screen === "factory" ? (
            <div className={styles.workspace}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.kicker}>
                    {v.phase === "choose"
                      ? "01 / Your primary choice today"
                      : v.phase === "briefing"
                        ? `${label(v.adviser)} / private briefing`
                        : "Floor 01 / Director’s watch"}
                  </span>
                  <h1 ref={heading} tabIndex={-1}>
                    {chapter}
                  </h1>
                </div>
                {v.phase === "running" && (
                  <div className={styles.playControls}>
                    <button
                      onClick={() => setPaused(!paused)}
                      aria-label={paused ? "Resume shift" : "Pause shift"}
                    >
                      {paused ? (
                        <CirclePlay size={22} />
                      ) : (
                        <CirclePause size={22} />
                      )}
                    </button>
                    <button
                      onClick={() => setSpeed(speed === 1 ? 3 : 1)}
                      aria-label={`Playback speed ${speed} times`}
                    >
                      {speed}×
                    </button>
                  </div>
                )}
              </div>
              {v.phase === "choose" ? (
                <>
                  <p className={styles.sectionLead}>
                    Choose one adviser for the day. They set the priority and
                    propose your first assignments.{" "}
                    <b>You decide whether to follow them.</b>
                  </p>
                  <div className={styles.advisers}>
                    {v.people.map((person) => (
                      <article
                        key={person.id}
                        className={styles.adviserCard}
                        data-person={person.id}
                      >
                        <div className={styles.portrait}>
                          <Shot
                            media={media}
                            id={person.id}
                            eager
                            sizes="(max-width: 760px) 600px, 750px"
                          />
                        </div>
                        <div className={styles.adviserCopy}>
                          <span className={styles.kicker}>
                            {person.id === "limen"
                              ? "Security chief / procedural authority"
                              : "Line specialist / appetite for output"}
                          </span>
                          <h2>{label(person.id)}</h2>
                          <blockquote>“{person.remark}”</blockquote>
                          <div className={styles.adviserPromise}>
                            <span>
                              {person.id === "limen"
                                ? "Safety & compliance"
                                : "Productivity & momentum"}
                            </span>
                            <small>
                              {person.id === "limen"
                                ? "Lower output · less wear"
                                : "More output · greater exposure"}
                            </small>
                          </div>
                          <button
                            className={styles.primary}
                            disabled={run.pending}
                            onClick={() =>
                              void run.send({
                                type: "choose_adviser",
                                adviser: person.id,
                              })
                            }
                          >
                            Hear {label(person.id)}’s brief
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  <p className={styles.choiceNote}>
                    <Radio size={15} /> Opening the brief commits your adviser
                    for today. Assignments remain yours to approve.
                  </p>
                  <div className={styles.openingRooms}>
                    <Camera
                      media={media}
                      view={v}
                      room="conveyor"
                      compact
                      onOpen={() => setSelectedRoom("conveyor")}
                    />
                    <Camera
                      media={media}
                      view={v}
                      room="security"
                      compact
                      onOpen={() => setSelectedRoom("security")}
                    />
                    <div className={styles.closedSummary}>
                      <LockKeyhole size={25} />
                      <span>FOUR BAYS SEALED</span>
                      <p>
                        A whole floor.
                        <br />
                        Not yet a whole factory.
                      </p>
                    </div>
                  </div>
                </>
              ) : v.phase === "briefing" && v.briefing && assignments ? (
                <div className={styles.briefing}>
                  <div className={styles.briefPortrait}>
                    <Shot media={media} id={v.adviser!} eager sizes="1000px" />
                    <div>
                      <span className={styles.kicker}>Today’s adviser</span>
                      <h2>{label(v.adviser)}</h2>
                      <p>One voice. A particular view of the factory.</p>
                    </div>
                  </div>
                  <div className={styles.briefPanels}>
                    <div className={styles.comicPanel}>
                      <span className={styles.kicker}>About the factory</span>
                      <p>“{v.briefing.assessment}”</p>
                    </div>
                    <div className={styles.comicPanel}>
                      <span className={styles.kicker}>
                        What you should know
                      </span>
                      <p>“{v.briefing.context}”</p>
                      <small>
                        {label(v.adviser)}’s assessment, not an independent
                        report.
                      </small>
                    </div>
                    <div
                      className={`${styles.comicPanel} ${styles.priorityPanel}`}
                    >
                      <span className={styles.kicker}>My priority today</span>
                      <h3>{v.briefing.priority}</h3>
                      <p>“{v.briefing.rationale}”</p>
                    </div>
                    <div className={styles.plan}>
                      <div className={styles.planHeading}>
                        <h3>
                          {swap
                            ? "Your revised arrangement"
                            : "My proposed arrangement"}
                        </h3>
                        <button
                          onClick={() => setSwap(!swap)}
                          disabled={run.pending}
                        >
                          {swap ? "Restore proposal" : "Swap assignments"}
                        </button>
                      </div>
                      <div className={styles.assignmentPair}>
                        {(["conveyor", "security"] as const).map((room) => (
                          <div key={room}>
                            <span>{roomName(room)}</span>
                            <strong>{label(assignments[room])}</strong>
                            <small>
                              {assignments[room] === v.adviser
                                ? "Automatic event authority"
                                : "You approve event responses"}
                            </small>
                          </div>
                        ))}
                      </div>
                      <p className={styles.tradeoff}>
                        {swap
                          ? "You are changing who operates the line. The adviser’s priority remains theirs; they will remember the override."
                          : v.briefing.tradeoff}
                      </p>
                      <button
                        className={styles.primary}
                        disabled={run.pending}
                        onClick={() =>
                          void run.send({ type: "approve_plan", assignments })
                        }
                      >
                        {swap
                          ? "Approve my arrangement"
                          : "Approve the arrangement"}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : v.phase === "allocation" || v.phase === "complete" ? (
                <div className={styles.endGrid}>
                  <div>
                    <Camera media={media} view={v} room="conveyor" />
                    <div className={styles.supervisorReactions}>
                      {v.people.map((person) => (
                        <div key={person.id}>
                          <strong>{label(person.id)}</strong>
                          <p>“{person.remark}”</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <section className={styles.ledger}>
                    <span className={styles.kicker}>
                      {v.phase === "complete"
                        ? "COMMITMENT RECORDED"
                        : "End-of-shift allocation"}
                    </span>
                    <h2>
                      {v.phase === "complete"
                        ? "Tomorrow inherits this."
                        : `${v.produced} new robots.`}
                    </h2>
                    <p>
                      {v.phase === "complete"
                        ? "The first shift is over. The workforce, equipment and supervisor reactions carry into the next day."
                        : "More hands here, or fewer units left to deliver. You cannot recall a commitment tomorrow."}
                    </p>
                    {v.phase === "allocation" ? (
                      <>
                        <div className={styles.allocationCounts}>
                          <div>
                            <span>KEEP IN FACTORY</span>
                            <strong>{retain}</strong>
                            <small>
                              {v.workers + retain} workers next shift
                            </small>
                          </div>
                          <div>
                            <span>COMMIT TO QUOTA</span>
                            <strong>{v.produced - retain}</strong>
                            <small>of 60 due at week’s end</small>
                          </div>
                        </div>
                        <label
                          className={styles.rangeLabel}
                          htmlFor="retained-workers"
                        >
                          Workers to retain
                        </label>
                        <input
                          id="retained-workers"
                          type="range"
                          min={0}
                          max={v.produced}
                          value={retain}
                          onChange={(e) => {
                            setRetain(Number(e.target.value));
                            setConfirmAllocation(false);
                          }}
                        />
                        <div className={styles.rangeEnds}>
                          <span>All to quota</span>
                          <span>All to factory</span>
                        </div>
                        {confirmAllocation ? (
                          <div className={styles.confirmBox}>
                            <strong>
                              Commit {retain} to the factory and{" "}
                              {v.produced - retain} to the quota?
                            </strong>
                            <p>
                              This allocation cannot be changed after
                              confirmation.
                            </p>
                            <button
                              className={styles.primary}
                              disabled={run.pending}
                              onClick={() =>
                                void run.send({ type: "commit_output", retain })
                              }
                            >
                              Confirm permanent allocation
                              <ArrowRight size={16} />
                            </button>
                            <button onClick={() => setConfirmAllocation(false)}>
                              Keep adjusting
                            </button>
                          </div>
                        ) : (
                          <button
                            className={styles.primary}
                            onClick={() => setConfirmAllocation(true)}
                          >
                            Review this commitment
                            <ArrowRight size={16} />
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <dl className={styles.recapFacts}>
                          <div>
                            <dt>Workers retained</dt>
                            <dd>+{v.retained}</dd>
                          </div>
                          <div>
                            <dt>Weekly quota committed</dt>
                            <dd>{v.committed} / 60</dd>
                          </div>
                          <div>
                            <dt>Equipment condition</dt>
                            <dd>82 → {v.condition}</dd>
                          </div>
                          <div>
                            <dt>Workers lost</dt>
                            <dd>{v.losses}</dd>
                          </div>
                        </dl>
                        <p className={styles.note}>
                          This prototype ends here. Later shifts, unlocks and
                          cash settlement are still being designed.
                        </p>
                        <button
                          className={styles.primary}
                          onClick={() => setScreen("records")}
                        >
                          Review what happened
                          <FileText size={17} />
                        </button>
                        <button className={styles.textButton} onClick={reset}>
                          Try a new first shift ↗
                        </button>
                      </>
                    )}
                  </section>
                </div>
              ) : (
                <div className={styles.liveGrid}>
                  <div className={styles.cameraWall}>
                    <Camera media={media} view={v} room={activeRoom} />
                    <div className={styles.feedRow}>
                      <Camera
                        media={media}
                        view={v}
                        room={
                          activeRoom === "conveyor" ? "security" : "conveyor"
                        }
                        compact
                        onOpen={() =>
                          setSelectedRoom(
                            activeRoom === "conveyor" ? "security" : "conveyor",
                          )
                        }
                      />
                      <div className={styles.sealedBays}>
                        {[
                          "Burn-in Theatre",
                          "Substrate Brewery",
                          "Weaving Gallery",
                          "Cortex Assembly",
                        ].map((name, index) => (
                          <div key={name}>
                            <LockKeyhole size={15} />
                            <span>
                              0{index + 3} / {name}
                            </span>
                            <small>SEALED</small>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.shiftProgress}>
                      <span>SHIFT 01</span>
                      <progress
                        max={SHIFT_TICKS}
                        value={v.shiftTick}
                        aria-label="First shift progress"
                      />
                      <span>{v.produced} COMPLETED</span>
                    </div>
                  </div>
                  <aside className={styles.directive}>
                    {v.phase === "ready" ? (
                      <>
                        <span className={styles.kicker}>
                          Plan approved / awaiting release
                        </span>
                        <h2>They have their rooms.</h2>
                        <p className={styles.lead}>
                          {label(v.adviser)} will guide the day.
                        </p>
                        <div className={styles.authorityCard}>
                          <ShieldCheck size={22} />
                          <p>
                            <b>
                              {roomName(
                                v.assignments!.conveyor === v.adviser
                                  ? "conveyor"
                                  : "security",
                              )}
                              :
                            </b>{" "}
                            your adviser resolves events automatically. In the
                            other room, you decide.
                          </p>
                        </div>
                        <blockquote>
                          “{v.people.find((p) => p.id === v.adviser)?.remark}”
                        </blockquote>
                        <button
                          className={styles.primary}
                          disabled={run.pending}
                          onClick={() => void run.send({ type: "start_shift" })}
                        >
                          Start the first shift
                          <CirclePlay size={20} />
                        </button>
                        <p className={styles.note}>
                          Watch the line. Important decisions pause the shift.
                          You can pause it yourself at any time.
                        </p>
                      </>
                    ) : v.pending ? (
                      <>
                        <span className={styles.alertLabel}>
                          DECISION PAUSE / {roomName(v.pending.room)}
                        </span>
                        <h2>{v.pending.title}</h2>
                        <p>{v.pending.observation}</p>
                        <div className={styles.adviceBalloon}>
                          <span className={styles.kicker}>
                            {label(v.adviser)} advises
                          </span>
                          <blockquote>“{v.pending.advice}”</blockquote>
                        </div>
                        <div className={styles.eventChoices}>
                          {v.pending.choices.map((choice) => (
                            <button
                              key={choice.id}
                              disabled={run.pending}
                              onClick={() =>
                                void run.send({
                                  type: "resolve_incident",
                                  incident: v.pending!.id,
                                  response: choice.id,
                                })
                              }
                              className={
                                choice.id === v.pending!.recommendation
                                  ? styles.recommended
                                  : ""
                              }
                            >
                              <small>
                                {choice.id === v.pending!.recommendation
                                  ? "FOLLOW ADVISER"
                                  : "OVERRIDE ADVISER"}
                              </small>
                              <strong>
                                {choice.label}
                                <ArrowRight size={15} />
                              </strong>
                              <span>{choice.consequence}</span>
                            </button>
                          ))}
                        </div>
                        <p className={styles.note}>
                          Your response is recorded. Both supervisors hear the
                          order and react.
                        </p>
                      </>
                    ) : (
                      <>
                        <span className={styles.kicker}>
                          On duty / {label(v.adviser)}
                        </span>
                        <h2>
                          {paused
                            ? "The factory waits."
                            : "Watch what they do."}
                        </h2>
                        <p>{v.briefing?.priority}</p>
                        <div className={styles.outputMeter}>
                          <strong key={v.produced}>
                            {String(v.produced).padStart(2, "0")}
                          </strong>
                          <span>
                            ROBOTS COMPLETED
                            <small>Allocation follows the shift.</small>
                          </span>
                        </div>
                        <div className={styles.liveRecords} aria-live="polite">
                          {v.events
                            .filter(
                              (e) =>
                                e.kind === "resolution" ||
                                e.kind === "incident" ||
                                e.kind === "shift",
                            )
                            .slice(-3)
                            .reverse()
                            .map((e) => (
                              <article key={e.id}>
                                <span>
                                  {e.shiftTick
                                    ? `BEAT ${String(e.shiftTick).padStart(2, "0")}`
                                    : "SHIFT START"}{" "}
                                  / {e.room ? roomName(e.room) : "FACTORY"}
                                </span>
                                <h3>{e.title}</h3>
                                <p>{e.detail}</p>
                              </article>
                            ))}
                        </div>
                        {v.events.some((e) => e.kind === "resolution") && (
                          <div className={styles.liveReactions}>
                            {v.people.map((person) => (
                              <p key={person.id}>
                                <b>{label(person.id)}</b> “{person.remark}”
                              </p>
                            ))}
                          </div>
                        )}
                        <button
                          className={styles.textButton}
                          onClick={() => setScreen("records")}
                        >
                          Inspect the shift record ↗
                        </button>
                      </>
                    )}
                  </aside>
                </div>
              )}
            </div>
          ) : screen === "records" ? (
            <section className={styles.records}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.kicker}>
                    Day 01 / Confirmed events
                  </span>
                  <h1 ref={heading} tabIndex={-1}>
                    The shift record.
                  </h1>
                </div>
                <button onClick={run.download}>Download replay record ↓</button>
              </div>
              <p>
                The ledger records actions and consequences. A supervisor’s
                account of them is a separate matter.
              </p>
              {v.events.length ? (
                <ol>
                  {v.events.map((e) => (
                    <li key={e.id}>
                      <span className={styles.recordTime}>
                        {String(e.shiftTick).padStart(2, "0")}
                        <small>BEAT</small>
                      </span>
                      <div>
                        <span className={styles.kicker}>
                          {e.actor === "director"
                            ? "Your order"
                            : e.actor === "factory"
                              ? "Factory record"
                              : label(e.actor)}
                          {e.room ? ` / ${roomName(e.room)}` : ""}
                        </span>
                        <h3>{e.title}</h3>
                        <p>{e.detail}</p>
                        <details>
                          <summary>Why this happened</summary>
                          <p>{e.cause}</p>
                        </details>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className={styles.emptyRecord}>
                  <FileText size={35} />
                  <h2>No orders yet.</h2>
                  <p>
                    Your first choice is the adviser. No assignments have been
                    made.
                  </p>
                  <button onClick={() => setScreen("factory")}>
                    Return to adviser selection →
                  </button>
                </div>
              )}
            </section>
          ) : (
            <section className={styles.development}>
              <span className={styles.kicker}>
                Development / Not yet commissioned
              </span>
              <h1 ref={heading} tabIndex={-1}>
                Earn the next room.
              </h1>
              <p className={styles.sectionLead}>
                Establish the first production line. New rooms will introduce
                new people, capabilities and problems.
              </p>
              <div className={styles.developmentRoute}>
                {[
                  "Conveyor + Security",
                  "Burn-in Theatre",
                  "Substrate Brewery",
                  "Weaving Gallery",
                  "Cortex Assembly",
                ].map((name, i) => (
                  <div key={name} data-open={i === 0}>
                    <span>0{i + 1}</span>
                    {i ? <LockKeyhole size={22} /> : <Factory size={24} />}
                    <h3>{name}</h3>
                    <small>
                      {i === 0 ? "AVAILABLE NOW" : "BEYOND THIS PLAYTEST"}
                    </small>
                  </div>
                ))}
              </div>
              <p className={styles.note}>
                Unlock requirements and development prices are not settled. No
                purchases are available in this first-day slice.
              </p>
              <button
                className={styles.primary}
                onClick={() => setScreen("factory")}
              >
                Return to the factory
                <ArrowRight size={18} />
              </button>
            </section>
          )}
          <footer className={styles.footer}>
            <span>LOOPFORGE / FIRST SHIFT</span>
            <span>FACTS IN THE LEDGER. OPINIONS ON THE INTERCOM.</span>
            <Link href="/stepanoskin/loopforge/design">Design board ↗</Link>
          </footer>
        </>
      ) : (
        <div className={styles.loading}>
          <Radio />
          <p>Connecting to the factory…</p>
        </div>
      )}
      {selectedRoom && v?.phase === "choose" && (
        <dialog
          ref={cameraDialog}
          className={styles.roomInspection}
          aria-label="Factory camera inspection"
          onClose={() => setSelectedRoom(null)}
        >
          <button onClick={() => setSelectedRoom(null)}>
            <X size={17} /> Close camera
          </button>
          <Camera media={media} view={v} room={selectedRoom} />
          <p>
            No supervisor is assigned. Choose your adviser to receive the first
            plan.
          </p>
        </dialog>
      )}
      <dialog
        ref={dialog}
        className={styles.settings}
        onClose={() => setSettings(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setSettings(false);
        }}
        aria-labelledby="settings-title"
      >
        <button
          className={styles.close}
          onClick={() => setSettings(false)}
          aria-label="Close settings"
        >
          <X />
        </button>
        <span className={styles.kicker}>Console settings</span>
        <h2 id="settings-title">Keep the signal clear.</h2>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={effects}
            onChange={(e) => {
              setEffects(e.target.checked);
            }}
          />{" "}
          Camera atmosphere & motion
        </label>
        <p>
          Reduced-motion preferences are also respected. Effects never change
          factory outcomes.
        </p>
        <div className={styles.settingsNote}>
          <Radio size={20} />
          <p>
            Original procedural SFX follow the factory. These are a first sound
            pass; recorded assets and the soundtrack come later.
          </p>
        </div>
        <button onClick={() => void toggleSound()}>
          {sound ? "Mute factory sound" : "Enable factory sound"}
        </button>
        {audioError && <p role="status">{audioError}</p>}
        <Link href="/stepanoskin/loopforge/engine-notes">
          Read the prototype engine notes ↗
        </Link>
        <button className={styles.primary} onClick={() => setSettings(false)}>
          Return to the console
        </button>
      </dialog>
    </main>
  );
}
