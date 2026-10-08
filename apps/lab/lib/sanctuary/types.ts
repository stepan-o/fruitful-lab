import type { VisualSpec } from "./visual-content";
export type EvidenceSource = {
  id: string;
  title: string;
  url: string;
  note: string;
};
export type Figure = {
  asset: string;
  alt: string;
  caption: string;
  credit: string;
  sourceUrl?: string;
  placement?: "opening" | "identity";
  label?: string;
  presentation?: "archive" | "pixels" | "identity";
  details?: { label: string; text: string; rect: [number, number, number, number] }[];
  afterParagraph?: number;
};
export type Panel = {
  title: string;
  items: { label: string; text: string }[];
  flow?: boolean;
};
export type InlineExhibit = { afterParagraph: number; kind: "market-map" | "world-workshop" | "epic-spending" | "gathering-place" | "business-layers" | "platform-revenue" | "cloud-figures" | "audience-economy" | "chapter-diagram" | "funding" };
export type Chapter = {
  id: string;
  visual: VisualSpec;
  part: number;
  title: string;
  lede: string;
  paragraphs: string[];
  sections?: { at: number; title: string }[];
  paragraphCitations?: Record<string, string[]>;
  exhibits?: InlineExhibit[];
  takeaway?: string;
  figures?: Figure[];
  panel?: Panel;
  interactive?: "probability" | "price";
  table?: { headers: string[]; rows: string[][]; caption: string };
  sources: string[];
  evidence: string;
};

export const chapterHref = (id?: string) =>
  id
    ? `/stepanoskin/game-monetization?chapter=${encodeURIComponent(id)}`
    : "/stepanoskin/game-monetization";

export function successProbability(chance: number, attempts: number) {
  return 1 - Math.pow(1 - chance / 100, attempts);
}
