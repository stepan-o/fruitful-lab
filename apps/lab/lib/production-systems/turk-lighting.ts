/** Orthographic scene coordinates, shared by every cast shadow in Fig. 01.
 * A unit of depth projects (+1/√3, −1), matching the accepted belt/case return.
 * The distant area key is above/front-left; directions travel away from it.
 * These small server-computed projections are an illustration, not a renderer.
 */
export type ScenePoint = { x: number; depth: number; height: number };
export type ScreenPoint = { x: number; y: number };
export const groundY = 523;
export const keyRay: ScenePoint = { x: .06, depth: .3, height: -1 };
export const keySamples = [
  keyRay,
  { x: .036, depth: .3, height: -1 }, { x: .084, depth: .3, height: -1 },
  { x: .048, depth: .276, height: -1 }, { x: .072, depth: .276, height: -1 },
  { x: .048, depth: .324, height: -1 }, { x: .072, depth: .324, height: -1 },
];
export function project(p: ScenePoint): ScreenPoint {
  return { x: p.x + p.depth / Math.sqrt(3), y: groundY - p.depth - p.height };
}
export function atDepth(p: ScreenPoint, depth: number): ScenePoint {
  return { x: p.x - depth / Math.sqrt(3), depth, height: groundY - p.y - depth };
}
/** Only forward intersections cast a shadow; coplanar contacts stay in place. */
export function cast(p: ScenePoint, axis: "height" | "depth", plane: number, ray = keyRay): ScenePoint | null {
  if (Math.abs(ray[axis]) < 1e-8) return null;
  const t = (plane - p[axis]) / ray[axis];
  if (t < 0) return null;
  return { x: p.x + ray.x * t, depth: p.depth + ray.depth * t, height: p.height + ray.height * t };
}
export function planeOffset(fromDepth: number, toDepth: number, ray = keyRay): ScreenPoint {
  const origin = atDepth({ x: 0, y: 0 }, fromDepth);
  const hit = cast(origin, "depth", toDepth, ray);
  if (!hit) throw new Error("Shadow receiver must be downstream of its caster");
  return project(hit);
}
const n = (v: number) => Math.round(v * 100) / 100;
export function polygon(points: ScreenPoint[]): string {
  return points.map((p, i) => `${i ? "L" : "M"}${n(p.x)} ${n(p.y)}`).join("") + "Z";
}
/** Convex solid proxies retain their physical footprint on the receiving floor. */
export function hull(points: ScreenPoint[]): ScreenPoint[] {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (a: ScreenPoint, b: ScreenPoint, c: ScreenPoint) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const half = (list: ScreenPoint[]) => {
    const result: ScreenPoint[] = [];
    for (const p of list) {
      while (result.length > 1 && cross(result[result.length-2], result[result.length-1], p) <= 0) result.pop();
      result.push(p);
    }
    return result.slice(0, -1);
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}
export const cabinetCaster = [129, 589].flatMap(x => [0, 64].flatMap(depth => [31, 196].map(height => ({ x, depth, height }))));
export const conveyorCaster = [32, 591.05].flatMap(x => [-3, 61].flatMap(depth => [173, 209].map(height => ({ x, depth, height }))));
export const doorCaster = [41, 179].flatMap(height => [{ x: 145, depth: 0, height }, { x: 89 + 19 / Math.sqrt(3), depth: -19, height }]);
export function floorShadow(points: ScenePoint[], ray = keyRay): string {
  return polygon(hull(points.flatMap(p => {
    const hit = cast(p, "height", 0, ray);
    return hit ? [project(hit)] : [];
  })));
}
/** Affine projection from a vertical hand plane onto the horizontal belt. */
export function beltShadowMatrix(depth: number): string {
  const y = groundY - 209 - depth;
  const q = keyRay.x + keyRay.depth / Math.sqrt(3);
  return `matrix(1 0 ${-q} ${keyRay.depth} ${q*y} ${(1-keyRay.depth)*y})`;
}
