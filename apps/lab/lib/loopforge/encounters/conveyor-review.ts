import type {Registry} from './contract';
/** Replay the actual opening state, then bound review to the room's tutorial.
 * This is not an alternate scenario or a workaround for missing Security motion. */
export function conveyorReviewRange(registry:Registry){
 let tick=1,startTick:number|undefined,endTick:number|undefined;
 for(const action of Object.values(registry))for(const phase of action.phases){
  if(phase.id==='One worker for a whole line')startTick=tick;
  if(phase.id==='sam’s card is checked')endTick=tick-1;
  tick+=phase.ticks;
 }
 if(startTick===undefined||endTick===undefined||endTick<=startTick)throw new Error('Conveyor review boundaries do not match this episode.');
 return {startTick,endTick};
}

export function staffedReviewRange(registry:Registry){
 let tick=1,startTick:number|undefined,endTick:number|undefined;
 for(const action of Object.values(registry)){if(action.id==='staffed-production')startTick=tick;for(const phase of action.phases)tick+=phase.ticks;if(action.id==='staffed-production')endTick=tick-1;}
 if(startTick===undefined||endTick===undefined)throw Error('Staffed production range missing');
 return {startTick,endTick};
}
