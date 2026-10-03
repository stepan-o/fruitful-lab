import { useState } from "react";
import { Choices, Readout } from "./Controls";
import { brass, teal, Gear } from "./Engraving";
import s from "../exhibits.module.css";
import f from "./funding.module.css";

const models = [
  {
    label: "A substantial release",
    period: "BALDUR’S GATE 3 · THE BASE ADVENTURE",
    title: "One sale can contain years of play.",
    buyer: "A new buyer",
    sale: "An adventure with many possibilities",
    work: "Build a release worth buying",
    task: "Characters, places and decisions that hold together across different playthroughs.",
    play: "Every run is included",
    value: "Another character or choice explores further possibilities in the adventure already purchased.",
    return: "Another copy can sell to a new player. Replaying the purchased adventure does not require another sale.",
    pressure: "Depth can keep a release appealing to new buyers long after launch. Its value need not be exhausted by its first playthrough.",
  },
  {
    label: "An expansion",
    period: "DIABLO IV · AN ADDITIONAL ADVENTURE",
    title: "A new purchase adds to what you own.",
    buyer: "An existing owner",
    sale: "A substantial addition",
    work: "Make the addition worth its price",
    task: "Additional places, adventures and character possibilities, with a stated scope and access requirements.",
    play: "More journey, more builds",
    value: "New material extends the game; its purchase is separate from choosing to buy a cosmetic or join a season.",
    return: "An owner buys the expansion once. Playing another expansion character does not mean buying it again.",
    pressure: "The studio needs a convincing new package. An expansion can deepen replayability as well as continue the story.",
  },
  {
    label: "Ongoing offers",
    period: "DIABLO IV · AUGUST 2022 DESIGN PLAN",
    title: "Further offers accompany ongoing play.",
    buyer: "A player choosing an extra",
    sale: "Optional cosmetics and reward tracks",
    work: "Support a continuing program",
    task: "A dedicated seasonal team, recurring updates, and additional items and rewards to sell.",
    play: "Play continues; buying is optional",
    value: "The announced model lets players join seasons without shopping. Optional purchases add cosmetics and premium rewards.",
    return: "An existing player may buy again during play. Game and expansion sales still sit alongside these offers.",
    pressure: "The studio must keep both the game and its next offer appealing. Update cadence and purchase opportunities become part of the same product plan.",
  },
];

