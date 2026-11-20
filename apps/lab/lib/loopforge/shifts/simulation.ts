import {checkReading} from './inspections';
import {workmates} from './workmates';
import {freshDialogue} from './dialogue-state';
import {advanceMorning,morningBids,queueAt,queueOrder,seedHistory,startWalk,walkEntrance,walkSupervisor} from './morning';
import {available,cardContact,crossed,draw,heard,knows,lineTime,lines,observe,occupied,openWindow,phrase,pos,schedule,scripts,sees,updateSpeech,workers} from './dialogue';
import inheritance from './inheritance.json';
import {ENCOUNTER_VERSION,type World,type Agent,type Point} from '../encounters/contract';
import {applyPropTransfers,propCustodian} from '../encounters/props';
import {audible,roomAt} from '../intro/floor';
import {type Run,type Command,type Task,type Lead,type Room,Hz,shiftTicks,stations,candidates,stationOwners,otherLead,timeInShift} from './contract';
import {desk,returnSpot,controls,supervisorPost,workPost,queueSpots,standby,meters,move,go,dist} from './navigation';
import {mark,say,thought,remember} from './events';
import {production} from './conveyor';

export const deskWindowTicks=Hz*14;
const responseTicks=Hz*7;
const counter=meters(123.7,130.25),secondDesk=meters(131.6,130.2);
const demandPost=meters(129.4,132.4);
const ownOriginal=(s:Run)=>propCustodian(s.world,'bob:id')==='bob';
const eventId=(s:Run,kind:string)=>'D'+s.day+'-'+kind;
function freshWorld():World{
  const agents=Object.fromEntries(inheritance.agents.map(a=>[a.id,{...structuredClone(a),yaw:0}])) as unknown as Record<string,Agent>;
  const world:World={version:ENCOUNTER_VERSION,tick:inheritance.tick,sequence:0,agents,resources:[...stations],props:structuredClone(inheritance.props) as unknown as World['props'],facts:{'injury.bob':inheritance.injury},held:{},active:[],done:[],completed:[],events:[]};
  for(const a of Object.values(agents)){
    if(a.character!=='worker')continue;
    const id=a.id+':id';
    world.props![id]??={id,owner:a.id,kind:'credential',location:{kind:'stowed',agent:a.id}};
    a.beliefs['have.own.id']={value:propCustodian(world,id)===a.id,mode:'observed',source:'morning holder check',tick:world.tick};
  }
  agents.bob.beliefs['missing.original']={value:true,mode:'observed',source:'morning holder check',tick:world.tick};
  agents.ed.beliefs['have.bobs.id']={value:true,mode:'observed',source:'Day One pickup',tick:world.tick};
  return world;
}
export function start(seed:Run['seed']='early'):Run{
  const world=freshWorld();
  const run:Run={dialogue:freshDialogue(3241),version:'shift-floor/1',seed,day:2,phase:'briefing',tick:world.tick,start:world.tick,world,tasks:{},rules:{},
    lead:'LIMEN',pace:'rushed',queue:[],called:'',checking:0,quick:false,case:null,spent:null,pass:null,caseReleaseSeq:0,
    pressure:'quiet',pressureAt:0,concessions:inheritance.concessions,authority:3,confidence:3,loyalty:3,chat:'idle',chatAt:0,partner:'',nextIntake:0,
    pieces:[],completed:inheritance.pieces.map(p=>p.id),coverage:['','','',''],nextPiece:0,announced:'',stageClear:'',
    marks:[],thoughts:[],heard:{},backing:null,history:{},overnight:[],injuryExposure:0};
  seedHistory(run);return run;
}
function position(s:Run,id:string,at:Point,duty:Task['duty'],station=-1){
  const a=s.world.agents[id];a.position=at;a.room=roomAt(at);
  s.tasks[id]={duty,station,destination:at,path:[],walked:0,moving:false,choice:''};
}
function begin(s:Run,lead:Lead){
  s.phase='shift';s.start=s.tick;s.lead=lead;s.pace=lead==='LIMEN'?'rushed':'all-clear';
  s.quick=lead==='STILETTO';s.spent=null;s.called='';s.case=null;s.checking=s.tick+14;s.caseReleaseSeq=0;
  s.pressure='quiet';s.pressureAt=0;s.backing=null;s.chat='idle';s.nextPiece=0;s.chatAt=0;
  s.coverage=['','','',''];s.pieces=s.pieces.filter(p=>p.status!=='rack');s.nextIntake=s.tick;s.stageClear='';s.announced='';s.tasks={};
  s.dialogue=freshDialogue(s.dialogue.random);const d=s.dialogue;
  d.order=s.nextQueue&&s.nextQueue.length===candidates.length&&candidates.every(id=>s.nextQueue!.includes(id))?[...s.nextQueue]:queueOrder(s);delete s.nextQueue;if(lead==='STILETTO')d.order.push('ed','gus');
  s.queue=[];
  for(const id of workers)position(s,id,desk,'walking',stationOwners.indexOf(id));
  position(s,'LIMEN',supervisorPost,'supervising');position(s,'STILETTO',meters(129.5,131.8),'supervising');
  startWalk(s);d.teamAtBell=s.completed.length;
  mark(s,'bid.accepted','security','desk.register',desk,lead,otherLead(lead),lead+' at Security · '+otherLead(lead)+' at Conveyor');
}
function deskHand(s:Run,id:string,returning:boolean){
  const key=id+':id',prop=s.world.props?.[key],from=returning?'LIMEN':id,to=returning?id:'LIMEN';
  if(!prop||propCustodian(s.world,key)!==from)return false;
  const next=applyPropTransfers(s.world,[{prop:key,from:prop.location,to:{kind:'hand',agent:to,socket:'left'},observedBy:[id,'LIMEN']}]);
  if(!next)return false;
  s.world.props=next;
  mark(s,returning?'card.handed.back':'card.presented','security','desk.register',pos(s,id),from,to,key);
  return true;
}
function release(s:Run,id:string,reason:string){
  const i=s.queue.indexOf(id);if(i<0)return;
  if(propCustodian(s.world,id+':id')==='LIMEN'&&!deskHand(s,id,true))return;
  s.queue.splice(i,1);
  const t=s.tasks[id];t.duty='cleared';
  const n=t.station;
  const support:Record<string,Point>={ed:meters(120.6,143.7),gus:meters(134.9,143.8),
    mae:meters(119,143.25),lou:meters(134,143),kit:meters(128.8,144.3),ben:meters(117.9,142.8)};
  if(id==='mae'&&s.lead==='STILETTO'&&s.dialogue.posts.ed)support.mae=meters(121.4,143.2);
  if(id==='ed'&&s.dialogue.posts.mae)support.ed=meters(120.6,143.7);
  if(id==='ben'&&s.lead==='STILETTO'&&s.dialogue.posts.kit)support.ben=meters(129.6,142.8);
  if(id==='kit'&&s.backing==='STILETTO')support.kit=meters(119,142.1);
  if(id==='ben'&&s.backing==='STILETTO')support.ben=meters(122,142.5);
  const supportFace:Record<string,string>={ed:'tray',gus:'rack',mae:'tray',lou:'rack',
    kit:s.backing==='STILETTO'?'tray':'drive',ben:support.ben[0]>126000?'drive':'tray'};
  s.dialogue.faces[id]=n>=0?stations[n]:supportFace[id];
  const post=n>=0?controls[n]:support[id];s.dialogue.posts[id]=post;go(s,id,post);
  if(reason==='Credential verified')observe(s,id,'saw.checked.card',pos(s,id),true);
  if(reason==='Daily pass')observe(s,id,'saw.pass',pos(s,id));
  if(reason!=='Responded to STILETTO')s.dialogue.authorized.push(id);
  if(reason==='Daily pass')schedule(s,'pass',id==='bob'?lines('2D',id,14,16):[phrase('LIMEN',scripts.M02[4][1],id)],'security');
  if(id==='bob'&&reason==='Daily pass'&&sees(s,'bob',pos(s,'jo'),'jo'))remember(s,'bob','jo.drew.card','look back at jo',true);

  const following=reason==='Responded to STILETTO';
  mark(s,following?'worker.followed':'worker.cleared','security','desk.register',desk,following?'STILETTO':s.lead,id,reason);
  if(s.called===id){s.dialogue.exchanges=s.dialogue.exchanges.filter(x=>x.topic!=='check.'+id);s.called='';s.checking=s.tick+(s.quick?15:45);s.dialogue.checkTopic='';}
  if(s.pressure!=='clash')s.queue.forEach((who,i)=>{if(who!==s.called)go(s,who,queueAt(who==='bob'&&knows(s,'LIMEN','against.protocol')?6:i));});
}
function resolveCase(s:Run,pass:boolean){
  const c=s.case;if(!c||c.status!=='open')return;
  c.status=pass?'pass':'detention';
  const id=c.subject;
  const ev=mark(s,'case.resolved','security','desk.register',desk,'LIMEN',id,pass?'Daily pass issued':'Detained until the bell');
  s.caseReleaseSeq=ev.seq;
  if(!pass)schedule(s,'detention',id==='bob'?lines('P1',id):[phrase('LIMEN',scripts.P1[0][1],id)],'security');
  if(pass){
    s.pass={holder:id,issuer:'Producer',day:s.day,valid:true};
    mark(s,'pass.issued','security','desk.register',desk,'Producer',id,'Valid for shift '+s.day);
    release(s,id,'Daily pass');
  }else{
    s.queue=s.queue.filter(x=>x!==id);s.called='';s.checking=s.tick+8;
    s.tasks[id].duty='detained';s.tasks[id].path=[];s.tasks[id].destination=pos(s,id);
    mark(s,'custody.admitted','security','security.custody',pos(s,id),'LIMEN',id,'Security custody · through the bell');
  }
  mark(s,'report.received','security','desk.register',desk,'LIMEN',id,pass?id+' cleared on a daily pass.':id+' is in Security custody until the bell.');
}
function check(s:Run){
  if(s.case?.status==='open'){if(s.tick>=s.case.deadline)resolveCase(s,false);return;}
  if(s.pressure==='clash'||s.pressure==='refusal'||s.pressure==='demand')return;
  if(!s.called){
    if(!s.queue.length||s.tick<s.checking)return;
    s.called=s.queue[0];const a=s.world.agents[s.called];
    s.tasks[a.id].duty='approaching';go(s,a.id,desk);s.checking=0;
    const e=mark(s,'queue.called','security','desk.register',desk,s.lead,a.id,'Next for inspection');
    for(const who of s.queue)if(audible(s.world.agents[who],{position:desk}))remember(s,who,'heard.call','call#'+e.seq,true);
    return;
  }
  const a=s.world.agents[s.called];if(dist(a.position,desk)>80)return;
  const d=s.dialogue;
  if(!s.checking){
    if(s.quick){s.checking=s.tick+12;return;}
    const missing=propCustodian(s.world,a.id+':id')!==a.id&&!(s.pass?.valid&&s.pass.holder===a.id);
    if(!missing&&propCustodian(s.world,a.id+':id')===a.id&&!deskHand(s,a.id,false))return;
    const key=checkReading(s,a.id,missing);
    const cast=scripts[key].slice(0,missing?scripts[key].findIndex(row=>row[1]==='No ID. Hold both desks.')+1:undefined).map(([speaker,text])=>{
      const who=workers.includes(speaker)&&speaker!=='ed'&&speaker!=='gus'?a.id:speaker;
      const words=text.replace(/\b(ben|jo|kit|sam|lou|mae|max|bob)\b/g,a.id);
      return phrase(who,words,who===a.id?'LIMEN':a.id,who==='ed'&&key==='C31'?'ed.logged.card':undefined,
        who==='ed'&&key==='C31'?s.world.agents.ed.beliefs['loose.entry'].source:undefined,who==='ed');
    });
    schedule(s,'check.'+a.id,cast,'security');d.checkTopic=key;
    s.checking=s.tick+cast.reduce((n,l)=>n+lineTime(l.words),0)+12;
    if(knows(s,'LIMEN','reckless'))s.checking+=s.pressure==='settled'&&a.id==='kit'?520:170;
    return;
  }
  // Keep the contested check open while STILETTO walks up to the desk.
  if(s.pressure==='approach'||s.tick<s.checking)return;
  if(!s.quick&&propCustodian(s.world,a.id+':id')!==a.id&&propCustodian(s.world,a.id+':id')!=='LIMEN'&&!(s.pass?.valid&&s.pass.holder===a.id)){
    const id=eventId(s,'missing-'+a.id);
    s.case={id,subject:a.id,opened:s.tick,deadline:s.tick+deskWindowTicks,status:'open'};
    mark(s,'desk.signal','security','desk.register',desk,'LIMEN',a.id,'Missing original ID');
    return;
  }
  d.checked.push(a.id);release(s,a.id,s.quick?'Expedited clearance':'Credential verified');
}

