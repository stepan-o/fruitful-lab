import {score, tickAt} from '../intro/floor';
import {Hz, type Run} from './contract';
import {openingReady} from './morning';
import {step} from './simulation';

const cut=score.cuts[0];
const gateBeat=score.beats.find(beat=>beat.view==='gate')!;
const finalSteps=Math.round((gateBeat.at-cut.to)*Hz);

// Match the rehearsal's incoming shot to the actual greeting (or card action)
// on this branch. Run the omitted travel in the same simulation as ordinary play.
export function cutToSecurity(run:Run){
  if(!openingReady(run))return 0;

  const probe=structuredClone(run),count=run.marks.length;
  const limit=tickAt(gateBeat.at);
  for(let n=0;n<limit;n++){
    step(probe);
    if(probe.marks.length===count && probe.dialogue.phase==='walk')continue;
    const skipped=Math.max(0,probe.tick-finalSteps-run.tick);
    for(let i=0;i<skipped;i++)step(run);
    return skipped;
  }
  return 0;
}
