import Image from "next/image";
import Link from "next/link";
import { CursorGlowPanel } from "@/components/CursorGlowPanel";
import { BRAND_ASSETS } from "@/lib/brandAssets";
import { BOOKING_URL, FIT_CALL_LABEL, PINTEREST_FIT_CHECK_URL } from "@/lib/site";

const FRUITFUL_PATH_CARDS = [
  {
    title: "Where you are now",
    body: "We look at your current Pinterest presence, content, offers, website, and marketing goals so the strategy starts from reality.",
  },
  {
    title: "Where people may be missing you",
    body: "We look for the moments where your future customers may already be searching, planning, comparing, or saving, but not finding your brand.",
  },
  {
    title: "What should happen next",
    body: "We clarify what Pinterest needs to support next: visibility, traffic, product discovery, email growth, sales, or a cleaner path between them.",
  },
] as const;

const MOMENTUM_TIERS = [
  {
    name: "Pinterest Core Build",
    price: "Starting at $1,500",
    badge: null,
    description: "For brands that need their Pinterest foundation cleaned up, clarified, or built before moving into bigger growth work.",
    supporting: null,
    includes: [
      "Pinterest account review and cleanup",
      "Board structure",
      "Keyword direction",
      "Content and URL prioritization",
      "Pin creative direction",
      "Landing page recommendations from the Pinterest view",
      "Next-step plan for publishing or growth",
    ],
    bestFor:
      "Brands that know Pinterest has potential, but the account, boards, keywords, or content direction need a clearer foundation first.",
    footer: "A cleaner foundation before more activity.",
    featured: false,
  },
  {
    name: "Full-Funnel Pinterest Build",
    price: "6-month build investment starts at $9,000",
    badge: "Recommended for most growth builds",
    description:
      "For brands that want Pinterest connected across the full path: account, keywords, boards, creative, content priorities, website pages, reporting, and next steps.",
    supporting:
      "This is Pinterest-first. We look at the business through the Pinterest lens so the channel has a clearer role in visibility, product discovery, traffic, email growth, or sales.",
    includes: [
      "Organic Pinterest strategy",
      "Pinterest account and board optimization",
      "Keyword and content planning",
      "Pin creative direction and workflow",
      "URL and landing page prioritization",
      "Pinterest analytics and reporting",
      "Ads readiness or campaign direction where relevant",
    ],
    bestFor: "Brands ready to build Pinterest as a serious visibility and traffic channel, not just clean up the basics.",
    footer: "A full Pinterest path, not scattered pin activity.",
    featured: true,
  },
  {
    name: "Full-Funnel Plus Content",
    price: "Expanded content build starts at $12,000 / 6 months",
    badge: null,
    description:
      "For brands that need Pinterest plus stronger content assets to support the path people land in after they find you.",
    supporting:
      "This is for businesses where the opportunity is there, but the missing piece is not only the Pinterest account. It may also be the blog content, lead magnet, product education, landing page messaging, or broader content path Pinterest is sending people into.",
    includes: [
      "Everything in Full-Funnel Pinterest Build",
      "Select AI-assisted content assets",
      "Content direction",
      "AI-assisted blog content drafts",
      "Content refreshes or content briefs",
      "Lead magnet or quiz content direction",
      "Landing page copy recommendations",
      "Product education content ideas",
      "Broader analytics review",
      "Email-list path recommendations",
      "Content repurposing for Pinterest",
    ],
    bestFor:
      "Brands that want Pinterest connected to a stronger content and conversion path, not just managed as a standalone channel.",
    footer: "When Pinterest needs better content to send people to.",
    featured: false,
  },
] as const;

const DIFFERENCE_CARDS = [
  {
    title: "Product story, not just promotion",
    body: "We look at how people first understand what you sell, why it matters, and what would make them care enough to click, save, subscribe, inquire, or buy.",
  },
  {
    title: "Creative that teaches and sells",
    body: "The visuals are not just there to look nice. They help test angles, explain use cases, show desire, answer objections, and make the product or idea easier to remember.",
  },
  {
    title: "A fuller view of the customer path",
    body: "Pinterest may be the discovery point, but we also look at what happens after the click: the page, the offer, the next step, and whether the experience supports trust.",
  },
  {
    title: "Learning you can reuse beyond Pinterest",
    body: "The best insights do not stay trapped in one channel. Message tests, seasonal angles, audience signals, creative patterns, and content learnings can support your wider marketing.",
  },
] as const;

const TRUST_LOGOS = ["Organic Prairie", "Visit Southern Spain", "Armstrong-Clark"] as const;

