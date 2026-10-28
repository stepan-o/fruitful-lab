"use client";
import {useState} from "react";
import {useCompactPlate} from "./useCompactPlate";
import s from "../visuals.module.css";
const points=[
 {name:"Support",text:"Start at the feet. Does the body remain supported while it approaches the control?",where:[165,351,677,351]},
 {name:"Contact",text:"Follow the hand to the raised control. A production reward cannot establish that the hand reached it.",where:[318,221,836,217]},
 {name:"Recovery",text:"Watch beyond the press. The hand should withdraw before the group response takes your attention elsewhere.",where:[297,190,792,173]}
];
export default function BodyStudy(){
 const compact=useCompactPlate();const [pose,setPose]=useState(0);const [index,setIndex]=useState(0);const p=points[index];
 return <div>
 <div className={s.compactOnly}><div className={s.poseTabs} role="group" aria-label="Choose a pose to examine"><button type="button" aria-pressed={pose===0} onClick={()=>setPose(0)}>Rejected lunge</button><button type="button" aria-pressed={pose===1} onClick={()=>setPose(1)}>Selected correction</button></div></div>
 <svg viewBox={compact?(pose===0?"0 80 500 325":"510 80 490 325"):"0 0 1000 440"} role="img" aria-label={"A schematic comparison of a forward lunge and a supported reach, emphasizing "+p.name.toLowerCase()}>
 <rect width="1000" height="440" fill="#10232d"/>
 {[0,510].map((x,i)=><g key={x} transform={`translate(${x} 0)`}>
  <path d="M25 42H478V374H25Z" fill="#1b3540" stroke="#58776f"/><path d="M26 298H477V373H26Z" fill="#324b4c"/>{[77,157,237,317,397].map(xx=><path key={xx} d={`M${xx} 298l-36 75`} stroke="#59746a" opacity=".6"/>)}<path d="M26 330H477M26 355H477" stroke="#58776e" opacity=".4"/>
  <path d="M355 112H438V126H355ZM367 126V297M425 126V297" fill="#75958b" stroke="#b0b89a" strokeWidth="4"/><path d="M387 128h17v72h-17Z" fill="#657f7a"/><path d="M371 196h48v18h-48Z" fill="#b0b59a"/><path d="M354 289h86v21h-86Z" fill="#87998a"/>
  <path d="M302 232l40-11 14 13-39 14Z" fill="#96aba0" stroke="#d1cc9f"/><path d="M315 249v49M342 241v57" stroke="#76978c" strokeWidth="5"/><circle cx="329" cy="228" r="7" fill="#d8b880"/>
  <text x="46" y="71" fill="#c9c8a7" fontSize="12" letterSpacing="1.5" fontFamily="Arial">{i===0?"REJECTED LUNGE":"SELECTED CORRECTION"}</text>
 </g>)}
 <ellipse cx="181" cy="352" rx="81" ry="9" fill="#071923"/>
 <path d="M235 252L186 316L144 350M250 259L221 320L195 351" stroke="#809c9c" strokeWidth="18" strokeLinecap="round" fill="none"/><path d="M128 354h40M180 356h37" stroke="#c0bca0" strokeWidth="9"/>
 <g transform="rotate(42 241 244)"><path d="M212 171Q240 156 268 171L263 247Q240 259 218 248Z" fill="#89a4a8" stroke="#ccd2b7" strokeWidth="2"/><path d="M222 190h34v37h-34Z" fill="#304b59"/><path d="M228 159v-12h22v13" fill="#799896"/><circle cx="238" cy="130" r="23" fill="#a1b4ad"/><path d="M217 128h43v12h-43Z" fill="#102f3a"/><path d="M222 133h21" stroke="#b1d7b9" strokeWidth="3"/></g>
 <path d="M288 211L312 234L331 222" fill="none" stroke="#8aa7a9" strokeWidth="14" strokeLinecap="round"/><circle cx="332" cy="220" r="7" fill="#d9d1b0"/>
 <path d="M236 259L158 348" stroke="#d2a07b" strokeDasharray="5 5" strokeWidth="2"/>
 <ellipse cx="702" cy="353" rx="57" ry="9" fill="#071923"/>
 <path d="M685 257L682 307L675 349M716 258L728 307L739 349" fill="none" stroke="#819fa0" strokeWidth="18" strokeLinecap="round"/><path d="M657 353h38M725 353h34" stroke="#c0bca0" strokeWidth="9"/>
 <path d="M670 171Q699 159 726 171L724 259Q699 269 679 256Z" fill="#8da8ab" stroke="#ccd2b7" strokeWidth="2"/><path d="M684 187h30v40h-30Z" fill="#304b59"/>
 <path d="M690 161v-12h20v13" fill="#799896"/><circle cx="700" cy="130" r="23" fill="#a1b4ad"/><path d="M679 128h43v12h-43Z" fill="#102f3a"/><path d="M684 133h21" stroke="#b1d7b9" strokeWidth="3"/>
 <path d="M725 181L773 219L828 214" fill="none" stroke="#8faeb0" strokeWidth="14" strokeLinecap="round"/><circle cx="830" cy="215" r="7" fill="#e0d5ae"/>
 <path d="M679 180L657 222L669 251" fill="none" stroke="#6d9197" strokeWidth="12" strokeLinecap="round"/>
 <path d="M700 266V346" stroke="#b5cc9e" strokeDasharray="5 5" strokeWidth="2"/>
 {index===2&&<g><path d="M331 219Q325 169 285 169M832 211Q836 160 778 168" fill="none" stroke="#dab87e" strokeWidth="3" strokeDasharray="7 5"/><path d="M283 169l14-8v17ZM777 168l15-8v17Z" fill="#dab87e"/></g>}
 <g className={s.attentionRing}>{[0,2].map(n=><circle key={n} cx={p.where[n]} cy={p.where[n+1]} r={index===0?42:30} fill="none" stroke={n===0?"#dba47f":"#c2d9a7"} strokeWidth="3"/>)}</g>
 <text className={s.wideOnly} x="500" y="416" textAnchor="middle" fill="#aebfac" fontSize="12" fontFamily="Arial">AUTHORED WATCHING GUIDE · POSES ARE SCHEMATIC, NOT MEASURED MOTION</text>
 </svg>
 <p className={s.compactOnly+" "+s.plateQualifier}>Authored watching guide. Schematic poses, not measured motion.</p>
 <div className={s.tabs} role="group" aria-label="Choose an action feature">{points.map((point,i)=><button type="button" key={point.name} onClick={()=>setIndex(i)} aria-pressed={i===index}>{point.name}</button>)}</div>
 <p className={s.bodyReading} aria-live="polite">{p.text}</p>
 </div>;
}
