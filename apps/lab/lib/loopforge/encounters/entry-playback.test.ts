import {arrival} from './arrival';
import {entryPlayback,nextEntryStep,entryReadSeconds} from './entry-playback';
import type {Registry} from './contract';
import {attentionSteps} from './attention';
describe('automatic first entry',()=>{
 const take=arrival(),plan=entryPlayback(take.registry);
 it('walks through all three opening exchanges without an attention stop',()=>{
  expect(plan.steps.some(s=>['The morning walk','sam keeps walking','jo gives it a shift'].includes(s.id))).toBe(false);
  expect(plan.steps).toHaveLength(1);
  expect(nextEntryStep(plan,0)?.label).toBe('Seat the brain');
  expect(nextEntryStep(plan,0)?.tick).toBe(plan.endTick);
 });
 it('hands control to the first real station without dropping tutorial inputs',()=>{
  expect(plan.steps.at(-1)?.label).toBe('Seat the brain');
  expect(nextEntryStep(plan,plan.endTick)).toBeUndefined();
  for(const label of ['Run the wash','Start the main belt','Compress the brain'])expect(attentionSteps(take.registry).some(s=>s.tick>plan.endTick&&s.label===label)).toBe(true);
 });
 it('adds finite reading time without changing registry durations, custody or movement',()=>{
  expect(JSON.stringify(take.registry)).toBe(JSON.stringify(arrival().registry));
  const first=Object.values(take.registry)[0];
  const fixture:Registry={instruction:{...first,phases:[{id:'instruction',ticks:20,perform:[],say:[{speaker:'limen',to:['bob'],text:'Read this instruction.',seconds:5}]},{id:'input',ticks:1,perform:[],inputLabel:'Seat the brain'}]}};
  const before=JSON.stringify(fixture),reading=entryPlayback(fixture);
  expect(entryReadSeconds(reading,reading.steps[0])).toBeCloseTo(4.3);
  expect(JSON.stringify(fixture)).toBe(before);
  expect(plan.steps.every(s=>s.readSeconds>=0&&s.readSeconds<8)).toBe(true);
 });
 it('fails closed without a named input boundary',()=>{expect(()=>entryPlayback({})).toThrow(/Intake/);});
});
