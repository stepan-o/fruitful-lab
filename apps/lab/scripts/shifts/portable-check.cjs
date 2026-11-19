const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const fixture=require('../../public/loopforge-shifts/fixtures/missing-pass.json');

async function main(){
  const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined});
  try{
    const context=await browser.newContext({viewport:{width:320,height:844},hasTouch:true,offline:true});
    const page=await context.newPage();
    const network=[],errors=[];
    page.on('pageerror',err=>errors.push(err.message));
    page.on('request',req=>{if(/^https?:/.test(req.url()))network.push(req.url());});
    await page.addInitScript(()=>window.addEventListener('loopforge:frame',e=>{window.scene=e.detail;}));
    await page.goto(pathToFileURL(path.resolve(process.argv[2])).href);
    await page.selectOption('#checkpoint','Missing ID');
    await page.waitForFunction(expected=>window.scene?.hash===expected,fixture.initial.step_hash);
    await page.tap('#play');
    await page.tap('#signal');
    assert.equal(await page.locator('#mandate').innerText(),'Intervention ready');
    await page.tap('#pass');
    await page.waitForFunction(()=>window.scene.scene.events.some(e=>e.kind==='queue.advanced'&&e.actor==='jo'));
    await page.selectOption('#checkpoint','Conveyor chat');
    await page.tap('#slow');
    await page.tap('#play');
    await page.waitForFunction(()=>window.scene.scene.events.some(e=>e.kind==='credential.returned'&&e.subject==='bob'));
    assert.deepEqual(network,[]);assert.deepEqual(errors,[]);
    console.log('Offline file passed at 320 px. jo advanced and ed returned the original to bob. External requests: 0.');
  }finally{await browser.close();}
}
main().catch(err=>{console.error(err);process.exitCode=1;});
