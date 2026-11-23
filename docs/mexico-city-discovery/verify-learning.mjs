// Production browser checks for the bilingual city chapter and learning rewards.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
const { chromium } = createRequire(import.meta.url)(
  process.env.PLAYWRIGHT_MODULE || "playwright",
);
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4182";
const out = process.env.EVIDENCE_DIR || "/tmp/otra-vista-learning-evidence";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const report = { viewports: [], errors: [] };
const key = "otra-vista-journal-v1";
const read = (p) => p.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);
const settle = (p) => p.waitForTimeout(1000);
const shot = async (p, name) => {
  await settle(p);
  await p.screenshot({ path: `${out}/${name}.png` });
};
const click = (p, name) =>
  p.getByRole("button", { name, exact: typeof name === "string" }).click();
const score = async (p, n) =>
  assert.equal(await p.locator(".ov-live-score strong").innerText(), String(n));
const layout = async (p) => {
  const result = await p.evaluate(() => {
    const dialog = document.querySelector("dialog[open]");
    const root = dialog || document.querySelector(".ov-game");
    return {
      overflow:
        document.documentElement.scrollWidth > innerWidth ||
        root.scrollWidth > root.clientWidth + 1,
      small: [...root.querySelectorAll("button,input[type=range],summary")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 && r.height > 0 && (r.width < 43.5 || r.height < 43.5)
          );
        })
        .map((el) => el.getAttribute("aria-label") || el.textContent.trim()),
    };
  });
  assert.equal(result.overflow, false, "Horizontal overflow");
  assert.deepEqual(result.small, [], "Small learning controls");
};
try {
  for (const width of (process.env.TEST_WIDTHS || "320,390,768,1440")
    .split(",")
    .map(Number)) {
    console.log(`Learning ${width}px`);
    const context = await browser.newContext({
      viewport: { width, height: width < 700 ? 844 : 960 },
      reducedMotion: "reduce",
    });
    const p = await context.newPage();
    p.setDefaultTimeout(15000);
    p.on("pageerror", (e) => report.errors.push(e.message));
    await p.goto(`${base}/mexico-city/atlas`);
    await p.locator(".ov-chapter-entry").waitFor();
    await settle(p);
    assert.equal(await p.locator("html").getAttribute("lang"), "es-MX");
    assert.match(
      await p.locator(".ov-chapter-entry").innerText(),
      /La ciudad que nació del agua/,
    );
    await layout(p);
    await shot(p, `city-es-${width}`);
    await click(p, "Metro");
    await click(p, "Cablebús");
    assert.equal(await p.locator("[data-metro-line]").count(), 12);
    assert.equal(await p.locator("[data-cable-line]").count(), 4);
    await p
      .locator("button.ov-landmark")
      .filter({ hasText: "Cuauhtémoc" })
      .click();
    await settle(p);
    assert.equal(await p.locator("[data-metro-line]").count(), 12);
    await shot(p, `metro-borough-es-${width}`);
    assert((await p.locator(".ov-area-caption").count()) > 0);
    await click(p, "Explorar Centro Histórico");
    await settle(p);
    assert((await p.locator(".ov-street-caption").count()) > 0);
    assert((await p.locator(".ov-station-caption").count()) > 0);
    await shot(p, `metro-zone-es-${width}`);
    await click(p, "Explorar Zócalo");
    await settle(p);
    assert.equal(await p.locator("[data-metro-line]").count(), 12);
    await p.locator(".ov-chapter-entry").click();
    await p.getByRole("dialog").waitFor();
    await p
      .getByRole("heading", { name: "Antes de las calles, el agua." })
      .waitFor();
    await layout(p);
    await shot(p, `water-${width}`);
    await p.getByRole("slider").focus();
    await p.keyboard.press("End");
    assert.equal(await p.getByRole("slider").inputValue(), "100");
    await p.keyboard.press("Home");
    await p.locator(".ov-photo-reference summary").click();
    await p
      .getByRole("img", { name: "Tenochtitlan y el golfo de México" })
      .waitFor();
    await p.locator(".ov-photo-reference img").scrollIntoViewIfNeeded();
    await p.waitForFunction(
      () => document.querySelector(".ov-photo-reference img")?.complete,
      {},
      { timeout: 15000 },
    );
    assert.equal(
      await p
        .locator(".ov-photo-reference a")
        .filter({ hasText: "Dominio público" })
        .count(),
      1,
    );
    await p.locator(".ov-photo-reference summary").click();
    console.log("Map and archive passed", width);
    for (let step = 1; step < 6; step++) {
      console.log("Chapter", step + 1, width);
      await click(p, /Sigue el recorrido/);
      await p.waitForTimeout(100);
      assert.equal(
        await p.getByRole("dialog").evaluate((d) => d.scrollTop),
        0,
        "New lesson returns to heading",
      );
      if (step === 1) await click(p, "Norte · Tepeyac");
      if (step === 2) await click(p, "6 · Xochimilco");
      if (step === 3) await click(p, "Línea 8");
      if (step === 4) await click(p, "Cablebús 2");
      if (step === 5) {
        await p
          .locator(".ov-map-picks")
          .getByRole("button", { name: "AIFA · NLU", exact: true })
          .click();
        assert.match(
          await p.locator(".ov-chapter-detail").innerText(),
          /Tren Felipe Ángeles/,
        );
      }
      await layout(p);
      await p.getByRole("dialog").evaluate((d) => (d.scrollTop = 0));
      await shot(p, `chapter-${step + 1}-${width}`);
    }
    await click(p, /Empezar los retos/);
    await score(p, 15);
    await p.locator(".ov-quiz-answers button").nth(1).click();
    await score(p, 15);
    await click(p, /Intentar de nuevo/);
    for (const answer of [0, 2, 1, 2, 0, 1]) {
      await p.locator(".ov-quiz-answers button").nth(answer).click();
      await click(p, /Siguiente reto|Ver mis descubrimientos/);
    }
    console.log("City quiz passed", width);
    await score(p, 135);
    await layout(p);
    await shot(p, `city-quiz-finish-${width}`);
    await p.keyboard.press("Escape");
    await p.locator(".ov-nahuatl-entry").click();
    await p.getByRole("dialog").waitFor();
    await layout(p);
    await shot(p, `nahuatl-${width}`);
    await click(p, /Encuentra la pareja/);
    await p
      .locator(".ov-quiz-answers button")
      .filter({ hasText: /^flor/ })
      .click();
    await score(p, 135);
    await click(p, /Intentar de nuevo/);
    for (const meaning of [
      /^agua/,
      /^cerro o montaña/,
      /^flor/,
      /^campo cultivado/,
      /^viento/,
    ]) {
      await p
        .locator(".ov-quiz-answers button")
        .filter({ hasText: meaning })
        .click();
      await click(p, /Siguiente reto/);
    }
    await score(p, 185);
    await click(p, /Arma el nombre/);
    for (const pieces of [
      ["xochi", "mil", "co"],
      ["xochi", "tepe", "c"],
    ]) {
      for (const piece of pieces)
        await p
          .locator(".ov-name-tiles")
          .getByRole("button", { name: piece, exact: true })
          .click();
      await click(p, /Comprobar/);
      await layout(p);
      await shot(p, `nahuatl-name-${pieces[1]}-${width}`);
      await click(p, /Siguiente reto/);
    }
    await score(p, 225);
    await click(p, /Encuentra la pareja/);
    await p
      .locator(".ov-quiz-answers button")
      .filter({ hasText: /^agua/ })
      .click();
    await score(p, 225);
    await p.keyboard.press("Escape");
    await p.reload();
    await settle(p);
    assert.equal(Object.keys((await read(p)).learning.Susy).length, 14);
    await p
      .locator(".ov-scoreboard button")
      .filter({ hasText: "Stepan" })
      .click();
    await p.locator(".ov-nahuatl-entry").click();
    await p.getByRole("dialog").waitFor();
    await score(p, 0);
    await click(p, /Encuentra la pareja/);
    await p
      .locator(".ov-quiz-answers button")
      .filter({ hasText: /^agua/ })
      .click();
    await score(p, 10);
    const journal = await read(p);
    assert.equal(Object.keys(journal.learning.Susy).length, 14);
    assert.deepEqual(journal.learning.Stepan, { "nahuatl-atl": true });
    await p
      .getByRole("dialog")
      .getByRole("button", { name: "English", exact: true })
      .click();
    assert.match(
      await p.getByRole("dialog").innerText(),
      /Which meaning matches/,
    );
    await p.keyboard.press("Escape");
    await p.reload();
    await settle(p);
    assert.equal(await p.locator("html").getAttribute("lang"), "en");
    await p.goto(`${base}/mexico-city?place=revolucion`);
    await click(p, /Open the story/);
    await click(p, "Chapter 2");
    await p.locator(".ov-photo-reference summary").click();
    await p
      .locator(".ov-photo-reference img")
      .first()
      .waitFor({ state: "attached" });
    assert.equal(await p.locator(".ov-photo-reference img").count(), 2);
    for (const img of await p.locator(".ov-photo-reference img").all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((i) => i.decode());
    }
    assert.equal(
      await p.getByRole("link", { name: "CC BY-SA 4.0", exact: true }).count(),
      1,
    );
    await p.locator(".ov-photo-reference").scrollIntoViewIfNeeded();
    await shot(p, `revolution-photos-${width}`);
    await p.keyboard.press("Escape");
    if (width === 390) {
      await click(p, /Field journal/);
      const [download] = await Promise.all([
        p.waitForEvent("download"),
        click(p, /Export journal/),
      ]);
      await download.saveAs(`${out}/learning-journal.json`);
      const imported = await browser.newContext();
      const other = await imported.newPage();
      await other.goto(`${base}/mexico-city/atlas`);
      await other.locator(".ov-journal-toggle").click();
      await other
        .locator(".ov-journal-footer input")
        .setInputFiles(`${out}/learning-journal.json`);
      await other
        .getByRole("status")
        .filter({ hasText: /Bitácoras combinadas/ })
        .waitFor();
      assert.deepEqual((await read(other)).learning, journal.learning);
      await other.locator(".ov-journal-footer input").setInputFiles({
        name: "broken.json",
        mimeType: "application/json",
        buffer: Buffer.from("{invalid"),
      });
      await other
        .getByRole("status")
        .filter({ hasText: /No pudimos importar/ })
        .waitFor();
      await imported.close();
    }
    report.viewports.push({
      width,
      result: "passed",
      susyPoints: 225,
      stepanPoints: 10,
      checks:
        "Spanish default; ES/EN switching and reload; persistent layers across 4 scales; area/street/station captions; 6 interactive lessons; archive; 6 quiz rewards; wrong/retry; 5 word matches; 2 name puzzles; repeat award protection; independent players; licensed photo pair; 44px HTML controls; no overflow; reduced motion",
    });
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
