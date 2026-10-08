"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  SHIFT_TICKS,
  type PlayerView,
  type RoomId,
} from "@/lib/loopforge/first-shift/contract";
import { usePreference } from "@/lib/stepanoskin/preferences";
import { useRun } from "./useRun";
import { FactoryAudio } from "./audio";
import {
  Art,
  Camera,
  Channels,
  Control,
  Instruments,
  Kicker,
  materialStyle,
  name,
  sealedRooms,
  time,
  type Media,
} from "./ConsoleParts";
import CommandDeck from "./CommandDeck";
import ThemeSettings from "./ThemeSettings";
import { useConsoleTheme } from "./ThemeProvider";
import { ConsoleBeacon, useConsoleSignals } from "./ConsoleSignals";
import s from "./first-shift.module.css";

const subscribeVisibility = (listener: () => void) => {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
};
const hiddenSnapshot = () => document.hidden;
const serverSnapshot = () => false;
const phaseTitle = (v: PlayerView) =>
  ({
    choose: "Whom do you trust?",
    briefing: "The morning brief",
    ready: "Your orders are in",
    running: "The line is moving",
    decision: v.pending?.title ?? "Your decision",
    allocation: "Dispatch the day’s output",
    complete: "Day one. On the record.",
  })[v.phase];
type Screen = "factory" | "records" | "development";

