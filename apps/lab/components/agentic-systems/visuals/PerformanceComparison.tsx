"use client";
import {useId,useState,type CSSProperties} from "react";
import baseline from "@/public/agentic-systems/evidence/2026-10-21-hd620-opening-baseline.json";
import optimized from "@/public/agentic-systems/evidence/2026-10-21-hd620-opening-optimized.json";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {useCompactPlate} from "./useCompactPlate";
import s from "./performance.module.css";
import TermNote from "../TermNote";
const metrics=[
 {key:"fps",name:"Average rate",unit:"FPS",limit:30,max:70,lower:false},
 {key:"p95Ms",name:"Slow tail · p95",unit:"ms",limit:33.333,max:70,lower:true},
 {key:"p99Ms",name:"p99 frame",unit:"ms",limit:66.667,max:80,lower:true},
 {key:"stallsOver100",name:"Pauses over 100 ms",unit:"frames",limit:6,max:40,lower:true},
 {key:"maxMs",name:"Longest frame",unit:"ms",limit:500,max:700,lower:true},
 {key:"input",name:"Input response",unit:"ms",limit:200,max:220,lower:true}
] as const;
type Values=Record<typeof metrics[number]["key"],number>;
const records:[{name:string;values:Values},{name:string;values:Values}][]=[
 [{name:"Minimal dressing",values:{fps:36.686,p95Ms:44.5,p99Ms:57.5,stallsOver100:25,maxMs:261.2,input:22.7}},{name:"Full scenery",values:{fps:33.170,p95Ms:47.6,p99Ms:60.7,stallsOver100:17,maxMs:596.4,input:34}}],
 [{name:"Before local repairs",values:{...baseline.frames,input:baseline.inputResponseMs[0]}},{name:"After local repairs",values:{...optimized.frames,input:optimized.inputResponseMs[0]}}]
];
const definitions=[
 "An average combines the run into one rate. It can stay above a minimum while individual frames pause long enough to disrupt an action.",
 "The 95th percentile is the duration at or below which about 95% of measured frames fall. It describes a boundary in the distribution, not average frame time.",
 "About 99% of measured frames fall at or below this duration. The remaining tail can still contain a much longer individual frame.",
 "This count uses a fixed 100-millisecond threshold. A longer observation period can accumulate more such frames, so run duration matters.",
 "One maximum names the worst observed interruption. It does not tell us how often comparable interruptions occurred.",
 "Input response measures the delay for the recorded interaction. Its acceptable value does not certify frame cadence during the rest of the run."
];
const rounded=(v:number)=>Number(v.toFixed(3)).toLocaleString("en-US");
export default function PerformanceComparison(){
 const [pair,setPair]=useState(0),[metric,setMetric]=useState(1),ref=useLivingPlate<HTMLDivElement>(),compact=useCompactPlate(),id=useId().replaceAll(":","");
 const m=metrics[metric],rows=records[pair],left=290,width=440,threshold=left+width*m.limit/m.max;
 return <div ref={ref} className={s.study} data-playing="false">
  <div className={s.controls} role="group" aria-label="Choose a recorded workload"><button aria-pressed={pair===0} onClick={()=>setPair(0)}>Delivered day · 26 Oct</button><button aria-pressed={pair===1} onClick={()=>setPair(1)}>Earlier opening · 21 Oct</button></div>
  <p className={s.context}>{pair===0?"Each variant: two complete Day 1 runs · 25 shots · 7 stages · 12 control receipts · Intel HD 620 · Chrome 156 · 1280 × 720":"Matched ten-minute opening runs · same scene, assets and reference graphics · Intel HD 620 · 1280 × 720"}</p>
  <div className={s.measureControl}><label>Inspect a measure<select value={metric} onChange={e=>setMetric(Number(e.target.value))}>{metrics.map((item,i)=><option key={item.key} value={i}>{item.name}</option>)}</select></label><TermNote term={m.name+" explained"}>{definitions[metric]}</TermNote></div>
  <div className={s.monitor}><svg viewBox={compact?"245 65 545 350":"0 0 900 490"} role="img" aria-label={`${m.name}. ${rows.map(row=>`${row.name}: ${rounded(row.values[m.key])} ${m.unit}`).join(". ")}. ${m.lower?"Maximum":"Minimum"} ${m.limit} ${m.unit}.`}>
   <defs><linearGradient id={id+"wall"} x2="0" y2="1"><stop stopColor="#5b6b61"/><stop offset="1" stopColor="#213c44"/></linearGradient><linearGradient id={id+"wood"}><stop stopColor="#a88c60"/><stop offset=".6" stopColor="#76694d"/><stop offset="1" stopColor="#bd9f6c"/></linearGradient></defs>
   <rect width="900" height="490" fill={`url(#${id}wall)`}/><path d="M0 30H900M0 55H900M0 420H900" stroke="#78907a" opacity=".4"/>
   <path d="M35 75H212V365H35Z" fill="#17343b" stroke="#8d9b7f"/><path d="M46 86H201V354H46Z" fill="#304d4c"/>
   {[130,285].map((y,i)=><g key={y} transform={`translate(123 ${y})`}><circle r="46" fill="#8f9e80" stroke="#c7ba8d" strokeWidth="2"/><g className={s.reel} style={{"--turn":i?"-1turn":"1turn"} as CSSProperties}>{[0,60,120,180,240,300].map(a=><ellipse key={a} cx="0" cy="-27" rx="9" ry="12" transform={`rotate(${a})`} fill="#2b4949"/>)}</g><circle r="10" fill="#caba8d" stroke="#3c5751"/><path d="M-3-3l6 6m0-6-6 6" stroke="#50634f"/></g>)}
   <path d="M169 130V285M78 130V285" stroke="#c9b382" strokeWidth="3"/><path d="M93 195h60v25H93Z" fill="#152e35" stroke="#c3af7f"/><text x="123" y="212" textAnchor="middle" fontSize="10" fill="#d5c9a6">RECORD</text>
   <path d="M240 55H800V417H240Z" fill="#1b3037" stroke="#b1aa87" strokeWidth="3"/><path d="M251 66H789V406H251Z" fill="#d4c6a0" stroke="#738573"/>
   {[0,1,2,3,4].map(i=><g key={i}><path d={`M${left+i*width/4} 107V339`} stroke="#a3aa8c" strokeWidth="1"/><text x={left+i*width/4} y="372" fontSize={compact?25:15} textAnchor="middle" fill="#3b5e56" fontFamily="Arial">{Number((m.max*i/4).toFixed(1))}</text></g>)}
   <path d={`M${left} 350H${left+width}`} stroke="#476758" strokeWidth="2"/>
   {rows.map((row,i)=><g key={`${pair}-${i}`}><text x={left} y={116+i*113} fontFamily="Arial" fontSize={compact?22:16} fill="#34574f">{compact?i===0?"A":"B":row.name}</text><rect x={left} y={133+i*113} width={width} height="42" fill="#c5bc98"/><rect className={s.bar} x={left} y={133+i*113} width={width*row.values[m.key]/m.max} height="42" fill={i===0?"#537f79":"#ad8050"}/><text x={left} y={202+i*113} fontSize={compact?26:19} fontFamily="Georgia" fill="#2c524c">{rounded(row.values[m.key])} {m.unit}</text></g>)}
   <path d={`M${threshold} 100V340`} stroke="#3e5147" strokeWidth="3" strokeDasharray="5 5"/>
   <path d="M18 420H857L887 449H0Z" fill={`url(#${id}wood)`}/><path d="M0 449H887V471H0Z" fill="#4c5647"/>
   <path d="M49 471v19m789-19v19" stroke="#b49d6c" strokeWidth="16"/><path d="M243 427h253l20 14H230Z" fill="#dac79d"/><path d="M257 432h128m-128 5h192" stroke="#a5a17e"/>
   <g className={s.lamp}><path d="M825 390V179l-33-35" stroke="#9eaa81" strokeWidth="7" fill="none"/><path d="M768 133l39-12 11 29-50 10Z" fill="#c5b37e" stroke="#687c62"/><ellipse cx="825" cy="400" rx="30" ry="9" fill="#76856b"/></g>
  </svg></div>
  <div className={s.readings} aria-live="polite">{rows.map((row,i)=>{const pass=m.lower?row.values[m.key]<=m.limit:row.values[m.key]>=m.limit;return <div key={row.name}><span>{i===0?"A":"B"} · {row.name}</span><strong>{rounded(row.values[m.key])} <small>{m.unit}</small></strong><p>{pass?"Within":"Outside"} this measure’s limit</p></div>;})}</div>
  <p className={s.limit}>Dashed line: {m.lower?"maximum":"minimum"} {m.limit} {m.unit}. {pair===0?"Both variants failed the complete protocol. Minimal dressing hides allocated meshes; it does not measure memory savings or cold loading.":"The repaired opening passed its recorded protocol; the baseline failed the pause-count limit. This earlier pass does not certify the later Day 1 workload."}</p>
  <details className={s.exact}><summary>All six readings and their limits</summary><div className={s.tableWrap}><table><caption>{pair===0?"26 October · final comparison":"21 October · matched opening comparison"}</caption><thead><tr><th>Measure</th><th>A</th><th>B</th><th>Limit</th></tr></thead><tbody>{metrics.map(x=><tr key={x.key}><th>{x.name} ({x.unit})</th><td>{rounded(rows[0].values[x.key])}</td><td>{rounded(rows[1].values[x.key])}</td><td>{x.lower?"≤":"≥"}{x.limit}</td></tr>)}</tbody></table></div></details>
  <div className={s.links}>{pair===0?<a href="https://github.com/stepan-o/fruitful-lab/pull/130">Published final record ↗</a>:<><a href="/agentic-systems/evidence/2026-10-21-hd620-opening-baseline.json">Before · raw result ↗</a><a href="/agentic-systems/evidence/2026-10-21-hd620-opening-optimized.json">After · raw result ↗</a><a href="/agentic-systems/evidence/2026-10-21-hd620-opening-optimized-provenance.json">Matched conditions and changes ↗</a></>}</div>
 </div>;
}
