import { candleFrames, operatorLamp, operatorLightKeyframes, projectOperatorShadow, shadowDisplacement } from "@/lib/production-systems/operator-light";

const casterPoints = [{ x: 389, y: 149 }, { x: 329, y: 191 }, { x: 363, y: 278 }];
const cross = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x*b.y-a.y*b.x;

describe("operator candle transport", () => {
  it("keeps source, body and receiver collinear throughout each interpolated light segment", () => {
    for (let i = 1; i < candleFrames.length; i++) for (const t of [0, .17, .5, .83, 1]) {
      const a = candleFrames[i-1], b = candleFrames[i];
      const source = { x: operatorLamp.x + a.x + (b.x-a.x)*t, y: operatorLamp.y + a.y + (b.y-a.y)*t };
      for (const p of casterPoints) {
        const hit = projectOperatorShadow(p, source);
        const ray = { x: p.x-source.x, y: p.y-source.y };
        expect(cross(ray, { x: hit.x-source.x, y: hit.y-source.y })).toBeCloseTo(0, 8);
        expect((hit.x-source.x)/ray.x).toBeCloseTo(operatorLamp.receiverDepth/operatorLamp.casterDepth);
        expect(hit.x).toBeGreaterThan(p.x);
      }
    }
  });

  it("emits synchronized CSS whose shadow displacement matches the moving source", () => {
    const css = operatorLightKeyframes("test-lamp");
    const [light, shadow] = css.split("@keyframes test-lamp-shadow");
    const offsets = (rule: string) => [...rule.matchAll(/([\d.]+)%\{transform:translate\(([-\d.]+)px,([-\d.]+)px\)/g)]
      .map(([, at, x, y]) => ({ at: +at, x: +x, y: +y }));
    const lights = offsets(light), shadows = offsets(shadow);
    expect(lights).toHaveLength(candleFrames.length);
    expect(shadows.map(s=>s.at)).toEqual(lights.map(s=>s.at));
    lights.forEach((source, i) => {
      for (const p of casterPoints) {
        const stationary = projectOperatorShadow(p);
        const moved = projectOperatorShadow(p, { x: operatorLamp.x+source.x, y: operatorLamp.y+source.y });
        expect(stationary.x+shadows[i].x).toBeCloseTo(moved.x, 3);
        expect(stationary.y+shadows[i].y).toBeCloseTo(moved.y, 3);
      }
    });
  });

  it("closes both cycles without a jump and moves the shadow opposite the flame", () => {
    const first = candleFrames[0], last = candleFrames[candleFrames.length-1];
    expect(first.at).toBe(0);
    expect(last.at).toBe(100);
    expect({ ...first, at: 100 }).toEqual(last);
    const d = shadowDisplacement(3, -2);
    expect(d.x).toBeLessThan(0);
    expect(d.y).toBeGreaterThan(0);
    expect(Math.hypot(d.x, d.y)).toBeLessThan(Math.hypot(3, 2));
  });
});
