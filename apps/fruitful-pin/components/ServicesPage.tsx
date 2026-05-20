import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { A_LA_CARTE, CASE_STUDIES, SERVICE_PACKAGES } from "@/lib/content";

export function ServicesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Pinterest services"
        title="Pinterest strategy, management, and ads built around your actual funnel."
        description="Fruitful Pin helps product brands and content-led businesses turn Pinterest into a search-driven growth channel with clear offers, useful content, and reporting that supports decisions."
      />

      <Section>
        <SectionInner className="grid gap-5 lg:grid-cols-3">
          {SERVICE_PACKAGES.map((service) => (
            <article key={service.title} className="flex h-full flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold text-[var(--raspberry)]">{service.kicker}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--heading)]">{service.title}</h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
              <p className="mt-5 text-sm font-semibold text-[var(--heading)]">Best for</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{service.bestFor}</p>
              <ul className="mt-5 space-y-2 text-sm leading-6 text-[var(--foreground)]">
                {service.includes.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
              <Link className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--heading)] px-4 text-sm font-semibold text-white" href="/contact">
                {service.cta}
              </Link>
            </article>
          ))}
        </SectionInner>
      </Section>

      <Section surface="surface">
        <SectionInner>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--sage)]">Proof points</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">Pinterest works better when every pin has somewhere useful to send people.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {CASE_STUDIES.map((study) => (
              <article key={study.brand} className="rounded-lg border border-[var(--border)] bg-white p-5">
                <h3 className="text-lg font-semibold text-[var(--heading)]">{study.brand}</h3>
                <p className="mt-2 text-sm text-[var(--sage)]">{study.context}</p>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{study.result}</p>
              </article>
            ))}
          </div>
        </SectionInner>
      </Section>

      <Section>
        <SectionInner>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--sage)]">Smaller starting points</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">One-time and a la carte support.</h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">Use these when you need clarity, setup, or a specific deliverable before committing to ongoing management.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {A_LA_CARTE.map((offer) => (
              <article key={offer.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-xl font-semibold text-[var(--heading)]">{offer.title}</h3>
                  <p className="text-sm font-semibold text-[var(--raspberry)]">{offer.price}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{offer.description}</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--foreground)]">
                  {offer.includes.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
