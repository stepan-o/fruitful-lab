import Image from "next/image";
import { BOOKING_URL } from "@/lib/site";
import { AboutFinalCta } from "./AboutFinalCta";

export const metadata = {
  title: "About",
  description:
    "Fruitful Lab is the product discovery and growth systems studio launched by Susy and Stepan for specialty product brands.",
  alternates: {
    canonical: "/about/",
  },
};

const GOOD_FIT = [
  "You sell a product or productized offer and need the path around it to make more sense.",
  "You want search, content, lifecycle, testing, reporting, and AI workflows to connect instead of living in separate tabs.",
  "You are ready for practical strategy that turns into pages, campaigns, systems, dashboards, or repeatable decisions.",
  "You care about brand voice, customer context, and long-term usefulness more than trend-chasing.",
] as const;

const NOT_FIT = [
  "You want a pile of disconnected tactics without a clear reason behind them.",
  "You need overnight spikes, viral promises, or growth theater for its own sake.",
  "You are not ready to share product context, customer signals, or the real constraints around the work.",
] as const;

const VALUES = [
  {
    title: "Purpose before pressure.",
    text: "We will not push a tactic because it is popular. The work has to connect to a real function for the product, customer, or business.",
  },
  {
    title: "Honor the relationship.",
    text: "We care about expectations, timelines, budgets, feedback, guidelines, and the trust it takes to build around someone else's brand.",
  },
  {
    title: "Tailored to your brand DNA.",
    text: "Your product, stage, audience, constraints, and strengths shape the system. We are not here to make every brand sound or behave the same.",
  },
  {
    title: "Evidence with judgment.",
    text: "Data matters, but so does interpretation. We use signals to make better decisions without pretending every useful thing fits neatly into a dashboard.",
  },
  {
    title: "Creative transparency.",
    text: "You should understand what we are building, why it matters, where the tradeoffs are, and what comes next.",
  },
] as const;

const FOUNDERS = [
  {
    name: "Susy",
    role: "Co-founder · strategy, product discovery, search, and content",
    headline: "Hi, I am Susy.",
    image: "/images/founders/susy-founder-portrait.jpg",
    imageAlt: "Susy, Fruitful Lab co-founder, seated at a strategy desk.",
    text: [
      "I care about the words customers use, the reasons a product becomes easier to trust, and the path between discovery and a confident next step.",
      "My side of the lab is where product story, positioning, search behavior, content, and customer context come together.",
    ],
    facts: ["Multicultural strategy lens", "Customer language and product story", "Search behavior over noise"],
  },
  {
    name: "Stepan",
    role: "Co-founder · systems, data, testing, and workflows",
    headline: "Hi, I am Stepan.",
    image: "/images/founders/stepan-founder-portrait.jpg",
    imageAlt: "Stepan, Fruitful Lab co-founder, seated in a warm studio workspace.",
    text: [
      "I care about the systems that make decisions easier to repeat: analytics, testing, technical workflows, reporting, and the signal layer behind the work.",
      "My side of the lab is where strategy becomes measurable, maintainable, and less dependent on guesswork.",
    ],
    facts: ["Systems thinking", "Data and testing rhythm", "Practical automation"],
  },
] as const;

