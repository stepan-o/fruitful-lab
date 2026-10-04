import { beaconOrbit, jamStrain } from "@/components/loopforge/factory-light";

test("the beacon visits front, both sides and rear continuously in a full revolution",()=>{
  const revolution=Math.PI*2/.78;
  const directions=[0,.25,.5,.75,1].map(turn=>beaconOrbit(turn*revolution));
  expect(directions[0].depth).toBeCloseTo(1);
  expect(directions[1].lateral).toBeCloseTo(1);
  expect(directions[2].depth).toBeCloseTo(-1);
  expect(directions[3].lateral).toBeCloseTo(-1);
  expect(directions[4].depth).toBeCloseTo(1);
  expect(directions[2].facing).toBe(0);
  expect(directions[0].facing).toBe(1);
  for(let t=0;t<revolution;t+=.04) {
    const a=beaconOrbit(t),b=beaconOrbit(t+.04);
    expect(Math.hypot(a.lateral-b.lateral,a.depth-b.depth)).toBeLessThan(.04);
  }
});

test("a held drive has short bounded attempts with long rests; reduced motion stays still",()=>{
  let active=0,peak=0;
  for(let t=0;t<28;t+=.02) {
    const strain=jamStrain(t);peak=Math.max(peak,strain);
    if(Math.abs(strain)>.01)active++;
    expect(Math.abs(strain)).toBeLessThan(1.13);
    expect(jamStrain(t,true)).toBe(0);
    expect(beaconOrbit(t,true)).toEqual(beaconOrbit(0,true));
  }
  expect(peak).toBeGreaterThan(1);
  expect(active*.02).toBeLessThan(7);
});
