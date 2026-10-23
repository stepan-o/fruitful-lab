import type {Engine} from '@babylonjs/core/Engines/engine';
import type {RehearsalStage} from './arrival-stage';
import type {StationLighting} from './station-light';
import type {View} from '@/lib/loopforge/encounters/contract';
import {subscribeGraphics} from '@/lib/loopforge/graphics/store';
const passes=[['Glow only','glow'],['Light spill','light'],['Light + shadows','shadows'],['Glow repeat','glow']] as const;
const percentile=(a:number[],p:number)=>a.length?a[Math.min(a.length-1,Math.floor(a.length*p))]:0;
export type LightSample={label:string;mode:StationLighting;frames:number;fps:number;p95Ms:number;p99Ms:number;stalls:number;renderMeanMs:number;drawsMean:number};
export type LightComparison={state:'warming'|'measuring'|'finished';label:string;seconds:number;rows:LightSample[];reason?:string;environment?:Record<string,unknown>};
/** Paired diagnostic, not an acceptance test: repeat the exact 93–113s sequence twice
 * per mode at reference graphics. A repeated baseline exposes load/thermal drift. */
export function compareStationLights(floor:RehearsalStage,canvas:HTMLCanvasElement,view:()=>View,restart:()=>void,stop:()=>void,restore:StationLighting,publish:(value:LightComparison)=>void){
 const scene=floor.characterStage().scene,engine=scene.getEngine() as Engine;
 let index=0,state:LightComparison['state']='warming',start=performance.now(),last=0,lastPublish=0,before=0,drawStart=0,renderTotal=0,draws=0;
 let samples:number[]=[];const rows:LightSample[]=[];
 floor.benchmark?.(true);floor.stationLighting?.(passes[0][1]);restart();
 const environment={renderer:engine.getGlInfo().renderer,canvas:[engine.getRenderWidth(),engine.getRenderHeight()],createdAt:new Date().toISOString(),warmupSeconds:5,measureSeconds:40,sequenceSeconds:[93,113],graphics:'fixed reference',limitations:'Short diagnostic with repeated baseline; not sustained opening acceptance. CPU render submission is not GPU elapsed time.'};
 function update(reason?:string){publish({state,label:passes[index][0],seconds:(performance.now()-start)/1000,rows:[...rows],reason,environment});}
 function finish(reason?:string){if(state==='finished')return;state='finished';stop();floor.stationLighting?.(restore);floor.benchmark?.(false);update(reason);}
 const pre=scene.onBeforeRenderObservable.add(()=>{before=performance.now();drawStart=engine._drawCalls.current;});
 const post=scene.onAfterRenderObservable.add(()=>{
  if(state==='finished')return;const now=performance.now();
  if(engine.getRenderWidth()!==1280||engine.getRenderHeight()!==720){finish('Canvas size changed');return;}
  if(state==='warming'&&now-start>=5000){state='measuring';start=now;last=0;samples=[];renderTotal=0;draws=0;restart();}
  if(state==='measuring'){
   if(last){samples.push(now-last);renderTotal+=now-before;const current=engine._drawCalls.current;draws+=current>=drawStart?current-drawStart:current;}last=now;
   if(now-start>=40000){const sorted=[...samples].sort((a,b)=>a-b),total=samples.reduce((a,b)=>a+b,0);rows.push({label:passes[index][0],mode:passes[index][1],frames:samples.length,fps:1000*samples.length/total,p95Ms:percentile(sorted,.95),p99Ms:percentile(sorted,.99),stalls:samples.filter(x=>x>100).length,renderMeanMs:renderTotal/samples.length,drawsMean:draws/samples.length});
    if(index===passes.length-1){finish();return;}index++;state='warming';start=now;floor.stationLighting?.(passes[index][1]);restart();
   }
  }
  if(view().tick>=2260)restart();
  if(now-lastPublish>1000){lastPublish=now;update();}
 });
 const hidden=()=>{if(document.hidden)finish('Page hidden during comparison');},lost=()=>finish('WebGL context lost');
 const intersection=new IntersectionObserver(e=>{if(!e[0]?.isIntersecting)finish('Scene scrolled offscreen');});intersection.observe(canvas);
 const unsubscribe=subscribeGraphics(()=>finish('Graphics settings changed'));document.addEventListener('visibilitychange',hidden);canvas.addEventListener('webglcontextlost',lost);update();
 return {cancel:()=>finish('Cancelled'),dispose(){scene.onBeforeRenderObservable.remove(pre);scene.onAfterRenderObservable.remove(post);intersection.disconnect();unsubscribe();document.removeEventListener('visibilitychange',hidden);canvas.removeEventListener('webglcontextlost',lost);}};
}
