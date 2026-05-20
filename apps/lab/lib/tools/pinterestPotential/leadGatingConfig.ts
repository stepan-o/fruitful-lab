// frontend/lib/tools/pinterestPotential/leadGatingConfig.ts
/**
 * v0.2 (Locked) — Lead gating config surface (SPEC-ALIGNED)
 *
 * Keep this file as the single source of truth for:
 * - allowed modes
 * - default mode
 * - known-lead behavior policy
 * - capture field requirements
 *
 * IMPORTANT:
 * - No resolver logic lives here (to avoid duplicate resolution paths).
 * - Resolver lives in leadMode.ts.
 */

import type { LeadMode } from "./pinterestPotentialSpec";

export type LeadGatingConfig = {
    lead_gating: {
        /** Default lead mode when no override is provided. */
        default_mode: LeadMode;

        /** Allowed lead modes for runtime overrides (query/cookie). */
        modes: readonly LeadMode[];

        /** v0.2: if known lead, skip email capture entirely. */
        known_lead_behavior: "skip";

        /**
         * v0.2: in soft lock, results remain visible even if user does not submit.
         * Email is required only if user chooses “email me the results”.
         */
        email_optional_in_soft_lock: boolean;

        /** Capture field requirements (UI + validation alignment). */
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
