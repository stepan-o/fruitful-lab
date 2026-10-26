import {arrival} from './arrival';
import {TICK_MS} from './contract';

describe('assembled Max control performance',()=>{
 it('prepares during the existing Writer turns and touches at machine start',()=>{
  const {registry}=arrival(),phases=registry['staffed-production'].phases;
  const index=phases.findIndex(p=>p.id==='The staffed forge operates');
  const before=phases[index-3],ready=phases[index-2],command=phases[index-1],forge=phases[index],after=phases[index+1];
  expect(before.turn!.id).toBe('S08-T04');expect(before.ticks*TICK_MS/1000).toBe(1.4);
  expect([ready.turn!.id,command.turn!.id]).toEqual(['S08-T05','S08-T06']);
  expect([ready.ticks,command.ticks,forge.ticks]).toEqual([26,28,120]);
  const cues=[ready,command,forge].map(p=>p.perform.find(v=>v.agent==='max')!.cue!);
  expect(cues.map(c=>c.start)).toEqual([-2.7,-1.4,0]);
  for(const cue of cues){
   expect(cue.clip).toBe('Max_Forge_Control_Press');expect(cue.rate).toBe(1);expect(cue.loop).toBe(false);
   expect(cue.forgeQuiet).toEqual({start:{cue:before.perform.find(v=>v.agent==='max')!.cue,seconds:1.4},end:{cue:after.perform.find(v=>v.agent==='max')!.cue,seconds:0}});
  }
  expect(cues[0].start!+ready.ticks*TICK_MS/1000).toBeCloseTo(cues[1].start!,14);
  expect(cues[1].start!+command.ticks*TICK_MS/1000).toBe(cues[2].start);
  expect(forge.process!.operator.agent).toBe('max');
  expect(after.perform.find(v=>v.agent==='max')!.cue!.clip).toBe('Quiet_Wait');
 });
});
