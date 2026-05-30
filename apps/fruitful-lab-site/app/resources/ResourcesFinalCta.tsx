"use client";

import Link from "next/link";
import { useRef, type PointerEvent } from "react";

export function ResourcesFinalCta() {
  const ctaRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const cta = ctaRef.current;
    if (!cta) return;

    const rect = cta.getBoundingClientRect();
    cta.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    cta.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  }

  return (
    <section className="cfs-final-section" aria-label="Fruitful Lab resources call to action">
      <div className="cfs-final-cta" onPointerMove={handlePointerMove} ref={ctaRef}>
        <p className="cfs-kicker">Need the system before the template?</p>
        <h2>
          A resource can help.
          <br />
          A working growth system can <span>move the brand.</span>
        </h2>
        <p>
          If the real need is clarity around product discovery, search, content, lifecycle, data, or AI workflows, start
          with a fit call and we will decide the right first move.
        </p>
        <div className="cfs-actions cfs-actions-center">
          <Link className="cfs-button cfs-button-primary" href="/contact/">
            Book a fit call →
          </Link>
          <Link className="cfs-button cfs-button-dark" href="/services/">
            See services →
          </Link>
        </div>
      </div>
    </section>
  );
}
