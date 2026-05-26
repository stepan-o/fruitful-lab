import type { Metadata } from "next";
import { LegacyRedirectNotice } from "@/components/LegacyRedirectNotice";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Fruitful Pin case studies are being held for V2. Start with the Pinterest services path for V1.",
  alternates: {
    canonical: "/pinterest-services",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CaseStudiesRedirectPage() {
  return (
    <LegacyRedirectNotice
      destination="/pinterest-services"
      eyebrow="Case studies are coming in V2"
      title="Start with the Pinterest services path."
      body="The case-study library is being held for V2 so the V1 site can stay focused. The best next step is the services page, where the Fit Call, Fruitful Path, and build options are explained."
      ctaLabel="Go to Services"
    />
  );
}
