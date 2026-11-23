"use client";

import { useId, useState } from "react";
import Link from "next/link";
import example from "@/lib/sanctuary/loopforge-example.json";
import { useLivingPlate } from "./plates/useLivingPlate";
import styles from "./world-workshop.module.css";

type Policy = "care" | "pressure";
const voices = {
  care: { name: "Rivet Witch", lines: ["Twenty-one units, and strain back at zero. We can work with that.", "Call it a slower shift if you like. I prefer a factory with room to breathe."] },
  pressure: { name: "Stiletto", lines: ["Thirty-six units. The strain rose, but the quota did not meet itself.", "You asked for output. I delivered. Someone else can admire the strain gauge."] },
};

function Gear({ x, y, radius, reverse = false }: { x: number; y: number; radius: number; reverse?: boolean }) {
  return <g transform={`translate(${x} ${y})`}><g className={reverse ? styles.reverseGear : styles.gear}>
    {Array.from({ length: 16 }, (_, i) => <path key={i} transform={`rotate(${i * 22.5})`} d={`M-5 ${-radius - 6}H5L7 ${-radius + 6}H-7Z`} fill="#9e8151" stroke="#292622" strokeWidth="1.3" />)}
    <circle r={radius} fill="#342f28" stroke="#c5a66f" strokeWidth="2" />
    <circle r={radius - 6} fill="#101c1e" stroke="#756343" />
    {[0, 60, 120, 180, 240, 300].map(a => <path key={a} transform={`rotate(${a})`} d={`M-3 -8L-4 ${-radius + 10}H4L3 -8Z`} fill="#8a734b" />)}
    <circle r="9" fill="#b39158" stroke="#e1c792" /><circle r="3" fill="#171b1b" />
  </g></g>;
}

function Machine({ part, pressure, id }: { part: "engine" | "record" | "voice"; pressure: boolean; id: string }) {
  return <svg viewBox="0 0 260 186" role="img" aria-label={part === "engine" ? "Meshed brass gears inside a bolted simulation housing" : part === "record" ? "A mechanical recorder prints a fixed account of the shift" : "An original robot bust beside its account of the shift"}>
    <defs>
      <linearGradient id={`${id}-${part}-metal`} x2=".8" y2="1"><stop stopColor="#776343"/><stop offset=".45" stopColor="#2c302c"/><stop offset="1" stopColor="#0e181b"/></linearGradient>
      <linearGradient id={`${id}-${part}-glass`} x2="0" y2="1"><stop stopColor="#23535b"/><stop offset="1" stopColor="#071012"/></linearGradient>
    </defs>
    <ellipse cx="130" cy="171" rx="100" ry="9" fill="#000" opacity=".6"/>
    <path d="M27 151H233L218 169H43Z" fill="#1c2424" stroke="#655a40"/>
    {part === "engine" ? <>
      <path d="M38 144V37L53 24H207L222 37V144Z" fill={`url(#${id}-${part}-metal)`} stroke="#b79c68"/>
      <rect x="50" y="38" width="160" height="95" rx="7" fill={`url(#${id}-${part}-glass)`} stroke="#bfa775"/>
      <Gear x={100} y={86} radius={34}/><Gear x={159} y={95} radius={22} reverse/>
      <path d="M55 143H207M65 147H197M44 48H34V128H44M216 48H226V128H216" fill="none" stroke="#897349" strokeWidth="3"/>
      {[55, 205].flatMap(x => [30, 140].map(y => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="3" fill="#171a17" stroke="#c4ad7f"/><path d={`M${x - 2} ${y + 1}l4 -2`} stroke="#baa071"/></g>))}
      <circle className={styles.pilot} cx="190" cy="52" r="4" fill={pressure ? "#f49963" : "#91d0bb"}/>
      <path d="M52 56H91M52 61H72" stroke="#a9c0b2" opacity=".25"/>
    </> : part === "record" ? <>
      <path d="M57 36H203L216 142H44Z" fill={`url(#${id}-${part}-metal)`} stroke="#ae9364"/>
      <path d="M73 49H187V145L181 140L175 145L169 140L163 145L157 140L151 145L145 140L139 145L133 140L127 145L121 140L115 145L109 140L103 145L97 140L91 145L85 140L79 145L73 140Z" fill="#c4b48e"/>
      <rect x="59" y="37" width="142" height="15" rx="7" fill="#192322" stroke="#ad9160"/>
      {[67, 192].map(x=><circle key={x} cx={x} cy="44" r="4" fill="#927644"/>)}
      {[68, 82, 96, 110, 124].map((y,i)=><g key={y}><path d={`M85 ${y}h${i === 0 ? 69 : 36}`} stroke="#69583d" strokeWidth={i === 0 ? 3 : 2}/>{i > 0 ? <path d={`M153 ${y}h19`} stroke="#69583d" strokeWidth="2"/> : null}</g>)}
      <path d="M55 156H205" stroke="#c6a56b"/><circle cx="191" cy="123" r="5" fill="#173633" stroke="#a2d0ad"/>
    </> : <>
      <path d="M54 156L64 126L106 110H151L194 126L208 156Z" fill={`url(#${id}-${part}-metal)`} stroke="#b49b6c"/>
      <path d="M107 114V95H151V114L129 130Z" fill="#383d34" stroke="#9a895b"/>
      <path d={pressure ? "M98 38L119 25H142L163 40L166 75L150 100L129 111L109 98L94 72Z" : "M129 21L160 37L177 82L155 117L129 103L105 116L85 84L98 41Z"} fill={`url(#${id}-${part}-metal)`} stroke="#bda46e" strokeWidth="1.5"/>
      <path d="M104 48L129 37L153 48L157 74L143 96H116L101 73Z" fill="#152a2b" stroke="#7c7958"/>
      <path d="M108 59L123 64L124 71L108 68ZM133 64L151 59L150 68L133 71Z" className={styles.eyes} fill={pressure ? "#ef976a" : "#9ddcc4"}/>
      <path d="M127 62V80L121 85H137M115 90H145M77 134L101 144V158M161 146L185 133M121 125V160M137 125V160" fill="none" stroke="#b19969"/>
      {[74, 89, 174, 189].map(x=><circle key={x} cx={x} cy="144" r="3" fill="#b29b6b"/>)}
    </>}
  </svg>;
}

