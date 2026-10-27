"use client";
import {useId,useState} from "react";
import {commissionFields,commissionExamples,commissionMarkdown,type Commission} from "@/lib/agentic-systems/commission";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {useCompactPlate} from "./useCompactPlate";
import s from "./closure.module.css";
export default function CommissionDesk(){
 const [fields,setFields]=useState<Commission>({...commissionExamples[0].fields}),[section,setSection]=useState(0),[example,setExample]=useState(0),[notice,setNotice]=useState("Edits stay in this page until you download them. Reloading discards them."),ref=useLivingPlate<HTMLDivElement>(),compact=useCompactPlate(),id=useId().replaceAll(":","");
 const selected=commissionFields[section],filled=commissionFields.filter(f=>fields[f.key].trim()).length,text=commissionMarkdown(fields);
 function download(){const url=URL.createObjectURL(new Blob([text],{type:"text/markdown;charset=utf-8"}));const anchor=document.createElement("a");anchor.href=url;anchor.download="production-commission.md";anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice("Download requested. Review the resource allowance and named decision owners before using this draft.");}
 return <div ref={ref} className={s.study} data-playing="false">
 <div className={s.selectors}><label>Example brief<select value={example} onChange={e=>setExample(Number(e.target.value))}>{commissionExamples.map((e,i)=><option key={e.name} value={i}>{e.name}</option>)}</select></label><div className={s.actions}><button onClick={()=>{setFields({...commissionExamples[example].fields});setNotice("Example loaded; it replaces the page’s previous edits. This is a proposed agreement; no work or service change has been dispatched.");}}>Load example into sheet</button></div></div>
 <div className={s.cabinet}><svg viewBox={compact?"180 40 530 390":"0 0 900 470"} role="img" aria-label={"Open commissioning binder. Section "+(section+1)+" of eight: "+selected.label+". "+filled+" fields contain text; no work has been dispatched."}>
 <defs><linearGradient id={id+"desk"} x2="1" y2=".3"><stop stopColor="#8f8b66"/><stop offset=".5" stopColor="#bcaa79"/><stop offset="1" stopColor="#737c60"/></linearGradient></defs>
 <rect width="900" height="470" fill="#24454a"/><path d="M0 50H900M0 76H900M0 420H900" stroke="#637f70"/><path d="M25 103H861L900 413H0Z" fill={`url(#${id}desk)`}/><path d="M0 413H900V440H0Z" fill="#56654e"/>
 <path d="M177 63l489-8 57 347-530 5Z" fill="#183b3f" stroke="#8c9d7c" strokeWidth="5"/><path d="M201 80l438-5 47 306-470 5Z" fill="#d2c298" stroke="#706e51" strokeWidth="3"/>
 <g key={section} className={s.binderLeaf}><path d="M230 96l392-4 36 271-402 7Z" fill="#e2d0a7"/>{[0,1,2,3,4].map(i=><path key={i} d={`M275 ${208+i*26}h324`} stroke="#a6af91"/>)}<text x="444" y="142" textAnchor="middle" fontSize={compact?22:17} fontFamily="Arial" fill="#496052">COMMISSION · {String(section+1).padStart(2,"0")}</text><text x="444" y="181" textAnchor="middle" fontSize={compact?26:24} fontFamily="Georgia" fill="#31574b">{selected.label}</text><rect x="286" y="231" width={70+(section%4)*42} height="8" fill="#739782"/><rect x="286" y="283" width={126+(section%3)*34} height="8" fill="#b49262"/><text x="444" y="344" textAnchor="middle" fontSize={compact?19:13} fontFamily="Arial" fill="#795e45">DRAFT · NOT DISPATCHED</text></g>
 {[0,1,2,3,4].map(i=><g key={i}><ellipse cx={236+i*5} cy={126+i*47} rx="15" ry="8" fill="none" stroke="#6c795e" strokeWidth="5"/><path d={`M${224+i*5} ${124+i*47}q9-9 23 0`} stroke="#d0bc83" strokeWidth="4" fill="none"/></g>)}
 <g className={s.pen}><path d="M745 330l37-153" stroke="#244440" strokeWidth="10"/><path d="M752 305l32-133" stroke="#c5b584" strokeWidth="4"/><path d="M744 331l-2 18 9-15Z" fill="#283b35"/></g>
 <path d="M58 197h91v115H58Z" fill="#647e6d" stroke="#233f3e" strokeWidth="4"/><path d="M65 207h77v95H65Z" fill="#ced0aa"/><text x="103" y="250" textAnchor="middle" fill="#436454" fontSize="21">{filled}/8</text><text x="103" y="277" textAnchor="middle" fill="#436454" fontSize="11">TEXT FILLED</text>
 </svg></div>
 <p className={s.note}>The example’s resource limits and decision owners still need to be assigned.</p>
 <div className={s.tabs} role="group" aria-label="Commission sections">{commissionFields.map((f,i)=><button key={f.key} aria-pressed={section===i} onClick={()=>setSection(i)}>{i+1}. {f.label}</button>)}</div>
 <div className={s.editor}><h3>{selected.prompt}</h3><label>{selected.label}<textarea value={fields[selected.key]} onChange={e=>setFields({...fields,[selected.key]:e.target.value})}/></label><div className={s.actions}><button onClick={download}>Download your commission</button><a href="/agentic-systems/checkpoints/production-protocol.md" download>Download the operating protocol ↗</a></div><p className={s.notice} role="status">{notice}</p></div>
 <details className={s.details}><summary>Read the complete sheet</summary><pre className={s.preview}>{text}</pre></details>
 </div>;
}
