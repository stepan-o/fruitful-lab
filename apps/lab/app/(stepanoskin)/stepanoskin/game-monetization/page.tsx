import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Reader from "@/components/sanctuary/Reader";
import { appendix, chapters, parts, sources } from "@/lib/sanctuary/content";
import rawManifest from "@/lib/assets/generated/sanctuary.json";
import { parseManifest, type AssetManifest } from "@/lib/assets/types";
import { isInternalResearchMode } from "@/lib/stepanoskin/media-policy";
import { isLocale, localeCookieName } from "../translations";

export const metadata: Metadata = {
    title: "Sanctuary Economics — Game Monetization | Stepan Oskin",
    description: "An illustrated study of game design, progress and monetization, with Diablo IV as the central case. 21 chapters, source notes and interactive models.",
};

const manifest = parseManifest(rawManifest, "sanctuary");

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
    const research = isInternalResearchMode();
    const ids = research && current ? (current.figures ?? []).map(figure => figure.asset) : [];
    // Send only the current chapter and its media metadata to the client.
    const assets: AssetManifest = { ...manifest, assets: Object.fromEntries(ids.map(id => [id, { ...manifest.assets[id], variants: manifest.assets[id].variants.map(file => ({ ...file, src: file.src.replace("/media/files/", "/research-media/") })) }])) };
    return <Reader key={current?.id ?? "overview"} locale={locale} research={research} current={current} index={index}
        navigation={chapters.map(({id, title, part}) => ({id, title, part}))} parts={parts}
        assets={assets} sources={sources.filter(source => current?.sources.includes(source.id))}
        rules={index === chapters.length - 1 ? appendix : []} />;
}
