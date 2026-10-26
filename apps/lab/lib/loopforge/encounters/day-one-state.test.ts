import {arrival} from './arrival';
import {conveyorControl} from './arrival-layout';
import {dayOneState} from './day-one-state';

it('separates a paired operator at Belt from jo’s later assignment while jo waits',()=>{
 const {world:w}=arrival();w.facts['day.stage']='production';w.facts['line.operator.intake']='bob';w.facts['line.operator.wash']='sam';w.facts['line.operator.belt']='jo';
 w.agents.bob={...w.agents.bob,room:'conveyor',position:conveyorControl('belt')};w.agents.jo={...w.agents.jo,room:'conveyor',position:[145800,109600]};
 const view=dayOneState(w.facts,w.agents)!;
 expect(view.stationOperators.belt).toBe('jo');expect(view.stationOccupancy.belt).toBe('bob');expect(view.stationOccupancy.intake).toBeNull();
});
it('shows a visitor physically occupying an unassigned control without granting assignment',()=>{
 const {world:w}=arrival();w.agents.limen={...w.agents.limen,room:'conveyor',position:conveyorControl('forge')};
 const view=dayOneState(w.facts,w.agents)!;expect(view.stationOccupancy.forge).toBe('limen');expect(view.stationOperators.forge).toBeNull();expect(w.facts['line.operator.forge']).toBeUndefined();
});
it('keeps the assignment visible while a departing operator no longer occupies the socket',()=>{
 const {world:w}=arrival();w.facts['day.stage']='departure';w.facts['line.operator.intake']='bob';w.agents.bob={...w.agents.bob,room:'conveyor',position:conveyorControl('intake')};
 expect(dayOneState(w.facts,w.agents)!.stationOccupancy.intake).toBe('bob');
 w.agents.bob={...w.agents.bob,position:[136500,108500]};const view=dayOneState(w.facts,w.agents)!;
 expect(view.stationOperators.intake).toBe('bob');expect(view.stationOccupancy.intake).toBeNull();expect(view.departed).toBe(0);
});

it('retains Bob at Belt while Sam operates Forge and excludes departed actors',()=>{
 const {world:w}=arrival();w.facts['day.stage']='production';w.facts['line.operator.belt']='jo';
 w.agents.bob={...w.agents.bob,room:'conveyor',position:conveyorControl('belt')};w.agents.sam={...w.agents.sam,room:'conveyor',position:conveyorControl('forge')};w.agents.jo={...w.agents.jo,room:'conveyor',position:[145800,109600]};
 const before=dayOneState(w.facts,w.agents)!;expect(before.stationOccupancy.belt).toBe('bob');expect(before.stationOccupancy.forge).toBe('sam');expect(Object.values(before.stationOccupancy).filter(Boolean)).toHaveLength(2);
 w.facts['day.departed.bob']=true;expect(dayOneState(w.facts,w.agents)!.stationOccupancy.belt).toBeNull();
});
