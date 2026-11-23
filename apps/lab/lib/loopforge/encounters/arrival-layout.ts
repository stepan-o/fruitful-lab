import {navigationConflict} from './arrival-navigation';
import {ARRIVAL_ROOM_FIXTURES,SECURITY_DESKS,SECURITY_INTERACTION,type ArrivalRoomFixture} from '../rooms/arrival-room-layout';
import {CONVEYOR_ROOM_FIXTURES} from '../rooms/conveyor-room-layout';
import type {Point,SpatialServices,World,EncounterZone} from './contract';
import type {Rect} from '../spatial/floor';
import {contains} from '../spatial/floor';
/** Compact first-day rehearsal layout. This does not silently relocate the full-floor Dispatch.
 * Both navigation and construction consume these bounds; production can select this layout. */
export const ARRIVAL_LAYOUT = {
 id:'day-one-lobby-security/8',
 rooms:[{id:'lobby',rect:{x:116,y:111,w:16,h:33}},{id:'security',rect:{x:116,y:99,w:16,h:12}},{id:'conveyor',rect:{x:132,y:98,w:24,h:14}}] as const,
 portal:{id:'lobby-security',a:'lobby',b:'security',axis:111,min:122,max:126},
 anchor:[124,113.8] as const,
 mainEntry:{axis:122,min:120.5,max:127.5},
} as const;
export const CONVEYOR_STATIONS=[{id:'intake',name:'INTAKE',x:136.5},{id:'wash',name:'WASH',x:140.5},{id:'belt',name:'MAIN BELT',x:144.5},{id:'forge',name:'LATTICE FORGE',x:148.5}] as const;
export type ConveyorStation=typeof CONVEYOR_STATIONS[number]['id'];
export function conveyorControl(id:ConveyorStation):Point{const s=CONVEYOR_STATIONS.find(s=>s.id===id)!;return [s.x*1000,105800];}
export function conveyorDirector(id:ConveyorStation):Point{const s=CONVEYOR_STATIONS.find(s=>s.id===id)!;return [(s.x+1.8)*1000,107200];}
/** These fixture bounds belong to the world, so navigation and scenery agree. */
export const ARRIVAL_EQUIPMENT:readonly ArrivalRoomFixture[]=[
 ...CONVEYOR_ROOM_FIXTURES,
 ...ARRIVAL_ROOM_FIXTURES,
 ...SECURITY_DESKS.map(d=>({id:d.id,room:'security' as const,kind:'records-bank' as const,name:d.name,footprint:{x:d.center[0]-.85,y:d.center[1]-.55,w:1.7,h:1.1},height:1.3,operator:{x:d.root[0],y:d.root[1]}})),
 ...CONVEYOR_STATIONS.map(s=>({id:s.id,room:'conveyor' as const,kind:'control' as const,name:s.name,footprint:{x:s.x-1.6,y:s.id==='forge'?99.8:100.8,w:3.2,h:s.id==='forge'?5.6:4.6},height:2.8,operator:{x:conveyorControl(s.id)[0]/1000,y:conveyorControl(s.id)[1]/1000}})),
];
export function arrivalRoom(point:Point):EncounterZone|undefined{if(point[1]>=144000&&point[1]<=150000&&point[0]>=120000&&point[0]<=129000)return 'outside';return ARRIVAL_LAYOUT.rooms.find(r=>contains(r.rect as Rect,{x:point[0]/1000,y:point[1]/1000}))?.id;}
export function crossesArrivalDoor(from:Point,to:Point){
 const door=ARRIVAL_LAYOUT.portal,ay=from[1]/1000,by=to[1]/1000;
 if((ay<door.axis)===(by<door.axis))return false;
 const x=(from[0]+(to[0]-from[0])*(door.axis-ay)/(by-ay))/1000;
 return x>=door.min+.4&&x<=door.max-.4;
}
export const arrivalSpace:SpatialServices={
 canTraverseBatch(moves,world){return navigationConflict(moves,world,ARRIVAL_EQUIPMENT)===null;},
 connected(a,b){return a!==b&&(((a==='outside'&&b==='lobby')||(b==='outside'&&a==='lobby'))||(a==='security'&&['lobby','conveyor'].includes(b))||(b==='security'&&['lobby','conveyor'].includes(a)));},
 roomAt:arrivalRoom,
 canTraverse(agent,to,world){
  const destination=arrivalRoom(to);if(!destination||!to.every(Number.isFinite))return false;
  if(agent.id!=='stiletto'&&world.facts['security.connector-reserved']===true&&Math.min(agent.position[0],to[0])<132000&&Math.max(agent.position[0],to[0])>=128000&&Math.min(agent.position[1],to[1])<=106000&&Math.max(agent.position[1],to[1])>=103500)return false;
  if(ARRIVAL_EQUIPMENT.some(e=>contains(e.footprint,{x:to[0]/1000,y:to[1]/1000})))return false;
  if(destination!==agent.room){
   if([destination,agent.room].includes('outside')){
    if(![destination,agent.room].includes('lobby')||world.facts['day.stage']!=='departure')return false;
   }else if([destination,agent.room].includes('lobby')){
    if(!crossesArrivalDoor(agent.position,to))return false;
    if(agent.character==='worker'&&world.facts[`checkpoint.cleared.${agent.id}`]!==true&&world.facts['portal.lobby-security.open']!==true)return false;
   }else{
    const from=agent.position,axis=132000,ratio=(axis-from[0])/(to[0]-from[0]),y=from[1]+(to[1]-from[1])*ratio;
    if(!Number.isFinite(ratio)||ratio<0||ratio>1||y<SECURITY_INTERACTION.conveyorAperture.minY*1000||y>SECURITY_INTERACTION.conveyorAperture.maxY*1000)return false;
   }
  }
  return Object.values(world.agents).every(other=>other.id===agent.id||world.facts[`day.departed.${other.id}`]===true||Math.hypot(other.position[0]-to[0],other.position[1]-to[1])>=850);
 },
 canHear(speaker,listener,world,channel='local'){
  const distance=Math.hypot(speaker.position[0]-listener.position[0],speaker.position[1]-listener.position[1]);
  if(speaker.room===listener.room)return distance<=(channel==='shout'?18000:6000);
  // Admission is blocked by LIMEN, not an acoustically closed door.
  return world.facts['portal.lobby-security.audible']===true&&distance<=(channel==='shout'?18000:6000)&&crossesArrivalDoor(speaker.position,listener.position);
 }
};
export function arrivalWaiting(world:World){return Object.keys(world.agents).filter(id=>world.agents[id].character==='worker').every(id=>world.facts[`queue.${id}.settled`]===true);}
