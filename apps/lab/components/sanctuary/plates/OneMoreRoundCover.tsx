import { useId } from "react";
import { useLivingPlate } from "./useLivingPlate";
import styles from "./audience-economy.module.css";

function Stair({ x, y, flipped=false, color="#a98170" }: {x:number;y:number;flipped?:boolean;color?:string}) {
  return <g transform={`translate(${x} ${y}) ${flipped?"scale(-1 1)":""}`}>
    <path d="M0 8 96-48l25 8v16L25 38 0 28Z" fill="#243e40"/>
    {Array.from({length:8},(_,i)=><g key={i} transform={`translate(${i*12} ${-i*7})`}>
      <path d="m0 0 12-7 25 8-12 7Z" fill={color} stroke="#d0b090" strokeWidth=".5"/>
      <path d="m0 0 25 8v8L0 8Z" fill="#664c48" stroke="#8f7767" strokeWidth=".4"/>
    </g>)}
  </g>;
}
export default function OneMoreRoundCover() {
  const id=useId().replace(/:/g,""); const ref=useLivingPlate<HTMLDivElement>();
  return <div ref={ref} className={styles.living} data-scene="squid"><svg viewBox="0 0 260 380" role="img" aria-label="One More Round: masked sentries and contestants in a maze of stairways. An original parody of Squid Game.">
    <defs>
      <linearGradient id={`${id}-walls`} x2="1" y2="1"><stop stopColor="#455d57"/><stop offset="1" stopColor="#172c33"/></linearGradient>
      <pattern id={`${id}-mesh`} width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".55" fill="#8a998d" fillOpacity=".45"/></pattern>
      <linearGradient id={`${id}-hood`} x2="1" y2="1"><stop stopColor="#a57967"/><stop offset=".5" stopColor="#5a3e40"/><stop offset="1" stopColor="#2b252e"/></linearGradient>
    </defs>
    <path d="M0 0h260v380H0Z" fill={`url(#${id}-walls)`}/>
    <path d="M0 24 76 2v222L0 266Z" fill="#6b5550"/><path d="M76 2 144 28v183l-68 13Z" fill="#9b7a66"/>
    <path d="M183 0h77v245l-77-28Z" fill="#765b53"/><path d="m145 32 39-16v201l-39 23Z" fill="#263b3d"/>
    <path d="M32 44 58 36v44l-26 9Z" fill="#132930" stroke="#b59b7d" strokeWidth="3"/>
    <path d="m99 82 23 8v41l-23-9Z" fill="#1b3135" stroke="#51433d" strokeWidth="3"/>
    <path d="M201 40h30v49h-30z" fill="#192b33" stroke="#b5937b" strokeWidth="3"/>
    <g className={styles.doorLight} fill="#cabc8d" opacity=".7"><path d="m33 74 24-8v13l-24 8Z"/><path d="M202 77h28v11h-28Z"/></g>
    <g fill="none" stroke="#c9b18d" strokeWidth="1"><circle cx="45" cy="27" r="4"/><path d="m109 69 4 7h-8Z"/><path d="M212 27h7v7h-7Z"/></g>
    <g fill="none" stroke="#c4ab8a" strokeOpacity=".28" strokeWidth=".7">
      <path d="m10 29 57-16v181m14-180v204m8-194 48 18v170M189 22h65m-65 7h65m-65 70h65m-65 8h65M1 168l25-7m-15 35 44-17m-49 56 22-11m78-63 28 9m-29-48 28 10M7 51v46m14 61v42m102-57v39m76-20v35m43-90v20"/>
      <path d="m24 133 82-46 16 5m106 111-83-48-15 5M18 147l16 5m173 68-15 5"/>
    </g>
    <path d="M0 126 33 117v16L0 143Zm140-12 120 36v15l-120-36Z" fill="#68847a" stroke="#b8b098"/>
    <Stair x={17} y={141}/><Stair x={230} y={213} flipped color="#69867a"/>
    <path d="M0 268 129 218 260 260v45H0Z" fill="#122b31"/>
    <path d="m20 291 108-60 116 49m-190 10 79-44 77 25" fill="none" stroke="#668177" strokeOpacity=".5"/>
    <Stair x={22} y={270} color="#9b8269"/>
    <g transform="translate(112 91) scale(.38)"><path d="m-12 3-2-25 5-8h16l9 8-1 25Z" fill="#192f34" stroke="#b1b99d"/><circle cy="-39" r="9" fill="#092027" stroke="#ac997b"/><path d="M-5-43h10v9H-5Z" fill="none" stroke="#c1b394"/></g>
    <g transform="translate(179 181) scale(.55)"><path d="m-10 5 1-22h17l5 22-7 3-4-14-2 14Z" fill="#476d61" stroke="#9daf92" strokeWidth="1"/><circle cy="-25" cx="2" r="5" fill="#a8a58b"/></g>
    <g transform="translate(190 251)">
      <path d="m-38 43 9-61 17-13h27l18 14 12 60Z" fill={`url(#${id}-hood)`} stroke="#c7a185"/>
      <path d="M-21-20q-14-46 6-61 25-18 42 15 10 25-2 46Z" fill={`url(#${id}-hood)`} stroke="#bb9680"/>
      <path d="M-17-56q14-20 33 0l1 22-17 9-18-12Z" fill="#101d26" stroke="#8b8d7a"/>
      <path d="M-17-56q14-20 33 0l1 22-17 9-18-12Z" fill={`url(#${id}-mesh)`}/>
      <path d="M-20-23q-10-45 3-51m10-5q18 1 24 31m-9 26 7-11m-37 19-10 45m51-46 8 45" fill="none" stroke="#b8977f" strokeOpacity=".6" strokeWidth=".7"/>
      <path d="m0-53 10 17h-20Z" fill="none" stroke="#d4c8a7" strokeWidth="1.3"/>
      <path d="M0-21v61m-22-45-4 32m48-32 5 31" stroke="#d7b38c" strokeWidth=".8"/>
      <path d="M2-15v48" stroke="#d7b38c" strokeWidth=".7" strokeDasharray="1 2"/>
      <path d="M-18 3h11v10h-11Zm26 0h12v10H8Z" fill="none" stroke="#b48e75" strokeWidth=".8"/>
      <path d="m-26 28 10 2m37 0 11-3M-22 34l38 1" stroke="#201f28" strokeWidth="3"/><path d="M-7 32H1v6h-8Z" fill="none" stroke="#b6a38b"/>
    </g>
    <g transform="translate(65 235)"><path d="m-7 11 2-28h13l6 29-8 5-5-17-2 18Z" fill="#517c6b" stroke="#a2b8a1" strokeWidth=".7"/><circle cy="-22" cx="2" r="5" fill="#b5a88a"/><path d="m-5-12-8 14m21-14 9 14" stroke="#688b77" strokeWidth="4"/></g>
    <path d="M35 279h15m-20 7h13m24-20h16m-2-43h7" stroke="#bcad89" strokeWidth=".6" opacity=".45"/>
    <path d="M0 302h260v78H0Z" fill="#0c1d24"/>
    <text x="130" y="326" textAnchor="middle" fill="#d4c4a5" fontFamily="Georgia,serif" fontSize="24" letterSpacing="3">ONE MORE</text>
    <text x="130" y="354" textAnchor="middle" fill="#b79078" fontFamily="Georgia,serif" fontSize="28" letterSpacing="4">ROUND</text>
    <text x="130" y="371" textAnchor="middle" fill="#a1aa92" fontSize="7" letterSpacing="1.5">THE PRIZE IS YOUR ATTENTION</text>
    <path d="M7 7h246v366H7z" fill="none" stroke="#ba9a68" strokeOpacity=".35"/>
  </svg></div>;
}
