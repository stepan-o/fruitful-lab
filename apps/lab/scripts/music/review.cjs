// Exercise the committed board under its canonical URL, entirely from checked-out assets.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {chromium} = require('playwright');
const assets = path.resolve(__dirname, '../../public');
const origin = 'https://loopforge.test';
const url = origin + '/stepanoskin/loopforge/design';
const mime = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json',
  '.md':'text/plain', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png'};

async function check(browser, width, height) {
  const page = await browser.newPage({viewport:{width, height}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const request = new URL(route.request().url());
    if (request.origin !== origin) return route.abort();
    let name = request.pathname;
    if (name === '/stepanoskin/loopforge/design') name = '/loopforge-design/index.html';
    const filename = path.join(assets, name);
    try {
      await route.fulfill({body:await fs.readFile(filename), contentType:mime[path.extname(filename)] || 'application/octet-stream'});
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'EISDIR') throw error;
      await route.fulfill({status:404,body:''});
    }
  });
  await page.goto(url);
  const nav = page.locator('.nav button');
  assert.deepEqual(await nav.evaluateAll(list=>list.slice(0,3).map(el=>el.textContent)),
    ['Studio briefs','Music engine','Player desires & scenarios']);
  assert(await page.locator('#studio').isVisible());
  await nav.nth(1).click();
  assert.equal(new URL(page.url()).hash,'#music-engine');
  const panel = page.locator('#music-engine');
  assert(await panel.isVisible());
  const field = name => panel.locator('[data-ms="' + name + '"]');
  const action = name => panel.locator('[data-ms-action="' + name + '"]');
  const has = async (name, phrase) => assert((await field(name).textContent()).includes(phrase),name+' should show '+phrase);
  const fits = () => panel.evaluate(el=>el.getBoundingClientRect().right <= innerWidth + 1 && el.scrollWidth<=el.clientWidth+1);
  assert(await fits(),'Panel fits viewport');
  await panel.locator('.ms-cover').screenshot({path:'music-review/'+width+'-motif.png'});
  await panel.locator('.ms-pulse').screenshot({path:'music-review/'+width+'-beat.png'});
  await panel.locator('.ms-routing').screenshot({path:'music-review/'+width+'-signal.png'});
  await field('position').selectOption('options');
  await has('pending','Settings / Options at next bar');
  await action('bar').click(); await has('phrase','Drums alone');
  await field('position').selectOption('security');
  await field('position').selectOption('conveyor'); await action('bar').click();
  await has('arrangement','Conveyor'); await action('hold').click(); await has('phrase','Bass gap');
  await action('move').click(); await has('pending','carrier.moved'); await action('repeat').click();
  await has('receipt','duplicate'); await action('beat').click(); await has('phrase','Single bass answer');
  await action('move').click(); await action('beat').click(); await has('phrase','Linked bass riff');
  await action('move').click(); await action('jam').click(); await action('bell').click();
  await action('beat').click(); await has('phrase','Bell phrase ending');
  await field('speech').check(); await action('move').click(); await has('receipt','protecting speech');
  await field('speech').uncheck(); await field('pressure').selectOption('0.9');
  await action('beat').click(); await action('beat').click(); await has('mix','dense');
  await field('pause').check(); assert(await action('beat').isDisabled());
  await field('pause').uncheck(); await has('pending','No change'); await action('stale').click(); await has('receipt','older');
  await field('mute').check(); await action('reset').click(); await has('mix','Muted'); await has('arrangement','Main menu');
  assert(await action('repeat').isDisabled()); await field('mute').uncheck();
  await field('position').selectOption('conveyor'); await action('bar').click(); await action('hold').click();
  await panel.locator('.ms-console').screenshot({path:'music-review/'+width+'-fixture.png'});
  for (const detail of await panel.locator('.ms-details details').all()) {
    await detail.locator('summary').click();
    assert(await fits(),'Expanded notes fit viewport');
    assert(await detail.locator('.ms-copy').isVisible());
    await detail.locator('summary').click();
  }
  await page.goto(url+'#music-engine'); await page.reload(); assert(await panel.isVisible());
  await nav.nth(2).click(); assert(await page.locator('#player-desires').isVisible());
  assert.equal(errors.length,0,errors.join('\n'));
  console.log(width+'×'+height+' passed navigation, layout, fixtures and deep link');
  await page.close();
}
(async () => {
  await fs.mkdir('music-review',{recursive:true});
  const browser = await chromium.launch();
  try {
    for (const [width,height] of [[1440,900],[390,844]]) await check(browser,width,height);
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
