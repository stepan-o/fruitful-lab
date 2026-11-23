import { PINTEREST_FIT_CALL_URL_PLACEHOLDER_TOKEN } from "./config";
import type { AssessmentResult } from "./types";

export type PinterestFitBreakdownCardViewModel =
    | Readonly<{
          id: "reasons";
          title: "Top 3 reasons";
          kind: "list";
          items: readonly string[];
      }>
    | Readonly<{
          id: "role";
          title: "Best role for Pinterest";
          kind: "text";
          body: string;
      }>
    | Readonly<{
          id: "next_step";
          title: "Recommended next step";
          kind: "callout";
          heading: string;
          body: string;
      }>;

export type PinterestFitResultViewModel = Readonly<{
    label: string;
    headline: string;
    intro: string;
    breakdownTitle: "Your Personalized Breakdown";
    breakdownUnlockLabel: "Unlock after email";
    breakdownCards: readonly PinterestFitBreakdownCardViewModel[];
    ctaLabel: "Book a Fit Call";
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
        breakdownTitle: "Your Personalized Breakdown",
        breakdownUnlockLabel: "Unlock after email",
        breakdownCards: [
            {
                id: "reasons",
                title: "Top 3 reasons",
                kind: "list",
                items: result.reasons,
            },
            {
                id: "role",
                title: "Best role for Pinterest",
                kind: "text",
                body: result.roleCopy,
            },
            {
                id: "next_step",
                title: "Recommended next step",
                kind: "callout",
                heading: result.cta.caption ?? result.cta.label,
                body: result.cta.subtext,
            },
        ],
        ctaLabel: result.cta.label,
        ctaUrl: result.cta.url,
        bookingUrlPending: isPendingPinterestFitCallUrl(result.cta.url),
        restartLabel: "Restart",
    };
}
