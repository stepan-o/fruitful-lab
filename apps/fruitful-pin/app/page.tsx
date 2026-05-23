import Image from "next/image";
import Link from "next/link";
import { PinterestFitAssessmentEmbed } from "@/components/PinterestFitAssessmentEmbed";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

const REAL_PROBLEM_CARDS = [
  {
    title: "They are already planning",
    body: "Your future customers are searching for ideas, products, routines, recipes, trips, rooms, gifts, and solutions before they ever land on your site.",
  },
  {
    title: "Someone else is getting saved",
    body: "When your brand is not visible, another product, blog, guide, or shop becomes the one they save, revisit, and trust.",
  },
  {
    title: "More pins will not fix a blurry path",
    body: "Pinterest works better when your keywords, visuals, boards, pages, and next steps are all helping people move in the same direction.",
  },
] as const;

const VISIBILITY_CARDS = [
  {
    title: "The words your buyers actually use",
    body: "Your future customers may already be searching. But if your brand is not showing up in their words, in their planning moments, or next to the ideas they are saving, they may never know you were an option.",
  },
  {
    title: "The pins they stop for",
    body: "Pretty helps, but pretty alone is not the plan. Your pins need to catch the right person in the moment they are looking, comparing, dreaming, or deciding.",
  },
  {
    title: "The page they land on",
    body: "A click only matters if the next step feels clear. Shop, read, subscribe, book, compare, save for later. The path should not make people work to understand what to do.",
  },
  {
    title: "The signals your business can learn from",
    body: "The numbers should not just sit in a report. They should help you see what people want, what they ignore, and where the path needs to feel easier.",
  },
] as const;

const FIT_CARDS = [
  {
    title: "Product brands",
    body: "For brands with products people research, compare, save, gift, style, use, or plan around before they buy.",
  },
  {
    title: "Content-led businesses",
    body: "For brands with articles, guides, recipes, tutorials, resources, or ideas that should keep bringing people back long after publish day.",
  },
  {
    title: "Specialty brands with a longer buying path",
    body: "For brands that need education, trust, inspiration, or repeated touchpoints before someone is ready to buy, subscribe, inquire, or come back.",
  },
] as const;

const WORK_STAGES = [
  {
    title: "Pinterest Fit Call",
    body: [
      "We start with a conversation to see whether Pinterest is a smart next move for your business, your audience, and what you want to grow.",
      "This is where we look for fit before we talk about a bigger plan.",
    ],
    footer: "Clear first. Commitment second.",
  },
  {
    title: "The Fruitful Path",
    body: [
      "If the fit is there, we move into the paid strategy step.",
      "The Fruitful Path shows where your brand can be found, where visibility is getting lost, and what needs to happen before Pinterest can support more traffic, email growth, product discovery, or sales.",
      "You leave with a clear plan for your current state, what to fix, build, test, or prioritize next.",
    ],
    footer: "Strategy before guesswork.",
  },
  {
    title: "Build the Momentum",
    body: [
      "This is where we turn The Fruitful Path into a system your brand can actually grow with.",
      "We build the Pinterest foundation around what makes your business specific: your products, content, audience, positioning, buying journey, and next best step for the people finding you.",
      "Depending on what the strategy calls for, this can include account structure, keywords, boards, pin creative, content planning, landing page direction, workflows, and ads preparation.",
    ],
    footer: "Built to fit, not burn out.",
  },
  {
    title: "Refine and Grow",
    body: [
      "Once the foundation is live, we focus on consistency, learning, and growth over time.",
      "This may include ongoing Pinterest management, Pinterest ads, creative testing, reporting, and strategic refinement so your visibility keeps getting sharper instead of starting from zero again.",
    ],
    footer: "Momentum without the pressure.",
  },
] as const;

