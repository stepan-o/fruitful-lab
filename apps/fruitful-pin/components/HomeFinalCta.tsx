"use client";

import Link from "next/link";
import type { PointerEvent } from "react";

type HomeFinalCtaProps = {
  bookingUrl: string;
  fitCallLabel: string;
};

export function HomeFinalCta({ bookingUrl, fitCallLabel }: HomeFinalCtaProps) {
  function moveGlow(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") {
      return false;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);

    return true;
  }

  return (
    <section className="home-final-cta-section px-5 py-14 sm:px-8 lg:py-20">
      <div
        className="home-final-cta-panel mx-auto max-w-6xl"
        onPointerEnter={(event) => {
          if (moveGlow(event)) {
            event.currentTarget.dataset.glow = "active";
          }
        }}
        onPointerMove={moveGlow}
        onPointerLeave={(event) => {
          delete event.currentTarget.dataset.glow;
        }}
      >
        <div className="home-final-cta-content">
          <p className="eyebrow">Start here</p>
          <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
            Not sure <span className="text-gradient">where Pinterest fits</span>? That is exactly where we start.
          </h2>
          <p>
            You do not need to know whether you need organic management, ads, a cleaner account, or a better content path before you reach out. Start with the option that matches where you are right now.
          </p>
        </div>

        <div className="home-final-cta-options">
          <article className="home-final-cta-option home-final-cta-option-primary">
            <span className="home-final-cta-option-label">Primary path</span>
            <h3 className="headline-card text-[var(--heading)]">Ready for a conversation?</h3>
            <p>Book a Pinterest Fit Call and we&apos;ll look at whether Pinterest makes sense for your business, your audience, and what you want to grow.</p>
            <Link className="button-primary mt-6 inline-flex min-h-12 items-center justify-center px-6" href={bookingUrl}>
              {fitCallLabel}
            </Link>
          </article>

          <article className="home-final-cta-option">
            <span className="home-final-cta-option-label">Softer path</span>
            <h3 className="headline-card text-[var(--heading)]">Still figuring it out?</h3>
            <p>Take the Pinterest Fit Check and get a quick direction based on your offer, content, website, and goals.</p>
            <Link className="button-outline mt-6" href="#pinterest-fit-check-home">
              Start the Fit Check
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
