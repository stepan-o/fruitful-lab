"use client";

import type { PointerEvent, ReactNode } from "react";

type CursorGlowPanelProps = {
  children: ReactNode;
  className?: string;
};

export function CursorGlowPanel({ children, className = "" }: CursorGlowPanelProps) {
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
    <div
      className={`cursor-glow-panel ${className}`}
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
      {children}
    </div>
  );
}
