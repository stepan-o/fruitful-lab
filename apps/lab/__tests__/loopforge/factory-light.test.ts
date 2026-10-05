import { beaconOrbit, createBeaconRotor, stepBeaconRotor, beaconSpeed, jamStrain, reflectorPose, beamVariation } from "@/components/loopforge/factory-light";

test("the beacon visits front, both sides and rear continuously in a full revolution",()=>{
  const revolution=Math.PI*2;
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


test("alarm motor accelerates without phase discontinuity and reaches five times idle speed",()=>{
  const rotor=createBeaconRotor();
  let previous=rotor.phase;
  for(let i=1;i<=120;i++) {
    const orbit=stepBeaconRotor(rotor,i/30,i>30);
    const distance=(orbit.phase-previous+Math.PI*2)%(Math.PI*2);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThanOrEqual(beaconSpeed.alarm/30+.000001);
    if(i===31)expect(distance).toBeLessThan(.04);
    previous=orbit.phase;
  }
  expect(rotor.speed).toBeCloseTo(beaconSpeed.idle*5,3);
  const fast=rotor.speed;
  stepBeaconRotor(rotor,121/30,false);
  expect(rotor.speed).toBeLessThan(fast);
  expect(rotor.speed).toBeGreaterThan(beaconSpeed.idle*4);
  for(let i=122;i<=300;i++)stepBeaconRotor(rotor,i/30,false);
  expect(rotor.speed).toBeCloseTo(beaconSpeed.idle,2);
});

test("resize, pause and still rendering cannot advance the alarm rotor",()=>{
  const rotor=createBeaconRotor();stepBeaconRotor(rotor,.04,true);
  const before={...rotor};
  stepBeaconRotor(rotor,.04,true);
  expect(rotor).toEqual(before);
  expect(stepBeaconRotor(rotor,.04,true,true)).toEqual(beaconOrbit(2.45));
  expect(rotor).toEqual(before);
  const resumed=stepBeaconRotor(rotor,.08,true);
  expect(resumed.phase-before.phase).toBeGreaterThan(0);
  expect(resumed.phase-before.phase).toBeLessThan(.1);
});

test("viewer glare belongs only to the forward lobe and remains angularly continuous",()=>{
  expect(beaconOrbit(0).facing).toBe(1);
  expect(beaconOrbit(Math.PI/2).facing).toBeLessThan(.0001);
  expect(beaconOrbit(Math.PI).facing).toBe(0);
  expect(beaconOrbit(-.2).facing).toBeCloseTo(beaconOrbit(.2).facing);
});


test("the rear half-turn exposes opaque metal, with no luminous aperture",()=>{
  for(let phase=0;phase<Math.PI*2;phase+=.03) {
    const orbit=beaconOrbit(phase),pose=reflectorPose(orbit);
    expect(pose.apertureX).toBeCloseTo(orbit.lateral*13);
    if(orbit.depth<=0){expect(pose.front).toBe(false);expect(pose.emission).toBe(0);}
    else {expect(pose.front).toBe(true);expect(pose.emission).toBeGreaterThan(0);}
  }
  expect(reflectorPose(beaconOrbit(Math.PI/2)).width).toBeCloseTo(2);
  expect(reflectorPose(beaconOrbit(Math.PI/2)).apertureX-reflectorPose(beaconOrbit(Math.PI/2)).rearX).toBeCloseTo(18);
  expect(reflectorPose(beaconOrbit(0)).width).toBeCloseTo(27);
});

test("refractive variation is continuous and bounded; reduced motion freezes it",()=>{
  for(let t=0;t<80;t+=.03) {
    const a=beamVariation(t),b=beamVariation(t+.03);
    expect(a.mix).toBeGreaterThanOrEqual(0);expect(a.mix).toBeLessThanOrEqual(1);
    expect(a.width).toBeGreaterThan(.98);expect(a.width).toBeLessThan(1.02);
    expect(a.power).toBeGreaterThan(.93);expect(a.power).toBeLessThan(1);
    expect(Math.abs(a.power-b.power)).toBeLessThan(.018);
    expect(beamVariation(t,true)).toEqual(beamVariation(0,true));
  }
});
