import type { PlayerView } from "./contract";
export type LightKind = "idle" | "production" | "accident" | "attention";
export const LIGHTS = {
  idle: { rgb: "105, 205, 219", duration: 2400, power: .07, label: "Idle signal", priority: 0 },
  production: { rgb: "114, 235, 156", duration: 1150, power: .17, label: "New production confirmed", priority: 1 },
  attention: { rgb: "255, 169, 74", duration: 1600, power: .16, label: "Your attention is required", priority: 2 },
  accident: { rgb: "255, 48, 75", duration: 1350, power: .23, label: "Worker accident confirmed", priority: 3 },
} as const;
/** Receipt changes only: restoring a snapshot must not replay historical effects. */
export function receiptLight(before: PlayerView | null, next: PlayerView): LightKind | null {
  if (!before) return next.phase === "choose" ? "attention" : null;
  if (next.tick <= before.tick) return null;
  // In this slice an incident can be paperwork or a warning, not an accident.
  if (next.losses > before.losses) return "accident";
  if ((next.phase === "decision" && before.pending?.id !== next.pending?.id) ||
      (next.phase === "allocation" && before.phase !== "allocation")) return "attention";
  if (next.produced > before.produced) return "production";
  return null;
}
export type Point = { x: number; y: number };
export type Blocker = { x: number; y: number; width: number; height: number };
/** The tangent rays share the exact source used to draw the light cone. */
export function shadowPolygon(source: Point, box: Blocker, reach: number): Point[] {
  if (source.x >= box.x && source.x <= box.x + box.width && source.y >= box.y && source.y <= box.y + box.height) return [];
  const centre = Math.atan2(box.y + box.height / 2 - source.y, box.x + box.width / 2 - source.x);
  const points = [{ x: box.x, y: box.y }, { x: box.x + box.width, y: box.y }, { x: box.x + box.width, y: box.y + box.height }, { x: box.x, y: box.y + box.height }];
  const angle = (p: Point) => Math.atan2(Math.sin(Math.atan2(p.y-source.y,p.x-source.x)-centre), Math.cos(Math.atan2(p.y-source.y,p.x-source.x)-centre));
  points.sort((a,b) => angle(a)-angle(b));
  const a = points[0], b = points[3];
  const extend = (p: Point) => { const dx=p.x-source.x,dy=p.y-source.y,d=Math.hypot(dx,dy);return { x:p.x+dx/d*reach,y:p.y+dy/d*reach }; };
  return [a,b,extend(b),extend(a)];
}
