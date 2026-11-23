// Use a server running apps/lab/public, or pass the review deployment origin.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.argv[2];
if (!origin) throw Error('Pass the review origin');
(async () => {
  const browser = await chromium.launch({args:['--no-sandbox']});
  try {
    for (const width of [320,390,768,1440]) {
      const page = await browser.newPage({viewport:{width,height:900}});
      const errors=[];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(origin+'/loopforge-design/forge-study/index.html');
      const button = name => page.getByRole('button',{name,exact:true});
      const state = () => page.locator('figure.frame:visible');
      assert.equal(await state().count(),1);
      assert.equal(await page.locator('.frame figcaption:visible').count(),0);
      const overflow = () => page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      assert.equal(await overflow(),false);
      for (const device of ['Desktop','Phone']) {
        await button(device).focus();
        await page.keyboard.press('Enter');
        for (const title of ['Wide view','First still','Second still','Third still']) {
          await button(title).focus();
          await page.keyboard.press('Space');
          assert.equal(await state().locator('a:visible').count(),1);
          const img=state().locator('a:visible img');
          await img.evaluate(img=>img.decode());
          assert.ok(await img.evaluate(img=>img.naturalWidth===Number(img.getAttribute('width'))));
          assert.ok(await state().locator('a:visible').getAttribute('href').then(h=>h.startsWith(device.toLowerCase()+'-')));
          assert.equal(await overflow(),false);
        }
      }
      await button('Compare three stills').click();
      assert.equal(await state().count(),3);
      await button('Show annotations').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('.frame figcaption:visible').count(),3);
      await page.getByText('As the command is sent',{exact:true}).scrollIntoViewIfNeeded();
      assert.equal(await page.locator('.marked:visible').count(),2);
      assert.equal(await overflow(),false);
      const images=await page.locator('img').evaluateAll(els=>Promise.all(els.map(async i=>{i.loading='eager';await i.decode();return i.naturalWidth;})));
      assert.ok(images.every(n=>n>0));
      assert.deepEqual(errors,[]);
      console.log(width+'px: camera states, both device selectors, keyboard, clean/annotated sequence, evidence images and overflow passed');
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
