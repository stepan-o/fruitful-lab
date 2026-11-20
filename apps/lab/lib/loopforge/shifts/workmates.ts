import {propCustodian} from '../encounters/props';
import {audible} from '../intro/floor';
import type {Run} from './contract';
import {dist,go,meters,workPost,desk} from './navigation';
import {mark,remember,thought} from './events';
import {draw,heard,knows,occupied,openWindow,phrase,pos,scripts,sees} from './dialogue';

export function workmates(s:Run){
  const d=s.dialogue;
  const last=s.marks.at(-1);
  if(last?.tick===s.tick&&last.kind==='handoff.finished'){
    if(last.anchor==='control.intake'&&occupied(s,'mae'))remember(s,'sam','shared.tray','Intake handoff#'+last.seq,true);
    if(last.anchor==='control.forge'){
      remember(s,'max','press.heel','Forge stroke#'+last.seq,true);
      if(audible(s.world.agents.jo,s.world.agents.max))remember(s,'jo','double.knock','Forge stroke#'+last.seq,true);
    }
  }
  if(s.lead==='STILETTO'){
    if(d.errand==='none'&&d.completed.includes('K04')&&!d.exchanges.some(x=>x.topic==='K04')&&
      occupied(s,'ed')&&occupied(s,'gus')&&s.pieces.some(p=>p.status==='rack')){
      d.errand='rack';s.tasks.ed.duty='seeking';go(s,'ed',meters(134,142.1));
      thought(s,'ed','collect the empty trays','The finished carrier reached the rack.',['rack arrival']);
    }
    if(d.errand==='rack'&&dist(pos(s,'ed'),s.tasks.ed.destination)<100){
      const e=mark(s,'tray.lift','conveyor','actor.ed',pos(s,'ed'),'ed','','ed lifts the nested trays');
      remember(s,'ed','nested.rims','tray lift#'+e.seq,true);
      if(propCustodian(s.world,'bob:id')==='ed'&&propCustodian(s.world,'ed:id')==='ed'&&sees(s,'gus',pos(s,'ed'),'ed'))
        {remember(s,'gus','two.edges','two edges at tray lift#'+e.seq,true);remember(s,'gus','two.edges.'+s.day,'tray lift#'+e.seq,true);}
      openWindow(s,'conveyor','tray lift#'+e.seq);d.errand='returning';s.tasks.ed.duty='cleared';go(s,'ed',d.posts.ed);
    }
    return;
  }

  // The operator must actually meet a raised rim. Pressure alone leaves the hands unhurt.
  if(d.injury==='none'&&s.pace==='pushed'&&s.injuryExposure>=20&&occupied(s,'mae')&&last?.tick===s.tick&&
     last.kind==='handoff.started'&&last.anchor==='control.intake'&&draw(s,[false,false,true])){
    const e=mark(s,'tray.misfeed','conveyor','control.intake',pos(s,'sam'),'sam',last.subject,'The tray rim jumps its guide');
    if(sees(s,'STILETTO',pos(s,'sam'),'sam'))remember(s,'STILETTO','rim.jumped','Intake#'+e.seq,true);
    if(s.world.active.some(a=>a.intent.initiator==='sam')&&sees(s,'mae',pos(s,'sam'),'sam')){
      s.world.facts['injury.sam']='bruised hand';d.injury='stopped';
      remember(s,'mae','saw.contact','rim contact#'+e.seq,true);remember(s,'sam','bruised','felt contact#'+e.seq,true);
      mark(s,'feed.stopped','conveyor','control.intake',pos(s,'mae'),'mae','sam','mae cuts the feed');
    }
  }
  if(d.injury==='stopped'&&!s.world.active.some(a=>a.intent.initiator==='sam')){
    s.tasks.mae.duty='seeking';s.tasks.sam.duty='seeking';
    go(s,'mae',meters(125,130.25));go(s,'sam',desk);d.injury='reporting';
  }
  if(d.injury==='reporting'&&dist(pos(s,'mae'),pos(s,'LIMEN'))<2300&&dist(pos(s,'sam'),pos(s,'LIMEN'))<2500){
    heard(s,phrase('mae',scripts.A1[0][1],'LIMEN','mae.injury.report',s.world.agents.mae.beliefs['saw.contact'].source),'security','tray contact');
    if(sees(s,'LIMEN',pos(s,'sam'),'sam'))remember(s,'LIMEN','saw.bruise','sam showed the bruised hand',true);
    d.injury='heard';for(const id of ['sam','mae']){s.tasks[id].duty='cleared';go(s,id,d.posts[id]);}
  }
}
