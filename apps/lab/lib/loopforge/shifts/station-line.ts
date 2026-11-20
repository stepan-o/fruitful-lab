import {geom, audible} from '../intro/floor';
import {type Run, type Point, type Command, stations} from './contract';
import {controls, dist, go, meters} from './navigation';
import {mark, say, remember} from './events';

export const ratings: Record<string,number[]> = {
  sam:[4,3,3], bob:[2,4,5], jo:[3,4,3], max:[5,2,4], kit:[2,5,4],
  mae:[3,3,5], lou:[4,4,2], ben:[3,3,4], ed:[2,5,2], gus:[4,2,3],
};
export const needs = [[4,1,1],[1,1,4],[1,4,1],[2,1,3]];
const units = [4000,5400,6400,4800], protocolTicks = [50,60,30,40];
export const titles = ['Intake','Wash','Belt','Forge'];
type Job = {id:string; work:number; permit:string; done:boolean; due:number; holder:string; receiver:string};
type Call = {id:string; i:number; carrier:string; who:string; due:number};
export type Line = {
  version:1; cells:(Job|null)[]; faces:Record<string,number>; pending:Record<string,{i:number;face:number}>;
  call:Call|null; lastMiss:string; opening:number; nextBeat:number; handoff:number; seed:number;
  nextInspection:number; inspecting:number; paceToGate:boolean; shot:'security'|'conveyor'; shotSeq:number;
};
export function newLine(seed:number):Line {
  return {version:1,cells:[null,null,null,null],faces:{},pending:{},call:null,lastMiss:'',opening:0,nextBeat:0,
    handoff:0,seed,nextInspection:0,inspecting:0,paceToGate:false,shot:'security',shotSeq:0};
}
export const seat=(i:number,face:number):Point=>[controls[i][0]+[0,-950,950][face],controls[i][1]];
export function team(s:Run,i:number){
  return Object.keys(ratings).filter(id=>s.tasks[id]?.duty==='working' && s.tasks[id].station===i &&
    dist(s.world.agents[id].position,seat(i,s.line!.faces[id]??0))<100);
}
export function rate(crew:string[],i:number){
  return crew.map(id=>({id,score:needs[i].reduce((n,w,j)=>n+w*ratings[id][j],0)}))
    .sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,3).reduce((n,w,j)=>n+w.score*[4,2,1][j],0);
}
export function availableWorker(s:Run,id:string){
  const task=s.tasks[id];
  return Object.hasOwn(ratings,id)&&s.world.agents[id].room==='conveyor'&&
    ['cleared','standing','working'].includes(task?.duty)&&s.dialogue.passages.includes(id);
}
function occupiedFaces(s:Run,i:number,except:string){
  const line=s.line!,faces=new Set<number>();
  for(const id of Object.keys(ratings)){
    if(id===except)continue;
    if(s.tasks[id]?.station===i && s.tasks[id]?.duty!=='detained')faces.add(line.faces[id]??0);
    if(line.pending[id]?.i===i)faces.add(line.pending[id].face);
  }
  return faces;
}
function contact(s:Run,id:string){
  return s.line!.cells.some((job,i)=>job&&(job.due>0&&(job.holder===id||job.receiver===id)||
    i===3&&!job.done&&job.holder===id&&job.work>0&&units[i]-job.work<=5*rate(team(s,i),i)));
}
function walk(s:Run,id:string,i:number,face:number){
  const target=seat(i,face);
  s.line!.faces[id]=face;s.tasks[id].station=i;
  s.tasks[id].duty='cleared';s.dialogue.posts[id]=target;s.dialogue.faces[id]=stations[i];go(s,id,target);
  mark(s,'order.walk','conveyor','actor.'+id,s.world.agents[id].position,id,stations[i],'Walking to '+titles[i]);
}
export function assign(s:Run,id:string,i:number){
  if(!availableWorker(s,id))return 'Worker unavailable';
  if(s.line!.pending[id]?.i===i||(!s.line!.pending[id]&&s.tasks[id].station===i))return '';
  const taken=occupiedFaces(s,i,id), face=[0,1,2].find(n=>!taken.has(n));
  if(face===undefined)return 'Station full';
  delete s.line!.pending[id];
  if(contact(s,id))s.line!.pending[id]={i,face};else walk(s,id,i,face);
  return '';
}
function drawInspection(s:Run){
  const l=s.line!;l.seed=(Math.imul(1664525,l.seed)+1013904223)>>>0;
  l.nextInspection=s.tick+240+Math.floor(l.seed/4294967296*161);
}
export function handControl(s:Run){
  const l=s.line!;l.handoff=s.tick;drawInspection(s);
  mark(s,'control.ready','conveyor','control.forge',controls[3],'max',l.cells[3]?.id??'','Waiting for the Forge call');
}
export function clear(s:Run,i:number,id:string,operator:string,cmdId:string,authored=false,words?:string){
  const l=s.line!,job=l.cells[i],who=team(s,i)[0];
  if(!authored&&!l.handoff)return 'Opening in progress';
  if(l.call||l.inspecting>s.tick)return 'LIMEN occupied';
  if(!job||job.id!==id||job.done||job.permit||!who||operator!==who)return 'Clearance no longer available';
  l.lastMiss='';l.call={id:cmdId,i,carrier:id,who,due:s.tick+10};
  say(s,'LIMEN',words??(titles[i]+', all clear. '+who+'.'),'conveyor','',[who]);
  return '';
}
export function lineCommand(s:Run,cmd:Command){
  if(s.phase!=='shift'||s.dialogue.phase!=='work'||cmd.room!=='conveyor')return 'Shift closed';
  const i=stations.findIndex(n=>n===cmd.target);
  if(i<0)return 'Unknown station';
  if(cmd.action==='assign'&&s.lead==='LIMEN')return assign(s,cmd.incident,i);
  if(cmd.action==='clear'&&s.lead==='STILETTO'){
    const [id,who]=cmd.incident.split('/');
    return clear(s,i,id,who,cmd.id);
  }
  return 'Wrong supervisor';
}
function stage(s:Run){
  const id='D'+s.day+'-C'+ ++s.nextPiece;
  s.line!.cells[0]={id,work:0,permit:'',done:false,due:0,holder:'',receiver:''};
  s.pieces.push({id,stage:0,status:'process',ready:s.tick,at:meters(geom.stations[0].x,geom.forgeHall.carrierY)});
}
export function stationTick(s:Run){
  const l=s.line!,manual=s.lead==='STILETTO',cells=l.cells;
  const crews=stations.map((_,i)=>team(s,i));s.coverage=crews.map(c=>c[0]??'');
  // Receipts precede new reservations. The source owns the load throughout travel.
  for(let i=3;i>=0;i--){
    const job=cells[i];if(!job?.due)continue;
    const p=s.pieces.find(p=>p.id===job.id)!;
    const slot=geom.contact.outputSlots[s.completed.length%geom.contact.outputSlots.length];
    const dst=i===3?meters(slot[0],slot[1]):meters(geom.stations[i+1].x,geom.forgeHall.carrierY);
    const left=Math.max(1,job.due-s.tick+1);
    p.at=[p.at[0]+Math.round((dst[0]-p.at[0])/left),p.at[1]+Math.round((dst[1]-p.at[1])/left)];
    if(s.tick<job.due)continue;
    cells[i]=null;p.stage=i+1;p.at=dst;
    if(i===3){
      p.status='rack';
      if(!s.completed.includes(p.id)){
        s.completed.push(p.id);mark(s,'rack.arrival','conveyor','rack.output',dst,'',p.id,'Finished cortex');
      }
    }else{
      p.status='process';cells[i+1]={id:p.id,work:0,permit:'',done:false,due:0,holder:'',receiver:''};
    }
  }
  const c=l.call;
  if(c&&s.tick>=c.due){
    l.call=null;const job=cells[c.i];
    if(job?.id===c.carrier&&crews[c.i].includes(c.who)&&!s.dialogue.masked.includes(c.who)&&audible(s.world.agents.LIMEN,s.world.agents[c.who])){
      job.permit=c.who;const ev=mark(s,'clear.received','conveyor','control.'+stations[c.i],controls[c.i],c.who,c.carrier,c.id,[c.who]);
      remember(s,c.who,'clear.'+c.carrier+'.'+c.i,'call#'+ev.seq,true);
    }else l.lastMiss=c.carrier;
  }
  if(manual&&l.handoff){
    if(l.inspecting&&s.tick>=l.inspecting){l.inspecting=0;drawInspection(s);}
    if(!l.inspecting&&!l.call&&s.tick>=l.nextInspection&&cells.some((j,i)=>j&&!j.due&&!j.permit&&crews[i].length)){
      l.inspecting=s.tick+40;mark(s,'protocol.inspect','conveyor','actor.LIMEN',s.world.agents.LIMEN.position,'LIMEN','','Silent inspection');
    }
  }
  for(const [id,dest] of Object.entries(l.pending))if(!contact(s,id)){
    walk(s,id,dest.i,dest.face);delete l.pending[id];crews.forEach((c,i)=>crews[i]=c.filter(w=>w!==id));
  }
  if(!cells[0]&&crews[0].length)stage(s);
  for(let i=3;i>=0;i--){
    const job=cells[i];if(!job||job.due)continue;
    const crew=crews[i],goal=manual?protocolTicks[i]:units[i];
    if(job.work>=goal&&!job.done){
      job.done=true;mark(s,'handoff.finished','conveyor','control.'+stations[i],controls[i],job.holder,job.id,stations[i]);
    }
    if(job.done){
      if(i<3&&(cells[i+1]||i>0&&!crews[i+1].length))continue;
      // Keep the source face and, from Belt onwards, the receiving face until contact.
      job.receiver=i>0&&i<3?crews[i+1][0]:'';job.due=s.tick+10;
      s.pieces.find(p=>p.id===job.id)!.status='travel';continue;
    }
    if(job.permit&&!crew.includes(job.permit))job.permit='';
    if(!crew.length||manual&&!job.permit)continue;
    job.holder=crew.includes(job.holder)?job.holder:crew[0];
    if(!job.work)mark(s,'handoff.started','conveyor','control.'+stations[i],controls[i],job.holder,job.id,s.pace);
    job.work+=manual?1:rate(crew,i);
  }
}
