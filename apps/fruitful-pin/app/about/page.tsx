import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { FIT_SIGNALS } from "@/lib/content";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About Fruitful Pin"
        title="We do not just pin. We strategize, optimize, and scale."
        description="Fruitful Pin is a boutique Pinterest agency for product brands and content creators who want more than visibility. They want a search-led system that supports traffic, conversions, and measurable growth."
      />
      <Section>
        <SectionInner className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-[var(--heading)]">From one Pinterest account to a repeatable growth system.</h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Fruitful Pin started with hands-on Pinterest work for a small bean-to-bar chocolate maker. The lesson stuck: when Pinterest is treated like a search engine and connected to real offers, it can become one of the most useful discovery channels in the business.
            </p>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Today, the work combines Pinterest SEO, creative systems, ads, reporting, and clear communication so each client gets strategy instead of random posting.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-xl font-semibold text-[var(--heading)]">The way we work</h3>
            <dl className="mt-5 space-y-4 text-sm leading-6">
              <div><dt className="font-semibold text-[var(--heading)]">Strategic over trendy</dt><dd className="text-[var(--muted)]">We build for long-term search behavior, not one-off trend spikes.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">Data-informed decisions</dt><dd className="text-[var(--muted)]">Keyword research, analytics, and clear reporting guide the next move.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">Clear human communication</dt><dd className="text-[var(--muted)]">You should understand what is happening and why it matters.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">Creativity with purpose</dt><dd className="text-[var(--muted)]">Pins should be useful, aligned, and connected to a destination that can convert.</dd></div>
            </dl>
          </div>
        </SectionInner>
      </Section>
      <Section surface="surface">
        <SectionInner>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--heading)]">You are in the right place if...</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {FIT_SIGNALS.good.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--heading)]">We are probably not the fit yet if...</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {FIT_SIGNALS.notYet.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          </div>
          <Link className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--raspberry)] px-6 text-sm font-semibold text-white" href="/contact">
            Talk through your fit
          </Link>
        </SectionInner>
      </Section>
    </div>
  );
}
