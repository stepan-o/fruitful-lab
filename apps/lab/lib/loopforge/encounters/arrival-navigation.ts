import type {Point,World} from './contract';
import type {ArrivalRoomFixture} from '../rooms/arrival-room-layout';
export type NavigationMove={agent:string;to:Point};
/** Conservative floor-root proxy, not imported body, hand or blade clearance. */
export const NAVIGATION_ROOT_RADIUS_MM=400;
export const NAVIGATION_ROOT_SEPARATION_MM=850;
type Bounds={minX:number;maxX:number;minY:number;maxY:number};
const dot=(a:Point,b:Point)=>a[0]*b[0]+a[1]*b[1];
const difference=(a:Point,b:Point):Point=>[a[0]-b[0],a[1]-b[1]];
function pointSegmentSquared(p:Point,a:Point,b:Point){const v=difference(b,a),w=difference(p,a),n=dot(v,v),t=n?Math.max(0,Math.min(1,dot(w,v)/n)):0;return (w[0]-t*v[0])**2+(w[1]-t*v[1])**2;}
function pointBoxSquared(p:Point,r:Bounds){return Math.max(r.minX-p[0],0,p[0]-r.maxX)**2+Math.max(r.minY-p[1],0,p[1]-r.maxY)**2;}
/** Exact planar segment/AABB distance; rounded corners avoid square-inflation false blocks. */
export function segmentBoxDistanceSquared(a:Point,b:Point,r:Bounds){
 let lo=0,hi=1;
 for(const [axis,min,max] of [[0,r.minX,r.maxX],[1,r.minY,r.maxY]] as const){
  const d=b[axis]-a[axis];if(d===0){if(a[axis]<min||a[axis]>max){lo=2;break;}}
  else{const t1=(min-a[axis])/d,t2=(max-a[axis])/d;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));}
 }
 if(lo<=hi)return 0;
 return Math.min(pointBoxSquared(a,r),pointBoxSquared(b,r),...[[r.minX,r.minY],[r.minX,r.maxY],[r.maxX,r.minY],[r.maxX,r.maxY]].map(p=>pointSegmentSquared([p[0],p[1]],a,b)));
}
/** Same normalized tick/phase interval for both agents, independent of iteration order. */
export function simultaneousDistanceSquared(a0:Point,a1:Point,b0:Point,b1:Point){
 return pointSegmentSquared([0,0],difference(a0,b0),difference(a1,b1));
}
export function navigationConflict(moves:readonly NavigationMove[],world:World,fixtures:readonly ArrivalRoomFixture[]){
 const destinations=new Map<string,Point>();
 for(const move of moves){
  const agent=world.agents[move.agent];
  if(!agent||destinations.has(move.agent)||!move.to.every(Number.isSafeInteger))return {kind:'invalid-move',agent:move.agent};
  destinations.set(move.agent,move.to);
  for(const fixture of fixtures){
   const f=fixture.footprint,r={minX:f.x*1000,maxX:(f.x+f.w)*1000,minY:f.y*1000,maxY:(f.y+f.h)*1000};
   const distanceSquared=segmentBoxDistanceSquared(agent.position,move.to,r);
   if(distanceSquared<NAVIGATION_ROOT_RADIUS_MM**2-1e-6)return {kind:'fixture-sweep',agent:move.agent,fixture:fixture.id,from:agent.position,to:move.to,distanceMM:Math.sqrt(distanceSquared)};
  }
 }
 const agents=Object.values(world.agents).filter(a=>world.facts['day.departed.'+a.id]!==true);
 for(let i=0;i<agents.length;i++)for(let j=i+1;j<agents.length;j++){
  const a=agents[i],b=agents[j];if(!destinations.has(a.id)&&!destinations.has(b.id))continue;
  const distanceSquared=simultaneousDistanceSquared(a.position,destinations.get(a.id)??a.position,b.position,destinations.get(b.id)??b.position);
  if(distanceSquared<NAVIGATION_ROOT_SEPARATION_MM**2-1e-6)return {kind:'actor-sweep',agents:[a.id,b.id],distanceMM:Math.sqrt(distanceSquared),from:[a.position,b.position],to:[destinations.get(a.id)??a.position,destinations.get(b.id)??b.position]};
 }
 return null;
}
