import {motionPose} from "../lib/agentic-systems/motion-study";
describe("authored press study",()=>{
 it("keeps hand trajectory and support points identical in both performances",()=>{
  for(let i=0;i<=1000;i++){
   const a=motionPose(i/1000,false),b=motionPose(i/1000,true);
   expect(a.hand).toEqual(b.hand);
   for(const p of [a,b]){expect(p.front.end).toEqual({x:272,y:350});expect(p.rear.end).toEqual({x:228,y:350});}
  }
 });
 it("preserves all segment lengths throughout both trajectories",()=>{
  for(const whole of [false,true])for(let i=0;i<=1000;i++){
   const p=motionPose(i/1000,whole);
   for(const [name,a,b] of [["right",58,55],["other",42,35],["front",46,44],["rear",46,44]] as const){
    const l=p[name];expect(Math.hypot(l.elbow.x-l.origin.x,l.elbow.y-l.origin.y)).toBeCloseTo(a,8);expect(Math.hypot(l.end.x-l.elbow.x,l.end.y-l.elbow.y)).toBeCloseTo(b,8);
   }
  }
 });
 it("reaches the authored button and finishes at rest",()=>{
  for(const whole of [false,true]){expect(motionPose(.58,whole).hand).toEqual({x:350,y:208});expect(motionPose(1,whole)).toEqual(motionPose(0,whole));}
 });
});