const PROOF_TESTIMONIALS = [
  {
    client: "Organic Prairie",
    role: "Marketing Director",
    quote: "Pinterest became a real growth channel for us. We saw 4x ROAS on our ad spend and a steady rise in organic traffic to key product pages.",
    outcome: "4x ROAS + steady organic growth",
  },
  {
    client: "Visit Southern Spain",
    role: "Full-time Travel Blogger",
    quote: "We stopped chasing trends and finally invested in Pinterest. It's now one of our top-performing platforms.",
    outcome: "Pinterest became a top traffic driver",
  },
  {
    client: "Armstrong-Clark",
    role: "Founder",
    quote: "Our seasonal Pinterest campaigns brought a surge in brand visibility when it mattered most. We reached new audiences and saw real lift, right when demand peaked.",
    outcome: "Seasonal visibility lift + new audience reach",
  },
] as const;

const CREDIBILITY_RIBBON_COPY = "Pinterest strategy across food, travel, home, baby, wellness, education, and specialty product brands.";

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[calc(88svh-80px)] max-w-6xl items-center gap-12 px-5 pb-8 pt-14 sm:px-8 sm:pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:pb-10 lg:pt-16">
          <div>
            <p className="eyebrow">Pinterest marketing with an editorial brain</p>
            <h1 className="brand-display mt-5 max-w-4xl headline-hero text-[var(--heading)]">
              Your future customers are already looking. The frustrating part is knowing they <span className="text-gradient">may not be finding you.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              We help your brand get found on Pinterest while people are planning their next purchase, project, trip, meal, room, routine, or idea.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
              <Link className="button-outline" href="/pinterest-services">
                Explore Services
              </Link>
            </div>
          </div>

          <div className="wave-panel hero-media">
            <div className="hero-visual bg-white">
              <Image
                src="/images/pinterest-growth-workbench.webp"
                alt="Pinterest planning workspace with strategy notes and creative direction"
                width={768}
                height={419}
                priority
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 44vw, 92vw"
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <p className="text-sm font-semibold leading-6 text-[var(--brand-navy)]">Found earlier</p>
              <p className="text-sm font-semibold leading-6 text-[var(--brand-rust)]">Remembered better</p>
              <p className="text-sm font-semibold leading-6 text-[var(--brand-pink)]">Built with intent</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-flow">
        <div className="home-flow-inner mx-auto max-w-6xl px-5 pb-16 pt-24 sm:px-8 lg:pb-20 lg:pt-32">
          <div className="home-ribbon">
            <p className="eyebrow">The real problem</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <h2 className="brand-display headline-section text-[var(--heading)]">
                Your brand may be showing up <span className="text-gradient">too late</span>, or not at all.
              </h2>
              <div className="space-y-4 text-base leading-7 text-[var(--muted)]">
                <p>
                  People do not only come to Pinterest when they are ready to buy today. They come when they are imagining, comparing, collecting ideas, planning projects, and quietly deciding what they want next.
                </p>
                <p>
                  If your brand is not showing up in those moments, you are not just missing clicks. You may be missing the chance to become the brand they remember first.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {REAL_PROBLEM_CARDS.map((card) => (
              <article key={card.title} className="path-card">
                <h3 className="headline-compact text-[var(--heading)]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">Where visibility gets lost</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
                Pinterest works better when it fits the <span className="text-gradient">whole business picture.</span>
              </h2>
            </div>
            <div>
              <div className="space-y-4 text-base leading-7 text-[var(--muted)]">
                <p>A pin can get attention and still do very little for your business.</p>
                <p>
                  That is why we do not look at Pinterest like a separate little task on your marketing list. We look at the bigger picture: what you sell, who needs to find it, what they are already looking for, where they land, and what would make the next step feel natural.
                </p>
                <p>
                  Because being seen is not enough. Your brand needs to be found in the right moment, remembered for the right reason, and supported by a path that actually makes sense.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {VISIBILITY_CARDS.map((card) => (
                  <article key={card.title} className="path-card">
                    <h3 className="headline-compact text-[var(--heading)]">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-swell bg-[var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="eyebrow">Who this is for</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
                For brands with something people are <span className="text-gradient">already looking for.</span>
              </h2>
            </div>
            <div className="space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>Pinterest works best when your business has something people naturally search for, save, compare, plan, or come back to later.</p>
              <p>
                That might be a product, a blog post, a guide, a recipe, a room idea, a trip itinerary, a routine, a gift, a tutorial, or an offer that needs more of the right people to find it.
              </p>
              <p>
                This is not about posting for the sake of posting. It is about helping the right people discover your brand at the moment they are already open to ideas.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FIT_CARDS.map((card) => (
              <article key={card.title} className="audience-strip">
                <h3 className="headline-card text-[var(--heading)]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">How we work</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Start with <span className="text-gradient">the path</span> before building more Pinterest.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>Before we recommend management, ads, or ongoing support, we look at whether Pinterest actually makes sense for your business right now.</p>
              <p>
                The goal is not to sell you more pins. The goal is to understand where people may already be looking for what you offer, where they may be missing you, and what kind of Pinterest work would be worth building next.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {WORK_STAGES.map((stage, index) => (
              <article key={stage.title} className="service-path-card">
                <div>
                  <p className="text-sm font-bold text-[var(--brand-pink)]">Stage {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 headline-card text-[var(--heading)]">{stage.title}</h3>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                    {stage.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                <div className="service-path-outcome">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">{stage.footer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-swell bg-[var(--surface-warm)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Proof it can work</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              What changes when Pinterest has a <span className="text-gradient">clearer job.</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The goal is not more Pinterest activity for the sake of activity. It is helping Pinterest support something your business actually needs: visibility, product discovery, better traffic, seasonal demand, or content that keeps working longer.
            </p>
          </div>

          <div className="logo-marquee mt-10" aria-label="Fruitful Pin industry experience">
            <div className="logo-track">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} className="logo-pill">
                  {CREDIBILITY_RIBBON_COPY}
                </span>
              ))}
            </div>
          </div>

          <div className="testimonial-row mt-10">
            {PROOF_TESTIMONIALS.map((testimonial) => (
              <article key={testimonial.client} className="testimonial-card">
                <p className="text-sm font-bold text-[var(--brand-pink)]">{testimonial.outcome}</p>
                <p className="mt-5 flex-1 text-base leading-7 text-[var(--muted)]">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-6 border-t border-[var(--border)] pt-5">
                  <h3 className="headline-compact text-[var(--heading)]">{testimonial.client}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--brand-rust)]">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pinterest-fit-check-home" className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:py-20">
          <div>
            <p className="eyebrow">Pinterest Fit Check</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              See if Pinterest is <span className="text-gradient">worth building around</span> right now.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Answer seven quick questions about your offer, content, website, and goals. You&apos;ll get an immediate direction, with the option to send your result to your inbox.
            </p>
            <div className="fit-assessment-mini-list mt-6" aria-label="Pinterest Fit Check details">
              <span>Takes about 2 minutes</span>
              <span>Immediate result</span>
              <span>Option to save by email</span>
            </div>
          </div>

          <PinterestFitAssessmentEmbed intro="buttonOnly" />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="cta-wave mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="eyebrow">Start here</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Not sure <span className="text-gradient">where Pinterest fits</span>? That is exactly where we start.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              You do not need to know whether you need organic management, ads, a cleaner account, or a better content path before you reach out. Start with the option that matches where you are right now.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="soft-card p-6">
              <h3 className="headline-card text-[var(--heading)]">Ready for a conversation?</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Book a Pinterest Fit Call and we&apos;ll look at whether Pinterest makes sense for your business, your audience, and what you want to grow.
              </p>
              <Link className="button-primary mt-6 inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
            </article>
            <article className="soft-card p-6">
              <h3 className="headline-card text-[var(--heading)]">Still figuring it out?</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Take the Pinterest Fit Check and get a quick direction based on your offer, content, website, and goals.
              </p>
              <Link className="button-outline mt-6" href="#pinterest-fit-check-home">
                Start the Fit Check
              </Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
