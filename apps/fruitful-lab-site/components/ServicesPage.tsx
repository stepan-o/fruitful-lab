import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { PROCESS_STEPS, SERVICE_PACKAGES } from "@/lib/content";

export function ServicesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Services"
        title="A sharper way to build the ecosystem around the product."
        description="The exact offer language can keep sharpening. The operating model starts with fit, moves into a diagnostic, then builds the highest-leverage search, content, email, data, or workflow piece first."
      />

      <Section>
        <SectionInner>
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">Working model</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)]">
                Not a menu of tactics. A path into the right first move.
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                Fruitful Lab can still bring broad expertise, but the buying journey should feel guided: first conversation, paid clarity product, first useful build, then deeper partnership if the signals justify it.
              </p>
              <Link className="btn btn-primary mt-7" href="/contact">
                Book a fit call
              </Link>
            </div>

            <div>
              {SERVICE_PACKAGES.map((service, index) => (
                <article key={service.title} className="service-stage">
                  <div>
                    <span className="service-index">0{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[var(--cobalt)]">{service.kicker}</p>
                    <h2 className="mt-2 text-3xl font-extrabold leading-tight text-[var(--heading)]">{service.title}</h2>
                    <p className="mt-4 text-base leading-7 text-[var(--muted)]">{service.description}</p>
                    <p className="mt-5 text-sm font-black uppercase tracking-[0.12em] text-[var(--heading)]">Best for</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{service.bestFor}</p>
                    <Link className="btn btn-secondary mt-6" href="/contact">
                      {service.cta}
                    </Link>
                  </div>
                  <ul className="stage-includes">
                    {service.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </SectionInner>
      </Section>

      <Section surface="surface">
        <SectionInner>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="eyebrow">How decisions stay grounded</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)]">
                The goal is a useful first system, not a giant unfinished rebuild.
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                Each phase narrows the next decision so the work can move from strategy into visible assets, live systems, useful reporting, and measurable signals.
              </p>
            </div>
            <div className="path-shell grid gap-5 md:grid-cols-3">
              {PROCESS_STEPS.map((step, index) => (
                <article key={step.title} className="path-card p-6">
                  <span className="path-number">0{index + 1}</span>
                  <h3 className="mt-6 text-xl font-bold text-[var(--heading)]">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
