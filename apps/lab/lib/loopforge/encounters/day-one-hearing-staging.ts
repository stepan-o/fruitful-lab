import type {Performance,Phase,Point,Registry,SceneFraming,World} from './contract';
import {movementPerformance} from './shared-actions';

/** D6 / Level R2: physical local meetings, using the same movement admission.
 * No words, recipients, hearing range, custody or receipt effects are changed.
 * Sequential travel is intentional until an admitted overlap is demonstrated. */
export function stageDayOneHearing(registry:Registry,world:World){
 const positions:Record<string,Point>=Object.fromEntries(Object.values(world.agents).map(a=>[a.id,a.position]));
 const original={...positions},ids=Object.keys(world.agents);
 const facing=(a:Point,b:Point)=>(Math.atan2(a[0]-b[0],b[1]-a[1])*180/Math.PI+360)%360;
 const speed=(agent:string)=>agent==='bob'?1.35:1.8;
 const quiet=():Performance[]=>ids.map(agent=>({agent,motion:'idle',yaw:agent==='limen'?0:180,cue:{clip:agent==='limen'?'Idle_11':agent==='stiletto'?'Alert':'Quiet_Wait',rate:1,loop:true,blend:.22}}));
 function travel(agent:string,points:Point[],group:string,framing:SceneFraming):Phase[]{
  return points.flatMap((to,i)=>{
   const from=positions[agent],distance=Math.hypot(to[0]-from[0],to[1]-from[1]);if(distance<1)return [];
   const perform=quiet().map(p=>p.agent===agent?movementPerformance(agent,to,{clip:agent==='bob'?'injured_walk':agent==='stiletto'?'Quick_Walk':'walking_2_inplace',rate:1,loop:true,blend:.2},facing(from,to)):p);
   positions[agent]=to;
   return [{id:`D6 ${group} / ${agent} / ${i+1}`,ticks:Math.max(10,Math.ceil(distance/1000/speed(agent)*20)),attention:'flow' as const,framing,perform}];
  });
 }
 for(const action of Object.values(registry)){
  const out:Phase[]=[];let replacedIntake=false,replacedWash=false;
  for(const input of action.phases){
   const phase={...input,perform:input.perform.map(p=>({...p}))},turn=phase.turn?.id;
   if(turn==='S04-T07')out.push(...travel('lou',[[126400,117200]],'H1 local aside','workers-reverse'));
   if(turn==='S04-T08')out.push(...travel('max',[[123200,115600]],'H2 answer from Lobby','workers-reverse'));
   if(turn==='S04-T09')out.push(...travel('max',[[121300,119100]],'H2 return to waiting place','workers-reverse'));
   if(turn==='S04-T11')out.push(...travel('gus',[[125300,115300],[125300,113800]],'H3 dogleg around Ed','checkpoint'));
   if(turn==='S05-T01'){
    // Sam takes the selected mark first. Bob's selected straight south-aisle
    // approach would cross it, so he uses the existing parallel supervision lane.
    out.push(...travel('sam',[[134000,108500],[138500,108500]],'H4 Sam meeting','conveyor-wide'));
    out.push(...travel('bob',[[148500,107200],[136500,107200],[136500,108500]],'H4 Bob parallel approach','conveyor-wide'));
    out.push(...travel('stiletto',[[150300,108500],[140500,108500],[140500,107200]],'H4 local assignment','pair-work-reply'));
   }
   if(phase.id==='bob and sam start the second workpiece')out.push(...travel('stiletto',[[142300,107200],[150300,107200]],'H4 clear the Wash approach','pair-work-reply'));
   // Replace the obsolete pre-meeting route; do not send Bob back to Forge or
   // Sam to his old entrance root. Later Belt/Forge visits remain untouched.
   const intake=phase.id.startsWith('bob reaches paired intake /'),wash=phase.id.startsWith('sam reaches paired wash /');
   if(intake||wash){
    if(phase.turn||phase.effects?.length||phase.process||phase.transfers?.length)throw Error('D6 cannot discard a consequential travel phase');
    if(intake&&!replacedIntake){out.push(...travel('bob',[[136500,105800]],'H4 reaches Intake','intake'));replacedIntake=true;}
    if(wash&&!replacedWash){out.push(...travel('sam',[[140500,108500],[140500,105800]],'H4 reaches Wash','wash'));replacedWash=true;}
    for(const p of input.perform)if(p.to)original[p.agent]=p.to;
    continue;
   }
   if(turn==='S08-T08'){
    // All four guarded process phases have completed. No new process begins
    // during this output conversation; station occupancy remains position-based.
    const path=travel('bob',[[136500,108500],[139000,108500],[139000,107200]],'H6 completed-work reply','output-reply');
    for(const p of path)p.completesWhen=[{fact:'line.output',equals:3},{fact:'line.stage',equals:4},{fact:'line.staffed-output',equals:1}];
    out.push(...path);
   }
   if(turn==='S09-T01')out.push(...travel('bob',[[139000,108500],[136500,108500],[136500,105800]],'H6 return to Intake before shutdown','conveyor-wide'));
   // H1/H3 change an eventual route's actual origin. Retain the authored end,
   // correct its heading and never increase travel speed to hide the detour.
   for(const p of phase.perform){
    if(!p.to)continue;const from=positions[p.agent],before=original[p.agent];
    if(from[0]!==before[0]||from[1]!==before[1]){
     p.yaw=facing(from,p.to);phase.ticks=Math.max(phase.ticks,Math.ceil(Math.hypot(p.to[0]-from[0],p.to[1]-from[1])/1000/speed(p.agent)*20));
    }
    positions[p.agent]=p.to;
   }
   out.push(phase);for(const p of input.perform)if(p.to)original[p.agent]=p.to;
  }
  action.phases=out;
 }
}
