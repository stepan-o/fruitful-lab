import type { Metadata } from "next";

import { PinterestFitAssessment } from "@/components/tools/pinterestFit";

export const metadata: Metadata = {
    title: "Pinterest Fit Assessment | Fruitful Lab",
    description:
        "A short Pinterest fit assessment for product-based brands to evaluate whether Pinterest is worth exploring and what role it could play.",
};

export default function PinterestFitAssessmentPage() {
    return <PinterestFitAssessment />;
}
