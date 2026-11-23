const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');

const id=process.argv[2];
const groups={
  security:['missing-pass','missing-detention'],
  conveyor:['chat-rushed','chat-slow'],
  morning:['morning-limen','morning-stiletto'],
  clash:['clash-unaided','clash-limen','clash-stiletto']
};
const check=(condition,message)=>assert.ok(condition,message);
async function record(browser,name){
 const mobile=id==='security',size=mobile?{width:320,height:844}:{width:900,height:780};
 const out=path.resolve('shift-evidence',name);
 await fs.mkdir(out,{recursive:true});
 const context=await browser.newContext({viewport:size,hasTouch:mobile,deviceScaleFactor:1,recordVideo:{dir:out,size}});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',err=>errors.push(String(err)));
 page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.addInitScript(()=>{
   window.journal=new Map();
   window.addEventListener('loopforge:frame',({detail})=>{
     window.current=detail;
     for(const ev of detail.scene.events)window.journal.set(ev.seq,ev);
   });
 });
 await page.goto(process.env.SHIFT_URL||'http://127.0.0.1:4173/loopforge-shifts/index.html');
 const f=require('../../public/loopforge-shifts/fixtures/'+name+'.json');
 await page.waitForFunction(()=>!!window.current);
 await page.selectOption('#checkpoint',f.scenario);
 if(f.scenario==='Morning bids')await page.click('#restore');
 await page.waitForFunction(h=>window.current.hash===h,f.result.initial_public_hash);
 const btn=s=>page.locator(s),tap=s=>mobile?btn(s).tap():btn(s).click();
 const event=(kind,who)=>page.waitForFunction(([k,a])=>Array.from(window.journal.values()).some(e=>e.kind===k&&(!a||e.actor===a)),[kind,who],{timeout:230000});
 const shot=n=>page.screenshot({path:path.join(out,n+'.png')});
 const meta={scenario:name,size,initial:f.result.initial_public_hash,engine_hz:20};
 if(id==='security'){
  await tap('#play');
  if(name==='missing-pass'){
   await tap('#signal');
   await page.waitForTimeout(6500);
   const geometry=await page.evaluate(()=>{
     const pos=id=>{const r=document.querySelector(id).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};};
     return {floor:pos('#room'),signal:pos('#signal'),decision:pos('#decision'),pass:pos('#pass'),width:document.documentElement.scrollWidth,mandate:document.querySelector('#mandate').textContent,
       remaining:(current.scene.world.deadline-current.tick)/20,actors:current.scene.agents.filter(a=>['bob','LIMEN','jo'].includes(a.id))};
   });meta.decision=geometry;
   check(geometry.signal.top>=geometry.floor.top&&geometry.signal.bottom<=geometry.floor.bottom&&geometry.signal.right<=geometry.floor.right&&geometry.signal.left>=geometry.floor.left,'Signal is outside the desk camera');
   check(geometry.mandate==='Intervention ready','Opening the signal consumed a mandate');
   check(geometry.width===320&&geometry.floor.top>=0&&geometry.decision.top>=geometry.floor.bottom&&geometry.pass.bottom<=844,'Decision obscures floor or exceeds viewport');
   check(geometry.remaining>2&&geometry.remaining<10,'Decision window left insufficient reading time');
   check(geometry.actors.length===3&&geometry.actors.every(a=>a.room==='security'),'Missing cast');
   await shot('desk-open');await tap('#pass');
   await event('queue.advanced','jo');await shot('line-resumes');
  }else{
   await tap('[data-room="conveyor"]');await event('case.resolved','LIMEN');
   await page.waitForFunction(()=>document.querySelector('#report').textContent.includes('LIMEN')&&document.querySelector('#staff').textContent.includes('WashUncovered'));
   await shot('coverage-and-report');await tap('[data-room="security"]');await event('queue.advanced','jo');await shot('line-resumes');
  }
 }else if(id==='morning'){
  await tap('[data-bid="'+(name.endsWith('stiletto')?'STILETTO':'LIMEN')+'"]');
  await tap('#commit');
  await page.waitForTimeout(2700);await tap('[data-room="conveyor"]');await shot('morning');
 }else{
  if(name==='chat-slow')await tap('#slow');
  if(name==='clash-limen')await tap('#limen');
  if(name==='clash-stiletto')await tap('#stiletto');
  await tap('#play');
  await page.waitForTimeout(id==='conveyor'?5150:8500);await shot('decision');
 }
 await page.waitForFunction(()=>window.current.scene.world.phase==='close',null,{timeout:230000});
 await btn('#summary').waitFor();await shot('bell');
 const terminal=await page.evaluate(()=>({hash:current.hash,rack:current.scene.world.shiftOutput,
   events:Array.from(journal.values()),counter:document.querySelector('#summary').textContent,status:document.querySelector('#status').textContent}));
 if(name!=='missing-pass'){assert.equal(terminal.hash,f.result.terminal_public_hash,name+' terminal');assert.equal(terminal.rack,f.result.rack_this_shift);}
 check(terminal.status===''&&errors.length===0,'Browser errors '+JSON.stringify([terminal.status,errors]));
 Object.assign(meta,{terminal,errors});
 await fs.writeFile(path.join(out,'observations.json'),JSON.stringify(meta,null,2));
 const video=page.video();await context.close();
 await fs.rename(await video.path(),path.join(out,name+'-1x.webm'));
 console.log(name,terminal.counter,meta.decision?.remaining??'',terminal.hash);
}
(async()=>{
 const browser=await chromium.launch();
 try{for(const name of groups[id])await record(browser,name);}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
