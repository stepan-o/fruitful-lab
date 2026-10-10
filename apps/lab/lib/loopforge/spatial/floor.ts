/** Floor 1, calibrated from the original Sim4 plan, expanded to worker-scale build tiles.
 * Coordinates are integer tiles, west→east / north→south; rectangles are half-open.
 * This module owns topology and admission. A renderer may project it, never redefine it.
 */
export const FLOOR_VERSION = "loopforge-floor-1/5";
export const FLOOR_SCALE = 8;
export const FLOOR_SIZE = { width: 35 * FLOOR_SCALE, height: 25 * FLOOR_SCALE } as const;
export const FIRST_FLOOR_HEIGHT = 15; // Shared structural cornice, matched to Cortex.
export const WORKER_HEIGHT = 1.9; // Metres; one design tile is one metre.
export type ManagedRoomId = "security" | "conveyor" | "theatre" | "brewery" | "weaving" | "cortex";
export type ZoneId = ManagedRoomId | "lobby" | "dispatch" | "shipping";
export type Tile = Readonly<{ x: number; y: number }>;
export type Rect = Readonly<{ x: number; y: number; w: number; h: number }>;
export type FloorZone = Readonly<{ id: ZoneId; name: string; short: string; number: string; kind: "managed" | "support"; rect: Rect }>;
export const REFERENCE_ZONES: readonly FloorZone[] = [
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
/** Owner-directed refit: retain geography and equipment scale, reclaim blank infill
 * as room floor. The original Sim4 rectangles above remain provenance, not runtime bounds. */
const FOOTPRINTS: Record<ZoneId, Rect> = {
  weaving: { x: 40, y: 16, w: 72, h: 64 },
  brewery: { x: 112, y: 16, w: 96, h: 80 },
  theatre: { x: 212, y: 16, w: 68, h: 88 },
  lobby: { x: 8, y: 80, w: 72, h: 48 },
  dispatch: { x: 80, y: 80, w: 32, h: 48 },
  security: { x: 112, y: 96, w: 44, h: 32 },
  conveyor: { x: 80, y: 128, w: 80, h: 56 },
  cortex: { x: 160, y: 108, w: 64, h: 92 },
  shipping: { x: 228, y: 104, w: 52, h: 96 },
};
export const ZONES: readonly FloorZone[] = REFERENCE_ZONES.map(z => ({ ...z,
  ...(z.id === "shipping" ? { name: "Logistics", short: "Logistics" } : {}), rect: FOOTPRINTS[z.id] }));
export const MANAGED_ROOMS = [...ZONES.filter(z => z.kind === "managed")].sort((a, b) => a.number.localeCompare(b.number));
export const INITIAL_UNLOCKED: readonly ManagedRoomId[] = ["security", "conveyor"];
export function zone(id: ZoneId): FloorZone { return ZONES.find(z => z.id === id)!; }
export function contains(r: Rect, t: Tile): boolean { return t.x >= r.x && t.x < r.x + r.w && t.y >= r.y && t.y < r.y + r.h; }
export function zoneAt(t: Tile): FloorZone | undefined { return ZONES.find(z => contains(z.rect, t)); }
export function accessible(id: ZoneId, unlocked: readonly ManagedRoomId[]): boolean { return zone(id).kind === "support" || unlocked.includes(id as ManagedRoomId); }

export type Portal = Readonly<{ id: string; a: ZoneId; b: ZoneId; start: Tile; end: Tile; width: number }>;
/** Thirteen existing relationships plus the owner-required Security–Theatre corridor.
 * Endpoints are admitted room tiles; gaps contain only the explicitly authored passage.
 * Passage access requires both endpoints unlocked, including the Theatre corridor. */
export const PORTALS: readonly Portal[] = [
  { id: "lobby-dispatch", a: "lobby", b: "dispatch", start: { x: 79, y: 101 }, end: { x: 80, y: 101 }, width: 6 },
  { id: "dispatch-security", a: "dispatch", b: "security", start: { x: 111, y: 101 }, end: { x: 112, y: 101 }, width: 6 },
  { id: "security-conveyor", a: "security", b: "conveyor", start: { x: 125, y: 127 }, end: { x: 125, y: 128 }, width: 6 },
  { id: "dispatch-conveyor", a: "dispatch", b: "conveyor", start: { x: 93, y: 127 }, end: { x: 93, y: 128 }, width: 6 },
  { id: "weaving-lobby", a: "weaving", b: "lobby", start: { x: 61, y: 79 }, end: { x: 61, y: 80 }, width: 6 },
  { id: "weaving-dispatch", a: "weaving", b: "dispatch", start: { x: 93, y: 79 }, end: { x: 93, y: 80 }, width: 6 },
  { id: "weaving-brewery", a: "weaving", b: "brewery", start: { x: 111, y: 45 }, end: { x: 112, y: 45 }, width: 6 },
  { id: "brewery-security", a: "brewery", b: "security", start: { x: 125, y: 95 }, end: { x: 125, y: 96 }, width: 6 },
  { id: "brewery-theatre", a: "brewery", b: "theatre", start: { x: 207, y: 61 }, end: { x: 212, y: 61 }, width: 6 },
  { id: "security-cortex", a: "security", b: "cortex", start: { x: 155, y: 117 }, end: { x: 160, y: 117 }, width: 6 },
  { id: "conveyor-cortex", a: "conveyor", b: "cortex", start: { x: 159, y: 157 }, end: { x: 160, y: 157 }, width: 6 },
  { id: "cortex-shipping", a: "cortex", b: "shipping", start: { x: 223, y: 157 }, end: { x: 228, y: 157 }, width: 6 },
  { id: "theatre-shipping", a: "theatre", b: "shipping", start: { x: 261, y: 103 }, end: { x: 261, y: 104 }, width: 6 },
  { id: "security-theatre", a: "security", b: "theatre", start: { x: 155, y: 96 }, end: { x: 212, y: 96 }, width: 8 },
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

// The starter cell stays close to the shared threshold, inside an expandable hall.
export const LINE_ORIGIN = { x: 123, y: 145 } as const;
export const FIXTURE_SOCKETS = {
  terminal: { room: "security", x: 123, y: 115, scale: 1 },
  gate: { room: "security", x: 126.5, y: 128, scale: 1 },
  drive: { room: "conveyor", x: 124.9, y: 146.7, scale: 1 },
} as const;
export const CREW_OBSTACLES: readonly Rect[] = [
  { x: 122, y: 114, w: 2, h: 3 },
  { x: 121, y: 121, w: 3, h: 5 },
  { x: 128, y: 112, w: 3, h: 4 },
  { x: 110, y: 143, w: 25, h: 4 }, // Starter intake → line → outtake, not the entire hall.
  { x: 123, y: 146, w: 4, h: 2 },
  { x: 110, y: 136, w: 4, h: 4 },
  { x: 119, y: 139, w: 6, h: 3 },
];
const crewStops: readonly Tile[] = [{ x: 126, y: 123 }, { x: 126, y: 133 }, { x: 115, y: 133 }, { x: 115, y: 141 }, { x: 109, y: 141 }, { x: 109, y: 152 }, { x: 136, y: 152 }, { x: 136, y: 141 }, { x: 126, y: 137 }, { x: 126, y: 123 }];
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
