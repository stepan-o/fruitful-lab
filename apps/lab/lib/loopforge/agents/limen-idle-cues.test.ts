import {limenIdleCue,limenIdleDuration} from './limen-idle-cues';
import clip from '@/components/loopforge/agents/generated/limen-idle.json';
describe('authored LIMEN idle and power cue',()=>{
 test('power is absent during adjustment and returns after it',()=>{expect(limenIdleCue(3.9).power).toBe(0);expect(limenIdleCue(4.6).power).toBeGreaterThan(0);expect(limenIdleCue(5).power).toBe(0);expect(limenIdleCue(5.4).power).toBeGreaterThan(0);expect(limenIdleCue(7).power).toBe(1);});
 test('reduced effects preserve shutdown without restart attempts or surges',()=>{for(let t=3.55;t<6.05;t+=.01){expect(limenIdleCue(t,true).power).toBe(0);expect(limenIdleCue(t,true).surge).toBe(0);}expect(limenIdleCue(7,true).power).toBe(1);});
 test('bounded and deterministic when seeking in any order',()=>{for(let t=0;t<=limenIdleDuration;t+=.031){const cue=limenIdleCue(t);expect(cue.power).toBeGreaterThanOrEqual(0);expect(cue.power).toBeLessThanOrEqual(1);limenIdleCue(9);expect(limenIdleCue(t)).toEqual(cue);}});
 test('baked motion and energy join at a clean loop seam',()=>{expect(clip.duration).toBe(limenIdleDuration);expect(clip.frames.length).toBe(clip.fps*clip.duration+1);expect(clip.frames[0]).toEqual(clip.frames.at(-1));expect(limenIdleCue(0)).toEqual(limenIdleCue(limenIdleDuration));});
});
