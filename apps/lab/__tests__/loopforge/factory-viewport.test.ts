import { factoryViewport } from "@/components/loopforge/factory-viewport";

// A circle in world space must stay circular on screen, even when the
// backing raster or the world width reaches its performance ceiling.
test.each([[320,544], [390,820], [640,336], [768,1000], [1280,696],
  [1920,1056], [2555,1286], [3440,1416], [3840,1056], [3840,2136]])(
  "preserves proportions and bounded raster at %i × %i", (w, h) => {
    const scene=factoryViewport(w,h);
    expect(w / scene.width).toBeCloseTo(h / scene.height, 10);
    if (w >= 1800) expect(scene.height).toBeGreaterThanOrEqual(840);
    expect(scene.pixelWidth).toBeLessThanOrEqual(2100);
    expect(scene.pixelHeight).toBeLessThanOrEqual(1400);
  },
);

test("ordinary desktop composition retains its existing scale",()=>{
  const scene=factoryViewport(1280,696);
  expect(scene.width).toBe(1280);
  expect(scene.height).toBe(696);
});
