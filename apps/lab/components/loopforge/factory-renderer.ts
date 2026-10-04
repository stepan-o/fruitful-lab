import * as T from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { cargoFor, noise, type Drive } from "./factory-drive";
import { neuralDischarge, neuralPulse } from "./factory-neural";

const TAU = Math.PI * 2;
type Material = T.MeshStandardMaterial;

/** One procedural GPU stage: real surface normals, one rotating shadow-casting light. */
export type FactoryRenderer = {
  resize: (w: number, h: number) => void;
  draw: (drive: Drive, still?: boolean) => void;
  dispose: () => void;
  prepare?: () => Promise<void>;
};
export function createFactoryRenderer(
  canvas: HTMLCanvasElement,
): FactoryRenderer | null {
  const context = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  if (!context) return null;
  const renderer = new T.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  const scene = new T.Scene();
  scene.fog = new T.FogExp2(0x020605, 0.00022);
  const room = new RoomEnvironment(),
    environmentGenerator = new T.PMREMGenerator(renderer);
  const environment = environmentGenerator.fromScene(room, 0.04);
  room.dispose();
  environmentGenerator.dispose();
  const camera = new T.OrthographicCamera(-600, 600, 340, -340, 0.1, 2400);
  const geometries = new Set<T.BufferGeometry>(),
    materials = new Set<T.Material>(),
    textures = new Set<T.Texture>();
  const instances = new Set<T.InstancedMesh>();
  const keep = <G extends T.BufferGeometry>(g: G) => {
    geometries.add(g);
    return g;
  };
  const material = (color: number, metalness = 0.6, roughness = 0.45) => {
    const m = new T.MeshStandardMaterial({
      color,
      metalness,
      roughness,
      envMap: environment.texture,
      envMapIntensity: 0.35,
    });
    materials.add(m);
    return m;
  };
  const steel = material(0x394d3e, 0.55, 0.4),
    edge = material(0xa39264, 0.7, 0.32),
    dark = material(0x071610, 0.7, 0.53),
    rubber = material(0x080e0d, 0.15, 0.8);
  const tissue = material(0x97704f, 0.05, 0.42),
    sick = material(0x586854, 0.08, 0.66),
    bone = material(0xaca17c, 0.04, 0.6);
  tissue.envMapIntensity = 0.18;
  sick.envMapIntensity = 0.15;
  bone.envMapIntensity = 0.2;
  tissue.vertexColors = true;
  tissue.emissive.set(0x482614);
  tissue.emissiveIntensity = 0.12;
  const cyan = material(0x034644, 0.15, 0.3);
  cyan.emissive.set(0x00dbf6);
  cyan.toneMapped = false;
  cyan.envMapIntensity = 0.05;
  cyan.emissiveIntensity = 0.95;
  const glass = material(0x458e80, 0.14, 0.18);
  glass.transparent = true;
  glass.opacity = 0.15;
  glass.depthWrite = false;
  const bronze = material(0x775334, 0.8, 0.31);
  for (const m of [steel, edge, bronze])
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vMetalPoint;",
        )
        .replace(
          "#include <worldpos_vertex>",
          "#include <worldpos_vertex>\nvMetalPoint=(modelMatrix*vec4(transformed,1.)).xyz;",
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vMetalPoint;\nfloat grit(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,45.164)))*43758.5453);}",
        )
        .replace(
          "#include <color_fragment>",
          "#include <color_fragment>\nfloat wear=grit(floor(vMetalPoint*1.8));float bands=sin(vMetalPoint.y*2.4+sin(vMetalPoint.x*.02));diffuseColor.rgb*=.8+wear*.24+bands*.06;",
        );
    };

  const unitBox = keep(new RoundedBoxGeometry(1, 1, 1, 2, 0.035)),
    unitCylinder = keep(new T.CylinderGeometry(1, 1, 1, 20));
  const dummy = new T.Object3D();
  function mesh(
    g: T.BufferGeometry,
    m: T.Material,
    parent: T.Object3D = scene,
    cast = true,
  ) {
    const o = new T.Mesh(g, m);
    o.castShadow = cast;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  }
  function box(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    m: Material,
    parent: T.Object3D = scene,
  ) {
    const o = mesh(unitBox, m, parent);
    o.position.set(x, y, z);
    o.scale.set(w, h, d);
    return o;
  }
  function cylinder(
    x: number,
    y: number,
    z: number,
    r: number,
    h: number,
    m: Material,
    parent: T.Object3D = scene,
  ) {
    const o = mesh(unitCylinder, m, parent);
    o.position.set(x, y, z);
    o.scale.set(r, h, r);
    return o;
  }
  function combined(parts: T.BufferGeometry[]) {
    const g = keep(mergeGeometries(parts)!);
    parts.forEach((p) => p.dispose());
    return g;
  }
  function tube(points: T.Vector3[], radius: number, segments = 64) {
    return new T.TubeGeometry(
      new T.CatmullRomCurve3(points),
      segments,
      radius,
      5,
      false,
    );
  }
  function bolts(parent: T.Object3D, positions: T.Vector3[], radius = 2.5) {
    const g = unitCylinder;
    const bolts = new T.InstancedMesh(g, edge, positions.length);
    instances.add(bolts);
    positions.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.scale.set(radius, 2, radius);
      dummy.updateMatrix();
      bolts.setMatrixAt(i, dummy.matrix);
    });
    parent.add(bolts);
    return bolts;
  }
  function stampTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const q = c.getContext("2d")!;
    const g = q.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "#fffef0");
    g.addColorStop(0.055, "#fffbd3");
    g.addColorStop(0.16, "#ffffff70");
    g.addColorStop(0.43, "#ffffff16");
    g.addColorStop(1, "#ffffff00");
    q.fillStyle = g;
    q.fillRect(0, 0, 128, 128);
    const t = new T.CanvasTexture(c);
    textures.add(t);
    return t;
  }
  // Bake stationary pieces into one draw per material; moving bodies remain separate.
  function bake(parent: T.Object3D) {
    const batches = new Map<T.Material, T.Mesh[]>(),
      baked: T.BufferGeometry[] = [];
    for (const child of [...parent.children])
      if (
        child instanceof T.Mesh &&
        !(child instanceof T.InstancedMesh) &&
        !Array.isArray(child.material)
      ) {
        const group = batches.get(child.material) ?? [];
        group.push(child);
        batches.set(child.material, group);
      }
    for (const [mat, parts] of batches) {
      if (parts.length < 2) continue;
      const transformed = parts.map((p) => {
        p.updateMatrix();
        return (
          p.geometry.index ? p.geometry.toNonIndexed() : p.geometry.clone()
        ).applyMatrix4(p.matrix);
      });
      const geometry = combined(transformed);
      baked.push(geometry);
      parts.forEach((p) => parent.remove(p));
      mesh(
        geometry,
        mat,
        parent,
        parts.some((p) => p.castShadow),
      );
    }
    return baked;
  }
  const glowMap = stampTexture();
  function glow(color: number, size: number, parent: T.Object3D = scene) {
    const m = new T.SpriteMaterial({
      map: glowMap,
      color,
      transparent: true,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    materials.add(m);
    const s = new T.Sprite(m);
    s.scale.set(size, size, 1);
    parent.add(s);
    return s;
  }

  // A granular surface map is generated once. Real geometry supplies the large folds.
  const grain = document.createElement("canvas");
  grain.width = grain.height = 128;
  const gc = grain.getContext("2d")!,
    pixels = gc.createImageData(128, 128);
  for (let i = 0; i < 128 * 128; i++) {
    const v = 110 + noise(i * 37) * 70;
    pixels.data.set([v, v, v, 255], i * 4);
  }
  gc.putImageData(pixels, 0, 0);
  const grainMap = new T.CanvasTexture(grain);
  grainMap.wrapS = grainMap.wrapT = T.RepeatWrapping;
  grainMap.repeat.set(5, 5);
  textures.add(grainMap);
  tissue.bumpMap = grainMap;
  tissue.bumpScale = 0.4;
  steel.bumpMap = grainMap;
  steel.bumpScale = 0.12;

  function hemisphere(side: number, seed: number) {
    const g = new T.SphereGeometry(1, 72, 52),
      p = g.attributes.position;
    const colors = new Float32Array(p.count * 3),
      color = new T.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i);
      const wave =
        Math.sin(x * 11 + Math.sin(z * 7) * 1.6 + Math.sin(y * 6)) +
        0.38 * Math.sin(z * 13 + Math.sin(y * 8) * 1.6 + seed * 0.003);
      const fold = Math.pow(Math.min(1, Math.abs(wave)), 0.4),
        detail = Math.sin(y * 35 + z * 13) * Math.sin(x * 27 - z * 11) * 0.23;
      const r = 0.84 + fold * 0.16 + detail * 0.008;
      p.setXYZ(i, side * (19 + x * 24 * r), 25 + y * 30 * r, z * 36 * r);
      color.setRGB(0.65 + fold * 0.35, 0.58 + fold * 0.42, 0.52 + fold * 0.48);
      color.toArray(colors, i * 3);
    }
    g.setAttribute("color", new T.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }
  const cortexGeometry = combined([hemisphere(-1, 47), hemisphere(1, 47)]);
  const damagedGeometry = combined([hemisphere(-1, 937), hemisphere(1, 937)]);
  function specimen(slot: number) {
    const q = cargoFor(slot),
      group = new T.Group(),
      body = new T.Group();
    group.add(body);
    const bad = q.kind === "cracked" || q.kind === "rejected";
    // Carriers have a black ceramic seat, cast corners and threaded brass retainers.
    box(0, 0, 0, 108, 7, 93, dark, group);
    box(0, 4, 0, 99, 5, 84, steel, group);
    box(0, 8, 0, 87, 3, 73, rubber, group);
    for (const x of [-47, 47]) {
      box(x, 13, 0, 6, 14, 83, bronze, group);
      box(x, 22, 20, 6, 8, 16, edge, group);
      box(x, 22, -20, 6, 8, 16, edge, group);
    }
    bolts(
      group,
      [-39, 39].flatMap((x) => [
        new T.Vector3(x, 2, 48),
        new T.Vector3(x, 15, 44),
      ]),
      2,
    );
    body.position.y = 12;
    body.rotation.y = (noise(q.seed) - 0.5) * 0.35;
    if (q.kind === "skull") {
      const head = mesh(keep(new T.SphereGeometry(1, 32, 24)), bone, body);
      head.scale.set(28, 32, 23);
      head.position.set(0, 27, -4);
      const face = new T.Shape();
      face.moveTo(-23, 10);
      face.bezierCurveTo(-35, 30, -29, 57, -9, 61);
      face.bezierCurveTo(16, 70, 35, 50, 29, 26);
      face.lineTo(22, 13);
      face.lineTo(13, 10);
      face.lineTo(14, 0);
      face.lineTo(-14, 0);
      face.lineTo(-14, 10);
      face.closePath();
      for (const side of [-1, 1]) {
        const socket = new T.Path();
        socket.absellipse(side * 12, 30, 9, 10, 0, TAU, true);
        face.holes.push(socket);
      }
      const nose = new T.Path();
      nose.moveTo(0, 24);
      nose.lineTo(5, 12);
      nose.lineTo(-4, 12);
      nose.closePath();
      face.holes.push(nose);
      const mask = mesh(
        keep(
          new T.ExtrudeGeometry(face, {
            depth: 3,
            bevelEnabled: true,
            bevelSize: 2,
            bevelThickness: 2,
            bevelSegments: 3,
            curveSegments: 24,
          }),
        ),
        bone,
        body,
      );
      mask.position.z = 23;
      for (const x of [-12, 12]) {
        const eye = mesh(keep(new T.SphereGeometry(1, 16, 12)), dark, body);
        eye.position.set(x, 30, 20);
        eye.scale.set(9, 10, 3);
      }
      for (let i = 0; i < 7; i++)
        box(-12 + i * 4, 0, 28, 2.8, 6 + Math.sin(i) * 2, 4, bone, body);
    } else if (q.kind === "twin") {
      for (const x of [-21, 21]) {
        const b = mesh(cortexGeometry, tissue, body);
        b.scale.setScalar(0.58);
        b.position.set(x, 2, 0);
      }
    } else {
      const b = mesh(
        bad ? damagedGeometry : cortexGeometry,
        bad ? sick : tissue,
        body,
      );
      if (q.kind === "rejected") {
        b.scale.set(1.08, 0.68, 1);
        b.rotation.z = 0.18;
      }
      if (q.kind === "augmented") {
        const plate = mesh(
          keep(new T.SphereGeometry(29, 24, 16, 0, 1.7, 0, 1.6)),
          steel,
          body,
        );
        plate.position.set(10, 21, 0);
        plate.rotation.z = -0.3;
      }
      if (q.kind === "cracked") {
        const split = box(8, 30, 34, 4, 35, 4, dark, body);
        split.rotation.z = -0.25;
      }
    }
    // Two routed harnesses, each with a pair of helically interwoven filaments.
    const wires: T.BufferGeometry[] = [],
      jackets: T.BufferGeometry[] = [],
      curves: T.CatmullRomCurve3[] = [];
    for (const side of [-1, 1]) {
      const pts = [
        [-32, 0, 24],
        [-35, 14, 26],
        [-31, 36, 18],
        [-17, 48, 9],
        [-7, 40, 29],
        [-10, 19, 37],
      ].map(([x, y, z]) => new T.Vector3(x * side, y, z));
      if (q.kind === "skull")
        pts.forEach((p) => {
          p.x *= 1.15;
          p.z -= 18;
        });
      if (bad) {
        pts[5].x += side * 10;
        pts[5].y += 14;
      }
      const curve = new T.CatmullRomCurve3(pts);
      curves.push(curve);
      jackets.push(new T.TubeGeometry(curve, 64, 1.3, 6, false));
      for (let strand = 0; strand < 2; strand++) {
        const helix = Array.from({ length: 121 }, (_, i) => {
          const u = i / 120,
            p = curve.getPoint(u),
            t = curve.getTangent(u),
            n = new T.Vector3(t.y, -t.x, 0).normalize();
          const a = u * TAU * 14 + strand * Math.PI;
          p.addScaledVector(n, Math.cos(a) * 1.25);
          p.z += Math.sin(a) * 1.25;
          return p;
        });
        wires.push(tube(helix, 0.5, 120));
      }
      for (const p of [pts[0], pts[5]]) {
        const ferrule = cylinder(p.x, p.y, p.z, 2.3, 4.2, bronze, body);
        ferrule.rotation.x = Math.PI / 2;
      }
    }
    mesh(combined(jackets), dark, body);
    const neuralMat = cyan.clone();
    materials.add(neuralMat);
    mesh(combined(wires), neuralMat, body, false);
    const packets = curves.map(() => {
      const p = glow(0x79ffee, 8, body);
      p.material.opacity = 0.65;
      return p;
    });
    if (q.kind === "glass") {
      const bell = mesh(
        keep(new T.SphereGeometry(53, 28, 18, 0, TAU, 0, Math.PI / 2)),
        glass,
        group,
        false,
      );
      bell.position.y = 12;
      bell.scale.set(1, 1.15, 0.85);
      const ring = mesh(keep(new T.TorusGeometry(51, 1.3, 6, 48)), edge, group);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 12;
      ring.scale.y = 0.84;
    }
    if (q.kind === "halo") {
      const ring = mesh(keep(new T.TorusGeometry(22, 0.7, 5, 48)), edge, body);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 75;
    }
    if (q.kind === "sprout") {
      const stem = tube(
        [
          new T.Vector3(0, 49, 0),
          new T.Vector3(3, 62, 0),
          new T.Vector3(0, 69, 0),
        ],
        0.65,
        12,
      );
      mesh(keep(stem), sick, body);
      for (const side of [-1, 1]) {
        const leaf = mesh(keep(new T.SphereGeometry(1, 10, 8)), sick, body);
        leaf.scale.set(8, 2, 3);
        leaf.position.set(side * 6, 65 + side * 3, 0);
        leaf.rotation.z = side * 0.5;
      }
    }
    bake(group);
    bake(body);
    group.scale.setScalar(q.scale);
    scene.add(group);
    return { group, body, neuralMat, curves, packets, seed: q.seed, bad };
  }
  const cargo = Array.from({ length: 12 }, (_, i) => specimen(i));
  const belt = new T.InstancedMesh(
    keep(new T.BoxGeometry(18, 7, 112)),
    steel,
    130,
  );
  belt.castShadow = true;
  belt.receiveShadow = true;
  scene.add(belt);
  const wheelGeometry = keep(new T.CylinderGeometry(20, 20, 12, 24)),
    wheels = new T.InstancedMesh(wheelGeometry, bronze, 32);
  wheels.castShadow = true;
  wheels.receiveShadow = true;
  scene.add(wheels);
  const hubs = new T.InstancedMesh(
    keep(new T.CylinderGeometry(8, 8, 14, 12)),
    dark,
    32,
  );
  scene.add(hubs);
  [belt, wheels, hubs].forEach((m) => instances.add(m));
  const frame = new T.Group();
  scene.add(frame);
  const wallMaterial = material(0x060a08, 0.3, 0.8),
    wall = mesh(
      keep(new T.PlaneGeometry(3000, 1400)),
      wallMaterial,
      scene,
      false,
    );
  wall.position.set(0, 500, -190);
  wallMaterial.envMapIntensity = 0;
  const floor = mesh(
    keep(new T.PlaneGeometry(3000, 700)),
    material(0x172018, 0.66, 0.32),
    scene,
    false,
  );
  (floor.material as Material).envMapIntensity = 0.08;
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -8;
  const pipeMetal = material(0x122019, 0.8, 0.55);
  pipeMetal.envMapIntensity = 0.15;
  const backdrop = new T.Group();
  scene.add(backdrop);
  for (const side of [-1, 1])
    for (let i = 0; i < 4; i++) {
      cylinder(
        side * (380 + i * 75),
        300,
        -140,
        5 + i,
        700,
        pipeMetal,
        backdrop,
      );
      for (let j = 0; j < 5; j++)
        cylinder(
          side * (380 + i * 75),
          j * 155,
          -140,
          8 + i,
          9,
          bronze,
          backdrop,
        );
    }
  bake(backdrop);
  // Permanent housing. Only the reflector inside rotates about the upright shaft.
  const lamp = new T.Group();
  lamp.position.set(0, 0, 115);
  scene.add(lamp);
  cylinder(0, 13, 0, 25, 8, steel, lamp);
  cylinder(0, 18, 0, 20, 4, edge, lamp);
  const beaconGlass = glass.clone();
  materials.add(beaconGlass);
  beaconGlass.opacity = 0.3;
  beaconGlass.envMapIntensity = 0;
  beaconGlass.toneMapped = false;
  cylinder(0, 38, 0, 16, 36, beaconGlass, lamp);
  cylinder(0, 57, 0, 17, 3, bronze, lamp);
  const cap = mesh(
    keep(new T.SphereGeometry(16, 24, 12, 0, TAU, 0, Math.PI / 2)),
    beaconGlass,
    lamp,
    false,
  );
  cap.position.y = 56;
  cap.scale.y = 0.38;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU;
    cylinder(
      Math.sin(a) * 16.2,
      38,
      Math.cos(a) * 16.2,
      0.32,
      34,
      beaconGlass,
      lamp,
    );
  }
  cylinder(0, 35, 0, 2.3, 34, edge, lamp);
  bake(lamp);
  const rotor = new T.Group();
  rotor.position.y = 38;
  lamp.add(rotor);
  const reflector = mesh(
    keep(new T.SphereGeometry(12, 24, 12, 0, Math.PI)),
    edge,
    rotor,
    false,
  );
  reflector.rotation.y = Math.PI / 2;
  reflector.scale.y = 1.15;
  const filamentMat = material(0xffd58a, 0.1, 0.15);
  filamentMat.toneMapped = false;
  filamentMat.envMapIntensity = 0;
  filamentMat.emissive.set(0xffd28a);
  filamentMat.emissiveIntensity = 4;
  const filament = mesh(
    keep(new T.SphereGeometry(3, 12, 10)),
    filamentMat,
    rotor,
    false,
  );
  filament.position.z = 8;
  filament.scale.y = 2.8;
  const lampGlow = glow(0xffa333, 135, lamp);
  lampGlow.position.y = 38;
  const flare = glow(0xffa333, 1000, lamp);
  flare.position.y = 38;
  flare.material.depthTest = false;
  flare.scale.y = 4;
  const point = new T.PointLight(0xff9837, 900, 200, 2);
  point.position.set(0, 40, 125);
  scene.add(point);
  const spot = new T.SpotLight(0xffa94d, 220000, 0, 0.85, 1, 2);
  spot.position.set(0, 40, 122);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0001;
  spot.shadow.normalBias = 0.8;
  spot.shadow.camera.near = 3;
  spot.shadow.camera.far = 1500;
  scene.add(spot, spot.target);
  scene.add(new T.HemisphereLight(0xa8ccbf, 0x241c12, 1.8));
  const key = new T.DirectionalLight(0xffdaa5, 3.5);
  key.position.set(-240, 500, 250);
  scene.add(key);
  const rim = new T.DirectionalLight(0x59bbae, 1.8);
  rim.position.set(250, 240, -250);
  scene.add(rim);
  const volumeMat = new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
    side: T.DoubleSide,
    uniforms: {
      tint: { value: new T.Color(0xff9c42) },
      power: { value: 0.035 },
    },
    vertexShader: `varying vec2 vUv;varying vec3 vN;varying vec3 vP;void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vP=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.);}`,
    fragmentShader: `varying vec2 vUv;varying vec3 vN;varying vec3 vP;uniform vec3 tint;uniform float power;void main(){float rim=pow(abs(dot(normalize(vN),normalize(cameraPosition-vP))),1.7);float fade=pow(vUv.y,1.15)*(1.-smoothstep(.82,1.,vUv.y));gl_FragColor=vec4(tint,rim*fade*power);}`,
  });
  materials.add(volumeMat);
  const cone = mesh(
    keep(
      new T.CylinderGeometry(0, 700, 1200, 48, 1, true).translate(0, -600, 0),
    ),
    volumeMat,
    scene,
    false,
  );
  cone.position.copy(spot.position);
  cone.renderOrder = 3;
  const down = new T.Vector3(0, -1, 0),
    direction = new T.Vector3();
  // One finite neural discharge, attached to its specimen until the fade completes.
  const arcsGeometry = keep(new T.BufferGeometry()),
    arcPositions = new Float32Array(3 * 12 * 3);
  arcsGeometry.setAttribute("position", new T.BufferAttribute(arcPositions, 3));
  const arcMaterial = new T.LineBasicMaterial({
    color: 0xaaffec,
    transparent: true,
    blending: T.AdditiveBlending,
  });
  materials.add(arcMaterial);
  const arcs = new T.LineSegments(arcsGeometry, arcMaterial);
  scene.add(arcs);
  const arcGlow = glow(0x34ffdf, 75);
  let width = 1200,
    height = 680,
    cssW = 1200,
    cssH = 680,
    frames = 0,
    total = 0,
    max = 0,
    burstCycle = -1,
    burstSlot = 0;
  const positions: T.Vector3[] = [],
    projected = new T.Vector3();
  let frameGeometry: T.BufferGeometry[] = [];
  function rebuildFrame() {
    for (const child of frame.children)
      if (child instanceof T.InstancedMesh) {
        child.dispose();
        instances.delete(child);
      }
    frame.clear();
    frameGeometry.forEach((g) => {
      g.dispose();
      geometries.delete(g);
    });
    const w = width + 250;
    box(0, 107, 60, w, 27, 9, steel, frame);
    box(0, 126, 61, w, 3, 6, edge, frame);
    box(0, 107, -60, w, 27, 9, steel, frame);
    box(0, 88, 62, w, 3, 5, edge, frame);
    box(0, 64, -15, w, 6, 74, dark, frame);
    for (let x = -w / 2; x < w / 2; x += 148) {
      box(x, 108, 66, 82, 14, 3, dark, frame);
      box(x, 108, 68, 71, 1, 1, bronze, frame);
      box(x + 60, 108, 67, 10, 18, 3, bronze, frame);
      for (let n = 0; n < 5; n++)
        box(x - 28 + n * 14, 108, 68, 1, 10, 1, edge, frame);
      const brace = box(x + 28, 42, -18, 5, 94, 9, steel, frame);
      brace.rotation.z = -0.65;
      if (Math.abs(x) > 45) {
        box(x, 35, 2, 13, 100, 30, steel, frame);
        box(x, -4, 8, 52, 5, 61, bronze, frame);
      }
    }
    positions.length = 0;
    for (let x = -w / 2; x < w / 2; x += 74)
      positions.push(new T.Vector3(x, 117, 67), new T.Vector3(x, 96, 67));
    bolts(frame, positions, 2);
    frameGeometry = bake(frame);
  }
  function resize(w: number, h: number) {
    cssW = w;
    cssH = h;
    height = 680;
    width = (height * w) / h;
    const ratio = Math.min(1.5, 1800 / w, 1100 / h);
    renderer.setSize(Math.round(w * ratio), Math.round(h * ratio), false);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.position.set(0, height / 2 + 370, 1000);
    camera.lookAt(0, height / 2 - 30, 0);
    camera.updateProjectionMatrix();
    backdrop.scale.x = Math.max(0.5, width / 1200);
    flare.scale.x = width * 2;
    rebuildFrame();
  }
  function draw(d: Drive, still = false) {
    const started = performance.now(),
      jam = d.status === "jammed",
      phase = d.time * 0.78;
    const red = jam
      ? 1
      : d.status === "restarting"
        ? Math.max(0, 1 - d.stateAge)
        : 0;
    const tint = new T.Color(0xffa13a).lerp(new T.Color(0xff0000), red);
    rotor.rotation.y = phase;
    direction.set(Math.sin(phase), 0.34, Math.cos(phase)).normalize();
    spot.target.position.copy(spot.position).addScaledVector(direction, 700);
    cone.quaternion.setFromUnitVectors(down, direction);
    beaconGlass.color.copy(tint);
    beaconGlass.emissive.copy(tint);
    beaconGlass.emissiveIntensity = 0.25 + red * 0.6;
    spot.color.copy(tint);
    spot.intensity = 1200000 + red * 14000000;
    point.color.copy(tint);
    point.intensity = 6000 + red * 24000;
    volumeMat.uniforms.tint.value.copy(tint);
    volumeMat.uniforms.power.value = 0.035 + red * 0.16;
    lampGlow.material.color.copy(tint);
    lampGlow.material.opacity = 0.32 + red * 0.45;
    flare.material.color.copy(tint);
    flare.material.opacity =
      (0.1 + red * 0.7) * Math.pow(Math.max(0, Math.cos(phase)), 22);
    filamentMat.color.copy(tint);
    filamentMat.emissive.copy(tint);
    filamentMat.emissiveIntensity = 3 + red * 4;
    const tension =
      jam && !still
        ? Math.pow(Math.max(0, Math.sin(d.stateAge * 2.6)), 18) *
          Math.sin(d.stateAge * 45)
        : 0;
    const slats = Math.min(130, Math.ceil((width + 200) / 21));
    belt.count = slats;
    for (let i = 0; i < slats; i++) {
      dummy.position.set(-width / 2 - 100 + i * 21 + (d.distance % 21), 130, 0);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      belt.setMatrixAt(i, dummy.matrix);
    }
    belt.instanceMatrix.needsUpdate = true;
    const nWheels = Math.min(32, Math.ceil((width + 180) / 68));
    wheels.count = hubs.count = nWheels;
    for (let i = 0; i < nWheels; i++) {
      dummy.position.set(-width / 2 - 70 + i * 68, 87, 57);
      dummy.rotation.set(Math.PI / 2, d.distance / 20 + tension * 0.11, 0);
      dummy.updateMatrix();
      wheels.setMatrixAt(i, dummy.matrix);
      hubs.setMatrixAt(i, dummy.matrix);
    }
    wheels.instanceMatrix.needsUpdate = true;
    hubs.instanceMatrix.needsUpdate = true;
    const spacing = 151,
      cycleLength = spacing * 12,
      discharge = neuralDischarge(d.time, still),
      visible: number[] = [];
    for (let i = 0; i < 12; i++) {
      const item = cargo[i],
        x =
          ((i * spacing + d.distance + cycleLength / 2) % cycleLength) -
          cycleLength / 2;
      item.group.position.set(x, 137, 0);
      item.group.visible = Math.abs(x) < width / 2 + 110;
      if (!item.group.visible) continue;
      visible.push(i);
      const strain = jam
        ? Math.pow(Math.max(0, Math.sin(d.stateAge * 2.6)), 18)
        : 0;
      const kick =
        d.status === "restarting"
          ? Math.sin(d.stateAge * 28) * Math.exp(-d.stateAge * 3)
          : jam
            ? Math.sin(d.stateAge * 45) * strain * 0.8
            : 0;
      item.group.rotation.z = still ? 0 : kick * 0.017;
      item.group.position.x += still
        ? 0
        : strain * Math.sin(d.stateAge * 45) * 0.65;
      item.group.position.y += still
        ? 0
        : Math.sin(d.time * 23 + i) * Math.min(0.23, d.velocity / 180);
      item.neuralMat.emissiveIntensity =
        0.8 + neuralPulse(d.time, item.seed, 0, still).light;
      item.packets.forEach((p, j) => {
        const pulse = neuralPulse(d.time, item.seed, j, still);
        p.visible = !still && pulse.position > 0 && pulse.position < 1;
        if (p.visible) p.position.copy(item.curves[j].getPoint(pulse.position));
      });
    }
    if (discharge.cycle !== burstCycle) {
      burstCycle = discharge.cycle;
      burstSlot = visible[Math.floor(discharge.choice * visible.length)] ?? 0;
    }
    const item = cargo[burstSlot];
    arcs.visible = arcGlow.visible =
      discharge.strength > 0 && item.group.visible;
    if (arcs.visible) {
      item.group.updateMatrixWorld(true);
      const origin = item.curves[1].getPoint(item.bad ? 1 : 0.45);
      item.body.localToWorld(origin);
      let index = 0;
      for (let b = 0; b < 3; b++) {
        let last = origin.clone();
        for (let n = 1; n <= 6; n++) {
          const p = origin
            .clone()
            .add(
              new T.Vector3(
                (b - 1) * n * 4 +
                  (noise(n * 17 + b * 37 + burstCycle) - 0.5) * 8,
                n * 4,
                Math.sin(n) * 3,
              ),
            );
          last.toArray(arcPositions, index);
          p.toArray(arcPositions, index + 3);
          index += 6;
          last = p;
        }
      }
      arcsGeometry.attributes.position.needsUpdate = true;
      arcsGeometry.computeBoundingSphere();
      arcMaterial.opacity = discharge.strength;
      arcGlow.position.copy(origin);
      arcGlow.material.opacity = discharge.strength * 0.6;
    }
    renderer.render(scene, camera);
    // Shared orientation also lights the text UI and draws attention to the reset.
    const page = canvas.closest("main");
    if (page) {
      page.dataset.factoryState = d.status;
      page.style.setProperty(
        "--beacon-wash",
        String(red * (0.12 + 0.5 * Math.pow(Math.max(0, -Math.cos(phase)), 2))),
      );
    }
    if (++frames % 60 === 0) {
      projected.copy(spot.position).project(camera);
      canvas.dataset.beaconY = String(((1 - projected.y) * cssH) / 2);
      canvas.dataset.beaconAngle = (phase % TAU).toFixed(3);
      canvas.dataset.frames = String(frames);
      canvas.dataset.drawCalls = String(renderer.info.render.calls);
      canvas.dataset.triangles = String(renderer.info.render.triangles);
      canvas.dataset.viewport = `${cssW}x${cssH}`;
      canvas.dataset.drawMeanMs = (total / frames).toFixed(2);
      canvas.dataset.drawMaxMs = max.toFixed(2);
    }
    const elapsed = performance.now() - started;
    total += elapsed;
    max = Math.max(max, elapsed);
  }
  return {
    resize,
    draw,
    async prepare() {
      await renderer.compileAsync(scene, camera);
    },
    dispose() {
      instances.forEach((m) => m.dispose());
      spot.shadow.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      environment.dispose();
      renderer.dispose();
    },
  };
}
