import { noise } from "./factory-drive";

type Ctx = CanvasRenderingContext2D;
export type CortexCache = Map<number, HTMLCanvasElement>;
const RES = 2, LEFT = -74, TOP = -66, W = 148 * RES, H = 105 * RES;

/** A domed, asymmetric pair of hemispheres, seated low in the carrier. */
export function cortexOutline(c: Ctx) {
  c.beginPath(); c.moveTo(-61,9);
  c.bezierCurveTo(-68,0,-65,-16,-59,-25);
  c.bezierCurveTo(-61,-35,-50,-42,-42,-43);
  c.bezierCurveTo(-39,-52,-27,-55,-18,-54);
  c.bezierCurveTo(-8,-60,0,-55,5,-53);
  c.bezierCurveTo(16,-58,29,-53,35,-48);
  c.bezierCurveTo(46,-48,52,-39,55,-32);
  c.bezierCurveTo(65,-28,66,-17,64,-10);
  c.bezierCurveTo(71,1,65,16,56,20);
  c.bezierCurveTo(51,29,33,31,24,29);
  c.bezierCurveTo(12,35,4,28,-3,28);
  c.bezierCurveTo(-16,32,-29,27,-34,25);
  c.bezierCurveTo(-49,27,-57,19,-61,9); c.closePath();
}

// Artist-shaped sulci: long folded valleys with side branches, not a grid of
// repeated curls. Coordinates describe the visible three-quarter cortical face.
const SULCI = [
  "M 3 -57 C -6 -47 0 -39 0 -33 C 1 -22 13 -20 9 -10 C 4 0 18 8 16 15 C 12 23 22 27 22 34",
  "M -20 -57 C -26 -46 -14 -47 -15 -38 C -16 -30 -30 -33 -31 -23 C -33 -11 -18 -15 -15 -7 C -12 3 -23 6 -18 15 C -15 21 -5 21 -3 30",
  "M -43 -45 C -33 -41 -40 -30 -46 -29 C -57 -27 -57 -19 -49 -15 C -41 -11 -31 -16 -30 -6 C -29 2 -43 4 -40 13 C -38 21 -30 17 -29 29",
  "M -61 -6 C -54 -9 -50 -3 -52 3 C -54 10 -49 14 -43 15",
  "M -57 -35 C -48 -37 -46 -43 -42 -43",
  "M -39 -49 C -33 -48 -29 -43 -31 -39 C -34 -34 -42 -39 -45 -33",
  "M -11 -51 C -9 -44 -5 -43 0 -43",
  "M -16 -38 C -11 -36 -9 -34 -11 -29 C -14 -23 -22 -27 -24 -22 C -25 -15 -17 -16 -14 -13",
  "M -31 -23 C -38 -24 -38 -17 -37 -14",
  "M -48 -15 C -46 -20 -40 -22 -38 -19",
  "M -31 -5 C -34 -5 -38 -2 -38 1",
  "M -16 -7 C -8 -9 -5 -5 -6 0 C -8 7 -13 7 -10 12 C -5 17 6 11 9 19 C 11 24 5 27 4 30",
  "M -6 -21 C 0 -23 4 -19 3 -16 C 0 -11 -9 -15 -10 -9",
  "M -23 7 C -30 8 -30 15 -25 18",
  "M -1 1 C 3 -1 8 1 9 5",
  "M 17 -56 C 10 -47 17 -41 23 -40 C 34 -39 38 -30 31 -24 C 26 -19 17 -24 17 -15 C 17 -5 35 -11 36 0 C 36 11 26 9 28 18 C 29 24 37 25 38 30",
  "M 35 -48 C 27 -46 28 -39 33 -38",
  "M 51 -37 C 39 -40 40 -29 47 -28 C 58 -27 60 -19 54 -14 C 48 -10 41 -17 41 -9 C 41 -2 52 -2 55 5 C 58 15 46 18 46 27",
  "M 6 -42 C 14 -42 13 -33 17 -31 C 21 -28 24 -32 27 -28",
  "M 4 -32 C 10 -34 13 -29 11 -24",
  "M 20 -49 C 23 -47 24 -44 23 -40",
  "M 33 -23 C 40 -26 45 -20 41 -16",
  "M 18 -14 C 25 -17 30 -15 30 -10",
  "M 11 -5 C 15 -8 22 -5 21 0 C 18 5 22 10 27 8",
  "M 55 -14 C 61 -12 65 -15 65 -18",
  "M 55 5 C 62 2 66 7 65 11",
  "M 34 4 C 43 4 45 11 40 14 C 35 17 40 22 45 22",
  "M 51 -1 C 55 -4 60 -2 62 0",
  "M -48 24 C -45 19 -41 20 -39 23",
];

/** Bake relief and material once. Distance to the valleys forms rounded gyri;
 * surface normals, crevice occlusion and broad hemisphere lighting supply volume.
 * The animation only blits the resulting cached sprite. */
