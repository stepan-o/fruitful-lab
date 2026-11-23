import {REFERENCE_GRAPHICS,presetSettings,resolveGraphics,type GraphicsSettings} from '../graphics/settings';
import {frameStats} from './acceptance';
export const COMPARISON={version:'graphics-comparison-1',width:1280,height:720,warmupMs:15000,durationMs:60000,segmentMs:10000} as const;
export type ComparisonCase={id:string;label:string;settings:GraphicsSettings;workers:number;workerPoses:'animated'|'held'};
export const COMPARISON_CASES:readonly ComparisonCase[]=[
 {id:'reference',label:'Reference',settings:REFERENCE_GRAPHICS,workers:24,workerPoses:'animated'},
 {id:'resolution',label:'75% resolution only',settings:{...REFERENCE_GRAPHICS,preset:'custom',resolution:.75},workers:24,workerPoses:'animated'},
 {id:'shadows',label:'Shadows off only',settings:{...REFERENCE_GRAPHICS,preset:'custom',shadows:'off'},workers:24,workerPoses:'animated'},
 {id:'bloom',label:'Glow halo off only',settings:{...REFERENCE_GRAPHICS,preset:'custom',bloom:false},workers:24,workerPoses:'animated'},
 {id:'poses',label:'Worker poses held only',settings:REFERENCE_GRAPHICS,workers:24,workerPoses:'held'},
 {id:'crowd',label:'8 visible workers only',settings:REFERENCE_GRAPHICS,workers:8,workerPoses:'animated'},
 {id:'performance',label:'Performance preset (combined)',settings:presetSettings('performance'),workers:24,workerPoses:'animated'},
 {id:'reference-repeat',label:'Reference repeat / drift check',settings:REFERENCE_GRAPHICS,workers:24,workerPoses:'animated'},
];
/** Freeze automatic resolution before a measurement; preserve the resolved room appearance. */
export function fixedGraphics(settings:GraphicsSettings):GraphicsSettings {
 const q=resolveGraphics(settings,'room');
 return {...settings,preset:'custom',resolution:q.scale,shadows:q.shadows,bloom:q.bloom};
}
export function measureStats(values:readonly number[]){
 if(!values.length)return null;const sorted=[...values].sort((a,b)=>a-b);
 return {samples:values.length,mean:values.reduce((a,b)=>a+b,0)/values.length,p95:sorted[Math.ceil(values.length*.95)-1],max:sorted.at(-1)!};
}
export function createComparisonRecorder(){
 const frames:number[]=[],cpu:number[]=[],gpu:number[]=[],poses:number[]=[],draws:number[]=[],triangles:number[]=[];
 const segments:number[][]=Array.from({length:6},()=>[]);let previous:number|null=null;
 return {
  frame(now:number,elapsed:number,sample:{cpuMs:number;gpuMs:number|null;workerPoseMs:number;drawCalls:number;triangles:number}){
   if(previous!==null&&now>previous){const dt=now-previous;frames.push(dt);segments[Math.min(5,Math.floor(Math.max(0,elapsed-dt)/COMPARISON.segmentMs))].push(dt);}previous=now;
   cpu.push(sample.cpuMs);if(sample.gpuMs!==null&&Number.isFinite(sample.gpuMs)&&sample.gpuMs>0)gpu.push(sample.gpuMs);
   poses.push(sample.workerPoseMs);draws.push(sample.drawCalls);triangles.push(sample.triangles);
  },
  result(){return {frames:frameStats(frames),cpuMs:measureStats(cpu),gpuMs:measureStats(gpu),workerPoseMs:measureStats(poses),drawCalls:measureStats(draws),triangles:measureStats(triangles),angles:segments.map((v,i)=>({room:i<3?'security':'conveyor',angle:i%3+1,...frameStats(v)}))};},
 };
}
export type ComparisonMeasurement=ReturnType<ReturnType<typeof createComparisonRecorder>['result']>;
