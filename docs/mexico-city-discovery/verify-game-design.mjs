// Run against a production server; screenshots and lab measurements go to /tmp.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
const { chromium } = createRequire(import.meta.url)(
  process.env.PLAYWRIGHT_MODULE || "playwright",
);
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4182";
const out =
  process.env.DESIGN_EVIDENCE_DIR || "/tmp/mexico-city-game-design-evidence";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const report = {
  viewports: [],
  errors: [],
  measuredAt: new Date().toISOString(),
};
const layout = async (page) => {
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    smallControls: [...document.querySelectorAll("button,summary")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.width > 0 && r.height > 0 && (r.width < 43.5 || r.height < 43.5)
        );
      })
      .map((el) => el.textContent),
  }));
  assert.equal(result.overflow, false, "Horizontal page overflow");
  assert.deepEqual(result.smallControls, [], "Small touch controls");
};
try {
  for (const width of [320, 390, 768, 1440]) {
    console.log(`Design ${width}px`);
    const context = await browser.newContext({
      viewport: { width, height: width < 700 ? 844 : 960 },
      deviceScaleFactor: width < 700 ? 2 : 1,
      reducedMotion: "reduce",
      hasTouch: width < 700,
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => report.errors.push(error.message));
    await page.goto(`${base}/mexico-city/game-design`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.waitForFunction(() => document.documentElement.lang === "es-MX");
    await page
      .locator("main img")
      .first()
      .evaluate((img) => img.decode());
    await page.waitForLoadState("networkidle");
    await layout(page);
    assert.match(await page.title(), /Mexico city discovery game/);
    assert(!/otra vista/i.test(await page.locator("body").innerText()));
    const initialImages = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .filter((r) => r.name.includes("/media/") && /webp|avif/.test(r.name))
        .map((r) => ({
          url: r.name,
          transferred: r.transferSize,
          encoded: r.encodedBodySize,
        })),
    );
    await page.screenshot({ path: `${out}/design-es-${width}.png` });
    const journalBefore = await page.evaluate(() =>
      localStorage.getItem("otra-vista-journal-v1"),
    );
    const scenes = page
      .getByRole("group", { name: "Escenario del reto" })
      .getByRole("button");
    for (const [index, expected] of ["0", "0", "0", "+100", "−100"].entries()) {
      if (width < 700) await scenes.nth(index).tap();
      else await scenes.nth(index).click();
      assert.equal(
        await scenes.nth(index).getAttribute("aria-pressed"),
        "true",
      );
      assert.equal(
        await page.locator("[data-outcome] strong").innerText(),
        expected,
      );
      await layout(page);
    }
    await scenes.nth(2).focus();
    await page.keyboard.press("Enter");
    assert.equal(
      await page.locator("[data-outcome]").getAttribute("data-outcome"),
      "submitted",
    );
    await page
      .locator("#juego")
      .screenshot({
        path: `${out}/challenge-es-${width}.png`,
        style: "nav { position: static !important; }",
      });
    const scales = page
      .getByRole("group", { name: "Escala de exploración" })
      .getByRole("button");
    for (let i = 0; i < 4; i++) {
      await scales.nth(i).click();
      assert.equal(await scales.nth(i).getAttribute("aria-pressed"), "true");
      await page.locator("#mapa figure img").evaluate((img) => img.decode());
      assert.equal(
        await page
          .locator("#mapa figure")
          .evaluate((el) => getComputedStyle(el).animationName),
        "none",
      );
      await layout(page);
    }
    assert.equal(
      await page.evaluate(() => localStorage.getItem("otra-vista-journal-v1")),
      journalBefore,
      "Design examples must not change journal progress",
    );
    await page.locator("#identidad").scrollIntoViewIfNeeded();
    await page
      .locator("#identidad img")
      .evaluateAll((imgs) => Promise.all(imgs.map((img) => img.decode())));
    await page
      .locator("#identidad")
      .screenshot({
        path: `${out}/identity-es-${width}.png`,
        style: "nav { position: static !important; }",
      });
    await page
      .getByText("Lecturas para pensar el experimento colectivo", {
        exact: true,
      })
      .click();
    assert.equal(await page.locator("details").getAttribute("open"), "");
    for (const section of [
      "principio",
      "juego",
      "mapa",
      "identidad",
      "estructura",
      "futuro",
      "decisiones",
    ]) {
      await page.locator(`nav a[href="#${section}"]`).click();
      assert.equal(new URL(page.url()).hash, `#${section}`);
      assert(
        await page
          .locator(`#${section}`)
          .evaluate((el) => Math.abs(el.getBoundingClientRect().top) < 130),
      );
    }
    await page.getByRole("button", { name: "English", exact: true }).click();
    assert.match(await page.locator("h1").innerText(), /The game happens/);
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    await layout(page);
    await page.goto(`${base}/mexico-city/game-design`);
    await page.waitForFunction(() => document.documentElement.lang === "en");
    await page.screenshot({ path: `${out}/design-en-${width}.png` });
    const warmImages = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .filter((r) => r.name.includes("/media/") && /webp|avif/.test(r.name))
        .map((r) => ({ url: r.name, transferred: r.transferSize })),
    );
    await page
      .getByRole("link", { name: "Open prototype", exact: false })
      .click();
    await page
      .getByRole("button", {
        name: "Mexico city discovery game, return to city",
      })
      .waitFor();
    await layout(page);
    await page.screenshot({ path: `${out}/game-name-en-${width}.png` });
    await page
      .getByRole("button", { name: "A note about this world ↗", exact: true })
      .click();
    await page
      .getByRole("link", {
        name: "Game design and future direction ↗",
        exact: true,
      })
      .click();
    await page.getByRole("heading", { level: 1 }).waitFor();
    assert.equal(new URL(page.url()).pathname, "/mexico-city/game-design");
    await page.waitForFunction(() => document.documentElement.lang === "en");
    report.viewports.push({
      width,
      dpr: width < 700 ? 2 : 1,
      initialImages,
      warmImages,
    });
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(`${base}/mexico-city/game-design`);
  await page
    .getByRole("group", { name: "Escala de exploración" })
    .getByRole("button")
    .nth(1)
    .click();
  assert.notEqual(
    await page
      .locator("#mapa figure")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await context.close();
  assert.deepEqual(report.errors, [], "Browser runtime errors");
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify({
      passed: true,
      widths: report.viewports.map((v) => v.width),
      evidence: out,
    }),
  );
} finally {
  await browser.close();
}
