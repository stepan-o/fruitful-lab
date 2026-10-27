"use client";
import {useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {workshop,type Staffing,type WorkshopKind} from "@/lib/agentic-systems/workshop";
import s from "./workshop.module.css";
const names={independent:["Archive A","Archive B","Archive C"],coupled:["Measure","Cut","Fit"]};
function Bench({kind,index,status,progress,staffed,piece}:{kind:WorkshopKind;index:number;status:string;progress:number;staffed:boolean;piece:boolean}){
 const active=status==="working",done=status==="done";
 return <svg viewBox="0 0 320 270" role="img" aria-label={kind==="independent"?"A research desk with a lamp, source papers and an output tray.":"An assembly bench with one stage of a shared workpiece."}>
 <defs><linearGradient id={`bench-wood-${index}`} x2="0" y2="1"><stop stopColor="#9e7855"/><stop offset="1" stopColor="#5c5141"/></linearGradient></defs>
 <rect width="320" height="270" fill="#e3d8bb"/><path d="M16 39H304V199H16Z" fill="#c8cbb1" stroke="#9ba28c"/>{[66,96,126,156].map(y=><path key={y} d={`M16 ${y}H304`} stroke="#aeb69b" strokeWidth="1"/>)}<path d="M17 230l140-46 146 42-143 36Z" fill="#b6ad8f" opacity=".45"/>
 <path d="M28 162L166 126 299 166 160 209Z" fill="#c3a475" stroke="#8b7756"/><path d="M28 162v18l132 43v-14M299 166v18l-139 39" fill={`url(#bench-wood-${index})`}/><path d="M47 184v54M277 188v51M158 223v29" stroke="#6d6950" strokeWidth="8"/>
 <path d="M52 146v-54l37-29" stroke="#52796b" strokeWidth="5" fill="none"/><path d="M76 64l23-10 22 23-39 12Z" fill="#52796b"/><path d="M84 87l-13 61 92 10-52-79Z" fill="#f8e5a6" opacity={active?".45":".1"}/>
 {kind==="independent"?<>
 <g className={active?s.pencil:undefined}><path d="M97 124l65-17 61 19-64 22Z" fill="#f6edcd" stroke="#9a9f84"/><path d="M121 124l36-9M130 131l51-13M143 137l43-12" stroke="#809983" strokeWidth="2"/><path d="M180 100l-19 27" stroke="#ae6a47" strokeWidth="5"/></g>
 {[0,1,2].map(i=><path key={i} d={`M${212+i*3} ${144-i*5}l33-8 26 8-34 10Z`} fill={progress>i?"#789a83":"#c9c5a7"} stroke="#566e60"/>)}<path d="M231 142l7 5 14-12" stroke={done?"#e8e1b9":"transparent"} strokeWidth="3" fill="none"/>
 </>:<>
 {piece&&<g><path d="M110 135l56-14 54 16-58 18Z" fill="#557e7a" stroke="#9ab8a3"/><path d="M111 135v14l51 17v-11M220 137v14l-58 15" fill="#345d61"/>
 {piece&&status!=="waiting"&&<g className={active?s.tool:undefined}>{index===0?<><path d="M122 122l67-17M136 112l13 17M176 102l15 17" stroke="#dece98" strokeWidth="4"/><path d="M149 115l3 6M158 112l3 6M168 109l3 6" stroke="#7a856a" strokeWidth="2"/></>:index===1?<><path d="M159 96v41" stroke="#72938a" strokeWidth="12"/><path d="M141 95h37v12h-37Z" fill="#a5b49a"/><path d="M148 135h25" stroke="#d7c18a" strokeWidth="5"/></>:<><ellipse cx="163" cy="128" rx="27" ry="10" fill="#b9bfa2" stroke="#d9cf9e" strokeWidth="5"/><ellipse cx="163" cy="128" rx="13" ry="4" fill="#365e62"/><path d="M183 111l-15 14" stroke="#bf8355" strokeWidth="5"/></>}</g>}
 </g>}
 </>}
 {staffed&&<g opacity={active?1:.55}><ellipse cx="76" cy="221" rx="30" ry="10" fill="#5c7465" opacity=".4"/><path d="M61 202l-5 24M81 204l6 22" stroke="#465c5c" strokeWidth="10"/><path d="M52 171q22-16 44 0l-5 34q-22 10-36-1Z" fill={index===1?"#b27d55":"#5d8580"}/><circle cx="74" cy="150" r="16" fill="#ceb98e"/><path d="M57 149q0-25 26-17l9 13Z" fill="#425d5a"/><path className={active?s.arm:undefined} d="M91 178l26-11 20-19" stroke="#ceb98e" strokeWidth="8" strokeLinecap="round" fill="none"/></g>}
 </svg>;
}
export default function WorkBenches(){
 const [kind,setKind]=useState<WorkshopKind>("independent"),[workers,setWorkers]=useState<Staffing>(3),[beat,setBeat]=useState(0),[handover,setHandover]=useState<0|1>(1);
 const ref=useLivingPlate<HTMLDivElement>();const state=workshop(kind,workers,beat,handover);
 const changeKind=(value:WorkshopKind)=>{setKind(value);setBeat(0);};
 const note=state.phase==="complete"?state.output+" is ready. Reset to compare the other staffing arrangement."
 :state.phase==="synthesis"?"All three notes are present. One final beat combines them into the brief."
 :state.phase==="handover"?"The shared workpiece changes hands. The next operation waits for this transfer."
 :kind==="independent"?"Each archive can be searched without waiting for another archive’s findings.":"The next operation needs the workpiece produced by the previous one.";
 return <div ref={ref} className={s.workshop} data-playing="false"><div className={s.controls}><div role="group" aria-label="Choose the dependency"><button type="button" aria-pressed={kind==="independent"} onClick={()=>changeKind("independent")}>Independent searches</button><button type="button" aria-pressed={kind==="coupled"} onClick={()=>changeKind("coupled")}>One shared assembly</button></div><div role="group" aria-label="Choose the workforce">{([1,3] as const).map(n=><button key={n} type="button" aria-pressed={workers===n} onClick={()=>{setWorkers(n);setBeat(0);}}>{n===1?"One worker":"Three workers"}</button>)}</div></div>
 {kind==="coupled"&&<div className={s.handoverOption}><label><input type="checkbox" checked={handover===1} onChange={event=>{setHandover(event.target.checked?1:0);setBeat(0);}}/> Spend a beat changing hands</label><p>{workers===1?"One worker keeps the assembly, so this setting adds no transfer.":"Turn off transfer time to isolate the dependency itself."}</p></div>}
 <div className={s.clock}><div className={s.readout} aria-live="polite"><div><span>TEACHING CLOCK</span><strong>{state.beat} / {state.total} beats</strong></div><p>{note}</p></div><div className={s.actions}><button type="button" disabled={state.phase==="complete"} onClick={()=>setBeat(n=>n+1)}>Advance one beat</button><button type="button" onClick={()=>setBeat(0)}>Reset comparison</button></div></div>
 <div className={s.benches}>{state.jobs.map((job,i)=><section className={s.bench} key={i} data-working={job.status==="working"&&state.phase==="work"}><div className={s.benchHead}><span>{String(i+1).padStart(2,"0")}</span><h3>{names[kind][i]}</h3></div><Bench kind={kind} index={i} status={state.phase==="work"?job.status:job.status==="done"?"done":"waiting"} progress={job.progress} staffed={workers===3||job.status==="working"} piece={kind==="coupled"&&state.phase!=="handover"&&(job.status==="working"||(state.phase==="complete"&&i===2))}/><div className={s.benchFoot}><p>Worker {job.worker} · {job.status==="working"&&state.phase!=="work"?"waiting":job.status}</p><div className={s.progress} aria-label={job.progress+" of 3 work beats complete"}>{[0,1,2].map(n=><i key={n} data-done={job.progress>n}/>)}</div></div></section>)}</div>
 <div className={s.transfer} data-handover={state.phase==="handover"}>
 <svg viewBox="0 0 480 145" role="img" aria-label={kind==="independent"?"Three independent branches converge on one combined brief.":state.phase==="handover"?"The only workpiece moves from the completed station to the next station.":"Three operations depend on the same workpiece in sequence."}>
 {kind==="independent"?<>
 {[60,240,420].map((x,i)=><g key={x}><path d={`M${x} 40V66L240 105`} fill="none" stroke={state.jobs[i].status==="done"?"#537d67":"#9ba98b"} strokeWidth="2"/><circle cx={x} cy="28" r="19" fill="#e6dfbd" stroke="#7d9478"/><text x={x} y="34" textAnchor="middle" fontSize="17" fill="#365d50">0{i+1}</text>{state.phase==="synthesis"&&<g key={`synthesis-${i}`} className={s.noteFlight} style={{offsetPath:`path('M${x} 42V66L240 105')`}}><rect x="-7" y="-6" width="14" height="12" fill="#f3e8bd" stroke="#50765f"/><path d="M-4-2H4M-4 2H2" stroke="#50765f"/></g>}</g>)}
 <path d="M218 103h17l5 5h25v25h-47Z" fill={state.phase==="complete"?"#557e68":"#c6c5a3"} stroke="#617e63"/>{state.phase==="complete"&&<path d="M232 121l6 5 13-13" fill="none" stroke="#f0e5bb" strokeWidth="3"/>}
 </>:<>
 <path d="M81 65H218M261 65H398" stroke="#8b9d7c" strokeWidth="3"/><path d="M208 59l10 6-10 6M388 59l10 6-10 6" stroke="#8b9d7c" fill="none" strokeWidth="2"/>
 {[60,240,420].map((x,i)=><g key={x}><circle cx={x} cy="65" r="21" fill="#e6dfbd" stroke="#7d9478"/><text x={x} y="71" textAnchor="middle" fontSize="17" fill="#365d50">0{i+1}</text><text x={x} y="112" textAnchor="middle" fontSize="17" fill="#365d50">{names.coupled[i]}</text></g>)}
 {state.phase==="handover"&&<g key={state.beat} className={s.partFlight} style={{offsetPath:state.beat===3?"path('M86 65H214')":"path('M266 65H394')"}}><path d="M-14-6L0-10 14-5 0 0Z" fill="#719b90" stroke="#bdd0ab"/><path d="M-14-6V6L0 11V0M14-5V6L0 11" fill="#345d61"/></g>}
 </>}
 </svg><p>{kind==="coupled"?(state.phase==="handover"?"In transit · no bench owns the part yet":"One part · measure → cut → fit"):"Three source notes → one combined brief"}</p></div>
 <details><summary>Read the authored scheduling rules</summary><p>Each operation takes three arbitrary beats. Independent notes need one final synthesis beat. When enabled, a shared assembly changes hands for one beat between different workers; the same worker continues immediately. Quality, context loss, model speed and real costs are outside this model. Motion illustrates the current operation; only the advance button changes its progress.</p></details></div>;
}
