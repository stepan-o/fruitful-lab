import type { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import type { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { createReviewOrbit } from '@/components/loopforge/factory-study/review-orbit';

function fixture() {
  const canvas=document.createElement('canvas');
  Object.defineProperties(canvas,{clientWidth:{value:800,configurable:true},clientHeight:{value:600,configurable:true}});
  const target={asArray:()=>[1,1.02,2]} as unknown as Vector3;
  const camera={alpha:0,beta:0,radius:0,target,attachControl:jest.fn(),detachControl:jest.fn(),
    setTarget:jest.fn(),inertialAlphaOffset:0,inertialBetaOffset:0,inertialRadiusOffset:0,
    inertialPanningX:0,inertialPanningY:0} as unknown as ArcRotateCamera;
  const invalidate=jest.fn();
  return {canvas,camera,target,invalidate,orbit:createReviewOrbit(camera,canvas,invalidate)};
}

test('inspection attaches controls and preserves orbit across fixed CCTV and a narrow resize',()=>{
  const {canvas,camera,target,orbit}=fixture();orbit.attach(target);
  expect(camera.attachControl).toHaveBeenCalledWith(canvas,false);
  camera.alpha=.8;camera.beta=1.1;camera.radius=5;
  orbit.suspend();camera.alpha=-2;camera.beta=.7;camera.radius=10;
  expect(orbit.snapshot().mode).toBe('fixed');
  Object.defineProperty(canvas,'clientWidth',{value:300});orbit.attach(target);
  expect(camera.alpha).toBe(.8);expect(camera.beta).toBe(1.1);expect(camera.radius).toBeCloseTo(6.5);
  expect(camera.lowerRadiusLimit).toBeCloseTo(4.16);
});
test('reset cancels gesture inertia and restores inspection framing without editing the subject',()=>{
  const {camera,target,orbit,invalidate}=fixture();orbit.attach(target);
  camera.alpha=2;camera.radius=6;camera.inertialAlphaOffset=1;
  orbit.action('reset');expect(camera.alpha).toBe(-Math.PI/2);expect(camera.radius).toBe(3.8);
  expect(camera.inertialAlphaOffset).toBe(0);expect(invalidate).toHaveBeenCalled();
  expect(orbit.snapshot().target).toEqual([1,1.02,2]);
});
test('zoom buttons remain bounded and cannot alter fixed CCTV framing',()=>{
  const {camera,target,orbit}=fixture();orbit.attach(target);
  for(let i=0;i<30;i++)orbit.action('closer');expect(camera.radius).toBe(3.2);
  for(let i=0;i<30;i++)orbit.action('farther');expect(camera.radius).toBe(7);
  orbit.suspend();camera.radius=10;orbit.action('reset');expect(camera.radius).toBe(10);
  expect(camera.detachControl).toHaveBeenCalled();
});
test('portrait framing supports close inspection and restores full-body bounds',()=>{
  const {camera,target,orbit}=fixture();orbit.attach(target);
  camera.alpha=.4;camera.radius=5;orbit.suspend();
  orbit.framing(.85,.35);orbit.attach(target);
  expect(camera.alpha).toBe(.4);expect(camera.radius).toBe(.85);expect(camera.lowerRadiusLimit).toBe(.35);
  for(let i=0;i<30;i++)orbit.action('closer');expect(camera.radius).toBe(.35);
  orbit.action('reset');expect(camera.radius).toBe(.85);
  orbit.suspend();orbit.framing(3.8,3.2);orbit.attach(target);
  expect(camera.radius).toBe(3.8);expect(camera.lowerRadiusLimit).toBe(3.2);
});
