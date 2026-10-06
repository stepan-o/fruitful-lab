"use client";

import type { PointerEvent, ReactNode } from "react";

type HoverSpotlightProps = {
  children: ReactNode;
  className?: string;
};

export function HoverSpotlight({ children, className = "" }: HoverSpotlightProps) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div className={`spotlight-hover ${className}`} onPointerMove={handlePointerMove}>
      {children}
      <span className="hover-cursor" aria-hidden="true">
        View map
      </span>
    </div>
  );
}
