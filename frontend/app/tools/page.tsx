// frontend/app/tools/page.tsx
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
      "A quick planner for spend ranges, CPC/CPM assumptions, and conversion pacing. (Coming soon.)",
    status: "coming_soon",
  },
  {
    title: "Keyword Starter Kit Helper",
    description:
      "Generate a clean keyword starting map by category + intent, without keyword stuffing. (Coming soon.)",
    status: "coming_soon",
  },
];

function StatusPill({ status }: { status?: ToolCard["status"] }) {
  if (!status) return null;

  if (status === "live") {
    return (
      <span
        className="
          inline-flex items-center rounded-full border border-[var(--border)]
          bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold
          text-[var(--foreground)]
        "
      >
        Live
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex items-center rounded-full border border-[var(--border)]
        bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold
        text-[var(--foreground-muted)]
      "
    >
      Coming soon
    </span>
  );
}

export default function ToolsIndexPage() {
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

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const CardInner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-heading text-lg text-[var(--foreground)]">
                    {tool.title}
                  </h2>
                  <StatusPill status={tool.status} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                  {tool.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--foreground)]">
                  {tool.href ? "Open →" : "Not available yet"}
                </span>
              </>
            );

            const base =
              "group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition " +
              "hover:bg-[var(--card-hover)] hover:shadow-sm " +
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] " +
              "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";

            if (tool.href) {
              return (
                <Link key={tool.title} href={tool.href} className={base}>
                  {CardInner}
                </Link>
              );
            }

            return (
              <div
                key={tool.title}
                className={`${base} opacity-80`}
                aria-disabled="true"
              >
                {CardInner}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 text-sm">
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
