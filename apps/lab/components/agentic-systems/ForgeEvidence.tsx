"use client";
import {useState} from "react";
import type {ImageAsset} from "@/lib/assets/types";
import media from "@/lib/assets/generated/agentic-systems.json";
import s from "./reader.module.css";
const records=[
 {id:"before",label:"Rejected action · 25 October",src:"forge-before-rejected-02884bb0a33c.webm",caption:"43a70823 · 1280 × 900 · 44.48 seconds. Diagnostic entry precedes original-speed playback. Follow Max, the blue worker beside the right-hand press."},
 {id:"current",label:"Selected correction · 26 October",src:"forge-current-ordinary-177e94f764d4.webm",caption:"72a55f7 · 1280 × 720 · 32 seconds. Ordinary-day seconds 791–823, original speed and uncropped. Watch the raised control, then the hand’s withdrawal before the crew reacts."}
];
export default function ForgeEvidence(){
 const [index,setIndex]=useState(0);const record=records[index];
 return <section className={s.videoSection} aria-label="Forge motion evidence">
 <h2>The moment that earned output three</h2>
 <div className={s.videoSelect} role="group" aria-label="Choose a source recording">{records.map((item,i)=><button type="button" key={item.id} aria-pressed={index===i} onClick={()=>setIndex(i)}>{item.label}</button>)}</div>
 <figure className={s.videoEvidence}>
 <video key={record.id} controls playsInline preload="none" width="1280" height={index===0?900:720} poster={(media.assets[index===0?"forge-before":"forge-current"] as ImageAsset).variants[1].src} aria-label={record.label+" Forge action"}><source src={`/loopforge-dev-blog/media/2026-10-26-motion-in-the-running-game/${record.src}`} type="video/webm"/><a href={`/loopforge-dev-blog/media/2026-10-26-motion-in-the-running-game/${record.src}`}>Open recording</a></video>
 <figcaption>{record.caption}</figcaption></figure>
 <p className={s.mediaCredit}>Engine and Animator evidence, published and edited by Producer. The player keeps the complete source frame; use fullscreen for close inspection. Entry contexts and viewport heights differ. <a href="/loopforge-dev-blog/posts/2026-10-26-motion-in-the-running-game/index.html">Source study and stills ↗</a></p>
 </section>;
}
