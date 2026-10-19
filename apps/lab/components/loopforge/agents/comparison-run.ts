import {Vector3,Matrix} from '@babylonjs/core/Maths/math.vector';
import type {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {createFactoryScene,type SceneReport,type GraphicsFrame,type GraphicsState} from '../factory-study/scene';
import {REFERENCE_GRAPHICS} from '@/lib/loopforge/graphics/settings';
import {COMPARISON,createComparisonRecorder,type ComparisonCase,type ComparisonMeasurement} from '@/lib/loopforge/performance/comparison';
import {loadWorkerCrowd} from './worker-crowd';
import {loadLimen,limenFile,bladeFile} from './limen-model';
import {loadStiletto,stilettoFile} from './stiletto-model';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
export type ComparisonRow=ComparisonMeasurement&{configuration:ComparisonCase;graphics:GraphicsState;heapBytes:number|null};
export type ComparisonProgress={state:'ready'|'warming'|'measuring'|'finished';index:number;seconds:number;label:string;fps:number;rows:readonly ComparisonRow[];result?:Record<string,unknown>};
/** Identical absolute-time worker choreography and camera path for every comparison. No world-state mutation. */
export async function createComparisonRun(canvas:HTMLCanvasElement,bubbles:HTMLDivElement[],signal:AbortSignal,cases:readonly ComparisonCase[],publish:(p:ComparisonProgress)=>void){
 let status:ComparisonProgress['state']='ready',index=0,started=0,measuredAt=0,lastPublish=0,segment=-1,poseMs=0,disposed=false,latest:SceneReport|null=null;
 let recorder=createComparisonRecorder(),result:Record<string,unknown>|undefined;
 const rows:ComparisonRow[]=[],loadingAt=performance.now();let nextCase=false;
 const floor=createFactoryScene(canvas,r=>latest=r,()=>{},{reviewOnly:true,sourcePalette:true,renderSize:[COMPARISON.width,COMPARISON.height],graphics:REFERENCE_GRAPHICS,context:'room',uncapped:true,onFrame:record});
 const stage=floor.characterStage(),scene=stage.scene,engine=scene.getEngine();
 let crowd:Awaited<ReturnType<typeof loadWorkerCrowd>>|null=null,limen:Awaited<ReturnType<typeof loadLimen>>|null=null,stiletto:Awaited<ReturnType<typeof loadStiletto>>|null=null;
 try{
  floor.inset(0,0);floor.isolate(true);floor.motion(false);floor.review(false);floor.focus('security');floor.cctv(true,0,false);floor.update({...initialStudy(),workers:[],running:false});
  crowd=await loadWorkerCrowd(stage,24,signal);limen=await loadLimen(stage,signal,()=>{});limen.clip('Idle');limen.light(false);
  stiletto=await loadStiletto(stage,signal,()=>{});stiletto.clip('Stand_Talking_Angry');stiletto.light(false);stiletto.flame(false);signal.throwIfAborted();
 }catch(e){crowd?.dispose();limen?.dispose();stiletto?.dispose();floor.dispose();throw e;}
 const loadedAt=performance.now(),state={...initialStudy(),workers:[],running:true},origin=Vector3.Zero(),speakers=[Vector3.Zero(),Vector3.Zero()];
 const resources=()=>({meshes:scene.meshes.length,materials:scene.materials.length,textures:engine.getLoadedTexturesCache().length,skeletons:scene.skeletons.length,geometries:scene.getGeometries().length,animationGroups:scene.animationGroups.length});
 const baseline=resources();let finalResources=baseline;
 function notify(){publish({state:status,index,seconds:started?Math.max(0,(performance.now()-(status==='measuring'?measuredAt:started))/1000):0,label:cases[index].label,fps:latest?.fps??0,rows:[...rows],result});}
 function finish(reason:string|null){
  if(status==='finished'||status==='ready')return;
  status='finished';finalResources=resources();
  result={version:COMPARISON.version,status:reason?'INVALID':'COMPLETE',reason,acceptance:'Diagnostic comparisons only; no acceptance PASS is issued.',protocol:COMPARISON,createdAt:new Date().toISOString(),rows,
   environment:{renderer:latest?.renderer??null,userAgent:navigator.userAgent,cores:navigator.hardwareConcurrency,devicePixelRatio:devicePixelRatio,viewport:[innerWidth,innerHeight],gpuTimerSupported:!!engine.getCaps().timerQuery,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches},
   resources:{baseline,end:finalResources},loadMs:loadedAt-loadingAt,assets:{worker:crowd!.manifest,limen:limenFile,blade:bladeFile,stiletto:stilettoFile},
   limitations:['Fixed 24-worker asset pool: hidden workers reduce drawing and pose updates, not resident asset memory.','CPU submission and GPU execution overlap. They must not be added together. GPU samples are asynchronous; absent samples are unavailable, never zero.','Held-worker case leaves supervisors, machinery and effects running; worker pose time excludes Babylon skeleton preparation.','Short comparisons diagnose cost; full sustained acceptance, gameplay systems and device coverage remain separate.','Reference repeat checks time/order drift. Repeat important comparisons in reverse order before a causal conclusion.']};
  floor.update({...state,running:false});floor.motion(false);floor.active(false);notify();
 }
 function place(n:number){
  const room=n<3?'security':'conveyor',angle=n%3;floor.focus(room);floor.cctv(true,angle,false);
  const p=room==='security'?[130,123]:[121,149];origin.set(...worldPoint(p[0],p[1]));crowd!.place(origin);
  speakers[0].copyFrom(origin).addInPlaceFromFloats(-2,2.15,-4.5);speakers[1].copyFrom(origin).addInPlaceFromFloats(2,2.15,-4.5);
  limen!.place(speakers[0].x,.015,speakers[0].z,0);stiletto!.place(speakers[1].x,.015,speakers[1].z,0);
  const camera=scene.activeCamera as ArcRotateCamera;camera.detachControl();camera.alpha=[-Math.PI/2,-1.05,-2.05][angle];camera.beta=.9;camera.radius=25;camera.setTarget(origin.add(new Vector3(0,1,0)),false,true,true);stage.gate(true);
 }
 function beginCase(){
  floor.graphics(cases[index].settings);crowd!.visible(cases[index].workers);status='warming';started=performance.now();measuredAt=0;segment=-1;recorder=createComparisonRecorder();floor.active(true);floor.motion(true);notify();
 }
 function record(frame:GraphicsFrame){
  if(status!=='warming'&&status!=='measuring')return;
  const now=performance.now();
  if(status==='warming'&&now-started>=COMPARISON.warmupMs){status='measuring';measuredAt=now;segment=-1;recorder=createComparisonRecorder();}
  else if(status==='measuring'){
   recorder.frame(now,now-measuredAt,{...frame,workerPoseMs:poseMs});
   if(now-measuredAt>=COMPARISON.durationMs){rows.push({...recorder.result(),configuration:cases[index],graphics:floor.graphics(),heapBytes:(performance as Performance&{memory?:{usedJSHeapSize:number}}).memory?.usedJSHeapSize??null});if(index===cases.length-1){finish(null);return;}nextCase=true;}
  }
  if(now-lastPublish>=1000){lastPublish=now;notify();}
 }
 const before=scene.onBeforeRenderObservable.add(()=>{
  if(nextCase){nextCase=false;index++;beginCase();}
  if(status!=='warming'&&status!=='measuring')return;
  const now=performance.now(),seconds=(now-(status==='measuring'?measuredAt:started))/1000;
  const n=Math.min(5,Math.floor(seconds/(status==='warming'?COMPARISON.warmupMs/6000:COMPARISON.segmentMs/1000)));
  if(n!==segment){place(n);segment=n;if(cases[index].workerPoses==='held')crowd!.sample(0);}
  const t=performance.now();if(cases[index].workerPoses==='animated')crowd!.sample(seconds);poseMs=performance.now()-t;
  limen!.seek(seconds/limen!.duration()%1);stiletto!.seek(seconds/stiletto!.duration()%1);
  state.travel=seconds*1600;state.tick=Math.floor(seconds*20);floor.update(state);stage.refresh();
 });
 const after=scene.onAfterRenderObservable.add(()=>{
  if(status!=='warming'&&status!=='measuring')return;
  const viewport=scene.activeCamera!.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight());
  bubbles.forEach((b,i)=>{const p=Vector3.Project(speakers[i],Matrix.IdentityReadOnly,scene.getTransformMatrix(),viewport);b.style.left=`clamp(78px, ${100*p.x/engine.getRenderWidth()}%, calc(100% - 78px))`;b.style.top=`${Math.max(2,Math.min(90,100*p.y/engine.getRenderHeight()))}%`;});
 });
 function hidden(){if(document.hidden)finish('Page hidden');}function lost(){finish('WebGL context lost');}
 const visibility=new IntersectionObserver(entries=>{if(!entries[0]?.isIntersecting){finish('Scene scrolled offscreen');floor.active(false);}else if(status!=='finished')floor.active(true);});visibility.observe(canvas);
 document.addEventListener('visibilitychange',hidden);canvas.addEventListener('webglcontextlost',lost);
 place(0);crowd.sample(0);bubbles[0].textContent='LIMEN: Papers first. Every worker.';bubbles[1].textContent='STILETTO: My line needs those workers.';notify();
 return {start(){if(status==='ready')beginCase();},cancel(){finish('Cancelled by reviewer');},
  dispose(){if(disposed)return;disposed=true;visibility.disconnect();document.removeEventListener('visibilitychange',hidden);canvas.removeEventListener('webglcontextlost',lost);scene.onBeforeRenderObservable.remove(before);scene.onAfterRenderObservable.remove(after);crowd!.dispose();limen!.dispose();stiletto!.dispose();floor.dispose();bubbles.forEach(b=>b.textContent='');},
 };
}
