import {project} from './kernel';
import type {World,Registry,View} from './contract';
export const ENCOUNTER_SCHEMA='loopforge.encounter.local/3';
/** Local snapshot adapter. Legacy KVP-0001 handshake/transport/hashes are NOT implemented.
 * Components and display instructions are copied; viewers cannot mutate the kernel. */
export function encounterSnapshot(world:World,registry:Registry,run:{worldId:string;runId:string;seed:number},finished=false){
 const view=project(world,registry,finished);
 return structuredClone({schema:ENCOUNTER_SCHEMA,engine:world.version,...run,tick:world.tick,sequence:world.sequence,tickRateHz:20,
  state:{agents:view.actors.map(a=>({id:a.id,name:a.name,character:a.character,position:a.position,yaw:a.yaw,visible:a.visible,action:a.action})).sort((a,b)=>a.id.localeCompare(b.id)),items:view.props??[],process:view.process,gateOpen:view.gateOpen,drive:view.drive,dayOne:view.dayOne},
  overlays:{actors:view.actors.map(({id,motion,seconds,cue,previous,blend})=>({id,motion,seconds,cue,previous,blend})),turn:view.turn,bubbles:view.bubbles,credentialStatus:view.credentialStatus,framing:view.framing,phase:view.phase,finished:view.finished}});
}
export function viewFromSnapshot(snapshot:ReturnType<typeof encounterSnapshot>):View{if(snapshot.schema!==ENCOUNTER_SCHEMA)throw Error('Unsupported encounter schema');const {state,overlays}=snapshot;return {tick:snapshot.tick,actors:overlays.actors.map(a=>({...state.agents.find(e=>e.id===a.id)!,...a})),props:state.items,process:state.process,gateOpen:state.gateOpen,drive:state.drive,dayOne:state.dayOne,turn:overlays.turn,bubbles:overlays.bubbles,credentialStatus:overlays.credentialStatus,framing:overlays.framing,phase:overlays.phase,finished:overlays.finished};}
