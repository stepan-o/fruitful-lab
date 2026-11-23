'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import type {createPerformanceRun,Progress} from './performance-run';
import {REFERENCE_GRAPHICS} from '@/lib/loopforge/graphics/settings';
import {graphicsSnapshot} from '@/lib/loopforge/graphics/store';
import {fixedGraphics} from '@/lib/loopforge/performance/comparison';
import styles from './performance-acceptance.module.css';
export default function PerformanceAcceptance(){
 const canvas=useRef<HTMLCanvasElement>(null),bubbleA=useRef<HTMLDivElement>(null),bubbleB=useRef<HTMLDivElement>(null),runtime=useRef<Awaited<ReturnType<typeof createPerformanceRun>>|null>(null);
 const settings=useRef(REFERENCE_GRAPHICS);
 const [profile,setProfile]=useState('reference');
 const [prepare,setPrepare]=useState(false),[progress,setProgress]=useState<Progress|null>(null),[error,setError]=useState('');
 useEffect(()=>{if(!prepare)return;let alive=true;const abort=new AbortController();
  async function boot(){try{const {createPerformanceRun}=await import('./performance-run');if(!alive)return;
   const run=await createPerformanceRun(canvas.current!,[bubbleA.current!,bubbleB.current!],abort.signal,p=>{if(alive)setProgress(p);},settings.current);if(!alive)run.dispose();else runtime.current=run;
  }catch(e){if(alive)setError(e instanceof Error?e.message:'Scene could not load.');}}void boot();
  return()=>{alive=false;abort.abort();runtime.current?.dispose();runtime.current=null;};
 },[prepare]);
 const active=progress?.state==='warming'||progress?.state==='running';
 function save(){if(!progress?.result)return;const url=URL.createObjectURL(new Blob([JSON.stringify(progress.result,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='loopforge-room-crowd-acceptance.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <main className={styles.page}>
  <header><Link href='/stepanoskin/loopforge/play/scene-studies'>← Scene studies</Link><h1>Factory performance acceptance</h1><p>24 workers · LIMEN · STILETTO · machinery · two speech bubbles · blade energy & visor. One room at a time.</p></header>
  <p><Link href="/stepanoskin/loopforge/play/performance-lab">← Graphics comparison lab</Link></p>
  {!prepare&&<label>Test profile <select value={profile} onChange={e=>setProfile(e.target.value)}><option value="reference">Original 720p reference</option><option value="selected">My saved graphics settings (fixed during test)</option></select></label>}
  <div className={styles.controls}>
   {!prepare?<button onClick={()=>{settings.current=profile==='reference'?REFERENCE_GRAPHICS:fixedGraphics(graphicsSnapshot());setPrepare(true);}}>Load test scene</button>:<button disabled={!progress||progress.state!=='ready'} onClick={()=>runtime.current?.start()}>Start ten-minute test</button>}
   <button disabled={progress?.state!=='running'} onClick={e=>runtime.current?.probe(e.timeStamp)}>Check response</button>
   <button disabled={!active} onClick={()=>runtime.current?.cancel()}>Cancel test</button>
   <button disabled={!progress?.result} onClick={save}>Save result</button>
   {progress?.state==='finished'&&<button onClick={()=>{setPrepare(false);setProgress(null);setError('');}}>Reset test</button>}
  </div>
  <p className={styles.status} role='status'>{error||(!prepare?'Ready to prepare the scene.':!progress?'Loading the approved cast…':`${progress.state.toUpperCase()} · ${Math.floor(progress.seconds)} s · ${progress.room} / angle ${progress.angle} · ${progress.fps} FPS · p95 ${progress.p95} ms · ${progress.drawCalls} draws · ${progress.triangles.toLocaleString()} triangles · ${progress.probes} response checks`)}</p>
  {progress?.result&&<p className={styles.result}><strong>Whole run: {progress.result.status}</strong> · {progress.result.frames.fps.toFixed(1)} FPS average · p95 {progress.result.frames.p95Ms.toFixed(1)} ms · p99 {progress.result.frames.p99Ms.toFixed(1)} ms · {progress.result.frames.stallsOver100} stalls over 100 ms. The status line above shows the last rolling sample.</p>}
  <div className={styles.stage}><canvas ref={canvas} aria-label='26 animated robots in the factory performance test'/><div ref={bubbleA} className={styles.bubble}/><div ref={bubbleB} className={styles.bubble}/>{!prepare&&<div className={styles.empty}>The full cast loads when you choose “Load test scene”.</div>}</div>
  <p>30-second warm-up, then ten active minutes at a fixed resolution: 1280 × 720 for the reference, or the selected scale of that size. Rendering is uncapped; the same 30 FPS acceptance thresholds apply. Three angles per room; angle changes every 20 seconds, room changes every minute. Click “Check response” during the run. Keep this tab and scene visible; hiding it invalidates the test. Cancel stops rendering.</p>
  <details open={!!progress?.result}><summary>{progress?.result?`Result: ${progress.result.status}`:'Acceptance rules and scope'}</summary><p>30 FPS average; p95 ≤ 33.33 ms in every angle segment; p99 ≤ 66.67 ms; at most six frames over 100 ms and none over 500 ms; all 29 switches and a manual response check ≤ 200 ms; no context loss or net resource-count growth. The measured timeline includes switching stalls.</p><p>This exercises approved full-detail bodies with independent poses and shared worker resources. Locomotion is sampled in place; decisions, navigation, contacts, final room art, cold internet loading and three simultaneous CCTV feeds are separate tests. Hardware limits are reported even when the test fails.</p>{progress?.result&&<pre aria-label='Acceptance result JSON'>{JSON.stringify(progress.result,null,2)}</pre>}</details>
  <Link href='/loopforge-design/production/FRONTEND_PERFORMANCE_ACCEPTANCE.md'>Protocol and recorded runs ↗</Link>
 </main>;
}
