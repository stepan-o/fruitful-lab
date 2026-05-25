import Image from "next/image";
import Link from "next/link";
import { HomeFinalCta } from "@/components/HomeFinalCta";
import { PinterestFitAssessmentEmbed } from "@/components/PinterestFitAssessmentEmbed";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

const REAL_PROBLEM_CARDS = [
  {
    title: "They are already planning",
    body: "Your future customers are searching for ideas, products, routines, trips, rooms, gifts, and solutions while they are still shaping what they may buy next.",
  },
  {
    title: "Another brand enters the buying path first",
    body: "When your brand is not visible in those planning and comparison moments, another product, guide, or shop can become the option they trust first.",
  },
  {
    title: "More pins will not fix a blurry path",
    body: "Pinterest works better when your search language, visuals, boards, pages, and next steps all support the customer journey from idea to purchase.",
  },
] as const;

const VISIBILITY_CARDS = [
  {
    stage: "Buyer language",
    title: "The words your buyers actually use",
    body: "If your brand is not showing up in their words, planning moments, or comparison searches, they may never know you were an option.",
  },
  {
    stage: "Pin creative",
    title: "The pins they stop for",
    body: "Pretty helps, but the creative needs to catch the right person while they are looking, comparing, dreaming, or deciding.",
  },
  {
    stage: "Landing path",
    title: "The page they land on",
    body: "A click only matters if the next step feels clear: shop, read, subscribe, book, compare, or come back later.",
  },
  {
    stage: "Business signals",
    title: "The signals your business can learn from",
    body: "The numbers should help you see what people want, what they ignore, and where the path needs to feel easier.",
  },
] as const;

const FIT_CARDS = [
  {
    title: "Product brands",
    body: "For brands with products people research, compare, save, gift, style, use, or plan around before they buy.",
    image: "/assets/home/travel%20product%20brand.png",
    imageAlt: "Editorial product and travel brand visuals arranged for discovery.",
  },
  {
    title: "Content-led businesses",
    body: "For brands with articles, guides, recipes, tutorials, resources, or ideas that should keep bringing people back long after publish day.",
    image: "/assets/home/blogger%20brand.png",
    imageAlt: "Editorial workspace for a content-led business with articles and ideas.",
  },
  {
    title: "Specialty brands with a longer buying path",
    body: "For brands that need education, trust, inspiration, or repeated touchpoints before someone is ready to buy, subscribe, inquire, or come back.",
    image: "/assets/home/product%20center.png",
    imageAlt: "Premium product-centered brand scene for a thoughtful buying path.",
  },
] as const;

const SEARCHABLE_THINGS = [
  "Products",
  "Blog posts",
  "Guides",
  "Recipes",
  "Room ideas",
  "Trip itineraries",
  "Routines",
  "Gifts",
  "Tutorials",
  "Offers",
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
    tag: "Organic + ads",
  },
  {
    client: "Visit Southern Spain",
    role: "Full-time Travel Blogger",
    quote: "We stopped chasing trends and finally invested in Pinterest. It's now one of our top-performing platforms.",
    outcome: "Pinterest became a top traffic driver",
    tag: "Travel content",
  },
  {
    client: "Armstrong-Clark",
    role: "Founder",
    quote: "Our seasonal Pinterest campaigns brought a surge in brand visibility when it mattered most. We reached new audiences and saw real lift, right when demand peaked.",
    outcome: "Seasonal visibility lift + new audience reach",
    tag: "Seasonal campaign",
  },
] as const;

const CREDIBILITY_RIBBON_COPY = "Pinterest strategy across food, travel, home, baby, wellness, education, and specialty product brands.";

const HERO_SEARCH_RESULTS = [
  {
    title: "Gift guide",
    body: "Thoughtful ideas for the first weeks",
    tone: "hero-result-warm",
    featured: false,
  },
  {
    title: "Nursery pick",
    body: "Soft light, simple routine support",
    tone: "hero-result-gold",
    featured: false,
  },
  {
    title: "Self-care box",
    body: "Small care moments for new parents",
    tone: "hero-result-blush",
    featured: false,
  },
  {
    title: "Baby sleep helper",
    body: "Useful products people compare",
    tone: "hero-result-navy",
    featured: false,
  },
  {
    title: "Product idea",
    body: "A saved option for later",
    tone: "hero-result-cream",
    featured: false,
  },
  {
    title: "Your brand here",
    body: "The moment they find you",
    tone: "hero-result-brand",
    featured: true,
  },
] as const;

