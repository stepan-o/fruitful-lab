import type { Metadata } from "next";
import { cookies } from "next/headers";
import StepanoskinLanding from "./StepanoskinLanding";
import { isLocale, localeCookieName } from "./translations";

export const metadata: Metadata = {
    title: "Stepan Oskin | CV, projects & ideas",
    description: "Professional CV, projects and ideas by Stepan Oskin. Explore data science and production systems, Sanctuary Economics, and Loopforge.",
};

export default async function StepanoskinPage() {
    const cookieStore = await cookies();
    const savedLocale = cookieStore.get(localeCookieName)?.value ?? "en";
    const initialLocale = isLocale(savedLocale) ? savedLocale : "en";

    return <StepanoskinLanding initialLocale={initialLocale} />;
}
