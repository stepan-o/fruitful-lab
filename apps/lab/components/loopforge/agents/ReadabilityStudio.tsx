'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {READABILITY_DEFAULT,parseReadability,type ReadabilitySettings} from '@/lib/loopforge/readability/settings';
import type {createReadabilityScene} from './readability-scene';
import type {GraphicsFrame} from '../factory-study/scene';
import styles from './readability-studio.module.css';

type Runtime=Awaited<ReturnType<typeof createReadabilityScene>>;
const STORAGE='loopforge-readability-v1';
function saveUrl(url:string,name:string){const a=document.createElement('a');a.href=url;a.download=name;a.click();}
function Range({label,value,min=0,max=100,step=1,unit='%',onChange}:{label:string;value:number;min?:number;max?:number;step?:number;unit?:string;onChange:(n:number)=>void}){
 return <label className={styles.range}><span>{label}<output>{step<1?value.toFixed(2):value}{unit}</output></span><input type='range' aria-label={label} value={value} min={min} max={max} step={step} onChange={e=>onChange(Number(e.target.value))}/></label>;
}
function Colour({label,value,onChange}:{label:string;value:string;onChange:(s:string)=>void}){return <label className={styles.colour}><input type='color' aria-label={label} value={value} onChange={e=>onChange(e.target.value)}/><span>{label}<small>{value.toUpperCase()}</small></span></label>;}
export default function ReadabilityStudio(){
 const canvas=useRef<HTMLCanvasElement>(null),limenLabel=useRef<HTMLDivElement>(null),stilettoLabel=useRef<HTMLDivElement>(null),runtime=useRef<Runtime|null>(null);
 const [settings,setSettings]=useState({...READABILITY_DEFAULT}),latest=useRef(settings);
 const [hydrated,setHydrated]=useState(false);
 const [ready,setReady]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[saving,setSaving]=useState(false),[status,setStatus]=useState(''),[pinned,setPinned]=useState<{src:string;label:string}|null>(null),[metrics,setMetrics]=useState<GraphicsFrame|null>(null);
 useEffect(()=>{
  let alive=true,owned:Runtime|null=null,metricsTimer:ReturnType<typeof setTimeout>|undefined;const abort=new AbortController();
  try{const saved=localStorage.getItem(STORAGE);if(saved){latest.current=parseReadability(JSON.parse(saved));setSettings(latest.current);}}catch{/* Storage is optional. */}
  setHydrated(true);
  void(async()=>{try{
   const {createReadabilityScene}=await import('./readability-scene');if(!alive)return;
   owned=await createReadabilityScene(canvas.current!,[limenLabel.current!,stilettoLabel.current!],abort.signal,f=>{clearTimeout(metricsTimer);metricsTimer=setTimeout(()=>{if(alive)setMetrics(f);},200);});
   if(!alive){owned.dispose();owned=null;return;}runtime.current=owned;owned.update(latest.current);setReady(true);
  }catch(e){owned?.dispose();owned=null;runtime.current=null;if(alive)setError(e instanceof Error?e.message:'The studio could not load.');}})();
  return()=>{alive=false;abort.abort();clearTimeout(metricsTimer);runtime.current=null;owned?.dispose();};
 },[retry]);
 useEffect(()=>{if(!hydrated)return;latest.current=settings;runtime.current?.update(settings);try{localStorage.setItem(STORAGE,JSON.stringify(settings));}catch{/* Storage is optional. */}},[settings,hydrated]);
 function change(patch:Partial<ReadabilitySettings>,appearance=false){setSettings(s=>({...s,...patch,...(appearance?{original:false}:{})}));}
 async function capture(pin=false){const r=runtime.current;if(!r)return;setSaving(true);setStatus('');try{const src=await r.capture();const label=`${settings.original?'Original':'Treatment'} · ${settings.room} · ${settings.camera}`;if(pin){setPinned({src,label});setStatus('Reference pinned below. It stays fixed while you adjust the live shot.');}else{saveUrl(src,`loopforge-cast-${settings.room}-${settings.original?'original':'treatment'}-${settings.size}.png`);setStatus('Clean shot saved. Names and bubbles are excluded.');}}catch(e){setStatus(e instanceof Error?e.message:'Could not save shot.');}finally{setSaving(false);}}
 function saveSettings(){const r=runtime.current;if(!r)return;const url=URL.createObjectURL(new Blob([JSON.stringify(r.evidence(),null,2)],{type:'application/json'}));saveUrl(url,'loopforge-readability-settings.json');setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Settings and asset references saved.');}
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/design#agents'>← Character design</Link><p className={styles.kicker}>LOOPFORGE / CAST READABILITY</p><h1>Find the supervisors.</h1><p>One still. Twenty-four workers. Two supervisors.<br/>Tune the scene until you can tell them apart without a name.</p></div><Link href='/stepanoskin/loopforge/play/asset-review'>Individual model reviews ↗</Link></header>
  <div className={styles.layout}>
   <section className={styles.workspace} aria-label='Static shot comparison'>
    <div className={styles.toolbar}><div className={styles.segment} aria-label='Appearance comparison'>
     <button disabled={!ready} aria-pressed={settings.original} onClick={()=>change({original:true})}>Original</button><button disabled={!ready} aria-pressed={!settings.original} onClick={()=>change({original:false})}>Your treatment</button>
    </div><div className={styles.segment} aria-label='Shot size'><button aria-pressed={settings.size==='room'} onClick={()=>change({size:'room'})}>Room</button><button aria-pressed={settings.size==='console'} onClick={()=>change({size:'console'})}>Console · 320px</button></div></div>
    <div className={styles.stageWell}>
     <div className={`${styles.viewport} ${settings.size==='console'?styles.console:''}`}>
      <canvas ref={canvas} aria-label='Static factory shot with 24 workers, LIMEN and STILETTO'/>
      <div ref={limenLabel} hidden className={styles.label}><strong>LIMEN</strong><span>Papers first. Every worker.</span></div>
      <div ref={stilettoLabel} hidden className={styles.label}><strong>STILETTO</strong><span>My line needs those workers.</span></div>
      {!ready&&<div className={styles.loading} role='status'>{error||'Preparing the static cast…'}{error&&<button onClick={()=>{setError('');setRetry(n=>n+1);}}>Retry</button>}</div>}
     </div>
    </div>
    <div className={styles.shotBar}><span>{settings.original?'ORIGINAL':'TREATMENT'} / {settings.room.toUpperCase()} / {settings.camera.toUpperCase()}</span><span>{settings.size==='console'?'320 × 180':'1280 × 720'} · still frame</span></div>
    <fieldset className={styles.framing} disabled={!ready}><legend>Frame the comparison</legend>
     <label>Room<select value={settings.room} onChange={e=>change({room:e.target.value as ReadabilitySettings['room']})}><option value='conveyor'>Conveyor</option><option value='security'>Security</option></select></label>
     <label>Camera<select value={settings.camera} onChange={e=>change({camera:e.target.value as ReadabilitySettings['camera']})}><option value='front'>Front</option><option value='side'>Side</option><option value='rear'>Rear</option></select></label>
     <Range label='Camera distance' value={settings.distance} min={18} max={36} unit=' m' onChange={distance=>change({distance})}/>
    </fieldset>
    <div className={styles.actions}><button disabled={!ready||saving} onClick={()=>void capture(true)}>Pin reference shot</button><button disabled={!ready||saving} onClick={()=>void capture()}>Save PNG</button><button disabled={!ready} onClick={saveSettings}>Save settings</button></div>
    <p className={styles.status} role='status'>{status}</p>
    {pinned&&<figure className={styles.pinned}>{/* A local capture, never a second WebGL scene. */}
     {/* eslint-disable-next-line @next/next/no-img-element */}
     <img src={pinned.src} alt={pinned.label+' pinned reference'} width={1280} height={720}/><figcaption>{pinned.label}<button onClick={()=>setPinned(null)}>Remove reference</button></figcaption>
    </figure>}
    <p className={styles.note}>Poses stay fixed. Changes redraw the same scene; nothing plays in the background. Console mode renders at its actual 320 × 180 size.</p>
    <details className={styles.details}><summary>What this study establishes</summary><p>This auditions colour, size and background separation using the accepted models. Paint follows approximate texture brightness and body regions; final armour masks still need authoring. STILETTO’s red shoulder band is a colour-area study.</p><p>Supervisor height is measured against the worker’s neutral foot-to-skull body height. Crowns and tools are excluded. CATHEXIS joins a later three-supervisor study.</p><p>{metrics?`${metrics.drawCalls} draw calls · ${metrics.triangles.toLocaleString()} visible triangles.`:'Preparing renderer details.'} Still frames do not establish animation performance or prove recognition. <Link href='/stepanoskin/loopforge/play/performance-lab'>Performance lab →</Link></p></details>
   </section>
   <aside className={styles.controls} aria-label='Appearance settings'>
    <div className={styles.controlsHeading}><h2>Shape the shot</h2><button disabled={!ready} onClick={()=>{setSettings({...READABILITY_DEFAULT});setStatus('Proposal defaults restored.');}}>Reset</button></div>
    <fieldset disabled={!ready}><legend>01 / Background</legend>
     <div className={styles.segment}>{(['current','neutral','proposed'] as const).map(background=><button key={background} aria-pressed={!settings.original&&settings.background===background} onClick={()=>change({background},true)}>{background==='current'?'Existing':background==='neutral'?'Neutral':'Quieter'}</button>)}</div>
     <p className={styles.hint}>Neutral removes the room around the cast. Lighting stays the same.</p>
     <div className={styles.colours}><Colour label='Floor' value={settings.floor} onChange={floor=>change({floor,background:'proposed'},true)}/><Colour label='Walls' value={settings.walls} onChange={walls=>change({walls,background:'proposed'},true)}/></div>
     <Range label='Room texture contrast' value={settings.detail} onChange={detail=>change({detail,background:'proposed'},true)}/>
     <Range label='Neutralise room lighting' value={settings.neutralLight} onChange={neutralLight=>change({neutralLight},true)}/>
    </fieldset>
    <fieldset disabled={!ready}><legend>02 / Cast</legend>
     <Colour label='Worker blue family' value={settings.worker} onChange={worker=>change({worker},true)}/><Range label='Worker paint strength' value={settings.workerPaint} onChange={workerPaint=>change({workerPaint},true)}/>
     <div className={styles.divider}/><Colour label='LIMEN steel' value={settings.limen} onChange={limen=>change({limen},true)}/><Range label='LIMEN paint strength' value={settings.limenPaint} onChange={limenPaint=>change({limenPaint},true)}/><Range label='LIMEN height / worker' value={settings.limenHeight} min={1} max={1.5} step={.01} unit='×' onChange={limenHeight=>change({limenHeight},true)}/>
     <div className={styles.divider}/><Colour label='STILETTO shoulder accent' value={settings.stiletto} onChange={stiletto=>change({stiletto},true)}/><Range label='STILETTO accent strength' value={settings.stilettoPaint} onChange={stilettoPaint=>change({stilettoPaint},true)}/><Range label='STILETTO height / worker' value={settings.stilettoHeight} min={1} max={1.5} step={.01} unit='×' onChange={stilettoHeight=>change({stilettoHeight},true)}/>
    </fieldset>
    <fieldset disabled={!ready}><legend>03 / Recognition checks</legend>
     <label className={styles.check}><input type='checkbox' checked={settings.labels} onChange={e=>change({labels:e.target.checked})}/>Names & speech bubbles</label>
     <label className={styles.check}><input type='checkbox' checked={settings.signatures} onChange={e=>change({signatures:e.target.checked})}/>Cyan emitter & red visor</label>
     <label className={styles.check}><input type='checkbox' checked={settings.bloom} onChange={e=>change({bloom:e.target.checked})}/>Glow halo</label>
     <label className={styles.check}><input type='checkbox' checked={settings.shadows} onChange={e=>change({shadows:e.target.checked})}/>Cast shadows</label>
     <p className={styles.hint}>Try a rear view with lights and names off. Body shape and colour should still carry identity.</p>
    </fieldset>
   </aside>
  </div>
 </main>;
}
