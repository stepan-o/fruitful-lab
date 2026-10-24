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
