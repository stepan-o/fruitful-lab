'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import ReviewNavigation from './ReviewNavigation';
import WorkerNavigation from './WorkerNavigation';
import ReviewChecklist from './ReviewChecklist';
import ReviewCameraControls from './ReviewCameraControls';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import {openingWorkers,openingWorkerAsset,openingMotionLabels,openingLoopClips,type OpeningWorkerId,type WorkerDetail} from '@/lib/loopforge/agents/opening-workers';
import type {FactoryScene,SceneReport} from '../factory-study/scene';
import type {loadOpeningWorker} from './opening-worker-model';
import type {WorkerSurface} from './worker-model';
import styles from './agent-test.module.css';
import workerStyles from './worker-navigation.module.css';
type Puppet=Awaited<ReturnType<typeof loadOpeningWorker>>;
const emptyStudy=()=>({...initialStudy(),workers:[],running:false});
export default function OpeningWorkerReview({worker}:{worker:OpeningWorkerId}){
 const [detail,setDetail]=useState<WorkerDetail>('floor');
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/play/asset-review'>← Asset review library</Link><h1>{worker}<span>Opening cast / motion fitting</span></h1></div><Link href={`/stepanoskin/loopforge/design?model=${worker}#model-briefs`}>Generation brief ↗</Link></header>
  <ReviewNavigation current='worker-01-motions'/><WorkerNavigation current={worker}/><ReviewChecklist subject='opening-workers'/>
  <WorkerStage key={`${worker}-${detail}`} worker={worker} detail={detail} onDetail={setDetail}/>
 </main>;
}
function WorkerStage({worker,detail,onDetail}:{worker:OpeningWorkerId;detail:WorkerDetail;onDetail:(value:WorkerDetail)=>void}){
 const canvas=useRef<HTMLCanvasElement>(null),runtime=useRef<{floor:FactoryScene;model:Puppet}|null>(null);
 const [ready,setReady]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[running,setRunning]=useState(false),[id,setId]=useState('idle'),[phase,setPhase]=useState(0),[duration,setDuration]=useState(4),[speed,setSpeed]=useState(1),[loop,setLoop]=useState(true),[ground,setGround]=useState(true),[centred,setCentred]=useState(false),[turn,setTurn]=useState(0),[camera,setCamera]=useState<'model'|'cctv'>('model'),[close,setClose]=useState(false),[angle,setAngle]=useState(0),[room,setRoom]=useState<'security'|'conveyor'>('security'),[surface,setSurface]=useState<WorkerSurface>('textured'),[lamp,setLamp]=useState(true),[factoryFinish,setFactoryFinish]=useState(worker!=='bob'),[normalDetail,setNormalDetail]=useState(detail!=='console'),[report,setReport]=useState<SceneReport|null>(null);
 const file=openingWorkerAsset(worker,detail),description=openingWorkers.find(w=>w.id===worker)!.signature;
 useEffect(()=>{
  let alive=true,inView=true,floor:FactoryScene|null=null,puppet:Puppet|null=null;const abort=new AbortController();
  const visibility=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??false;runtime.current?.floor.active(inView);});if(canvas.current)visibility.observe(canvas.current);
  void(async()=>{try{
   const [{createFactoryScene},{loadOpeningWorker}]=await Promise.all([import('../factory-study/scene'),import('./opening-worker-model')]);if(!alive||!canvas.current)return;
   floor=createFactoryScene(canvas.current,r=>{if(alive)setReport(r);},()=>{},{reviewOnly:true});floor.inset(0,0);floor.isolate(true);floor.motion(false);floor.review('model',3.3);floor.reviewSubject(.85,3.3,1.5);floor.focus('security');floor.cctv(true,0,false);floor.update(emptyStudy());
   puppet=await loadOpeningWorker(floor.characterStage(),worker,detail,abort.signal,(p,ended)=>{if(alive){setPhase(p);if(ended){setRunning(false);floor?.update(emptyStudy());}}});
   if(!alive){puppet.dispose();return;}runtime.current={floor,model:puppet};floor.active(inView);setDuration(puppet.duration());setReady(true);
  }catch(e){if(alive){puppet?.dispose();floor?.dispose();puppet=null;floor=null;runtime.current=null;setError(e instanceof Error?e.message:'Unable to prepare worker.');}}})();
  const hidden=()=>{if(document.hidden){runtime.current?.model.play(false);runtime.current?.floor.update(emptyStudy());setRunning(false);}};
  document.addEventListener('visibilitychange',hidden);
  return()=>{alive=false;abort.abort();visibility.disconnect();document.removeEventListener('visibilitychange',hidden);runtime.current=null;puppet?.dispose();floor?.dispose();};
 },[worker,detail,retry]);
 function play(value:boolean){setRunning(value);runtime.current?.model.play(value);runtime.current?.floor.update({...emptyStudy(),running:value});}
 function choose(value:string){play(false);setId(value);setPhase(0);const repeat=openingLoopClips.has(value);setLoop(repeat);runtime.current?.model.loop(repeat);runtime.current?.model.clip(value);setDuration(runtime.current?.model.duration()??0);}
 function seek(seconds:number){play(false);const p=duration?Math.max(0,Math.min(1,seconds/duration)):0;setPhase(p);runtime.current?.model.seek(p);}
 function frame(value:boolean){setClose(value);runtime.current?.floor.reviewSubject(value?1.35:.85,value?1.8:3.3,value?.85:1.5);}
 function evidence(){const data={revision:'opening-worker-review/1',worker,file,id,phase,seconds:phase*duration,speed,loop,ground,centred,turn,camera,angle,room,surface,lamp,factoryFinish,normalDetail,report,cameraPose:runtime.current?.floor.reviewCamera(),status:'Candidate: contact fitting, paired scenes and device acceptance incomplete'};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`loopforge-${worker}-${detail}-review.json`;a.click();URL.revokeObjectURL(url);}
 return <div className={styles.workspace}>
  <section className={`${styles.stage} ${styles.modelStage}`} aria-label={`${worker} motion review`}>
   <ReviewCameraControls ready={ready} fixed={camera==='cctv'} onAction={a=>runtime.current?.floor.reviewCamera(a)}/>
   <div className={`${styles.cameraTag} ${workerStyles.stageMeta}`}><i className={running?styles.rec:''}/>{room==='security'?'SECURITY':'CONVEYOR'}<span>{camera==='model'?'MOTION FITTING':`CCTV · CAM ${angle+1}`}</span></div>
   <canvas tabIndex={0} ref={canvas} aria-label={`${worker} in the factory`}/>
   {!ready&&<div className={styles.loading} role='status'><strong>{error?'Could not prepare the worker':`Preparing ${worker}…`}</strong><p>{error||'Loading the selected body and its motion bank.'}</p>{error&&<button onClick={()=>{setError('');setRetry(n=>n+1);}}>Retry</button>}</div>}
   <div className={styles.caption}><span>{file.triangles.toLocaleString()} TRIANGLES / {file.joints} JOINTS / {detail.toUpperCase()}</span><strong>{worker} · {openingMotionLabels[id]??id}</strong><small>{(phase*duration).toFixed(2)} / {duration.toFixed(2)} s · {running?'playing':'paused'}</small></div>
  </section>
  <aside className={styles.controls} aria-label={`${worker} review controls`}>
   <span className={styles.kicker}>Opening cast / candidate motion bank</span><h2>{description}</h2><p>The approved character now has a rig and a full motion bank. These transferred motions still need fitting to this body; Worker 01’s earlier acceptance does not cover them.</p>
   <label>Model detail<select value={detail} onChange={e=>onDetail(e.target.value as WorkerDetail)}>{(['portrait','floor','console'] as const).map(level=><option key={level} value={level}>{level==='portrait'?'Portrait':level==='floor'?'Factory floor':'Console'} · {openingWorkerAsset(worker,level).triangles.toLocaleString()} triangles</option>)}</select></label>
   <label>Animation<select disabled={!ready} value={id} onChange={e=>choose(e.target.value)}>{file.clips.map(name=><option key={name} value={name}>{openingMotionLabels[name]??name}</option>)}</select></label>
   <div className={styles.duo}><button className={styles.primary} disabled={!ready||id==='Rig_Source'} onClick={()=>play(!running)}>{running?'Pause animation':'Play animation'}</button><button disabled={!ready} onClick={()=>seek(0)}>First frame</button></div>
   <label>Animation frame<input type='range' min='0' max='1000' value={Math.round(phase*1000)} disabled={!ready} onChange={e=>seek(Number(e.target.value)/1000*duration)}/></label>
   <label>Time in seconds<input className={styles.timeInput} type='number' min='0' max={duration} step='.01' disabled={!ready} value={Number((phase*duration).toFixed(2))} onChange={e=>{if(Number.isFinite(e.target.valueAsNumber))seek(e.target.valueAsNumber);}}/></label>
   <label>Playback speed<select disabled={!ready} value={speed} onChange={e=>{const v=Number(e.target.value);setSpeed(v);runtime.current?.model.speed(v);}}><option value='.25'>¼ speed</option><option value='.5'>½ speed</option><option value='1'>Normal</option></select></label>
   <label className={styles.check}><input type='checkbox' disabled={!ready} checked={loop} onChange={e=>{setLoop(e.target.checked);runtime.current?.model.loop(e.target.checked);}}/>Repeat clip</label>
   {camera==='model'&&<div className={styles.duo}><button disabled={!ready} aria-pressed={!close} onClick={()=>frame(false)}>Full body</button><button disabled={!ready} aria-pressed={close} onClick={()=>frame(true)}>Hands & head</button></div>}
   <div className={styles.duo}>{[['Front',0],['Side',90],['Back',180]].map(([label,n])=><button key={label} disabled={!ready} aria-pressed={turn===n} onClick={()=>{setTurn(Number(n));runtime.current?.model.turn(Number(n));}}>{label}</button>)}</div>
   <details><summary>Camera & appearance</summary>
    <label>View<select disabled={!ready} value={camera} onChange={e=>{const v=e.target.value as typeof camera;setCamera(v);runtime.current?.floor.review(v==='model'?'model':'model-cctv');runtime.current?.floor.cctv(true,angle,false);}}><option value='model'>Model inspection</option><option value='cctv'>CCTV scale</option></select></label>
    {camera==='cctv'&&<div className={styles.duo}>{[0,1,2].map(n=><button key={n} aria-pressed={angle===n} onClick={()=>{setAngle(n);runtime.current?.floor.cctv(true,n,false);}}>CAM {n+1}</button>)}</div>}
    <label>Factory room<select disabled={!ready} value={room} onChange={e=>{const v=e.target.value as typeof room;setRoom(v);runtime.current?.floor.focus(v);runtime.current?.model.room(v);}}><option value='security'>Security</option><option value='conveyor'>Conveyor</option></select></label>
    <label className={styles.check}><input type='checkbox' checked={ground} disabled={!ready} onChange={e=>{setGround(e.target.checked);runtime.current?.model.ground(e.target.checked);}}/>Fixed floor · 10 cm grid</label>
    <label className={styles.check}><input type='checkbox' checked={centred} disabled={!ready} onChange={e=>{setCentred(e.target.checked);runtime.current?.model.centre(e.target.checked);}}/>Follow travelling motion</label>
    <label className={styles.check}><input type='checkbox' checked={lamp} disabled={!ready} onChange={e=>{setLamp(e.target.checked);runtime.current?.model.light(e.target.checked);}}/>Inspection lamp</label>
    <label className={styles.check}><input type='checkbox' checked={factoryFinish} disabled={!ready||surface==='clay'} onChange={e=>{setFactoryFinish(e.target.checked);runtime.current?.model.finish(e.target.checked);}}/>Workshop enamel · blue panels</label>
    <label className={styles.check}><input type='checkbox' checked={normalDetail} disabled={!ready||surface==='clay'} onChange={e=>{setNormalDetail(e.target.checked);runtime.current?.model.normals(e.target.checked);}}/>Fine surface detail</label>
    <label>Surface<select disabled={!ready} value={surface} onChange={e=>{const v=e.target.value as WorkerSurface;setSurface(v);runtime.current?.model.surface(v);}}><option value='textured'>Textured metal</option><option value='clay'>Untextured shape</option><option value='wireframe'>Wireframe</option></select></label>
   </details>
   <details><summary>Asset & performance</summary><p>{file.clips.length} clips: nineteen transferred motions, neutral rig, and Meshy’s companion walk and run{worker==='bob'?', plus the checkpoint recovery candidate':''}. Fingers currently move with the palm. The fixed floor exposes drift and penetration; contacts and transitions remain under review.</p><dl><dt>Selected model / textures / motion bank</dt><dd>{(file.bytes/1048576).toFixed(2)} MiB</dd><dt>Frame p50 / p95 / p99</dt><dd>{report?.p50??'—'} / {report?.p95??'—'} / {report?.p99??'—'} ms</dd><dt>Draw calls / submitted triangles</dt><dd>{report?.drawCalls??'—'} / {report?.triangles?.toLocaleString()??'—'}</dd><dt>Canvas resolution</dt><dd>{report?.resolution??'—'}</dd></dl><p>These counters include the room and a single worker. They do not establish crowd performance.</p></details>
   <button disabled={!ready} onClick={evidence}>Save review evidence</button>
  </aside>
 </div>;
}
