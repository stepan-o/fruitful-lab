"use client";

import { useEffect } from "react";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getCurrentTheme(): Theme {
    const t = document.documentElement.dataset.theme;
    return t === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
    // Initialize dataset theme (no React state needed)
    useEffect(() => {
        const saved = (window.localStorage.getItem("theme") as Theme | null) ?? null;

        if (saved === "light" || saved === "dark") {
            applyTheme(saved);
            return;
        }

        // No saved preference => follow system
        applyTheme(getPreferredTheme());

        // Optional: if user hasn't chosen a theme, keep following system changes
        const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
        if (!mq) return;

        const onChange = () => {
            const stillNoSaved = !window.localStorage.getItem("theme");
            if (stillNoSaved) applyTheme(getPreferredTheme());
        };

        // Safari compatibility
        if (typeof mq.addEventListener === "function") {
            mq.addEventListener("change", onChange);
            return () => mq.removeEventListener("change", onChange);
        } else {
            mq.addListener(onChange);
            return () => mq.removeListener(onChange);
        }
    }, []);

    const toggle = () => {
        const next: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
        applyTheme(next);
        window.localStorage.setItem("theme", next);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className={[
                "theme-toggle",
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]",
                "hover:bg-[var(--card-hover)] transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                className,
            ].join(" ")}
            aria-label="Toggle theme"
        >
            <span className="theme-toggle-dot inline-block h-2 w-2 rounded-full" />
            <span className="theme-toggle-label-light">Light</span>
            <span className="theme-toggle-label-dark">Dark</span>
        </button>
    );
}
