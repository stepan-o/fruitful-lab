/* eslint-disable @next/next/no-img-element -- on-demand immutable concept reference */
'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import reference from '@/lib/assets/generated/loopforge.json';
import model from '@/lib/assets/generated/loopforge-limen.json';
import {limenIdleDuration,limenIdleCue,limenIdleBeats} from '@/lib/loopforge/agents/limen-idle-cues';
import {limenReviewAsset} from '@/lib/loopforge/agents/review-catalog';
import type {FactoryScene,SceneReport} from '../factory-study/scene';
import type {loadLimen,LimenClip,LimenSurface} from './limen-model';
import styles from './agent-test.module.css';
type Puppet=Awaited<ReturnType<typeof loadLimen>>;
const asset=model.assets.limen.variants[0],housing=model.assets['blade-housing'].variants[0];
export default function LimenModelReview(){
 const canvas=useRef<HTMLCanvasElement>(null),runtime=useRef<{floor:FactoryScene;model:Puppet}|null>(null),dialog=useRef<HTMLDialogElement>(null);
 const [reduced,setReduced]=useState(false);
 const [blade,setBlade]=useState(true),[camera,setCamera]=useState<'model'|'cctv'>('model'),[angle,setAngle]=useState(0),[inspectionLight,setInspectionLight]=useState(true),[ready,setReady]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[running,setRunning]=useState(false),[clip,setClip]=useState<LimenClip>('Idle'),[phase,setPhase]=useState(0),[turn,setTurn]=useState(0),[zoom,setZoom]=useState(3.8),[room,setRoom]=useState<'security'|'conveyor'>('security'),[speed,setSpeed]=useState(1),[surface,setSurface]=useState<LimenSurface>('textured'),[report,setReport]=useState<SceneReport|null>(null),[showReference,setShowReference]=useState(false);
 useEffect(()=>{
  let alive=true,inView=true,floor:FactoryScene|null=null,puppet:Puppet|null=null;const abort=new AbortController();
  setReady(false);setError('');
  const visibility=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??false;runtime.current?.floor.active(inView);});if(canvas.current)visibility.observe(canvas.current);
  void (async()=>{try{
   const {createFactoryScene}=await import('../factory-study/scene');if(!alive||!canvas.current)return;
   floor=createFactoryScene(canvas.current,r=>{if(alive)setReport(r);},()=>{},{reviewOnly:true});
   floor.inset(0,0);floor.isolate(true);floor.motion(false);floor.review('model',3.8);floor.focus('security');floor.cctv(true,0,false);floor.update({...initialStudy(),workers:[],running:false});
   const {loadLimen}=await import('./limen-model');if(!alive)return;puppet=await loadLimen(floor.characterStage(),abort.signal,p=>{if(alive)setPhase(p);});
   if(!alive){puppet.dispose();return;}
   runtime.current={floor,model:puppet};floor.active(inView);setReady(true);
  }catch(e){if(alive){puppet?.dispose();floor?.dispose();puppet=null;floor=null;runtime.current=null;setError(e instanceof Error?e.message:'Unable to load the model.');}}})();
  const hidden=()=>{if(document.hidden){runtime.current?.model.play(false);runtime.current?.floor.update({...initialStudy(),workers:[],running:false});setRunning(false);}};
  document.addEventListener('visibilitychange',hidden);
  return()=>{alive=false;abort.abort();visibility.disconnect();document.removeEventListener('visibilitychange',hidden);runtime.current=null;puppet?.dispose();floor?.dispose();};
 },[retry]);
 function play(value:boolean){setRunning(value);runtime.current?.model.play(value);runtime.current?.floor.update({...initialStudy(),workers:[],running:value});}
 function chooseClip(value:LimenClip){play(false);setClip(value);setPhase(0);runtime.current?.model.clip(value);}
 function changeRoom(value:typeof room){setRoom(value);runtime.current?.floor.focus(value);runtime.current?.model.room(value);runtime.current?.model.turn(turn);}
 function rotate(value:number){setTurn(value);runtime.current?.model.turn(value);}
 function evidence(){const data={review:limenReviewAsset,reduced,blade,camera,angle,inspectionLight,model:'limen-meshy-2026-10-12-v2',asset,housing,clip,phase,room,surface,speed,turn,zoom,report,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},note:'Model/clip review, not a BDI or locomotion test.'};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='loopforge-limen-review.json';a.click();URL.revokeObjectURL(url);}
 const idleBeat=limenIdleCue(phase*limenIdleDuration,reduced).label;
 function seek(time:number){play(false);const p=time/limenIdleDuration;setPhase(p);runtime.current?.model.seek(p);}
 const art=reference.assets.limen.variants.find(v=>v.width>=1536)??reference.assets.limen.variants.at(-1)!;
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/play/asset-review'>← Asset review library</Link><h1>LIMEN<span>Meshy character / factory lighting review</span></h1></div><Link href='/stepanoskin/loopforge/design#agents'>Character direction ↗</Link></header>
  <div className={styles.workspace}>
   <section className={`${styles.stage} ${styles.modelStage}`} aria-label='LIMEN model review'>
    <canvas ref={canvas} aria-label='LIMEN textured 3D model in the factory'/>
    <div className={styles.cameraTag}><i className={running?styles.rec:''}/>{room==='security'?'SECURITY':'LATTICE FORGE'}<span>{camera==='model'?'MODEL REVIEW':`CCTV SCALE · CAM ${angle+1}`}</span></div>
    {!ready&&<div className={styles.loading} role='status'><strong>{error?'Model unavailable':'Preparing LIMEN…'}</strong><p>{error||'Loading one rigged character into the factory.'}</p>{error&&<button onClick={()=>{setReduced(false);setClip('Idle');setPhase(0);setTurn(0);setZoom(3.8);setRoom('security');setSpeed(1);setSurface('textured');setInspectionLight(true);setBlade(true);setCamera('model');setAngle(0);setRunning(false);setRetry(n=>n+1);}}>Retry loading</button>}</div>}
    <div className={styles.caption}><span>42,354 BODY + 4,994 HOUSING / 23 JOINTS</span><strong>{clip==='Rest'?'Security has a face.':`${clip==='Idle'?idleBeat:clip} · ${running?'playing':'paused'}`}</strong><small>{clip==='Rest'?'Original Meshy rest pose':`${Math.round(phase*100)}% · ${speed}× · ${clip==='Idle'?'authored emitter check':'in-place clip review'}`}</small></div>
   </section>
   <aside className={styles.controls} aria-label='LIMEN review controls'>
    <span className={styles.kicker}>Body v2 / separate forearm blade</span><h2>Recognize LIMEN.</h2><p>Review the body, forearm emitter and flowing cyan energy together. The new idle powers down the blade while LIMEN adjusts its controls. Start playback, or inspect individual beats below.</p>
    <label>View<select disabled={!ready} value={camera} onChange={e=>{const mode=e.target.value as typeof camera;setCamera(mode);runtime.current?.floor.review(mode==='model'?'model':'model-cctv',zoom);runtime.current?.floor.cctv(true,angle,false);}}><option value='model'>Close model inspection</option><option value='cctv'>CCTV scale review</option></select></label>
    {camera==='cctv'&&<div className={styles.duo}>{[0,1,2].map(n=><button key={n} aria-pressed={angle===n} onClick={()=>{setAngle(n);runtime.current?.floor.cctv(true,n,false);}}>CAM {n+1}</button>)}</div>}
    <label className={styles.check}><input type='checkbox' disabled={!ready} checked={blade} onChange={e=>{setBlade(e.target.checked);runtime.current?.model.blade(e.target.checked);}}/> Forearm blade</label>
    <button disabled={!ready||!blade} onClick={()=>{runtime.current?.model.pulse();play(true);}}>Preview energy surge</button>
    <label>Animation<select disabled={!ready} value={clip} onChange={e=>chooseClip(e.target.value as LimenClip)}><option value='Idle'>Idle · emitter check</option><option value='Rest'>Rig rest pose</option><option value='Walking'>Walking</option><option value='Running'>Running</option></select></label>
    <div className={styles.duo}><button className={styles.primary} disabled={!ready} onClick={()=>play(!running)}>{running?'Pause animation':'Play animation'}</button><button disabled={!ready} onClick={()=>{play(false);setPhase(0);runtime.current?.model.seek(0);}}>First frame</button></div>
    <label>Animation frame<input type='range' min='0' max='1000' step='1' value={Math.round(phase*1000)} disabled={!ready||clip==='Rest'} onChange={e=>{play(false);const p=Number(e.target.value)/1000;setPhase(p);runtime.current?.model.seek(p);}}/></label>
    {clip==='Idle'&&<div className={styles.beats} aria-label='Idle review beats'>{limenIdleBeats.map(beat=><button key={beat.label} disabled={!ready} onClick={()=>seek(beat.time)}>{beat.label}</button>)}</div>}
    <label className={styles.check}><input type='checkbox' checked={reduced} disabled={!ready} onChange={e=>{setReduced(e.target.checked);runtime.current?.model.reduced(e.target.checked);}}/> Preview reduced effects</label>
    <label>Playback speed<select disabled={!ready} value={speed} onChange={e=>{const n=Number(e.target.value);setSpeed(n);runtime.current?.model.speed(n);}}><option value='.25'>¼ speed</option><option value='.5'>½ speed</option><option value='1'>Normal</option></select></label>
    <div className={styles.duo}>{[['Front',0],['Side',90],['Back',180]] .map(([label,n])=><button key={label} disabled={!ready} aria-pressed={turn===n} onClick={()=>rotate(Number(n))}>{label}</button>)}</div>
    <label>Turn character<input type='range' min='0' max='360' step='1' value={turn} disabled={!ready} onChange={e=>rotate(Number(e.target.value))}/></label>
    <label>Camera distance<input type='range' min='3.2' max='7' step='.1' value={zoom} disabled={!ready||camera==='cctv'} onChange={e=>{const n=Number(e.target.value);setZoom(n);if(camera==='model')runtime.current?.floor.review('model',n);}}/></label>
    <label>Factory room<select disabled={!ready} value={room} onChange={e=>changeRoom(e.target.value as typeof room)}><option value='security'>Security</option><option value='conveyor'>Lattice Forge</option></select></label>
    <label className={styles.check}><input type='checkbox' disabled={!ready} checked={inspectionLight} onChange={e=>{setInspectionLight(e.target.checked);runtime.current?.model.light(e.target.checked);}}/> Inspection lamp</label>
    <label>Surface inspection<select disabled={!ready} value={surface} onChange={e=>{const s=e.target.value as LimenSurface;setSurface(s);runtime.current?.model.surface(s);}}><option value='textured'>Textured metal</option><option value='clay'>Untextured shape</option><option value='wireframe'>Wireframe</option></select></label>
    <button onClick={()=>{play(false);setShowReference(true);dialog.current?.showModal();}}>Compare original character art</button>
    <p className={styles.intent}>This is an assembly and energy review. The surge is a preview cue, not a game event. CCTV presets frame this stationary subject; they do not change the game cameras. Reduced effects freeze the braids and remove flicker, preserving the slow power-down and restart. System reduced-motion preferences are always respected. The idle is authored acting on the existing rig; its hand has no finger joints. Worker-contact poses and main-game integration remain to build.</p>
    <details><summary>Asset & performance</summary><dl><dt>Body + housing / source masters</dt><dd>{((asset.bytes+housing.bytes)/1048576).toFixed(2)} / 82.01 MiB</dd><dt>Material maps</dt><dd>Body: 2048² colour · Housing: three 1024² maps</dd><dt>Energy core + braids</dt><dd>672 triangles · one opaque draw · shared bloom</dd><dt>Frame p50 / p95 / p99</dt><dd>{report?.p50??'—'} / {report?.p95??'—'} / {report?.p99??'—'} ms</dd><dt>Draw calls / submitted triangles</dt><dd>{report?.drawCalls??'—'} / {report?.triangles?.toLocaleString()??'—'}</dd><dt>Canvas resolution</dt><dd>{report?.resolution??'—'}</dd></dl><p>Includes the room. Adaptive resolution; laboratory observations, not a device certification. Original remains private in S3; this optimized copy is temporarily served with the app.</p><button onClick={evidence}>Save review evidence</button></details>
   </aside>
  </div>
  <dialog ref={dialog} className={styles.reference} onClose={()=>setShowReference(false)}><button autoFocus onClick={()=>dialog.current?.close()}>Close reference</button><p>Original Loopforge LIMEN concept. Compare silhouette, armour, head and equipment.</p>{showReference&&<img src={art.src} width={art.width} height={art.height} alt='Original LIMEN character concept art'/>}</dialog>
 </main>;
}
