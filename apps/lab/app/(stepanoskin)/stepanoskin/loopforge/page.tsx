import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { isLocale, localeCookieName } from "../translations";
import LoopforgeLanding from "./LoopforgeLanding";

export const metadata: Metadata = {
    title: "Loopforge | AI Brain Factory",
    description: "Enter Loopforge: explore the game, study its engine, or take the director’s chair in the playable factory prototype.",
};

// Keep mobile browser chrome and the page's safe areas in the factory palette.
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: "#020504",
    colorScheme: "dark",
};

export default async function Page() {
    const saved = (await cookies()).get(localeCookieName)?.value ?? "en";
    return <LoopforgeLanding initialLocale={isLocale(saved) ? saved : "en"} />;
}
