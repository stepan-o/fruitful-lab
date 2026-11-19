import {Intro} from './simulation';
import {geom,score,tickAt} from './floor';
import {order,type Item,type State,type Utterance} from './protocol';
export function projectIntro(sim:Intro):State{
  const w=sim.world,t=w.tick;
  const agents=Object.values(w.agents).sort((a,b)=>order(a.id,b.id)).map(a=>{
    const r=sim.routes[a.id],active=w.active.find(v=>v.intent.initiator===a.id&&!v.intent.action.startsWith('speech-'));
    return {agent_id:a.id,x:a.position[0],y:a.position[1],room:a.room,moving:r.moving,facing:r.facing,walked:r.walked,injured:w.facts['injury.'+a.id]==='limping',action:active?.intent.action??(r.moving?'walk':'idle')};
  });
  const items:Item[]=[];
  for(const prop of Object.values(w.props??{})){
    if(prop.location.kind==='stowed')continue;
    const floor=prop.location.kind==='floor';
    const position=prop.location.kind==='floor'?prop.location.position:w.agents[prop.location.agent].position;
    items.push({item_id:prop.id,x:position[0],y:position[1],holder:!floor&&'agent' in prop.location?prop.location.agent:'',stage:0});
  }
  for(const p of sim.pieces)if(p.visible)items.push({item_id:p.id,x:p.x,y:p.y,stage:p.stage,holder:''});
  const events:Utterance[]=w.events.filter(e=>e.kind==='speech'&&(e.until??0)>t).map(e=>({event_id:e.id,tick:e.tick,until:e.until!,speaker:e.agent!,text:e.detail}));
  const bell=score.speech.find(s=>s.speaker==='BELL')!;
  if(t>=tickAt(bell.start)&&t<tickAt(bell.end))events.push({event_id:'shift-bell',tick:tickAt(bell.start),until:tickAt(bell.end),speaker:'BELL',text:bell.text});
  events.sort((a,b)=>a.tick-b.tick||order(a.event_id,b.event_id));
  return {world:{layout:geom.version,gate_mm:Math.round(sim.gate*1000),jammed:w.facts['press.jammed']===true,outputs:items.filter(i=>i.stage===4).length},agents,items:items.sort((a,b)=>order(a.item_id,b.item_id)),events};
}
