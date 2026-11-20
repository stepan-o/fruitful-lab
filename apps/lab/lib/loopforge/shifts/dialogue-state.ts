import type {Point} from './contract';

export type Slot = 'security'|'conveyor'|'departure';
export type Window = {id:string;slot:Slot;spent:boolean;closed:boolean;pair:string[];topic:string};
export type Line = {who:string;words:string;to:string;fact?:string;source?:string;quiet?:boolean};
export type Exchange = {topic:string;lines:Line[];next:number;due:number;room:'security'|'conveyor';window:string};
export type Dialogue = {
  indoorAt?:number;
  supervisorArrival?:import('../intro/floor').Route;
  arrival?:Record<string,import('../intro/floor').Route>;
  phase:'walk'|'welcome'|'posting'|'queue'|'work'|'departure'|'home';
  cue:number; ready:number; bell:number; bellReached:boolean; random:number; draws:number;
  exchanges:Exchange[]; windows:Window[]; passages:string[]; authorized:string[]; crossed:string[];
  posts:Record<string,Point>; faces:Record<string,string>; releaseAt:Record<string,number>; exitLeg:Record<string,number>; completed:string[]; replied:boolean;
  intent:Record<string,string>; exitAt:number; cutoff:number; occluded:string[]; masked:string[];
  transfer:'idle'|'offered'|'recognized'|'received'; transferAt:number; errand:'none'|'rack'|'returning'|'reported'; injury:'none'|'stopped'|'reporting'|'heard';
  checkTopic:string; checked:string[]; lastPause:number; teamAtBell:number; order:string[];
};
export function freshDialogue(seed:number):Dialogue {
  return {phase:'walk',cue:0,ready:0,bell:0,bellReached:false,random:seed,draws:0,exchanges:[],windows:[],
    passages:[],authorized:[],crossed:[],posts:{},faces:{},releaseAt:{},exitLeg:{},completed:[],replied:false,intent:{},
    exitAt:0,cutoff:-1,occluded:[],masked:[],transfer:'idle',transferAt:0,errand:'none',injury:'none',checkTopic:'',checked:[],
    lastPause:0,teamAtBell:0,order:[]};
}
