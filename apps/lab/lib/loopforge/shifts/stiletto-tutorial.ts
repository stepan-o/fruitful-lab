import {stations,type Command,type Run,type Room} from './contract';
import {availableWorker,assign,titles} from './station-line';
import {go,meters,dist,workPost} from './navigation';
import {say} from './events';
import {cut} from './swap-opening';

type Stage='arrival'|'pairs'|'demonstration'|'card'|'visit'|'two-cleared'|'singles'|'production'|'return'|'release'|'live';
export type Tutorial={stage:Stage; posts:string[]; crew:string[]; cue:number; due:number; baseline:number};
export const newTutorial=():Tutorial=>({stage:'arrival',posts:['','','',''],crew:[],cue:0,due:0,baseline:0});
export const held=(s:Run)=>s.tutorial?.stage==='pairs'||s.tutorial?.stage==='singles';
const gate=meters(129.4,132.4);
export const waitingBay=(s:Run,id:string)=>meters(124.4+s.dialogue.order.indexOf(id)%4*1.15,140.4+Math.floor(s.dialogue.order.indexOf(id)/4)*1.2);
const bayside=(s:Run)=>s.dialogue.passages.filter(id=>availableWorker(s,id)&&s.tasks[id].duty==='standing');

export function lessonOrder(s:Run,c:Command){
  const t=s.tutorial!,pair=t.stage==='pairs';
  const i=stations.findIndex(name=>name===c.target),id=c.incident;
  if(!held(s)||c.room!=='conveyor'||i<0||!t.crew.includes(id))return 'This assignment is closed';
  if(t.posts[i]===id)return '';
  if(t.posts.filter(w=>w===id).length>=(pair?2:1))return pair?'Choose the other operator':'Choose one worker per station';
  t.posts[i]=id;
  if(t.posts.every(Boolean)){
    t.stage=pair?'demonstration':'production';t.baseline=s.completed.length;
    // A paired operator starts at the upstream post and follows its carrier.
    for(const worker of new Set(t.posts))assign(s,worker,t.posts.indexOf(worker));
    say(s,'STILETTO',pair?'Run one through. Watch them change posts.':'One on each. Run it.','conveyor');
  }
  return '';
}
function lesson(s:Run,stage:'pairs'|'singles',crew:string[]){
  const t=s.tutorial!;Object.assign(t,{stage,posts:['','','',''],crew});
  cut(s,'conveyor');
  say(s,'STILETTO',stage==='pairs'?'Two workers, four stations. Give each of them two.':'One worker per station. Post all four.','conveyor');
}
// While two workers share four posts, send the actual bodies to the next carrier.
// Only one load is fed at a time so a returning operator never strands a handoff.
export function movePairs(s:Run){
  const t=s.tutorial!;
  if(!['demonstration','card','visit','two-cleared'].includes(t.stage))return;
  const i=s.line!.cells.findIndex(j=>!!j&&!j.due&&!j.done);
  if(i>=0&&t.posts[i]&&s.tasks[t.posts[i]].station!==i)assign(s,t.posts[i],i);
}
export function runTutorial(s:Run,check:()=>void,release:(id:string,why:string)=>void){
  const t=s.tutorial!,arrived=bayside(s);
  const speak=(who:string,words:string,room:Room)=>say(s,who,words,room);
  switch(t.stage){
    case 'arrival':
      if(s.dialogue.authorized.length<2)check();
      if(arrived.length===2)lesson(s,'pairs',arrived);
      break;
    case 'demonstration':
      if(s.completed.length>t.baseline){t.stage='card';cut(s,'security');}
      break;
    case 'card':
      if(!s.case||s.case.status==='open'){check();break;}
      t.stage='visit';t.cue=0;t.due=s.tick+35;go(s,'STILETTO',gate);
      break;
    case 'visit':
      if(s.tick<t.due||dist(s.world.agents.STILETTO.position,gate)>180)break;
      if(t.cue++===0){speak('STILETTO','I asked for a crew. Where are they?','security');t.due=s.tick+52;break;}
      speak('LIMEN','Two more. The rest stay here until I finish their checks.','security');
      t.stage='two-cleared';t.due=s.tick+65;go(s,'STILETTO',workPost);break;
    case 'two-cleared':
      if(s.tick<t.due)break;
      if(s.queue.length&&['jo','kit'].includes(s.queue[0])){
        release(s.queue[0],'Cleared by LIMEN');t.due=s.tick+22;break;
      }
      if(['jo','kit'].every(id=>arrived.includes(id))){
        lesson(s,'singles',s.dialogue.passages.filter(id=>availableWorker(s,id)));
      }
      break;
    case 'production':
      if(s.completed.length-t.baseline>=2){
        t.stage='return';t.cue=0;go(s,'STILETTO',gate);cut(s,'security');
        speak('LIMEN','Is that scuff on the photograph, or on your face?','security');
      }
      break;
    case 'return':
      if(dist(s.world.agents.STILETTO.position,gate)>180)break;
      speak('STILETTO','EVERYBODY ON THE LINE! NOW!','security');
      t.stage='release';t.due=s.tick+44;break;
    case 'release':
      if(s.tick<t.due)break;
      if(s.queue.length){release(s.queue[0],'Released to Conveyor');t.due=s.tick+9;break;}
      go(s,'STILETTO',workPost);
      if(!s.dialogue.authorized.every(id=>availableWorker(s,id)))break;
      cut(s,'conveyor');t.stage='live';t.due=s.tick;
      break;
    case 'live':
      if(s.tick>=t.due&&arrived.length){
        speak('STILETTO','See that lot by the door? Give them work.','conveyor');t.due=s.tick+220;
      }
      break;
  }
}
export const tutorialHint=(t:Tutorial)=>t.stage==='pairs'?'Give each operator two stations to cover.':t.stage==='singles'?'Assign a different operator to each station.':t.stage==='live'?'More crew at the entrance. Assign them while the line runs.':'';
