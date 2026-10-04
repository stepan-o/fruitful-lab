import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Reader from "@/components/sanctuary/Reader";
import { appendix, chapters, parts, sources } from "@/lib/sanctuary/content";
import rawManifest from "@/lib/assets/generated/sanctuary-editorial.json";
import { parseManifest, type AssetManifest } from "@/lib/assets/types";
import editorialMedia from "@/lib/sanctuary/editorial-media.json";
import { isLocale, localeCookieName } from "../translations";

export const metadata: Metadata = {
    title: "Sanctuary Economics — Game Monetization | Stepan Oskin",
    description: "How games are built, sold and kept alive. From Gauntlet’s coin slot to Diablo IV’s ongoing world: an illustrated study with 22 chapters, primary sources and interactive models.",
};

const manifest = parseManifest(rawManifest, "sanctuary-editorial");

export default async function GameMonetizationPage({ searchParams }: {
    searchParams: Promise<{ chapter?: string | string[] }>;
}) {
    const [cookieStore, query] = await Promise.all([cookies(), searchParams]);
    const savedLocale = cookieStore.get(localeCookieName)?.value ?? "en";
    const locale = isLocale(savedLocale) ? savedLocale : "en";

    const id = query.chapter;
    const index = typeof id === "string" ? chapters.findIndex(chapter => chapter.id === id) : -1;
    if (id !== undefined && index < 0) notFound();
    const current = chapters[index] ?? null;
    const ids = current ? (current.figures ?? []).filter(figure => manifest.assets[figure.asset]).map(figure => figure.asset) : [];
    const records = editorialMedia.assets as Record<string, { owner: string; sourceUrl: string | null }>;
    const chapter = current ? { ...current, figures: current.figures?.filter(figure => manifest.assets[figure.asset]).map(figure => ({ ...figure, credit: `© ${records[figure.asset].owner}`, sourceUrl: records[figure.asset].sourceUrl ?? undefined })) } : null;
    // Send only the current chapter and its media metadata to the client.
    const assets: AssetManifest = { ...manifest, assets: Object.fromEntries(ids.map(id => [id, manifest.assets[id]])) };
    return <Reader key={current?.id ?? "overview"} locale={locale} current={chapter} index={index}
        navigation={chapters.map(({id, title, part}) => ({id, title, part}))} parts={parts}
        assets={assets} sources={current ? current.sources.map(id => sources.find(source => source.id === id)).filter(source => source !== undefined) : []}
        rules={index === chapters.length - 1 ? appendix : []} />;
}
