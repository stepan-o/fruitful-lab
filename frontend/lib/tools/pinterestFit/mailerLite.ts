export const PINTEREST_FIT_LEAD_SOURCE = "Pinterest Fit Assessment";

export const PINTEREST_FIT_MAILERLITE_DEFAULT_GROUP_ID = "187545365081229029";

export const PINTEREST_FIT_MAILERLITE_FIELDS = {
    result: {
        name: "Pinterest Fit Result",
        fallbackKey: "pinterest_fit_result",
    },
    topReason1: {
        name: "Top Reason 1",
        fallbackKey: "top_reason_1",
    },
    topReason2: {
        name: "Top Reason 2",
        fallbackKey: "top_reason_2",
    },
    topReason3: {
        name: "Top Reason 3",
        fallbackKey: "top_reason_3",
    },
    pinterestRole: {
        name: "Pinterest Role",
        fallbackKey: "pinterest_role",
    },
    recommendedNextStep: {
        name: "Recommended Next Step",
        fallbackKey: "recommended_next_step",
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
