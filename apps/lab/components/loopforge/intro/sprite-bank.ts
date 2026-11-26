import type { Bank } from "./paint";
import {
  materialFiles,
  materialRoot,
} from "../../../lib/loopforge/room-material";
import { loadSkin } from "../../../lib/loopforge/shifts/skin";
export async function loadIntroArt(): Promise<Bank> {
  const res = await fetch("/loopforge-intro/sprites.json");
  if (!res.ok) throw Error("The sprite register could not be loaded.");
  const art: Bank["art"] = await res.json(),
    images: Bank["images"] = {};
  const sources = Object.keys(art.sheets)
    .filter((key) => !key.startsWith("tile-"))
    .map((key) => [key, "/loopforge-intro/" + key + ".webp"]);
  sources.push(["queueRail", "/loopforge-intro/sec-rails-depth.png"]);
  sources.push(...materialFiles.map((file) => [file, materialRoot + file]));
  for (const [key, url] of sources) {
    const img = new Image();
    img.src = url;
    images[key] = img;
  }
  const signals = await loadSkin("/loopforge-design/days-2-4-art/v1/");
  // The intro sheets can download together. Decode one at a time to limit
  // simultaneous image work on the first Day One frame.
  for (const img of Object.values(images)) await img.decode();
  return { art, images, world: signals.world };
}
