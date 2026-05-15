export const PINTEREST_FIT_LEAD_SOURCE = "Pinterest Fit Assessment";

export const PINTEREST_FIT_MAILERLITE_DEFAULT_GROUP_ID = "187545365081229029";

export const PINTEREST_FIT_MAILERLITE_FIELDS = {
    result: {
        name: "Pinterest Fit Result",
        fallbackKey: "pinterest_fit_result",
    },
    source: {
        name: "Lead Source",
        fallbackKey: "lead_source",
    },
} as const;

export const PINTEREST_FIT_RESULT_LABELS = [
    "Strong Pinterest Fit",
    "Possible Pinterest Fit",
    "Not the Right Fit Right Now",
] as const;

export type PinterestFitLeadResultLabel = (typeof PINTEREST_FIT_RESULT_LABELS)[number];

export function isPinterestFitResultLabel(value: unknown): value is PinterestFitLeadResultLabel {
    return typeof value === "string" && PINTEREST_FIT_RESULT_LABELS.includes(value as PinterestFitLeadResultLabel);
}
