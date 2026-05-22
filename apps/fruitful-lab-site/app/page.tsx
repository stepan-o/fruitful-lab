import Link from "next/link";
import { ECOSYSTEM_ITEMS, PROCESS_STEPS, SERVICE_PACKAGES } from "@/lib/content";

const CAPABILITIES = [
  {
    title: "Product discovery",
    description: "Use cases, buying moments, search behavior, and the product story people need before they choose.",
  },
  {
    title: "Search ecosystem",
    description: "Google search, AI search, visual search, and product-led content paths that help demand find you.",
  },
  {
    title: "Content architecture",
    description: "Educational, lifestyle, use-case-led, and product-direct content with clearer jobs in the funnel.",
  },
  {
    title: "Email and funnel",
    description: "Nurture, lead capture, launch, and purchase paths that move people from interest to trust.",
  },
  {
    title: "Data and testing",
    description: "Analytics, reporting, A/B tests, and AI-supported workflows that make the next decision clearer.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="lab-hero">
        <div className="hero-blob hero-blob-a" aria-hidden="true" />
        <div className="hero-blob hero-blob-b" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Fruitful Lab</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-normal leading-[0.95] text-[var(--heading)] sm:text-6xl lg:text-7xl">
              Good products should not be hard to <span className="gradient-text">discover.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Fruitful Lab helps specialty product brands make their best products easier to find, understand, and choose by connecting product story, search, content, email, data, testing, and AI-supported workflows.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="btn btn-primary" href="/services">
                Explore the approach
              </Link>
              <Link className="btn btn-secondary" href="/contact">
                Book a fit call
              </Link>
            </div>
            <div className="lab-proof-points mt-9">
              <span>Search</span>
              <span>Content</span>
              <span>Email</span>
              <span>Data</span>
            </div>
          </div>

          <div className="flow-map" aria-label="A connected product discovery ecosystem map">
            <div className="flow-orbit flow-orbit-main" aria-hidden="true" />
            <div className="flow-orbit flow-orbit-soft" aria-hidden="true" />
            <div className="map-node map-node-a">
              <strong>Product story</strong>
              <span>Why it matters and when people want it.</span>
            </div>
            <div className="map-node map-node-b">
              <strong>Search</strong>
              <span>Google, AI, visual, and intent-led discovery.</span>
            </div>
            <div className="map-node map-node-c">
              <strong>Content</strong>
              <span>Education, lifestyle, use cases, and product-direct assets.</span>
            </div>
            <div className="map-node map-node-d">
              <strong>Signals</strong>
              <span>Reporting, experiments, and sharper next moves.</span>
            </div>
          </div>
        </div>
        <div className="wave-divider wave-divider-mint" aria-hidden="true" />
      </section>

      <section className="section-plain flow-section">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 lg:pb-24 lg:pt-18">
          <div className="max-w-3xl">
            <p className="eyebrow">How the engagement flows</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)] sm:text-4xl">
              Start narrow enough to be useful, then build the ecosystem around the product.
            </h2>
          </div>
          <div className="process-flow mt-12">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="process-node">
                <span className="path-number">0{index + 1}</span>
                <h3 className="mt-6 text-2xl font-bold text-[var(--heading)]">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-soft wave-section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Services</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)] sm:text-4xl">
              The offer can sharpen later. The first decision can get clearer now.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Instead of selling a menu of tactics, Fruitful Lab can guide product brands through fit, diagnosis, first build, and then the larger search, content, email, data, and workflow ecosystem.
            </p>
            <Link className="btn btn-primary mt-7" href="/services">
              View services
            </Link>
          </div>
          <div className="service-river">
            {SERVICE_PACKAGES.map((service, index) => (
              <article key={service.title} className="service-river-item">
                <span className="path-number">0{index + 1}</span>
                <div>
                  <p className="text-sm font-black text-[var(--cobalt)]">{service.kicker}</p>
                  <h3 className="mt-2 text-2xl font-bold text-[var(--heading)]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-plain">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="eyebrow">What can live here</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)] sm:text-4xl">
                A sharper lab for the pieces around the product.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">
              Fruitful Lab can hold the senior strategy, systems, data, and implementation work while focused brands keep their own audience, domain, voice, and offer.
            </p>
          </div>
          <div className="capability-constellation mt-12">
            {CAPABILITIES.map((capability) => (
              <div key={capability.title} className="capability-shape">
                <h3 className="text-lg font-bold text-[var(--heading)]">{capability.title}</h3>
                <p className="mt-3">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="human-panel p-6 sm:p-8">
            <div className="relative z-10 portrait-strip">
              <div className="portrait-block">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--amber)]">Strategy</p>
                <p className="mt-3 text-3xl font-extrabold">Susy</p>
              </div>
              <div className="portrait-block">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--cobalt)]">Data + systems</p>
                <p className="mt-3 text-3xl font-extrabold">Stepan</p>
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow">Human by design</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)] sm:text-4xl">
              Data and AI should make the work clearer, not colder.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              This site should leave room for real founder presence, future photography, diagrams, reporting views, search maps, and the tools being developed inside the Fruitful Lab ecosystem.
            </p>
            <Link className="btn btn-secondary mt-7" href="/about">
              About the studio
            </Link>
          </div>
        </div>
      </section>

      <section className="section-plain">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Brand ecosystem</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)] sm:text-4xl">
              One parent brand, separate commercial lanes.
            </h2>
          </div>
          <div className="ecosystem-flow mt-10">
            {ECOSYSTEM_ITEMS.map((item) => (
              <article key={item.name} className="ecosystem-item">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--cobalt)]">{item.role}</p>
                <h3 className="mt-3 text-xl font-bold text-[var(--heading)]">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
