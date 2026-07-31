import Image from "next/image";
import Link from "next/link";
import { CursorGlowPanel } from "@/components/CursorGlowPanel";
import { BRAND_ASSETS } from "@/lib/brandAssets";
import { BOOKING_URL, FIT_CALL_LABEL, PINTEREST_FIT_CHECK_URL } from "@/lib/site";

const FRUITFUL_PATH_CARDS = [
  {
    title: "Fit Call",
    body: "First, we find out if Pinterest has a real job to do. I look at what you sell, what is already working, where your traffic comes from now, and where buyers may be missing you.",
  },
  {
    title: "The Fruitful Path",
    body: "If the fit is there, this is the next step. I look at your brand as it is now and show you what should be fixed, built, tested, or prioritized before we build the wrong thing.",
  },
  {
    title: "Build the Momentum",
    body: "Once we know where the opportunity is, we build the path that helps more buyers find, understand, and choose your product.",
  },
  {
    title: "Refine and Grow",
    body: "Ongoing support comes after the foundation is live, when there is already a clear path worth growing.",
  },
] as const;

const MOMENTUM_TIERS = [
  {
    name: "The Fruitful Path",
    price: "Flat-fee step after the Fit Call",
    badge: null,
    description:
      "If the fit is there, this is the next step.",
    supporting:
      "I look at your brand as it is now: what is already working, where people are getting lost, where traffic, clicks, or interest may be leaking, and what buyers are searching for.",
    includes: [
      "Product, offer, and traffic review",
      "Pinterest opportunity map",
      "Search and buyer-path gaps",
      "Website and landing-page notes",
      "Content and product angle priorities",
      "What to fix, build, test, and prioritize",
      "Recommended next step",
    ],
    bestFor:
      "Product brands that want to know what to fix, build, test, and prioritize next before investing in a bigger build.",
    footer: "The growth map we use before we build.",
    featured: false,
  },
  {
    name: "Build the Momentum",
    price: "Build projects start at $3,500",
    badge: null,
    description:
      "This is where we start building.",
    supporting:
      "Once we know where the opportunity is, we build the path that helps more buyers find, understand, and choose your product.",
    includes: [
      "Pinterest account and board foundation",
      "Keyword strategy and search angles",
      "Pin creative direction and workflow",
      "Content and product priorities",
      "Product and landing-page recommendations",
      "Reporting and learning loop",
      "Lead-generation setup",
      "Ads preparation or campaign direction",
    ],
    bestFor:
      "Brands that want a system they can keep using, either on their own or with continued support.",
    footer: "A working system, not a pretty plan sitting in a folder.",
    featured: true,
  },
  {
    name: "Refine and Grow",
    price: "Optional continuation after the build",
    badge: null,
    description:
      "Some brands keep going with ongoing support after Build the Momentum.",
    supporting:
      "This is where we watch what people respond to, refine the creative, plan around seasons or launches, adjust the strategy, and keep the channel moving with intention.",
    includes: [
      "Ongoing Pinterest strategy oversight",
      "Pin creative testing direction",
      "Publishing workflow and optimization",
      "Performance reporting",
      "Seasonal and campaign recommendations",
      "Ads refinement where relevant",
      "Next-opportunity planning",
    ],
    bestFor:
      "Brands that already have a clear path worth growing.",
    footer: "The next layer after the foundation is live.",
    featured: false,
  },
] as const;

const DIFFERENCE_CARDS = [
  {
    title: "Your traffic and content",
    body: "I look at where people first find you, what they need to understand, what they click on, and what content supports the next step.",
  },
  {
    title: "Your products and offers",
    body: "I look at what you sell, what people need to believe, and how the offer fits into the rest of the marketing ecosystem.",
  },
  {
    title: "Your website and email list",
    body: "I look at where people land, what happens after they subscribe, and whether the path supports someone who compares, browses, or buys.",
  },
  {
    title: "Your customer journey and sales path",
    body: "I look at how the work connects to launches, sales, customer decisions, and the rest of the business you are building.",
  },
] as const;

const TRUST_LOGOS = ["Organic Prairie", "Visit Southern Spain", "Armstrong-Clark"] as const;

