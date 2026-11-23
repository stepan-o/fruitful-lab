// Reproducible production preparation: no painting or alteration of generated art.
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { buildPack } from "./assets.mjs";
const ids = ["baseline", "field-instrument", "broadcast-desk", "foundry-switchboard", "submarine-watch", "neural-diagnostics"];
for (const id of ids) {
  const root = `assets/sources/loopforge-themes/${id}`;
  const provenance = JSON.parse(await readFile(`${root}/provenance.json`, "utf8"));
  const crops = [];
  await sharp(`${root}/frame-master.png`).trim({ threshold: 12 }).png().toFile(`${root}/frame.png`);
  const { width, height } = await sharp(`${root}/controls-master.png`).metadata();
  for (const [index, state] of ["rest", "hover", "pressed"].entries()) {
    const top = Math.floor(height * index / 3);
    const region = { left: 0, top, width, height: Math.floor(height * (index + 1) / 3) - top };
    const row = await sharp(`${root}/controls-master.png`).extract(region).png().toBuffer();
    await sharp(row).trim({ threshold: 12 }).png().toFile(`${root}/button-${state}.png`);
    crops.push({ state, region, trimThreshold: 12 });
  }
  provenance.preparation = { script: "scripts/prepare-loopforge-themes.mjs", frameTrimThreshold: 12, controlCrops: crops };
  await writeFile(`${root}/provenance.json`, JSON.stringify(provenance, null, 2) + "\n");
  const assets = Object.fromEntries(["frame", "button-rest", "button-hover", "button-pressed"].map(key => [key === "frame" ? "monitor-frame" : key, {
    kind: "image", source: `${root}/${key}.png`, widths: key === "frame" ? [480, 960] : [480, 720], quality: 84, maxBytes: 240000
  }]));
  const catalog = `assets/loopforge-theme-${id}.json`;
  await writeFile(catalog, JSON.stringify({ pack: `loopforge-theme-${id}`, assets }, null, 2) + "\n");
  console.log(await buildPack(catalog));
}
