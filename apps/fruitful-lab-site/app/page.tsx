import Link from "next/link";
import { ECOSYSTEM_ITEMS, PROCESS_STEPS, SERVICE_PACKAGES } from "@/lib/content";

export default function HomePage() {
  return (
    <div>
      <section className="hero-image border-b border-[var(--border)] text-white">
        <div className="mx-auto flex min-h-[74svh] max-w-6xl flex-col justify-center px-5 py-20 sm:px-8 lg:py-24">
          <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Fruitful Lab</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Marketing systems for brands that need clearer paths from attention to action.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84">
            Fruitful Lab is the umbrella studio for AI-aware marketing, funnels, paid campaigns, email, content systems, and the brand ecosystem behind Fruitful Pin, Bloom Whispers, Bricoli Studio, and future projects.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--heading)] shadow-sm transition hover:translate-y-[-1px]" href="/services">
              Explore services
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/45 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/16" href="/contact">
              Book a call
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--sage)]">Services</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">Strategy, systems, and implementation across the whole marketing path.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {SERVICE_PACKAGES.map((service) => (
              <article key={service.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold text-[var(--bronze)]">{service.kicker}</p>
                <h3 className="mt-3 text-xl font-semibold text-[var(--heading)]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--sage)]">How we start</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">A practical path for finding the right first move.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-6">
                <p className="text-sm font-semibold text-[var(--bronze)]">Step {index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold text-[var(--heading)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-[var(--sage)]">Brand ecosystem</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--heading)]">One umbrella, separate brands.</h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                Fruitful Lab can hold the bigger marketing systems work while each focused brand keeps its own voice, audience, and domain.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {ECOSYSTEM_ITEMS.map((item) => (
                <article key={item.name} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--bronze)]">{item.role}</p>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--heading)]">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
