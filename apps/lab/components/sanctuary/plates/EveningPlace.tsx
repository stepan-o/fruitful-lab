import { memo, useId, useState } from "react";
import { Choices } from "./Controls";
import EveningVenue from "./EveningVenue";
import { useLivingPlate } from "./useLivingPlate";
import s from "./evening-place.module.css";

function Person({x,y,tone,turn=false,cloak=false}:{x:number;y:number;tone:string;turn?:boolean;cloak?:boolean}) {
  return <g transform={`translate(${x} ${y}) scale(${turn?-1:1} 1)`}>
    <ellipse cy="4" rx="17" ry="5" fill="#050d11" opacity=".55"/>
    <path d="M-8 -29L-7 -4H-2L1 -24L6 -3H12L8 -33Z" fill="#111e23" stroke="#777460" strokeWidth=".8"/>
    <path d={cloak?"M-9 -57Q1 -63 9 -54L17 -14Q2 -9 -18 -18Z":"M-9 -55Q0 -61 10 -54L12 -29L-10 -28Z"} fill={tone} stroke="#c7b48a" strokeWidth=".8"/>
    <path d="M-8 -53L-14 -37L-5 -33M10 -52L17 -37L27 -41" fill="none" stroke={tone} strokeWidth="7" strokeLinecap="round"/>
    <path d="M22 -41l7 -2" stroke="#cfb693" strokeWidth="4" strokeLinecap="round"/>
    <path d="M-5 -68Q-4 -77 3 -76Q12 -75 10 -65L5 -58L-3 -61Z" fill="#bf9d7a"/>
    <path d="M-6 -68Q-8 -81 5 -80Q14 -78 11 -69L4 -74Z" fill="#20292a"/>
    <path d="M-3 -47L4 -32M-9 -27L9 -26" stroke="#e2cd9c" opacity=".3"/>
  </g>;
}

