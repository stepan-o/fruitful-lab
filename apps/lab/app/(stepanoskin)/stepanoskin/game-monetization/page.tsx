import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { chapterVisualNotes } from "@/lib/sanctuary/visual-notes";
import Reader from "@/components/sanctuary/Reader";
import { appendix, chapters, parts, sources } from "@/lib/sanctuary/content";
import { sanctuaryMedia as manifest, sanctuaryMediaCredits as records } from "@/lib/sanctuary/media";
import { type AssetManifest } from "@/lib/assets/types";
import { isLocale, localeCookieName } from "../translations";

export const metadata: Metadata = {
    title: "Sanctuary Economics — Game Monetization | Stepan Oskin",
    description: "From a game in the corner to a world people meet in. An illustrated study of games, the lives around them and the work and payments that sustain them: 22 chapters, primary sources and interactive models.",
};


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
    const chapter = current ? { ...current, figures: current.figures?.filter(figure => manifest.assets[figure.asset]).map(figure => ({ ...figure, credit: records[figure.asset].displayCredit ?? `© ${records[figure.asset].owner}`, sourceUrl: records[figure.asset].sourceUrl ?? undefined })) } : null;
    // Send only the current chapter and its media metadata to the client.
    const assets: AssetManifest = { ...manifest, assets: Object.fromEntries(ids.map(id => [id, manifest.assets[id]])) };
    const chapterSources = current ? current.sources.map(id => sources.find(source => source.id === id)).filter(source => source !== undefined) : [];
    return <Reader key={current?.id ?? "overview"} locale={locale} current={chapter} index={index}
        navigation={chapters.map(({id, title, part}) => ({id, title, part}))} parts={parts}
        assets={assets} sources={chapterSources} visualNotes={chapter ? chapterVisualNotes(chapter,chapterSources) : []}
        rules={index === chapters.length - 1 ? appendix : []} />;
}
