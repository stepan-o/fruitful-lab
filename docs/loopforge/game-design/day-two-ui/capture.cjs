// Render the paired Day 2 drawings from the saved, public storyboard projection.
// Usage: node capture.cjs /path/to/apps/lab /path/to/output
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
  const projection=read(path.join(out,'projection.json'));
  const intro=new Intro();
  while(!intro.finished) intro.step();
  const source=departure(intro);
  const names=['intake','wash','belt','forge'];
  const sheets={wide:[],tall:[]};
  images.queueRail=await loadImage(path.join(lab,'public/loopforge-intro/sec-rails-depth.png'));
  const fresh=()=>{const state=start('early',source);state.guided=true;return state;};
  let seq=0;
  function order(state,action,target,incident,room='conveyor'){
    const cmd=intent(state,'drawing-'+(++seq),action,target,room);
    if(incident)cmd.incident=incident;
    const result=admitCommand(state,cmd);
    assert.ok(result.accepted,[action,target,incident,state.tick,result.reason].join(' '));
  }
  function frame(state,key){
    const shot=projection.screens[key];
    while(state.tick<shot.tick){
      const before=state.tick;step(state);
      assert.ok(state.tick>before,'Unexpected hold before '+key);
    }
    const floor=publicFloor(state);
    assert.equal(floor.tick,shot.tick,key+' tick');
    assert.equal(state.completed.length,shot.week,key+' rack');
    assert.deepEqual(floor.machines.map(m=>m.carrier),shot.machines.map(m=>m.load),key+' loads');
    const view=select({tick:floor.tick,hash:'',scene:floor.scene},shot.room,'','');
    view.speeches=[];
    for(const [device,[w,h]] of Object.entries(projection.devices)){
      const data=shot.devices[device], index=data.index;
      const sheet=Math.floor(index/projection.batchSize);
      if(!sheets[device][sheet])sheets[device][sheet]=createCanvas(w,h*projection.batchSize);
      const cv=createCanvas(w,h);
      const first=data.stations[0][0];
      const focus=shot.room==='conveyor'&&device==='tall'&&[50,0,-50,-100].includes(first)?Math.round((50-first)/50):undefined;
      paint(cv.getContext('2d'),w,h,floor.scene,shot.room,floor.tick,images,skin,view,{...floor,focusStation:focus});
      sheets[device][sheet].getContext('2d').drawImage(cv,0,h*(index%projection.batchSize));
    }
  }
  const desk=fresh();
  frame(desk,'standby-line');frame(desk,'standby-desk');
  const staff=fresh();order(staff,'appoint','LIMEN',null,'security');
  for(const id of ['walk','screening','pairs'])frame(staff,id);
  const pair=['sam','sam','max','max'];
  for(const [i,id] of ['first-post','pair-posts','third-post','demonstration'].entries()){
    order(staff,'post',names[i],pair[i]);frame(staff,id);
  }
  frame(staff,'missing');
  for(const branch of ['grant','hold']){
    const state=structuredClone(staff);
    if(branch==='grant')order(state,'issue-pass','bob',null,'security');
    for(const id of ['desk','visit','singles'])frame(state,branch+'-'+id);
    const who=['sam',branch==='grant'?'bob':'max','jo','kit'];
    for(const [i,stage] of ['one-post','two-posts','last-post','two'].entries()){
      order(state,'post',names[i],who[i]);frame(state,branch+'-'+stage);
    }
    for(const id of ['release','live','security'])frame(state,branch+'-'+id);
    order(state,'assign','belt','kit');frame(state,branch+'-move');
    if(branch==='hold'){
      const relief=structuredClone(state);
      order(relief,'assign','forge','mae');frame(relief,'relief');frame(relief,'relief-bell');
    }
    frame(state,branch+'-bell');
  }
  const manual=fresh();order(manual,'appoint','STILETTO',null,'security');
  for(const id of ['swap-walk','farewell','rush','empty','silence','one-rack','second-rest','ready','ready-security'])frame(manual,id);
  frame(structuredClone(manual),'watch-bell');
  const intake=structuredClone(manual);
  order(intake,'clear','intake','D2-C3/sam');
  for(const id of ['intake-call','intake-result','intake-bell'])frame(intake,id);
  order(manual,'clear','forge','D2-C2/max');
  for(const id of ['calling','stroke','rack','inspection','clear-bell'])frame(manual,id);
  for(const [device,atlases] of Object.entries(sheets)){
    for(const [i,sheet] of atlases.entries()){
      fs.writeFileSync(path.join(out,device+'-'+i+'.webp'),await sheet.encode('webp',81));
    }
  }
  console.log('Rendered '+Object.keys(projection.screens).length+' paired floor captures.');
}
run().catch(error=>{console.error(error);process.exitCode=1});
