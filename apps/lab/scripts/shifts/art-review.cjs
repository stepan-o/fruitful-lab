// Run both real bundles in one browser on one machine. The old public directory
// is served separately; neither player uses a test clock or injected outcomes.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {createHash}=require('node:crypto');
const fixture=require('../../public/loopforge-shifts/fixtures/missing-pass.json');
const chat=require('../../public/loopforge-shifts/fixtures/chat-rushed.json');
const destination=path.resolve('shift-evidence','art');
const routes={before:process.env.SHIFT_BEFORE,after:process.env.SHIFT_AFTER};

async function open(browser,url,width,record=false){
  const size={width,height:width<500?844:780};
  const context=await browser.newContext({viewport:size,hasTouch:width<500,deviceScaleFactor:1,
    recordVideo:record?{dir:destination,size}:undefined});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.addInitScript(()=>{
    window.addEventListener('loopforge:frame',({detail})=>{window.current=detail;});
  });
  await page.goto(url);
  await page.waitForFunction(()=>!!window.current);
  return {context,page,errors};
}
async function restore(page,f){
  await page.selectOption('#checkpoint',f.scenario);
  await page.waitForFunction(hash=>window.current.hash===hash,f.result.initial_public_hash);
}
async function film(browser,label,url){
  const {context,page,errors}=await open(browser,url,900,true);
  const video=page.video();
  await restore(page,fixture);
  await page.locator('#signal').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1400);
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>window.current.scene.world.status==='pass');
  await page.click('#play');
  await page.waitForTimeout(3200);
  await page.click('[data-room="conveyor"]');
  await page.waitForTimeout(5700);
  await page.click('#play');
  await restore(page,chat);
  await page.click('#play');
  await page.waitForTimeout(9000);
  assert.deepEqual(errors,[]);
  await context.close();
  await video.saveAs(path.join(destination,label+'-1x.webm'));
  const source=await fs.readFile(path.join(destination,label+'-1x.webm'));
  return {width:900,height:780,bytes:source.length,sha256:createHash('sha256').update(source).digest('hex')};
}
async function benchmark(browser,url) {
  const {context,page,errors}=await open(browser,url,900);
  const session=await context.newCDPSession(page);
  await session.send('Performance.enable');
  const metrics=async()=>Object.fromEntries((await session.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
  await restore(page,fixture);
  await page.click('#signal');await page.click('#pass');
  await page.waitForFunction(()=>current.scene.world.status==='pass');
  await page.click('[data-room="conveyor"]');await page.click('#play');
  await page.waitForFunction(t=>current.tick>=t,fixture.initial.tick+200);
  const start=await metrics();
  const observed=await page.evaluate(()=>new Promise(resolve=>{
    const start=performance.now(),initial=current.tick,frame=[],ticks=[];
    let last=start,lastTick=start;
    const event=()=>{const now=performance.now();ticks.push(now-lastTick);lastTick=now;};
    window.addEventListener('loopforge:frame',event);
    function loop(now){
      frame.push(now-last);last=now;
      if(current.tick<initial+1200){requestAnimationFrame(loop);return;}
      window.removeEventListener('loopforge:frame',event);
      const p95=a=>a.sort((a,b)=>a-b)[Math.floor(.95*a.length)];
      resolve({seconds:(now-start)/1000,ticks:current.tick-initial,paintCallbackP95ms:p95(frame),
        verifiedFrameP95ms:p95(ticks),callbacks:frame.length,frames:ticks.length});
    }
    requestAnimationFrame(loop);
  }));
  const end=await metrics();
  assert.deepEqual(errors,[]);
  await context.close();
  return {...observed,mainThreadTaskSeconds:end.TaskDuration-start.TaskDuration,
    heapMiBStart:start.JSHeapUsedSize/1048576,heapMiBEnd:end.JSHeapUsedSize/1048576};
}
async function phone(browser,width){
  const {context,page,errors}=await open(browser,routes.after,width);
  await restore(page,fixture);
  const tap=s=>page.tap(s);
  await tap('#faster');
  await page.waitForFunction(()=>!!current.scene.world.spent);
  await tap('#signal');
  assert(await page.isDisabled('#pass'));
  assert.equal(await page.locator('#decision').getAttribute('data-art'),'sec-panel-spent');
  const bounds=await page.locator('#signal').boundingBox();
  assert(bounds.width>=44&&bounds.height>=44);
  await page.screenshot({path:path.join(destination,width+'-spent.png')});
  await tap('#watch');await tap('[data-room="conveyor"]');await tap('[data-room="security"]');
  await tap('#signal');assert(await page.isVisible('#decision'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  await tap('#restore');
  await page.waitForFunction(hash=>current.hash===hash,fixture.result.initial_public_hash);
  assert(!(await page.isVisible('#decision')));
  await tap('#signal');await tap('#pass');
  await page.waitForFunction(()=>current.scene.world.status==='pass');
  await tap('#watch');await tap('#signal');
  assert((await page.locator('#credential-text').innerText()).includes('Producer'));
  await page.screenshot({path:path.join(destination,width+'-pass.png')});
  await page.reload();await page.waitForFunction(()=>window.current?.scene.world.phase==='briefing');
  assert.equal(await page.locator('#clock').innerText(),'Day 2 · Morning');
  assert.deepEqual(errors,[]);await context.close();
}
async function days(browser){
  const {context,page,errors}=await open(browser,routes.after,390);
  for(const day of [2,3,4]){
    await page.click('[data-bid="LIMEN"]');
    assert.equal(await page.evaluate(()=>current.scene.world.phase),'briefing');
    await page.click('#commit');
    await page.waitForFunction(d=>current.scene.world.day===d&&current.scene.world.phase==='shift',day);
    if(day===2){
      await page.locator('#signal').waitFor({timeout:90000});await page.click('#signal');await page.click('#pass');
      await page.waitForFunction(()=>current.scene.world.pass?.valid);
    }
    await page.waitForFunction(()=>current.scene.world.phase==='close',undefined,{timeout:110000});
    if(day===2)assert((await page.locator('#overnight').innerText()).includes('expired'));
    if(day===3)assert((await page.locator('#overnight').innerText()).includes('released'));
    if(day<4){await page.click('#next');await page.locator('#chassis').waitFor();}
    else assert(!(await page.isVisible('#next')));
  }
  assert.deepEqual(errors,[]);await context.close();
}
(async()=>{
  await fs.mkdir(destination,{recursive:true});
  const browser=await chromium.launch();
  try{
    if(process.argv[2]==='progression'){
      await days(browser);
    }else{
      const result={baseline:process.env.BASE_SHA,candidate:process.env.GITHUB_SHA,browser:browser.version(),films:{},performance:{}};
      for(const [name,url] of Object.entries(routes)){
        result.films[name]=await film(browser,name,url);
        result.performance[name]=await benchmark(browser,url);
        console.log(name,JSON.stringify(result.performance[name]));
      }
      await fs.writeFile(path.join(destination,'measurement.json'),JSON.stringify(result,null,2)+'\n');
      for(const width of [320,390])await phone(browser,width);
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
