"use client";

import Link from "next/link";
import { translations, type Locale } from "../translations";

export default function GameMonetizationPlaceholder({ locale }: { locale: Locale }) {
    const copy = translations[locale];

    return (
        <main className="grid min-h-svh place-items-center bg-black px-6 text-[#f1edc9]">
            <section className="max-w-xl border border-[#d6a348]/30 bg-[#0b0d0c] p-8 text-center shadow-2xl">
                <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#d6a348]">{copy.gameMonetization}</p>
                <h1 className="font-heading text-3xl uppercase tracking-wider">{copy.moduleLoading}</h1>
                <p className="mt-4 text-sm text-[#8f9687]">{copy.moduleDescription}</p>
                <Link href="/stepanoskin" className="mt-8 inline-block border border-[#e7df55]/50 px-5 py-3 text-xs uppercase tracking-[0.18em] text-[#e7df55] transition hover:bg-[#e7df55]/10">
                    {copy.backToMenu}
                </Link>
            </section>
        </main>
    );
}
