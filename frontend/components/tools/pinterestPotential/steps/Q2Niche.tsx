// frontend/components/tools/pinterestPotential/steps/Q2Niche.tsx
"use client";

// Q2 (AAA) — Boutique picker + smart drawer
// Visual polish:
// - Stronger hierarchy (bigger niche labels)
// - Meaningful icons per niche
// - “Scope” clarified as Audience size (Huge/Medium/Specific) + better explainer copy
//
// Lint-safe:
// - `selected` used
// - No setState-in-effect patterns

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { Segment, StepBaseProps } from "./ppcV2Types";
import {
    Utensils,
    Plane,
    Hammer,
    Sparkles,
    HeartPulse,
    Baby,
    Shirt,
    PiggyBank,
    Scissors,
    Shapes,
    Sofa,
    Droplets,
    ShoppingBag,
    Coffee,
    PawPrint,
    FileDown,
    Backpack,
    Speech,
    Palette,
    GraduationCap,
    Leaf,
    Briefcase,
    Camera,
    Home,
    PartyPopper,
    Calculator,
    type LucideIcon,
} from "lucide-react";

import type { NicheSlug, Segment as SpecSegment } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import {
    getNicheUiOptions,
    type AudiencePreviewLevel,
    type NicheUiOption,
} from "@/lib/tools/pinterestPotential/nicheUiAdapter";

type PreviewLevel = AudiencePreviewLevel;

function segmentHint(seg: Segment) {
    if (seg === "content_creator") return "Pick what you publish about most.";
    if (seg === "product_seller") return "Pick the category you sell into.";
    return "Pick the industry you serve.";
}

function normalize(s: string) {
    return s.toLowerCase().trim();
}

/**
 * Visualization-only mapping.
 * Adapter provides `iconKey` (canonical for UI), component maps it to a Lucide icon.
 * No niche logic here.
 */
const ICONS: Record<string, LucideIcon> = {
    // common
    Shapes,
    Sparkles,
    HeartPulse,
    PiggyBank,
    Calculator,

    // content creator
    Utensils,
    Plane,
    Hammer,
    Baby,
    Shirt,
    Scissors,

    // product seller
    Sofa,
    Droplets,
    ShoppingBag,
    Coffee,
    PawPrint,
    FileDown,
    Backpack,

    // service provider
    Speech,
    Palette,
    GraduationCap,
    Leaf,
    Briefcase,
    Camera,
    Home,
    PartyPopper,
};

function iconFromKey(iconKey: string): LucideIcon {
    return ICONS[iconKey] ?? Sparkles;
}

function audienceLabel(level: PreviewLevel) {
    if (level === "Focused") return "Specific";
    if (level === "Medium") return "Medium";
    return "Huge";
}

function audienceCopy(level: PreviewLevel) {
    if (level === "Focused") return "More specific audience → usually easier targeting + clearer messaging.";
    if (level === "Medium") return "Balanced audience size → good mix of reach + relevance.";
    return "Big audience → more competition, but more upside if you commit.";
}

function audienceBadge(level: PreviewLevel) {
    const tone =
        level === "Focused"
            ? "bg-[color-mix(in_srgb,var(--brand-rust)_18%,transparent)] border-[color-mix(in_srgb,var(--brand-rust)_40%,var(--border))]"
            : level === "Medium"
                ? "bg-[color-mix(in_srgb,var(--brand-bronze)_14%,transparent)] border-[color-mix(in_srgb,var(--brand-bronze)_40%,var(--border))]"
                : "bg-[color-mix(in_srgb,var(--brand-raspberry)_12%,transparent)] border-[color-mix(in_srgb,var(--brand-raspberry)_35%,var(--border))]";

    return (
        <span
            className={[
                "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] leading-none",
                tone,
                "text-[var(--foreground)]",
                "whitespace-nowrap",
            ].join(" ")}
            title={audienceCopy(level)}
        >
            Audience: {audienceLabel(level)}
        </span>
    );
}

