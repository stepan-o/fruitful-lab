// frontend/lib/tools/pinterestPotential/leadMode.ts

export type LeadMode =
    | "gate_before_results"
    | "optional_after_results"
    | "prefilled_or_skip";

/**
 * Normalize leadMode strings coming from:
 * - query params (leadMode=...)
 * - cookies (future)
 *
 * Accepts a few friendly aliases and tolerates separators like "-", " ", etc.
 */
export function normalizeLeadMode(value?: string): LeadMode | undefined {
    if (!value) return undefined;

    const raw = value.trim().toLowerCase();
    if (!raw) return undefined;

    // Allow "auto" to mean "no override"
    if (raw === "auto") return undefined;

    // Normalize separators to underscores to tolerate:
    // "gate-before-results", "gate before results", etc.
    const v = raw.replace(/[\s-]+/g, "_");

    // Gate before results
    if (
        v === "gate_before_results" ||
        v === "gate" ||
        v === "before" ||
        v === "gated" ||
        v === "gate_before"
    ) {
        return "gate_before_results";
    }

    // Optional after results
    if (
        v === "optional_after_results" ||
        v === "optional" ||
        v === "after" ||
        v === "after_results" ||
        v === "optional_after"
    ) {
        return "optional_after_results";
    }

    // Prefilled or skip
    if (
        v === "prefilled_or_skip" ||
        v === "prefilled" ||
        v === "prefill" ||
        v === "skip" ||
        v === "prefilled_skip" ||
        v === "skip_or_prefilled"
    ) {
        return "prefilled_or_skip";
    }

    return undefined;
}

export function resolveLeadMode({
                                    requested,
                                    cookieValue,
                                    isKnownLead,
                                }: {
    requested?: string;
    cookieValue?: string;
    isKnownLead?: boolean;
}): LeadMode {
    const req = normalizeLeadMode(requested);
    if (req) return req;

    const cookie = normalizeLeadMode(cookieValue);
    if (cookie) return cookie;

    // If we already know the lead (logged-in user or valid token), prefer skip-mode
    if (isKnownLead) return "prefilled_or_skip";

    // Default — gated before results like Outgrow
    return "gate_before_results";
}
