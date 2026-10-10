// Run against a production server. PLAYWRIGHT_MODULE can point to a supplied runtime.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4182";
const out = process.env.EVIDENCE_DIR || "/tmp/otra-vista-evidence";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const errors = [];
const report = { viewports: [], flows: [], errors };
const key = "otra-vista-journal-v1";
const fixture = path.resolve("apps/lab/assets/sources/mexico-city/zocalo.webp");
const waitForArt = async page => {
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  await page.waitForTimeout(1100);
};
const screenshot = async (page, name) => page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
const readSave = page => page.evaluate(key => JSON.parse(localStorage.getItem(key) || "null"), key);
try {
  for (const width of [320, 390, 768, 1440]) {
    console.log(`Checking ${width}px…`);
    const context = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 960 }, deviceScaleFactor: width < 700 ? 2 : 1, hasTouch: width < 700 });
    const page = await context.newPage();
    page.on("pageerror", e => errors.push(e.message));
    await page.addInitScript(() => {
      window.__metrics = { lcp: 0, cls: 0 };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__metrics.lcp = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__metrics.cls += entry.value; }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(`${base}/mexico-city`);
    await page.getByRole("button", { name: "Field journal", exact: false }).waitFor();
    await waitForArt(page);
    assert.equal(await page.locator(".ov-borough").count(), 16);
    const cold = await page.evaluate(() => ({ ...window.__metrics, overflow: document.documentElement.scrollWidth > innerWidth, mapTop: document.querySelector(".ov-map").getBoundingClientRect().top, images: performance.getEntriesByType("resource").filter(r => r.name.includes("/media/files/")).map(r => ({ file: new URL(r.name).pathname, encodedBytes: r.encodedBodySize, transferBytes: r.transferSize })), chosenImages: [...document.images].map(i => ({ file: new URL(i.currentSrc).pathname, displayWidth: i.width, naturalWidth: i.naturalWidth })), smallButtons: [...document.querySelectorAll(".ov-game button")].filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 43.5 || r.height < 43.5); }).map(b => b.getAttribute("aria-label") || b.textContent) }));
    assert.equal(cold.overflow, false, `horizontal overflow at ${width}`);
    assert.deepEqual(cold.smallButtons, [], `small controls at ${width}`);
    assert(cold.images.reduce((n, i) => n + i.encodedBytes, 0) < (width < 700 ? 350000 : 800000));
    await screenshot(page, `city-${width}`);
    await page.reload(); await waitForArt(page);
    const warm = await page.evaluate(() => ({ ...window.__metrics, images: performance.getEntriesByType("resource").filter(r => r.name.includes("/media/files/")).map(r => ({ file: new URL(r.name).pathname, encodedBytes: r.encodedBodySize, transferBytes: r.transferSize })) }));
    report.viewports.push({ width, height: width < 700 ? 844 : 960, dpr: width < 700 ? 2 : 1, cold, warm });
    const borough = page.locator("button.ov-landmark").filter({ hasText: "Cuauhtémoc" });
    if (width < 700) await borough.tap(); else { await borough.focus(); await page.keyboard.press("Enter"); }
    await waitForArt(page); await screenshot(page, `borough-${width}`);
    await page.getByRole("button", { name: "Explore Centro Histórico", exact: true }).click();
    await waitForArt(page); await screenshot(page, `zone-${width}`);
    for (const label of await page.locator(".ov-pin-label").all()) {
      assert(await label.evaluate(element => { const r = element.getBoundingClientRect(); return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest("button") === element.closest("button"); }), `overlapped place label at ${width}`);
    }
    await page.getByRole("button", { name: "Explore Zócalo", exact: true }).click();
    await waitForArt(page); await screenshot(page, `place-${width}`);
    await page.getByRole("button", { name: "Save for a wander" }).click();
    await page.getByRole("button", { name: "Open the story" }).click();
    await waitForArt(page); await screenshot(page, `story-today-${width}`);
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator(".ov-story-progress").getAttribute("aria-label"), "Chapter 2 of 4");
    await waitForArt(page); await screenshot(page, `story-past-${width}`);
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.locator(".ov-story-progress").getAttribute("aria-label"), "Chapter 1 of 4");
    if (width < 700) {
      const touch = await context.newCDPSession(page);
      await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 250, y: 220 }] });
      await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 90, y: 220 }] });
      await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await touch.detach();
      assert.equal(await page.locator(".ov-story-progress").getAttribute("aria-label"), "Chapter 2 of 4");
    }
    await page.getByRole("button", { name: "Chapter 4", exact: true }).click();
    await page.getByRole("button", { name: "Collect this story" }).click();
    assert.equal((await readSave(page)).players.Susy.zocalo.read, true);
    await page.getByRole("button", { name: "Add a visit or photo" }).click();
    await page.getByRole("checkbox", { name: "I went here" }).check();
    await page.getByRole("textbox", { name: "A detail I noticed" }).fill("An open space with a hidden story.");
    await page.locator('.ov-photo-button input[type="file"]').setInputFiles(fixture);
    await page.getByRole("status").filter({ hasText: "Photograph added" }).waitFor();
    const saved = await readSave(page);
    assert.equal(saved.players.Susy.zocalo.saved, true);
    assert.equal(saved.players.Susy.zocalo.visited, true);
    assert(saved.players.Susy.zocalo.photo.startsWith("data:image/jpeg;base64,"));
    assert(saved.players.Susy.zocalo.photo.length <= 260000);
    assert.equal(Object.keys(saved.players.Stepan).length, 0);
    await page.locator(".ov-journal-dialog").evaluate(dialog => { dialog.scrollTop = 0; });
    await screenshot(page, `journal-${width}`);
    await page.getByRole("button", { name: "Stepan Switch explorer" }).click();
    await page.getByRole("checkbox", { name: "I went here" }).check();
    assert.equal((await readSave(page)).players.Stepan.zocalo.visited, true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog[open]").count(), 0);
    await page.reload(); await waitForArt(page);
    assert.match(await page.locator(".ov-bottom").innerText(), /Playing as\s+Stepan/);
    assert.equal((await readSave(page)).players.Susy.zocalo.note, "An open space with a hidden story.");
    await page.getByRole("button", { name: "Field journal", exact: false }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export journal" }).click();
    const download = await downloadPromise;
    await download.saveAs(`${out}/journal-fixture-${width}.json`);
    const importer = await browser.newContext({ viewport: { width, height: 844 } });
    const other = await importer.newPage(); await other.goto(`${base}/mexico-city`);
    await other.getByRole("button", { name: "Field journal", exact: false }).click();
    await other.locator('.ov-journal-footer input[type="file"]').setInputFiles(`${out}/journal-fixture-${width}.json`);
    await other.getByRole("status").filter({ hasText: "Journals combined" }).waitFor();
    assert.equal((await readSave(other)).players.Susy.zocalo.note, saved.players.Susy.zocalo.note);
    const invalid = { version: 1, players: { Susy: { zocalo: { photo: "https://example.com/image.jpg" } }, Stepan: {} } };
    await other.locator('.ov-journal-footer input[type="file"]').setInputFiles({ name: "invalid.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(invalid)) });
    await other.getByRole("status").filter({ hasText: "unsupported photograph" }).waitFor();
    assert.equal((await readSave(other)).players.Susy.zocalo.note, saved.players.Susy.zocalo.note);
    await other.keyboard.press("Escape");
    assert(await other.locator(".ov-journal-toggle").evaluate(el => document.activeElement === el));
    await importer.close();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Otra Vista, return to city" }).click();
    await page.goBack();
    assert.equal(new URL(page.url()).searchParams.get("place"), "zocalo");
    report.flows.push({ width, result: "passed", checks: "map/keyboard/touch, all scales, story arrows/swipe, collect, save, visit, photo resize, independent players, note, reload, export/import, invalid import, Escape/focus, browser Back" });
    console.log(`${width}px complete`);
    await context.close();
  }
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const id of ["ehecatl", "revolucion", "chapultepec"]) {
    await page.goto(`${base}/mexico-city?place=${id}`);
    await page.getByRole("button", { name: "Open the story" }).click();
    await page.getByRole("button", { name: "Chapter 2", exact: true }).click();
    await waitForArt(page); await screenshot(page, `${id}-past-390`);
    assert(await page.getByRole("link", { name: "History source" }).getAttribute("href"));
    await page.keyboard.press("Escape");
  }
  assert.equal(await page.locator(".ov-camera").evaluate(el => getComputedStyle(el).transitionDuration), "0s");
  await page.goto(`${base}/mexico-city?place=not-real`);
  assert.equal(await page.locator(".ov-game").getAttribute("data-level"), "city");
  await page.getByRole("button", { name: "Explore Milpa Alta", exact: true }).click();
  await page.getByText("A whole district of untold stories.", { exact: false }).waitFor();
  await page.getByRole("button", { name: "A note about this world" }).click();
  assert.equal(await page.locator(".ov-about li a").count(), 4);
  await context.close();
  assert.deepEqual(errors, []);
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ result: "passed", viewports: report.flows, imageBytes: report.viewports.map(v => ({ width: v.width, bytes: v.cold.images.reduce((n, i) => n + i.encodedBytes, 0), lcp: v.cold.lcp, cls: v.cold.cls })) }, null, 2));
} finally { await browser.close(); }
