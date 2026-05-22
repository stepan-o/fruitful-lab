"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";

const LOGO_RIBBON = [
  "Luma & Co.",
  "Northline Baby",
  "Field & Vessel",
  "Casa Miel",
  "Trove Goods",
  "Bloom & Birch",
  "Wellkind",
  "Oro Pantry",
] as const;

const PHASES = [
  {
    eyebrow: "01 · Phase one",
    title: "Diagnose",
    weeks: "2-4 weeks",
    number: "01.",
    chips: ["Fixed price", "Credited toward build", "Signal audit"],
    heading: "Find the real bottleneck before we prescribe the formula.",
    description:
      "We map the product, audience, search behavior, customer path, creative assets, analytics, and channel gaps so the first move is based on evidence instead of preference.",
    leavesWith: [
      "Product discovery and search audit",
      "Offer, funnel, and content gap map",
      "Analytics and tracking review",
      "Priority scorecard for the next build",
      "90-day growth formula roadmap",
    ],
  },
  {
    eyebrow: "02 · Phase two",
    title: "Formulate",
    weeks: "3-6 weeks",
    number: "02.",
    chips: ["Strategy system", "Measurement plan", "Creative direction"],
    heading: "Turn the diagnosis into a usable growth formula.",
    description:
      "We define the channel mix, messaging lanes, search ecosystem, content jobs, funnel logic, reporting rhythm, and implementation order before production begins.",
    leavesWith: [
      "Positioning and message architecture",
      "Search, SEO, Pinterest, and AI-search plan",
      "Content and creative production map",
      "Dashboard and testing requirements",
      "Build plan with budget and team roles",
    ],
  },
  {
    eyebrow: "03 · Phase three",
    title: "Build",
    weeks: "8-12 weeks",
    number: "03.",
    chips: ["Implementation", "Launch path", "Most chosen"],
    heading: "Build the assets, workflows, and campaigns that make the formula real.",
    description:
      "Depending on the bottleneck, this can become search pages, content systems, email paths, paid-media tests, reporting views, AI-assisted creative workflows, or a connected launch system.",
    leavesWith: [
      "Search-led landing or content assets",
      "Email, lead capture, or nurture path",
      "Paid-media or retargeting test plan",
      "AI-assisted creative production workflow",
      "Launch QA and reporting handoff",
    ],
  },
  {
    eyebrow: "04 · Phase four",
    title: "Compound",
    weeks: "Ongoing",
    number: "04.",
    chips: ["Retainer", "Testing rhythm", "Scale decisions"],
    heading: "Use the signals to improve what is already working.",
    description:
      "Once the system is live, we help read the data, refresh the creative, tune the funnel, expand the search ecosystem, and choose the next experiment with less guesswork.",
    leavesWith: [
      "Monthly signal review and recommendations",
      "A/B testing and creative refreshes",
      "Search, content, and lifecycle expansion",
      "Campaign optimization and reporting",
      "Quarterly roadmap planning",
    ],
  },
] as const;

const WORKFLOW = [
  { label: "01 Diagnose", timing: "2-4 wks", className: "cfs-workflow-bar-one" },
  { label: "02 Formulate", timing: "3-6 wks", className: "cfs-workflow-bar-two" },
  { label: "03 Build", timing: "8-12 wks", className: "cfs-workflow-bar-three" },
  { label: "04 Compound", timing: "Ongoing", className: "cfs-workflow-bar-four" },
] as const;

