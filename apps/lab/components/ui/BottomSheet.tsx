"use client";

import * as React from "react";
import { createPortal } from "react-dom";

type BottomSheetProps = {
    open: boolean;
    onClose: () => void;

    title?: string;
    description?: string;

    children: React.ReactNode;

    /** Close when clicking the scrim (default true) */
    closeOnScrim?: boolean;

    /** Close on ESC key (default true) */
    closeOnEsc?: boolean;

    /** Optional class overrides */
    className?: string;

    /**
     * Optional: focus a specific element when opening (e.g. search input)
     * Example: initialFocusSelector='input[data-autofocus="true"]'
     */
    initialFocusSelector?: string;
};

function getFocusable(container: HTMLElement | null): HTMLElement[] {
    if (!container) return [];
    const selectors = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
    );
}

export function BottomSheet({
                                open,
                                onClose,
                                title,
                                description,
                                children,
                                closeOnScrim = true,
                                closeOnEsc = true,
                                className = "",
                                initialFocusSelector,
                            }: BottomSheetProps) {
    const [mounted, setMounted] = React.useState(false);
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const lastActiveRef = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Save/restore focus
    React.useEffect(() => {
        if (!open) return;

        lastActiveRef.current = document.activeElement as HTMLElement | null;

        const t = window.setTimeout(() => {
            const panel = panelRef.current;

            // Prefer an explicit target (useful for search inputs)
            if (initialFocusSelector && panel) {
                const target = panel.querySelector<HTMLElement>(initialFocusSelector);
                if (target) {
                    target.focus();
                    return;
                }
            }

            const focusables = getFocusable(panel);
            if (focusables[0]) focusables[0].focus();
            else panel?.focus();
        }, 0);

        return () => window.clearTimeout(t);
    }, [open, initialFocusSelector]);

    React.useEffect(() => {
        if (open) return;

        const el = lastActiveRef.current;
        if (el && typeof el.focus === "function") {
            const t = window.setTimeout(() => el.focus(), 0);
            return () => window.clearTimeout(t);
        }
    }, [open]);

    // ESC + focus trap
    React.useEffect(() => {
        if (!open) return;

        function onKeyDown(e: KeyboardEvent) {
            if (closeOnEsc && e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key === "Tab") {
                const focusables = getFocusable(panelRef.current);
                if (focusables.length === 0) {
                    e.preventDefault();
                    return;
                }

                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                const active = document.activeElement as HTMLElement | null;

                // Shift+Tab on first -> loop to last
                if (e.shiftKey && active === first) {
                    e.preventDefault();
                    last.focus();
                    return;
                }

                // Tab on last -> loop to first
                if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus();
                    return;
                }
            }
        }

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose, closeOnEsc]);

    // Prevent background scroll while open
    React.useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!mounted) return null;

    return createPortal(
        <div
            aria-hidden={!open}
            className={[
                "fixed inset-0 z-[60]",
                open ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
        >
            {/* Scrim */}
            <button
                type="button"
                aria-label="Close"
                className={[
                    "fp-scrim absolute inset-0 h-full w-full",
                    // darker + on-brand, with your global blur helper
                    "bg-black/50",
                    "transition-opacity duration-200 motion-reduce:transition-none",
                    open ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={() => {
                    if (closeOnScrim) onClose();
                }}
            />

            {/* Panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title || "Bottom sheet"}
                ref={panelRef}
                tabIndex={-1}
                className={[
                    "absolute inset-x-0 bottom-0",
                    "max-h-[85vh] overflow-auto",
                    "outline-none",
                    "rounded-t-3xl border border-[var(--border)]",
                    "shadow-[0_-22px_70px_rgba(0,0,0,0.55)]",
                    "transition-transform duration-200 motion-reduce:transition-none",
                    open ? "translate-y-0" : "translate-y-full",
                    className,
                ].join(" ")}
                style={{
                    // IMPORTANT: kill the default white sheet.
                    // Use theme tokens so it looks correct in both light + dark.
                    background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--background) 92%, transparent), color-mix(in srgb, var(--card) 86%, transparent))",
                }}
            >
                {/* Grab handle */}
                <div className="flex justify-center pt-3">
                    <div className="h-1.5 w-12 rounded-full bg-[color-mix(in_srgb,var(--foreground-muted)_35%,transparent)]" />
                </div>

                {(title || description) && (
                    <div className="px-5 pt-3 pb-2">
                        {title && (
                            <h2 className="text-base font-semibold text-[var(--foreground)]">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className="px-5 pb-5 pt-2">{children}</div>
            </div>
        </div>,
        document.body,
    );
}