export default function FirstShift({ media, suspended = false, onOpenMenu }: { media: Media; suspended?: boolean; onOpenMenu?: () => void }) {
  const theme = useConsoleTheme();
  const signals = useConsoleSignals();
  const publish = signals?.publish;
  const run = useRun(),
    v = run.view;
  const { send, pending, error } = run;
  const [screen, setScreen] = useState<Screen>("factory");
  const [showBatches, setShowBatches] = useState(false);
  const [paused, setPaused] = useState(false),
    [speed, setSpeed] = useState(1);
  const [room, setRoom] = useState<RoomId>("conveyor");
  const [effects, setEffects] = usePreference("loopforge-first-shift-effects");
  const [settings, setSettings] = useState(false),
    [sound, setSound] = useState(false),
    [audioError, setAudioError] = useState("");
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    hiddenSnapshot,
    serverSnapshot,
  );
  const audio = useRef<FactoryAudio | null>(null),
    prior = useRef<PlayerView | null>(null);
  const heading = useRef<HTMLHeadingElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    settingsButton = useRef<HTMLButtonElement>(null);
  const active =
    v?.phase === "running" &&
    !paused &&
    !hidden &&
    !error &&
    screen === "factory" &&
    !settings;
  const ticking = active && !suspended;
  const strained = Boolean(v && v.condition < 75);
  const busy = pending || Boolean(error);
  const activeRoom = v?.pending?.room ?? room;
  useEffect(() => { if (v) publish?.(v); }, [v, publish]);

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
        "Sound is unavailable. All factory feedback remains visible.",
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
    audio.current?.machine(Boolean(ticking), hidden || suspended, strained);
  }, [ticking, hidden, suspended, strained, sound]);
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
  useEffect(() => {
    if (!ticking || pending) return;
    const timer = window.setTimeout(
      () => void send({ type: "advance" }),
      speed === 1 ? 900 : 300,
    );
    return () => window.clearTimeout(timer);
  }, [ticking, pending, v?.tick, send, speed]);
  useEffect(() => {
    if (suspended) return;
    heading.current?.focus({ preventScroll: true });
    if (window.matchMedia("(min-width: 761px)").matches)
      window.scrollTo({ top: 0, behavior: "instant" });
    else if (heading.current && heading.current.getBoundingClientRect().top < 0)
      heading.current.scrollIntoView({ block: "start", behavior: "instant" });
  }, [v?.phase, screen, suspended]);
  useEffect(() => {
    if (settings) dialog.current?.showModal();
    else dialog.current?.close();
  }, [settings]);
  function closeSettings() {
    setSettings(false);
    settingsButton.current?.focus();
  }
  function restart() {
    setScreen("factory");
    setRoom("conveyor");
    setPaused(false);
    void run.restart();
  }

  return (
    <main
      className={s.shell}
      style={{ ...materialStyle(media), ...theme?.style }}
      data-theme={theme?.recipe.shell}
      data-quiet={!active || !effects}
      data-effects={effects}
      data-alarm={v?.phase === "decision"}
      data-strain={Boolean(v && v.condition < 75)}
    >
      <ConsoleBeacon active={!settings && !suspended} />
      <div className={s.consoleBody}>
        <header className={s.topbar}>
          <Link
            href="/stepanoskin/loopforge"
            className={s.brand}
            prefetch={false}
          >
            <span>← LOOPFORGE</span>
            <small>DAY 01 · DIRECTOR’S CONSOLE</small>
          </Link>
          <div className={s.dayMark}>
            <Kicker>Act I / Week 01</Kicker>
            <b>
              DAY 01 <span>/ 07</span>
            </b>
          </div>
          <div className={s.topActions}>
            <button
              className={s.textButton}
              onClick={() => void toggleSound()}
              aria-pressed={sound}
            >
              {sound ? "Sound on" : "Sound off"}
            </button>
            <button
              ref={settingsButton}
              className={s.textButton}
              onClick={() => { if (v?.phase === "running") setPaused(true); setSettings(true); }}
            >
              Settings
            </button>
            {onOpenMenu && <button className={s.textButton} disabled={pending} onClick={() => { if (v?.phase === "running") setPaused(true); onOpenMenu(); }}>Menu</button>}
          </div>
        </header>
        {v && <Instruments media={media} view={v} />}
        <nav className={s.consoleNav} aria-label="Director console">
          <div>
            {(["factory", "records", "development"] as const).map((id) => (
              <button
                key={id}
                aria-current={screen === id ? "page" : undefined}
                onClick={() => setScreen(id)}
              >
                {id === "factory"
                  ? "Factory floor"
                  : id === "records"
                    ? "Shift record"
                    : "Development"}
              </button>
            ))}
          </div>
          <span>
            <i />
            {v?.phase === "running"
              ? active
                ? "SHIFT IN PROGRESS"
                : "SHIFT PAUSED"
              : v?.phase === "decision"
                ? "AWAITING YOUR ORDER"
                : v?.phase === "complete"
                  ? "SHIFT FILED"
                  : "LINE ON STANDBY"}
          </span>
        </nav>
        {error && (
          <div className={s.error} role="alert">
            <div>
              <b>Connection interrupted. The line is paused.</b>
              <p>
                Your last confirmed choices are intact. Reconnect, then retry
                the order.
              </p>
            </div>
            <Control disabled={pending} onClick={() => void run.recover()}>
              Reconnect
            </Control>
          </div>
        )}
        {v ? (
          screen === "factory" ? (
            <div className={s.factoryLayout} data-phase={v.phase}>
              <section
                className={s.factorySide}
                aria-label="Factory observation"
              >
                <Camera media={media} view={v} room={activeRoom} />
                <Channels view={v} room={activeRoom} onRoom={setRoom} />
                <div className={s.transport}>
                  <div>
                    <Kicker>
                      {v.phase === "choose" ||
                      v.phase === "briefing" ||
                      v.phase === "ready"
                        ? "Shift not started"
                        : "Shift progress"}
                    </Kicker>
                    <div
                      className={s.shiftTrack}
                      role="progressbar"
                      aria-label="Shift progress"
                      aria-valuemin={0}
                      aria-valuemax={SHIFT_TICKS}
                      aria-valuenow={v.shiftTick}
                    >
                      <i
                        style={{
                          transform: `scaleX(${v.shiftTick / SHIFT_TICKS})`,
                        }}
                      />
                    </div>
                    <span>
                      {time(v.shiftTick)} <small> / 18:00</small>
                    </span>
                  </div>
                  <div className={s.transportControls}>
                    <Control
                      disabled={v.phase !== "running" || Boolean(error)}
                      aria-pressed={paused}
                      onClick={() => setPaused(!paused)}
                    >
                      {paused ? "Resume" : "Pause"}
                    </Control>
                    <Control
                      disabled={v.phase !== "running"}
                      aria-label={`Playback speed ${speed} times. Switch to ${speed === 1 ? 3 : 1} times`}
                      onClick={() => setSpeed(speed === 1 ? 3 : 1)}
                    >
                      {speed}×
                    </Control>
                  </div>
                </div>
                <div className={s.floorNote}>
                  <span>FLOOR 01 · 2 / 6 ROOMS OPEN</span>
                  <span>
                    {v.produced
                      ? `${v.produced} FINISHED · ${v.losses} LOST`
                      : "AWAITING FIRST BATCH"}
                  </span>
                </div>
              </section>
              <section
                className={s.commandDeck}
                aria-label="Director decisions"
                data-phase={v.phase}
              >
                <header className={s.deckHeading}>
                  <Kicker>
                    {v.phase === "choose"
                      ? "Your first decision / choose an adviser"
                      : v.phase === "decision"
                        ? "Shift paused / director intervention"
                        : v.phase === "briefing"
                          ? `${name(v.adviser)} / intercom connected`
                          : v.phase === "allocation"
                            ? "End of shift / irreversible allocation"
                            : "Day 01 / command channel"}
                  </Kicker>
                  <h1 ref={heading} tabIndex={-1}>
                    {phaseTitle(v)}
                  </h1>
                </header>
                <CommandDeck
                  key={v.phase}
                  media={media}
                  view={v}
                  busy={busy}
                  send={send}
                  onRecords={() => setScreen("records")}
                  onRestart={restart}
                />
                {pending && v.phase !== "running" && (
                  <span className={s.confirming} role="status">
                    Confirming order…
                  </span>
                )}
              </section>
            </div>
          ) : screen === "records" ? (
            <section className={s.recordScreen}>
              <header className={s.recordHeading}>
                <div>
                  <Kicker>Day 01 / confirmed events</Kicker>
                  <h1 ref={heading} tabIndex={-1}>
                    The shift record.
                  </h1>
                  <p>
                    What happened, who acted, and what the factory recorded.
                  </p>
                </div>
                <div className={s.recordActions}>
                  <button
                    className={s.textButton}
                    aria-pressed={showBatches}
                    onClick={() => setShowBatches(!showBatches)}
                  >
                    {showBatches
                      ? "Hide batch receipts"
                      : "Show batch receipts"}
                  </button>
                  <Control onClick={run.download}>Export replay</Control>
                </div>
              </header>
              {v.events.length ? (
                <div className={s.recordLayout}>
                  <div className={s.recordScene}>
                    <Camera media={media} view={v} room={room} />
                    <Control onClick={() => setScreen("factory")}>
                      Return to the console
                    </Control>
                  </div>
                  <ol className={s.recordList}>
                    {v.events
                      .filter((e) => showBatches || e.kind !== "production")
                      .map((e) => (
                        <li key={e.id} data-kind={e.kind}>
                          <Kicker>
                            {time(e.shiftTick)} ·{" "}
                            {e.actor === "director"
                              ? "Your order"
                              : e.actor === "factory"
                                ? "Factory record"
                                : name(e.actor)}
                            {e.kind === "resolution" && e.actor !== "director"
                              ? " · automatic action"
                              : ""}
                          </Kicker>
                          <h2>{e.title}</h2>
                          <p>{e.detail}</p>
                          <details>
                            <summary>Why this happened</summary>
                            <p>{e.cause}</p>
                          </details>
                        </li>
                      ))}
                  </ol>
                </div>
              ) : (
                <div className={s.emptyRecord}>
                  <Kicker>No orders issued</Kicker>
                  <h2>The first entry is yours.</h2>
                  <p>
                    Choose today’s adviser. Neither supervisor is assigned yet.
                  </p>
                  <Control tone="primary" onClick={() => setScreen("factory")}>
                    Choose your adviser
                  </Control>
                </div>
              )}
            </section>
          ) : (
            <section className={s.developmentScreen}>
              <header>
                <Kicker>Development / floor 01</Kicker>
                <h1 ref={heading} tabIndex={-1}>
                  Four rooms. Still sealed.
                </h1>
                <p>
                  New rooms bring new capabilities—and new people to manage.
                </p>
              </header>
              <div className={s.developmentBays}>
                {sealedRooms.map((title, i) => (
                  <article key={title}>
                    <div className={s.bayArt}>
                      <Art
                        media={media}
                        id={["theatre", "brewery", "weaving", "cortex"][i]}
                        sizes="(max-width: 760px) 45vw, 24vw"
                      />
                      <span>
                        0{i + 3}
                        <small>SEALED</small>
                      </span>
                    </div>
                    <h2>{title}</h2>
                    <p>
                      {
                        [
                          "Condition the workforce.",
                          "Recover value from conveyor waste.",
                          "Weave the next generation of cognition.",
                          "Complete the Brain 2.0 prototype.",
                        ][i]
                      }
                    </p>
                  </article>
                ))}
              </div>
              <p className={s.instruction}>
                Development opens beyond this first-day playtest. Requirements
                and prices are still in design.
              </p>
              <Control tone="primary" onClick={() => setScreen("factory")}>
                Return to the console
              </Control>
            </section>
          )
        ) : (
          <div className={s.loading} role="status">
            <Kicker>Director access / floor 01</Kicker>
            <h1>Establishing the signal…</h1>
            <p>Connecting to the factory.</p>
          </div>
        )}
        <footer className={s.footer}>
          <span>FIRST SHIFT · PLAYABLE PROTOTYPE</span>
          <span>TRUTH STAYS CLEAN. STORY GETS MESSY.</span>
          <Link href="/stepanoskin/loopforge/design" prefetch={false}>
            Design board ↗
          </Link>
        </footer>
      </div>
      <div className={s.srOnly} role="status" aria-live="polite">
        {v?.events.filter((e) => e.kind !== "production").at(-1)?.title}
      </div>
      <dialog
        ref={dialog}
        className={s.settings}
        onClose={closeSettings}
        onClick={(e) => {
          if (e.target === dialog.current) closeSettings();
        }}
        aria-labelledby="settings-title"
      >
        <Kicker>Console settings</Kicker>
        <ConsoleBeacon active={settings} />
        <h2 id="settings-title">Keep the signal clear.</h2>
        {settings && <ThemeSettings disabled={pending} onPreview={closeSettings} />}
        <label className={s.toggle}>
          <input
            type="checkbox"
            checked={effects}
            onChange={(e) => setEffects(e.target.checked)}
          />{" "}
          Camera atmosphere & motion
        </label>
        <p>Your device’s reduced-motion preference is always respected.</p>
        <Control onClick={() => void toggleSound()}>
          {sound ? "Mute factory sound" : "Enable factory sound"}
        </Control>
        <p>
          Relays, ratchets and machinery respond to the shift. Sound is
          optional; the soundtrack is still to come.
        </p>
        {audioError && <p role="status">{audioError}</p>}
        <Link
          href="/stepanoskin/loopforge/design#sound-library"
          prefetch={false}
        >
          Sound library & credits ↗
        </Link>
        <Control tone="primary" onClick={closeSettings}>
          Return to the console
        </Control>
      </dialog>
    </main>
  );
}