const PACKAGES = [
  {
    eyebrow: "01 · Diagnose",
    title: "Growth Formula Diagnostic",
    price: "From $3.5K",
    detail: "Fixed scope · 2-4 weeks",
    cta: "Start with a diagnostic",
    featured: false,
    items: [
      "Product discovery and search audit",
      "Funnel, content, and offer review",
      "Analytics and tracking assessment",
      "90-day prioritized roadmap",
      "Credited toward implementation when scoped together",
    ],
  },
  {
    eyebrow: "02 · Build · Most chosen",
    title: "Implementation Lab",
    price: "Custom",
    detail: "Fixed scope · 8-12 weeks",
    cta: "Talk through the build",
    featured: true,
    items: [
      "Search ecosystem or campaign build",
      "Email, funnel, or lifecycle path",
      "Creative production and AI workflow setup",
      "Dashboard, reporting, and experiment plan",
      "Launch QA and handoff",
    ],
  },
  {
    eyebrow: "03 · Compound",
    title: "Signal Retainer",
    price: "Monthly",
    detail: "Ongoing after the first build",
    cta: "See retainer fit",
    featured: false,
    items: [
      "Monthly performance and signal review",
      "Creative refreshes and content expansion",
      "Testing and optimization rhythm",
      "Paid-media or lifecycle improvements",
      "Quarterly roadmap planning",
    ],
  },
] as const;

const TESTIMONIALS = [
  {
    initials: "PW",
    role: "Content leader",
    quote:
      "Susy's strategic approach helped us turn scattered ideas into a clearer plan, with practical recommendations we could actually use.",
  },
  {
    initials: "AD",
    role: "Marketing collaborator",
    quote:
      "The value is in the depth of thinking: search, content, creative, and the business goal all get connected instead of treated as separate tasks.",
  },
  {
    initials: "EA",
    role: "Founder collaborator",
    quote:
      "Susana is collaborative and strategic, focused on both the customer experience and the metrics that show whether the work is moving.",
  },
] as const;

const FAQS = [
  {
    question: "Do we have to do every phase?",
    answer:
      "No. The page shows the full model because the phases work best when they connect, but the first fit call helps decide whether you need a diagnostic, a focused build, or an ongoing partnership.",
  },
  {
    question: "Is this for product brands only?",
    answer:
      "Product and specialty brands are the first focus because discovery, content, search, creative, and data usually need to work together. The same structure can also fit content-led or offer-led brands when the product path is clear.",
  },
  {
    question: "Where does AI fit into the work?",
    answer:
      "AI is treated as a production and decision-support layer, not the whole offer. It can help with creative systems, content repurposing, workflows, research, and reporting when the brand voice and quality bar are protected.",
  },
  {
    question: "What if we only need paid media or SEO?",
    answer:
      "We can focus there if that is the real bottleneck. The diagnostic exists to make sure paid traffic, search work, or content production is not being asked to solve a different problem.",
  },
  {
    question: "How quickly can we start?",
    answer:
      "The next step is a fit call. From there, we can scope the diagnostic or first build based on timing, budget, existing assets, and how much evidence already exists.",
  },
] as const;