/** Original engraved symbols; no image requests, timers or animation loops. */
function FundingGlyph({ kind, model }: { kind: "sale" | "work" | "play"; model: number }) {
  const tone = kind === "play" ? teal : brass;
  return (
    <svg className={f.glyph} viewBox="0 0 240 165" aria-hidden="true" focusable="false">
      <ellipse cx="120" cy="146" rx="91" ry="9" fill="#040c10" />
      <circle cx="120" cy="79" r="64" fill="none" stroke={tone} opacity=".16" />
      <circle cx="120" cy="79" r="59" fill="none" stroke={tone} strokeDasharray="1 8" opacity=".4" />
      {kind === "sale" ? (
        <g stroke={tone} strokeLinejoin="round">
          <path d="M76 42 133 24 165 43 165 128 109 147 76 127Z" fill="#142126" strokeWidth="1.6" />
          <path d="M76 42 109 60 165 43M109 60V147M115 66 158 53V122L115 137Z" fill="none" />
          <path d="M82 52 101 62V132L82 121Z" fill="#223235" opacity=".6" />
          <path d="M123 122V97Q136 74 150 89V112M119 120 154 108M125 125 148 118" fill="none" strokeWidth="2" />
          <path d="M131 116V99Q137 89 143 94V112" fill="#cfaf74" opacity=".55" />
          {[0, 1, 2, 3].map(i => <path key={i} d={`M83 ${68+i*12}l17 9`} opacity=".3" />)}
          {model === 1 ? <path d="M147 62 183 52 202 63V132L168 142 147 130Z M147 62 168 73 202 63M168 73V142M174 85 195 79M174 93 195 87M174 121 195 115" fill="#213431" /> : null}
          <g transform={model === 1 ? "translate(-14 0)" : undefined}>
            <ellipse cx="69" cy="130" rx="22" ry="8" fill="#52442d" />
            <path d="M47 118v12M91 118v12" />
            <ellipse cx="69" cy="118" rx="22" ry="8" fill="#78613b" />
            <path d="M52 126q17 7 34 0M52 131q17 7 34 0" fill="none" opacity=".7" />
            <path d="M69 114 76 118 69 122 62 118Z" fill="#e4cc96" stroke="none" />
          </g>
          {model === 2 ? [0, 1, 2].map(i => <g key={i} transform={`translate(${175+i*13} ${84-i*16})`}><circle r="10" fill="#4a3a28" /><path d="M0-5 4 0 0 5-4 0Z" fill="#c2a46b" stroke="none" /></g>) : null}
        </g>
      ) : kind === "work" ? (
        <g stroke={tone} strokeLinejoin="round">
          <path d="M57 136V79L119 45 183 79V136Z" fill="#162428" />
          <path d="M45 81 119 36 195 81 175 78 119 48 65 78Z" fill="#3f493d" />
          <path d="M162 56V24h13v39M159 24h19v-6h-19Z" fill="#253632" />
          <path d="M82 136V96q0-36 37-36t37 36v40Z" fill="#071115" />
          <path d="M93 136V98q0-27 26-27t26 27v38" fill="#e48a45" opacity=".15" />
          <path d="M102 135v-29q0-22 17-22t17 22v29" fill="#dba96a" opacity=".25" />
          <path d="M87 142H151M74 148H168M67 93h10m-10 10h10m85-10h12m-12 10h12M100 57v12m18-18v11m18-4v12" fill="none" />
          <path d="M101 107h37l-8 8h-19Z M115 115v17m-8 0h24" fill="#6d634d" />
          <Gear x={174} y={115} r={20} tone={tone}/>
          <path d="M42 133h24v8H42Z" fill="#56604e" />
          {model === 2 ? <path d="M95 18q21-13 45 0m-9-7 9 7-12 2M145 34q-22 12-43-1m9 8-9-8 12-1" fill="none" stroke={teal}/> : null}
        </g>
      ) : (
        <g stroke={tone} strokeLinejoin="round">
          <path d="M31 130 67 89 86 107 121 39 155 88 171 71 212 132Z" fill="#182c2c" />
          <path d="M83 111 121 39 130 81 154 110M110 69 121 62 134 76M42 131 63 112 70 120 83 109M166 101 172 83 197 122" fill="none" opacity=".6" />
          <path d="M109 146C150 127 79 122 117 101L136 87" fill="none" stroke="#bca679" strokeWidth="4" />
          <path d="M133 96V74q0-13 11-13t11 13v19M129 97l30-4M129 75l31-3" fill="#152020" stroke={brass} />
          <path d="M140 94V76q4-9 8-1v18" stroke="#edcc85" strokeWidth="3" />
          <path d="M46 134H201M58 142H93m51 0h46" opacity=".35" />
          <path d="M43 91C19 151 215 165 209 100M202 106l7-6 5 10" fill="none" strokeDasharray="3 4" />
          {[0, 1, 2].map(i => <g key={i} transform={`translate(${65+i*46} ${131+(i%2)*7})`}><circle cy="-8" r="2.5" fill="#d3dec4" stroke="none"/><path d="M0-5-3 3H4L1-5Z" fill="#8cb7a0" stroke="none"/></g>)}
          {model === 2 ? [0, 1, 2].map(i => <path key={i} d={`M${58+i*61} ${75-i%2*34}l6 7-6 7-6-7Z`} fill="#87bdae" />) : null}
        </g>
      )}
    </svg>
  );
}

export default function FundingDiagram() {
  const [selected, setSelected] = useState(0);
  const model = models[selected];
  return (
    <figure className={s.exhibit} aria-label="Commercial model: Where the next sale comes from">
      <div className={s.kicker}><span>EXHIBIT 01 · THE COMMERCIAL LAYER</span><span>COMPARE THREE OFFERS</span></div>
      <h2>Where the next sale comes from</h2>
      <div className={s.instrument}>
        <p className={s.instruction}>Keep replayability in view. Change what the business sells.</p>
        <Choices label="Compare commercial models" items={models.map(model => model.label)} value={selected} onChange={setSelected}/>
        <div className={f.headline}><span>{model.period}</span><h3>{model.title}</h3></div>
        <div className={f.flow}>
          <section>
            <div className={f.number}>01 / THE SALE</div>
            <FundingGlyph kind="sale" model={selected}/>
            <small>{model.buyer}</small><h4>{model.sale}</h4>
          </section>
          <section>
            <div className={f.number}>02 / THE WORK</div>
            <FundingGlyph kind="work" model={selected}/>
            <h4>{model.work}</h4><p>{model.task}</p>
          </section>
          <section>
            <div className={f.number}>03 / THE PLAY</div>
            <FundingGlyph kind="play" model={selected}/>
            <h4>{model.play}</h4><p>{model.value}</p>
          </section>
        </div>
        <div className={f.return}><span aria-hidden="true">↳</span><p>{model.return}</p></div>
        <Readout tag="DESIGN PRESSURE · OUR INTERPRETATION">{model.pressure}</Readout>
      </div>
      <figcaption>Sales recoup development costs and can fund further work. Each offer creates different demands on what the studio builds next. These commercial structures can coexist; the ongoing-offers example uses Diablo IV’s announced 2022 model.</figcaption>
    </figure>
  );
}
