export type ActorId = "bob" | "ed";
export type Cell = readonly [number, number];
export type Command = "left" | "right" | "up" | "down" | "claim" | "release" | "give" | "start" | "tick" | "cancel";
export type Intent = {id:string; actor:ActorId; command:Command};
export type Receipt = {id:string; accepted:boolean; text:string};
export type MiniWorld = {
 positions:Record<ActorId,Cell>; card:ActorId; reserved:ActorId|null;
 active:{actor:ActorId;remaining:number}|null; made:Record<ActorId,number>;
 tick:number; seen:string[]; receipts:Receipt[];
};
export const actors:ActorId[]=["bob","ed"];
export const control:Cell=[3,1];
export const walls:Cell[]=[[2,0],[2,2],[4,1]];
export const same=(a:Cell,b:Cell)=>a[0]===b[0]&&a[1]===b[1];
export const adjacent=(a:Cell,b:Cell)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1;
export function initialWorld():MiniWorld{return {positions:{bob:[0,1],ed:[0,2]},card:"bob",reserved:null,active:null,made:{bob:0,ed:0},tick:0,seen:[],receipts:[]};}
export function ready(s:MiniWorld,actor:ActorId):string|null{
 if(!same(s.positions[actor],control))return "The operator must stand at the brass control tile.";
 if(s.card!==actor)return "The operator does not hold the access card.";
 if(s.reserved!==actor)return "The operator does not own the station reservation.";
 if(s.made[actor])return "This operator has already made their workpiece.";
 return null;
}
/** Intent is a request. This transition owns occupancy, custody and output. */
export function transition(world:MiniWorld,intent:Intent):MiniWorld{
 if(world.seen.includes(intent.id))return world;
 const s:MiniWorld={...world,positions:{...world.positions},made:{...world.made},active:world.active?{...world.active}:null,seen:[...world.seen,intent.id],receipts:[...world.receipts]};
 const {actor,command}=intent,other:ActorId=actor==="bob"?"ed":"bob";
 const finish=(accepted:boolean,text:string)=>{s.receipts.push({id:intent.id,accepted,text});return s;};
 const directions:Partial<Record<Command,Cell>>={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]};
 const delta=directions[command];
 if(delta){
  const pos=s.positions[actor],next:Cell=[pos[0]+delta[0],pos[1]+delta[1]];
  if(next[0]<0||next[0]>4||next[1]<0||next[1]>2||walls.some(cell=>same(cell,next)))return finish(false,"A wall or machine blocks that step.");
  if(same(s.positions[other],next))return finish(false,"That tile is occupied. The other worker must move first.");
  s.positions[actor]=next;return finish(true,actor+" moved. Any reservation remains theirs until released.");
 }
 if(command==="give"){
  if(s.card!==actor)return finish(false,"Only the current holder can pass the card.");
  if(!adjacent(s.positions[actor],s.positions[other]))return finish(false,"The workers must be next to each other to pass the card.");
  s.card=other;return finish(true,actor+" passed the card to "+other+".");
 }
 if(command==="claim"){
  if(!same(s.positions[actor],control))return finish(false,"Reach the brass control tile before claiming the press.");
  if(s.card!==actor)return finish(false,"The access card is required to claim the press.");
  if(s.reserved&&s.reserved!==actor)return finish(false,"The other worker still owns the press reservation.");
  s.reserved=actor;return finish(true,actor+" reserved the press.");
 }
 if(command==="release"){
  if(s.reserved!==actor)return finish(false,"This worker has no reservation to release.");
  if(s.active)return finish(false,"Finish or cancel the active cycle before releasing the press.");
  s.reserved=null;return finish(true,actor+" released the press.");
 }
 if(command==="start"){
  if(s.active)return finish(false,"A cycle is already in progress.");
  const reason=ready(s,actor);if(reason)return finish(false,reason);
  s.active={actor,remaining:2};return finish(true,actor+" began a two-beat cycle. Nothing has been delivered yet.");
 }
 if(command==="cancel"){
  if(!s.active||s.active.actor!==actor)return finish(false,"Only the active operator can cancel their cycle.");
  s.active=null;return finish(true,"The cycle was cancelled. No output was awarded; the reservation remains.");
 }
 if(command==="tick"){
  s.tick++;
  if(!s.active)return finish(true,"One simulation beat passed. The press is idle.");
  const reason=ready(s,s.active.actor);
  if(reason){s.active=null;return finish(false,"Cycle interrupted: "+reason+" No output was awarded.");}
  s.active.remaining--;
  if(s.active.remaining>0)return finish(true,"The press is halfway through its cycle.");
  const operator=s.active.actor;s.made[operator]++;s.active=null;
  return finish(true,operator+" completed a workpiece. Release the press to hand it over.");
 }
 return finish(false,"Unknown command.");
}
