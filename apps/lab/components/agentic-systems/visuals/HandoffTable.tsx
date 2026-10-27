"use client";
import {useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import s from "./handoff.module.css";
const cases=[
 {name:"Missing field",stop:1,label:"The packet cannot identify its process group.",body:"A field required by the reused validator was missing from the contained-build handoff. The boundary between preparation and execution rejected the packet.",stamp:"INCOMPLETE",unknown:"No compilation result; no memory requirement established."},
 {name:"Changed parent",stop:1,label:"A legitimate host change looks invalid.",body:"Another validation version rejected a legitimate change in the preview server’s parent process. More detailed instructions did not make that assumption correct.",stamp:"REJECTED",unknown:"The failure concerns a host assumption, not the game’s memory demand."},
 {name:"Lint first",stop:2,label:"The applied layers reach a different gate.",body:"A later attempt applied the presentation layers, then stopped at a lint error before compilation. Crossing one boundary did not mean the build had run.",stamp:"STOPPED",unknown:"The compiler remains unobserved in this attempt."}
];
export default function HandoffTable(){
 const [which,choose]=useState(0),ref=useLivingPlate<HTMLDivElement>();const item=cases[which];
 return <div ref={ref} className={s.table} data-playing="false"><div className={s.tabs} role="group" aria-label="Inspect a recorded handoff failure">{cases.map((c,i)=><button key={c.name} type="button" aria-pressed={i===which} onClick={()=>choose(i)}>{c.name}</button>)}</div>
 <svg viewBox="0 0 840 340" role="img" aria-label={item.label+" "+item.unknown}>
 <defs><pattern id="handoff-paper" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="#a9b498" strokeWidth=".7"/></pattern></defs><rect width="840" height="340" fill="#d8d2b7"/><rect x="20" y="15" width="800" height="295" fill="url(#handoff-paper)"/>
 <path d="M32 268H807v22H32Z" fill="#9a8768"/><path d="M46 290v35M790 290v35" stroke="#645f4c" strokeWidth="10"/>
 <g transform="translate(100 145)"><path d="M-49-57h99v82h-99Z" fill="#526e64" stroke="#a7b18d" strokeWidth="5"/><path d="M-39-47h79v61h-79Z" fill="#203f42"/><path d="M-27-33h36M-27-19h55M-27-5h24" stroke="#a6c69d" strokeWidth="4"/><path d="M-6 26v24M-34 53h58l24 18h-107Z" stroke="#647e6e" strokeWidth="9" fill="#809880"/></g>
 <text x="100" y="65" textAnchor="middle" fill="#405f50" fontSize="21" fontFamily="Georgia">1</text><path d="M177 182H720" stroke="#a0ab8b" strokeWidth="8"/><path d={`M177 182H${item.stop===1?350:549}`} stroke="#496e61" strokeWidth="5" strokeDasharray="10 7"/>
 {[350,550,740].map((x,i)=><g key={x} transform={`translate(${x} 0)`} opacity={i>item.stop-1?.4:1}><path d="M-45 231V115h90v116" fill="none" stroke={i===item.stop-1?"#a36d49":"#6b8772"} strokeWidth="12"/><path d="M-54 106h108v16H-54Z" fill="#a7b18d"/><path d="M-26 231v35M26 231v35" stroke="#677a64" strokeWidth="7"/><text y="65" textAnchor="middle" fill="#405f50" fontSize="21" fontFamily="Georgia">{i+2}</text><circle cy="94" r="9" fill={i===item.stop-1?"#bb7751":"#718f70"}/><path d="M-29 151h58M-29 169h58M-29 187h58" stroke="#8e9f7f" strokeWidth="5"/>{i===item.stop-1&&<path d="M-25 135l50 74M25 135l-50 74" stroke="#b16a49" strokeWidth="5"/>}</g>)}
 <g key={which} transform={`translate(${item.stop===1?279:478} 136)`}><g className={s.packet}><path d="M-39-35h69l14 15v91h-83Z" fill="#f3e7c3" stroke="#9c967a" strokeWidth="2"/><path d="M30-35v15h14" fill="none" stroke="#9c967a" strokeWidth="2"/><path d="M-26-15h43M-26-1h47M-26 13h30M-26 39h47" stroke="#788f75" strokeWidth="3"/><path d="M-27 23h45" stroke={which===0?"#b66f4d":"#8ba07c"} strokeWidth="6" strokeDasharray={which===0?"4 4":undefined}/></g></g>
 <path d="M694 274h96l-10-27h-76Z" fill="#81967d"/><path d="M706 246v-40h67v40" fill="#6a8777" stroke="#8fa187"/>
 </svg>
 <ol className={s.route}><li>1 · Prepare packet</li><li data-stop={item.stop===1}>2 · Validate handoff</li><li data-stop={item.stop===2}>3 · Check source</li><li>4 · Compile</li></ol>
 <div className={s.result} aria-live="polite"><span>{item.stamp}</span><h3>{item.label}</h3><p>{item.body}</p><p className={s.unknown}>{item.unknown}</p></div>
 </div>;
}
