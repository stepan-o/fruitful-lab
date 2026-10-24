import type {Engine} from '@babylonjs/core/Engines/engine';
import {OPENING_ACCEPTANCE,CONVEYOR_ACCEPTANCE,createOpeningRecorder} from '@/lib/loopforge/performance/opening-acceptance';
import {ARRIVAL_REVISION} from '@/lib/loopforge/encounters/arrival';
import type {Resources} from '@/lib/loopforge/performance/acceptance';
import type {View} from '@/lib/loopforge/encounters/contract';
import {subscribeGraphics} from '@/lib/loopforge/graphics/store';
import {REFERENCE_GRAPHICS} from '@/lib/loopforge/graphics/settings';
import workers from '@/lib/assets/generated/loopforge-opening-workers.json';
import stiletto from '@/lib/assets/generated/loopforge-stiletto-review.json';
import limen from '@/lib/assets/generated/loopforge-limen-motions.json';
import roomKit from '@/lib/loopforge/rooms/room-kit.json';
import type {RehearsalStage} from './arrival-stage';
export type OpeningProgress={state:'warming'|'running'|'finished';seconds:number;episodes:number;result?:ReturnType<ReturnType<typeof createOpeningRecorder>['result']>&Record<string,unknown>};
export function startOpeningPerformance(floor:RehearsalStage,canvas:HTMLCanvasElement,view:()=>View,restart:()=>void,stop:()=>void,publish:(p:OpeningProgress)=>void,roomRange?:{startTick:number;endTick:number}){
 const scene=floor.characterStage().scene,engine=scene.getEngine() as Engine,recorder=createOpeningRecorder(roomRange?'conveyor':'opening'),settings=REFERENCE_GRAPHICS,protocol=roomRange?CONVEYOR_ACCEPTANCE:OPENING_ACCEPTANCE;
 const resources=():Resources=>({meshes:scene.meshes.length,materials:scene.materials.length,textures:engine.getLoadedTexturesCache().length,skeletons:scene.skeletons.length,geometries:scene.getGeometries().length,animationGroups:scene.animationGroups.length});
 const start=performance.now();let drawSamples=0,drawTotal=0,triangleTotal=0,drawStart=0;
 let state:OpeningProgress['state']='warming',measuring=0,lastPublish=0,episodes=0,baseline=resources(),pendingInput:number|null=null;
 floor.benchmark?.(true);restart();
 function finish(reason:string|null){if(state==='finished')return;state='finished';const result={...recorder.result(baseline,resources(),episodes,reason),protocol,workload:roomRange?'Bounded actual Conveyor tutorial; connected room/cast remain loaded; not whole-episode acceptance':'Whole opening',roomRange:roomRange??null,renderPolicy:'pose-invalidated-directional-shadows/1',scene:ARRIVAL_REVISION,drawSummary:{samples:drawSamples,meanDrawCalls:drawSamples?drawTotal/drawSamples:null,meanActiveTriangles:drawSamples?triangleTotal/drawSamples:null},createdAt:new Date().toISOString(),graphics:settings,stationLighting:floor.stationLightSnapshot?.(),assets:{roomKit,stiletto:stiletto.assets.stiletto.variants[0].sha256,workers:Object.fromEntries(Object.entries(workers.assets).filter(([key])=>key.endsWith('-floor')).map(([key,value])=>[key,value.variants[0].sha256])),limen:limen.assets['motions-floor'].variants[0].sha256},environment:{renderer:engine.getGlInfo().renderer,userAgent:navigator.userAgent,cores:navigator.hardwareConcurrency,viewport:[innerWidth,innerHeight],devicePixelRatio,canvas:[engine.getRenderWidth(),engine.getRenderHeight()]},limitations:['Draw completion cadence is not a GPU timestamp.','Warm repeated authored opening; general BDI planning and cold internet loading are separate gates.','Contacts and artistic quality require visual approval; a performance pass does not establish either.']};stop();floor.benchmark?.(false);publish({state,seconds:(performance.now()-(measuring||start))/1000,episodes,result});}
 const before=scene.onBeforeRenderObservable.add(()=>{drawStart=engine._drawCalls.current;});
 const after=scene.onAfterRenderObservable.add(()=>{
  if(state==='finished')return;const now=performance.now();
  if(state==='warming'&&now-start>=protocol.warmupMs){state='running';measuring=now;baseline=resources();episodes=0;restart();}
  if(state==='running'){drawSamples++;const draws=engine._drawCalls.current;drawTotal+=draws>=drawStart?draws-drawStart:draws;triangleTotal+=scene.getActiveIndices()/3;const current=view();recorder.frame(now,current.framing??'approach',current.phase);if(pendingInput!==null){recorder.probe(now-pendingInput);pendingInput=null;}if(engine.getRenderWidth()!==1280||engine.getRenderHeight()!==720){finish('Canvas size changed');return;}if(now-measuring>=protocol.durationMs){finish(null);return;}}
  if(now-lastPublish>1000){lastPublish=now;publish({state,seconds:(now-(measuring||start))/1000,episodes});}
 });
 const hidden=()=>{if(document.hidden)finish('Page hidden during run');},contextLost=()=>finish('WebGL context lost');
 const intersection=new IntersectionObserver(e=>{if(!e[0]?.isIntersecting)finish('Scene scrolled offscreen');});intersection.observe(canvas);
 const unsubscribe=subscribeGraphics(()=>finish('Graphics settings changed'));
 document.addEventListener('visibilitychange',hidden);canvas.addEventListener('webglcontextlost',contextLost);
 publish({state,seconds:0,episodes});
 return {get active(){return state!=='finished';},loop(){if(state==='running')episodes++;restart();},probe(timestamp:number){if(state==='running'){pendingInput=timestamp;floor.characterStage().refresh();}},cancel(){finish('Cancelled by reviewer');},dispose(){scene.onBeforeRenderObservable.remove(before);scene.onAfterRenderObservable.remove(after);intersection.disconnect();unsubscribe();document.removeEventListener('visibilitychange',hidden);canvas.removeEventListener('webglcontextlost',contextLost);}};
}
