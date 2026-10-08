import manifest from "@/lib/assets/generated/loopforge-sfx.json";
import { assetUrl, parseManifest } from "@/lib/assets/types";

const pack = parseManifest(manifest, "loopforge-sfx");
export type RecordedSound = "menu-clang" | "contactor" | "ratchet-engage" | "ratchet-release";
export function soundUrl(id: RecordedSound) {
  return assetUrl(pack, id);
}
