import { PINTEREST_FIT_CALL_URL_PLACEHOLDER_TOKEN } from "./config";
import type { AssessmentResult } from "./types";

export type PinterestFitResultViewModel = Readonly<{
    label: string;
    headline: string;
    intro: string;
    reasons: readonly string[];
    roleTitle: "Best role for Pinterest";
    roleCopy: string;
    ctaTitle: "Next step";
    ctaLabel: "Book a Fit Call";
    ctaCaption?: string;
    ctaSubtext: string;
    ctaUrl: string;
    bookingUrlPending: boolean;
    restartLabel: "Restart";
}>;

export function isPendingPinterestFitCallUrl(url: string): boolean {
    return url.includes(PINTEREST_FIT_CALL_URL_PLACEHOLDER_TOKEN);
}

export function createPinterestFitResultViewModel(result: AssessmentResult): PinterestFitResultViewModel {
    return {
        label: result.label,
        headline: result.headline,
        intro: result.intro,
        reasons: result.reasons,
        roleTitle: "Best role for Pinterest",
        roleCopy: result.roleCopy,
        ctaTitle: "Next step",
        ctaLabel: result.cta.label,
        ctaCaption: result.cta.caption,
        ctaSubtext: result.cta.subtext,
        ctaUrl: result.cta.url,
        bookingUrlPending: isPendingPinterestFitCallUrl(result.cta.url),
        restartLabel: "Restart",
    };
}
