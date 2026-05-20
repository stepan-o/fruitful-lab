import Link from "next/link";
import { SERVICES } from "@/lib/content";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto grid min-h-[calc(100svh-80px)] max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sage)]">
              Pinterest marketing for brands ready to compound
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-[var(--heading)] sm:text-5xl lg:text-6xl">
              Turn Pinterest from a content chore into a search-driven growth channel.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Fruitful Pin helps brands clarify their Pinterest opportunity, build a content and ads system, and connect discovery traffic to offers that are ready to convert.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--raspberry)] px-6 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px]" href="/contact">
                Start a Pinterest fit check
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--heading)] transition hover:bg-white" href="/services">
                Explore services
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[var(--raspberry)]">Foundation preview</p>
            <dl className="mt-6 space-y-5">
              {SERVICES.map((service) => (
                <div key={service.title}>
                  <dt className="font-semibold text-[var(--heading)]">{service.title}</dt>
                  <dd className="mt-1 text-sm leading-6 text-[var(--muted)]">{service.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-14 sm:px-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold text-[var(--heading)]">Headless WordPress later</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">This shell keeps the CMS boundary ready without touching A2 or the current WordPress site.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--heading)]">Cloudflare target</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">The app starts static-first for Cloudflare Pages and can move to Workers/OpenNext if dynamic needs appear.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--heading)]">Separate brand app</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Fruitful Pin lives beside Fruitful Lab, not inside it, so each site can deploy and evolve independently.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
