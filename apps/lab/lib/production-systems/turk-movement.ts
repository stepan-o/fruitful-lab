/** Original open clockwork, in SVG units. All meshes use module-one teeth.
 * Rear bearings leave the train exposed; the foreground reduction shares the
 * centre wheel's arbor. The conveyor takes 4/5 revolution per 2.4-second tray.
 */
export const movementOutput = { x: 322, y: 415, revolutionsPerSecond: 1 / 3 };
export type MovementWheel = {
  name: string; x: number; y: number; teeth: number; radius: number;
  phase: number; direction: number; period: number; layer: number;
};
const teeth = [74, 32, 48, 34, 36];
const heights = [421, 387, 411, 444, 415];
const names = ["flywheel", "intermediate", "centre", "transfer", "takeoff"];
const xs = [0, 0, 0, 0, movementOutput.x];
for (let i = 3; i >= 0; i--) {
  const distance = (teeth[i] + teeth[i + 1]) / 2;
  xs[i] = xs[i + 1] - Math.sqrt(distance ** 2 - (heights[i + 1] - heights[i]) ** 2);
}
function meshPhase(a: MovementWheel, x: number, y: number, count: number) {
  const angle = Math.atan2(y - a.y, x - a.x) * 180 / Math.PI;
  const previousTooth = (angle - a.phase) * a.teeth / 360;
  return angle + 180 - (0.5 - previousTooth) * 360 / count;
}
export const movementWheels: MovementWheel[] = [];
for (let i = 0; i < teeth.length; i++) {
  movementWheels.push({
    name: names[i], x: xs[i], y: heights[i], teeth: teeth[i], radius: teeth[i] / 2,
    phase: i ? meshPhase(movementWheels[i - 1], xs[i], heights[i], teeth[i]) : 0,
    direction: i % 2 ? -1 : 1, period: teeth[i] / teeth[4] / movementOutput.revolutionsPerSecond,
    layer: 0,
  });
}
export const movementMeshes: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4]];
function branch(parent: number, name: string, count: number, dx: number, dy: number) {
  const a = movementWheels[parent], x = a.x + dx, y = a.y + dy;
  movementMeshes.push([parent, movementWheels.length]);
  movementWheels.push({ name, x, y, teeth: count, radius: count / 2,
    phase: meshPhase(a, x, y, count), direction: -a.direction,
    period: a.period * count / a.teeth, layer: a.layer });
}
branch(0, "upper-pinion", 20, 0, -47);
branch(0, "winding-pinion", 20, -Math.sqrt(47 ** 2 - 32 ** 2), -32);
branch(4, "relay-pinion", 18, 23, -Math.sqrt(27 ** 2 - 23 ** 2));
branch(7, "upper-relay", 28, Math.sqrt(23 ** 2 - 22 ** 2), -22);
// A compound arbor carries two wheels at the same speed in separate planes.
export const movementCompound: [number, number] = [2, 9];
movementWheels.push({ ...movementWheels[2], name: "compound-pinion", teeth: 20, radius: 10, layer: 1 });
branch(9, "reduction", 30, -20, 15);

/** Sampled involute flanks with root clearance. No runtime geometry or frames. */
export function wheelOutline(count: number) {
  const pitch = count / 2, root = pitch - 1.25, tip = pitch + 1;
  const base = pitch * Math.cos(Math.PI / 9);
  const involute = (r: number) => {
    const a = Math.acos(Math.min(1, base / r));
    return Math.tan(a) - a;
  };
  const half = Math.PI / (2 * count), pitchInvolute = involute(pitch);
  const radii = [Math.max(root, base), pitch, tip];
  const point = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  return Array.from({ length: count }, (_, i) => {
    const a = i * 2 * Math.PI / count;
    const flank = (r: number) => half + pitchInvolute - involute(r);
    return `${i ? "L" : "M"}${point(root, a - flank(radii[0]))}` +
      radii.map(r => `L${point(r, a - flank(r))}`).join("") +
      [...radii].reverse().map(r => `L${point(r, a + flank(r))}`).join("") +
      `L${point(root, a + flank(radii[0]))}`;
  }).join("") + "Z";
}
