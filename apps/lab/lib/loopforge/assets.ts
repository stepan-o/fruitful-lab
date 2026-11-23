import manifest from "@/lib/assets/generated/loopforge.json";
import { imageAsset, parseManifest } from "@/lib/assets/types";
const assets = parseManifest(manifest, "loopforge");
export const art = (id: string) => imageAsset(assets, id);
