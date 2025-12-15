// frontend/components/PublicHubLanding.tsx
import Link from "next/link";
import Button from "@/components/ui/Button";
import LabAnimatedBackdrop from "@/components/home/LabAnimatedBackdrop";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { PUBLIC_NAV_LINKS } from "@/lib/nav";

const getNavLink = (href: string) => PUBLIC_NAV_LINKS.find((item) => item.href === href);

export default function PublicHubLanding() {
    const toolsLink = getNavLink("/tools");
    const caseStudiesLink = getNavLink("/case-studies");
    const mainSiteLink = getNavLink("https://fruitfulpin.com");

    return (
        <div className="bg-[var(--background)] text-[var(--foreground)]">
            {/* Hero */}
            <section className="relative flex w-full flex-col overflow-hidden bg-[var(--background)] min-h-[calc(100vh-72px)] justify-between">
                <div className="relative flex-1">
                    <LabAnimatedBackdrop />

                    <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 pt-16 pb-10 sm:pt-18 sm:pb-12 lg:pt-20 lg:pb-16">
                        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                            {/* Text */}
                            <div>
                                {/* Theme toggle */}
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--foreground)]">
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand-bronze)]" />
                                        <span className="text-[var(--foreground-muted)]">Fruitful Lab ·</span>{" "}
                                        <span className="text-[var(--foreground)]">Tech &amp; Tools</span>
                                    </div>

                                    <ThemeToggle className="hidden sm:inline-flex" />
                                </div>
                                {/*Hero heading*/}
                                <h1 className="font-heading text-3xl leading-tight text-[var(--foreground)] sm:text-4xl md:text-5xl md:leading-[1.2]">
                                    The engine room behind{" "}
                                    <span className="font-semibold text-[var(--brand-raspberry)]">Fruitful Pin.</span>
                                </h1>
                                {/* Hero body*/}
                                <p className="mt-4 max-w-prose text-base sm:text-lg leading-relaxed text-[var(--foreground-muted)]">
                                    This is the internal tools &amp; dashboards hub behind{" "}
                                    <span className="font-semibold text-[var(--brand-raspberry)]">Fruitful Pin</span> — our Pinterest
                                    &amp; funnel studio. If you&apos;re looking for services, head to the main site.
                                </p>

                                {/* CTAs */}
                                <div className="mt-7 flex flex-wrap items-center gap-4">
                                    <div className="relative inline-flex flex-col items-start">
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

                                        <div className="pointer-events-none absolute left-0 top-7 -z-10 h-[150%] w-[125%] rounded-full bg-[var(--brand-raspberry)]/18 blur-xl animate-[hubPulse_6s_ease-in-out_infinite]" />

                                        <Button href={mainSiteLink?.href ?? "https://fruitfulpin.com"} variant="primary">
                                            Go to Fruitful Pin site
                                        </Button>
                                    </div>

                                    <Button href={toolsLink?.href ?? "/tools"} variant="secondary">
                                        Browse public tools
                                    </Button>
                                </div>
                            </div>

                            {/* Right placeholder */}
                            <div className="hidden md:block">
                                <div className="h-64 w-full rounded-lg border border-[var(--border)] bg-[var(--card)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explainer strip */}
            <section className="border-y border-[var(--border)] bg-[var(--surface)]">
                <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            title: "Internal dashboards",
                            body: "Admin-only analytics, pacing, and performance views across Pinterest and funnels.",
                        },
                        {
                            title: "Smart tools & calculators",
                            body: "Public and gated utilities to plan campaigns, budgets, and creative — built for practitioners.",
                        },
                        {
                            title: "Deep-dive case studies",
                            body: "Transparent breakdowns of strategy, experiments, and outcomes for real brands.",
                        },
                    ].map((b) => (
                        <div key={b.title}>
                            <h3 className="font-heading text-xl text-[var(--foreground)]">{b.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">{b.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Entry cards */}
            <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:py-20">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {toolsLink && (
                        <Link
                            href={toolsLink.href}
                            className="
                                group rounded-xl border border-[var(--border)] bg-[var(--card)]
                                p-6 transition
                                hover:bg-[var(--card-hover)] hover:shadow-sm
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]
                                focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
                            "
                            >
                            <h4 className="font-heading text-lg text-[var(--foreground)]">{toolsLink.label}</h4>
                            <p className="mt-2 text-sm text-[var(--foreground-muted)]">Explore utilities that help plan and optimize.</p>
                            <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--foreground)] group-hover:underline">
                                Go →
                            </span>
                        </Link>
                    )}

                    {caseStudiesLink && (
                        <Link
                            href={caseStudiesLink.href}
                            className="
                                group rounded-xl border border-[var(--border)] bg-[var(--card)]
                                p-6 transition
                                hover:bg-[var(--card-hover)] hover:shadow-sm
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]
                                focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
                            "
                            >
                            <h4 className="font-heading text-lg text-[var(--foreground)]">{caseStudiesLink.label}</h4>
                            <p className="mt-2 text-sm text-[var(--foreground-muted)]">See what&apos;s working across Pinterest and funnels.</p>
                            <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--foreground)] group-hover:underline">
                                Browse →
                            </span>
                        </Link>
                    )}

                    {mainSiteLink && (
                        <a
                            href={mainSiteLink.href}
                            target={mainSiteLink.external ? "_blank" : undefined}
                            rel={mainSiteLink.external ? "noopener noreferrer" : undefined}
                            className="
                                group rounded-xl border border-[var(--border)] bg-[var(--card)]
                                p-6 transition
                                hover:bg-[var(--card-hover)] hover:shadow-sm
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]
                                focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
                            "
                            >
                            <h4 className="font-heading text-lg text-[var(--foreground)]">{mainSiteLink.label}</h4>
                            <p className="mt-2 text-sm text-[var(--foreground-muted)]">Learn about services, offers, and how we work.</p>
                            <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--foreground)] group-hover:underline">
                                Visit →
                            </span>
                        </a>
                    )}
                </div>
            </section>
        </div>
    );
}
