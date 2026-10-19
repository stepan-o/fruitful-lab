import type {Point,SpatialServices,World} from './contract';
import type {ZoneId,Rect} from '../spatial/floor';
import {contains} from '../spatial/floor';
/** Compact first-day rehearsal layout. This does not silently relocate the full-floor Dispatch.
 * Both navigation and construction consume these bounds; production can select this layout. */
export const ARRIVAL_LAYOUT = {
 id:'day-one-lobby-security/1',
 rooms:[{id:'lobby',rect:{x:116,y:111,w:16,h:15}},{id:'security',rect:{x:116,y:99,w:16,h:12}}] as const,
 portal:{id:'lobby-security',a:'lobby',b:'security',axis:111,min:122,max:126},
 anchor:[124,113.8] as const,
} as const;
export function arrivalRoom(point:Point):ZoneId|undefined{return ARRIVAL_LAYOUT.rooms.find(r=>contains(r.rect as Rect,{x:point[0]/1000,y:point[1]/1000}))?.id;}
export function crossesArrivalDoor(from:Point,to:Point){
 const door=ARRIVAL_LAYOUT.portal,ay=from[1]/1000,by=to[1]/1000;
 if((ay<door.axis)===(by<door.axis))return false;
 const x=(from[0]+(to[0]-from[0])*(door.axis-ay)/(by-ay))/1000;
 return x>=door.min+.4&&x<=door.max-.4;
}
export const arrivalSpace:SpatialServices={
 connected(a,b){return a!==b&&[a,b].every(r=>r==='lobby'||r==='security');},
 roomAt:arrivalRoom,
 canTraverse(agent,to,world){
  const destination=arrivalRoom(to);if(!destination||!to.every(Number.isFinite))return false;
  if(destination!==agent.room&&(!crossesArrivalDoor(agent.position,to)||world.facts['portal.lobby-security.open']!==true))return false;
  return Object.values(world.agents).every(other=>other.id===agent.id||Math.hypot(other.position[0]-to[0],other.position[1]-to[1])>=850);
 },
 canHear(speaker,listener,world,channel='local'){
  const distance=Math.hypot(speaker.position[0]-listener.position[0],speaker.position[1]-listener.position[1]);
  if(speaker.room===listener.room)return distance<=(channel==='shout'?18000:6000);
  // Admission is blocked by LIMEN, not an acoustically closed door.
  return channel==='shout'&&world.facts['portal.lobby-security.audible']===true&&distance<=18000&&crossesArrivalDoor(speaker.position,listener.position);
 }
};
export function arrivalWaiting(world:World){return Object.keys(world.agents).filter(id=>id!=='limen').every(id=>world.facts[`queue.${id}.settled`]===true);}
