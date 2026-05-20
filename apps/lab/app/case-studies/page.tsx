// frontend/app/case-studies/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export default function CaseStudiesIndexPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:py-12 lg:py-20">
      <h1 className="font-heading text-3xl text-[#0B132B] sm:text-4xl">Fruitful Lab Case Studies (Coming Soon)</h1>
      <p className="mt-4 max-w-prose text-base text-[#171A21]/90">
        We publish deep-dives on what&apos;s working in Pinterest growth and full-funnel journeys. Expect transparent breakdowns of strategy, creative, and results.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        <Link href="/" className="text-[#0B132B] underline underline-offset-4 hover:text-[#071026]">
          ← Back to Tech Hub
        </Link>
        <a href="https://fruitfulpin.com" target="_blank" rel="noopener noreferrer" className="text-[#0B132B] underline underline-offset-4 hover:text-[#071026]">
          Visit the main Fruitful Pin site
        </a>
      </div>
    </div>
  );
}
