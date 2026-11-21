/** @jest-environment jsdom */
import {freshCampaign} from '@/lib/loopforge/shifts/campaign-save';
import {PlaybackTape} from '@/lib/loopforge/shifts/playback';
import {factoryProjection,cutOpacity,roomCut} from '@/lib/loopforge/factory-scene';
import {floorView} from '@/lib/loopforge/shifts/painter';
import {type Command} from '@/lib/loopforge/shifts/contract';

test('rewind crosses the overnight handoff and restores the recorded call topic',()=>{
  const run=freshCampaign(),tape=new PlaybackTape(run.id);
  tape.load(run);
  run.seconds=12;tape.record(run);
  run.phase='console';tape.record(run);
  run.morningSeconds=4;tape.record(run);
  run.phase='call';tape.record(run);
  run.callTopic=1;tape.record(run);
  run.morningSeconds=7;tape.record(run);
  const back=tape.seek(run,-10);
  expect(back.run.phase).toBe('intro');expect(back.run.seconds).toBe(9);
  const forward=tape.seek(back.run,10);
  expect(forward.run.phase).toBe('call');expect(forward.run.callTopic).toBe(1);
  expect(forward.run.morningSeconds).toBe(7);expect(forward.remaining).toBe(0);
});

test('rewind removes a later decision, forward restores it, and replay can branch',()=>{
  const run=freshCampaign(),tape=new PlaybackTape(run.id);
  tape.load(run);run.phase='floor';run.progress.tick=100;tape.record(run);
  let current=run;
  function frame(tick:number){
    const seconds=(tick-current.progress.tick)/20;
    current.progress.tick=tick;tape.record(current,false,seconds);
  }
  function decide(action:Command['action']){
    current.progress.commands.push({id:action,action,tick:current.progress.tick,day:2,target:'bob',room:'security',incident:'card'});
    tape.record(current);
  }
  frame(300);decide('reject-pass');frame(400);
  const back=tape.seek(current,-10).run;
  expect(back.progress.tick).toBe(200);expect(back.progress.commands).toHaveLength(0);
  expect(tape.seek(back,10).run.progress.commands[0].action).toBe('reject-pass');
  current=tape.seek(current,-10).run;tape.discardFuture();
  frame(300);decide('issue-pass');frame(400);
  tape.save();const reload=new PlaybackTape(run.id);reload.load(current);
  expect(reload.seek(current,-10).run.progress.commands).toHaveLength(0);
  expect(reload.seek(current,10).run.progress.commands.map(c=>c.action)).toEqual(['issue-pass']);
});

test.each([[390,844],[1280,800]])('both days project fixed landmarks identically at %i × %i',(w,h)=>{
  for(const room of ['security','conveyor'] as const){
    const camera=floorView(w,h,room);
    const project=factoryProjection(w,h,camera.x,camera.y,camera.scale);
    for(const [x,y] of [[124.9,134],[123.6,132],[131.7,144.4],[132,149]]){
      expect(camera.xy(x,y)).toEqual(project(x,y));
    }
  }
  expect(cutOpacity(-roomCut.out)).toBe(0);expect(cutOpacity(0)).toBe(1);expect(cutOpacity(roomCut.into)).toBe(0);
});
