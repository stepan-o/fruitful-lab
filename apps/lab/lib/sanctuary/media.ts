import historyManifest from "@/lib/assets/generated/sanctuary-history.json";
import historyMedia from "./history-media.json";
import worldManifest from "@/lib/assets/generated/sanctuary-worlds.json";
import worldMedia from "./world-media.json";
import editorialManifest from "@/lib/assets/generated/sanctuary-editorial.json";
import contextManifest from "@/lib/assets/generated/sanctuary-context.json";
import contextMedia from "./context-media.json";
import arcadeManifest from "@/lib/assets/generated/sanctuary-arcade.json";
import { parseManifest, type AssetManifest } from "@/lib/assets/types";
import editorialMedia from "./editorial-media.json";
import arcadeMedia from "./arcade-media.json";

// Server-side inventory. The reader receives only the active chapter's entries.
export const sanctuaryMedia: AssetManifest = {
  schemaVersion: 1,
  pack: "sanctuary-reader",
  assets: {
    ...parseManifest(historyManifest, "sanctuary-history").assets,
    ...parseManifest(worldManifest, "sanctuary-worlds").assets,
    ...parseManifest(editorialManifest, "sanctuary-editorial").assets,
    ...parseManifest(arcadeManifest, "sanctuary-arcade").assets,
    ...parseManifest(contextManifest, "sanctuary-context").assets,
  },
};
export const sanctuaryMediaCredits: Record<string, { owner: string; sourceUrl: string | null; displayCredit?: string }> = {
  ...historyMedia.assets,
  ...worldMedia.assets,
  ...editorialMedia.assets,
  ...arcadeMedia.assets,
  ...contextMedia.assets,
};
