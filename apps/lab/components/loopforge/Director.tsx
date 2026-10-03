"use client";
import { useEffect, useRef, useState } from "react";
import AssetImage from "@/components/media/AssetImage";
import { art } from "@/lib/loopforge/assets";
import { cast } from "@/lib/loopforge/characters";
import {
  defaultAssignments,
  ENGINE_VERSION,
  initialState,
  MAX_SHIFTS,
  QUOTA,
  type Command,
  type Doctrine,
  type State,
  type Supervisor,
} from "@/lib/loopforge/engine";
import { deliberate, intentionIsCurrent } from "@/lib/loopforge/bdi";
import type { Narrative } from "@/lib/loopforge/narrative";
import Conveyor from "./Conveyor";
import styles from "./loopforge.module.css";
type Artifact = {
  narrative: Narrative;
  provenance: {
    model: string;
    latencyMs: number;
    promptVersion: string;
    usage: { input: number; output: number };
  };
  cached: boolean;
};
const roomArt = ["security", "forge", "theatre", "brewery", "weaving"];
export default function Director() {
  const [seed, setSeed] = useState(7),
    [state, setState] = useState<State>(initialState(7)),
    [commands, setCommands] = useState<Command[]>([]),
    [assignments, setAssignments] = useState<Supervisor[]>([
      ...defaultAssignments,
    ]),
    [doctrine, setDoctrine] = useState<Doctrine>("balanced"),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const [available, setAvailable] = useState(false),
    [access, setAccess] = useState(""),
    [narrating, setNarrating] = useState(false),
    [voiceStatus, setVoiceStatus] = useState(""),
    [voices, setVoices] = useState<Record<number, Artifact>>({}),
    [advisor, setAdvisor] = useState<Supervisor>("witch");
  const generation = useRef(0),
    busy = useRef(false),
    voiceBusy = useRef(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/loopforge/narrative", { signal: ac.signal })
      .then((r) => r.json())
      .then((r) => setAvailable(r.available === true))
      .catch(() => {});
    return () => {
      ac.abort();
      controller.current?.abort();
    };
  }, []);
  const intention = deliberate(state, advisor),
    last = state.events.at(-1);
  function assign(room: number, supervisor: Supervisor) {
    const next = [...assignments],
      other = next.indexOf(supervisor);
    [next[room], next[other]] = [next[other], next[room]];
    setAssignments(next);
  }
  async function resolve() {
    if (busy.current || state.phase === "complete") return;
    busy.current = true;
    setPending(true);
    setError("");
    const gen = generation.current;
    const next = [
      ...commands,
      { type: "resolve" as const, assignments: [...assignments], doctrine },
    ];
    try {
      const response = await fetch("/api/loopforge/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: ENGINE_VERSION, seed, commands: next }),
        signal: AbortSignal.timeout(10000),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message ?? "The shift could not be resolved.");
      if (gen === generation.current) {
        setState(result.state);
        setCommands(next);
      }
    } catch (e) {
      if (gen === generation.current)
        setError(
          e instanceof Error
            ? e.message
            : "Connection unavailable. Your plan is unchanged.",
        );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  async function narrate() {
    if (voiceBusy.current || !last) return;
    voiceBusy.current = true;
    setNarrating(true);
    setVoiceStatus("");
    const gen = generation.current,
      shift = state.shift;
    const ac = new AbortController();
    controller.current = ac;
    try {
      const response = await fetch("/api/loopforge/narrative", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ version: ENGINE_VERSION, seed, commands }),
        signal: ac.signal,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message ?? "Narration unavailable.");
      if (gen === generation.current)
        setVoices((v) => ({ ...v, [shift]: result }));
    } catch (e) {
      if (gen === generation.current)
        setVoiceStatus(
          e instanceof Error
            ? e.message
            : "Narration unavailable. The shift is unchanged.",
        );
    } finally {
      voiceBusy.current = false;
      setNarrating(false);
    }
  }
  function reset() {
    generation.current++;
    controller.current?.abort();
    setState(initialState(seed));
    setCommands([]);
    setAssignments([...defaultAssignments]);
    setDoctrine("balanced");
    setVoices({});
    setError("");
    setVoiceStatus("");
  }
  return (
    <main className={styles.console}>
      <div className={styles.consoleTitle}>
        <div>
          <p className={styles.eyebrow}>
            DIRECTOR’S CONSOLE / TEACHING PROTOTYPE
          </p>
          <h1>The factory is yours.</h1>
          <p>
            Deliver {QUOTA} units in {MAX_SHIFTS} shifts. Keep an eye on what it
            costs the line.
          </p>
        </div>
        <div className={styles.seedControl}>
          <label>
            Run seed
            <select
              value={seed}
              disabled={commands.length > 0 || pending}
              onChange={(e) => {
                const value = Number(e.target.value);
                setSeed(value);
                setState(initialState(value));
              }}
            >
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={42}>42</option>
            </select>
          </label>
          <button disabled={pending} onClick={reset}>
            Restart run ↺
          </button>
        </div>
      </div>
      <div className={styles.consoleMeters} aria-live="polite">
        <div>
          <span>SHIFT</span>
          <strong>
            {String(state.shift).padStart(2, "0")}
            <small> / 08</small>
          </strong>
        </div>
        <div>
          <span>COMPLETED ORDER</span>
          <strong>
            {state.total}
            <small> / {QUOTA}</small>
          </strong>
          <progress
            max={QUOTA}
            value={Math.min(QUOTA, state.total)}
            aria-label="Production quota"
          />
        </div>
        <div>
          <span>FACTORY STRAIN</span>
          <strong>
            {state.strain}
            <small> / 100</small>
          </strong>
          <progress
            max={100}
            value={state.strain}
            aria-label="Factory strain"
          />
        </div>
        <div>
          <span>NARRATIVE CHANNEL</span>
          <strong className={styles.channelState}>
            {available ? "OpenAI ready" : "Not connected"}
          </strong>
          <small>
            {available
              ? "On demand · separate from simulation"
              : "The simulation runs independently"}
          </small>
        </div>
      </div>
      <nav className={styles.consoleJump} aria-label="Console areas">
        <a href="#factory-rooms">Staff the rooms</a>
        <a href="#factory-order">Give the order</a>
        <a href="#factory-ledger">Read the ledger</a>
      </nav>
      <div className={styles.monitors} id="factory-rooms">
        {cast.map((room, i) => (
          <section key={room.id} className={styles.monitor}>
            <div className={styles.monitorTop}>
              <span>CAM / 0{i + 1}</span>
              <span>
                {last ? `+${last.rooms[i].output} UNITS` : "AWAITING SHIFT"}
              </span>
            </div>
            <div className={styles.monitorArt}>
              <AssetImage
                asset={art(roomArt[i])}
                alt={`${room.room}, factory room`}
                sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 400px"
              />
              <div>
                <span>0{i + 1}</span>
                <h2>{room.room}</h2>
              </div>
            </div>
            <label>
              Supervisor
              <select
                value={assignments[i]}
                disabled={pending || state.phase === "complete"}
                onChange={(e) => assign(i, e.target.value as Supervisor)}
              >
                {cast.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.id === room.id ? " · specialist" : ""}
                  </option>
                ))}
              </select>
            </label>
          </section>
        ))}
        <section className={`${styles.monitor} ${styles.lockedMonitor}`}>
          <div className={styles.monitorTop}>
            <span>CAM / 06</span>
            <span>SEALED</span>
          </div>
          <div>
            <span>Ⅵ</span>
            <h2>Cortex Assembly</h2>
            <p>
              Some doors belong
              <br />
              to a later experiment.
            </p>
          </div>
          <small>NOT PART OF THIS PROTOTYPE</small>
        </section>
      </div>
      <Conveyor />
      <div className={styles.consoleLower} id="factory-order">
        <div>
          <section className={styles.instrument}>
            <div className={styles.instrumentLabel}>
              <span>
                {state.phase === "complete"
                  ? "RUN COMPLETE"
                  : "NEXT SHIFT / DIRECTOR’S ORDER"}
              </span>
              <span>AUTHORITATIVE SIMULATION</span>
            </div>
            {state.phase === "complete" ? (
              <div className={styles.runComplete}>
                <span>
                  {state.total >= QUOTA
                    ? "ORDER FULFILLED"
                    : "ORDER INCOMPLETE"}
                </span>
                <h2>
                  {state.total >= QUOTA
                    ? "The shipment can leave."
                    : "The ledger tells the truth."}
                </h2>
                <p>
                  {state.total} units produced.{" "}
                  {Math.max(0, QUOTA - state.total)} units short. Final strain:{" "}
                  {state.strain}. Change your policy and replay the same seed to
                  compare.
                </p>
                <button className={styles.primaryLink} onClick={reset}>
                  Run the experiment again ↺
                </button>
              </div>
            ) : (
              <>
                <div className={styles.doctrineChoices}>
                  {(["care", "balanced", "pressure"] as const).map((d) => (
                    <button
                      key={d}
                      disabled={pending}
                      aria-pressed={doctrine === d}
                      onClick={() => setDoctrine(d)}
                    >
                      <strong>{d}</strong>
                      <span>
                        {d === "care"
                          ? "Recover the line"
                          : d === "pressure"
                            ? "Push the order"
                            : "Hold the rhythm"}
                      </span>
                      <small>
                        {d === "care"
                          ? "−1 output / room · −16 strain"
                          : d === "pressure"
                            ? "+2 output / room · +18 strain"
                            : "Standard output · +4 strain"}
                      </small>
                    </button>
                  ))}
                </div>
                <button
                  className={styles.primaryLink}
                  onClick={resolve}
                  disabled={pending}
                >
                  {pending
                    ? "Resolving the shift…"
                    : `Commit shift ${state.shift + 1}`}
                  <span>→</span>
                </button>
                <p className={styles.exhibitNote}>
                  Changing a supervisor swaps their rooms. Specialists add 2
                  units. Every 20 starting strain removes 1 unit per room.
                  Seeded disturbances add −1, 0 or +1.
                </p>
              </>
            )}
            {error && (
              <p role="alert" className={styles.error}>
                {error}
              </p>
            )}
          </section>
          <section className={`${styles.instrument} ${styles.advisor}`}>
            <div className={styles.instrumentLabel}>
              <span>BDI ADVISOR / DETERMINISTIC</span>
              <span>ADVICE, NOT AN ORDER</span>
            </div>
            <div>
              <label>
                Consult
                <select
                  value={advisor}
                  onChange={(e) => setAdvisor(e.target.value as Supervisor)}
                >
                  {cast.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <h3>
                {intention.goal === "recover"
                  ? "Let the line recover."
                  : intention.goal === "deliver"
                    ? "The order needs momentum."
                    : "Keep a steady rhythm."}
              </h3>
              <p>
                Belief: {intention.beliefs.strain} strain,{" "}
                {intention.beliefs.remainingOrder} units remaining,{" "}
                {intention.beliefs.shiftsLeft} shifts left.
              </p>
              <details>
                <summary>Inspect the decision</summary>
                <p>
                  Recovery {intention.scores.recover} · Delivery{" "}
                  {intention.scores.deliver} · Stability{" "}
                  {intention.scores.stabilize}. The highest score selects a
                  one-shift intention. Authored traits alter priorities. This is
                  a teaching policy, not model-generated thought.
                </p>
              </details>
              <button
                disabled={pending || !intentionIsCurrent(state, intention)}
                onClick={() => setDoctrine(intention.doctrine)}
              >
                Use {intention.doctrine} doctrine →
              </button>
            </div>
          </section>
        </div>
        <div>
          <section className={styles.instrument}>
            <div className={styles.instrumentLabel}>
              <span>SHIFT LEDGER</span>
              <span>CANONICAL FACTS</span>
            </div>
            <div className={styles.ledger} id="factory-ledger">
              {!last ? (
                <p>The ledger is empty. Give the factory its first order.</p>
              ) : (
                state.events
                  .slice()
                  .reverse()
                  .map((event) => (
                    <details key={event.id} open={event.shift === state.shift}>
                      <summary>
                        <span>
                          SHIFT {String(event.shift).padStart(2, "0")}
                        </span>
                        <strong>+{event.delta}</strong>
                        <small>
                          {event.doctrine} · strain {event.strainAfter}
                        </small>
                      </summary>
                      <p>
                        {event.total} total units. Strain moved from{" "}
                        {event.strainBefore} to {event.strainAfter}.
                      </p>
                      {event.rooms.map((room) => (
                        <div key={room.room}>
                          <span>{cast[room.room].room}</span>
                          <span>
                            {cast.find((c) => c.id === room.supervisor)?.name} ·{" "}
                            {room.output}
                          </span>
                        </div>
                      ))}
                    </details>
                  ))
              )}
            </div>
          </section>
          <section className={`${styles.instrument} ${styles.narrativePanel}`}>
            <div className={styles.instrumentLabel}>
              <span>AFTER THE SHIFT</span>
              <span>ATTRIBUTED INTERPRETATION</span>
            </div>
            <div>
              {!available ? (
                <>
                  <h3>The story channel is quiet.</h3>
                  <p>
                    Live narration has not been connected. Your decisions still
                    resolve in the real simulation; no generated dialogue is
                    being imitated.
                  </p>
                </>
              ) : (
                <>
                  <label>
                    Private demo access code
                    <input
                      type="password"
                      value={access}
                      onChange={(e) => setAccess(e.target.value)}
                      autoComplete="off"
                    />
                  </label>
                  <button
                    onClick={narrate}
                    disabled={
                      !last ||
                      !access ||
                      narrating ||
                      Boolean(voices[state.shift])
                    }
                  >
                    {narrating
                      ? "A reaction is on its way…"
                      : voices[state.shift]
                        ? "Reaction recorded"
                        : `Request a reaction${last ? ` to shift ${state.shift}` : ""}`}
                  </button>
                  <p className={styles.exhibitNote}>
                    The next shift can proceed while narration is pending.
                  </p>
                </>
              )}
              {voiceStatus && (
                <p role="status" className={styles.error}>
                  {voiceStatus}
                </p>
              )}
              {Object.entries(voices)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([shift, artifact]) => (
                  <div key={shift} className={styles.voice}>
                    <span>
                      SHIFT {shift} /{" "}
                      {
                        cast.find((c) => c.id === artifact.narrative.speaker)
                          ?.name
                      }
                    </span>
                    <blockquote>“{artifact.narrative.line}”</blockquote>
                    <details>
                      <summary>Generation record</summary>
                      <p>
                        {artifact.provenance.model} ·{" "}
                        {artifact.provenance.promptVersion} ·{" "}
                        {(artifact.provenance.latencyMs / 1000).toFixed(1)}s ·{" "}
                        {artifact.provenance.usage.input} input /{" "}
                        {artifact.provenance.usage.output} output tokens
                        {artifact.cached ? " · cached artifact" : ""}
                      </p>
                    </details>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
      <details className={styles.notes}>
        <summary>Prototype rules, replay and limitations</summary>
        <p>
          Engine {ENGINE_VERSION}. Runs are branchable, bounded request
          histories reconstructed by the server, not persistent shared worlds.
          Refreshing starts a new run. No account or scarce currency exists. BDI
          advice is deterministic and expires after one shift. The narrator has
          no world-writing tool. This eight-shift economy is a new teaching
          design, not the archived Python implementation.
        </p>
      </details>
    </main>
  );
}
