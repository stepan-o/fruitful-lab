import inheritance from './inheritance.json';
import {ENCOUNTER_VERSION,type World,type Agent,type Point} from '../encounters/contract';
import {propCustodian,applyPropTransfers} from '../encounters/props';
import {audible,roomAt} from '../intro/floor';
import {type Run,type Command,type Task,type Lead,type Room,Hz,shiftTicks,stations,candidates,stationOwners,otherLead,timeInShift} from './contract';
import {desk,returnSpot,controls,supervisorPost,workPost,queueSpots,standby,meters,move,go,dist} from './navigation';
import {mark,say,thought,remember} from './events';
import {conversation,production} from './conveyor';

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
  return {version:'shift-floor/1',seed,day:2,phase:'briefing',tick:world.tick,start:world.tick,world,tasks:{},rules:{},
    lead:'LIMEN',pace:'rushed',queue:[],called:'',checking:0,quick:false,case:null,spent:null,pass:null,caseReleaseSeq:0,
    pressure:'quiet',pressureAt:0,concessions:inheritance.concessions,authority:3,confidence:3,loyalty:3,chat:'idle',chatAt:0,partner:'',nextIntake:0,
    pieces:[],completed:inheritance.pieces.map(p=>p.id),coverage:['','','',''],nextPiece:0,announced:'',stageClear:'',
    marks:[],thoughts:[],heard:{},backing:null,history:{},overnight:[],injuryExposure:0};
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
  s.queue=[...candidates];
  if(s.seed==='late')s.queue=s.day===4?['sam','mae','max','lou','jo','kit','ben','bob']:['sam','max','jo','mae','lou','kit','ben','bob'];
  s.queue.forEach((id,i)=>position(s,id,queueSpots[i],'waiting',stationOwners.indexOf(id)));
  position(s,inheritance.clerks[0],counter,'clerk');position(s,inheritance.clerks[1],secondDesk,'clerk');
  position(s,lead,supervisorPost,'supervising');position(s,otherLead(lead),workPost,'supervising');
  mark(s,'bid.accepted','security','desk.register',desk,lead,otherLead(lead),lead+' at Security · '+otherLead(lead)+' at Conveyor');
}
function release(s:Run,id:string,reason:string){
  const i=s.queue.indexOf(id);if(i<0)return;
  s.queue.splice(i,1);
  const t=s.tasks[id];t.duty='cleared';
  const n=t.station;
  go(s,id,n>=0?controls[n]:standby[['lou','mae','kit','ben'].indexOf(id)]);
  const following=reason==='Responded to STILETTO';
  mark(s,following?'worker.followed':'worker.cleared','security','desk.register',desk,following?'STILETTO':s.lead,id,reason);
  if(s.called===id){s.called='';s.checking=s.tick+8;}
}
function resolveCase(s:Run,pass:boolean){
  const c=s.case;if(!c||c.status!=='open')return;
  c.status=pass?'pass':'detention';
  const id='bob';
  const ev=mark(s,'case.resolved','security','desk.register',desk,'LIMEN',id,pass?'Daily pass issued':'Detained until the bell');
  s.caseReleaseSeq=ev.seq;
  if(pass){
    s.pass={holder:id,issuer:'Producer',day:s.day,valid:true};
    mark(s,'pass.issued','security','desk.register',desk,'Producer',id,'Valid for shift '+s.day);
    release(s,id,'Daily pass');
  }else{
    s.queue=s.queue.filter(x=>x!==id);s.called='';s.checking=s.tick+8;
    s.tasks.bob.duty='detained';s.tasks.bob.path=[];s.tasks.bob.destination=s.world.agents.bob.position;
    mark(s,'custody.admitted','security','security.custody',s.world.agents.bob.position,'LIMEN',id,'Security custody · through the bell');
  }
  mark(s,'report.received','security','desk.register',desk,'LIMEN',id,pass?'bob cleared on a daily pass.':'bob is in Security custody until the bell. Wash is down one operator.');
}
function check(s:Run){
  if(s.case?.status==='open'){if(s.tick>=s.case.deadline)resolveCase(s,false);return;}
  if(s.pressure==='clash'||s.pressure==='refusal'||s.pressure==='demand')return;
  if(!s.called){
    if(!s.queue.length||s.tick<s.checking)return;
    s.called=s.queue[0];const a=s.world.agents[s.called];
    s.tasks[a.id].duty='approaching';go(s,a.id,desk);s.checking=0;
    mark(s,'queue.called','security','desk.register',desk,s.lead,a.id,'Next for inspection');return;
  }
  const a=s.world.agents[s.called];if(dist(a.position,desk)>80)return;
  if(!s.checking){
    s.checking=s.tick+(s.quick?10:41);
    if(a.id==='sam'&&s.world.agents.ed.beliefs['have.bobs.id']?.value)say(s,'ed','Logged a loose card this morning.','security','ed.logged.card',['sam']);
    return;
  }
  if(s.tick<s.checking)return;
  if(!s.quick&&s.called==='bob'&&!ownOriginal(s)&&!s.pass?.valid){
    const id=eventId(s,'missing-bob');
    s.case={id,opened:s.tick,deadline:s.tick+deskWindowTicks,status:'open'};
    say(s,'LIMEN','This worker is missing ID. Hold the line.','security');
    mark(s,'desk.signal','security','desk.register',desk,'LIMEN','bob','Missing original ID');
    return;
  }
  release(s,s.called,s.quick?'Expedited clearance':'Credential verified');
}
function settle(s:Run,yielded:boolean){
  s.pressure='settled';
  if(yielded){
    s.concessions++;s.quick=true;
    say(s,'LIMEN','Fine. Move them through.','security','saw.yield.'+s.day,undefined,true);
    s.overnight.push(s.concessions===2?'against.protocol':'reckless');
    if(s.concessions>=3){s.confidence--;s.authority--;}
  }
  go(s,'STILETTO',workPost);
}
function pressure(s:Run){
  if(s.lead!=='LIMEN'||s.pressure==='settled')return;
  if(s.pressure==='quiet'){
    if(s.quick||!s.queue.length||timeInShift(s)<Hz*14||s.coverage.every(Boolean)||s.completed.length>=3+5*(s.day-1))return;
    s.pressure='approach';go(s,'STILETTO',demandPost);
    thought(s,'STILETTO','get the crew','Uncovered controls and a late crew threaten the shift target.',['observed station coverage']);return;
  }
  if(s.pressure==='approach'&&dist(s.world.agents.STILETTO.position,demandPost)<100){
    s.pressure='demand';s.pressureAt=s.tick;
    say(s,'STILETTO','Where is my crew? Send them through.','security','demand.'+s.day,undefined,true);return;
  }
  if(s.pressure==='demand'&&s.tick-s.pressureAt>=32){
    if(s.concessions<2){settle(s,true);return;}
    s.pressure='refusal';s.pressureAt=s.tick;say(s,'LIMEN','The crew stays here. Checks first.','security','order.stay.'+s.day,undefined,true);return;
  }
  if(s.pressure==='refusal'&&s.tick-s.pressureAt>=42){
    if(!s.world.agents.LIMEN.beliefs['reckless']){settle(s,true);return;}
    s.pressure='clash';s.pressureAt=s.tick;
    say(s,'STILETTO','Crew. On the line. With me.','security','order.move.'+s.day,undefined,true);
    mark(s,'clash.open','security','desk.register',desk,'STILETTO','LIMEN','Two conflicting orders');return;
  }
  if(s.pressure!=='clash'||s.case?.status==='open')return;
  if(s.tick-s.pressureAt>=responseTicks){
    for(const id of [...s.queue]){
      if(s.tasks[id].choice||s.tick-s.pressureAt<responseTicks+candidates.indexOf(id)*5)continue;
      const a=s.world.agents[id],belief=a.beliefs;
      const heardMove=belief['order.move.'+s.day],heardStay=belief['order.stay.'+s.day];
      const endorsed=belief['back.'+s.day],priorYield=Object.keys(belief).some(k=>k.startsWith('saw.yield.'));
      const seen=s.marks.slice(-24).some(e=>e.tick<s.tick&&e.kind==='worker.choice'&&e.text==='go'&&dist(s.world.agents[e.actor].position,e.at)>300&&audible(a,s.world.agents[e.actor]));
      const caution=(id==='bob'?5:id==='ben'||id==='kit'?2:0)+(belief['heard.line.7']?1:0);
      const moveScore=(heardMove?2:0)+(priorYield?1:0)+(seen?1:0)+(endorsed&&s.backing==='STILETTO'?2:0);
      const stayScore=(heardStay?1:0)+caution+(endorsed&&s.backing==='LIMEN'?3:0);
      const goes=!!heardMove&&moveScore>stayScore;
      s.tasks[id].choice=goes?'go':'stay';
      thought(s,id,goes?'take a station':'stay in line','Go '+moveScore+' / stay '+stayScore+'; own caution '+caution,
        [heardMove?.source,heardStay?.source,priorYield?'witnessed earlier concession':'',endorsed?.source,seen?'saw another worker leave':''].filter(Boolean) as string[]);
      mark(s,'worker.choice','security','actor.'+id,a.position,id,'',s.tasks[id].choice);
      if(goes)release(s,id,'Responded to STILETTO');
    }
    if(s.queue.some(id=>!s.tasks[id].choice))return;
    mark(s,'clash.resolved','security','desk.register',desk,'LIMEN','STILETTO','Crew decisions committed');settle(s,false);
    s.checking=s.tick+Hz*4;
  }
}
function finish(s:Run){
  s.phase='close';
  if(s.case?.status==='open')resolveCase(s,false);
  if(s.pass?.valid){s.pass.valid=false;mark(s,'pass.expired','security','desk.register',desk,'LIMEN','bob','Pass expired at the bell');}
  if(s.tasks.bob.duty==='detained'){s.tasks.bob.duty='standing';mark(s,'custody.release','security','security.custody',desk,'LIMEN','bob','Released at shift end');}
  for(const key of s.overnight){remember(s,'LIMEN',key,'concession on shift '+s.day,true);remember(s,'STILETTO','limen.weak','concession on shift '+s.day,true);}
  if(s.pace==='all-clear'&&s.nextPiece)remember(s,'LIMEN','slow.and.steady','shift '+s.day,true);
  s.overnight=[];s.world.active=[];s.world.held={};s.rules={};
  mark(s,'shift.closed','conveyor','rack.output',meters(135,147),'BELL','','Shift closed · '+s.pieces.filter(p=>p.status==='rack').length+' finished');
}
export function nextMorning(s:Run){
  if(s.phase!=='close'||s.day>=4)return false;
  s.day++;s.phase='briefing';s.start=s.tick;s.spent=null;s.case=null;return true;
}
export function step(s:Run){
  if(s.phase!=='shift')return;
  s.tick++;
  move(s);
  for(const [id,t] of Object.entries(s.tasks)){
    if(t.duty==='cleared'&&dist(s.world.agents[id].position,t.destination)<80)t.duty=t.station>=0?'working':'standing';
    if(t.duty==='approaching'&&t.moving&&s.caseReleaseSeq){
      mark(s,'queue.advanced','security','actor.'+id,s.world.agents[id].position,id,'','Stepped forward for own check');s.caseReleaseSeq=0;
    }
  }
  check(s);pressure(s);production(s);conversation(s);
  const bob=s.world.agents.bob;
  if(s.tasks.bob.duty==='seeking'&&dist(bob.position,returnSpot)<80&&dist(bob.position,s.world.agents.ed.position)<=1400){
    const next=applyPropTransfers(s.world,[{prop:'bob:id',from:{kind:'stowed',agent:'ed'},to:{kind:'hand',agent:'bob',socket:'right'},observedBy:['ed','bob']}]);
    if(next){s.world.props=next;remember(s,'bob','have.own.id','ed handed back the original',true);bob.beliefs['missing.original'].value=false;s.world.agents.ed.beliefs['have.bobs.id'].value=false;
      mark(s,'credential.returned','security','desk.register',desk,'ed','bob','Original returned at the register');s.tasks.bob.duty='cleared';go(s,'bob',controls[1]);}
  }
  if(timeInShift(s)>=shiftTicks)finish(s);
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
        if(cmd.room!=='security'||cmd.target!=='bob'||s.case?.status!=='open'||cmd.incident!==s.case.id)reason='Case closed';
        else resolveCase(s,true);break;
      case 'accelerate':
        if(cmd.room!=='security'||cmd.target!=='LIMEN'||s.lead!=='LIMEN'||s.quick||!s.queue.length||cmd.incident!==eventId(s,'checks')||s.pressure==='clash')reason='Individual checks unavailable';
        else{s.quick=true;s.loyalty--;s.confidence--;s.authority--;if(s.pressure==='approach')settle(s,false);say(s,'LIMEN','Expedite the checks.','security');}break;
      case 'slow':case 'rush':
        if(cmd.room!=='conveyor'||cmd.target!=='STILETTO'||s.lead!=='LIMEN'||cmd.incident!==eventId(s,'pace'))reason='Pace order unavailable';
        else{s.pace=cmd.action==='slow'?'slow':'pushed';say(s,'STILETTO',cmd.action==='slow'?'Ease off. Let it settle.':'Push that line.','conveyor');}break;
      case 'endorse':
        if(cmd.room!=='security'||s.pressure!=='clash'||!['LIMEN','STILETTO'].includes(cmd.target)||cmd.incident!==eventId(s,'clash'))reason='Clash closed';
        else{
          s.backing=cmd.target as Lead;
          const ev=mark(s,'endorsement.public','security','desk.register',desk,'Producer',cmd.target,'Follow '+cmd.target+'.');
          const heard=Object.values(s.world.agents).filter(a=>s.tasks[a.id].duty!=='detained'&&audible({position:desk},a,true));
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
