import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isLocale, localeCookieName } from "../translations";
import LoopforgeLanding from "./LoopforgeLanding";

export const metadata: Metadata = {
    title: "Loopforge | AI Brain Factory",
    description: "Enter Loopforge: explore the game, study its engine, or take the director’s chair in the playable factory prototype.",
};

export default async function Page() {
    const saved = (await cookies()).get(localeCookieName)?.value ?? "en";
    return <LoopforgeLanding initialLocale={isLocale(saved) ? saved : "en"} />;
}
