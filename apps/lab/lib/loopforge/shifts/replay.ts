import {start,step,nextMorning,intent,admitCommand} from './simulation';
import type {Run} from './contract';
export const names=['Morning bids','Missing ID','Conveyor chat','Conflicting orders'] as const;
export type Checkpoint=typeof names[number];
export function until(s:Run,test:(s:Run)=>boolean){
  for(let i=0;i<=2000;i++){if(test(s))return;if(s.phase!=='shift')break;step(s);}
  throw Error('Unreachable review checkpoint on day '+s.day);
}
export function restorePoint(which:Checkpoint){
  const s=start(which==='Conveyor chat'||which==='Conflicting orders'?'late':'early');
  if(which==='Morning bids')return s;
  const days=which==='Conflicting orders'?4:2;
  for(let day=2;day<=days;day++){
    admitCommand(s,intent(s,'review-appointment-'+day,'appoint','LIMEN','security'));
    if(day<days){until(s,r=>r.phase==='close');nextMorning(s);}
  }
  if(which==='Missing ID')until(s,r=>r.case?.status==='open');
  if(which==='Conveyor chat')until(s,r=>r.chat==='question');
  if(which==='Conflicting orders')until(s,r=>r.pressure==='clash');
  return s;
}
