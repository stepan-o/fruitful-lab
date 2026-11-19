import type {Action,Phase,Point,PropLocation,World} from '../encounters/contract';
import {operationPhase,strikeOutcome} from '../encounters/shared-actions';
import {distance,geom,mm,score,tickAt} from './floor';

export type Opportunity={action:Action;actor:string;goal:string;priority:number;opens:number;closes:number;perceive?:(w:World)=>boolean;expected?:string;alternative?:boolean};
const rooms=['outside','lobby','dispatch','security','conveyor'] as const;
export const hand=(agent:string):PropLocation=>({kind:'hand',agent,socket:'right'});
const stowed=(agent:string):PropLocation=>({kind:'stowed',agent});
const ground=(p:number[]):PropLocation=>({kind:'floor',position:mm(p),yaw:0});
export function opportunities():Opportunity[]{
  const result:Opportunity[]=[];
  function plan(id:string,actor:string,goal:string,start:number,end:number,phase:Partial<Phase>,options:Partial<Opportunity>={},action:Partial<Action>={}){
    const definition:Action={id,room:'security',additionalRooms:[...rooms],participants:[actor],resources:[],requires:[],reason:goal,
      phases:[{id,ticks:Math.max(1,tickAt(end)-tickAt(start)),perform:[],...phase}],...action};
    result.push({action:definition,actor,goal,priority:50,opens:tickAt(start),closes:tickAt(start)+12,...options});
  }
  const [drop,boot]=geom.contact.credential;
  plan('offer-card','bob','Present my credential',23.2,23.5,{transfers:[{prop:'bob:id',from:stowed('bob'),to:hand('bob'),observedBy:['bob']}]});
  const strike=strikeOutcome({id:'strike',ticks:5,perform:[]},'LIMEN','bob');
  plan('strike','LIMEN','Enforce the order to stand still',26.35,26.6,{...strike,transfers:[{prop:'bob:id',from:hand('bob'),to:ground(drop),observedBy:['bob']}]},{expected:'injury.bob'},{
    participants:['LIMEN','bob'],requires:[{agent:'LIMEN',near:'bob',within:1550},{prop:'bob:id',heldBy:'bob',equals:true}]});
  // The dropped card slides in two mechanically bounded contacts towards ed's boot.
  const middle=drop.map((v,i)=>(v+boot[i])/2);
  for(const [i,[from,to]] of [[drop,middle],[middle,boot]].entries()){
    plan('card-slide-'+i,'ed','Stop the sliding card',26.85+i*.45,27.25+i*.45,{transfers:[{prop:'bob:id',from:ground(from),to:ground(to),observedBy:[]}]},{},{requires:[{fact:'injury.bob',equals:'limping'}]});
  }
  plan('pocket-card','ed','Keep the loose credential',30.1,30.65,{transfers:[{prop:'bob:id',from:ground(boot),to:stowed('ed'),observedBy:['ed']}]},{
    priority:85,perceive:w=>{const p=w.props?.['bob:id'].location;return p?.kind==='floor'&&distance(w.agents.ed.position,p.position)<=1400;}});
  plan('watch-card','ed','Keep sight of the loose credential',30.1,30.35,{},{
    priority:30,alternative:true,perceive:w=>{
      const p=w.props?.['bob:id'].location;
      return p?.kind==='floor'&&distance(w.agents.ed.position,p.position)<4500;
    }
  });
  plan('gate-post','LIMEN','Let the supervisor through',score.gate.openings[0][0]-.05,score.gate.openings[0][0],{effects:[{fact:'gate.staffed',value:true}]},{perceive:w=>distance(w.agents.LIMEN.position,mm(geom.contact.patrolPost))<450});
  const starts=[[51,61.85,68.6,75.15],[101.5,115.95,121.8,126.9],[153.1,155.6,158.2,160.7]];
  const ends=[[55.1,64.65,70.1,76.65],[105.9,117.95,123.1,128.05],[154.8,157.8,160.3,163.1]];
  const operators=[['bob','bob','bob','bob'],['sam','bob','bob','bob'],['sam','bob','jo','max']];
  const stations=['intake','wash','belt','forge'] as const;
  starts.forEach((times,batch)=>times.forEach((start,index)=>{
    const piece='cortex-'+(batch+1),agent=operators[batch][index],station=geom.stations[index];
    const socket={agent,position:mm([station.x,station.y]),within:850};
    const phase=operationPhase({id:stations[index],ticks:tickAt(ends[batch][index])-tickAt(start),perform:[],
      completesWhen:batch===1&&index===3?[{fact:'press.jammed',equals:false}]:[],effects:[{fact:piece+'.stage',value:index+1}]},
      {station:stations[index],from:index,to:index+1,operator:socket,workpiece:piece});
    plan(piece+'-'+stations[index],agent,'Run '+station.name+' for '+piece,start,ends[batch][index],phase,{
      expected:piece+'.stage',perceive:w=>{
        const instruction=batch===0?[13,14,15,16][index]:batch===1&&index===0?26:undefined;
        return distance(w.agents[agent].position,socket.position)<=socket.within&&
          (instruction===undefined||w.agents[agent].beliefs['heard.line.'+instruction]?.source==='STILETTO');
      }
    },{resources:[stations[index]],requires:[{fact:piece+'.socket',equals:index},...(batch===1&&index===3?[{fact:'press.jammed',equals:false}]:[])]});
  }));
  plan('press-jams','bob','Inspect the stalled door',101.65,101.75,{effects:[{fact:'press.jammed',value:true}]},{perceive:w=>distance(w.agents.bob.position,mm([131.7,144.4]))<750});
  plan('palm-release','bob','Free the jammed door',108.95,109.3,{effects:[{fact:'press.jammed',value:false}]},{
    priority:90,perceive:w=>w.agents.bob.beliefs['heard.line.27']?.source==='STILETTO'&&distance(w.agents.bob.position,mm([131.7,144.4]))<600
  },{requires:[{fact:'press.jammed',equals:true},{agent:'bob',at:mm([131.7,144.4]),within:600}],resources:['forge']});
  // The scanner is the physical handoff surface between the two marked roots.
  const tray=ground(geom.contact.photo.map((v,i)=>(v+geom.contact.fourthClerk[i])/2));
  const photoSteps:[string,string,number,PropLocation,PropLocation][]=[
    ['show-photo','max',130.65,stowed('max'),hand('max')],['place-photo','max',130.85,hand('max'),tray],
    ['inspect-photo','LIMEN',131.1,tray,hand('LIMEN')],['return-photo','LIMEN',137.8,hand('LIMEN'),tray],
    ['recover-photo','max',138.05,tray,stowed('max')]];
  for(const [id,actor,t,from,to] of photoSteps)plan(id,actor,'Verify the fourth credential',t,t+.1,{transfers:[{prop:'max:id',from,to,observedBy:[actor]}]});
  for(const [i,line] of score.speech.entries()){
    if(line.speaker==='BELL')continue;
    const to=line.aside==='to ben'?['ben']:Object.keys(score.tracks).filter(id=>id!==line.speaker);
    plan('speech-'+i,line.speaker,'Speak during the exchange',line.start,line.start+.05,{say:[{
      speaker:line.speaker,text:line.text,to,act:'response',seconds:line.end-line.start,cause:'Day One dialogue',
      channel:line.text===line.text.toUpperCase()?'shout':'local',claim:{fact:'heard.line.'+i,value:true}
    }]},{priority:65},{channel:'speech'});
  }
  return result.sort((a,b)=>a.opens-b.opens||a.action.id.localeCompare(b.action.id));
}
