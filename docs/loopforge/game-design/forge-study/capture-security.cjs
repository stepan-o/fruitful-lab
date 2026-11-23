// Render the Day 2 missing-ID review states from the first-playthrough Security projection.
// Usage: node capture-security.cjs /path/to/apps/lab /path/to/output
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const [lab, out] = process.argv.slice(2).map(p => path.resolve(p));
const runtime = createRequire(path.join(lab, 'package.json'));
const ts = runtime('typescript');
require.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true }
}).outputText, file);
const { createCanvas, loadImage } = require(process.env.CANVAS_MODULE || '@napi-rs/canvas');
global.document = {createElement: () => createCanvas(1, 1)};
const fromApp = file => runtime('./lib/loopforge/' + file);
const { Intro } = fromApp('intro/simulation.ts');
const { departure } = fromApp('intro/shift-handoff.ts');
const { start, step, intent, admitCommand } = fromApp('shifts/simulation.ts');
const { publicFloor } = fromApp('shifts/playthrough.ts');
const { select } = fromApp('shifts/skin.ts');
const { paint } = fromApp('shifts/painter.ts');
const { drawAsset } = runtime('./public/loopforge-design/days-2-4-art/v1/binding/shift-art.mjs');
const pack = path.join(lab, 'public/loopforge-design/days-2-4-art/v1');
const read = file => JSON.parse(fs.readFileSync(file));
async function run() {
  fs.mkdirSync(out, {recursive:true});
  const manifest = read(path.join(pack,'manifest.json'));
  const images = {}, atlases = {};
  for (const {file} of Object.values(manifest.atlases)) atlases[file] = await loadImage(path.join(pack,file));
  for (const key of fromApp('shifts/intro-sprites.json')) images[key] = await loadImage(path.join(lab,'public/loopforge-intro',key+'.webp'));
  const tileDir = path.join(lab, 'public/loopforge-design/floor-correction/v1');
  for (const {material,room} of Object.values(read(path.join(tileDir,'manifest.json')).rooms)) {
    for (const {file} of [material,room]) images[file] = await loadImage(path.join(tileDir,file));
  }
  const draw = (ctx,id,x,y,options={}) => drawAsset(ctx,manifest,atlases,id,Math.round(x),Math.round(y),options);
  const skin = {draw,world(ctx,id,x,y,metre) {
    const scale = metre / manifest.groundPixelsPerMetre;
    const [px,py] = manifest.assets[id].pivot;
    draw(ctx,id,x-px*scale,y-py*scale,{scale});
  }};
  const intro = new Intro();
  while (!intro.finished) intro.step();
  const state = start('early', departure(intro));
  const send = cmd => assert.ok(admitCommand(state,cmd).accepted);
  images.queueRail = await loadImage(path.join(lab,'public/loopforge-intro/sec-rails-depth.png'));
  send(intent(state,'ui-security','appoint','LIMEN','security'));
  for (let i=0; !state.case && i<12000; i++) step(state);
  assert.equal(state.case?.subject,'bob');
  assert.equal(state.case.status,'open');
  const evidence={};
  async function frame(key, state) {
    const floor = publicFloor(state);
    const view = select({tick:floor.tick,hash:'',scene:floor.scene},'security','','');
    view.speeches = [];
    const cameras = {};
    for (const [device,w,h] of [['desktop',760,540],['phone',390,480]]) {
      const cv = createCanvas(w,h);
      paint(cv.getContext('2d'),w,h,floor.scene,'security',floor.tick,images,skin,view,floor);
      fs.writeFileSync(path.join(out,key+'-'+device+'.webp'),await cv.encode('webp',88));
      const {xy}=fromApp('shifts/painter.ts').floorView(w,h,'security');
      cameras[device] = Object.fromEntries(floor.scene.agents
        .filter(a=>['bob','LIMEN','jo','ed','gus'].includes(a.id))
        .map(a=>[a.id,xy(a.x/1000,a.y/1000).map(Math.round)]));
    }
    evidence[key]={tick:state.tick,caseStatus:state.case.status,spent:state.spent??null,
      pass:state.pass,cameras,passages:[...state.dialogue.passages],called:state.called};
  }
  await frame('held',state);
  const branch=structuredClone(state);
  while(branch.case.status==='open')step(branch);
  await frame('closed',branch);
  send(intent(state,'ui-bob-day-pass','issue-pass','bob','security'));
  for(let i=0;i<250&&(!state.dialogue.passages.includes('bob')||state.called!=='jo');i++) step(state);
  assert.equal(state.case.status,'pass');
  assert.ok(state.dialogue.passages.includes('bob'));
  await frame('issued',state);
  fs.writeFileSync(path.join(out,'floor.json'),JSON.stringify(evidence,null,2));
  console.log(JSON.stringify(evidence).slice(0,3500));
}
run().catch(e=>{console.error(e);process.exitCode=1;});
