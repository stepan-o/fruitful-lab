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
        title="The strategy and systems lab for making good products easier to discover."
        description="Fruitful Lab is where Susy and Stepan bring together product discovery, search, content ecosystems, funnels, paid media, analytics, testing, and AI-assisted workflows."
      />
      <Section>
        <SectionInner className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-[var(--heading)]">A parent brand for the work around the product.</h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Fruitful Lab sits above the more focused brands. It can hold the bigger strategic work: product story, search behavior, use-case content, funnels, email, paid media, analytics, reporting, A/B testing, AI workflows, and the custom tools that support smarter marketing decisions.
            </p>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              The existing sandbox remains separate. This site is the customer-facing home for the broader Fruitful Lab offer.
            </p>
          </div>
          <div className="lab-panel p-6 shadow-[var(--shadow-tight)]">
            <h3 className="text-xl font-semibold text-[var(--heading)]">The way we work</h3>
            <dl className="mt-5 space-y-4 text-sm leading-6">
              <div><dt className="font-semibold text-[var(--heading)]">Ecosystem over scattered tactics</dt><dd className="text-[var(--muted)]">Channels work better when the product story, search path, content, email, data, and reporting are connected.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">Search beyond one platform</dt><dd className="text-[var(--muted)]">Discovery can happen through Google, AI search, visual search, marketplace-style search, or Pinterest-style behavior.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">Data that changes decisions</dt><dd className="text-[var(--muted)]">Analytics, reporting, and A/B tests should make the next move clearer, not just fill a dashboard.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">AI with human judgment</dt><dd className="text-[var(--muted)]">AI should reduce friction and support decisions, not flatten the brand or replace strategic thinking.</dd></div>
              <div><dt className="font-semibold text-[var(--heading)]">Separate brands, clear boundaries</dt><dd className="text-[var(--muted)]">Fruitful Pin, Bloom Whispers, Bricoli Studio, and future brands can each keep their own audience and identity.</dd></div>
            </dl>
          </div>
        </SectionInner>
      </Section>
      <Section surface="surface">
        <SectionInner>
          <div className="max-w-3xl">
            <p className="eyebrow">Ecosystem</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">The bigger brand can hold more than one focused business.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {ECOSYSTEM_ITEMS.map((item) => (
              <article key={item.name} className="ecosystem-item">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--cobalt)]">{item.role}</p>
                <h3 className="mt-3 text-lg font-semibold text-[var(--heading)]">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
          <Link className="btn btn-primary mt-8" href="/contact">
            Talk about the bigger ecosystem
          </Link>
        </SectionInner>
      </Section>
    </div>
  );
}
