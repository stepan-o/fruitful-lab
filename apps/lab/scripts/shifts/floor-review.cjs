// Exercise the shipped bundles with real input and the normal worker clock.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {chromium} = require('playwright');
const held = require('../../public/loopforge-shifts/fixtures/missing-pass.json');
const chat = require('../../public/loopforge-shifts/fixtures/chat-rushed.json');
const out = path.resolve('shift-evidence/floors');

async function record(browser, build, viewport) {
  const touch = viewport.width === 320;
  const context = await browser.newContext({viewport, deviceScaleFactor: 1, hasTouch: touch,
    recordVideo: {dir: out, size: viewport}});
  const page = await context.newPage();
  const errors = [], urls = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', req => errors.push(req.url()));
  page.on('response', res => {
    if (res.status() >= 400) errors.push(res.status() + ' ' + res.url());
    if (res.url().includes('/floor-correction/')) urls.push(res.url().split('/').pop());
  });
  await page.addInitScript(() => {
    window.addEventListener('loopforge:frame', ({detail}) => { window.frame = detail; });
    // Observe actual canvas calls without changing pixels or supplying state to the viewer.
    window.rasters = [];
    const decoded = window.decodes = [];
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      if (this.src.includes('/floor-correction/')) decoded.push(this.src.split('/').pop());
      return decode.call(this);
    };
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
      if (image instanceof HTMLImageElement && image.src.includes('/floor-correction/')) {
        let raster = rasters.find(r => r.canvas === this.canvas);
        if (!raster) {
          raster = {canvas: this.canvas, calls: []};
          rasters.push(raster);
        }
        raster.calls.push({file: image.src.split('/').pop(), args,
          crisp: !this.imageSmoothingEnabled && this.globalAlpha === 1 && this.globalCompositeOperation === 'source-over'});
      }
      if (this.canvas.id === 'room' && image instanceof HTMLCanvasElement && rasters.some(r => r.canvas === image)) {
        window.visibleRaster = rasters.findIndex(r => r.canvas === image);
      }
      return draw.call(this, image, ...args);
    };
  });
  const activate = selector => touch ? page.tap(selector) : page.click(selector);
  const restore = async fixture => {
    await page.selectOption('#checkpoint', fixture.scenario);
    await page.waitForFunction(hash => window.frame?.hash === hash, fixture.result.initial_public_hash);
  };
  const label = build + '-' + viewport.width;
  const snap = async name => {
    await page.locator('#room').scrollIntoViewIfNeeded();
    await page.screenshot({path: path.join(out, label + '-' + name + '.jpg'), type: 'jpeg', quality: 87});
  };
  const readRaster = () => page.evaluate(() => ({id: visibleRaster, count: rasters.length}));
  const candidate = build === 'after';
  try {
    await page.goto(process.env[candidate ? 'SHIFT_AFTER' : 'SHIFT_BEFORE']);
    await restore(held);
    const sec = candidate && await readRaster();
    assert.equal(await page.locator('#policy').textContent(), 'Line held');
    await snap('held');
    await page.waitForTimeout(700);
    await activate('#signal');
    assert.equal(await page.locator('#pass').isEnabled(), true);
    await page.waitForTimeout(550);
    await activate('#pass');
    await page.waitForFunction(() => frame.scene.world.pass?.valid);
    await activate('#watch');
    await activate('#play');
    await page.waitForFunction(() => frame.scene.events.some(e => e.kind === 'queue.advanced' && e.actor === 'jo'));
    await snap('pass');
    await page.waitForFunction(tick => frame.tick >= tick + 65, held.initial.tick);
    if (candidate) assert.deepEqual(await readRaster(), sec);
    await restore(chat);
    const belt = candidate && await readRaster();
    await snap('wash');
    await activate('#play');
    await page.waitForFunction(() => frame.scene.events.some(e => e.kind === 'chat.interrupted'));
    await snap('speech');
    await page.waitForFunction(() => frame.scene.events.some(e => e.kind === 'rack.arrival' && e.subject === 'D2-C1'));
    await snap('rack');
    if (candidate) assert.deepEqual(await readRaster(), belt);
    await activate('#play');
    await activate('[data-room="security"]');
    if (candidate) assert.equal((await readRaster()).id, sec.id);
    await activate('[data-room="conveyor"]');
    if (candidate) assert.deepEqual(await readRaster(), belt);
    await page.setViewportSize({width: touch ? 390 : 768, height: viewport.height});
    if (candidate) await page.waitForFunction(id => visibleRaster !== id, belt.id);
    await restore(held);
    await page.setViewportSize(viewport);
    await restore(chat);
    await restore(held);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), viewport.width);
    assert.deepEqual(errors, []);
    const rasters = candidate ? await page.evaluate(() => window.rasters.map(({canvas, calls}) => {
      const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      let gaps = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] !== 255) gaps++;
      return {size: [canvas.width, canvas.height], material: calls[0].file, overlay: calls.at(-1).file,
        rect: calls.at(-1).args, crisp: calls.every(c => c.crisp), gaps,
        overlayDraws: calls.filter(c => c.file.endsWith('-room.webp')).length};
    })) : [];
    const files = ['conveyor-material.webp','conveyor-room.webp','security-material.webp','security-room.webp'];
    assert.deepEqual(urls.sort(), candidate ? files : []);
    assert.deepEqual(await page.evaluate(() => decodes.sort()), candidate ? files : []);
    for (const r of rasters) {
      assert.equal(r.gaps, 0);
      assert.equal(r.overlayDraws, 1);
      assert(r.crisp);
      assert.equal(r.overlay, r.material.replace('-material', '-room'));
    }
    return {build, viewport, touch, version: browser.version(), hashes: [held,chat].map(f => f.initial.step_hash),
      rasters, floorRequests: urls, errors};
  } finally {
    const video = page.video();
    await context.close();
    await video.saveAs(path.join(out, label + '.webm'));
    await video.delete();
  }
}
(async () => {
  await fs.mkdir(out, {recursive: true});
  const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || undefined});
  try {
    const runs = [];
    for (const width of [1280, 320]) {
      for (const build of ['before', 'after']) {
        const run = await record(browser, build, {width, height: width === 320 ? 740 : 860});
        runs.push(run);
        console.log(JSON.stringify(run));
      }
    }
    await fs.writeFile(path.join(out,'runs.json'), JSON.stringify({before:process.env.BASE_SHA, after:process.env.GITHUB_SHA, runs},null,2));
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
