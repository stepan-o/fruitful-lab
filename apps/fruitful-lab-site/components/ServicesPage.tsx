import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { PROCESS_STEPS, SERVICE_PACKAGES } from "@/lib/content";

export function ServicesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Services"
        title="Marketing systems, paid campaigns, AI workflows, and content engines."
        description="Fruitful Lab helps brands connect strategy, execution, and decision-making across the full customer path."
      />

      <Section>
        <SectionInner className="grid gap-5 md:grid-cols-2">
          {SERVICE_PACKAGES.map((service) => (
            <article key={service.title} className="flex h-full flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold text-[var(--bronze)]">{service.kicker}</p>
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
            <p className="text-sm font-semibold uppercase text-[var(--sage)]">Working model</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">Start with clarity, then build what the system actually needs.</h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              These steps keep the work grounded, even when the business has several channels, ideas, and offers competing for attention.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-6">
                <p className="text-sm font-semibold text-[var(--bronze)]">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold text-[var(--heading)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
