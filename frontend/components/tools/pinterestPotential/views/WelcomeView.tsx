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

function safeClearPpcSessionDrafts() {
    try {
        if (typeof window === "undefined" || !window.sessionStorage) return;
        const ss = window.sessionStorage;
        const keys = Object.keys(ss);

        for (const k of keys) {
            if (/(pinterestPotential|pinterest_potential|ppc).*(draft|state|wizard|progress)/i.test(k)) {
                ss.removeItem(k);
            } else if (/pinterestPotential/i.test(k) && /(draft|state|wizard|progress)/i.test(k)) {
                ss.removeItem(k);
            }
        }
    } catch {
        // noop
    }
}

function useResolvedIsDark() {
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        const root = document.documentElement;
        const mql = window.matchMedia?.("(prefers-color-scheme: dark)");

        const compute = () => {
            const explicit = root.getAttribute("data-theme");
            if (explicit === "dark") return true;
            if (explicit === "light") return false;
            return Boolean(mql?.matches);
        };

        const apply = () => setIsDark(compute());
        apply();

        const onMql = () => apply();
        if (mql) {
            if ("addEventListener" in mql) (mql as any).addEventListener("change", onMql);
            else (mql as any).addListener(onMql);
        }

        const obs = new MutationObserver(() => apply());
        obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

        return () => {
            obs.disconnect();
            if (mql) {
                if ("removeEventListener" in mql) (mql as any).removeEventListener("change", onMql);
                else (mql as any).removeListener(onMql);
            }
        };
    }, []);

    return isDark;
}

