"use client";
import {useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import TermNote from "../TermNote";
import s from "./parallel-wait.module.css";
const investigations=[{name:"Source dates",seconds:2},{name:"Market claim",seconds:3},{name:"Counterexample",seconds:4},{name:"Method limits",seconds:4},{name:"Original figures",seconds:6},{name:"Conflicting report",seconds:12}];
export default function ParallelWait(){
 const ref=useLivingPlate<HTMLDivElement>();const [time,setTime]=useState(6),[partial,setPartial]=useState(false),[cancel,setCancel]=useState(false);
 const join=partial?6:12,ready=time>=join+1,accepted=partial?5:6;
 const work=investigations.reduce((sum,job)=>sum+Math.min(time,job.seconds,partial&&cancel?6:Infinity),0);
 return <div className={s.study} ref={ref} data-playing="false">
  <div className={s.controls} role="group" aria-label="Brief completion policy"><button aria-pressed={!partial} onClick={()=>setPartial(false)}>Wait for every finding</button><button aria-pressed={partial} onClick={()=>setPartial(true)}>Use a 6 s evidence cutoff</button></div>
  <div className={s.paperHeader}><span>RESEARCH BRIEF · SIX READ-ONLY INVESTIGATIONS</span><strong>{time} s</strong></div>
  <div className={s.workroom}>
   <div className={s.source}><svg viewBox="0 0 70 70" aria-hidden="true"><path d="M10 12h40v48H10Z" fill="#617e72"/><path d="M18 6h40v48H18Z" fill="#d3c098"/><path d="M27 18h22M27 26h22M27 34h15" stroke="#486b60" strokeWidth="3"/></svg><div><strong>A shared source snapshot</strong><p>Different questions, the same version of the material.</p></div><TermNote term="What is shared?">This study assumes acquisition has already finished. The six workers investigate independently. It does not measure retrieval, model speed or the quality of a finding.</TermNote></div>
   <div className={s.axis} aria-label="Shared zero to twelve second timeline; vertical marker indicates when each investigation finishes"><span>0 s</span><span>Shared timeline · marker = finish</span><span>12 s</span></div>
   <div className={s.lanes}>{investigations.map((job,i)=>{
    const stopped=partial&&cancel&&time>=6&&job.seconds>6,complete=time>=job.seconds&&!stopped,late=partial&&job.seconds>6;
    const elapsed=Math.min(time,job.seconds,stopped?6:Infinity);
    return <div className={s.lane} key={job.name} data-complete={complete} data-stopped={stopped}>
     <div className={s.laneName}><span className={s.number}>{String(i+1).padStart(2,"0")}</span><strong>{job.name}</strong><span>{stopped?"Canceled":complete?(late?"Late finding":"Ready"):`${elapsed} / ${job.seconds} s`}</span></div>
     <div className={s.track} aria-hidden="true"><div className={s.fill} style={{width:`${elapsed/12*100}%`}}/><span className={s.endpoint} style={{left:`${job.seconds/12*100}%`}}/>{!complete&&!stopped&&time>0?<span className={s.pulse} style={{left:`${elapsed/12*100}%`}}/>:null}</div>
    </div>;
   })}</div>
   <div className={s.receiving} data-ready={ready}><svg viewBox="0 0 80 90" aria-hidden="true"><path d="M8 8h51l13 13v61H8Z" fill={ready?"#d8c49b":"#6e897b"}/><path d="M59 8v14h13M19 36h40M19 47h34M19 58h40M19 69h22" stroke="#304f49" fill="none" strokeWidth="3"/></svg><div aria-live="polite"><span className={s.small}>ONE SECOND TO SYNTHESIZE</span><h3>{ready?(partial?"A partial brief is released":"The complete brief is released"):time>=join?"The findings are being assembled":partial?"Waiting for the 6-second cutoff":"Waiting for all six findings"}</h3><p>{ready?`${accepted} of 6 findings included. ${partial?"The conflicting report is explicitly missing; late evidence does not silently alter the released brief.":"Every investigation is present; correctness still requires evaluation."}`:partial?"The deadline changes which evidence this issue promises to include.":"Even five finished investigations cannot release a brief that promises all six."}</p></div></div>
  </div>
  <div className={s.clock}><label htmlFor="research-clock">Move through the run <output>{time} s</output></label><input id="research-clock" aria-label="Research run time" type="range" min="0" max="13" value={time} onChange={e=>setTime(Number(e.target.value))}/><div className={s.ticks}><span>Start</span><span>6 s cutoff</span><span>13 s complete</span></div><div className={s.controls}><button onClick={()=>setTime(0)}>Reset clock</button><button onClick={()=>setTime(t=>Math.min(13,t+1))} disabled={time===13}>Advance one second</button></div></div>
  <label className={s.cancel}><input type="checkbox" checked={cancel} disabled={!partial} onChange={e=>setCancel(e.target.checked)}/> Cancel unfinished investigation at the cutoff</label>
  <div className={s.footer}><p><strong>{work} worker-seconds spent</strong><br/>Overlapping investigation time, excluding synthesis.</p><TermNote term="Why can this exceed the clock?">Several workers run at once. Summing their active time describes work consumed, not how long the reader waits. All durations are authored. With partial release, cancellation stops the late worker at 6 seconds; without it, that worker continues to 12.</TermNote><TermNote term="What cancellation leaves behind">These investigations only read information. Canceling one leaves a declared evidence gap. An operation that sends, spends or mutates state would require a separate recovery contract.</TermNote></div>
 </div>;
}