const PROOF_TESTIMONIALS = [
  {
    client: "Organic Prairie",
    role: "Marketing Director",
    quote: "Pinterest became a real growth channel for us. We saw 4x ROAS on our ad spend and a steady rise in organic traffic to key product pages.",
    outcome: "4x ROAS + steady organic growth",
    shows: "Pinterest can support both paid performance and organic product-page visibility.",
  },
  {
    client: "Armstrong-Clark",
    role: "Founder",
    quote: "Our seasonal Pinterest campaigns brought a surge in brand visibility when it mattered most. We reached new audiences and saw real lift, right when demand peaked.",
    outcome: "Seasonal visibility lift + new audience reach",
    shows: "Pinterest can help brands show up during high-intent seasonal planning windows.",
  },
  {
    client: "Visit Southern Spain",
    role: "Full-time Travel Blogger",
    quote: "We stopped chasing trends and finally invested in Pinterest. It's now one of our top-performing platforms.",
    outcome: "Pinterest became a top traffic driver",
    shows: "Evergreen content can keep working when Pinterest is built around how people plan and search.",
  },
] as const;

const SERVICE_FAQS = [
  {
    question: "Do I need organic Pinterest, Pinterest ads, or both?",
    answer:
      "Not necessarily. That depends on your products, current traffic, budget, website path, and what your business needs Pinterest to support first. Some brands need organic visibility. Some are ready to test ads. Some need the account and funnel path clarified before either one makes sense.",
  },
  {
    question: "What if my Pinterest account is old, messy, or inactive?",
    answer:
      "That is common. The first step is not to panic-post more pins. We start with The Fruitful Path so we can see what is already there, what is still useful, what may be confusing Pinterest, and what needs to be cleaned up, rebuilt, or connected to a better product path.",
  },
  {
    question: "Do I need a blog for Pinterest to work?",
    answer:
      "Not always. Product brands can use Pinterest with collections, product pages, guides, gift ideas, use cases, tutorials, or other helpful pages. Blogs can help, but the bigger question is whether you have useful places to send people after they discover you.",
  },
  {
    question: "What is The Fruitful Path?",
    answer:
      "The Fruitful Path is the flat-fee step after the Pinterest Fit Call. I look at your brand as it is, what is already working, where people are getting lost, and what needs to be fixed, built, tested, or prioritized before we build the wrong thing.",
  },
  {
    question: "Can I hire you just to manage Pinterest?",
    answer:
      "Usually, we do not start with management alone. Pinterest works better when it is connected to your products, website, offers, content, and customer path. That is why we start with fit, then The Fruitful Path, then the build if the opportunity is there.",
  },
  {
    question: "What happens after The Fruitful Path?",
    answer:
      "We can move into Build the Momentum, where I turn the strategy into a working system. By the end, you have something your brand can keep using. You can take it and run it yourself, or I can keep managing and refining it with you.",
  },
  {
    question: "What if I am not ready for a call?",
    answer:
      "Start with the Pinterest Fit Check. It is a quick questionnaire that gives you an immediate direction, with the option to send the result to your inbox.",
  },
] as const;

