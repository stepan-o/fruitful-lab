import Link from "next/link";
import { CASE_STUDIES, PROCESS_STEPS, SERVICE_PACKAGES } from "@/lib/content";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto grid min-h-[calc(100svh-80px)] max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sage)]">Pinterest marketing for brands ready to compound</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-[var(--heading)] sm:text-5xl lg:text-6xl">
              Turn Pinterest into a search-driven growth channel.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Fruitful Pin builds Pinterest strategy, organic systems, and ad support for brands that want useful traffic, stronger discovery, and a channel that keeps working after the first post.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--raspberry)] px-6 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px]" href="/contact">
                Start with a fit check
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--heading)] transition hover:bg-white" href="/pinterest-services">
                Explore services
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[var(--raspberry)]">What changes with a plan</p>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="font-semibold text-[var(--heading)]">Pins get a job</dt>
                <dd className="mt-1 text-sm leading-6 text-[var(--muted)]">Every pin points to a useful page, product, guide, opt-in, or decision path.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--heading)]">Search leads the content</dt>
                <dd className="mt-1 text-sm leading-6 text-[var(--muted)]">Boards, titles, overlays, and landing pages use the language people already search.</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--heading)]">Reporting supports decisions</dt>
                <dd className="mt-1 text-sm leading-6 text-[var(--muted)]">We look at saves, clicks, traffic quality, and funnel signals instead of chasing monthly-view vanity metrics.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--sage)]">Services</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">Done-for-you Pinterest support for the stage you are actually in.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {SERVICE_PACKAGES.map((service) => (
              <article key={service.title} className="rounded-lg border border-[var(--border)] bg-white p-6">
                <p className="text-sm font-semibold text-[var(--raspberry)]">{service.kicker}</p>
                <h3 className="mt-3 text-xl font-semibold text-[var(--heading)]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--sage)]">Process</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">From pin to purchase, without random acts of content.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-sm font-semibold text-[var(--raspberry)]">Step {index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold text-[var(--heading)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-[var(--sage)]">Results</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">When Pinterest has a plan, it performs.</h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">A few client snapshots from organic strategy, ads, and seasonal campaign work.</p>
            </div>
            <div className="grid gap-4">
              {CASE_STUDIES.map((study) => (
                <article key={study.brand} className="rounded-lg border border-[var(--border)] bg-white p-5">
                  <h3 className="text-lg font-semibold text-[var(--heading)]">{study.brand}</h3>
                  <p className="mt-1 text-sm text-[var(--sage)]">{study.context}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{study.result}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
