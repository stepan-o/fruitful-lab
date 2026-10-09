import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import type { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import type { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { Scene } from "@babylonjs/core/scene";
import { accessible, FLOOR_SIZE, floorTile, INITIAL_UNLOCKED, openingBetween, PORTALS, portalOpen, portalRect, worldPoint, zone, zoneAt, ZONES, type ZoneId } from "@/lib/loopforge/spatial/floor";

type V = [number, number, number];
type Mat = PBRMaterial | StandardMaterial;
type Tools = {
  box(name: string, size: V, pos: V, mat: Mat, parent?: TransformNode, cast?: boolean): Mesh;
  pipe(name: string, points: V[], radius: number, mat: Mat, parent?: TransformNode): Mesh;
  cylinder(name: string, radius: number, height: number, pos: V, mat: Mat, parent?: TransformNode, tessellation?: number): Mesh;
  iron: Mat; dark: Mat; brass: Mat; copper: Mat; green: Mat; floorMat: Mat; amber: Mat; quiet: Mat;
};

/** The authored floor is data. This is only its replaceable procedural presentation. */
export function buildFloor(scene: Scene, t: Tools) {
  const { box, pipe, cylinder, iron, dark, brass, copper, green, floorMat, amber, quiet } = t;
  function at(x: number, y: number, height = 0): V { const p = worldPoint(x, y); p[1] = height; return p; }
  function stencil(title: string, subtitle: string, x: number, y: number, width: number, height: number, elevation: number, dim = false) {
    const texture = new DynamicTexture(title + " enamel stencil", { width: 1024, height: 384 }, scene, true);
    const c = texture.getContext() as CanvasRenderingContext2D;
    c.clearRect(0, 0, 1024, 384); c.textAlign = "center";
    c.fillStyle = dim ? "#9a957f" : "#bfba89"; c.font = "bold 88px Georgia";
    c.fillText(title, 512, 175, 940); c.font = "30px monospace"; c.fillStyle = dim ? "#646f64" : "#8aab9a"; c.fillText(subtitle, 512, 263, 920);
    // Sparse chipped paint, fixed at creation rather than noisy frame-to-frame.
    c.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 160; i++) c.fillRect((i * 97) % 1024, (i * 71) % 384, 3 + i % 7, 1);
    texture.hasAlpha = true; texture.update();
    const m = new StandardMaterial(title + " paint", scene); m.diffuseTexture = texture; m.useAlphaFromDiffuseTexture = true;
    m.emissiveColor = new Color3(dim ? .24 : .34, dim ? .25 : .34, dim ? .2 : .25); m.specularColor = Color3.Black(); m.backFaceCulling = false;
    const mesh = MeshBuilder.CreatePlane(title, { width, height }, scene); mesh.position.copyFromFloats(...at(x, y, elevation)); mesh.rotation.x = Math.PI / 2; mesh.material = m; mesh.isPickable = false;
    return mesh;
  }
  // Each room keeps its own foundation, so voids and the short bridges remain legible.
  for (const z of ZONES) {
    const r = z.rect, open = accessible(z.id, INITIAL_UNLOCKED), x = r.x + r.w / 2, y = r.y + r.h / 2;
    box(z.id + " foundation", [r.w, .48, r.h], at(x, y, -.32), dark);
    if (open) {
      for (let tx = r.x; tx < r.x + r.w; tx++) for (let ty = r.y; ty < r.y + r.h; ty++) {
        box("floor tile", [.978, .07, .978], at(tx + .5, ty + .5, -.025), floorMat);
        if ((tx + ty) % 5 === 0) box("drain recess", [.55, .012, .06], at(tx + .5, ty + .5, .016), dark);
      }
      if (z.id !== "security") stencil(z.short.toUpperCase(), z.kind === "support" ? "LOOPFORGE / " + z.short.toUpperCase() : z.number + " / PRODUCTION FLOOR", x, r.y + .7, Math.min(r.w - .6, 6), .95, .027);
    } else {
      const covers: Mesh[] = [box("sealed " + z.id, [r.w - .12, 1.25, r.h - .12], at(x, y, .6), dark)];
      for (let tx = r.x + .2; tx < r.x + r.w - .2; tx += 2) {
        const w = Math.min(1.94, r.x + r.w - .2 - tx);
        covers.push(box("unpowered ceiling panel", [w, .09, r.h - .4], at(tx + w / 2, y, 1.26), iron));
        covers.push(box("ceiling seam", [.035, .04, r.h - .45], at(tx, y, 1.32), brass));
      }
      covers.push(stencil(z.short.toUpperCase(), z.number + " / SEALED", x, y, r.w - .8, 1.65, 1.33, true));
    }
  }
  // Service bridges use the same portal rectangles as pathfinding.
  for (const p of PORTALS) {
    const r = portalRect(p);
    for (let x = r.x; x < r.x + r.w; x++) for (let y = r.y; y < r.y + r.h; y++) if (!zoneAt({ x, y })) {
      box("service bridge", [.98, .25, .98], at(x + .5, y + .5, -.15), iron);
    }
  }
  // Border walls are derived from tiles and portal openings. No painted fake doors.
  for (let x = 0; x < FLOOR_SIZE.width; x++) for (let y = 0; y < FLOOR_SIZE.height; y++) {
    const cell = { x, y }; if (!floorTile(cell)) continue;
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const n = { x: x + dx, y: y + dy }, neighbour = floorTile(n);
      if (neighbour && (dx < 0 || dy < 0)) continue;
      const a = zoneAt(cell), b = zoneAt(n);
      if (neighbour && ((a && b && a.id === b.id) || openingBetween(cell, n))) continue;
      const northExterior = !neighbour && dy < 0, h = northExterior ? 2.6 : .55;
      const px = x + .5 + dx * .5, py = y + .5 + dy * .5;
      box("boundary wall", dx ? [.18, h, 1] : [1, h, .18], at(px, py, h / 2), iron);
      box("wall coping", dx ? [.24, .065, 1] : [1, .065, .24], at(px, py, h + .025), brass);
      if (northExterior) {
        box("wall rib", [.08, h, .12], at(px - .45, py + .13, h / 2), brass);
        if (x % 3 === 0) pipe("wall feed", [at(px, py + .2, .2), at(px, py + .2, 2.1), at(px + .5, py + .2, 2.1)], .055, copper);
      }
    }
  }
  for (const p of PORTALS) {
    const horizontal = p.start.x !== p.end.x, open = portalOpen(p, INITIAL_UNLOCKED);
    // First boundary crossed, centred on the actual two-tile opening.
    const x = horizontal ? p.start.x + 1 : p.start.x + p.width / 2;
    const y = horizontal ? p.start.y + p.width / 2 : p.start.y + 1;
    for (const side of [-1, 1]) {
      box("threshold upright", [.16, 2.55, .16], at(x + (horizontal ? 0 : side * p.width / 2), y + (horizontal ? side * p.width / 2 : 0), 1.275), brass);
    }
    box("threshold lintel", horizontal ? [.3, .2, p.width + .25] : [p.width + .25, .2, .3], at(x, y, 2.6), green);
    box("threshold signal", horizontal ? [.06, .065, .5] : [.5, .065, .06], at(x - (horizontal ? .17 : 0), y + (horizontal ? 0 : .17), 2.63), open ? amber : quiet);
    for (let i = 0; !open && i < 8; i++) {
      const mesh = box("sealed door " + p.id, horizontal ? [.09, .28, p.width - .1] : [p.width - .1, .28, .09], at(x, y, .18 + i * .3), dark);
      mesh.setEnabled(!open);
    }
    // Painted threshold marks survive the cutaway and describe the route at floor level.
    for (let i = 0; i < p.width * 4; i++) box("threshold paint", horizontal ? [.32, .009, .1] : [.1, .009, .32], at(x + (horizontal ? 0 : -.86 + i * .24), y + (horizontal ? -.86 + i * .24 : 0), .025), brass);
  }
  // Lobby, paperwork and loading infrastructure remain support spaces, not extra managed rooms.
  stencil("LOOPFORGE", "AI BRAIN FACTORY", 5.5, 13, 6.2, 2, .034);
  for (const x of [2, 3.2, 4.4, 5.6, 6.8]) {
    box("charging bench", [.88, .15, .65], at(x, 15.1, .5), green);
    box("bench plinth", [.6, .45, .45], at(x, 15.1, .225), dark);
  }
  box("reception counter", [2.6, 1.1, 1], at(3.1, 11.3, .55), green);
  box("reception brass lip", [2.75, .08, 1.1], at(3.1, 11.3, 1.14), brass);
  box("dispatch desk", [1.6, .95, 1.1], at(11.5, 11.5, .475), green);
  for (let i = 0; i < 4; i++) box("dispatch pigeonhole", [.38, .17, .38], at(11 + (i % 2) * .5, 11.4, 1.04 + Math.floor(i / 2) * .2), brass);
  for (const x of [31, 32.6, 34]) {
    box("shipping pallet", [1.1, .16, 2.1], at(x, 23.3, .08), iron);
    for (let i = 0; i < 4; i++) box("pallet slat", [.15, .06, 2], at(x - .4 + i * .26, 23.3, .19), brass);
  }
  for (const [x, y] of [[2, 10.5], [12.7, 11], [17.4, 10.8], [10.6, 16.6]]) {
    cylinder("local lamp post", .055, 2.5, at(x, y, 1.25), copper);
    box("caged workshop lamp", [.4, .12, .25], at(x, y, 2.5), amber);
  }
  return { center(id: ZoneId) { const r = zone(id).rect; return new Vector3(...at(r.x + r.w / 2, r.y + r.h / 2, .5)); } };
}
