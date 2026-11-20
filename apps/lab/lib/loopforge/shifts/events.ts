import {audible} from '../intro/floor';
import {type Point, type Room, type Run} from './contract';
export function mark(s:Run,kind:string,room:Room,anchor:string,at:Point,actor:string,subject:string,text:string,audience:string[]=[]){
  const item={seq:(s.marks.at(-1)?.seq??0)+1,tick:s.tick,day:s.day,kind,room,anchor,at:[...at] as Point,actor,subject,text,audience};
  s.marks.push(item);return item;
}
export function remember(s:Run,id:string,key:string,source:string,observed=false){
  s.world.agents[id].beliefs[key]={value:true,source,tick:s.tick,mode:observed?'observed':'reported'};
}
export function say(s:Run,speaker:string,text:string,room:Room,claim='',to?:string[],shout=false){
  const actor=s.world.agents[speaker];
  const listeners=Object.values(s.world.agents).filter(a=>a.id!==speaker&&!s.dialogue.masked.includes(a.id)&&s.tasks[a.id].duty!=='detained'&&(!to||to.includes(a.id))&&audible(actor,a,shout));
  const ev=mark(s,'speech.delivered',room,'actor.'+speaker,actor.position,speaker,'',text,to??[]);
  s.heard[String(ev.seq)]=listeners.map(a=>a.id);
  if(claim) for(const a of listeners)remember(s,a.id,claim,speaker+'#'+ev.seq);
  return ev;
}
export function thought(s:Run,actor:string,intent:string,why:string,evidence:string[]){
  s.thoughts.push({tick:s.tick,day:s.day,actor,intent,why,evidence});
}
