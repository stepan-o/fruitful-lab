"use client";
import {useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {useCompactPlate} from "./useCompactPlate";
import s from "./closure.module.css";
const entries=[
 {name:"Max’s control",tag:"Selected correction",color:"#99b49a",inside:"The separate cycle control within the existing three authored phases.",outside:"The earlier forward lunge and unclear control contact.",record:"Selected runtime tree 553e5f3c. The later delivery record retains the ordinary-speed comparison and its differing entry contexts.",next:"Further refinement must begin from the selected correction, not accidentally restore the rejected baseline."},
 {name:"Sam’s rescue",tag:"Delivered bank retained",color:"#d1b47b",inside:"Sam still helps Bob and works on Conveyor using the delivered animation bank.",outside:"The later experimental rescue solver; physical card fitting remains deferred.",record:"The combined selection explicitly excluded fourteen experimental modules and retained their source packets. No corrected rescue after-film was delivered.",next:"A rescue correction needs a new bounded commission and whole-action evidence. Preserved source is available without being installed."},
 {name:"Device result",tag:"Failed gate recorded",color:"#c68b72",inside:"The full-day result, exact conditions and unresolved performance findings.",outside:"Any claim that merge, a green build or the earlier opening pass establishes smooth final playback.",record:"The final minimal and full variants both failed the quiet protocol. Owner merge at 18:01 UTC followed the frozen closeout.",next:"A later performance repair needs its own matched result; the handoff must keep this failure visible."}
];
export default function ReleaseManifest(){
 const [index,setIndex]=useState(0),ref=useLivingPlate<HTMLDivElement>(),compact=useCompactPlate(),entry=entries[index];
 const display=[
  {kept:"Separate cycle control",held:"Earlier lunge",keptSmall:"selected correction",heldSmall:"rejected baseline",left:"IN THE RUNNING DAY",right:"PRESERVED OUTSIDE"},
  {kept:"Delivered motion bank",held:"Experimental solver",keptSmall:"Sam still helps and works",heldSmall:"fourteen modules excluded",left:"IN THE RUNNING DAY",right:"PRESERVED OUTSIDE"},
  {kept:"Failed device result",held:"A performance pass",keptSmall:"attached to the handoff",heldSmall:"not established for this day",left:"IN THE RELEASE RECORD",right:"CLAIM WITHHELD"}
 ][index];
 const positions=compact?[[210,172],[210,483]]:[[245,245],[660,245]];
 return <div ref={ref} className={s.study} data-playing="false"><div className={s.tabs} style={{gridTemplateColumns:compact?"1fr":"repeat(3,1fr)"}} role="group" aria-label="Inspect a delivered boundary">{entries.map((e,i)=><button key={e.name} aria-pressed={i===index} onClick={()=>setIndex(i)}>{e.name}</button>)}</div>
 <div className={s.cabinet}><svg viewBox={compact?"0 0 420 670":"0 0 900 440"} role="img" aria-label={entry.name+". "+display.left+": "+display.kept+". "+display.right+": "+display.held+". Authored map of the recorded selection, not a replay."}>
 <defs><linearGradient id={"manifest-"+index} x2="0" y2="1"><stop stopColor="#b4a778"/><stop offset="1" stopColor="#697960"/></linearGradient></defs>
 <rect width={compact?420:900} height={compact?670:440} fill="#24464b"/><path d={compact?"M0 24H420M0 646H420":"M0 31H900M0 408H900"} stroke="#718b76"/>
 {positions.map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}>
  <text x="0" y="-136" textAnchor="middle" className={s.compartmentLabel} fontSize={compact?18:16} fill="#d9cea7">{i===0?display.left:display.right}</text>
  <path d="M-165-116H157L178 128H-178Z" fill={`url(#manifest-${index})`} stroke="#c4b580" strokeWidth="3"/>
  <path d="M-147-99H141L157 105H-157Z" fill={i===0?"#31534d":"#1b3b40"} stroke="#7e9275" strokeWidth="5"/>
  <g key={index} className={s.binderLeaf}>
   <path d="M-128-82H124L136 90H-138Z" fill={i===0?"#d8cba5":"#b1b996"} stroke="#496a59" strokeWidth="2"/>
   {index===0?<g transform="translate(0 -30)"><rect x="-63" y="-30" width="126" height="70" rx="3" fill="#597c69" stroke="#34564b" strokeWidth="3"/><circle cx="-34" cy="6" r="16" fill={i===0?"#c7b371":"#ad795f"} stroke="#294a41" strokeWidth="4"/><path d={i===0?"M-34 6H32V-15":"M-34 6l65 19-6-49"} fill="none" stroke="#d8c9a0" strokeWidth="7"/><circle cx="32" cy="-15" r="8" fill="#c4c498"/>{i===1&&<path d="M-78-40l155 93" stroke="#9a5d49" strokeWidth="5"/>}</g>:index===1?<g transform="translate(0 -28)">{[-62,0,62].map((x,n)=><g key={x} transform={`translate(${x} 0)`}><rect x="-24" y="-34" width="48" height="74" fill={i===0?"#628572":"#7b8b70"} stroke="#35574a" strokeWidth="3"/>{i===0?<><circle cy="-15" r="8" fill="#d8cba5"/><path d={`M0-5v22m0-15 ${n===1?"-16 15":"16 5"}m-16-5 16 0m0 15-12 16m12-16 12 16`} stroke="#d8cba5" strokeWidth="4" fill="none"/></>:<><path d="M-15-20l30 12-30 17 30 18" stroke="#d8cba5" strokeWidth="3" fill="none"/><circle cy="5" r="10" fill="#b57e61" stroke="#405e4e"/></>}</g>)}</g>:<g transform="translate(0 -23)"><path d="M-77-46H72V48H-77Z" fill="#e0cfaa" stroke="#607b64" strokeWidth="3"/><path d="M-60-29H56m-116 16H56" stroke="#98a78a"/><rect x="-63" y="1" width="124" height="34" fill={i===0?"#b6795d":"#8aa583"}/><text y="25" x="-1" textAnchor="middle" fontSize="20" fontFamily="Arial" fill="#203e38">{i===0?"FAILED":"PASS"}</text>{i===1&&<path d="M-78-48 78 52m-156 0L78-48" stroke="#965b48" strokeWidth="6"/>}</g>}
   <text x="0" y="56" textAnchor="middle" fontSize={compact?21:19} fill="#294d42" fontFamily="Georgia">{i===0?display.kept:display.held}</text>
   <text x="0" y="79" textAnchor="middle" fontSize={compact?15:13} fill="#45634f" fontFamily="Arial">{i===0?display.keptSmall:display.heldSmall}</text>
  </g>
  <path d="M-178 128H178l-12 17h-332Z" fill="#7d8763" stroke="#c4b580" strokeWidth="2"/><path d="M-28 136H28" stroke="#2a4c43" strokeWidth="6"/>
 </g>)}
 {!compact&&<><path className={s.manifestLine} d="M440 245h28" stroke="#c6b887" strokeWidth="3"/>
 <text x="452" y="58" textAnchor="middle" fontFamily="Arial" fontSize="12" fill="#d9c89d">KEEP DISTINCT</text></>}
 </svg></div>
 <div className={s.receipt} aria-live="polite"><p className={s.eyebrow}>Selected boundary · {entry.tag}</p><p>{entry.inside}</p><p><strong style={{fontSize:19}}>Kept outside this selection</strong>{entry.outside}</p><p>{entry.record}</p></div><p className={s.note}>{entry.next}</p><p className={s.source}><a href="https://github.com/stepan-o/fruitful-lab/blob/35d114447749ed131c8016f8e0f9dff7d1c2e7d5/docs/loopforge/production/COMBINED_DELIVERY_2026-10-26.md">Pinned selection record ↗</a><a href="https://github.com/stepan-o/fruitful-lab/pull/130">Final delivery and merge ↗</a></p></div>;
}
