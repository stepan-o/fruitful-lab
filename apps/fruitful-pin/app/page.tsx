import Image from "next/image";
import Link from "next/link";
import {
  AUDIENCE_PATHS,
  BLOG_POSTS,
  CASE_STUDIES,
  PIN_SYSTEM_PILLARS,
  PROCESS_STEPS,
  SERVICE_PACKAGES,
} from "@/lib/content";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

export default function HomePage() {
  const featuredPosts = BLOG_POSTS.slice(0, 2);
  const featuredProof = CASE_STUDIES.slice(0, 2);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[calc(88svh-80px)] max-w-6xl items-center gap-12 px-5 pb-8 pt-14 sm:px-8 sm:pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:pb-10 lg:pt-16">
          <div>
            <p className="eyebrow">Pinterest marketing with an editorial brain</p>
            <h1 className="brand-display mt-5 max-w-4xl text-4xl leading-tight text-[var(--heading)] sm:text-5xl lg:text-7xl">
              Make Pinterest your brand&apos;s <span className="text-gradient">quiet little growth engine.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Fruitful Pin helps product brands and content-led businesses turn their best ideas, offers, and visuals into a search-friendly path that keeps working after the first post.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold transition" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--brand-navy)] bg-white px-6 text-sm font-semibold text-[var(--brand-navy)] transition hover:bg-[var(--surface-warm)]" href="/pinterest-services">
                Explore services
              </Link>
            </div>
          </div>

          <div className="wave-panel hero-media">
            <div className="hero-visual bg-white">
              <Image
                src="/images/pinterest-growth-workbench.webp"
                alt="Tablet showing a full-funnel Pinterest growth diagram"
                width={768}
                height={419}
                priority
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 44vw, 92vw"
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <p className="text-sm font-semibold leading-6 text-[var(--brand-navy)]">Search-led</p>
              <p className="text-sm font-semibold leading-6 text-[var(--brand-rust)]">Warmly strategic</p>
              <p className="text-sm font-semibold leading-6 text-[var(--brand-pink)]">Built to click</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-flow">
        <div className="home-flow-inner mx-auto max-w-6xl px-5 pb-16 pt-24 sm:px-8 lg:pb-20 lg:pt-32">
          <div className="home-ribbon">
            <p className="eyebrow">The real Pinterest problem</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <h2 className="brand-display text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
                Most Pinterest problems are not pin problems. They are <span className="text-gradient">path problems.</span>
              </h2>
              <p className="text-base leading-7 text-[var(--muted)]">
                A pin can get saved, clicked, ignored, or forgotten. The strategy is deciding what each pin should help a real person do next, then making the account, creative, and landing page agree.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {PIN_SYSTEM_PILLARS.map((pillar) => (
              <article key={pillar.title} className="path-card">
                <h3 className="text-lg font-semibold text-[var(--heading)]">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">What gets built</p>
              <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
                Pinterest support for brands that need more than a posting schedule.
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                The work can be organic, paid, or both. The through-line is the same: Pinterest needs a business job before it needs another batch of pins.
              </p>
              <Link className="button-primary mt-7 inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
            </div>

            <div className="grid gap-5">
              {SERVICE_PACKAGES.map((service, index) => (
                <article key={service.title} className="service-path-card">
                  <div>
                    <p className="text-sm font-bold text-[var(--brand-pink)]">0{index + 1} / {service.kicker}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-[var(--heading)]">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
                  </div>
                  <div className="service-path-outcome">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">Outcome</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{service.outcome}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-swell bg-[var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="eyebrow">Best-fit paths</p>
              <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
                Different brands need different Pinterest jobs.
              </h2>
              <div className="mt-8 grid gap-4">
                {AUDIENCE_PATHS.map((path) => (
                  <article key={path.title} className="audience-strip">
                    <p className="text-sm font-bold leading-6 text-[var(--brand-rust)]">{path.signal}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--heading)]">{path.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{path.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="fit-call-note">
              <p className="eyebrow">Primary CTA path</p>
              <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)]">The fit call comes before the plan.</h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                The call is where we decide whether Pinterest is worth building, fixing, or leaving alone for now. That keeps the site honest: no complicated funnel needed before someone knows whether the channel fits.
              </p>
              <ol className="mt-6 space-y-4">
                {PROCESS_STEPS.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-[var(--brand-pink)] text-xs font-bold text-white">{index + 1}</span>
                    <span>
                      <span className="block text-sm font-bold text-[var(--heading)]">{step.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{step.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <Link className="button-primary mt-7 inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
          <div>
            <p className="eyebrow">Proof snapshots</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              When Pinterest has a plan, the numbers get less mysterious.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Useful Pinterest work connects creative, search intent, traffic quality, and the page someone reaches after the click.
            </p>
            <Link className="mt-7 inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--brand-navy)] bg-white px-5 text-sm font-semibold text-[var(--brand-navy)] hover:bg-[var(--surface-warm)]" href="/case-studies">
              View case studies
            </Link>
          </div>
          <div className="proof-cluster">
            {featuredProof.map((study) => (
              <article key={study.brand} className="proof-card">
                <p className="text-4xl font-semibold text-[var(--brand-pink)]">{study.metricValue}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-rust)]">{study.metricLabel}</p>
                <h3 className="mt-5 text-xl font-semibold text-[var(--heading)]">{study.brand}</h3>
                <p className="mt-1 text-sm text-[var(--brand-rust)]">{study.context}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{study.result}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-swell bg-[var(--surface-warm)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div>
            <p className="eyebrow">Read next</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              Strategy notes for Pinterest that has a job to do.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The blog can become a softer secondary path for people who are curious, researching, or not ready for a call yet.
            </p>
          </div>
          <div className="grid gap-4">
            {featuredPosts.map((post) => (
              <article key={post.slug} className="reading-card">
                <p className="text-sm font-bold text-[var(--brand-pink)]">{post.category}</p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--heading)]">
                  <Link href={`/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="cta-wave mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="eyebrow">Simple for now</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-5xl">
              Start with the fit. Build the Pinterest path after.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Resources and the Pinterest assessment can support softer discovery paths, but the main job of the site is to make the service path clear and the fit call easy.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--brand-navy)] bg-white px-6 text-sm font-semibold text-[var(--brand-navy)] transition hover:bg-[var(--surface-warm)]" href="/blog">
                Read the blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
