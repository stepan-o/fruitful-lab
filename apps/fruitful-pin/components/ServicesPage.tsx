import Link from "next/link";
import { A_LA_CARTE, FAQS, PROCESS_STEPS, SERVICE_PACKAGES, TESTIMONIALS, TRUST_LOGOS } from "@/lib/content";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

export function ServicesPage() {
  return (
    <div className="bg-white">
      <section className="services-hero">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
          <div>
            <p className="eyebrow">Pinterest services</p>
            <h1 className="brand-display mt-5 text-4xl leading-tight text-[var(--heading)] sm:text-5xl lg:text-6xl">
              Pinterest support that starts with the <span className="text-gradient">fit</span>, not the posting schedule.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Fruitful Pin helps product brands and content-led businesses decide what Pinterest should do, then builds the organic or paid path around that job.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
              <a className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--brand-navy)] bg-white px-6 text-sm font-semibold text-[var(--brand-navy)] transition hover:bg-[var(--surface-warm)]" href="#services">
                Compare paths
              </a>
            </div>
          </div>

          <aside className="fit-call-note">
            <p className="eyebrow">How this page works</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)]">First, choose the job Pinterest needs to do.</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              The services below are not meant to force a package decision on the spot. They are a way to see which kind of Pinterest support matches the stage of the business.
            </p>
            <div className="mt-6 grid gap-3 text-sm leading-6 text-[var(--foreground)]">
              <p><span className="font-bold text-[var(--brand-pink)]">Organic</span> when the content library needs compounding search traffic.</p>
              <p><span className="font-bold text-[var(--brand-pink)]">Ads</span> when the funnel is ready for faster learning.</p>
              <p><span className="font-bold text-[var(--brand-pink)]">Full-funnel</span> when both sides need to work together.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
          <article className="activation-plan-card reveal-on-scroll">
            <div>
              <p className="eyebrow">The paid starting point</p>
              <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
                Start with a Pinterest Activation Plan.
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                After the fit call, the first paid step can be a focused roadmap: what Pinterest should do, what needs fixing first, and which service path makes sense before ongoing work begins.
              </p>
              <Link className="button-primary mt-7 inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
            </div>
            <div className="activation-steps">
              <p><span>01</span> Fit call</p>
              <p><span>02</span> Activation plan</p>
              <p><span>03</span> Ongoing support or focused add-ons</p>
            </div>
          </article>
        </div>
      </section>

      <section id="services" className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Core service paths</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              After the roadmap, ongoing Pinterest can take a few shapes.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Start with the path that matches the job Pinterest needs to do, then simplify or expand the support once the roadmap is clear.
            </p>
          </div>

          <div className="mt-9 grid gap-6">
            {SERVICE_PACKAGES.map((service, index) => (
              <article key={service.title} className="service-feature-card reveal-on-scroll">
                <div className="service-feature-main">
                  <p className="service-path-label">Path 0{index + 1}</p>
                  <p className="mt-3 text-sm font-bold text-[var(--brand-pink)]">{service.kicker}</p>
                  <h3 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)]">{service.title}</h3>
                  <p className="mt-4 text-base leading-7 text-[var(--muted)]">{service.description}</p>
                  <Link className="button-primary mt-6 inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold" href={BOOKING_URL}>
                    {service.cta || FIT_CALL_LABEL}
                  </Link>
                </div>
                <div className="service-feature-details">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">Best for</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{service.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">Expected outcome</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{service.outcome}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">Usually includes</p>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--muted)]">
                      {service.includes.slice(0, 3).map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-swell bg-[var(--surface-soft)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">How the work moves</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              A simple rhythm keeps Pinterest from becoming random again.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              This page can get more specific later. For now, the important idea is that every service moves through fit, path, and signal-reading.
            </p>
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

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Smaller starting points</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">One-time help when the knot needs untangling.</h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">Use these when you need clarity, setup, or a specific deliverable before committing to ongoing management.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {A_LA_CARTE.map((offer) => (
              <article key={offer.title} className="offer-card reveal-on-scroll">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-xl font-semibold text-[var(--heading)]">{offer.title}</h3>
                  <p className="text-sm font-bold text-[var(--brand-pink)]">{offer.price}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{offer.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-swell bg-[var(--surface-warm)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Proof and people</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              Brands have already trusted this Pinterest brain.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              This section is still a first pass, but the direction should feel more human: real brands, softer testimonial cards, and logo movement instead of static proof boxes.
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
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:py-20">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              A few things to know before choosing a service path.
            </h2>
          </div>
          <div className="grid gap-4">
            {FAQS.map((item) => (
              <article key={item.question} className="faq-card reveal-on-scroll">
                <h3 className="text-lg font-semibold text-[var(--heading)]">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-16 sm:px-8 lg:pb-20">
        <div className="cta-wave mx-auto max-w-6xl">
          <h2 className="brand-display max-w-3xl text-3xl leading-tight text-[var(--heading)] sm:text-5xl">The easiest next step is still a fit call.</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
            No complicated funnel yet. We use the call to figure out whether Pinterest is worth building, fixing, or leaving alone for now.
          </p>
          <Link className="button-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold" href={BOOKING_URL}>
            {FIT_CALL_LABEL}
          </Link>
        </div>
      </section>
    </div>
  );
}
