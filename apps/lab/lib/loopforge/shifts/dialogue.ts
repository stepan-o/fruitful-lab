import {readingTime} from './reading';
import manuscript from './manuscript.json';
import {audible,geom} from '../intro/floor';
import {segmentBoxDistanceSquared,simultaneousDistanceSquared} from '../encounters/arrival-navigation';
import {applyPropTransfers,propCustodian} from '../encounters/props';
import type {Run,Point,Room} from './contract';
import type {Exchange,Line,Slot,Window} from './dialogue-state';
import {mark,remember,thought} from './events';
import {dist,meters,go} from './navigation';

export const scripts:Record<string,string[][]>={...manuscript.scenes,...manuscript.chats};
export const workers=['sam','max','bob','jo','mae','kit','ben','lou','ed','gus'];
export const knows=(s:Run,who:string,key:string)=>!!s.world.agents[who].beliefs[key]?.value;
export const pos=(s:Run,id:string)=>s.world.agents[id].position;
export function draw<T>(s:Run,values:T[]):T {
  const d=s.dialogue;
  d.random=(Math.imul(1664525,d.random)+1013904223)>>>0; d.draws++;
  return values[Math.floor(d.random/4294967296*values.length)];
}
export function sees(s:Run,who:string,target:Point,actor:string,detail=false){
  const a=pos(s,who);
  if(s.dialogue.occluded.includes(who)||dist(a,target)>(detail?4300:10500)||!audible({position:a},{position:target}))return false;
  if(detail&&target[1]<a[1]-1000)return false;
  const fixed=geom.fixtures.filter(f=>f.kind!=='drain').some(({rect:r})=>segmentBoxDistanceSquared(a,target,
    {minX:r.x*1000,minY:r.y*1000,maxX:(r.x+r.w)*1000,maxY:(r.y+r.h)*1000})===0);
  if(fixed)return false;
  return !Object.keys(s.tasks).some(id=>id!==who&&id!==actor&&id!=='LIMEN'&&id!=='STILETTO'&&
    s.tasks[id].duty!=='outside'&&simultaneousDistanceSquared(a,target,pos(s,id),pos(s,id))<(detail?350:200)**2);
}
export function observe(s:Run,actor:string,key:string,at:Point,detail=false){
  const e=mark(s,'gesture.seen','security','actor.'+actor,at,actor,'',key);
  const witnesses=Object.keys(s.tasks).filter(id=>id===actor||sees(s,id,at,actor,detail));
  s.heard[e.seq]=witnesses;
  for(const id of witnesses)remember(s,id,key,actor+'#'+e.seq,true);
  return witnesses;
}
export function heard(s:Run,l:Line,room:Room,topic:string){
  const a=pos(s,l.who),gesture=/^\p{Extended_Pictographic}[\p{Extended_Pictographic}\uFE0F\u200D\s]*$/u.test(l.words);
  const e=mark(s,gesture?'gesture.seen':'speech.delivered',room,'actor.'+l.who,a,l.who,l.to,l.words,[l.to]);
  const listeners=Object.keys(s.tasks).filter(id=>id!==l.who&&s.tasks[id].duty!=='outside'&&(
    gesture?sees(s,id,a,l.who):!s.dialogue.masked.includes(id)&&audible({position:a},s.world.agents[id])&&
    dist(a,pos(s,id))<=(l.quiet?3000:l.who===l.who.toUpperCase()?10500:5200)));
  s.heard[e.seq]=listeners;
  for(const id of listeners){
    if(l.fact==='search'&&workers.includes(id)&&!['ed','gus','bob'].includes(id)&&(l.to===id||knows(s,id,'saw.clerk.ed')||knows(s,id,'saw.clerk.gus')))remember(s,id,'inquire.card','heard bob asking#'+e.seq);
    if(l.fact)remember(s,id,l.fact,l.who+'#'+e.seq+(l.source?' ← '+l.source:''),gesture);
    if(id===l.to&&id==='bob'&&workers.includes(l.who))s.dialogue.replied=true;
  }
  if(l.fact==='ed.acknowledged'&&listeners.includes('bob'))s.dialogue.intent.ed='show the two originals';
  if(l.to&&listeners.includes(l.to))thought(s,l.to,'heard '+l.who,l.words,[topic+'#'+e.seq,...(l.source?[l.source]:[])]);
  return listeners;
}
export const phrase=(who:string,words:string,to:string,fact?:string,source?:string,quiet=false):Line=>({who,words,to,...(fact?{fact}:{}),...(source?{source}:{}),quiet});
export const lineTime=(words:string)=>Math.max(26,Math.ceil(words.split(/\s+/).length*6.6)+9);
export function lines(key:string,to:string,from=0,end=scripts[key].length):Line[]{
  return scripts[key].slice(from,end).map(([who,words])=>phrase(who,words,to));
}
export function schedule(s:Run,topic:string,items:Line[],room:Room,window=''){
  if(!items.length)return;
  s.dialogue.exchanges.push({topic,lines:items,next:0,due:s.tick+1,room,window});
}
export const occupied=(s:Run,id:string)=>['working','standing'].includes(s.tasks[id]?.duty)&&
  !!s.dialogue.posts[id]&&dist(pos(s,id),s.dialogue.posts[id])<100;
