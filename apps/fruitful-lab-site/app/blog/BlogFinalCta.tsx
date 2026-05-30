"use client";

import Link from "next/link";
import { useRef, type PointerEvent } from "react";

export function BlogFinalCta() {
  const ctaRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const cta = ctaRef.current;
    if (!cta) return;

    const rect = cta.getBoundingClientRect();
    cta.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    cta.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  }

  return (
    <section className="flb-final-section" aria-label="Fruitful Lab blog call to action">
      <div className="fl-shell flb-final-card" onPointerMove={handlePointerMove} ref={ctaRef}>
        <p>Let&apos;s build</p>
        <h2>
          Reading is one thing.
          <br />
          Building the system is another.
        </h2>
        <p>
          If a note points to a real bottleneck in your product discovery, search, content, lifecycle, data, or AI
          workflows, start with a fit call and we will name the clearest first move.
        </p>
        <div className="flb-final-actions">
          <Link className="btn-primary" href="/contact/">
            Start the intake -&gt;
          </Link>
          <Link className="btn-secondary" href="/services/">
            See services -&gt;
          </Link>
        </div>
      </div>
    </section>
  );
}
