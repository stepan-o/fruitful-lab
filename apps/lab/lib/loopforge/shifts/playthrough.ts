import {project} from './wire';
import {type Command,type Run,stations} from './contract';
import {admitCommand,start,step,type Inheritance} from './simulation';
import {availableWorker,team,rate,ratings,titles,units} from './station-line';
import {readingTime} from './reading';

export const playtestQuota=60;
export type Progress={tick:number;commands:Command[]};
export function resume(source:Inheritance,progress:Progress){
  const s=start('early',source);
  for(const cmd of progress.commands){
    advanceTo(s,cmd.tick);
    if(!admitCommand(s,cmd).accepted)throw Error('Saved command rejected: '+cmd.id);
  }
  advanceTo(s,progress.tick);return s;
}
function advanceTo(s:Run,tick:number){
  if(!Number.isSafeInteger(tick)||tick<s.tick||tick-s.tick>12000)throw Error('Invalid shift clock');
  while(s.tick<tick){if(s.phase!=='shift')throw Error('Invalid saved phase');step(s);}
}
export function publicFloor(s:Run){
  const l=s.line!,scene=project(s),manual=s.lead==='STILETTO',open=s.phase==='shift'&&s.dialogue.phase==='work';
  const machines=stations.map((name,i)=>{
    const crew=team(s,i),job=l.cells[i],waiting=manual&&!!l.handoff&&open&&!!job&&!job.done&&!job.permit&&!!crew.length;
    let hold='Waiting for carrier';
    if(!crew.length)hold='Needs worker';
    else if(job?.due)hold=i===3?'Travelling to rack':'Travelling to '+titles[i+1];
    else if(job?.done)hold='Waiting for '+(titles[i+1]??'rack');
    else if(job)hold=manual&&!job.permit?'Waiting for clearance':'Working';
    if(manual&&l.call?.i===i)hold='LIMEN calling '+l.call.who;
    else if(manual&&l.inspecting>s.tick)hold='LIMEN inspecting';
    else if(waiting&&l.lastMiss===job!.id)hold='Call missed';
    const speed=rate(crew,i);
    return {name,title:titles[i],crew,rate:speed,cycleSeconds:speed?Math.ceil(units[i]/speed)/20:null,carrier:job?.id??'',hold,
      canClear:waiting&&!l.call&&!l.inspecting,caller:crew[0]??''};
  });
  const workers=Object.keys(ratings).map(id=>{
    const t=s.tasks[id],dest=t&&titles[t.station],pending=l.pending[id];
    const available=open&&availableWorker(s,id);
    const label=pending?'Finishing contact → '+titles[pending.i]:t?.duty==='detained'?'In custody until bell':t?.duty==='clerk'?'Security clerk':
      dest&&available?(t.duty==='working'?dest:'Walking to '+dest):available?'Available':s.dialogue.passages.includes(id)?'Approaching Conveyor':'At Security';
    return {id,available,label};
  });
  const job=l.cells[3],empty=s.marks.findLast(m=>m.kind==='forge.empty');
  const stroke=empty&&s.tick-empty.tick<12?(s.tick-empty.tick)/12:
    job&&!job.done&&job.work?Math.min(1,job.work/(manual?40:4800)):0;
  const dialogue=s.marks.filter(m=>m.day===s.day&&m.kind==='speech.delivered'&&
    s.tick-m.tick<Math.ceil(readingTime(m.text)/50)).slice(-8);
  const silence=s.marks.findLast(m=>m.kind==='protocol.silence');
  return {tick:s.tick,scene,machines,workers,stroke,deskCut:manual&&l.opening===1&&s.tick<s.dialogue.ready,dialogue:dialogue.filter(e=>!silence||e.tick>silence.tick),
    bell:s.dialogue.bell,manual,opening:manual&&!l.handoff,handoff:l.handoff,shot:l.shot,shotSeq:l.shotSeq,
    inspecting:l.inspecting>s.tick,closed:s.phase==='close',dayCount:s.completed.length-s.dialogue.teamAtBell};
}
export type Floor=ReturnType<typeof publicFloor>;
