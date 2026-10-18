import {Vector3,Matrix} from '@babylonjs/core/Maths/math.vector';
import type {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {createFactoryScene,type SceneReport} from '../factory-study/scene';
import {loadWorkerCrowd} from './worker-crowd';
import {loadLimen,limenFile,bladeFile} from './limen-model';
import {loadStiletto,stilettoFile} from './stiletto-model';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {ACCEPTANCE,createAcceptanceRecorder,type Resources,type AcceptanceResult} from '@/lib/loopforge/performance/acceptance';
export type Progress={state:'ready'|'warming'|'running'|'finished';seconds:number;room:string;angle:number;fps:number;p95:number;drawCalls:number;triangles:number;probes:number;result?:AcceptanceResult&Record<string,unknown>};
const lines=[['LIMEN','Papers first. Every worker.'],['STILETTO','My line needs those workers.'],['WORKER 07','I was cleared yesterday.'],['WORKER 12','Then why are we still waiting?']];
/** Deterministic renderer workload. This fixture does not simulate crowd decisions or pathfinding. */
export async function createPerformanceRun(canvas:HTMLCanvasElement,bubbles:HTMLDivElement[],signal:AbortSignal,publish:(p:Progress)=>void){
 const loadingAt=performance.now();let latest:SceneReport|null=null;
 const floor=createFactoryScene(canvas,r=>latest=r,()=>{},{reviewOnly:true,renderSize:[ACCEPTANCE.width,ACCEPTANCE.height]});
 const stage=floor.characterStage(),scene=stage.scene,engine=scene.getEngine();
 let crowd:Awaited<ReturnType<typeof loadWorkerCrowd>>|null=null,limen:Awaited<ReturnType<typeof loadLimen>>|null=null,stiletto:Awaited<ReturnType<typeof loadStiletto>>|null=null;
 try{
  floor.inset(0,0);floor.isolate(true);floor.motion(false);floor.review(false);floor.focus('security');floor.cctv(true,0,false);
  floor.update({...initialStudy(),workers:[],running:false});
  // Sequential preparation keeps peak decode memory bounded on the reference laptop.
  crowd=await loadWorkerCrowd(stage,ACCEPTANCE.workers,signal);
  limen=await loadLimen(stage,signal,()=>{});limen.clip('Idle');limen.light(false);
  stiletto=await loadStiletto(stage,signal,()=>{});stiletto.clip('Stand_Talking_Angry');stiletto.light(false);stiletto.flame(false);
  signal.throwIfAborted();
 }catch(e){crowd?.dispose();limen?.dispose();stiletto?.dispose();floor.dispose();throw e;}
 const loadedAt=performance.now(),state={...initialStudy(),workers:[],running:true};
 const recorder=createAcceptanceRecorder(),resource=():Resources=>({meshes:scene.meshes.length,materials:scene.materials.length,textures:engine.getLoadedTexturesCache().length,skeletons:scene.skeletons.length,geometries:scene.getGeometries().length,animationGroups:scene.animationGroups.length});
 const heap=()=>((performance as Performance & {memory?:{usedJSHeapSize:number}}).memory?.usedJSHeapSize??null);
 let status:Progress['state']='ready',started=0,measureStart=0,lastPublish=0,lastSegment=-1,room='security',angle=0,speech=-1,baseline=resource(),contextLosses=0,pendingSwitch:number|null=null,probes=0;
 let pendingInput:number|null=null,inputPulse=false,disposed=false,final:(AcceptanceResult&Record<string,unknown>)|undefined;
 const memory:{seconds:number;heapBytes:number|null;resources:Resources}[]=[],longTasks:{startMs:number;durationMs:number}[]=[];
 let taskObserver:PerformanceObserver|null=null;
 const origin=Vector3.Zero(),speakers=[Vector3.Zero(),Vector3.Zero()];
 function place(segment:number){
  room=segment%6<3?'security':'conveyor';angle=segment%3;
  floor.focus(room as 'security'|'conveyor');floor.cctv(true,angle,false);
  const p=room==='security'?[130,123]:[121,149];origin.set(...worldPoint(p[0],p[1]));crowd!.place(origin);
  speakers[0].copyFrom(origin).addInPlaceFromFloats(-2,2.15,-4.5);speakers[1].copyFrom(origin).addInPlaceFromFloats(2,2.15,-4.5);
  limen!.place(speakers[0].x,.015,speakers[0].z,0);stiletto!.place(speakers[1].x,.015,speakers[1].z,0);
  const camera=scene.activeCamera as ArcRotateCamera;camera.detachControl();camera.alpha=[-Math.PI/2,-1.05,-2.05][angle];camera.beta=.9;camera.radius=25;camera.setTarget(origin.add(new Vector3(0,1,0)),false,true,true);
  stage.gate(true);stage.refresh();
 }
 function snapshot(){publish({state:status,seconds:status==='ready'?0:Math.max(0,(performance.now()-(measureStart||started))/1000),room,angle:angle+1,fps:latest?.fps??0,p95:latest?.p95??0,drawCalls:latest?.drawCalls??0,triangles:latest?.triangles??0,probes,result:final});}
 function finish(reason:string|null){
  if(status!=='running'&&status!=='warming')return;
  const result=recorder.result(baseline,resource(),reason,contextLosses);
  final={...result,protocol:ACCEPTANCE,createdAt:new Date().toISOString(),environment:{userAgent:navigator.userAgent,cores:navigator.hardwareConcurrency,deviceMemoryGiB:(navigator as Navigator&{deviceMemory?:number}).deviceMemory??null,devicePixelRatio:devicePixelRatio,viewport:[innerWidth,innerHeight],canvas:[engine.getRenderWidth(),engine.getRenderHeight()],renderer:latest?.renderer??null,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches},
   loadMs:loadedAt-loadingAt,assets:{worker:crowd!.manifest,limen:limenFile,blade:bladeFile,stiletto:stilettoFile},memory,longTasks,
   limitations:['Draw-completion cadence is not a GPU timestamp or compositor presentation measurement.','Synthetic two-room workload, not crowd BDI, pathfinding, contacts or final room art.','Warm asset/renderer test; local asset preparation is not cold internet delivery.','Heap is an optional browser estimate, not GPU memory. Resource stability is not a full leak proof.','One selected camera; simultaneous three-feed and physical mobile tests remain separate gates.']};
  status='finished';taskObserver?.disconnect();limen!.play(false);stiletto!.play(false);floor.motion(false);floor.update({...state,running:false});snapshot();floor.active(false);
 }
 function visibility(){if(document.hidden)finish('Page hidden during acceptance run');}
 function contextLost(){contextLosses++;finish('WebGL context lost');}
 const intersection=new IntersectionObserver(entries=>{if(!entries[0]?.isIntersecting){finish('Scene scrolled offscreen');floor.active(false);}else if(status!=='finished')floor.active(true);});intersection.observe(canvas);
 document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',contextLost);
 const before=scene.onBeforeRenderObservable.add(()=>{
  if(status!=='warming'&&status!=='running')return;
  const now=performance.now(),seconds=(now-started)/1000;
  const segment=status==='warming'?Math.min(5,Math.floor((now-started)/5000)):Math.min(29,Math.floor((now-measureStart)/ACCEPTANCE.segmentMs));
  if(segment!==lastSegment){if(status==='running'&&lastSegment!==-1)pendingSwitch=measureStart+segment*ACCEPTANCE.segmentMs;place(segment);lastSegment=segment;}
  crowd!.sample(seconds);state.travel=seconds*1600;state.tick=Math.floor(seconds*20);floor.update(state);stage.refresh();
 });
 const after=scene.onAfterRenderObservable.add(()=>{
  if(status!=='warming'&&status!=='running')return;
  const now=performance.now();
  if(status==='warming'&&now-started>=ACCEPTANCE.warmupMs){status='running';measureStart=now;lastSegment=-1;baseline=resource();memory.push({seconds:0,heapBytes:heap(),resources:baseline});
   if(PerformanceObserver.supportedEntryTypes.includes('longtask')){taskObserver=new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.startTime>=measureStart&&longTasks.length<2000)longTasks.push({startMs:e.startTime-measureStart,durationMs:e.duration});});taskObserver.observe({type:'longtask'});}
  }
  if(status==='running'){
   recorder.frame(now);if(pendingSwitch!==null){recorder.switchResponse(now-pendingSwitch);pendingSwitch=null;}
   if(pendingInput!==null){recorder.inputResponse(now-pendingInput);pendingInput=null;}
   if(engine.getRenderWidth()!==ACCEPTANCE.width||engine.getRenderHeight()!==ACCEPTANCE.height){finish('Render resolution changed');return;}
   const seconds=(now-measureStart)/1000;if(seconds>=memory.length*10)memory.push({seconds,heapBytes:heap(),resources:resource()});
   if(now-measureStart>=ACCEPTANCE.durationMs){finish(null);return;}
  }
  const speechIndex=Math.floor((now-started)/6000)%2;if(speech!==speechIndex){speech=speechIndex;bubbles.forEach((b,i)=>{const line=lines[i+speechIndex*2];b.textContent=`${line[0]}: ${line[1]}`;});}
  const camera=scene.activeCamera!,viewport=camera.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight());
  bubbles.forEach((b,i)=>{const projected=Vector3.Project(speakers[i],Matrix.IdentityReadOnly,scene.getTransformMatrix(),viewport);b.style.left=`clamp(78px, ${100*projected.x/engine.getRenderWidth()}%, calc(100% - 78px))`;b.style.top=`${Math.max(2,Math.min(90,100*projected.y/engine.getRenderHeight()))}%`;});
  if(now-lastPublish>1000){lastPublish=now;snapshot();}
 });
 place(0);crowd!.sample(0);snapshot();
 return {
  start(){if(status!=='ready')return;status='warming';started=performance.now();lastSegment=-1;floor.active(true);floor.motion(true);limen!.play(true);stiletto!.play(true);snapshot();},
  probe(timestamp:number){if(status!=='running')return;pendingInput=timestamp;probes++;inputPulse=!inputPulse;canvas.style.outline=inputPulse?'3px solid #d9c677':'3px solid #70bfc1';stage.refresh();},
  cancel(){finish('Cancelled by reviewer');},
  dispose(){if(disposed)return;disposed=true;taskObserver?.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',contextLost);scene.onBeforeRenderObservable.remove(before);scene.onAfterRenderObservable.remove(after);crowd!.dispose();limen!.dispose();stiletto!.dispose();floor.dispose();bubbles.forEach(b=>{b.textContent='';});canvas.style.outline='';},
 };
}
