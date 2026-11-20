import type {Run,Point} from './contract';
import manuscript from './manuscript.json';
import {desk,dist,go,meters,queueSpots,supervisorPost,workPost} from './navigation';
import {draw,heard,knows,lineTime,lines,observe,phrase,pos,schedule,scripts,sees,workers} from './dialogue';
import {mark,remember,thought} from './events';

export function seedHistory(s:Run){
  const histories:Record<string,string[]>={bob:['struck','sam.helped'],sam:['knelt','missed.pickup'],ed:['kept.book','desk.roles'],
    gus:['called.queue','desk.roles','poor.pickup.view'],jo:['coat.blocked','six.years'],max:['imitation','heard.call'],
    mae:['tray.hand'],kit:['drive.hand'],lou:['exit.ben'],ben:['boot.lifted','exit.lou']};
  for(const [id,facts] of Object.entries(histories))for(const f of facts)remember(s,id,f,'Day One · '+id,true);
  remember(s,'STILETTO','gate.shift.1','Day One gate and crew',true);
}
export function morningBids(s:Run){
  const key=knows(s,'LIMEN','saw.bruise')&&knows(s,'LIMEN','mae.injury.report')?'A1':knows(s,'LIMEN','slow.and.steady')?'Q1':
    knows(s,'LIMEN','reckless')?'4P':knows(s,'STILETTO','gate.shift.2')?'3P':'2P';
  return Object.fromEntries(['LIMEN','STILETTO'].map(id=>[id,scripts[key].filter(x=>x[0]===id).map(x=>x[1]).join(' ')]));
}
export function queueOrder(s:Run){
  // Workers keep prior jobs. Past experience changes where they choose to stand.
  if(knows(s,'jo','hand.return'))return ['sam','mae','max','lou','jo','ben','kit','bob'];
  if(knows(s,'LIMEN','against.protocol')||s.seed==='late')return ['sam','max','mae','lou','jo','ben','kit','bob'];
  return ['sam','max','bob','jo','kit','mae','lou','ben'];
}
export const queueAt=(i:number):Point=>i<8?queueSpots[i]:meters(126.3+(i%2)*1.4,122.1);
const cast=(s:Run,key:string,limit?:number)=>{
  const rows=scripts[key].slice(0,limit);
  const pair=[...new Set(rows.map(r=>r[0]))];
  if(pair.length!==2||dist(pos(s,pair[0]),pos(s,pair[1]))>5200)return false;
  schedule(s,key,rows.map(([who,words],i)=>phrase(who,words,pair.find(id=>id!==who)!,
    key==='2A'?(i===0?'search':'sam.missed.pickup'):key==='4A'&&i===0?'jo.reported.return':undefined)), 'security');
  return true;
};
export function startWalk(s:Run){
  const d=s.dialogue;
  const pair=knows(s,'jo','hand.return')?['jo','ben']:knows(s,'jo','desk.released')?['jo','max']:['bob','sam'];
  for(const id of workers){
    const i=d.order.indexOf(id),p=i>=0?queueAt(i):id==='ed'?meters(122.45,130.25):meters(131.6,130.2);
    const meeting=knows(s,'bob','sam.reports.pickup')||knows(s,'bob','lou.reports.edges');
    const landing:Point=meeting&&id==='ed'?[queueAt(d.order.indexOf('bob'))[0]-1050,queueAt(d.order.indexOf('bob'))[1]-650]:[p[0]+(i<0?0:((i%2)*2-1)*350),p[1]-650];
    const a=s.world.agents[id];a.position=[landing[0],landing[1]-5700];a.room='security';
    Object.assign(s.tasks[id],{duty:'walking',path:[],destination:a.position,walked:0,moving:false});
    go(s,id,landing);
  }
  d.intent[pair[0]]=pair[1];thought(s,pair[0],'approach '+pair[1],'walk together to the grate',[...Object.keys(s.world.agents[pair[0]].beliefs).filter(k=>!k.startsWith('heard.line')).slice(-4)]);
  go(s,'LIMEN',supervisorPost);
}
function chorus(s:Run){
  const valid=manuscript.welcome.filter(([who,to],i)=>knows(s,who,'welcome.'+s.day)&&dist(pos(s,who),pos(s,to))<10500&&
    [knows(s,'ed','kept.book'),knows(s,'ed','two.pens'),knows(s,'gus','called.queue'),knows(s,'gus','called.queue'),
      knows(s,'max','imitation')&&knows(s,'jo','heard.line.0'),knows(s,'jo','six.years'),knows(s,'max','imitation'),knows(s,'max','imitation'),
      knows(s,'lou','exit.ben'),knows(s,'lou','exit.ben'),true,dist(pos(s,'sam'),pos(s,'gus'))<550,
      knows(s,'mae','tray.hand'),knows(s,'kit','drive.hand'),knows(s,'bob','struck'),knows(s,'bob','sam.helped')][i]);
  const candidates=[...new Set(valid.map(row=>row[0]))],sample=[];
  while(sample.length<3&&candidates.length){
    const id=draw(s,candidates);candidates.splice(candidates.indexOf(id),1);sample.push(draw(s,valid.filter(r=>r[0]===id)));
  }
  for(const [who,to,words] of sample)heard(s,phrase(who,words,to),'security','welcome reply');
  return Math.max(30,...sample.map(row=>lineTime(row[2])));
}
export function advanceMorning(s:Run){
  const d=s.dialogue;
  if(['offered','recognized'].includes(d.transfer)||s.tick<d.ready||d.exchanges.some(x=>!x.window)||['work','departure','home'].includes(d.phase))return;
  if(d.phase==='walk'){
    if(d.cue++===0){
      if(knows(s,'bob','sam.reports.pickup')||knows(s,'bob','lou.reports.edges')){
        const key=knows(s,'bob','sam.reports.pickup')?'K14':'K15';
        if(cast(s,key)){
          const x=d.exchanges.at(-1)!;x.lines[1].fact='ed.acknowledged';
          return;
        }
      }
      if(knows(s,'jo','hand.return'))cast(s,'4A');
      else if(knows(s,'kit','saw.cramp'))schedule(s,'Q1',[phrase('kit',scripts.Q1[2][1],'jo'),phrase('jo',scripts.Q1[3][1],'kit')],'security');
      else if(knows(s,'jo','desk.released'))cast(s,'3A');
      else if(knows(s,'bob','missing.original')&&!knows(s,'bob','sam.missed.pickup'))cast(s,'2A');
      else if(knows(s,'jo','double.knock'))schedule(s,'N1',[phrase('jo',scripts.N1[1][1],'max'),phrase('max',scripts.N1[2][1],'jo')],'security');
      return;
    }
    if(d.cue===2){
      const ok=manuscript.crowd.filter(([a,b],i)=>dist(pos(s,a),pos(s,b))<5000&&(knows(s,a,'rumor.'+i)||i===9&&knows(s,a,'heard.line.7')||i===4&&knows(s,a,'heard.call')));
      if(ok.length){const [a,b,t]=draw(s,ok);heard(s,phrase(a,t,b),'security','passing aside');d.ready=s.tick+lineTime(t);}
      return;
    }
    if(!workers.some(id=>dist(pos(s,id),desk)<3200&&sees(s,'LIMEN',pos(s,id),id)))return;
    d.phase='welcome';d.cue=0;
  }
  if(d.phase==='welcome'){
    if(d.cue++===0){const words=scripts['2B'][0][1];heard(s,phrase('LIMEN',words,'crew','welcome.'+s.day),'security','arrivals');
      d.ready=s.tick+lineTime(words);return;}
    d.ready=s.tick+chorus(s);d.phase='posting';d.cue=0;return;
  }
  if(d.phase==='posting'){
    if(d.cue++===0){
      const item=s.lead==='LIMEN'?lines('2C','crew',0,2):lines('S1','gus');
      schedule(s,'posting',item,'security');return;
    }
    if(d.cue===2){
      const helpers=['ed','gus'];
      if(s.lead==='LIMEN'){
        for(const [i,id] of helpers.entries()){s.tasks[id].duty='clerk';go(s,id,i?meters(131.6,130.2):meters(123.7,130.25));}
      }else go(s,'LIMEN',workPost);
      go(s,'STILETTO',s.lead==='LIMEN'?workPost:supervisorPost);
      s.queue=[...d.order];s.queue.forEach((id,i)=>{s.tasks[id].duty='waiting';go(s,id,queueAt(i));});
      d.phase='queue';return;
    }
  }
  if(d.phase==='queue'){
    if(s.queue.some((id,i)=>dist(pos(s,id),queueAt(i))>120))return;
    if(s.lead==='LIMEN'&&['ed','gus'].some(id=>dist(pos(s,id),s.tasks[id].destination)>150))return;
    if(s.lead==='LIMEN'){
      const e=knows(s,'ed','have.bobs.id')&&mark(s,'register.entry','security','desk.register',pos(s,'ed'),'ed','','One loose card · owner blank');
      if(e)remember(s,'ed','loose.entry','register#'+e.seq,true);
      for(const id of ['ed','gus'])observe(s,id,'saw.clerk.'+id,pos(s,id));
      const rows=[...['ed','gus'].map(id=>draw(s,manuscript.helpers.filter(r=>r[0]===id))),draw(s,manuscript.helpers.slice(8))];
      schedule(s,'clerks',rows.map(([a,b,t])=>phrase(a,t,b)),'security');
    }
    d.phase='work';s.checking=s.tick+38;d.bell=s.tick+2400;
  }
}
