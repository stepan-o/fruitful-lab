const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const lab=path.resolve('apps/lab');
require(path.join(lab,'scripts/shifts/typescript.cjs'));
const {Intro}=require(path.join(lab,'lib/loopforge/intro/simulation.ts'));
const {departure}=require(path.join(lab,'lib/loopforge/intro/shift-handoff.ts'));
const {start,step,intent,admitCommand}=require(path.join(lab,'lib/loopforge/shifts/simulation.ts'));
const intro=new Intro();while(!intro.finished)intro.step();
const source=departure(intro),s=start('early',source);
s.guided=true;
const appoint=intent(s,'ui-appointment','appoint','STILETTO','security');
assert.ok(admitCommand(s,appoint).accepted);
for(let i=0;i<12000&&!s.line.handoff;i++)step(s);
assert.ok(s.line.handoff);
const saved={version:1,id:'ui-forge-study',phase:'floor',quota:60,seconds:0,source,progress:{guided:true,tick:s.tick,commands:[appoint]},room:'conveyor',shotSeq:s.line.shotSeq};
const dir='ui-capture';fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox']});
 try{
  for(const [name,width,height] of [['desktop',1280,820],['phone',390,844]]){
   const ctx=await browser.newContext({viewport:{width,height},hasTouch:name==='phone'}),page=await ctx.newPage();
   await page.addInitScript(run=>{if(!sessionStorage.getItem('loopforge.playthrough.1'))sessionStorage.setItem('loopforge.playthrough.1',JSON.stringify(run))},saved);
   await page.goto('https://www.fruitfulab.net/stepanoskin/loopforge/play',{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:/resume|continue shift|enter factory/i}).first().click();
   const clear=page.getByRole('button',{name:'Clear Forge',exact:true});
   if(name==='phone')await page.getByRole('button',{name:'Inspect Forge',exact:true}).click();
   await clear.waitFor();
   await page.waitForFunction(()=>{const c=document.querySelector('canvas[aria-label*="factory floor"]');return c&&c.width>300&&!!c.getContext('2d').getImageData(10,10,1,1).data[3]});
   const summary=[];
   async function snap(key){
    const bounds=await page.locator('canvas[aria-label*="factory floor"]').boundingBox();
    const state=await page.evaluate(()=>({tick:JSON.parse(sessionStorage.getItem('loopforge.playthrough.1')).progress.tick,station:document.querySelector('[aria-label="Clear Forge"]')?.parentElement?.innerText}));
    summary.push({key,width,height,bounds,...state});
    await page.screenshot({path:dir+'/'+name+'-'+key+'.jpg',quality:83});
   }
   await snap('wait');await clear.click();
   await snap('sent');await page.waitForTimeout(780);await snap('after');
   fs.writeFileSync(dir+'/'+name+'.json',JSON.stringify(summary));
   await ctx.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
