'use client';
import Link from 'next/link';
import ReviewNavigation from './ReviewNavigation';
import ReviewChecklist from './ReviewChecklist';
import ReviewCameraControls from './ReviewCameraControls';
import {useEffect,useRef,useState} from 'react';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import bank from '@/lib/loopforge/agents/worker-review.json';
import manifest from '@/lib/assets/generated/loopforge-worker-review.json';
import type {FactoryScene,SceneReport} from '../factory-study/scene';
import type {loadWorker,WorkerSurface} from './worker-model';
import styles from './agent-test.module.css';
type Puppet=Awaited<ReturnType<typeof loadWorker>>;
const file=manifest.assets['worker-01'].variants[0];
export default function WorkerModelReview(){
 const canvas=useRef<HTMLCanvasElement>(null),runtime=useRef<{floor:FactoryScene;model:Puppet}|null>(null);
 const [ready,setReady]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[running,setRunning]=useState(false),[id,setId]=useState('idle'),[phase,setPhase]=useState(0),[speed,setSpeed]=useState(1),[loop,setLoop]=useState(true),[centred,setCentred]=useState(true),[turn,setTurn]=useState(0),[camera,setCamera]=useState<'model'|'cctv'>('model'),[angle,setAngle]=useState(0),[room,setRoom]=useState<'security'|'conveyor'>('security'),[surface,setSurface]=useState<WorkerSurface>('textured'),[lamp,setLamp]=useState(true),[report,setReport]=useState<SceneReport|null>(null);
 const clip=bank.clips.find(c=>c.id===id),duration=clip?.duration??0;
 useEffect(()=>{
  let alive=true,inView=true,floor:FactoryScene|null=null,puppet:Puppet|null=null;const abort=new AbortController();
  const visibility=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??false;runtime.current?.floor.active(inView);});if(canvas.current)visibility.observe(canvas.current);
  void(async()=>{try{
   const {createFactoryScene}=await import('../factory-study/scene');if(!alive||!canvas.current)return;
   floor=createFactoryScene(canvas.current,r=>{if(alive)setReport(r);},()=>{},{reviewOnly:true});
   floor.inset(0,0);floor.isolate(true);floor.motion(false);floor.review('model',3.8);floor.focus('security');floor.cctv(true,0,false);floor.update({...initialStudy(),workers:[],running:false});
   const {loadWorker}=await import('./worker-model');if(!alive)return;
   puppet=await loadWorker(floor.characterStage(),abort.signal,(p,ended)=>{if(alive){setPhase(p);if(ended){setRunning(false);floor?.update({...initialStudy(),workers:[],running:false});}}});
   if(!alive){puppet.dispose();return;}runtime.current={floor,model:puppet};floor.active(inView);setReady(true);
  }catch(e){if(alive){puppet?.dispose();floor?.dispose();puppet=null;floor=null;runtime.current=null;setError(e instanceof Error?e.message:'Unable to load worker.');}}})();
  const hidden=()=>{if(document.hidden){runtime.current?.model.play(false);runtime.current?.floor.update({...initialStudy(),workers:[],running:false});setRunning(false);}};
  document.addEventListener('visibilitychange',hidden);
  return()=>{alive=false;abort.abort();visibility.disconnect();document.removeEventListener('visibilitychange',hidden);runtime.current=null;puppet?.dispose();floor?.dispose();};
 },[retry]);
 function play(v:boolean){setRunning(v);runtime.current?.model.play(v);runtime.current?.floor.update({...initialStudy(),workers:[],running:v});}
 function choose(value:string){play(false);setId(value);setPhase(0);const repeat=bank.clips.find(c=>c.id===value)?.loop??false;setLoop(repeat);runtime.current?.model.loop(repeat);runtime.current?.model.clip(value);}
 function seek(seconds:number){play(false);const p=duration?Math.min(1,Math.max(0,seconds/duration)):0;setPhase(p);runtime.current?.model.seek(p);}
 function rotate(n:number){setTurn(n);runtime.current?.model.turn(n);}
 function evidence(){const data={revision:bank.revision,file,clip,phase,seconds:phase*duration,speed,loop,centred,turn,camera,angle,room,surface,lamp,report,cameraPose:runtime.current?.floor.reviewCamera(),viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},note:bank.auditMethod};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='loopforge-worker-review.json';a.click();URL.revokeObjectURL(url);}
 function reset(){setReady(false);setError('');setRunning(false);setId('idle');setPhase(0);setSpeed(1);setLoop(true);setCentred(true);setTurn(0);setCamera('model');setAngle(0);setRoom('security');setSurface('textured');setLamp(true);setRetry(n=>n+1);}
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/play/asset-review'>← Asset review library</Link><h1>Worker 01<span>19 motions / factory lighting review</span></h1></div><Link href='/stepanoskin/loopforge/design#agents'>Game design · Agents ↗</Link></header>
  <ReviewNavigation current='worker-01-motions'/><ReviewChecklist subject='worker-01-motions'/>
  <div className={styles.workspace}>
   <section className={`${styles.stage} ${styles.modelStage}`} aria-label='Worker motion review'>
    <ReviewCameraControls ready={ready} fixed={camera==='cctv'} onAction={a=>runtime.current?.floor.reviewCamera(a)}/>
    <canvas tabIndex={0} ref={canvas} aria-label='Rigged Worker 01 in the factory'/>
    <div className={styles.cameraTag}><i className={running?styles.rec:''}/>{room==='security'?'SECURITY':'LATTICE FORGE'}<span>{camera==='model'?'MOTION REVIEW':`CCTV · CAM ${angle+1}`}</span></div>
    {!ready&&<div className={styles.loading} role='status'><strong>{error?'Worker unavailable':'Preparing Worker 01…'}</strong><p>{error||'Loading one body and the complete motion bank.'}</p>{error&&<button onClick={reset}>Retry loading</button>}</div>}
    <div className={styles.caption}><span>25,893 TRIANGLES / 24 SKIN JOINTS</span><strong>{clip?.label??'Neutral rig'} · {running?'playing':'paused'}</strong><small>{clip?.actor==='Cathexis'?'CATHEXIS DEFAULT WALK · WORKER STAND-IN':`${(phase*duration).toFixed(2)} / ${duration.toFixed(2)} s · ${speed}×`}</small></div>
   </section>
   <aside className={styles.controls} aria-label='Worker review controls'>
    <span className={styles.kicker}>Worker motion bank / review v1</span><h2>Read the movement.</h2><p>Play, slow down or jump to a flagged pose. These are review candidates; the factory simulation still uses its existing characters.</p>
    <label>Animation<select disabled={!ready} value={id} onChange={e=>choose(e.target.value)}><option value='Rest'>Neutral rig · A-pose</option>{bank.clips.map(c=><option key={c.id} value={c.id}>{c.label}{c.actor==='Cathexis'?' · Cathexis':''}</option>)}</select></label>
    <p className={styles.intent}>{clip?.note??'Original neutral rig. No animation is applied.'}</p>
    <div className={styles.duo}><button className={styles.primary} disabled={!ready||!clip} onClick={()=>play(!running)}>{running?'Pause animation':'Play animation'}</button><button disabled={!ready} onClick={()=>seek(0)}>First frame</button></div>
    <label>Animation frame<input type='range' min='0' max='1000' step='1' disabled={!ready||!clip} value={Math.round(phase*1000)} onChange={e=>seek(Number(e.target.value)/1000*duration)}/></label>
    <label>Time in seconds<input className={styles.timeInput} type='number' min='0' max={duration} step='.01' disabled={!ready||!clip} value={Number((phase*duration).toFixed(2))} onChange={e=>{const n=e.target.valueAsNumber;if(Number.isFinite(n))seek(n);}}/></label>
    <label>Playback speed<select disabled={!ready} value={speed} onChange={e=>{const n=Number(e.target.value);setSpeed(n);runtime.current?.model.speed(n);}}><option value='.25'>¼ speed</option><option value='.5'>½ speed</option><option value='1'>Normal</option></select></label>
    <label className={styles.check}><input type='checkbox' disabled={!ready||!clip} checked={loop} onChange={e=>{setLoop(e.target.checked);runtime.current?.model.loop(e.target.checked);}}/> Repeat clip</label>
    {!!clip&&<div className={styles.beats} aria-label='Sampled review poses'>{clip.markers.map(m=><button key={m.label} disabled={!ready} onClick={()=>seek(m.time)}>{m.label.replace('leftLeg / rightLeg','Legs').replace('leftArm / rightArm','Arms').replace('hands / head','Hand / head')} · {m.time.toFixed(2)} s{m.intersections?' · contact':''}</button>)}</div>}
    <button disabled={!ready} aria-pressed={id==='Hot_Walk'} onClick={()=>choose('Hot_Walk')}>Hot Walk → Cathexis</button>
    <details><summary>Camera & appearance</summary>
     <label>View<select disabled={!ready} value={camera} onChange={e=>{const mode=e.target.value as typeof camera;setCamera(mode);runtime.current?.floor.review(mode==='model'?'model':'model-cctv');runtime.current?.floor.cctv(true,angle,false);}}><option value='model'>Close model inspection</option><option value='cctv'>CCTV scale review</option></select></label>
     {camera==='cctv'&&<div className={styles.duo}>{[0,1,2].map(n=><button disabled={!ready} key={n} aria-pressed={angle===n} onClick={()=>{setAngle(n);runtime.current?.floor.cctv(true,n,false);}}>CAM {n+1}</button>)}</div>}
     <div className={styles.duo}>{[['Front',0],['Side',90],['Back',180]].map(([label,n])=><button key={label} disabled={!ready} aria-pressed={turn===n} onClick={()=>rotate(Number(n))}>{label}</button>)}</div>
     <label>Turn character<input type='range' min='0' max='360' value={turn} disabled={!ready} onChange={e=>rotate(Number(e.target.value))}/></label>
     <label>Factory room<select disabled={!ready} value={room} onChange={e=>{const value=e.target.value as typeof room;setRoom(value);runtime.current?.floor.focus(value);runtime.current?.model.room(value);}}><option value='security'>Security</option><option value='conveyor'>Lattice Forge</option></select></label>
     <label className={styles.check}><input type='checkbox' disabled={!ready} checked={centred} onChange={e=>{setCentred(e.target.checked);runtime.current?.model.centre(e.target.checked);}}/> Keep subject centred</label><p>Centres horizontal pelvis travel for inspection. Switch off to see source travel; no locomotion correction is baked into the clip.</p>
     <label className={styles.check}><input type='checkbox' disabled={!ready} checked={lamp} onChange={e=>{setLamp(e.target.checked);runtime.current?.model.light(e.target.checked);}}/> Inspection lamp</label>
     <label>Surface inspection<select disabled={!ready} value={surface} onChange={e=>{const value=e.target.value as WorkerSurface;setSurface(value);runtime.current?.model.surface(value);}}><option value='textured'>Textured metal</option><option value='clay'>Untextured shape</option><option value='wireframe'>Wireframe</option></select></label>
    </details>
    <details><summary>Asset, audit & performance</summary><p>{bank.auditMethod}</p><dl><dt>One shared body / 19 motions</dt><dd>{(file.bytes/1048576).toFixed(2)} MiB · loaded once</dd><dt>Frame p50 / p95 / p99</dt><dd>{report?.p50??'—'} / {report?.p95??'—'} / {report?.p99??'—'} ms</dd><dt>Draw calls / submitted triangles</dt><dd>{report?.drawCalls??'—'} / {report?.triangles?.toLocaleString()??'—'}</dd><dt>Canvas resolution</dt><dd>{report?.resolution??'—'}</dd>{clip&&<><dt>Source clip (vendor alias)</dt><dd className={styles.breakWord}>{clip.sourceClip}</dd><dt>Net pelvis travel · x / y / z</dt><dd>{clip.netTravelMetres.map(n=>n.toFixed(2)).join(' / ')} m</dd></>}</dl><p>Includes the factory room. Review on target devices before crowd use. Afraid recoil and precision work/cradle interaction still need authoring. Hot Walk must be retargeted onto Cathexis’s future rig.</p><a href='/loopforge-design/production/WORKER_MOTION_REVIEW.md'>Full audit record ↗</a></details>
    <button disabled={!ready} onClick={evidence}>Save review evidence</button>
   </aside>
  </div>
 </main>;
}