export function partners(s:Run,slot:Slot,a:string,b:string){
  if(!s.tasks[a]||!s.tasks[b]||!audible(s.world.agents[a],s.world.agents[b]))return false;
  const d=dist(pos(s,a),pos(s,b));
  if(slot==='security')return s.queue.includes(a)&&s.queue.includes(b)&&a!==s.called&&b!==s.called&&d<=2800;
  if(slot==='departure')return [a,b].every(id=>s.tasks[id].duty==='departing'&&pos(s,id)[1]<129500)&&d<=2800;
  const edges:Record<string,string[]>={intake:['tray','wash'],wash:['intake','belt'],belt:['wash','drive','forge'],
    forge:['belt','drive','rack'],tray:['tray','intake'],drive:['drive','belt','forge'],rack:['rack','forge']};
  return occupied(s,a)&&occupied(s,b)&&d<=4400&&!!edges[s.dialogue.faces[a]]?.includes(s.dialogue.faces[b]);
}
export function openWindow(s:Run,slot:Slot,id:string){
  const windows=s.dialogue.windows;
  if(windows.some(w=>w.id===id)||windows.filter(w=>w.slot===slot&&w.spent).length>=(slot==='conveyor'?2:1))return;
  if(windows.some(w=>w.slot===slot&&!w.closed))return;
  windows.push({id,slot,spent:false,closed:false,pair:[],topic:''});
}
export function crossed(s:Run,id:string){
  const d=s.dialogue;
  if(d.crossed.includes(id))return;
  d.crossed.push(id);
  const e=mark(s,'gate.crossed','security','gate.outbound',pos(s,id),id,'',d.authorized.includes(id)?'Authorized passage':'Following through the rail');
  if(d.authorized.includes(id)){
    d.passages.push(id);
    if(d.passages.length===2)openWindow(s,'security','passage#'+e.seq);
  }
  if(id==='jo'&&s.tasks.jo.choice==='go')observe(s,'jo','jo.crossed.'+s.day,pos(s,'jo'));
}
function source(s:Run,id:string,key:string){return s.world.agents[id].beliefs[key]?.source;}
const factMap:Record<string,Record<number,string>>={
  K01:{1:'jo.missed.pickup'},K02:{2:'pass.dated'},K03:{1:'anonymous.find',2:'desk.lead'},K04:{2:'ed.admits.pickup'},
  K05:{1:'gus.reports.edges'},K06:{1:'desk.roles'},K07:{1:'gus.missed.pickup'},K08:{1:'boot.lead'},
  K09:{1:'lace.explained'},K10:{1:'ed.invitation'},K11:{0:'sam.reports.pickup'},K12:{0:'lou.reports.edges'},
  K14:{1:'ed.acknowledged'},K15:{1:'ed.acknowledged'},K16:{1:'bob.reported.pass'},K17:{1:'bob.reported.return'},
  K18:{3:'ed.admits.pickup'},K19:{1:'ed.admits.pickup'},V03:{3:'jo.reported.return'},V06:{1:'ben.reported.bob'},
  V12:{0:'elbow.advice'},E2:{0:'kit.reported.order'}};