/** Original composite scenes: no claim to reproduce a historical venue or game. */
const PlaceScene = memo(function PlaceScene({world}:{world:boolean}) {
  const id=useId().replaceAll(":","");
  if (!world) return <EveningVenue/>;
  return <svg viewBox="0 0 800 430" role="img" aria-label={world?"An invented online meeting place: travelers gather in a lantern-lit courtyard beside an adventure gate":"An imagined venue: conversation, spectators and a game share a warmly lit room"}>
    <defs>
      <linearGradient id={`${id}-wall`} x2="0" y2="1"><stop stopColor={world?"#243a40":"#3b3229"}/><stop offset="1" stopColor="#101c20"/></linearGradient>
      <radialGradient id={`${id}-warm`}><stop stopColor="#e5b36f" stopOpacity=".3"/><stop offset="1" stopColor="#d69d5b" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-gate`}><stop stopColor="#b4ccb4" stopOpacity=".48"/><stop offset="1" stopColor="#1c4546" stopOpacity=".04"/></radialGradient>
      <pattern id={`${id}-stone`} width="52" height="25" patternUnits="userSpaceOnUse"><path d="M0 24H52M26 0V24" fill="none" stroke="#b3aa82" strokeWidth=".7" opacity=".12"/></pattern>
    </defs>
    <path d="M18 274V49L92 14H710L782 49V275Z" fill={`url(#${id}-wall)`} stroke="#786e53"/>
    <path d="M18 274V49L92 14H710L782 49V275Z" fill={`url(#${id}-stone)`}/>
    <path d="M18 274L94 249H704L782 274L742 415H61Z" fill={world?"#233033":"#38382e"} stroke="#675f49"/>
    {Array.from({length:10},(_,i)=><path key={i} d={`M${95+i*67} 249L${42+i*80} 415M${62+i*5} ${276+i*14}H${765-i*2}`} stroke="#ad9b70" strokeWidth=".7" opacity=".2"/>)}
    <path d="M20 61H781M23 69H776M25 264H772" stroke="#8f7a52" strokeWidth="3"/>
    {[50,285,520,750].map(x=><g key={x}>
      <path d={`M${x-10} 67h21v202h-21Z`} fill="#1b282a" stroke="#847454"/>
      <path d={`M${x-14} 76h29v10h-29M${x-13} 250h27v12h-27`} fill="#575946" stroke="#ac9465"/>
      <path d={`M${x-5} 91v154M${x+5} 91v154`} stroke="#9f8b62" opacity=".3"/>
    </g>)}
    {[169,405,637].map(x=><g key={x}>
      <path d={`M${x-88} 243V163Q${x-88} 89 ${x} 83Q${x+88} 89 ${x+88} 163V243Z`} fill="#101e24" stroke="#817c60" strokeWidth="4"/>
      <path d={`M${x-77} 242V160Q${x-77} 102 ${x} 95Q${x+77} 102 ${x+77} 160V242`} fill="none" stroke="#a49470" opacity=".42"/>
    </g>)}
    <>
      <path d="M93 228L116 193L146 207L180 162L219 202L245 188V242H93Z" fill="#304a4a"/>
      <path d="M107 242L131 215L172 231L194 209L238 235" fill="none" stroke="#90a79b" opacity=".42"/>
      <circle cx="204" cy="144" r="19" fill="#b4b997" opacity=".7"/>
      <path d="M122 125H181L192 132H230M96 148H139L151 155H188" fill="none" stroke="#92a69a" opacity=".3" strokeWidth="5"/>
      <path d="M329 222V174L365 150L401 174V222M368 225V165L409 130L455 168V225" fill="#2c4140" stroke="#637c6e"/>
      <path d="M317 174L364 139L409 174M354 168L409 118L469 168" fill="#142a30" stroke="#a18e68" strokeWidth="3"/>
      {[352,388,425,447].map(x=><path key={x} d={`M${x} 190h7v12h-7Z`} fill="#cfaa6f" opacity=".75"/>)}
      <path d="M564 246V174Q564 117 636 111Q708 117 708 174V246Z" fill={`url(#${id}-gate)`} stroke="#7d9e8f" strokeWidth="2"/>
      <path d="M579 245V176Q579 135 636 125Q693 135 693 176V245M590 248L617 204L644 221L676 172L687 248" fill="none" stroke="#c3c8a0" opacity=".5"/>
      <path d="M567 249H706L719 270H554Z" fill="#46534a" stroke="#a29b75"/>
      <path d="M620 87l17 -22 17 22-17 16Z" fill="#c19c62"/>
        </>
    {[165,407].map(x=><g key={x}><ellipse cx={x} cy="231" rx="127" ry="137" fill={`url(#${id}-warm)`}/><path d={`M${x} 61v35M${x-12} 97h24l-4 30h-16Z`} fill="#bb9761" stroke="#ddc088"/><path d={`M${x-7} 103h14v17h-14Z`} fill="#efd5a0"/><path d={`M${x-16} 96l16 -9 16 9Z`} fill="#786746"/></g>)}
    <Person x={126} y={314} tone="#718477" cloak={world}/>
    <Person x={228} y={322} tone="#9a6c52" turn cloak={world}/>
    <path d="M171 306L158 361M186 306L202 361" stroke="#8b7450" strokeWidth="6"/>
    <ellipse cx="180" cy="303" rx="51" ry="14" fill="#796b49" stroke="#c3aa78"/>
    <ellipse cx="180" cy="301" rx="44" ry="10" fill="#454936"/>
    <path d="M164 287h8v14h-8ZM193 289h8v12h-8Z" fill="#bba06c" stroke="#ddc392"/>
    <Person x={349} y={338} tone="#a79367" cloak={world}/>
    <Person x={421} y={343} tone="#607f82" turn cloak={world}/>
    <Person x={521} y={348} tone="#948a69" cloak={world}/>
    <Person x={587} y={330} tone="#778d75" turn cloak={world}/>
    <Person x={716} y={333} tone="#986451" turn cloak={world}/>
    <path d="M72 388H732M87 397H713" stroke="#b0935e" opacity=".34"/>
    <path d="M33 279L63 404M768 279L740 404" stroke="#cbb388" opacity=".4"/>
  </svg>;
});

const views=[{
 name:"A game in the room",title:"The evening is larger than the machine.",
 people:"Some play. Some watch. Others are here for the company. The game adds a possibility to their evening.",
 work:"The venue provides the setting. An operator maintains the machine; a manufacturer made it. Those roles can belong to different businesses.",
 payment:"Coins pay for play. Other purchases can support the venue. A cabinet’s contribution need not be exhausted by its coin total.",
}, {
 name:"A world to meet in",title:"The gathering place can be part of the game.",
 people:"Friends arrange to meet; solo players pursue their own projects among others. A populated world can matter without everyone playing together.",
 work:"A provider maintains connections and activities. Players contribute company and culture. Making the game also involves caring for how people use it.",
 payment:"Sales can fund the world through copies, expansions, access or extras. Social value alone does not decide which offer fits.",
}];
export default function EveningPlace({initialWorld=false,opening=false}:{initialWorld?:boolean;opening?:boolean}) {
 const livingRef=useLivingPlate<HTMLElement>();
 const [selected,setSelected]=useState(initialWorld?1:0); const view=views[selected];
 if (opening) return <figure ref={livingRef} data-living-venue className={`${s.place} ${s.opening}`} aria-label="Study: the place around the game" data-opening>
   <div className={s.scene}><PlaceScene world={false}/></div>
   <figcaption>Original scene · an evening around the games</figcaption>
 </figure>;
 return <figure ref={livingRef} data-living-venue className={s.place} aria-label="Study: the place around the game">
   <div className={s.heading}><span>A PLACE IN THE EVENING</span><h2>{view.title}</h2></div>
   <Choices label="Where does the gathering happen?" items={views.map(v=>v.name)} value={selected} onChange={setSelected}/>
   <div className={s.scene}><PlaceScene world={selected===1}/></div>
   <div className={s.accounts} aria-live="polite">
    <section><span>01 · PEOPLE</span><p>{view.people}</p></section>
    <section><span>02 · THE WORK</span><p>{view.work}</p></section>
    <section><span>03 · PAYMENT</span><p>{view.payment}</p></section>
   </div>
   <figcaption>Original imagined settings. Change the view to follow who provides the gathering place and where payment enters. Both arrangements can coexist.</figcaption>
 </figure>;
}
