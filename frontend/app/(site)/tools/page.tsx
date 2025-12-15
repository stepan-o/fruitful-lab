// frontend/app/(site)/tools/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

type ToolCard = {
    title: string;
    description: string;
    href?: string;
    status?: "live" | "coming_soon";
};

const TOOLS: ToolCard[] = [
    {
        title: "Pinterest Potential Calculator",
        description:
            "Estimate how much traffic + lead volume Pinterest could realistically drive based on your site + cadence.",
        href: "/tools/pinterest-potential",
        status: "live",
    },
    {
        title: "Pinterest Ads Budget Estimator",
        description:
            "A quick planner for spend ranges, CPC/CPM assumptions, and conversion pacing.",
        status: "coming_soon",
    },
    {
        title: "Keyword Starter Kit Helper",
        description:
            "Generate a clean keyword starting map by category + intent, without keyword stuffing.",
        status: "coming_soon",
    },
];

function StatusPill({ status }: { status?: ToolCard["status"] }) {
    if (!status) return null;

    if (status === "live") {
        return (
            <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--foreground)]">
        Live
      </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--foreground-muted)]">
        Coming soon
      </span>
    );
}

export default function ToolsIndexPage() {
    const [primary, ...secondary] = TOOLS;

    return (
        <div className="bg-[var(--background)] text-[var(--foreground)]">
            <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12 lg:py-20">
                <div className="max-w-2xl">
                    <h1 className="font-heading text-3xl leading-tight sm:text-4xl">
                        Tools &amp; Calculators
                    </h1>
                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--foreground-muted)]">
                        A curated set of utilities for planning Pinterest campaigns, forecasting budgets,
                        and optimizing funnels. We’re polishing the first batch — but you can already try the
                        first tool below.
                    </p>
                </div>

                {/* PRIMARY TOOL */}
                <div className="mt-10">
                    <Link
                        href={primary.href!}
                        className="
              group block rounded-2xl border border-[var(--brand-raspberry)]
              bg-[var(--card)] p-8 transition
              hover:bg-[var(--card-hover)] hover:shadow-md hover:ring-1 hover:ring-[var(--brand-raspberry)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]
              focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
            "
                    >
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="font-heading text-xl sm:text-2xl">
                                {primary.title}
                            </h2>
                            <StatusPill status={primary.status} />
                        </div>

                        {/* Value line */}
                        <p className="mt-2 max-w-prose text-sm sm:text-base leading-relaxed text-[var(--foreground-muted)]">
                            Get a realistic traffic + lead range from Pinterest — based on your site + cadence.
                        </p>

                        {/* What you'll get */}
                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/80">
                                What you’ll get
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--foreground-muted)]">
                                <li>Estimated monthly clicks + sessions</li>
                                <li>Lead range based on conversion assumptions</li>
                                <li>Pacing suggestion: pins/week + time-to-signal</li>
                            </ul>
                        </div>

                        {/* What you'll need */}
                        <p className="mt-4 text-xs sm:text-sm text-[var(--foreground-muted)]">
                            You’ll need: your monthly traffic + email opt-in / conversion rate (or we’ll use defaults).
                        </p>

                        {/* Micro trust */}
                        <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">
                            Takes ~2 minutes • No login • Built for practitioners
                        </p>

                        {/* CTA Row */}
                        <div className="mt-6">
                            <span className="inline-flex items-center gap-2 font-medium text-[var(--foreground)]">
                                Open calculator →
                            </span>
                            <div className="mt-1">
                                <span className="text-xs text-[var(--foreground-muted)] underline underline-offset-4 transition-colors group-hover:text-[var(--brand-heading)]">
                                    What does this estimate?
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* SECONDARY / COMING SOON */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {secondary.map((tool) => (
                        <div
                            key={tool.title}
                            aria-disabled="true"
                            className="
                rounded-xl border border-[var(--border)]
                bg-[var(--card)] p-6
                opacity-70
              "
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-heading text-base text-[var(--foreground)]">
                                    {tool.title}
                                </h3>
                                <StatusPill status={tool.status} />
                            </div>

                            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                                {tool.description} <span className="italic">(Coming soon.)</span>
                            </p>

                            <span className="mt-4 inline-flex text-sm text-[var(--foreground-muted)]">
                Not available yet
              </span>
                        </div>
                    ))}
                </div>

                {/* FOOTER LINKS */}
                <div className="mt-12 flex flex-wrap items-center gap-4 text-sm">
                    <Link
                        href="/"
                        className="text-[var(--foreground)] underline underline-offset-4 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        ← Back to Tech Hub
                    </Link>

                    <a
                        href="https://fruitfulpin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--foreground)] underline underline-offset-4 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        Visit the main Fruitful Pin site
                    </a>
                </div>
            </section>
        </div>
    );
}
