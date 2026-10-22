import type {EquipmentPlacement} from '../spatial/equipment';
import type {Point,SpatialServices,World} from './contract';
import type {ZoneId,Rect} from '../spatial/floor';
import {contains} from '../spatial/floor';
/** Compact first-day rehearsal layout. This does not silently relocate the full-floor Dispatch.
 * Both navigation and construction consume these bounds; production can select this layout. */
export const ARRIVAL_LAYOUT = {
 id:'day-one-lobby-security/3',
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
export const ARRIVAL_EQUIPMENT:readonly EquipmentPlacement[]=[
 {id:'security-register',room:'security',kind:'records-bank',name:'Admission register',footprint:{x:117.5,y:100,w:3,h:3.5},height:2.8,operator:{x:119.2,y:105.5}},
 {id:'security-trays',room:'security',kind:'records-bank',name:'ID sorting desk',footprint:{x:127.5,y:100,w:3,h:3.5},height:2.8,operator:{x:129,y:105.5}},
 ...CONVEYOR_STATIONS.map(s=>({id:s.id,room:'conveyor' as const,kind:'control' as const,name:s.name,footprint:{x:s.x-1.6,y:100.8,w:3.2,h:4.6},height:2.8,operator:{x:conveyorControl(s.id)[0]/1000,y:conveyorControl(s.id)[1]/1000}})),
];
export function arrivalRoom(point:Point):ZoneId|undefined{return ARRIVAL_LAYOUT.rooms.find(r=>contains(r.rect as Rect,{x:point[0]/1000,y:point[1]/1000}))?.id;}
export function crossesArrivalDoor(from:Point,to:Point){
 const door=ARRIVAL_LAYOUT.portal,ay=from[1]/1000,by=to[1]/1000;
 if((ay<door.axis)===(by<door.axis))return false;
 const x=(from[0]+(to[0]-from[0])*(door.axis-ay)/(by-ay))/1000;
 return x>=door.min+.4&&x<=door.max-.4;
}
export const arrivalSpace:SpatialServices={
 connected(a,b){return a!==b&&((a==='security'&&['lobby','conveyor'].includes(b))||(b==='security'&&['lobby','conveyor'].includes(a)));},
 roomAt:arrivalRoom,
 canTraverse(agent,to,world){
  const destination=arrivalRoom(to);if(!destination||!to.every(Number.isFinite))return false;
  if(ARRIVAL_EQUIPMENT.some(e=>contains(e.footprint,{x:to[0]/1000,y:to[1]/1000})))return false;
  if(destination!==agent.room){
   if([destination,agent.room].includes('lobby')){
    if(!crossesArrivalDoor(agent.position,to))return false;
    if(agent.character==='worker'&&world.facts[`checkpoint.cleared.${agent.id}`]!==true&&world.facts['portal.lobby-security.open']!==true)return false;
   }else{
    const from=agent.position,axis=132000,ratio=(axis-from[0])/(to[0]-from[0]),y=from[1]+(to[1]-from[1])*ratio;
    if(!Number.isFinite(ratio)||ratio<0||ratio>1||y<102000||y>106000)return false;
   }
  }
  return Object.values(world.agents).every(other=>other.id===agent.id||Math.hypot(other.position[0]-to[0],other.position[1]-to[1])>=850);
 },
 canHear(speaker,listener,world,channel='local'){
  const distance=Math.hypot(speaker.position[0]-listener.position[0],speaker.position[1]-listener.position[1]);
  if(speaker.room===listener.room)return distance<=(channel==='shout'?18000:6000);
  // Admission is blocked by LIMEN, not an acoustically closed door.
  return world.facts['portal.lobby-security.audible']===true&&distance<=(channel==='shout'?18000:6000)&&crossesArrivalDoor(speaker.position,listener.position);
 }
};
export function arrivalWaiting(world:World){return Object.keys(world.agents).filter(id=>world.agents[id].character==='worker').every(id=>world.facts[`queue.${id}.settled`]===true);}
