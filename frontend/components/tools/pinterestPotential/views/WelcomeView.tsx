// frontend/components/tools/pinterestPotential/views/WelcomeView.tsx
"use client";

import React from "react";

export type WelcomeViewProps = {
    onStart: () => void;
    onReset: () => void;
};

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
            <path
                d="M7.5 4.5h8m0 0v8m0-8L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
            />
        </svg>
    );
}

function BulletIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
            <path
                d="M8.2 13.6 4.9 10.3l1.2-1.2 2.1 2.1 5.7-5.7 1.2 1.2-6.9 6.9Z"
                fill="currentColor"
                opacity="0.9"
            />
        </svg>
    );
}

export default function WelcomeView({ onStart, onReset }: WelcomeViewProps) {
    const [hasDraft, setHasDraft] = React.useState(false);

    React.useEffect(() => {
        // Heuristic: we persist progress in sessionStorage. We don’t want to hardcode one key
        // because keys evolve across iterations — so we scan for anything that looks like PPC draft state.
        try {
            if (typeof window === "undefined" || !window.sessionStorage) return;

            const ss = window.sessionStorage;
            const keys = Object.keys(ss);

            const draftKey =
                keys.find((k) =>
                    /(pinterestPotential|pinterest_potential|ppc).*(draft|state|wizard)/i.test(k),
                ) ??
                keys.find((k) => /pinterestPotential/i.test(k)) ??
                null;

            if (!draftKey) return;

            const raw = ss.getItem(draftKey);
            if (!raw) return;

            // If it's JSON-ish and indicates any progress, treat as resumable.
            // If it's not JSON, presence alone is enough for "Resume".
            try {
                const parsed = JSON.parse(raw);
                const progressed =
                    Boolean(parsed?.started) ||
                    typeof parsed?.stepIndex === "number" ||
                    typeof parsed?.step === "number" ||
                    Boolean(parsed?.answers && Object.keys(parsed.answers).length > 0);
                setHasDraft(progressed || true);
            } catch {
                setHasDraft(true);
            }
        } catch {
            // noop
        }
    }, []);

    const primaryLabel = hasDraft ? "Resume" : "Start";

    return (
        <div className="ppc-hero-frame relative">
            {/* Animated gradient layer (CSS in globals.css) */}
            <div aria-hidden="true" className="ppc-welcome-gradient absolute inset-0" />

            {/* Sheen + noise (premium framing) */}
            <div aria-hidden="true" className="ppc-hero-sheen" />
            <div aria-hidden="true" className="ppc-hero-noise" />

            {/* Glows (kept) */}
            <div
                aria-hidden="true"
                className="ppc-welcome-glow-1 pointer-events-none absolute -top-24 right-[-140px] h-72 w-72 rounded-full opacity-25 blur-3xl"
                style={{ background: "var(--brand-raspberry)" }}
            />
            <div
                aria-hidden="true"
                className="ppc-welcome-glow-2 pointer-events-none absolute -bottom-24 left-[-140px] h-72 w-72 rounded-full opacity-15 blur-3xl"
                style={{ background: "var(--brand-raspberry)" }}
            />

            {/* Content */}
            <div className="relative p-6 sm:p-8">
                {/* Chip row */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="ppc-chip inline-flex items-center gap-2 px-3 py-1 text-xs text-[var(--foreground-muted)]">
                        <span className="h-2 w-2 rounded-full" style={{ background: "var(--brand-raspberry)" }} />
                        <span className="whitespace-nowrap">8 questions</span>
                        <span aria-hidden="true">·</span>
                        <span className="whitespace-nowrap">~60 seconds</span>
                        <span aria-hidden="true">·</span>
                        <span className="whitespace-nowrap">{hasDraft ? "resume available" : "progress saved"}</span>
                    </div>

                    {/* Tiny “no spam” trust note (subtle, optional) */}
                    <div className="text-xs text-[var(--foreground-muted)]">No email required to start.</div>
                </div>

                {/* Hero grid */}
                <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                    {/* Left: message + bullets + CTAs */}
                    <div>
                        <div className="text-sm text-[var(--foreground-muted)]">Pinterest Potential</div>

                        <h2 className="mt-1 font-heading text-[28px] leading-[1.05] tracking-[-0.02em] text-[var(--foreground)] sm:text-[36px]">
                            See your Pinterest growth snapshot.
                        </h2>

                        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-[var(--foreground-muted)]">
                            Answer a few quick questions and we’ll estimate your monthly audience + opportunity — then give you a
                            simple starting plan based on your business.
                        </p>

                        {/* What you’ll get */}
                        <div className="mt-5 grid gap-2">
                            <div className="flex items-start gap-2">
                <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]">
                  <BulletIcon className="h-4 w-4" />
                </span>
                                <div className="text-sm text-[var(--foreground)]">
                                    <span className="font-semibold">Audience estimate</span>{" "}
                                    <span className="text-[var(--foreground-muted)]">(monthly range)</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]">
                  <BulletIcon className="h-4 w-4" />
                </span>
                                <div className="text-sm text-[var(--foreground)]">
                                    <span className="font-semibold">Opportunity snapshot</span>{" "}
                                    <span className="text-[var(--foreground-muted)]">(traffic / leads / sales context)</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]">
                  <BulletIcon className="h-4 w-4" />
                </span>
                                <div className="text-sm text-[var(--foreground)]">
                                    <span className="font-semibold">3 next steps</span>{" "}
                                    <span className="text-[var(--foreground-muted)]">(what to do first)</span>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={onStart}
                                className={[
                                    "ppc-primary-btn fp-tap inline-flex items-center gap-2 rounded-xl bg-[var(--brand-raspberry)]",
                                    "px-6 py-3 text-sm font-semibold text-white transition",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                                ].join(" ")}
                            >
                                {primaryLabel}
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
                  <ArrowIcon className="h-4 w-4" />
                </span>
                            </button>

                            <button
                                type="button"
                                onClick={onReset}
                                className={[
                                    "fp-tap inline-flex items-center rounded-xl px-3 py-2 text-sm text-[var(--foreground-muted)] transition",
                                    "hover:text-[var(--foreground)]",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                                ].join(" ")}
                                aria-label="Reset progress"
                            >
                                Reset
                            </button>

                            <div className="w-full pt-1 text-xs text-[var(--foreground-muted)]">
                                Your inputs stay on this device for this session.
                            </div>
                        </div>
                    </div>

                    {/* Right: “product moment” preview */}
                    <div className="hidden lg:flex justify-end">
                        <div className="ppc-preview-stack" aria-hidden="true">
                            {/* Back cards */}
                            <div className="ppc-preview-card ppc-preview-card-3" />
                            <div className="ppc-preview-card ppc-preview-card-2" />

                            {/* Front card with content */}
                            <div className="ppc-preview-card ppc-preview-card-1">
                                <div className="relative p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-[var(--foreground-muted)]">Monthly audience</div>
                                        <div className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[10px] text-[var(--foreground-muted)]">
                                            estimate
                                        </div>
                                    </div>

                                    <div className="mt-2 font-heading text-xl text-[var(--foreground)]">
                                        18k – 62k
                                        <span className="ml-2 text-xs font-normal text-[var(--foreground-muted)]">people</span>
                                    </div>

                                    <div className="mt-4 grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-[var(--foreground-muted)]">Opportunity</div>
                                            <div className="text-xs text-[var(--foreground)] font-semibold">High</div>
                                        </div>

                                        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface)]">
                                            <div
                                                className="h-full w-[72%] rounded-full"
                                                style={{
                                                    background:
                                                        "linear-gradient(90deg, color-mix(in srgb, var(--brand-raspberry) 78%, transparent), color-mix(in srgb, var(--brand-bronze) 70%, transparent))",
                                                }}
                                            />
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {["Business type", "Offer", "Content cadence", "SEO", "Creative"].map((t) => (
                                                <span
                                                    key={t}
                                                    className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[10px] text-[var(--foreground-muted)]"
                                                >
                          {t}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Small chart glyph (subtle) */}
                            <div className="absolute -right-6 -top-6 h-14 w-14 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-3 backdrop-blur-sm">
                                <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-[var(--foreground)]" aria-hidden="true">
                                    <path
                                        d="M5 15v4m7-10v10m7-14v14"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        opacity="0.35"
                                    />
                                    <path
                                        d="M5 12c4-5 9-5 14-8"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        opacity="0.35"
                                    />
                                    <circle cx="19" cy="4" r="2" fill="currentColor" opacity="0.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile-only mini preview (lightweight) */}
                <div className="mt-6 lg:hidden">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-[var(--foreground-muted)]">Preview</div>
                            <div className="text-xs font-semibold text-[var(--foreground)]">Growth snapshot</div>
                        </div>
                        <div className="mt-2 flex items-end justify-between gap-3">
                            <div>
                                <div className="text-xs text-[var(--foreground-muted)]">Monthly audience</div>
                                <div className="mt-1 font-heading text-lg text-[var(--foreground)]">18k – 62k</div>
                            </div>
                            <div className="h-10 w-20 rounded-xl border border-[var(--border)] bg-[var(--surface)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
