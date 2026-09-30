import type { Metadata } from "next";
import { cookies } from "next/headers";
import GameMonetizationPlaceholder from "./GameMonetizationPlaceholder";
import { isLocale, localeCookieName } from "../translations";

export const metadata: Metadata = {
    title: "Game Monetization | Stepan Oskin",
};

export default async function GameMonetizationPage() {
    const cookieStore = await cookies();
    const savedLocale = cookieStore.get(localeCookieName)?.value ?? "en";
    const locale = isLocale(savedLocale) ? savedLocale : "en";

    return <GameMonetizationPlaceholder locale={locale} />;
}
