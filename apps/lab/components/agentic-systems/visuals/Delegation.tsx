"use client";
import {useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import s from "./delegation.module.css";
import {useCompactPlate} from "./useCompactPlate";
const desks=[
 {date:"1972",author:"David Parnas",title:"A decision behind a door",control:["Store as rows","Store as a tree"],result:["The representation is a row table. The caller still receives the same sorted result.","The representation is a tree. The caller’s contract and result stay unchanged."],source:"https://www.cs.lafayette.edu/~gexia/cs301/resources/parnas.html"},
 {date:"1983",author:"Lisanne Bainbridge",title:"The exception returns",control:["Ordinary operation","Introduce a rare fault","Trace the fault","Restore the line"],result:["The machine follows its ordinary cycle. The operator watches.","The automatic path stops. The operator is summoned to diagnose an unfamiliar exception.","The operator traces the failed route. The automatic path remains stopped while this manual work happens.","A manual intervention restores the route. This model illustrates transferred responsibility, not measured recovery time or skill loss."],source:"https://gwern.net/doc/sociology/technology/1983-bainbridge.pdf"},
 {date:"1995",author:"Wooldridge & Jennings",title:"A purpose in a changing room",control:["Direct route","Obstruct the route"],result:["The courier’s goal is the destination. Its selected route crosses the room.","The goal remains. An environmental change causes the courier to select a longer route."],source:"https://www.cs.ox.ac.uk/people/michael.wooldridge/pubs/ker95/ker95-html.html"},
 {date:"1999",author:"Eric Horvitz",title:"An assistant leaves room",control:["“Let’s meet Tuesday”","“Tuesday at 2 pm”"],result:["The calendar opens at the relevant day. No exact appointment has been inferred.","The calendar can highlight a narrower slot. This study never sends an invitation."],source:"https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/"}
];
function Paper({year}:{year:string}){return <g transform="translate(18 40) rotate(-6 74 110)"><path d="M4 8h148v202H4Z" fill="#b7a98b"/><path d="M0 0h148v202H0Z" fill="#f4ead2" stroke="#7e775e"/><path d="M16 54h116M16 70h105M16 91h116M16 101h116M16 111h104M16 133h116M16 143h112M16 153h116M16 163h91" stroke="#a59e83" strokeWidth="3"/><text x="18" y="36" fill="#4e655e" fontSize="25" fontFamily="Georgia">{year}</text><path d="M42 187h64" stroke="#9f5d43" strokeWidth="3"/></g>}
export default function Delegation({study}:{study?:number}){
 const compact=useCompactPlate();const [desk,setDesk]=useState(study??0),[condition,setCondition]=useState(0);const ref=useLivingPlate<HTMLDivElement>();const d=desks[desk];const faulted=desk===1&&(condition===1||condition===2);
 return <div ref={ref} className={s.cabinet} data-playing="false">
 {study===undefined&&<div className={s.spines} role="group" aria-label="Choose a historical study">{desks.map((item,i)=><button key={item.date} type="button" aria-pressed={desk===i} onClick={()=>{setDesk(i);setCondition(0);}}><span>{item.date}</span>{item.author}</button>)}</div>}
 <div className={s.study}>
 <svg viewBox={compact?"185 25 435 395":"0 0 640 440"} role="img" aria-label={d.title+". "+d.result[condition]}>
 <rect width="640" height="440" fill="#ded2b1"/><path d="M0 360H640V440H0Z" fill="#a19270"/><path d="M0 367H640M0 400H640" stroke="#7c765e" strokeWidth="2"/><path d="M14 16H625V349H14Z" fill="#e8dec3" stroke="#b2a684"/>
 <Paper year={d.date}/>
 {desk===0&&<g>
 <path d="M213 71l64-32h251l-64 32Z" fill="#91a49a" stroke="#3c5753" strokeWidth="3"/><path d="M464 71l64-32v277l-64 31Z" fill="#526e68" stroke="#3c5753" strokeWidth="3"/><path d="M213 71h251v276H213Z" fill="#2b4948" stroke="#48675e" strokeWidth="3"/>
 <path d="M231 90H448V281H231Z" fill="#d4c8a5" stroke="#93a18b" strokeWidth="3"/>
 <g key={condition} className={s.reveal}>{condition===0?[114,151,188,225].map((y,i)=><g key={y}><rect x="249" y={y} width="181" height="25" fill={i%2?"#aebca1":"#8fa693"}/><path d={`M265 ${y+12}h147`} stroke="#415e56" strokeWidth="3"/></g>):<g fill="#809e8c" stroke="#45665c" strokeWidth="3"><path d="M340 119L277 172M340 119L404 172M277 172L252 229M277 172L313 229M404 172L382 229M404 172L426 229" fill="none"/>{[[340,119],[277,172],[404,172],[252,229],[313,229],[382,229],[426,229]].map(([x,y])=><circle key={x} cx={x} cy={y} r="14"/>)}</g>}</g>
 <rect x="261" y="295" width="159" height="17" fill="#162f32"/><path d="M279 304h122v75H279Z" fill="#f1e7c9" stroke="#766d51"/><text x="340" y="334" textAnchor="middle" fontSize="20" fill="#3e5b52" fontFamily="monospace">A · B · C</text><path d="M295 348h88M295 357h72" stroke="#8c9c81" strokeWidth="3"/><path d="M204 88v234" stroke="#b7b69a" strokeWidth="6"/><circle cx="452" cy="287" r="4" fill="#c69e64"/>
 </g>}
 {desk===1&&<g>
 <path d="M203 93H593V253H203Z" fill="#254848" stroke="#627967" strokeWidth="4"/><path d="M216 106H580V238H216Z" fill="#173737"/>
 <path d={faulted?"M240 161H363V204H484":"M240 161H550"} fill="none" stroke={faulted?"#d09c63":"#94b497"} strokeWidth="12"/><path d={faulted?"M240 161H363V204H484":"M240 161H550"} fill="none" stroke="#e4d4a1" strokeWidth="3" strokeDasharray="5 14" className={faulted?undefined:s.flow}/>
 {[255,329,405,479,553].map((x,i)=><g key={x}><circle cx={x} cy="131" r="7" fill={faulted&&i>1?"#714b3c":"#adc693"}/><path d={`M${x-15} 187v29h30v-29`} fill="none" stroke="#6d917d" strokeWidth="3"/></g>)}
 {faulted&&<g className={s.reveal}><path d="M388 116l12 24-27-4 24 22-7 17" fill="none" stroke="#e5ac70" strokeWidth="4"/><path d="M483 202l20 13-22 6" fill="#d6a56d"/></g>}
 <path d="M248 291h305l32 65H217Z" fill="#647b67" stroke="#324e48" strokeWidth="3"/>{[269,318,367].map(x=><circle key={x} cx={x} cy="322" r="12" fill="#c2b381" stroke="#f0db9e" strokeWidth="3"/>)}<rect x="425" y="307" width="101" height="27" fill={faulted?"#c88056":"#274b46"}/>
 {condition>=2&&<g key={condition} className={s.reveal}><path d="M393 252h88v49h-88Z" fill="#e9d6a4" stroke="#7a7453"/><path d="M406 265h60M406 278h37" stroke="#8d8d64" strokeWidth="3"/><circle cx="418" cy="203" r="25" fill="#d7d9aa" fillOpacity=".2" stroke="#d0b77e" strokeWidth="5"/><path d="M435 221l23 28" stroke="#d0b77e" strokeWidth="7"/></g>}
 {condition===3&&<path className={s.turnKey} d="M469 323h43M491 313v20" stroke="#ead99f" strokeWidth="6"/>}
 <g transform={condition?"translate(0 0)":"translate(-38 9)"} className={s.shift}><ellipse cx="497" cy="403" rx="59" ry="13" fill="#6b725b"/><path d="M470 397l5-59h49l14 59Z" fill="#546e69"/><circle cx="500" cy="316" r="20" fill="#b8956e"/><path d="M478 315q5-33 37-16l7 16" fill="#3c5654"/><path d="M480 350l-31-21M518 349l21-18" stroke="#405d56" strokeWidth="12" strokeLinecap="round"/></g>
 </g>}
 {desk===2&&<g>
 <path d="M196 82H603V343H196Z" fill="#afbea2" stroke="#637e6e" strokeWidth="4"/>{[243,290,337,384,431,478,525,572].map(x=><path key={x} d={`M${x} 83v259`} stroke="#8fa78d"/>)}{[129,176,223,270,317].map(y=><path key={y} d={`M197 ${y}h405`} stroke="#8fa78d"/>)}
 <path d={condition?"M235 220V117H564V220":"M235 220H564"} fill="none" stroke="#526e65" strokeWidth="22" opacity=".25"/>
 <path d={condition?"M235 220V117H564V220":"M235 220H564"} fill="none" stroke="#f5e4b8" strokeWidth="5" strokeDasharray="10 8" className={s.flow}/>
 {condition&&<g className={s.reveal}><path d="M361 167l45-21 43 21-44 22Z" fill="#b98e63"/><path d="M361 167v99l44 22v-99Z" fill="#8f6e51"/><path d="M405 189l44-22v99l-44 22Z" fill="#a78059"/><path d="M371 186l24 12M371 202l24 12" stroke="#d4b080" strokeWidth="3"/></g>}
 <g key={condition} className={s.courier} style={{offsetPath:`path("${condition?"M235 220V117H564V220":"M235 220H564"}")`,offsetRotate:"0deg"}}><ellipse cx="0" cy="7" rx="23" ry="9" fill="#718f78"/><path d="M-12 -8l-3-35h27l5 35" fill="#557e76"/><circle cx="-1" cy="-56" r="14" fill="#d1b488"/><path d="M-17 -58h32l-6-13h-20Z" fill="#334e4c"/><path d="M-10 -3v11M9 -3v11" stroke="#294c48" strokeWidth="7"/><rect x="11" y="-36" width="17" height="20" fill="#b78c5e"/></g>
 <path d="M557 178v82M557 178h32v25h-32" stroke="#486b5d" fill="#b46647" strokeWidth="4"/>
 <circle cx="235" cy="220" r="7" fill="#3d6158"/><path d="M205 359h387v14H205Z" fill="#667e69"/>
 </g>}
 {desk===3&&<g>
 <path d="M199 73H602V346H199Z" fill="#4f716e" stroke="#2d5351" strokeWidth="4"/><path d="M212 88H588V326H212Z" fill="#f0e7cc"/><path d="M213 89H587V124H213Z" fill="#8da48d"/><path d="M367 347v27M326 378h109" stroke="#405e59" strokeWidth="9"/>
 {[264,316,368,420,472,524].map(x=><path key={x} d={`M${x} 125v199`} stroke="#c4c5a6"/>)}{[163,202,241,280].map(y=><path key={y} d={`M213 ${y}h374`} stroke="#c4c5a6"/>)}
 <rect x="266" y={condition?203:126} width="49" height={condition?37:198} fill="#d4a065" opacity=".9" className={s.calendarHighlight}/><path d="M267 214h46M267 226h33" stroke="#7b633f" strokeWidth={condition?3:0}/>
 {condition===1&&<g><path d="M317 220h35" stroke="#875d35" strokeWidth="2"/><rect x="350" y="204" width="110" height="32" rx="3" fill="#395f55"/><text x="405" y="226" textAnchor="middle" fontFamily="Arial" fontSize="18" fill="#eee0b6">Tue · 2 pm</text></g>}
 {["M","T","W","T","F","S","S"].map((v,i)=><text key={i} x={237+i*52} y="113" textAnchor="middle" fontFamily="Arial" fontSize="17" fill="#314f48">{v}</text>)}
 <path d="M225 367l-12 25h348l-21-25Z" fill="#668077" stroke="#3e5d56" strokeWidth="2"/>{Array.from({length:12},(_,i)=><path key={i} d={`M${242+i*24} 376v6`} stroke="#bdc3a2" strokeWidth="16"/>)}
 </g>}
 <path d="M22 298h132M22 310h98" stroke="#a99d7d" strokeWidth="3"/><circle cx="71" cy="358" r="27" fill="#c6ad7b" stroke="#9c8560" strokeWidth="4"/><ellipse cx="71" cy="352" rx="21" ry="14" fill="#66573f"/><path d="M96 345q25-4 20 17-6 12-19 4" fill="none" stroke="#b39b70" strokeWidth="6"/>
 </svg>
 <div className={s.notes}><p className={s.date}>{d.date} · {d.author}</p><h3>{d.title}</h3><div className={s.conditions} role="group" aria-label="Change the condition">{d.control.map((label,i)=><button key={label} type="button" aria-pressed={condition===i} onClick={()=>setCondition(i)}>{label}</button>)}</div><p aria-live="polite">{d.result[condition]}</p><a href={d.source}>Read the original argument ↗</a></div>
 </div>
 </div>;
}
