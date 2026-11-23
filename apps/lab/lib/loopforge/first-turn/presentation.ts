/** Public facts → renderer adapter. It owns no clock, outcomes or hidden state. */
import type { PlayerView } from './contract';
import { STUDY_VERSION, type StudyState } from '../factory-study/kernel';
import { FLOOR_VERSION, INITIAL_UNLOCKED } from '../spatial/floor';
export function floorPresentation(v:PlayerView, playing:boolean):StudyState {
  const f=v.floor;
  return { version:STUDY_VERSION,floorVersion:FLOOR_VERSION,unlockedRooms:[...INITIAL_UNLOCKED],tick:f.simTick,day:1,
    phase:f.stage==='settled'?'night':v.phase==='running'||v.phase==='decision'?'shift':'morning',shiftTick:f.simTick,
    installed:f.installed,running:playing,jammed:v.pending?.room==='conveyor',pace:f.drive==='push'?'push':'steady',travel:f.travel,cycles:v.produced,nextEvent:v.events.length+1,
    process:{intake:f.intake,outtake:f.outtake,assembly:f.assembly,blocked:f.blocked},
    workers:f.actors.map(a=>({id:Number(a.id.split('-')[1]),progress:a.distance,waiting:a.task!=='carry',position:{x:a.x,y:a.y,dx:a.dx,dy:a.dy,room:a.room},task:a.task,distance:a.distance})),
    events:v.events.slice(-20).map((e,i)=>({id:Math.max(0,v.events.length-20)+i+1,tick:e.tick,kind:e.kind==='incident'?'jam':e.kind==='production'?'cycle':e.kind==='resolution'?'release':'phase',text:e.title})),
  };
}
