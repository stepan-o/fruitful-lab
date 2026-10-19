import {ENCOUNTER_VERSION,type Agent,type World,type Registry,type Planner,type Phase,type Performance,type Speech} from './contract';
import {ARRIVAL_LAYOUT,arrivalSpace,arrivalWaiting} from './arrival-layout';
export const ARRIVAL_WORKERS=Array.from({length:10},(_,i)=>`arrival-worker-${String(i+1).padStart(2,'0')}`);
const LIMEN='limen',W=ARRIVAL_WORKERS[0];
/** An intention fixture; the shared kernel still owns movement, reservations, hearing and effects. */
export function arrival(){
 const agents:Record<string,Agent>={};
 ARRIVAL_WORKERS.forEach((id,i)=>{agents[id]={id,name:`Worker ${String(i+1).padStart(2,'0')}`,character:'worker',room:'lobby',position:[(i%2?125:123)*1000,(120+Math.floor(i/2)*1.3)*1000],yaw:180,beliefs:{},stress:10,trust:50,memory:[]};});
 agents[LIMEN]={id:LIMEN,name:'LIMEN',character:'limen',room:'security',position:[124000,110100],yaw:0,beliefs:{'checkpoint.arrivals':{value:10,source:'entrance-sightline',mode:'observed',tick:0}},stress:8,trust:50,memory:[]};
 const world:World={version:ENCOUNTER_VERSION,tick:0,sequence:0,agents,facts:{'portal.lobby-security.open':false,'portal.lobby-security.audible':true,'checkpoint.arrivals':10,'checkpoint.ids-requested':false},resources:['lobby-security:entrance','limen:baton',...ARRIVAL_WORKERS.map(id=>`queue:${id}`)],held:{},active:[],done:[],events:[]};
 const waiting=()=>ARRIVAL_WORKERS.map(agent=>({agent,motion:'idle' as const,yaw:180}));
 const command=(text:string,claim:Speech['claim']):Speech=>({speaker:LIMEN,to:ARRIVAL_WORKERS,channel:'shout',act:'instruction',text,claim,cause:'checkpoint.arrivals',seconds:4});
 const perform=(motion:Performance['motion'],worker?:Performance):Performance[]=>[...waiting().filter(p=>p.agent!==worker?.agent),...(worker?[worker]:[]),{agent:LIMEN,motion,yaw:0}];
 const phases:Phase[]=[
  {id:'Ten workers arrive through the lobby',ticks:160,perform:[...ARRIVAL_WORKERS.map((agent,i)=>({agent,motion:'walk' as const,to:[(i%2?125:123)*1000,(113.8+Math.floor(i/2)*1.3)*1000] as const,yaw:180})),{agent:LIMEN,motion:'guard',yaw:0}]},
  {id:'LIMEN blocks the entrance',ticks:80,perform:perform('warn'),say:[command('STOP AND WAIT HERE!!',{fact:'checkpoint.instruction',value:'wait'})]},
  {id:'One worker tries to pass',ticks:40,perform:perform('guard',{agent:W,motion:'walk',to:[124000,111450],yaw:157})},
  {id:'LIMEN swings the baton',ticks:20,perform:perform('strike'),say:[command('HEY YOU I SAID STOP!!!!',{fact:'checkpoint.instruction',value:'stop'})],effects:[{fact:`injury.${W}`,value:'limping'},{agent:W,stress:22,trust:-12,remember:'LIMEN struck me when I tried to pass the checkpoint.'}]},
  {id:'The worker recoils',ticks:16,perform:perform('guard',{agent:W,motion:'recoil',yaw:180})},
  {id:'The worker limps back into the queue',ticks:100,perform:perform('guard',{agent:W,motion:'limp',to:[123000,113800],yaw:-23}),effects:ARRIVAL_WORKERS.map(id=>({fact:`queue.${id}.settled`,value:true}))},
  {id:'Everyone waits',ticks:45,perform:perform('guard')},
 ];
 const registry:Registry={
  arrival:{id:'arrival',room:'lobby',adjacentRoom:'security',participants:[LIMEN,...ARRIVAL_WORKERS],resources:world.resources,requires:[{fact:'portal.lobby-security.open',equals:false}],reason:'LIMEN holds the checkpoint while arriving workers gather in the lobby.',phases},
  ids:{id:'ids',room:'lobby',adjacentRoom:'security',participants:[LIMEN,...ARRIVAL_WORKERS],resources:['lobby-security:entrance'],requires:ARRIVAL_WORKERS.map(id=>({fact:`queue.${id}.settled`,equals:true})),reason:'The settled queue is ready to hear the next instruction.',phases:[{id:'The ID check begins',ticks:100,perform:perform('warn'),say:[command('EVERYONE PREPARE YOUR IDs',{fact:'checkpoint.instruction',value:'prepare-ids'})],effects:[{fact:'checkpoint.ids-requested',value:true}]}]},
 };
 const planner:Planner={propose(s){if(s.active.length)return [];if(!s.done.includes('arrival'))return [{id:'arrival',action:'arrival',initiator:LIMEN}];if(!s.done.includes('ids')&&arrivalWaiting(s))return [{id:'ids',action:'ids',initiator:LIMEN}];return [];}};
 return {world,registry,planner,space:arrivalSpace,total:562,beats:[{label:'Arrivals',tick:80},{label:'Stop and wait',tick:180},{label:'The baton',tick:292},{label:'Limp back',tick:365},{label:'Prepare IDs',tick:500}],study:'arrival' as const,choice:'care' as const,room:'security' as const,anchor:ARRIVAL_LAYOUT.anchor};
}