export function paintCortex(target: Ctx, seed: number, damaged: boolean, cache: CortexCache) {
  // Four master castings supply twelve assembled specimens. Seeded morphology,
  // hardware and damage still vary, without reshading every matching hemisphere.
  const casting = damaged ? 3 : seed % 3;
  const cached = cache.get(casting);
  if (cached) { target.drawImage(cached, LEFT, TOP, W / RES, H / RES); return; }
  seed = [47, 1885, 4642, 8318][casting];
  const plate = document.createElement("canvas"); plate.width = W; plate.height = H;
  const c = plate.getContext("2d", { willReadFrequently: true })!;
  c.scale(RES, RES); c.translate(-LEFT, -TOP);
  cortexOutline(c); c.fillStyle = "white"; c.fill();
  const mask = c.getImageData(0, 0, W, H).data;
  c.clearRect(LEFT, TOP, W / RES, H / RES);
  c.save(); c.translate((noise(seed + 2) - .5) * 2, 0);
  c.lineCap = "round"; c.lineJoin = "round"; c.lineWidth = .8; c.strokeStyle = "white";
  for (const [i, path] of SULCI.entries()) {
    c.save();
    // Small local distortions retain anatomical flow while varying each casting.
    c.translate((noise(seed + i * 43) - .5) * 1.5, (noise(seed + i * 23) - .5) * 1.4);
    c.stroke(new Path2D(path)); c.restore();
  }
  c.restore();
  const valleys = c.getImageData(0, 0, W, H).data;
  const distance = new Float32Array(W * H);
  for (let i = 0; i < distance.length; i++) distance[i] = valleys[i * 4 + 3] > 30 || mask[i * 4 + 3] < 80 ? 0 : 1000;
  // Two-pass chamfer distance, constant work per pixel independent of fold count.
  const diagonal = Math.SQRT2;
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x;
    distance[i] = Math.min(distance[i], distance[i - 1] + 1, distance[i - W] + 1, distance[i - W - 1] + diagonal, distance[i - W + 1] + diagonal);
  }
  for (let y = H - 2; y > 0; y--) for (let x = W - 2; x > 0; x--) {
    const i = y * W + x;
    distance[i] = Math.min(distance[i], distance[i + 1] + 1, distance[i + W] + 1, distance[i + W + 1] + diagonal, distance[i + W - 1] + diagonal);
  }
  const relief = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, px = LEFT + x / RES, py = TOP + y / RES;
    const d = distance[i] / RES;
    const dome = Math.sqrt(Math.max(.015, 1 - (px / 72) ** 2 - ((py + 12) / 51) ** 2));
    relief[i] = 21 * dome + 5.2 * (1 - Math.exp(-d * d / 11));
  }
  const pixels = c.createImageData(W, H);
  const warmth = (noise(seed + 67) - .5) * 14;
  const tone = damaged ? [137, 132, 88] : [188 + warmth, 132 + warmth * .55, 84 + warmth * .2];
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x, at = i * 4;
    if (!mask[at + 3]) continue;
    const px = LEFT + x / RES, py = TOP + y / RES;
    const dx = (relief[i + 1] - relief[i - 1]) * RES / 2;
    const dy = (relief[i + W] - relief[i - W]) * RES / 2;
    const inverse = 1 / Math.sqrt(dx * dx + dy * dy + 1), nx = -dx * inverse, ny = -dy * inverse, nz = inverse;
    const diffuse = Math.max(0, nx * -.38 + ny * -.64 + nz * .66);
    const specular = Math.pow(Math.max(0, nx * -.23 + ny * -.38 + nz * .895), 19);
    const d = distance[i] / RES, occlusion = .38 + .62 * (1 - Math.exp(-d / 1.45));
    const mottling = (noise(seed + Math.floor(x / 5) * 71 + Math.floor(y / 5) * 991) - .5) * 5;
    const grain = (noise(seed + x * 31 + y * 7919) - .5) * 7;
    const base = (.3 + diffuse * .82) * occlusion;
    const dome = Math.sqrt(Math.max(0, 1 - (px / 73) ** 2 - ((py + 12) / 53) ** 2));
    const underside = (.56 + .44 * dome) * (1 - px * .0014)
      * (.76 + .24 * Math.min(1, Math.max(0, (31 - py) / 34)));
    const rim = Math.pow(Math.max(0, nx * .82 + ny * -.15 + nz * .2), 4) * 22;
    const wet = specular * 30 * occlusion;
    pixels.data[at] = (tone[0] * base + wet + mottling + grain) * underside;
    pixels.data[at + 1] = (tone[1] * base + wet * .94 + mottling + grain + rim * .62) * underside;
    pixels.data[at + 2] = (tone[2] * base + wet * .72 + mottling * .65 + grain + rim) * underside;
    pixels.data[at + 3] = mask[at + 3];
  }
  c.putImageData(pixels, 0, 0);
  target.drawImage(plate, LEFT, TOP, W / RES, H / RES);
  cache.set(casting, plate);
}
