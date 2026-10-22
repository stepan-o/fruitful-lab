'use client';
import Link from 'next/link';
import {useEffect,useMemo,useRef,useState} from 'react';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import {attentionSteps,nextAttention,readingView,factoryClock,type AttentionStep} from '@/lib/loopforge/encounters/attention';
import {advance} from '@/lib/loopforge/encounters/kernel';
import {TICK_MS,type World,type View,type SceneFraming} from '@/lib/loopforge/encounters/contract';
import {rehearsal,replay,rehearsalView,studies,type Study,type Choice} from '@/lib/loopforge/encounters/rehearsals';
import type {SceneReport} from '../factory-study/scene';
import type {loadRehearsalCast} from './rehearsal-cast';
import ReviewNavigation from './ReviewNavigation';
import ReviewCameraControls from './ReviewCameraControls';
import SpeechBubble from './SpeechBubble';
import styles from './scene-studies.module.css';
import {storyboard} from './storyboard';
import type {RehearsalStage} from './arrival-stage';
import {compareStationLights,type LightComparison} from './station-light-comparison';
import type {StationLighting} from './station-light';
import {startOpeningPerformance,type OpeningProgress} from './opening-performance';
type Take=ReturnType<typeof rehearsal>;
type Cast=Awaited<ReturnType<typeof loadRehearsalCast>>;
type Runtime={floor:RehearsalStage;cast:Cast;take:Take;world:World;playing:boolean;view?:View;steps:AttentionStep[];limit?:AttentionStep;reading?:AttentionStep;readingBase?:View;readSeconds:number};
function download(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export default function SceneStudies(){
 const lightMonitor=useRef<ReturnType<typeof compareStationLights>|null>(null);
 const [lightRun,setLightRun]=useState<LightComparison|null>(null),[stationLighting,setStationLighting]=useState<StationLighting>('glow');
 const monitor=useRef<ReturnType<typeof startOpeningPerformance>|null>(null);
 const [authorOpen,setAuthorOpen]=useState(false),[scriptOpen,setScriptOpen]=useState(false),[transcriptOpen,setTranscriptOpen]=useState(false);
 const [performanceRun,setPerformanceRun]=useState<OpeningProgress|null>(null);
 const testing=(!!performanceRun&&performanceRun.state!=='finished')||(!!lightRun&&lightRun.state!=='finished');
 const followCamera=useRef(true),lastShot=useRef('');
 const [following,setFollowing]=useState(true),[expressive,setExpressive]=useState(true);
 const canvas=useRef<HTMLCanvasElement>(null),runtime=useRef<Runtime|null>(null),bubbles=useRef(new Map<string,HTMLDivElement>());
 const [study,setStudy]=useState<Study>('arrival'),[choice,setChoice]=useState<Choice>('care'),[retry,setRetry]=useState(0),[ready,setReady]=useState(false),[error,setError]=useState(''),[running,setRunning]=useState(false),[tick,setTick]=useState(0),[view,setView]=useState<View|null>(null),[report,setReport]=useState<SceneReport|null>(null),[world,setWorld]=useState<World|null>(null),[saving,setSaving]=useState(false),[saveStatus,setSaveStatus]=useState('');
 const [machineEffects,setMachineEffects]=useState(true);
 const [performanceFile,setPerformanceFile]=useState<{url:string;name:string}|null>(null);
 useEffect(()=>()=>{if(performanceFile)URL.revokeObjectURL(performanceFile.url);},[performanceFile]);
 const [reading,setReading]=useState<AttentionStep|null>(null);
 const [captureFile,setCaptureFile]=useState<{url:string;name:string}|null>(null);
 useEffect(()=>()=>{if(captureFile)URL.revokeObjectURL(captureFile.url);},[captureFile]);
 const take=useMemo(()=>rehearsal(study,choice),[study,choice]),info=studies.find(s=>s.id===study)!;
 function frameShot(r:Runtime,v:View){if(followCamera.current&&v.framing&&lastShot.current!==v.framing){r.floor.sceneShot?.(v.framing);lastShot.current=v.framing;}}
 function sync(r:Runtime){const base=rehearsalView(r.take,r.world),v=r.reading?readingView(base,r.reading,r.readSeconds):base;r.view=v;r.cast.update(v);r.floor.presentProcess?.(v.process);frameShot(r,v);setView(v);setTick(v.tick);setWorld(r.world);}
 useEffect(()=>{
  let alive=true,floor:RehearsalStage|null=null,cast:Cast|null=null,frame=0,inView=true;const abort=new AbortController();let last=0,acc=0,lastPublish=0;
  const observer=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??false;floor?.active(inView);if(!inView)pause();});
  function pause(){const r=runtime.current;if(r){r.playing=false;r.floor.motion(false);}if(alive)setRunning(false);acc=0;last=0;}
  function visibility(){if(document.hidden)pause();}
  async function boot(){try{
   if(!alive||!canvas.current)return;
   if(study==='arrival'){
    const {createArrivalStage}=await import('./arrival-stage');
    if(!alive)return;floor=createArrivalStage(canvas.current,r=>{if(alive)setReport(r);});await floor.ready;
    const {loadArrivalCast}=await import('./arrival-cast');if(!alive)return;cast=await loadArrivalCast(floor,abort.signal);
   }else{
    const {createFactoryScene}=await import('../factory-study/scene');if(!alive)return;
    const factory=createFactoryScene(canvas.current,r=>{if(alive)setReport(r);},()=>{},{reviewOnly:true,context:'room'});floor=factory;
    factory.inset(0,0);factory.isolate(true);factory.motion(false);factory.review('model',6.5);factory.focus(study==='conveyor'?'conveyor':'security');factory.reviewTarget(rehearsal(study,choice).anchor,study==='threshold'?-1.05:-Math.PI/2);if(study==='threshold')factory.isolate(false);factory.cctv(true,0,false);factory.reviewSubject(1.05,6.5,3.5);factory.update({...initialStudy(),workers:[],running:false});
    const {loadRehearsalCast}=await import('./rehearsal-cast');if(!alive)return;cast=await loadRehearsalCast(factory,study,abort.signal);
   }
   observer.observe(canvas.current);
   if(!alive){cast.dispose();return;}
   const take=rehearsal(study,choice),r:Runtime={floor,cast,take,world:replay(take,study==='arrival'?0:study==='threshold'?125:70),playing:false,steps:study==='arrival'?attentionSteps(take.registry):[],readSeconds:0};runtime.current=r;sync(r);setReady(true);floor.active(inView);
   let lastSampleTick=-1;
   const render=(now:number)=>{
    if(!alive)return;frame=requestAnimationFrame(render);
    if(!inView||document.hidden){last=0;return;}
    const dt=last?Math.min(100,now-last):0;last=now;
    if(r.playing){acc+=dt;while(acc>=TICK_MS&&r.world.tick<r.take.total&&(!r.limit||r.world.tick<r.limit.tick)){r.world=advance(r.world,r.take.registry,r.take.space,r.take.planner);acc-=TICK_MS;}
     if(r.limit&&r.world.tick>=r.limit.tick){r.reading=r.limit;r.readingBase=rehearsalView(r.take,r.world);r.limit=undefined;r.readSeconds=0;r.playing=false;acc=0;setRunning(false);setReading(r.reading);sync(r);r.floor.motion(true);}
     const next=r.reading?readingView(rehearsalView(r.take,r.world),r.reading,r.readSeconds):r.view?.tick===r.world.tick?r.view:rehearsalView(r.take,r.world);r.view=next;if(next.tick!==lastSampleTick){r.cast.update(next);r.floor.presentProcess?.(next.process);frameShot(r,next);lastSampleTick=next.tick;}if(now-lastPublish>100||next.finished){lastPublish=now;setTick(next.tick);setView(next);setWorld(r.world);}if(next.finished){if(monitor.current?.active){acc=0;lastSampleTick=-1;monitor.current.loop();}else pause();}}
    if(r.reading&&!r.playing){r.readSeconds+=dt/1000;if(now-lastPublish>33){const nowView=readingView(r.readingBase??rehearsalView(r.take,r.world),r.reading,r.readSeconds);r.view=nowView;r.cast.update(nowView);lastPublish=now;}r.floor.motion(true);}
    for(const a of r.cast.anchors()){const el=bubbles.current.get(a.id);if(el){el.style.left=`clamp(var(--bubble-margin), ${a.x}%, calc(100% - var(--bubble-margin)))`;el.style.top=`${Math.max(100*(el.offsetHeight+28)/(canvas.current?.clientHeight??500),Math.min(88,a.y))}%`;el.style.visibility=a.visible?'visible':'hidden';}}
   };frame=requestAnimationFrame(render);
  }catch(e){if(alive){setError(e instanceof Error?e.message:'Unable to prepare scene.');cast?.dispose();floor?.dispose();cast=null;floor=null;runtime.current=null;}}}
  void boot();document.addEventListener('visibilitychange',visibility);
  return()=>{lightMonitor.current?.dispose();lightMonitor.current=null;monitor.current?.dispose();monitor.current=null;alive=false;abort.abort();cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);runtime.current=null;cast?.dispose();floor?.dispose();};
 // Changing a room reloads only its cast. Choice changes replay the same loaded bodies.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[study,retry]);
 function testOpening(){
  const r=runtime.current,c=canvas.current;if(!r||!c||study!=='arrival')return;
  lightMonitor.current?.dispose();lightMonitor.current=null;setLightRun(null);monitor.current?.dispose();r.floor.machineEffects?.(true);setMachineEffects(true);followCamera.current=true;setFollowing(true);
  monitor.current=startOpeningPerformance(r.floor,c,()=>r.view??rehearsalView(r.take,r.world),()=>{r.world=replay(r.take,0);r.limit=undefined;r.reading=undefined;setReading(null);r.playing=true;r.floor.motion(true);lastShot.current='';setRunning(true);sync(r);},()=>{r.playing=false;r.floor.motion(false);setRunning(false);},setPerformanceRun);
 }
 function compareLights(){
  const r=runtime.current,c=canvas.current;if(!r||!c||testing)return;
  lightMonitor.current?.dispose();monitor.current?.dispose();monitor.current=null;setPerformanceRun(null);setPerformanceFile(null);
  r.floor.machineEffects?.(true);setMachineEffects(true);followCamera.current=true;setFollowing(true);
  lightMonitor.current=compareStationLights(r.floor,c,()=>r.view!,()=>{r.world=replay(r.take,1860);r.limit=undefined;r.reading=undefined;setReading(null);r.playing=true;r.floor.motion(true);lastShot.current='';setRunning(true);sync(r);},()=>{r.playing=false;r.floor.motion(false);setRunning(false);},stationLighting,setLightRun);
 }
 function saveLightComparison(){if(lightRun)setPerformanceFile({url:URL.createObjectURL(new Blob([JSON.stringify(lightRun,null,2)],{type:'application/json'})),name:'loopforge-station-light-comparison.json'});}
 function savePerformance(){if(performanceRun?.result)setPerformanceFile({url:URL.createObjectURL(new Blob([JSON.stringify(performanceRun.result,null,2)],{type:'application/json'})),name:'loopforge-opening-performance.json'});}
 function manualShot(shot:SceneFraming){followCamera.current=false;setFollowing(false);runtime.current?.floor.sceneShot?.(shot);}
 function continueDialogue(){const r=runtime.current;if(!r||r.playing||testing)return;if(r.world.tick>=r.take.total){seek(0);return;}r.reading=undefined;r.readSeconds=0;setReading(null);r.limit=nextAttention(r.steps,r.world.tick);r.playing=true;setRunning(true);r.floor.motion(true);sync(r);}
 function play(){const r=runtime.current;if(!r)return;if(r.world.tick>=r.take.total)r.world=replay(r.take,0);r.limit=undefined;r.reading=undefined;setReading(null);r.playing=!r.playing;setRunning(r.playing);r.floor.motion(r.playing);sync(r);}
 function seek(n:number){const r=runtime.current;if(!r)return;r.playing=false;r.limit=undefined;r.reading=undefined;setReading(null);r.floor.motion(false);setRunning(false);r.world=replay(r.take,Math.max(0,Math.min(r.take.total,Math.round(n))));sync(r);}
 function beat(n:number){seek(n);}
 function choose(c:Choice){setChoice(c);const r=runtime.current;if(!r)return;r.take=rehearsal(study,c);seek(Math.min(r.world.tick,r.take.total));}
 function room(s:Study){if(s===study||testing)return;setPerformanceRun(null);setReading(null);setMachineEffects(true);setStationLighting('glow');setLightRun(null);setReady(false);setRunning(false);setView(null);setError('');setTick(0);setReport(null);setWorld(null);lastShot.current='';setChoice('care');setStudy(s);}
 function evidence(){const r=runtime.current;if(!r)return;download(new Blob([JSON.stringify({kind:'isolated engine rehearsal',version:r.world.version,study,choice,tick:r.world.tick,camera:r.floor.reviewCamera(),stationLight:r.floor.stationLightSnapshot?.(),projection:rehearsalView(r.take,r.world),authorState:r.world,performance:report},null,2)],{type:'application/json'}),`loopforge-${study}-${choice}-${tick}.json`);}
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
 const attentionLabel=tick>=take.total?'Restart opening':tick===0?'Enter the factory':reading?.label??'Continue';
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/design#agents'>← Game design · characters & motion</Link><p className={styles.kicker}>ACT I / SCENE REHEARSALS</p><h1>Put the cast in a situation.</h1><p>A shared factory. A blocked doorway. Something to remember tomorrow.</p></div><span className={styles.badge}>ISOLATED REHEARSAL</span></header>
  <ReviewNavigation current='scene-studies'/>
  <nav className={styles.tabs} aria-label='Scene studies'>{studies.map(s=><button key={s.id} aria-pressed={study===s.id} disabled={testing} onClick={()=>room(s.id)}><small>{s.id==='arrival'?'01 / LOBBY → SECURITY':s.id==='security'?'03 / SECURITY':s.id==='conveyor'?'04 / LATTICE FORGE':'02 / SHARED DOORWAY'}</small>{s.title}</button>)}</nav>
  <div className={styles.layout}>
   <section className={`${styles.stage} ${testing?styles.testing:''}`} aria-label={info.title}>
    {study==='arrival'&&<div className={styles.performanceBar}><button disabled={!ready||testing} onClick={testOpening}>Test opening · 10 minutes</button>{performanceRun&&performanceRun.state!=='finished'&&<><button onClick={e=>monitor.current?.probe(e.timeStamp)}>Check response</button><button onClick={()=>monitor.current?.cancel()}>Cancel test</button></>}{performanceRun&&<span role='status'>{performanceRun.state==='finished'?performanceRun.result?.status:performanceRun.state==='warming'?'Warming up':'Measuring'} · {Math.floor(performanceRun.seconds)} s · {performanceRun.episodes} complete episodes</span>}{performanceRun?.result&&<button onClick={savePerformance}>Prepare test result</button>}{performanceFile&&<a href={performanceFile.url} download={performanceFile.name}>Download test JSON</a>}</div>}
    {study==='arrival'&&<div className={styles.performanceBar}><label>Station lighting <select aria-label='Station lighting' value={stationLighting} disabled={!ready||testing} onChange={e=>{const mode=e.target.value as StationLighting;setStationLighting(mode);runtime.current?.floor.stationLighting?.(mode);}}><option value='glow'>Glow only</option><option value='light'>Light spill</option><option value='shadows'>Light + shadows</option></select></label><button disabled={!ready||testing} onClick={compareLights}>Compare lighting · 3 minutes</button>{lightRun&&<span role='status'>{lightRun.label} · {lightRun.state} · {Math.floor(lightRun.seconds)} s</span>}{lightRun&&lightRun.state!=='finished'&&<button onClick={()=>lightMonitor.current?.cancel()}>Cancel comparison</button>}{lightRun?.state==='finished'&&<button onClick={saveLightComparison}>Prepare lighting result</button>}</div>}
    <ReviewCameraControls ready={ready&&!testing} fixed={false} onAction={a=>runtime.current?.floor.reviewCamera(a)}/>
    <div className={styles.viewport}><canvas ref={canvas} tabIndex={0} aria-label={`${info.title}, animated scene with anchored speech`}/>
     <div className={styles.sceneLabel}>{info.subtitle}</div>
     {study==='arrival'&&<div className={styles.clock} aria-label={'Factory time Day 1 '+factoryClock(tick)}><small>DAY 1 / FACTORY TIME</small><time>{factoryClock(tick)}</time><span>{running?'Action in progress':reading?'Reading · time held':'Ready'}</span></div>}
     {view?.actors.filter(a=>study!=='arrival'||activeSpeech.some(b=>b.speaker===a.id)).map(a=><div className={styles.anchor} key={a.id} ref={el=>{if(el)bubbles.current.set(a.id,el);else bubbles.current.delete(a.id);}}>{!activeSpeech.some(b=>b.speaker===a.id)&&<span className={styles.name}>{a.name}</span>}{activeSpeech.filter(b=>b.speaker===a.id).map(b=><SpeechBubble key={b.id} speech={b} name={a.name} character={a.character} playing={running||!!reading} expressive={expressive}/>)}</div>)}
     {!ready&&<div className={styles.loading} role='status'>{error||'Preparing the room and its performers…'}{error&&<button onClick={()=>{setError('');setRetry(v=>v+1);}}>Retry</button>}</div>}
     {!running&&!reading&&<div className={styles.caption}>{view?.phase}<small>{(tick/20).toFixed(1)} s · paused</small></div>}
    </div>
    {study==='arrival'&&<div className={styles.attentionBar}><button className={styles.continueButton} disabled={!ready||running||testing} onClick={continueDialogue}>{running?'…':attentionLabel} <span aria-hidden='true'>→</span></button><p>{running?'Watch the action.':reading?'Take your time. The cast stays alive; the factory clock waits.':'A few minutes, at your reading pace. Each click moves the factory forward.'}</p></div>}
    <details className={styles.rehearsalTools}><summary>Rehearsal controls · scrub / autoplay / camera</summary>
    <div className={styles.transport}><button disabled={!ready||testing} onClick={play}>{running?'Pause':'Play scene'}</button><button disabled={!ready||testing} onClick={()=>seek(0)}>Restart</button><label>Scene time<input aria-label='Scene time' type='range' min='0' max={take.total} value={tick} disabled={!ready||testing} onChange={e=>seek(Number(e.target.value))}/></label><label>Seconds<input aria-label='Jump to seconds' type='number' min='0' max={take.total/20} step='.05' value={tick/20} disabled={!ready||testing} onChange={e=>seek(Number(e.target.value)*20)}/></label></div>
    {study==='arrival'&&<div className={styles.beats}><label className={styles.cameraFollow}><input type='checkbox' checked={following} disabled={testing} onChange={e=>{followCamera.current=e.target.checked;setFollowing(e.target.checked);lastShot.current='';const r=runtime.current;if(r)sync(r);}}/>Follow scene cameras</label>{([['approach','Morning approach'],['assembly','The gathering'],['impact','Beside bob'],['card','The card'],['passage','STILETTO’s entrance'],['threshold','The threshold'],['aftermath','After the blow'],['conveyor-wide','The line'],['intake','Intake'],['wash','Brain Wash'],['belt','Main belt'],['forge','Lattice Forge']] as const).map(([shot,label])=><button key={shot} disabled={!ready||testing} onClick={()=>manualShot(shot)}>{label}</button>)}</div>}
    {study==='arrival'&&<label className={styles.cameraFollow}><input type='checkbox' checked={machineEffects} disabled={testing} onChange={e=>{setMachineEffects(e.target.checked);runtime.current?.floor.machineEffects?.(e.target.checked);}}/>Machine spray and heat accents</label>}
    <div className={styles.beats}><label className={styles.cameraFollow}><input type='checkbox' checked={expressive} disabled={testing} onChange={e=>setExpressive(e.target.checked)}/>Expressive speech</label><span className={styles.fine}>{study==='arrival'?'Dialogue waits for a click · cuts follow actions':'Pause to read'}</span></div>
    <div className={styles.beats}>{take.beats.map(b=><button disabled={!ready||testing} key={b.label} onClick={()=>beat(b.tick)}>{b.label}</button>)}</div>
    </details>
   </section>
   <aside className={styles.aside}>
    {performanceRun?.result&&<details open><summary>Opening performance · {performanceRun.result.status}</summary><p>{performanceRun.result.reason||'Ten minutes of the actual opening at a fixed 1280 × 720 resolution.'}</p><p>{performanceRun.result.frames.fps.toFixed(1)} FPS · p95 {performanceRun.result.frames.p95Ms.toFixed(1)} ms · p99 {performanceRun.result.frames.p99Ms.toFixed(1)} ms</p><ul>{Object.entries(performanceRun.result.checks).map(([name,pass])=><li key={name}>{pass?'Pass':'Fail'} · {name}</li>)}</ul></details>}
    {lightRun&&<details open><summary>Lighting comparison</summary><p>Same wash and press sequence, fixed resolution. The final glow repeat checks for drift. This is a cost comparison, not a performance pass.</p>{lightRun.reason&&<p>{lightRun.reason}</p>}<table><thead><tr><th>Lighting</th><th>FPS</th><th>p95 ms</th><th>Pauses</th></tr></thead><tbody>{lightRun.rows.map(row=><tr key={row.label}><td>{row.label}</td><td>{row.fps.toFixed(1)}</td><td>{row.p95Ms.toFixed(1)}</td><td>{row.stalls}</td></tr>)}</tbody></table></details>}
    <p className={styles.kicker}>DIRECT THE TAKE</p><h2>{info.title}</h2><p>{study==='arrival'?'bob mistakes a greeting for permission to enter. sam helps him; ed keeps his card. STILETTO drives straight through. Follow bob through four Conveyor stations, then return to the third ID check.':'The shared doorway sets up the supervisor conflict. Compare the individual worker scenes under different producer priorities.'}</p>
    {study!=='arrival'&&<div className={styles.choices}>{(['care','pressure'] as const).map((c,i)=><button key={c} disabled={!ready||testing} aria-pressed={choice===c} onClick={()=>choose(c)}>{info.choices[i]}</button>)}</div>}
    <p className={styles.note}>Speech reaches addressed listeners within hearing range. Their belief records remember who said it. A report can be mistaken; hearing it does not make it true.</p>
    <div className={styles.subtitle} aria-live={running?'off':'polite'}><small>CURRENT EXCHANGE</small>{activeSpeech.length?activeSpeech.map(b=><p key={b.id}><b>{view?.actors.find(a=>a.id===b.speaker)?.name}:</b> {b.text}</p>):<p>Let the posture speak.</p>}</div>
    <button disabled={!ready||saving||testing} onClick={capture}>{saving?'Saving…':'Save storyboard image'}</button><button disabled={!ready||testing} onClick={evidence}>Save scene evidence</button>
    {saveStatus&&<p role='status'>{saveStatus} {captureFile&&<a href={captureFile.url} download={captureFile.name}>Download PNG</a>}</p>}<p className={styles.fine}>PNG includes the rendered scene and its dialogue. The evidence file keeps state and camera for that exact frame.</p>
    {study==='arrival'&&<p className={styles.note}>The approved cast and storyboard, performed in the connected rooms. Motion transfers and contacts remain under review. <a href='/loopforge-design/narrative-episode.html'>Episode & storyboard ↗</a></p>}
    <details><summary>What is real, what is staged?</summary><p>Real: click-through attention checkpoints, a factory clock independent of reading time, ordered Conveyor station actions, fixed-tick action admission, actor/station reservations, interruption, effects, addressed speech, hearing and remembered provenance. The player view contains no private mind values.</p><p>Staged: intentions, dialogue and reserved clear lanes. The opening uses a compact Lobby–Security–Conveyor layout shared by navigation and construction; the full-floor Dispatch layout is unchanged. Credential lookup is supplied fixture data. Full BDI planning, general crowd navigation, precise machine contacts, six-room scheduling, day progression and economy integration are still to build. No live game or save is changed.</p><p>The opening uses the expanded LIMEN motion bank with timed blends and a fitted cyan strike. Other studies retain the accepted emitter idle. Precise paper inspection is still missing. Machinery here is a scale mockup, not final art. Transitions and partner contacts remain a separate animation gate.</p></details>
    <details onToggle={e=>setAuthorOpen(e.currentTarget.open)}><summary>Author view · inner-world evidence</summary><p>This is author inspection. Players read the world and its speech, not these values.</p>{authorOpen&&world&&Object.values(world.agents).map(a=><div key={a.id}><h3>{a.name}</h3><p>Stress {a.stress} · trust {a.trust}</p><ul>{a.memory.map((m,i)=><li key={i}>{m}</li>)}</ul></div>)}<p>{Object.keys(world?.held??{}).length} resources currently reserved.</p></details>
    {study==='arrival'&&<details onToggle={e=>setScriptOpen(e.currentTarget.open)}><summary>Read the episode · jump to a line</summary>{scriptOpen&&(()=>{let cursor=1;return Object.values(take.registry).flatMap(action=>action.phases.map(phase=>{const at=cursor;cursor+=phase.ticks;return phase.say?.map((speech,i)=><p key={`${at}-${i}`}><button disabled={!ready||testing} onClick={()=>beat(at+1)}>{(at/20).toFixed(1)} s · {take.world.agents[speech.speaker].name}</button><br/>{speech.text}</p>);}));})()}</details>}
    <details onToggle={e=>setTranscriptOpen(e.currentTarget.open)}><summary>Conversation transcript</summary>{transcriptOpen&&world?.events.filter(e=>e.kind==='speech').map(e=><p key={e.id}><b>{(e.tick/20).toFixed(1)} s · {world.agents[e.agent!]?.name}</b><br/>{e.detail}</p>)}</details>
    <p className={styles.fine}>The unattended render stress test bypasses reading stops. It does not measure the time a player takes to read. The opening test warms up for 30 seconds, then repeats this episode for ten minutes at fixed 1280 × 720 reference graphics, uncapped. Keep it visible and use Check response once. Backgrounding, scrolling it away or changing graphics invalidates the run. A pass measures this machine and this scene; it does not certify other devices or artistic quality.</p>
    <Link href='/stepanoskin/loopforge/play/performance-test'>Run the 26-actor performance test →</Link>
    <details><summary>Measured scene cost</summary><p>The opening uses ten distinct workers at factory-floor detail, plus LIMEN and STILETTO. One camera renders the connected rooms. The other takes use two actors. Character review and scenes share the same asset files.</p><p>{report?.sampleMode==='active'?`${report.fps} FPS · ${report.sampleCount} recent intervals`:'Paused or preparing · no playback benchmark'}<br/>Frame p50 / p95 / p99: {report?.p50??'—'} / {report?.p95??'—'} / {report?.p99??'—'} ms<br/>Draw calls: {report?.drawCalls??'—'}<br/>Triangles: {report?.triangles?.toLocaleString()??'—'}<br/>Canvas: {report?.resolution??'—'}<br/>Renderer: {report?.renderer??'—'}</p><p>Active playback only; long stalls are included. Last 300 intervals, reset after pause, room change or backgrounding. Wait for at least 60 intervals. This is draw cadence, not a GPU timer. Crowds, older computers and physical phones are not yet certified.</p></details>
    <a href='/loopforge-design/production/SCENE_REHEARSALS.md'>Architecture & asset briefs ↗</a>
   </aside>
  </div>
 </main>;
}