const origins:Record<string,[string,string]>={K03:['sam','ed.logged.card'],K05:['gus','two.edges'],K08:['ben','boot.lifted'],
  K10:['bob','desk.lead'],K11:['sam','ed.admits.pickup'],K12:['lou','gus.reports.edges'],K14:['bob','sam.reports.pickup'],
  K15:['bob','lou.reports.edges'],E2:['kit','back.']};
export function available(s:Run,key:string,slot:Slot){
  const b=(id:string,k:string)=>knows(s,id,k);
  const missing=b('bob','missing.original'),safe=!s.world.held['actor:kit']&&!s.world.held['actor:jo'];
  switch(key){
    case 'K01':return slot==='security'&&missing&&b('jo','coat.blocked');
    case 'K02':return slot==='security'&&missing&&!!s.pass&&!s.pass.valid;
    case 'K03':return slot==='conveyor'&&missing&&b('sam','ed.logged.card')&&!b('bob','desk.lead');
    case 'K04':return slot==='conveyor'&&b('sam','search')&&b('ed','have.bobs.id');
    case 'K05':return slot==='conveyor'&&b('gus','two.edges.'+s.day)&&b('lou','search');
    case 'K06':return b('gus','desk.roles')&&b('mae','search');
    case 'K07':return b('gus','poor.pickup.view')&&b('kit','search');
    case 'K08':return !b('bob','boot.lead')&&slot==='departure'&&missing&&b('ben','boot.lifted')&&!b('bob','desk.lead');
    case 'K09':return missing&&b('bob','boot.lead');
    case 'K10':return slot==='departure'&&missing&&b('bob','desk.lead')&&!b('bob','ed.invitation');
    case 'K11':return slot==='departure'&&b('sam','ed.admits.pickup')&&!b('bob','sam.reports.pickup');
    case 'K12':return slot==='departure'&&b('lou','gus.reports.edges')&&!b('bob','lou.reports.edges');
    case 'K13':return b('bob','lou.reports.edges')&&b('gus','two.edges');
    case 'K14':return missing&&b('bob','sam.reports.pickup')&&b('ed','have.bobs.id');
    case 'K15':return missing&&b('bob','lou.reports.edges')&&b('ed','have.bobs.id');
    case 'K16':return !!s.pass?.valid&&b('mae','search');
    case 'K17':return !missing&&b('kit','search')&&!b('kit','bob.reported.return');
    case 'K18':return b('ben','gus.rumor')&&b('ed','have.bobs.id');
    case 'K19':return b('gus','search')&&b('ed','have.bobs.id');
    case 'E2':return slot==='conveyor'&&s.backing==='STILETTO'&&b('kit','back.'+s.day)&&!s.coverage[1];
    case 'V01':return !!s.coverage[2]&&s.pieces.some(p=>p.stage>=2);
    case 'V02':return !s.coverage[1]&&b('mae','tray.hand');
    case 'V03':return b('jo','hand.return')&&s.pieces.some(p=>p.stage===4);
    case 'V05':return s.pieces.some(p=>p.stage===2);
    case 'V06':return !s.coverage[1]&&b('ben','bob.by.kit')&&s.backing!=='STILETTO';
    case 'V07':return s.lead==='STILETTO'&&s.nextPiece>0;
    case 'V08':return s.completed.length===3&&s.pieces.some(p=>p.stage===3);
    case 'V09':return s.pace==='all-clear'&&!!s.announced;
    case 'V10':return !missing&&b('bob','saw.grin');
    case 'V12':return safe&&b('kit','prior.cramp')&&s.pace==='all-clear'&&!s.world.held['belt'];
    case 'V13':return b('sam','saw.solo');
    case 'V14':return s.pieces.some(p=>p.status==='rack');
    case 'V15':return safe;
    case 'W01':return !s.marks.some(e=>e.day===s.day&&e.kind==='handoff.started'&&e.anchor==='control.forge')&&b('lou','idle.press');
    case 'W02':return b('mae','tray.set');
    case 'W03':return b('jo','elbow.helped');
    case 'W05':return !missing;
    case 'Q01':return s.queue.indexOf('ben')>0&&b('lou','exit.ben');
    case 'Q02':return b('mae','ink.mark')&&sees(s,'kit',pos(s,'mae'),'mae');
    case 'Q04':return !!s.called&&!sees(s,'ben',pos(s,'gus'),'gus')&&b('jo','saw.checked.card');
    case 'Q05':return b('max','heard.call')&&b('jo','heard.call')&&sees(s,'jo',pos(s,'max'),'max');
    case 'Q08':return b('jo','lost.place')&&dist(pos(s,'sam'),pos(s,'jo'))<1550;
    case 'Q09':return s.tasks.ed.duty==='clerk'&&!!s.called&&sees(s,'ben',pos(s,'ed'),'ed');
    case 'Q11':return !!s.called&&b('ben','heard.call')&&b('lou','exit.ben');
    case 'V04':return b('jo','double.knock')&&b('max','press.heel');
    case 'V11':return b('ed','nested.rims')&&b('mae','tray.hand');
    case 'W04':return s.lead==='LIMEN'&&b('ed','kept.book')&&b('gus','called.queue');
    case 'W06':return b('lou','heard.bell.'+s.day)&&!b('max','heard.bell.'+s.day);
    case 'W07':return b('gus','encore')&&b('max','imitation')&&!audible(s.world.agents.max,s.world.agents.LIMEN);
    case 'W08':return b('jo','saw.tray.arms');
    case 'W09':return b('ben','rack.clang')&&b('lou','saw.stopped.carrier');
    case 'W10':return b('kit','saw.detention.release')&&b('bob','heard.double.knock')&&b('kit','cleared.tray');
    case 'W11':return b('sam','shared.tray')&&b('mae','tray.hand');
    case 'W12':return b('jo','gus.at.rack')&&s.lead==='STILETTO';
    case 'W13':return s.tasks.sam.moving&&s.tasks.ben.moving&&b('ben','exit.lou');
    case 'Q03':return s.world.facts['injury.bob']==='limping';
    case 'Q06':return missing&&b('bob','struck');
    case 'Q07':return b('lou','saw.two');
    case 'Q10':return b('kit','saw.clerk.ed')&&b('mae','saw.clerk.gus');
    case 'Q12':return s.lead==='STILETTO'&&b('max','heard.squeak');
    case 'Q13':return true;
    default:return false;
  }
}
const preferred:Record<string,number>={K03:100,K08:90,K10:110,E2:135,V06:110,K04:95,K05:98,V12:120,
  K11:105,K12:105,K14:115,K15:115,K02:100,K01:95,Q06:75,V01:85,V02:65,V03:90,V05:80,W01:95,W03:105};