function HomeHeroSearchVisual() {
  return (
    <div className="home-hero-visual home-hero-search-visual" role="img" aria-label="A premium search panel showing gift ideas for new moms and a highlighted opportunity for your brand to be found.">
      <div className="hero-search-panel">
        <div className="hero-search-query">
          <span className="hero-search-query-icon" />
          <span>gift ideas for new moms</span>
        </div>

        <div className="hero-intent-chips" aria-hidden="true">
          <span>Ideas</span>
          <span>Products</span>
          <span>Gifts</span>
          <span>Compare</span>
        </div>

        <div className="hero-result-grid">
          {HERO_SEARCH_RESULTS.map((card) => (
            <article key={card.title} className={`hero-result-card ${card.tone}${card.featured ? " hero-result-featured" : ""}`}>
              <div className="hero-result-media" />
              <div className="hero-result-copy">
                <h2>{card.title}</h2>
                <p>{card.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="hero-planning-note">Found while planning</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="home-hero">
        <div className="home-hero-grid mx-auto grid max-w-7xl items-center gap-9 px-5 pb-10 pt-12 sm:gap-12 sm:px-8 sm:pb-14 sm:pt-20 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14 lg:pb-20 lg:pt-24">
          <div className="home-hero-copy">
            <h1 className="brand-display home-hero-title text-[var(--heading)]">
              <span className="home-hero-line">Your future customers</span>
              <span className="home-hero-line">are already searching.</span>
              <span className="home-hero-line home-hero-question">But are they <span className="text-gradient home-hero-gradient">finding</span></span>
              <span className="home-hero-line home-hero-brand-line"><span className="text-gradient home-hero-gradient">your brand?</span></span>
            </h1>
            <p className="home-hero-lede mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              We help your brand get found on Pinterest while people are planning their next purchase, project, trip, meal, room, routine, or idea.
            </p>
            <div className="home-hero-actions mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
              <Link className="button-quiet" href="/pinterest-services">
                <span>Explore Services</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <HomeHeroSearchVisual />
        </div>
      </section>

      <section className="home-flow">
        <div className="home-flow-inner mx-auto max-w-6xl px-5 pb-16 pt-24 sm:px-8 lg:pb-20 lg:pt-32">
          <div className="real-problem-layout">
            <div className="real-problem-copy">
              <p className="eyebrow">The real problem</p>
              <h2 className="brand-display headline-section text-[var(--heading)]">
                Your brand may be showing up <span className="text-gradient">too late</span>, or not at all.
              </h2>
              <div className="real-problem-body">
                <p>
                  People do not only come to Pinterest when they are ready to buy today. They come when they are imagining, comparing, collecting ideas, planning projects, and quietly deciding what they want next.
                </p>
                <p>
                  If your brand is not showing up in those moments, you are not just missing clicks. You may be missing the chance to become the brand they remember first.
                </p>
              </div>
            </div>

            <figure className="real-problem-visual">
              <Image
                src="/assets/home/Customer%20journey%20with%20Pinterest.png"
                alt="Buyer journey showing Pinterest visibility opportunities from inspiration to search, compare, plan, and buy."
                width={1350}
                height={1350}
                className="real-problem-image"
                priority={false}
              />
            </figure>
          </div>

          <div className="real-problem-insights">
            {REAL_PROBLEM_CARDS.map((card, index) => (
              <article key={card.title} className="real-problem-insight">
                <span className="real-problem-insight-marker" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="headline-compact text-[var(--heading)]">{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="visibility-system-section">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="visibility-system-intro">
            <div>
              <p className="eyebrow">Where visibility gets lost</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
                Pinterest works better when it fits the <span className="text-gradient">whole business picture.</span>
              </h2>
            </div>
            <div className="visibility-system-copy">
              <p>A pin can get attention and still do very little for your business.</p>
              <p>
                That is why we do not look at Pinterest like a separate little task on your marketing list. We look at the bigger picture: what you sell, who needs to find it, what they are already looking for, where they land, and what would make the next step feel natural.
              </p>
              <p>
                Because being seen is not enough. Your brand needs to be found in the right moment, remembered for the right reason, and supported by a path that actually makes sense.
              </p>
            </div>
          </div>

          <div className="visibility-framework" aria-label="Connected visibility framework from buyer language to business signals">
            {VISIBILITY_CARDS.map((card, index) => (
              <article key={card.stage} className="visibility-framework-node">
                <div className="visibility-node-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="visibility-node-dot" aria-hidden="true" />
                <div>
                  <p className="visibility-node-stage">{card.stage}</p>
                  <h3 className="headline-compact text-[var(--heading)]">{card.title}</h3>
                  <p className="visibility-node-body">{card.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="audience-fit-section">
        <div className="audience-fit-inner mx-auto max-w-6xl px-5 sm:px-8">
          <div className="audience-fit-intro">
            <div>
              <p className="eyebrow">Who this is for</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
                For brands with something people are <span className="text-gradient">already looking for.</span>
              </h2>
            </div>
            <div className="audience-fit-copy">
              <p>Pinterest works best when your business has something people naturally search for, save, compare, plan, or come back to later.</p>
              <p>
                That might be a product, a blog post, a guide, a recipe, a room idea, a trip itinerary, a routine, a gift, a tutorial, or an offer that needs more of the right people to find it.
              </p>
              <p>
                This is not about posting for the sake of posting. It is about helping the right people discover your brand at the moment they are already open to ideas.
              </p>
            </div>
          </div>

          <div className="audience-fit-chip-row" aria-label="Examples of searchable things Pinterest can support">
            {SEARCHABLE_THINGS.map((chip) => (
              <span key={chip} className="audience-fit-chip">{chip}</span>
            ))}
          </div>

          <div className="audience-fit-image-row" aria-label="Examples of brands and content Pinterest can support">
            {FIT_CARDS.map((card) => (
              <figure key={card.title} className="audience-fit-image-tile">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  width={1448}
                  height={1086}
                  className="audience-fit-image"
                  sizes="(min-width: 1024px) 31vw, (min-width: 768px) 33vw, 92vw"
                />
              </figure>
            ))}
          </div>

          <div className="audience-fit-panel">
            {FIT_CARDS.map((card, index) => (
              <article key={card.title} className="audience-fit-module">
                <span className="audience-fit-module-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="headline-card text-[var(--heading)]">{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="work-roadmap-section">
        <div className="work-roadmap-inner mx-auto max-w-6xl px-5 sm:px-8">
          <div className="work-roadmap-intro">
            <div>
              <p className="eyebrow">How we work</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
                Start with <span className="text-gradient">the path</span> before building more Pinterest.
              </h2>
            </div>
            <div className="work-roadmap-lede">
              <p>Before we recommend management, ads, or ongoing support, we look at whether Pinterest actually makes sense for your business right now.</p>
              <p>
                The goal is not to sell you more pins. The goal is to understand where people may already be looking for what you offer, where they may be missing you, and what kind of Pinterest work would be worth building next.
              </p>
            </div>
          </div>

          <div className="work-roadmap" aria-label="Fruitful Pin expert-led Pinterest process">
            {WORK_STAGES.map((stage, index) => (
              <article key={stage.title} className="work-roadmap-step">
                <div className="work-roadmap-marker" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="work-roadmap-card">
                  <p className="work-roadmap-stage">Stage {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="headline-card text-[var(--heading)]">{stage.title}</h3>
                  <div className="work-roadmap-body">
                    {stage.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <p className="work-roadmap-outcome">{stage.footer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="proof-snapshot-section">
        <div className="proof-snapshot-inner mx-auto max-w-6xl px-5 sm:px-8">
          <div className="proof-snapshot-intro mx-auto max-w-3xl text-center">
            <p className="eyebrow">Proof it can work</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              What changes when Pinterest has a <span className="text-gradient">clearer job.</span>
            </h2>
            <p>
              The goal is not more Pinterest activity for the sake of activity. It is helping Pinterest support something your business actually needs: visibility, product discovery, better traffic, seasonal demand, or content that keeps working longer.
            </p>
          </div>

          <div className="proof-credibility-strip" aria-label="Fruitful Pin industry experience">
            <span>{CREDIBILITY_RIBBON_COPY}</span>
          </div>

          <div className="proof-snapshot-grid">
            {PROOF_TESTIMONIALS.map((testimonial) => (
              <article key={testimonial.client} className="proof-snapshot-card">
                <div className="proof-snapshot-card-top">
                  <span className="proof-snapshot-tag">{testimonial.tag}</span>
                  <h3>{testimonial.outcome}</h3>
                </div>
                <p className="proof-snapshot-quote">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="proof-snapshot-footer">
                  <p>{testimonial.client}</p>
                  <span>{testimonial.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pinterest-fit-check-home" className="home-fit-check-section">
        <div className="home-fit-check-panel mx-auto max-w-6xl">
          <div className="home-fit-check-copy">
            <p className="eyebrow">Pinterest Fit Check</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              See if Pinterest is <span className="text-gradient">worth building around</span> right now.
            </h2>
            <p>
              Answer seven quick questions about your offer, content, website, and goals. You&apos;ll get an immediate direction, with the option to send your result to your inbox.
            </p>
            <div className="fit-assessment-mini-list" aria-label="Pinterest Fit Check details">
              <span>Takes about 2 minutes</span>
              <span>Immediate result</span>
              <span>Option to save by email</span>
            </div>
          </div>

          <PinterestFitAssessmentEmbed intro="buttonOnly" />
        </div>
      </section>

      <HomeFinalCta bookingUrl={BOOKING_URL} fitCallLabel={FIT_CALL_LABEL} />
    </div>
  );
}
