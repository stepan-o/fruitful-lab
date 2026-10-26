/** Bind the authored Max control reach AFTER final Writer/direction assembly.
 * No phase insertion, retiming, effect, process, placement or other-actor edit. */
export function applyMaxForgeControlPress(registry){
 const action=registry['staffed-production'];
 if(!action)throw Error('Max Forge: missing staffed production');
 const phases=action.phases,index=phases.findIndex(p=>p.id==='The staffed forge operates');
 if(index<3||index+1>=phases.length)throw Error('Max Forge: incomplete assembled sequence');
 const forge=phases[index];
 if(forge.process?.operator?.agent!=='max')return {applied:false,reason:'Forge operator is not Max'};
 const ready=phases[index-2],command=phases[index-1],before=phases[index-3],after=phases[index+1];
 if(ready.turn?.id!=='S08-T05'||command.turn?.id!=='S08-T06'||ready.ticks!==26||command.ticks!==28||forge.ticks!==120)
  throw Error('Max Forge: Writer ready/command/production timing changed');
 const performer=p=>{const found=p.perform.filter(v=>v.agent==='max');
  if(found.length!==1)throw Error('Max Forge: expected one Max performer in '+p.id);return found[0];};
 const prior=performer(before),next=performer(after),targets=[ready,command,forge].map(performer);
 if(prior.cue?.clip!=='Quiet_Wait'||next.cue?.clip!=='Quiet_Wait')throw Error('Max Forge: quiet endpoint contract changed');
 if([...targets,prior,next].some(p=>p.to||p.yaw!==targets[0].yaw))throw Error('Max Forge: placement must stay at the control');
 const starts=[-2.7,-1.4,0],replacements=targets.map((p,i)=>({...p,cue:{...p.cue,
  clip:'Max_Forge_Control_Press',start:starts[i],rate:1,loop:false}}));
 // All assertions precede mutation; an incompatible registry remains untouched.
 [ready,command,forge].forEach((phase,i)=>{phase.perform=phase.perform.map(p=>p.agent==='max'?replacements[i]:p);});
 return {applied:true,phaseIds:[ready.id,command.id,forge.id],starts,
  quietStart:{phaseId:before.id,cue:{...prior.cue},seconds:before.ticks/20},
  quietEnd:{phaseId:after.id,cue:{...next.cue},seconds:0},
  durationSeconds:6,preparationSeconds:2.7,contactAtForgeSeconds:0};
}
