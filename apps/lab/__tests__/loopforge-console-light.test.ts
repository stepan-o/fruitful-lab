import { receiptLight, shadowPolygon } from "@/lib/loopforge/first-shift/console-light";
import { initialState } from "@/lib/loopforge/first-shift/kernel";
import { project } from "@/lib/loopforge/first-shift/projection";
it("uses confirmed outcomes, never interpreting every incident as an accident", () => {
  const before=project(initialState(7));
  expect(receiptLight(before,{...before,tick:1,produced:1})).toBe("production");
  expect(receiptLight(before,{...before,tick:1,produced:1,losses:1})).toBe("accident");
  expect(receiptLight(before,{...before,tick:1,phase:"decision",pending:{id:"paperwork"} as never})).toBe("attention");
  expect(receiptLight(before,{...before,tick:1,phase:"allocation"})).toBe("attention");
  expect(receiptLight(before,{...before,tick:1,phase:"ready"})).toBe("attention");
  expect(receiptLight(before,{...before,produced:1})).toBeNull();
  expect(receiptLight(null,{...before,tick:48,phase:"complete",produced:12,losses:2})).toBeNull();
});
it("projects both shadow edges along source-obstacle rays for any source quadrant", () => {
  for(const source of [{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}]) {
    const polygon=shadowPolygon(source,{x:40,y:40,width:10,height:10},500);
    expect(polygon).toHaveLength(4);
    for(const [near,far] of [[polygon[0],polygon[3]],[polygon[1],polygon[2]]]) {
      const cross=(near.x-source.x)*(far.y-source.y)-(near.y-source.y)*(far.x-source.x);
      expect(cross).toBeCloseTo(0,7);
      expect(Math.hypot(far.x-source.x,far.y-source.y)).toBeGreaterThan(Math.hypot(near.x-source.x,near.y-source.y));
    }
  }
  expect(shadowPolygon({x:45,y:45},{x:40,y:40,width:10,height:10},500)).toEqual([]);
});