function Highlight({ text, q }: { text: string; q: string }) {
    const qq = normalize(q);
    if (!qq) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(qq);
    if (idx < 0) return <>{text}</>;

    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + qq.length);
    const after = text.slice(idx + qq.length);

    return (
        <>
            {before}
            <span className="rounded-sm bg-[color-mix(in_srgb,var(--brand-bronze)_22%,transparent)] px-1 text-[var(--foreground)]">
                {match}
            </span>
            {after}
        </>
    );
}

function SmallChip({
                       children,
                       dot,
                       asButton,
                       onClick,
                   }: {
    children: React.ReactNode;
    dot?: boolean;
    asButton?: boolean;
    onClick?: () => void;
}) {
    const cls =
        "ppc-chip inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_55%,transparent)] px-3 py-1 text-xs text-[var(--foreground-muted)]";

    if (asButton) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={[
                    cls,
                    "transition hover:bg-[var(--card-hover)]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                ].join(" ")}
            >
                {dot ? (
                    <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--brand-raspberry)" }}
                        aria-hidden="true"
                    />
                ) : null}
                {children}
            </button>
        );
    }

    return (
        <span className={cls}>
            {dot ? (
                <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--brand-raspberry)" }}
                    aria-hidden="true"
                />
            ) : null}
            {children}
        </span>
    );
}

function NicheIcon({ Icon, active }: { Icon: LucideIcon; active: boolean }) {
    return (
        <span
            aria-hidden="true"
            className={[
                "grid place-items-center shrink-0 rounded-2xl border",
                "h-12 w-12",
                active
                    ? "border-[color-mix(in_srgb,var(--brand-raspberry)_55%,var(--border))] bg-[color-mix(in_srgb,var(--brand-raspberry)_16%,transparent)]"
                    : "border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_40%,transparent)]",
                "shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
            ].join(" ")}
        >
            <Icon
                className={["h-5 w-5", active ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"].join(" ")}
                strokeWidth={2}
            />
        </span>
    );
}

function Tile({
                  opt,
                  active,
                  onClick,
              }: {
    opt: NicheUiOption;
    active: boolean;
    onClick: () => void;
}) {
    const Icon = iconFromKey(opt.iconKey);
    const level = opt.audienceLevel as PreviewLevel;

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "fp-tap group relative w-full overflow-hidden rounded-2xl border p-4 text-left",
                "transition-[transform,background-color,border-color,box-shadow] duration-200",
                "bg-[color-mix(in_srgb,var(--background)_70%,transparent)] hover:bg-[color-mix(in_srgb,var(--card-hover)_70%,transparent)]",
                active
                    ? "border-[color-mix(in_srgb,var(--brand-raspberry)_65%,var(--border))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--brand-raspberry)_55%,transparent)]"
                    : "border-[var(--border)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
            ].join(" ")}
        >
            <div
                aria-hidden="true"
                className={[
                    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200",
                    "bg-[radial-gradient(1100px_circle_at_10%_10%,color-mix(in_srgb,var(--brand-raspberry)_22%,transparent),transparent_55%)]",
                    active ? "opacity-100" : "group-hover:opacity-80",
                ].join(" ")}
            />

            <div className="relative">
                <div className="flex items-start gap-3">
                    <NicheIcon Icon={Icon} active={active} />

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-base font-semibold tracking-tight text-[var(--foreground)] md:text-lg">
                                    {opt.label}
                                </div>

                                {opt.includes ? (
                                    <div className="mt-1 text-xs text-[var(--foreground-muted)]">{opt.includes}</div>
                                ) : null}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                {audienceBadge(level)}
                                {active ? (
                                    <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--brand-raspberry)_45%,var(--border))] bg-[color-mix(in_srgb,var(--brand-raspberry)_14%,transparent)] px-3 py-1 text-xs text-[var(--foreground)]">
                                        <span
                                            className="inline-block h-2 w-2 rounded-full"
                                            style={{ background: "var(--brand-raspberry)" }}
                                            aria-hidden="true"
                                        />
                                        Selected
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}

