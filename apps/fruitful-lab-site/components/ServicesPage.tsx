import Link from "next/link";

const SERVICE_LABS = [
  {
    label: "Search ecosystem",
    title: "Pinterest, Google, SEO, AI search, and visual discovery.",
    description:
      "We map how demand looks for the product, then shape search-led pages, product angles, and content paths that help the right people find it.",
  },
  {
    label: "Paid media",
    title: "Campaigns built around the offer, not just the platform.",
    description:
      "Meta, retargeting, paid tests, and launch paths can sit inside the wider formula so traffic has somewhere useful to land and learn.",
  },
  {
    label: "SEO + content",
    title: "Educational, lifestyle, use-case, and product-direct content.",
    description:
      "A content system where each piece has a job: answer a question, show a use case, build trust, support search, or move someone to the next step.",
  },
  {
    label: "Lifecycle + funnels",
    title: "Lead capture, email, purchase paths, and follow-up.",
    description:
      "Useful funnels for people who are not ready today, but could become ready when the education, timing, and product context are right.",
  },
  {
    label: "Data + testing",
    title: "Reporting and experiments that make the next move clearer.",
    description:
      "Analytics, dashboards, A/B testing, signal reviews, and measurement rhythms that help the brand choose what to improve next.",
  },
  {
    label: "AI creative systems",
    title: "Brand-trained creative workflows that still feel human.",
    description:
      "Ongoing creative production systems for content, ads, product education, and repurposing without the generic AI look or flat brand voice.",
  },
] as const;

const ENGAGEMENT_PATH = [
  {
    number: "01",
    title: "Fit call",
    description:
      "A first conversation about the product, stage, audience, current channels, constraints, and whether there is a strong reason to work together.",
  },
  {
    number: "02",
    title: "Growth formula diagnostic",
    description:
      "A paid clarity product that identifies the bottleneck, maps the service mix, and chooses the first useful build instead of guessing.",
  },
  {
    number: "03",
    title: "Focused build",
    description:
      "A search page, content path, email sequence, paid-media test, analytics view, AI workflow, or creative system that can actually ship.",
  },
  {
    number: "04",
    title: "Scale partnership",
    description:
      "Deeper implementation across the ecosystem when the first build creates enough signal to justify the next experiment or bigger system.",
  },
] as const;

const FORMULA_FILTERS = [
  {
    label: "Stage",
    description: "What does the brand need now: clarity, first build, campaign support, reporting, or scale?",
  },
  {
    label: "Signal",
    description: "Where is the evidence: search demand, conversion gaps, content performance, email behavior, or paid-media data?",
  },
  {
    label: "System",
    description: "What should be built first so the next decision becomes easier instead of louder?",
  },
] as const;

const HERO_TAGS = ["Search", "Paid media", "Content", "Lifecycle", "Data", "AI creative"] as const;

export function ServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="services-hero">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
          <div>
            <div className="hero-proof-row" aria-label="Fruitful Lab service markers">
              <span className="proof-pill proof-pill-light">
                <span aria-hidden="true">✦✦✦</span>
                Custom brand formulas
              </span>
              <span className="proof-pill proof-pill-dark">
                <span className="proof-dot" aria-hidden="true" />
                Built from signal
              </span>
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-normal leading-[0.95] text-[var(--heading)] sm:text-6xl lg:text-7xl">
              Services mixed around the <span className="gradient-text">right first move.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Fruitful Lab is not meant to feel like a giant menu of tactics. The service mix depends on the product, the stage, the bottleneck, and the signals we can trust.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="btn btn-primary" href="/contact">
                Book a fit call →
              </Link>
              <Link className="btn btn-secondary" href="#service-labs">
                Explore the labs →
              </Link>
            </div>
          </div>

          <div className="service-formula-board" aria-label="Service formula visual">
            <div className="formula-core">
              <p>Growth formula</p>
              <strong>Product + stage + signal</strong>
            </div>
            {HERO_TAGS.map((tag, index) => (
              <span key={tag} className={`formula-tag formula-tag-${index + 1}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="signal-marquee" aria-label="Fruitful Lab service areas">
        <div className="marquee-track">
          {[...HERO_TAGS, ...HERO_TAGS, ...HERO_TAGS].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="service-labs-section" id="service-labs">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-end">
            <div>
              <p className="eyebrow">Service labs</p>
              <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
                The formula changes by brand. These are the ingredients.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">
              A specialty product brand might need search before paid traffic, email before more content, reporting before another campaign, or an AI creative workflow before scaling production.
            </p>
          </div>

          <div className="service-lab-grid mt-12">
            {SERVICE_LABS.map((lab) => (
              <article key={lab.label} className="service-lab-card">
                <p>{lab.label}</p>
                <h3>{lab.title}</h3>
                <span>{lab.description}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="service-path-section">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="eyebrow">Engagement path</p>
              <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
                Fit first. Formula second. Build third.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">
              Every engagement starts by narrowing the problem before building the system. That keeps the work practical, staged, and easier to measure.
            </p>
          </div>

          <div className="service-path-list mt-12">
            {ENGAGEMENT_PATH.map((step) => (
              <article key={step.title} className="service-path-row">
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="formula-filter-section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">How we choose</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              A lab is useful because it tests the formula, not because it adds more noise.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The job is to make the product easier to discover, understand, trust, and buy from. The channel is only useful when it helps that happen.
            </p>
          </div>

          <div className="formula-filter-card">
            {FORMULA_FILTERS.map((filter) => (
              <article key={filter.label}>
                <p>{filter.label}</p>
                <span>{filter.description}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-lab-cta">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Start with the fit</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              Bring the product, the stage, and the messy middle.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              We will use the first call to see whether there is a useful formula to build together.
            </p>
          </div>
          <Link className="btn btn-primary" href="/contact">
            Book a fit call →
          </Link>
        </div>
      </section>
    </div>
  );
}