export default function WelcomeView({ onStart, onReset }: WelcomeViewProps) {
    const [hasDraft, setHasDraft] = React.useState(false);
    const isDark = useResolvedIsDark();

    React.useEffect(() => {
        try {
            if (typeof window === "undefined" || !window.sessionStorage) return;

            const ss = window.sessionStorage;
            const keys = Object.keys(ss);

            const draftKey =
                keys.find((k) => /(pinterestPotential|pinterest_potential|ppc).*(draft|state|wizard|progress)/i.test(k)) ??
                keys.find((k) => /pinterestPotential/i.test(k)) ??
                null;

            if (!draftKey) return;

            const raw = ss.getItem(draftKey);
            if (!raw) return;

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

    const handleReset = React.useCallback(() => {
        try {
            onReset();
        } finally {
            safeClearPpcSessionDrafts();
            setHasDraft(false);
        }
    }, [onReset]);

    /**
     * LIGHT theme: neutral paper base + *subtle* brand fields.
     * Also desaturate the whole gradient layer so the animated ::before/::after
     * raspberry waves don’t flood the card.
     */
    const lightWelcomeBackground = React.useMemo(() => {
        return [
            // neutral paper base (no black)
            "radial-gradient(1200px 520px at 55% 35%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 56%, rgba(255,255,255,0.90) 100%)",
            // faint raspberry hint (much lower than before)
            "radial-gradient(880px 520px at 18% 18%, color-mix(in srgb, var(--brand-raspberry) 7%, transparent) 0%, transparent 70%)",
            // faint bronze warmth
            "radial-gradient(980px 560px at 88% 82%, color-mix(in srgb, var(--brand-bronze) 8%, transparent) 0%, transparent 72%)",
            // tiny depth from heading tone (keeps it premium without “pink wash”)
            "radial-gradient(900px 520px at 55% 18%, color-mix(in srgb, var(--brand-heading) 5%, transparent) 0%, transparent 74%)",
            // soft overall lift
            "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.72))",
        ].join(", ");
    }, []);

    const welcomeGradientStyle: React.CSSProperties | undefined = React.useMemo(() => {
        if (isDark) return undefined;

        return {
            background: lightWelcomeBackground,
            // key: this desaturates the animated pseudo-element waves too
            filter: "saturate(0.55) contrast(1.02)",
            opacity: 0.88,
        };
    }, [isDark, lightWelcomeBackground]);

    // Glows: also tone down in light so they don’t read “pink backdrop”
    const glow1Class = isDark ? "opacity-25" : "opacity-[0.10]";
    const glow2Class = isDark ? "opacity-15" : "opacity-[0.07]";

    return (
        <div className="ppc-hero-frame relative">
            <div aria-hidden="true" className="ppc-welcome-gradient absolute inset-0" style={welcomeGradientStyle} />

            <div aria-hidden="true" className="ppc-hero-sheen" />
            <div aria-hidden="true" className="ppc-hero-noise" />

            <div
                aria-hidden="true"
                className={[
                    "ppc-welcome-glow-1 pointer-events-none absolute -top-24 right-[-140px] h-72 w-72 rounded-full blur-3xl",
                    glow1Class,
                ].join(" ")}
                style={{ background: "var(--brand-raspberry)" }}
            />
            <div
                aria-hidden="true"
                className={[
                    "ppc-welcome-glow-2 pointer-events-none absolute -bottom-24 left-[-140px] h-72 w-72 rounded-full blur-3xl",
                    glow2Class,
                ].join(" ")}
                style={{ background: "var(--brand-raspberry)" }}
            />

            <div className="relative p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="ppc-chip inline-flex items-center gap-2 px-3 py-1 text-xs text-[var(--foreground-muted)]">
                        <span className="h-2 w-2 rounded-full" style={{ background: "var(--brand-raspberry)" }} />
                        <span className="whitespace-nowrap">8 questions</span>
                        <span aria-hidden="true">·</span>
                        <span className="whitespace-nowrap">~60 seconds</span>
                        <span aria-hidden="true">·</span>
                        <span className="whitespace-nowrap">{hasDraft ? "resume available" : "progress saved"}</span>
                    </div>

                    <div className="text-xs text-[var(--foreground-muted)]">No email required to start.</div>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                    <div>
                        <div className="text-sm text-[var(--foreground-muted)]">Pinterest Potential</div>

                        <h2 className="mt-1 font-heading text-[28px] leading-[1.05] tracking-[-0.02em] text-[var(--foreground)] sm:text-[36px]">
                            See your Pinterest growth snapshot.
                        </h2>

                        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-[var(--foreground-muted)]">
                            Answer a few quick questions and we’ll estimate your monthly audience + opportunity — then give you a
                            simple starting plan based on your business.
                        </p>

                        <div className="mt-5 grid gap-2">
                            {[
                                ["Audience estimate", "(monthly range)"],
                                ["Opportunity snapshot", "(traffic / leads / sales context)"],
                                ["3 next steps", "(what to do first)"],
                            ].map(([strong, muted]) => (
                                <div key={strong} className="flex items-start gap-2">
                  <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]">
                    <BulletIcon className="h-4 w-4" />
                  </span>
                                    <div className="text-sm text-[var(--foreground)]">
                                        <span className="font-semibold">{strong}</span>{" "}
                                        <span className="text-[var(--foreground-muted)]">{muted}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="ppc-cta-wrap ppc-cta-pulse fp-tap">
                <button
                    type="button"
                    onClick={onStart}
                    className={[
                        "ppc-primary-btn inline-flex items-center gap-2 rounded-xl bg-[var(--brand-raspberry)]",
                        "px-6 py-3 text-sm font-semibold text-white",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                    ].join(" ")}
                >
                  {primaryLabel}
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                </button>
              </span>

                            <button
                                type="button"
                                onClick={handleReset}
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

                    <div className="hidden lg:flex justify-end">
                        <div className="ppc-preview-stack" aria-hidden="true">
                            <div className="ppc-preview-card ppc-preview-card-3" />
                            <div className="ppc-preview-card ppc-preview-card-2" />

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
                                            {["Business type", "Offer", "Content cadence"].map((t) => (
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
                        </div>
                    </div>
                </div>

                <div className="mt-6 lg:hidden">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 backdrop-blur-sm">
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
