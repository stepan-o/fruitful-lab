// frontend/components/PublicHubLanding.tsx
import Link from "next/link";

// Static, server-friendly component — no client hooks required.
export default function PublicHubLanding() {
  return (
    <div className="bg-white text-[#171A21]">
      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-4 pt-10 pb-10 sm:pt-12 sm:pb-12 lg:pt-20 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* Text stack */}
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DFDFDF] bg-white px-3 py-1 text-xs text-[#0B132B]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D58936]" />
              Fruitful Lab · Tech & Tools
            </div>
            <h1 className="font-heading text-3xl leading-tight text-[#0B132B] sm:text-4xl md:text-5xl md:leading-[1.2]">
              The engine room behind Fruitful Pin.
            </h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-[#171A21]/90">
              This is the internal tools & dashboards hub behind Fruitful Pin — our Pinterest & funnel studio.
              If you&apos;re looking for services, head to the main site.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://fruitfulpin.com" // TODO: Confirm final marketing URL
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-[#950952] px-5 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-[#7f0846] focus:outline-none focus:ring-2 focus:ring-[#950952]/30"
              >
                Go to Fruitful Pin site
              </a>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-md border border-[#0B132B] bg-white px-5 py-3 font-body text-sm font-medium text-[#0B132B] transition hover:bg-[#DFDFDF]"
              >
                Browse public tools
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-3 py-2 text-sm text-[#0B132B] underline underline-offset-4 hover:text-[#071026]"
              >
                Sign in to dashboards
              </Link>
            </div>
          </div>

          {/* Right-side placeholder for future visuals/animation */}
          <div className="hidden md:block">
            <div className="h-64 w-full rounded-lg border border-[#DFDFDF] bg-gradient-to-br from-white via-[#FFF9F2] to-white" />
          </div>
        </div>
      </section>

      {/* Explainer strip */}
      <section className="border-y border-[#DFDFDF] bg-[#DFDFDF]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 sm:py-12 lg:py-16">
          <div>
            <h3 className="font-heading text-xl text-[#0B132B]">Internal dashboards</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#171A21]/90">
              Admin-only analytics, pacing, and performance views across Pinterest and funnels.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl text-[#0B132B]">Smart tools & calculators</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#171A21]/90">
              Public and gated utilities to plan campaigns, budgets, and creative — built for practitioners.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl text-[#0B132B]">Deep-dive case studies</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#171A21]/90">
              Transparent breakdowns of strategy, experiments, and outcomes for real brands.
            </p>
          </div>
        </div>
      </section>

      {/* Public entry points */}
      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/tools"
            className="group rounded-lg border border-[#DFDFDF] bg-white p-5 transition hover:shadow-sm"
          >
            <h4 className="font-heading text-lg text-[#0B132B]">Tools & Calculators</h4>
            <p className="mt-2 text-sm text-[#171A21]/80">Explore utilities that help plan and optimize.</p>
            <span className="mt-3 inline-flex items-center gap-2 text-sm text-[#0B132B] group-hover:underline">
              Go →
            </span>
          </Link>

          <Link
            href="/case-studies"
            className="group rounded-lg border border-[#DFDFDF] bg-white p-5 transition hover:shadow-sm"
          >
            <h4 className="font-heading text-lg text-[#0B132B]">Case Studies</h4>
            <p className="mt-2 text-sm text-[#171A21]/80">See what&apos;s working across Pinterest and funnels.</p>
            <span className="mt-3 inline-flex items-center gap-2 text-sm text-[#0B132B] group-hover:underline">
              Browse →
            </span>
          </Link>

          <a
            href="https://fruitfulpin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg border border-[#DFDFDF] bg-white p-5 transition hover:shadow-sm"
          >
            <h4 className="font-heading text-lg text-[#0B132B]">Main Agency Site</h4>
            <p className="mt-2 text-sm text-[#171A21]/80">Learn about services, offers, and how we work.</p>
            <span className="mt-3 inline-flex items-center gap-2 text-sm text-[#0B132B] group-hover:underline">
              Visit →
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
