import { art } from "../assets";
import { supervisorAssets } from "../supervisor-assets";
import type { ImageAsset } from "@/lib/assets/types";
/** Only this slice's metadata is serialized; image bytes load on their active screen. */
export function firstShiftMedia(): Record<string, ImageAsset> {
  return Object.fromEntries([
    ...["entrance", "factory", "forge", "security", "limen", "stiletto"].map(
      (id) => [id, art(id)],
    ),
    ...[
      "limen-conveyor",
      "limen-security",
      "stiletto-conveyor-success-1",
      "stiletto-security",
      "argue-limen-stiletto-conveyor",
    ].map((id) => [id, supervisorAssets[id]]),
  ]);
}