export function ServicesPage() {
  const [activePhase, setActivePhase] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const ctaRef = useRef<HTMLDivElement>(null);
  const phase = PHASES[activePhase];

  function handleCtaPointerMove(event: PointerEvent<HTMLDivElement>) {
    const cta = ctaRef.current;
    if (!cta) return;

    const rect = cta.getBoundingClientRect();
    cta.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    cta.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div className="cfs-page">
      <section className="cfs-hero">
        <div className="cfs-shell cfs-hero-grid">
          <div className="cfs-hero-copy">
            <p className="cfs-kicker">Services</p>
            <h1>
              A clear path from scattered marketing to a <span>growth formula.</span>
            </h1>
            <p>
              Most brands do not need a bigger menu of tactics. They need a sharper way to find the right first move, build it, and measure whether it is making the product easier to discover, understand, trust, and buy.
            </p>
            <div className="cfs-actions">
              <Link className="cfs-button cfs-button-primary" href="/contact">
                Book a fit call →
              </Link>
              <Link className="cfs-button cfs-button-secondary" href="#service-phases">
                Explore the phases →
              </Link>
            </div>
          </div>

          <div className="cfs-hero-visual" aria-label="Fruitful Lab service formula visual">
            <div className="cfs-visual-photo">
              <Image
                src="/images/service-product-lab-photo.jpg"
                alt="Unbranded specialty product arrangement on a soft studio backdrop"
                width={1536}
                height={1024}
                sizes="(max-width: 900px) 88vw, 410px"
                priority
              />
            </div>
            <div className="cfs-formula-card">
              <p>Growth formula</p>
              <strong>Product + stage + signal</strong>
            </div>
            <div className="cfs-visual-pill cfs-visual-pill-one">Search</div>
            <div className="cfs-visual-pill cfs-visual-pill-two">Content</div>
            <div className="cfs-visual-pill cfs-visual-pill-three">Data</div>
            <div className="cfs-visual-pill cfs-visual-pill-four">Paid media</div>
            <div className="cfs-visual-pill cfs-visual-pill-five">AI creative</div>
          </div>
        </div>
      </section>

      <section className="cfs-logo-ribbon" aria-label="Example brand logo ribbon">
        <div className="cfs-logo-ribbon-track">
          {[...LOGO_RIBBON, ...LOGO_RIBBON].map((logo, index) => (
            <span key={`${logo}-${index}`}>{logo}</span>
          ))}
        </div>
      </section>

      <section className="cfs-phase-section" id="service-phases">
        <div className="cfs-shell">
          <div className="cfs-section-heading">
            <p className="cfs-kicker">How the lab works</p>
            <h2>
              Diagnose. Formulate. <span>Build. Compound.</span>
            </h2>
            <p>Click a phase to see what happens, how long it takes, and what you walk away with.</p>
          </div>

          <div className="cfs-phase-tabs" role="tablist" aria-label="Service phases">
            {PHASES.map((item, index) => (
              <button
                key={item.title}
                aria-selected={activePhase === index}
                className={activePhase === index ? "cfs-phase-tab is-active" : "cfs-phase-tab"}
                onClick={() => setActivePhase(index)}
                role="tab"
                type="button"
              >
                <span>{item.eyebrow}</span>
                <strong>{item.title}</strong>
                <small>{item.weeks}</small>
              </button>
            ))}
          </div>

          <div className="cfs-phase-detail">
            <div>
              <p className="cfs-phase-number">{phase.number}</p>
              <div className="cfs-phase-chips">
                {phase.chips.map((chip) => (
                  <span key={chip}>{chip}</span>
                ))}
              </div>
              <h3>{phase.heading}</h3>
              <p>{phase.description}</p>
            </div>
            <div className="cfs-phase-deliverables">
              <p>You leave with</p>
              <ul>
                {phase.leavesWith.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cfs-workflow-section">
        <div className="cfs-shell">
          <div className="cfs-section-heading cfs-section-heading-wide">
            <p className="cfs-kicker">What 12 weeks can look like</p>
            <h2>A typical engagement, end to end.</h2>
            <p>Phases overlap because the best work is not a waterfall. Strategy, creative, data, and implementation inform each other as the formula gets tested.</p>
          </div>

          <div className="cfs-workflow-board">
            {WORKFLOW.map((item) => (
              <div className="cfs-workflow-row" key={item.label}>
                <span>{item.label}</span>
                <div className="cfs-workflow-track">
                  <b className={item.className}>{item.timing}</b>
                </div>
              </div>
            ))}
            <div className="cfs-workflow-weeks" aria-hidden="true">
              {["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12", "W13+"].map((week) => (
                <span key={week}>{week}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cfs-why-section">
        <div className="cfs-shell cfs-why-grid">
          <p className="cfs-kicker">Why this way</p>
          <div>
            <h2>
              We do not build to a tactic list. We build to a <span>measurable formula.</span>
            </h2>
            <div className="cfs-why-columns">
              <p>
                A brand can spend months producing content, ads, emails, and AI outputs without knowing which piece is meant to move the customer closer to buying. That is how marketing starts to feel busy but not useful.
              </p>
              <p>
                We start with the number and the signal. Search demand, conversion rate, email behavior, paid traffic, product education, and creative performance tell us what the formula needs next.
              </p>
              <p>
                That means the work can stay human and strategic while still using AI, reporting, and testing to make the next decision clearer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cfs-case-section">
        <div className="cfs-shell">
          <p className="cfs-kicker">The process in production</p>
          <div className="cfs-case-card">
            <div className="cfs-case-collage">
              <div className="cfs-case-image-large">
                <Image
                  src="/images/service-product-lab-photo.jpg"
                  alt="Unbranded product discovery scene for a specialty brand"
                  width={1536}
                  height={1024}
                  sizes="(max-width: 900px) 70vw, 390px"
                />
              </div>
              <div className="cfs-case-mini cfs-case-mini-one">Search map</div>
              <div className="cfs-case-mini cfs-case-mini-two">Creative test</div>
              <div className="cfs-case-mini cfs-case-mini-three">Email path</div>
            </div>
            <div className="cfs-case-copy">
              <div className="cfs-case-tags">
                <span>Specialty brand</span>
                <span>Product discovery</span>
                <span>Search + lifecycle</span>
              </div>
              <h2>A future proof story for a brand that needed the pieces to work together.</h2>
              <p>This space is designed for the real case study later: the diagnosis, the formula, the build, the data, and the customer path that changed.</p>
              <div className="cfs-case-metrics">
                <span>
                  <strong>01</strong>
                  Diagnostic
                </span>
                <span>
                  <strong>02</strong>
                  Build
                </span>
                <span>
                  <strong>03</strong>
                  Signal
                </span>
              </div>
              <Link className="cfs-button cfs-button-light" href="/contact">
                Talk through your version →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cfs-pricing-section">
        <div className="cfs-shell">
          <div className="cfs-section-heading cfs-section-heading-wide">
            <p className="cfs-kicker">Engagement models</p>
            <h2>
              How a Fruitful Lab engagement can <span>actually work.</span>
            </h2>
          </div>
          <div className="cfs-pricing-grid">
            {PACKAGES.map((item) => (
              <article className={item.featured ? "cfs-pricing-card is-featured" : "cfs-pricing-card"} key={item.title}>
                <p>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <div className="cfs-pricing-price">
                  <strong>{item.price}</strong>
                  <span>{item.detail}</span>
                </div>
                <ul>
                  {item.items.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Link className="cfs-button cfs-button-secondary" href="/contact">
                  {item.cta} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cfs-testimonial-section">
        <div className="cfs-shell">
          <div className="cfs-testimonial-heading">
            <div>
              <p className="cfs-kicker">What clients and collaborators say</p>
              <h2>Clearer thinking, repeatedly.</h2>
            </div>
            <p>Early testimonial structure for the page. Final quotes can be swapped in once the Fruitful Lab offer is locked.</p>
          </div>
          <div className="cfs-testimonial-grid">
            {TESTIMONIALS.map((item) => (
              <article className="cfs-testimonial-card" key={item.initials}>
                <div className="cfs-stars" aria-label="Five stars">★★★★★</div>
                <blockquote>“{item.quote}”</blockquote>
                <div className="cfs-testimonial-person">
                  <span>{item.initials}</span>
                  <p>{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cfs-faq-section">
        <div className="cfs-shell cfs-faq-grid">
          <div>
            <p className="cfs-kicker">About the process</p>
            <h2>
              Things people ask <span>before they sign.</span>
            </h2>
          </div>
          <div className="cfs-faq-list">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <article className="cfs-faq-item" key={item.question}>
                  <button aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : index)} type="button">
                    <span>{item.question}</span>
                    <b>{isOpen ? "×" : "+"}</b>
                  </button>
                  {isOpen ? <p>{item.answer}</p> : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cfs-final-section">
        <div className="cfs-final-cta" onPointerMove={handleCtaPointerMove} ref={ctaRef}>
          <p className="cfs-kicker">Start the experiment</p>
          <h2>
            Ready to see where your product discovery system is <span>leaking momentum?</span>
          </h2>
          <p>Start with a fit call. We will look at the product, the stage, the channels, and the signals before we decide what to build.</p>
          <div className="cfs-actions cfs-actions-center">
            <Link className="cfs-button cfs-button-primary" href="/contact">
              Book a fit call →
            </Link>
            <Link className="cfs-button cfs-button-dark" href="#service-phases">
              Review the process →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
