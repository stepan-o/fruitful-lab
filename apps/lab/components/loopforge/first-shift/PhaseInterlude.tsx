'use client';
/* eslint-disable @next/next/no-img-element -- immutable responsive phase plates; no duplicate image transformation. */
import { useEffect, useState } from 'react';
import assets from '@/lib/assets/generated/loopforge-time-transitions.json';
import s from './phase-interlude.module.css';
export default function PhaseInterlude({phase,onComplete}:{phase:'night'|'morning'|'shift';onComplete:()=>void}){
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{if(!loaded)return;const timer=setTimeout(onComplete,3000);return()=>clearTimeout(timer);},[loaded,onComplete]);
  const src=assets.assets[phase].variants.at(-1)!.src;
  return <div className={s.card} role="status" aria-live="polite">{/* Phase plates are already resized immutable assets. */}<img src={src} srcSet={assets.assets[phase].variants.map(a=>`${a.src} ${a.width}w`).join(', ')} sizes="100vw" alt="" onLoad={()=>setLoaded(true)} onError={()=>setLoaded(true)}/><div><small>LOOPFORGE / DAY 01</small><h2>{phase==='night'?'Night':phase==='morning'?'Morning':'Shift start'}</h2><p>{phase==='night'?'Six hours to charge. Eighteen to work.':phase==='morning'?'The factory is waiting for its orders.':'The line answers to you.'}</p></div></div>;
}
