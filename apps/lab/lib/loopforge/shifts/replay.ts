import {start,step,nextMorning,intent,admitCommand} from './simulation';
import type {Run} from './contract';

export const names=['Morning bids','Missing ID','Conveyor chat','Conflicting orders',
  'G5 · early cutoff','G5 · late cutoff','G5 · exit after early cutoff','G5 · exit after late cutoff',
  '4D · firsthand return','W1 · reported return','3D · hands at the desk','4F · late check at bell'] as const;
export type Checkpoint=typeof names[number];
export function until(s:Run,test:(s:Run)=>boolean){
  for(let i=0;i<6000;i++){if(test(s))return;if(s.phase!=='shift')break;step(s);}
  throw Error('Unreachable review checkpoint on shift '+s.day+' at '+s.tick);
}
export function restorePoint(which:Checkpoint){
  const s=start(which==='Conveyor chat'?'late':'early');
  if(which==='Morning bids')return s;
  const clash=which==='Conflicting orders'||which.startsWith('4D')||which.startsWith('W1')||which.startsWith('3D')||which.startsWith('4F');
  for(;;){
    admitCommand(s,intent(s,'review-appointment-'+s.day,'appoint','LIMEN','security'));
    if(s.day===2&&which!=='Conveyor chat'){
      until(s,r=>r.case?.status==='open');
      if(which==='Missing ID')return s;
      admitCommand(s,intent(s,'review-daily-pass','issue-pass','bob','security'));
    }
    if(!clash)break;
    if(which.startsWith('3D')&&s.day===3){until(s,r=>r.pressure==='refusal'&&!!r.world.agents.LIMEN.beliefs['pressed.'+r.day]);return s;}
    if(which.startsWith('4F')&&s.day===4){until(s,r=>r.called==='kit'&&r.tick>=r.dialogue.bell-70);return s;}
    if(s.day===4){until(s,r=>r.pressure==='clash');break;}
    if(which==='W1 · reported return'&&s.day===3){
      until(s,r=>r.pressure==='refusal'&&!!r.world.agents.LIMEN.beliefs['pressed.'+r.day]);
      s.dialogue.occluded.push('ben');
      until(s,r=>r.pressure==='settled');s.dialogue.occluded=[];
    }
    until(s,r=>r.phase==='close');nextMorning(s);
  }
  if(clash){
    return s;
  }
  if(which==='Conveyor chat'){until(s,r=>r.chat==='question');return s;}
  until(s,r=>r.chat==='reply'&&r.dialogue.cutoff>0);
  // Both clones retain the same tray, pace, seed, positions, audience and pending reply.
  if(which.includes('late'))s.dialogue.cutoff+=2;
  if(which.includes('exit'))until(s,r=>r.dialogue.phase==='departure');
  return s;
}
