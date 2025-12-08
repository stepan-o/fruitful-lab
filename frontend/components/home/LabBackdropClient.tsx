"use client";

// frontend/components/home/LabBackdropClient.tsx
// Client-side physics loop driving 4 large drifting circles that bounce within
// the backdrop container bounds. Designed to be subtle and performant.

import { useEffect, useRef, useState } from "react";

// Circle instances represent the moving discs in the hero backdrop:
// - id: stable identifier for React keying
// - x/y: center position in pixels inside the container (mutable each frame)
// - vx/vy: velocity in pixels per second (px/sec)
// - radius: circle radius in pixels
// - color/opacity: rendering appearance only
type Circle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function LabBackdropClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const circlesRef = useRef<Circle[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  // Lightweight state to trigger re-renders; render reads from circlesRef.
  const [setFrame] = useState(0);

  // Initialize circles once container size is known.
  // - Spawns exactly 4 circles.
  // - Radii are chosen in a 220–420px range then clamped to fit the container.
  // - Positions and velocities are randomized within container bounds.
  const initCircles = (width: number, height: number) => {
    // Pick radii in 220–420px range, but clamp so they fit the container
    const minDim = Math.max(0, Math.min(width, height));
    const maxR = Math.max(40, Math.min(420, Math.floor(minDim / 2) - 10));
    const minR = Math.min(220, Math.max(40, Math.floor(minDim / 4)));

    const radii = [
      Math.floor(rand(minR, maxR)),
      Math.floor(rand(minR, maxR)),
      Math.floor(rand(minR, maxR)),
      Math.floor(rand(minR, maxR)),
    ];

    const brandColors = [
      "var(--brand-alabaster)",
      "var(--brand-raspberry)",
      "var(--brand-bronze)",
      "var(--brand-rust)",
    ];

    // Gentle speeds in px/sec so it feels like background drift
    const speeds = [24, 28, 32, 26];

    const circles: Circle[] = radii.map((r, i) => {
      // If container is too small, reduce radius to fit
      const radius = Math.min(r, Math.max(20, Math.floor(minDim / 3)));
      const x = rand(radius, Math.max(radius, width - radius));
      const y = rand(radius, Math.max(radius, height - radius));
      const angle = rand(0, Math.PI * 2);
      const speed = speeds[i % speeds.length];
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      // Softer opacity for lighter colors
      const color = brandColors[i % brandColors.length];
      const opacity = color.includes("alabaster") ? 0.08 : 0.12;

      return {
        id: i,
        x,
        y,
        vx,
        vy,
        radius: radius,
        color,
        opacity,
      };
    });

    circlesRef.current = circles;
  };

  // Main animation setup:
  // - Measures the container, initializes circles once, and observes resizes.
  // - Runs a requestAnimationFrame loop using px/sec velocities with wall bounces.
  // - Uses a frame-tick state update to trigger React re-renders from circlesRef.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const width = Math.max(0, Math.floor(rect.width));
      const height = Math.max(0, Math.floor(rect.height));
      const first = sizeRef.current.width === 0 || sizeRef.current.height === 0;
      sizeRef.current = { width, height };
      if (first) {
        initCircles(width, height);
        // Trigger initial paint
        setFrame((f) => f + 1);
      } else {
        // On resize, keep circles inside bounds; do not change velocities.
        // NOTE: This resize handler also mutates c.x and c.y (via clamping)
        // in addition to the initCircles() spawn and the per-frame RAF loop.
        const circles = circlesRef.current;
        for (const c of circles) {
          c.x = Math.min(Math.max(c.radius, c.x), Math.max(c.radius, width - c.radius));
          c.y = Math.min(Math.max(c.radius, c.y), Math.max(c.radius, height - c.radius));
        }
      }
    };

    measure();

    // Use ResizeObserver where available to adapt to viewport/layout changes
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
    } else {
      // Fallback: window resize listener
      const onResize = () => measure();
      window.addEventListener("resize", onResize);
      (ro as unknown as { disconnect?: () => void }) = {
        disconnect: () => window.removeEventListener("resize", onResize),
      } as ResizeObserver;
    }

    const loop = (ts: number) => {
      const { width, height } = sizeRef.current;
      if (width <= 0 || height <= 0) {
        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      const last = lastTsRef.current ?? ts;
      lastTsRef.current = ts;
      // Convert delta to seconds for speed in px/sec
      let dt = (ts - last) / 1000;
      // Clamp dt to avoid huge jumps after tab visibility changes
      if (dt > 0.05) dt = 0.05;

      const circles = circlesRef.current;
      for (const c of circles) {
        // Update positions
        c.x += c.vx * dt;
        c.y += c.vy * dt;

        // Wall collisions with clamping
        if (c.x - c.radius <= 0) {
          c.x = c.radius;
          c.vx *= -1;
        } else if (c.x + c.radius >= width) {
          c.x = width - c.radius;
          c.vx *= -1;
        }

        if (c.y - c.radius <= 0) {
          c.y = c.radius;
          c.vy *= -1;
        } else if (c.y + c.radius >= height) {
          c.y = height - c.radius;
          c.vy *= -1;
        }
      }

      // Trigger re-render; render reads from circlesRef
      setFrame((f) => (f + 1) % 1000000);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      if (ro) ro.disconnect();
    };
  }, []);

  // Render circles; use translate3d for GPU-accelerated movement
  const circles = circlesRef.current;

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {circles.map((c) => (
        <div
          key={c.id}
          className="absolute rounded-full"
          style={{
            width: c.radius * 2,
            height: c.radius * 2,
            transform: `translate3d(${c.x - c.radius}px, ${c.y - c.radius}px, 0)`,
            backgroundColor: c.color,
            opacity: c.opacity,
            filter: "blur(2px)",
            willChange: "transform",
          }}
        />)
      )}
    </div>
  );
}
