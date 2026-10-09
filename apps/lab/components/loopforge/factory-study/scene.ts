import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3, Quaternion, Matrix } from "@babylonjs/core/Maths/math.vector";
import { Viewport } from "@babylonjs/core/Maths/math.viewport";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { VertexBuffer } from "@babylonjs/core/Buffers/buffer";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/core/Meshes/thinInstanceMesh";
import "@babylonjs/core/Culling/ray";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { RawCubeTexture } from "@babylonjs/core/Materials/Textures/rawCubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Constants } from "@babylonjs/core/Engines/constants";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SpotLight } from "@babylonjs/core/Lights/spotLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { buildFloor } from "./floor-scene";
import { FIXTURE_SOCKETS, worldPoint, zone, ZONES, accessible, type ZoneId } from "@/lib/loopforge/spatial/floor";
import { gateOpen, initialStudy, type Fixture, type StudyState } from "@/lib/loopforge/factory-study/kernel";

export type Focus = ZoneId | "wide";
export type SceneReport = { fps: number; meshes: number; active: number; workers: number; resolution: string; renderer: string; renderMs: number; updateMs: number };
export type FactoryScene = { update(s: StudyState): void; focus(f: Focus): void; inset(bottom: number): void; build(enabled: boolean, selected: Fixture | null): void; motion(enabled: boolean): void; dispose(): void };
type V = [number, number, number];
type Mat = PBRMaterial | StandardMaterial;
const v = (p: V) => new Vector3(...p);
const C = (hex: string) => Color3.FromHexString(hex);

