import { CLAIM_DESK, LOBBY_BAYS, claimDisplay } from '@/lib/loopforge/spatial/lobby';
import { contains, zone, PORTALS, portalRect, INITIAL_UNLOCKED, findTilePath } from '@/lib/loopforge/spatial/floor';

describe('lobby presentation kit', () => {
  it('keeps worker-scale desks and seated workers inside the lobby, clear of its portals', () => {
    const bounds = zone('lobby').rect;
    const portals = PORTALS.filter(p => p.a === 'lobby' || p.b === 'lobby').map(portalRect);
    for (const bay of LOBBY_BAYS) {
      // Include the chair, operator and service space behind the desk.
      for (const x of [-1.25, 1.25]) for (const z of [-1.6, .8]) {
        const p = { x: bay.x + x * Math.cos(bay.yaw) + z * Math.sin(bay.yaw), y: bay.y + x * Math.sin(bay.yaw) - z * Math.cos(bay.yaw) };
        expect(contains(bounds, p)).toBe(true);
        expect(portals.some(r => contains(r, p))).toBe(false);
      }
    }
    expect(CLAIM_DESK.height).toBeLessThan(1.1);
    expect(CLAIM_DESK.sockets.seat[1]).toBeLessThan(CLAIM_DESK.height);
    expect(findTilePath({ x: 65, y: 92 }, { x: 126, y: 120 }, INITIAL_UNLOCKED)).not.toBeNull();
  });
  it('replays staged claim cues without random input or changing a game snapshot', () => {
    const samples = [0, 4.99, 5, 10, 15, 20].map(t => claimDisplay(t));
    expect(samples).toEqual(['filing', 'filing', 'waiting', 'accepted', 'returned', 'filing']);
    expect(claimDisplay(-1)).toBe('filing');
    expect(claimDisplay(1, 4)).toBe('waiting');
  });
});
