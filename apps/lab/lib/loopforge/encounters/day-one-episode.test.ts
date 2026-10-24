import {arrival} from './arrival';
import {advance,project} from './kernel';
import {entryPlayback} from './entry-playback';
import {DAY_ONE_CREW} from './day-one-episode';
import {dayOneReviewPoints} from './day-one-state';
it('retains durable completion with full retained event history and ends only after all twelve leave',()=>{
 const t=arrival();let s=t.world;const stages=new Set<string>();let firstOutput=-1,departure=-1,night=-1;
 while(s.tick<t.total){s=advance(s,t.registry,t.space,t.planner);const d=project(s,t.registry).dayOne!;stages.add(d.stage);
  if(d.productionOutputs===1&&firstOutput<0)firstOutput=s.tick;
  if(d.departed>0&&departure<0)departure=s.tick;
  if(d.stage==='night'){night=s.tick;expect(d.departed).toBe(12);expect(d.productionOutputs).toBe(3);}
  if(d.stage==='production'&&s.facts['line.batch']===2){expect(s.facts['line.crew.bob']).toBe(true);expect(s.facts['line.crew.sam']).toBe(true);expect(d.crew).toBeGreaterThanOrEqual(2);expect(d.crew).toBeLessThanOrEqual(3);}
  if(d.stage==='production'&&s.facts['line.batch']===3){expect(d.crew).toBe(8);expect(Object.values(d.stationOperators).filter(Boolean)).toHaveLength(4);}
 }
 expect([...stages]).toEqual(['entry','tutorial','production','staffing','output','departure','night']);
 expect(firstOutput).toBeGreaterThan(entryPlayback(t.registry).endTick);expect(departure).toBeGreaterThan(firstOutput);expect(night).toBeGreaterThan(departure);
 expect(s.completed).toEqual(Object.keys(t.registry));expect(s.done).toEqual(s.completed);expect(s.facts['day.complete']).toBe(true);expect(s.facts['line.output']).toBe(3);expect(s.facts['line.tutorial-output']).toBe(1);expect(s.facts['line.paired-output']).toBe(1);expect(s.facts['line.staffed-output']).toBe(1);expect(s.events.length).toBeGreaterThan(256);expect(s.events[0].id).toBe('event-1');expect(s.props?.['bob:id'].location).toMatchObject({kind:'stowed',agent:'ed'});expect(s.agents.bob.beliefs['prop.bob:id.holder'].value).not.toBe('ed');
 expect(DAY_ONE_CREW).toHaveLength(8);expect(dayOneReviewPoints(t.registry).map(p=>p.id)).toEqual(['lobby','conveyor','security','production','output','departure','night']);
});

it('interrupts the paired cycle if Sam leaves the Wash control without manufacturing output',()=>{
 const t=arrival();let s=t.world;
 while(s.tick<t.total){s=advance(s,t.registry,t.space,t.planner);const p=project(s,t.registry).process?.active;if(p?.station==='wash'&&p.operator.agent==='sam'&&!p.staffing)break;}
 expect(s.facts['line.output']).toBe(1);expect(project(s,t.registry).process?.active?.operator.agent).toBe('sam');
 s.agents.sam.position=[139000,108500];s=advance(s,t.registry,t.space,t.planner);
 expect(s.events.some(e=>e.kind==='cancelled'&&e.action==='paired-production')).toBe(true);expect(s.facts['line.output']).toBe(1);expect(s.facts['line.paired-output']).toBeUndefined();expect(s.held).toEqual({});expect(t.planner.propose(s)).toEqual([]);
});
