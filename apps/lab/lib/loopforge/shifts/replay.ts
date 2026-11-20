import {start,step,nextMorning,intent,admitCommand} from './simulation';
import type {Run} from './contract';

export const names=['Morning bids','Missing ID','Conveyor chat','Conflicting orders',
  'G5 · early cutoff','G5 · late cutoff','G5 · exit after early cutoff','G5 · exit after late cutoff',
  '4D · firsthand return','W1 · reported return'] as const;
export type Checkpoint=typeof names[number];
export function until(s:Run,test:(s:Run)=>boolean){
  for(let i=0;i<6000;i++){if(test(s))return;if(s.phase!=='shift')break;step(s);}
  throw Error('Unreachable review checkpoint on shift '+s.day+' at '+s.tick);
}
export function restorePoint(which:Checkpoint){
  const s=start();
  if(which==='Morning bids')return s;
  const clash=which==='Conflicting orders'||which.startsWith('4D')||which.startsWith('W1');
  for(;;){
    admitCommand(s,intent(s,'review-appointment-'+s.day,'appoint','LIMEN','security'));
    if(s.day===2){
      until(s,r=>r.case?.status==='open');
      if(which==='Missing ID')return s;
      admitCommand(s,intent(s,'review-daily-pass','issue-pass','bob','security'));
    }
    if(!clash)break;
    if(s.day===4){until(s,r=>r.pressure==='clash');break;}
    until(s,r=>r.phase==='close');nextMorning(s);
  }
  if(clash){
    if(which==='W1 · reported return')delete s.world.agents.ben.beliefs['hand.return'];
    return s;
  }
  if(which==='Conveyor chat'){until(s,r=>r.chat==='question');return s;}
  until(s,r=>r.chat==='reply'&&r.dialogue.cutoff>0);
  // Both clones retain the same tray, pace, seed, positions, audience and pending reply.
  if(which.includes('late'))s.dialogue.cutoff+=2;
  if(which.includes('exit'))until(s,r=>r.dialogue.phase==='departure');
  return s;
}
