"use client";

import Link from "next/link";
import { useEffect } from "react";

type LegacyRedirectNoticeProps = {
  destination: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
};

export function LegacyRedirectNotice({ destination, eyebrow, title, body, ctaLabel }: LegacyRedirectNoticeProps) {
  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);

  return (
    <main className="bg-[var(--surface-warm)]">
      <section className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-start justify-center px-5 py-20 sm:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="brand-display mt-4 headline-section text-[var(--heading)]">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">{body}</p>
        <Link className="button-primary mt-8" href={destination}>
          {ctaLabel}
        </Link>
      </section>
    </main>
  );
}