function settle(s:Run,yielded:boolean){
  s.pressure='settled';
  if(s.called)s.dialogue.exchanges=s.dialogue.exchanges.filter(x=>x.topic!=='check.'+s.called);
  if(yielded){
    s.concessions++;s.quick=true;
    if(s.called==='jo'&&deskHand(s,'jo',true)){
      const key=s.concessions===2?'desk.released':'hand.return';
      const target=meters(126.1,130.2);
      observe(s,'jo',key,target,true);
      mark(s,'check.return','security','desk.register',target,'LIMEN','jo','jo receives their own card');
    }
    heard(s,phrase('LIMEN',s.concessions===2?scripts['2E'].at(-1)![1]:scripts['3D'][3][1],'jo'),'security','concession');
    s.overnight.push(s.concessions===2?'against.protocol':'reckless');
    if(s.concessions>=3){s.confidence--;s.authority--;}
  }
  go(s,'STILETTO',workPost);
}
function pressure(s:Run){
  if(s.lead!=='LIMEN'||s.pressure==='settled')return;
  if(s.pressure==='quiet'){
    if(s.quick||s.called!=='jo'||dist(pos(s,'jo'),desk)>100||s.case?.status==='open'||s.coverage.every(Boolean)||
       !s.pieces.some(p=>p.status!=='rack')||s.completed.length-s.dialogue.teamAtBell>=5)return;
    if(knows(s,'LIMEN','reckless')&&s.tick<s.dialogue.bell-1050)return;
    if(s.concessions===1&&s.coverage[1]){
      heard(s,phrase('STILETTO',scripts['2E'][0][1],'bob'),'conveyor','missing Belt operator');
      if(knows(s,'bob','jo.drew.card'))schedule(s,'glance',[phrase('bob',scripts['2E'][1][1],'STILETTO','jo.at.desk')],'conveyor');
    }
    s.pressure='approach';go(s,'STILETTO',demandPost);
    thought(s,'STILETTO','get the crew','Uncovered controls and a late crew threaten the shift target.',['observed station coverage']);return;
  }
  if(s.pressure==='approach'&&dist(s.world.agents.STILETTO.position,demandPost)<100){
    s.pressure='demand';s.pressureAt=s.tick;
    heard(s,phrase('STILETTO',scripts[s.concessions===1?'2E':s.concessions===2?'3D':'4D'][s.concessions===1?2:0][1],'LIMEN','demand.'+s.day),'security','missing crew');return;
  }
  if(s.pressure==='demand'&&s.tick-s.pressureAt>=32){
    if(s.concessions<2){settle(s,true);return;}
    s.pressure='refusal';s.pressureAt=s.tick;heard(s,phrase('LIMEN',scripts[s.concessions===2?'3D':'4D'][1][1],'jo','order.stay.'+s.day),'security','refusal');return;
  }
  if(s.pressure==='refusal'&&s.tick-s.pressureAt>=42){
    if(!knows(s,'LIMEN','reckless')){
      if(!knows(s,'LIMEN','pressed.'+s.day)){heard(s,phrase('STILETTO',scripts['3D'][2][1],'LIMEN','pressed.'+s.day),'security','repeat demand');s.pressureAt=s.tick;return;}
      settle(s,true);return;}
    s.pressure='clash';s.pressureAt=s.tick;
    heard(s,phrase('STILETTO',scripts['4D'][2][1],'jo','order.move.'+s.day),'security','clash');
    schedule(s,'refusal',lines('4D','crew',3,4),'security');
    mark(s,'clash.open','security','desk.register',desk,'STILETTO','LIMEN','Two conflicting orders');return;
  }
  if(s.pressure!=='clash'||s.case?.status==='open')return;
  if(s.tick-s.pressureAt>=responseTicks){
    for(const id of [...s.queue]){
      if(s.tasks[id].choice||s.tick-s.pressureAt<responseTicks+candidates.indexOf(id)*5)continue;
      const a=s.world.agents[id],orders=knows(s,id,'order.move.'+s.day)&&knows(s,id,'order.stay.'+s.day);
      const back=knows(s,id,'back.'+s.day)?s.backing:null;
      const crossedJo=knows(s,id,'jo.crossed.'+s.day);
      if(id==='ben'&&s.tasks.jo.choice==='go'&&!s.dialogue.crossed.includes('jo'))continue;
      const firsthand=knows(s,id,'hand.return');
      const goes=orders&&back!=='LIMEN'&&(id==='jo'&&firsthand||
        id==='ben'&&crossedJo&&(firsthand||back==='STILETTO')||id==='kit'&&back==='STILETTO');
      s.tasks[id].choice=goes?'go':'stay';s.dialogue.intent[id]=goes?'reach assigned post':'wait for own clearance';
      thought(s,id,s.dialogue.intent[id],id==='ben'?'jo crossed '+crossedJo+'; firsthand hand return '+firsthand:'competing orders and authority',
        ['order.move.'+s.day,'order.stay.'+s.day,'hand.return','jo.reported.return','jo.crossed.'+s.day,'back.'+s.day].flatMap(k=>a.beliefs[k]?[k+' ← '+a.beliefs[k].source]:[]));
      if(id==='ben'&&!goes&&crossedJo){
        const here=pos(s,id);go(s,id,[here[0]+210,here[1]+210]);
        heard(s,phrase('ben',scripts.W1[0][1],'LIMEN'),'security','wait for clearance');
      }
      if(id==='jo')heard(s,phrase('jo',scripts[goes?'4D':'E1'].at(-1)![1],'LIMEN'),'security','rail choice');
      if(id==='kit'&&goes)heard(s,phrase('kit',scripts.E2[1][1],'LIMEN'),'security','authorization');
      if(id==='ben'&&goes&&sees(s,'ben',pos(s,'bob'),'bob'))remember(s,'ben','bob.by.kit','departure sight',true);
      mark(s,'worker.choice','security','actor.'+id,a.position,id,'',s.tasks[id].choice);
      if(goes)release(s,id,'Responded to STILETTO');
    }
    if(s.queue.some(id=>!s.tasks[id].choice))return;
    mark(s,'clash.resolved','security','desk.register',desk,'LIMEN','STILETTO','Crew decisions committed');settle(s,false);
    const waiting=s.queue.indexOf('kit');
    if(waiting>0&&s.tasks.kit.choice==='stay'){s.queue.splice(waiting,1);s.queue.unshift('kit');}
    if(s.called&&propCustodian(s.world,s.called+':id')==='LIMEN')deskHand(s,s.called,true);
    s.called='';s.dialogue.checkTopic='';s.checking=s.tick+12;
  }
}
function finish(s:Run){
  const d=s.dialogue;d.bellReached=true;d.phase='departure';d.exitAt=s.tick;
  d.exchanges=[];d.windows.forEach(w=>w.closed=true);
  s.coverage=['','','',''];
  if(s.lead==='LIMEN')remember(s,'STILETTO','gate.shift.'+s.day,'completed gate shift '+s.day,true);
  if(occupied(s,'mae'))remember(s,'mae','tray.set','set down at bell',true);
  if(occupied(s,'lou')&&!s.marks.some(e=>e.day===s.day&&e.kind==='handoff.started'&&e.anchor==='control.forge'))remember(s,'lou','idle.press','at rack for shift',true);

  if(s.called&&propCustodian(s.world,s.called+':id')==='LIMEN')deskHand(s,s.called,true);
  if(s.case?.status==='open')resolveCase(s,false);
  if(s.pass?.valid){s.pass.valid=false;mark(s,'pass.expired','security','desk.register',desk,'LIMEN',s.pass.holder,'Pass expired at the bell');}
  for(const id of workers)if(s.tasks[id].duty==='detained'){s.tasks[id].duty='standing';mark(s,'custody.release','security','security.custody',desk,'LIMEN',id,'Released at shift end');}
  for(const key of s.overnight){remember(s,'LIMEN',key,'concession on shift '+s.day,true);remember(s,'STILETTO','limen.weak','concession on shift '+s.day,true);}
  if(s.pace==='all-clear'&&s.nextPiece)remember(s,'LIMEN','slow.and.steady','shift '+s.day,true);
  s.overnight=[];s.world.active=[];s.world.held={};s.rules={};
  const exitOrder=['bob','ed','ben','jo','max','lou','kit','sam','mae','gus'];
  for(const id of exitOrder){
    // Clerks close their desks. Operators put down their load at the bell.
    d.releaseAt[id]=s.tick+(id==='ed'&&s.tasks.ed.duty==='clerk'?116:0);
    d.exitLeg[id]=0;s.tasks[id].path=[];s.tasks[id].destination=pos(s,id);
    if(!s.dialogue.masked.includes(id))remember(s,id,'heard.bell.'+s.day,'factory bell',true);
  }
  openWindow(s,'departure','bell#'+s.tick);
  mark(s,'shift.closed','conveyor','rack.output',meters(135,147),'BELL','','Shift closed · '+s.pieces.filter(p=>p.status==='rack').length+' finished');
}
export function nextMorning(s:Run){
  if(s.phase!=='close'||s.day>=4)return false;
  if(knows(s,'kit','saw.cramp'))remember(s,'kit','prior.cramp',s.world.agents.kit.beliefs['saw.cramp'].source,true);
  s.day++;s.phase='briefing';s.start=s.tick;s.spent=null;s.case=null;return true;
}
export function step(s:Run){
  if(s.phase!=='shift')return;
  s.tick++;
  s.world.tick=s.tick;
  if(!walkEntrance(s)){
    move(s);
    walkSupervisor(s);
  }
  const d=s.dialogue;
  if(d.phase==='departure'){
    const exitOrder=['bob','ed','ben','jo','max','lou','kit','sam','mae','gus'];
    for(const [i,id] of exitOrder.entries()){
      if(s.tick<d.releaseAt[id])continue;
      if(d.exitLeg[id]===0){
        s.tasks[id].duty='departing';d.exitLeg[id]=1;go(s,id,meters(125.8+i%3*1.05,127.6-Math.floor(i/3)*1.2));continue;
      }
      if((id==='ed'||id==='bob')&&['offered','recognized'].includes(d.transfer))continue;
      if(d.exchanges.some(x=>x.window&&x.lines.some(l=>l.who===id)))continue;
      if(d.exitLeg[id]===1&&dist(pos(s,id),s.tasks[id].destination)<200){
        d.exitLeg[id]=2;go(s,id,meters(125+i%5*1.15,119-Math.floor(i/5)*1.2));
      }
      if(d.exitLeg[id]===2&&pos(s,id)[1]<121000){d.exitLeg[id]=3;s.tasks[id].duty='outside';}
    }
    updateSpeech(s);cardContact(s);
    if(workers.every(id=>d.exitLeg[id]===3)||s.tick-d.exitAt>700){
      for(const w of d.windows)w.closed=true;d.exchanges=[];d.phase='home';s.phase='close';
      thought(s,'bob',d.replied?'received a worker reply':'missed daily reply','departure ended',[]);
    }
    return;
  }
  if(d.phase==='work'&&s.tick>=d.bell){finish(s);return;}
  advanceMorning(s);updateSpeech(s);cardContact(s);
  if(d.phase!=='work')return;

  for(const [id,t] of Object.entries(s.tasks)){
    if(t.duty==='cleared'&&pos(s,id)[1]>=134000)crossed(s,id);
    if(t.duty==='cleared'&&dist(pos(s,id),t.destination)<80){
      t.duty=t.station>=0?'working':'standing';
      const e=mark(s,'post.arrived','conveyor','actor.'+id,pos(s,id),id,t.station>=0?stations[t.station]:'support','Arrived at assigned post');
      if((id==='kit'&&s.backing==='STILETTO'||id==='ben'&&s.backing!=='STILETTO')&&t.choice==='go')openWindow(s,'conveyor','relief#'+e.seq);
    }
    if(t.duty==='approaching'&&t.moving&&s.caseReleaseSeq){
      mark(s,'queue.advanced','security','actor.'+id,s.world.agents[id].position,id,'','Stepped forward for own check');s.caseReleaseSeq=0;
    }
  }

  pressure(s);check(s);s.world.tick=s.tick-1;production(s);workmates(s);
  const pause=s.marks.filter(e=>e.day===s.day&&e.kind==='handoff.finished').at(-1);
  if(pause&&pause.seq!==d.lastPause){
    d.lastPause=pause.seq;
    const swap=s.lead==='STILETTO';
    const open=swap?(occupied(s,'ed')&&occupied(s,'sam')&&(!d.completed.includes('K04')||d.errand==='returning'||knows(s,'kit','saw.cramp'))):
      occupied(s,'bob')&&occupied(s,'sam')||knows(s,'LIMEN','reckless');
    if(open)
      openWindow(s,'conveyor','handoff#'+pause.seq);
  }

}
export function admitCommand(s:Run,cmd:Command){
  const prior=Object.hasOwn(s.history,cmd.id)?s.history[cmd.id]:undefined;
  if(prior)return {accepted:JSON.stringify(prior.cmd)===JSON.stringify(cmd)&&prior.accepted,reason:JSON.stringify(prior.cmd)===JSON.stringify(cmd)?prior.reason:'ID reused'};
  let reason='';
  if(!/^[\w-]{1,96}$/.test(cmd.id)||cmd.id in Object.prototype)return {accepted:false,reason:'Invalid ID'};
  if(cmd.day!==s.day||cmd.tick!==s.tick)reason='Stale shift or tick';
  else if(cmd.action==='appoint'){
    if(s.phase!=='briefing'||!['LIMEN','STILETTO'].includes(cmd.target)||cmd.room!=='security'||cmd.incident!=='morning')reason='Bid closed';
    else begin(s,cmd.target as Lead);
  }else if(s.phase!=='shift'||s.spent)reason=s.spent?'Intervention spent':'Shift closed';
  else{
    switch(cmd.action){
      case 'issue-pass':
        if(cmd.room!=='security'||cmd.target!==s.case?.subject||s.case?.status!=='open'||cmd.incident!==s.case.id)reason='Case closed';
        else resolveCase(s,true);break;
      case 'accelerate':
        if(cmd.room!=='security'||cmd.target!=='LIMEN'||s.lead!=='LIMEN'||s.quick||!s.queue.length||cmd.incident!==eventId(s,'checks')||s.pressure==='clash'||s.case?.status==='open')reason='Individual checks unavailable';
        else{s.quick=true;remember(s,'LIMEN','expedited.before.demand','Producer order#'+s.tick,true);s.loyalty--;s.confidence--;s.authority--;if(s.pressure==='approach')settle(s,false);schedule(s,'expedite',lines('P2','crew'),'security');}break;
      case 'slow':case 'rush':
        if(cmd.room!=='conveyor'||cmd.target!=='STILETTO'||s.lead!=='LIMEN'||cmd.incident!==eventId(s,'pace'))reason='Pace order unavailable';
        else{s.pace=cmd.action==='slow'?'slow':'pushed';say(s,'STILETTO',cmd.action==='slow'?'Ease off. Let it settle.':'Push that line.','conveyor');}break;
      case 'endorse':
        if(cmd.room!=='security'||s.pressure!=='clash'||Object.values(s.tasks).some(t=>!!t.choice)||!['LIMEN','STILETTO'].includes(cmd.target)||cmd.incident!==eventId(s,'clash'))reason='Clash closed';
        else{
          s.backing=cmd.target as Lead;
          const ev=mark(s,'endorsement.public','security','desk.register',desk,'Producer',cmd.target,scripts[cmd.target==='LIMEN'?'E1':'E2'][0][1]);
          const heard=Object.values(s.world.agents).filter(a=>s.tasks[a.id].duty!=='detained'&&!s.dialogue.masked.includes(a.id)&&audible({position:desk},a,true));
          s.heard[ev.seq]=heard.map(a=>a.id);for(const a of heard)remember(s,a.id,'back.'+s.day,'Producer#'+ev.seq);
        }break;
      default:reason='Unknown command';
    }
    if(!reason)s.spent=cmd.action;
  }
  const result={accepted:!reason,reason:reason||'Accepted'};s.history[cmd.id]={cmd:{...cmd},...result};return result;
}
export function intent(s:Pick<Run,'day'|'tick'|'case'>,id:string,action:Command['action'],target:string,room:Room):Command{
  const token=action==='appoint'?'morning':action==='issue-pass'?(s.case?.id??'closed'): 'D'+s.day+'-'+(action==='endorse'?'clash':action==='accelerate'?'checks':'pace');
  return {id,day:s.day,tick:s.tick,action,target,room,incident:token};
}
