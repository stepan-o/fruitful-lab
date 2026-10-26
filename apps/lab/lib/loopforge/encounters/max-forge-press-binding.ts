import {applyMaxForgeControlPress} from './max-forge-press-phases.mjs';
import type {Registry} from './contract';

/** Carry the actual assembled quiet endpoints with all three procedural cues.
 * The viewer must not reconstruct them from a factory or a hard-coded clock. */
export function bindMaxForgeControlPress(registry:Registry){
 const binding=applyMaxForgeControlPress(registry);
 if(!binding.applied)return binding;
 const forgeQuiet={start:{cue:binding.quietStart.cue,seconds:binding.quietStart.seconds},end:{cue:binding.quietEnd.cue,seconds:binding.quietEnd.seconds}};
 for(const phase of registry['staffed-production'].phases)if(binding.phaseIds.includes(phase.id)){
  phase.perform=phase.perform!.map(p=>p.agent==='max'?{...p,cue:{...p.cue!,forgeQuiet}}:p);
 }
 return binding;
}
