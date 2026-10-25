import {arrival} from './arrival';
import {advance,project} from './kernel';
import type {World} from './contract';

const take=arrival(),turnWorld=new Map<string,World>();let final=take.world;
beforeAll(()=>{
 while(final.tick<take.total){
  const next=advance(final,take.registry,take.space,take.planner);
  const failure=next.events.find(e=>e.tick===next.tick&&(e.kind==='cancelled'||e.kind==='rejected'));
  if(failure){const a=final.active[0];throw Error(JSON.stringify({failure,phase:a&&take.registry[a.intent.action].phases[a.phase],positions:Object.fromEntries(Object.values(final.agents).map(v=>[v.id,v.position]))}));}
  for(const event of next.events)if(event.tick===next.tick&&event.kind==='turn'&&event.turn)turnWorld.set(event.turn.id,next);
  final=next;
 }
});
function received(turn:string){const world=turnWorld.get(turn);if(!world)throw Error('Missing actual turn '+turn);return world.events.filter(e=>e.tick===world.tick&&e.kind==='heard').map(e=>e.agent).sort();}
const repairs:[string,string[]][]=[['S04-T07',['ben']],['S04-T08',['limen']],['S04-T11',['ed','gus']],['S05-T01',['sam']],['S05-T02',['bob']],['S05-T03',['bob','sam']],['S05-T04',['bob']],['S05-T10',['bob','sam']],['S05-T11',['jo','sam']],['S05-T13',['bob','sam']],['S08-T09',['jo','sam']],['S08-T10',['bob','sam']]];
it.each(repairs)('%s reaches its actual local receivers after admitted travel',(turn,listeners)=>{expect(received(turn)).toEqual(expect.arrayContaining(listeners));});
it('retains the four selected genuine nonreceipts',()=>{
 expect(received('S04-T06')).not.toContain('jo');expect(received('S04-T13')).not.toContain('jo');
 expect(received('S04-T14')).toEqual([]);expect(received('S08-T07')).toEqual(['ben','max','stiletto']);
});
it('keeps Jo third, with lawful station arrival after the local conversation',()=>{
 const w=turnWorld.get('S05-T10')!;expect(w.facts['checkpoint.cleared.jo']).toBe(true);
 expect(w.facts['checkpoint.workers-passed']).toBe(3);expect(w.agents.jo.position).toEqual([141000,108500]);
 expect(w.facts['line.crew.jo']).not.toBe(true);expect(w.facts['line.operator.belt']).not.toBe('jo');
 expect(final.facts['checkpoint.workers-passed']).toBe(8);
 expect(final.events.filter(e=>e.kind==='effect'&&e.detail===JSON.stringify({fact:'checkpoint.cleared.max',value:true}))).toHaveLength(1);
});
it('moves Bob only after the completed third process and returns him before shutdown',()=>{
 const w=turnWorld.get('S08-T08')!,v=project(w,take.registry);
 expect(w.facts['line.output']).toBe(3);expect(w.facts['line.stage']).toBe(4);expect(w.facts['line.staffed-output']).toBe(1);
 expect(v.process?.active).toBeUndefined();expect(w.agents.bob.position).toEqual([139000,107200]);
 expect(v.dayOne?.stationOccupancy.intake).toBeNull();expect(Object.values(v.dayOne!.stationOccupancy).filter(Boolean)).toHaveLength(3);
 expect(turnWorld.get('S09-T01')!.agents.bob.position).toEqual([136500,105800]);
});
it('preserves the successful closing receipts and durable full-day consequences',()=>{
 expect(received('S09-T02')).toContain('stiletto');expect(received('S09-T03')).toContain('stiletto');
 expect(received('S09-T07')).toContain('sam');expect(received('S09-T08')).toContain('bob');
 expect(final.completed).toEqual(Object.keys(take.registry));expect(final.completed).toHaveLength(22);
 expect(project(final,take.registry).dayOne).toMatchObject({stage:'night',productionOutputs:3,departed:12});
 expect(Object.values(final.agents).every(a=>a.room==='outside'&&a.position[1]>144000)).toBe(true);
 expect(final.events.filter(e=>e.kind==='turn')).toHaveLength(108);
 expect(final.events.filter(e=>e.kind==='turn'&&e.turn?.kind==='reaction-only')).toHaveLength(13);
 expect(final.events.filter(e=>e.kind==='prop-transferred')).toHaveLength(3);
 expect(final.props?.['bob:id'].location).toMatchObject({kind:'stowed',agent:'ed'});
 expect(final.agents.bob.beliefs['prop.bob:id.holder'].value).not.toBe('ed');
 expect(final.facts['line.tutorial-output']).toBe(1);expect(final.facts['line.paired-output']).toBe(1);expect(final.facts['line.staffed-output']).toBe(1);
 expect(final.held).toEqual({});
});
