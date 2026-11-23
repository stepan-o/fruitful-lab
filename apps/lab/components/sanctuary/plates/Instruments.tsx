import { useState } from "react";
import { Choices, Readout, Scope, Wire, Node } from "./Controls";
import { brass, teal, Relic, Label, Gear } from "./Engraving";
import s from "../exhibits.module.css";

const promises = [
  [
    "Baldur’s Gate 3",
    "Party & choices",
    "Base game; no microtransactions in Larian’s stated offer.",
    "An authored campaign can end; choices give reasons to return.",
  ],
  [
    "Elden Ring",
    "Exploration & mastery",
    "Base game plus Shadow of the Erdtree.",
    "Combat and build mastery can outlast an ending.",
  ],
  [
    "Expedition 33",
    "Authored expedition",
    "Premium RPG; no financial estimate is inferred here.",
    "A campaign is the organizing promise.",
  ],
  [
    "The Witcher 3",
    "Quests & consequences",
    "The 2022 Complete Edition includes two story expansions.",
    "Completion and continued exploration can coexist.",
  ],
  [
    "Cyberpunk 2077",
    "An authored city",
    "Phantom Liberty is a separately produced expansion.",
    "Additional authored content can extend a journey.",
  ],
  [
    "Diablo IV",
    "Campaign & repeatable progression",
    "Base game, expansions, shop and seasonal catalogs.",
    "A campaign ending sits beside continuing progression.",
  ],
];
export function PromiseAtlas() {
  const [v, set] = useState(0);
  return (
    <>
      <Choices
        label="Compare the promise"
        items={[
          "Design emphasis",
          "Commercial structure",
          "What completion means",
        ]}
        value={v}
        onChange={set}
      />
      <div className={s.atlas}>
        {promises.map(([name, ...facts], i) => (
          <div className={s.atlasCell} key={name}>
            <span className={s.serial}>0{i + 1}</span>
            <div className={s.atlasGlyph} aria-hidden="true">
              {["♧", "♛", "✦", "⚔", "▥", "◇"][i]}
            </div>
            <h3>{name}</h3>
            <p>{facts[v]}</p>
          </div>
        ))}
      </div>
      <Readout tag="COMPARE STRUCTURES">
        Six cases, not a ranking of success. A similar genre can contain very
        different promises.
      </Readout>
    </>
  );
}
export function Transfer() {
  const [ended, set] = useState(false);
  return (
    <>
      <button className={s.lever} type="button" onClick={() => set(!ended)}>
        {ended ? "Rewind the transition ↶" : "End the season →"}
      </button>
      <div className={s.persistence}>
        <span>PLAYER KNOWLEDGE</span>
        <span>PRACTICED SKILL</span>
        <span>ACCOUNT ENTITLEMENTS</span>
        <strong>Persist on their own terms</strong>
      </div>
      <div className={s.realmMachine} data-ended={ended}>
        <div>
          <h3>Seasonal</h3>
          <p>
            {ended
              ? "A fresh seasonal start can follow."
              : "The character plays here."}
          </p>
        </div>
        <div>
          <h3>Eternal</h3>
          <p>
            {ended
              ? "The existing character continues here."
              : "The destination for this character."}
          </p>
        </div>
        <div className={s.traveler}>
          <span aria-hidden="true">♟</span>Existing character
        </div>
      </div>
      <Readout tag={ended ? "TRANSFER COMPLETE" : "BEFORE THE TRANSFER"}>
        {ended
          ? "The character changed realms. It was not erased. A new seasonal character is a separate start."
          : "The player, the account and this character are different places to store progress."}
      </Readout>
    </>
  );
}
export function Histories() {
  const [v, set] = useState(0);
  const names = ["All arrangements", "Paid participation", "A purchased copy", "An additional offer", "Advertising"];
  const examples = [
    { year:"1985", name:"Gauntlet", desc:"A coin buys a resource consumed by continued play.", kind:1 },
    { year:"2000", name:"Diablo II", desc:"The same purchase covers another attempt, class or playthrough.", kind:2 },
    { year:"2011", name:"Team Fortress 2", desc:"Free entry sits alongside an item economy.", kind:3 },
    { year:"2013", name:"Dota 2", desc:"A tournament companion gives existing players another offer.", kind:3 },
    { year:"2015 talk", name:"Crossy Road", desc:"Optional rewarded video brings an advertiser into the exchange.", kind:4 },
  ];
  return <>
    <Choices label="Highlight a payment relationship" items={names} value={v} onChange={set}/>
    <div className={s.history}>{examples.map(example=><div key={example.name} data-dim={v !== 0 && v !== example.kind}>
      <time>{example.year}</time><div><h3>{example.name}</h3><p>{example.desc}</p></div><span aria-hidden="true">●</span>
    </div>)}</div>
    <p className={s.footnote}>Selected historical examples, not invention dates. These arrangements coexist and can be combined in one game.</p>
  </>;
}
export function ConcordTimeline() {
  return <>
    <div className={s.timeline}>
      <div><time>23 AUG 2024</time><span className={s.timelineDot}/><h3>Release</h3><p>A US $39.99 standard edition, with continuing additions promised.</p></div>
      <div><time>06 SEP 2024</time><span className={s.timelineDot}/><h3>Offline</h3><p>Sales stopped and refunds offered in the 3 September notice.</p></div>
      <div><time>29 OCT 2024</time><span className={s.timelineDot}/><h3>Studio closure</h3><p>Sony permanently ends the game and closes Firewalk.</p></div>
    </div>
    <p className={s.footnote}>Fourteen days from standard launch to shutdown. These dated events describe the collapse of the continuing offer; they do not establish a budget, sales total or single cause.</p>
  </>;
}
export function Probe() {
  const [v, set] = useState(0);
  const p = [
    [
      "Can the clue be read?",
      "One room, one signal",
      "What did the player notice?",
      "Revise the signal before building more rooms.",
    ],
    [
      "Does combat offer a choice?",
      "One enemy, two viable responses",
      "Which information changes the response?",
      "Revise the constraint before adding enemies.",
    ],
    [
      "Is the offer understandable?",
      "One complete purchase path",
      "Can the player explain cost and remaining effort?",
      "Rewrite the offer before scaling its catalog.",
    ],
  ];
  return (
    <>
      <Choices
        label="Choose an uncertainty"
        items={["Clue readability", "Combat choice", "Offer comprehension"]}
        value={v}
        onChange={set}
      />
      <div className={s.probe}>
        <div className={s.probeDial}>
          <span aria-hidden="true">⌖</span>
          <small>ONE UNKNOWN</small>
          <h3>{p[v][0]}</h3>
        </div>
        <ol>
          {["Build", "Observe", "Decide"].map((label, i) => (
            <li key={label}>
              <span>
                0{i + 1} / {label}
              </span>
              <p>{p[v][i + 1]}</p>
            </li>
          ))}
        </ol>
      </div>
      <Readout tag="ILLUSTRATIVE PROTOTYPE">
        A probe earns its keep when its result can change the next commitment.
      </Readout>
    </>
  );
}
export function Furnace() {
  const [v, set] = useState(0);
  return (
    <>
      <Choices
        label="Trace the obligation"
        items={["Player promise", "Funding", "Operations", "New content"]}
        value={v}
        onChange={set}
      />
      <Scope label="Player value supports revenue; revenue funds operations and new content; those must return value to players.">
        <Wire d="M212 75H549V265H211V75" />
        <Node x={212} y={75} label="PLAYER VALUE" active={v === 0} />
        <Node x={549} y={75} label="REVENUE" active={v === 1} />
        <Node x={549} y={265} label="OPERATIONS" active={v === 2} />
        <Node x={212} y={265} label="NEW CONTENT" active={v === 3} />
        <Gear x={380} y={172} r={52} tone={v === 1 ? brass : teal} />
        <Relic type="flame" x={380} y={170} s={0.38} />
      </Scope>
      <Readout tag="FOLLOW THE OBLIGATION">
        {
          [
            "The return must remain worth making. A recurring offer promises recurring usefulness.",
            "Revenue can fund the promise. A receipt alone does not prove that the promise was fulfilled.",
            "Availability, maintenance and support are work even when no new item appears.",
            "More content matters only if it adds something the intended players value.",
          ][v]
        }
      </Readout>
    </>
  );
}
export function Motivation() {
  const [v, set] = useState(0);
  return (
    <>
      <p className={s.instruction}>
        One observed event: “the player returned to the dungeon.” Look through
        each lens.
      </p>
      <div className={s.lenses}>
        {["Autonomy", "Competence", "Relatedness"].map((n, i) => (
          <button
            type="button"
            aria-pressed={i === v}
            onClick={() => set(i)}
            key={n}
          >
            <span aria-hidden="true">{["↗", "◎", "♧"][i]}</span>
            <strong>{n}</strong>
          </button>
        ))}
      </div>
      <Readout
        tag={
          [
            "I ENDORSE THIS CHOICE",
            "I CAN AFFECT THE OUTCOME",
            "I FEEL CONNECTED",
          ][v]
        }
      >
        {
          [
            "Did I return because this is the route I want—or because another route feels closed?",
            "Did the encounter let me learn, read feedback and improve—or just repeat?",
            "Did I return for people who matter to me—or log in while feeling alone?",
          ][v]
        }
      </Readout>
      <div className={s.eventStrip}>
        <span>RETURN EVENT: THE SAME</span>
        <span>EXPERIENCE: STILL UNKNOWN</span>
      </div>
      <p className={s.footnote}>
        Questions informed by self-determination theory, not a diagnostic score.
        Motives can overlap and change with context.
      </p>
    </>
  );
}
export function Meaning() {
  const [v, set] = useState(0);
  return (
    <>
      <Choices
        label="Reading of the system"
        items={["Read the counter", "Read the experience"]}
        value={v}
        onChange={set}
      />
      <div className={s.meaning}>
        <div className={s.counter} data-dim={v === 1}>
          <small>VISIBLE REWARD SIGNAL</small>
          <strong>+ + +</strong>
          <span>Something was counted.</span>
        </div>
        <div className={s.reflection} data-dim={v === 0}>
          <span>INPUT → RULE → FEEDBACK</span>
          <h3>What does performing the ritual mean?</h3>
          <p>
            The framing may invite belief, doubt, discomfort or another reading.
          </p>
        </div>
      </div>
      <Readout tag="CLOSE READING">
        {v
          ? "Interpretation belongs to the player’s encounter with the work. A number cannot settle it."
          : "A visible tally establishes feedback. It does not establish the work’s ultimate purpose."}
      </Readout>
    </>
  );
}
export function NestedLoops() {
  const [v, set] = useState(0);
  const labels = ["Moment", "Encounter", "Session", "Longer project"];
  return (
    <>
      <Choices
        label="Inspect a timescale"
        items={labels}
        value={v}
        onChange={set}
      />
      <Scope
        label={`${labels[v]} inside nested play timescales. Rules affect behaviour; behaviour creates experience.`}
      >
        {[145, 112, 79, 46].map((r, i) => (
          <g key={r}>
            <circle
              cx="220"
              cy="169"
              r={r}
              fill={v === 3 - i ? "#293e3e" : "#101d21"}
              stroke={v === 3 - i ? teal : "#4b5951"}
              strokeWidth={v === 3 - i ? 3 : 1}
            />
            <path
              d={`M${220 + r} 169H465`}
              fill="none"
              stroke={v === 3 - i ? teal : "transparent"}
              strokeDasharray="3 6"
            />
          </g>
        ))}
        <Relic x={220} y={169} s={0.36} tone={teal} />
        <Node
          x={558}
          y={100}
          label="RULE"
          sub={
            [
              "A timed defense",
              "A limited escape route",
              "A choice of objectives",
              "A build with tradeoffs",
            ][v]
          }
        />
        <Wire d="M558 132V165" />
        <Node
          x={558}
          y={198}
          label="BEHAVIOUR"
          sub={
            [
              "Read and react",
              "Reposition",
              "Choose a route",
              "Revise the build",
            ][v]
          }
        />
        <Label x={559} y={284} tone={teal}>
          EXPERIENCE IS INTERPRETED
        </Label>
      </Scope>
      <Readout tag={labels[v].toUpperCase()}>
        {
          [
            "A split-second action needs readable information and a meaningful response.",
            "Several actions form a problem with changing constraints.",
            "The player chooses what can fit into this visit.",
            "A longer commitment might be learning, building, belonging—or finishing.",
          ][v]
        }
      </Readout>
    </>
  );
}
