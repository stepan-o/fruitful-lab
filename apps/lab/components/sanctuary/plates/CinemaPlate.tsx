import { useId } from "react";
import CinemaScreen from "./CinemaScreen";
import { useLivingPlate } from "./useLivingPlate";
import CinemaAudience from "./CinemaAudience";
import CinemaDrapes from "./CinemaDrapes";
import styles from "./audience-economy.module.css";

/** A single screen gathers an audience: original, stage-built geometry. */
export default function CinemaPlate() {
  const ref = useLivingPlate<HTMLDivElement>();
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-${name})`;
  return <div ref={ref} className={styles.living} data-scene="cinema"><svg className={styles.cinemaArt} viewBox="0 0 900 510" role="img" aria-label="An ornate cinema auditorium: a shared audience faces one luminous screen.">
    <defs>
      <linearGradient id={`${id}-room`} x2="0" y2="1"><stop stopColor="#253333"/><stop offset="1" stopColor="#080e13"/></linearGradient>
      <linearGradient id={`${id}-brass`} x2=".85" y2="1"><stop stopColor="#c5af7d"/><stop offset=".4" stopColor="#67573b"/><stop offset=".65" stopColor="#d3bc88"/><stop offset="1" stopColor="#4e4534"/></linearGradient>
      <linearGradient id={`${id}-screen`} x2="0" y2="1"><stop stopColor="#20373c"/><stop offset=".65" stopColor="#9d9b75"/><stop offset="1" stopColor="#c6b587"/></linearGradient>
      <radialGradient id={`${id}-light`}><stop stopColor="#f9df9b" stopOpacity=".7"/><stop offset=".15" stopColor="#e6c889" stopOpacity=".3"/><stop offset="1" stopColor="#d2ac66" stopOpacity="0"/></radialGradient>
      <pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse"><path d="m0 5 5-5" stroke="#dbc694" strokeOpacity=".065"/></pattern>
      <clipPath id={`${id}-screen-clip`}><path d="M216 128h468v234H216z"/></clipPath>
    </defs>
    <path fill={paint("room")} d="M0 0h900v510H0z"/>
    <path d="M0 0 155 71v305L0 510ZM900 0 745 71v305l155 134Z" fill="#111c20"/>
    <path d="M0 23 155 83h590L900 23M0 45 143 99h614l143-54M0 354l155-10h590l155 10" fill="none" stroke="#8e7c55" strokeOpacity=".5"/>
    {[0,1].map(side=><g key={side} transform={side?"translate(900 0) scale(-1 1)":undefined}>
      <path d="M25 71 116 104v234l-91 9Z" fill="#1c2b2c" stroke="#76694d"/>
      <path d="m35 88 70 25v210l-70 8Z" fill="none" stroke="#76694d" strokeOpacity=".45"/>
      {[0,1,2].map(i=><path key={i} d={`M${46+i*20} ${111+i*7}v${196-i*11}`} stroke="#c3a879" strokeOpacity=".12"/>)}
      <path d="M133 92h28v276h-28z" fill={paint("brass")}/><path d="M138 96h18v263h-18z" fill="#15252a"/>
      {[0,1,2].map(i=><path key={i} d={`M${142+i*5} 103v248`} stroke="#aa9366" strokeOpacity=".5"/>)}
      <path d="m128 94 6-13h29l5 13Zm0 263h41v12h-41Z" fill={paint("brass")}/>
      <ellipse cx="72" cy="212" rx="45" ry="90" fill={paint("light")}/>
      <path d="m61 198 22 4-4 33-15-1Z" fill="#dbc68c"/><path d="m57 193 30 5-4 5-23-4Zm4 42 20 1v5H61" fill="#9c855a"/>
      <path d="m72 198 1 37m-8-36 4 35m11-33-4 32" stroke="#67553b"/>
      <path d="M40 312h56v19H40z" fill="#243e37" stroke="#718377"/><text transform={side?"translate(136 0) scale(-1 1)":undefined} x="68" y="325" fill="#b0bc9c" fontSize="10" textAnchor="middle" letterSpacing="3">EXIT</text>
    </g>)}
    <path d="M158 370V100Q450-72 742 100v270" fill="#0e161b" stroke={paint("brass")} strokeWidth="7"/>
    <path d="M174 367V109Q450-45 726 109v258M184 366V116Q450-22 716 116v250" fill="none" stroke="#9b8255" strokeWidth="1.5"/>
    {Array.from({length:27},(_,i)=>{const x=185+i*20.4; const y=42+((x-450)/265)**2*69; return <path key={i} d={`m${x} ${y} 3-5 3 5-3 5Z`} fill="#9c875d" opacity=".55"/>;})}
    <path d="m450 18 14 20-14 21-14-21Z" fill="#172529" stroke="#b39a69"/>
    <path d="m450 26 8 12-8 12-8-12Z" fill="#947c51"/>
    <path d="M204 116h492v256H204z" fill="#090f13" stroke="#796849" strokeWidth="2"/>
    <path d="M216 128h468v234H216z" fill={paint("screen")}/>
    <CinemaScreen id={id}/>
    <CinemaDrapes id={id}/>
    <path d="M151 373h598l36 18H115Zm-43 20h684l25 18H83Z" fill="#41392b" stroke="#736244"/>
    <path d="m382 411-65 99h268l-67-99Z" fill="#594433" opacity=".45"/>
    {[0,1,2,3].map(i=><path key={i} d={`M${377-i*15} ${420+i*22}h${145+i*30}`} stroke="#bfa774" strokeOpacity=".28"/>)}
    <path className={styles.projection} d="m427-12 46 0 211 365H216Z" fill="#ebdca3" opacity=".025"/>
    <g className={styles.projectionDust} fill="#d3c593" opacity=".35">{Array.from({length:16},(_,i)=><circle key={i} cx={350+(i*37)%208} cy={42+(i*53)%262} r={i%3===0?1.4:.8}/>)}</g>
    <CinemaAudience/>
    <path fill={paint("hatch")} d="M0 0h900v510H0z"/>
    <path d="M12 14h876v482H12z" fill="none" stroke="#b4a174" strokeOpacity=".25"/>
  </svg></div>;
}
