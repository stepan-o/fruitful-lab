// Record public controls at wall-clock speed. All checkpoints come from the game menu.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

// Capture the interaction itself. A long browser video can drift away from the
// wall clock during the intro, especially on a loaded recording runner.
async function recordAction(page, dir, name, act){
  const frames=await fs.mkdtemp(path.join(dir,'.frames-'));
  const captures=[];
  let recording=true;
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function capture(){
    const filename='frame-'+String(captures.length).padStart(4,'0')+'.jpg';
    const bytes=await page.screenshot({type:'jpeg',quality:88,timeout:10000});
    captures.push({filename,at:performance.now()});
    await fs.writeFile(path.join(frames,filename),bytes);
  }
  try{
    await capture();
    const pump=(async()=>{
      while(recording){await delay(65);if(recording)await capture();}
    })();
    try{
      await delay(650);
      await act();
      await delay(1050);
    }finally{
      recording=false;
      await pump;
    }
    await capture();
    const timeline=['ffconcat version 1.0'];
    for(let i=0;i<captures.length;i++){
      const frame=captures[i],next=captures[i+1];
      timeline.push("file '"+frame.filename+"'");
      if(next)timeline.push('duration '+((next.at-frame.at)/1000).toFixed(4));
    }
    await fs.writeFile(path.join(frames,'timeline.txt'),timeline.join('\n')+'\n');
    execFileSync('ffmpeg',['-loglevel','error','-y','-f','concat','-safe','0','-i',path.join(frames,'timeline.txt'),
      '-vf','fps=25','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',path.join(dir,name+'.mp4')]);
  }finally{
    await fs.rm(frames,{recursive:true,force:true});
  }
}

async function review(){
  const manual=process.argv[2]==='limen';
  const size=manual?{width:1280,height:820}:{width:320,height:720};
  const dir=path.resolve('shift-evidence',manual?'desktop':'phone');
  await fs.mkdir(dir,{recursive:true});
  const browser=await chromium.launch({args:['--no-sandbox']});
  const context=await browser.newContext({viewport:size,hasTouch:!manual});
  const page=await context.newPage();
  const button=name=>page.getByRole('button',{name,exact:typeof name==='string'});
  const shot=name=>page.screenshot({path:path.join(dir,name+'.jpg'),quality:82});
  const save=()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('loopforge.playthrough.1')));
  const time=()=>page.getByText(/s to bell/).innerText();
  const errors=[],sizes=[];
  page.on('pageerror',err=>errors.push(String(err)));
  try{
    await page.goto(process.env.PLAY_ORIGIN+'/stepanoskin/loopforge',{waitUntil:'domcontentloaded'});
    await page.locator('a[href="/stepanoskin/loopforge/play"]').click();
    await button(/^Settings/).click();
    const quality=page.getByRole('combobox',{name:/^Quality/});
    await quality.selectOption('performance');await button('Return to menu').click();
    await page.reload();await button(/^Settings/).click();assert.equal(await quality.inputValue(),'performance');
    await button('Return to menu').click();await button(/^Enter factory/).click();
    await page.getByRole('heading',{name:'Day One'}).waitFor();
    await page.getByText('The fallen card',{exact:false}).first().waitFor({timeout:70000});
    await shot('day-one-security');
    await button('Answer leadership').waitFor({timeout:300000});
    const dayOne=await save();assert.equal(dayOne.source.pieces.length,3);
    await button('Answer leadership').click();await button('Receive the quota').click();
    await page.getByText(/Day 1 put 3 on the rack/).waitFor();await button('Acknowledge quota').click();
    await page.getByRole('heading',{name:'Post the supervisors'}).waitFor();
    await button('Main menu').click();await page.reload();await button(/^Resume shift/).click();
    assert.deepEqual((await save()).source,dayOne.source);
    await button(manual?/^STILETTO/:/^LIMEN/).click();
    await button('Commit assignment').click();
    if(manual){
      const clear=button('Clear Forge');
      await page.waitForFunction(()=>!!document.querySelector('button[aria-label="Clear Forge"]:enabled'),{},{timeout:210000});
      await button('Pause').click();assert.equal(await clear.isEnabled(),false);
      await shot('clear-paused');
      await recordAction(page,dir,'forge-clear',async()=>{
        await button('Resume').click();await clear.click();
        await page.getByText(/Rack \+2/).waitFor();
      });
      await shot('forge-arrival');
    }else{
      await button('Missing ID · inspect').waitFor({timeout:160000});
      await button('Pause').click();await button('Missing ID · inspect').click();
      const pass=button('Issue daily pass');assert.equal(await pass.isEnabled(),false);
      await button('Resume').click();await pass.click();
      await page.getByText('bob admitted on a daily pass.').waitFor();await button('Conveyor').click();
      await button(/^bob\b/i).click({timeout:85000});
      await button('Inspect Wash').click();await button('Pause').click();
      const send=button('Send bob to Wash'),frozen=await time();assert.equal(await send.isEnabled(),false);
      for(const width of [320,390,768]){
        await page.setViewportSize({width,height:width===768?900:720});
        await button('Inspect Belt').click();await button('Inspect Wash').click();
        assert.equal(await time(),frozen);assert.equal(await send.isEnabled(),false);
        const canvas=page.locator('canvas[aria-label^="Live factory floor"]');
        const box=await canvas.boundingBox(),order=await send.boundingBox();
        assert.ok(box.y>=0&&order.y+order.height<=await page.evaluate(()=>innerHeight),'Floor and order must fit together at '+width);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow');
        sizes.push({width,canvas:box,order});await shot('wash-paused-'+width);
      }
      await page.setViewportSize(size);await button('Inspect Wash').click();
      await recordAction(page,dir,'wash-order',async()=>{
        await button('Resume').click();await send.click();
        await page.getByText('bob · Wash',{exact:true}).waitFor();
      });
      await shot('wash-staffed');
      await button(/^jo\b/i).click();await button('Inspect Belt').click();await button('Send jo to Belt').click();
    }
    await page.getByRole('heading',{name:'Shift closed'}).waitFor({timeout:170000});
    const bell=await page.getByRole('heading',{name:/new rack arrivals/}).innerText();
    if(manual)assert.match(bell,/^2 /);else assert.ok(parseInt(bell)>0);
    await shot('bell');await button('Return to main menu').click();
    await button(/^Enter factory/).click();await page.getByRole('heading',{name:'Day One'}).waitFor();
    const fresh=await save();assert.equal(fresh.source,undefined);assert.notEqual(fresh.id,dayOne.id);
    assert.equal(fresh.phase,'intro');assert.equal(fresh.progress.commands.length,0);assert.deepEqual(errors,[]);
    console.log(JSON.stringify({origin:process.env.PLAY_ORIGIN,size,sizes,bell,errors}));
    await fs.writeFile(path.join(dir,'review.json'),JSON.stringify({origin:process.env.PLAY_ORIGIN,size,sizes,bell,errors},null,2));
  }catch(e){console.error((await page.locator('body').innerText()).slice(-2800));await shot('last-frame');throw e;}
  finally{
    await context.close();
    await browser.close();
  }
}
review().catch(e=>{console.error(e);process.exitCode=1;});
