/** Shared wire types only. Neither viewer adapter imports a world or a planner. */
export const schema='day_one_1';
export const engine='loopforge_intro_ts';
export const channels=['WORLD','AGENTS','ITEMS','EVENTS'];
export const subscription={stream:'LIVE',channels,diff_policy:'DIFF_ONLY',snapshot_policy:'ON_JOIN',compression:'NONE'};
export const renderSpec={
  coord_system:{units:'WORLD_UNITS',units_per_tile:1000,axis:{x_positive:'EAST',y_positive:'SOUTH'},origin:{x:0,y:0},bounds:{min_x:0,min_y:0,max_x:280000,max_y:200000}},
  projection:{kind:'TOP_DOWN_2D'},z_layer:{meaning:'DRAW_STACK_HINT',stable_across_run:true},
  draw_order:{rooms:['ROOM_ID'],agents:['ROOM_ID','LOCAL_SORT_KEY','AGENT_ID'],items:['ROOM_ID','LOCAL_SORT_KEY','ITEM_ID']},
  local_sort_key:{source:'WORLD_Y',quantization:'Q1E3',direction:'ASC'},asset_resolution:{policy:'MANIFEST_OR_PRIMITIVE_FALLBACK',missing_ref_behavior:'DRAW_PRIMITIVE'}
};
export type Actor={agent_id:string;x:number;y:number;room:string;facing:string;moving:boolean;walked:number;injured:boolean;action:string};
export type Item={item_id:string;x:number;y:number;stage:number;holder:string};
export type Utterance={event_id:string;tick:number;until:number;speaker:string;text:string};
export type PublicWorld={layout:string;gate_mm:number;jammed:boolean;outputs:number};
export type State={world:PublicWorld;agents:Actor[];items:Item[];events:Utterance[]};
export type Op={op:'UPSERT_WORLD';world:PublicWorld}|{op:'UPSERT_AGENT';agent:Actor}|{op:'UPSERT_ITEM';item:Item}|{op:'REMOVE_ITEM';item_id:string}|{op:'APPEND_EVENT';event:Utterance}|{op:'REMOVE_EVENT';event_id:string};
export type Baseline={schema_version:string;tick:number;step_hash:string;state:State};
export type Diff={schema_version:string;from_tick:number;to_tick:number;prev_step_hash:string;step_hash:string;ops:Op[]};
export type Frame={tick:number;hash:string;state:State};
export type Envelope={kvp_version:string;msg_type:string;msg_id:string;sent_at_ms:number;payload:Record<string,unknown>};
export function envelope(type:string,id:number,payload:object):Envelope{
  return {kvp_version:'0.1',msg_type:type,msg_id:'00000000-0000-4000-8000-'+id.toString(16).padStart(12,'0'),sent_at_ms:0,payload:{...payload}};
}
export function validEnvelope(v:unknown):v is Envelope{
  if(!v||typeof v!=='object')return false;
  const e=v as Envelope;
  return e.kvp_version==='0.1'&&typeof e.msg_type==='string'&&typeof e.msg_id==='string'&&!!e.msg_id&&Number.isSafeInteger(e.sent_at_ms)&&!!e.payload&&typeof e.payload==='object'&&!Array.isArray(e.payload);
}
export function quantize(x:number){
  if(!Number.isFinite(x))throw Error('Non-finite wire number');
  return (Math.sign(x)*Math.round(Math.abs(x)*1000))/1000||0;
}
export function canonical(v:unknown):string{
  if(typeof v==='number')return JSON.stringify(quantize(v));
  if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';
  if(v&&typeof v==='object'){
    const record=v as Record<string,unknown>;
    return '{'+Object.keys(record).sort().map(k=>JSON.stringify(k)+':'+canonical(record[k])).join(',')+'}';
  }
  if(v===null||typeof v==='boolean'||typeof v==='string')return JSON.stringify(v);
  throw Error('Cannot canonicalize this value');
}
export async function digest(state:State){
  const bytes=new TextEncoder().encode(canonical(state));
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),n=>n.toString(16).padStart(2,'0')).join('');
}
export const order=(a:string,b:string)=>a<b?-1:a>b?1:0;
function changed(a:object|undefined,b:object){return !a||Object.entries(b).some(([k,v])=>a[k as keyof typeof a]!==v);}
export function operations(before:State,after:State):Op[]{
  const ops:Op[]=[];
  if(changed(before.world,after.world))ops.push({op:'UPSERT_WORLD',world:after.world});
  for(const [i,a] of after.agents.entries())if(changed(before.agents[i],a))ops.push({op:'UPSERT_AGENT',agent:a});
  for(const i of before.items)if(!after.items.some(x=>x.item_id===i.item_id))ops.push({op:'REMOVE_ITEM',item_id:i.item_id});
  for(const i of after.items)if(changed(before.items.find(x=>x.item_id===i.item_id),i))ops.push({op:'UPSERT_ITEM',item:i});
  for(const e of before.events)if(!after.events.some(x=>x.event_id===e.event_id))ops.push({op:'REMOVE_EVENT',event_id:e.event_id});
  for(const e of after.events)if(!before.events.some(x=>x.event_id===e.event_id))ops.push({op:'APPEND_EVENT',event:e});
  return ops;
}
export function reconstruct(previous:Frame|null,record:Envelope):Frame{
  if(!validEnvelope(record)||record.payload.schema_version!==schema||typeof record.payload.step_hash!=='string'||!/^([0-9a-f]{64})$/.test(record.payload.step_hash))throw Error('INVALID_PAYLOAD');
  if(record.msg_type==='FULL_SNAPSHOT'){
    const p=record.payload as unknown as Baseline;
    if(!Number.isSafeInteger(p.tick)||p.tick<0||!p.state?.world||![p.state.agents,p.state.items,p.state.events].every(Array.isArray))throw Error('INVALID_PAYLOAD');
    return {tick:p.tick,hash:p.step_hash,state:p.state};
  }
  if(record.msg_type!=='FRAME_DIFF'||!previous)throw Error('Missing baseline');
  const p=record.payload as unknown as Diff;
  if(p.from_tick!==previous.tick||p.to_tick!==p.from_tick+1||p.prev_step_hash!==previous.hash||!Array.isArray(p.ops))throw Error('TICK_GAP');
  const state:State={...previous.state,agents:[...previous.state.agents],items:[...previous.state.items],events:[...previous.state.events]};
  for(const op of p.ops){
    switch(op.op){
      case 'UPSERT_WORLD':state.world=op.world;break;
      case 'UPSERT_AGENT':{const i=state.agents.findIndex(a=>a.agent_id===op.agent.agent_id);if(i<0)throw Error('Unknown cast');state.agents[i]=op.agent;break;}
      case 'UPSERT_ITEM':state.items=state.items.filter(i=>i.item_id!==op.item.item_id).concat(op.item).sort((a,b)=>order(a.item_id,b.item_id));break;
      case 'REMOVE_ITEM':state.items=state.items.filter(i=>i.item_id!==op.item_id);break;
      case 'APPEND_EVENT':state.events.push(op.event);break;
      case 'REMOVE_EVENT':state.events=state.events.filter(e=>e.event_id!==op.event_id);break;
      default:throw Error('Unsupported op');
    }
  }
  return {tick:p.to_tick,hash:p.step_hash,state};
}
