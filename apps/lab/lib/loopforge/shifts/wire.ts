import {canonical,envelope,order} from '../intro/protocol';
import {geom} from '../intro/floor';
import type {Point,Run,Mark} from './contract';
export {canonical,envelope};
export const schema='shift_floor_1';
export const engine='loopforge_shifts_ts';
export function project(s:Run){
  const world={day:s.day,phase:s.phase,start:s.start,lead:s.lead,pace:s.pace,spent:s.spent,quick:s.quick,called:s.called,
    waiting:[...s.queue],status:s.case?.status??'none',caseId:s.case?.id??'',deadline:s.case?.deadline??0,
    report:s.marks.filter(e=>e.day===s.day&&e.kind==='report.received').at(-1)??null,
    pressure:s.pressure,backing:s.backing,coverage:[...s.coverage],completed:[...s.completed],pass:s.pass?{...s.pass}:null,
    shiftOutput:s.pieces.filter(p=>p.status==='rack').length, chat:s.chat};
  const agents=Object.values(s.world.agents).sort((a,b)=>order(a.id,b.id)).map(a=>({
    id:a.id,x:a.position[0],y:a.position[1],room:a.room,duty:s.tasks[a.id]?.duty??'standing',walked:s.tasks[a.id]?.walked??0,
    moving:s.tasks[a.id]?.moving??false,station:s.tasks[a.id]?.station??-1,injured:a.id==='bob'&&s.world.facts['injury.bob']==='limping'}));
  const items=s.pieces.map(p=>({id:p.id,at:[...p.at] as Point,stage:p.stage,status:p.status}));
  for(const [i,id] of s.completed.entries()){
    if(items.some(p=>p.id===id))continue;
    const slot=geom.contact.outputSlots[i%geom.contact.outputSlots.length];
    items.push({id,at:[Math.round(slot[0]*1000),Math.round(slot[1]*1000)],stage:4,status:'rack'});
  }
  items.sort((a,b)=>order(a.id,b.id));
  const events=s.marks.filter(e=>e.day===s.day).slice(-36);
  return {world,agents,items,events};
}
export type Scene=ReturnType<typeof project>;
export type VisibleActor=Scene['agents'][number];
export type Delta={world?:Scene['world'];agents:Scene['agents'];items:Scene['items'];removed:string[];events:Mark[];first:number};
export type Frame={tick:number;hash:string;scene:Scene};
export async function hash(data:unknown){
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(data)));
  return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
}
export function changes(old:Scene,now:Scene):Delta{
  const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
  return {...(same(old.world,now.world)?{}:{world:now.world}),agents:now.agents.filter((a,i)=>!same(old.agents[i],a)),
    items:now.items.filter(i=>!same(old.items.find(x=>i.id===x.id),i)),removed:old.items.filter(i=>!now.items.some(x=>x.id===i.id)).map(i=>i.id),
    events:now.events.filter(e=>e.seq>(old.events.at(-1)?.seq??0)),first:now.events[0]?.seq??0};
}
export function apply(old:Scene,op:Delta):Scene {
  const items=new Map(old.items.map(p=>[p.id,p]));
  for(const id of op.removed)items.delete(id);
  for(const p of op.items)items.set(p.id,p);
  return {world:op.world??old.world,agents:old.agents.map(a=>op.agents.find(n=>n.id===a.id)??a),items:[...items.values()].sort((a,b)=>order(a.id,b.id)),
    events:[...(op.first?old.events.filter(e=>e.seq>=op.first):[]),...op.events]};
}
export async function full(s:Run){
  const state=project(s);return {schema_version:schema,tick:s.tick,step_hash:await hash(state),state};
}
export async function diff(before:Frame,s:Run){
  const state=project(s);return {schema_version:schema,from_tick:before.tick,to_tick:s.tick,prev_step_hash:before.hash,step_hash:await hash(state),ops:changes(before.scene,state)};
}
export async function read(previous:Frame|undefined,type:string,p:Record<string,unknown>):Promise<Frame>{
  if(p.schema_version!==schema)throw Error('Unknown schema');
  let scene:Scene,tick:number;
  if(type==='FULL_SNAPSHOT'){scene=p.state as Scene;tick=Number(p.tick);}
  else{
    if(type!=='FRAME_DIFF'||!previous||p.from_tick!==previous.tick||p.to_tick!==previous.tick+1||p.prev_step_hash!==previous.hash)throw Error('Baseline required');
    scene=apply(previous.scene,p.ops as Delta);tick=Number(p.to_tick);
  }
  const actual=await hash(scene);if(actual!==p.step_hash)throw Error('Public hash mismatch');
  return {tick,scene,hash:actual};
}
