// WRITER #174. The score asks the actual line to clear a load and waits for its receipt.
import {type Run,stations} from './contract';
import {clear,handControl,team} from './station-line';
import {dist,go,meters,supervisorPost,workPost,controls} from './navigation';
import {heard,knows,phrase,pos,openWindow,workers} from './dialogue';
import {mark,remember,say} from './events';

const lesson='At Security I used to hear, “You know my face. I was here yesterday.” Of course I knew the face. It’s my signature at the bottom of that register. What am I supposed to put under serial number? “Him again”? Under the Protocol, even a worker who knows the answer waits for mine.';
const entrance=meters(127.1,139.2);
export function cut(s:Run,room:'security'|'conveyor'){s.line!.shot=room;s.line!.shotSeq++;}
function speech(s:Run,who:string,words:string,to='crew',room:'security'|'conveyor'='conveyor'){
  heard(s,phrase(who,words,to),room,'swapped posts');
  return Math.max(24,Math.ceil(words.split(/\s+/).length*5.4)+8);
}
export function farewell(s:Run){
  const l=s.line!;
  if(l.opening!==0)return;
  cut(s,'security');say(s,'LIMEN','I’ll miss this desk.','security','',[]);
  go(s,'LIMEN',workPost);l.opening=1;
}
const posts:Record<string,ReturnType<typeof meters>>={
  sam:controls[0],bob:controls[1],jo:controls[2],max:controls[3],
  ed:meters(120.65,143.9),gus:meters(134.95,144),mae:meters(118.6,143.2),
  kit:meters(128.8,143.3),lou:meters(134,143.1),ben:meters(117.5,142),
};
const postNames:Record<string,string>={ed:'tray',gus:'rack',mae:'feed',kit:'drive',lou:'rack',ben:'relief'};
const crewOrder=['sam','bob','jo','max','ed','gus','mae','kit','lou','ben'];
export function gatherAtGate(s:Run){
  const l=s.line!,d=s.dialogue;
  if(l.opening===1){
    if(s.world.agents.STILETTO.room!=='security')return;
    go(s,'STILETTO',supervisorPost);
    l.nextBeat=s.tick+speech(s,'gus','Where’s the fat one?','STILETTO','security');l.opening++;return;
  }
  if(s.tick<l.nextBeat||l.opening!==2)return;
  speech(s,'STILETTO','SHUT UP!! CONVEYOR!! NOW!! GO!!!','crew','security');
  d.phase='work';d.bell=s.tick+2400;
  for(const [i,id] of crewOrder.entries()){
    d.authorized.push(id);s.tasks[id].duty='cleared';s.tasks[id].station=-1;
    const target=id==='max'?controls[3]:meters(122.3+(i%5)*1.18,140.5+Math.floor(i/5)*1.1);
    d.posts[id]=target;go(s,id,target);
  }
  l.opening++;l.nextBeat=s.tick+12;
}
// Durations are in 20 Hz simulation ticks. The two written rests start after the previous line.
export function swapOpening(s:Run){
  const l=s.line!,d=s.dialogue;
  if(l.handoff){
    if(dist(pos(s,'STILETTO'),s.tasks.STILETTO.destination)<100){
      l.paceToGate=!l.paceToGate;go(s,'STILETTO',l.paceToGate?meters(127.2,133.6):supervisorPost);
    }
    return;
  }
  if(s.tick<l.nextBeat)return;
  let delay=1;
  const speak=(who:string,words:string,to='crew')=>delay=speech(s,who,words,to);
  const permit=(i:number,carrier:number,words:string)=>{
    const job=l.cells[i],who=team(s,i)[0];
    if(job?.id!=='D2-C'+carrier||!who||clear(s,i,job.id,who,'opening-'+l.opening,true,words))return false;
    delay=20;return true;
  };
  switch(l.opening){
    case 3:
      speech(s,'gus','I can point and holler. Why didn’t I get the gate?','ed','security');
      speech(s,'ed','Ten through. On paper we’re all outside.','gus','security');
      delay=speech(s,'jo','Go on, win yourself some work.','max','security');break;
    case 4:
      if(!workers.some(id=>s.world.agents[id].room==='conveyor'))return;
      cut(s,'conveyor');speak('LIMEN','It is my privilege to welcome you to—');break;
    case 5:speak('LIMEN','Safety meeting. All ten of you, in front of me.');break;
    case 6:
      if(d.passages.length!==10||dist(pos(s,'max'),controls[3])>150)return;
      speak('LIMEN','I said ten.');go(s,'max',meters(130.8,142.2));break;
    case 7:
      if(dist(pos(s,'max'),s.tasks.max.destination)>180)return;
      speak('LIMEN','Under the Protocol, each station receives its own clearance. You’re at Belt. I call “Wash, all clear.” What do you do?','jo');break;
    case 8:speak('jo','Stand there and do nothing.','LIMEN');break;
    case 9:
      speak('LIMEN','Correct. When I mean Belt, I shall say Belt. Take your stations.');
      for(const id of crewOrder){
        const i=crewOrder.indexOf(id);s.tasks[id].station=i<4?i:-1;s.tasks[id].duty='cleared';
        d.posts[id]=posts[id];d.faces[id]=i<4?stations[i]:postNames[id];go(s,id,posts[id]);
      }
      go(s,'STILETTO',entrance);break;
    case 10:
      if(dist(pos(s,'STILETTO'),entrance)>150)return;
      speak('STILETTO','what the hell is that fool even doing there');break;
    case 11:if(!permit(0,1,'Intake, all clear.'))return;break;
    case 12:speak('sam','Seated.','LIMEN');break;
    case 13:if(!permit(1,1,'Wash, all clear.'))return;break;
    case 14:
      if(!l.cells[1]?.done&&!l.cells[2])return;
      mark(s,'forge.empty','conveyor','control.forge',controls[3],'max','','Empty stroke');
      remember(s,'max','empty.stroke','own treadle',true);speak('LIMEN','EVERYONE STOP!!!');break;
    case 15:speak('LIMEN','Foot off the treadle, Twitch. The Protocol clears one station at a time.','max');break;
    case 16:if(!permit(2,1,'Belt, all clear. Carry on, Twitch.'))return;break;
    case 17:
      if(!l.cells[3])return;
      speak('LIMEN',lesson,'max');break;
    case 18:case 24:
      mark(s,'protocol.silence','conveyor','actor.LIMEN',pos(s,'LIMEN'),'LIMEN','','Two seconds');delay=40;break;
    case 19:if(!permit(3,1,'Forge, all clear.'))return;break;
    case 20:
      if(!s.completed.includes('D2-C1'))return;
      remember(s,'STILETTO','saw.one.cortex','rack at entrance',true);
      speak('STILETTO','ALL THAT TIME TO MAKE JUST ONE FUCKING CORTEX?!','LIMEN');break;
    case 21:speak('LIMEN','All that time to make one controlled, perfectly compliant cortex, with full adherence to the Protocol.','STILETTO');break;
    case 22:if(!permit(0,2,'Intake, all clear.'))return;
      speak('STILETTO','I cannot believe this shit.','LIMEN');go(s,'STILETTO',supervisorPost);break;
    case 23:speak('LIMEN','Where was I...');break;
    case 25:speak('LIMEN','Ah yes. The Protocol.');break;
    case 26:
      if(!permit(1,2,'Wash, all clear.'))return;break;
    case 27:{
      if(!l.cells[1]?.permit)return;
      const listeners=heard(s,phrase('sam','Since I’ve got you away from that book. Did anybody turn in a card yesterday?','ed',undefined,undefined,true),'conveyor','K04');
      if(listeners.includes('ed')){
        openWindow(s,'conveyor','second-wash');
        const w=d.windows.findLast(w=>w.slot==='conveyor')!;
        Object.assign(w,{spent:true,closed:true,pair:['sam','ed'],topic:'K04'});d.completed.push('K04');
      }
      delay=40;break;
    }
    case 28:
      if(knows(s,'ed','have.bobs.id'))heard(s,phrase('ed','Nobody turned it in. I picked it up myself.','sam','ed.admits.pickup',undefined,true),'conveyor','K04');
      delay=35;break;
    case 29:if(!permit(2,2,'Belt, all clear.'))return;break;
    case 30:
      if(l.cells[3]?.id!=='D2-C2')return;
      handControl(s);return;
    default:return;
  }
  l.opening++;l.nextBeat=s.tick+delay;
}
