// Exercise the committed board under its canonical URL, entirely from checked-out assets.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {chromium} = require('playwright');
const assets = path.resolve(__dirname, '../../public');
const origin = 'https://loopforge.test';
const url = origin + '/stepanoskin/loopforge/design';
const mime = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json',
  '.md':'text/plain', '.mp3':'audio/mpeg', '.mp4':'video/mp4', '.webm':'video/webm', '.vtt':'text/vtt', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png'};

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
      const body = await fs.readFile(filename);
      const contentType = mime[path.extname(filename)] || 'application/octet-stream';
      const range = /^bytes=(\d+)-(\d*)$/.exec(route.request().headers().range || '');
      if (['audio/mpeg', 'video/mp4', 'video/webm'].includes(contentType) && range) {
        const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]),body.length-1) : body.length-1;
        await route.fulfill({status:206, contentType, body:body.subarray(start,end+1),
          headers:{'Accept-Ranges':'bytes','Content-Range': 'bytes '+start+'-'+end+'/'+body.length}});
      } else await route.fulfill({body,contentType});
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'EISDIR') throw error;
      await route.fulfill({status:404,body:''});
    }
  });
  await page.goto(url);
  const nav = page.locator('.nav button');
  const order = await nav.evaluateAll(buttons => buttons.map(el => el.dataset.panel));
  const dialogueIndex = order.indexOf('dialogue-engine');
  assert(dialogueIndex >= 0);
  assert.equal(order[dialogueIndex + 1], 'music-engine');
  assert.equal(order[0], 'studio');
  assert(await page.locator('#studio').isVisible());
  const musicTab = nav.filter({hasText: /^Music engine$/});
  const desiresTab = nav.filter({hasText: /^Player desires & scenarios$/});
  await musicTab.click();
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
  await page.goto(url + '#music-long-form');
  const menu = panel.locator('[data-theme-player="menu"]');
  const options = panel.locator('[data-theme-player="options"]');
  for (const deck of [menu, options, panel.locator('[data-theme-player="conveyor"]')]) {
    const media = deck.locator('audio');
    assert(await media.evaluate(a => a.paused && a.loop && a.preload === 'none'));
    await deck.locator('input').uncheck();
    assert.equal(await media.evaluate(a => a.loop), false);
    await deck.locator('input').check();
  }
  await menu.getByRole('button', {name:/Drum feature/}).click();
  await page.waitForFunction(() => {
    const a = document.querySelector('#music-long-menu audio');
    return !a.paused && a.currentTime >= 128 * 60 / 164 - .01 && a.currentTime < 50;
  });
  await menu.getByRole('button', {name:/Bass only/}).click();
  await page.waitForFunction(() => {
    const a = document.querySelector('#music-long-menu audio');
    return !a.paused && a.currentTime >= 256 * 60 / 164 - .01 && a.currentTime < 97;
  });
  await options.getByRole('button', {name:/Low tom/}).click();
  await page.waitForFunction(() => {
    const a = document.querySelector('#music-long-options audio');
    return !a.paused && a.currentTime >= 70 && a.currentTime < 74;
  });
  assert(await menu.locator('audio').evaluate(a => a.paused));
  await menu.screenshot({path:'music-review/'+width+'-long-menu.png'});
  const session = panel.locator('#music-listening');
  const grid = session.locator('[data-grid-player="grid"]');
  const speech = session.locator('[data-grid-player="speech"]');
  const score = grid.locator('audio');
  const picture = speech.locator('video');
  assert(await score.evaluate(a => a.paused && a.preload === 'none'));
  await grid.locator('[data-bar="17"]').click();
  await page.waitForFunction(() => {
    const a = document.querySelector('[data-grid-player="grid"] audio');
    return !a.paused && a.currentTime >= 64 * 60 / 170 && a.currentTime < 25;
  });
  await grid.locator('[data-tempo="164"]').click();
  await page.waitForFunction(() => {
    const a = document.querySelector('[data-grid-player="grid"] audio');
    return a.currentSrc.endsWith('grid-164.mp3') && !a.paused && a.currentTime >= 64 * 60 / 164 && a.currentTime < 26;
  });
  await grid.locator('[data-bar="45"]').click();
  assert(await score.evaluate(a => a.currentTime >= 176 * 60 / 164 - .01));
  await picture.evaluate(v => v.play());
  assert(await score.evaluate(a => a.paused));
  await picture.evaluate(v => { v.currentTime = 2; });
  await speech.locator('[data-tempo="164"]').click();
  await page.waitForFunction(() => {
    const v = document.querySelector('[data-grid-player="speech"] video');
    return /speech-164\.(mp4|webm)$/.test(v.currentSrc) && !v.paused && v.currentTime >= 1.9 && v.currentTime < 4;
  });
  await desiresTab.click();
  assert(await picture.evaluate(v => v.paused));
  await page.goto(url + '#music-listening');
  await page.reload();
  assert(await session.isVisible());
  assert(await fits(), 'Session 02 fits viewport');
  await grid.screenshot({path:'music-review/'+width+'-tempo.png'});
  const listening = panel.locator('#music-landing-01');
  const audio = listening.locator('audio');
  assert(await audio.evaluate(el=>el.paused));
  await listening.locator('[data-ms-seek="40"]').click();
  await page.waitForFunction(()=>{const a=document.querySelector('[data-ms-listen-audio]');return !a.paused && a.currentTime>=14 && a.currentTime<17;});
  const before = await audio.evaluate(el=>el.currentTime);
  await listening.locator('[data-ms-take="a"]').click();
  await page.waitForFunction(t=>{const a=document.querySelector('[data-ms-listen-audio]');return a.currentSrc.endsWith('landing-a.mp3') && !a.paused && a.currentTime>=t-.2 && a.currentTime<t+2;},before);
  await listening.locator('[data-ms-seek="0"]').click();
  await page.waitForFunction(()=>document.querySelector('[data-ms-listen-audio]').currentTime<2);
  await listening.screenshot({path:'music-review/'+width+'-listening.png'});
  await desiresTab.click(); assert(await audio.evaluate(el=>el.paused));
  await musicTab.click();
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
  await desiresTab.click(); assert(await page.locator('#player-desires').isVisible());
  assert.equal(errors.length,0,errors.join('\n'));
  console.log(width+'×'+height+' passed navigation, layout, fixtures and deep link');
  await page.close();
}
(async () => {
  await fs.mkdir('music-review',{recursive:true});
  const browser = await chromium.launch(process.env.LOOPFORGE_CHROMIUM ? {executablePath:process.env.LOOPFORGE_CHROMIUM} : {});
  try {
    for (const [width,height] of [[1440,900],[768,1024],[390,844],[320,700]]) await check(browser,width,height);
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
