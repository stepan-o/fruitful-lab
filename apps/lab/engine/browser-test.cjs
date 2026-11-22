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
  const url =
    (process.env.LOOPFORGE_URL || "http://127.0.0.1:3204") +
    "/stepanoskin/loopforge/play";
  let page;
  const errors = [];
  const diagnostics = [];
  const diagnose = (message) => {
    if (diagnostics.length < 20) diagnostics.push(message.slice(0, 1000));
  };
  try {
    // Reproduce the pre-hydration state deterministically: controls rendered by
    // the server must not accept clicks until their client handlers are ready.
    const staticPage = await browser.newPage({ javaScriptEnabled: false });
    try {
      await staticPage.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 120000,
      });
      const entry = staticPage.getByRole("button", { name: /^Enter factory/ });
      await entry.waitFor();
      const controls = staticPage.locator(
        'main[aria-label="Loopforge start menu"] button, ' +
        'main[aria-label="Loopforge start menu"] input, ' +
        '[aria-label="Factory playback"] button',
      );
      assert.ok(await controls.count(), "Server-rendered menu is present");
      assert.equal(
        await controls.evaluateAll((elements) =>
          elements.every((el) => el.disabled),
        ),
        true,
        "Game controls must stay disabled before hydration",
      );
    } finally {
      await staticPage.close();
    }
    page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (message) => {
      if (message.type() === "error") diagnose(message.text());
    });
    page.on("requestfailed", (request) => diagnose(
      `Request failed: ${new URL(request.url()).pathname} ${request.failure()?.errorText}`,
    ));
    page.setDefaultTimeout(60000);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
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
      "Verified disabled pre-hydration controls, then play, speed, seek, skip, call, reload and supervisor appointment on a phone viewport.",
    );
  } catch (error) {
    console.error("Page errors:", errors);
    console.error("Browser diagnostics:", diagnostics);
    if (page) {
      console.error(
        "Visible page:",
        (await page.locator("body").innerText().catch(() => "Unavailable")).slice(0, 4000),
      );
    }
    throw error;
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
