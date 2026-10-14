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
type Subject=Awaited<ReturnType<typeof loadInspectionModel>>;
export type InspectionAsset={id:string;label:string;triangles:number;sourceTriangles:number;bytes:number;sha256:string;sourceArchive:string;note:string;normalMap:boolean;derived:boolean;file:InspectionFile};
export type InspectionDefinition={id:string;name:string;revision:string;description:string;record:string;brief:string;assets:InspectionAsset[];observations:string[];comparison?:{ids:[string,string];label:string};portraitAsset?:string};
export default function AssetInspectionWorkbench({definition:d}:{definition:InspectionDefinition}){
 const canvas=useRef<HTMLCanvasElement>(null),floor=useRef<FactoryScene|null>(null),model=useRef<Subject|null>(null);
 const [floorReady,setFloorReady]=useState(false),[ready,setReady]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[sceneRetry,setSceneRetry]=useState(0);
 const [id,setId]=useState(d.assets[0].id),[turn,setTurn]=useState(0),[surface,setSurface]=useState<InspectionSurface>('textured'),[lamp,setLamp]=useState(true),[room,setRoom]=useState<'security'|'conveyor'>('security'),[camera,setCamera]=useState<'model'|'cctv'>('model'),[angle,setAngle]=useState(0),[portrait,setPortrait]=useState(false),[report,setReport]=useState<SceneReport|null>(null);
 const current=d.assets.find(a=>a.id===id)!;
 const appearance=useRef({turn,surface,lamp,room});appearance.current={turn,surface,lamp,room};
 useEffect(()=>{
  let alive=true,inView=true,scene:FactoryScene|null=null;
  const observer=new IntersectionObserver(e=>{inView=e[0]?.isIntersecting??false;scene?.active(inView);});if(canvas.current)observer.observe(canvas.current);
  void(async()=>{try{
   const {createFactoryScene}=await import('../factory-study/scene');if(!alive||!canvas.current)return;
   scene=createFactoryScene(canvas.current,r=>{if(alive)setReport(r);},()=>{},{reviewOnly:true});floor.current=scene;
   scene.inset(0,0);scene.isolate(true);scene.motion(false);scene.review('model',3.8);scene.focus('security');scene.cctv(true,0,false);scene.update({...initialStudy(),workers:[],running:false});scene.active(inView);setFloorReady(true);
  }catch(e){scene?.dispose();floor.current=null;if(alive)setError(e instanceof Error?e.message:'Renderer unavailable.');}})();
  return()=>{alive=false;observer.disconnect();model.current?.dispose();model.current=null;scene?.dispose();floor.current=null;};
 },[sceneRetry]);
 useEffect(()=>{
  if(!floorReady||!floor.current)return;
  let alive=true;const abort=new AbortController();let subject:Subject|null=null;
  void(async()=>{try{
   const {loadInspectionModel}=await import('./inspection-model');abort.signal.throwIfAborted();
   subject=await loadInspectionModel(floor.current!.characterStage(),current.file,abort.signal);
   if(!alive){subject.dispose();return;}
   const a=appearance.current;subject.turn(a.turn);subject.surface(a.surface);subject.light(a.lamp);subject.room(a.room);model.current=subject;setReady(true);
  }catch(e){if(alive)setError(e instanceof Error?e.message:'Unable to load selected asset.');}})();
  return()=>{alive=false;abort.abort();subject?.dispose();if(model.current===subject)model.current=null;};
 },[floorReady,current,retry]);
 function choose(value:string){if(value===id)return;setReady(false);setError('');setId(value);if(portrait){setPortrait(false);floor.current?.reviewSubject(1.02,3.8,3.2);} }
 function rotate(value:number){if(camera==='cctv')mode('model');floor.current?.reviewCamera('reset');setTurn(value);model.current?.turn(value);}
 function mode(value:'model'|'cctv'){setCamera(value);floor.current?.review(value==='model'?'model':'model-cctv');floor.current?.cctv(true,angle,false);}
 function focusHead(value:boolean){setPortrait(value);if(camera==='cctv')mode('model');floor.current?.reviewSubject(value?1.72:1.02,value?.85:3.8,value?.35:3.2);}
 function retryLoad(){setError('');setReady(false);if(floor.current)setRetry(n=>n+1);else{setFloorReady(false);setSceneRetry(n=>n+1);}}
 function evidence(){const result={subject:d.id,revision:d.revision,asset:current,camera,cameraPose:floor.current?.reviewCamera(),angle,portrait,room,turn,surface,lamp,report,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},scope:'Static unrigged inspection; no fitted assembly or motion acceptance.'};const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`${d.name.toLowerCase()}-${id}-review.json`;a.click();URL.revokeObjectURL(url);}
 return <main className={styles.page}>
  <header className={styles.header}><div><Link href='/stepanoskin/loopforge/play/asset-review'>← Asset review library</Link><h1>{d.name}<span>Body & face review</span></h1></div><Link href={d.brief}>Generation brief ↗</Link></header>
  <ReviewNavigation current={d.id}/><ReviewChecklist subject={d.id}/>
  <div className={styles.workspace}>
   <section className={`${styles.stage} ${styles.modelStage}`} aria-label={`${d.name} asset inspection`}>
    <ReviewCameraControls ready={ready} fixed={camera==='cctv'} onAction={a=>floor.current?.reviewCamera(a)}/>
    <canvas ref={canvas} tabIndex={0} aria-label={`${d.name} ${current.label}. Drag to orbit; arrows rotate; scroll or pinch to zoom.`}/>
    <div className={styles.cameraTag}><i/>{room==='security'?'SECURITY':'LATTICE FORGE'}<span>{camera==='model'?'ASSET INSPECTION':`CCTV · CAM ${angle+1}`}</span></div>
    {!ready&&<div className={styles.loading} role='status'><strong>{error?'Asset unavailable':`Loading ${current.label}…`}</strong><p>{error||'Preparing the selected asset and its materials.'}</p>{error&&<button onClick={retryLoad}>Retry loading</button>}</div>}
    <div className={styles.caption}><span>{current.triangles.toLocaleString()} TRIANGLES · UNRIGGED</span><strong>{current.label}</strong><small>{current.derived?'LOCAL INSPECTION DERIVATIVE':'SOURCE GEOMETRY'} · {id==='body'?'CLEAN A-POSE':'ISOLATED FACE · DISPLAY SCALE'}</small></div>
   </section>
   <aside className={`${styles.controls} ${local.controls}`} aria-label={`${d.name} inspection controls`}>
    <span className={styles.kicker}>Current assets / static review</span><h2>Inspect the character.</h2><p>{d.description}</p>
    <label>Asset<select value={id} onChange={e=>choose(e.target.value)}>{d.assets.map(a=><option key={a.id} value={a.id}>{a.label}</option>)}</select></label>
    {d.comparison&&<div className={local.compare} role='group' aria-label={d.comparison.label}><span>{d.comparison.label} · camera stays fixed</span><div className={styles.duo}>{d.comparison.ids.map(key=><button key={key} aria-pressed={id===key} onClick={()=>choose(key)}>{d.assets.find(a=>a.id===key)!.label}</button>)}</div></div>}
    <p className={styles.intent}>{current.note}</p>
    <div className={styles.duo}>{[['Front',0],['Side',90],['Back',180]].map(([label,n])=><button key={label} disabled={!ready} onClick={()=>rotate(Number(n))}>{label}</button>)}</div>
    {d.portraitAsset===id&&<button disabled={!ready} aria-pressed={portrait} onClick={()=>focusHead(!portrait)}>{portrait?'Full body':'Inspect head & face seat'}</button>}
    <label>Surface<select disabled={!ready} value={surface} onChange={e=>{const value=e.target.value as InspectionSurface;setSurface(value);model.current?.surface(value);}}><option value='textured'>Textured materials</option><option value='clay'>Untextured shape</option><option value='wireframe'>Wireframe</option></select></label>
    <label className={styles.check}><input type='checkbox' disabled={!ready} checked={lamp} onChange={e=>{setLamp(e.target.checked);model.current?.light(e.target.checked);}}/> Inspection lamp</label>
    <details><summary>Factory cameras</summary><label>View<select disabled={!ready} value={camera} onChange={e=>mode(e.target.value as typeof camera)}><option value='model'>Orbit inspection</option><option value='cctv'>Fixed CCTV</option></select></label>
     {camera==='cctv'&&<div className={styles.duo}>{[0,1,2].map(n=><button key={n} disabled={!ready} aria-pressed={angle===n} onClick={()=>{setAngle(n);floor.current?.cctv(true,n,false);}}>CAM {n+1}</button>)}</div>}
     <label>Room<select disabled={!ready} value={room} onChange={e=>{const value=e.target.value as typeof room;setRoom(value);floor.current?.focus(value);model.current?.room(value);}}><option value='security'>Security</option><option value='conveyor'>Lattice Forge</option></select></label><p>Faces are enlarged for isolated inspection. Their CCTV view does not establish readability when mounted on the body.</p>
    </details>
    <details open><summary>What this intake can establish</summary><ul className={local.notes}>{d.observations.map(note=><li key={note}>{note}</li>)}</ul><a href={d.record}>Full intake record ↗</a></details>
    <details><summary>Source & delivery evidence</summary><dl><dt>Source / displayed triangles</dt><dd>{current.sourceTriangles.toLocaleString()} / {current.triangles.toLocaleString()}</dd><dt>Selected download</dt><dd>{(current.bytes/1048576).toFixed(2)} MiB · other assets load on selection</dd><dt>Rig / motion</dt><dd>No skin joints or clips in this intake</dd><dt>Normal map</dt><dd>{current.normalMap?'Present in this export':'Absent in this export'}</dd><dt>Source archive</dt><dd className={styles.breakWord}>{current.sourceArchive}</dd><dt>Runtime SHA-256</dt><dd className={styles.breakWord}>{current.sha256}</dd><dt>Scene frame p50 / p95</dt><dd>{report?.p50??'—'} / {report?.p95??'—'} ms</dd><dt>Scene draw calls</dt><dd>{report?.drawCalls??'—'}</dd></dl><p>Static demand-rendered scene. These counters do not certify animated scenes or crowd performance.</p></details>
    <button disabled={!ready} onClick={evidence}>Save review evidence</button>
   </aside>
  </div>
 </main>;
}
