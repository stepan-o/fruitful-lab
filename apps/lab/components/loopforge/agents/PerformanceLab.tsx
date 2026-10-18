'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import GraphicsSettings from '../graphics/GraphicsSettings';
import {graphicsSnapshot} from '@/lib/loopforge/graphics/store';
import {COMPARISON_CASES,fixedGraphics,type ComparisonCase} from '@/lib/loopforge/performance/comparison';
import type {createComparisonRun,ComparisonProgress} from './comparison-run';
import styles from './performance-acceptance.module.css';
export default function PerformanceLab(){
 const canvas=useRef<HTMLCanvasElement>(null),a=useRef<HTMLDivElement>(null),b=useRef<HTMLDivElement>(null),runtime=useRef<Awaited<ReturnType<typeof createComparisonRun>>|null>(null);
 const [cases,setCases]=useState<readonly ComparisonCase[]|null>(null),[progress,setProgress]=useState<ComparisonProgress|null>(null),[error,setError]=useState('');
 useEffect(()=>{if(!cases)return;let alive=true;const abort=new AbortController();
  void(async()=>{try{const {createComparisonRun}=await import('./comparison-run');if(!alive)return;const run=await createComparisonRun(canvas.current!,[a.current!,b.current!],abort.signal,cases,p=>{if(alive)setProgress(p);});if(!alive)run.dispose();else runtime.current=run;}catch(e){if(alive)setError(e instanceof Error?e.message:'The scene could not load.');}})();
  return()=>{alive=false;abort.abort();runtime.current?.dispose();runtime.current=null;};
 },[cases]);
 const active=progress?.state==='warming'||progress?.state==='measuring';
 function reset(){setCases(null);setProgress(null);setError('');}
 function save(){if(!progress?.result)return;const url=URL.createObjectURL(new Blob([JSON.stringify(progress.result,null,2)],{type:'application/json'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='loopforge-graphics-comparison.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <main className={styles.page}>
  <header><Link href='/stepanoskin/loopforge/play/scene-studies'>← Scene studies</Link><h1>Graphics & performance lab</h1><p>Find which changes buy smoother motion, and compare their appearance in the same factory scene.</p></header>
  {!cases&&<GraphicsSettings/>}
  <div className={styles.controls}>
   {!cases?<><button onClick={()=>setCases(COMPARISON_CASES)}>Load eight comparisons</button><button onClick={()=>setCases([{id:'selected',label:'Selected graphics settings',settings:fixedGraphics(graphicsSnapshot()),workers:24,workerPoses:'animated'}])}>Load my settings only</button></>:<button disabled={progress?.state!=='ready'} onClick={()=>runtime.current?.start()}>Start comparison</button>}
   <button disabled={!active} onClick={()=>runtime.current?.cancel()}>Cancel</button><button disabled={!progress?.result} onClick={save}>Save comparison</button>
   {(progress?.state==='finished'||error)&&<button onClick={reset}>Reset lab</button>}
  </div>
  <p className={styles.status} role='status'>{error||(!cases?'Choose the controlled suite or measure your selected settings.':!progress?'Loading the approved cast…':`${progress.state.toUpperCase()} · ${progress.index+1}/${cases.length} · ${progress.label} · ${Math.floor(progress.seconds)} s · ${progress.fps} FPS`)}</p>
  <div className={styles.stage}><canvas ref={canvas} aria-label='Controlled factory graphics comparison'/><div ref={a} className={styles.bubble}/><div ref={b} className={styles.bubble}/>{!cases&&<div className={styles.empty}>The scene loads on request.</div>}</div>
  <p>Each comparison warms for 15 seconds, then measures six camera views for one minute. Eight comparisons take about ten minutes. Settings and resolution stay fixed; rendering is uncapped to reveal capacity. Keep the scene visible.</p>
  <p>Results diagnose cost. They do not certify smooth gameplay. <Link href='/stepanoskin/loopforge/play/performance-test'>Run the ten-minute acceptance test →</Link></p>
  {!!progress?.rows.length&&<div className={styles.tableWrap}><table><caption>Measured comparisons · milliseconds unless labelled otherwise</caption><thead><tr><th>Configuration</th><th>FPS</th><th>Frame p95</th><th>CPU mean</th><th>GPU mean</th><th>Worker pose mean</th><th>Stalls &gt;100 ms</th></tr></thead><tbody>{progress.rows.map(row=><tr key={row.configuration.id}><th scope='row'>{row.configuration.label}</th><td>{row.frames.fps.toFixed(1)}</td><td>{row.frames.p95Ms.toFixed(1)}</td><td>{row.cpuMs?.mean.toFixed(1)??'Unavailable'}</td><td>{row.gpuMs?.mean.toFixed(1)??'Unavailable'}</td><td>{row.workerPoseMs?.mean.toFixed(2)??'Unavailable'}</td><td>{row.frames.stallsOver100}</td></tr>)}</tbody></table></div>}
  <details><summary>What these comparisons establish</summary><p>The suite tests resolution, shadows, glow halo, held worker poses and eight visible workers individually. The Performance preset combines changes. The final reference repeat reveals drift from temperature, background load or test order. CPU and GPU work overlap; do not add their times. Unsupported or missing GPU readings are shown as unavailable.</p><p>Visible-crowd and frozen-pose options are laboratory diagnostics. They do not change gameplay population or become player settings. Every run keeps the same 24-worker asset pool in memory. Model and texture detail variants are still future asset-pipeline work.</p><p>The shared graphics controls are available in character reviews, scene studies and the playable room view. Automatic uses a different starting resolution and shadow budget for close inspection and room scenes; it adjusts resolution gradually. Overview support currently defines a profile only; a whole-factory camera grid is not implemented.</p></details>
  {progress?.result&&<details><summary>Exported evidence · {String(progress.result.status)}</summary><pre>{JSON.stringify(progress.result,null,2)}</pre></details>}
  <Link href='/loopforge-design/production/GRAPHICS_AND_PERFORMANCE.md'>Graphics architecture and measured findings ↗</Link>
 </main>;
}
