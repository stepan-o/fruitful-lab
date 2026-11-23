import { useId } from "react";
import {useCompactPlate} from "./useCompactPlate";
import s from "../visuals.module.css";
export function Worker({x,y,color="#829ba1",pose="rest",small=false}:{x:number;y:number;color?:string;pose?:string;small?:boolean}) {
 return <g transform={`translate(${x} ${y}) scale(${small?.75:1})`}>
  <ellipse cx="0" cy="77" rx="25" ry="7" fill="#020a0c" opacity=".65"/>
  <path d="M-13 39L-15 72L-24 75L-24 79L-9 79L-5 44M6 43L10 73L6 77L24 77L23 73L17 38" fill="#263b43" stroke="#71858a" strokeWidth="1.5"/>
  <path d="M-19 0Q0-8 18 0L15 42Q0 50-15 42Z" fill={color} stroke="#b4beb0" strokeWidth="1.2"/>
  <path d="M-11 9H11V26H-11Z" fill="#223b42"/><path d="M-8 12H8M-8 16H5M-8 20H8" stroke="#789b9b" strokeWidth="1"/>
  <path d="M-5-9V1H6V-9" fill="#657b7e"/><path d="M-12-28L9-29L15-17L11-7L-11-8L-16-17Z" fill="#9ea8a1" stroke="#d1c6aa"/>
  <path d="M-13-20L12-22L13-15L-11-14Z" fill="#102e36"/><path d="M-8-18H5" stroke="#99dfd0" strokeWidth="2.5"/>
  <g className={pose==="press"?s.pressArm:undefined}><path d="M14 5L28 23L43 13" fill="none" stroke="#314e57" strokeWidth="9" strokeLinecap="round"/><path d="M14 5L28 23L43 13" fill="none" stroke={color} strokeWidth="6"/><circle cx="44" cy="12" r="4" fill="#bcc5b3"/></g>
  <path d="M-17 5L-24 27L-20 43" fill="none" stroke="#405d65" strokeWidth="8" strokeLinecap="round"/><path d="M-18 8L-23 26" stroke={color} strokeWidth="5"/><circle cx="-20" cy="44" r="4" fill="#acb8ac"/>
 </g>;
}
export function Gear({x,y,r=16}:{x:number;y:number;r?:number}) {
 return <g transform={`translate(${x} ${y})`}><g className={s.gear}>
 {Array.from({length:12},(_,i)=><path key={i} d={`M-3 ${-r-4}h6v9h-6Z`} transform={`rotate(${i*30})`} fill="#6d807d"/>)}
 <circle r={r} fill="#263c42" stroke="#a28c65" strokeWidth="3"/><circle r={r*.5} fill="#0e2029" stroke="#738983" strokeWidth="2"/>
 <path d={`M0 ${-r+3}V${r-3}M${-r+3} 0H${r-3}`} stroke="#82968b" strokeWidth="3"/></g><circle r="3" fill="#d8bb7c"/></g>;
}
export default function Workshop({stage=1,fault=false}:{stage?:number;fault?:boolean}) {
 const id=useId().replaceAll(":","");const compact=useCompactPlate();
 const frame=compact?(stage===0?"65 150 250 250":stage===1?"680 150 270 335":"0 0 1000 510"):"0 0 1000 510";
 return <svg viewBox={frame} role="img" aria-label={compact&&stage===0?"Checkpoint detail: the empty desk slot, transfer arrow and card at Ed.":compact&&stage===1?"Production detail: Max at the press, with three completed outputs in the tray below.":"An illustrated factory cutaway: checkpoint at left, conveyor in the centre and a press at right"}>
 <defs>
  <linearGradient id={id+"wall"} x2="0" y2="1"><stop stopColor="#263c42"/><stop offset="1" stopColor="#10252d"/></linearGradient>
  <linearGradient id={id+"floor"} x2="0" y2="1"><stop stopColor="#3b4d4b"/><stop offset="1" stopColor="#152a30"/></linearGradient>
  <linearGradient id={id+"steel"}><stop stopColor="#1c333c"/><stop offset=".45" stopColor="#78928f"/><stop offset=".52" stopColor="#a1a593"/><stop offset="1" stopColor="#344d52"/></linearGradient>
  <linearGradient id={id+"belt"} x2="0" y2="1"><stop stopColor="#627d7b"/><stop offset=".45" stopColor="#233e47"/><stop offset="1" stopColor="#11242c"/></linearGradient>
  <radialGradient id={id+"lamp"}><stop stopColor="#f7d99a" stopOpacity=".4"/><stop offset="1" stopColor="#e8bd72" stopOpacity="0"/></radialGradient>
  <pattern id={id+"brick"} width="70" height="38" patternUnits="userSpaceOnUse"><path d="M0 0H70M0 38H70M35 0V19M0 19H70M0 19V38M70 19V38" fill="none" stroke="#91a39a" strokeOpacity=".11"/></pattern>
  <clipPath id={id+"cargo"}><path d="M390 270H700V340H390Z"/></clipPath>
 </defs>
 <path d="M0 0H1000V510H0Z" fill={stage===2?"#050f1b":"#142c36"}/><g className={stage===1?undefined:s.stopped}>
 <path d="M50 72L944 72V354L51 354Z" fill={`url(#${id}wall)`}/><path d="M50 72H944V354H50Z" fill={`url(#${id}brick)`}/>
 <path d="M50 354H944L990 470H12Z" fill={`url(#${id}floor)`}/>
 {Array.from({length:14},(_,i)=><path key={i} d={`M${58+i*68} 354L${-60+i*87} 470`} stroke="#6b827a" opacity=".15"/>)}
 {[377,407,447].map(y=><path key={y} d={`M20 ${y}H978`} stroke="#7a9184" opacity=".13"/>)}
 <path d="M38 65H956V82H38ZM44 335H955V352H44Z" fill="#374d50" stroke="#71817a"/>
 {[58,335,703,936].map(x=><g key={x}><path d={`M${x} 80V352`} stroke="#07171f" strokeWidth="18"/><path d={`M${x-4} 81V348`} stroke="#516764" strokeWidth="5"/>{[96,170,248,330].map(y=><circle key={y} cx={x+3} cy={y} r="2.5" fill="#b7a681"/>)}</g>)}
 <path d="M76 119H910V144H861M76 129H300V166" fill="none" stroke="#091b22" strokeWidth="14"/><path d="M76 116H909V142H863M77 126H298V166" fill="none" stroke="#8a8f78" strokeWidth="5"/>
 {[188,499,817].map(x=><g key={x}><path d={`M${x} 73V119`} stroke="#465b5b" strokeWidth="3"/><ellipse cx={x} cy="198" rx="105" ry="92" fill={`url(#${id}lamp)`}/><path d={`M${x-20} 117H${x+20}l9 10h-58Z`} fill="#213a42" stroke="#ac9e7b"/><path d={`M${x-20} 130H${x+20}`} stroke="#f3d9a0" strokeWidth="4"/></g>)}
 <g><path d="M83 167H277V334H83Z" fill="#0c1e28" stroke="#829389" strokeWidth="3"/><path d="M91 176H268V326H91Z" fill="#19303a"/>
 {[111,149,187,225].map(x=><path key={x} d={`M${x} 180V323`} stroke="#617f7d" strokeWidth="3"/>)}
 <path d="M90 229H270" stroke="#718a81" strokeWidth="4"/><path d="M224 176H269V326H224Z" fill="#2a4347" opacity=".8"/>
 <path d="M96 314H202L224 331H79Z" fill="#917e57" stroke="#c9b587"/><path d="M79 332H225V371H79Z" fill="#2b4146"/><path d="M90 338H212V364H90Z" fill="#193039" stroke="#617771"/>
 <path d="M115 305V268H168V310" fill="#354d50" stroke="#afad90"/><path d="M121 274H162V298H121Z" fill="#122f35"/><path d="M126 281H155M126 287H149" stroke="#a0c5a8" strokeWidth="2"/>
 <path d="M173 312l18-5 11 6-20 6Z" fill="none" stroke="#adab86" strokeDasharray="2 2"/></g>
 <g className={s.departing} style={{transform:stage===2?"translateX(-330px)":"none"}}><Worker x={263} y={277} color="#b2ad8a" small/></g>
 <g><path d="M377 327H687L708 346H394Z" fill="#90a398"/><path d="M394 347H708V374H394Z" fill={`url(#${id}belt)`} stroke="#a8ae96"/>
 {Array.from({length:15},(_,i)=><path key={i} d={`M${400+i*20} 348v22`} stroke="#526f70"/>)}
 <path d="M413 374V411M680 374V411" stroke="#293e46" strokeWidth="13"/><path d="M409 374V409M676 374V409" stroke="#82958b" strokeWidth="3"/>
 <Gear x={412} y={360} r={13}/><Gear x={688} y={360} r={13}/>
 <g clipPath={`url(#${id}cargo)`}><g className={fault?s.jammed:s.cargo}>
 {[410,510,610].map((x,i)=><g key={x}><path d={`M${x} 310l26-12 30 12-28 15Z`} fill={i===1?"#c2a475":"#739b93"}/><path d={`M${x} 310v21l28 10v-16Z`} fill="#314c51"/><path d={`M${x+28} 325l28-15v21l-28 10Z`} fill="#536c69"/><path d={`M${x+11} 313l15 5 16-8`} fill="none" stroke="#dae0b6"/><circle cx={x+40} cy="328" r="2" fill="#bcd7bc"/></g>)}
 </g></g>
 <path d="M391 313H701M401 337H707" stroke="#8e9e8e" strokeWidth="3"/>
 <path d="M454 205H613V274H454Z" fill="#18333e" stroke="#6d8780"/><path d="M463 215H604V262H463Z" fill="#0c222a"/><path className={s.signal} d="M471 244h17l5-14 8 26 10-19 6 7h27l8-18 9 27 8-9h25" fill="none" stroke="#8fbfac" strokeWidth="2"/>
 <circle cx="440" cy="220" r="4" fill={fault?"#de9976":"#a6d6b5"}/>
 </g>
 <g><path d="M744 177H904V193H744Z" fill={`url(#${id}steel)`} stroke="#b6bba1"/><path d="M751 193V366M889 193V366" stroke="#253d46" strokeWidth="19"/><path d="M748 193V364M886 193V364" stroke="#90a69c" strokeWidth="5"/>
 <g className={s.press}><path d="M805 191H838V243H805Z" fill={`url(#${id}steel)`}/><path d="M776 241H868V268H776Z" fill="#758b85" stroke="#c1ba98"/><path d="M785 248H858V258H785Z" fill="#344f54"/></g>
 <path d="M750 340H898L919 362H730Z" fill="#81958b"/><path d="M730 363H919V408H730Z" fill="#2c454c" stroke="#8a9b89"/>
 {Array.from({length:9},(_,i)=><path key={i} d={`M${743+i*18} 375l8-7v19l-8 7Z`} fill="#142d36"/>)}
 <path d="M775 331l43-19 41 18-43 19Z" fill="#b6a77e"/><path d="M775 331v9l42 19v-10M817 349l42-19v9l-42 20" fill="#6a7562"/>
 <path d="M731 291l30-9 15 16-31 12Z" fill="#899b8e" stroke="#b9b99b"/><path d="M745 310v23M763 304v28" stroke="#526c6b" strokeWidth="5"/><circle cx="750" cy="295" r="5" fill="#c8a870"/>
 </g>
 <g className={s.departing} style={{transform:stage===2?"translateX(350px)":"none"}}><Worker x={722} y={287} color="#799ba5" pose="press"/></g>
 <path d="M22 470H985V484H22Z" fill="#354947" stroke="#8b8d70"/><path d="M22 487H985" stroke="#796f50"/>
 </g>
 {!compact&&<g><path d="M88 420H334V462H88Z" fill="#0b2029" stroke="#7d927f"/><text x="106" y="446" fill="#cfceb0" fontSize="13" fontFamily="Arial">{stage===0?"CUSTODY / CARD TRANSFER":stage===1?"PRODUCTION / OUTPUT THREE":"PERSISTENCE / AFTER THE SHIFT"}</text></g>}
 {stage>0&&<g>{[0,1,2].map(i=><g key={i} transform={`translate(${(compact&&stage===1?750:391)+i*54} 439)`}><path d="M0 0l18-8 20 8-18 9Z" fill="#d5bf8e"/><path d="M0 0v12l20 9V9ZM20 9l18-9v12l-18 9" fill="#82967e" stroke="#c7c69f"/></g>)}</g>}
 {stage===0&&<g><path d="M188 304h37m-7-5 7 5-7 5" fill="none" stroke="#dfcc99" strokeWidth="2"/><path d="M230 296h20v13h-20Z" fill="#e7d6a4" stroke="#b5b98e"/><path d="M233 300h13m-13 4h9" stroke="#547a6c"/><text x="263" y="356" textAnchor="middle" fill="#dfd2ad" fontSize="14" fontFamily="Arial">ED</text></g>}
 {!compact&&<g><path d="M718 414H944V463H718Z" fill="#102c34" stroke="#7d947e"/><path d="M718 414h226" stroke="#c7b785" strokeWidth="2"/><path d="M734 426h40v25h-40Z" fill="#d8ca9e" stroke="#eee2b9"/><path d="M740 433h27m-27 7h19" stroke="#52746b" strokeWidth="2"/><text x="787" y="433" fill="#9fb89e" fontSize="10" fontFamily="Arial" letterSpacing="1">RETAINED STATE</text><text x="787" y="452" fill="#d7d7b4" fontSize="14" fontFamily="Arial">CARD → ED</text></g>}
 {stage===2&&<g>{[90,171,280,470,580,740,905].map((x,i)=><circle key={x} cx={x} cy={14+i%3*14} r={i%2+1} fill="#c4cbb6"/>)}<path d="M856 13a15 15 0 1 0 15 22 14 14 0 0 1-15-22" fill="#c7d0b4"/></g>}

 </svg>;
}
