import type { CSSProperties } from "react";
import s from "./arcade-play.module.css";

/** Original attract loop. Geometry and timing are explanatory, not an emulated ROM. */
export default function ArcadePlayfield() {
  return <g data-arcade-playfield="dungeon">
    <path d="M132 123H348V279H132Z" fill="#102c2b"/>
    <path d={Array.from({length:12},(_,i)=>`M132 ${137+i*11}H348`).join("")+Array.from({length:18},(_,i)=>`M${137+i*12} 137V260`).join("")} stroke="#75957a" strokeWidth=".45" opacity=".22"/>
    {/* A continuous passage surrounds the island. Actors never cross its walls. */}
    <path d="M169 164H281V229H169ZM307 139V252M142 251H297" fill="none" stroke="#061518" strokeWidth="13"/>
    <path d="M169 161H281V226H169ZM307 136V249M142 248H297" fill="#263f35" stroke="#6d876c" strokeWidth="7"/>
    <path d="M169 157H285M165 161V229H281M303 136V249M142 244H297" fill="none" stroke="#c0c597" strokeWidth="1"/>
    <path d={Array.from({length:9},(_,i)=>`M${176+i*12} 158v7M${176+i*12} 222v8`).join("")+Array.from({length:5},(_,i)=>`M165 ${170+i*12}h8M278 ${170+i*12}h7M303 ${147+i*20}h8`).join("")} stroke="#203b33" strokeWidth="1.4"/>
    <path d="M183 178H268V210H183Z" fill="#192f2e" stroke="#466956"/>
    <path d="M190 183h70v22h-70Z" fill="none" stroke="#8c9366" strokeWidth=".6"/>
    <path d="M206 194h11m-6-5v10m19-5h16m-8-5v10" stroke="#ac9564" strokeWidth="1.2"/>
    <g className={s.treasure} transform="translate(323 190)"><path d="M-5-5H5V4H-5Z" fill="#d4bd77"/><path d="M-7 0H7M0-7V7" stroke="#f4deb1" strokeWidth=".8"/></g>
    {["#e1bd7a","#91ccc5","#bc8564","#afbf86"].map((tone,i)=><g key={tone} className={s.adventurer} style={{animationDelay:`${-i*2.5}s`, "--rest-x":`${[154,270,295,180][i]}px`, "--rest-y":`${[146,146,237,237][i]}px`} as CSSProperties} data-arcade-actor={i}>
      <ellipse cy="5" rx="4.5" ry="1.7" fill="#06171a"/>
      <g className={s.stride} style={{animationDelay:`${-i*.13}s`}}>
        <path d="M-2-7h4v3H4V2H2V6H0V2H-2V6H-4V-2H-2Z" fill={tone}/>
        <path d="M-2-6H2" stroke="#f2dcad" strokeWidth="1.2"/><path d="M5-6V3M3-2H7" stroke="#d7d6b0" strokeWidth="1"/>
      </g>
    </g>)}
    <g className={s.guard}><path d="M319 211h7v-3h3v6h3v7h-4v-4h-7v4h-3v-7Z" fill="#c88b62"/><path d="M321 213h2m3 0h2" stroke="#f1d8a7"/></g>
    <g className={s.spell}><path d="M316 205h3v3h-3Z" fill="#efc77f"/><path d="M311 206h4" stroke="#b88954"/></g>
    <path d="M131 124H348V138H131ZM131 255H348V280H131Z" fill="#08181b"/>
    {[0,1,2,3].map(i=><g key={i} transform={`translate(${144+i*49} 131)`}>
      <path d="M0-2h5v5H0Z" fill={["#e1bd7a","#91ccc5","#bc8564","#afbf86"][i]}/>
      <path d="M9 0h27" stroke="#3c5145" strokeWidth="3"/><path d={`M9 0h${[21,15,24,18][i]}`} stroke="#a6b993" strokeWidth="2"/>
    </g>)}
    <text x="241" y="266" textAnchor="middle" fontSize="6.5" letterSpacing="1" fontFamily="monospace" fill="#cccdad">FOUR PLAYERS · ONE DUNGEON</text>
  </g>;
}
