/** Frozen workload and acceptance rules. No renderer or browser dependency. */
export const ACCEPTANCE = {
 version:'room-crowd-1', workers:24, supervisors:2, width:1280, height:720,
 warmupMs:30000, durationMs:600000, segmentMs:20000,
 minFps:30, maxP95Ms:1000/30, maxP99Ms:1000/15,
 maxStalls100:6, maxFrameMs:500, maxResponseMs:200,
} as const;
export type Resources={meshes:number;materials:number;textures:number;skeletons:number;geometries:number;animationGroups:number};
export function frameStats(values:readonly number[]){
 const sorted=[...values].sort((a,b)=>a-b),total=values.reduce((sum,v)=>sum+v,0);
 const p=(n:number)=>sorted.length?sorted[Math.ceil(sorted.length*n)-1]:0;
 return {samples:values.length,elapsedMs:total,fps:total?1000*values.length/total:0,p50Ms:p(.5),p95Ms:p(.95),p99Ms:p(.99),maxMs:sorted.at(-1)??0,stallsOver100:values.filter(v=>v>100).length};
}
export function createAcceptanceRecorder(){
 const intervals:number[]=[],segments:number[][]=Array.from({length:30},()=>[]),switches:number[]=[],inputs:number[]=[];
 let previous:number|null=null,elapsed=0;
 return {
  frame(now:number){if(previous!==null&&now>previous){const dt=now-previous;intervals.push(dt);segments[Math.min(29,Math.floor(elapsed/ACCEPTANCE.segmentMs))].push(dt);elapsed+=dt;}previous=now;},
  switchResponse(ms:number){switches.push(ms);},inputResponse(ms:number){inputs.push(ms);},
  result(baseline:Resources,end:Resources,reason:string|null,contextLosses:number){
   const frames=frameStats(intervals),phases=segments.map((v,i)=>({index:i,room:i%6<3?'security':'conveyor',angle:i%3,...frameStats(v)}));
   const growth=Object.fromEntries(Object.keys(baseline).map(k=>[k,end[k as keyof Resources]-baseline[k as keyof Resources]]));
   const complete=elapsed>=ACCEPTANCE.durationMs&&intervals.length>0&&!reason;
   const checks={complete,frameRate:frames.fps>=ACCEPTANCE.minFps,frameP95:frames.p95Ms<=ACCEPTANCE.maxP95Ms,frameP99:frames.p99Ms<=ACCEPTANCE.maxP99Ms,
    everyAngle:phases.every(p=>p.samples>0&&p.p95Ms<=ACCEPTANCE.maxP95Ms),stalls:frames.stallsOver100<=ACCEPTANCE.maxStalls100&&frames.maxMs<=ACCEPTANCE.maxFrameMs,
    switches:switches.length===29&&Math.max(...switches)<=ACCEPTANCE.maxResponseMs,
    input:inputs.length>0&&Math.max(...inputs)<=ACCEPTANCE.maxResponseMs,
    resources:Object.values(growth).every(v=>v<=0),context:contextLosses===0};
   return {version:ACCEPTANCE.version,status:!complete?'INVALID':Object.values(checks).every(Boolean)?'PASS':'FAIL',reason,checks,frames,phases,
    switchResponseMs:switches,inputResponseMs:inputs,contextLosses,resources:{baseline,end,growth}};
  },
 };
}

export type AcceptanceResult = ReturnType<ReturnType<typeof createAcceptanceRecorder>['result']>;
