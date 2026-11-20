// Record the ordinary route at wall-clock speed, then restore the same journal for the counterfactuals.
const {chromium}=require('playwright');
const fs=require('node:fs/promises'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const assert=require('node:assert/strict');
const route=process.argv[2],swap=route==='limen',origin=process.env.PLAY_ORIGIN;
const directory=path.resolve(process.env.REVIEW_DIR||'shift-evidence',route);
const size=swap?{width:1000,height:800}:{width:320,height:844};
const store='loopforge.playthrough.1';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
 await fs.mkdir(directory,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined,args:['--no-sandbox']});
 const runs=[],errors=[],clips=[];
 async function session(name,saved){
   const ctx=await browser.newContext({viewport:size,hasTouch:!swap,deviceScaleFactor:1,recordVideo:{dir:directory,size}});
   if(saved)await ctx.addInitScript(({saved,key})=>sessionStorage.setItem(key,saved),{saved,key:store});
   const start=Date.now(),page=await ctx.newPage();
   page.on('pageerror',e=>errors.push(String(e)));
   page.setDefaultTimeout(30000);
   runs.push({ctx,page,name,start});
   const button=name=>page.getByRole('button',{name,exact:typeof name==='string'});
   const seconds=()=>(Date.now()-start)/1000;
   const state=()=>page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),store);
   const clip=(title,at,length)=>clips.push({name,title,at:Math.max(0,at),length});
   const fit=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow');
   console.log('Opening',name,origin,size);
   await page.goto(origin+'/stepanoskin/loopforge',{waitUntil:'domcontentloaded'});
   await page.locator('a[href="/stepanoskin/loopforge/play"]').click();
   if(!saved){
     await button(/^Settings/).click();await page.getByRole('combobox',{name:/^Quality/}).selectOption('performance');
     await button('Return to menu').click();
     await button(/^Settings/).click();assert.equal(await page.getByRole('combobox',{name:/^Quality/}).inputValue(),'performance');
     await button('Return to menu').click();await fit();
     await button(/^Enter factory/).click();await page.getByRole('heading',{name:'Day One'}).waitFor();
     await page.getByRole('button',{name:'Answer leadership'}).waitFor({timeout:300000});
     const end=seconds();console.log('Day 1 departure',end);assert.equal((await state()).source.pieces.length,3);
     await button('Answer leadership').click();await page.getByText('Already on the rack').waitFor();
     await button('Receive the quota').click();await page.getByText(/Day 1 put 3 on the rack/).waitFor();await fit();
     await pause(1500);await button('Acknowledge quota').click();
     const chosen=swap?'STILETTO':'LIMEN';await button(new RegExp('^'+chosen)).click();
     assert.equal((await state()).progress.commands.length,0);await pause(1300);
     await button('Commit assignment').click();await page.getByText('CREW ARRIVAL',{exact:false}).first().waitFor();
     console.log('Day 2 assignment committed',chosen);
     clip('Day-1-blackout-to-walk-in',end-4,seconds()-end+9);
   }else await button(/^Resume shift/).click();
   return {page,button,state,clip,seconds,fit};
 }
 async function result(s){
   await s.page.getByRole('heading',{name:'Shift closed'}).waitFor({timeout:180000});
   await s.fit();const label=await s.page.getByRole('heading',{name:/new rack arrivals/}).innerText();
   s.clip('bell',s.seconds()-2,4);await pause(2200);return Number(label.split(' ')[0]);
 }
 async function sendTo(s,who,station){
   await s.button(new RegExp('^'+who+'\\b','i')).click({timeout:85000});
   await s.button('Send '+who+' to '+station).click();
 }
 try{
  const primary=await session('opening');let comparison;
  if(swap){
    const clear=primary.button('Clear Forge');
    await clear.waitFor({timeout:170000});
    await primary.page.waitForFunction(()=>Array.from(document.querySelectorAll('button')).some(b=>b.getAttribute('aria-label')==='Clear Forge'&&!b.disabled),{},{timeout:180000});
    const saved=JSON.stringify(await primary.state());
    console.log('Second Forge wait',JSON.parse(saved).progress.tick);const at=primary.seconds();await clear.click();primary.clip('Forge-clear',at-2,7);
    const other=await session('watch',saved);
    const [acted,watched]=await Promise.all([result(primary),result(other)]);
    assert.equal(acted,2);assert.equal(watched,1);
    comparison={acted,watched,tick:JSON.parse(saved).progress.tick};
  }else{
    const inspect=primary.button('Missing ID · inspect');
    await inspect.waitFor({timeout:160000});
    const saved=JSON.stringify(await primary.state());
    console.log('Regular route reached Security');const passAt=primary.seconds();
    await inspect.click();await primary.button('Issue daily pass').click();
    await primary.page.getByText('bob admitted on a daily pass.').waitFor();
    primary.clip('issue-daily-pass',passAt-1.0,4);
    await primary.button('Conveyor').click();
    async function staff(s,variant){
      if(variant!=='pass')await s.button('Conveyor').click();
      if(variant==='pass')await sendTo(s,'bob','Wash');
      await sendTo(s,'jo','Belt');
      if(variant==='recovery'){
        await s.button(/^kit\b/).click({timeout:85000});
        const at=s.seconds();await s.button('Send kit to Wash').click();
        const wash=s.page.getByRole('heading',{name:'Wash',exact:true}).locator('..');
        await wash.locator('b').first().filter({hasText:/\bkit\b/}).waitFor();
        await wash.scrollIntoViewIfNeeded();
        s.clip('recover-Wash',at-1,s.seconds()-at+3);
      }
      if(variant==='move'){
        await sendTo(s,'kit','Forge');
        await s.page.getByText('138 work units / tick',{exact:true}).waitFor();
        const at=s.seconds();
        await sendTo(s,'kit','Belt');
        await s.page.getByText('148 work units / tick',{exact:true}).waitFor();
        await s.page.getByText('96 work units / tick',{exact:true}).waitFor();s.clip('kit-Forge-to-Belt',at-2,s.seconds()-at+4);
      }
      return result(s);
    }
    const pass=staff(primary,'pass');
    const detention=(async()=>staff(await session('detention',saved),'detention'))();
    const recovery=(async()=>staff(await session('recovery',saved),'recovery'))();
    const moved=(async()=>{
      const s=await session('staffing',saved);await s.button('Missing ID · inspect').click();await s.button('Issue daily pass').click();
      await s.button('Conveyor').click();await sendTo(s,'bob','Wash');return staff(s,'move');
    })();
    const [p,d,r,m]=await Promise.all([pass,detention,recovery,moved]);assert.equal(d,0);assert.ok(r>0&&p>0&&m>0);
    comparison={pass:p,detention:d,recovery:r,moved:m};
  }
  await primary.button('Return to main menu').click();await primary.button(/^Enter factory/).waitFor();
  assert.deepEqual(errors,[]);
  await fs.writeFile(path.join(directory,'measurements.json'),JSON.stringify({origin,size,comparison,errors,clips},null,2));
  console.log(JSON.stringify({origin,size,comparison}));
 }catch(error){
  for(const run of runs){
    await run.page.screenshot({path:path.join(directory,run.name+'-last-frame.png')}).catch(()=>{});
    console.error(run.name,(await run.page.locator('body').innerText().catch(()=>'' )).slice(-4000));
  }
  throw error;
 }finally{
  for(const run of runs){
    const video=run.page.video();await run.ctx.close();const raw=await video.path();
    for(const c of clips.filter(c=>c.name===run.name)){
      execFileSync('ffmpeg',['-loglevel','error','-y','-ss',String(c.at),'-i',raw,'-t',String(c.length),'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',path.join(directory,run.name+'-'+c.title+'.mp4')]);
    }
    await fs.unlink(raw);
  }
  await browser.close();
 }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
