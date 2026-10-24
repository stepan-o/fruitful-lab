import {ACCEPTANCE,frameStats,type Resources} from './acceptance';
export const OPENING_ACCEPTANCE={version:'opening-scene-4',warmupMs:30000,durationMs:600000,width:1280,height:720,workers:10,supervisors:2} as const;
export const OPENING_SHOTS=['approach','assembly','impact','card','passage','threshold','checkpoint','aftermath','conveyor-wide','intake','wash','belt','forge'] as const;
/** The real opening repeats with its own camera cuts, navigation and speech. */
export function createOpeningRecorder(){
 const stalls:{atMs:number;durationMs:number;shot:string;phase:string}[]=[],frames:number[]=[],shots=new Map<string,number[]>(),inputs:number[]=[];let previous:number|null=null,elapsed=0;
 return {
  frame(now:number,shot:string,phase=''){if(previous!==null&&now>previous){const dt=now-previous;frames.push(dt);const values=shots.get(shot)??[];values.push(dt);shots.set(shot,values);elapsed+=dt;if(dt>100&&stalls.length<128)stalls.push({atMs:elapsed,durationMs:dt,shot,phase});}previous=now;},
  probe(ms:number){inputs.push(ms);},
  result(baseline:Resources,end:Resources,runs:number,reason:string|null){
   const stats=frameStats(frames),byShot=Object.fromEntries([...shots].map(([name,v])=>[name,frameStats(v)]));
   const growth=Object.fromEntries(Object.keys(baseline).map(k=>[k,end[k as keyof Resources]-baseline[k as keyof Resources]]));
   const complete=elapsed>=OPENING_ACCEPTANCE.durationMs&&!reason;
   const checks={complete,episodes:runs>=2,allShots:OPENING_SHOTS.every(s=>byShot[s]?.samples>0),frameRate:stats.fps>=ACCEPTANCE.minFps,frameP95:stats.p95Ms<=ACCEPTANCE.maxP95Ms,frameP99:stats.p99Ms<=ACCEPTANCE.maxP99Ms,everyShot:Object.values(byShot).every(s=>s.p95Ms<=ACCEPTANCE.maxP95Ms),stalls:stats.stallsOver100<=ACCEPTANCE.maxStalls100&&stats.maxMs<=ACCEPTANCE.maxFrameMs,input:inputs.length>0&&Math.max(...inputs)<=ACCEPTANCE.maxResponseMs,resources:Object.values(growth).every(v=>v<=0)};
   return {version:OPENING_ACCEPTANCE.version,status:!complete?'INVALID':Object.values(checks).every(Boolean)?'PASS':'FAIL',reason,checks,stallEvents:stalls,frames:stats,shots:byShot,inputResponseMs:inputs,completedEpisodes:runs,resources:{baseline,end,growth}};
  }
 };
}
