import type {Campaign} from './campaign-save';
import type {Command} from './contract';
import {editAt,worldAt} from '../intro/floor';
import {tutorialOrders} from '../intro/playable-score';

export const seekSeconds=10;
export type Speed=.5|1|2;
export type Transport={paused:boolean;speed:Speed};
type Point={
  at:number; phase:Campaign['phase']; seconds:number; confirmed:number; morning:number;
  topic:number; tick:number; orders:number; room:Campaign['room']; shot:number;
};
function point(run:Campaign):Point{
  return {at:0,phase:run.phase,seconds:run.seconds,confirmed:run.confirmed??0,morning:run.morningSeconds??0,
    topic:run.callTopic??0,tick:run.progress.tick,orders:run.progress.commands.length,room:run.room,shot:run.shotSeq};
}
function elapsed(a:Point,b:Point){
  if(a.phase!==b.phase)return 0;
  if(a.phase==='intro')return b.seconds-a.seconds;
  if(a.phase==='floor')return (b.tick-a.tick)/20;
  return b.morning-a.morning;
}
function sameBeat(a:Point,b:Point){
  return a.phase===b.phase&&a.orders===b.orders&&a.confirmed===b.confirmed&&a.topic===b.topic&&a.room===b.room&&a.shot===b.shot;
}
type RecordData={points:Point[];commands:Command[];position:number};

// Checkpoints follow time actually shown, excluding the editorial walking cut and
// time spent waiting for input. Commands are stored once and replayed by the kernel.
export class PlaybackTape {
  private data:RecordData={points:[],commands:[],position:0};
  private last:Point|undefined;
  constructor(readonly id:string){}
  save(){sessionStorage.setItem('loopforge.transport.'+this.id,JSON.stringify(this.data));}
  load(run:Campaign){
    const saved=sessionStorage.getItem('loopforge.transport.'+this.id);
    if(saved){
      try{this.data=JSON.parse(saved);this.last={...point(run),at:this.data.position};return;}catch{/* Recover at the current save. */}
    }
    // Older saves have the departure and command journal but no playback index.
    const start={...run,phase:'intro' as Campaign['phase'],seconds:0,confirmed:0,morningSeconds:0,callTopic:0,
      progress:{...run.progress,tick:0,commands:[] as Command[]},room:'security' as Campaign['room'],shotSeq:0};
    if(run.phase==='intro'||run.seconds>0){
      this.record(start);
      for(const order of tutorialOrders.slice(0,run.confirmed??0)){
        start.seconds=editAt(worldAt(order.tick));this.record(start,true);
        start.confirmed++;this.record(start,true);
      }
      start.seconds=run.seconds;this.record(start,true);
    }
    if(run.phase!=='intro'){
      start.phase='console';start.progress.tick=run.source!.tick;this.record(start,true);
      start.morningSeconds=run.morningSeconds??0;this.record(start,true);
      if(run.phase!=='console'){
        start.phase='call';this.record(start,true);
        if(run.phase==='floor'){
          start.phase='floor';this.record(start,true);
          for(const cmd of run.progress.commands){
            const seconds=(cmd.tick-start.progress.tick)/20;
            start.progress.tick=cmd.tick;this.record(start,true,seconds);
            start.progress.commands.push(cmd);this.record(start,true);
          }
        }
      }
    }
    this.record(run,true,Math.max(0,elapsed(point(start),point(run))));
  }
  discardFuture(){
    this.data.points=this.data.points.filter(p=>p.at<=this.data.position);
    if(this.last){this.data.commands.length=this.last.orders;this.data.points.push({...this.last});}
  }
  record(run:Campaign,forced=false,presented?:number){
    const next=point(run),prev=this.last,points=this.data.points;
    const change=prev?elapsed(prev,next):0;
    // A long Day 2 jump in one published frame is the walk-in splice.
    const delta=presented??(next.phase==='floor'&&change>1?.05:Math.max(0,change));
    if(prev&&delta===0&&sameBeat(prev,next)&&!forced)return;
    if(this.data.position<(points.at(-1)?.at??0))return;
    next.at=this.data.position+delta;
    this.last=next;this.data.position=next.at;
    for(let i=this.data.commands.length;i<run.progress.commands.length;i++)this.data.commands.push(run.progress.commands[i]);
    const end=points.at(-1);
    if(!end||forced||!sameBeat(end,next)||next.at-end.at>=.5)points.push(next);
  }
  seal(run:Campaign){
    if(this.data.position>=(this.data.points.at(-1)?.at??0))this.record(run,true);
  }
  // Returns a historical state and any forward time beyond recorded play.
  seek(run:Campaign,seconds:number){
    this.seal(run);
    const points=this.data.points;
    const end=points.at(-1)?.at??0;
    const wanted=Math.max(0,this.data.position+seconds);
    const at=end-wanted<1e-6?end:wanted;
    const i=at===0&&seconds<0?0:points.findLastIndex(p=>p.at<=at);
    const a=points[Math.max(0,i)];
    if(!a)return {run,remaining:Math.max(0,wanted-at)};
    const b=points[i+1],mark={...a,at};
    if(b&&b.at>a.at&&a.phase===b.phase){
      const fraction=(at-a.at)/(b.at-a.at);
      mark.seconds=a.seconds+(b.seconds-a.seconds)*fraction;
      mark.morning=a.morning+(b.morning-a.morning)*fraction;
      // The first tick after an editorial cut is an atomic cut.
      if(b.tick-a.tick<=Math.ceil((b.at-a.at)*20)+2)mark.tick=a.tick+Math.floor((b.tick-a.tick)*fraction);
    }
    this.data.position=at;this.last=mark;
    return {remaining:Math.max(0,wanted-at),run:{...run,phase:mark.phase,seconds:mark.seconds,confirmed:mark.confirmed,
      morningSeconds:mark.morning,callTopic:mark.topic,room:mark.room,shotSeq:mark.shot,
      progress:{...run.progress,tick:mark.tick,commands:this.data.commands.slice(0,mark.orders)}}};
  }
}
