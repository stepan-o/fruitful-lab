import { accessible, canStep, CREW_OBSTACLES, CREW_ROUTE, crewPose, findTilePath, FLOOR_SIZE, GATE_CROSSINGS, INITIAL_UNLOCKED, interactionEdge, MANAGED_ROOMS, PORTALS, ROUTE_LENGTH, walkable, zone, zoneAt, ZONES } from "@/lib/loopforge/spatial/floor";
import { command, initialStudy } from "@/lib/loopforge/factory-study/kernel";

describe("calibrated factory floor", () => {
  it("keeps the original nine footprints inside 35 × 25 tiles with six managed rooms", () => {
    expect(ZONES).toHaveLength(9); expect(MANAGED_ROOMS).toHaveLength(6);
    expect(zone("security").rect).toEqual({ x: 14, y: 10, w: 4, h: 6 });
    expect(zone("conveyor").rect).toEqual({ x: 10, y: 16, w: 10, h: 7 });
    for (const a of ZONES) {
      const r = a.rect; expect(r.x + r.w).toBeLessThanOrEqual(FLOOR_SIZE.width); expect(r.y + r.h).toBeLessThanOrEqual(FLOOR_SIZE.height);
      for (const b of ZONES) if (a.id !== b.id) {
        const q = b.rect; expect(r.x >= q.x + q.w || q.x >= r.x + r.w || r.y >= q.y + q.h || q.y >= r.y + r.h).toBe(true);
      }
    }
    for (const p of PORTALS) { expect(zoneAt(p.start)?.id).toBe(p.a); expect(zoneAt(p.end)?.id).toBe(p.b); }
  });
  it("opens only Security and Conveyor on turn one and enforces access below the UI", () => {
    const state = initialStudy(); expect(state.unlockedRooms).toEqual(["security", "conveyor"]);
    expect(MANAGED_ROOMS.filter(r => accessible(r.id, state.unlockedRooms)).map(r => r.id)).toEqual(["security", "conveyor"]);
    for (const r of MANAGED_ROOMS.filter(r => !accessible(r.id, state.unlockedRooms))) {
      const destination = { x: r.rect.x + 1, y: r.rect.y + 1 };
      expect(findTilePath({ x: 16, y: 13 }, destination, state.unlockedRooms)).toBeNull();
    }
    expect(command({ ...state, unlockedRooms: [] }, { type: "install", fixture: "terminal" })).toEqual({ ok: false, reason: "This room is sealed." });
  });
  it("connects Lobby → Dispatch → Security → Conveyor through actual thresholds", () => {
    const path = findTilePath({ x: 5, y: 13 }, { x: 16, y: 17 }, INITIAL_UNLOCKED)!;
    expect(path).not.toBeNull();
    const rooms = path.map(t => zoneAt(t)?.id).filter((r, i, list) => r !== list[i - 1]);
    expect(rooms).toEqual(["lobby", "dispatch", "security", "conveyor"]);
    expect(canStep({ x: 14, y: 15 }, { x: 14, y: 16 }, INITIAL_UNLOCKED)).toBe(false); // Wall, beside the door.
    expect(canStep({ x: 15, y: 15 }, { x: 15, y: 16 }, INITIAL_UNLOCKED)).toBe(true);
    expect(canStep({ x: 16, y: 15 }, { x: 17, y: 16 }, INITIAL_UNLOCKED)).toBe(false); // No corner cutting.
  });
  it("distinguishes direct supervisor contact from merely reachable rooms", () => {
    expect(interactionEdge("security", "conveyor", INITIAL_UNLOCKED)).toBe("security-conveyor");
    expect(interactionEdge("conveyor", "security", INITIAL_UNLOCKED)).toBe("security-conveyor");
    expect(interactionEdge("security", "brewery", INITIAL_UNLOCKED)).toBeNull();
    const all = MANAGED_ROOMS.map(r => r.id) as typeof INITIAL_UNLOCKED;
    expect(findTilePath({ x: 16, y: 17 }, { x: 20, y: 5 }, all)).not.toBeNull();
    expect(interactionEdge("conveyor", "brewery", all)).toBeNull(); // Reachable through Security, not direct neighbours.
    expect(interactionEdge("security", "brewery", all)).toBe("brewery-security");
  });
  it("routes the individual crew around machinery and across the same Security doorway", () => {
    expect(CREW_ROUTE.length).toBeGreaterThan(20); expect(GATE_CROSSINGS).toHaveLength(2);
    for (let i = 0; i < CREW_ROUTE.length; i++) expect(canStep(CREW_ROUTE[i], CREW_ROUTE[(i + 1) % CREW_ROUTE.length], INITIAL_UNLOCKED, CREW_OBSTACLES)).toBe(true);
    for (let p = 0; p < ROUTE_LENGTH; p += 73) {
      const pose = crewPose(p); expect(Number.isInteger(pose.x) && Number.isInteger(pose.y)).toBe(true);
      expect(walkable({ x: Math.floor(pose.x / 1000), y: Math.floor(pose.y / 1000) }, INITIAL_UNLOCKED, CREW_OBSTACLES)).toBe(true);
      expect(["security", "conveyor"]).toContain(pose.room);
    }
  });
});
