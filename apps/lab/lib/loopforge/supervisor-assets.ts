import manifest from "@/lib/assets/generated/loopforge-supervisors.json";
import { imageAsset, parseManifest } from "@/lib/assets/types";

const pack = parseManifest(manifest, "loopforge-supervisors");
export const supervisorAssets = Object.fromEntries(
  Object.keys(manifest.assets).map(id => [id, imageAsset(pack, id)]),
);
