import {staffedProduction} from './day-one-production';
import {conveyorControl,CONVEYOR_STATIONS} from './arrival-layout';
import {ENCOUNTER_VERSION,type World,type SpatialServices,type Performance} from './contract';
import {advance,admit,project} from './kernel';
const operators={intake:'bob',wash:'sam',belt:'jo',forge:'max'},ids=Object.values(operators);
const space:SpatialServices={connected:()=>true,canTraverse:()=>true,canHear:()=>true};
function fixture(){
 const world:World={version:ENCOUNTER_VERSION,tick:0,sequence:0,agents:{},facts:{'day.number':1,'day.stage':'staffing','line.staffed':true,'line.output':2},resources:[],held:{},active:[],done:[],events:[]};
 for(const s of CONVEYOR_STATIONS){const id=operators[s.id];world.agents[id]={id,name:id,character:'worker',room:'conveyor',position:conveyorControl(s.id),yaw:180,beliefs:{},stress:0,trust:50,memory:[]};world.facts[`line.crew.${id}`]=true;world.facts[`line.operator.${s.id}`]=id;}
 const rest:Performance[]=ids.map(agent=>({agent,motion:'idle',cue:{clip:'Quiet_Wait',loop:true}}));const action=staffedProduction(operators,ids,[],rest),registry={[action.id]:action};
 return {world,action,registry};
}
describe('real staffed production state',()=>{
 it('moves one operational brain through four operator-guarded phases before output',()=>{const {world,action,registry}=fixture();let s=admit(world,{id:action.id,action:action.id,initiator:'bob'},registry,space);const stages=new Set<number>();for(let i=0;i<700;i++){s=advance(s,registry,space);stages.add(Number(s.facts['line.stage']??0));if(s.facts['line.stage']!==4)expect(s.facts['line.output']).toBe(2);}expect([...stages]).toEqual([0,1,2,3,4]);expect(s.facts['line.output']).toBe(3);expect(s.facts['line.staffed-output']).toBe(1);expect(project(s,registry).dayOne?.stationOperators).toEqual(operators);});
 it('does not manufacture output when even a non-current operator leaves',()=>{const {world,action,registry}=fixture();let s=admit(world,{id:action.id,action:action.id,initiator:'bob'},registry,space);for(let i=0;i<65;i++)s=advance(s,registry,space);s.agents.max.position=[150000,108000];s=advance(s,registry,space);expect(s.events.some(e=>e.kind==='cancelled')).toBe(true);expect(s.facts['line.output']).toBe(2);});
 it('requires the two real prior outputs before staffed production',()=>{const {world,action,registry}=fixture();world.facts['line.output']=0;const s=admit(world,{id:action.id,action:action.id,initiator:'bob'},registry,space);expect(s.active).toHaveLength(0);expect(s.events.at(-1)?.kind).toBe('rejected');expect(s.facts['line.output']).toBe(0);});
 it('rejects unstaffed or duplicate assignments',()=>{const {world,action,registry}=fixture();world.facts['line.staffed']=false;expect(admit(world,{id:action.id,action:action.id,initiator:'bob'},registry,space).active).toHaveLength(0);expect(()=>staffedProduction({...operators,forge:'bob'},ids,[],[])).toThrow(/distinct/);});
});

describe('Max Forge one complete non-cyclic stroke',()=>{
 it('keeps all six work seconds and source .4 through the exact final sample without wrapping',()=>{
  const {action}=fixture(),phase=action.phases.find(p=>p.id==='The staffed forge operates')!;
  const cue=phase.perform!.find(p=>p.agent==='max')!.cue!;
  expect(phase.ticks).toBe(120);expect(cue.clip).toBe('Push_Forward_and_Stop');expect(cue.loop).toBe(false);expect(cue.start).toBe(.4);expect(cue.blend).toBe(.2);
  expect(cue.start!+6*cue.rate!).toBeCloseTo(2.5999999046325684,12);
  for(const seam of [2.2,4.8]){
   const at=(seconds:number)=>cue.start!+seconds*cue.rate!;
   expect(at(seam-1/120)).toBeLessThan(at(seam));expect(at(seam)).toBeLessThan(at(seam+1/120));
  }
  const release=action.phases.find(p=>p.id==='The first operational output is ready')!;
  expect(release.perform!.find(p=>p.agent==='max')!.cue!.clip).toBe('Quiet_Wait');expect(release.ticks).toBe(100);
 });
 it('preserves other workers, station guards, effect timing and non-Max Forge assignments',()=>{
  const {action}=fixture();
  for(const phase of action.phases.filter(p=>p.process)){
   expect(phase.ticks).toBe(120);expect(phase.process!.staffing).toHaveLength(4);
   const current=phase.perform!.find(p=>p.agent===phase.process!.operator.agent)!;
   if(current.agent!=='max')expect(current.cue).toEqual({clip:'Push_Forward_and_Stop',start:.4,rate:1,loop:true,blend:.2});
  }
  const reassigned={...operators,forge:'ed'},members=Object.values(reassigned),rest:Performance[]=members.map(agent=>({agent,motion:'idle',cue:{clip:'Quiet_Wait',loop:true}}));
  const ed=staffedProduction(reassigned,members,[],rest).phases.find(p=>p.id==='The staffed forge operates')!;
  expect(ed.perform!.find(p=>p.agent==='ed')!.cue).toEqual({clip:'Push_Forward_and_Stop',start:.4,rate:1,loop:true,blend:.2});
  expect(action.phases.map(p=>p.ticks)).toEqual([60,120,120,120,120,100]);
 });
 it('projects the complete terminal Push source into the existing release blend',()=>{
  const {world,action,registry}=fixture();let state=admit(world,{id:action.id,action:action.id,initiator:'bob'},registry,space),seen=false;
  for(let tick=0;tick<650;tick++){
   state=advance(state,registry,space);
   const view=project(state,registry).actors.find(a=>a.id==='max');
   if(view?.previous?.cue.clip==='Push_Forward_and_Stop'&&view.cue?.clip==='Quiet_Wait'){
    expect(view.previous.seconds).toBe(6);expect(view.previous.cue.loop).toBe(false);
    expect(view.previous.cue.start!+view.previous.seconds*view.previous.cue.rate!).toBeCloseTo(2.5999999046325684,12);
    seen=true;break;
   }
  }
  expect(seen).toBe(true);
 });
});
