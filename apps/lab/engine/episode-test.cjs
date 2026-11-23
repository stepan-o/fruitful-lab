// Play the eight actual orders and both staffing stages through the rendered UI.
// Only the transport moves time forward. The journal is read to wait for an
// acknowledged seek, never edited or injected.
const { chromium } = require(process.env.LOOPFORGE_PLAYWRIGHT || "playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: process.env.CHROMIUM_PATH
      ? [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-zygote",
          "--single-process",
          "--no-proxy-server",
        ]
      : ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1366, height: 800 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.setDefaultTimeout(30000);
    await page.goto(
      (process.env.LOOPFORGE_URL || "http://127.0.0.1:3204") +
        "/stepanoskin/loopforge/play",
      { waitUntil: "domcontentloaded", timeout: 120000 },
    );
    const b = (name) =>
        page.getByRole("button", { name, exact: typeof name === "string" }),
      group = page.getByRole("group", { name: "Factory playback" });
    const control = (name) => group.getByRole("button", { name, exact: true });
    const save = () =>
      page.evaluate(() =>
        JSON.parse(sessionStorage.getItem("loopforge.kernel.journal.1")),
      );
    async function paused() {
      if (await control("Pause").isVisible()) await control("Pause").click();
      await control("Play").waitFor();
    }
    async function forwardUntil(target, limit = 35) {
      await paused();
      for (let attempt = 0; attempt < limit; attempt++) {
        if (await target.isVisible()) return;
        const last = (await save())?.cursor ?? -1;
        await control("Forward 10 seconds").click();
        await page.waitForFunction(
          ({ last }) =>
            JSON.parse(sessionStorage.getItem("loopforge.kernel.journal.1"))
              ?.cursor !== last,
          { last },
          { timeout: 12000 },
        );
      }
      throw Error("Did not reach " + target);
    }
    async function activate(name) {
      await control("Play").click();
      await b(name).click();
    }
    await b(/^Enter factory/).click();
    await b("Skip to Day 2").waitFor();
    await paused();
    for (let i = 0; i < 8; i++) {
      const name = new RegExp(
        "^" + ["Intake", "Wash", "Belt", "Forge"][i % 4] + " ·",
      );
      await forwardUntil(b(name));
      await activate(name);
    }
    await forwardUntil(b("Answer leadership"));
    await activate("Answer leadership");
    await b("Receive the quota").click();
    await b("Acknowledge quota").click();
    await b(/^LIMEN/).click();
    await b("Commit assignment").click();
    const pairs = page.getByText(/Give each operator two stations/);
    await forwardUntil(pairs);
    await control("Play").click();
    async function assign(ids) {
      for (const [i, id] of ids.entries()) {
        const station = ["Intake", "Wash", "Belt", "Forge"][i];
        await b(new RegExp("^" + id + "(?: |$)")).click();
        await b("Send " + id + " to " + station).click();
      }
    }
    await assign(["sam", "sam", "max", "max"]);
    const incident = b(/^Missing ID/);
    await forwardUntil(incident);
    await control("Play").click();
    await incident.click();
    await b("Issue daily pass").click();
    await page.getByText(/Daily pass granted/).waitFor();
    await forwardUntil(page.getByText(/Assign a different operator/));
    await control("Play").click();
    await assign(["sam", "max", "jo", "kit"]);
    await forwardUntil(page.getByText(/More crew at the entrance/));
    await control("Play").click();
    await b("Assign crew").click();
    await b(/^lou(?: |$)/).click();
    await page.getByLabel("Station", { exact: true }).selectOption("1");
    await b("Send lou to Wash").click();
    await forwardUntil(page.getByRole("heading", { name: "Shift closed" }), 50);
    assert.equal(errors.length, 0, errors.join("\n"));
    console.log(
      "Played all eight Day One orders, staffed both Day Two tutorials, intervened in the card case and closed the live line on desktop.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
