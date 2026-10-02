import { useState } from "react";
import { Choices, Readout, Scope, Wire, Node } from "./Controls";
import {
  brass,
  ember,
  teal,
  Halo,
  Person,
  Relic,
  Label,
  Plate,
} from "./Engraving";
import s from "../exhibits.module.css";

export function Checklist() {
  const [attendance, setAttendance] = useState([true, false, true, true]);
  const [policy, setPolicy] = useState(0);
  const [returned, setReturned] = useState(false);
  const completed = Math.min(
    4,
    attendance.filter(Boolean).length + (policy === 1 && returned ? 1 : 0),
  );
  const done = completed === 4;
  return (
    <>
      <p className={s.instruction}>
        Toy track: four sessions earn one reward. Toggle a week off, then change
        the availability rule.
      </p>
      <Choices
        label="Reward availability"
        items={["Expires after week 4", "Progress stays available"]}
        value={policy}
        onChange={(n) => {
          setPolicy(n);
          setReturned(false);
        }}
      />
      <div className={s.calendar}>
        {attendance.map((a, i) => (
          <button
            type="button"
            key={i}
            aria-pressed={a}
            aria-label={`Play during week ${i + 1}`}
            onClick={() => {
              setAttendance(attendance.map((x, j) => (j === i ? !x : x)));
              setReturned(false);
            }}
          >
            <small>WEEK 0{i + 1}</small>
            <strong>{a ? "✓" : "—"}</strong>
            <span>{a ? "Played" : "Away"}</span>
          </button>
        ))}
      </div>
      <div className={s.track}>
        <div
          className={s.trackFill}
          style={{ width: `${(completed / 4) * 100}%` }}
        />
        <strong>{completed} / 4 sessions</strong>
        <span>
          {done ? "REWARD READY" : policy ? "PROGRESS KEPT" : "WINDOW CLOSED"}
        </span>
      </div>
      {policy === 1 ? (
        <button
          className={s.lever}
          type="button"
          disabled={done || returned}
          onClick={() => setReturned(true)}
        >
          Play one return session →
        </button>
      ) : null}
      <Readout
        tag={
          done
            ? "THE GOAL IS COMPLETE"
            : policy
              ? "A RETURN PATH EXISTS"
              : "THE CLOCK SET THE LIMIT"
        }
      >
        {done
          ? "The same four-session requirement has been met."
          : policy
            ? "The remaining effort still exists, but the break did not erase access to the goal."
            : "The player’s unfinished progress cannot reach this reward after the window closes."}
      </Readout>
      <p className={s.footnote}>
        Hypothetical policies with identical effort and reward. This does not
        reproduce any named game’s complete pass rules.
      </p>
    </>
  );
}
export function Encounter() {
  const [v, set] = useState(0);
  return (
    <>
      <Choices
        label="Encounter constraint"
        items={["Open floor", "Hazard blocks retreat", "Cover blocks approach"]}
        value={v}
        onChange={set}
      />
      <Scope
        label={
          [
            "An open approach with space to retreat",
            "The same attack with a hazard behind the player",
            "The same attack with cover between player and enemy",
          ][v]
        }
      >
        <path d="M60 35H700V293H60Z" fill="#17282d" stroke={brass} />
        {Array.from({ length: 14 }, (_, i) => (
          <path
            key={i}
            d={`M${65 + i * 47} 35v258M60 ${36 + i * 24}h640`}
            stroke={brass}
            opacity=".07"
          />
        ))}
        <circle cx="283" cy="168" r="28" fill="#183e3f" stroke={teal} />
        <path d="M273 182l10 -31l10 31Z" fill={teal} />
        <Relic x={516} y={168} type="helm" s={0.5} tone={ember} />
        <path
          d={v === 2 ? "M308 158Q370 16 487 142" : "M310 166H479"}
          stroke={ember}
          strokeWidth="4"
          fill="none"
          strokeDasharray="5 6"
        />
        {v === 1 ? (
          <>
            <path d="M110 72H232V248H110Z" fill="#682e23" stroke={ember} />
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M113 ${92 + i * 40}l117 -16`}
                stroke={ember}
                opacity=".5"
              />
            ))}
          </>
        ) : null}
        {v === 2 ? <Plate x={370} y={94} w={61} h={146} /> : null}
        <path
          d={v === 1 ? "M282 192V258H386" : "M266 193L174 247"}
          stroke={teal}
          strokeWidth="3"
          fill="none"
        />
        <Label x={280} y={125} size={14} tone={teal}>
          YOU
        </Label>
        <Label x={516} y={122} size={14}>
          THREAT
        </Label>
        <Label x={381} y={325} size={15}>
          TEAL: MOVEMENT OPTION · EMBER: ATTACK APPROACH
        </Label>
      </Scope>
      <Readout tag="THE ATTACK INPUT STAYS THE SAME">
        {
          [
            "Distance and timing are the immediate problem. The floor leaves room to withdraw.",
            "The retreat route becomes costly. Lateral movement matters before the next attack.",
            "The direct line is closed. Position must change before the same attack becomes useful.",
          ][v]
        }
      </Readout>
      <p className={s.footnote}>
        Invented encounter sketches. They illustrate how constraints change
        decisions, without claiming these are exact Diablo II or IV mechanics.
      </p>
    </>
  );
}
export function Access() {
  const [owned, setOwned] = useState(false);
  const [effort, setEffort] = useState(false);
  return (
    <>
      <div className={s.gates}>
        <div data-open={owned}>
          <span className={s.gateMark}>{owned ? "◇" : "▥"}</span>
          <h3>Ownership gate</h3>
          <p>A purchase can grant access.</p>
          <button
            type="button"
            onClick={() => {
              setOwned(!owned);
            }}
          >
            {owned ? "Reset ownership" : "Simulate purchase"}
          </button>
        </div>
        <span className={s.gateArrow} aria-hidden="true">
          →
        </span>
        <div data-open={effort}>
          <span className={s.gateMark}>{effort ? "✦" : "▥"}</span>
          <h3>Play requirement</h3>
          <p>Access can still leave work to do.</p>
          <button
            type="button"
            disabled={effort}
            onClick={() => setEffort(true)}
          >
            {effort ? "Requirement completed" : "Complete the requirement"}
          </button>
        </div>
      </div>
      <Readout
        tag={
          owned && effort
            ? "BOTH CONDITIONS MET"
            : effort
              ? "READY BEFORE PURCHASE"
              : owned
                ? "THE DOOR IS OPEN"
                : "BEFORE PAYMENT"
        }
      >
        {owned && effort
          ? "The outcome is available: ownership and readiness are both satisfied."
          : effort
            ? "The character is ready. Ownership is still a separate condition."
            : owned
              ? "The entitlement changed. The unfinished requirement did not."
              : "Read what the purchase grants, what it requires, and what remains afterward."}
      </Readout>
      <p className={s.footnote}>
        A conceptual model. Meet the requirements in either order; the outcome
        needs both. No purchase occurs here.
      </p>
    </>
  );
}
export function Wardrobe() {
  const [v, set] = useState(0);
  const [m, setM] = useState(0);
  return (
    <>
      <Choices
        label="Choose an original armor style"
        items={["Warden", "Wayfarer", "Ash-bearer"]}
        value={v}
        onChange={set}
      />
      <div className={s.wardrobe}>
        <svg
          viewBox="0 0 340 320"
          role="img"
          aria-label={`${["Warden", "Wayfarer", "Ash-bearer"][v]} appearance; mechanical power unchanged`}
        >
          <Halo x={170} y={154} r={120} tone={[brass, teal, ember][v]} />
          <Person x={170} y={155} s={1.8} tone={[brass, teal, ember][v]} />
          <Relic
            x={170}
            y={132}
            s={0.7}
            type="helm"
            tone={[brass, teal, ember][v]}
          />
          {v === 1 ? (
            <path
              d="M125 168L87 262L151 244M215 168L253 262L189 244"
              fill="#315c5a"
              stroke={teal}
            />
          ) : v === 2 ? (
            <path
              d="M121 171L83 138L95 196M219 171L257 138L245 196"
              fill="#5d352d"
              stroke={ember}
              strokeWidth="3"
            />
          ) : null}
        </svg>
        <div>
          <small>MECHANICAL BASELINE</small>
          <strong className={s.fixedPower}>UNCHANGED</strong>
          <div className={s.equalBars}>
            {["Damage", "Defense", "Movement"].map((n) => (
              <div key={n}>
                <span>{n}</span>
                <i />
              </div>
            ))}
          </div>
          <p>Invented appearances. No numerical game stats are implied.</p>
        </div>
      </div>
      <Choices
        label="A reason to value appearance"
        items={["Expression", "Fantasy", "Collection", "Social meaning"]}
        value={m}
        onChange={setM}
      />
      <Readout tag="APPEARANCE STILL HAS VALUE">
        {
          [
            "This matches how I want to present myself.",
            "This makes the character feel like the person I imagine.",
            "This belongs in a collection I care about.",
            "This says something in a place where others can see me.",
          ][m]
        }{" "}
        <strong>“Cosmetic” describes mechanical scope.</strong>
      </Readout>
    </>
  );
}
export function Routes() {
  const [v, set] = useState(0);
  const paths = [
    [
      "Play / craft",
      "Gather materials",
      "Meet prerequisites",
      "Craft / wait",
      "Which effort is enjoyable? Which part is friction?",
    ],
    [
      "Purchase",
      "Obtain currency",
      "Check eligibility",
      "Acquire the offer",
      "What does payment skip, and what requirements remain?",
    ],
    [
      "Trade",
      "Find a counterpart",
      "Agree on an eligible exchange",
      "Complete the trade",
      "Is the item tradable? What access and market constraints apply?",
    ],
  ];
  return (
    <>
      <Choices
        label="Acquisition route"
        items={["Play / craft", "Purchase", "Trade"]}
        value={v}
        onChange={set}
      />
      <div className={s.routes}>
        {paths.map((p, i) => (
          <div key={p[0]} data-active={v === i}>
            <h3>{p[0]}</h3>
            <ol>
              {p.slice(1, 4).map((n, j) => (
                <li key={n}>
                  <span>0{j + 1}</span>
                  {n}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <Readout tag="INSPECT THE SELECTED ROUTE">{paths[v][4]}</Readout>
      <p className={s.footnote}>
        A route-comparison framework. Actual conditions differ by game, item and
        account; no universal free or paid route is assumed.
      </p>
    </>
  );
}
export function Market() {
  const [v, set] = useState(0);
  return (
    <>
      <Choices
        label="Follow an acquisition route"
        items={["Through the encounter", "Through the market"]}
        value={v}
        onChange={set}
      />
      <Scope
        label={`One imagined item acquired ${v ? "through search and exchange" : "through play and an uncertain result"}`}
      >
        <Wire d="M165 75H420L577 170" active={v === 0} />
        <Wire d="M165 265H420L577 170" active={v === 1} />
        <Node
          x={167}
          y={75}
          label="ENCOUNTER"
          sub="act / adapt"
          active={v === 0}
        />
        <Node
          x={396}
          y={75}
          label="LOOT RESULT"
          sub="uncertain outcome"
          active={v === 0}
        />
        <Node
          x={167}
          y={265}
          label="MARKET SEARCH"
          sub="find an available item"
          active={v === 1}
        />
        <Node
          x={396}
          y={265}
          label="EXCHANGE"
          sub="meet transaction terms"
          active={v === 1}
        />
        <Halo x={626} y={170} r={68} />
        <Relic x={626} y={169} s={0.72} />
        <Label x={627} y={275} size={14}>
          SAME IMAGINED ITEM
        </Label>
      </Scope>
      <Readout tag="WHAT ACTIVITY DOES THE ITEM REWARD?">
        {v
          ? "Search and exchange can compete with the encounter as the most useful acquisition activity."
          : "The desired item gives a reason to face the encounter and its uncertain result."}
      </Readout>
      <p className={s.footnote}>
        The Diablo III auction-house argument concerns competing acquisition
        routes. This exhibit makes no claim about manipulated drop rates.
      </p>
    </>
  );
}
export function Vault() {
  const [access, setAccess] = useState(false);
  const [held, setHeld] = useState(0);
  const [earned, setEarned] = useState(0);
  const [claims, setClaims] = useState(0);
  function earn() {
    const gained = Math.min(25, 99 - held);
    setHeld(held + gained);
    setEarned(earned + gained);
  }
  return (
    <>
      <p className={s.instruction}>
        Fill, claim, refill. This model earns up to 25 tokens at a time and
        spends 30 per reward. Both amounts are invented.
      </p>
      <div className={s.vault}>
        <div>
          <span className={s.keyNumber}>I</span>
          <h3>Catalog access</h3>
          <p>{access ? "First key present." : "A separate entitlement."}</p>
          <button
            type="button"
            aria-pressed={access}
            onClick={() => setAccess(!access)}
          >
            {access ? "Remove access key" : "Simulate catalog unlock"}
          </button>
        </div>
        <div className={s.vaultCenter} data-open={access && held >= 30}>
          <span aria-hidden="true">{access && held >= 30 ? "◇" : "▥"}</span>
          <strong>{claims} claimed</strong>
          <button
            type="button"
            disabled={!access || held < 30}
            onClick={() => {
              setHeld(held - 30);
              setClaims(claims + 1);
            }}
          >
            Claim for 30 Favor
          </button>
        </div>
        <div>
          <span className={s.keyNumber}>II</span>
          <h3>Earned Favor</h3>
          <div
            className={s.reservoir}
            role="meter"
            aria-label="Favor held"
            aria-valuemin={0}
            aria-valuemax={99}
            aria-valuenow={held}
          >
            <i style={{ height: `${(held / 99) * 100}%` }} />
            <strong>{held} / 99</strong>
          </div>
          <button type="button" disabled={held === 99} onClick={earn}>
            Earn up to 25 Favor
          </button>
        </div>
      </div>
      <Readout tag="HELD IS NOT LIFETIME">
        <strong>
          {held} Favor held · {earned} earned in this model · {claims * 30}{" "}
          spent.
        </strong>{" "}
        {held === 99
          ? "The reservoir is full. Spend to create room for more."
          : access
            ? "A claim needs sufficient Favor as well as the access key."
            : "Favor alone does not open this paid catalog."}
      </Readout>
      <button
        type="button"
        className={s.reset}
        onClick={() => {
          setAccess(false);
          setHeld(0);
          setEarned(0);
          setClaims(0);
        }}
      >
        Reset the model ↶
      </button>
    </>
  );
}
const terms = [
  ["Ownership", "Catalog access, not a finished reward."],
  ["Effort", "Earn and spend a separate claim resource."],
  ["Availability", "Read when this catalog closes."],
  ["Cash & balance", "Check pack cost, item cost and tokens left over."],
];
export function Disclosure() {
  const [v, set] = useState(0);
  return (
    <>
      <Choices
        label="Offer presentation"
        items={["Scattered surfaces", "One complete decision"]}
        value={v}
        onChange={set}
      />
      <div className={s.disclosure} data-gathered={v === 1}>
        <div className={s.reward}>
          <span aria-hidden="true">✦</span>
          <h3>The desired reward</h3>
          <p>
            {v
              ? "Read the whole commitment here."
              : "The reward gets the spotlight."}
          </p>
        </div>
        {terms.map(([t, d], i) => (
          <div className={s.term} key={t}>
            <span>0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
            <small>{v ? "SAME DECISION" : `SURFACE ${i + 1}`}</small>
          </div>
        ))}
      </div>
      <Readout tag="THE FACTS DID NOT CHANGE">
        {v
          ? "The conditions now sit together. Ask the player to explain the commitment in their own words."
          : "The reader has to assemble a contract from several places. The complete commitment is harder to see at once."}
      </Readout>
      <p className={s.footnote}>
        A schematic comprehension comparison. No measured increase in spending
        or understanding is claimed.
      </p>
    </>
  );
}
const evidence = [
  [
    "Behavior",
    "A return was observed.",
    "Why the person returned.",
    "Visits, sessions and choices can establish what happened.",
  ],
  [
    "Experience",
    "The owner described an unengaging return.",
    "How every other player felt.",
    "Ask what felt meaningful, confusing, welcome or unwanted.",
  ],
  [
    "Business",
    "This case provides no business result.",
    "Revenue, profit or long-term value.",
    "Use appropriate financial and operating evidence.",
  ],
  [
    "Causality",
    "A single return cannot isolate a cause.",
    "Whether a design change caused the reaction.",
    "Use a suitable comparison and consider alternative explanations.",
  ],
];
export function Evidence() {
  const [v, set] = useState(0);
  return (
    <>
      <Choices
        label="Evidence lens"
        items={evidence.map((e) => e[0])}
        value={v}
        onChange={set}
      />
      <div className={s.evidenceBench}>
        <div className={s.lensDial}>
          <span>{String(v + 1).padStart(2, "0")}</span>
          <h3>{evidence[v][0]}</h3>
          <p>{evidence[v][3]}</p>
        </div>
        <div className={s.evidencePair}>
          <div>
            <small>THIS CASE CAN SUPPORT</small>
            <p>{evidence[v][1]}</p>
          </div>
          <div>
            <small>THIS CASE CANNOT ESTABLISH</small>
            <p>{evidence[v][2]}</p>
          </div>
        </div>
      </div>
      <Readout tag="DIFFERENT INSTRUMENTS, DIFFERENT QUESTIONS">
        The returning-player account is one case. Combining evidence means
        respecting what each source can—and cannot—tell us.
      </Readout>
    </>
  );
}
