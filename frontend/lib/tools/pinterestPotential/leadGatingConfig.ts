// frontend/lib/tools/pinterestPotential/leadGatingConfig.ts
/**
 * v0.2 (Locked) — Lead gating config surface
 *
 * Requirements:
 * - Must support: known lead skip, new lead hard lock, new lead soft lock.
 * - Must remain flexible at runtime (config surface), so compute + UI can adapt
 *   without changing business logic.
 *
 * Notes:
 * - This is NOT the same as the legacy leadMode.ts (gate_before_results, etc.).
 *   We’ll map old -> new in a later sprint when we rework the wizard.
 */

import type { LeadMode, LeadState } from "./pinterestPotentialSpec";

export type LeadGatingConfig = {
    lead_gating: {
        default_mode: LeadMode;
        modes: LeadMode[];

        /** v0.2: if known lead, skip email capture entirely. */
        known_lead_behavior: "skip";

        /**
         * v0.2: in soft lock, results remain visible even if user does not submit.
         * Email is required only if user chooses “email me the results”.
         */
        email_optional_in_soft_lock: boolean;

        capture_fields: {
            email: { required: true };
            name: { required: boolean };
        };
    };
};

export const LEAD_GATING_CONFIG: LeadGatingConfig = {
    lead_gating: {
        default_mode: "hard_lock",
        modes: ["hard_lock", "soft_lock"],
        known_lead_behavior: "skip",
        email_optional_in_soft_lock: true,
        capture_fields: {
            email: { required: true },
            name: { required: false },
        },
    },
} as const;

/**
 * Resolves effective mode/state for the current request.
 * - requestedMode: from query param (e.g., ?leadMode=soft_lock) or in-app control
 * - cookieMode: optional cookie override (if you decide to add it later)
 * - isKnownLead: computed from auth or token
 */
export function resolveLeadGating(params: {
    requestedMode?: string | null;
    cookieMode?: string | null;
    isKnownLead: boolean;
}): { lead_mode: LeadMode; lead_state: LeadState } {
    const lead_state: LeadState = params.isKnownLead ? "known" : "new";

    // Known lead always skips capture UI; mode still matters for telemetry, but
    // UX will treat it as "skip" per known_lead_behavior.
    const allowed = new Set<LeadMode>(LEAD_GATING_CONFIG.lead_gating.modes);

    const normalize = (v?: string | null): LeadMode | null => {
        if (!v) return null;
        if (v === "hard_lock" || v === "soft_lock") return v;
        return null;
    };

    const requested = normalize(params.requestedMode);
    const cookie = normalize(params.cookieMode);

    const lead_mode: LeadMode =
        (requested && allowed.has(requested) && requested) ||
        (cookie && allowed.has(cookie) && cookie) ||
        LEAD_GATING_CONFIG.lead_gating.default_mode;

    return { lead_mode, lead_state };
}