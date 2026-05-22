import Link from "next/link";
import { CASE_STUDIES, PROCESS_STEPS, TESTIMONIALS, TRUST_LOGOS } from "@/lib/content";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

export const metadata = {
  title: "Case Studies",
  description: "Proof snapshots from Fruitful Pin Pinterest strategy, organic, ads, and seasonal campaign work.",
};

const portfolioSamples = [
  {
    title: "Pin creative system",
    label: "Design set",
    description: "A place for real pin examples, template families, and creative directions.",
  },
  {
    title: "Strategy map",
    label: "Search path",
    description: "A place for keyword maps, board structure, funnel sketches, and page paths.",
  },
  {
    title: "Campaign board",
    label: "Launch set",
    description: "A place for seasonal visuals, ad concepts, and campaign learning snapshots.",
  },
];

export default function CaseStudiesPage() {
  const [featuredStudy, ...supportingStudies] = CASE_STUDIES;

  return (
    <div className="bg-white">
      <section className="proof-hero">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_0.75fr] lg:items-center lg:py-20">
          <div className="max-w-4xl">
            <p className="eyebrow">Proof snapshots</p>
            <h1 className="brand-display mt-4 text-4xl leading-tight text-[var(--heading)] sm:text-5xl lg:text-6xl">
              Pinterest work with a real job, not just <span className="text-gradient">prettier pins.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              A first look at the brands, campaigns, and search-led work Fruitful Pin has supported: the strategy, the creative, the traffic path, and the results signals that make Pinterest worth taking seriously.
            </p>
          </div>
          <aside className="case-hero-proof-card reveal-on-scroll" aria-label="Proof preview">
            <span className="case-hero-pin">Pin</span>
            <strong>Strategy + creative + page path</strong>
            <p>Proof is stronger when the visual work and the business result are shown together.</p>
          </aside>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          {featuredStudy ? (
            <article className="case-study-feature zoom-on-scroll">
              <div>
                <p className="eyebrow">Featured snapshot</p>
                <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-5xl">
                  {featuredStudy.brand}: Pinterest built around the job it needed to do.
                </h2>
                <p className="mt-5 text-base leading-7 text-[var(--muted)]">{featuredStudy.result}</p>
                <div className="case-study-feature-metric mt-7">
                  <span>{featuredStudy.metricValue}</span>
                  <p>{featuredStudy.metricLabel}</p>
                </div>
              </div>
              <div className="case-study-visual-stack" aria-label="Case study visual summary">
                <div className="case-study-pin-card case-study-pin-card-large">
                  <span>Search path</span>
                  <strong>Organic + ads learning loop</strong>
                </div>
                <div className="case-study-mini-card">
                  <span>{featuredStudy.context}</span>
                  <strong>{featuredStudy.metricValue}</strong>
                </div>
                <div className="case-study-mini-card case-study-mini-card-pink">
                  <span>Creative proof</span>
                  <strong>pins with a job</strong>
                </div>
              </div>
            </article>
          ) : null}

          <div className="case-study-grid mt-8">
            {supportingStudies.map((study) => (
              <article key={study.brand} className="case-study-card reveal-on-scroll">
                <p className="case-study-metric">{study.metricValue}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">{study.metricLabel}</p>
                <h2 className="brand-display mt-5 text-2xl leading-tight text-[var(--heading)]">{study.brand}</h2>
                <p className="mt-2 text-sm font-bold text-[var(--brand-pink)]">{study.context}</p>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{study.result}</p>
                <p className="mt-auto pt-6 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">Proof snapshot</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-portfolio-section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:py-20">
          <div>
            <p className="eyebrow">Creative proof</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              Case studies can show the <span className="text-gradient">strategy and the visuals</span> together.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Some proof is a metric. Some proof is the system: the pin style, the search angle, the destination page, and the reason someone would click in the first place.
            </p>
          </div>
          <div className="case-portfolio-gallery" aria-label="Creative proof image slots">
            {portfolioSamples.map((sample, index) => (
              <article key={sample.title} className={`case-portfolio-image-card case-portfolio-image-card-${index + 1} reveal-on-scroll`}>
                <div className="case-portfolio-image" aria-hidden="true">
                  <span>{sample.label}</span>
                  <strong>{sample.title}</strong>
                </div>
                <p>{sample.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-swell case-proof-section bg-[var(--surface-warm)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Proof and people</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">Brands and creators have trusted this Pinterest brain.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Proof does not always start as a polished case-study page. Sometimes it starts as a clear result, a client note, or a pattern worth showing.
            </p>
          </div>
          <div className="proof-showcase mt-10">
            <div className="logo-marquee" aria-label="Client logos">
              <div className="logo-track">
                {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, index) => (
                  <span key={`${logo.name}-${index}`} className="logo-pill">{logo.name}</span>
                ))}
              </div>
            </div>
            <div className="testimonial-row">
              {TESTIMONIALS.map((testimonial) => (
                <article key={testimonial.brand} className="testimonial-card reveal-on-scroll">
                  <div className="flex items-center gap-3">
                    <span className="testimonial-avatar">{testimonial.initials}</span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold leading-snug text-[var(--heading)]">{testimonial.brand}</h3>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-rust)]">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-[var(--muted)]">&ldquo;{testimonial.quote}&rdquo;</p>
                  <p className="mt-4 text-sm font-bold text-[var(--brand-pink)]">{testimonial.outcome}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:py-20">
          <div>
            <p className="eyebrow">How proof gets built</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              Better proof starts with the right <span className="text-gradient">Pinterest job.</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Some brands need search-led organic structure. Others need creative testing, paid distribution, or a stronger destination after the click. The first step is naming the constraint clearly.
            </p>
            <Link className="button-primary mt-7 inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold" href={BOOKING_URL}>
              {FIT_CALL_LABEL}
            </Link>
          </div>
          <div className="process-ladder">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="process-step-card reveal-on-scroll">
                <span className="grid size-10 place-items-center rounded-full bg-[var(--brand-pink)] text-sm font-bold text-white">{index + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--heading)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