const SERVICE_HERO_CHIPS = [
  "What are people already looking for?",
  "What does your business need more of?",
  "What should Pinterest support first?",
] as const;

const PROOF_TESTIMONIALS = [
  {
    client: "Organic Prairie",
    role: "Marketing Director",
    quote: "Pinterest became a real growth channel for us. We saw 4x ROAS on our ad spend and a steady rise in organic traffic to key product pages.",
    outcome: "4x ROAS + steady organic growth",
    shows: "Pinterest can support both paid performance and organic product-page visibility.",
  },
  {
    client: "Visit Southern Spain",
    role: "Full-time Travel Blogger",
    quote: "We stopped chasing trends and finally invested in Pinterest. It's now one of our top-performing platforms.",
    outcome: "Pinterest became a top traffic driver",
    shows: "Evergreen content can keep working when Pinterest is built around how people plan and search.",
  },
  {
    client: "Armstrong-Clark",
    role: "Founder",
    quote: "Our seasonal Pinterest campaigns brought a surge in brand visibility when it mattered most. We reached new audiences and saw real lift, right when demand peaked.",
    outcome: "Seasonal visibility lift + new audience reach",
    shows: "Pinterest can help brands show up during high-intent seasonal planning windows.",
  },
] as const;

const SERVICE_FAQS = [
  {
    question: "Do I need organic Pinterest, Pinterest ads, or both?",
    answer:
      "Not necessarily. That depends on your goals, your current content or product pages, your budget, and how much foundation is already in place. Some brands need organic first. Some are ready to test ads. Some need the account and website path cleaned up before either one makes sense.",
  },
  {
    question: "What if my Pinterest account is old, messy, or inactive?",
    answer:
      "That is common. The first step is not to panic-post more pins. We start with The Fruitful Path so we can see what is already there, what is still useful, what may be confusing Pinterest, and what needs to be cleaned up or rebuilt.",
  },
  {
    question: "Do I need a blog for Pinterest to work?",
    answer:
      "Not always. Product brands can use Pinterest with collections, product pages, guides, gift ideas, use cases, tutorials, or other helpful pages. Blogs can help, but the bigger question is whether you have useful places to send people after they discover you.",
  },
  {
    question: "What is The Fruitful Path?",
    answer:
      "The Fruitful Path is the paid strategy step after the Pinterest Fit Call. It shows where your brand can be found, where visibility is getting lost, and what to fix, build, test, or prioritize next. If you continue into Build the Momentum, your Fruitful Path investment can be credited toward the implementation.",
  },
  {
    question: "Can I hire you just to manage Pinterest?",
    answer:
      "Usually, we start with The Fruitful Path first. Pinterest management works better when the strategy is clear, the account has a purpose, and we know what the channel needs to support for your business.",
  },
  {
    question: "What happens after The Fruitful Path?",
    answer:
      "You can use the plan on your own, or we can move into Build the Momentum, where we turn the strategy into a working Pinterest system. This may include account structure, keywords, boards, pin creative, content planning, landing page direction, workflows, or ads preparation, depending on what your business needs.",
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
            <p className="eyebrow">Pinterest services</p>
            <h1 className="brand-display mt-5 headline-hero text-[var(--heading)]">
              Pinterest support that starts with <span className="text-gradient">the fit</span>, not the posting schedule.
            </h1>
            <div className="mt-6 max-w-2xl space-y-4 text-lg leading-8 text-[var(--muted)]">
              <p>
                You do not need to know whether you need organic management, ads, cleanup, content support, or a bigger Pinterest system before you reach out.
              </p>
              <p>
                We start by looking at your marketing, your goals, and whether Pinterest can help the right people find, understand, and choose your brand.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
              <a className="button-outline" href="#how-it-works">
                See How It Works
              </a>
            </div>
          </div>

          <div className="service-hero-strip" aria-label="What Fruitful Pin looks at first">
            {SERVICE_HERO_CHIPS.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white">
        <div className="service-path-section mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">The paid strategy step</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              <span className="text-gradient">The Fruitful Path</span> shows what Pinterest should actually support.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>If the fit is there, we do not jump straight into management, ads, or more content.</p>
              <p>
                We start with The Fruitful Path, a focused strategy plan that looks at your current state, where your brand can be found, where visibility is getting lost, and what needs to happen next.
              </p>
              <p>You leave with a clear plan for your current state, what to fix, build, test, or prioritize next.</p>
            </div>
            <Link className="button-primary mt-7 inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
              Start with a Fit Call
            </Link>
            <p className="service-credit-note mt-5">
              The Fruitful Path is the required strategy step before implementation. If you move forward into Build the Momentum, your Fruitful Path investment can be credited toward the build.
            </p>
          </div>

          <div className="process-ladder service-path-timeline">
            {FRUITFUL_PATH_CARDS.map((card, index) => (
              <article key={card.title} className="process-step-card service-path-step premium-interactive-card reveal-on-scroll">
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
          <div className="max-w-3xl">
            <p className="eyebrow">Build the Momentum</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Once the path is clear, we build the Pinterest <span className="text-gradient">system your business actually needs.</span>
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>The Fruitful Path shows what needs to happen first. From there, we build around your goals, audience, offer, positioning, and buying journey.</p>
              <p>
                This is where strategy turns into structure, so Pinterest is not just another channel to manage. It becomes a system that helps people find you, understand you, and take the next step.
              </p>
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
            <p className="text-base font-bold text-[var(--heading)]">Not sure which build fits? Start with a Pinterest Fit Call.</p>
            <Link className="button-primary mt-5 inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
              {FIT_CALL_LABEL}
            </Link>
          </div>
        </div>
      </section>

      <section className="service-difference-section bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-4xl">
            <p className="eyebrow">What makes this different</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              You are not just buying pins. You are building a better way for people to <span className="text-gradient">understand and choose your brand.</span>
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>Pinterest is often where the bigger questions become visible.</p>
              <p>
                Are people understanding what you sell? Do they know why it matters? Are the visuals telling the right story? Does the page answer the next question? Are people saving, clicking, comparing, or quietly moving on?
              </p>
              <p>
                That is why our work looks beyond the pin itself. We use Pinterest as a discovery surface, but the strategy connects product story, customer psychology, creative direction, content, landing pages, and analytics so your brand has a clearer path from first impression to next step.
              </p>
            </div>
          </div>

          <div className="service-difference-grid mt-10 grid gap-4 md:grid-cols-2">
            {DIFFERENCE_CARDS.map((card) => (
              <article key={card.title} className="path-card premium-interactive-card reveal-on-scroll">
                <h3 className="headline-compact text-[var(--heading)]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
              </article>
            ))}
          </div>

          <div className="fit-call-note mt-8">
            <p className="brand-display headline-card text-[var(--heading)]">
              Pinterest is the channel. The real work is helping more of the right people understand, trust, and want what you offer.
            </p>
          </div>
        </div>
      </section>

      <section className="proof-snapshot-section service-proof-section">
        <div className="proof-snapshot-inner mx-auto max-w-6xl px-5 sm:px-8">
          <div className="proof-snapshot-intro mx-auto max-w-3xl text-center">
            <p className="eyebrow">Proof it can work</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              What changes when Pinterest is built around the business, not just the pins.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>
                Different brands need Pinterest to do different jobs. Sometimes it needs to support product discovery. Sometimes it needs to bring steady traffic to evergreen content. Sometimes it needs to lift seasonal demand when timing matters most.
              </p>
              <p>The common thread is the same: Pinterest works better when the strategy, creative, content, and next step are connected.</p>
            </div>
          </div>

          <div className="proof-credibility-strip" aria-label="Client and industry proof">
            <span>Trusted for Pinterest strategy across {TRUST_LOGOS.join(", ")} and specialty product brands.</span>
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
                After the Pinterest Fit Call, every client journey begins with The Fruitful Path. This is the paid strategy step where we look at your current state, your goals, where your brand can be found, and what Pinterest would need to support next.
              </p>
              <p>
                If you move forward into Build the Momentum, your Fruitful Path investment can be credited toward the build. That way, the strategy does not sit in a document. It becomes the foundation for what we create next.
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
                Not sure what kind of Pinterest support you need? That is exactly why we start with a <span className="text-gradient">Fit Call.</span>
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
                <p>You do not need to know whether you need organic, ads, content support, cleanup, or a full Pinterest build before reaching out.</p>
                <p>We will look at where Pinterest belongs in your marketing, whether there is a real opportunity, and whether The Fruitful Path is the right next step.</p>
              </div>

              <div className="service-final-options">
                <article className="service-final-option service-final-option-primary">
                  <h3 className="headline-card text-[var(--heading)]">Ready to talk it through?</h3>
                  <p>
                    Book a Pinterest Fit Call and we&apos;ll look at your business, your goals, and whether Pinterest is worth building around right now.
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
                Every client journey starts with The Fruitful Path after the Fit Call. If you move forward into Build the Momentum, your Fruitful Path investment can be credited toward the build.
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
