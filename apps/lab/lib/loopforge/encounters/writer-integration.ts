import authored from './writer-R2A/dialogue-turns.json';
import mapping from './writer-R2A/phase-bindings.json';
import {turnDuration,type DialogueTurn} from './dialogue-turn';
import type {Registry,Phase,Performance,World} from './contract';
/** Data-only Writer turns bind to the same physical phases; they never copy effects. */
export function integrateWriter(registry:Registry,world:World){
 const bindings=mapping.phaseBindings.map(b=>({...b}));
 const overrides:Record<string,string>={
 'ed collects bob’s card':'ed collects bob’s card while Sam kneels',
 'sam releases the supporting hand':'sam releases as ed steps back',
 'sam comes when called':'LIMEN steps into the inspection lane',
 'sam presents the card':'Sam waits through the credential check',
 'sam’s card is checked':'sam’s credential record is checked'};
 for(const b of bindings){b.anchorPhaseOrGeneratedPrefix=overrides[b.anchorPhaseOrGeneratedPrefix]??b.anchorPhaseOrGeneratedPrefix;
  if(b.turnId==='S03-T01')b.placement='insert-before';
  if(b.turnId==='S09-T07'){b.anchorPhaseOrGeneratedPrefix='D3 exit exchange first line';b.placement='attach-existing-event';}
  if(b.turnId==='S09-T08'){b.anchorPhaseOrGeneratedPrefix='D3 exit exchange second line';b.placement='attach-existing-event';}
  if(b.turnId==='S02-T02'){b.anchorPhaseOrGeneratedPrefix='LIMEN yields the threshold';b.placement='attach-existing-event';}
  if(['S06-P01','S06-P02','S06-T01'].includes(b.turnId)){b.anchorPhaseOrGeneratedPrefix='STILETTO demands the rest of the shift';b.placement='insert-before';}
 }
 // The four selected replies are lou, max, gus, ed; no replacement crowd voice.
 const helpers=registry.helpers.phases,ed=helpers.findIndex(p=>p.id==='ed volunteers'),gus=helpers.findIndex(p=>p.id==='gus volunteers');if(ed>=0&&gus>=0&&ed<gus)[helpers[ed],helpers[gus]]=[helpers[gus],helpers[ed]];
 const all=Object.values(registry).flatMap(a=>a.phases),resolved=new Map<string,typeof bindings>();
 for(const b of bindings){const matches=all.filter(p=>p.id===b.anchorPhaseOrGeneratedPrefix||p.id.startsWith(b.anchorPhaseOrGeneratedPrefix+' /')||p.id.includes(b.anchorPhaseOrGeneratedPrefix+' /'));if(!matches.length)throw Error('Writer anchor missing: '+b.turnId+' / '+b.anchorPhaseOrGeneratedPrefix);const target=b.placement==='insert-after'?matches.at(-1)!:matches[0];resolved.set(target.id,[...(resolved.get(target.id)??[]),b]);}
 const turnMap=new Map((authored as DialogueTurn[]).map(t=>[t.id,t]));let last:Performance[]=[];const installed:string[]=[];
 const wait=(poses:Performance[])=>poses.map(p=>({agent:p.agent,motion:'idle' as const,yaw:p.yaw,cue:{clip:world.agents[p.agent].character==='worker'?'Quiet_Wait':world.agents[p.agent].character==='limen'?'Idle_11':'Alert',start:0,rate:1,loop:true,blend:.22}}));
 function bind(p:Phase,id:string){const t=turnMap.get(id);if(!t)throw Error('Unknown Writer turn '+id);p.turn={...t,trigger:{phaseId:p.id}};
  // Producer S05-T09 temporary-inspection correction, 2026-10-24; frozen Writer source stays intact.
  if(p.turn.id==='S05-T09'&&p.turn.kind==='reaction-only'){
   p.turn={...p.turn,reaction:{...p.turn.reaction,accessibleLabel:'jo waits for the check to finish without saying a word.'},sourceRefs:[...p.turn.sourceRefs,'producer:jo-reaction-status-S05-T09/DECISION.json@2026-10-24T18:55:45.945261+00:00']};
  }
  p.say=[];installed.push(id);if(t.advance==='manual-boundary'){p.attention='hold';p.inputLabel=id==='S08-T02'?'Start the staffed line':'End the shift';}return p;}
 function inserted(base:Phase,id:string,poses:Performance[]):Phase{const t=turnMap.get(id)!;return bind({id:t.trigger.phaseId,ticks:Math.round(turnDuration(t)*20),framing:base.framing,perform:wait(poses),attention:'flow'},id);}
 for(const action of Object.values(registry)){
  const out:Phase[]=[];
  for(const old of action.phases){const p:Phase={...old,say:[],attention:'flow'},bs=(resolved.get(old.id)??[]).sort((a,b)=>a.orderInPacket-b.orderInPacket);
   // Original tutorial controls retain their mechanical boundaries; later old read holds are removed.
   if(['Seat the brain','Run the wash','Start the main belt','Compress the brain'].includes(old.inputLabel??'')){p.attention='hold';p.inputLabel=old.inputLabel;}else delete p.inputLabel;
   const before=bs.filter(b=>b.placement==='insert-before'),after=bs.filter(b=>b.placement==='insert-after'),on=bs.filter(b=>!['insert-before','insert-after'].includes(b.placement));
   for(const b of before)out.push(inserted(p,b.turnId,last.length?last:p.perform));
   if(on.length>1)throw Error('Multiple turn bindings at '+p.id);
   if(on[0])bind(p,on[0].turnId);
   out.push(p);
   if(p.turn?.kind==='speech'&&!['The cyan warning','sam runs to bob','STILETTO demands the rest of the shift'].includes(p.id)){
    const needed=Math.ceil(turnDuration(p.turn)*20)-p.ticks;
    if(needed>0){if(!p.perform.some(a=>a.to)&&!p.effects?.length&&!p.transfers?.length&&!p.process)p.ticks+=needed;else{const boundary=p.inputLabel;delete p.inputLabel;p.attention='flow';out.push({id:p.id+' / reading resolve',ticks:needed,framing:p.framing,perform:wait(p.perform),attention:boundary?'hold':'flow',...(boundary?{inputLabel:boundary}:{})});}}
   }
   last=p.perform;
   for(const b of after){const insertedPhase=inserted(p,b.turnId,last);out.push(insertedPhase);last=insertedPhase.perform;}
  }
  action.phases=out;
 }
 if(installed.length!==108||new Set(installed).size!==108)throw Error('Incomplete Writer splice');
 return installed;
}