export function createFactoryScene(canvas: HTMLCanvasElement, install: (f: Fixture) => void, report: (r: SceneReport) => void, selectZone: (zone: ZoneId) => void): FactoryScene {
  const engine = new Engine(canvas, false, { stencil: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
  const scene = new Scene(engine);
  try {
  scene.clearColor = new Color4(.018, .025, .025, 1);
  scene.ambientColor = new Color3(.08, .10, .09);
  scene.fogMode = Scene.FOGMODE_EXP2; scene.fogDensity = .005; scene.fogColor = new Color3(.025, .041, .042);
  const camera = new ArcRotateCamera("director", -Math.PI / 2 + .32, .94, 27, new Vector3(-1, 1.7, 0), scene);
  camera.attachControl(canvas, true); camera.lowerBetaLimit = .52; camera.upperBetaLimit = 1.22;
  camera.lowerRadiusLimit = 7; camera.upperRadiusLimit = 90; camera.wheelDeltaPercentage = .015;
  camera.pinchDeltaPercentage = .012; camera.panningSensibility = 130; camera.inertia = .78;
  camera.minZ = .15; camera.maxZ = 150; camera.fov = .8; camera.fovMode = 0;
  let state = initialStudy(), lastTime = performance.now(), visualTravel = 0, moving = true;
  let building = false, selected: Fixture | null = null;
  let bottomInset = 180;
  let focus: Focus = "wide", targetRadius = 27, targetPoint = new Vector3(-1, 1.7, 0), transition = 1;
  let seed = 873121;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const nodes: TransformNode[] = [];
  const key = new DirectionalLight("warm overhead", new Vector3(-.5, -1, .5), scene);
  key.position.set(3, 12, -7); key.diffuse = C("#ffc477"); key.intensity = 1.85; key.renderPriority = 4;
  const hemi = new HemisphericLight("cold factory bounce", new Vector3(0, 1, 0), scene);
  hemi.diffuse = C("#729d96"); hemi.groundColor = C("#080e0b"); hemi.intensity = .52; hemi.renderPriority = 3;
  const shadow = new ShadowGenerator(1024, key); shadow.usePercentageCloserFiltering = true;
  shadow.filteringQuality = ShadowGenerator.QUALITY_LOW; shadow.bias = .001; shadow.normalBias = .04;
  key.autoCalcShadowZBounds = true;
  const envFaces: Uint8Array[] = [];
  for (let face = 0; face < 6; face++) {
    const pixels = new Uint8Array(64 * 64 * 4);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      const i = (y * 64 + x) * 4, stripe = Math.exp(-Math.pow((x - 24) / 4, 2)) * .22;
      const light = (face === 2 ? .34 : face === 3 ? .025 : .11 + stripe) * (.6 + .4 * (1 - y / 64));
      pixels[i] = light * 220; pixels[i + 1] = light * 230; pixels[i + 2] = light * 210; pixels[i + 3] = 255;
    } envFaces.push(pixels);
  }
  const environment = new RawCubeTexture(scene, envFaces, 64, Constants.TEXTUREFORMAT_RGBA, Constants.TEXTURETYPE_UNSIGNED_BYTE, true, false, Texture.TRILINEAR_SAMPLINGMODE);
  environment.gammaSpace = false; scene.environmentTexture = environment;
  function material(name: string, color: string, metal = .7, rough = .56) {
    const m = new PBRMaterial(name, scene); m.albedoColor = C(color); m.metallic = metal; m.roughness = rough; m.environmentIntensity = .75; m.maxSimultaneousLights = 3;
    const tex = new DynamicTexture(name + " generated grain", 256, scene, true);
    const ctx = tex.getContext() as CanvasRenderingContext2D; const data = ctx.createImageData(256, 256);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const k = (y * 256 + x) * 4, grain = random();
      const shade = 200 + grain * 40;
      data.data[k] = shade; data.data[k + 1] = shade * .96; data.data[k + 2] = shade * .88; data.data[k + 3] = 255;
    } ctx.putImageData(data, 0, 0);
    ctx.globalAlpha = .16;
    for (let i = 0; i < 300; i++) { ctx.fillStyle = "#172017"; const x=random()*256,y=random()*256; ctx.beginPath();ctx.arc(x,y,random()*5,0,Math.PI*2);ctx.fill(); }
    for (let i = 0; i < 85; i++) { ctx.strokeStyle = i % 3 ? "#1b201c" : "#e4dab5"; ctx.lineWidth = .2 + random()*.4; ctx.beginPath(); const x = random() * 256, y = random() * 256; ctx.moveTo(x, y); ctx.lineTo(x + 2 + random() * 9, y + random() * 2); ctx.stroke(); }
    ctx.globalAlpha = 1; tex.update(false); m.albedoTexture = tex;
    const bump=new DynamicTexture(name+" surface relief",256,scene,true),bc=bump.getContext() as CanvasRenderingContext2D;
    const source=ctx.getImageData(0,0,256,256),normal=bc.createImageData(256,256);
    for(let y=0;y<256;y++)for(let x=0;x<256;x++){const k=(y*256+x)*4;normal.data[k]=128+(source.data[(y*256+(x+1)%256)*4]-source.data[(y*256+(x+255)%256)*4])*.45;normal.data[k+1]=128+(source.data[(((y+1)%256)*256+x)*4]-source.data[(((y+255)%256)*256+x)*4])*.45;normal.data[k+2]=252;normal.data[k+3]=255;}
    bc.putImageData(normal,0,0);bump.update(false);m.bumpTexture=bump;m.bumpTexture.level=.45;
    return m;
  }
  function glow(name: string, color: string, strength = 1) {
    const m = new StandardMaterial(name, scene); m.diffuseColor = C(color); m.emissiveColor = C(color).scale(strength); m.specularColor = Color3.Black(); return m;
  }
  const iron = material("oil black iron", "#303b36", .83, .48);
  const dark = material("recesses", "#141d1b", .5, .72);
  const brass = material("weathered brass", "#a08042", .78, .43);
  const copper = material("heated copper", "#794632", .7, .53);
  const green = material("old enamel", "#3d584c", .38, .58);
  const floorMat = material("scarred floor", "#202b26", .62, .42);

  const ridge = material("cortical folds", "#b78164", .03, .32);
  const darkFlesh = material("damaged cortex", "#63382e", .09, .62);
  const cyan = glow("neural cyan", "#49c8bd", 1.25), amber = glow("filament amber", "#ffa44b", 1.3);
  const red = glow("alarm red", "#ff294c", 1.5), quiet = glow("dormant lens", "#304a40", .3);
  const glyph = glow("phosphor", "#76bea4", .7);
  const transparent = new StandardMaterial("placement projection", scene); transparent.diffuseColor = C("#72dcc9"); transparent.emissiveColor = C("#3d786c"); transparent.alpha = .12; transparent.wireframe = true;
  function root(name: string, pos: V = [0,0,0]) { const n = new TransformNode(name, scene); n.position.copyFrom(v(pos)); nodes.push(n); return n; }
  function finish(m: Mesh, mat: Mat, pos: V, parent?: TransformNode, cast = false) {
    m.material = mat; m.position.copyFrom(v(pos)); m.parent = parent ?? null; m.receiveShadows = true; m.isPickable = false;
    if (cast) shadow.addShadowCaster(m); return m;
  }
  function box(name: string, size: V, pos: V, mat: Mat = iron, parent?: TransformNode, cast = false) {
    if(Math.min(...size)<.075) return finish(MeshBuilder.CreateBox(name,{width:size[0],height:size[1],depth:size[2]},scene),mat,pos,parent,cast);
    // Bevels are geometry: they catch moving light, rather than painted-on highlights.
    const h=size.map(s=>s/2),b=Math.min(.035,Math.min(...size)*.12),positions:number[]=[],normals:number[]=[],indices:number[]=[],uvs:number[]=[];
    function face(points:number[][]){
      const center=points.reduce((a,p)=>a.add(v(p as V)),Vector3.Zero()).scale(1/points.length);
      let normal=Vector3.Cross(v(points[1] as V).subtract(v(points[0] as V)),v(points[2] as V).subtract(v(points[0] as V))).normalize();
      if(Vector3.Dot(normal,center)<0){points.reverse();normal=normal.scale(-1);}
      const start=positions.length/3;for(let i=0;i<points.length;i++){positions.push(...points[i]);normals.push(normal.x,normal.y,normal.z);uvs.push(i===1||i===2?1:0,i>=2?1:0);}for(let i=1;i<points.length-1;i++)indices.push(start,start+i+1,start+i);
    }
    for(let a=0;a<3;a++)for(const sign of [-1,1]){const axes=[0,1,2].filter(x=>x!==a);face([[-1,-1],[1,-1],[1,1],[-1,1]].map(q=>{const p=[0,0,0];p[a]=h[a]*sign;p[axes[0]]=q[0]*(h[axes[0]]-b);p[axes[1]]=q[1]*(h[axes[1]]-b);return p;}));}
    for(let a=0;a<3;a++)for(let c=a+1;c<3;c++)for(const sa of [-1,1])for(const sc of [-1,1]){const axis=3-a-c;face([[0,-1],[1,-1],[1,1],[0,1]].map(q=>{const p=[0,0,0];p[a]=(h[a]-(q[0]?b:0))*sa;p[c]=(h[c]-(q[0]?0:b))*sc;p[axis]=(h[axis]-b)*q[1];return p;}));}
    for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])face([[h[0]-b,h[1],h[2]],[h[0],h[1]-b,h[2]],[h[0],h[1],h[2]-b]].map(p=>[p[0]*x,p[1]*y,p[2]*z]));
    const data=new VertexData();data.positions=positions;data.normals=normals;data.indices=indices;data.uvs=uvs;const mesh=new Mesh(name,scene);data.applyToMesh(mesh);return finish(mesh,mat,pos,parent,cast);
  }
  function cylinder(name: string, r: number, h: number, pos: V, mat: Mat = iron, parent?: TransformNode, tessellation = 16) {
    return finish(MeshBuilder.CreateCylinder(name, { diameter: r * 2, height: h, tessellation }, scene), mat, pos, parent);
  }
  function sphere(name: string, diameter: number, pos: V, mat: Mat, parent?: TransformNode, scale: V = [1,1,1], segments = 16) {
    const m = finish(MeshBuilder.CreateSphere(name, { diameter, segments }, scene), mat, pos, parent); m.scaling.copyFrom(v(scale)); return m;
  }
  function pipe(name: string, points: V[], radius: number, mat: Mat = brass, parent?: TransformNode, tessellation = 8) {
    return finish(MeshBuilder.CreateTube(name, { path: points.map(v), radius, tessellation, cap: Mesh.CAP_ALL }, scene), mat, [0,0,0], parent);
  }
  function bar(name: string, a: V, b: V, radius: number, mat: Mat, parent?: TransformNode) {
    const pa = v(a), pb = v(b), delta = pb.subtract(pa);
    const m = cylinder(name, radius, delta.length(), [0,0,0], mat, parent, 8);
    m.position.copyFrom(pa.add(pb).scale(.5)); m.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), delta.normalize(), new Quaternion()); return m;
  }
  function ring(name: string, radius: number, thickness: number, pos: V, mat: Mat, parent?: TransformNode) {
    return finish(MeshBuilder.CreateTorus(name, { diameter: radius * 2, thickness, tessellation: 24 }, scene), mat, pos, parent);
  }
  function bolts(parent: TransformNode | undefined, xs: number[], ys: number[], z: number) {
    for (const x of xs) for (const y of ys) { const b = cylinder("hex fixing", .045, .045, [x,y,z], brass, parent, 6); b.rotation.x = Math.PI / 2; }
  }
  function sign(text: string, sub: string, width: number, pos: V, parent?: TransformNode) {
    box("cast sign backing", [width+.12,.7,.07], pos, brass, parent);
    const tex = new DynamicTexture(text, {width:1024,height:256}, scene, true), ctx = tex.getContext() as CanvasRenderingContext2D;
    ctx.fillStyle = "#13201c"; ctx.fillRect(0,0,1024,256);
    ctx.strokeStyle="#99834d"; ctx.lineWidth=5; ctx.strokeRect(13,13,998,230);
    ctx.textAlign="center";ctx.fillStyle="#cebd86";ctx.font="bold 90px Georgia";ctx.fillText(text,512,126);
    ctx.fillStyle="#839689";ctx.font="28px monospace";ctx.fillText(sub,512,198);
    for(let i=0;i<300;i++){ctx.fillStyle=random()>.5?"#07100c35":"#b99f6430";ctx.fillRect(random()*1024,random()*256,random()*24,1);}
    tex.update(true);const m=new StandardMaterial(text+" plate",scene);m.diffuseTexture=tex;m.emissiveColor=new Color3(.13,.13,.1);m.specularColor=Color3.Black();
    const plane=MeshBuilder.CreatePlane(text,{width,height:.64},scene);finish(plane,m,[pos[0],pos[1],pos[2]-.046],parent);
  }
  const floor = buildFloor(scene, { box, pipe, cylinder, iron, dark, brass, copper, green, floorMat, amber, quiet });
  const localGlow=new PointLight("Security terminal bounce",new Vector3(-2.2,2.5,.6),scene);localGlow.diffuse=C("#69bab2");localGlow.intensity=3;localGlow.range=6;localGlow.renderPriority=2;
  const taskLight=new PointLight("conveyor inspection light",new Vector3(-2.5,3.5,-7),scene);taskLight.diffuse=C("#ffb362");taskLight.intensity=7;taskLight.range=8;taskLight.renderPriority=2;
  const terminal=root("clearance terminal",[-8,0,.35]);
  box("terminal footing",[1.45,.2,1.35],[0,.1,0],iron,terminal,true);
  box("terminal pedestal",[.95,1.25,.85],[0,.77,0],green,terminal,true);
  box("terminal cabinet",[1.5,1.4,.78],[0,1.98,0],iron,terminal,true);
  box("screen rim",[1.22,.86,.12],[0,2.16,-.47],brass,terminal);
  box("screen glass",[1.08,.73,.03],[0,2.16,-.55],dark,terminal);
  for(let y=0;y<6;y++)box("terminal phosphor",[.78-(y%3)*.16,.014,.016],[-.08,2.43-y*.085,-.575],glyph,terminal);
  const scan=box("scan line",[.92,.016,.019],[0,2.4,-.58],cyan,terminal);
  const keyboard=box("key bank",[1.26,.16,.53],[0,1.43,-.61],brass,terminal);keyboard.rotation.x=.22;
  for(let r=0;r<3;r++)for(let c=0;c<7;c++)box("key",[.1,.045,.09],[-.48+c*.15,1.54-r*.012,-.79+r*.13],dark,terminal);
  cylinder("red override",.13,.08,[.44,1.63,-.55],red,terminal);
  bolts(terminal,[-.65,.65],[1.42,2.58],-.43);
  for(let i=0;i<5;i++)box("terminal vents",[.65,.04,.016],[0,.4+i*.12,-.436],dark,terminal);
  pipe("terminal umbilical",[[.35,.2,.4],[.7,.2,.5],[.85,.1,.8],[1.7,.06,.8]],.08,dark,terminal);
  const gate=root("security access gate",[-5.5,0,.1]);
  for(const x of [-1.35,1.35]){
    box("gate base",[.65,.2,.72],[x,.1,0],brass,gate);
    box("gate column",[.43,2.9,.48],[x,1.55,0],iron,gate,true);
    pipe("exposed ram",[[x, .4,-.3],[x,2.65,-.3]],.055,brass,gate);
    box("clearance strip",[.08,1,.04],[x,1.9,-.26],cyan,gate);
    cylinder("post crown",.23,.15,[x,3.05,0],brass,gate);
  }
  box("scanner lintel",[3.2,.35,.7],[0,3.2,0],green,gate,true);
  sign("CLEARANCE", "PRESENT YOURSELF",1.8,[0,3.23,-.39],gate);
  const arm=root("gate actuator",[0,1.25,0]);arm.parent=gate;
  box("gate arm",[2.4,.2,.18],[0,0,0],brass,arm,true);
  for(let x=-.65;x<.8;x+=.26){const stripe=box("gate hazard stripe",[.12,.205,.19],[x,0,0],dark,arm);stripe.rotation.z=-.3;}
  // A complete test segment: fixed infeed/outtake fixtures; player fits its drive.
  const line=root("conveyor test bed",[3,0,0]);
  for(const z of [-1,1]){
    box("continuous steel rail",[10,.35,.19],[0,1.22,z],iron,line,true);
    box("rail wear edge",[10,.055,.23],[0,1.43,z],brass,line);
    pipe("rail conduit",[[-5,.76,z],[-3,.76,z],[-2,.55,z],[2,.55,z],[3,.76,z],[5,.76,z]],.09,copper,line);
    for(let x=-4.6;x<5;x+=1.55){box("cast trestle",[.22,1.25,.42],[x,.63,z],green,line,true);box("foot",[.58,.09,.65],[x,.07,z],iron,line);bolts(line,[x],[1.19],z-.105);}
  }
  for(let x=-4.6;x<5;x+=.47){const roller=cylinder("idler roller",.14,1.8,[x,1.23,0],dark,line,12);roller.rotation.x=Math.PI/2;}
  const beltParts=[iron,brass].map((mat,index)=>{
    const mesh=box("articulated belt plates",[.25,.075,1.72],[0,0,0],mat,line);
    const indices=Array.from({length:36},(_,i)=>i).filter(i=>(i%4===0?1:0)===index);
    const buffer=new Float32Array(indices.length*16);mesh.thinInstanceSetBuffer("matrix",buffer,16,false);mesh.alwaysSelectAsActiveMesh=true;
    return {mesh,indices,buffer};
  });
  const plates=beltParts.map(part=>part.mesh),beltMatrix=Matrix.Identity();
  for(const x of [-5.12,5.12]){box("end housing",[.5,1.55,2.5],[x,.8,0],green,line,true);for(const z of [-1,1]){const cap=cylinder("bearing cap",.3,.16,[x,1.22,z],brass,line);cap.rotation.x=Math.PI/2;}}
  const drive=root("conveyor drive",[4.9,0,-1.7]);
  box("drive skid",[2.7,.2,1.3],[0,.1,0],iron,drive,true);
  const motor=cylinder("ribbed drive motor",.46,1.9,[0,.7,0],green,drive,32);motor.rotation.z=Math.PI/2;
  for(let x=-.7;x<=.8;x+=.15){const fin=ring("motor cooling fin",.48,.055,[x,.7,0],iron,drive);fin.rotation.z=Math.PI/2;}
  box("motor junction",[.68,.25,.55],[.1,1.23,0],brass,drive);
  const flywheel=root("flywheel",[-1.09,.73,0]);flywheel.parent=drive;
  const flyring=ring("flywheel rim",.58,.1,[0,0,0],brass,flywheel);flyring.rotation.z=Math.PI/2;
  for(let a=0;a<6;a++)bar("flywheel spoke",[0,0,0],[0,Math.cos(a*Math.PI/3)*.53,Math.sin(a*Math.PI/3)*.53],.04,iron,flywheel);
  pipe("drive power",[[1,.3,.1],[1.5,.2,.1],[1.6,.09,.9],[2.4,.09,.9]],.075,dark,drive);
  const beforeProcess = new Set(scene.meshes);
  // Production architecture and instruments supply depth above the live segment.
  for(const x of [-.6,7.3]){
    box("processing upright",[.32,3.3,.38],[x,1.7,.98],iron,undefined,true);
    box("instrument head",[1.1,.6,.65],[x,3.35,.7],brass,undefined,true);
    cylinder("instrument cap",.28,.18,[x,3.75,.7],green);
    pipe("tool feed",[[x,3.3,.5],[x,2.9,.4],[x+.3,2.5,.1]],.085,copper);
  }
  sign("LATTICE / 01", "TEST SPECIMENS • NO QUOTA CREDIT",3.1,[3,3.9,2.8]);
  for(const x of [0,6]){
    const tank=cylinder("pressure vessel",.47,2,[x,1.1,3.4],green,undefined,24);shadow.addShadowCaster(tank);
    sphere("tank shoulder",.95,[x,2.1,3.4],iron,undefined,[1,.45,1]);
    for(const y of [.4,1.8])ring("tank retaining strap",.5,.07,[x,y,3.4],brass);
    pipe("tank manifold",[[x,2.2,3.4],[x,2.75,3.4],[x+.65,2.75,3.4],[x+.65,.1,3.4]],.07,copper);
  }
  const processFrame=root("Lattice process instruments");
  for(const mesh of scene.meshes)if(!beforeProcess.has(mesh)&&!mesh.parent)mesh.parent=processFrame;
  const specimens: TransformNode[]=[];
  function brain(index: number) {
    const n=root("specimen "+index,[0,1.5,0]);n.parent=line;
    box("specimen cradle",[1.15,.11,1.3],[0,0,0],brass,n);
    for(const x of [-.55,.55]){box("cradle clamp",[.07,.3,.8],[x,.18,0],iron,n);for(const z of [-.48,.48])cylinder("clamp bolt",.07,.22,[x,.2,z],brass,n,6);}
    for(const side of [-1,1]){
      const cortex=MeshBuilder.CreateSphere("folded cortex",{diameter:1,segments:48,updatable:true},scene);
      const positions=cortex.getVerticesData(VertexBuffer.PositionKind)!, normals=cortex.getVerticesData(VertexBuffer.NormalKind)!,colors:number[]=[];
      for(let j=0;j<positions.length;j+=3){
        const x=positions[j]*2,y=positions[j+1]*2,z=positions[j+2]*2;
        const warp=2.3*Math.sin(y*7+z*3)+1.1*Math.sin(z*11+x*4);
        const fold=Math.sin(x*12+warp+index*.9)*.68+Math.sin(z*11+y*9+Math.sin(x*8)*2)*.32;
        const groove=Math.exp(-fold*fold*20), radius=1-.105*groove;
        positions[j]=x*.37*radius;positions[j+1]=y*.36*radius;positions[j+2]=z*.51*radius;
        const shade=1-groove*.36;colors.push(shade,shade*.94,shade*.88,1);
      }
      VertexData.ComputeNormals(positions,cortex.getIndices()!,normals);cortex.updateVerticesData(VertexBuffer.PositionKind,positions);cortex.updateVerticesData(VertexBuffer.NormalKind,normals);cortex.setVerticesData(VertexBuffer.ColorKind,colors);
      finish(cortex,index===3?darkFlesh:ridge,[side*.15,.43,0],n);shadow.addShadowCaster(cortex);
    }
    for(const side of [-1,1]){
      const points:V[]=[];for(let k=0;k<32;k++){const t=k/31;points.push([side*(.5-.23*t)+Math.sin(t*17+index)*.016,.13+.34*t,-.53+.52*t]);}
      pipe("braided neural sheath",points,.037,dark,n,8);
      for(let strand=0;strand<2;strand++)pipe("cyan neural strand",points.map((p,i)=>[p[0]+Math.sin(i*.8+strand*Math.PI)*.018,p[1]+Math.cos(i*.8+strand*Math.PI)*.018,p[2]] as V),.009,cyan,n,5);
      sphere("cortical connector",.12,[side*.5,.13,-.53],brass,n);
    }
    if(index===3)pipe("fractured neural seam",[[0,.72,-.33],[.05,.75,-.12],[-.02,.76,.02],[.06,.70,.29]],.026,darkFlesh,n);
    n.rotation.y=index%2?.08:-.08;specimens.push(n);return n;
  }
  for(let i=0;i<5;i++)brain(i);
  const skull=root("outtake skull",[8.15,1.02,-1.22]);
  sphere("skull casting",.85,[0,.22,0],iron,skull,[1,1.05,.52],24);
  for(const x of [-.18,.18]){sphere("skull eye recess",.26,[x,.31,-.21],dark,skull,[1,.84,.5],16);sphere("skull eye filament",.09,[x,.31,-.274],amber,skull,[1,1,.5],12);bar("skull brow",[x-.12,.47,-.21],[x+.12,.46,-.23],.055,brass,skull);}
  box("nasal opening",[.10,.13,.04],[0,.11,-.24],dark,skull);
  for(let i=0;i<7;i++)box("skull grating tooth",[.055,.19,.14],[-.21+i*.07,-.08,-.18],brass,skull);
  for(const side of [-1,1])pipe("skull mandible",[[side*.36,.27,-.04],[side*.43,-.02,-.04],[side*.28,-.26,-.04],[0,-.27,-.04]],.055,iron,skull);
  // Relocate the original procedural kit as a coherent group into calibrated tiles.
  const lineOrigin = worldPoint(15,19.5), processOffset: V = [lineOrigin[0]-3*.72,0,lineOrigin[2]];
  line.position.copyFrom(v(lineOrigin));line.scaling.setAll(.72);
  processFrame.position.copyFrom(v(processOffset));processFrame.scaling.setAll(.72);
  skull.position.copyFrom(v([processOffset[0]+8.15*.72,1.02*.72,processOffset[2]-1.22*.72]));skull.scaling.setAll(.72);
  for(const [fixture,node] of [["terminal",terminal],["gate",gate],["drive",drive]] as const){const socket=FIXTURE_SOCKETS[fixture];node.position.copyFrom(v(worldPoint(socket.x,socket.y)));node.scaling.setAll(socket.scale);}
  // Articulated robots: one shared body template, individually identified poses.
  const workerTemplate=root("worker template");
  sphere("thorax",.58,[0,1.12,0],green,workerTemplate,[1,1.2,.62],12);
  box("breastplate",[.38,.34,.10],[0,1.17,-.20],iron,workerTemplate);
  for(let i=0;i<4;i++)box("chest louvre",[.29,.021,.04],[0,1.3-i*.07,-.265],brass,workerTemplate);
  cylinder("neck piston",.075,.16,[0,1.55,0],brass,workerTemplate);
  sphere("cranium",.43,[0,1.79,0],iron,workerTemplate,[.85,1.1,.83],16);
  box("brow",[.38,.07,.13],[0,1.86,-.16],brass,workerTemplate);
  for(const x of [-.095,.095])sphere("optic",.063,[x,1.81,-.185],cyan,workerTemplate,[1,.7,.45],8);
  box("jaw",[.22,.10,.16],[0,1.63,-.12],green,workerTemplate);
  for(const x of [-.105,.105]){sphere("optic socket",.14,[x,1.81,-.14],dark,workerTemplate,[1,1,.7],12);const rim=ring("ear bearing",.1,.026,[x*2.0,1.78,0],brass,workerTemplate);rim.rotation.z=Math.PI/2;}
  for(let i=0;i<4;i++)box("jaw tooth",[.026,.063,.035],[-.06+i*.04,1.655,-.218],brass,workerTemplate);
  pipe("head conduit",[[.21,1.74,.04],[.28,1.56,.02],[.2,1.45,.1]],.021,copper,workerTemplate);
  for(let i=0;i<3;i++)ring("abdomen ring",.15,.03,[0,.81+i*.1,0],brass,workerTemplate);
  for(const side of [-1,1]){
    sphere("shoulder",.23,[side*.39,1.35,0],brass,workerTemplate, [1,1,1],8);
    cylinder("spine stay",.037,.42,[side*.16,.88,.05],brass,workerTemplate,8);
  }
  cylinder("waist",.13,.17,[0,.77,0],dark,workerTemplate);
  box("pelvic casing",[.40,.18,.24],[0,.67,0],green,workerTemplate);
  const limbParts: { mesh:Mesh; name:string }[]=[];
  function limb(name:string,a:V,b:V){const m=bar(name,a,b,.067,iron,workerTemplate);limbParts.push({mesh:m,name});return m;}
  for(const side of [-1,1]){
    const x=side*.145;
    limb("thigh"+side,[x,.63,0],[x,.34,0]);sphere("knee"+side,.145,[x,.34,0],brass,workerTemplate,[1,1,1],8);
    limb("shin"+side,[x,.34,0],[x,.09,-.01]);box("foot"+side,[.17,.1,.31],[x,.055,-.075],dark,workerTemplate);
    limb("upperarm"+side,[side*.39,1.34,0],[side*.46,1.02,-.035]);sphere("elbow"+side,.12,[side*.46,1.02,-.035],brass,workerTemplate,[1,1,1],8);
    limb("forearm"+side,[side*.46,1.02,-.035],[side*.43,.78,-.10]);box("hand"+side,[.12,.15,.10],[side*.43,.75,-.11],brass,workerTemplate);
  }
  // Keep worker identity in the snapshot, not thousands of per-part scene nodes.
  // The GPU receives one matrix buffer per shared mechanical part.
  const fixedBodyGroups=new Map<Mat,Mesh[]>();
  for(const mesh of workerTemplate.getChildMeshes() as Mesh[]){
    if(/^(thigh|shin|foot|upperarm|forearm|hand|elbow|knee)(-?1)$/.test(mesh.name))continue;
    const mat=mesh.material as Mat;const group=fixedBodyGroups.get(mat)??[];group.push(mesh);fixedBodyGroups.set(mat,group);
  }
  for(const [mat,meshes] of fixedBodyGroups){for(const mesh of meshes)mesh.computeWorldMatrix(true);
    const merged=Mesh.MergeMeshes(meshes,true,true,undefined,false,false);if(merged){merged.parent=workerTemplate;merged.name="worker body / "+mat.name;merged.receiveShadows=true;merged.isPickable=false;}}
  const templateMeshes=workerTemplate.getChildMeshes() as Mesh[];
  const robotParts=templateMeshes.map(mesh=>{
    mesh.computeWorldMatrix(true);mesh.bakeTransformIntoVertices(mesh.getWorldMatrix());
    mesh.position.setAll(0);mesh.rotation.setAll(0);mesh.rotationQuaternion=null;mesh.scaling.setAll(1);
    mesh.alwaysSelectAsActiveMesh=true;mesh.freezeWorldMatrix();
    const match=/^(thigh|shin|foot|upperarm|forearm|hand|elbow|knee)(-?1)$/.exec(mesh.name);
    return {mesh,buffer:new Float32Array(0),part:match?.[1]??"",side:Number(match?.[2]??0)};
  });
  const robotPositions:Vector3[]=[];
  let populationSize=0;
  function population(n:number){
    if(n===populationSize)return;populationSize=n;
    while(robotPositions.length<n)robotPositions.push(new Vector3(0,0,0));
    for(const part of robotParts){part.buffer=new Float32Array(n*16);part.mesh.thinInstanceSetBuffer("matrix",part.buffer,16,false);}
  }
  population(10);
  const robotMatrix=Matrix.Identity(),robotScale=Vector3.One(),robotRotation=Quaternion.Identity();
  // Overhead rotating beacon: reflector direction, cone, lens and shadows share one transform.
  const beacon=root("rotary signal",[-2.6,3.3,2.6]);
  pipe("signal mounting arm",[[-2.6,.05,2.6],[-2.6,3.15,2.6],[-2.6,3.15,5.4]],.11,iron);
  box("signal footing",[.55,.13,.55],[-2.6,.07,2.6],brass);
  cylinder("beacon pedestal",.42,.2,[0,0,0],iron,beacon);ring("beacon rim",.35,.08,[0,.13,0],brass,beacon);
  const rotor=root("beacon rotor");rotor.parent=beacon;
  cylinder("spindle",.05,.55,[0,.35,0],brass,rotor);
  const reflector=sphere("reflector",.48,[0,.37,0],brass,rotor,[1,1,.22]);reflector.rotation.y=.1;
  const lens=sphere("signal lens",.22,[0,.37,-.1],quiet,rotor,[1,1,.4]);
  for(let i=0;i<4;i++){const a=i*Math.PI/2;bar("beacon guard",[Math.cos(a)*.31,.1,Math.sin(a)*.31],[Math.cos(a)*.25,.7,Math.sin(a)*.25],.018,iron,beacon);}
  ring("beacon guard crown",.25,.035,[0,.7,0],iron,beacon);
  const signal=new SpotLight("signal beam",new Vector3(-2.6,3.68,2.6),new Vector3(0,-.24,-1),1.05,2,scene);signal.intensity=0;signal.range=22;signal.renderPriority=5;
  const signalShadows=new ShadowGenerator(512,signal);signalShadows.usePercentageCloserFiltering=true;signalShadows.filteringQuality=ShadowGenerator.QUALITY_LOW;signalShadows.bias=.001;signalShadows.normalBias=.025;
  for(const n of [terminal,gate,drive])for(const m of n.getChildMeshes())signalShadows.addShadowCaster(m);
  const beamMat=new StandardMaterial("airborne beam",scene);beamMat.emissiveColor=C("#47b4ae");beamMat.alpha=.012;beamMat.backFaceCulling=false;beamMat.disableLighting=true;beamMat.disableDepthWrite=true;
  const cone=MeshBuilder.CreateCylinder("light in dust",{diameterTop:.1,diameterBottom:5,height:12,tessellation:28,sideOrientation:Mesh.DOUBLESIDE},scene);cone.material=beamMat;cone.isPickable=false;
  // The beacon, its visible cone and shadow source move together with the line.
  const beaconOriginal=beacon.position.clone();beacon.position.copyFrom(beaconOriginal.scale(.72).add(v(processOffset)));beacon.scaling.setAll(.72);
  for(const m of scene.meshes)if(m.name==="signal mounting arm"||m.name==="signal footing"){m.parent=processFrame;}
  signal.position.copyFrom(v([-2.6,3.68,2.6]).scale(.72).add(v(processOffset)));signal.range=17;
  const ghostRoots: Record<Fixture,TransformNode>={terminal:root("terminal socket"),gate:root("gate socket"),drive:root("drive socket")};
  for(const f of ["terminal","gate","drive"] as const){const socket=FIXTURE_SOCKETS[f];ghostRoots[f].position.copyFrom(v(worldPoint(socket.x,socket.y)));ghostRoots[f].scaling.setAll(socket.scale);}
  const installedRoots:Record<Fixture,TransformNode>={terminal,gate,drive};
  const projection=glow("construction hologram","#55bda6",.8);projection.alpha=.27;projection.disableLighting=true;
  for(const f of ["terminal","gate","drive"] as const){
    const n=ghostRoots[f],size:V=f==="gate"?[3.2,3.3,.75]:f==="terminal"?[1.6,2.75,1.4]:[2.9,1.5,1.5];
    const ghost=box("fit "+f,size,[0,size[1]/2,0],transparent,n);ghost.isPickable=true;ghost.metadata={fixture:f};
    installedRoots[f].computeWorldMatrix(true);
    for(const source of installedRoots[f].getChildMeshes()){
      if(!(source instanceof Mesh))continue;source.computeWorldMatrix(true);
      const clone=source.clone("preview "+source.name,n,true);clone.makeGeometryUnique();
      clone.bakeTransformIntoVertices(source.getWorldMatrix().multiply(Matrix.Invert(installedRoots[f].getWorldMatrix())));
      clone.position.setAll(0);clone.rotation.setAll(0);clone.rotationQuaternion=null;clone.scaling.setAll(1);clone.material=projection;clone.isPickable=false;
    }
    for(const side of [-1,1]){box("placement corner",[.28,.025,.04],[side*size[0]/2,.06,-size[2]/2],cyan,n);box("placement corner",[.04,.025,.28],[side*size[0]/2,.06,-size[2]/2],cyan,n);}
  }
  scene.onPointerObservable.add(info=>{
    if(info.type!==PointerEventTypes.POINTERTAP)return;
    if(!building||!selected){const pick=scene.pick(scene.pointerX,scene.pointerY,m=>!!m.metadata?.zone);const z=pick?.pickedMesh?.metadata?.zone as ZoneId|undefined;if(z)selectZone(z);return;}
    const hit=scene.pick(scene.pointerX,scene.pointerY,m=>m.isPickable&&m.metadata?.fixture===selected);
    const f=hit?.pickedMesh?.metadata?.fixture as Fixture|undefined;if(hit?.hit&&f===selected)install(f);
  });
  // Merge static construction by material/parent. Moving mechanisms keep their transforms.
  const mergeParents:(TransformNode|null)[]=[null,terminal,gate,drive,line,processFrame,skull,...specimens];
  for(const parent of mergeParents){
    parent?.computeWorldMatrix(true);
    const candidates=scene.meshes.filter(m=>m instanceof Mesh&&m.parent===parent&&m!==cone&&!plates.includes(m as Mesh)&&m.material!==transparent&&m.isEnabled()) as Mesh[];
    const groups=new Map<string,{mat:Mat;meshes:Mesh[]}>();for(const m of candidates){const mat=m.material as Mat;if(!mat)continue;const key=mat.uniqueId+"/"+m.getVerticesDataKinds().sort().join(",");const group=groups.get(key)??{mat,meshes:[]};group.meshes.push(m);groups.set(key,group);}
    for(const {mat,meshes} of groups.values()){if(meshes.length<2)continue;for(const m of meshes)m.computeWorldMatrix(true);
      const casts=meshes.some(m=>shadow.getShadowMap()?.renderList?.includes(m));
      const merged=Mesh.MergeMeshes(meshes,true,true,undefined,false,false);if(!merged)continue;
      merged.name="batched "+(parent?.name??"room")+" / "+mat.name;
      if(parent){merged.bakeTransformIntoVertices(Matrix.Invert(parent.getWorldMatrix()));merged.parent=parent;}
      merged.receiveShadows=true;merged.isPickable=false;if(casts)shadow.addShadowCaster(merged);
      if(parent===terminal||parent===gate||parent===drive)signalShadows.addShadowCaster(merged);
      if(!parent)merged.freezeWorldMatrix();
    }
  }
  const pipeline=new DefaultRenderingPipeline("film",false,scene,[camera]);pipeline.samples=1;pipeline.fxaaEnabled=true;pipeline.bloomEnabled=true;pipeline.bloomThreshold=.85;pipeline.bloomWeight=.22;pipeline.bloomKernel=32;pipeline.bloomScale=.35;
  scene.imageProcessingConfiguration.toneMappingEnabled=true;scene.imageProcessingConfiguration.toneMappingType=1;scene.imageProcessingConfiguration.exposure=1.22;scene.imageProcessingConfiguration.contrast=1.12;
  let lastEvent=0,flash=0,flashKind:"cycle"|"jam"|"idle"="idle",motionClock=0;
  // Pick surfaces mirror room bounds. Locked rooms select their sealed roof, never an interior.
  const pickMaterial=new StandardMaterial("room hit surfaces",scene);pickMaterial.alpha=0;pickMaterial.disableDepthWrite=true;
  for(const z of ZONES){const r=z.rect,hit=box(z.name+" hit surface",[r.w-.2,.015,r.h-.2],[...worldPoint(r.x+r.w/2,r.y+r.h/2)] as V,pickMaterial);hit.position.y=accessible(z.id,state.unlockedRooms)?.02:1.35;hit.isPickable=true;hit.metadata={zone:z.id};}
  let resolutionScale=1,slowSamples=0,qualityAfter=performance.now()+8000;
  const frame=()=>{
    const viewportHeight=canvas.clientHeight*camera.viewport.height,aspect=canvas.clientWidth/Math.max(1,viewportHeight);
    const r=focus==="wide"?{w:36,h:25}:zone(focus).rect;
    targetPoint=focus==="wide"?new Vector3(.5,.5,-1):floor.center(focus);
    const projectedHeight=r.h*Math.cos(camera.beta)+2.8;
    targetRadius=Math.max(9,Math.max(r.w/aspect,projectedHeight)/(2*Math.tan(camera.fov/2))*1.12+r.h*.26);
    transition=1;
  };
  const viewport=()=>{const h=Math.max(1,canvas.clientHeight),top=canvas.clientWidth<600?185:125,bottom=Math.min(h*.52,bottomInset);camera.viewport=new Viewport(0,bottom/h,1,Math.max(.25,(h-bottom-top)/h));};
  const resize=()=>{const w=canvas.clientWidth;engine.setHardwareScalingLevel(1/(Math.min(w<650?1:1.25,window.devicePixelRatio)*resolutionScale));engine.resize();viewport();frame();};
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  let hidden=document.hidden;
  const visibility=()=>{hidden=document.hidden;lastTime=performance.now();if(hidden)engine.stopRenderLoop(render);else engine.runRenderLoop(render);};
  let frames=0,reportTime=performance.now(),shadowView="",shadowTravel=-1,shadowInstalled=-1,shadowArm=-1;
  const keyMap=shadow.getShadowMap()!,signalMap=signalShadows.getShadowMap()!;keyMap.refreshRate=0;signalMap.refreshRate=0;
  function render(){
    if(hidden)return;const now=performance.now(),dt=Math.min(.06,(now-lastTime)/1000);lastTime=now;if(moving)motionClock+=dt;
    if(transition>0){const speed=moving?1-Math.exp(-dt*4):1;camera.setTarget(Vector3.Lerp(camera.target,targetPoint,speed),false,false,true);camera.radius+=(targetRadius-camera.radius)*speed;transition-=moving?dt*.8:1;}
    const targetTravel=state.travel/1600;visualTravel+=(targetTravel-visualTravel)*Math.min(1,dt*18);
    for(const part of beltParts){for(let j=0;j<part.indices.length;j++){
      Matrix.TranslationToRef(-5+((part.indices[j]*10/36+visualTravel*1.8)%10),1.43,0,beltMatrix);part.buffer.set(beltMatrix.asArray(),j*16);
    }part.mesh.thinInstanceBufferUpdated("matrix");}
    for(let i=0;i<specimens.length;i++){specimens[i].position.x=-4.5+((i*1.9+visualTravel*1.8)%9.5);specimens[i].position.y=1.5+(state.running&&!state.jammed&&moving?Math.sin(motionClock*13+i)*.004:0);}
    flywheel.rotation.x=-visualTravel*4;
    const open=gateOpen(state)?1:0;arm.position.y+=(1.25+open*1.4-arm.position.y)*Math.min(1,dt*5);
    scan.position.y=2.17+(moving?Math.sin(motionClock*1.8)*.29:0);
    for(const f of ["terminal","gate","drive"] as const){const placed=state.installed.includes(f);installedRoots[f].setEnabled(placed);ghostRoots[f].setEnabled(building&&!placed&&f===selected);}
    for(let i=0;i<state.workers.length;i++){
      const w=state.workers[i],pos=robotPositions[i];
      const dest={p:new Vector3(...worldPoint(w.position.x/1000,w.position.y/1000)),angle:Math.atan2(w.position.dx,-w.position.dy)+Math.PI};
      if(Vector3.DistanceSquared(pos,dest.p)>4)pos.copyFrom(dest.p);else Vector3.LerpToRef(pos,dest.p,Math.min(1,dt*20),pos);
      const walking=state.running&&!w.waiting&&moving,phase=motionClock*(state.pace==="push"?7.8:5.6)+w.id*1.7,sway=walking?Math.sin(phase)*.17:0;
      pos.y=walking?Math.abs(Math.sin(phase))*.022:0;
      robotScale.setAll(.6+(w.id%4)*.025);Quaternion.RotationYawPitchRollToRef(dest.angle,0,0,robotRotation);
      Matrix.ComposeToRef(robotScale,robotRotation,pos,robotMatrix);const matrix=robotMatrix.asArray(),offset=i*16;
      for(const part of robotParts){
        part.buffer.set(matrix,offset);
        if(part.side){const leg=part.part==="thigh"||part.part==="shin"||part.part==="foot"||part.part==="knee";
          const z=(leg?1:-.7)*part.side*sway,y=part.part==="foot"?Math.max(0,part.side*Math.sin(phase))*(walking?.09:0):0;
          part.buffer[offset+12]+=matrix[8]*z;part.buffer[offset+13]+=matrix[5]*y;part.buffer[offset+14]+=matrix[10]*z;
        }
      }
    }
    for(const part of robotParts)part.mesh.thinInstanceBufferUpdated("matrix");
    if(state.jammed){flash=1;flashKind="jam";}else flash=Math.max(0,flash-dt*.72);
    const idle=flash===0&&moving&&motionClock%12<1.8;
    const power=flash>0?flash:idle?Math.sin(motionClock%12/1.8*Math.PI)*.2:0;
    const color=flashKind==="jam"&&flash>0?C("#ff183f"):flashKind==="cycle"&&flash>0?C("#65ffc1"):C("#49b5b6");
    const angle=motionClock*(state.jammed?5.8:2.1);rotor.rotation.y=angle;
    const direction=new Vector3(Math.sin(angle),-.24,-Math.cos(angle)).normalize();signal.direction=direction;signal.diffuse=color;signal.intensity=power*(state.jammed?48:17);lens.material=power>.05?(state.jammed?red:cyan):quiet;
    cone.setEnabled(power>.02);cone.position.copyFrom(signal.position.add(direction.scale(6)));cone.rotationQuaternion=Quaternion.FromUnitVectorsToRef(new Vector3(0,-1,0),direction,new Quaternion());beamMat.emissiveColor=color;beamMat.alpha=power*(state.jammed?.026:.012);
    if(!moving){signal.intensity=state.jammed?10:0;cone.setEnabled(false);}
    // Cached shadow maps: idle rooms do not redraw two depth passes every frame.
    const view=[camera.alpha,camera.beta,camera.radius,camera.target.x,camera.target.y,camera.target.z].map(x=>x.toFixed(3)).join(",");
    if(view!==shadowView||Math.abs(visualTravel-shadowTravel)>.003||state.installed.length!==shadowInstalled||Math.abs(arm.position.y-shadowArm)>.005){keyMap.resetRefreshCounter();shadowView=view;shadowTravel=visualTravel;shadowInstalled=state.installed.length;shadowArm=arm.position.y;}
    if(signal.intensity>.01)signalMap.resetRefreshCounter();
    const beforeRender=performance.now();scene.render();const renderedAt=performance.now();frames++;if(now-reportTime>1200){const fps=Math.round(frames*1000/(now-reportTime));report({fps,meshes:scene.meshes.length,active:scene.getActiveMeshes().length,workers:state.workers.length,resolution:`${engine.getRenderWidth()} × ${engine.getRenderHeight()}`,renderer:engine.getGlInfo().renderer,renderMs:Math.round(renderedAt-beforeRender),updateMs:Math.round(beforeRender-now)});if(now>qualityAfter&&fps<28&&++slowSamples>=3&&resolutionScale>.65){resolutionScale=Math.max(.65,resolutionScale-.15);slowSamples=0;qualityAfter=now+7000;engine.setHardwareScalingLevel(1/(Math.min(canvas.clientWidth<650?1:1.25,window.devicePixelRatio)*resolutionScale));engine.resize();}else if(fps>=28)slowSamples=0;frames=0;reportTime=now;}
  }
  document.addEventListener("visibilitychange",visibility);engine.runRenderLoop(render);
  return {
    update(s){state=s;population(s.workers.length);const e=s.events.at(-1);if(e&&e.id!==lastEvent){lastEvent=e.id;if(e.kind==="cycle"||e.kind==="jam"){flash=1;flashKind=e.kind;}if(e.kind==="release"){flash=0;flashKind="idle";}}},
    focus(f){focus=f;camera.alpha=-Math.PI/2+.22;camera.beta=f==="wide"?.60:.86;frame();},
    inset(bottom){bottomInset=bottom;viewport();engine.resize();frame();},
    build(enabled,fixture){building=enabled;selected=fixture;},
    motion(enabled){moving=enabled;},
    dispose(){observer.disconnect();document.removeEventListener("visibilitychange",visibility);engine.stopRenderLoop(render);scene.dispose();engine.dispose();}
  };
  } catch(error) { scene.dispose(); engine.dispose(); throw error; }
}
