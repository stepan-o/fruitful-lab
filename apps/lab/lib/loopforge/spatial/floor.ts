/** Floor 1, calibrated from the original 35 × 25 Sim4 tile plan.
 * Coordinates are integer tiles, west→east / north→south; rectangles are half-open.
 * This module owns topology and admission. A renderer may project it, never redefine it.
 */
export const FLOOR_VERSION = "loopforge-floor-1/1";
export const FLOOR_SIZE = { width: 35, height: 25 } as const;
export type ManagedRoomId = "security" | "conveyor" | "theatre" | "brewery" | "weaving" | "cortex";
export type ZoneId = ManagedRoomId | "lobby" | "dispatch" | "shipping";
export type Tile = Readonly<{ x: number; y: number }>;
export type Rect = Readonly<{ x: number; y: number; w: number; h: number }>;
export type FloorZone = Readonly<{ id: ZoneId; name: string; short: string; number: string; kind: "managed" | "support"; rect: Rect }>;
export const ZONES: readonly FloorZone[] = [
  { id: "weaving", name: "Synapse Weaving Gallery", short: "Weaving Gallery", number: "05", kind: "managed", rect: { x: 5, y: 2, w: 10, h: 8 } },
  { id: "brewery", name: "Cognitive Substrate Brewery", short: "Substrate Brewery", number: "04", kind: "managed", rect: { x: 15, y: 2, w: 11, h: 8 } },
  { id: "theatre", name: "Burn-in Theatre", short: "Burn-in Theatre", number: "03", kind: "managed", rect: { x: 28, y: 4, w: 7, h: 8 } },
  { id: "lobby", name: "Lobby", short: "Lobby", number: "L", kind: "support", rect: { x: 1, y: 10, w: 9, h: 6 } },
  { id: "dispatch", name: "Dispatch", short: "Dispatch", number: "D", kind: "support", rect: { x: 10, y: 10, w: 4, h: 6 } },
  { id: "security", name: "Security", short: "Security", number: "01", kind: "managed", rect: { x: 14, y: 10, w: 4, h: 6 } },
  { id: "conveyor", name: "Synaptic Lattice Forge", short: "Lattice Forge", number: "02", kind: "managed", rect: { x: 10, y: 16, w: 10, h: 7 } },
  { id: "cortex", name: "Cortex Assembly", short: "Cortex Assembly", number: "06", kind: "managed", rect: { x: 20, y: 14, w: 8, h: 11 } },
  { id: "shipping", name: "Shipping", short: "Shipping", number: "S", kind: "support", rect: { x: 30, y: 15, w: 5, h: 10 } },
];
export const MANAGED_ROOMS = [...ZONES.filter(z => z.kind === "managed")].sort((a, b) => a.number.localeCompare(b.number));
export const INITIAL_UNLOCKED: readonly ManagedRoomId[] = ["security", "conveyor"];
export function zone(id: ZoneId): FloorZone { return ZONES.find(z => z.id === id)!; }
export function contains(r: Rect, t: Tile): boolean { return t.x >= r.x && t.x < r.x + r.w && t.y >= r.y && t.y < r.y + r.h; }
export function zoneAt(t: Tile): FloorZone | undefined { return ZONES.find(z => contains(z.rect, t)); }
export function accessible(id: ZoneId, unlocked: readonly ManagedRoomId[]): boolean { return zone(id).kind === "support" || unlocked.includes(id as ManagedRoomId); }

export type Portal = Readonly<{ id: string; a: ZoneId; b: ZoneId; start: Tile; end: Tile; width: number }>;
/** All legacy physical neighbours are retained; Security–Conveyor adds the explicit
 * shared threshold required by the current design and the later sim_sim conflict rule.
 * Short bridges give the legacy across-gap edges actual walkable geometry.
 */
