import type { MovementWheel } from "./turk-movement";

/** Module-one open display train, confined to the shallow left bay.
 * This theatrical clockwork is separate from the operator's chess linkage.
 */
export const operatorWheels: MovementWheel[] = [
  { name: "centre", x: 132, y: 222, teeth: 48, radius: 24, phase: 0, direction: 1, period: 24, layer: 0 },
];
export const operatorMeshes: [number, number][] = [];
function branch(parent: number, name: string, teeth: number, dx: number, vertical: number) {
  const a = operatorWheels[parent], radius = teeth / 2;
  const x = a.x + dx, y = a.y + vertical * Math.sqrt((a.radius + radius) ** 2 - dx ** 2);
  const angle = Math.atan2(y - a.y, x - a.x) * 180 / Math.PI;
  const phase = angle + 180 - (.5 - (angle - a.phase) * a.teeth / 360) * 360 / teeth;
  operatorMeshes.push([parent, operatorWheels.length]);
  operatorWheels.push({ name, x, y, teeth, radius, phase, direction: -a.direction, period: a.period * teeth / a.teeth, layer: a.layer });
}
branch(0, "upper-relay", 30, 17, -1);
branch(1, "upper-wheel", 42, -34, -1);
branch(0, "side-pinion", 20, -33, -1);
branch(0, "winding-wheel", 46, -23, 1);
branch(0, "lower-relay", 24, 19, 1);
branch(5, "lower-wheel", 34, 13.5, 1);
export const operatorCompound: [number, number] = [0, 7];
operatorWheels.push({ ...operatorWheels[0], name: "compound-pinion", teeth: 16, radius: 8, layer: 1 });
branch(7, "foreground-reduction", 32, -24, 1);
