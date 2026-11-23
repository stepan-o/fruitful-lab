"use client";

// frontend/components/home/LabBackdropClient.tsx
// Client-side physics loop driving 4 large drifting circles that bounce within
// the backdrop container bounds. Theme-aware via CSS vars in app/globals.css.

import { useEffect, useRef, useState } from "react";

type Circle = {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;   // CSS color (var(...) or rgba(...))
    opacity: string; // CSS number as var(...) string
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
    const [, setFrame] = useState(0);

    const initCircles = (width: number, height: number) => {
        const minDim = Math.max(0, Math.min(width, height));
        const maxR = Math.max(40, Math.min(420, Math.floor(minDim / 2) - 10));
        const minR = Math.min(220, Math.max(40, Math.floor(minDim / 4)));

        const radii = [
            Math.floor(rand(minR, maxR)),
            Math.floor(rand(minR, maxR)),
            Math.floor(rand(minR, maxR)),
            Math.floor(rand(minR, maxR)),
        ];

        // Theme-aware palette from globals.css
        const backdropColors = [
            "var(--backdrop-color-1)",
            "var(--backdrop-color-2)",
            "var(--backdrop-color-3)",
            "var(--backdrop-color-4)",
        ];

        const speeds = [24, 28, 32, 26];

        const padding = 16;
        const unclampedMaxR = Math.max(...radii);
        const perCircleCap = Math.max(20, Math.floor(minDim / 3));
        const conservativeMaxRadius = Math.min(unclampedMaxR, perCircleCap);

        const clusterXMin = Math.max(conservativeMaxRadius + padding, Math.floor(width * 0.6));
        const clusterXMax = Math.min(width - conservativeMaxRadius - padding, Math.floor(width * 0.85));
        const clusterYMin = Math.max(conservativeMaxRadius + padding, Math.floor(height * 0.6));
        const clusterYMax = Math.min(height - conservativeMaxRadius - padding, Math.floor(height * 0.9));

        const clusterViable =
            width > 0 &&
            height > 0 &&
            clusterXMax >= clusterXMin &&
            clusterYMax >= clusterYMin;

        const clusterX = clusterViable ? rand(clusterXMin, clusterXMax) : 0;
        const clusterY = clusterViable ? rand(clusterYMin, clusterYMax) : 0;

        const circles: Circle[] = radii.map((r, i) => {
            const radius = Math.min(r, Math.max(20, Math.floor(minDim / 3)));
            let x: number;
            let y: number;

            if (clusterViable) {
                const jitterX = rand(-radius * 0.4, radius * 0.4);
                const jitterY = rand(-radius * 0.4, radius * 0.4);
                x = clusterX + jitterX;
                y = clusterY + jitterY;
                x = Math.min(Math.max(radius, x), Math.max(radius, width - radius));
                y = Math.min(Math.max(radius, y), Math.max(radius, height - radius));
            } else {
                x = rand(radius, Math.max(radius, width - radius));
                y = rand(radius, Math.max(radius, height - radius));
            }

            const angle = rand(0, Math.PI * 2);
            const speed = speeds[i % speeds.length];
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            const color = backdropColors[i % backdropColors.length];

            // Depth: alternate soft/strong opacity (theme-controlled in globals.css)
            const opacity = i % 2 === 0
                ? "var(--backdrop-opacity-soft)"
                : "var(--backdrop-opacity-strong)";

            return { id: i, x, y, vx, vy, radius, color, opacity };
        });

        circlesRef.current = circles;
    };

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
                setFrame((f) => f + 1);
            } else {
                const circles = circlesRef.current;
                for (const c of circles) {
                    c.x = Math.min(Math.max(c.radius, c.x), Math.max(c.radius, width - c.radius));
                    c.y = Math.min(Math.max(c.radius, c.y), Math.max(c.radius, height - c.radius));
                }
            }
        };

        measure();

        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(() => measure());
            ro.observe(el);
        } else {
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

            let dt = (ts - last) / 1000;
            if (dt > 0.05) dt = 0.05;

            const circles = circlesRef.current;
            for (const c of circles) {
                c.x += c.vx * dt;
                c.y += c.vy * dt;

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

            setFrame((f) => (f + 1) % 1000000);
            rafIdRef.current = requestAnimationFrame(loop);
        };

        rafIdRef.current = requestAnimationFrame(loop);

        return () => {
            if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
            if (ro) ro.disconnect();
        };
    }, []);

    const circles = circlesRef.current;

    return (
        <div ref={containerRef} className="relative h-full w-full">
            {circles.map((c) => (
                <div
                    key={c.id}
                    className="lab-backdrop-circle absolute rounded-full"
                    style={{
                        width: c.radius * 2,
                        height: c.radius * 2,
                        transform: `translate3d(${c.x - c.radius}px, ${c.y - c.radius}px, 0)`,

                        /*
                          Use currentColor so CSS can do:
                          box-shadow: 0 0 var(--backdrop-glow) currentColor;
                        */
                        color: c.color,
                        backgroundColor: "currentColor",

                        opacity: c.opacity,
                    }}
                />
            ))}
        </div>
    );
}