export default function Q2Niche({
                                    segment,
                                    value,
                                    onChange,
                                    onAutoAdvance,
                                }: StepBaseProps & {
    segment: Segment;
    value?: string;
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [assistOpen, setAssistOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Adapter is canonical for UI rendering (includes/search keywords/badges/icons).
    // Segment types may differ nominally between UI step props and the spec, so cast for adapter.
    const all = useMemo(() => getNicheUiOptions(segment as SpecSegment), [segment]);

    // Keep the same UI behavior: primary = first 6 non-"other" (ordered by adapter)
    const primary = useMemo(() => {
        const withoutOther = all.filter((x) => x.value !== ("other" as NicheSlug));
        return withoutOther.slice(0, 6);
    }, [all]);

    const selected = useMemo(() => all.find((o) => o.value === (value as NicheSlug | undefined)), [all, value]);

    const filtered = useMemo(() => {
        const qq = normalize(q);
        if (!qq) return all;

        return all.filter((o) => {
            const hay = [o.label, o.value, o.includes ?? "", ...(o.keywords ?? [])].join(" ").toLowerCase();
            return hay.includes(qq);
        });
    }, [all, q]);

    const [activeIdx, setActiveIdx] = useState(0);

    function select(v: string) {
        onChange(v);
        setOpen(false);
        setQ("");
        setActiveIdx(0);
        setAssistOpen(false);
        onAutoAdvance?.();
    }

    useEffect(() => {
        if (!open) return;
        const t = window.setTimeout(() => inputRef.current?.focus(), 60);
        return () => window.clearTimeout(t);
    }, [open]);

    function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((i) => Math.min(Math.max(filtered.length - 1, 0), i + 1));
            return;
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((i) => Math.max(0, i - 1));
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            const opt = filtered[activeIdx] ?? filtered[0];
            if (opt) select(opt.value);
            return;
        }
        if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            setAssistOpen(false);
            setQ("");
            setActiveIdx(0);
        }
    }

    return (
        <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-[var(--foreground-muted)]">{segmentHint(segment)}</div>

                <div className="relative flex flex-wrap items-center gap-2">
                    <SmallChip dot>Popular for you</SmallChip>

                    <SmallChip asButton onClick={() => setAssistOpen((v) => !v)}>
                        Not sure? Pick closest match
                    </SmallChip>

                    {assistOpen ? (
                        <div
                            className={[
                                "absolute right-0 top-[110%] z-20 w-[320px] max-w-[90vw]",
                                "rounded-2xl border border-[var(--border)]",
                                "bg-[color-mix(in_srgb,var(--background)_92%,transparent)] p-3",
                                "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
                            ].join(" ")}
                            role="note"
                        >
                            <div className="text-xs text-[var(--foreground)]">Choose what your audience searches for — not your job title.</div>
                            <div className="mt-2 text-xs text-[var(--foreground-muted)]">Example: “nursery organization” beats “baby brand”.</div>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {primary.map((opt) => (
                    <Tile
                        key={opt.value}
                        opt={opt}
                        active={opt.value === value}
                        onClick={() => select(opt.value)}
                    />
                ))}

                <button
                    type="button"
                    onClick={() => {
                        setAssistOpen(false);
                        setQ("");
                        setActiveIdx(0);
                        setOpen(true);
                    }}
                    className={[
                        "fp-tap group relative w-full overflow-hidden rounded-2xl border p-4 text-left",
                        "border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_55%,transparent)] hover:bg-[var(--card-hover)]",
                        "transition-[transform,background-color,border-color,box-shadow] duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                    ].join(" ")}
                >
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-70"
                        style={{
                            background:
                                "radial-gradient(900px_circle_at_10%_10%, color-mix(in_srgb,var(--brand-bronze)_14%,transparent), transparent 55%)",
                        }}
                    />
                    <div className="relative">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-base font-semibold text-[var(--foreground)] md:text-lg">More niches</div>
                            <span className="text-xs text-[var(--foreground-muted)]">Search</span>
                        </div>
                        <div className="mt-2 text-xs text-[var(--foreground-muted)]">Type → filter → pick the closest match.</div>
                    </div>
                </button>
            </div>

            {selected ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_55%,transparent)] p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-xs text-[var(--foreground-muted)]">Your selection</div>
                            <div className="mt-1 flex items-center gap-3">
                                <NicheIcon Icon={iconFromKey(selected.iconKey)} active />
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-[var(--foreground)] md:text-base">{selected.label}</div>
                                    <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                                        {audienceCopy(selected.audienceLevel as PreviewLevel)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {audienceBadge(selected.audienceLevel as PreviewLevel)}
                    </div>
                </div>
            ) : null}

            <BottomSheet
                open={open}
                onClose={() => {
                    setOpen(false);
                    setAssistOpen(false);
                    setQ("");
                    setActiveIdx(0);
                }}
                title="Choose a niche"
                initialFocusSelector='input[data-autofocus="true"]'
            >
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <label className="text-xs text-[var(--foreground-muted)]">Search</label>
                        <input
                            ref={inputRef}
                            data-autofocus="true"
                            value={q}
                            onChange={(e) => {
                                setQ(e.target.value);
                                setActiveIdx(0);
                            }}
                            onKeyDown={onSearchKeyDown}
                            placeholder="Try: skincare, meal prep, nursery, home office…"
                            className={[
                                "w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] px-3 py-2 text-sm text-[var(--foreground)]",
                                "placeholder:text-[color-mix(in_srgb,var(--foreground-muted)_70%,transparent)]",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                            ].join(" ")}
                        />
                        <div className="text-xs text-[var(--foreground-muted)]">Tip: choose what your audience searches for (not your job title).</div>
                    </div>

                    {!q ? (
                        <div className="mt-1 grid gap-2">
                            <div className="text-xs font-semibold text-[var(--foreground)]">Popular for you</div>
                            <div className="grid gap-2 md:grid-cols-2">
                                {primary.map((opt) => {
                                    const active = opt.value === value;
                                    const Icon = iconFromKey(opt.iconKey);
                                    const level = opt.audienceLevel as PreviewLevel;

                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => select(opt.value)}
                                            className={[
                                                "fp-tap w-full rounded-xl border p-3 text-left transition-colors",
                                                "border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_45%,transparent)] hover:bg-[var(--card-hover)]",
                                                active ? "ring-1 ring-[color-mix(in_srgb,var(--brand-raspberry)_65%,transparent)]" : "",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_40%,transparent)]">
                                                        <Icon className="h-4 w-4 text-[var(--foreground-muted)]" />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold text-[var(--foreground)]">{opt.label}</div>
                                                        <div className="mt-1 text-xs text-[var(--foreground-muted)]">{opt.includes}</div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    {audienceBadge(level)}
                                                    {active ? <span className="text-xs text-[var(--foreground)]">✓</span> : null}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-2 grid gap-2">
                        <div className="text-xs font-semibold text-[var(--foreground)]">{q ? `Results (${filtered.length})` : "All niches"}</div>

                        {filtered.length === 0 ? (
                            <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_45%,transparent)] p-4 text-sm text-[var(--foreground-muted)]">
                                No matches. Try a broader keyword (e.g., “home”, “wellness”, “finance”).
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                {filtered.map((opt, idx) => {
                                    const isActiveRow = idx === activeIdx;
                                    const active = opt.value === value;
                                    const Icon = iconFromKey(opt.iconKey);
                                    const level = opt.audienceLevel as PreviewLevel;

                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => select(opt.value)}
                                            onMouseEnter={() => setActiveIdx(idx)}
                                            className={[
                                                "fp-tap w-full rounded-xl border p-3 text-left transition-colors",
                                                "border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] hover:bg-[var(--card-hover)]",
                                                active ? "ring-1 ring-[color-mix(in_srgb,var(--brand-raspberry)_65%,transparent)]" : "",
                                                isActiveRow ? "shadow-[0_0_0_1px_color-mix(in_srgb,var(--brand-bronze)_35%,transparent)]" : "",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_40%,transparent)]">
                                                        <Icon className="h-4 w-4 text-[var(--foreground-muted)]" />
                                                    </span>

                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold text-[var(--foreground)]">
                                                            <Highlight text={opt.label} q={q} />
                                                        </div>
                                                        <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                                                            <Highlight text={opt.includes ?? ""} q={q} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    {audienceBadge(level)}
                                                    {active ? <span className="text-xs text-[var(--foreground)]">✓</span> : null}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </BottomSheet>
        </div>
    );
}
