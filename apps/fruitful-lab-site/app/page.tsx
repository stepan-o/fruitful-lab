import Link from "next/link";
import { HoverSpotlight } from "@/components/HoverSpotlight";
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

const RAIL_ITEMS = [
  "Specialty product brands",
  "Search visibility",
  "Product education",
  "Email paths",
  "Analytics",
  "AI workflows",
  "Use-case content",
  "Testing loops",
] as const;

const FEATURED_METRICS = [
  { value: "01", label: "Product story" },
  { value: "02", label: "Search demand" },
  { value: "03", label: "Email path" },
] as const;

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="lab-hero">
        <div className="hero-blob hero-blob-a" aria-hidden="true" />
        <div className="hero-blob hero-blob-b" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:pb-28 lg:pt-20">
          <div>
            <div className="hero-proof-row" aria-label="Future proof markers">
              <span className="proof-pill proof-pill-light">
                <span aria-hidden="true">★★★★★</span>
                Reviews coming soon
              </span>
              <span className="proof-pill proof-pill-dark">
                <span className="proof-dot" aria-hidden="true" />
                Partner credentials in progress
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-5xl font-normal leading-[0.95] text-[var(--heading)] sm:text-6xl lg:text-7xl">
              Good products should not be hard to <span className="gradient-text">discover.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Fruitful Lab helps specialty product brands make their best products easier to find, understand, and choose by connecting product story, search, content, email, data, testing, and AI-supported workflows.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="btn btn-primary" href="/contact">
                Book a fit call →
              </Link>
              <Link className="btn btn-secondary" href="/services">
                How we work →
              </Link>
            </div>
          </div>

          <div className="hero-discovery-showcase" aria-label="Example product discovery search visual">
            <div className="showcase-product-card showcase-product-card-main">
              <span className="product-tag">Search-ready page</span>
              <div className="product-image product-image-mint" />
              <strong>Organic baby rattle set</strong>
              <p>Use case, product story, and trust cues ready for discovery.</p>
            </div>
            <div className="showcase-product-card showcase-product-card-small">
              <span className="product-tag">Use case content</span>
              <div className="product-image product-image-flame" />
              <strong>Quiet play guide</strong>
            </div>
            <div className="phone-mockup">
              <div className="phone-speaker" aria-hidden="true" />
              <div className="phone-screen">
                <div className="search-app-top">
                  <span className="search-dot" />
                  <span className="search-app-name">Visual search</span>
                </div>
                <div className="search-bar">
                  <span>best sensory toys for babies</span>
                </div>
                <div className="search-tabs">
                  <span className="active">Ideas</span>
                  <span>Products</span>
                  <span>Guides</span>
                </div>
                <div className="search-results">
                  <article className="result-card result-card-featured">
                    <div className="result-image result-image-a" />
                    <div>
                      <strong>Soft sensory set for calm play</strong>
                      <p>Why parents choose it, when to use it, what makes it safer.</p>
                    </div>
                  </article>
                  <article className="result-card">
                    <div className="result-image result-image-b" />
                    <div>
                      <strong>Giftable baby toy bundle</strong>
                      <p>Use-case angle + product path.</p>
                    </div>
                  </article>
                  <article className="result-card">
                    <div className="result-image result-image-c" />
                    <div>
                      <strong>How to choose first toys</strong>
                      <p>Educational content that leads back to the product.</p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
        <svg className="smooth-divider" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 96C210 155 371 108 554 72C756 32 962 24 1140 76C1268 113 1364 129 1440 96V160H0V96Z" />
        </svg>
      </section>

      <section className="signal-marquee" aria-label="Fruitful Lab focus areas">
        <div className="marquee-track">
          {[...RAIL_ITEMS, ...RAIL_ITEMS].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section-plain thesis-section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:py-24">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              Product visibility is rarely one channel problem.
            </h2>
          </div>
          <div className="thesis-copy">
            <p>
              A product can be strong and still feel hard to sell when the story, search path, content, follow-up, and reporting are built in separate rooms.
            </p>
            <p>
              Fruitful Lab connects those pieces into a discovery ecosystem: the right customers can find the product, understand why it matters, trust the brand, and know what to do next.
            </p>
          </div>
        </div>
      </section>

      <section className="section-soft services-overview">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="eyebrow">Services</p>
              <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
                A guided path into the right first move.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">
              The offer can sharpen later, but the buying journey should already feel intentional: fit, diagnostic, first build, then a larger system when the signals justify it.
            </p>
          </div>
          <div className="service-grid mt-12">
            {SERVICE_PACKAGES.map((service, index) => (
              <Link key={service.title} className="service-tile" href="/services">
                <span className="path-number">0{index + 1}</span>
                <p className="mt-6 text-sm font-black text-[var(--cobalt)]">{service.kicker}</p>
                <h3 className="mt-2 text-2xl font-normal text-[var(--heading)]">{service.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
                <span className="tile-arrow">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-plain featured-system-section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Featured system map</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              Show the product, the path, and the signal.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The case study structure should make one thing obvious: what product needed visibility, what path was built around it, and what changed after launch.
            </p>
          </div>
          <HoverSpotlight className="featured-system-card">
            <div className="case-visual">
              <span className="case-orbit" aria-hidden="true" />
              <span className="case-dot case-dot-a" aria-hidden="true" />
              <span className="case-dot case-dot-b" aria-hidden="true" />
              <span className="case-dot case-dot-c" aria-hidden="true" />
            </div>
            <div className="case-body">
              <p className="text-sm font-black text-[var(--cobalt)]">Specialty product brand · Diagnostic + first build</p>
              <h3 className="mt-3 text-3xl font-normal leading-tight text-white sm:text-4xl">
                Turning scattered visibility into one product discovery path.
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/76">
                A product story, search surface, content path, email sequence, and reporting loop can work as one connected buying environment.
              </p>
              <div className="case-metrics">
                {FEATURED_METRICS.map((metric) => (
                  <div key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </HoverSpotlight>
        </div>
      </section>

      <section className="section-plain flow-section">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="eyebrow">How the engagement flows</p>
              <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
                A clear path from messy visibility to a system that can improve.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">
              The work starts narrow enough to make a decision. Then it becomes a build, a test, and a better next move.
            </p>
          </div>
          <div className="process-flow mt-14">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="process-node">
                <span className="path-number">0{index + 1}</span>
                <div>
                  <h3 className="mt-6 text-2xl font-normal text-[var(--heading)]">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
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
              <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
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
                <h3 className="text-lg font-normal text-[var(--heading)]">{capability.title}</h3>
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
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
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
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
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
