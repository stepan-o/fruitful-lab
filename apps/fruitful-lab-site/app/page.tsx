import Link from "next/link";
import { HoverSpotlight } from "@/components/HoverSpotlight";
import { BLOG_POSTS } from "@/lib/content";

const RAIL_ITEMS = [
  "Product discovery",
  "Search visibility",
  "Content systems",
  "Email paths",
  "Analytics",
  "A/B testing",
  "AI workflows",
  "Growth-stage brands",
] as const;

const SERVICE_SYSTEM = [
  {
    label: "Discovery lab",
    title: "Find what is leaking attention.",
    description:
      "A focused diagnostic for the product story, buying moments, search behavior, current channels, and the first bottleneck worth solving.",
  },
  {
    label: "Search ecosystem",
    title: "Make demand easier to meet.",
    description:
      "Google search, AI search, visual search, and product-led content paths shaped around how real customers look for answers.",
  },
  {
    label: "Content architecture",
    title: "Give every asset a job.",
    description:
      "Educational, lifestyle, use-case, and product-direct content mapped to the moments where customers need clarity or trust.",
  },
  {
    label: "Lifecycle and funnel",
    title: "Build the next step around intent.",
    description:
      "Lead capture, email, launch paths, landing pages, and follow-up systems that move people from interest to a confident next action.",
  },
  {
    label: "Data and testing",
    title: "Let signals choose the next move.",
    description:
      "Analytics, reporting, A/B testing, and decision dashboards that make performance easier to understand and improve.",
  },
  {
    label: "AI workflow systems",
    title: "Speed up without flattening the brand.",
    description:
      "Practical AI-supported workflows for research, content operations, reporting, repurposing, QA, and team enablement.",
  },
] as const;

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Diagnose",
    duration: "Fit call + first read",
    description:
      "We look at the product, audience, current discovery path, data, and constraints to decide whether there is a strong reason to keep exploring together.",
  },
  {
    number: "02",
    title: "Formulate",
    duration: "Paid diagnostic",
    description:
      "We map the formula for the brand stage: what needs to be built first, what can wait, and how search, content, email, data, and AI should connect.",
  },
  {
    number: "03",
    title: "Build",
    duration: "Focused sprint",
    description:
      "We ship the first useful system: a search-informed page, content path, email sequence, reporting loop, campaign structure, or practical workflow.",
  },
  {
    number: "04",
    title: "Test",
    duration: "Ongoing or next sprint",
    description:
      "We use real signals to choose the next experiment, improve the path, and keep the growth system becoming clearer instead of busier.",
  },
] as const;

const FOUNDER_PROFILES = [
  {
    name: "Susy",
    role: "Strategy, product discovery, content, and search",
    description:
      "The side of the lab focused on customer language, product education, content systems, positioning, and the buying moments that make a brand easier to choose.",
  },
  {
    name: "Stepan",
    role: "Data, systems, analytics, and testing",
    description:
      "The side of the lab focused on reporting, experimentation, workflows, technical systems, and the signals that make the next decision less fuzzy.",
  },
] as const;