const KIND_WORDS = [
  {
    quote:
      "Susy's expertise and strategic approach significantly boosted traffic to my websites. Her hands-off strategy let me focus on other parts of my business.",
    name: "Paulina W.",
    role: "Content Manager, Visit Southern Spain",
    label: "Pinterest marketing strategist",
  },
  {
    quote:
      "I've appreciated Susy's depth of Pinterest knowledge. She has been very helpful when I've had puzzling issues on client accounts.",
    name: "Adrian Gentilcore",
    role: "Pinterest Manager",
    label: "Peer recommendation",
  },
  {
    quote:
      "Susy is a rockstar at helping clients understand, utilize, and maximize the power of Pinterest as a search engine.",
    name: "Paula Davidson",
    role: "Business owner",
    label: "Business recommendation",
  },
  {
    quote:
      "Susana is collaborative and strategic, focusing on participant experience while delivering metrics with empathy, growth, and impact.",
    name: "Francine German Allan",
    role: "Program collaborator",
    label: "Collaboration recommendation",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="lab-about-page">
      <section className="lab-about-hero" aria-labelledby="about-title">
        <div className="lab-about-shell lab-about-hero-copy">
          <p className="lab-about-kicker">About Fruitful Lab</p>
          <h1 id="about-title">
            We do not just build marketing pieces. We <span>connect the system around the product.</span>
          </h1>
          <i className="lab-about-hero-swish" aria-hidden="true" />
          <p>
            For specialty product brands that need more than scattered tactics, Fruitful Lab builds product discovery
            and growth systems designed to make the right next step easier to see, test, and repeat.
          </p>
          <div className="lab-about-actions">
            <a href={BOOKING_URL}>Book a fit call</a>
            <a href="/services/">Explore services</a>
          </div>
        </div>
      </section>

      <section className="lab-about-story" id="story">
        <div className="lab-about-shell lab-about-story-grid">
          <div>
            <p className="lab-about-kicker">How it started</p>
            <h2>From scattered growth work to a <span>practical product discovery lab.</span></h2>
          </div>
          <div className="lab-about-copy">
            <p>
              Fruitful Lab launched in 2025 because we kept seeing good products surrounded by disconnected work: a
              content plan over here, a search idea over there, an email sequence, an AI workflow, a report, and a paid
              campaign all moving from different assumptions.
            </p>
            <p>
              The problem was not that every piece was wrong. The problem was that the thing being built was a system,
              and no one was treating it like one. Susy and Stepan started Fruitful Lab to connect those pieces with
              more care, more context, and more useful signal.
            </p>
            <p>
              Today, the lab helps brands make the product easier to find, trust, choose, measure, and improve without
              flattening the brand into whatever tactic is loudest this month.
            </p>
          </div>
        </div>
        <div className="lab-about-shell lab-about-image-row" aria-label="Fruitful Lab founder work scenes">
          <div>
            <Image
              src="/images/founders/susy-stepan-desk-review.jpg"
              alt="Susy and Stepan reviewing notes together at the Fruitful Lab workbench."
              fill
              sizes="(max-width: 640px) 100vw, 46vw"
            />
            <span>Founder workbench</span>
          </div>
          <div>
            <Image
              src="/images/founders/susy-stepan-whiteboard-collab.jpg"
              alt="Susy and Stepan mapping a growth system together at a whiteboard."
              fill
              sizes="(max-width: 640px) 100vw, 54vw"
            />
            <span>Systems mapping</span>
          </div>
        </div>
      </section>

      <section className="lab-about-fit" id="fit">
        <div className="lab-about-shell lab-about-fit-grid">
          <div>
            <p className="lab-about-kicker">Who we work with</p>
            <h2>We partner with brands ready to make growth feel <span>less fragmented.</span></h2>
            <p>
              If your customers are searching, comparing, reading, saving, subscribing, or asking AI tools for answers,
              the path around your product should be working harder for you.
            </p>
          </div>
          <div className="lab-about-fit-lists">
            <article className="lab-about-fit-positive">
              <h3>You are in the right place if you...</h3>
              <ul>
                {GOOD_FIT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="lab-about-fit-negative">
              <h3>We are probably not a fit if you...</h3>
              <ul>
                {NOT_FIT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="lab-about-values" id="values">
        <div className="lab-about-shell">
          <div className="lab-about-section-heading">
            <p className="lab-about-kicker">Our values</p>
            <h2>What matters to us, so the work can <span>matter to you.</span></h2>
            <p>These are the principles we want clients to feel in the partnership, not just read on a page.</p>
          </div>
          <div className="lab-about-value-orbit" aria-label="Fruitful Lab partnership principles">
            <div className="lab-about-value-center">
              <span>The client</span>
              <strong>Your product, people, and real constraints stay at the center.</strong>
              <p>Every principle has to serve the partnership, not sit beside it as a slogan.</p>
            </div>
            {VALUES.map((value, index) => (
              <article className={`lab-about-value-node lab-about-value-node-${index + 1}`} key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-about-founders" id="founders">
        <div className="lab-about-shell">
          <div className="lab-about-section-heading lab-about-section-heading-split">
            <div>
              <p className="lab-about-kicker">People behind the lab</p>
              <h2>Two founders, one <span>connected system</span> of thinking.</h2>
            </div>
            <p>
              Fruitful Lab is founder-led by design. The work stays close to the people thinking through the product,
              the data, the customer, and the system that needs to exist around it.
            </p>
          </div>
          <div className="lab-about-founder-story-grid">
            {FOUNDERS.map((founder) => (
              <article key={founder.name} className="lab-about-founder-story">
                <div className="lab-about-founder-photo">
                  <Image src={founder.image} alt={founder.imageAlt} fill sizes="(max-width: 980px) 100vw, 420px" />
                  <strong>{founder.name}</strong>
                </div>
                <div>
                  <p className="lab-about-founder-role">{founder.role}</p>
                  <h3>{founder.headline}</h3>
                  {founder.text.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <div className="lab-about-facts" aria-label={`${founder.name} focus areas`}>
                    {founder.facts.map((fact) => (
                      <span key={fact}>{fact}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-about-kind-words" aria-labelledby="kind-words-title">
        <div className="lab-about-shell">
          <div className="lab-about-kind-words-head">
            <p className="lab-about-kicker">Kind words</p>
            <h2 id="kind-words-title">People say Fruitful Lab makes strategy feel clearer, calmer, and more useful.</h2>
            <i aria-hidden="true" />
            <p>
              The goal is not to make growth feel like one more confusing marketing channel. It is to make the strategy
              easier to understand, easier to act on, and more connected to what the business actually needs.
            </p>
          </div>
          <div className="lab-about-testimonial-grid">
            {KIND_WORDS.map((item) => (
              <article key={item.name}>
                <span aria-label="Five stars">★★★★★</span>
                <blockquote>“{item.quote}”</blockquote>
                <p>{item.name}</p>
                <small>{item.role}</small>
                <strong>{item.label}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AboutFinalCta />
    </div>
  );
}
