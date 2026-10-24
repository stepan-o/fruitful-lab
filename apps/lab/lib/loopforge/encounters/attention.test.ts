import {attentionSteps,nextAttention,readingView,factoryClock} from './attention';
import {rehearsal,replay,rehearsalView} from './rehearsals';
import {conveyorFrame} from '../rooms/conveyor-presentation';

it('runs dialogue automatically and stops at all six player-owned controls',()=>{
 const take=rehearsal('arrival','care'),steps=attentionSteps(take.registry);
 expect(steps.map(s=>s.label)).toEqual(['Seat the brain','Run the wash','Start the main belt','Compress the brain','Start the staffed line','End the shift']);
 expect(steps.every(s=>s.speech)).toBe(true);expect(steps.some(s=>s.id==='ed lifts the card')).toBe(false);
 let tick=0;const visited:number[]=[];for(let step=nextAttention(steps,tick);step;step=nextAttention(steps,tick)){expect(step.tick).toBeGreaterThan(tick);tick=step.tick;visited.push(tick);}expect(visited).toEqual(steps.map(s=>s.tick));
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

it('retains four tutorial input gates and counts tutorial, paired and staffed outputs',()=>{
 const take=rehearsal('arrival','care'),steps=attentionSteps(take.registry);
 const labels=['Seat the brain','Run the wash','Start the main belt','Compress the brain'];
 for(let stage=0;stage<4;stage++){
  const step=steps.find(s=>s.label===labels[stage])!,world=replay(take,step.tick);
  expect(world.facts['line.stage']).toBe(stage);expect(world.facts['line.output']).toBe(0);
  expect(readingView(rehearsalView(take,world),step,600).process?.active).toBeUndefined();
 }
 const complete=replay(take,take.total);
 expect(complete.facts['line.output']).toBe(3);expect(complete.facts['line.paired-output']).toBe(1);expect(complete.facts['line.staffed-output']).toBe(1);expect(complete.facts['checkpoint.workers-passed']).toBe(8);expect(complete.facts['line.tutorial-output']).toBe(1);
});


it('settles a walking card holder into the fitted ID pose during reading',()=>{
 const take=rehearsal('arrival','care'),step={id:'explicit-review-pause',tick:10,label:'Review pause'};
 const base=rehearsalView(take,replay(take,step.tick));
 expect(base.actors.find(a=>a.id==='bob')?.cue?.clip).toBe('ID_Walk');
 const held=readingView(base,step,120);
 expect(held.actors.find(a=>a.id==='bob')?.cue?.clip).toBe('ID_Ready');
 expect(held.props).toEqual(base.props);
});
