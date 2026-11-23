"use client";
import {useId,useState} from "react";
import {useCompactPlate} from "./useCompactPlate";
import s from "../visuals.module.css";
import TermNote from "../TermNote";
const measures=[
 {id:"p95",name:"Slow tail",value:47.6,limit:33.333,max:70,unit:"ms",mark:"95th-percentile frame",pass:false,explanation:"One in twenty measured frames was at least this slow. The recorded limit was 33.333 ms."},
 {id:"stalls",name:"Long pauses",value:17,limit:6,max:24,unit:"frames",mark:"Frames over 100 ms",pass:false,explanation:"Seventeen frames exceeded 100 ms; at most six were allowed during the matched run."},
 {id:"worst",name:"Longest frame",value:596.4,limit:500,max:800,unit:"ms",mark:"Maximum frame time",pass:false,explanation:"The worst frame exceeded the 500 ms limit. A tolerable average cannot erase that interruption."},
 {id:"average",name:"Average speed",value:33.17,limit:30,max:60,unit:"FPS",mark:"Average frame rate",pass:true,explanation:"The average exceeded the 30 FPS minimum. This metric passed while the other three failed."}
];
const point=(angle:number,r:number)=>({x:500+Math.cos(angle*Math.PI/180)*r,y:265+Math.sin(angle*Math.PI/180)*r});
function arc(a:number,b:number,r:number){const p=point(a,r),q=point(b,r);return `M${p.x.toFixed(3)} ${p.y.toFixed(3)}A${r} ${r} 0 ${b-a>180?1:0} 1 ${q.x.toFixed(3)} ${q.y.toFixed(3)}`;}
export default function TimingInstrument(){
 const compact=useCompactPlate();const [index,setIndex]=useState(0);const m=measures[index];const id=useId().replaceAll(":","");const limitAngle=140+260*m.limit/m.max;const needle=140+260*m.value/m.max;const pin=point(limitAngle,170);
 return <div className={s.timing}>
 <svg viewBox={compact?"297 60 406 410":"0 0 1000 510"} role="img" aria-label={`${m.mark}: ${m.value} ${m.unit}, limit ${m.limit} ${m.unit}. ${m.pass?"Passed":"Failed"}.`}>
 <defs><radialGradient id={id+"face"}><stop stopColor="#e2d4af"/><stop offset=".8" stopColor="#c4b58c"/><stop offset="1" stopColor="#9b8e6f"/></radialGradient><linearGradient id={id+"rim"}><stop stopColor="#465e62"/><stop offset=".28" stopColor="#b9b99d"/><stop offset=".65" stopColor="#526a6d"/><stop offset="1" stopColor="#1d3740"/></linearGradient></defs>
 <rect width="1000" height="510" fill="#0c1d27"/><path d="M42 51H958V457H42Z" fill="#263d45" stroke="#839486" strokeWidth="2"/><path d="M56 67H944V442H56Z" fill="#152e38" stroke="#465e5d"/>
 {[80,920].map(x=><g key={x}>{[90,419].map(y=><g key={y}><circle cx={x} cy={y} r="7" fill="#9b9d7c"/><path d={`M${x-4} ${y}h8`} stroke="#263d42" strokeWidth="2"/></g>)}</g>)}
 <path d="M140 119H269V181H140Z" fill="#0b2029" stroke="#6e8277"/><text x="204" y="145" textAnchor="middle" fill="#c5c4a4" fontSize="13" fontFamily="monospace">HD 620</text><text x="204" y="166" textAnchor="middle" fill="#8ea69c" fontSize="11" fontFamily="monospace">1280 × 720</text>
 <path d="M730 313H861V379H730Z" fill="#0b2029" stroke="#6e8277"/><circle cx="755" cy="345" r="8" fill={m.pass?"#a8c7a0":"#cc9675"}/><text x="806" y="350" textAnchor="middle" fill="#ddd2b4" fontSize="14" fontFamily="monospace">{m.pass?"PASS":"FAIL"}</text>
 <circle cx="500" cy="265" r="194" fill={`url(#${id}rim)`} stroke="#c5bc96" strokeWidth="2"/><circle cx="500" cy="265" r="181" fill="#182c32" stroke="#1c3238" strokeWidth="7"/><circle cx="500" cy="265" r="173" fill={`url(#${id}face)`}/>
 <path d={arc(140,400,154)} fill="none" stroke="#7f8776" strokeWidth="14"/>
 <path d={arc(m.pass?limitAngle:140,m.pass?400:limitAngle,154)} fill="none" stroke="#446c61" strokeWidth="14"/>
 {Array.from({length:41},(_,i)=>{const angle=140+i*6.5;const p=point(angle,i%5===0?129:137),q=point(angle,146);return <path key={i} d={`M${p.x} ${p.y}L${q.x} ${q.y}`} stroke="#293f43" strokeWidth={i%5===0?2:1}/>;})}
 {Array.from({length:5},(_,i)=>{const p=point(140+i*65,112);return <text key={i} x={p.x} y={p.y+5} textAnchor="middle" fill="#243e42" fontSize="18" fontFamily="monospace">{Math.round(m.max*i/4)}</text>;})}
 <path d={arc(limitAngle-.2,limitAngle+.2,169)} stroke="#a44f38" strokeWidth="12"/><circle cx={pin.x} cy={pin.y} r="5" fill="#a44f38"/>
 <g style={{transform:`rotate(${needle}deg)`,transformOrigin:"500px 265px",transition:"transform .65s ease"}}><path d="M473 259L635 265L473 271Z" fill="#8e3f2e"/><path d="M500 263H631" stroke="#cc9a70"/></g><circle cx="500" cy="265" r="12" fill="#334e51" stroke="#d0bf8e" strokeWidth="3"/>
 <text x="500" y="339" textAnchor="middle" fill="#253e42" fontSize="28" fontFamily="Georgia">{m.value}</text><text x="500" y="362" textAnchor="middle" fill="#4e615b" fontSize="18" fontFamily="Arial">{m.unit}</text>
 <path d="M145 326H255M145 341H255M145 356H232" stroke="#4e6968" strokeWidth="3"/>
 <text x="500" y="478" textAnchor="middle" fill="#a7b5a5" fontSize="11" fontFamily="Arial" letterSpacing="2">FULL SCENE · TWO DAY 1 RUNS · 26 OCT 2026</text>
 </svg>
 <p className={s.compactOnly+" "+s.plateQualifier}>Intel HD 620 · 1280 × 720 · full scene<br/>Two complete Day 1 runs · 26 Oct 2026<br/><strong>{m.pass?"PASS":"FAIL"}</strong></p>
 <div className={s.tabs} role="group" aria-label="Choose a recorded performance measure">{measures.map((item,i)=><button key={item.id} type="button" aria-pressed={index===i} onClick={()=>setIndex(i)}>{item.name}</button>)}</div>
 <div className={s.measureReading}><TermNote term="Matched conditions">A timing limit belongs to the specified workload, device, resolution and run length. Changing those conditions creates a different comparison.</TermNote><div aria-live="polite"><h3>{m.mark}</h3><p><strong>{m.value} {m.unit}</strong> observed · {m.pass?"minimum":"maximum"} <strong>{m.limit} {m.unit}</strong></p><p>{m.explanation}</p><p className={s.measureKey}>Green arc: allowed range. Red rim mark: recorded acceptance limit. These are summary measurements, not a reconstructed frame trace.</p></div></div>
 </div>;
}
