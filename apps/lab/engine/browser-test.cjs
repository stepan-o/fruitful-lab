// Exercise the ordinary player with its live Wasm worker and persisted input journal.
const { chromium } = require(process.env.LOOPFORGE_PLAYWRIGHT || "playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: process.env.CHROMIUM_PATH
      ? [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
          "--no-proxy-server",
        ]
      : ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
        viewport: { width: 390, height: 844 },
      }),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.setDefaultTimeout(60000);
    await page.goto(
      (process.env.LOOPFORGE_URL || "http://127.0.0.1:3204") +
        "/stepanoskin/loopforge/play",
      { waitUntil: "domcontentloaded", timeout: 120000 },
    );
    const b = (name) =>
      page.getByRole("button", { name, exact: typeof name === "string" });
    const save = () =>
      page.evaluate(() =>
        JSON.parse(sessionStorage.getItem("loopforge.kernel.journal.1")),
      );
    await b(/^Enter factory/).click();
    await b("Skip to Day 2").waitFor();
    await b("2× speed").click();
    await b("Pause").click();
    await b("Play").waitFor();
    const first = (await save()).cursor;
    await b("Forward 10 seconds").click();
    await page.waitForTimeout(850);
    assert.ok((await save()).cursor > first);
    await b("Rewind 10 seconds").click();
    await page.waitForTimeout(650);
    assert.ok((await save()).cursor <= first + 2);
    await b("Play").click();
    await b("Skip to Day 2").click();
    const incoming = page
      .getByRole("button", { name: "Answer leadership" })
      .first();
    await incoming.waitFor();
    await incoming.click();
    await b("Receive the quota").click();
    await b("Acknowledge quota").click();
    await b("Commit assignment").waitFor();
    await page.reload();
    await b(/^Resume shift/).click();
    await b("Commit assignment").waitFor();
    await b(/^LIMEN/).click();
    await b("Commit assignment").click();
    await page.getByRole("heading", { name: /Security/ }).waitFor();
    await b("Pause").click();
    await b("Play").waitFor();
    assert.equal(errors.length, 0, errors.join("\n"));
    assert.equal(
      await page
        .getByRole("alert")
        .filter({ hasText: /kernel|invalid|hash|expired/i })
        .count(),
      0,
    );
    console.log(
      "Verified play, speed, seek, skip, call, reload and supervisor appointment on a phone viewport.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
