import { operatorWheels, operatorMeshes, operatorCompound } from "@/lib/production-systems/operator-movement";

it("keeps the display train inside its bay, with tooth clearance between unrelated wheels", () => {
  operatorWheels.forEach((a, i) => {
    expect(a.x - a.radius - 1).toBeGreaterThanOrEqual(80);
    expect(a.x + a.radius + 1).toBeLessThanOrEqual(184);
    expect(a.y - a.radius - 1).toBeGreaterThanOrEqual(151);
    expect(a.y + a.radius + 1).toBeLessThanOrEqual(297);
    operatorWheels.slice(i + 1).forEach((b, k) => {
      if (a.layer !== b.layer) return;
      const distance = Math.hypot(a.x - b.x, a.y - b.y), j = k + i + 1;
      if (operatorMeshes.some(([x, y]) => x === i && y === j)) expect(distance).toBeCloseTo(a.radius + b.radius, 10);
      else expect(distance).toBeGreaterThan(a.radius + b.radius + 2);
    });
  });
});

it("maintains opposing tooth phases and surface speeds across the entire movement", () => {
  for (const [i, j] of operatorMeshes) {
    const a = operatorWheels[i], b = operatorWheels[j];
    expect(a.direction * a.teeth / a.period + b.direction * b.teeth / b.period).toBeCloseTo(0, 10);
    const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    for (const time of [0, .3, 6, 12, 24, 60]) {
      const phaseA = a.phase + a.direction * 360 * time / a.period;
      const phaseB = b.phase + b.direction * 360 * time / b.period;
      const sum = (angle - phaseA) * a.teeth / 360 + (angle + 180 - phaseB) * b.teeth / 360;
      expect(((sum % 1) + 1) % 1).toBeCloseTo(.5, 9);
    }
  }
  const [a, b] = operatorCompound.map(i => operatorWheels[i]);
  expect([a.x, a.y, a.direction, a.period]).toEqual([b.x, b.y, b.direction, b.period]);
  expect(a.layer).not.toBe(b.layer);
});
