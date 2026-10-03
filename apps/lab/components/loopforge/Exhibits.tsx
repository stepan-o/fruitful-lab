"use client";
import { useState } from "react";
import Link from "next/link";
import AssetImage from "@/components/media/AssetImage";
import { art } from "@/lib/loopforge/assets";
import type { Exhibit } from "@/lib/loopforge/content";
import { cast } from "@/lib/loopforge/characters";
import {
  defaultAssignments,
  initialState,
  transition,
  replay,
  type Doctrine,
} from "@/lib/loopforge/engine";
import styles from "./loopforge.module.css";
import { deliberate } from "@/lib/loopforge/bdi";
const roomArt = ["security", "forge", "theatre", "brewery", "weaving"];
const pipeline = [
  {
    name: "Intention",
    tag: "COMMAND",
    text: "Assign the specialists. Set pressure doctrine. The request is still only an intention.",
    code: '{ type: "resolve", doctrine: "pressure", assignments: […] }',
  },
  {
    name: "Validation",
    tag: "BOUNDARY",
    text: "Five unique, known supervisors. A recognized doctrine. An open shift. Reject invalid requests before consuming randomness.",
    code: "Result<AcceptedCommand, InvalidCommand | RunComplete>",
  },
  {
    name: "Simulation",
    tag: "PURE KERNEL",
    text: "Use fixed room order and the next five seeded disturbances. Apply expertise, doctrine and strain. No model, clock or network.",
    code: "nextState = transition(state, acceptedCommand)",
  },
  {
    name: "Commit",
    tag: "CANONICAL FACT",
    text: "The ledger is ready. Output and strain are final for this shift. The player can continue immediately.",
    code: "{ eventId, shift, rooms, delta, total, strainAfter }",
  },
  {
    name: "Interpretation",
    tag: "ASYNC SIDECAR",
    text: "A separate request offers a character’s reaction. A late or failed response cannot alter the event or delay the next command.",
    code: "{ speaker, line, evidenceId, promptVersion, model }",
  },
];
export default function Exhibits({ kind }: { kind: Exhibit }) {
  if (kind === "bdi") return <Bdi />;
  if (kind === "cast") return <Cast />;
  if (kind === "factory") return <Factory />;
  if (kind === "shift") return <Shift />;
  if (kind === "alive") return <Alive />;
  if (kind === "cost") return <Cost />;
  if (kind === "evals") return <Evals />;
  if (kind === "ownership") return <Ownership />;
  if (kind === "replay") return <Replay />;
  if (kind === "premise")
    return (
      <div className={styles.premise}>
        <div>
          <span>01 / THE WORK</span>
          <h3>Build a mind.</h3>
          <p>
            Five rooms. One order.
            <br />
            Eight shifts to deliver.
          </p>
        </div>
        <div>
          <span>02 / THE PEOPLE</span>
          <h3>Keep them working.</h3>
          <p>
            Expertise has a personality.
            <br />
            Pressure has a memory.
          </p>
        </div>
        <div>
          <span>03 / THE STORY</span>
          <h3>Hear their side.</h3>
          <p>
            Facts are committed.
            <br />
            Interpretations remain open.
          </p>
        </div>
      </div>
    );
  return <Pipeline />;
}
function Bdi() {
  const [agent, setAgent] = useState<(typeof cast)[number]["id"]>("witch"),
    [strain, setStrain] = useState(20);
  const intention = deliberate({ ...initialState(7), strain }, agent);
  return (
    <div className={styles.instrument}>
      <div className={styles.instrumentLabel}>
        <span>BDI / DETERMINISTIC ADVISOR</span>
        <span>NEW TEACHING POLICY · NO MODEL CALL</span>
      </div>
      <div className={styles.tabs}>
        {cast.map((c) => (
          <button
            key={c.id}
            aria-pressed={agent === c.id}
            onClick={() => setAgent(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className={styles.costGrid}>
        <div>
          <label>
            Observed strain<strong>{strain}</strong>
            <input
              type="range"
              min="0"
              max="60"
              value={strain}
              onChange={(e) => setStrain(Number(e.target.value))}
            />
          </label>
          <span className={styles.eyebrow}>BELIEFS / OBSERVED AT SHIFT 0</span>
          <p>
            240 units remaining.
            <br />8 shifts left. Strain {strain}.
          </p>
          <span className={styles.eyebrow}>DESIRES / DETERMINISTIC SCORES</span>
          <dl className={styles.metrics}>
            {Object.entries(intention.scores).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.costTotal}>
          <span>INTENTION / {intention.goal.toUpperCase()}</span>
          <strong>{intention.doctrine}</strong>
          <p>Recommend next shift’s doctrine.</p>
          <small>
            Expires when the observed shift changes. The director must accept
            the suggestion; it does not write to the world. A full BDI agent
            would retain and execute longer-lived plans.
          </small>
        </div>
      </div>
    </div>
  );
}
function Pipeline() {
  const [step, setStep] = useState(3);
  return (
    <div className={styles.instrument}>
      <div className={styles.instrumentLabel}>
        <span>COMMAND → CONSEQUENCE → VOICE</span>
        <span>SELECT A STATION</span>
      </div>
      <div className={styles.pipeline}>
        {pipeline.map((p, i) => (
          <button
            key={p.name}
            aria-pressed={step === i}
            onClick={() => setStep(i)}
          >
            <small>0{i + 1}</small>
            <strong>{p.name}</strong>
            <span>{i < 3 ? "→" : i === 3 ? "↘" : "◇"}</span>
          </button>
        ))}
      </div>
      <div className={styles.pipelineDetail}>
        <span className={styles.eyebrow}>{pipeline[step].tag}</span>
        <p>{pipeline[step].text}</p>
        <code>{pipeline[step].code}</code>
      </div>
      <div className={styles.boundary}>
        <span>AUTHORITATIVE / immediate</span>
        <span>INTERPRETIVE / may arrive later</span>
      </div>
    </div>
  );
}
function Cast() {
  const [selected, setSelected] = useState(0);
  const member = cast[selected];
  return (
    <div className={styles.instrument}>
      <div className={styles.tabs} aria-label="Choose a supervisor">
        {cast.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setSelected(i)}
            aria-pressed={selected === i}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className={styles.castBody}>
        <AssetImage
          asset={art(member.id)}
          alt={`${member.name}, original character sheet`}
          sizes="(max-width: 700px) 85vw, 480px"
        />
        <div>
          <span className={styles.eyebrow}>{member.role}</span>
          <h3>{member.name}</h3>
          <blockquote>“{member.quote}”</blockquote>
          <p>{member.body}</p>
          <small>VOICE STUDY / AUTHORED ILLUSTRATION</small>
        </div>
      </div>
    </div>
  );
}
function Factory() {
  const [selected, setSelected] = useState(1);
  return (
    <div className={styles.instrument}>
      <div className={styles.instrumentLabel}>
        <span>FACTORY DIRECTORY</span>
        <span>05 ACTIVE / 01 SEALED</span>
      </div>
      <div className={styles.factory}>
        <div className={styles.roomList}>
          {cast.map((c, i) => (
            <button
              key={c.id}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <span>0{i + 1}</span>
              <strong>{c.room}</strong>
              <small>{c.name} →</small>
            </button>
          ))}
          <div className={styles.sealed}>
            <span>06</span> Cortex Assembly <small>SEALED</small>
          </div>
        </div>
        <div className={styles.roomView}>
          <AssetImage
            asset={art(roomArt[selected])}
            alt={`${cast[selected].room} concept art`}
            sizes="(max-width: 700px) 85vw, 600px"
          />
          <div>
            <span>ROOM 0{selected + 1}</span>
            <h3>{cast[selected].room}</h3>
            <p>Specialist: {cast[selected].name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
function Shift() {
  const [doctrine, setDoctrine] = useState<Doctrine>("balanced");
  const [strain, setStrain] = useState(20);
  const result = transition(
    { ...initialState(7), strain },
    { type: "resolve", assignments: defaultAssignments, doctrine },
  );
  if (!result.ok) return null;
  return (
    <div className={styles.instrument}>
      <div className={styles.instrumentLabel}>
        <span>ONE SHIFT / REAL KERNEL</span>
        <span>SEED 7 · ALL SPECIALISTS</span>
      </div>
      <div className={styles.shiftControls}>
        <div className={styles.tabs}>
          {(["care", "balanced", "pressure"] as const).map((d) => (
            <button
              key={d}
              aria-pressed={doctrine === d}
              onClick={() => setDoctrine(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <label>
          Starting strain <strong>{strain}</strong>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={strain}
            onChange={(e) => setStrain(Number(e.target.value))}
          />
        </label>
      </div>
      <div className={styles.roomOutputs}>
        {result.event.rooms.map((r, i) => (
          <div key={r.room}>
            <span>
              0{i + 1} / {cast[i].name}
            </span>
            <strong>{r.output.toString().padStart(2, "0")}</strong>
            <small>units produced</small>
            <i style={{ height: `${12 + r.output * 6}px` }} />
          </div>
        ))}
      </div>
      <div className={styles.readout}>
        <p>
          <span>THIS SHIFT</span>
          <strong>+{result.event.delta}</strong>
          <small>units</small>
        </p>
        <p>
          <span>STRAIN AFTER</span>
          <strong>{result.state.strain}</strong>
          <small>/ 100</small>
        </p>
        <div>
          Per room: 4 base + 2 expertise + doctrine + seeded disturbance −
          floor(starting strain / 20). Minimum zero.
          <br />
          Pressure: +2 output, +18 strain. Care: −1 output, −16 strain.
          Balanced: +4 strain.
        </div>
      </div>
    </div>
  );
}
function Alive() {
  const [level, setLevel] = useState(1);
  const modes = [
    {
      title: "Authored life",
      description:
        "State-driven routines, signals and authored barks. Immediate, cheap and predictable; expression is limited by what we write.",
      calls: "0",
      latency: "Immediate",
      risk: "Repetition",
    },
    {
      title: "Event-driven voice",
      description:
        "The simulation commits. A meaningful event triggers a short reaction. Presentation fills the space while the narrator works.",
      calls: "Selected events",
      latency: "Separate lane",
      risk: "Late or unfaithful prose",
    },
    {
      title: "Optional conversation",
      description:
        "The player opens a dialogue lane. Ground each turn in current evidence. Interruptible conversation remains separate from simulation authority.",
      calls: "Per dialogue turn",
      latency: "Part of the interaction",
      risk: "Memory, interruption, cost",
    },
  ];
  return (
    <div className={styles.instrument}>
      <div className={styles.instrumentLabel}>
        <span>HOW ALIVE SHOULD IT FEEL?</span>
        <span>DESIGN TRADEOFF / NOT A BENCHMARK</span>
      </div>
      <div className={styles.tabs}>
        {modes.map((m, i) => (
          <button
            key={m.title}
            aria-pressed={level === i}
            onClick={() => setLevel(i)}
          >
            {m.title}
          </button>
        ))}
      </div>
      <div className={styles.clockLanes}>
        {["SIMULATION", "PRESENTATION", "NARRATIVE"].map((name, i) => (
          <div key={name}>
            <span>{name}</span>
            <div className={styles.timeline}>
              {Array.from(
                {
                  length:
                    i === 1
                      ? 16
                      : i === 2
                        ? level === 0
                          ? 0
                          : level === 1
                            ? 3
                            : 9
                        : 5,
                },
                (_, j) => (
                  <i
                    key={j}
                    style={{
                      left: `${((j + 1) * 100) / ((i === 1 ? 16 : i === 2 ? (level === 1 ? 3 : 9) : 5) + 1)}%`,
                    }}
                  />
                ),
              )}
              {i === 2 && level === 0 && <small>Authored reactions only</small>}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pipelineDetail}>
        <h3>{modes[level].title}</h3>
        <p>{modes[level].description}</p>
        <dl className={styles.metrics}>
          <div>
            <dt>MODEL CALLS</dt>
            <dd>{modes[level].calls}</dd>
          </div>
          <div>
            <dt>PERCEIVED LATENCY</dt>
            <dd>{modes[level].latency}</dd>
          </div>
          <div>
            <dt>PRIMARY CONSTRAINT</dt>
            <dd>{modes[level].risk}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
function Cost() {
  const [calls, setCalls] = useState(3),
    [input, setInput] = useState(1200),
    [output, setOutput] = useState(180),
    [inputPrice, setInputPrice] = useState(1),
    [outputPrice, setOutputPrice] = useState(4),
    [yieldRate, setYieldRate] = useState(90);
  const cost = (input * inputPrice + output * outputPrice) / 1e6;
  return (
    <div className={styles.instrument}>
      <div className={styles.instrumentLabel}>
        <span>NARRATIVE BUDGET WORKBENCH</span>
        <span>EDITABLE ASSUMPTIONS · USD</span>
      </div>
      <div className={styles.costGrid}>
        <div>
          {[
            {
              label: "Generated beats per run",
              value: calls,
              set: setCalls,
              min: 0,
              max: 24,
              step: 1,
            },
            {
              label: "Input tokens per call",
              value: input,
              set: setInput,
              min: 200,
              max: 5000,
              step: 100,
            },
            {
              label: "Output tokens per call",
              value: output,
              set: setOutput,
              min: 40,
              max: 800,
              step: 20,
            },
            {
              label: "Accepted outputs (%)",
              value: yieldRate,
              set: setYieldRate,
              min: 10,
              max: 100,
              step: 5,
            },
          ].map((c) => (
            <label key={c.label}>
              {c.label}
              <strong>{c.value}</strong>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={c.value}
                onChange={(e) => c.set(Number(e.target.value))}
              />
            </label>
          ))}
          <div className={styles.priceInputs}>
            <label>
              Input $ / 1M
              <input
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={inputPrice}
                onChange={(e) =>
                  setInputPrice(
                    Math.max(0, Math.min(1000, Number(e.target.value))),
                  )
                }
              />
            </label>
            <label>
              Output $ / 1M
              <input
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={outputPrice}
                onChange={(e) =>
                  setOutputPrice(
                    Math.max(0, Math.min(1000, Number(e.target.value))),
                  )
                }
              />
            </label>
          </div>
        </div>
        <div className={styles.costTotal}>
          <span>EXPECTED COST / RUN</span>
          <strong>${(cost * calls).toFixed(4)}</strong>
          <p>${(cost / (yieldRate / 100)).toFixed(4)} per accepted beat</p>
          <p>${(cost * calls * 1000).toFixed(2)} per 1,000 runs</p>
          <small>
            Uncached text-only estimate. No retries, reasoning overhead, images,
            hosting or self-hosted GPU costs included. Edit rates for the actual
            deployed model.
          </small>
        </div>
      </div>
    </div>
  );
}
function Evals() {
  const [selected, setSelected] = useState(0);
  const cases = [
    {
      name: "Valid interpretation",
      line: "Stiletto: ‘The quota moved. So did the cost of making everyone keep up.’",
      reference: "Current committed event",
      pass: true,
      note: "Contract checks pass. Faithfulness and voice still require semantic review.",
    },
    {
      name: "Invented consequence",
      line: "Stiletto: ‘I opened Assembly and doubled tomorrow’s capacity.’",
      reference: "Current committed event",
      pass: true,
      note: "A valid envelope can contain an invented mechanic. This must fail the factual review; schema validation alone cannot detect it.",
    },
    {
      name: "Wrong evidence",
      line: "Limen: ‘The record is perfectly clear.’",
      reference: "Event from another shift",
      pass: false,
      note: "Reject before display. A plausible line with a stale evidence ID does not belong to this beat.",
    },
  ];
  const c = cases[selected];
  return (
    <div className={styles.instrument}>
      <div className={styles.instrumentLabel}>
        <span>EVALUATION BENCH</span>
        <span>ILLUSTRATIVE CASES / NO MODEL SCORES CLAIMED</span>
      </div>
      <div className={styles.tabs}>
        {cases.map((v, i) => (
          <button
            key={v.name}
            aria-pressed={i === selected}
            onClick={() => setSelected(i)}
          >
            {v.name}
          </button>
        ))}
      </div>
      <div className={styles.evalSample}>
        <span className={styles.eyebrow}>CANDIDATE OUTPUT</span>
        <blockquote>{c.line}</blockquote>
        <dl>
          <div>
            <dt>Envelope</dt>
            <dd>{c.pass ? "Pass" : "Reject"}</dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>{c.reference}</dd>
          </div>
          <div>
            <dt>Semantic review</dt>
            <dd>
              {selected === 1
                ? "Reject: unsupported outcome"
                : selected === 0
                  ? "Required"
                  : "Do not display"}
            </dd>
          </div>
        </dl>
        <p>{c.note}</p>
      </div>
      <div className={styles.boundary}>
        <span>HARD GATES / code</span>
        <span>QUALITY & FAITHFULNESS / calibrated review</span>
      </div>
    </div>
  );
}
function Ownership() {
  const [view, setView] = useState(0);
  const data = [
    {
      name: "World state",
      owner: "KERNEL",
      facts: [
        "Entity IDs and assignments",
        "Integer output and strain",
        "Seeded RNG and accepted commands",
      ],
      rule: "A new state comes only from a validated transition.",
    },
    {
      name: "Character belief",
      owner: "NARRATIVE",
      facts: [
        "Authored motive and known evidence",
        "Attributed interpretation",
        "Prompt, model and source-event provenance",
      ],
      rule: "A belief can disagree with a witness. It cannot rewrite a fact.",
    },
    {
      name: "Visual state",
      owner: "RENDERER",
      facts: [
        "Conveyor phase and interpolation",
        "Selection, zoom and focus",
        "Accessible motion preferences",
      ],
      rule: "Animation cannot advance simulation time.",
    },
  ];
  const v = data[view];
  return (
    <div className={styles.instrument}>
      <div className={styles.tabs}>
        {data.map((d, i) => (
          <button
            key={d.name}
            aria-pressed={view === i}
            onClick={() => setView(i)}
          >
            {d.name}
          </button>
        ))}
      </div>
      <div className={styles.ownership}>
        <div className={styles.ownerSeal}>
          <span>SINGLE OWNER</span>
          <strong>{v.owner}</strong>
          <i>◇</i>
        </div>
        <div>
          <h3>{v.name}</h3>
          <ul>
            {v.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p>{v.rule}</p>
        </div>
      </div>
    </div>
  );
}
function Replay() {
  const [seed, setSeed] = useState(7);
  const plan: Doctrine[] = [
    "pressure",
    "pressure",
    "care",
    "pressure",
    "care",
    "pressure",
    "care",
    "pressure",
  ];
  const commands = plan.map((doctrine) => ({
    type: "resolve",
    doctrine,
    assignments: defaultAssignments,
  }));
  const state = replay(seed, commands);
  return (
    <div className={styles.instrument}>
      <div className={styles.instrumentLabel}>
        <span>REPLAY / ACTUAL KERNEL</span>
        <span>lf-teaching-1</span>
      </div>
      <div className={styles.replay}>
        <label>
          Seed
          <select
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value))}
          >
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={42}>42</option>
          </select>
        </label>
        <div className={styles.replayBars}>
          {state.events.map((e) => (
            <div key={e.id}>
              <span>{e.delta}</span>
              <i style={{ height: `${e.delta * 2}px` }} />
              <small>{e.shift}</small>
            </div>
          ))}
        </div>
        <div className={styles.replayTotal}>
          <span>8 SHIFTS / SAME POLICY</span>
          <strong>{state.total}</strong>
          <small>units · quota 240</small>
        </div>
      </div>
      <p className={styles.exhibitNote}>
        Pressure, pressure, care, pressure, care, pressure, care, pressure. A
        different seed changes disturbances. Selecting the same seed
        reconstructs exactly the same run.
      </p>
      <Link className={styles.primaryLink} href="/stepanoskin/loopforge/play">
        Try your own policy <span>↗</span>
      </Link>
    </div>
  );
}
