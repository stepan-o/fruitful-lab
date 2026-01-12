// frontend/components/layout/FlashBanner.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FlashKind = "login_failed" | "login_success";

const COPY: Record<FlashKind, { title: string; message: string }> = {
    login_failed: {
        title: "Login failed",
        message: "Please check your email/password and try again.",
    },
    login_success: {
        title: "You’re signed in",
        message: "Welcome back — you can keep using the tools.",
    },
};

function isFlashKind(v: string | null): v is FlashKind {
    return v === "login_failed" || v === "login_success";
}

export default function FlashBanner({
                                        className = "",
                                        paramKey = "flash",
                                        topOffsetPx = 64,
                                        autoClearMs,
                                        stickyFailures = false,
                                    }: {
    className?: string;
    paramKey?: string;
    topOffsetPx?: number;
    autoClearMs?: number;
    stickyFailures?: boolean;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const raw = searchParams.get(paramKey);
    const flash = isFlashKind(raw) ? raw : null;
    const copy = flash ? COPY[flash] : null;

    // single source of truth for animation
    const [visible, setVisible] = useState(false);

    // prevent double-dismiss + manage timers
    const dismissingRef = useRef(false);
    const autoTimerRef = useRef<number | null>(null);
    const clearTimerRef = useRef<number | null>(null);

    const ANIM_MS = 180;

    const timingMs = useMemo(() => {
        if (!flash) return 0;
        if (typeof autoClearMs === "number") return autoClearMs;

        // ✅ success: subtle + quick
        if (flash === "login_success") return 5000;

        // ✅ failure: long (or sticky)
        if (flash === "login_failed") return stickyFailures ? 0 : 30000;

        return 0;
    }, [flash, autoClearMs, stickyFailures]);

    function clearFlashParam() {
        const next = new URLSearchParams(searchParams.toString());
        next.delete(paramKey);
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }

    function clearAllTimers() {
        if (autoTimerRef.current) {
            window.clearTimeout(autoTimerRef.current);
            autoTimerRef.current = null;
        }
        if (clearTimerRef.current) {
            window.clearTimeout(clearTimerRef.current);
            clearTimerRef.current = null;
        }
    }

    function dismiss() {
        if (dismissingRef.current) return;
        dismissingRef.current = true;

        clearAllTimers();

        // exit animation
        setVisible(false);

        // after exit anim, clear param (unmount)
        clearTimerRef.current = window.setTimeout(() => {
            clearFlashParam();
        }, ANIM_MS);
    }

    // enter animation when flash appears
    useEffect(() => {
        if (!flash) return;

        dismissingRef.current = false;
        clearAllTimers();

        // start hidden, then show next frame
        setVisible(false);
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(raf);
    }, [flash]);

    // auto dismiss timer
    useEffect(() => {
        if (!flash) return;
        if (!timingMs || timingMs <= 0) return;

        clearAllTimers();
        autoTimerRef.current = window.setTimeout(() => dismiss(), timingMs);

        return () => clearAllTimers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash, timingMs]);

    // cleanup on unmount
    useEffect(() => clearAllTimers, []);
    if (!flash || !copy) return null;

    const isError = flash === "login_failed";

    // ---------- VISUAL STYLE ----------
    // Keep "fixed" error look: glassy card + rust accent (NOT full rust fill)
    const accent = isError ? "var(--brand-rust)" : "var(--brand-alabaster)";

    const titleClass = isError
        ? "text-[var(--brand-rust)]"
        : "text-[var(--foreground)]";

    const messageClass = isError
        ? "text-[var(--foreground-muted)]"
        : "text-[var(--foreground-muted)]";

    const cardBg = "var(--card-hover)";

    // More emphasis for failure, subtle for success
    const cardShadow = isError
        ? `0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px ${accent}`
        : `0 10px 26px rgba(0,0,0,0.28)`;

    return (
        <div
            role="status"
            aria-live="polite"
            className={[
                "fixed right-4 z-50",
                "w-[calc(100%-2rem)] sm:w-auto sm:max-w-[520px]",
                className,
            ].join(" ")}
            style={{ top: topOffsetPx + 12 }}
        >
            <div
                className={[
                    "relative overflow-hidden rounded-xl border backdrop-blur",
                    "transform-gpu transition-all duration-200 ease-out",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
                ].join(" ")}
                style={{
                    background: cardBg,
                    borderColor: "var(--border)",
                    boxShadow: cardShadow,
                }}
            >
                {/* Left accent bar: rust for failure; subtle alabaster for success */}
                <div
                    className="absolute left-0 top-0 h-full w-1.5"
                    style={{ background: accent, opacity: isError ? 1 : 0.5 }}
                    aria-hidden="true"
                />

                <div className="flex items-start gap-3 px-4 py-3 pl-5">
                    <div className="min-w-0">
                        <p className={["text-base sm:text-lg font-semibold leading-snug", titleClass].join(" ")}>
                            {copy.title}
                        </p>
                        <p className={["mt-0.5 text-base sm:text-lg font-medium leading-snug", messageClass].join(" ")}>
                            {copy.message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={dismiss}
                        aria-label="Dismiss"
                        className={[
                            "ml-auto shrink-0 rounded-md border border-[var(--border)]",
                            "bg-[var(--card)] px-2 py-1",
                            "text-[var(--foreground)]/80 hover:text-[var(--foreground)]",
                            "hover:bg-[var(--surface)] transition-colors",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]",
                        ].join(" ")}
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}