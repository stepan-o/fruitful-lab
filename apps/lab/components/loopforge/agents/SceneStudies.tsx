'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import {advance} from '@/lib/loopforge/encounters/kernel';
import {TICK_MS,type World,type View} from '@/lib/loopforge/encounters/contract';
import {rehearsal,replay,rehearsalView,studies,type Study,type Choice} from '@/lib/loopforge/encounters/rehearsals';
import type {SceneReport} from '../factory-study/scene';
import type {loadRehearsalCast} from './rehearsal-cast';
import ReviewNavigation from './ReviewNavigation';
import ReviewCameraControls from './ReviewCameraControls';
import SpeechBubble from './SpeechBubble';
import styles from './scene-studies.module.css';
import {storyboard} from './storyboard';
import type {RehearsalStage} from './arrival-stage';
type Take=ReturnType<typeof rehearsal>;
type Cast=Awaited<ReturnType<typeof loadRehearsalCast>>;
type Runtime={floor:RehearsalStage;cast:Cast;take:Take;world:World;playing:boolean};
function download(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export default function SceneStudies(){
 const followCamera=useRef(true),lastShot=useRef('');
 const [following,setFollowing]=useState(true),[expressive,setExpressive]=useState(true);
 const canvas=useRef<HTMLCanvasElement>(null),runtime=useRef<Runtime|null>(null),bubbles=useRef(new Map<string,HTMLDivElement>());
 const [study,setStudy]=useState<Study>('arrival'),[choice,setChoice]=useState<Choice>('care'),[retry,setRetry]=useState(0),[ready,setReady]=useState(false),[error,setError]=useState(''),[running,setRunning]=useState(false),[tick,setTick]=useState(0),[view,setView]=useState<View|null>(null),[report,setReport]=useState<SceneReport|null>(null),[world,setWorld]=useState<World|null>(null),[saving,setSaving]=useState(false),[saveStatus,setSaveStatus]=useState('');
 const [captureFile,setCaptureFile]=useState<{url:string;name:string}|null>(null);
 useEffect(()=>()=>{if(captureFile)URL.revokeObjectURL(captureFile.url);},[captureFile]);
 const take=rehearsal(study,choice),info=studies.find(s=>s.id===study)!;
 function frameShot(r:Runtime,v:View){if(followCamera.current&&v.framing&&lastShot.current!==v.framing){r.floor.sceneShot?.(v.framing==='wide'?'lobby':'doorway');lastShot.current=v.framing;}}
 function sync(r:Runtime){const v=rehearsalView(r.take,r.world);r.cast.update(v);frameShot(r,v);setView(v);setTick(v.tick);setWorld(r.world);}
 useEffect(()=>{
  let alive=true,floor:RehearsalStage|null=null,cast:Cast|null=null,frame=0,inView=true;const abort=new AbortController();let last=0,acc=0,lastPublish=0;
  const observer=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??false;floor?.active(inView);if(!inView)pause();});
  function pause(){const r=runtime.current;if(r){r.playing=false;r.floor.motion(false);}if(alive)setRunning(false);acc=0;last=0;}
  function visibility(){if(document.hidden)pause();}
  async function boot(){try{
   if(!alive||!canvas.current)return;
   if(study==='arrival'){
    const {createArrivalStage}=await import('./arrival-stage');
    if(!alive)return;floor=createArrivalStage(canvas.current,r=>{if(alive)setReport(r);});
    const {loadArrivalCast}=await import('./arrival-cast');if(!alive)return;cast=await loadArrivalCast(floor,abort.signal);
   }else{
    const {createFactoryScene}=await import('../factory-study/scene');if(!alive)return;
    const factory=createFactoryScene(canvas.current,r=>{if(alive)setReport(r);},()=>{},{reviewOnly:true,context:'room'});floor=factory;
    factory.inset(0,0);factory.isolate(true);factory.motion(false);factory.review('model',6.5);factory.focus(study==='conveyor'?'conveyor':'security');factory.reviewTarget(rehearsal(study,choice).anchor,study==='threshold'?-1.05:-Math.PI/2);if(study==='threshold')factory.isolate(false);factory.cctv(true,0,false);factory.reviewSubject(1.05,6.5,3.5);factory.update({...initialStudy(),workers:[],running:false});
    const {loadRehearsalCast}=await import('./rehearsal-cast');if(!alive)return;cast=await loadRehearsalCast(factory,study,abort.signal);
   }
   observer.observe(canvas.current);
   if(!alive){cast.dispose();return;}
   const take=rehearsal(study,choice),r:Runtime={floor,cast,take,world:replay(take,study==='arrival'?0:study==='threshold'?125:70),playing:false};runtime.current=r;sync(r);setReady(true);floor.active(inView);
   let lastSampleTick=-1;
   const render=(now:number)=>{
    if(!alive)return;frame=requestAnimationFrame(render);
    if(!inView||document.hidden){last=0;return;}
    const dt=last?Math.min(100,now-last):0;last=now;
    if(r.playing){acc+=dt;while(acc>=TICK_MS&&r.world.tick<r.take.total){r.world=advance(r.world,r.take.registry,r.take.space,r.take.planner);acc-=TICK_MS;}const next=rehearsalView(r.take,r.world);if(next.tick!==lastSampleTick){r.cast.update(next);frameShot(r,next);lastSampleTick=next.tick;}if(now-lastPublish>100||next.finished){lastPublish=now;setTick(next.tick);setView(next);setWorld(r.world);}if(next.finished)pause();}
    for(const a of r.cast.anchors()){const el=bubbles.current.get(a.id);if(el){el.style.left=`clamp(var(--bubble-margin), ${a.x}%, calc(100% - var(--bubble-margin)))`;el.style.top=`${Math.max(100*(el.offsetHeight+28)/(canvas.current?.clientHeight??500),Math.min(88,a.y))}%`;el.style.visibility=a.visible?'visible':'hidden';}}
   };frame=requestAnimationFrame(render);
  }catch(e){if(alive){setError(e instanceof Error?e.message:'Unable to prepare scene.');cast?.dispose();floor?.dispose();cast=null;floor=null;runtime.current=null;}}}
  void boot();document.addEventListener('visibilitychange',visibility);
  return()=>{alive=false;abort.abort();cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);runtime.current=null;cast?.dispose();floor?.dispose();};
 // Changing a room reloads only its cast. Choice changes replay the same loaded bodies.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[study,retry]);
 function manualShot(shot:'lobby'|'doorway'){followCamera.current=false;setFollowing(false);runtime.current?.floor.sceneShot?.(shot);}
 function play(){const r=runtime.current;if(!r)return;if(r.world.tick>=r.take.total)r.world=replay(r.take,0);r.playing=!r.playing;setRunning(r.playing);r.floor.motion(r.playing);sync(r);}
 function seek(n:number){const r=runtime.current;if(!r)return;r.playing=false;r.floor.motion(false);setRunning(false);r.world=replay(r.take,Math.max(0,Math.min(r.take.total,Math.round(n))));sync(r);}
 function beat(n:number){seek(n);}
 function choose(c:Choice){setChoice(c);const r=runtime.current;if(!r)return;r.take=rehearsal(study,c);seek(Math.min(r.world.tick,r.take.total));}
 function room(s:Study){if(s===study)return;setReady(false);setRunning(false);setView(null);setError('');setTick(0);setReport(null);setWorld(null);lastShot.current='';setChoice('care');setStudy(s);}
 function evidence(){const r=runtime.current;if(!r)return;download(new Blob([JSON.stringify({kind:'isolated engine rehearsal',version:r.world.version,study,choice,tick:r.world.tick,camera:r.floor.reviewCamera(),projection:rehearsalView(r.take,r.world),authorState:r.world,performance:report},null,2)],{type:'application/json'}),`loopforge-${study}-${choice}-${tick}.json`);}
 async function capture(){
  const r=runtime.current,c=canvas.current;if(!r||!c||saving)return;
  seek(r.world.tick);setSaving(true);setSaveStatus('');
  const scene=r.floor.characterStage().scene;
  try{await new Promise<void>((resolve,reject)=>{
   const timeout=setTimeout(()=>{scene.onAfterRenderObservable.remove(observer);reject(new Error('Keep the scene visible and try saving again.'));},5000);
   const observer=scene.onAfterRenderObservable.addOnce(()=>{
    clearTimeout(timeout);if(runtime.current!==r){resolve();return;}
    try{storyboard(c,rehearsalView(r.take,r.world),r.cast.anchors(),expressive).toBlob(blob=>{
     if(!blob){reject(new Error('The image could not be saved. Please try again.'));return;}
     setCaptureFile({url:URL.createObjectURL(blob),name:`loopforge-${study}-${choice}-${r.world.tick}.png`});resolve();
    });}catch(e){reject(e);}
   });r.floor.characterStage().refresh();
  });if(runtime.current===r)setSaveStatus('Storyboard ready.');}
  catch(e){if(runtime.current===r)setSaveStatus(e instanceof Error?e.message:'Could not save this frame.');}
  finally{setSaving(false);}
 }

 const activeSpeech=view?.bubbles??[];
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/design#agents'>← Game design · characters & motion</Link><p className={styles.kicker}>ACT I / SCENE REHEARSALS</p><h1>Put the cast in a situation.</h1><p>A shared factory. A blocked doorway. Something to remember tomorrow.</p></div><span className={styles.badge}>ISOLATED REHEARSAL</span></header>
  <ReviewNavigation current='scene-studies'/>
  <nav className={styles.tabs} aria-label='Scene studies'>{studies.map(s=><button key={s.id} aria-pressed={study===s.id} onClick={()=>room(s.id)}><small>{s.id==='arrival'?'01 / LOBBY → SECURITY':s.id==='security'?'03 / SECURITY':s.id==='conveyor'?'04 / LATTICE FORGE':'02 / SHARED DOORWAY'}</small>{s.title}</button>)}</nav>
  <div className={styles.layout}>
   <section className={styles.stage} aria-label={info.title}>
    <ReviewCameraControls ready={ready} fixed={false} onAction={a=>runtime.current?.floor.reviewCamera(a)}/>
    <div className={styles.viewport}><canvas ref={canvas} tabIndex={0} aria-label={`${info.title}, animated scene with anchored speech`}/>
     <div className={styles.sceneLabel}>{info.subtitle}</div>
     {view?.actors.filter(a=>study!=='arrival'||activeSpeech.some(b=>b.speaker===a.id)).map(a=><div className={styles.anchor} key={a.id} ref={el=>{if(el)bubbles.current.set(a.id,el);else bubbles.current.delete(a.id);}}>{!activeSpeech.some(b=>b.speaker===a.id)&&<span className={styles.name}>{a.name}</span>}{activeSpeech.filter(b=>b.speaker===a.id).map(b=><SpeechBubble key={b.id} speech={b} name={a.name} character={a.character} playing={running} expressive={expressive}/>)}</div>)}
     {!ready&&<div className={styles.loading} role='status'>{error||'Preparing the room and its performers…'}{error&&<button onClick={()=>{setError('');setRetry(v=>v+1);}}>Retry</button>}</div>}
     <div className={styles.caption}>{view?.phase}<small>{(tick/20).toFixed(1)} s · {running?'playing':'paused'}</small></div>
    </div>
    <div className={styles.transport}><button disabled={!ready} onClick={play}>{running?'Pause':'Play scene'}</button><button disabled={!ready} onClick={()=>seek(0)}>Restart</button><label>Scene time<input aria-label='Scene time' type='range' min='0' max={take.total} value={tick} disabled={!ready} onChange={e=>seek(Number(e.target.value))}/></label><label>Seconds<input aria-label='Jump to seconds' type='number' min='0' max={take.total/20} step='.05' value={tick/20} disabled={!ready} onChange={e=>seek(Number(e.target.value)*20)}/></label></div>
    {study==='arrival'&&<div className={styles.beats}><label className={styles.cameraFollow}><input type='checkbox' checked={following} onChange={e=>{followCamera.current=e.target.checked;setFollowing(e.target.checked);lastShot.current='';const r=runtime.current;if(r)sync(r);}}/>Follow scene cameras</label><button disabled={!ready} onClick={()=>manualShot('lobby')}>Lobby view</button><button disabled={!ready} onClick={()=>manualShot('doorway')}>Doorway view</button></div>}
    <div className={styles.beats}><label className={styles.cameraFollow}><input type='checkbox' checked={expressive} onChange={e=>setExpressive(e.target.checked)}/>Expressive speech</label><span className={styles.fine}>Pause to read{study==='arrival'?' · three held shots':''}</span></div>
    <div className={styles.beats}>{take.beats.map(b=><button disabled={!ready} key={b.label} onClick={()=>beat(b.tick)}>{b.label}</button>)}</div>
   </section>
   <aside className={styles.aside}>
    <p className={styles.kicker}>DIRECT THE TAKE</p><h2>{info.title}</h2><p>{study==='arrival'?'Ten nervous workers. One instruction. Worker 01 hears his number and steps forward too soon. LIMEN makes sure everyone remembers the difference between a number and permission.':'The shared doorway sets up the supervisor conflict. Compare the individual worker scenes under different producer priorities.'}</p>
    {study!=='arrival'&&<div className={styles.choices}>{(['care','pressure'] as const).map((c,i)=><button key={c} disabled={!ready} aria-pressed={choice===c} onClick={()=>choose(c)}>{info.choices[i]}</button>)}</div>}
    <p className={styles.note}>Speech reaches addressed listeners within hearing range. Their belief records remember who said it. A report can be mistaken; hearing it does not make it true.</p>
    <div className={styles.subtitle} aria-live={running?'off':'polite'}><small>CURRENT EXCHANGE</small>{activeSpeech.length?activeSpeech.map(b=><p key={b.id}><b>{view?.actors.find(a=>a.id===b.speaker)?.name}:</b> {b.text}</p>):<p>Let the posture speak.</p>}</div>
    <button disabled={!ready||saving} onClick={capture}>{saving?'Saving…':'Save storyboard image'}</button><button disabled={!ready} onClick={evidence}>Save scene evidence</button>
    {saveStatus&&<p role='status'>{saveStatus} {captureFile&&<a href={captureFile.url} download={captureFile.name}>Download PNG</a>}</p>}<p className={styles.fine}>PNG includes the rendered scene and its dialogue. The evidence file keeps state and camera for that exact frame.</p>
    {study==='arrival'&&<p className={styles.note}>A fixed opening performed with LIMEN’s new motion bank and cyan blade. The worker’s fall and limp use accepted clips; the adapted get-up is a new candidate. <a href='/loopforge-design/production/DAY_ONE_ARRIVAL.md'>Script & staging notes ↗</a></p>}
    <details><summary>What is real, what is staged?</summary><p>Real: fixed-tick action admission, actor/station reservations, interruption, effects, addressed speech, hearing and remembered provenance. The player view contains no private mind values.</p><p>Staged: intentions, dialogue and reserved clear lanes. The opening uses a compact Lobby–Security layout shared by navigation and construction; the full-floor Dispatch layout is unchanged. Credential lookup is supplied fixture data. Full BDI planning, general crowd navigation, machine contacts, day progression and economy integration are still to build. No live game or save is changed.</p><p>The opening uses eight source LIMEN motions with timed blends. Other studies retain the accepted emitter idle. Precise paper inspection is still missing. Machinery here is a scale mockup, not final art. Transitions and partner contacts remain a separate animation gate.</p></details>
    <details><summary>Author view · inner-world evidence</summary><p>This is author inspection. Players read the world and its speech, not these values.</p>{world&&Object.values(world.agents).map(a=><div key={a.id}><h3>{a.name}</h3><p>Stress {a.stress} · trust {a.trust}</p><ul>{a.memory.map((m,i)=><li key={i}>{m}</li>)}</ul></div>)}<p>{Object.keys(world?.held??{}).length} resources currently reserved.</p></details>
    {study==='arrival'&&<details><summary>Read the fixed intro · jump to a line</summary>{(()=>{let cursor=1;return Object.values(take.registry).flatMap(action=>action.phases.map(phase=>{const at=cursor;cursor+=phase.ticks;return phase.say?.map((speech,i)=><p key={`${at}-${i}`}><button disabled={!ready} onClick={()=>beat(at+1)}>{(at/20).toFixed(1)} s · {take.world.agents[speech.speaker].name}</button><br/>{speech.text}</p>);}));})()}</details>}
    <details><summary>Conversation transcript</summary>{world?.events.filter(e=>e.kind==='speech').map(e=><p key={e.id}><b>{(e.tick/20).toFixed(1)} s · {world.agents[e.agent!]?.name}</b><br/>{e.detail}</p>)}</details>
    <Link href='/stepanoskin/loopforge/play/performance-test'>Run the 26-actor performance test →</Link>
    <details><summary>Measured scene cost</summary><p>The opening uses ten independently posed workers sharing geometry and textures, plus LIMEN. The other takes use two actors. One camera and only the active cast. Active cast assets load on demand; no new model files are duplicated in this feature.</p><p>{report?.sampleMode==='active'?`${report.fps} FPS · ${report.sampleCount} recent intervals`:'Paused or preparing · no playback benchmark'}<br/>Frame p50 / p95 / p99: {report?.p50??'—'} / {report?.p95??'—'} / {report?.p99??'—'} ms<br/>Draw calls: {report?.drawCalls??'—'}<br/>Triangles: {report?.triangles?.toLocaleString()??'—'}<br/>Canvas: {report?.resolution??'—'}<br/>Renderer: {report?.renderer??'—'}</p><p>Active playback only; long stalls are included. Last 300 intervals, reset after pause, room change or backgrounding. Wait for at least 60 intervals. This is draw cadence, not a GPU timer. Crowds, older computers and physical phones are not yet certified.</p></details>
    <a href='/loopforge-design/production/SCENE_REHEARSALS.md'>Architecture & asset briefs ↗</a>
   </aside>
  </div>
 </main>;
}
