"use client";
import {useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {Worker,Gear} from "./Workshop";
import {useCompactPlate} from "./useCompactPlate";
import s from "../visuals.module.css";
import TermNote from "../TermNote";
const exchanges=[
 [{from:"Builder",to:"Game",label:"Program + run",detail:"The builder proposes executable work and runs it. The test result can reject that proposal without changing the selected release."},{from:"Game",to:"Builder",label:"Captured evidence",detail:"A captured frame shows what reached one view. It does not reveal every world variable or what each character knows."}],
 [{from:"Game",to:"Player",label:"Visible event",detail:"A committed event still needs a visible presentation. The output counter and the body’s performance can disagree about how intelligible it is."},{from:"Player",to:"Game",label:"Control intent",detail:"A requested action passes through the world’s guards. A button press is not an unconditional state change."}],
 [{from:"Player",to:"Game",label:"Control intent",detail:"The player can request an action through the controls, including one the current world refuses."},{from:"Game",to:"Player",label:"Visible response",detail:"The next picture and feedback are what the player can use to revise an interpretation. Hidden state supplies no clue until the interface exposes one."}]
];
const loops=[
 {name:"Builder",verb:"Edit → run → inspect",question:"Did the proposed change improve the experience?",observation:"Receives files, tool results and captured frames.",authority:"Can change the program between runs. Its transcript is not the game state."},
 {name:"Game",verb:"Intent → guard → transition",question:"Is this action permitted in the current world?",observation:"Reads the authoritative encounter state.",authority:"Commits deterministic changes. No language model runs each character’s mind in the delivered slice."},
 {name:"Player",verb:"Notice → infer → choose",question:"What could I try, and why should it matter?",observation:"Sees bodies, dialogue and the six controls.",authority:"Acts through the interface. Cannot inspect every variable or rewrite the encounter."}
];
export default function ThreeLoops(){
 const compact=useCompactPlate();const [index,setIndex]=useState(0);const ref=useLivingPlate<HTMLDivElement>();const item=loops[index];
 return <div ref={ref} className={s.instrument} data-playing="false">
 <p className={s.compactOnly+" "+s.loopOverview}>Builder ⇄ Game ⇄ Player</p>
 <svg className={s.loopScene} viewBox={compact?["16 20 300 390","374 20 352 390","780 20 310 390"][index]:"0 0 1100 420"} role="img" aria-label={item.name+" loop selected. Three connected stations: a builder’s editing bench, the running factory, and a player’s control desk."}>
 <rect width="1100" height="420" fill="#10232d"/>
 <path d="M22 352H1078V388H22Z" fill="#384d4b" stroke="#8b967e"/><path d="M40 389v24M1060 389v24" stroke="#586b5f" strokeWidth="9"/>
 <g opacity={index===0?1:.43} className={s.loopFocus}>
  <path d="M40 91H302V281H40Z" fill="#384f55" stroke="#b8baa0" strokeWidth="3"/><path d="M51 104H291V266H51Z" fill="#0d222d"/><path d="M159 282v44M131 328h57" stroke="#7c938a" strokeWidth="8"/>
  <path d="M72 126h94M72 144h24M104 144h106M89 161h63M160 161h79M88 178h115M72 195h25M105 195h65M72 216h169" stroke="#789f91" strokeWidth="5"/>
  <rect x="68" y="228" width="205" height="22" fill="#2b4848"/><circle cx="80" cy="239" r="4" fill="#dac28f"/><path d="M96 239h120" stroke="#b6c6a2" strokeWidth="3"/>
  <path d="M66 328h217l16 17H52Z" fill="#56716e" stroke="#a0b19b"/>{[82,112,142,172,202,232,262].map(x=><path key={x} d={`M${x} 333v7`} stroke="#c0c9ac" strokeWidth="12"/>)}
  <path d="M29 303h35v40H29Z" fill="#c0ac80"/><path d="M62 310q20 0 11 23H62" fill="none" stroke="#b4a77f" strokeWidth="5"/>
  <text x="172" y="62" textAnchor="middle" fill="#e0d2ad" fontSize="22" fontFamily="Georgia">The editing bench</text>
 </g>
 <g opacity={index===1?1:.43} className={s.loopFocus}>
  <path d="M384 101H715V350H384Z" fill="#28424b" stroke="#80988b" strokeWidth="2"/><path d="M394 112H705V309H394Z" fill="#16313c"/><path d="M385 310H715V349H385Z" fill="#48645c"/>
  <path d="M401 131H699M410 113V309M686 113V309" stroke="#607f74" strokeWidth="5"/><path d="M549 110v35" stroke="#8c9a7e" strokeWidth="3"/><path d="M526 143h45l13 10h-71Z" fill="#4b6b67" stroke="#a8ad85"/><path d="M531 155h35" stroke="#e1c58d" strokeWidth="4"/>
  <path d="M573 193h95v11h-95ZM586 206v89M655 206v89" fill="#607e76" stroke="#b9b99a" strokeWidth="3"/><path d="M610 205h28v44h-28ZM596 248h55v17h-55Z" fill="#7c9589"/><path d="M575 288h95v18h-95Z" fill="#b6b291"/>
  <Worker x={522} y={232} color="#81a3aa" pose={index===1?"press":"rest"} small/><Gear x={423} y={290} r={15}/>
  <path d="M438 293h59v11h-59Z" fill="#88a399"/><path d="M450 280l15-8 18 8-17 8Z" fill="#cbbb8c"/>
  <text x="549" y="62" textAnchor="middle" fill="#e0d2ad" fontSize="22" fontFamily="Georgia">The running world</text>
 </g>
 <g opacity={index===2?1:.43} className={s.loopFocus}>
  <path d="M792 94H1052V274H792Z" fill="#586c66" stroke="#c1c3a0" strokeWidth="3"/><path d="M804 106H1040V260H804Z" fill="#132e3a"/>
  <path d="M815 213H1027V246H815Z" fill="#3d5c54"/><path d="M839 135v76h71v-76M922 158h82v58h-82Z" fill="none" stroke="#87a291" strokeWidth="4"/><circle cx="867" cy="181" r="9" fill="#c4b68d"/><path d="M860 192v24h15v-24" fill="#9cae99"/>
  <path d="M898 115h127v28H898Z" fill="#c8c6a3"/><path d="M906 125h96M906 133h73" stroke="#507067" strokeWidth="3"/>
  <path d="M908 275v40M883 317h64" stroke="#7c938a" strokeWidth="8"/><path d="M808 321h238l19 28H791Z" fill="#3a5b58" stroke="#a8b799"/>
  {[820,858,896,934,972,1010].map(x=><path key={x} d={`M${x} 327h24l4 13h-30Z`} fill="#c7ba8c" stroke="#ddcca1"/>)}
  <path d="M800 385l19-35 32-14 16 6-21 13 11 12-18 18M1045 385l-10-30-35-13-17 6 18 11-8 13 14 13" fill="#ad9074" stroke="#e0bf93" strokeWidth="2"/>
  <text x="922" y="62" textAnchor="middle" fill="#e0d2ad" fontSize="22" fontFamily="Georgia">The player’s view</text>
 </g>
 <g className={s.exchangePackets} opacity={index===0?1:.35}><path d="M326 143h25l9 9v24h-34Z" fill="#cdbb8c" stroke="#8c987f"/><path d="M351 143v9h9M333 156h13M333 163h17" fill="none" stroke="#355b54" strokeWidth="2"/></g>
 <g className={s.exchangePackets} opacity={index===0?.35:1}><rect x="733" y="145" width="38" height="29" rx="2" fill="#bfbc92" stroke="#6d907d"/><path d="M738 168l8-12 9 7 7-8 5 13Z" fill="#426f66"/></g>
 <path d="M304 183h74M718 183h68" stroke="#b6b98f" strokeWidth="3" strokeDasharray="5 5" className={s.signal}/><path d="M368 177l11 6-11 6M776 177l11 6-11 6" fill="#d8c795"/>
 <path d="M783 225h-62M379 225h-74" stroke="#709e95" strokeWidth="3" strokeDasharray="5 5" className={s.signal}/>
 </svg>
 <div className={s.tabs} role="group" aria-label="Inspect a different loop">{loops.map((loop,i)=><button key={loop.name} type="button" aria-pressed={index===i} onClick={()=>setIndex(i)}>{loop.name}</button>)}</div>
 <div className={s.exchanges} aria-label="Exchanges at the selected interface">{exchanges[index].map((exchange,i)=><div key={exchange.label} className={s.exchange}><span>{exchange.from}</span><span className={s.exchangePayload}><svg viewBox="0 0 120 20" aria-hidden="true"><path d="M0 10h115m-8-6 8 6-8 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray={i?"4 3":undefined}/></svg><TermNote term={exchange.label}>{exchange.detail}</TermNote></span><span>{exchange.to}</span></div>)}</div>
 <div className={s.loopReading} aria-live="polite"><p className={s.loopVerb}>{item.verb}</p><h3>{item.question}</h3><p>{item.observation} {item.authority}</p></div>
 </div>;
}
