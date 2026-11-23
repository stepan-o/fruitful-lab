import rivalsMedia from "./rivals-media.json";
import historyMedia from "./history-media.json";
import type { Chapter } from "./types";
import worlds from "./world-media.json";
import editorial from "./editorial-media.json";
import arcade from "./arcade-media.json";
import context from "./context-media.json";
import { coverReferences } from "./cover-references";

/** Full provenance stays in the server-rendered register, not the reader payload. */
const rivalsRecords = Object.fromEntries(Object.entries(rivalsMedia).map(([id, record]) => [id, {
  ...record, owner: "Marvel / NetEase Games", reviewed: "17 November 2026",
  treatment: "Complete published frame, scaled for reading. Credits are beside the image.",
  basis: "Limited editorial citation for criticism and review of the depicted design or offer. No separate publisher licence is asserted.",
}]));
const rivalsFilm = {
  title: "Art Vision Vol. 01 · GUI & Video", owner: "Marvel / NetEase Games",
  source: "Marvel Rivals official YouTube channel", sourceUrl: "https://www.youtube.com/watch?v=JaNAqe180Hc",
  sourceDate: "21 April 2025", reviewed: "17 November 2026", purpose: "The developers demonstrate the interface in motion.",
  treatment: "Optional playback in YouTube’s official embedded player. The original channel link is always available.",
  basis: "YouTube’s Terms of Service allow showing videos through its embeddable player. The channel controls availability.",
};
export const visualSourceRecords = { ...rivalsRecords, "rivals-art-film": rivalsFilm, ...historyMedia.assets, ...worlds.assets, ...editorial.assets, ...arcade.assets, ...context.assets };

export type VisualSourceLink = {
  id: string;
  title: string;
  sourceUrl: string | null;
  recordHref: string;
};

const records: Record<string, { title: string; sourceUrl: string | null }> = visualSourceRecords;
// Retired source records remain in the register with no active chapter references.
const contextRecords: Record<string, { chapters: string[] }> = context.assets;
const registerHref = (id: string) => `/stepanoskin/game-monetization/credits#${id}`;

/** Only works actually cited in this chapter, including embedded marks/references. */
export function chapterVisualSources(chapter: Chapter): VisualSourceLink[] {
  const ids = new Set([...(chapter.figures ?? []).map(figure => figure.asset), ...(chapter.embeddedAssets ?? [])]);
  if (chapter.id === "marvel-rivals") {
    Object.keys(rivalsRecords).forEach(id => ids.add(id));
    ids.add("rivals-art-film");
  }
  for (const [id, record] of Object.entries(contextRecords)) {
    if (record.chapters.includes(chapter.id)) ids.add(id);
  }
  const links = [...ids].map(id => {
    const record = records[id];
    if (!record) throw new Error(`Missing visual use record: ${id}`);
    return { id, title: record.title, sourceUrl: record.sourceUrl, recordHref: registerHref(id) };
  });
  if (chapter.id === "platform-business") {
    for (const cover of coverReferences) {
      links.push({ id: cover.id, title: `${cover.title} · reference: ${cover.original}`, sourceUrl: cover.source, recordHref: registerHref(cover.id) });
    }
  }
  return links;
}
