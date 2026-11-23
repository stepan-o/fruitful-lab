'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import ReviewNavigation from './ReviewNavigation';
import ReviewChecklist from './ReviewChecklist';
import ReviewCameraControls from './ReviewCameraControls';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import type {FactoryScene,SceneReport} from '../factory-study/scene';
import type {loadInspectionModel,InspectionFile,InspectionSurface} from './inspection-model';
import styles from './agent-test.module.css';
import local from './asset-inspection.module.css';
import {cathexisFits,bodyEyePatch,type MaskCoverage} from '@/lib/loopforge/agents/cathexis-fit';
import MotionReviewControls from './MotionReviewControls';
import type {InspectionMotion,MotionVersion,loadMotionModel} from './motion-model';
type Subject=Awaited<ReturnType<typeof loadInspectionModel>> & {motion?:Awaited<ReturnType<typeof loadMotionModel>>['motion'];ground?:Awaited<ReturnType<typeof loadMotionModel>>['ground']};
export type InspectionAsset={id:string;label:string;triangles:number;sourceTriangles:number;bytes:number;sha256:string;sourceArchive:string;note:string;normalMap:boolean;derived:boolean;file:InspectionFile};
export type InspectionDefinition={id:string;name:string;revision:string;description:string;record:string;brief:string;assets:InspectionAsset[];observations:string[];comparison?:{ids:[string,string];label:string};portraitAsset?:string;fittedFaces?:boolean;motion?:InspectionMotion;motionAuditions?:InspectionMotion[]};
export default function AssetInspectionWorkbench({definition:d}:{definition:InspectionDefinition}){
 const canvas=useRef<HTMLCanvasElement>(null),floor=useRef<FactoryScene|null>(null),model=useRef<Subject|null>(null);
 const [floorReady,setFloorReady]=useState(false),[ready,setReady]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[sceneRetry,setSceneRetry]=useState(0);
 const [id,setId]=useState(d.assets[0].id),[turn,setTurn]=useState(0),[surface,setSurface]=useState<InspectionSurface>('textured'),[lamp,setLamp]=useState(true),[room,setRoom]=useState<'security'|'conveyor'>('security'),[camera,setCamera]=useState<'model'|'cctv'>('model'),[angle,setAngle]=useState(0),[focus,setFocus]=useState<'body'|'portrait'|'head'|'skirt'>('body'),[report,setReport]=useState<SceneReport|null>(null);
 const [assembly,setAssembly]=useState(!!d.fittedFaces),[faceId,setFaceId]=useState('grace-8k'),[coverage,setCoverage]=useState<MaskCoverage>('full'),[faceReady,setFaceReady]=useState(false),[faceError,setFaceError]=useState(''),[eyes,setEyes]=useState(true);
 const [groundGuides,setGroundGuides]=useState(false);
 const [motionMode,setMotionMode]=useState(!!d.motion),[clipId,setClipId]=useState(d.motion?.clips[0].id??'Rest'),[version,setVersion]=useState<MotionVersion>('Corrected'),[phase,setPhase]=useState(0),[running,setRunning]=useState(false),[speed,setSpeed]=useState(1),[loop,setLoop]=useState(true);
 const motionBank=d.motionAuditions?.find(b=>b.clips.some(c=>c.id===clipId))??d.motion;
 const motionChoices=[...(d.motion?.clips??[]),...(d.motionAuditions??[]).flatMap(b=>b.clips)];
 const clip=motionBank?.clips.find(c=>c.id===clipId),duration=clip?.duration??0;
 const motionState=useRef({clipId,version,speed,loop});motionState.current={clipId,version,speed,loop};
 const current=d.assets.find(a=>a.id===(motionMode||assembly?'body':id))!,selectedFace=d.assets.find(a=>a.id===faceId);
 const fitting=!!d.fittedFaces&&(motionMode||assembly),mounted=fitting&&faceId!=='none';
 const appearanceLabel=faceId==='none'?'Exposed mechanism':coverage==='full'?'Full Grace':coverage==='half-left'?'Half Grace · left covered':'Half Grace · right covered';
 const label=motionMode?`${clip?.label??'Neutral rig'} · ${version==='Source'?'original':'corrected'} · ${faceReady?appearanceLabel:'fitting face…'} · ${running?'playing':'paused'}`:assembly?`CATHEXIS · ${faceReady?appearanceLabel:'original face'}`:current.label;
 const triangles=(motionMode?motionBank!.triangles:current.triangles)+(mounted&&faceReady?(selectedFace?.triangles??0):0);
 const appearance=useRef({turn,surface,lamp,room,eyes,groundGuides});appearance.current={turn,surface,lamp,room,eyes,groundGuides};
 useEffect(()=>{
  let alive=true,inView=true,scene:FactoryScene|null=null;
  const observer=new IntersectionObserver(e=>{inView=e[0]?.isIntersecting??false;scene?.active(inView);if(!inView){model.current?.motion?.play(false);scene?.update({...initialStudy(),workers:[],running:false});setRunning(false);}});if(canvas.current)observer.observe(canvas.current);
  void(async()=>{try{
   const {createFactoryScene}=await import('../factory-study/scene');if(!alive||!canvas.current)return;
   scene=createFactoryScene(canvas.current,r=>{if(alive)setReport(r);},()=>{},{reviewOnly:true});floor.current=scene;
   scene.inset(0,0);scene.isolate(true);scene.motion(false);scene.review('model',3.8);scene.focus('security');scene.cctv(true,0,false);scene.update({...initialStudy(),workers:[],running:false});scene.active(inView);setFloorReady(true);
  }catch(e){scene?.dispose();floor.current=null;if(alive)setError(e instanceof Error?e.message:'Renderer unavailable.');}})();
  const hidden=()=>{if(document.hidden){model.current?.motion?.play(false);scene?.update({...initialStudy(),workers:[],running:false});setRunning(false);}};document.addEventListener('visibilitychange',hidden);
  return()=>{alive=false;document.removeEventListener('visibilitychange',hidden);observer.disconnect();model.current?.dispose();model.current=null;scene?.dispose();floor.current=null;};
 },[sceneRetry]);
 useEffect(()=>{
  if(!floorReady||!floor.current)return;
  let alive=true;const abort=new AbortController();let subject:Subject|null=null;
  void(async()=>{try{
   abort.signal.throwIfAborted();
   if(motionMode&&motionBank){
    const {loadMotionModel}=await import('./motion-model');
    subject=await loadMotionModel(floor.current!.characterStage(),motionBank,abort.signal,(p,ended)=>{if(alive){setPhase(p);if(ended){setRunning(false);floor.current?.update({...initialStudy(),workers:[],running:false});}}});
    const m=motionState.current;subject.motion?.select(m.clipId,m.version);subject.motion?.speed(m.speed);subject.motion?.loop(m.loop);
   }else {const {loadInspectionModel}=await import('./inspection-model');subject=await loadInspectionModel(floor.current!.characterStage(),current.file,abort.signal,!!d.fittedFaces&&current.id==='body',d.fittedFaces?(current.id==='body'?bodyEyePatch:cathexisFits[current.id]?.eyes):undefined);}
   if(!alive){subject.dispose();return;}
   const a=appearance.current;subject.eyes(a.eyes);subject.turn(a.turn);subject.surface(a.surface);subject.light(a.lamp);subject.room(a.room);subject.ground?.(a.groundGuides);model.current=subject;setReady(true);
  }catch(e){if(alive)setError(e instanceof Error?e.message:'Unable to load selected asset.');}})();
  return()=>{alive=false;abort.abort();subject?.dispose();if(model.current===subject)model.current=null;};
 },[floorReady,current,retry,d.fittedFaces,motionMode,motionBank]);
 useEffect(()=>{
  if(!ready||!model.current)return;
  let active=true;setFaceReady(false);setFaceError('');
  const subject=model.current;
  void subject.face(fitting&&selectedFace?selectedFace.file:null,fitting?cathexisFits[faceId]:undefined,coverage).then(()=>{if(active)setFaceReady(true);}).catch(e=>{if(active&&e.name!=='AbortError')setFaceError(e instanceof Error?e.message:'Unable to fit face.');});
  return()=>{active=false;};
 },[ready,fitting,faceId,selectedFace,coverage,retry,motionMode]);
 function play(value:boolean){setRunning(value);model.current?.motion?.play(value);floor.current?.update({...initialStudy(),workers:[],running:value});}
 function seek(seconds:number){play(false);const p=duration?Math.min(1,Math.max(0,seconds/duration)):0;setPhase(p);model.current?.motion?.seek(p);}
 function motionView(value:boolean){if(value===motionMode)return;play(false);setReady(false);setError('');setPhase(0);setMotionMode(value);setFocus('body');floor.current?.reviewSubject(1.02,3.8,3.2);}
 function view(value:boolean){if(value===assembly)return;play(false);setAssembly(value);if(current.id!=='body'){setReady(false);setError('');}setId('body');setFocus('body');floor.current?.reviewSubject(1.02,3.8,3.2);}
 function choose(value:string){if(value===id)return;setReady(false);setError('');setId(value);if(focus!=='body'){setFocus('body');floor.current?.reviewSubject(1.02,3.8,3.2);} }
 function rotate(value:number){if(camera==='cctv')mode('model');floor.current?.reviewCamera('reset');setTurn(value);model.current?.turn(value);}
 function mode(value:'model'|'cctv'){setCamera(value);floor.current?.review(value==='model'?'model':'model-cctv');floor.current?.cctv(true,angle,false);}
 function focusRegion(value:typeof focus){setFocus(value);if(camera==='cctv')mode('model');floor.current?.reviewSubject(value==='head'?(motionMode?1.54:1.72):value==='portrait'?1.25:value==='skirt'?.55:1.02,value==='head'?.85:value==='portrait'?1.85:value==='skirt'?2.3:3.8,value==='head'?.35:value==='portrait'?.85:value==='skirt'?1.5:3.2);}
 function retryLoad(){setError('');setReady(false);if(floor.current)setRetry(n=>n+1);else{setFloorReady(false);setSceneRetry(n=>n+1);}}
 function evidence(){const result={motion:motionMode?{revision:motionBank!.revision,file:motionBank!.file,clip,version,phase,seconds:phase*duration,speed,loop}:null,subject:d.id,revision:d.revision,asset:current,camera,cameraPose:floor.current?.reviewCamera(),angle,focus,room,turn,surface,lamp,eyes,groundGuides,rootPlacement:'Fixed clip origin; pelvis sway preserved',report,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},assembly,coverage,face:mounted&&faceReady?selectedFace:null,fit:mounted&&faceReady?cathexisFits[faceId]:null,scope:motionMode?'Rigid head-mounted full/half Grace on baked motion; no facial articulation or scene-contact certification.':assembly?'Static fitted face candidate; no rig or motion acceptance.':'Isolated static inspection.'};const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`${d.name.toLowerCase()}-${id}-review.json`;a.click();URL.revokeObjectURL(url);}
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/play/asset-review'>← Asset review library</Link><h1>{d.name}<span>Character review</span></h1></div><Link href={d.brief}>Generation brief ↗</Link></header>
  <ReviewNavigation current={d.id}/><ReviewChecklist subject={d.id}/>
  <div className={styles.workspace}>
   <section className={`${styles.stage} ${styles.modelStage}`} aria-label={`${d.name} asset inspection`}>
    <ReviewCameraControls ready={ready} fixed={camera==='cctv'} onAction={a=>floor.current?.reviewCamera(a)}/>
    <canvas ref={canvas} tabIndex={0} aria-label={`${d.name} ${label}. Drag to orbit; arrows rotate; scroll or pinch to zoom.`}/>
    <div className={styles.cameraTag}><i/>{room==='security'?'SECURITY':'LATTICE FORGE'}<span>{camera==='model'?'ASSET INSPECTION':`CCTV · CAM ${angle+1}`}</span></div>
    {!ready&&<div className={styles.loading} role='status'><strong>{error?'Asset unavailable':`Loading ${label}…`}</strong><p>{error||'Preparing the selected asset and its materials.'}</p>{error&&<button onClick={retryLoad}>Retry loading</button>}</div>}
    <div className={`${styles.caption} ${local.reviewCaption}`}><span>{triangles.toLocaleString()} TRIANGLES · {motionMode?`${motionBank!.joints} BODY + ${version==='Corrected'?motionBank!.extraJoints:0} SKIRT JOINTS`:'UNRIGGED'}</span><strong>{label}</strong><small>{motionMode?`${(phase*duration).toFixed(2)} / ${duration.toFixed(2)} s`:(current.derived?'LOCAL INSPECTION DERIVATIVE':'SOURCE GEOMETRY')} · {motionMode?(version==='Source'?'SOURCE MOTION · REVIEW REQUIRED':(clip?.approval??motionBank?.approval)==='candidate'?'CORRECTED CANDIDATE · REVIEW REQUIRED':'APPROVED CORRECTED MOTION'):assembly?'INTACT BODY FACE · STATIC CANDIDATE':id==='body'?'CLEAN A-POSE':'ISOLATED FACE · DISPLAY SCALE'}</small></div>
   </section>
   <aside className={`${styles.controls} ${local.controls}`} aria-label={`${d.name} inspection controls`}>
    <span className={styles.kicker}>Current assets / {motionMode?'motion review':'fitting review'}</span><h2>Inspect the character.</h2><p>{d.description}</p>
    {motionBank&&<div className={styles.duo} role='group' aria-label='Review task'><button aria-pressed={motionMode} onClick={()=>motionView(true)}>Motion & face review</button><button aria-pressed={!motionMode} onClick={()=>motionView(false)}>Face & asset fitting</button></div>}
    {motionMode&&motionBank&&<MotionReviewControls bank={motionBank} choices={motionChoices} clipId={clipId} version={version} phase={phase} running={running} speed={speed} loop={loop} ready={ready} onClip={id=>{play(false);const next=d.motionAuditions?.find(b=>b.clips.some(c=>c.id===id))??d.motion;const v:MotionVersion=next?.versions?.includes('Corrected')===false?'Source':next!==motionBank?'Corrected':version;setVersion(v);setClipId(id);setPhase(0);if(next!==motionBank){setReady(false);setError('');}else model.current?.motion?.select(id,v);}} onVersion={v=>{play(false);setVersion(v);model.current?.motion?.select(clipId,v,true);}} onPlay={play} onSeek={seek} onSpeed={n=>{setSpeed(n);model.current?.motion?.speed(n);}} onLoop={v=>{setLoop(v);model.current?.motion?.loop(v);}}/>}
    {!motionMode&&d.fittedFaces&&<div className={styles.duo} role='group' aria-label='Inspection mode'><button aria-pressed={assembly} onClick={()=>view(true)}>Assembled character</button><button aria-pressed={!assembly} onClick={()=>view(false)}>Separate assets</button></div>}
    {fitting&&<><label>Appearance<select disabled={!ready} value={faceId==='none'?'none':coverage} onChange={e=>{const value=e.target.value;if(value==='none')setFaceId('none');else{if(faceId==='none')setFaceId('grace-8k');setCoverage(value as MaskCoverage);}}}><option value='full'>Full Grace mask</option><option value='half-left'>Half Grace · left covered</option><option value='half-right'>Half Grace · right covered</option><option value='none'>Exposed body face</option></select></label>
     {mounted&&coverage!=='full'&&<button disabled={!ready} onClick={()=>setCoverage(coverage==='half-left'?'half-right':'half-left')}>Swap covered side</button>}
     {!faceReady&&!faceError&&<p role='status'>Fitting the selected face…</p>}{faceError&&<p role='alert'>{faceError} <button onClick={retryLoad}>Retry face</button></p>}
     <p className={styles.intent}>The original mechanical face stays intact beneath Grace. Full porcelain, split porcelain and the exposed mechanism share one head.</p></>}
    {!motionMode&&!assembly&&<label>Source asset / earlier studies<select value={id} onChange={e=>choose(e.target.value)}>{d.assets.map(a=><option key={a.id} value={a.id}>{a.label}</option>)}</select></label>}
    {d.comparison&&((!motionMode&&!assembly)||mounted)&&<div className={local.compare} role='group' aria-label={d.comparison.label}><span>{d.comparison.label} · camera stays fixed</span><div className={styles.duo}>{d.comparison.ids.map(key=><button key={key} aria-pressed={(fitting?faceId:id)===key} onClick={()=>fitting?setFaceId(key):choose(key)}>{d.assets.find(a=>a.id===key)!.label}</button>)}</div></div>}
    <p className={styles.intent}>{motionMode?'Grace fit and all four corrected motions are approved. Inspect the feet against the fixed floor.':current.note}</p>
    <div className={styles.duo}>{[['Front',0],['Side',90],['Back',180]].map(([label,n])=><button key={label} disabled={!ready} onClick={()=>rotate(Number(n))}>{label}</button>)}</div>
    {motionMode&&<button disabled={!ready} aria-pressed={focus==='portrait'} onClick={()=>focusRegion(focus==='portrait'?'body':'portrait')}>{focus==='portrait'?'Full body':'Supervisor portrait'}</button>}
    {(fitting||d.portraitAsset===id)&&<div className={styles.duo} role='group' aria-label='Inspection framing'><button disabled={!ready} aria-pressed={focus==='head'} onClick={()=>focusRegion(focus==='head'?'body':'head')}>{focus==='head'?'Full body':'Inspect head & face seat'}</button>{motionMode&&<button disabled={!ready} aria-pressed={focus==='skirt'} onClick={()=>focusRegion(focus==='skirt'?'body':'skirt')}>{focus==='skirt'?'Full body':'Inspect skirt & feet'}</button>}</div>}
    {motionMode&&<label className={styles.check}><input type='checkbox' disabled={!ready} checked={groundGuides} onChange={e=>{setGroundGuides(e.target.checked);model.current?.ground?.(e.target.checked);}}/> Floor contact grid · 10 cm</label>}
    <label>Surface<select disabled={!ready} value={surface} onChange={e=>{const value=e.target.value as InspectionSurface;setSurface(value);model.current?.surface(value);}}><option value='textured'>Textured materials</option><option value='clay'>Untextured shape</option><option value='wireframe'>Wireframe</option></select></label>
    {<label className={styles.check}><input type='checkbox' disabled={!ready} checked={eyes} onChange={e=>{setEyes(e.target.checked);model.current?.eyes(e.target.checked);}}/> Illuminated eyes</label>}
    <label className={styles.check}><input type='checkbox' disabled={!ready} checked={lamp} onChange={e=>{setLamp(e.target.checked);model.current?.light(e.target.checked);}}/> Inspection lamp</label>
    <details><summary>Factory cameras</summary><label>View<select disabled={!ready} value={camera} onChange={e=>mode(e.target.value as typeof camera)}><option value='model'>Orbit inspection</option><option value='cctv'>Fixed CCTV</option></select></label>
     {camera==='cctv'&&<div className={styles.duo}>{[0,1,2].map(n=><button key={n} disabled={!ready} aria-pressed={angle===n} onClick={()=>{setAngle(n);floor.current?.cctv(true,n,false);}}>CAM {n+1}</button>)}</div>}
     <label>Room<select disabled={!ready} value={room} onChange={e=>{const value=e.target.value as typeof room;setRoom(value);floor.current?.focus(value);model.current?.room(value);}}><option value='security'>Security</option><option value='conveyor'>Lattice Forge</option></select></label><p>{motionMode?'Compare the same pose through all three factory cameras.':assembly?'Faces are shown at their fitted size. Compare close inspection with all three CCTV angles.':'Isolated faces are enlarged; switch to Assembled character to judge actual scale.'}</p>
    </details>
    <details open><summary>Review scope & remaining work</summary><ul className={local.notes}>{d.observations.map(note=><li key={note}>{note}</li>)}</ul><a href={d.record}>Full intake record ↗</a></details>
    <details><summary>Source & delivery evidence</summary><dl><dt>Source / displayed triangles</dt><dd>{(motionMode?motionBank!.triangles:current.sourceTriangles).toLocaleString()} / {triangles.toLocaleString()}</dd><dt>Selected download</dt><dd>{(((motionMode?motionBank!.file.bytes:current.bytes)+(mounted?(selectedFace?.bytes??0):0))/1048576).toFixed(2)} MiB · {motionMode?'one bank, one visible body':'only the selected face loads'}</dd><dt>Rig / motion</dt><dd>{motionMode?`${motionBank!.joints} body joints + ${motionBank!.extraJoints} costume controls; ${motionBank!.clips.length} clips in the selected bank`:'Static fitting asset; motion is available in Motion & face review'}</dd><dt>Normal map</dt><dd>{current.normalMap?'Present in this export':'Absent in this export'}</dd><dt>Source archive</dt><dd className={styles.breakWord}>{motionMode?clip?.source??'Neutral rig':current.sourceArchive}</dd><dt>Runtime SHA-256</dt><dd className={styles.breakWord}>{motionMode?motionBank!.file.sha256:current.sha256}</dd><dt>Scene frame p50 / p95</dt><dd>{report?.p50??'—'} / {report?.p95??'—'} ms</dd><dt>Scene draw calls</dt><dd>{report?.drawCalls??'—'}</dd></dl><p>Paused inspection renders on demand; playing motion resumes the shared scene. Single-character counters do not certify crowd performance.</p></details>
    <button disabled={!ready} onClick={evidence}>Save review evidence</button>
   </aside>
  </div>
 </main>;
}
