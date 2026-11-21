import {held} from './stiletto-tutorial';
import {publicFloor,resume,type Progress} from './playthrough';
import {admitCommand,step,type Inheritance} from './simulation';
import {cutToSecurity} from './approach-edit';
import type {Command,Run} from './contract';

type Input={type:'join';source:Inheritance;progress:Progress}|{type:'command';cmd:Command}|{type:'suspend';on:boolean};
let run:Run|undefined, paused=false, cut=false, last=performance.now(), debt=0;
function publish(cmd?:Command){
  if(run)self.postMessage({type:'frame',floor:publicFloor(run),cmd});
}
function fail(error:unknown){paused=true;self.postMessage({type:'error',reason:String(error)});}
self.onmessage=({data:m}:{data:Input})=>{
  try{
    if(m.type==='join'){run=resume(m.source,m.progress);last=performance.now();publish();return;}
    if(m.type==='suspend'){paused=m.on;debt=0;last=performance.now();return;}
    if(!run||paused){
      self.postMessage({type:'notice',id:m.cmd.id,accepted:false,reason:paused
        ? 'Shift paused. Resume play to issue an order.'
        : 'The floor is still connecting. Try again when it opens.'});
      return;
    }
    const prior=run.history[m.cmd.id];
    if(!prior&&(m.cmd.tick>run.tick||run.tick-m.cmd.tick>15)){self.postMessage({type:'notice',reason:'The floor has changed. Try again.'});return;}
    const cmd={...m.cmd,tick:prior?.cmd.tick??run.tick};
    const result=admitCommand(run,cmd);
    if(result.accepted)publish(prior?undefined:cmd);
    else self.postMessage({type:'notice',reason:result.reason});
  }catch(e){fail(e);}
};
setInterval(()=>{
  const now=performance.now();debt=run?.phase==='shift'&&!paused&&!held(run)?Math.min(250,debt+now-last):0;last=now;
  try{
    if(!run||debt<50)return;
    while(debt>=50&&run.phase==='shift'&&!held(run)){
      debt-=50;
      if(!cut&&run.lead==='LIMEN'&&cutToSecurity(run))cut=true;
      else step(run);
    }
    publish();
  }catch(e){fail(e);}
},25);
