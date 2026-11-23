// Current specification route. Interactive examples now live in /play?demo=1.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)(
  process.env.PLAYWRIGHT_MODULE || "playwright",
);
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4182";
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/mexico-city/game-design`);
    await page
      .getByRole("heading", { name: "La ciudad es el juego." })
      .waitFor();
    assert.match(await page.title(), /Mexico city discovery game/);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    const anchors = page.locator(".mc-design-toc a");
    assert.equal(await anchors.count(), 10);
    for (const a of await anchors.all()) {
      const id = (await a.getAttribute("href")).slice(1);
      assert.equal(await page.locator(`[id="${id}"]`).count(), 1);
    }
    await page.getByRole("button", { name: "English", exact: true }).click();
    await page
      .getByRole("heading", { name: "The city is the game." })
      .waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.reload();
    await page
      .getByRole("heading", { name: "The city is the game." })
      .waitFor();
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: bilingual specification, ten section anchors, persisted language, 320/390/768/1440px and reduced motion",
  );
} finally {
  await browser.close();
}