const INSIGHT_CARDS = BLOG_POSTS.slice(0, 3);

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="lab-hero">
        <div className="hero-blob hero-blob-a" aria-hidden="true" />
        <div className="hero-blob hero-blob-b" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl gap-12 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:pb-24 lg:pt-10">
          <div>
            <div className="hero-proof-row" aria-label="Future proof markers">
              <span className="proof-pill proof-pill-light">
                <span aria-hidden="true">★★★★★</span>
                Client proof
              </span>
              <span className="proof-pill proof-pill-dark">
                <span className="proof-dot" aria-hidden="true" />
                Partner credentials
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-5xl font-normal leading-[0.95] text-[var(--heading)] sm:text-6xl lg:text-7xl">
              Good products should not be hard to <span className="gradient-text">discover.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Fruitful Lab is a growth laboratory for specialty product brands. We test the formula that connects product story, search, content, email, data, and AI workflows so the right customers can find, understand, and choose what you sell.
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

      <section className="lab-thesis-section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:py-24">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              One lab for the discovery system around your product.
            </h2>
          </div>
          <div className="thesis-copy">
            <p>
              Most product brands do not need more random marketing activity. They need the pieces around the product to make sense together.
            </p>
            <p>
              Fruitful Lab mixes strategy, content, search, email, data, testing, and AI-supported workflows into a clearer buying environment: people can discover the product, understand why it fits, trust the brand, and know what to do next.
            </p>
          </div>
        </div>
      </section>

      <section className="lab-service-system-section">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="eyebrow">Inside the formula</p>
              <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
                The growth pieces can be built separately. They should not think separately.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">
              The work can start as a focused diagnostic and expand into the pieces the brand actually needs: search, content, lifecycle, analytics, testing, and workflow systems.
            </p>
          </div>
          <div className="lab-service-grid mt-12">
            {SERVICE_SYSTEM.map((service) => (
              <article key={service.title} className="lab-service-card">
                <p>{service.label}</p>
                <h3>{service.title}</h3>
                <span>{service.description}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-case-section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">Case study frame</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              Show the product, the path, and the signal.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The case-study structure highlights the product context, the system we built, the visible change, and the numbers that support the story.
            </p>
            <Link className="btn btn-secondary mt-8" href="/services">
              See the approach →
            </Link>
          </div>

          <HoverSpotlight className="lab-case-card">
            <div className="case-media-grid" aria-hidden="true">
              <div className="case-product-shot case-product-shot-main">
                <span>Product photo</span>
              </div>
              <div className="case-product-shot case-product-shot-small">
                <span>Search page</span>
              </div>
              <div className="case-product-shot case-product-shot-small">
                <span>Email path</span>
              </div>
            </div>
            <div className="case-story-panel">
              <p>Specialty product brand</p>
              <h3>From scattered visibility to a clearer product discovery path.</h3>
              <div className="case-signal-row">
                <span>Story</span>
                <span>Search</span>
                <span>Content</span>
                <span>Signals</span>
              </div>
            </div>
          </HoverSpotlight>
        </div>
      </section>

      <section className="lab-process-section" id="process">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="eyebrow">How we work</p>
              <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
                A clear path from messy visibility to a formula we can test.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">
              The engagement stays simple on purpose: diagnose what is happening, formulate the right first move, build the useful piece, then test what compounds.
            </p>
          </div>

          <div className="lab-process-list mt-12">
            {PROCESS_STEPS.map((step) => (
              <article key={step.title} className="lab-process-row">
                <span className="process-number">{step.number}</span>
                <div>
                  <p>{step.duration}</p>
                  <h3>{step.title}</h3>
                </div>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="founder-lab-section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">Inside the lab</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              Strategy and systems, human by design.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The studio should make the human side visible: real photography, short bios, and a clear reason why Susy and Stepan are useful together for growth-stage product brands.
            </p>
            <Link className="btn btn-secondary mt-8" href="/about">
              About the studio →
            </Link>
          </div>

          <div className="founder-card-grid">
            {FOUNDER_PROFILES.map((profile) => (
              <article key={profile.name} className="founder-card">
                <div className="founder-photo">
                  <span>Photo</span>
                </div>
                <div>
                  <p>{profile.role}</p>
                  <h3>{profile.name}</h3>
                  <span>{profile.description}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-insights-section">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Lab notes</p>
              <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
                Sharp thinking, practical reads.
              </h2>
            </div>
            <Link className="btn btn-secondary" href="/blog">
              Read the blog →
            </Link>
          </div>
          <div className="insight-card-grid mt-12">
            {INSIGHT_CARDS.map((post) => (
              <Link key={post.slug} className="insight-card" href={`/blog/${post.slug}`}>
                <p>{post.category}</p>
                <h3>{post.title}</h3>
                <span>{post.excerpt}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="final-lab-cta">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Ready to test the formula?</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              Start with the product, the stage, and the bottleneck.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              The first move is a fit call. From there, the offer can become a diagnostic, a focused build, or a larger growth system.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link className="btn btn-primary" href="/contact">
              Book a fit call →
            </Link>
            <Link className="btn btn-secondary" href="/services">
              Explore services →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
