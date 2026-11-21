// Exercise the same menu, workers, clock and production controls as an owner playtest.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const regular=process.argv[2]==='stiletto';
const directory=path.join('shift-evidence',process.argv[2]);
async function play(){
  await fs.mkdir(directory,{recursive:true});
  const browser=await chromium.launch({args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:regular?{width:390,height:844}:{width:1280,height:800}});
    const errors=[];page.on('pageerror',e=>errors.push(String(e)));
    page.setDefaultTimeout(90000);
    const button=name=>page.getByRole('button',{name,exact:typeof name==='string'});
    const snap=name=>page.screenshot({path:path.join(directory,name+'.png')});
    const read=()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('loopforge.playthrough.1')));
    const clock=page.getByLabel('Factory time');
    await page.goto(process.env.PLAY_ORIGIN+'/stepanoskin/loopforge',{waitUntil:'domcontentloaded'});
    await page.locator('a[href="/stepanoskin/loopforge/play"]').first().click();
    const dev=page.getByRole('switch',{name:'Dev mode'});
    await dev.check();await dev.uncheck();await snap('menu');
    if(regular){
      await button(/^Enter factory/).click();
      for(const [index,name] of ['Intake','Wash','Belt','Forge','Intake','Wash','Belt','Forge'].entries()){
        const order=button(new RegExp('^'+name+' ·'));
        await order.waitFor();
        if(index===0){const before=await clock.textContent();await page.waitForTimeout(1100);assert.equal(await clock.textContent(),before);await snap('first-station');}
        await order.click();
      }
    }else{
      await button(/^Enter factory/).click();await button('Skip to Day 2').click();
      await button('Answer leadership').waitFor();const skipped=await read();
      await button('Main menu').click();await button('2nd day').click();
      await button('Answer leadership').waitFor();assert.deepEqual((await read()).source,skipped.source);
    }
    await button('Answer leadership').click();assert.equal((await read()).source.pieces.length,3);
    await button('Receive the quota').click();await button('Acknowledge quota').click();
    await button(regular?/^LIMEN/:/^STILETTO/).click();await button('Commit assignment').click();
    if(regular){
      async function assign(crew){
        for(const [i,name] of ['Intake','Wash','Belt','Forge'].entries()){
          await button(new RegExp('^'+crew[i]+'(?: |$)')).click();
          await button('Send '+crew[i]+' to '+name).click();
        }
      }
      await page.getByText(/Give each operator two stations/).waitFor();await snap('two-operators');
      await assign(['sam','sam','max','max']);
      await button(/^Missing ID/).click();await snap('missing-card');await button('Issue daily pass').click();
      await page.getByText(/Daily pass granted/).waitFor();
      await page.getByText(/Assign a different operator/).waitFor();await assign(['sam','bob','jo','max']);
      await page.getByText(/More crew at the entrance/).waitFor();await snap('live-arrivals');
      if(await button('Assign crew').isVisible())await button('Assign crew').click();
      await button(/^kit(?: |$)/).click();await button('Inspect Wash').click();await button('Send kit to Wash').click();
    }else{
      const forge=button('Clear Forge');await forge.waitFor();
      await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.getAttribute('aria-label')==='Clear Forge'&&!b.disabled),{},{timeout:180000});
      await forge.click();await snap('forge');
    }
    await page.getByRole('heading',{name:'Shift closed'}).waitFor({timeout:250000});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await snap('bell');assert.deepEqual(errors,[]);
  }finally{await browser.close();}
}
play().catch(err=>{console.error(err);process.exitCode=1;});
