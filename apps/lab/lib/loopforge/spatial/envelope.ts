import { contains, PORTALS, portalRect, ZONES, type Rect, type Tile } from './floor';

/** Repacked halls fill the stepped shell. Only narrow piping walls and explicit
 * passages remain outside rooms. Architecture never grants implicit navigation. */
export const BUILDING_OUTLINE: readonly Tile[] = [
  { x: 40, y: 16 }, { x: 280, y: 16 }, { x: 280, y: 200 }, { x: 160, y: 200 },
  { x: 160, y: 184 }, { x: 80, y: 184 }, { x: 80, y: 128 },
  { x: 8, y: 128 }, { x: 8, y: 80 }, { x: 40, y: 80 },
];
export const BUILDING_EDGES = BUILDING_OUTLINE.map((start, i) => ({ start, end: BUILDING_OUTLINE[(i + 1) % BUILDING_OUTLINE.length] }));
// Decompose the orthogonal outline into a few slabs, never one mesh per tile.
const ys = [...new Set(BUILDING_OUTLINE.map(p => p.y))].sort((a, b) => a - b);
export const BUILDING_BANDS: readonly Rect[] = ys.slice(0, -1).flatMap((y, i) => {
  const bottom = ys[i + 1], mid = (y + bottom) / 2;
  const xs = BUILDING_EDGES.filter(e => e.start.x === e.end.x && mid > Math.min(e.start.y, e.end.y) && mid < Math.max(e.start.y, e.end.y)).map(e => e.start.x).sort((a, b) => a - b);
  return xs.flatMap((x, j) => j % 2 ? [] : [{ x, y, w: xs[j + 1] - x, h: bottom - y }]);
});
export function inBuilding(t: Tile): boolean { return BUILDING_BANDS.some(r => contains(r, t)); }

/** Exact rectangular complement, coalesced along rows and then columns. No runtime
 * tile meshes, overlapping slabs or hand-authored filler measurements. */
function complement(excluded: readonly Rect[]): Rect[] {
  const all = [...BUILDING_BANDS, ...excluded];
  const xs = [...new Set(all.flatMap(r => [r.x, r.x + r.w]))].sort((a, b) => a - b);
  const ys = [...new Set(all.flatMap(r => [r.y, r.y + r.h]))].sort((a, b) => a - b);
  const result: Rect[] = [];
  for (let j = 0; j < ys.length - 1; j++) {
    const y = ys[j], h = ys[j + 1] - y;
    let run: Rect | undefined;
    const flush = () => {
      if (!run) return;
      const above = result.find(r => r.x === run!.x && r.w === run!.w && r.y + r.h === y);
      if (above) result[result.indexOf(above)] = { ...above, h: above.h + h };
      else result.push(run);
      run = undefined;
    };
    for (let i = 0; i < xs.length - 1; i++) {
      const x = xs[i], w = xs[i + 1] - x, p = { x: x + w / 2, y: y + h / 2 };
      if (inBuilding(p) && !excluded.some(r => contains(r, p))) run = run ? { ...run, w: run.w + w } : { x, y, w, h };
      else flush();
    }
    flush();
  }
  return result;
}
export const SERVICE_INFILL: readonly Rect[] = complement(ZONES.map(z => z.rect));
// The new eight-metre Security–Theatre passage and existing six-metre doors stay clear.
export const SERVICE_BLOCKS: readonly Rect[] = complement([...ZONES.map(z => z.rect), ...PORTALS.map(portalRect)]);
export const BUILDING_AREA = BUILDING_BANDS.reduce((area, r) => area + r.w * r.h, 0);
export const SERVICE_AREA = SERVICE_INFILL.reduce((area, r) => area + r.w * r.h, 0);
export const PIPE_WALL_AREA = SERVICE_BLOCKS.reduce((area, r) => area + r.w * r.h, 0);
