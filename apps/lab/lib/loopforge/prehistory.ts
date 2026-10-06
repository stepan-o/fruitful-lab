import manifest from "@/lib/assets/generated/loopforge-prehistory.json";
import content from "./prehistory-content.json";
import { imageAsset, parseManifest } from "@/lib/assets/types";

export type PrehistoryDirection = Readonly<{
  id: string;
  title: string;
  lens: string;
  description: string;
  scenes: readonly Readonly<{
    id: string; title: string; alt: string; reading: string; question: string;
  }>[];
}>;

export const prehistory: readonly PrehistoryDirection[] = content;
const assets = parseManifest(manifest, "loopforge-prehistory");
export const prehistoryArt = (id: string) => imageAsset(assets, id);
