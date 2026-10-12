/** Integer, deterministic first-turn composition. The only owner of playable world mutation. */
import { initialState as dailyInitial, stepWithOperation as dailyStep, type State as DailyState } from '../first-shift/kernel';
import { project as dailyProject } from '../first-shift/projection';
import { crew, workforceTotals } from '../first-shift/workers';
import { FIXTURE_SOCKETS, LINE_ORIGIN } from '../spatial/floor';
import { BATCH_TICKS, type Command, type FloorView, type PlayerView } from './contract';
export type State = { revision: number; daily: DailyState; floor: FloorView; raised: string[]; strain: number };
export function initialState(seed: number, workers = 24): State {
  return { revision: 0, daily: dailyInitial(seed, workers), raised: [], strain: 0, floor: {
    stage: 'mandate', simTick: 0, installed: ['terminal','gate','drive'], feed: 'metered', drive: 'steady', intake: 0, assembly: 0, outtake: 0, released: 0, blocked: false, travel: 0, actors: Array.from({length:workers},(_,i)=>({id:`worker-${i+1}`,x:Math.round((60+(i%6)*1.1)*1000),y:Math.round((86+Math.floor(i/6)*1.2)*1000),dx:0,dy:-1,room:'lobby' as const,task:'wait' as const,distance:0})), concern: 'The line is ready. Receive the mandate, then choose your adviser.', earned: 0,
  } };
}
function record(s: State, title: string, detail: string, room: 'conveyor'|'security'|null = null) {
  s.daily.events.push({ id: `event-${s.daily.events.length+1}`, tick: s.revision, shiftTick: s.daily.shiftTick, kind: 'plan', room, title, detail, cause: 'Director command admitted by the first-turn kernel.', actor: 'director' });
}
function prepareActors(s: State) {
  s.floor.actors = crew(s.daily.workers).map((id,i) => {
    const room = s.daily.workers.assignment[id].room!;
    const n = room === 'security' ? i : i - crew(s.daily.workers,'security').length;
    const origin = room === 'security' ? FIXTURE_SOCKETS.gate : LINE_ORIGIN;
    return { id, room, x: Math.round((origin.x+(room==='security' ? n%4-1.5 : (n%8)-3.5))*1000), y: Math.round((origin.y+ (room==='security'?2+Math.floor(n/4)*.7: (Math.floor(n/8)%2===0?-1:1)*(2+Math.floor(n/16)*1.25)))*1000), dx: 0, dy: room==='conveyor' && Math.floor(n/8)%2===0 ? 1 : -1, task: 'wait' as const, distance: 0 };
  });
}
function fixedTick(s: State) {
  const f=s.floor; f.simTick++;
  const working=s.daily.downtime===0 && !f.blocked;
  if(working) f.travel += (f.drive==='push'?57:36)+[0,3,6,2,-1,-4,-6,0][f.simTick%8];
  for(const a of f.actors) {
    const body=s.daily.workers.body[a.id as keyof typeof s.daily.workers.body];
    if(body.status==='destroyed'){a.task='lost';continue;}
    if(body.status!=='active'){a.task='wait';continue;}
    const active=working && (a.room==='security'||f.intake>0||f.assembly>0);
    a.task=active?'work':'wait';
    // A subset carry cradles over a short real local path; no cross-factory teleport during a shift.
    if(active && Number(a.id.split('-')[1])%5===0) {
      const span=3000, phase=a.distance%(span*2), direction=phase<span?1:-1;
      a.x+=direction*50;a.dx=direction;a.dy=0;a.distance+=50;a.task='carry';
    }
  }
  if(f.simTick%20) return;
  let released=0, assemblyActive=false;
  if(s.daily.downtime===0){
    const clearance=s.daily.assignments?.security==='limen'?3:2;
    if(f.simTick%(clearance*20)===0) {released=Math.min(f.outtake,1);f.outtake-=released;f.released+=released;}
    const feedEvery=f.feed==='open'?20:80;
    if(f.feed!=='hold' && f.simTick%feedEvery===0 && f.intake<6) f.intake++;
    const capacity=crew(s.daily.workers,'conveyor').length*(s.daily.assignments?.conveyor==='stiletto'?2:1);
    if(f.intake>0&&f.outtake<3) {
      assemblyActive=true;
      f.assembly += Math.floor(capacity*(f.drive==='push'?3:2)/2);
      while(f.assembly>=80&&f.intake>0&&f.outtake<3){f.assembly-=80;f.intake--;f.outtake++;}
      f.assembly=f.intake>0&&f.outtake<3?f.assembly:0;
    }
  }
  f.blocked=f.outtake>=3;
  if(f.drive==='push'||f.blocked) s.strain+=f.blocked?3:2;else s.strain=Math.max(0,s.strain-1);
  let incident: 'conveyor'|'security'|null=null;
  if(s.daily.shiftTick<47 && s.strain>=16&&!s.raised.includes('conveyor')) incident='conveyor';
  else if(s.daily.shiftTick<47 && s.daily.assignments?.security==='stiletto'&&f.released>=3&&!s.raised.includes('security')) incident='security';
  if(incident)s.raised.push(incident);
  const wear=f.simTick%(f.drive==='push'?80:s.daily.assignments?.conveyor==='stiletto'?120:160)===0?1:0;
  s.daily=dailyStep(s.daily,{type:'advance'},{releasedWork:released*80,wear,incident,active:assemblyActive});
  const known=new Set(f.actors.map(a=>a.id));
  const made=s.daily.workers.order.filter(id=>s.daily.workers.identity[id].origin==='manufactured');
  for(let n=0;n<made.length;n++)if(!known.has(made[n]))f.actors.push({id:made[n],x:Math.round((129.5+n%3)*1000),y:Math.round((142.5+Math.floor(n/3))*1000),dx:1,dy:0,room:'conveyor',task:'wait',distance:0});
  f.concern=f.feed==='hold'?'Intake closed. Existing cradles can work through; no new supply enters.':f.blocked?'Outtake is full. Assembly is waiting for clearance.':f.intake>=5?'Intake is filling faster than assembly can use it.':f.drive==='push'?'Drive under load. Extra speed is using equipment headroom.':f.intake===0?'Assembly is waiting for an incoming cradle.':'The chain is moving within its current limits.';
}
export function step(previous: State, c: Command): State {
  const s: State=JSON.parse(JSON.stringify(previous));s.revision++;s.daily.tick=s.revision-1;
  const f=s.floor;
  switch(c.type){
    case 'acknowledge_mandate':
      if(f.stage!=='mandate')throw new Error('mandate_not_pending');
      f.stage='day';record(s,'Weekly mandate received','Deliver 60 basic robots by the end of day seven. Dispatch pays 12 funds per robot; retained output earns no contract payment.');break;
    case 'set_operation':
      if(f.stage!=='day'||s.daily.phase!=='running')throw new Error('operation_not_allowed');
      if(f.feed===c.feed&&f.drive===c.drive)throw new Error('operation_unchanged');
      f.feed=c.feed;f.drive=c.drive;
      record(s,'Line controls changed',`${c.feed==='hold'?'Closed':c.feed==='open'?'Open':'Metered'} intake; ${c.drive==='push'?'pushed':'steady'} drive. Existing wear remains.`, 'conveyor');
      for(const id of ['limen','stiletto'] as const){s.daily.minds[id].memories.push(`director-controls:${c.feed}:${c.drive}`);s.daily.minds[id].confidence=Math.max(0,Math.min(100,s.daily.minds[id].confidence+(id==='stiletto'&&c.drive==='push'?1:-1)));}
      break;
    case 'advance':
      if(f.stage!=='day'||s.daily.phase!=='running')throw new Error('shift_not_running');
      for(let n=0;n<BATCH_TICKS&&s.daily.phase==='running';n++)fixedTick(s);
      break;
    default:
      if(f.stage!=='day')throw new Error('opening_gate_required');
      s.daily=dailyStep(s.daily,c);
      if(c.type==='start_shift')f.concern='The first cradles are entering the line.';
      if(c.type==='approve_plan'){prepareActors(s);f.feed=s.daily.assignments?.conveyor==='stiletto'?'open':'metered';}
      if(c.type==='resolve_incident'&&c.response==='slow') {f.drive='steady';f.feed='metered';s.strain=0;}
      if(c.type==='commit_output') {f.earned=workforceTotals(s.daily.workers).committed*12;s.daily.cash+=f.earned;f.stage='settled';}
  }
  s.daily.tick=s.revision;
  return s;
}
export function replay(seed:number,commands:Command[],workers=24){return commands.reduce(step,initialState(seed,workers));}
export function project(s:State):PlayerView {return {...dailyProject(s.daily),tick:s.revision,floor:JSON.parse(JSON.stringify(s.floor))};}
