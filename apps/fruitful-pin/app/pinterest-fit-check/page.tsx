import Link from "next/link";
import { PinterestFitAssessmentEmbed } from "@/components/PinterestFitAssessmentEmbed";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

export const metadata = {
  title: "Pinterest Fit Check",
  description: "Take the Fruitful Pin Pinterest Fit Check to see whether Pinterest is a strong, promising, or later-stage move for your brand.",
};

const resultPaths = [
  {
    title: "Strong fit",
    description: "You may be ready to map Pinterest into a real traffic, list-growth, or sales-support path.",
  },
  {
    title: "Promising fit",
    description: "You may have enough potential to keep going, but the content, offer, or page path needs focus first.",
  },
  {
    title: "Later move",
    description: "Pinterest may still be useful, but another foundation piece probably needs attention before the channel gets serious.",
  },
];

export default function PinterestFitCheckPage() {
  return (
    <div className="bg-white">
      <section className="fit-check-hero">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Pinterest Fit Check</p>
            <h1 className="brand-display mt-4 headline-hero text-[var(--heading)]">
              Is Pinterest a smart next move, or a <span className="text-gradient">later project?</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Use this quick diagnostic before you invest in a Pinterest plan. It looks at the pieces that make traffic useful: offer readiness, content assets, website clarity, goals, and support timing.
            </p>
            <div className="fit-check-note mt-8">
              <span>How to use it</span>
              <p>Take the fit check first, then use the result to decide whether to book a fit call, read deeper resources, or strengthen the foundation before Pinterest becomes the main move.</p>
            </div>
          </div>

          <PinterestFitAssessmentEmbed />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Result paths</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              The score is just a shortcut to the right next step.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The Fit Check is not trying to flatter every brand into Pinterest. It is meant to show whether the channel has enough useful material to work with right now.
            </p>
          </div>
          <div className="fit-check-path-grid mt-9">
            {resultPaths.map((path) => (
              <article key={path.title} className="fit-check-path-card reveal-on-scroll">
                <h3 className="brand-display headline-card text-[var(--heading)]">{path.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{path.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-16 sm:px-8 lg:pb-20">
        <div className="cta-wave mx-auto max-w-6xl">
          <h2 className="brand-display max-w-3xl headline-section text-[var(--heading)]">Want help reading the result?</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
            Start with a fit call and we&apos;ll look at your content, offer, and Pinterest opportunity without guessing.
          </p>
          <Link className="button-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold" href={BOOKING_URL}>
            {FIT_CALL_LABEL}
          </Link>
        </div>
      </section>
    </div>
  );
}
