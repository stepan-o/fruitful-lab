import { movementWheels, movementOutput } from "@/lib/production-systems/turk-movement";

it("meshes adjacent pitch circles and clears every non-mating wheel", () => {
  for (let i = 0; i < movementWheels.length; i++) {
    const a = movementWheels[i];
    // Tooth tips retain at least one unit of clearance inside the case opening.
    expect(a.x - a.radius - 1).toBeGreaterThanOrEqual(159);
    expect(a.x + a.radius + 1).toBeLessThanOrEqual(368);
    expect(a.y - a.radius - 1).toBeGreaterThanOrEqual(355);
    expect(a.y + a.radius + 1).toBeLessThanOrEqual(468);
    for (let j = i + 1; j < movementWheels.length; j++) {
      const b = movementWheels[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (j === i + 1) expect(distance).toBeCloseTo(a.radius + b.radius, 10);
      else expect(distance).toBeGreaterThan(a.radius + b.radius + 2);
    }
  }
});

it("keeps teeth opposite gaps and pitch-line velocities equal through motion", () => {
  for (let i = 1; i < movementWheels.length; i++) {
    const a = movementWheels[i - 1], b = movementWheels[i];
    expect(a.direction * a.teeth / a.period + b.direction * b.teeth / b.period).toBeCloseTo(0, 10);
    const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    for (const time of [0, .6, 2.4, 12, 24, 60]) {
      const phaseA = a.phase + a.direction * 360 * time / a.period;
      const phaseB = b.phase + b.direction * 360 * time / b.period;
      const phaseSum = (angle - phaseA) * a.teeth / 360 + (angle + 180 - phaseB) * b.teeth / 360;
      expect(((phaseSum % 1) + 1) % 1).toBeCloseTo(.5, 9);
    }
  }
});

it("terminates at the conveyor collar and carries one tray per stroke", () => {
  const output = movementWheels.at(-1)!;
  expect([output.x, output.y]).toEqual([322, 415]);
  expect(output.direction * 360 / output.period * 2.4).toBeCloseTo(288, 10);
  expect(1 / output.period).toBe(movementOutput.revolutionsPerSecond);
  const drumPitchRadius = 88 / (2 * Math.PI * .8);
  expect(2 * Math.PI * drumPitchRadius / output.period * 2.4).toBeCloseTo(88, 10);
});
