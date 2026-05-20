// frontend/lib/tools/pinterestPotential/leadMode.ts
// v0.2 (Locked) — Lead gating mode resolver (SPEC-ALIGNED)
//
// Spec:
// - LeadMode: hard_lock | soft_lock
// - LeadState: known | new
// - Known leads skip capture in UX, but lead_mode still matters for telemetry/config.
//
// This file owns ALL resolution logic (query/cookie/default).

import type { LeadMode, LeadState } from "./pinterestPotentialSpec";
import { LEAD_GATING_CONFIG } from "./leadGatingConfig";

/**
 * Normalize leadMode strings coming from:
 * - query params (?leadMode=... or ?lead_mode=...)
 * - cookies (optional)
 *
 * Accepts friendly aliases and tolerates separators like "-", " ", etc.
 */
export function normalizeLeadMode(value?: string | null): LeadMode | undefined {
    if (!value) return undefined;

    const raw = value.trim().toLowerCase();
    if (!raw) return undefined;

    // Allow "auto"/"default" to mean "no override"
    if (raw === "auto" || raw === "default") return undefined;

    const v = raw.replace(/[\s-]+/g, "_");

    // Hard lock
    if (
        v === "hard_lock" ||
        v === "hard" ||
        v === "lock" ||
        v === "required" ||
        v === "require_email" ||
        v === "required_email" ||
        v === "email_required"
    ) {
        return "hard_lock";
    }

    // Soft lock
    if (
        v === "soft_lock" ||
        v === "soft" ||
        v === "optional" ||
        v === "optional_email" ||
        v === "email_optional"
    ) {
        return "soft_lock";
    }

    return undefined;
}

/**
 * Resolve the effective lead gating context for this request/session.
 *
 * Precedence:
 * 1) requested (query param override)
 * 2) cookie (optional override)
 * 3) config default
 *
 * LeadState:
 * - known if identity already available (auth or verified token)
 * - new otherwise
 */
export function resolveLeadGatingContext(params: {
    requested?: string | null;
    cookieValue?: string | null;
    isKnownLead: boolean;
}): { lead_mode: LeadMode; lead_state: LeadState } {
    const lead_state: LeadState = params.isKnownLead ? "known" : "new";

    // Only allow modes that exist in config (runtime safety).
    const allowed = new Set<LeadMode>(LEAD_GATING_CONFIG.lead_gating.modes);

    const requested = normalizeLeadMode(params.requested);
    const cookie = normalizeLeadMode(params.cookieValue);

    const pick = (m?: LeadMode): LeadMode | undefined => {
        if (!m) return undefined;
        return allowed.has(m) ? m : undefined;
    };

    const lead_mode: LeadMode =
        pick(requested) ||
        pick(cookie) ||
        LEAD_GATING_CONFIG.lead_gating.default_mode;

    return { lead_mode, lead_state };
}

/**
 * Convenience helper if a caller only wants the mode.
 * (UX should still use lead_state + config.known_lead_behavior to decide capture UI.)
 */
export function resolveLeadMode(params: {
    requested?: string | null;
    cookieValue?: string | null;
    isKnownLead: boolean;
}): LeadMode {
    return resolveLeadGatingContext(params).lead_mode;
}
