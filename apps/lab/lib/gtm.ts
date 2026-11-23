// frontend/lib/gtm.ts
"use client";

/**
 * GTM helper + event wrappers
 *
 * Keep existing generic tool events (tool_view/tool_start/lead_submit/cta_click)
 * and add Pinterest Potential Calculator vNext telemetry (ppc_*).
 */

export type GTMEventParams = Record<string, unknown>;

function getDataLayer(): Array<Record<string, unknown>> | null {
    if (typeof window === "undefined") return null;
    window.dataLayer ??= [];
    return window.dataLayer;
}

function getPathnameFallback(): string {
    if (typeof window === "undefined") return "";
    return window.location?.pathname ?? "";
}

export function pushEvent(eventName: string, params: GTMEventParams = {}): void {
    const dl = getDataLayer();
    if (!dl) return;
    dl.push({ event: eventName, ...params });
}

// -----------------------------------------------------------------------------
// Existing (keep)
// -----------------------------------------------------------------------------

export function trackToolView(tool_name: string, location: string): void {
    pushEvent("tool_view", { tool_name, location });
}

export function trackToolStart(tool_name: string, location: string): void {
    pushEvent("tool_start", { tool_name, location });
}

export function trackLeadSubmit(params: {
    location: string;
    button_label: string;
    tool_name?: string;
}): void {
    pushEvent("lead_submit", params);
}

export function trackCtaClick(
    button_label: string,
    extras?: { location?: string; tool_name?: string }
): void {
    const location = extras?.location ?? getPathnameFallback();
    pushEvent("cta_click", {
        button_label,
        location,
        ...(extras?.tool_name ? { tool_name: extras.tool_name } : {}),
    });
}

// -----------------------------------------------------------------------------
// Pinterest Potential Calculator vNext (ppc_*)
// -----------------------------------------------------------------------------

export type PPCVariant = "welcome" | "no_welcome";
export type PPCLeadMode = "hard_lock" | "soft_lock";
export type PPCLeadState = "known" | "new";

export type PPCQuestionId =
    | "Q1"
    | "Q2"
    | "Q3"
    | "Q4"
    | "Q5"
    | "Q6"
    | "Q7"
    | "Q8"
    | "WELCOME"
    | "RESULTS";

export type PPCIndexLevel = "low" | "medium" | "high";

// Common dimensions we’ll often attach (not mandatory for every event).
export type PPCContext = {
    tool_name?: "pinterest_potential"; // optional; useful for debugging/filters
    location?: string;

    variant?: PPCVariant;

    segment?: string; // content_creator | product_seller | service_provider
    niche?: string; // slug
    primary_goal?: string; // segment-specific
    lead_mode?: PPCLeadMode;
    lead_state?: PPCLeadState;

    seasonality_index?: PPCIndexLevel;
    competition_index?: PPCIndexLevel;
};

// `ppc_view_start` (welcome viewed OR Q1 viewed for no-welcome)
export function trackPpcViewStart(params: PPCContext & { screen?: "welcome" | "q1" }): void {
    pushEvent("ppc_view_start", {
        tool_name: params.tool_name ?? "pinterest_potential",
        location: params.location ?? getPathnameFallback(),
        screen: params.screen,
        variant: params.variant,
        lead_mode: params.lead_mode,
        lead_state: params.lead_state,
    });
}

// `ppc_start` (Start clicked OR first interaction on Q1)
export function trackPpcStart(params: PPCContext & { trigger?: "start_click" | "first_answer" }): void {
    pushEvent("ppc_start", {
        tool_name: params.tool_name ?? "pinterest_potential",
        location: params.location ?? getPathnameFallback(),
        trigger: params.trigger,
        variant: params.variant,
        lead_mode: params.lead_mode,
        lead_state: params.lead_state,
    });
}

// `ppc_answer` (question_id, answer_id)
export function trackPpcAnswer(params: PPCContext & {
    question_id: PPCQuestionId;
    answer_id: string | number | Array<string | number>;
}): void {
    pushEvent("ppc_answer", {
        tool_name: params.tool_name ?? "pinterest_potential",
        location: params.location ?? getPathnameFallback(),
        variant: params.variant,
        lead_mode: params.lead_mode,
        lead_state: params.lead_state,

        question_id: params.question_id,
        answer_id: params.answer_id,

        // Useful attribution (optional but recommended)
        segment: params.segment,
        niche: params.niche,
        primary_goal: params.primary_goal,
    });
}