// These three questions can be recast. The reply remains with its source.
export function cardQuestions(s:Run,slot:Slot){
  return workers.filter(id=>!['bob','ed','gus'].includes(id)&&knows(s,id,'search')&&(knows(s,id,'inquire.card')||id==='sam')).flatMap(id=>
    [['ed','K04','saw.clerk.ed'],['gus','K06','saw.clerk.gus'],['bob','K16','saw.pass']].flatMap(([clerk,key,reason])=>{
      if(!knows(s,id,reason)||!partners(s,slot,id,clerk)||s.dialogue.completed.includes(key)||
         (clerk==='ed'&&!knows(s,'ed','have.bobs.id'))||(clerk==='bob'&&!s.pass?.valid))return [];
      const rows=scripts[key].map(([who,t])=>[who===clerk?clerk:id,t]);
      return [{key,rows,pair:[id,clerk],rank:30}];
    }));
}
function choose(s:Run,w:Window){
  const keys=[...Object.keys(manuscript.chats),'E2'];
  const bids=keys.flatMap(key=>{
    const family={security:'Q',conveyor:'V',departure:'W'}[w.slot];
    if(![family,'K'].includes(key[0])&&key!=='E2')return [];
    if(!available(s,key,w.slot)||s.dialogue.completed.includes(key))return [];
    let rows=scripts[key];
    if(key==='E2')rows=rows.slice(-2);
    const pair=[...new Set(rows.map(r=>r[0]))];
    if(w.id.startsWith('relief#')&&!pair.includes('mae'))return [];
    if(pair.length!==2||!partners(s,w.slot,pair[0],pair[1]))return [];
    const rank=(preferred[key]??35)+(pair.includes('bob')&&!s.dialogue.replied?5:0);
    return [{key,rows,pair,rank}];
  });
  for(const candidate of cardQuestions(s,w.slot))if(!bids.some(x=>x.key===candidate.key&&x.pair[0]===candidate.pair[0]))bids.push(candidate);
  if(!bids.length)return;
  const top=Math.max(...bids.map(b=>b.rank)),winner=draw(s,bids.filter(b=>b.rank===top));
  const {key,pair,rows}=winner;
  const origin=origins[key],chain=origin?source(s,origin[0],origin[1]==='back.'?'back.'+s.day:origin[1]):undefined;
  const cast=rows.map(([who,words],i)=>phrase(who,words,pair.find(id=>id!==who)!,factMap[key]?.[i],chain,key==='K04'&&who==='ed'));
  if(key==='K08'&&knows(s,'bob','anonymous.find'))cast[0].words=scripts['2G'][0][1];
  if(w.slot==='departure'&&pair[0]==='bob'){
    const target=pos(s,pair[1]),here=pos(s,'bob');
    const side=here[0]<target[0]?-1:1;
    const companion=pair[1];
    if(s.tasks[companion].duty==='departing'&&pos(s,companion)[1]<129500){
      s.tasks[companion].path=[];s.tasks[companion].destination=pos(s,companion);
      thought(s,companion,'listen to bob','walking together',[key]);
    }
    go(s,'bob',[target[0]+side*1050,target[1]+250]);
    mark(s,'worker.approaches','security','actor.bob',here,'bob',pair[1],'bob turns to '+pair[1]);
  }
  w.pair=pair;w.topic=key;s.dialogue.intent[pair[0]]=pair[1];
  thought(s,pair[0],'seek '+pair[1],key+' at '+w.slot+' after '+w.id,[...bids.map(b=>b.key+' '+b.rank),'draw '+s.dialogue.draws,...(chain?[chain]:[])]);
  schedule(s,key,cast,w.slot==='conveyor'?'conveyor':'security',w.id);
}
export function updateSpeech(s:Run){
  const d=s.dialogue;
  for(const w of d.windows)if(!w.closed&&!w.pair.length)choose(s,w);
  for(const x of [...d.exchanges]){
    const w=d.windows.find(a=>a.id===x.window);
    if(w&&(w.closed||!partners(s,w.slot,w.pair[0],w.pair[1]))){cancel(s,x,w);continue;}
    if(x.topic==='K03'&&x.next>=2&&d.cutoff>=0&&s.tick>=d.cutoff){
      heard(s,phrase('STILETTO',scripts['2F'][2][1],'sam'),'conveyor','raised tray lip');
      mark(s,'chat.interrupted','conveyor','actor.sam',pos(s,'sam'),'STILETTO','sam','Catch the raised lip');s.chat='interrupted';cancel(s,x,w);continue;
    }
    if(x.topic==='check.'+s.called&&['approach','demand','refusal','clash'].includes(s.pressure))continue;
    if(s.tick<x.due)continue;
    const l=x.lines[x.next];
    if(!l){cancel(s,x,w);continue;}
    if(x.topic==='4A'&&x.next===2&&knows(s,'jo','hand.return'))observe(s,'jo','demonstrated.open.palm',pos(s,'jo'),true);
    if(x.topic==='3A'&&x.next===2&&sees(s,'jo',pos(s,'max'),'max')){
      observe(s,'max','two.hands.one.card',pos(s,'max'));
    }
    const recipients=heard(s,l,x.room,x.topic);
    if(x.topic==='clerks'&&l.who==='mae'&&recipients.includes('sam'))x.lines.push(phrase('sam',scripts['2C'].at(-1)![1],'mae'));
    if(w&&!recipients.includes(l.to)){cancel(s,x,w);continue;}
    if(w&&!w.spent){w.spent=true;s.dialogue.completed.push(x.topic);mark(s,'slot.spent',x.room,'actor.'+l.who,pos(s,l.who),l.who,l.to,x.topic);}
    if(x.topic==='K03'){
      s.chat=x.next===0?'question':'reply';
      if(x.next===1&&occupied(s,'sam')&&s.pieces.some(p=>p.status!=='rack')&&sees(s,'STILETTO',pos(s,'sam'),'sam')){
        const lip=mark(s,'tray.lip.raised','conveyor','control.intake',pos(s,'sam'),'sam','feed tray','A tray lip catches at the feed');
        remember(s,'STILETTO','raised.lip.'+s.day,'saw feed tray#'+lip.seq,true);
        d.cutoff=s.tick+lineTime(l.words)+(s.pace==='slow'?2:-1);
      }
    }
    x.next++;x.due=s.tick+(d.phase==='walk'||x.topic==='posting' ? Math.ceil(readingTime(l.words)/50) : lineTime(l.words));
    if(d.phase==='walk' && x.next===x.lines.length)d.ready=x.due;
    if(x.next===x.lines.length){
      if(!w)d.completed.push(x.topic);
      if(x.topic==='K14'||x.topic==='K15'){d.transfer='offered';d.transferAt=x.due;}
      if(x.topic==='K03'){s.chat='finished';if(d.cutoff>=s.tick)continue;}
      cancel(s,x,w);
    }
  }
}
function cancel(s:Run,x:Exchange,w?:Window){
  s.dialogue.exchanges=s.dialogue.exchanges.filter(v=>v!==x);
  if(w){w.closed=w.spent;w.pair=[];}
}
export function cardContact(s:Run){
  const d=s.dialogue;
  if(!['offered','recognized'].includes(d.transfer)||s.tick<d.transferAt)return;
  // They can talk while walking. The photograph and the handoff need a stop.
  if(d.phase==='walk'&&(d.arrival||['bob','ed'].some(id=>dist(pos(s,id),s.tasks[id].destination)>120)))return;
  if(dist(pos(s,'bob'),pos(s,'ed'))>2200||propCustodian(s.world,'bob:id')!=='ed'){d.transfer='idle';return;}
  if(d.transfer==='offered'){
    if(!sees(s,'bob',pos(s,'ed'),'ed')){d.transfer='idle';return;}
    const e=mark(s,'photo.recognized','security','actor.ed',pos(s,'ed'),'bob','ed','bob recognizes his photograph');
    remember(s,'bob','recognized.original','visible photograph#'+e.seq,true);d.transfer='recognized';d.transferAt=s.tick+32;return;
  }
  const props=applyPropTransfers(s.world,[{prop:'bob:id',from:{kind:'stowed',agent:'ed'},to:{kind:'hand',agent:'bob',socket:'right'},observedBy:['ed','bob']}]);
  if(!props){
    const ed=pos(s,'ed'),bob=pos(s,'bob');
    if(dist(bob,ed)>1400)go(s,'bob',[ed[0]+(bob[0]>=ed[0]?1050:-1050),ed[1]]);
    else d.transfer='idle';
    return;
  }
  s.world.props=props;d.transfer='received';
  const e=mark(s,'credential.returned','security','actor.ed',pos(s,'ed'),'ed','bob','Original returned to bob');
  remember(s,'bob','have.own.id','hand contact#'+e.seq,true);
  s.world.agents.bob.beliefs['missing.original'].value=false;s.world.agents.ed.beliefs['have.bobs.id'].value=false;
}
