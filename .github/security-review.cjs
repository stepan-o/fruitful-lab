const {chromium}=require('playwright');
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({args:['--no-sandbox']});
const root=path.resolve('apps/lab/public');
for(const [width,height] of [[1440,900],[768,900],[390,844],[320,693]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://study.local/**',async route=>{
  const name=new URL(route.request().url()).pathname;
  const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.webp':'image/webp','.json':'application/json'};
  try{await route.fulfill({body:await fs.readFile(path.join(root,name)),contentType:types[path.extname(name)]})}catch{await route.fulfill({status:404})}
 });
 await page.goto('https://study.local/loopforge-design/security-event/index.html');
 await page.waitForLoadState('networkidle');
 await page.screenshot({path:'screens/floor-'+width+'.jpg',quality:88,fullPage:true});
 await page.locator('#marker').click();
 await page.locator('#issue').waitFor();
 await page.locator('.painting img').evaluate(i=>i.decode());
 const bounds=await page.evaluate(()=>({w:document.documentElement.scrollWidth,source:document.querySelector('.painting img').currentSrc,issueBottom:document.querySelector('#issue').getBoundingClientRect().bottom,art:document.querySelector('.painting img').getBoundingClientRect().height}));
 assert.equal(bounds.w,width);assert(bounds.source.includes(width<=680?'portrait':'landscape'));
 await page.screenshot({path:'screens/case-'+width+'.jpg',quality:88,fullPage:true});
 await page.locator('#return').click();await page.locator('#marker').waitFor();assert.equal(await page.locator('#inventory').textContent(),'1 intervention available');
 assert(await page.locator('#marker').isVisible());
 await page.locator('#marker').focus();await page.keyboard.press('Enter');
 await page.locator('#issue').focus();await page.keyboard.press('Enter');await page.locator('#floor-receipt').waitFor();
 await page.screenshot({path:'screens/pass-'+width+'.jpg',quality:88,fullPage:true});
 assert((await page.locator('#floor-receipt').textContent()).includes('jo'));assert(!await page.locator('#marker').isVisible());assert.equal(await page.locator('#inventory').textContent(),'Intervention spent');
 await page.locator('summary').click();await page.locator('a[href="#expired"]').click();await page.waitForFunction(()=>!document.querySelector('#inspection').hidden);
 assert(!await page.locator('#issue').isVisible());await page.locator('#return').click();await page.waitForFunction(()=>!document.querySelector('#watch').hidden);assert((await page.locator('#floor-receipt').textContent()).includes('held until the bell'));
 assert.equal(errors.length,0);await page.close();console.log(width,height,JSON.stringify(bounds));
}
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
