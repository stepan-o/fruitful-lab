/* eslint-disable @next/next/no-img-element -- immutable, already optimized original-art reference */
'use client';
import Link from 'next/link';
import {useCallback,useEffect,useRef,useState} from 'react';
import {initialAgentTest,stepAgentTest,replayAgentTest,projectAgentTest,cancelAgentTest,type TestConfig,type TestState} from '@/lib/loopforge/agents/production-test';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import type {FactoryScene,SceneReport} from '../factory-study/scene';
import type {loadCast,CastReport} from './cast';
import sheets from '@/lib/assets/generated/loopforge.json';
import workerArt from '@/lib/assets/generated/loopforge-supervisors.json';
import styles from './agent-test.module.css';
type CastRenderer=Awaited<ReturnType<typeof loadCast>>;
const defaults:TestConfig={kind:'gate',supervisor:'limen',count:10,strained:false};
const reference={limen:sheets.assets.limen,stiletto:sheets.assets.stiletto,worker:workerArt.assets['thrum-conveyor']};
export default function AgentProductionTest(){
 const canvas=useRef<HTMLCanvasElement>(null),runtime=useRef<{floor:FactoryScene;cast:CastRenderer}|null>(null),state=useRef(initialAgentTest(defaults)),playing=useRef(false),dialog=useRef<HTMLDialogElement>(null);
 const [config,setConfig]=useState(defaults),[status,setStatus]=useState('Preparing character stage…'),[error,setError]=useState(''),[retry,setRetry]=useState(0),[ready,setReady]=useState(false),[running,setRunning]=useState(false),[snapshot,setSnapshot]=useState<TestState>(state.current),[report,setReport]=useState<SceneReport|null>(null),[castReport,setCastReport]=useState<CastReport|null>(null),[mode,setMode]=useState<'hybrid'|'skeletal'>('hybrid'),[angle,setAngle]=useState(0),[triple,setTriple]=useState(true),[referenceKind,setReferenceKind]=useState<keyof typeof reference>('limen');
 const frame=useRef({angle:0,triple:true});
 const sync=useCallback(()=>{const r=runtime.current;if(!r)return;const view=projectAgentTest(state.current);r.cast.update(view,!playing.current);r.floor.update({...initialStudy(),workers:[],running:playing.current,tick:view.tick,process:{intake:0,outtake:0,assembly:0}});setSnapshot(state.current);},[]);
 useEffect(()=>{let alive=true,local:FactoryScene|null=null,cast:CastRenderer|null=null;const abort=new AbortController();setReady(false);setError('');setStatus('Preparing the factory…');
  void (async()=>{try{const {createFactoryScene}=await import('../factory-study/scene');if(!alive||!canvas.current)return;local=createFactoryScene(canvas.current,r=>{if(alive){setReport({...r,workers:state.current.workers.length});if(cast)setCastReport(cast.report());}},()=>{},{reviewOnly:true});local.inset(0,0);local.isolate(true);local.review(true);local.motion(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);local.focus('security');local.cctv(true,frame.current.angle,frame.current.triple&&window.innerWidth>=950);local.update({...initialStudy(),workers:[]});const {loadCast}=await import('./cast');cast=await loadCast(local.characterStage(),abort.signal,s=>{if(alive)setStatus(s);});if(!alive){cast.dispose();return;}runtime.current={floor:local,cast};setReady(true);setStatus('Ready');sync();}catch(e){if(alive){cast?.dispose();cast=null;local?.dispose();local=null;runtime.current=null;setError(e instanceof Error?e.message:'The character stage could not load.');setStatus('Load interrupted');}}})();
  const resize=()=>runtime.current?.floor.cctv(true,frame.current.angle,frame.current.triple&&window.innerWidth>=950);window.addEventListener('resize',resize);
  const hidden=()=>{if(document.hidden){playing.current=false;setRunning(false);sync();}};document.addEventListener('visibilitychange',hidden);
  return()=>{alive=false;abort.abort();playing.current=false;window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',hidden);runtime.current=null;if(cast)cast.dispose();local?.dispose();};
 },[retry,sync]);
 useEffect(()=>{const timer=setInterval(()=>{if(!playing.current||!runtime.current||document.hidden)return;state.current=stepAgentTest(state.current);const view=projectAgentTest(state.current);runtime.current.cast.update(view,false);runtime.current.floor.characterStage().refresh();if(state.current.tick%4===0)setSnapshot(state.current);if(view.finished){playing.current=false;setRunning(false);sync();}},50);return()=>clearInterval(timer);},[sync]);
 function reset(next:TestConfig){playing.current=false;setRunning(false);state.current=initialAgentTest(next);setConfig(next);const r=runtime.current;r?.floor.focus(next.kind==='gate'?'security':'conveyor');r?.floor.cctv(true,angle,triple&&window.innerWidth>=950);sync();}
 function toggle(){playing.current=!playing.current;setRunning(playing.current);sync();}
 function camera(n:number){setAngle(n);frame.current.angle=n;runtime.current?.floor.cctv(true,n,triple&&window.innerWidth>=950);}
 function seek(tick:number){playing.current=false;setRunning(false);state.current=replayAgentTest(config,tick);sync();}
 function saveEvidence(){const data={recordedAt:new Date().toISOString(),fixture:state.current.version,config,mode,view:projectAgentTest(state.current),report,castReport,viewport:{width:window.innerWidth,height:window.innerHeight,dpr:window.devicePixelRatio},trace:state.current.trace};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='loopforge-agent-test.json';a.click();URL.revokeObjectURL(url);}
 const view=projectAgentTest(snapshot),ref=reference[referenceKind],image=ref.variants.find(v=>v.width>=960)??ref.variants.at(-1)!;
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/design#agents'>← Character direction</Link><h1>Agents at work<span>Production test / 01</span></h1></div><Link href='/stepanoskin/loopforge/play'>Producer console ↗</Link></header>
  <div className={styles.workspace}>
   <section className={styles.stage} aria-label='Factory character review'>
    <canvas ref={canvas} aria-label='Animated character review in the actual factory' />
    <div className={styles.cameraTag}><i className={running?styles.rec:''}/>{config.kind==='gate'?'SECURITY / CLEARANCE':'LATTICE FORGE / CONTACT'}<span>CAM {angle+1}</span></div>
    {!ready&&<div className={styles.loading} role='status'><strong>{error?'Stage unavailable':status}</strong>{error?<><p>{error}</p><button onClick={()=>setRetry(n=>n+1)}>Retry loading</button></>:<p>Loading the rigged cast once. No model service is used.</p>}</div>}
    <div className={styles.caption}><span>{String(snapshot.tick/20).split('.')[0].padStart(2,'0')} / 30 SEC</span><strong>{view.phase}</strong><small>{view.completed} {config.kind==='gate'?'released':config.kind==='transfer'?'transfers':'accepted instructions'}</small></div>
   </section>
   <aside className={styles.controls} aria-label='Production test controls'>
    <span className={styles.kicker}>The same truth. Three cameras.</span>
    <Link className={styles.modelLink} href="/stepanoskin/loopforge/play/agent-test/limen">New · Inspect the Meshy LIMEN model →</Link><h2>Watch the difference.</h2><p>A bounded production take. These interactions do not change your game save.</p>
    <label>Interaction<select value={config.kind} disabled={!ready} onChange={e=>reset({...config,kind:e.target.value as TestConfig['kind']})}><option value='gate'>01 · Inspection & release</option><option value='transfer'>02 · Cradle transfer</option><option value='intervention'>03 · Supervisor & worker</option></select></label>
    <div className={styles.duo}><button aria-pressed={config.supervisor==='limen'} disabled={!ready} onClick={()=>reset({...config,supervisor:'limen'})}>LIMEN</button><button aria-pressed={config.supervisor==='stiletto'} disabled={!ready} onClick={()=>reset({...config,supervisor:'stiletto'})}>STILETTO</button></div>
    <p className={styles.intent}>{config.supervisor==='limen'?'Check the worker. Hold the queue. Release on procedure.':'Cut the delay. Move the worker. Keep the line fed.'}</p>
    {config.kind==='intervention'&&<label className={styles.check}><input type='checkbox' checked={config.strained} onChange={e=>reset({...config,strained:e.target.checked})}/> Strained worker · refusal test</label>}
    <div className={styles.duo}><button className={styles.primary} onClick={toggle} disabled={!ready||view.finished}>{running?'Pause take':'Run take'}</button><button onClick={()=>reset(config)} disabled={!ready}>Reset</button></div>
    <label>Inspect the take<input type='range' min='0' max='600' step='1' value={snapshot.tick} disabled={!ready} onChange={e=>seek(Number(e.target.value))} aria-label='Inspect the take at a fixed tick'/></label>
    <div className={styles.duo}>{[0,1,2].map(n=><button key={n} disabled={!ready} aria-pressed={angle===n} onClick={()=>camera(n)}>CAM {n+1}</button>)}</div>
    <label className={styles.check}><input type='checkbox' checked={triple} onChange={e=>{setTriple(e.target.checked);frame.current.triple=e.target.checked;runtime.current?.floor.cctv(true,angle,e.target.checked&&window.innerWidth>=950);}}/> Three feeds on wide screens</label>
    <button onClick={()=>{setReferenceKind(config.supervisor);dialog.current?.showModal();}}>Compare original character art</button>
    <details><summary>Performance bench</summary><label>Workers<select disabled={!ready} value={config.count} onChange={e=>reset({...config,count:Number(e.target.value) as TestConfig['count']})}><option>10</option><option>24</option><option>100</option></select></label><label>Animation path<select disabled={!ready} value={mode} onChange={e=>{const m=e.target.value as typeof mode;setMode(m);runtime.current?.cast.mode(m);runtime.current?.floor.focus(view.room);sync();}}><option value='hybrid'>Rigged contacts + baked crowd</option><option value='skeletal'>All skeletal · same low-detail crowd</option></select></label>
     <dl><dt>Frame p50 / p95 / p99</dt><dd>{report?.p50??'—'} / {report?.p95??'—'} / {report?.p99??'—'} ms</dd><dt>Draw calls / triangles</dt><dd>{report?.drawCalls??'—'} / {report?.triangles?.toLocaleString()??'—'}</dd><dt>Rendering resolution</dt><dd>{report?.resolution??'—'}</dd><dt>Model package loaded</dt><dd>{castReport?(castReport.loadedBytes/1048576).toFixed(2):'—'} MiB</dd><dt>Baked matrices, decoded</dt><dd>{castReport?Math.round(castReport.bakedBytes/1024):'—'} KiB</dd><dt>Contact correction error</dt><dd>{castReport?.contactErrorMm??'—'} mm</dd></dl><p>Whole canvas, including auxiliary cameras. Laboratory readings; not physical-device certification.</p><button onClick={saveEvidence}>Save evidence JSON</button>
    </details>
   </aside>
  </div>
  <details className={styles.trace}><summary>Inspect the causal trace · author view</summary><p>Private beliefs below are author evidence. They are excluded from the character projection delivered to a player.</p><button disabled={!ready||!snapshot.active} onClick={()=>{playing.current=false;setRunning(false);state.current=cancelAgentTest(state.current);sync();}}>Cancel paired action</button>{snapshot.trace.length===0?<p>Run the take to record a decision.</p>:snapshot.trace.map((t,i)=><article key={i}><span>TICK {t.tick} · {t.action}</span><h3>{t.intention}</h3><p>{t.observation} {t.belief}</p><p><b>Desire:</b> {t.desire}</p><p><b>Validation:</b> {t.validation}</p><p><b>Outcome:</b> {t.outcome}</p></article>)}</details>
  <dialog ref={dialog} className={styles.reference}><button autoFocus onClick={()=>dialog.current?.close()}>Close reference</button><div className={styles.duo}>{(['worker','limen','stiletto'] as const).map(k=><button key={k} aria-pressed={referenceKind===k} onClick={()=>setReferenceKind(k)}>{k.toUpperCase()}</button>)}</div><p>Original Loopforge concept reference. Compare silhouette, head, materials and posture.</p>{/* Native image preserves the immutable art variant. */}<img src={image.src} width={image.width} height={image.height} alt={referenceKind+' original Loopforge concept art'}/></dialog>
 </main>;
}
