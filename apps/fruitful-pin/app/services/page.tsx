import type { Metadata } from "next";
import { LegacyRedirectNotice } from "@/components/LegacyRedirectNotice";

export const metadata: Metadata = {
  title: "Services",
  description: "Pinterest services now live at the canonical Pinterest Services URL.",
  alternates: {
    canonical: "/pinterest-services",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ServicesRedirectPage() {
  return (
    <LegacyRedirectNotice
      destination="/pinterest-services"
      eyebrow="Redirecting to Pinterest Services"
      title="The services page has one V1 home."
      body="Fruitful Pin now uses Pinterest Services as the canonical services page, so this older path points there."
      ctaLabel="Go to Pinterest Services"
    />
  );
}
