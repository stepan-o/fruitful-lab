import {TICK_MS,type Registry,type World,type View,type Speech} from './contract';
/** A read checkpoint owns attention, never world authority. Animation seconds and
 * factory ticks are separate: waiting for input cannot advance effects or beliefs. */
export type AttentionStep={id:string;tick:number;label:string;speech?:Speech};
export function attentionSteps(registry:Registry):AttentionStep[]{
 const result:AttentionStep[]=[];let tick=1,pending:Speech|undefined;
 for(const action of Object.values(registry))for(const phase of action.phases){
  if((phase.say?.length??0)>1)throw Error('One utterance per attention step.');
  if(phase.say?.length){if(pending)throw Error('Unread dialogue before '+phase.id);pending=phase.say[0];}
  const end=tick+phase.ticks-1;
  if(phase.attention==='hold'||phase.inputLabel||(pending&&phase.attention!=='flow')){
   result.push({id:phase.id,tick:end,label:phase.inputLabel??'Continue',speech:pending});pending=undefined;
  }
  tick+=phase.ticks;
 }
 if(pending)throw Error('The final utterance has no reading checkpoint.');
 return result;
}
export function nextAttention(steps:AttentionStep[],tick:number){return steps.find(s=>s.tick>tick);}
export function factoryClock(tick:number){const seconds=8*3600+Math.floor(tick*TICK_MS/1000);return [Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');}
/** Cosmetic motion continues while the authoritative world is held. Travel clips
 * settle at their landing; held props and partner contacts keep their authored pose.
 * No renderer or presentation timer can commit a transfer, admission or machine job. */
export function readingView(view:View,step:AttentionStep,elapsed:number):View{
 return {...view,actors:view.actors.map(a=>{
  if(!a.cue)return a;
  if(['walk','limp'].includes(a.motion))return {...a,motion:'idle',seconds:elapsed,cue:{clip:a.character==='worker'?'Quiet_Wait':a.character==='stiletto'?'Alert':'Idle_11',loop:true,rate:1},previous:{cue:a.cue,seconds:a.seconds,yaw:a.yaw},blend:Math.min(1,elapsed/.3)};
  // A physical fall/recovery/strike stays at the reached contact pose. The other
  // actors continue to breathe and look around; the clock remains exactly held.
  if(['strike','fall','recover','recoil'].includes(a.motion)||a.cue.rate===0)return a;
  return {...a,seconds:a.seconds+elapsed,blend:1};
 }),bubbles:step.speech?[{id:'reading-'+step.id,speaker:step.speech.speaker,to:step.speech.to,text:step.speech.text,act:step.speech.act,delivery:step.speech.delivery,age:10}]:view.bubbles};
}
export function attentionReached(world:World,step:AttentionStep|undefined){return !!step&&world.tick>=step.tick;}
