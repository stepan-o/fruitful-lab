// frontend/components/ui/ThemeToggle.tsx
"use client";

import { useEffect, useRef } from "react";

type Theme = "light" | "dark";

function systemPrefersDark(): boolean {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function getEffectiveTheme(): Theme {
    const t = document.documentElement.dataset.theme;
    if (t === "dark") return "dark";
    if (t === "light") return "light";
    return systemPrefersDark() ? "dark" : "light";
}

function readSavedTheme(): Theme | null {
    const saved = window.localStorage.getItem("theme");
    return saved === "light" || saved === "dark" ? saved : null;
}

function setExplicitTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
}

function clearExplicitTheme() {
    delete document.documentElement.dataset.theme; // follow system
    window.localStorage.removeItem("theme");
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
    const btnRef = useRef<HTMLButtonElement | null>(null);

    const syncButton = () => {
        const effective = getEffectiveTheme();
        const isDark = effective === "dark";
        const el = btnRef.current;
        if (!el) return;

        el.dataset.effectiveTheme = effective;
        el.setAttribute("aria-pressed", isDark ? "true" : "false");
        el.setAttribute(
            "aria-label",
            `Theme: ${isDark ? "Dark" : "Light"} (click to toggle)`
        );
    };

    useEffect(() => {
        const saved = readSavedTheme();
        if (saved) {
            document.documentElement.dataset.theme = saved;
        } else {
            clearExplicitTheme();
        }

        syncButton();

        const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
        if (!mq) return;

        const onChange = () => {
            if (!readSavedTheme()) {
                clearExplicitTheme();
            }
            syncButton();
        };

        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    const toggle = () => {
        const next: Theme = getEffectiveTheme() === "dark" ? "light" : "dark";
        setExplicitTheme(next);
        syncButton();
    };

    return (
        <button
            ref={btnRef}
            type="button"
            onClick={toggle}
            className={[
                "theme-toggle",
                "relative inline-flex items-center rounded-full border p-0.5 text-xs font-semibold select-none",
                "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]",
                "hover:bg-[var(--card-hover)] transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                className,
            ].join(" ")}
        >
            <span className="theme-toggle-label-light">Light</span>
            <span className="theme-toggle-label-dark">Dark</span>
        </button>
    );
}