export const PORTALS: readonly Portal[] = [
  { id: "lobby-dispatch", a: "lobby", b: "dispatch", start: { x: 9, y: 12 }, end: { x: 10, y: 12 }, width: 2 },
  { id: "dispatch-security", a: "dispatch", b: "security", start: { x: 13, y: 12 }, end: { x: 14, y: 12 }, width: 2 },
  { id: "security-conveyor", a: "security", b: "conveyor", start: { x: 15, y: 15 }, end: { x: 15, y: 16 }, width: 2 },
  { id: "dispatch-conveyor", a: "dispatch", b: "conveyor", start: { x: 11, y: 15 }, end: { x: 11, y: 16 }, width: 2 },
  { id: "weaving-lobby", a: "weaving", b: "lobby", start: { x: 7, y: 9 }, end: { x: 7, y: 10 }, width: 2 },
  { id: "weaving-dispatch", a: "weaving", b: "dispatch", start: { x: 11, y: 9 }, end: { x: 11, y: 10 }, width: 2 },
  { id: "weaving-brewery", a: "weaving", b: "brewery", start: { x: 14, y: 5 }, end: { x: 15, y: 5 }, width: 2 },
  { id: "brewery-security", a: "brewery", b: "security", start: { x: 15, y: 9 }, end: { x: 15, y: 10 }, width: 2 },
  { id: "brewery-theatre", a: "brewery", b: "theatre", start: { x: 25, y: 7 }, end: { x: 28, y: 7 }, width: 2 },
  { id: "security-cortex", a: "security", b: "cortex", start: { x: 17, y: 14 }, end: { x: 20, y: 14 }, width: 2 },
  { id: "conveyor-cortex", a: "conveyor", b: "cortex", start: { x: 19, y: 19 }, end: { x: 20, y: 19 }, width: 2 },
  { id: "cortex-shipping", a: "cortex", b: "shipping", start: { x: 27, y: 19 }, end: { x: 30, y: 19 }, width: 2 },
  { id: "theatre-shipping", a: "theatre", b: "shipping", start: { x: 32, y: 11 }, end: { x: 32, y: 15 }, width: 2 },
];
export function portalRect(p: Portal): Rect {
  return p.start.x !== p.end.x
    ? { x: Math.min(p.start.x, p.end.x), y: p.start.y, w: Math.abs(p.end.x - p.start.x) + 1, h: p.width }
    : { x: p.start.x, y: Math.min(p.start.y, p.end.y), w: p.width, h: Math.abs(p.end.y - p.start.y) + 1 };
}
export function portalOpen(p: Portal, unlocked: readonly ManagedRoomId[]): boolean { return accessible(p.a, unlocked) && accessible(p.b, unlocked); }
export function neighbours(id: ZoneId): ZoneId[] { return PORTALS.filter(p => p.a === id || p.b === id).map(p => p.a === id ? p.b : p.a); }
/** Direct working-room contact only; reachability through Dispatch is not adjacency. */
export function interactionEdge(a: ManagedRoomId, b: ManagedRoomId, unlocked: readonly ManagedRoomId[]): string | null {
  return PORTALS.find(p => ((p.a === a && p.b === b) || (p.a === b && p.b === a)) && portalOpen(p, unlocked))?.id ?? null;
}
export function portalAt(t: Tile): Portal | undefined { return PORTALS.find(p => contains(portalRect(p), t)); }
export function floorTile(t: Tile): boolean { return Number.isInteger(t.x) && Number.isInteger(t.y) && (!!zoneAt(t) || !!portalAt(t)); }
export function walkable(t: Tile, unlocked: readonly ManagedRoomId[], obstacles: readonly Rect[] = []): boolean {
  if (!floorTile(t) || obstacles.some(r => contains(r, t))) return false;
  const room = zoneAt(t); if (room) return accessible(room.id, unlocked);
  const p = portalAt(t); return !!p && portalOpen(p, unlocked);
}
export function openingBetween(a: Tile, b: Tile): Portal | undefined {
  return PORTALS.find(p => contains(portalRect(p), a) && contains(portalRect(p), b));
}
export function canStep(a: Tile, b: Tile, unlocked: readonly ManagedRoomId[], obstacles: readonly Rect[] = []): boolean {
  if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1 || !walkable(a, unlocked, obstacles) || !walkable(b, unlocked, obstacles)) return false;
  const za = zoneAt(a), zb = zoneAt(b);
  if (za && zb && za.id === zb.id) return true;
  const p = openingBetween(a, b); return !!p && portalOpen(p, unlocked);
}
/** Stable four-neighbour BFS. No diagonals through walls or renderer navigation state. */
export function findTilePath(start: Tile, end: Tile, unlocked: readonly ManagedRoomId[], obstacles: readonly Rect[] = []): Tile[] | null {
  if (!walkable(start, unlocked, obstacles) || !walkable(end, unlocked, obstacles)) return null;
  const key = (t: Tile) => t.y * FLOOR_SIZE.width + t.x;
  const queue: Tile[] = [start], parents = new Map<number, Tile | null>([[key(start), null]]);
  for (let i = 0; i < queue.length; i++) {
    const t = queue[i];
    if (t.x === end.x && t.y === end.y) {
      const out: Tile[] = []; let cursor: Tile | null = t;
      while (cursor) { out.push(cursor); cursor = parents.get(key(cursor)) ?? null; }
      return out.reverse();
    }
    for (const n of [{ x: t.x + 1, y: t.y }, { x: t.x, y: t.y + 1 }, { x: t.x - 1, y: t.y }, { x: t.x, y: t.y - 1 }]) {
      if (!parents.has(key(n)) && canStep(t, n, unlocked, obstacles)) { parents.set(key(n), t); queue.push(n); }
    }
  }
  return null;
}

