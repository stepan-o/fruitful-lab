import Link from "next/link";
import { ECOSYSTEM_ITEMS, PROCESS_STEPS, SERVICE_PACKAGES } from "@/lib/content";

const CAPABILITIES = [
  {
    title: "Funnel strategy",
    description: "Offer paths, landing pages, lead magnets, applications, and follow-up journeys.",
  },
  {
    title: "Paid media",
    description: "Meta, Pinterest, launch campaigns, creative testing, and traffic that connects to the real path.",
  },
  {
    title: "AI workflows",
    description: "Research, content production, reporting, and operations systems that keep human judgment in the loop.",
  },
  {
    title: "Email systems",
    description: "Nurture, newsletter, launch, and sales follow-up structures that turn attention into trust.",
  },
  {
    title: "Content engines",
    description: "Resource planning, repurposing, editorial systems, and useful authority-building assets.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="lab-hero">
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-5 py-8 sm:px-8 lg:grid-cols-[1.02fr_0.9fr] lg:items-center lg:py-8">
          <div>
            <p className="eyebrow">Fruitful Lab</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-[var(--heading)] sm:text-5xl">
              Marketing systems for offers that need a clearer path from <span className="gradient-text">attention to action.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              The public home for Susi and Esteban&apos;s broader client-facing work: funnels, paid media, email, AI workflows, content systems, and the brand ecosystem behind focused projects like Fruitful Pin.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="btn btn-primary" href="/services">
                Explore the working model
              </Link>
              <Link className="btn btn-secondary" href="/contact">
                Book a fit call
              </Link>
            </div>
          </div>

          <div className="system-visual" aria-label="A connected marketing system map">
            <div className="signal-strip" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="visual-card visual-card-a">
              <strong>Offer path</strong>
              <span>Positioning, next step, and the reason someone should keep moving.</span>
            </div>
            <div className="visual-card visual-card-b">
              <strong>Traffic and content</strong>
              <span>Paid, organic, resources, and creative all pointing to the same decision path.</span>
            </div>
            <div className="visual-card visual-card-c">
              <strong>Email and workflow</strong>
              <span>Follow-up, production systems, and AI-supported operations behind the scenes.</span>
            </div>
            <div className="visual-card visual-card-d">
              <strong>Signal</strong>
              <span>Cleaner reporting, better experiments, sharper next moves.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-plain">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 lg:pb-20 lg:pt-12">
          <div className="max-w-3xl">
            <p className="eyebrow">How the engagement flows</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)] sm:text-4xl">
              Start narrow enough to be useful, then build into the larger system.
            </h2>
          </div>
          <div className="path-shell mt-10 grid gap-5 md:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="path-card p-6">
                <span className="path-number">0{index + 1}</span>
                <h3 className="mt-6 text-2xl font-bold text-[var(--heading)]">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Services</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)] sm:text-4xl">
              The offer can sharpen later. The client journey can start now.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Instead of presenting four disconnected service boxes, Fruitful Lab can guide people through a fit call, a paid diagnostic, a first implementation sprint, and then the larger growth-system work.
            </p>
            <Link className="btn btn-primary mt-7" href="/services">
              View services
            </Link>
          </div>
          <div className="space-y-4">
            {SERVICE_PACKAGES.map((service, index) => (
              <article key={service.title} className="grid gap-4 border-t border-[var(--border)] py-5 sm:grid-cols-[4rem_1fr]">
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
                A broader umbrella without turning every brand into the same thing.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">
              Fruitful Lab can hold the senior marketing systems work while focused brands keep their own audience, domain, voice, and offer.
            </p>
          </div>
          <div className="capability-ribbon mt-10">
            {CAPABILITIES.map((capability) => (
              <div key={capability.title}>
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
                <p className="mt-3 text-3xl font-extrabold">Susi</p>
              </div>
              <div className="portrait-block">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--cobalt)]">Systems</p>
                <p className="mt-3 text-3xl font-extrabold">Esteban</p>
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow">Human by design</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--heading)] sm:text-4xl">
              AI and automation should make the work clearer, not colder.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              This site should leave room for real founder presence, future photography, diagrams, and the tools being developed inside the Fruitful Lab ecosystem.
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
