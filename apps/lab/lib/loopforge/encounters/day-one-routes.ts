import type {Effect,Performance,Phase,Point,SceneFraming,World} from './contract';
export type JourneySegment={id:string;to?:Point;ticks:number;effects?:Effect[]};
export type Journey={agent:string;startTick:number;segments:JourneySegment[]};
/** Compile parallel authored paths into shared kernel phases at every path knot.
 * No teleport, collision exemption or presentation-owned state change is introduced. */
export function journeyPhases(world:World,positions:Record<string,Point>,journeys:Journey[],rest:()=>Performance[],framing:SceneFraming):Phase[]{
 const knots=new Set([0]);
 const plans=journeys.map(j=>{let at=j.startTick,from=positions[j.agent];knots.add(at);return {...j,segments:j.segments.map(s=>{const start=at;at+=s.ticks;knots.add(at);const segment={...s,start,end:at,from};from=s.to??from;return segment;})};});
 const times=[...knots].sort((a,b)=>a-b),phases:Phase[]=[];
 for(let i=1;i<times.length;i++){
  const a=times[i-1],b=times[i];if(b===a)continue;const perform=rest(),effects:Effect[]=[];const names:string[]=[];
  for(const j of plans){const s=j.segments.find(s=>s.start<=a&&s.end>a);if(!s)continue;names.push(s.id);
   if(s.to){const f=(b-s.start)/s.ticks,to:Point=[Math.round(s.from[0]+(s.to[0]-s.from[0])*f),Math.round(s.from[1]+(s.to[1]-s.from[1])*f)],character=world.agents[j.agent].character,yaw=(Math.atan2(s.from[0]-s.to[0],s.to[1]-s.from[1])*180/Math.PI+360)%360;
    const motion:Performance={agent:j.agent,motion:j.agent==='bob'?'limp':'walk',to,yaw,cue:{clip:character==='limen'?'Confident_Strut':character==='stiletto'?'Quick_Walk':j.agent==='bob'?'injured_walk':'walking_2_inplace',start:(a-j.startTick)/20,rate:1,loop:true,blend:.2}};
    perform[perform.findIndex(p=>p.agent===j.agent)]=motion;
   }
   if(s.end===b)effects.push(...(s.effects??[]));
  }
  phases.push({id:names.join(' · ')||'The shift waits for its route',ticks:b-a,framing,attention:'flow',perform,...(effects.length?{effects}:{})});
 }
 for(const j of plans){const to=j.segments.filter(s=>s.to).at(-1)?.to;if(to)positions[j.agent]=to;}
 return phases;
}
export function routeSegments(from:Point,points:Point[],prefix:string,speed=1.35):JourneySegment[]{return points.flatMap((to,i)=>{const distance=Math.hypot(to[0]-from[0],to[1]-from[1]);from=to;return distance<1?[]:[{id:`${prefix} / ${i+1}`,to,ticks:Math.max(1,Math.ceil(distance/1000/speed*20))}];});}
