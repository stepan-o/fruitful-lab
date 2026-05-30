"use client";

import Link from "next/link";
import { useRef, type PointerEvent } from "react";

export function AboutFinalCta() {
  const ctaRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const cta = ctaRef.current;
    if (!cta) return;

    const rect = cta.getBoundingClientRect();
    cta.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    cta.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  }

  return (
    <section className="cfs-final-section" aria-label="Fruitful Lab about call to action">
      <div className="cfs-final-cta" onPointerMove={handlePointerMove} ref={ctaRef}>
        <p className="cfs-kicker">Build with the lab</p>
        <h2>
          If the product is good,
          <br />
          the system around it should be <span>worthy of it.</span>
        </h2>
        <p>
          Start with a fit call. We will look at the product, the stage, the constraints, and the clearest first move
          before we recommend what to build.
        </p>
        <div className="cfs-actions cfs-actions-center">
          <Link className="cfs-button cfs-button-primary" href="/contact/">
            Start the intake →
          </Link>
          <Link className="cfs-button cfs-button-dark" href="/services/">
            See services →
          </Link>
        </div>
      </div>
    </section>
  );
}
