import type { ManagedRoomId, Rect, ZoneId } from './floor';

/** Presentation framing is independent of room dimensions: keep workers readable
 * while the player moves between a local installation and the full construction area. */
export const WORK_AREAS: Record<ZoneId, Rect> = {
  security: { x: 118, y: 108, w: 19, h: 23 },
  conveyor: { x: 108, y: 133, w: 30, h: 21 },
  brewery: { x: 144, y: 28, w: 30, h: 21 },
  weaving: { x: 77, y: 25, w: 27, h: 24 },
  theatre: { x: 238, y: 40, w: 21, h: 24 },
  cortex: { x: 162, y: 136, w: 25, h: 29 },
  lobby: { x: 57, y: 94, w: 23, h: 23 },
  dispatch: { x: 86, y: 98, w: 24, h: 20 },
  shipping: { x: 244, y: 141, w: 24, h: 26 },
};

export type ConstructionReserve = Readonly<{ id: string; room: ManagedRoomId; label: string; rect: Rect }>;
/** Unoccupied construction plots, not purchased modules or gameplay placement locks.
 * A future builder may subdivide these freely; these remain distinct from delivery aisles. */
export const CONSTRUCTION_RESERVES: readonly ConstructionReserve[] = [
  { id: 'security-expansion', room: 'security', label: 'CLEARANCE EXPANSION', rect: { x: 115, y: 84, w: 26, h: 22 } },
  { id: 'forge-feed', room: 'conveyor', label: 'FEED / BUFFER', rect: { x: 84, y: 134, w: 22, h: 22 } },
  { id: 'forge-extension', room: 'conveyor', label: 'LINE EXTENSION', rect: { x: 138, y: 136, w: 18, h: 20 } },
  { id: 'forge-west', room: 'conveyor', label: 'PRODUCTION BAY B', rect: { x: 84, y: 162, w: 34, h: 18 } },
  { id: 'forge-east', room: 'conveyor', label: 'PRODUCTION BAY C', rect: { x: 122, y: 162, w: 34, h: 18 } },
  { id: 'brew-feed', room: 'brewery', label: 'FEED PREPARATION', rect: { x: 124, y: 20, w: 19, h: 48 } },
  { id: 'brew-process', room: 'brewery', label: 'PROCESS EXPANSION', rect: { x: 148, y: 52, w: 54, h: 24 } },
  { id: 'brew-filter', room: 'brewery', label: 'FILTRATION / STORAGE', rect: { x: 178, y: 20, w: 26, h: 27 } },
  { id: 'weave-west', room: 'weaving', label: 'LOOM HALL', rect: { x: 44, y: 20, w: 29, h: 54 } },
  { id: 'weave-south', room: 'weaving', label: 'RIBBON HANDLING', rect: { x: 78, y: 55, w: 37, h: 21 } },
  { id: 'theatre-west', room: 'theatre', label: 'AUDIENCE EXPANSION', rect: { x: 228, y: 36, w: 10, h: 54 } },
  { id: 'theatre-east', room: 'theatre', label: 'CONDITIONING EXPANSION', rect: { x: 262, y: 36, w: 14, h: 30 } },
  { id: 'theatre-east-south', room: 'theatre', label: 'CONDITIONING / SOUTH', rect: { x: 262, y: 70, w: 14, h: 20 } },
  { id: 'theatre-south', room: 'theatre', label: 'ASSEMBLY / WAITING', rect: { x: 242, y: 70, w: 18, h: 20 } },
  { id: 'cortex-east', room: 'cortex', label: 'ASSEMBLY EXPANSION', rect: { x: 190, y: 116, w: 29, h: 50 } },
  { id: 'cortex-south', room: 'cortex', label: 'TEST / OUTFEED', rect: { x: 164, y: 172, w: 55, h: 24 } },
  { id: 'cortex-north', room: 'cortex', label: 'SUBASSEMBLY', rect: { x: 164, y: 116, w: 22, h: 16 } },
];
export const DELIVERY_AISLES: readonly { room: ManagedRoomId; rect: Rect }[] = [
  { room: 'conveyor', rect: { x: 82, y: 156, w: 78, h: 6 } },
  { room: 'brewery', rect: { x: 143, y: 18, w: 5, h: 60 } },
  { room: 'weaving', rect: { x: 73, y: 18, w: 5, h: 60 } },
  { room: 'theatre', rect: { x: 238, y: 66, w: 40, h: 4 } },
  { room: 'cortex', rect: { x: 164, y: 166, w: 58, h: 6 } },
];
export function reservedArea(room: ZoneId): number {
  return CONSTRUCTION_RESERVES.filter(p => p.room === room).reduce((sum, p) => sum + p.rect.w * p.rect.h, 0);
}
