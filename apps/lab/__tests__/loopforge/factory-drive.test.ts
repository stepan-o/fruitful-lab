import { cargoFor, createDrive, restartDrive, stepDrive } from "@/components/loopforge/factory-drive";

function advance(d: ReturnType<typeof createDrive>, seconds: number) {
  for (let i=0; i<Math.ceil(seconds*30); i++) stepDrive(d, 1/30);
}

test("the loaded drive keeps advancing at uneven speed until a real jam", () => {
  const d=createDrive(123), speeds=[];
  advance(d,3.1);
  restartDrive(d);
  advance(d,2);
  for(let i=0;i<540;i++) { const previous=d.distance; stepDrive(d,1/30); speeds.push(d.velocity); expect(d.distance).toBeGreaterThan(previous); }
  expect(Math.min(...speeds)).toBeGreaterThan(8);
  expect(Math.max(...speeds)-Math.min(...speeds)).toBeGreaterThan(25);
  expect(Math.max(...speeds)).toBeGreaterThan(50);
  advance(d,56);
  expect(d.status).toBe("jammed");
  const distance=d.distance;
  advance(d,60);
  expect(d.distance).toBe(distance);
  expect(d.status).toBe("jammed");
  expect(d.velocity).toBe(0);
});

test("the first jam occurs at three active seconds for every visit seed", () => {
  for (const seed of [0, 123, 4278910321]) {
    const d=createDrive(seed);
    for (let i=0;i<59;i++) stepDrive(d,.05);
    expect(d.status).toBe("running");
    expect(d.untilJam).toBeCloseTo(.05);
    stepDrive(d,.051);
    expect(d.status).toBe("jammed");
    expect(d.time).toBeCloseTo(3.001);
  }
});

test("later fault intervals vary by visit and restart, within 33–55 active seconds", () => {
  function intervals(seed: number) {
    const d=createDrive(seed), result=[];
    for(let i=0;i<6;i++) {
      advance(d,56);
      expect(restartDrive(d)).toBe(true);
      expect(d.untilJam).toBeGreaterThanOrEqual(33);
      expect(d.untilJam).toBeLessThan(55);
      result.push(d.untilJam);
    }
    return result;
  }
  const a=intervals(123);
  expect(new Set(a).size).toBe(6);
  expect(a).toEqual(intervals(123));
  expect(a).not.toEqual(intervals(456));
});

test("only a jammed drive accepts reset, restarts gently, then can jam again", () => {
  const d=createDrive();
  expect(restartDrive(d)).toBe(false);
  advance(d,3.1); const distance=d.distance;
  expect(restartDrive(d)).toBe(true);
  expect(restartDrive(d)).toBe(false);
  expect(d.status).toBe("restarting");
  stepDrive(d,1/30); expect(d.velocity).toBeLessThan(3);
  advance(d,2);
  expect(d.status).toBe("running"); expect(d.distance).toBeGreaterThan(distance);
  expect(d.restarts).toBe(1);
  advance(d,56); expect(d.status).toBe("jammed");
});

test("a long browser stall does not fast-forward the scene into a jam", () => {
  const a=createDrive(),b=createDrive();
  stepDrive(a,900); stepDrive(b,.08);
  expect(a).toEqual(b);
  expect(a.status).toBe("running");
});

test("cargo remains reproducible on either edge and includes damaged batches and oddities", () => {
  expect(cargoFor(-1)).toEqual(cargoFor(11));
  expect(cargoFor(12)).toEqual(cargoFor(0));
  const kinds=Array.from({length:12},(_,i)=>cargoFor(i).kind);
  expect(kinds).toEqual(expect.arrayContaining(["cortex","augmented","cracked","rejected","glass","skull","halo","sprout"]));
  expect(new Set(Array.from({length:12},(_,i)=>cargoFor(i).seed)).size).toBe(12);
});
