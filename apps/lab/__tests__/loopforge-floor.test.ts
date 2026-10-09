import { accessible, canStep, CREW_OBSTACLES, CREW_ROUTE, crewPose, findTilePath, FLOOR_SIZE, FLOOR_SCALE, REFERENCE_ZONES, contains, GATE_CROSSINGS, INITIAL_UNLOCKED, interactionEdge, MANAGED_ROOMS, PORTALS, ROUTE_LENGTH, walkable, zone, zoneAt, ZONES } from "@/lib/loopforge/spatial/floor";
import { EQUIPMENT_STUDY, ROOM_STAGING } from "@/lib/loopforge/spatial/equipment";
import { command, initialStudy } from "@/lib/loopforge/factory-study/kernel";

describe("calibrated factory floor", () => {
  it("expands the nine footprints to 105 × 75 tiles without changing their proportions", () => {
    expect(ZONES).toHaveLength(9); expect(MANAGED_ROOMS).toHaveLength(6);
    expect(zone("security").rect).toEqual({ x: 42, y: 30, w: 12, h: 18 });
    expect(zone("conveyor").rect).toEqual({ x: 30, y: 48, w: 30, h: 21 });
    expect(FLOOR_SIZE).toEqual({width:105,height:75});
    for(const z of ZONES){const source=REFERENCE_ZONES.find(r=>r.id===z.id)!;for(const key of ["x","y","w","h"] as const) expect(z.rect[key]/FLOOR_SCALE).toBe(source.rect[key]);}
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
      expect(findTilePath({ x: 48, y: 40 }, destination, state.unlockedRooms)).toBeNull();
    }
    expect(command({ ...state, unlockedRooms: [] }, { type: "install", fixture: "terminal" })).toEqual({ ok: false, reason: "This room is sealed." });
  });
  it("connects Lobby → Dispatch → Security → Conveyor through actual thresholds", () => {
    const path = findTilePath({ x: 16, y: 40 }, { x: 48, y: 51 }, INITIAL_UNLOCKED)!;
    expect(path).not.toBeNull();
    const rooms = path.map(t => zoneAt(t)?.id).filter((r, i, list) => r !== list[i - 1]);
    expect(rooms).toEqual(["lobby", "dispatch", "security", "conveyor"]);
    expect(canStep({ x: 44, y: 47 }, { x: 44, y: 48 }, INITIAL_UNLOCKED)).toBe(false); // Wall, beside the door.
    expect(canStep({ x: 48, y: 47 }, { x: 48, y: 48 }, INITIAL_UNLOCKED)).toBe(true);
    expect(canStep({ x: 48, y: 47 }, { x: 49, y: 48 }, INITIAL_UNLOCKED)).toBe(false); // No corner cutting.
  });
  it("distinguishes direct supervisor contact from merely reachable rooms", () => {
    expect(interactionEdge("security", "conveyor", INITIAL_UNLOCKED)).toBe("security-conveyor");
    expect(interactionEdge("conveyor", "security", INITIAL_UNLOCKED)).toBe("security-conveyor");
    expect(interactionEdge("security", "brewery", INITIAL_UNLOCKED)).toBeNull();
    const all = MANAGED_ROOMS.map(r => r.id) as typeof INITIAL_UNLOCKED;
    expect(findTilePath({ x: 48, y: 51 }, { x: 60, y: 15 }, all)).not.toBeNull();
    expect(interactionEdge("conveyor", "brewery", all)).toBeNull(); // Reachable through Security, not direct neighbours.
    expect(interactionEdge("security", "brewery", all)).toBe("brewery-security");
  });
  it("fits staged machinery, operator positions and interaction aprons inside their rooms", () => {
    expect(new Set(EQUIPMENT_STUDY.map(e=>e.room)).size).toBe(6);
    for(const e of EQUIPMENT_STUDY){
      const r=zone(e.room).rect, f=e.footprint;
      expect(contains(r,{x:f.x,y:f.y}) && contains(r,{x:f.x+f.w-1,y:f.y+f.h-1})).toBe(true);
      expect(contains(r,e.operator)).toBe(true);
      expect(EQUIPMENT_STUDY.some(other=>contains(other.footprint,e.operator))).toBe(false);
      for(const other of EQUIPMENT_STUDY.filter(other=>other!==e&&other.room===e.room)){
        const q=other.footprint;expect(f.x>=q.x+q.w||q.x>=f.x+f.w||f.y>=q.y+q.h||q.y>=f.y+f.h).toBe(true);
      }
    }
    for(const [room,s] of Object.entries(ROOM_STAGING)){
      const a=s.encounter;
      for(let x=a.x;x<a.x+a.w;x++)for(let y=a.y;y<a.y+a.h;y++){
        expect(zoneAt({x,y})?.id).toBe(room);
        expect(EQUIPMENT_STUDY.some(e=>contains(e.footprint,{x,y}))).toBe(false);
      }
    }
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
