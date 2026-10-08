import { art } from "../assets";
import type { ImageAsset } from "@/lib/assets/types";
import consoleManifest from "@/lib/assets/generated/loopforge-console.json";
import designManifest from "@/lib/assets/generated/loopforge-design.json";
import { imageAsset, parseManifest } from "@/lib/assets/types";
const consolePack = parseManifest(consoleManifest, "loopforge-console");
/** Only this slice's metadata is serialized; image bytes load on their active screen. */
export function firstShiftMedia(): Record<string, ImageAsset> {
  return Object.fromEntries([
    ...["forge", "security", "theatre", "brewery", "weaving"].map((id) => [
      id,
      art(id),
    ]),
    ...Object.keys(consoleManifest.assets).map((id) => [
      id,
      imageAsset(consolePack, id),
    ]),
    [
      "cortex",
      imageAsset(parseManifest(designManifest, "loopforge-design"), "cortex"),
    ],
  ]);
}
