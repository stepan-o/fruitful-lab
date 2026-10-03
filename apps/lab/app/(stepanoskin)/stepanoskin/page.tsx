import type { Metadata } from "next";
import { cookies } from "next/headers";
import StepanoskinLanding from "./StepanoskinLanding";
import { isLocale, localeCookieName } from "./translations";

export const metadata: Metadata = {
    title: "Stepan Oskin | Loopforge",
    description: "Presentations by Stepan Oskin on data science, production systems, game monetization, and sustainable player economies.",
};

export default async function StepanoskinPage() {
    const cookieStore = await cookies();
    const savedLocale = cookieStore.get(localeCookieName)?.value ?? "en";
    const initialLocale = isLocale(savedLocale) ? savedLocale : "en";

    return <StepanoskinLanding initialLocale={initialLocale} />;
}
