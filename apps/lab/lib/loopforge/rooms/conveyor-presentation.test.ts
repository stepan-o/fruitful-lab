import {conveyorControl} from '../encounters/arrival-layout';
import {conveyorFrame,compressionPose} from './conveyor-presentation';
it('shows the same workpiece at contiguous station boundaries when replayed or sought',()=>{
 const names=['intake','wash','belt','forge'] as const;
 for(let stage=0;stage<4;stage++){
  const start=conveyorFrame({stage,output:0,progress:0,active:{operator:{agent:'bob',position:conveyorControl(names[stage]),within:180},station:names[stage],from:stage,to:stage+1}});
  const before=conveyorFrame({stage,output:0,progress:0});
  const end=conveyorFrame({stage,output:0,progress:1,active:{operator:{agent:'bob',position:conveyorControl(names[stage]),within:180},station:names[stage],from:stage,to:stage+1}});
  const after=conveyorFrame({stage:stage+1,output:stage===3?1:0,progress:0});
  expect(start.x).toBeCloseTo(before.x);expect(start.height).toBeCloseTo(before.height);
  expect(end.x).toBeCloseTo(after.x);expect(end.clean).toBeCloseTo(after.clean);expect(end.compressed).toBeCloseTo(after.compressed);
 }
});
it('keeps dirty, washed and compressed states distinct with no idle spray or heat',()=>{
 expect(conveyorFrame(undefined).appearance).toBe('dirty');
 expect(conveyorFrame({stage:2,output:0,progress:0})).toMatchObject({appearance:'washed',spray:0,heat:0,beltRunning:false});
 expect(conveyorFrame({stage:4,output:1,progress:0})).toMatchObject({appearance:'compressed',compressed:1,ready:true,output:1,spray:0,heat:0});
});

it('keeps the platen above the brain and in contact throughout compression',()=>{
 for(let i=0;i<=100;i++){
  const progress=i/100,frame=conveyorFrame({stage:3,output:0,progress,active:{operator:{agent:'bob',position:conveyorControl('forge'),within:180},station:'forge',from:3,to:4}}),pose=compressionPose(frame.compressed,frame.ram,.637);
  expect(pose.platen-.125+1e-6).toBeGreaterThanOrEqual(pose.top);
  if(progress>=.25&&progress<=.72)expect(pose.platen-.125).toBeCloseTo(pose.top);
 }
 expect(compressionPose(1,0,.637).widthScale).toBeCloseTo(.4);
});
