import {dayOneClock,dayOneProgress} from './day-one-presentation';
import {rehearsal,rehearsalView} from './rehearsals';
import {advance} from './kernel';
import {attentionSteps,factoryClock,readingView} from './attention';
import type {Phase,View} from './contract';

const take=rehearsal('arrival','care');
let clock=1;
const phases=Object.values(take.registry).flatMap(a=>a.phases.map(p=>{const start=clock;clock+=p.ticks;return {action:a.id,p,start,end:clock};}));
const find=(predicate:(p:Phase)=>boolean)=>{const phase=phases.find(v=>predicate(v.p));if(!phase)throw Error('Missing required phase');return phase;};
const effect=(fact:string,value:string|number)=>find(p=>p.effects?.some(e=>'fact'in e&&e.fact===fact&&e.value===value)??false);
const paired=effect('day.stage','production'),output=effect('line.paired-output',1),staffing=effect('day.stage','staffing'),staffed=effect('line.batch',3),departure=effect('day.stage','departure');
const jo=find(p=>p.credentialStatus?.actorId==='jo'),gates=attentionSteps(take.registry);
const wanted=new Set([paired.end-1,paired.end,output.end,staffing.end,staffed.end,departure.end,jo.start,take.total,...gates.map(g=>g.tick)]);
const frames=new Map<number,View>();
beforeAll(()=>{
 let world=take.world;
 while(world.tick<take.total){world=advance(world,take.registry,take.space,take.planner);if(wanted.has(world.tick))frames.set(world.tick,rehearsalView(take,world));}
 expect(world.events.filter(e=>e.kind==='cancelled'||e.kind==='rejected')).toEqual([]);
});
const at=(tick:number)=>{const view=frames.get(tick);if(!view)throw Error('Missing replay frame '+tick);return view;};

it('keeps Jo inspection distinct from staffed production and the end of the day',()=>{
 const view=at(jo.start);
 expect(view.dayOne).toMatchObject({stage:'production',crew:2,productionOutputs:1});
 expect(view.credentialStatus).toMatchObject({actorId:'jo',verified:false});
 expect(dayOneClock(view.tick,view.dayOne)).toBe(factoryClock(view.tick));
 expect(dayOneProgress(view)).toEqual({heading:'jo · credential check',outputReady:false});
});

it('keeps all six input gates on factory time through a long reading hold',()=>{
 expect(gates.map(g=>g.label)).toEqual(['Seat the brain','Run the wash','Start the main belt','Compress the brain','Start the staffed line','End the shift']);
 for(const gate of gates){const view=at(gate.tick),held=readingView(view,gate,600);
  expect(dayOneClock(view.tick,view.dayOne)).toMatch(/^08:\d\d:\d\d$/);
  expect(dayOneClock(held.tick,held.dayOne)).toBe(dayOneClock(view.tick,view.dayOne));
 }
 const end=at(gates.at(-1)!.tick);
 expect(dayOneProgress(end)?.heading).toBe('Production output 3 complete');expect(end.finished).toBe(false);
});

it('commits the production label with the actual setup effect, never its preceding speech',()=>{
 // Earlier export event-299 was at3911, not3900. New charged detours change that
 // tick; both sides of the same authoritative effect remain the contract.
 expect(at(paired.end-1).dayOne?.stage).toBe('tutorial');
 expect(dayOneProgress(at(paired.end-1))).toBeUndefined();
 expect(at(paired.end).dayOne?.stage).toBe('production');
 expect(dayOneProgress(at(paired.end))?.heading).toBe('The paired cycle is in progress');
});

it('distinguishes completed output, staffing, departure and real night',()=>{
 expect(dayOneProgress(at(output.end))?.heading).toBe('Second production output complete');
 expect(dayOneProgress(at(staffing.end))?.heading).toBe('The shift joins the line');
 expect(dayOneProgress(at(staffed.end))?.heading).toBe('The staffed cycle is in progress');
 const leaving=at(departure.end);expect(dayOneProgress(leaving)?.heading).toBe('The shift is leaving');
 expect(dayOneClock(leaving.tick,leaving.dayOne)).not.toBe('End of shift');
 const night=at(take.total);expect(night.dayOne).toMatchObject({stage:'night',departed:12,productionOutputs:3});
 expect(dayOneClock(night.tick,night.dayOne)).toBe('End of shift');expect(dayOneProgress(night)).toBeUndefined();
});
