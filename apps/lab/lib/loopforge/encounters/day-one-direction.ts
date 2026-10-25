import type {Registry,SceneFraming} from './contract';
// Director D3: presentation only; words, custody, effects, routes and counts stay owned by the episode.
const TURN_SHOTS:Readonly<Record<string,SceneFraming>>={
 "S01-T01": "approach",
 "S01-T02": "approach",
 "S01-T03": "approach",
 "S01-T04": "limen-emphasis",
 "S01-T05": "limen-emphasis",
 "S01-T06": "workers-reverse",
 "S01-T07": "workers-reverse",
 "S01-T08": "limen-emphasis",
 "S01-T09": "impact",
 "S01-T10": "impact",
 "S01-T11": "impact",
 "S01-T12": "impact",
 "S01-T13": "card",
 "S01-T14": "card",
 "S01-T15": "card",
 "S02-T01": "passage",
 "S02-T02": "threshold",
 "S02-T03": "aftermath",
 "S02-T04": "aftermath",
 "S02-T05": "aftermath",
 "S02-T06": "aftermath",
 "S02-T07": "aftermath",
 "S02-T08": "aftermath",
 "S02-T09": "aftermath",
 "S03-T01": "conveyor-entrance",
 "S03-T02": "conveyor-entrance",
 "S03-T03": "conveyor-entrance",
 "S03-T04": "intake",
 "S03-T05": "intake",
 "S03-T06": "wash",
 "S03-T07": "belt",
 "S03-T08": "forge",
 "S03-T09": "forge",
 "S03-T10": "forge",
 "S03-T11": "forge",
 "S03-T12": "conveyor-wide",
 "S03-T13": "conveyor-wide",
 "S03-T14": "conveyor-wide",
 "S03-T15": "conveyor-wide",
 "S04-T01": "sam-inspection",
 "S04-T02": "sam-inspection",
 "S04-T03": "sam-inspection",
 "S04-T04": "sam-inspection",
 "S04-T05": "limen-emphasis",
 "S04-T06": "limen-emphasis",
 "S04-T07": "workers-reverse",
 "S04-T08": "workers-reverse",
 "S04-T09": "workers-reverse",
 "S04-T10": "workers-reverse",
 "S04-T11": "checkpoint",
 "S04-T12": "clerk-sorting",
 "S04-T13": "checkpoint",
 "S04-T14": "clerk-register",
 "S04-T15": "clerk-sorting",
 "S05-T01": "pair-work-reply",
 "S05-T02": "pair-work-reply",
 "S05-T03": "pair-work-reply",
 "S05-T04": "pair-work-reply",
 "S05-T05": "intake",
 "S05-T06": "sam-inspection",
 "S05-T07": "sam-inspection",
 "S05-T08": "sam-inspection",
 "S05-T09": "sam-inspection",
 "S05-T10": "jo-work-reply",
 "S05-T11": "jo-work-reply",
 "S05-T12": "jo-work-reply",
 "S05-T13": "jo-work-reply",
 "S05-T14": "belt",
 "S05-T15": "forge",
 "S06-P01": "security-check-reverse",
 "S06-P02": "security-check-reverse",
 "S06-T01": "doorway-pressure",
 "S06-T02": "doorway-pressure",
 "S06-T03": "security-check-reverse",
 "S07-T03": "conveyor-wide",
 "S07-T04": "conveyor-wide",
 "S07-T06": "conveyor-wide",
 "S07-T07": "conveyor-wide",
 "S07-T08": "conveyor-wide",
 "S07-T10": "conveyor-wide",
 "S07-T11": "conveyor-wide",
 "S07-T13": "conveyor-wide",
 "S07-T15": "conveyor-wide",
 "S07-T16": "conveyor-wide",
 "S07-T17": "conveyor-wide",
 "S07-T05": "sam-inspection",
 "S07-T09": "sam-inspection",
 "S07-T12": "sam-inspection",
 "S07-T14": "sam-inspection",
 "S08-T01": "conveyor-wide",
 "S08-T02": "conveyor-wide",
 "S08-T03": "intake",
 "S08-T04": "belt",
 "S08-T05": "forge",
 "S08-T06": "forge",
 "S08-T07": "forge",
 "S08-T08": "output-reply",
 "S08-T09": "output-reply",
 "S08-T10": "output-reply",
 "S09-T01": "conveyor-wide",
 "S09-T02": "conveyor-wide",
 "S09-T03": "conveyor-wide",
 "S09-T04": "clerk-register",
 "S09-T05": "clerk-sorting",
 "S09-T06": "clerk-sorting",
 "S09-T07": "exit-pair",
 "S09-T08": "exit-pair",
 "S09-T09": "exit-flow"
};
export function applyDayOneDirection(registry:Registry){
 let resolved=0;
 for(const action of Object.values(registry)){
  let preceding:SceneFraming|undefined,exitPairDone=false;
  for(const phase of action.phases){
   if(phase.turn){const shot=TURN_SHOTS[phase.turn.id];if(!shot)throw Error('Unmapped Day1 Director turn '+phase.turn.id);phase.framing=shot;resolved++;}
   else if(phase.id.endsWith(' / reading resolve')&&preceding)phase.framing=preceding;
   if(phase.id==='ed takes the register station')phase.framing='clerk-register';
   if(phase.id==='gus reaches his control')phase.framing='clerk-sorting';
   if(action.id==='shift-departure'){
    if(!phase.turn&&!phase.id.endsWith(' / reading resolve'))phase.framing=exitPairDone?'exit-flow':'checkpoint';
    if(phase.turn?.id==='S09-T08')exitPairDone=true;
   }
   if(action.id==='day-one-night')phase.framing='exit-flow';
   // Keep the rescue/acquisition composition continuous across its unvoiced approach.
   if(phase.id==='sam steps around bob’s feet')phase.framing='card';
   // The same existing threat performance starts on the reaction, rather than appearing after its label.
   if(phase.turn?.id==='S06-T01')phase.perform=phase.perform.map(p=>p.agent==='stiletto'?{...p,motion:'threaten' as const,yaw:270,cue:{clip:'Shouting_Angrily',start:0,rate:1,loop:false,blend:.22}}:p);
   if(action.id==='doorway-threat'&&phase.turn?.id!=='S06-T01')phase.perform=phase.perform.map(p=>p.agent==='stiletto'&&p.cue?.clip==='Shouting_Angrily'?{...p,cue:{...p.cue,start:(p.cue.start??0)+1.8}}:p);
   preceding=phase.framing;
  }
 }
 if(resolved!==108)throw Error('Director D3 expects exactly108 Writer turns');
}
