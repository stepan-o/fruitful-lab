import {attentionSteps,type AttentionStep} from './attention';
import {TICK_MS,type Registry} from './contract';
/** Reading time is presentation time. Movement/contact/custody ticks stay authored.
 * The three opening walk lines run continuously; the first station remains input-owned. */
export function entryPlayback(registry:Registry){
 let tick=1,speechStart=1,endTick:number|undefined;const durations=new Map<string,number>();
 for(const action of Object.values(registry))for(const phase of action.phases){
  if(phase.say?.length||phase.turn?.kind==='speech')speechStart=tick;
  durations.set(phase.id,(tick+phase.ticks-speechStart)*TICK_MS/1000);
  if(phase.inputLabel==='Seat the brain')endTick=tick+phase.ticks-1;
  tick+=phase.ticks;
 }
 if(endTick===undefined)throw Error('Automatic entry requires the first Intake instruction.');
 const moving=new Set(['The morning walk','sam keeps walking','jo gives it a shift']);
 const steps=attentionSteps(registry).filter(step=>step.tick<=endTick&&!moving.has(step.id));
 if(steps.at(-1)?.label!=='Seat the brain')throw Error('Automatic entry must stop at the player Intake control.');
 return {endTick,steps:steps.map(step=>({...step,readSeconds:step.speech?Math.max(.25,step.speech.seconds-(durations.get(step.id)??0)+.35):0}))};
}
export type EntryPlayback=ReturnType<typeof entryPlayback>;
export function nextEntryStep(plan:EntryPlayback,tick:number){return plan.steps.find(step=>step.tick>tick);}
export function entryReadSeconds(plan:EntryPlayback,step:AttentionStep){return plan.steps.find(item=>item.id===step.id)?.readSeconds??0;}