// `ppc_complete` (results viewed)
export function trackPpcComplete(params: PPCContext & {
    // allow callers to pass through any extra dims without changing signature
    extras?: GTMEventParams;
}): void {
    pushEvent("ppc_complete", {
        tool_name: params.tool_name ?? "pinterest_potential",
        location: params.location ?? getPathnameFallback(),

        variant: params.variant,
        segment: params.segment,
        niche: params.niche,
        primary_goal: params.primary_goal,

        seasonality_index: params.seasonality_index,
        competition_index: params.competition_index,

        lead_mode: params.lead_mode,
        lead_state: params.lead_state,

        ...(params.extras ?? {}),
    });
}

// `ppc_cta_click` (book consult clicks)
export function trackPpcCtaClick(params: PPCContext & {
    button_label?: string; // default: Book consult CTA
    cta?: "book_consult" | string;
}): void {
    pushEvent("ppc_cta_click", {
        tool_name: params.tool_name ?? "pinterest_potential",
        location: params.location ?? getPathnameFallback(),

        button_label: params.button_label ?? "Book a free consult to unpack your results",
        cta: params.cta ?? "book_consult",

        variant: params.variant,
        segment: params.segment,
        niche: params.niche,
        primary_goal: params.primary_goal,

        seasonality_index: params.seasonality_index,
        competition_index: params.competition_index,

        lead_mode: params.lead_mode,
        lead_state: params.lead_state,
    });
}

// `ppc_lead_view` (lead gate viewed OR soft lock panel shown)
export function trackPpcLeadView(params: PPCContext & {
    mode: PPCLeadMode;
    surface: "hard_gate" | "soft_panel";
}): void {
    pushEvent("ppc_lead_view", {
        tool_name: params.tool_name ?? "pinterest_potential",
        location: params.location ?? getPathnameFallback(),

        mode: params.mode,
        surface: params.surface,

        variant: params.variant,
        segment: params.segment,
        niche: params.niche,
        primary_goal: params.primary_goal,

        lead_mode: params.lead_mode ?? params.mode,
        lead_state: params.lead_state,
    });
}

// `ppc_lead_submit` (email submitted)
export function trackPpcLeadSubmit(params: PPCContext & {
    mode: PPCLeadMode;
    surface: "hard_gate" | "soft_panel";
    email_provided: boolean; // always true for submit, but explicit
    name_provided?: boolean;
}): void {
    pushEvent("ppc_lead_submit", {
        tool_name: params.tool_name ?? "pinterest_potential",
        location: params.location ?? getPathnameFallback(),

        mode: params.mode,
        surface: params.surface,
        email_provided: params.email_provided,
        name_provided: params.name_provided ?? false,

        variant: params.variant,
        segment: params.segment,
        niche: params.niche,
        primary_goal: params.primary_goal,

        lead_mode: params.lead_mode ?? params.mode,
        lead_state: params.lead_state,
    });
}

// Optional: `ppc_lead_skip` (soft lock user dismisses/continues without email)
export function trackPpcLeadSkip(params: PPCContext & {
    surface: "soft_panel";
}): void {
    pushEvent("ppc_lead_skip", {
        tool_name: params.tool_name ?? "pinterest_potential",
        location: params.location ?? getPathnameFallback(),

        surface: params.surface,

        variant: params.variant,
        segment: params.segment,
        niche: params.niche,
        primary_goal: params.primary_goal,

        lead_mode: params.lead_mode,
        lead_state: params.lead_state,
    });
}

// Optional: `ppc_back`
export function trackPpcBack(params: PPCContext & { question_id: PPCQuestionId }): void {
    pushEvent("ppc_back", {
        tool_name: params.tool_name ?? "pinterest_potential",
        location: params.location ?? getPathnameFallback(),
        question_id: params.question_id,
        variant: params.variant,
        segment: params.segment,
        niche: params.niche,
        primary_goal: params.primary_goal,
        lead_mode: params.lead_mode,
        lead_state: params.lead_state,
    });
}