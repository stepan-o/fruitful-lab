// Render the game's public floor projection without a browser or an animation clock.
// Usage: node replay.cjs /path/to/apps/lab /path/to/output
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
  send(intent(state,'ui-appointment','appoint','STILETTO','security'));
  for (let i=0; !state.line.handoff && i<12000; i++) step(state);
  assert.ok(state.line.handoff);
  const ledger = [];
  const measured = read(path.join(out,'hosted.json'));
  async function capture(name) {
    const floor = publicFloor(state);
    const speeches = floor.dialogue.filter(e => e.room==='conveyor');
    const last = speeches.at(-1);
    const view = select({tick:floor.tick,hash:'',scene:floor.scene},'conveyor','','');
    view.speeches = speeches.filter(e=>e.tick===last.tick).map(e=>({seq:e.seq,tick:e.tick,speaker:e.actor,text:e.text,at:e.at,asset:'fl-bubble',nameplate:'fl-bubble-nameplate'}));
    for (const device of ['desktop','phone']) {
      const {width,height} = measured[device][0].bounds;
      const w = Math.round(width), h = Math.round(height);
      const focus = device === 'phone' ? 3 : undefined;
      const cv = createCanvas(w,h);
      paint(cv.getContext('2d'),w,h,floor.scene,'conveyor',floor.tick,images,skin,view,{...floor,focusStation:focus});
      fs.writeFileSync(path.join(out,'audit-'+device+'-'+name+'.webp'), await cv.encode('webp',82));
    }
    ledger.push({name,tick:floor.tick,stroke:floor.stroke,speech:last?.text,callDue:state.line.call?.due??null,
      rack:state.completed.length,secondsToBell:(floor.bell-floor.tick)/20,machines:floor.machines.map(({name,crew,carrier,hold,canClear})=>({name,crew,carrier,hold,canClear})),
      crew:floor.scene.agents.filter(a=>a.room==='conveyor').map(({id,x,y})=>({id,x:x/1000,y:y/1000})),
      recentEvents:state.marks.filter(e=>floor.tick-e.tick<35 && ['clear.received','control.ready','speech.delivered'].includes(e.kind)).map(({tick,kind,actor,text})=>({tick,kind,actor,text}))});
  }
  await capture('wait');
  send({...intent(state,'ui-forge','clear','forge','conveyor'),incident:'D2-C2/max'});
  for(let i=0;i<5;i++)step(state);
  await capture('call');
  for(let i=0;i<24;i++)step(state);
  await capture('stroke');
  assert.equal(ledger[0].machines.filter(m=>m.canClear).length,2);
  assert.equal(ledger[1].stroke,0);
  assert.ok(ledger[2].stroke>0 && ledger[2].recentEvents.some(e=>e.kind==='clear.received'));
  fs.writeFileSync(path.join(out,'checkpoint.json'), JSON.stringify(ledger,null,2)+'\n');
}
run().catch(e=>{console.error(e);process.exitCode=1});
