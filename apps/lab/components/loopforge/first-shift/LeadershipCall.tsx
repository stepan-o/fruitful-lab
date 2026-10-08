"use client";
import { useEffect, useState } from "react";
import type { PlayerView } from "@/lib/loopforge/first-shift/contract";
import { Art, Control, Kicker, type Media } from "./ConsoleParts";
import c from "./leadership-call.module.css";

/** The opening mandate is presentation, not a quota-setting command or invented weekly history. */
export default function LeadershipCall({media,view,onContinue,effects=true}: {media:Media;view:PlayerView;onContinue:()=>void;effects?:boolean}) {
  const [topic,setTopic]=useState(0), [leaving,setLeaving]=useState(false);
  useEffect(()=>{
    if(!leaving) return;
    const reduced=!effects || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer=window.setTimeout(onContinue,reduced ? 0 : 240);
    return ()=>window.clearTimeout(timer);
  },[leaving,onContinue,effects]);
  return <section className={c.scene} data-leaving={leaving} aria-label="Weekly leadership call">
    <div className={c.artwork} aria-hidden="true"><Art media={media} id="leadership-call" priority sizes="100vw" /></div>
    <div className={c.shade} aria-hidden="true" />
    <Art media={media} id="cinematic-soot" className={c.soot} sizes="100vw" />
    <header className={c.heading}><Kicker>Loopforge / Factory leadership</Kicker><span>WEEK 01 · OPENING MANDATE</span><button onClick={()=>setLeaving(true)} disabled={leaving}>Return to factory ↗</button></header>
    <div className={c.transmission}>
      <nav className={c.topics} aria-label="Leadership call topics">{["The handover","The quota"].map((t,i)=><button key={t} aria-pressed={topic===i} disabled={leaving} onClick={()=>setTopic(i)}><span>0{i+1}</span>{t}</button>)}</nav>
      <div key={topic} className={c.beat}>
        <div className={c.voice}><Kicker>Leadership says</Kicker><h1>{topic===0 ? "The week belongs to the factory." : "Your first delivery."}</h1><blockquote>{topic===0 ? "Two departments operational. The rest waiting for a director who can make this place produce." : `${view.quota} units. End of the week. How you get there is your responsibility.`}</blockquote></div>
        <div className={c.statement}>
          {topic===0 ? <><Kicker>Opening factory record</Kicker><dl><div><dt>Workforce</dt><dd>{view.workers}</dd></div><div><dt>Funds</dt><dd>¤ {view.cash}</dd></div><div><dt>Line condition</dt><dd>{view.condition}%</dd></div></dl><p>Lattice Forge and Security await their first assignments.</p><Control tone="primary" disabled={leaving} onClick={()=>setTopic(1)}>Receive the quota</Control></> : <><Kicker>Week 01 / delivery requirement</Kicker><div className={c.quota}><strong>{view.quota}</strong><span>ROBOTS<b>Due at the end of Day 07</b></span></div><p>Keep each day’s output for your workforce, or commit it to delivery. Once assigned, it cannot be taken back.</p><Control tone="primary" disabled={leaving} onClick={()=>setLeaving(true)}>Enter the factory</Control></>}
        </div>
      </div>
    </div>
  </section>;
}
