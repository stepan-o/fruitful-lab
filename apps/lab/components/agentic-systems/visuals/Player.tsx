"use client";
import {useId,useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {act,actionCost,newDesk,type DeskAction,type Fault} from "@/lib/agentic-systems/player-lab";
import s from "../visuals.module.css";
const scenarios: {id:Fault;name:string}[]=[{id:"jam",name:"A"},{id:"fatigue",name:"B"},{id:"clear",name:"C"}];
const buttons: {id:DeskAction;name:string;cost:string}[]=[{id:"inspect",name:"Inspect",cost:"1 turn"},{id:"repair",name:"Clear the guide",cost:"2 turns"},{id:"pace",name:"Slow the pace",cost:"1 turn"},{id:"produce",name:"Run production",cost:"1 turn · 2 if blocked"}];
export default function Player(){
 const ref=useLivingPlate<HTMLDivElement>();const id=useId().replaceAll(":","");
 const [state,setState]=useState(()=>newDesk("jam"));
 const jam=state.fault==="jam"&&!state.fixed,late=state.fault==="fatigue"&&!state.paced;
 const visible=state.inspected;const delivered=state.effect==="delivery";
 return <div ref={ref} className={s.instrument} data-playing="false" data-paced={state.paced}>
  <div className={s.deskTop}><div className={s.tabs} role="group" aria-label="Choose a teaching situation">{scenarios.map(sc=><button key={sc.id} type="button" aria-pressed={state.fault===sc.id} onClick={()=>setState(newDesk(sc.id))}>Situation {sc.name}</button>)}</div><p>Four turns. Maximize deliveries. Inspection opens the cover; a blocked run also costs a cleanup turn. Changing situation resets the desk.</p></div>
  <div className={s.deskLayout}>
   <div className={s.deskScene}>
    <svg viewBox="0 0 650 410" role="img" aria-label={visible ? (jam?"A crate is wedged at the guide.":late?"A clear guide, but the hand arrives after the green control window.":"A clear guide and a hand that reaches the green control window.") : "A closed inspection cover hides the fault. Only the delivery tray and warning lamp can be seen."}>
     <defs><linearGradient id={id+"metal"} x2="0" y2="1"><stop stopColor="#496665"/><stop offset="1" stopColor="#152e39"/></linearGradient><linearGradient id={id+"floor"} x2="0" y2="1"><stop stopColor="#536354"/><stop offset="1" stopColor="#193039"/></linearGradient><clipPath id={id+"inside"}><rect x="38" y="62" width="485" height="246"/></clipPath></defs>
     <rect width="650" height="410" fill="#0c1d26"/><path d="M20 38H630V329L647 379H4L20 329Z" fill={`url(#${id}metal)`} stroke="#899c8b" strokeWidth="2"/>
     <rect x="35" y="60" width="490" height="250" rx="5" fill="#102831" stroke="#a4a887" strokeWidth="3"/>
     <g key={"mechanism-"+state.sequence+"-"+state.fault} clipPath={`url(#${id}inside)`}>
      <path d="M40 258H524V307H40Z" fill={`url(#${id}floor)`}/>{[90,160,230,300,370,440,510].map(x=><path key={x} d={`M${x} 258l-30 50`} stroke="#68867b" opacity=".4"/>)}
      <path d="M60 224H420V247H60Z" fill="#3f6465" stroke="#acbfa4"/>{Array.from({length:18},(_,i)=><path key={i} d={`M${67+i*20} 227v16`} stroke="#1e3d49" strokeWidth="5"/>)}
      <path d="M82 249V278M396 249V278" stroke="#789789" strokeWidth="8"/>
      <g key={state.sequence+"cargo"} className={delivered?s.deskDelivery:undefined}>
       {[98,160].map(x=><g key={x}><path d={`M${x} 203l24-12 26 12-24 13Z`} fill="#c2b384"/><path d={`M${x} 203v22l26 11v-20Z`} fill="#52776f"/><path d={`M${x+26} 216l24-13v22l-24 11Z`} fill="#789489"/></g>)}
      </g>
      <path d="M246 126V211" stroke="#90ada1" strokeWidth="8"/><path d={jam?"M246 211l-33 23":"M246 211l30-12"} fill="none" stroke="#ddbc7f" strokeWidth="9" strokeLinecap="round" className={s.guide}/>
      {jam&&<g className={s.jammed}><path d="M208 204l21-8 22 27-25 12Z" fill="#d6a073" stroke="#e3c29a"/><path d="M208 204l18 31-22-10Z" fill="#805744"/></g>}
      {state.effect==="clear"&&state.fault==="jam"&&<g key={state.sequence+"lift"} className={s.clearedCrate}><path d="M208 204l21-8 22 27-25 12Z" fill="#d6a073" stroke="#e3c29a"/></g>}
      <path d="M314 266l3-60h35l8 60M312 266h17M350 266h22" stroke="#63838a" strokeWidth="9" fill="none"/>
      <path d="M300 156q28-21 57 0l-5 56h-43Z" fill="#91aaab" stroke="#d2d0ad"/><path d="M314 170h29v22h-29Z" fill="#294753"/><circle cx="329" cy="138" r="18" fill="#a0b3ad"/><path d="M313 135h33v10h-33Z" fill="#173842"/><path d="M318 140h16" stroke="#a8d4b6" strokeWidth="3"/>
      <g className={visible?(late?s.lateArm:s.onTimeArm):undefined}><path d={late?"M353 164l18 32 13-3":"M353 164l23 25 30-23"} fill="none" stroke="#8faeb0" strokeWidth="10" strokeLinecap="round"/><circle cx={late?385:407} cy={late?193:166} r="6" fill="#e2d4af"/></g>
      <path d="M402 175h45v11h-45ZM409 188v64M439 188v64" fill="#799c93" stroke="#c0c5a0" strokeWidth="3"/><circle cx="416" cy="165" r="8" fill="#cdb67d"/>
      <rect x="388" y="84" width="79" height="47" rx="3" fill="#10252d" stroke="#7f9c8e"/><circle cx="405" cy="106" r="7" fill="#b7d99b" className={visible?s.controlWindow:undefined} style={{animationDuration:state.paced?"4s":"2.4s"}}/><text x="421" y="110" fill="#c9cfb5" fontSize="10" fontFamily="Arial">{state.paced?"LONG":"SHORT"}</text>
      <path d="M405 130v24" stroke="#6b8e7d" strokeDasharray="3 4"/>
      <text x="78" y="292" fill="#bfd1bd" fontSize="12" fontFamily="Arial">GUIDE</text><text x="348" y="292" fill="#bfd1bd" fontSize="12" fontFamily="Arial">CONTROL WINDOW</text>
     </g>
     <g className={s.deskCover} style={{transform:visible?"translateY(-245px)":"none"}}><rect x="39" y="64" width="482" height="241" fill="#304d54" stroke="#9fac92"/>{Array.from({length:14},(_,i)=><path key={i} d={`M${57+i*33} 82v185`} stroke="#17333f" strokeWidth="10"/>)}<path d="M243 283h72" stroke="#c1b486" strokeWidth="8"/><text x="279" y="146" fill="#b9c7b4" fontSize="13" textAnchor="middle" letterSpacing="2" fontFamily="Arial">INSPECTION COVER</text></g>
     <path d="M541 218h71v90h-71Z" fill="#162d35" stroke="#90a18c"/><path d="M541 218l-10-13h71l10 13Z" fill="#506e6a"/>{state.output>0&&<g key={state.sequence+"tray"} className={delivered?s.trayArrival:undefined}>{Array.from({length:Math.min(state.output,8)},(_,i)=><path key={i} d={`M${549+(i%2)*24} ${286-Math.floor(i/2)*18}h19v12h-19Z`} fill="#c9bc8d" stroke="#e8dcab"/>)}</g>}
     <circle cx="575" cy="98" r="20" fill="#132b34" stroke="#9cad95"/><circle cx="575" cy="98" r="12" fill={state.effect==="blocked"?"#e6a377":delivered?"#b2d1a4":"#48675f"}/>
     <text x="575" y="139" fill="#d2d7bd" textAnchor="middle" fontSize="11" fontFamily="Arial">{state.effect==="blocked"?"STOPPED":delivered?"DELIVERED":"READY"}</text>
     <text x="575" y="188" fill="#ead8ad" textAnchor="middle" fontSize="31" fontFamily="monospace">{String(state.output).padStart(2,"0")}</text>
     <g>{Array.from({length:4},(_,i)=><g key={i}><rect x={52+i*44} y="341" width="32" height="18" rx="2" fill={i<state.turns?"#b9cbaa":"#213e45"} stroke="#a5ad8c"/></g>)}</g><text x="253" y="355" fill="#d0d3b8" fontSize="12" fontFamily="Arial">TURNS REMAINING</text>
    </svg>
    <div className={s.feedback} aria-live="polite"><p>{state.log.at(-1)??"The cover is closed. The tray is empty. Spend the first turn."}</p></div>
   </div>
   <div className={s.deskControls}>
    <div className={s.actions}>{buttons.map(b=><button type="button" key={b.id} disabled={state.turns<actionCost(b.id)} onClick={()=>setState(current=>act(current,b.id))}>{b.name}<small>{b.cost}</small></button>)}</div>
    <div className={s.score}><span><strong>{state.turns}</strong> turns left</span><span><strong>{state.output}</strong> delivered</span></div>
    <button className={s.replay} type="button" onClick={()=>setState(newDesk(state.fault))}>Replay situation</button>
    {state.turns===0&&<p className={s.shiftEnd}>Shift over. Compare another plan.</p>}
   </div>
  </div>
  <details className={s.attempt}><summary>Review the attempt and rules</summary><ol>{state.log.map((line,i)=><li key={i}>{line}</li>)}</ol><p>A clear, timely line yields two per run; a slower pace yields one. Clearing a guide takes two turns, even when nothing is wedged. The first failed run reveals no diagnosis through the cover. These are authored teaching rules.</p></details>
 </div>;
}
