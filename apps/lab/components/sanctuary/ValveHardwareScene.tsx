import {useId} from "react";
import s from "./company-evolution.module.css";

/** Original product study: handheld proportions and controls, no copied game art. */
export default function ValveHardwareScene(){
 const id=useId();
 return <g className={s.hardwareScene} strokeLinejoin="round" strokeLinecap="round">
  <defs>
   <linearGradient id={`${id}-body`} x2=".25" y2="1"><stop stopColor="#647169"/><stop offset=".2" stopColor="#354a4a"/><stop offset="1" stopColor="#172a31"/></linearGradient>
   <linearGradient id={`${id}-screen`} x2="0" y2="1"><stop stopColor="#294d57"/><stop offset=".65" stopColor="#588075"/><stop offset="1" stopColor="#162f35"/></linearGradient>
   <clipPath id={`${id}-glass`}><rect x="40" y="10" width="96" height="55" rx="2"/></clipPath>
  </defs>
  <path d="m10 150 93-37 105 42-94 38Z" fill="#253b36" stroke="#849077" strokeWidth=".7"/>
  <path d="m10 150 104 43 94-38v7l-94 38-104-42Z" fill="#10252b" stroke="#9b8b65" strokeWidth=".7"/>
  {[0,1,2,3,4].map(i=><path key={i} d={`m${28+i*17} ${144-i*7} 102 42m${30+i*18} ${158+i*7} 84-34`} stroke="#7a896c" opacity=".2" strokeWidth=".6"/>)}
  <ellipse cx="109" cy="156" rx="72" ry="15" fill="#030d14" opacity=".6"/>
  <path d="m48 140 42-17 61 24-41 17Z" fill="#586456" stroke="#b1a175"/>
  <path d="m48 140 62 24v5l-62-24Zm62 24 41-17v5l-41 17Z" fill="#223b3c" stroke="#a29266" strokeWidth=".6"/>
  <path d="m71 137 10-31 10 4-6 33m30 9 10-32 10 4-7 32" fill="#354c49" stroke="#a5ab84" strokeWidth="1.2"/>
  <g transform="matrix(1 .19 -.14 .96 22 52)">
   <path d="M13 8h150q13 0 13 16v40q0 19-15 19h-11l-9-7H35l-9 7H15Q0 83 0 65V26Q0 8 13 8Z" fill="#0b1c25" stroke="#98a48c" strokeWidth="1.1"/>
   <path d="M13 0h150q13 0 13 16v40q0 19-15 19h-11l-9-7H35l-9 7H15Q0 75 0 57V18Q0 0 13 0Z" fill={`url(#${id}-body)`} stroke="#b7b99a" strokeWidth="1"/>
   <path d="M13 3h150q10 0 10 12M3 19v36q0 15 12 16m147 0q10 0 11-13" fill="none" stroke="#d9cfaa" opacity=".42" strokeWidth=".6"/>
   <path d="M34 5v57m108-57v57" stroke="#071923" strokeWidth=".9"/>
   <rect x="37" y="7" width="102" height="61" rx="3" fill="#071720" stroke="#8d9d89" strokeWidth=".7"/>
   <g clipPath={`url(#${id}-glass)`}>
    <rect x="40" y="10" width="96" height="55" fill={`url(#${id}-screen)`}/>
    <circle cx="110" cy="23" r="9" fill="#d2c68c" opacity=".72"/>
    <path d="m40 44 17-18 9 10 18-14 16 15 20-9 16 15v22H40Z" fill="#334d4e"/>
    <path d="m40 49 23-10 20 13 16-7 37 10v10H40Z" fill="#172f37"/>
    <path d="m66 65 17-24 14 24m-14-24 2 9m2 4 3 6" fill="#697d68" stroke="#bdad78" strokeWidth=".5"/>
    <path d="M80 43V29q8-12 16 0v19m-16-9h16m-13-1v-8q5-8 10 0v11" fill="#5b7365" stroke="#a9b091" strokeWidth=".8"/>
    <path d="M84 39V30q4-7 8 0v13" fill="#cfba7d" className={s.deckGlow}/>
    <path d="M84 39V30q4-7 8 0v13" fill="#f8e1a1" opacity=".3"/>
    <path d="m106 50-1-5 2-3 2 2-1 6m-1 0-2 5m2-5 3 4" stroke="#e3c18a" strokeWidth="1.4"/>
    <rect x="43" y="13" width="19" height="2" rx="1" fill="#bdd2aa" opacity=".7"/>
    <path d="M43 61h18m62 0h9" stroke="#e0d29b" strokeWidth="1"/>
    <g className={s.deckMotes}><circle cx="75" cy="37" r=".6" fill="#f5e4b4"/><circle cx="98" cy="26" r=".6" fill="#f5e4b4"/><circle cx="111" cy="44" r=".6" fill="#f5e4b4"/></g>
    <path className={s.deckSweep} d="m31 10 22 0 27 55H59Z" fill="#d9e9cb" opacity=".08"/>
   </g>
   {[20,156].map(x=><g key={x}>
    <ellipse cx={x} cy="21" rx="9" ry="8" fill="#101f28" stroke="#6c8278"/>
    <ellipse cx={x} cy="19" rx="6.5" ry="6" fill="#3d5353" stroke="#a7b49a" strokeWidth=".65"/>
    <ellipse cx={x} cy="18" rx="4" ry="3.7" fill="#243c42"/>
    <rect x={x-8} y="45" width="16" height="14" rx="2" fill="#20383e" stroke="#809286" strokeWidth=".65"/>
    {[0,1,2].map(j=><path key={j} d={`M${x-5} ${64+j*2}h10`} stroke="#0a1c25" strokeWidth=".8"/>) }
   </g>)}
   <path d="M17 29h6v4h4v5h-4v4h-6v-4h-4v-5h4Z" fill="#11252e" stroke="#8f9b87" strokeWidth=".65"/>
   {[[156,31,"Y"],[150,37,"X"],[162,37,"B"],[156,43,"A"]].map(([x,y,label])=><g key={label}><circle cx={x} cy={y} r="2.7" fill="#132730" stroke="#899c89" strokeWidth=".6"/><text x={x} y={Number(y)+1} textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="2.8" fill="#c5c6a2">{label}</text></g>)}
   <rect x="26" y="7" width="4" height="2" rx="1" fill="#d4cb9a"/><circle cx="147" cy="8" r="1.1" fill="#c8d6b2" className={s.deckGlow}/>
   {[0,1,2,3,4,5,6,7].map(i=><path key={i} d={`M${74+i*3} 2v2`} stroke="#081d27" strokeWidth="1"/>)}
   <path d="M111 2h7" stroke="#0c202a" strokeWidth="1.5"/>
   <path d="m7 65 5 6m156-6-5 6" stroke="#749183" strokeWidth=".5"/>
  </g>
  <path d="m50 173 23 10" stroke="#d2b879" strokeWidth="1.1"/><path d="m143 175 35-14" stroke="#a89d70" strokeWidth=".6"/>
 </g>;
}
