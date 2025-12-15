"use client";

import { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

function systemPrefersDark(): boolean {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function getEffectiveTheme(): Theme {
    // If user explicitly set a theme, use it; otherwise use OS preference.
    const t = document.documentElement.dataset.theme;
    if (t === "dark") return "dark";
    if (t === "light") return "light";
    return systemPrefersDark() ? "dark" : "light";
}

function setExplicitTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
}

function clearExplicitTheme() {
    // Follow system (no data-theme attribute)
    delete document.documentElement.dataset.theme;
    window.localStorage.removeItem("theme");
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
    const [mounted, setMounted] = useState(false);
    const [effectiveTheme, setEffectiveThemeState] = useState<Theme>("light");

    const mq = useMemo(() => {
        if (typeof window === "undefined") return null;
        return window.matchMedia?.("(prefers-color-scheme: dark)") ?? null;
    }, []);

    useEffect(() => {
        // On mount: apply saved preference if any, else follow system (no data-theme)
        const saved = window.localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") {
            document.documentElement.dataset.theme = saved;
        } else {
            clearExplicitTheme();
        }

        // Set initial effective theme for UI
        setEffectiveThemeState(getEffectiveTheme());
        setMounted(true);

        if (!mq) return;

        const onChange = () => {
            const stillNoSaved = !window.localStorage.getItem("theme");
            if (stillNoSaved) {
                clearExplicitTheme(); // let CSS follow OS
            }
            setEffectiveThemeState(getEffectiveTheme());
        };

        // ✅ Use the modern API only (no deprecated addListener/removeListener)
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, [mq]);

    const toggle = () => {
        const next: Theme = getEffectiveTheme() === "dark" ? "light" : "dark";
        setExplicitTheme(next);
        setEffectiveThemeState(next);
    };

    // Avoid hydration mismatch flicker
    if (!mounted) return null;

    const isDark = effectiveTheme === "dark";

    return (
        <button
            type="button"
            onClick={toggle}
            className={[
                "theme-toggle",
                "relative inline-flex items-center rounded-full border p-0.5 text-xs font-semibold",
                "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]",
                "hover:bg-[var(--card-hover)] transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                className,
            ].join(" ")}
            aria-label={`Theme: ${isDark ? "Dark" : "Light"} (click to toggle)`}
            aria-pressed={isDark}
        >
            {/* Thumb */}
            <span
                className="pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-[var(--card-hover)] shadow-sm transition-transform duration-150 ease-out"
                style={{ transform: isDark ? "translateX(100%)" : "translateX(0%)" }}
            />

            {/* Segments */}
            <span
                className={[
                    "relative z-10 inline-flex items-center justify-center rounded-full px-3 py-1",
                    isDark ? "opacity-70" : "opacity-100",
                ].join(" ")}
            >
        Light
      </span>
            <span
                className={[
                    "relative z-10 inline-flex items-center justify-center rounded-full px-3 py-1",
                    isDark ? "opacity-100" : "opacity-70",
                ].join(" ")}
            >
        Dark
      </span>
        </button>
    );
}
