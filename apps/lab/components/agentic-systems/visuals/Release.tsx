"use client";
import {useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import Workshop from "./Workshop";
import BodyStudy from "./BodyStudy";
import TimingInstrument from "./TimingInstrument";
import s from "../visuals.module.css";
const stages=[
 {name:"Custody",title:"Who holds the object?",text:"The encounter record can establish who takes the card. A wide screenshot alone cannot establish custody or what Bob knows.",ledger:"Bob’s card → Ed",sub:"Custody comes from state, not a visible pocket."},
 {name:"Completion",title:"A completed action leaves two kinds of evidence.",text:"The output event establishes that the production rule fired. The recording lets a reviewer judge how Max’s reach presented that event.",ledger:"Output event → 3",sub:"A numerical outcome and a bodily action need different checks."},
 {name:"Persistence",title:"What must remain true after completion?",text:"Ending the visible activity must not erase facts that still matter. The retained card custody and Bob’s incomplete knowledge are separate state obligations.",ledger:"Line stopped · custody retained",sub:"The obligation outlives the shift."}
];
export default function Release(){
 const ref=useLivingPlate<HTMLDivElement>();const [view,setView]=useState(0);const [stage,setStage]=useState(1);const item=stages[stage];
 return <div ref={ref} className={s.instrument} data-playing="false">
  <div className={s.windowTabs} role="group" aria-label="Inspect the delivered release">{["Check the outcome","Read the action","Inspect the timing"].map((label,i)=><button key={label} type="button" aria-pressed={view===i} onClick={()=>setView(i)}>{label}</button>)}</div>
  {view===0?<><div className={s.scene}><Workshop stage={stage}/><div className={s.sceneTag}>CASE STUDY · RECORDED OUTCOMES</div></div><div className={s.retainedRail}><svg viewBox="0 0 40 28" aria-hidden="true"><path d="M2 2h36v24H2Z" fill="#d8ca9e" stroke="#eee2b9"/><path d="M8 9h24M8 16h17" stroke="#52746b" strokeWidth="2"/></svg><span>Retained state<strong>Card → Ed</strong></span></div><div className={s.tabs} role="group" aria-label="Choose a state obligation">{stages.map((item,i)=><button type="button" key={item.name} aria-pressed={stage===i} onClick={()=>setStage(i)}>{item.name}</button>)}</div><div className={s.readout} aria-live="polite"><div><h3>{item.title}</h3><p>{item.text}</p></div><div className={s.custody}><strong>{item.ledger}</strong><p>{item.sub}</p></div></div></>:view===1?<BodyStudy/>:<TimingInstrument/>}
  <a className={s.instrumentSource} href={view===2?"https://github.com/stepan-o/fruitful-lab/pull/130":"/loopforge-dev-blog/posts/2026-10-26-motion-in-the-running-game/index.html"}>{view===2?"Recorded release limits and results":"Inspect the published ordinary-run evidence"} ↗</a>
 </div>;
}
