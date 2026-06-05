import { PinterestReadinessCheck } from "@/components/PinterestReadinessCheck";
import { CANONICAL_URL, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

const pageTitle = "Pinterest Readiness Check";
const pageDescription =
  "Take the Fruitful Pin Pinterest Readiness Check to see whether Pinterest is a real opportunity for your product-based brand or a distraction to save for later.";
const pageUrl = `${CANONICAL_URL}/pinterest-readiness-check/`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: pageUrl,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
  },
};

export default function PinterestReadinessCheckPage() {
  return (
    <div className="readiness-page bg-white">
      <section className="readiness-assessment-section px-5 py-10 sm:px-8 lg:py-16">
        <PinterestReadinessCheck />
      </section>
    </div>
  );
}
