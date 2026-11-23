"use client";
import {actors,control,same,type MiniWorld,type ActorId} from "@/lib/agentic-systems/mini-world";
import s from "./world.module.css";
const iso=(x:number,y:number)=>[220+(x-y)*68,90+(x+y)*30];
const cell=(x:number,y:number)=>{const a=iso(x,y),b=iso(x+1,y),c=iso(x+1,y+1),d=iso(x,y+1);return `M${a}L${b}L${c}L${d}Z`;};
export default function WorldBoard({state,selected,close=false}:{state:MiniWorld;selected:ActorId;close?:boolean}){
 const s1=state,active=s1.active;
 const depth=(actor:ActorId)=>s1.positions[actor][0]+s1.positions[actor][1];
 const ordered=[...actors].sort((a,b)=>depth(a)-depth(b));
 const drawWorker=(actor:ActorId)=>{const [x,y]=s1.positions[actor],point=iso(x+.5,y+.5);return <g key={actor} className={s.worker} style={{transform:`translate(${point[0]}px,${point[1]}px)`}}>
 <ellipse cy="3" rx="22" ry="10" fill="#10333a"/>{actor===selected&&<ellipse cy="3" rx="28" ry="13" fill="none" stroke="#ecd89d" strokeWidth="2" strokeDasharray="4 3"/>}
 <path d="M-10-25l-3 23M10-25l6 23" stroke={actor==="bob"?"#94b3b5":"#c5a87e"} strokeWidth="9" strokeLinecap="round"/><path d="M-19 1h14M9 1h15" stroke="#c3c5a2" strokeWidth="5"/>
 <path d="M-16-63Q0-71 16-63L13-27Q0-20-13-27Z" fill={actor==="bob"?"#89aab1":"#b8a175"} stroke="#d0d4b6"/><path d="M-7-55h14v16H-7Z" fill="#294b56"/><circle cy="-82" r="15" fill="#b9c6af"/><path d="M-14-84h28v10H-14Z" fill="#244953"/><path d="M-10-79h12" stroke="#c1dbab" strokeWidth="2"/>
 <path d="M-17-58L-25-35M17-58l9 23" stroke={actor==="bob"?"#8dacb1":"#bca47d"} strokeWidth="7" strokeLinecap="round"/>
 {s1.card===actor&&<g><path d="M21-36l15-5 4 18-15 5Z" fill="#e8c47d" stroke="#f2dc9b"/><path d="M27-30l6-2" stroke="#8d8657" strokeWidth="2"/></g>}
 </g>;};
 return <svg viewBox={close?"258 102 305 230":"0 0 640 410"} role="img" aria-label={`Small factory. Card with ${s1.card}; press reserved by ${s1.reserved??"nobody"}. Bob has made ${s1.made.bob}, Ed ${s1.made.ed}. ${active?"Cycle in progress.":"Press idle."}`}>
 <defs><linearGradient id={close?"mini-floor-close":"mini-floor"} x2="0" y2="1"><stop stopColor="#74958a"/><stop offset="1" stopColor="#456f68"/></linearGradient></defs>
 <rect width="640" height="410" fill="#122b32"/><ellipse cx="310" cy="342" rx="276" ry="47" fill="#071e28" opacity=".75"/>
 <path d="M16 180L356 330L560 240V261L356 352L16 202Z" fill="#25474d" stroke="#79938a"/>
 {Array.from({length:3},(_,y)=>Array.from({length:5},(_,x)=><path key={x+"-"+y} d={cell(x,y)} fill={same([x,y],control)?"#bb9c65":`url(#${close?"mini-floor-close":"mini-floor"})`} stroke="#9db09b" strokeWidth="1.1"/>))}
 <path d="M16 180V101L220 11L560 161V240" fill="none" stroke="#3c6262" strokeWidth="8"/><path d="M16 101L220 11L560 161" fill="none" stroke="#98aa91" strokeWidth="3"/>
 {[0,2].map(y=>{const [x1,y1]=iso(2,y);return <g key={y}><path d={`M${x1} ${y1}v-54l68 30v54Z`} fill="#6c7f68" stroke="#a5aa83"/><path d={`M${x1+68} ${y1+30}l-68 30v-54l68-30Z`} fill="#526e65" stroke="#94a88a"/><path d={`M${x1} ${y1-54}l68 30-68 30-68-30Z`} fill="#a0ad8d" stroke="#adb99a"/></g>;})}
 {ordered.filter(actor=>depth(actor)<4).map(drawWorker)}
 <g transform="translate(424 270)"><ellipse cy="5" rx="60" ry="20" fill="#133840"/><path d="M-48-24L0-45 54-23 5 0Z" fill="#7e9a89"/><path d="M-48-24V-37L0-58 54-36V-23" fill="#a5b19a" stroke="#d6cba0"/><path d="M-36-40V-135M40-42V-134" stroke="#78988e" strokeWidth="12"/><path d="M-53-143h108v15H-53Z" fill="#bcc0a0" stroke="#d3c79c"/><path d="M-9-126h22v44h-22Z" fill="#5a7e75"/><g className={s.ram} style={{transform:`translateY(${active?.remaining===1?25:0}px)`}}><path d="M-21-84h49v14h-49Z" fill="#acb89a"/><path d="M-13-70h33v15h-33Z" fill="#5d8176"/></g><path d="M-44-36l39-16 39 16" fill="none" stroke="#d1b477" strokeWidth="4"/><circle cx="-46" cy="-116" r="7" fill={active?"#dbc58a":"#6d9988"}/></g>
 <g transform="translate(356 240)"><path d="M-20-9l21-9 23 10-22 9Z" fill="#e1c68c" stroke="#e5d4a0"/><path d="M-20-9v18l22 10V1M24-8v17L2 19" fill="#8e986f" stroke="#b9b58c"/><circle cy="-6" r="5" fill={s1.reserved?"#c3dfac":"#4e7666"}/></g>
 {ordered.filter(actor=>depth(actor)>=4).map(drawWorker)}
 <g transform="translate(501 307)"><path d="M-25-10l33-14 42 17-33 15Z" fill="#78917c"/><path d="M-25-10v15l42 17V8M50-7V8L17 22" fill="#456d65" stroke="#98ad90"/>{actors.map((a,i)=>s1.made[a]>0&&<path key={a} className={s.output} d={`M${-12+i*25} ${-13+i*9}l17-7 18 7-17 8-18-8v-11l17-7 18 7v11`} fill={a==="bob"?"#a1c2bd":"#cfaf7e"} stroke="#e2d5a2"/>)}</g>
 {!close&&<><path d="M45 374h188M421 374h171" stroke="#688c7b"/><text x="320" y="381" textAnchor="middle" fill="#b5c7b0" fontFamily="Arial" fontSize="15">ONE PRESS · ONE CARD</text></>}
 </svg>;
}
