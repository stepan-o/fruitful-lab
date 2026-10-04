/** Original editorial movement, in SVG units. Module 1 and a common 20°
 * pressure angle give every wheel the same tooth pitch. Adjacent pitch circles
 * are tangent; four external meshes preserve clockwise motion at the takeoff.
 * The existing conveyor consumes 4/5 revolution in each 2.4-second tray period.
 */
const teeth = [58, 34, 44, 56, 44];
const heights = [429, 390, 394, 439, 415];
const names = ["barrel", "intermediate", "centre", "transfer", "takeoff"];
export const movementOutput = { x: 322, y: 415, revolutionsPerSecond: 1 / 3 };
const xs = [0, 0, 0, 0, movementOutput.x];
for (let i = 3; i >= 0; i--) {
  const distance = (teeth[i] + teeth[i + 1]) / 2;
  xs[i] = xs[i + 1] - Math.sqrt(distance ** 2 - (heights[i + 1] - heights[i]) ** 2);
}
const phases = [0];
for (let i = 1; i < teeth.length; i++) {
  const angle = Math.atan2(heights[i] - heights[i - 1], xs[i] - xs[i - 1]);
  const previousTooth = (angle - phases[i - 1]) * teeth[i - 1] / (2 * Math.PI);
  // Put a tooth opposite a space at the pitch-circle contact, at every time.
  phases[i] = angle + Math.PI - (0.5 - previousTooth) * 2 * Math.PI / teeth[i];
}
export const movementWheels = teeth.map((count, i) => ({
  name: names[i], x: xs[i], y: heights[i], teeth: count, radius: count / 2,
  phase: phases[i] * 180 / Math.PI,
  direction: i % 2 ? -1 : 1,
  period: count / teeth[4] / movementOutput.revolutionsPerSecond,
}));
export type MovementWheel = typeof movementWheels[number];

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