export const FIXTURE_SOCKETS = {
  terminal: { room: "security", x: 14.95, y: 11.6, scale: .65 },
  gate: { room: "security", x: 16, y: 16, scale: .65 },
  drive: { room: "conveyor", x: 16.368, y: 20.724, scale: .72 },
} as const;
export const CREW_OBSTACLES: readonly Rect[] = [
  { x: 14, y: 11, w: 2, h: 2 }, // Terminal footprint.
  { x: 11, y: 19, w: 8, h: 2 }, // Conveyor and outtake.
  { x: 15, y: 21, w: 3, h: 1 }, // Motor service envelope.
];
const crewStops: readonly Tile[] = [{ x: 16, y: 13 }, { x: 16, y: 17 }, { x: 10, y: 17 }, { x: 10, y: 22 }, { x: 19, y: 22 }, { x: 19, y: 17 }, { x: 16, y: 17 }, { x: 16, y: 13 }];
export const CREW_ROUTE: readonly Tile[] = crewStops.flatMap((t, i) => i === 0 ? [] : findTilePath(crewStops[i - 1], t, INITIAL_UNLOCKED, CREW_OBSTACLES)!.slice(0, -1));
export const ROUTE_LENGTH = CREW_ROUTE.length * 1000;
export function crewPose(progress: number) {
  const i = Math.floor(progress / 1000) % CREW_ROUTE.length, a = CREW_ROUTE[i], b = CREW_ROUTE[(i + 1) % CREW_ROUTE.length], f = progress % 1000;
  const x = a.x * 1000 + 500 + (b.x - a.x) * f, y = a.y * 1000 + 500 + (b.y - a.y) * f;
  return { x, y, dx: b.x - a.x, dy: b.y - a.y, room: zoneAt({ x: Math.floor(x / 1000), y: Math.floor(y / 1000) })!.id };
}
export const GATE_CROSSINGS = CREW_ROUTE.flatMap((a, i) => {
  const b = CREW_ROUTE[(i + 1) % CREW_ROUTE.length];
  return zoneAt(a)?.id !== zoneAt(b)?.id && openingBetween(a, b)?.id === "security-conveyor" ? [i * 1000 + 500] : [];
});

/** Convert only at the presentation boundary; north is positive scene Z. */
export function worldPoint(x: number, y: number): [number, number, number] { return [x - FLOOR_SIZE.width / 2, 0, FLOOR_SIZE.height / 2 - y]; }
