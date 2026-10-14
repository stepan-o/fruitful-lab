'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import bank from '@/lib/loopforge/agents/stiletto-review.json';
import manifest from '@/lib/assets/generated/loopforge-stiletto-review.json';
import {parseManifest,imageAsset} from '@/lib/assets/types';
import AssetImage from '@/components/media/AssetImage';
import ReviewNavigation from './ReviewNavigation';
import ReviewChecklist from './ReviewChecklist';
import ReviewCameraControls from './ReviewCameraControls';
import type {FactoryScene,SceneReport} from '../factory-study/scene';
import type {loadStiletto,StilettoSurface} from './stiletto-model';
import styles from './agent-test.module.css';
import auditStyles from './stiletto-review.module.css';
type Puppet=Awaited<ReturnType<typeof loadStiletto>>;
type Version='original'|'corrected';
const file=manifest.assets.stiletto.variants[0],pack=parseManifest(manifest,'loopforge-stiletto-review');
const initial=bank.clips.find(c=>c.id==='Running')!;
const candidateClips=bank.clips.filter(c=>c.corrected);
export default function StilettoModelReview(){
 const canvas=useRef<HTMLCanvasElement>(null),runtime=useRef<{floor:FactoryScene;model:Puppet}|null>(null);
 const [ready,setReady]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[running,setRunning]=useState(false);
 const [id,setId]=useState('Running'),[version,setVersion]=useState<Version>('corrected'),[phase,setPhase]=useState(.2/initial.duration),[speed,setSpeed]=useState(1),[loop,setLoop]=useState(true);
 const [centred,setCentred]=useState(true),[turn,setTurn]=useState(0),[camera,setCamera]=useState<'model'|'cctv'>('model'),[angle,setAngle]=useState(0),[room,setRoom]=useState<'security'|'conveyor'>('security');
 const [surface,setSurface]=useState<StilettoSurface>('textured'),[lamp,setLamp]=useState(true),[blades,setBlades]=useState<'both'|'left'|'right'|'none'>('both'),[highlight,setHighlight]=useState(false),[report,setReport]=useState<SceneReport|null>(null),[showProof,setShowProof]=useState(false);
 const clip=bank.clips.find(c=>c.id===id),duration=clip?.duration??0,correction=clip?.corrected;
 const resolvedVersion=correction?version:'original';
 const counts=correction?(version==='corrected'?correction.result:correction.original):clip?.originalBlade;
 useEffect(()=>{
  let alive=true,inView=true,floor:FactoryScene|null=null,puppet:Puppet|null=null;const abort=new AbortController();
  const visibility=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??false;runtime.current?.floor.active(inView);});if(canvas.current)visibility.observe(canvas.current);
  void(async()=>{try{
   const {createFactoryScene}=await import('../factory-study/scene');if(!alive||!canvas.current)return;
   floor=createFactoryScene(canvas.current,r=>{if(alive)setReport(r);},()=>{},{reviewOnly:true});
   floor.inset(0,0);floor.isolate(true);floor.motion(false);floor.review('model',3.8);floor.focus('security');floor.cctv(true,0,false);floor.update({...initialStudy(),workers:[],running:false});
   const {loadStiletto}=await import('./stiletto-model');if(!alive)return;
   puppet=await loadStiletto(floor.characterStage(),abort.signal,(p,ended)=>{if(alive){setPhase(p);if(ended){setRunning(false);floor?.update({...initialStudy(),workers:[],running:false});}}});
   if(!alive){puppet.dispose();return;}
   const query=new URLSearchParams(window.location.search),requested=query.get('clip'),start=bank.clips.find(c=>c.id===requested)??initial;
   const neutral=requested==='Rest',v=query.get('version')==='original'?'original':'corrected',time=Number(query.get('t')??(start.id==='Running'?.2:0));
   const p=neutral?0:Math.min(1,Math.max(0,(Number.isFinite(time)?time:0)/start.duration));
   const active=neutral?'Rest':start.id;puppet.clip(active+(start.corrected&&v==='corrected'&&!neutral?'__corrected':''));puppet.seek(p);puppet.loop(!neutral&&start.loop);
   setId(active);setVersion(v);setPhase(p);setLoop(!neutral&&start.loop);runtime.current={floor,model:puppet};floor.active(inView);setReady(true);
  }catch(e){if(alive){puppet?.dispose();floor?.dispose();puppet=null;floor=null;runtime.current=null;setError(e instanceof Error?e.message:'Unable to load STILETTO.');}}})();
  const hidden=()=>{if(document.hidden){runtime.current?.model.play(false);runtime.current?.floor.update({...initialStudy(),workers:[],running:false});setRunning(false);}};
  document.addEventListener('visibilitychange',hidden);
  return()=>{alive=false;abort.abort();visibility.disconnect();document.removeEventListener('visibilitychange',hidden);runtime.current=null;puppet?.dispose();floor?.dispose();};
 },[retry]);
 function play(value:boolean){setRunning(value);runtime.current?.model.play(value);runtime.current?.floor.update({...initialStudy(),workers:[],running:value});}
 function choose(value:string,time=0){play(false);const next=bank.clips.find(c=>c.id===value);const p=next?Math.min(1,Math.max(0,time/next.duration)):0;setId(value);setVersion('corrected');setPhase(p);setLoop(next?.loop??false);runtime.current?.model.loop(next?.loop??false);runtime.current?.model.clip(value+(next?.corrected?'__corrected':''));runtime.current?.model.seek(p);}
 function compare(value:Version){play(false);setVersion(value);runtime.current?.model.clip(id+(correction&&value==='corrected'?'__corrected':''),true);}
 function seek(seconds:number){play(false);const p=duration?Math.min(1,Math.max(0,seconds/duration)):0;setPhase(p);runtime.current?.model.seek(p);}
 function evidence(){const data={revision:bank.revision,file,clip,version:resolvedVersion,seconds:phase*duration,phase,speed,loop,centred,turn,camera,angle,room,surface,lamp,blades,highlight,report,cameraPose:runtime.current?.floor.reviewCamera(),viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},auditMethod:bank.auditMethod};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='loopforge-stiletto-review.json';a.click();URL.revokeObjectURL(url);}
 function reset(){setReady(false);setError('');setRunning(false);setSpeed(1);setCentred(true);setTurn(0);setCamera('model');setAngle(0);setRoom('security');setSurface('textured');setLamp(true);setBlades('both');setHighlight(false);setRetry(n=>n+1);}
 const poseLink=`?clip=${encodeURIComponent(id)}&version=${resolvedVersion}&t=${(phase*duration).toFixed(3)}`;
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/play/asset-review'>← Asset review library</Link><h1>STILETTO<span>Twin blades / motion & clearance review</span></h1></div><Link href='/stepanoskin/loopforge/design#agents'>Game design · Agents ↗</Link></header>
  <ReviewNavigation current='stiletto-blades'/><ReviewChecklist subject='stiletto-blades'/>
  <div className={styles.workspace}>
   <section className={`${styles.stage} ${styles.modelStage}`} aria-label='STILETTO motion review'>
    <ReviewCameraControls ready={ready} fixed={camera==='cctv'} onAction={a=>runtime.current?.floor.reviewCamera(a)}/>
    <canvas tabIndex={0} ref={canvas} aria-label='Rigged STILETTO with forearm blades in the factory'/>
    <div className={styles.cameraTag}><i className={running?styles.rec:''}/>{room==='security'?'SECURITY':'LATTICE FORGE'}<span>{camera==='model'?'MOTION REVIEW':`CCTV · CAM ${angle+1}`}</span></div>
    {!ready&&<div className={styles.loading} role='status'><strong>{error?'STILETTO unavailable':'Preparing STILETTO…'}</strong><p>{error||'Loading one body, two blades and the motion bank.'}</p>{error&&<button onClick={reset}>Retry loading</button>}</div>}
    <div className={styles.caption}><span>{clip?(resolvedVersion==='corrected'?'CORRECTED ARMS · REVIEW CANDIDATE':'ORIGINAL MOTION'):'NEUTRAL RIG'}</span><strong>{clip?.label??'A-pose'} · {running?'playing':'paused'}</strong><small>{(phase*duration).toFixed(2)} / {duration.toFixed(2)} s · {speed}× · {blades==='both'?'two 55 cm blades':`${blades} blade visibility`}</small></div>
   </section>
   <aside className={styles.controls} aria-label='STILETTO review controls'>
    <span className={styles.kicker}>18 source motions / 5 corrected alternatives</span><h2>Keep the blades clear.</h2>
    <label>Animation<select disabled={!ready} value={id} onChange={e=>choose(e.target.value)}><option value='Rest'>Neutral rig · A-pose</option>{bank.clips.map(c=><option key={c.id} value={c.id}>{c.label}{c.corrected?' · comparison':''}</option>)}</select></label>
    <div className={styles.duo} aria-label='Motion version'><button disabled={!ready||!clip} aria-pressed={resolvedVersion==='original'} onClick={()=>compare('original')}>Original motion</button><button disabled={!ready||!correction} aria-pressed={resolvedVersion==='corrected'} onClick={()=>compare('corrected')}>Corrected arms</button></div>
    <p>{correction?'Switch at the same timestamp and angle. Body, leg curves, blade dimensions and mounts stay unchanged.':'This clip has no corrected alternative. Original motion is shown.'}</p>
    {counts&&<div className={auditStyles.result} aria-label='Sampled clearance result'><strong>{counts.bodyContactFrames} body · {counts.floorContactFrames} floor · {counts.bladeContactFrames} blade</strong><span>Contact poses / {counts.frames} sampled at {correction?'120':'30'} Hz</span><small>Checks assume both blades attached. Body-to-body issues are separate.</small></div>}
    <div className={styles.duo}><button className={styles.primary} disabled={!ready||!clip} onClick={()=>play(!running)}>{running?'Pause animation':'Play animation'}</button><button disabled={!ready} onClick={()=>seek(0)}>First frame</button></div>
    <label>Animation frame<input type='range' min='0' max='1000' step='1' disabled={!ready||!clip} value={Math.round(phase*1000)} onChange={e=>seek(Number(e.target.value)/1000*duration)}/></label>
    <label>Time in seconds<input className={styles.timeInput} type='number' min='0' max={duration} step='.01' disabled={!ready||!clip} value={Number((phase*duration).toFixed(2))} onChange={e=>{const n=e.target.valueAsNumber;if(Number.isFinite(n))seek(n);}}/></label>
    <label>Playback speed<select disabled={!ready} value={speed} onChange={e=>{const n=Number(e.target.value);setSpeed(n);runtime.current?.model.speed(n);}}><option value='.25'>¼ speed</option><option value='.5'>½ speed</option><option value='1'>Normal</option></select></label>
    <label className={styles.check}><input type='checkbox' disabled={!ready||!clip} checked={loop} onChange={e=>{setLoop(e.target.checked);runtime.current?.model.loop(e.target.checked);}}/> Repeat clip</label>
    {correction&&<button disabled={!ready} onClick={()=>seek(correction.reviewTime)}>Jump to comparison pose · {correction.reviewTime.toFixed(2)} s</button>}
    <p className={styles.intent}>{resolvedVersion==='corrected'?correction?.description:clip?'Original exported motion with the current blade mounts. Blade clearance is reported above; source body-only checks are below.':'Neutral rig with rigid forearm attachments.'}</p>
    <details><summary>Body contact flags · still open</summary><p>{clip?.note??'Choose a motion to see its audit.'}</p><p>These markers locate the original body-only audit’s closest poses. Arm corrections do not fix gait, foot planting or plate weights.</p><div className={styles.beats}>{clip?.markers.map(m=><button key={m.label} disabled={!ready} onClick={()=>seek(m.time)}>{m.label.replace('leftLeg / rightLeg','Legs').replace('leftArm / rightArm','Arms').replace('hands / head','Socket / head')} · {m.time.toFixed(2)} s{m.intersections?' · contact':''}</button>)}</div></details>
    <details><summary>Blades, camera & surface</summary>
     <label>Attachments<select disabled={!ready} value={blades} onChange={e=>{const v=e.target.value as typeof blades;setBlades(v);runtime.current?.model.blades(v);}}><option value='both'>Both blades</option><option value='left'>Left blade</option><option value='right'>Right blade</option><option value='none'>Body only</option></select></label>
     <label className={styles.check}><input type='checkbox' disabled={!ready} checked={highlight} onChange={e=>{setHighlight(e.target.checked);runtime.current?.model.highlight(e.target.checked);}}/> Highlight blades for inspection</label>
     <label>Surface inspection<select disabled={!ready} value={surface} onChange={e=>{const v=e.target.value as StilettoSurface;setSurface(v);runtime.current?.model.surface(v);}}><option value='textured'>Textured metal</option><option value='clay'>Untextured shape</option><option value='wireframe'>Wireframe</option></select></label>
     <label>View<select disabled={!ready} value={camera} onChange={e=>{const v=e.target.value as typeof camera;setCamera(v);runtime.current?.floor.review(v==='model'?'model':'model-cctv');runtime.current?.floor.cctv(true,angle,false);}}><option value='model'>Close model inspection</option><option value='cctv'>CCTV scale review</option></select></label>
     {camera==='cctv'&&<div className={styles.duo}>{[0,1,2].map(n=><button disabled={!ready} key={n} aria-pressed={angle===n} onClick={()=>{setAngle(n);runtime.current?.floor.cctv(true,n,false);}}>CAM {n+1}</button>)}</div>}
     <div className={styles.duo}>{[['Front',0],['Side',90],['Back',180]].map(([label,n])=><button key={label} disabled={!ready} aria-pressed={turn===n} onClick={()=>{setTurn(Number(n));runtime.current?.model.turn(Number(n));}}>{label}</button>)}</div>
     <label>Turn character<input type='range' min='0' max='360' value={turn} disabled={!ready} onChange={e=>{setTurn(Number(e.target.value));runtime.current?.model.turn(Number(e.target.value));}}/></label>
     <label>Factory room<select disabled={!ready} value={room} onChange={e=>{const v=e.target.value as typeof room;setRoom(v);runtime.current?.floor.focus(v);runtime.current?.model.room(v);}}><option value='security'>Security</option><option value='conveyor'>Lattice Forge</option></select></label>
     <label className={styles.check}><input type='checkbox' disabled={!ready} checked={centred} onChange={e=>{setCentred(e.target.checked);runtime.current?.model.centre(e.target.checked);}}/> Keep subject centred</label><p>Horizontal centering is a review transform. Turn it off to inspect source travel. Vertical fall motion stays intact.</p>
     <label className={styles.check}><input type='checkbox' disabled={!ready} checked={lamp} onChange={e=>{setLamp(e.target.checked);runtime.current?.model.light(e.target.checked);}}/> Inspection lamp</label>
    </details>
    <details><summary>Asset & performance</summary><dl><dt>One body / two blades / 23 animation clips</dt><dd>{(file.bytes/1048576).toFixed(2)} MiB · loaded once</dd><dt>Rendered character triangles / skin joints</dt><dd>49,358 / 24</dd><dt>Frame p50 / p95 / p99</dt><dd>{report?.p50??'—'} / {report?.p95??'—'} / {report?.p99??'—'} ms</dd><dt>Room + character draws / triangles</dt><dd>{report?.drawCalls??'—'} / {report?.triangles?.toLocaleString()??'—'}</dd><dt>Canvas resolution</dt><dd>{report?.resolution??'—'}</dd></dl><p>Measurements include the room. Crowd and physical-device performance remain unmeasured. No runtime collision solver or retargeter.</p></details>
    <button disabled={!ready} onClick={evidence}>Save review evidence</button><a className={auditStyles.poseLink} href={poseLink}>Link to this pose ↗</a><a className={auditStyles.poseLink} href='#clearance'>Five corrections & recorded checks ↓</a>
   </aside>
  </div>
  <section id='clearance' className={auditStyles.audit} aria-labelledby='clearance-heading'>
   <span className={styles.kicker}>Published review record · 13 October 2026</span><h2 id='clearance-heading'>Five corrections. One unchanged body.</h2>
   <p>Across 2,335 corrected poses sampled at 120 Hz, no blade/body, blade/floor or blade/blade crossing was detected. These are animation candidates for review, not gameplay approval.</p>
   <div className={auditStyles.candidates}>{candidateClips.map(c=><button key={c.id} disabled={!ready} aria-pressed={id===c.id} onClick={()=>{choose(c.id,c.corrected!.reviewTime);canvas.current?.scrollIntoView({block:'center'});}}><strong>{c.label}</strong><span>Body contacts: {c.corrected!.original.bodyContactFrames} → 0</span><span>Floor contacts: {c.corrected!.original.floorContactFrames} → 0</span><small>{c.corrected!.result.frames} poses · inspect →</small></button>)}</div>
   <details open={showProof} onToggle={e=>setShowProof(e.currentTarget.open)}><summary>Recorded before / after evidence{correction?` · ${clip?.label}`:''}</summary>
    {showProof&&(correction?<div className={auditStyles.proof}>{(['original','corrected'] as const).map(v=><figure key={v}><AssetImage asset={imageAsset(pack,`${correction.imageKey}-${v}`)} alt={`${clip?.label}, ${v} arms at the recorded comparison pose, blades highlighted`} sizes='(max-width: 700px) 90vw, 45vw'/><figcaption>{v==='original'?'Original motion':'Corrected arms'} · {correction.reviewTime.toFixed(2)} s</figcaption></figure>)}</div>:<p>Select one of the five corrected candidates to compare its recorded evidence.</p>)}
   </details>
   <p>{bank.auditMethod} The proximal collar overlap is deliberately excluded. This test does not certify containment, coplanar contact, animation blends or clearance from machinery.</p>
   <p>Remaining work: leg-to-leg contacts in several source gaits, foot and prop contacts, transitions, rigid plate weights, welder mounting and visor emission. Owner visual acceptance is recorded; paired encounters still need target and reaction timing.</p>
   <div className={auditStyles.links}><a href='/loopforge-design/production/STILETTO_MOTION_REVIEW.md'>Full review record ↗</a><a href={manifest.assets['clearance-audit'].variants[0].src}>120 Hz audit data ↗</a><a href={manifest.assets['packed-preservation'].variants[0].src}>Source preservation checks ↗</a></div>
  </section>
 </main>;
}
