"use client";
import { useId, useState } from "react";
import { businessCircuits } from "@/lib/sanctuary/business-circuit";
import { CircuitVignette } from "./BusinessCircuitScene";
import { useLivingPlate } from "./plates/useLivingPlate";
import s from "./business-circuit.module.css";

const centers=[115,345,575,805];
export default function BusinessCircuit(){
 const [route,setRoute]=useState(0);
 const [payment,setPayment]=useState(1);
 const [party,setParty]=useState(2);
 const ref=useLivingPlate<HTMLElement>();
 const id=useId().replace(/:/g,"");
 const model=businessCircuits[route], transfer=model.payments[payment], selected=model.parties[party];
 const workEdges=model.id==="pc"||model.id==="netflix"?[[0,1],[1,3],[2,3]]:[[0,1],[1,2],[2,3]];
 function inspectParty(index:number){setParty(index);const incoming=model.payments.findIndex(item=>item.to===index);const related=incoming>=0?incoming:model.payments.findIndex(item=>item.from===index);if(related>=0)setPayment(related);}
 function changeRoute(index:number){setRoute(index);setPayment(index===0?1:index===3?0:2);setParty(index===0?2:index===3?1:2);}
 return <section ref={ref} className={s.circuit} data-playing="false" aria-labelledby={`${id}-title`}>
  <header className={s.heading}><p className={s.kicker}>The arrangement behind the screen</p><h2 id={`${id}-title`}>What has to keep selling?</h2></header>
  <div className={s.routes} role="group" aria-label="Compare business arrangements">{businessCircuits.map((item,i)=><button key={item.id} type="button" aria-pressed={route===i} onClick={()=>changeRoute(i)}>{item.label}</button>)}</div>
  <p className={s.context}>{model.context}</p>
  <div className={s.stage}>
   <div className={s.legend}><span><i/>Work, equipment & access</span><span><i/>Payments</span></div>
   <svg className={s.panorama} viewBox="0 0 920 284" aria-hidden="true">
    <defs><radialGradient id={`${id}-light`}><stop stopColor="#5c6549" stopOpacity=".22"/><stop offset="1" stopColor="#172b2b" stopOpacity="0"/></radialGradient><pattern id={`${id}-engrave`} width="7" height="7" patternUnits="userSpaceOnUse"><path d="m-1 1 9 9M5-1l3 3" stroke="#bb996a" strokeWidth=".4" opacity=".12"/></pattern><marker id={`${id}-work-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="m1 1 5 3-5 3" fill="none" stroke="#80a897"/></marker></defs>
    <ellipse cx="460" cy="188" rx="455" ry="118" fill={`url(#${id}-light)`}/>
    <path d="M4 254h912v17l-16 9H20L4 271Z" fill="#132226" stroke="#6c7257"/><path d="M8 259h904v8H8Z" fill={`url(#${id}-engrave)`}/><path d="M20 276h879" stroke="#b2a173" strokeOpacity=".4"/>
    {workEdges.map(([from,to],i)=>{const a=centers[from],b=centers[to],y=11+i*13;return <g key={i}><path d={`M${a} 60V${y+6}q0-6 6-6H${b-6}q6 0 6 6V59`} fill="none" stroke="#6c9484" strokeWidth="1" strokeOpacity=".58" markerEnd={`url(#${id}-work-arrow)`}/><title>{`${model.parties[from].name} → ${model.parties[to].name}: ${model.work[i]}`}</title></g>})}
    {model.parties.map((item,i)=><g key={`${i}-${item.scene}`} transform={`translate(${12+i*230} 58)`}><ellipse cx="104" cy="186" rx="103" ry="26" fill="#030c10" opacity=".7"/><CircuitVignette kind={item.scene}/><path d="M17 208h176" stroke={party===i?"#dfbe82":"#696950"} strokeWidth={party===i?2.5:1}/></g>)}
   </svg>
   <div className={s.parties} role="group" aria-label="Inspect a business or its customer">{model.parties.map((item,i)=><button key={i} type="button" aria-pressed={party===i} onClick={()=>inspectParty(i)} aria-controls={`${id}-party`}><svg className={s.mobileScene} viewBox="0 0 210 212" aria-hidden="true"><CircuitVignette kind={item.scene}/></svg><span className={s.partyNumber}>0{i+1}</span><strong>{item.name}</strong><small>{item.role}</small></button>)}</div>
   <svg viewBox="0 0 920 151" className={s.returnPaths} role="img" aria-label={`Payment routes: ${model.payments.map(p=>`${model.parties[p.from].name} to ${model.parties[p.to].name}, ${p.name}`).join('; ')}. Lines show relationships, not amounts or payment dates.`}>
    <defs><marker id={`${id}-money-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 7 4 1 7" fill="none" stroke="#deb37c" strokeWidth="1.5"/></marker></defs>
    {model.payments.map((item,i)=>{const a=centers[item.from]+(i-1)*9,b=centers[item.to]+(i-1)*9,y=40+i*39,d=`M${a} 3V${y-9}q0 9-9 9H${b+9}q-9 0-9-9V7`;return <g key={`${model.id}-${i}`} data-active={payment===i} className={s.paymentRoute}>
     <path d={d} fill="none" stroke="#070f12" strokeWidth="6"/>
     <path d={d} className={s.track} fill="none" stroke={payment===i?"#c59765":"#71674e"} strokeWidth={payment===i?2:1} markerEnd={`url(#${id}-money-arrow)`}/>
     {payment===i?<path d={d} className={s.moneyPulse} fill="none" stroke="#ffe0a8" strokeWidth="2.5" strokeDasharray="2 28"/>:null}
     <circle cx={(a+b)/2} cy={y} r="11" fill="#182528" stroke={payment===i?"#deb37c":"#76664c"}/><text x={(a+b)/2} y={y+4} textAnchor="middle" fill={payment===i?"#f7ddad":"#b0a385"} fontSize="12" fontFamily="monospace">{i+1}</text>
    </g>})}
   </svg>
  </div>
  <div className={s.receipts} role="group" aria-label="Follow a payment">{model.payments.map((item,i)=><button key={i} type="button" aria-pressed={payment===i} onClick={()=>{setPayment(i);setParty(item.to)}} aria-controls={`${id}-transfer`}><span aria-hidden="true">{i+1}</span><strong>{item.name}</strong><small>{model.parties[item.from].name} → {model.parties[item.to].name}</small></button>)}</div>
  <p id={`${id}-transfer`} className={s.transfer} aria-live="polite">{transfer.explanation}</p>
  <div id={`${id}-party`} className={s.readout} aria-live="polite">
   <div className={s.readoutTitle}><span aria-hidden="true">0{party+1}</span><h3>{selected.name}</h3><p>{selected.role}</p></div>
   <dl><div><dt>Pays for</dt><dd>{selected.pays}</dd></div><div><dt>{party===3?"Receives":"Earns from"}</dt><dd>{selected.earns}</dd></div></dl>
   <div className={s.next}><p className={s.kicker}>{party===3?"What brings them back":"What it needs next"}</p><p>{selected.next}</p></div>
  </div>
  <details className={s.sources}><summary>Sources & limits of this comparison</summary><p>{model.note}</p><p>The arrangements create different commercial incentives. They do not prescribe one game design, and the lines do not measure revenue, profit or payment timing.</p><ul>{model.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul></details>
 </section>;
}