export function ServicesPage() {
  return (
    <div className="bg-white">
      <section className="services-hero">
        <div className="service-hero-inner mx-auto max-w-6xl px-5 sm:px-8">
          <div className="service-hero-copy">
            <p className="eyebrow">Pinterest growth for product brands</p>
            <h1 className="brand-display mt-5 headline-hero text-[var(--heading)]">
              Your product is already selling. Now let&apos;s help more of the <span className="text-gradient">right people find it.</span>
            </h1>
            <div className="service-hero-lede mt-6 max-w-2xl space-y-4 text-lg leading-8 text-[var(--muted)]">
              <p>
                I use Pinterest to build another path into your brand: more discovery, more qualified traffic, and more chances for people to find you before they are ready to buy.
              </p>
            </div>
            <div className="service-hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
              <Link className="button-outline" href={PINTEREST_FIT_CHECK_URL}>
                Start the Fit Check
              </Link>
            </div>
            <p className="service-hero-note mt-5 max-w-xl text-sm font-semibold leading-6 text-[var(--muted)]">
              Not sure if Pinterest is a real opportunity for your brand? Good. That is exactly what we figure out first.
            </p>
          </div>

        </div>
      </section>

      <section className="service-problem-section bg-white">
        <div className="service-problem-grid mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="eyebrow">The real question</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              You do not need &ldquo;to be on Pinterest&rdquo; just because <span className="text-gradient">Pinterest exists.</span>
            </h2>
          </div>
          <div className="service-problem-copy space-y-4 text-base leading-7 text-[var(--muted)]">
            <p>You need to know if Pinterest can open a real growth opportunity for your brand.</p>
            <p>Because if most of your traffic is coming from the same few places, you may be leaving an entire discovery channel untouched.</p>
            <p>There are buyers searching, comparing, planning, and collecting ideas before they even know your product exists.</p>
            <p>If your brand is not showing up in that part of the journey, someone else gets there first.</p>
            <p>That is the opportunity I look for.</p>
            <p className="service-problem-punch">
              Not more posting. Not more pretty pins with no plan behind them. A real path for more of the right people to find your product, understand why it matters, and move closer to buying.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white">
        <div className="service-path-section mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">The offer path</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              First, we find out if Pinterest has a <span className="text-gradient">real job to do.</span>
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>I am not here to sell you a channel that does not make sense.</p>
              <p>
                On the Fit Call, I look at what you sell, what is already working, where your traffic comes from now, and where buyers may be missing you.
              </p>
              <p>If I see a real opportunity, I will tell you. If I do not, I will tell you that too.</p>
            </div>
            <Link className="button-primary mt-7 inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
              Start with a Fit Call
            </Link>
            <p className="service-credit-note mt-5">
              If the fit is there, this is the next step: The Fruitful Path.
            </p>
          </div>

          <div className="process-ladder service-path-timeline">
            {FRUITFUL_PATH_CARDS.map((card, index) => (
              <article key={card.title} className="process-step-card service-path-step reveal-on-scroll">
                <span className="grid size-10 place-items-center rounded-full bg-[var(--brand-pink)] text-sm font-bold text-white">{index + 1}</span>
                <div>
                  <h3 className="headline-compact text-[var(--heading)]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="service-momentum-section section-swell bg-[var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="service-momentum-copy max-w-3xl">
            <p className="eyebrow">Build the Momentum</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              This is where we <span className="text-gradient">start building.</span>
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>Once we know where the opportunity is, we build the path that helps more buyers find, understand, and choose your product.</p>
              <p>Build projects start at $3,500.</p>
              <p>
                Depending on what your brand needs, this can include Pinterest foundation, keyword strategy, board direction, pin creative, content priorities, product and landing page recommendations, lead-generation setup, reporting, and ads preparation or campaign direction.
              </p>
              <p>By the end, you are not left with a pretty plan sitting in a folder. You have a system your brand can keep using.</p>
              <p>You can run it with your team, or I can keep managing and refining it with you.</p>
            </div>
          </div>

          <div className="service-tier-grid mt-10">
            {MOMENTUM_TIERS.map((tier) => {
              const visibleIncludes = tier.includes.slice(0, tier.featured ? 7 : 6);
              const hiddenIncludes = tier.includes.slice(visibleIncludes.length);

              return (
                <article key={tier.name} className={`service-tier-card reveal-on-scroll${tier.featured ? " service-tier-card-featured" : ""}`}>
                  {tier.badge ? <p className="service-tier-badge">{tier.badge}</p> : null}
                  <div>
                    <h3 className="headline-card text-[var(--heading)]">{tier.name}</h3>
                    <p className="service-tier-price">{tier.price}</p>
                    <p className="service-tier-description">{tier.description}</p>
                  </div>

                  <div className="service-tier-scope">
                    <p className="service-tier-label">Can include</p>
                    <ul className="service-check-list">
                      {visibleIncludes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {hiddenIncludes.length > 0 || tier.supporting ? (
                      <details className="service-scope-details">
                        <summary>See full scope</summary>
                        {tier.supporting ? <p>{tier.supporting}</p> : null}
                        {hiddenIncludes.length > 0 ? (
                          <ul className="service-check-list">
                            {hiddenIncludes.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}
                      </details>
                    ) : null}
                  </div>

                  <div className="service-tier-best-for">
                    <p className="service-tier-label">Best for</p>
                    <p>{tier.bestFor}</p>
                  </div>

                  <p className="service-tier-footer">{tier.footer}</p>
                </article>
              );
            })}
          </div>

          <div className="fit-call-note service-package-cta mt-10 text-center">
            <p className="text-base font-bold text-[var(--heading)]">Not sure which build fits? Start with a Fit Call.</p>
            <Link className="button-primary mt-5 inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
              {FIT_CALL_LABEL}
            </Link>
          </div>
        </div>
      </section>

      <section className="service-difference-section bg-white">
        <div className="service-difference-layout mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="service-difference-copy max-w-4xl">
            <p className="eyebrow">What makes this different</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              I will never treat your marketing like it <span className="text-gradient">lives on one platform.</span>
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>Pinterest may be the channel I know deeply, but I am not here to &ldquo;just manage Pinterest&rdquo; in a corner.</p>
              <p>
                Your traffic, content, products, offers, website, email list, customer journey, launches, and sales path all affect whether Pinterest can actually do its job.
              </p>
              <p>So I look at the whole ecosystem.</p>
              <p>
                Where people first find you. What they need to understand. What they click. Where they land. What happens after they compare, subscribe, browse, or buy.
              </p>
              <p>
                Because Pinterest should not become another disconnected marketing task. It should help more of the right people find the business you are already building.
              </p>
            </div>
          </div>

          <div className="service-difference-grid grid gap-4 md:grid-cols-2">
            {DIFFERENCE_CARDS.map((card) => (
              <article key={card.title} className="path-card premium-interactive-card reveal-on-scroll">
                <h3 className="headline-compact text-[var(--heading)]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="proof-snapshot-section service-proof-section">
        <div className="proof-snapshot-inner mx-auto max-w-6xl px-5 sm:px-8">
          <div className="proof-snapshot-intro mx-auto max-w-3xl text-center">
            <p className="eyebrow">Proof it can work</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Product brands can use Pinterest to reach people before they are ready to buy.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>
                Pinterest can support the quiet moments before purchase: when people are researching, comparing, planning, and coming back later.
              </p>
              <p>That is why product-brand proof matters most here.</p>
            </div>
          </div>

          <div className="proof-credibility-strip" aria-label="Client and industry proof">
            <span>Trusted for Pinterest strategy across product, food, home, travel, and specialty consumer brands including {TRUST_LOGOS.join(", ")}.</span>
          </div>

          <div className="proof-snapshot-grid">
            {PROOF_TESTIMONIALS.map((testimonial) => (
              <article key={testimonial.client} className="proof-snapshot-card reveal-on-scroll">
                <div className="proof-snapshot-card-top">
                  <span className="proof-snapshot-tag">Proof snapshot</span>
                  <h3>{testimonial.outcome}</h3>
                </div>
                <p className="proof-snapshot-quote">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="proof-snapshot-footer">
                  <p>{testimonial.client}</p>
                  <span>{testimonial.role}</span>
                </div>
                <p className="service-proof-shows">
                  <span>What this shows: </span>
                  {testimonial.shows}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="service-faq-section bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Questions before we build</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">Every Pinterest path starts with clarity.</h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>
                After the Pinterest Fit Call, the next step is The Fruitful Path. This is where I look at your current state, your goals, where your product brand can be found, and what Pinterest needs to support next.
              </p>
              <p>
                If you move forward into Build the Momentum, that opportunity map becomes the foundation for what we create next.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {SERVICE_FAQS.map((item) => (
              <details key={item.question} className="faq-card service-faq-item reveal-on-scroll">
                <summary>
                  <span>{item.question}</span>
                  <span className="service-faq-icon" aria-hidden="true">+</span>
                </summary>
                <p className="service-faq-answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="service-final-cta-section bg-white px-5 sm:px-8">
        <CursorGlowPanel className="service-final-cta-panel mx-auto max-w-6xl">
          <div className="service-final-cta-content">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
                Before your brand keeps missing <span className="text-gradient">traffic and sales on Pinterest</span>, let&apos;s find out if the opportunity is really there.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
                <p>Book a Fit Call and we will look at what you sell, what is already working, where people may be missing you, and whether Pinterest is the next layer your brand should build.</p>
              </div>

              <div className="service-final-options">
                <article className="service-final-option service-final-option-primary">
                  <h3 className="headline-card text-[var(--heading)]">Ready to talk it through?</h3>
                  <p>
                    Book a Fit Call and we&apos;ll look at your product brand, your goals, and whether Pinterest has a real job to do.
                  </p>
                  <Link className="button-primary mt-6 inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
                    {FIT_CALL_LABEL}
                  </Link>
                </article>
                <article className="service-final-option">
                  <h3 className="headline-card text-[var(--heading)]">Still deciding?</h3>
                  <p>
                    Take the Pinterest Fit Check and get a quick direction based on your offer, content, website, and goals.
                  </p>
                  <Link className="button-outline mt-6" href={PINTEREST_FIT_CHECK_URL}>
                    Start the Fit Check
                  </Link>
                </article>
              </div>

              <p className="service-credit-note mt-8 max-w-3xl">
                If we move forward after the Fit Call, The Fruitful Path maps the opportunity first. Build the Momentum turns the plan into a working system.
              </p>
            </div>

            <figure className="service-final-portrait" aria-label="Susy at the Fruitful Pin desk">
              <Image
                src={BRAND_ASSETS.founderExpert}
                alt="Susy at her desk with Fruitful Pin materials"
                width={1122}
                height={1402}
                sizes="(min-width: 1024px) 28vw, 88vw"
              />
            </figure>
          </div>
        </CursorGlowPanel>
      </section>
    </div>
  );
}
