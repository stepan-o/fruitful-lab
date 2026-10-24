import type {DayOneState} from '../encounters/day-one-state';
import {ACCEPTANCE,frameStats,type Resources} from './acceptance';
export const OPENING_ACCEPTANCE={version:'opening-scene-6',warmupMs:30000,durationMs:600000,width:1280,height:720,workers:10,supervisors:2} as const;
export const OPENING_SHOTS=['approach','limen-emphasis','workers-reverse','impact','card','passage','threshold','checkpoint','sam-inspection','aftermath','conveyor-entrance','conveyor-wide','intake','wash','belt','forge','doorway-pressure','security-check-reverse'] as const;
export const CONVEYOR_ACCEPTANCE={...OPENING_ACCEPTANCE,version:'conveyor-room-1'} as const;
export function dayOneWorkload(actionTicks:number,manualControls:number,requiredShots:readonly string[]){
 if(!Number.isSafeInteger(actionTicks)||actionTicks<=0||!Number.isSafeInteger(manualControls)||manualControls<1||!requiredShots.length)throw Error('Invalid Day 1 workload');
 const controlDwellMs=2000,nightDwellMs=5000,episodes=2,durationMs=episodes*(actionTicks*50+manualControls*controlDwellMs+nightDwellMs);
 return {...OPENING_ACCEPTANCE,version:'day-one-2',actionTicks,manualControls,requiredShots:[...new Set(requiredShots)],controlDwellMs,nightDwellMs,episodes,durationMs,maxActualStartMs:OPENING_ACCEPTANCE.warmupMs+durationMs+120000};
}
export type DayOneWorkload=ReturnType<typeof dayOneWorkload>;
export const DAY_ONE_ACCEPTANCE=dayOneWorkload(14680,6,OPENING_SHOTS);
export const STAFFED_ACCEPTANCE={...OPENING_ACCEPTANCE,version:'staffed-line-1'} as const;
export type OpeningScope='opening'|'conveyor'|'day-one'|'staffed';
export const CONVEYOR_SHOTS=['conveyor-wide','intake','wash','belt','forge'] as const;
/** The real opening repeats with its own camera cuts, navigation and speech. */
export function createOpeningRecorder(scope:OpeningScope='opening',workload:DayOneWorkload=DAY_ONE_ACCEPTANCE){
 const protocol=scope==='day-one'?workload:scope==='staffed'?STAFFED_ACCEPTANCE:scope==='conveyor'?CONVEYOR_ACCEPTANCE:OPENING_ACCEPTANCE,requiredShots=scope==='conveyor'||scope==='staffed'?CONVEYOR_SHOTS:scope==='day-one'?workload.requiredShots:OPENING_SHOTS;
 const dayFrames=new Map<string,number[]>();let staffingValid=true;
 const stalls:{atMs:number;durationMs:number;shot:string;phase:string}[]=[],frames:number[]=[],shots=new Map<string,number[]>(),inputs:number[]=[];let previous:number|null=null,elapsed=0;
 return {
  frame(now:number,shot:string,phase='',day?:DayOneState){if(scope==='staffed'&&(!day||day.crew!==8||Object.values(day.stationOperators).filter(Boolean).length!==4))staffingValid=false;if(previous!==null&&now>previous){const dt=now-previous;frames.push(dt);if(day){const samples=dayFrames.get(day.stage)??[];samples.push(dt);dayFrames.set(day.stage,samples);}const values=shots.get(shot)??[];values.push(dt);shots.set(shot,values);elapsed+=dt;if(dt>100&&stalls.length<128)stalls.push({atMs:elapsed,durationMs:dt,shot,phase});}previous=now;},
  probe(ms:number){inputs.push(ms);},
  result(baseline:Resources,end:Resources,runs:number,reason:string|null){
   const stats=frameStats(frames),byShot=Object.fromEntries([...shots].map(([name,v])=>[name,frameStats(v)]));
   const growth=Object.fromEntries(Object.keys(baseline).map(k=>[k,end[k as keyof Resources]-baseline[k as keyof Resources]]));
   const complete=elapsed>=protocol.durationMs&&!reason;
   const byDayStage=Object.fromEntries([...dayFrames].map(([key,frames])=>[key,frameStats(frames)]));
   const checks={complete,fullDayStages:scope!=='day-one'||['entry','tutorial','staffing','production','output','departure','night'].every(s=>byDayStage[s]?.samples>0),stageCadence:scope!=='day-one'||Object.values(byDayStage).every(s=>s.p95Ms<=ACCEPTANCE.maxP95Ms),staffed:scope!=='staffed'||staffingValid,episodes:runs>=2,allShots:requiredShots.every(s=>byShot[s]?.samples>0),frameRate:stats.fps>=ACCEPTANCE.minFps,frameP95:stats.p95Ms<=ACCEPTANCE.maxP95Ms,frameP99:stats.p99Ms<=ACCEPTANCE.maxP99Ms,everyShot:Object.values(byShot).every(s=>s.p95Ms<=ACCEPTANCE.maxP95Ms),stalls:stats.stallsOver100<=ACCEPTANCE.maxStalls100&&stats.maxMs<=ACCEPTANCE.maxFrameMs,input:inputs.length>0&&Math.max(...inputs)<=ACCEPTANCE.maxResponseMs,resources:Object.values(growth).every(v=>v<=0)};
   return {version:protocol.version,status:!complete?'INVALID':Object.values(checks).every(Boolean)?'PASS':'FAIL',reason,checks,stallEvents:stalls,frames:stats,shots:byShot,dayStages:byDayStage,inputResponseMs:inputs,completedEpisodes:runs,resources:{baseline,end,growth}};
  }
 };
}
