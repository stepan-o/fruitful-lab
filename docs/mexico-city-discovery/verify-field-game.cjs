// Creates disposable accounts; run only against a local test backend.
const assert = require("node:assert/strict");
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
  throw new Error("Use a disposable local test environment");
const photo = process.env.TEST_PHOTO || "/tmp/cdmx-mobile.png";
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const suffix = Date.now();
  async function player(name) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const p = await context.newPage();
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base + "/mexico-city/play?mode=friends");
    await p
      .getByRole("button", { name: "Crear una cuenta", exact: true })
      .click();
    await p.getByLabel("Cómo te llamas").fill(name);
    await p
      .getByLabel("Correo electrónico")
      .fill(`${name.toLowerCase()}-${suffix}@example.com`);
    await p
      .getByLabel("Contraseña", { exact: true })
      .fill("Prototype-test-password-2026");
    await p.getByRole("button", { name: "Crear cuenta y entrar" }).click();
    await p.getByRole("navigation", { name: "Modos del juego" }).waitFor();
    return p;
  }
  const a = await player("Susy");
  const b = await player("Stepan");
  await a.getByRole("button", { name: "Crear o unirme a un grupo" }).click();
  await a.getByLabel("Nombre del nuevo grupo").fill("Dos miradas");
  await a.getByRole("button", { name: "Crear grupo", exact: true }).click();
  await a.getByRole("button", { name: "Dos miradas" }).waitFor();
  const state = async (p) => {
    // Use the browser's cookie handling, including Secure localhost cookies.
    const result = await p.evaluate(async () => {
      const response = await fetch('/api/mexico-city/state');
      return { status: response.status, data: await response.json() };
    });
    assert.equal(result.status, 200);
    return result.data;
  };
  let s = await state(a);
  const invite = s.groups[0].invite;
  await b.getByRole("button", { name: "Crear o unirme a un grupo" }).click();
  await b.getByLabel("Tengo un código de invitación").fill(invite);
  await b.getByRole("button", { name: "Unirme al grupo", exact: true }).click();
  await b.getByRole("button", { name: "Dos miradas" }).waitFor();
  await a.reload();
  await a.getByRole("button", { name: "Tengo un reto para ti" }).click();
  await a.getByLabel("Tu propuesta").fill("Un mural que nos sorprenda");
  await a.getByRole("button", { name: "Enviar propuesta" }).click();
  await a
    .getByRole("heading", { name: "Un mural que nos sorprenda" })
    .waitFor();
  await b.reload();
  await b.getByRole("button", { name: "Aceptar y salir" }).click();
  await b.getByRole("button", { name: "Ya lo encontré", exact: true }).click();
  await b.locator("input[type=file]").setInputFiles(photo);
  await b.getByText("Cambiar foto", { exact: true }).waitFor();
  await b.getByLabel("Nombre del lugar o calle").fill("Roma Norte");
  await b
    .getByLabel("Lo que no quieres olvidar")
    .fill("Una textura que nunca había notado.");
  await b.getByRole("button", { name: "Colocar el pin en el mapa" }).click();
  await b.getByRole("button", { name: "Aquí fue" }).click();
  assert.equal(
    await b.getByLabel("Nombre del lugar o calle").inputValue(),
    "Roma Norte",
  );
  await b.getByRole("button", { name: "Guardar hallazgo · +30" }).click();
  await b.getByRole("dialog").waitFor({ state: "hidden" });
  s = await state(b);
  assert.equal(s.records.length, 1);
  assert.equal(s.groups[0].challenges[0].status, "submitted");
  await a.reload();
  await a.getByRole("button", { name: "Revisar evidencia de Stepan" }).click();
  await a.getByRole("button", { name: "Confirmar hallazgo" }).click();
  await a.getByText("Reto confirmado", { exact: true }).first().waitFor();
  s = await state(a);
  assert.equal(s.groups[0].challenges[0].status, "confirmed");
  await b.reload();
  assert.equal((await state(b)).groups[0].challenges[0].status, "confirmed");
  await b.getByRole("button", { name: "Comunidad", exact: true }).click();
  await b.getByRole("button", { name: "Mi grupo", exact: true }).click();
  await b
    .locator(".mc-photo-grid")
    .getByRole("button", { name: /Un mural que nos sorprenda/ })
    .click();
  await b.getByText("Compartido solo con tu grupo", { exact: true }).waitFor();
  await b.screenshot({ path: "/tmp/cdmx-record.png" });
  await a.setViewportSize({ width: 1440, height: 1000 });
  await a.screenshot({ path: "/tmp/cdmx-desktop.png" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: two real accounts → group invitation → accepted challenge → photo + map pin → peer review → persisted score; no browser errors",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
