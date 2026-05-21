import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { ECOSYSTEM_ITEMS } from "@/lib/content";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About Fruitful Lab"
        title="The umbrella for practical marketing systems, AI workflows, and focused brand experiments."
        description="Fruitful Lab is where Susi and Esteban bring together marketing, funnels, paid media, content, data, and AI-assisted operations into client-facing systems."
      />
      <Section>
        <SectionInner className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-[var(--heading)]">A parent brand for the work that connects the dots.</h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Fruitful Lab sits above the more focused brands. It can hold the bigger strategic work: Meta ads, funnels, email, content systems, AI workflows, analytics, and the custom tools that support smarter marketing decisions.
            </p>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              The existing sandbox remains separate. This site is the customer-facing home for the broader Fruitful Lab offer.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-xl font-semibold text-[var(--heading)]">The way we work</h3>
            <dl className="mt-5 space-y-4 text-sm leading-6">
              <div><dt className="font-semibold text-[var(--heading)]">Systems over scattered tactics</dt><dd className="text-[var(--muted)]">Channels work better when the offer, message, page, email, and reporting are connected.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">AI with human judgment</dt><dd className="text-[var(--muted)]">AI should reduce friction and support decisions, not flatten the brand or replace strategic thinking.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">Useful experiments</dt><dd className="text-[var(--muted)]">We prefer small, clear tests that teach the business something and can become reusable assets.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">Separate brands, clear boundaries</dt><dd className="text-[var(--muted)]">Fruitful Pin, Bloom Whispers, Bricoli Studio, and future brands can each keep their own audience and identity.</dd></div>
            </dl>
          </div>
        </SectionInner>
      </Section>
      <Section surface="surface">
        <SectionInner>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--sage)]">Ecosystem</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">The bigger brand can hold more than one focused business.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {ECOSYSTEM_ITEMS.map((item) => (
              <article key={item.name} className="rounded-lg border border-[var(--border)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--bronze)]">{item.role}</p>
                <h3 className="mt-3 text-lg font-semibold text-[var(--heading)]">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
          <Link className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--heading)] px-6 text-sm font-semibold text-white" href="/contact">
            Talk about the bigger system
          </Link>
        </SectionInner>
      </Section>
    </div>
  );
}