export default function WorldWorkshop() {
  const [policy, setPolicy] = useState<Policy>("pressure");
  const [account, setAccount] = useState(0);
  const ref = useLivingPlate<HTMLElement>();
  const id = useId().replace(/:/g, "");
  const event = example.results[policy];
  const voice = voices[policy];
  return <section ref={ref} className={styles.workshop} data-playing="false" data-policy={policy} aria-labelledby={`${id}-title`}>
    <header><p className={styles.eyebrow}>LOOPFORGE · A RECORDED EXPERIMENT</p><h3 id={`${id}-title`}>One shift. Two accounts.</h3><p>Change the production policy, then change the way its result is described.</p></header>
    <div className={styles.controls} role="group" aria-label="Fourth-shift production policy">
      <button type="button" aria-pressed={policy === "care"} onClick={()=>setPolicy("care")}>Care <span>Ease the pressure</span></button>
      <button type="button" aria-pressed={policy === "pressure"} onClick={()=>setPolicy("pressure")}>Pressure <span>Push for output</span></button>
    </div>
    <p className={styles.start}>Same start: shift 4 · 88 units already made · strain 12/100 · identical assignments</p>
    <div className={styles.chain} aria-live="polite" aria-atomic="true">
      <section className={styles.station}><span className={styles.step}>01 · RESOLVE</span><Machine part="engine" pressure={policy === "pressure"} id={id}/><h4>The rules decide</h4><p>{policy === "pressure" ? "More output carries more strain into the next shift." : "A smaller batch leaves less strain for the next shift."}</p><span className={styles.connector} aria-hidden="true">→</span></section>
      <section className={`${styles.station} ${styles.record}`}><span className={styles.step}>02 · RECORD</span><Machine part="record" pressure={policy === "pressure"} id={id}/><h4>The event stays fixed</h4><dl data-testid="world-event"><div><dt>Units this shift</dt><dd>{event.delta}</dd></div><div><dt>Total produced</dt><dd>{event.total}</dd></div><div><dt>Strain after shift</dt><dd>{event.strainAfter}<small>/100</small></dd></div></dl><span className={styles.connector} aria-hidden="true">→</span></section>
      <section className={styles.station}><span className={styles.step}>03 · INTERPRET</span><Machine part="voice" pressure={policy === "pressure"} id={id}/><h4>{voice.name} has a view</h4><blockquote>{voice.lines[account]}</blockquote><span className={styles.authored}>Authored dialogue for this exhibit</span></section>
    </div>
    <div className={styles.account}><button type="button" onClick={()=>setAccount(value => 1 - value)}>Change the account <span aria-hidden="true">↻</span></button><p>The words change. The recorded units and strain do not.</p></div>
    <details className={styles.method}><summary>What this comparison measures</summary><p>Two captured outcomes from Loopforge’s eight-shift teaching model, {example.version}, with seed {example.seed}. Both follow three balanced shifts and the same five assignments. Units are simulated production; strain is an abstract 0–100 state variable, not an injury count. These are conditional model outputs, not observations of people or a forecast of revenue.</p><p>The selector displays recorded results; it does not call a language model. The authored lines illustrate the separation between evidence and expression. The prototype’s narrator also receives one assigned speaker and bounded event evidence; structural validation does not guarantee factual dialogue.</p></details>
    <nav className={styles.links} aria-label="Explore the author's Loopforge project"><Link prefetch={false} href="/stepanoskin/loopforge/play">Play the prototype <span aria-hidden="true">↗</span></Link><Link prefetch={false} href="/stepanoskin/loopforge/architecture/the-thesis">Explore the engine <span aria-hidden="true">↗</span></Link></nav>
  </section>;
}
