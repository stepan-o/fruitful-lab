import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import type { Scene } from '@babylonjs/core/scene';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import { assetUrl, parseManifest } from '@/lib/assets/types';
import lobbyPack from '@/lib/assets/generated/loopforge-lobby.json';
import { worldPoint } from '@/lib/loopforge/spatial/floor';
import { CLAIM_DESK, LOBBY_BAYS, claimDisplay, type ClaimDisplay } from '@/lib/loopforge/spatial/lobby';
import type { Mat, V, WorkshopTools } from './floor-scene';

/** A presentation kit, deliberately independent of the game clock/economy.
 * Static bodies join the scene's material batches; hands, forms and stamps retain
 * small local transforms. All instances share their textures and materials. */
export function buildLobby(scene: Scene, t: WorkshopTools) {
  const pack = parseManifest(lobbyPack, 'loopforge-lobby');
  const { box, cylinder, sphere, bar, ring, pipe, sign } = t;
  const roots: TransformNode[] = [], deskRoots: TransformNode[] = [];
  const tex = (id: string) => { const texture = new Texture(assetUrl(pack, id), scene); texture.anisotropicFilteringLevel = 4; return texture; };
  const patina = tex('enamel');
  function metal(name: string, color: string, metallic: number, roughness: number) {
    const m = new PBRMaterial(name, scene); m.albedoTexture = patina; m.albedoColor = Color3.FromHexString(color);
    m.metallic = metallic; m.roughness = roughness; m.environmentIntensity = .55; m.maxSimultaneousLights = 4; return m;
  }
  const enamel = metal('claim hall / rubbed olive enamel', '#eeecd2', .22, .62);
  const brass = metal('claim hall / oxidised brass', '#ffe3a6', .48, .46);
  const iron = metal('claim hall / soot iron', '#9ea79a', .45, .67);
  const paper = new StandardMaterial('claim hall / yellowed forms', scene); paper.diffuseColor = Color3.FromHexString('#b7aa7b'); paper.specularColor = Color3.Black();
  const forms = new StandardMaterial('claim hall / authored paperwork wall', scene); forms.diffuseTexture = tex('paperwork-wall'); forms.specularColor = Color3.Black(); forms.emissiveColor = new Color3(.08, .073, .046);
  const filament = new StandardMaterial('claim hall / lamp filament', scene); filament.emissiveColor = Color3.FromHexString('#ffdb83'); filament.disableLighting = true;
  const phosphor = new StandardMaterial('claim hall / green phosphor', scene); phosphor.emissiveColor = Color3.FromHexString('#6c987a').scale(.7); phosphor.disableLighting = true;
  const crimson = new StandardMaterial('claim hall / returned indicator', scene); crimson.emissiveColor = Color3.FromHexString('#bb4432'); crimson.disableLighting = true;
  function root(name: string, x = 0, y = 0, yaw = 0) {
    const r = new TransformNode(name, scene); r.position.set(...worldPoint(x, y)); r.rotation.y = yaw; roots.push(r); return r;
  }
  function surface(name: string, width: number, height: number, pos: V, mat: Mat, parent: TransformNode, floor = false) {
    const m = MeshBuilder.CreatePlane(name, { width, height }, scene); m.position.set(...pos); m.material = mat; m.parent = parent;
    m.receiveShadows = true; m.isPickable = false; if (floor) m.rotation.x = Math.PI / 2; return m;
  }
  const sheetTex = new DynamicTexture('claim form / authored typography', { width: 256, height: 384 }, scene, true);
  const sc = sheetTex.getContext() as CanvasRenderingContext2D;
  sc.fillStyle = '#c4b684'; sc.fillRect(0, 0, 256, 384); sc.fillStyle = '#393c2a'; sc.font = 'bold 16px monospace'; sc.fillText('HOURS WORKED', 18, 30);
  sc.font = '9px monospace'; sc.fillText('LOOPFORGE / PAY CLAIM', 18, 48);
  for (let i = 0; i < 15; i++) { sc.strokeStyle = '#626146'; sc.strokeRect(18, 66 + i * 17, 219, 17); sc.fillRect(32, 73 + i * 17, 24 + i * 37 % 127, 1); }
  sc.strokeRect(149, 335, 87, 29); sheetTex.update();
  const sheetMat = paper.clone('claim form print'); sheetMat.diffuseTexture = sheetTex; sheetMat.diffuseColor = new Color3(.64, .64, .60); sheetMat.backFaceCulling = false;
  // Analytic contact AO and baked pools remain cheap; physical lamps supply the
  // local view-dependent response. These are not transparent fog stacks.
  function radial(name: string, color: string, centerAlpha: number) {
    const d = new DynamicTexture(name, 128, scene, true), c = d.getContext() as CanvasRenderingContext2D;
    const g = c.createRadialGradient(64, 64, 7, 64, 64, 63); g.addColorStop(0, color.replace('A', String(centerAlpha))); g.addColorStop(1, color.replace('A', '0'));
    c.fillStyle = g; c.fillRect(0, 0, 128, 128); d.hasAlpha = true; d.update();
    const m = new StandardMaterial(name, scene); m.diffuseTexture = d; m.useAlphaFromDiffuseTexture = true; m.disableLighting = true; m.emissiveColor = Color3.White(); m.disableDepthWrite = true; return m;
  }
  const contact = radial('claim hall / contact shadow', 'rgba(0,5,3,A)', .68);
  const pool = radial('claim hall / warm lamp pool', 'rgba(221,151,60,A)', .20);
  const headJoints: TransformNode[] = [], hands: TransformNode[] = [], feeds: Mesh[] = [], stamps: TransformNode[] = [];
  const attachments: TransformNode[] = [], indicators: Mesh[] = [];
  const wall = root('claim hall / north paperwork architecture', 65, 80.3);
  for (let i = -4; i <= 1; i++) {
    const x = i * 6;
    box('recessed claim wall', [5.95, 6.8, .22], [x, 3.5, 0], iron, wall);
    surface('archival form boards', 5.7, 3.8, [x, 3.05, -.14], forms, wall);
    for (const sx of [-2.94, 2.94]) { box('cast paperwork pilaster', [.20, 7, .34], [x + sx, 3.5, -.1], enamel, wall, true); box('pilaster brass inlay', [.065, 6.6, .04], [x + sx, 3.5, -.29], brass, wall); }
    for (const h of [.75, 5.2, 6.7]) box('claim cornice', [5.95, .17, .46], [x, h, -.15], brass, wall);
    sign(i === 0 ? 'HOURS WORKED' : i === 1 ? 'CLAIMS / 03' : 'CLAIMS / ' + String(i + 5).padStart(2, '0'), 'KEEP YOUR COPY', 3.6, [x, 5.77, -.2], wall);
    box('wall fixture casing', [1.12, .20, .45], [x, 6.45, -.5], iron, wall);
    box('wall lamp', [.88, .06, .26], [x, 6.32, -.61], filament, wall);
    for (const sx of [-.46, -.23, 0, .23, .46]) bar('lamp guard', [x + sx, 6.3, -.82], [x + sx, 6.5, -.82], .014, brass, wall);
  }
  // Large primary pipes cast geometry shadows. Fine cable relief lives in the art.
  for (const offset of [0, .55, 1.05]) {
    pipe('claim hall / overhead main', [[-28, 7.5 + offset, -.2], [8, 7.5 + offset, -.2], [9, 6.7 + offset, -.3], [9, .3, -.3]], .16 + offset * .08, brass, wall);
    for (let x = -27; x < 9; x += 3) { const collar = cylinder('pipe compression collar', .22 + offset * .08, .12, [x, 7.5 + offset, -.2], iron, wall); collar.rotation.z = Math.PI / 2; }
  }
  sign('TRUTH STAYS CLEAN. STORY GETS MESSY.', 'PAYROLL / LOWER HALL', 16, [-5, 9.3, -.22], wall);
  for (let x = -26; x < 10; x += 6) {
    box('clerestory recess', [4.6, 3.5, .14], [x, 12, -.13], iron, wall);
    for (let j = 0; j < 6; j++) box('clerestory shutter', [4.3, .11, .12], [x, 10.6 + j * .54, -.24], enamel, wall);
  }
  function desk(bay: typeof LOBBY_BAYS[number], index: number) {
    const r = root('pay claim bay / ' + bay.id, bay.x, bay.y, bay.yaw);
    deskRoots.push(r);
    box('desk top bevel', [CLAIM_DESK.width, .11, CLAIM_DESK.depth], [0, 1.02, 0], brass, r, true);
    box('desk worn inset', [2.06, .018, .93], [0, 1.085, 0], enamel, r);
    for (const x of [-.88, .88]) {
      box('desk pedestal', [.36, .86, .84], [x, .52, .04], enamel, r, true);
      box('desk plinth', [.48, .13, .97], [x, .10, .02], iron, r);
      for (let j = 0; j < 3; j++) { box('drawer relief', [.29, .21, .035], [x, .36 + j * .23, -.395], brass, r); bar('drawer handle', [x - .075, .4 + j * .23, -.44], [x + .075, .4 + j * .23, -.44], .016, iron, r); }
    }
    box('modesty panel', [1.3, .61, .06], [0, .62, .4], iron, r);
    for (let i = 0; i < 9; i++) box('desk vent', [.045, .29, .02], [-.43 + i * .10, .65, .442], brass, r);
    surface('desk contact', 3.2, 2.6, [0, .015, -.18], contact, r, true);
    surface('lamp on stone', 3.7, 3.1, [.6, .026, -.25], pool, r, true);
    // Deep CRT case, rubber gasket, curved glass and physical keyboard.
    const monitor = new TransformNode('CRT mounting angle', scene); monitor.parent = r; monitor.position.set(-.49, 1.12, .12); monitor.rotation.x = -.12; roots.push(monitor);
    box('CRT housing', [.61, .49, .44], [0, .22, 0], enamel, monitor, true);
    box('screen brass rim', [.56, .43, .06], [0, .25, -.245], brass, monitor);
    box('screen rubber', [.49, .35, .065], [0, .25, -.283], iron, monitor);
    const screen = box('phosphor screen glass', [.44, .29, .025], [0, .25, -.326], phosphor, monitor);
    for (let i = 0; i < 6; i++) box('screen scanline', [.35 - i % 3 * .06, .009, .005], [-.015, .34 - i * .035, -.36], enamel, monitor);
    box('keyboard body', [.63, .045, .25], [-.50, 1.12, -.28], iron, r);
    for (let j = 0; j < 3; j++) for (let k = 0; k < 8; k++) box('typewriter key', [.048, .025, .048], [-.755 + k * .069, 1.15, -.35 + j * .062], brass, r);
    pipe('desk mains cable', [[-.8, .2, .40], [-1.3, .12, .62], [-1.36, .13, 1.15], [-1.5, .35, 1.2]], .036, iron, r);
    cylinder('lamp weighted foot', .15, .05, [.80, 1.12, .23], iron, r);
    bar('lamp lower arm', [.8, 1.13, .23], [.84, 1.58, .2], .025, brass, r);
    bar('lamp upper arm', [.84, 1.58, .2], [.65, 1.78, -.04], .024, brass, r);
    sphere('lamp pivot', .12, [.84, 1.58, .2], iron, r, [1, 1, 1], 8);
    const shade = MeshBuilder.CreateCylinder('banker lamp shade', { diameterTop: .17, diameterBottom: .46, height: .18, tessellation: 20 }, scene); shade.material = enamel; shade.position.set(.65, 1.72, -.04); shade.parent = r; shade.isPickable = false;
    cylinder('lamp underside', .19, .015, [.65, 1.62, -.04], filament, r, 20);
    surface('light on desk', 1.6, 1.1, [.45, 1.107, -.04], pool, r, true);
    for (let j = 0; j < 4; j++) { const pile = box('paper stack', [.30, .033, .40], [.03 + j % 2 * .25, 1.12 + Math.floor(j / 2) * .045, .17], paper, r); pile.rotation.y = j * .17; }
    const form = surface('claim fed through platen', .27, .36, [.23, 1.125, -.25], sheetMat, r, true); form.metadata = { unbatched: true }; feeds.push(form);
    const stamp = new TransformNode('desk stamp motion', scene); stamp.parent = r; stamp.position.set(.39, 1.13, -.16); stamps.push(stamp); roots.push(stamp);
    box('stamp die', [.16, .035, .11], [0, 0, 0], iron, stamp); cylinder('stamp handle stem', .025, .16, [0, .10, 0], brass, stamp); sphere('stamp grip', .11, [0, .2, 0], enamel, stamp, [1.25, .8, 1], 10);
    const feeder = new TransformNode('replaceable paper feeder', scene); feeder.parent = r; attachments.push(feeder); roots.push(feeder);
    box('feeder gearbox', [.39, .23, .38], [.71, 1.22, -.27], enamel, feeder, true);
    for (const x of [.54, .88]) box('feeder cheeks', [.035, .34, .43], [x, 1.29, -.28], brass, feeder);
    for (let j = 0; j < 3; j++) { const roller = cylinder('paper roller', .035, .31, [.71, 1.34, -.44 + j * .12], iron, feeder, 8); roller.rotation.z = Math.PI / 2; }
    // Stools have real seat height and four spread feet; workers fit the desk.
    cylinder('stool cushion', .29, .10, [0, .57, -1.02], enamel, r, 20); ring('stool seat rim', .285, .035, [0, .57, -1.02], brass, r);
    for (const a of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) bar('stool leg', [Math.cos(a) * .17, .52, -1.02 + Math.sin(a) * .17], [Math.cos(a) * .31, .06, -1.02 + Math.sin(a) * .31], .026, iron, r);
    ring('stool foot rest', .25, .024, [0, .22, -1.02], brass, r);
    const status = sphere('desk response lamp', .055, [.87, 1.29, -.40], phosphor, r, [1, 1, .5], 8); status.metadata = { unbatched: true }; indicators.push(status);
    if (bay.occupied) {
      const body = new TransformNode('staged payroll clerk ' + index, scene); body.parent = r; body.position.set(0, 0, -1.02); roots.push(body);
      sphere('worker seated thorax', .49, [0, 1.02, 0], enamel, body, [1, 1.22, .75], 14);
      box('worker spinal casing', [.25, .33, .1], [0, 1.02, -.20], iron, body);
      for (let k = 0; k < 5; k++) bar('spine brass ring', [-.13, .87 + k * .07, -.27], [.13, .87 + k * .07, -.27], .02, brass, body);
      cylinder('worker neck', .055, .16, [0, 1.37, .03], brass, body);
      const head = new TransformNode('reading head', scene); head.parent = body; head.position.set(0, 1.55, .06); headJoints.push(head); roots.push(head);
      sphere('worker cast cranium', .38, [0, 0, 0], iron, head, [1, 1.13, 1], 16);
      for (const x of [-.09, .09]) { sphere('worker optic housing', .15, [x, 0, .16], brass, head, [1, 1, .5], 10); sphere('worker dim optic', .055, [x, 0, .20], phosphor, head, [1, 1, .4], 8); }
      box('worker jaw', [.22, .11, .16], [0, -.18, .10], enamel, head);
      for (const side of [-1, 1]) {
        sphere('hip bearing', .18, [side * .15, .64, 0], brass, body, [1, 1, 1], 10);
        bar('seated thigh', [side * .15, .64, 0], [side * .19, .54, .46], .075, iron, body);
        sphere('knee', .17, [side * .19, .54, .46], brass, body, [1, 1, 1], 10);
        bar('shin piston', [side * .19, .54, .46], [side * .21, .12, .39], .061, enamel, body);
        box('worker foot', [.19, .11, .34], [side * .21, .08, .49], iron, body);
        sphere('shoulder bearing', .18, [side * .30, 1.17, 0], brass, body, [1, 1, 1], 10);
        bar('upper arm', [side * .30, 1.17, 0], [side * .35, .99, .30], .059, iron, body);
        const hand = new TransformNode('writing forearm', scene); hand.parent = body; hand.position.set(side * .35, .99, .30); hands.push(hand); roots.push(hand);
        sphere('elbow bearing', .13, [0, 0, 0], brass, hand, [1, 1, 1], 8);
        bar('reaching forearm', [0, 0, 0], [-side * .12, .18, .39], .05, enamel, hand);
        box('writing hand', [.12, .055, .15], [-side * .12, .18, .42], brass, hand);
      }
    }
    // Keep secondary stations visually quiet; a monitor never drives economy state.
    if (!bay.occupied) screen.material = t.quiet;
  }
  LOBBY_BAYS.forEach(desk);
  // East bay forms continue behind the desks, facing into the hall.
  const east = root('claim hall / east paperwork wall', 79.65, 94, Math.PI / 2);
  for (const x of [-3, 3]) { box('east bay backing', [5.9, 6.7, .22], [x, 3.4, 0], iron, east); surface('east claim papers', 5.7, 3.8, [x, 3.05, -.15], forms, east); sign('KEEP YOUR COPY', 'PAY CLAIMS', 3.8, [x, 5.5, -.19], east); }
  // A freestanding, pipe-framed portal surrounds the existing Dispatch opening.
  const entry = root('claim hall / Dispatch portal', 79.65, 104, Math.PI / 2);
  for (const side of [-1, 1]) {
    box('door buttress', [.8, 7.3, 1.0], [side * 3.45, 3.65, 0], enamel, entry, true);
    for (const offset of [0, .34, .68]) {
      const x = side * (3.28 + offset);
      pipe('door pressure riser', [[x, .12, -.65], [x, 6.3, -.65], [x - side * .3, 6.8, -.65], [side * 2.5, 6.8, -.65]], .11 + offset * .1, brass, entry);
      for (const y of [.7, 2, 4.4, 5.8]) { cylinder('pipe cuff', .18 + offset * .1, .14, [x, y, -.65], iron, entry); }
    }
    box('door foot', [1.4, .4, 1.5], [side * 3.55, .20, -.10], iron, entry);
    const valve = ring('portal valve wheel', .37, .055, [side * 3.48, 3.1, -.94], brass, entry); valve.rotation.x = Math.PI / 2;
    for (let j = 0; j < 5; j++) bar('valve spoke', [side * 3.48, 3.1, -.95], [side * 3.48 + Math.cos(j * Math.PI * 2 / 5) * .35, 3.1 + Math.sin(j * Math.PI * 2 / 5) * .35, -.95], .02, iron, entry);
  }
  box('portal lintel', [7.6, .8, 1.2], [0, 7.0, 0], enamel, entry, true);
  sign('DISPATCH', 'CLEARANCE / SECURITY →', 4.9, [0, 7.02, -.63], entry);
  box('portal warm overhead', [3.5, .12, .6], [0, 6.55, -.2], filament, entry);
  surface('threshold pool', 8, 9, [0, .029, -1.8], pool, entry, true);
  // Authored floor insignia, not a typed placeholder or oversized desk.
  const stone = new PBRMaterial('claim hall / worn stone', scene);
  const stoneTexture = tex('stone-floor'); stoneTexture.uScale = 18; stoneTexture.vScale = 12; stone.albedoTexture = stoneTexture;
  stone.albedoColor = new Color3(.88, .90, .87); stone.metallic = .06; stone.roughness = .86; stone.maxSimultaneousLights = 3;
  const floorRoot = root('claim hall / authored floor', 44, 104);
  surface('worn flagstones', 71.6, 47.6, [0, .006, 0], stone, floorRoot, true);
  const ground = root('claim hall / floor identity', 65, 91.5);
  const emblem = new StandardMaterial('claim hall / floor inlay', scene); emblem.diffuseTexture = tex('floor-emblem'); emblem.diffuseTexture.hasAlpha = true; emblem.useAlphaFromDiffuseTexture = true; emblem.specularColor = Color3.Black();
  surface('Loopforge brass inlay', 8.5, 5.67, [0, .045, 0], emblem, ground, true);
  for (const x of [-5.1, 5.1]) { box('floor guide inlay', [.065, .018, 12], [x, .025, 0], brass, ground); box('floor guide dark border', [.12, .015, 12], [x + .13, .022, 0], iron, ground); }
  for (let i = 0; i < 7; i++) box('Dispatch approach marking', [.08, .018, .65], [6 + i * 1.3, .025, -12.5], brass, ground);
  const lamps = LOBBY_BAYS.slice(0, 3).map(b => {
    const p = worldPoint(b.x + .65, b.y + .04); p[1] = 1.63;
    const l = new SpotLight('claim hall / desk task light', new Vector3(...p), new Vector3(-.13, -1, -.16), 1.7, 1.6, scene);
    l.diffuse = Color3.FromHexString('#ffd18a'); l.intensity = 1.1; l.range = 3.5; l.renderPriority = 2; return l;
  });
  return {
    roots,
    finalize() {
      // Bind after static batching. Each desk gets one lamp, not three extra
      // lights in every material across the entire 41,536 m² factory.
      lamps.forEach((light, i) => { light.includedOnlyMeshes = deskRoots[i].getChildMeshes(); });
    },
    feeder(enabled: boolean) { for (const a of attachments) a.setEnabled(enabled); },
    animate(time: number, moving: boolean, visible: boolean, detailed: boolean) {
      for (const light of lamps) light.setEnabled(visible && detailed);
      // Shadow/contact silhouettes are static; only small non-casting mechanisms move.
      if (!visible) return;
      for (let i = 0; i < headJoints.length; i++) headJoints[i].rotation.x = -.12 + (moving ? Math.sin(time * .55 + i) * .06 : 0);
      for (let i = 0; i < hands.length; i++) hands[i].rotation.x = moving ? Math.sin(time * 2.6 + i) * .045 : 0;
      for (let i = 0; i < feeds.length; i++) {
        const display: ClaimDisplay = claimDisplay(time, i * 4);
        feeds[i].position.z = -.25 + (moving && display === 'filing' ? Math.sin(time * .7 + i) * .035 : 0);
        stamps[i].position.y = 1.13 + (moving && display === 'accepted' ? Math.max(0, Math.sin(time * 3)) * .10 : .10);
        indicators[i].material = display === 'returned' ? crimson : display === 'waiting' ? filament : phosphor;
      }
    },
  };
}
