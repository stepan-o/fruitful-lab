// frontend/components/PublicHubLanding.tsx
import Link from "next/link";
import Button from "@/components/ui/Button";
import LabAnimatedBackdrop from "@/components/home/LabAnimatedBackdrop";
import { PUBLIC_NAV_LINKS } from "@/lib/nav";

// Helper to look up a nav link by its href in the shared config
const getNavLink = (href: string) =>
    PUBLIC_NAV_LINKS.find((item) => item.href === href);

// Static, server-friendly component — no client hooks required.
export default function PublicHubLanding() {
    // Resolve the three public entry links from shared config
    const toolsLink = getNavLink("/tools");
    const caseStudiesLink = getNavLink("/case-studies");
    const mainSiteLink = getNavLink("https://fruitfulpin.com");

    return (
        <div className="bg-[var(--background)] text-[var(--foreground)]">
            {/* Hero band that fills the viewport (minus header). Explainer moved below. */}
            <section className="relative flex w-full flex-col overflow-hidden bg-[var(--background)] min-h-[calc(100vh-72px)] justify-between">
                {/* Hero area */}
                <div className="relative flex-1">
                    {/* Animated backdrop fills this hero area */}
                    <LabAnimatedBackdrop />

                    {/* Foreground hero content */}
                    <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 pt-16 pb-10 sm:pt-18 sm:pb-12 lg:pt-20 lg:pb-16">
                        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                            {/* Text stack */}
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--brand-alabaster)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--brand-heading)]">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand-bronze)]" />
                                    Fruitful Lab · Tech &amp; Tools
                                </div>

                                <h1 className="font-heading text-3xl leading-tight text-[var(--brand-heading)] sm:text-4xl md:text-5xl md:leading-[1.2]">
                                    The engine room behind{" "}
                                    <span className="font-semibold text-[var(--brand-raspberry)]">
                                        Fruitful Pin.
                                    </span>
                                </h1>

                                <p className="mt-4 max-w-prose text-base sm:text-lg leading-relaxed sm:leading-relaxed text-[var(--foreground)]/90">
                                    This is the internal tools &amp; dashboards hub behind{" "}
                                    <span className="font-bold text-[var(--brand-raspberry)]">
                                        Fruitful Pin
                                    </span>{" "}
                                    — our Pinterest &amp; funnel studio. If you&apos;re looking for services,
                                    head to the main site.
                                </p>

                                {/* CTAs */}
                                <div className="mt-7 flex flex-wrap items-center gap-4">
                                    {/* Primary CTA with emphasized label + halo */}
                                    <div className="relative inline-flex flex-col items-start">
                                        {/* PULSING START HERE LABEL */}
                                        <span
                                            className="
                                                mb-3 inline-flex items-center gap-2
                                                rounded-full px-4 py-1.5
                                                text-[11px] sm:text-xs
                                                font-semibold uppercase tracking-[0.22em]
                                                text-[var(--brand-heading)]
                                                bg-[var(--brand-bronze)]
                                                shadow-sm
                                                animate-[start-here-pulse_1.8s_ease-in-out_infinite]
                                            "
                                        >
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--background)]" />
                                            Start here
                                        </span>

                                        {/* halo behind the main CTA */}
                                        <div className="pointer-events-none absolute left-0 top-7 -z-10 h-[150%] w-[125%] rounded-full bg-[var(--brand-raspberry)]/14 blur-xl animate-[hubPulse_6s_ease-in-out_infinite]" />

                                        {/*
                                            Note: Hero CTA URLs are sourced from PUBLIC_NAV_LINKS (via getNavLink),
                                            matching header/footer/cards. Edit hrefs in frontend/lib/nav.ts to update globally.
                                        */}
                                        <Button
                                            href={mainSiteLink?.href ?? "https://fruitfulpin.com"}
                                            variant="primary"
                                        >
                                            Go to Fruitful Pin site
                                        </Button>
                                    </div>

                                    <Button href={toolsLink?.href ?? "/tools"} variant="secondary">
                                        Browse public tools
                                    </Button>
                                </div>
                            </div>

                            {/* Right-side placeholder for future visuals/animation */}
                            <div className="hidden md:block">
                                <div className="h-64 w-full rounded-lg border border-[var(--brand-alabaster)] bg-gradient-to-br from-[var(--background)] via-[var(--brand-alabaster)]/35 to-[var(--background)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explainer strip now as its own section below the hero */}
            <section className="border-y border-[var(--brand-alabaster)] bg-[var(--brand-alabaster)]">
                <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 sm:py-12 lg:py-14">
                    <div>
                        <h3 className="font-heading text-xl text-[var(--brand-heading)]">
                            Internal dashboards
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/90">
                            Admin-only analytics, pacing, and performance views across Pinterest and funnels.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-heading text-xl text-[var(--brand-heading)]">
                            Smart tools &amp; calculators
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/90">
                            Public and gated utilities to plan campaigns, budgets, and creative — built for practitioners.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-heading text-xl text-[var(--brand-heading)]">
                            Deep-dive case studies
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/90">
                            Transparent breakdowns of strategy, experiments, and outcomes for real brands.
                        </p>
                    </div>
                </div>
            </section>

            {/* Public entry points – appear only after scrolling */}
            <section className="mx-auto max-w-[1200px] px-4 py-12 sm:py-14 lg:py-20">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Tools & Calculators */}
                    {toolsLink && (
                        <Link
                            href={toolsLink.href}
                            className="group rounded-lg border border-[var(--brand-alabaster)] bg-[var(--background)] p-5 transition hover:shadow-sm"
                        >
                            <h4 className="font-heading text-lg text-[var(--brand-heading)]">
                                {toolsLink.label}
                            </h4>
                            <p className="mt-2 text-sm text-[var(--foreground)]/80">
                                Explore utilities that help plan and optimize.
                            </p>
                            <span className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--brand-heading)] group-hover:underline">
                Go →
              </span>
                        </Link>
                    )}

                    {/* Case Studies */}
                    {caseStudiesLink && (
                        <Link
                            href={caseStudiesLink.href}
                            className="group rounded-lg border border-[var(--brand-alabaster)] bg-[var(--background)] p-5 transition hover:shadow-sm"
                        >
                            <h4 className="font-heading text-lg text-[var(--brand-heading)]">
                                {caseStudiesLink.label}
                            </h4>
                            <p className="mt-2 text-sm text-[var(--foreground)]/80">
                                See what&apos;s working across Pinterest and funnels.
                            </p>
                            <span className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--brand-heading)] group-hover:underline">
                                Browse →
                            </span>
                        </Link>
                    )}

                    {/* Main Agency Site (external) */}
                    {mainSiteLink && (
                        <a
                            href={mainSiteLink.href}
                            target={mainSiteLink.external ? "_blank" : undefined}
                            rel={mainSiteLink.external ? "noopener noreferrer" : undefined}
                            className="group rounded-lg border border-[var(--brand-alabaster)] bg-[var(--background)] p-5 transition hover:shadow-sm"
                        >
                            <h4 className="font-heading text-lg text-[var(--brand-heading)]">
                                {mainSiteLink.label}
                            </h4>
                            <p className="mt-2 text-sm text-[var(--foreground)]/80">
                                Learn about services, offers, and how we work.
                            </p>
                            <span className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--brand-heading)] group-hover:underline">
                                Visit →
                            </span>
                        </a>
                    )}
                </div>
            </section>
        </div>
    );
}
