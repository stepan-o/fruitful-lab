/** Bounded authoring fixture. Integer ticks/mm, owned records, no renderer or clock.
 * This is a small BDI/action slice, not the complete first-turn simulation. */
export const AGENT_TEST_VERSION = 'loopforge-agent-test/1';
export const TEST_TICK_MS = 50;
export type TestKind = 'gate' | 'transfer' | 'intervention';
export type Cast = 'limen' | 'stiletto';
export type Clip = 'wait' | 'walk' | 'present' | 'inspect' | 'carry' | 'urge' | 'refuse';
export type Point = readonly [number, number, number];
export type TestConfig = { kind: TestKind; supervisor: Cast; count: 10 | 24 | 100; strained: boolean };
export type Actor = { id: string; appearance: string; position: Point; yaw: number; clip: Clip; phase: number; stride?: number };
export type TestAction = { id: string; kind: TestKind; worker: string; supervisor: Cast; start: number; end: number; resources: string[]; outcome: 'pending' | 'released' | 'transferred' | 'complied' | 'refused' | 'cancelled' };
export type Trace = { tick: number; action: string; observation: string; belief: string; desire: string; intention: string; validation: string; outcome: string };
export type TestState = { version: typeof AGENT_TEST_VERSION; tick: number; config: TestConfig; active: TestAction | null; history: TestAction[]; reservations: Record<string, string>; workers: string[]; nextWorker: number; completed: number; propOwner: string; trace: Trace[]; cancelled: boolean };
export type TestView = { version: typeof AGENT_TEST_VERSION; tick: number; room: 'security' | 'conveyor'; actors: Actor[]; active: TestAction | null; completed: number; propOwner: string; propPosition: Point; gateOpen: boolean; phase: string; finished: boolean };
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const lerp=(a:Point,b:Point,t:number):Point=>a.map((v,i)=>Math.round(v+(b[i]-v)*clamp(t))) as unknown as Point;
export function initialAgentTest(config:TestConfig):TestState {
 if(!['gate','transfer','intervention'].includes(config.kind)||!['limen','stiletto'].includes(config.supervisor)||![10,24,100].includes(config.count)||typeof config.strained!=='boolean')throw new Error('invalid_test_config');
 return {version:AGENT_TEST_VERSION,tick:0,config:{...config},active:null,history:[],reservations:{},workers:Array.from({length:config.count},(_,i)=>`worker-${String(i+1).padStart(3,'0')}`),nextWorker:0,completed:0,propOwner:'source-dock',trace:[],cancelled:false};
}
/** All or nothing, stable action owner. Used for actors as well as physical slots. */
export function reserve(resources:readonly string[],owner:string,held:Record<string,string>):Record<string,string>|null {
 if(new Set(resources).size!==resources.length||resources.some(id=>held[id]&&held[id]!==owner))return null;
 return {...held,...Object.fromEntries(resources.map(id=>[id,owner]))};
}
function free(s:TestState,action:TestAction){for(const resource of action.resources)if(s.reservations[resource]===action.id)delete s.reservations[resource];}
export function cancelAgentTest(state:TestState):TestState {
 const s:TestState={...state,reservations:{...state.reservations},history:[...state.history],trace:[...state.trace]};if(s.active){const action={...s.active,outcome:'cancelled' as const};free(s,action);s.history.push(action);s.trace.push({tick:s.tick,action:action.id,observation:'Operator stops this test.',belief:'The station is no longer available.',desire:'Leave the contact safe.',intention:'Cancel the paired action.',validation:'Both actor reservations released together.',outcome:'Cradle returned to the source dock; no completion awarded.'});s.active=null;s.propOwner='source-dock';}s.cancelled=true;return s;
}
export function stepAgentTest(state:TestState):TestState {
 if(state.cancelled||state.tick>=600)return state;
 const s:TestState={...state,tick:state.tick+1,reservations:{...state.reservations},history:[...state.history],trace:[...state.trace]};
 if(!s.active&&s.nextWorker<s.workers.length){const worker=s.workers[s.nextWorker],id=`action-${s.nextWorker+1}`,duration=s.config.kind==='gate'?(s.config.supervisor==='limen'?180:120):s.config.kind==='transfer'?240:180;
  const resources=[worker,s.config.supervisor,s.config.kind==='gate'?'gate-contact':'forge-contact',...(s.config.kind==='transfer'?['cradle']:[])],held=reserve(resources,id,s.reservations);
  if(held){s.reservations=held;s.active={id,kind:s.config.kind,worker,supervisor:s.config.supervisor,start:s.tick,end:s.tick+duration,resources,outcome:'pending'};
   s.trace.push({tick:s.tick,action:id,observation:s.config.kind==='gate'?'The next worker reaches the clearance queue.':s.config.kind==='transfer'?'A cradle is waiting at the source dock.':s.config.strained?'This worker has hesitated at the station.':'The station is occupied; its worker is available.',belief:s.config.supervisor==='limen'?'Unchecked clearance threatens orderly work.':'Delay is wasting usable capacity.',desire:s.config.supervisor==='limen'?'Preserve clearance discipline.':'Keep the line moving.',intention:s.config.kind==='gate'?(s.config.supervisor==='limen'?'Inspect, then release.':'Wave through without a full scan.'):s.config.kind==='transfer'?'Reserve both handles and the receiving dock.':s.config.supervisor==='limen'?'Ask for a controlled restart.':'Demand that this worker accelerates.',validation:'Actor and station slots acquired atomically.',outcome:'In progress.'});
  }
 }
 if(s.active){const a=s.active,elapsed=s.tick-a.start;
  if(a.kind==='transfer')s.propOwner=elapsed<60?'source-dock':elapsed<180?a.worker:'receiving-dock';
  if(s.tick>=a.end){const outcome=a.kind==='gate'?'released':a.kind==='transfer'?'transferred':s.config.strained&&s.config.supervisor==='stiletto'?'refused':'complied';const done={...a,outcome} as TestAction;free(s,done);s.history.push(done);s.active=null;s.completed+=outcome==='refused'?0:1;s.nextWorker++;
   s.trace.push({tick:s.tick,action:a.id,observation:outcome==='refused'?'The worker steps back and refuses to accelerate.':'The reserved action reaches its confirmed end.',belief:'The result is now observed.',desire:'Continue without inventing an outcome.',intention:outcome==='refused'?'Leave the station stopped.':'Admit the next task.',validation:'Fixed tick committed once; no animation callback.',outcome});
  }
 }
 // End of the bounded take releases every reservation, including a partial final action.
 if(s.tick===600&&s.active)return cancelAgentTest(s);
 return s;
}
export function replayAgentTest(config:TestConfig,tick:number):TestState {
 if(!Number.isInteger(tick)||tick<0||tick>600)throw new Error('invalid_test_tick');let s=initialAgentTest(config);for(let i=0;i<tick;i++)s=stepAgentTest(s);return s;
}
/** Projection includes visible behaviour, never the private stress/belief inputs. */
export function projectAgentTest(s:TestState):TestView {
 const gate=s.config.kind==='gate',a=s.active,e=a?s.tick-a.start:0,fast=s.config.supervisor==='stiletto',inspectEnd=fast?60:120,actors:Actor[]=s.workers.map((id,i)=>({id,appearance:['worker','worker-ribbed','worker-plated'][i%3],position:gate?[126500+(Math.floor(i/12))*1400,0,124800-(i%12)*900]:[116000+(i%10)*1100,0,154000+Math.floor(i/10)*1000],yaw:0,clip:'wait',phase:(s.tick+i*13)%60/60}));
 if(gate)for(let i=s.nextWorker;i<actors.length;i++){const lane=Math.floor(i/12),served=Math.max(0,Math.min(12,s.nextWorker-lane*12)),rank=i%12-served,shift=served>0?Math.round((1-clamp(e/40))*900):0;actors[i].position=[126500+lane*1400,0,124800-rank*900-shift];if(shift>0){actors[i].clip='walk';actors[i].phase=((900-shift)/1100)%1;}}
 const front:Point=gate?[126500,0,126650]:[120000,0,149550],supervisor:Point=gate?[125500,0,126650]:[118700,0,149550];
 actors.push({id:s.config.supervisor,appearance:s.config.supervisor,position:supervisor,yaw:-1571,clip:a?(gate?(e>=40&&e<inspectEnd?(fast?'urge':'inspect'):'wait'):s.config.kind==='intervention'&&e>40&&e<110?'urge':'wait'):'wait',phase:e%60/60});
 let propPosition:Point=[120000,1040,150100],phase='Waiting for the next agent.',open=false;
 if(a){const worker=actors.find(x=>x.id===a.worker)!;
  if(gate){worker.position=e<40?lerp([126500,0,124800-(s.nextWorker>0?900:0)],front,e/40):e<inspectEnd?front:lerp(front,[126500,0,130000],(e-inspectEnd)/(a.end-a.start-inspectEnd));worker.yaw=e>=40&&e<inspectEnd?1571:0;worker.clip=e<40||e>=inspectEnd?'walk':fast?'wait':'present';open=e>=inspectEnd;phase=e<40?'Approach · the queue holds.':e<inspectEnd?(fast?'STILETTO waves the worker through.':'LIMEN checks this worker’s credential.'):'Released · the next slot can advance.';
  }else if(s.config.kind==='transfer'){
   worker.position=e<40?lerp([120000,0,148500],front,e/40):e<90?front:e<150?lerp(front,[122000,0,149550],(e-90)/60):[122000,0,149550];worker.clip=e<40?'walk':e<200?'carry':'wait';worker.yaw=0;
   const rise=clamp((e-40)/20),lower=clamp((e-160)/20);propPosition=e<60?[120000,1040+Math.round(rise*110),150100]:e<180?[worker.position[0],1150-Math.round(lower*110),150100]:[122000,1040,150100];phase=e<40?'Approach · workstation reserved.':e<90?'Grip · both hands find the cradle.':e<150?'Carry · the same worker owns the cradle.':e<180?'Set down · align with the receiving dock.':'Release · ownership passes to the dock.';
  }else {const refuses=s.config.strained&&fast;worker.position=e<40?lerp([120000,0,148600],front,e/40):e>110&&refuses?lerp(front,[120000,0,149000],(e-110)/35):front;worker.yaw=e>=40?1571:0;worker.clip=e<40?'walk':e>110?(refuses?'refuse':'carry'):'wait';phase=e<40?'Approach · a worker is singled out.':e<110?(fast?'STILETTO: “The line is waiting for you.”':'LIMEN: “Procedure first. Then continue.”'):refuses?'The worker refuses. The station remains stopped.':'The worker accepts and returns to the task.';}
  worker.phase=e%60/60;
  // Presentation gait follows the confirmed path, not an unrelated animation clock.
  if(worker.clip==='walk'){
   const distance=gate?(e<40?(1850+(s.nextWorker>0?900:0))*clamp(e/40):3350*clamp((e-inspectEnd)/(a.end-a.start-inspectEnd))):1050*clamp(e/40);
   worker.phase=(distance/1100)%1;
  }
  if(s.config.kind==='transfer'&&e>=90&&e<150){worker.stride=(2000*clamp((e-90)/60)/750)%1;}

 }
 // Released workers stay through the gate; they do not teleport back into its queue.
 for(let i=0;i<s.nextWorker;i++){
  const w=actors[i],done=s.history.find(h=>h.worker===w.id)!,elapsed=s.tick-done.end;
  const from:Point=gate?[126500,0,130000]:s.config.kind==='transfer'?[122000,0,149550]:done.outcome==='refused'?[120000,0,149000]:[120000,0,149550];
  const to:Point=gate?[125000+(i%4)*1000,0,131500+Math.floor(i/4)*1000]:[123500+(i%4)*1000,0,152000+Math.floor(i/4)*1000];
  w.position=lerp(from,to,elapsed/60);w.yaw=Math.round(-Math.atan2(to[0]-from[0],to[2]-from[2])*1000);
  if(elapsed<60){w.clip='walk';w.phase=(Math.hypot(to[0]-from[0],to[2]-from[2])*clamp(elapsed/60)/1100)%1;}
 }
 return {version:AGENT_TEST_VERSION,tick:s.tick,room:gate?'security':'conveyor',actors,active:a?{...a,resources:[...a.resources]}:null,completed:s.completed,propOwner:s.propOwner,propPosition,gateOpen:open,phase,finished:s.tick>=600||s.cancelled};
}
