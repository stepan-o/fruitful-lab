import geom from './geometry.json';
import score from './score.json';
import {segmentBoxDistanceSquared,simultaneousDistanceSquared,NAVIGATION_ROOT_RADIUS_MM,NAVIGATION_ROOT_SEPARATION_MM} from '../encounters/arrival-navigation';
import type {Point,World,EncounterZone} from '../encounters/contract';

export {geom,score};
export const mm=(p:readonly number[]):Point=>[Math.round(p[0]*1000),Math.round(p[1]*1000)];
export const distance=(a:Point,b:Point)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
export const tickAt=(world:number)=>Math.round((world-score.start)*20);
export const lastTick=tickAt(score.end);
export const worldAt=(tick:number)=>score.start+tick/20;
export function editAt(time:number) {
  return Math.max(0,Math.min(score.duration,time-score.start-score.cuts.reduce((n,c)=>n+Math.max(0,Math.min(time,c.to)-c.at),0)));
}
export function editTick(seconds:number) {
  let world=score.start+seconds;
  for(const cut of score.cuts) if(seconds>=editAt(cut.at)-1e-9)world+=cut.to-cut.at;
  return Math.min(lastTick,tickAt(world));
}
type Rect={x:number;y:number;w:number;h:number};
const rectBounds=(r:Rect)=>({minX:r.x*1000,maxX:(r.x+r.w)*1000,minY:r.y*1000,maxY:(r.y+r.h)*1000});
const obstacles=[...geom.fixtures.filter(f=>f.kind!=='drain').map(f=>f.rect),...geom.walls,...geom.forgeHall.installations.map(f=>f.rect),...geom.forgeHall.columns,...geom.portals.filter(p=>p.initialAccess==='locked'||p.kind==='freight').map(p=>p.rect),...['L2','L3','D1','D2','D3'].flatMap(id=>geom.roomObjects[id as keyof typeof geom.roomObjects])].map(rectBounds);
export function roomAt(p:Point):EncounterZone {
  const x=p[0]/1000,y=p[1]/1000;
  for(const zone of geom.zones){
    let inside=false;
    for(let i=0,j=zone.polygon.length-1;i<zone.polygon.length;j=i++){
      const [ax,ay]=zone.polygon[i],[bx,by]=zone.polygon[j];
      if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
    }
    if(inside)return zone.id as EncounterZone;
  }
  return 'outside';
}
export function gateLength(t:number,enabled:boolean) {
  const span=score.gate.openings.find(([start,,,closed])=>t>=start&&t<closed);
  if(!enabled||!span)return geom.gate.length;
  const [start,opened,release,closed]=span;
  const fraction=t<opened?(t-start)/(opened-start):t<release?1:(closed-t)/(closed-release);
  return geom.gate.length*Math.cos(fraction*Math.PI/2);
}
export type Route={trackId?:string;cursor:number;elapsed:number;walked:number;facing:string;moving:boolean};
const tracks:Record<string,{t:number;p:number[]}[]>=score.tracks;
export function startRoutes():Record<string,Route>{
  return Object.fromEntries(Object.keys(tracks).sort().map(id=>[id,{cursor:0,elapsed:0,walked:0,facing:'S',moving:false}]));
}
function clear(a:Point,b:Point,r:ReturnType<typeof rectBounds>){
  const radius=NAVIGATION_ROOT_RADIUS_MM-1; // sub-mm authored metres round to integer roots
  return Math.min(a[0],b[0])-radius>r.maxX||Math.max(a[0],b[0])+radius<r.minX||
    Math.min(a[1],b[1])-radius>r.maxY||Math.max(a[1],b[1])+radius<r.minY||segmentBoxDistanceSquared(a,b,r)>=radius**2;
}
// Agents follow authored legs with local route clocks. A blocked step earns no travel.
export function moveCast(world:World,routes:Record<string,Route>,gate:number,standing:Point[] = [], castTracks=tracks) {
  const pending=new Map<string,{to:Point;cursor:number}>();
  const gateBox=rectBounds({x:geom.gate.hinge[0],y:geom.gate.hinge[1],w:gate,h:0});
  for(const [id,r] of Object.entries(routes)){
    const actor=world.agents[id],keys=castTracks[r.trackId??id],t=worldAt(r.elapsed+1);
    let cursor=r.cursor;
    while(cursor+1<keys.length&&keys[cursor+1].t<=t)cursor++;
    const a=keys[cursor],b=keys[cursor+1];
    const f=b?Math.max(0,Math.min(1,(t-a.t)/(b.t-a.t))):0;
    const to=mm(b?[a.p[0]+f*(b.p[0]-a.p[0]),a.p[1]+f*(b.p[1]-a.p[1])]:a.p);
    r.moving=false;
    if(world.facts['blocked.'+id]||distance(actor.position,to)>650)continue;
    if(distance(actor.position,to)>0&&(!clear(actor.position,to,gateBox)||!obstacles.every(rect=>clear(actor.position,to,rect))))continue;
    if(standing.some(p=>simultaneousDistanceSquared(actor.position,to,p,p)<(NAVIGATION_ROOT_SEPARATION_MM-2)**2))continue;
    pending.set(id,{to,cursor});
  }
  // Removing a move can invalidate its follower. Resolve until the batch is safe.
  let changed=true;
  const ids=Object.keys(routes);
  while(changed){
    changed=false;
    for(let i=0;i<ids.length;i++)for(let j=0;j<i;j++){
      const id=ids[i],other=ids[j],a=world.agents[id].position,b=world.agents[other].position;
      if(!pending.has(id)&&!pending.has(other))continue;
      if(simultaneousDistanceSquared(a,pending.get(id)?.to??a,b,pending.get(other)?.to??b)<(NAVIGATION_ROOT_SEPARATION_MM-2)**2){
        changed=pending.delete(id)||changed;changed=pending.delete(other)||changed;
      }
    }
  }
  for(const [id,{to,cursor}] of pending){
    const actor=world.agents[id],from=actor.position,r=routes[id],d=distance(from,to);
    r.elapsed++;r.cursor=cursor;r.walked+=Math.round(d);r.moving=d>0;
    if(d){const dx=to[0]-from[0],dy=to[1]-from[1];r.facing=Math.abs(dx)>Math.abs(dy)?(dx>0?'E':'W'):(dy>0?'S':'N');actor.position=to;actor.room=roomAt(to);}
  }
}
export function audible(a:{position:Point},b:{position:Point},shout=false){
  if(distance(a.position,b.position)>(shout?26000:10500))return false;
  return geom.walls.every(w=>segmentBoxDistanceSquared(a.position,b.position,rectBounds(w))>0);
}
