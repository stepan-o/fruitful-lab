import {admit,advance} from '../encounters/kernel';
import {ENCOUNTER_VERSION,type World,type Registry,type SpatialServices} from '../encounters/contract';
import {audible,distance,editAt,gateLength,geom,lastTick,mm,moveCast,roomAt,score,startRoutes,worldAt} from './floor';
import {opportunities,type Opportunity} from './plans';

export type Trace={tick:number;actor:string;goal:string;plan:string;reason:string};
export type Policies={observe:(p:Opportunity,w:World)=>boolean;score:(p:Opportunity,w:World)=>number;select:(c:Opportunity[],w:World,policy:Policies)=>Opportunity|undefined};
export const authored:Policies={
  observe:(p,w)=>p.perceive?.(w)??true,
  score:(p,w)=>w.agents[p.actor].beliefs['available.'+p.action.id]?.value?p.priority:-1,
  select:(c,w,policy)=>c.filter(p=>policy.score(p,w)>=0).sort((a,b)=>policy.score(b,w)-policy.score(a,w)||a.action.id.localeCompare(b.action.id))[0]
};
const space:SpatialServices={connected:()=>true,canTraverse:()=>false,canHear:(a,b,_w,channel)=>audible(a,b,channel==='shout')};
import {playableTracks} from './playable-score';
const archive=opportunities(), playable=opportunities(true);
function actions(plans:Opportunity[]):Registry{return Object.fromEntries(plans.map(p=>[p.action.id,p.action]));}
const archiveActions=actions(archive),playableActions=actions(playable);
const initialAgents=()=>Object.fromEntries(Object.entries(score.tracks).sort(([a],[b])=>a.localeCompare(b)).map(([id,keys])=>{
  const position=mm(keys[0].p);
  return [id,{id,name:id,character:id==='LIMEN'?'limen':id==='STILETTO'?'stiletto':'worker',room:roomAt(position),position,yaw:0,beliefs:{},memory:[],stress:0,trust:50}];
})) as World['agents'];
export class Intro {
  world:World={version:ENCOUNTER_VERSION,tick:0,sequence:0,agents:initialAgents(),facts:{'press.jammed':false,'cortex-1.stage':0,'cortex-2.stage':0,'cortex-3.stage':0},props:Object.fromEntries(['bob','max'].map(id=>[id+':id',{id:id+':id',kind:'credential',owner:id,location:{kind:'stowed',agent:id}}])),resources:['intake','wash','belt','forge'],held:{},active:[],done:[],completed:[],events:[]};
  // Line coordinates and transit are state. Only committed machine phases initiate travel.
  pieces=[1,2,3].map(batch=>({id:'cortex-'+batch,x:Math.round(geom.stations[0].x*1000),y:Math.round(geom.forgeHall.carrierY*1000),stage:0,visible:false}));
  routes=startRoutes();
  gate=geom.gate.length;
  trace:Trace[]=[];
  private cursor=0;
  private waiting:Opportunity[]=[];
  private attempts=new Map<string,number>();
  deliberations=0;
  private intentions=new Map<string,Opportunity>();
  private library:Opportunity[];
  private registry:Registry;
  constructor(readonly policy:Policies=authored,readonly timedDeliberation?:(run:()=>void)=>void,readonly guided=false){
    this.library=guided?playable:archive;this.registry=guided?playableActions:archiveActions;
    for(const piece of this.pieces)this.world.facts[piece.id+'.socket']=0;
    this.deliberate();
  }
  private transport(){
    for(const [i,piece] of this.pieces.entries()){
      const stage=Number(this.world.facts[piece.id+'.stage']);
      piece.visible ||= this.world.active.some(a=>a.intent.action===piece.id+'-intake')||worldAt(this.world.tick)>=[51,101.5,113.5][i];
      if(!stage)continue;
      piece.stage=stage;
      const target=stage===4?mm(geom.contact.outputSlots[i]):mm([geom.stations[stage].x,geom.forgeHall.carrierY]);
      const dx=target[0]-piece.x,dy=target[1]-piece.y,d=Math.hypot(dx,dy);
      if(d<=500){piece.x=target[0];piece.y=target[1];this.world.facts[piece.id+'.socket']=stage;}
      else{piece.x+=Math.round(dx*500/d);piece.y+=Math.round(dy*500/d);}
    }
  }
  private note(p:Opportunity,reason:string){this.trace.push({tick:this.world.tick,actor:p.actor,goal:p.goal,plan:p.action.id,reason});}
  private deliberate(){
    if(this.timedDeliberation)this.timedDeliberation(()=>this.choose());
    else this.choose();
  }
  private choose(){
    const w=this.world,library=this.library;
    while(this.cursor<library.length&&library[this.cursor].opens<=w.tick)this.waiting.push(library[this.cursor++]);
    if(!this.waiting.length)return;
    this.deliberations++;
    const candidates=new Map<string,Opportunity[]>();
    this.waiting=this.waiting.filter(p=>{
      if(p.alternative&&w.props?.['bob:id']?.location.kind!=='floor')return false;
      if(w.tick>p.closes){if(!p.alternative)this.note(p,'Expired after reconsideration');return false;}
      const prior=w.agents[p.actor].beliefs['available.'+p.action.id];
      const observed=this.policy.observe(p,w);
      if(prior?.value!==observed){
        w.agents[p.actor].beliefs['available.'+p.action.id]={mode:'observed',source:p.perceive?'local contact':'scenario cue',tick:w.tick,value:observed};
        this.note(p,observed?'Observed '+w.agents[p.actor].beliefs['available.'+p.action.id].source:'Waiting for a required observation');
      }
      const lane=p.actor+'/'+(p.action.channel??'body');
      const list=candidates.get(lane)??[];
      if(observed){list.push(p);candidates.set(lane,list);}
      return true;
    });
    for(const options of candidates.values()){
      const p=this.policy.select(options,this.world,this.policy);
      if(!p||this.world.held[(p.action.channel??'actor')+':'+p.actor])continue;
      const tries=this.attempts.get(p.action.id)??0;
      const id=p.action.id+(tries?'#'+tries:'');
      this.attempts.set(p.action.id,tries+1);
      this.world=admit(this.world,{id,initiator:p.actor,action:p.action.id},this.registry,space);
      const accepted=this.world.active.some(a=>a.intent.id===id);
      this.note(p,accepted?'Intention admitted':this.world.events.at(-1)?.detail??'Rejected');
      if(accepted){this.intentions.set(id,p);this.waiting=this.waiting.filter(o=>o!==p);}
    }
  }
  step(){
    if(this.world.tick>=lastTick)return;
    this.gate=gateLength(worldAt(this.world.tick+1),this.world.facts['gate.staffed']===true);
    moveCast(this.world,this.routes,this.gate,[],this.guided?playableTracks:undefined);
    const begin=this.world.events.length;
    this.world=advance(this.world,this.registry,space);
    for(const event of this.world.events.slice(begin)){
      const p=this.intentions.get(event.action);
      if(!p||!['cancelled','completed'].includes(event.kind))continue;
      this.intentions.delete(event.action);this.note(p,event.kind==='completed'?'Completed '+(p.expected??p.action.id):'Interrupted: condition changed');
      if(event.kind==='cancelled'&&this.world.tick<=p.closes)this.waiting.push(p);
    }
    this.transport();
    this.deliberate();
  }
  get seconds(){return editAt(worldAt(this.world.tick));}
  get finished(){return this.world.tick>=lastTick;}
  activePlans(){return [...this.intentions.values()].map(p=>p.action.id);}
  atControl(actor:string,i:number){const s=geom.stations[i];return distance(this.world.agents[actor].position,mm([s.x,s.y]))<850;}
}
