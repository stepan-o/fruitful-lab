import { alphaSilhouette, emitterSamples, shadowTransform, projectToReceiver, receiverDepthRatio, type Point } from '@/components/loopforge/factory-shadow';

const cross=(a:Point,b:Point,c:Point)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const source={x:640,y:620};
const placeSilhouette=(points:Point[],x:number,y:number,scale:number)=>points.map(p=>({x:x+p.x*scale,y:y+p.y*scale}));
const blocker=[{x:-12,y:20},{x:12,y:20},{x:18,y:40},{x:-18,y:40}];

test('every projected contour point lies beyond its blocker on the emitter ray',()=>{
  for(const origin of [{x:640,y:620},{x:653,y:620},{x:627,y:620}]) {
    for(const x of [-100,0,500,640,1200,1380])for(const scale of [.86,1,1.06]) {
      const world=placeSilhouette(blocker,x,430,scale);
      for(const p of world) {
        const q=projectToReceiver(p,origin);
        expect(cross(origin,p,q)).toBeCloseTo(0,7);
        expect(Math.hypot(q.x-origin.x,q.y-origin.y)/Math.hypot(p.x-origin.x,p.y-origin.y)).toBeCloseTo(receiverDepthRatio);
      }
    }
  }
});

test('translation, chatter and scale share the sprite transform before projection',()=>{
  const world=placeSilhouette(blocker,217,430.31,1.06);
  const matrix=shadowTransform(217,430.31,1.06,source);
  blocker.forEach((p,i)=>{
    const projected=projectToReceiver(world[i],source);
    expect(p.x*matrix.a+matrix.e).toBeCloseTo(projected.x);
    expect(p.y*matrix.d+matrix.f).toBeCloseTo(projected.y);
  });
  for(const p of world) {
    const a=projectToReceiver(p,source),b=projectToReceiver({x:1280-p.x,y:p.y},source);
    expect(b.x).toBeCloseTo(1280-a.x);expect(b.y).toBeCloseTo(a.y);
  }
});

test('transparent padding and faint glow cannot turn an entire sprite rectangle into a blocker',()=>{
  const data=new Uint8ClampedArray(20*20*4);
  for(let y=0;y<20;y++)for(let x=0;x<20;x++)data[(y*20+x)*4+3]=x>=6 && x<=14 && y>=4 && y<=16?255:30;
  const hull=alphaSilhouette(data,20,20);
  expect(Math.min(...hull.map(p=>p.x))).toBeCloseTo(-42);
  expect(Math.max(...hull.map(p=>p.x))).toBeCloseTo(42);
  expect(Math.min(...hull.map(p=>p.y))).toBeCloseTo(-130);
  expect(alphaSilhouette(new Uint8ClampedArray(1600),20,20)).toEqual([]);
});

test('a notched silhouette keeps its recess rather than becoming a convex rectangle',()=>{
  const data=new Uint8ClampedArray(20*20*4);
  for(let y=2;y<18;y++)for(let x=(y>=8 && y<=12?8:4);x<=16;x++)data[(y*20+x)*4+3]=255;
  const outline=alphaSilhouette(data,20,20);
  expect(outline.some(p=>p.y===8/20*210-172 && p.x===8/20*210-105)).toBe(true);
});

test('the finite-source penumbra grows with receiver depth and collapses at contact',()=>{
  const samples=emitterSamples(source),p={x:500,y:450};
  const spread=(ratio:number)=>{const x=samples.map(s=>projectToReceiver(p,s,ratio).x);return Math.max(...x)-Math.min(...x);};
  expect(spread(1)).toBe(0);
  expect(spread(3)).toBeCloseTo(spread(2)*2);
  expect(spread(receiverDepthRatio)).toBeLessThan(9);
  expect(samples).toHaveLength(3);
});

test('offscreen blockers and a point coincident with the source remain finite',()=>{
  expect(projectToReceiver(source,source)).toEqual(source);
  const p=projectToReceiver({x:-1000,y:0},source);
  expect(Number.isFinite(p.x)&&Number.isFinite(p.y)).toBe(true);
  expect(placeSilhouette([],0,0,1)).toEqual([]);
});
