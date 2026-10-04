import editorialManifest from "@/lib/assets/generated/sanctuary-editorial.json";
import arcadeManifest from "@/lib/assets/generated/sanctuary-arcade.json";
import { parseManifest, type AssetManifest } from "@/lib/assets/types";
import editorialMedia from "./editorial-media.json";
import arcadeMedia from "./arcade-media.json";

// Server-side inventory. The reader receives only the active chapter's entries.
export const sanctuaryMedia: AssetManifest = {
  schemaVersion: 1,
  pack: "sanctuary-reader",
  assets: {
    ...parseManifest(editorialManifest, "sanctuary-editorial").assets,
    ...parseManifest(arcadeManifest, "sanctuary-arcade").assets,
  },
};
export const sanctuaryMediaCredits: Record<string, { owner: string; sourceUrl: string | null; displayCredit?: string }> = {
  ...editorialMedia.assets,
  ...arcadeMedia.assets,
};
