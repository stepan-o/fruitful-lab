import { atDepth, beltShadowMatrix, cabinetCaster, conveyorCaster, cast, doorCaster, groundY, keyRay, keySamples, planeOffset, project } from "@/lib/production-systems/turk-lighting";

const cross = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x*b.y-a.y*b.x;

describe("engraved machine light transport", () => {
  it("uses the cabinet/belt depth and puts the feet on the ground", () => {
    expect(project({ x: 589, depth: 64, height: 196 })).toEqual({ x: 589+64/Math.sqrt(3), y: 263 });
    expect(project({ x: 158, depth: 0, height: 0 })).toEqual({ x: 158, y: 523 });
    expect(atDepth(project({ x: 42, depth: 26, height: 210 }), 26)).toEqual({ x: 42, depth: 26, height: 210 });
  });

  it("keeps source, caster and floor hit collinear for every area sample", () => {
    for (const ray of keySamples) for (const caster of [...cabinetCaster, ...conveyorCaster, ...doorCaster]) {
      const hit = cast(caster, "height", 0, ray)!;
      expect(hit.height).toBeCloseTo(0);
      const a = project(caster), b = project(hit);
      const screenRay = { x: ray.x+ray.depth/Math.sqrt(3), y: -ray.depth-ray.height };
      expect(cross({ x: b.x-a.x, y: b.y-a.y }, screenRay)).toBeCloseTo(0, 8);
      expect(b.x).toBeGreaterThan(a.x);
      expect(b.y).toBeGreaterThan(a.y);
    }
  });

  it("converges all penumbra samples at contact and widens with distance", () => {
    const point = { x: 158, depth: 0, height: 0 };
    for (const ray of keySamples) expect(cast(point, "height", 0, ray)).toEqual(point);
    const separation = (height: number) => {
      const a = project(cast({ ...point, height }, "height", 0, keySamples[1])!);
      const b = project(cast({ ...point, height }, "height", 0, keySamples[2])!);
      return Math.hypot(a.x-b.x, a.y-b.y);
    };
    expect(separation(100)).toBeCloseTo(separation(50)*2);
  });

  it("projects onto the actual recessed receiver, never upstream", () => {
    const p = atDepth({ x: 205, y: 421 }, 2);
    const hit = cast(p, "depth", 8)!;
    expect(hit.depth).toBeCloseTo(8);
    const offset = planeOffset(2, 8);
    const q = project(hit);
    expect(q.x-205).toBeCloseTo(offset.x);
    expect(q.y-421).toBeCloseTo(offset.y);
    expect(cast(p, "depth", 0)).toBeNull();
    expect(cast(p, "depth", 8, { ...keyRay, depth: 0 })).toBeNull();
  });

  it("projects both hand planes onto the belt with the same light", () => {
    for (const depth of [26, 54]) {
      const m = beltShadowMatrix(depth).slice(7, -1).split(" ").map(Number);
      for (const height of [209, 219, 240]) {
        const caster = { x: 480, depth, height }, p = project(caster);
        const projected = { x: m[0]*p.x+m[2]*p.y+m[4], y: m[1]*p.x+m[3]*p.y+m[5] };
        const actual = project(cast(caster, "height", 209)!);
        expect(projected.x).toBeCloseTo(actual.x);
        expect(projected.y).toBeCloseTo(actual.y);
        if (height === 209) expect(projected.y).toBeCloseTo(groundY-depth-height);
      }
    }
  });
});
