import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "How We Work",
  description: "The Fruitful Lab process for diagnosing, formulating, building, and testing product discovery systems.",
};

const PROCESS_STEPS = [
  {
    number: "01",
    label: "Fit",
    title: "Start with the product and the bottleneck.",
    description:
      "We look at the brand stage, product story, audience, current channels, constraints, and whether the problem is worth solving together.",
    output: "Fit read + recommended next move",
  },
  {
    number: "02",
    label: "Diagnose",
    title: "Map the formula before building the pieces.",
    description:
      "We connect search behavior, content jobs, email paths, paid-media readiness, analytics, and workflow opportunities into a focused diagnostic.",
    output: "Growth formula map",
  },
  {
    number: "03",
    label: "Build",
    title: "Ship the first useful system.",
    description:
      "The first build might be a search-led page, a product content path, an email sequence, a paid test, a reporting view, or an AI creative workflow.",
    output: "Launch-ready asset or system",
  },
  {
    number: "04",
    label: "Test",
    title: "Use the signal to choose what compounds.",
    description:
      "We review what changed, what stayed fuzzy, and which experiment or implementation layer should come next.",
    output: "Signal review + next experiment",
  },
] as const;

const BLUEPRINT_ITEMS = [
  "Product discovery and customer-path read",
  "Search, content, lifecycle, and paid-media opportunity map",
  "Analytics, reporting, testing, and AI workflow recommendations",
  "Prioritized first build with the reason behind it",
] as const;

const PRINCIPLES = [
  {
    title: "Build from the product outward.",
    description: "The product, use case, customer language, and trust path decide the channel mix.",
  },
  {
    title: "Keep the first build small enough to ship.",
    description: "A live, useful system teaches more than an oversized strategy deck that never meets the market.",
  },
  {
    title: "Let data clarify, not dehumanize.",
    description: "Reporting, AI, and testing should make better decisions easier while protecting the brand voice.",
  },
] as const;

export default function HowWeWorkPage() {
  return (
    <div className="overflow-hidden">
      <section className="how-hero">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">How we work</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-normal leading-[0.95] text-[var(--heading)] sm:text-6xl lg:text-7xl">
              A lab process for turning scattered marketing into a <span className="gradient-text">testable formula.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              The process is built for growth-stage product brands that need clarity before more activity. We diagnose the system, choose the useful first build, then test what should grow next.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="btn btn-primary" href="/contact">
                Book a fit call →
              </Link>
              <Link className="btn btn-secondary" href="/services">
                Explore services →
              </Link>
            </div>
          </div>

          <div className="process-hero-card" aria-label="Fruitful Lab process visual">
            <Image
              src="/images/service-product-lab-photo.jpg"
              alt="Unbranded specialty product scene used as a process planning reference"
              width={1536}
              height={1024}
              sizes="(max-width: 900px) 100vw, 540px"
              priority
            />
            <div className="process-hero-overlay">
              <p>Lab sequence</p>
              <strong>Fit → diagnose → build → test</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="process-page-section">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="eyebrow">The process</p>
              <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
                Four moves, one clearer system.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">
              This page is the place to explain the working rhythm. Services can change by brand, but the decision logic stays the same.
            </p>
          </div>

          <div className="process-page-list mt-12">
            {PROCESS_STEPS.map((step) => (
              <article key={step.number} className="process-page-row">
                <span>{step.number}</span>
                <div>
                  <p>{step.label}</p>
                  <h3>{step.title}</h3>
                </div>
                <p>{step.description}</p>
                <strong>{step.output}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="diagnostic-section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">The first paid product</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              The diagnostic is where the formula gets mixed.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Before a larger build, the diagnostic gives the brand a clear map of what matters, what can wait, and which system should be built first.
            </p>
          </div>

          <div className="diagnostic-card">
            <p>Growth formula diagnostic</p>
            <h3>What the lab bench looks at</h3>
            <ul>
              {BLUEPRINT_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="work-principles-section">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Working principles</p>
            <h2 className="mt-4 text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              Good process should make the work feel calmer, not heavier.
            </h2>
          </div>

          <div className="work-principle-grid mt-12">
            {PRINCIPLES.map((principle) => (
              <article key={principle.title} className="work-principle-card">
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-lab-cta">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Ready for the first read?</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-normal leading-[1.02] text-[var(--heading)] sm:text-5xl">
              Bring us the messy middle.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              We will help decide whether the next useful move is a diagnostic, a focused build, or a bigger system.
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
