"use client";
import {useId,useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {useCompactStudy} from "./useCompactStudy";
import TermNote from "../TermNote";
import s from "./team-studies.module.css";
const verdicts=[
 {label:"Numerical pass",time:"18:09:35 UTC",title:"A scoped check can pass",body:"The Push integration checks returned a numerical pass. That finding belonged to the tested conditions; the action’s visible posture and intention still needed judgment.",stamp:"SCOPED PASS",color:"#83a997"},
 {label:"Rendered rejection",time:"Around 21:05 UTC",title:"The performance changes the decision",body:"The rendered action was explicitly rejected roughly two hours and fifty-six minutes later. A more trustworthy numerical result had not made the performance acceptable.",stamp:"VISUAL OBJECTION",color:"#cc9077"}
];
export default function FeedbackDelay(){
 const [selected,setSelected]=useState(0),ref=useLivingPlate<HTMLDivElement>(),compact=useCompactStudy(ref),uid=useId().replaceAll(":","");
 const v=verdicts[selected],w=compact?360:800;
 return <div className={s.study} ref={ref} data-playing="false">
  <div className={s.controls} role="group" aria-label="Compare correction verdicts">{verdicts.map((item,i)=><button key={item.label} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{item.label}</button>)}</div>
  <div className={s.dateLine}>25 OCTOBER 2026 · TWO KINDS OF OBSERVATION</div>
  <div className={`${s.diagram} ${s.feedbackDiagram}`}><svg viewBox={`0 0 ${w} ${compact?410:330}`} role="img" aria-label="A numerical check and a rendered performance give different verdicts. Roughly 2 hours 56 minutes elapsed between their recorded results; active work is not measured here.">
   <defs><linearGradient id={uid+"desk"} x2="0" y2="1"><stop stopColor="#4d6866"/><stop offset="1" stopColor="#263f46"/></linearGradient></defs>
   <rect width={w} height={compact?410:330} fill={`url(#${uid}desk)`}/>
   <path d={`M14 12H${w-14}V${compact?390:310}H14Z`} fill="none" stroke="#97a588"/>
   {verdicts.map((item,i)=>{const x=compact?38:70+i*425,y=compact?28+i*184:35,rw=compact?284:235,active=selected===i;return <g key={i} transform={`translate(${x} ${y})`} opacity={1} className={s.card}>
    <path d={`M5 7H${rw+5}V155H5Z`} fill="#15343a"/><path d={`M0 0H${rw}V149H0Z`} fill={active?"#dbc9a2":"#bdc4a7"} stroke={active?"#f0d39b":"#9d9d79"} strokeWidth={active?3:1}/>
    {i===0?<g fill="none" stroke="#48695c" strokeWidth="3"><path d="M24 29l6 6 11-13M50 29h90M24 57l6 6 11-13M50 57h90M24 85l6 6 11-13M50 85h90"/></g>:<g><rect x="22" y="19" width={rw-44} height="77" fill="#34574f"/>{[0,1,2,3].map(n=><g key={n}><rect x={29+n*(rw-65)/4} y="23" width="10" height="5" fill="#d3c29a"/><rect x={29+n*(rw-65)/4} y="86" width="10" height="5" fill="#d3c29a"/></g>)}<path d={`M${rw/2-8} 41l27 16-27 17Z`} fill="#c7b78d"/><path d={`M${rw-43} 43l15 30m-15 0 15-30`} stroke="#d19174" strokeWidth="4"/></g>}
    <path d={`M20 110H${rw-20}`} stroke="#839178"/><text x={rw/2} y="133" textAnchor="middle" fontFamily="Arial" fontSize="16" fill="#294b40">{item.stamp}</text>
   </g>;})}
   {!compact?<g><circle cx="400" cy="112" r="47" fill="#c3ae7d" stroke="#243f43" strokeWidth="6"/><circle cx="400" cy="112" r="37" fill="#e0cda0"/><path d="M400 85v27l23 13" stroke="#48685b" strokeWidth="4" fill="none"/><circle cx="400" cy="112" r="4" fill="#344f47"/></g>:null}
   <path d={compact?'M335 105V289':'M188 230H612'} stroke="#b4ac83" strokeWidth="2"/><path d={compact?'M328 105h14m-14 184h14':'M188 222v16m424-16v16'} stroke="#b4ac83" strokeWidth="2"/>
   {!compact?<><text x="400" y="269" textAnchor="middle" fill="#e7d5ac" fontFamily="Georgia" fontSize="27">≈ 2 h 56 min elapsed</text><text x="400" y="294" textAnchor="middle" fill="#bfcdb3" fontFamily="Arial" fontSize="14">includes deployment, access waiting and other work</text></>:null}
  </svg></div>
  <p className={s.elapsed}>≈ 2 h 56 min elapsed<br/><small>Includes deployment, access waiting and other work.</small></p>
  <div className={s.receipt} aria-live="polite"><p className={s.eyebrow}>{v.time}</p><h3>{v.title}</h3><p>{v.body}</p></div>
  <div className={s.notes}><TermNote term="Elapsed is not active waste">The interval is derived from the recorded pass and approximate explicit rejection. It includes other work and waiting. The audit cannot allocate every intervening token or minute to useful work, coordination or waste.</TermNote><TermNote term="Where the audit stops">The audit freezes at 23:50 UTC on 25 October. It records substantive repairs and validation capacity but no matching corrected after-film. The next day’s Forge footage and release are separately dated outcomes; they do not rewrite that cutoff.</TermNote><a href="/agentic-systems/evidence/close-cycle-audit-2026-10-25.json">Frozen observations ↗</a></div>
 </div>;
}
