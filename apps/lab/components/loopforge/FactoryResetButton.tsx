"use client";

import { useId } from "react";
import styles from "./factory-conveyor.module.css";

/** Small vector instrument: painted metal, a recessed collar and a sprung cap.
 * The face is nearly frontal; the housing and cap share a shallow oblique plane.
 * All patina is static geometry. Only the cap transform and lamp opacity animate.
 */
export default function FactoryResetButton({ jammed, hintId, onReset }: {
  jammed: boolean; hintId: string; onReset: () => void;
}) {
  const id = useId();
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <button type="button" className={styles.resetButton} aria-label="Restart conveyor"
      aria-disabled={!jammed} aria-describedby={hintId} onClick={() => { if (jammed) onReset(); }}>
      <svg viewBox="0 0 120 128" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${id}-housing`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#68645a"/><stop offset=".08" stopColor="#343b38"/>
            <stop offset=".48" stopColor="#222824"/><stop offset="1" stopColor="#111614"/>
          </linearGradient>
          <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#3a3930"/><stop offset=".3" stopColor="#171b19"/>
            <stop offset=".88" stopColor="#0a0d0c"/><stop offset="1" stopColor="#4f4937"/>
          </linearGradient>
          <linearGradient id={`${id}-steel`} x1="0" y1="0" x2=".8" y2="1">
            <stop stopColor="#c2b28e"/><stop offset=".19" stopColor="#666b5c"/>
            <stop offset=".42" stopColor="#343d36"/><stop offset=".7" stopColor="#111915"/>
            <stop offset=".88" stopColor="#858470"/><stop offset="1" stopColor="#3c4035"/>
          </linearGradient>
          <radialGradient id={`${id}-red`} cx=".34" cy=".22" r=".83">
            <stop stopColor="#ef5a48"/><stop offset=".22" stopColor="#c62a2f"/>
            <stop offset=".64" stopColor="#951019"/><stop offset=".88" stopColor="#5b090f"/>
            <stop offset="1" stopColor="#280708"/>
          </radialGradient>
          <radialGradient id={`${id}-lit`} cx=".35" cy=".29" r=".78">
            <stop stopColor="#ff9c78" stopOpacity=".7"/><stop offset=".32" stopColor="#ff2337" stopOpacity=".6"/>
            <stop offset=".8" stopColor="#f31027" stopOpacity=".15"/><stop offset="1" stopColor="#e81020" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id={`${id}-halo`}>
            <stop offset=".42" stopColor="#ff1830" stopOpacity=".27"/>
            <stop offset=".68" stopColor="#eb1828" stopOpacity=".1"/>
            <stop offset="1" stopColor="#b00a1b" stopOpacity="0"/>
          </radialGradient>
          <pattern id={`${id}-grain`} width="13" height="11" patternUnits="userSpaceOnUse">
            <path d="M1 2h3m4 5h4M2 10h1" stroke="#d7cba7" strokeWidth=".45" opacity=".17"/>
            <path d="M6 1h3M0 7h3m6 3h3" stroke="#040907" strokeWidth=".65" opacity=".48"/>
          </pattern>
        </defs>
        <ellipse cx="62" cy="112" rx="42" ry="6" fill="#000" opacity=".65"/>
        <g transform="matrix(1 -.07 .05 .94 -3 10)">
          <path d="M16 16h82l9 9v81l-8 10H18l-9-9V25z" fill={paint("edge")} stroke="#090d0a" strokeWidth="2"/>
          <path d="M14 10h80l7 7v83l-7 7H14l-7-7V17z" fill={paint("housing")} stroke="#5c6050" strokeWidth="1"/>
          <path d="M9 36V18l6-6h63M15 105h34" fill="none" stroke="#bdaf8a" strokeWidth=".7" opacity=".6"/>
          <path d="M101 20l5 5v79l-7 9m-4-7 4 7" fill="none" stroke="#797254" strokeWidth=".65" opacity=".4"/>
          <path d="M14 15h80v85H14z" fill={paint("grain")}/>
          <path d="M13 31v46m82-55v26M16 96l7-2m61-69 7-1M23 18l5 1m60 81 5-2" stroke="#c3b587" strokeWidth=".8" opacity=".27"/>
          <circle cx="56" cy="58" r="43" className={styles.resetHalo} fill={paint("halo")}/>
          <ellipse cx="57" cy="62" rx="37" ry="35" fill="#050907" stroke="#181e18" strokeWidth="3"/>
          <circle cx="54" cy="57" r="36" fill={paint("steel")} stroke="#0a100c"/>
          <circle cx="54" cy="57" r="33" fill="none" stroke="#d1bc89" strokeWidth=".6" opacity=".56"/>
          {Array.from({ length: 32 }, (_, i) => <path key={i} d="M54 22v3" transform={`rotate(${i * 11.25} 54 57)`} stroke={i % 3 ? "#131d15" : "#a6a48a"} strokeWidth="1.2" opacity=".75"/>)}
          <circle cx="54" cy="57" r="30.5" fill="#060c08" stroke="#151d14" strokeWidth="2"/>
          <circle cx="54" cy="57" r="30" className={styles.resetLamp} fill="none" stroke="#ff3949" strokeWidth="1.2"/>
          <g className={styles.resetCap}>
            <path d="M28 56a26 26 0 0 1 52 0v5a26 26 0 0 1-52 0z" fill="#39080c" stroke="#130605"/>
            <circle cx="54" cy="54" r="26" fill={paint("red")} stroke="#851b1e" strokeWidth=".8"/>
            <circle cx="54" cy="54" r="25.5" fill={paint("lit")} className={styles.resetFaceLight}/>
            <circle cx="54" cy="54" r="24" fill="none" stroke="#f79374" strokeWidth=".6" opacity=".23"/>
            <circle cx="54" cy="54" r="23" fill={paint("grain")} opacity=".35"/>
            <path d="M34 43a23 23 0 0 1 31-9" fill="none" stroke="#ffd6ad" strokeWidth="1.1" strokeLinecap="round" opacity=".6"/>
            <path d="M37 72a23 23 0 0 0 34-10" fill="none" stroke="#180606" strokeWidth="1.8" opacity=".6"/>
            <path d="M63 49a10 10 0 1 0 1 8m-1-15v7h-7" fill="none" stroke="#22090b" strokeWidth="2" transform="translate(0 1)"/>
            <path d="M63 49a10 10 0 1 0 1 8m-1-15v7h-7" fill="none" stroke="#f9c9ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".86"/>
            <path d="m37 47 2-1m21 22 3-1m-17-29 3-.7" stroke="#ffbaa2" strokeWidth=".5" opacity=".3"/>
          </g>
          {[[17,21],[91,21],[17,96],[91,96]].map(([x,y]) => <g key={`${x}-${y}`}>
            <circle cx={x+.7} cy={y+1} r="3.5" fill="#030806"/>
            <circle cx={x} cy={y} r="2.8" fill={paint("steel")} stroke="#92947b" strokeWidth=".4"/>
            <path d={`M${x-1.4} ${y+1}l2.8-2`} stroke="#0a100c" strokeWidth="1"/>
          </g>)}
          <path d="M34 93h41v9H34z" fill="#0a100c" stroke="#6c6850" strokeWidth=".55"/>
          <text x="54.5" y="99.6" textAnchor="middle" fill="#b6ad8f" fontFamily="monospace" fontSize="5.7" letterSpacing="1.5">RESET</text>
        </g>
      </svg>
      <span>{jammed ? "PRESS TO RESET" : "MANUAL RESET"}</span>
    </button>
  );
}
