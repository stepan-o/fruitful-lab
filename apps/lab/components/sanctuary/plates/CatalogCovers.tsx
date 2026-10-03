import OneMoreRoundCover from "./OneMoreRoundCover";
import RenewsDayCover from "./RenewsDayCover";
import { useEffect, useId, useRef, useState } from "react";
import { useLivingPlate } from "./useLivingPlate";
import { coverReferences } from "@/lib/sanctuary/cover-references";
import styles from "./audience-economy.module.css";

function Bicycle({ x, y, scale = 1 }: { x:number; y:number; scale?:number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <g fill="none" stroke="#9ca99b" strokeWidth="1.2"><circle cx="-13" cy="0" r="10"/><circle cx="17" cy="0" r="10"/><path d="m-13 0 10-16 8 16h-18l14-10h11l5 10-6-23 5-2M-8-16h10"/></g>
    <path d="m0-18-5-15 5-9 8 4 4 12-8 7 4 12" fill="none" stroke="#0a171d" strokeWidth="6" strokeLinejoin="round"/>
    <circle cx="3" cy="-48" r="5" fill="#101d21" stroke="#91a19a" strokeWidth=".8"/>
    <path d="m6-38 7 10 4 1M-2-33l-8 6 6 17" fill="none" stroke="#81958a" strokeWidth="1"/>
  </g>;
}

export function StrangerCover() {
  const id=useId().replace(/:/g,"");
  const ref=useLivingPlate<HTMLDivElement>();
  return <div ref={ref} className={styles.living} data-scene="stranger"><svg viewBox="0 0 260 380" role="img" aria-label="Stranger Returns: young cyclists face a red rupture above a small town. An original parody of Stranger Things.">
    <defs>
      <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#101c26"/><stop offset=".47" stopColor="#873d37"/><stop offset="1" stopColor="#1b3539"/></linearGradient>
      <radialGradient id={`${id}-rift`}><stop stopColor="#e6a46e"/><stop offset=".23" stopColor="#a8563f"/><stop offset="1" stopColor="#703a33" stopOpacity="0"/></radialGradient>
      <linearGradient id={`${id}-fade`} x2="0" y2="1"><stop stopColor="#081218" stopOpacity="0"/><stop offset="1" stopColor="#081218"/></linearGradient>
    </defs>
    <path d="M0 0h260v380H0z" fill={`url(#${id}-sky)`}/>
    <ellipse className={styles.riftGlow} cx="134" cy="151" rx="115" ry="137" fill={`url(#${id}-rift)`}/>
    <g className={styles.riftVeins} fill="none" strokeLinecap="round">
      <path d="m138 19-13 24 12 19-20 29 9 16-10 19 14 25-7 22" stroke="#cd8761" strokeWidth="2"/>
      <path d="m130 57 21 10 9 19 24 12m-61-17-24 2-13 19-22 3m63 16 23-10 20 4 14-5" stroke="#b06e54" strokeWidth="1.1"/>
      <path d="m128 25-6 17 10 22-19 26 9 18-10 19 15 25-9 26" stroke="#341f27" strokeWidth="4"/>
    </g>
    <path d="M1 104q24-12 44-7m142-3q43-8 72 4M19 136q32-7 57-2m103 6q25-6 57 1" stroke="#bc795a" strokeOpacity=".4" fill="none"/>
    {Array.from({length:20},(_,i)=><circle key={i} cx={24+(i*47)%211} cy={18+(i*31)%144} r={i%4===0?.9:.5} fill="#d1b38d" opacity=".45"/>)}
    <path d="M0 171 20 156 30 171 46 156 66 175 95 162 116 170 129 160 157 179 180 167 207 171 226 157 260 169v77H0Z" fill="#263b3b"/>
    <path d="M0 220h43v-25l22-17 22 17v25h39v-31h39v31h35v-17l21-15 24 16v24h15v152H0Z" fill="#10272d"/>
    <g stroke="#a7aa88" strokeOpacity=".48" fill="none" strokeWidth=".65">
      <path d="m40 197 25-20 25 20M49 210h11v-11H49zm22 0h9v-11h-9zm58-18h33v-5h-33Zm80 13 21-17 22 18m-34 0h9v12h-9zm17 0h9v12h-9Z"/>
      <path d="M14 181v65m-9-58 21-3m-14 5q33 7 67 17m-1-4v35m-7-30 16-3m-7 2q20 4 32 7m67-18v40m-6-34 16-2m-10 0q19-8 42-8"/>
    </g>
    <path d="m107 222-52 86h168l-76-86Z" fill="#4c6861"/>
    <path d="m130 223-1 13m0 5-1 18m-1 8-2 22" stroke="#ccb789" strokeWidth="1.5"/>
    {[0,1].map(s=><g key={s} transform={s?"translate(260 0) scale(-1 1)":undefined} fill="#0a1c24">
      <path d="M8 0h14l-2 95 20 33 5 68-15 16-2 55H0v-43l12-30-1-60L0 112V73l11 30Z"/>
      <path d="m18 86 40-25 17-45-9 42 32-16-30 23-19 37-20 22ZM16 129l47-8 30-32-23 41-46 18Z"/>
    </g>)}
    <g fill="none" stroke="#718e83" strokeWidth=".7" opacity=".6">
      <path d="M17 1 15 71l4 42-2 31 6 41-4 48m5-127 23-35 23-9m-47 60 23-9 15-2m-36 31-5 19m222-94 3 48-5 35 7 59m-9-101-20-28-22-10m48 66-20-5-17-16"/>
      <path d="m15 15 3 32m-3 83 4 20m3 7 4 16m210-69-4-15m12 64-4 16"/>
    </g>
    <path d="m39 280-7-17 10 9-1-15 11 20m155 5 8-21 1 15 11-12-3 21M6 300l9-10 10 4m211 0 10-10 14 7" fill="none" stroke="#3e5b57" strokeWidth="1.3"/>
    <g className={styles.coverMotes} fill="#e1c39b">{Array.from({length:12},(_,i)=><circle key={i} cx={39+(i*43)%188} cy={80+(i*29)%163} r={i%3===0?1:.55} opacity=".5"/>)}</g>
    <Bicycle x={80} y={279} scale={.83}/><Bicycle x={130} y={281}/><Bicycle x={183} y={283} scale={.87}/>
    <path d="m95 264 28-9-1 12Z m53 6 36-10-1 13Z m52 4 26-8 1 12Z" fill="#c4c49d" opacity=".14"/>
    <path d="M60 290h41m12 4h40m10-2h39m-88 9h52" stroke="#89967e" strokeOpacity=".3"/>
    <path d="M0 278h260v102H0z" fill={`url(#${id}-fade)`}/>
    <text x="130" y="320" textAnchor="middle" fill="#d4b68e" fontFamily="Georgia,serif" fontSize="25" letterSpacing="1">STRANGER</text>
    <text x="130" y="346" textAnchor="middle" fill="#ce8c68" fontFamily="Georgia,serif" fontSize="27" letterSpacing="2">RETURNS</text>
    <path d="M34 294h192M39 353h182" stroke="#ab7357" strokeWidth="1"/>
    <text x="130" y="368" textAnchor="middle" fill="#adab8c" fontSize="7" letterSpacing="2">THE NEXT EPISODE IS OUT THERE</text>
    <path d="M7 7h246v366H7z" fill="none" stroke="#ba9a68" strokeOpacity=".35"/>
  </svg></div>;
}

const coverArt = [StrangerCover, RenewsDayCover, OneMoreRoundCover];

export default function CatalogCovers() {
  const [active,setActive]=useState<number|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const heading=useId();
  useEffect(()=>{
    if(active!==null) dialog.current?.showModal();
  },[active]);
  const close=()=>{dialog.current?.close(); setActive(null);};
  const Cover=active!==null?coverArt[active]:null;
  return <div className={styles.catalog}>
    <div className={styles.catalogHeading}><div><span>ONE MEMBERSHIP · MANY WORLDS</span><h4>Up next</h4></div><span className={styles.catalogHint}>Explore the covers ↗</span></div>
    <div className={styles.covers}>
      {coverReferences.map((cover,i)=>{
        const Art=coverArt[i];
        return <div className={styles.catalogItem} key={cover.id}>
          <button className={styles.coverButton} type="button" onClick={()=>setActive(i)} aria-label={`Explore ${cover.title}`}><Art/><span className={styles.inspect}>↗</span></button>
          <div className={styles.coverCredit}><span className={styles.coverNumber}>0{i+1}</span><a href={cover.source} target="_blank" rel="noreferrer">After {cover.original} ↗</a></div>
        </div>;
      })}
    </div>
    <p className={styles.catalogNote}>Original cover parodies · <a href="/stepanoskin/game-monetization/credits#catalog-parodies">References & creators ↗</a></p>
    <dialog ref={dialog} className={styles.coverDialog} aria-labelledby={heading} onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target===event.currentTarget)close();}} onClose={()=>setActive(null)}>
      {active!==null&&Cover?<div className={styles.coverInspector}>
        <div className={styles.inspectorHeader}><h3 id={heading}>{coverReferences[active].title}</h3><button type="button" onClick={close} aria-label="Close cover">×</button></div>
        <div className={styles.enlargedCover}><Cover/></div>
        <p>{coverReferences[active].detail}</p>
        <a href={coverReferences[active].source} target="_blank" rel="noreferrer">Visual reference: {coverReferences[active].original} ↗</a>
      </div>:null}
    </dialog>
  </div>;
}
