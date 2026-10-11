// Run with a local preview; TEST_PHOTO is a disposable input image.
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const photo = process.env.TEST_PHOTO || "/tmp/cdmx-mobile.png";
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  let errors = [];
  const results = [];
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 1000 : 844 },
      isMobile: width < 850,
      hasTouch: true,
    });
    const p = await context.newPage();
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base + "/mexico-city/play?guest=1");
    await p.getByRole("navigation", { name: "Modos del juego" }).waitFor();
    const map = p.locator(".mc-field-map");
    let zoom = Number(await map.getAttribute("data-map-zoom"));
    await p.getByRole("button", { name: "Acercar mapa", exact: true }).click();
    assert.ok(Number(await map.getAttribute("data-map-zoom")) > zoom);
    await p.getByRole("button", { name: "Capas del mapa" }).click();
    await p.getByRole("button", { name: "Cablebús", exact: true }).click();
    await p.getByRole("button", { name: "Cerrar capas" }).click();
    await p.getByRole("button", { name: "Aventura", exact: true }).click();
    await p.getByRole("button", { name: /Un mural fuera de tu ruta/ }).click();
    await p
      .getByRole("button", { name: "Ya encontré algo", exact: true })
      .click();
    await p.locator("input[type=file]").setInputFiles(photo);
    await p.getByText("Cambiar foto", { exact: true }).waitFor();
    await p.getByLabel("¿Qué encontraste?").fill("Rótulo de prueba");
    await p.getByLabel("Nombre del lugar o calle").fill("Una calle de CDMX");
    await p.getByRole("button", { name: "Colocar el pin en el mapa" }).click();
    await p.getByRole("button", { name: "Aquí fue", exact: true }).click();
    await p.getByRole("button", { name: "Guardar hallazgo · +30" }).click();
    await p.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(await p.locator(".mc-points-hud strong").innerText(), "30");
    await p
      .getByRole("button", { name: "Abrir bitácora", exact: true })
      .first()
      .click();
    await p
      .locator(".mc-photo-grid")
      .getByText("Rótulo de prueba", { exact: true })
      .waitFor();
    await p.goBack();
    await p.getByRole("dialog").waitFor({ state: "hidden" });
    await p.getByRole("button", { name: "Amigos", exact: true }).click();
    await p
      .getByRole("heading", { name: "Mejor con alguien conocido." })
      .waitFor();
    await p.getByRole("button", { name: "English", exact: true }).click();
    await p.getByRole("button", { name: "Home", exact: true }).click();
    await p.screenshot({ path: `/tmp/cdmx-field-${width}.png` });
    assert.equal(
      await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await p.reload();
    assert.equal(await p.locator(".mc-points-hud strong").innerText(), "0");
    await p.goto(base + "/mexico-city/game-design");
    await p.getByRole("heading", { name: "The city is the game." }).waitFor();
    assert.equal(
      await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await p.screenshot({ path: `/tmp/cdmx-spec-${width}.png`, fullPage: true });
    results.push({ width, pass: true });
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ results, errors }));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
