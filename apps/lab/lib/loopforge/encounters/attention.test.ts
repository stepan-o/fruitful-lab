import {attentionSteps,nextAttention,readingView,factoryClock} from './attention';
import {rehearsal,replay,rehearsalView} from './rehearsals';
import {conveyorFrame} from '../rooms/conveyor-presentation';

it('gives every spoken line one reading stop, with an explicit silent stop on the card',()=>{
 const take=rehearsal('arrival','care'),steps=attentionSteps(take.registry);
 expect(steps.flatMap(s=>s.speech?[s.speech.text]:[])).toEqual(Object.values(take.registry).flatMap(a=>a.phases.flatMap(p=>(p.say??[]).map(s=>s.text))));
 expect(steps.find(s=>s.id==='ed lifts the card')).toMatchObject({speech:undefined});
 let tick=0;const visited:number[]=[];
 for(let step=nextAttention(steps,tick);step;step=nextAttention(steps,tick)){expect(step.tick).toBeGreaterThan(tick);tick=step.tick;visited.push(tick);}
 expect(visited).toEqual(steps.map(s=>s.tick));
});

it('keeps authority, clock, custody, positions and machine progress unchanged during long reading',()=>{
 const take=rehearsal('arrival','care');
 for(const step of attentionSteps(take.registry)){
  const world=replay(take,step.tick),before=JSON.stringify(world),base=rehearsalView(take,world),view=readingView(base,step,120);
  expect(JSON.stringify(world)).toBe(before);expect(view.tick).toBe(step.tick);
  expect(view.actors.map(a=>a.position)).toEqual(base.actors.map(a=>a.position));
  expect(view.props).toEqual(base.props);expect(view.process).toEqual(base.process);
  expect(conveyorFrame(view.process)).toEqual(conveyorFrame(base.process));
  if(step.speech)expect(view.bubbles).toHaveLength(1);
  const quiet=base.actors.find(a=>a.cue?.clip==='Quiet_Wait');
  if(quiet)expect(view.actors.find(a=>a.id===quiet.id)!.seconds).toBeGreaterThan(quiet.seconds);
 }
 expect(factoryClock(0)).toBe('08:00:00');expect(factoryClock(1200)).toBe('08:01:00');
});

it('waits for input before each station operation and completes exactly one workpiece',()=>{
 const take=rehearsal('arrival','care'),steps=attentionSteps(take.registry);
 const labels=['Seat the brain','Run the wash','Start the main belt','Compress the brain'];
 for(let stage=0;stage<4;stage++){
  const step=steps.find(s=>s.label===labels[stage])!,world=replay(take,step.tick);
  expect(world.facts['line.stage']).toBe(stage);expect(world.facts['line.output']).toBe(0);
  expect(readingView(rehearsalView(take,world),step,600).process?.active).toBeUndefined();
 }
 const complete=replay(take,take.total);
 expect(complete.facts['line.output']).toBe(1);expect(complete.facts['checkpoint.workers-passed']).toBe(2);
});
