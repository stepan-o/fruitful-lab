// frontend/lib/tools/pinterestPotential/resultsUiAdapter.ts
/**
 * Pinterest Potential — Results → UI Adapter
 *
 * v1.2 strict alignment:
 * - Consumes compute.ts ResultsBundle (sessions-based demand).
 * - Snapshot (demand preview + indices + notes/tags) comes from getNicheBenchmarkUi(segment,niche).
 * - Result 1–3 wiring (strict):
 *    Result 1: demand.demand_base_sessions_est
 *    Result 2: traffic.website_sessions_est (default) OR traffic.purchase_intent_sessions_est (product_seller + goal=sales)
 *    Result 3: segment_outcome.goal_outcome (goal-specific; never blank)
 *
 * Hard rules:
 * - NO fallbacks, NO backwards compatibility, NO "helpful flexibility".
 * - Fail loud on drift/mismatch (segment/niche mismatch, invalid ranges, unexpected outcome shapes).
 *
 * Forbidden:
 * - Importing React/UI components
 * - Importing icon components
 */

import type { Range, IndexLevel } from "./benchmarks";
import type { NicheSlug, Segment } from "./pinterestPotentialSpec";
import { makeGoalKey } from "./pinterestPotentialSpec";
import { getNicheBenchmarkUi } from "./nicheUiAdapter";
import type { ResultsBundle, SegmentOutcome } from "./compute";

// ---------------------------
// UI model
// ---------------------------

export type ResultCardUi = {
    id: string;
    title: string;
    value: string; // formatted range string
    unitLabel: string;
    range: Range;
    helper?: string;
    emphasis?: "primary" | "neutral";
};

export type IndexPillUi = {
    id: "seasonality" | "competition";
    level: IndexLevel;
    label: string;
    helper?: string;
};

export type ResultsScenarioUi = {
    id: string;
    label: string;
    cards: ResultCardUi[];
};

export type NicheSnapshotUi = {
    segment: Segment;
    niche: NicheSlug;

    demand_base_sessions: Range;
    income: Range;

    pills: IndexPillUi[];
    tags?: string[];

    demand_preview: {
        level: string;
        badgeLabel: string;
        helperCopy: string;
    };
};

export type ResultsUiModel = {
    snapshot: NicheSnapshotUi;
    scenarios: ResultsScenarioUi[];
    footnotes: string[];
    insightLine?: string | null;
    debugNotes?: string[];
};

// ---------------------------
// Fail-loud helpers
// ---------------------------

function invariant(cond: unknown, msg: string): asserts cond {
    if (!cond) throw new Error(`[ppc.resultsUiAdapter] ${msg}`);
}

function assertFiniteNumber(v: unknown, name: string): number {
    invariant(typeof v === "number" && Number.isFinite(v), `${name} must be a finite number`);
    return v;
}

function assertRange(r: Range, name: string): Range {
    invariant(typeof r === "object" && r !== null, `${name} missing`);
    invariant(typeof r.low === "number" && typeof r.high === "number", `${name} must be numbers`);
    invariant(Number.isFinite(r.low) && Number.isFinite(r.high), `${name} must be finite`);
    invariant(r.low >= 0 && r.high >= 0, `${name} must be >= 0`);
    invariant(r.low <= r.high, `${name} low must be <= high`);
    return r;
}

function assertSameRange(a: Range, b: Range, label: string) {
    if (a.low !== b.low || a.high !== b.high) {
        throw new Error(
            `[ppc.resultsUiAdapter] Range mismatch (${label}): snapshot=${a.low}-${a.high} compute=${b.low}-${b.high}`
        );
    }
}

function formatCompactInt(n: number): string {
    const abs = Math.abs(n);
    if (abs < 1000) return String(Math.round(n));

    const units: Array<{ v: number; s: string }> = [
        { v: 1_000_000_000, s: "B" },
        { v: 1_000_000, s: "M" },
        { v: 1_000, s: "k" },
    ];

    for (const u of units) {
        if (abs >= u.v) {
            const val = n / u.v;
            const rounded = abs >= 10 * u.v ? Math.round(val) : Math.round(val * 10) / 10;
            return `${rounded}${u.s}`;
        }
    }
    return String(Math.round(n));
}

function formatUsd(n: number): string {
    return `$${formatCompactInt(n)}`;
}

function formatRangeInt(r: Range): string {
    const low = Math.round(r.low);
    const high = Math.round(r.high);
    if (low === high) return formatCompactInt(low);
    return `${formatCompactInt(low)}–${formatCompactInt(high)}`;
}

function formatRangeUsd(r: Range): string {
    const low = Math.round(r.low);
    const high = Math.round(r.high);
    if (low === high) return formatUsd(low);
    return `${formatUsd(low)}–${formatUsd(high)}`;
}

function pickPrimaryCard(cards: ResultCardUi[]): { primary: ResultCardUi; rest: ResultCardUi[] } {
    invariant(cards.length > 0, "Outcome cards must not be empty");

    const primaryIdx = Math.max(
        0,
        cards.findIndex((c) => c.emphasis === "primary")
    );

    const primary = cards[primaryIdx] ?? cards[0];
    const rest: ResultCardUi[] = [];

    for (let i = 0; i < cards.length; i++) {
        if (i === primaryIdx) continue;
        rest.push(cards[i]);
    }

    return { primary, rest };
}

// ---------------------------
// Outcome → cards (v1.2)
// ---------------------------

function outcomeCards(out: SegmentOutcome): ResultCardUi[] {
    if (out.kind === "content_creator") {
        const g = out.goal_outcome;

        if (g.kind === "traffic") {
            const r = assertRange(g.monthly_email_subscribers_est, "cc.monthly_email_subscribers_est");
            return [
                {
                    id: "cc_email_subscribers",
                    title: "Monthly email subscribers",
                    value: formatRangeInt(r),
                    unitLabel: "per month",
                    range: r,
                    helper: g.note,
                    emphasis: "primary",
                },
            ];
        }

        if (g.kind === "email_subscribers") {
            const r = assertRange(g.monthly_email_subscribers_est, "cc.monthly_email_subscribers_est");
            return [
                {
                    id: "cc_email_subscribers",
                    title: "Monthly email subscribers",
                    value: formatRangeInt(r),
                    unitLabel: "per month",
                    range: r,
                    helper: "Subscribers captured from Pinterest-driven sessions.",
                    emphasis: "primary",
                },
            ];
        }

        if (g.kind === "affiliate_revenue") {
            const r = assertRange(g.monthly_affiliate_revenue_usd_est, "cc.monthly_affiliate_revenue_usd_est");
            return [
                {
                    id: "cc_affiliate_revenue",
                    title: "Monthly affiliate revenue (modeled)",
                    value: formatRangeUsd(r),
                    unitLabel: "per month",
                    range: r,
                    helper: "Modeled via RPM assumptions (not a guarantee).",
                    emphasis: "primary",
                },
            ];
        }

        if (g.kind === "course_product_sales") {
            const intent = assertRange(g.monthly_course_intent_sessions_est, "cc.monthly_course_intent_sessions_est");

            const cards: ResultCardUi[] = [
                {
                    id: "cc_course_intent_sessions",
                    title: "Monthly course-intent sessions",
                    value: formatRangeInt(intent),
                    unitLabel: "sessions/mo",
                    range: intent,
                    helper: "Subset of Pinterest sessions with higher purchase intent for your offer.",
                    emphasis: "neutral",
                },
            ];

            invariant(out.assumptions.kind === "course_product_sales", "Assumptions.kind drift for content_creator:course_product_sales");
            for (const b of out.assumptions.course_price_buckets) {
                const r = g.revenue_by_course_price_est[b.id];
                invariant(!!r, `Missing revenue_by_course_price_est for bucket ${b.id}`);

                const rr = assertRange(r, `cc.revenue_by_course_price_est.${b.id}`);
                cards.push({
                    id: `cc_course_revenue_${b.id}`,
                    title: `Course revenue (price: ${b.label})`,
                    value: formatRangeUsd(rr),
                    unitLabel: "per month",
                    range: rr,
                    helper: "Modeled from enroll-rate assumptions by price bucket.",
                    emphasis: "primary",
                });
            }

            return cards;
        }

        // Exhaustive guard
        const k = String((g as unknown as { kind?: unknown }).kind);
        throw new Error(`[ppc.resultsUiAdapter] Unexpected content_creator goal_outcome.kind: ${k}`);
    }

    if (out.kind === "product_seller") {
        const g = out.goal_outcome;

        if (g.kind === "email_subscribers") {
            const r = assertRange(g.monthly_email_subscribers_est, "ps.monthly_email_subscribers_est");
            return [
                {
                    id: "ps_email_subscribers",
                    title: "Monthly email subscribers",
                    value: formatRangeInt(r),
                    unitLabel: "per month",
                    range: r,
                    helper: "Subscribers captured from Pinterest-driven sessions.",
                    emphasis: "primary",
                },
            ];
        }

        if (g.kind === "retargeting_pool") {
            const r = assertRange(g.monthly_retargetable_visitors_est, "ps.monthly_retargetable_visitors_est");
            return [
                {
                    id: "ps_retargeting_pool",
                    title: "Monthly retargetable visitors",
                    value: formatRangeInt(r),
                    unitLabel: "per month",
                    range: r,
                    helper: "Estimated visitors you can build into a retargeting audience.",
                    emphasis: "primary",
                },
            ];
        }

        if (g.kind === "new_customer_discovery") {
            const r = assertRange(g.monthly_new_to_brand_sessions_est, "ps.monthly_new_to_brand_sessions_est");
            return [
                {
                    id: "ps_new_to_brand",
                    title: "Monthly new-to-brand sessions",
                    value: formatRangeInt(r),
                    unitLabel: "sessions/mo",
                    range: r,
                    helper: "Estimated sessions from users less likely to already know your brand.",
                    emphasis: "primary",
                },
            ];
        }

        if (g.kind === "sales") {
            invariant(out.assumptions.kind === "sales", "Assumptions.kind drift for product_seller:sales");

            const cards: ResultCardUi[] = [];
            for (const b of out.assumptions.aov_buckets) {
                const r = g.revenue_by_aov_est[b.id];
                invariant(!!r, `Missing revenue_by_aov_est for bucket ${b.id}`);

                const rr = assertRange(r, `ps.revenue_by_aov_est.${b.id}`);
                cards.push({
                    id: `ps_revenue_${b.id}`,
                    title: `Monthly revenue (AOV: ${b.label})`,
                    value: formatRangeUsd(rr),
                    unitLabel: "per month",
                    range: rr,
                    helper: "Modeled from purchase-intent sessions × conversion-rate × AOV bucket.",
                    emphasis: "primary",
                });
            }

            invariant(cards.length > 0, "product_seller:sales must produce at least one revenue bucket card");
            return cards;
        }

        const k = String((g as unknown as { kind?: unknown }).kind);
        throw new Error(`[ppc.resultsUiAdapter] Unexpected product_seller goal_outcome.kind: ${k}`);
    }

    // service_provider
    if (out.kind === "service_provider") {
        const g = out.goal_outcome;

        if (g.kind === "leads_calls") {
            const r = assertRange(g.monthly_discovery_calls_est, "sp.monthly_discovery_calls_est");
            return [
                {
                    id: "sp_calls",
                    title: "Monthly discovery calls (modeled)",
                    value: formatRangeInt(r),
                    unitLabel: "per month",
                    range: r,
                    helper: "Modeled from sessions × booking-rate assumptions (not a guarantee).",
                    emphasis: "primary",
                },
            ];
        }

        if (g.kind === "email_subscribers") {
            const r = assertRange(g.monthly_email_subscribers_est, "sp.monthly_email_subscribers_est");
            return [
                {
                    id: "sp_email_subscribers",
                    title: "Monthly email subscribers",
                    value: formatRangeInt(r),
                    unitLabel: "per month",
                    range: r,
                    helper: "Subscribers captured from Pinterest-driven sessions.",
                    emphasis: "primary",
                },
            ];
        }

        if (g.kind === "webinar_signups") {
            const r = assertRange(g.monthly_webinar_signups_est, "sp.monthly_webinar_signups_est");
            return [
                {
                    id: "sp_webinar_signups",
                    title: "Monthly webinar signups (modeled)",
                    value: formatRangeInt(r),
                    unitLabel: "per month",
                    range: r,
                    helper: "Modeled from sessions × signup-rate assumptions (not a guarantee).",
                    emphasis: "primary",
                },
            ];
        }

        if (g.kind === "authority_visibility") {
            const r = assertRange(g.monthly_visibility_reach_est, "sp.monthly_visibility_reach_est");
            return [
                {
                    id: "sp_visibility_reach",
                    title: "Monthly visibility reach (modeled)",
                    value: formatRangeInt(r),
                    unitLabel: "people/mo",
                    range: r,
                    helper: "Modeled as reach per session (not a guarantee).",
                    emphasis: "primary",
                },
            ];
        }

        const k = String((g as unknown as { kind?: unknown }).kind);
        throw new Error(`[ppc.resultsUiAdapter] Unexpected service_provider goal_outcome.kind: ${k}`);
    }

    const k = String((out as unknown as { kind?: unknown }).kind);
    throw new Error(`[ppc.resultsUiAdapter] Unexpected segment_outcome.kind: ${k}`);
}

// ---------------------------
// Result 1–3 wiring (strict)
// ---------------------------

function buildResult1DemandCard(results: ResultsBundle): ResultCardUi {
    const r = assertRange(results.demand.demand_base_sessions_est, "results.demand.demand_base_sessions_est");
    return {
        id: "result_1_demand",
        title: "Monthly demand in your niche (US+CA)",
        value: formatRangeInt(r),
        unitLabel: "sessions/mo",
        range: r,
        helper: "General niche demand ceiling for your segment + niche.",
        emphasis: "neutral",
    };
}

function buildTrafficCardsStrict(args: {
    segment: Segment;
    results: ResultsBundle;
}): { result2: ResultCardUi; supporting?: ResultCardUi } {
    const { segment, results } = args;

    // Strict non-duplication guard: traffic.website_sessions_est MUST mirror demand.likely_pinterest_sessions_est.
    assertSameRange(
        assertRange(results.demand.likely_pinterest_sessions_est, "results.demand.likely_pinterest_sessions_est"),
        assertRange(results.traffic.website_sessions_est, "results.traffic.website_sessions_est"),
        "traffic.website_sessions_est must equal demand.likely_pinterest_sessions_est"
    );

    const distributionM = assertFiniteNumber(results.demand.distribution_capacity_m, "results.demand.distribution_capacity_m");

    const websiteRange = assertRange(results.traffic.website_sessions_est, "results.traffic.website_sessions_est");
    const websiteCard: ResultCardUi = {
        id: "traffic_website_sessions",
        title: "Website sessions from Pinterest",
        value: formatRangeInt(websiteRange),
        unitLabel: "sessions/mo",
        range: websiteRange,
        helper: `Includes your distribution capacity (x${distributionM.toFixed(2)}).`,
        emphasis: "primary",
    };

    // purchase_intent_sessions_est is only valid for product_seller (compute enforces "at minimum").
    const purchase = results.traffic.purchase_intent_sessions_est;

    if (segment !== "product_seller") {
        invariant(
            purchase === undefined,
            `traffic.purchase_intent_sessions_est must be absent for segment=${segment}`
        );
        return { result2: websiteCard };
    }

    invariant(
        purchase !== undefined,
        "traffic.purchase_intent_sessions_est must be present for product_seller"
    );

    const purchaseRange = assertRange(purchase, "results.traffic.purchase_intent_sessions_est");
    const purchaseCard: ResultCardUi = {
        id: "traffic_purchase_intent_sessions",
        title: "High-intent product sessions (lens)",
        value: formatRangeInt(purchaseRange),
        unitLabel: "sessions/mo",
        range: purchaseRange,
        helper: "Subset of sessions with higher buying intent (modeled).",
        emphasis: "neutral",
    };

    // Result 2 rule (strict):
    // - Default: website sessions
    // - product_seller + goal=sales: use purchase intent sessions as Result 2
    invariant(
        results.segment_outcome.kind === "product_seller",
        `segment_outcome.kind mismatch for segment=product_seller: got ${String(
            (results.segment_outcome as unknown as { kind?: unknown }).kind
        )}`
    );

    if (results.segment_outcome.primary_goal === "sales") {
        return {
            result2: {
                ...purchaseCard,
                id: "result_2_purchase_intent_sessions",
                title: "High-intent sessions to product pages",
                emphasis: "primary",
            },
            supporting: {
                ...websiteCard,
                id: "supporting_traffic_website_sessions",
                emphasis: "neutral",
            },
        };
    }

    // Non-sales product_seller goals: website sessions remains Result 2, purchase-intent remains supporting context.
    return {
        result2: {
            ...websiteCard,
            id: "result_2_website_sessions",
        },
        supporting: {
            ...purchaseCard,
            id: "supporting_purchase_intent_sessions",
        },
    };
}

function buildResult3OutcomeCardsStrict(args: {
    segment: Segment;
    results: ResultsBundle;
}): { result3: ResultCardUi; supporting: ResultCardUi[] } {
    const { segment, results } = args;

    // Strict segment drift guard.
    invariant(
        results.segment_outcome.kind === segment,
        `segment_outcome.kind mismatch: expected=${segment} got=${String(
            (results.segment_outcome as unknown as { kind?: unknown }).kind
        )}`
    );

    // Strict goal_key drift guard: goal_key MUST match makeGoalKey(segment, primary_goal).
    let expectedKey: string;
    try {
        expectedKey = makeGoalKey(segment, results.segment_outcome.primary_goal);
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`[ppc.resultsUiAdapter] Spec contract error while rebuilding goal_key: ${msg}`);
    }

    invariant(
        results.segment_outcome.goal_key === expectedKey,
        `goal_key mismatch: expected=${expectedKey} got=${results.segment_outcome.goal_key}`
    );

    const all = outcomeCards(results.segment_outcome);
    const { primary, rest } = pickPrimaryCard(all);

    // Result 3 must always exist and be goal-specific (primary card chosen from goal outcome cards).
    return {
        result3: {
            ...primary,
            id: `result_3_${primary.id}`,
        },
        supporting: rest.map((c) => ({
            ...c,
            id: `supporting_${c.id}`,
        })),
    };
}

// ---------------------------
// Public API
// ---------------------------

export function buildResultsUiModel(args: {
    segment: Segment;
    niche: NicheSlug;
    results: ResultsBundle;
    debugNotes?: string[];
}): ResultsUiModel {
    const { segment, niche, results } = args;

    // Snapshot comes from benchmarks adapter (canonical for demand preview + indices).
    const snap = getNicheBenchmarkUi(segment, niche);

    // Drift guards: ensure caller passed the correct segment+niche for these results.
    assertSameRange(
        assertRange(snap.demand_base_sessions, "snapshot.demand_base_sessions"),
        assertRange(results.demand.demand_base_sessions_est, "results.demand.demand_base_sessions_est"),
        "demand_base_sessions"
    );

    assertSameRange(
        assertRange(snap.income, "snapshot.income"),
        assertRange(results.demographics.household_income_usd, "results.demographics.household_income_usd"),
        "income"
    );

    invariant(
        snap.inferred.seasonality === results.inferred.seasonality_index,
        `Seasonality mismatch: snapshot=${snap.inferred.seasonality} compute=${results.inferred.seasonality_index}`
    );

    invariant(
        snap.inferred.competition === results.inferred.competition_index,
        `Competition mismatch: snapshot=${snap.inferred.competition} compute=${results.inferred.competition_index}`
    );

    // Validate key multipliers are finite numbers (strict).
    assertFiniteNumber(results.demand.distribution_capacity_m, "results.demand.distribution_capacity_m");
    assertFiniteNumber(results.demand.conversion_readiness_m, "results.demand.conversion_readiness_m");

    const pills: IndexPillUi[] = [
        {
            id: "seasonality",
            level: snap.inferred.seasonality,
            label: "Seasonality",
            helper: snap.inferred.notes?.seasonality,
        },
        {
            id: "competition",
            level: snap.inferred.competition,
            label: "Competition",
            helper: snap.inferred.notes?.competition,
        },
    ];

    const snapshot: NicheSnapshotUi = {
        segment,
        niche,
        demand_base_sessions: snap.demand_base_sessions,
        income: snap.income,
        pills,
        tags: snap.inferred.tags,
        demand_preview: {
            level: snap.demand_preview.level,
            badgeLabel: snap.demand_preview.badgeLabel,
            helperCopy: snap.demand_preview.helperCopy,
        },
    };

    // ---------------------------
    // Result 1–3 (strict ordering)
    // ---------------------------
    const result1 = buildResult1DemandCard(results);

    const trafficCards = buildTrafficCardsStrict({ segment, results });
    const result2 = trafficCards.result2;
    const trafficSupporting = trafficCards.supporting ? [trafficCards.supporting] : [];

    const outcomeSplit = buildResult3OutcomeCardsStrict({ segment, results });
    const result3 = outcomeSplit.result3;
    const outcomeSupporting = outcomeSplit.supporting;

    // Cards are ordered so the first three are always Result 1–3.
    const cards: ResultCardUi[] = [result1, result2, result3, ...trafficSupporting, ...outcomeSupporting];

    const scenarios: ResultsScenarioUi[] = [
        {
            id: "expected",
            label: "Expected",
            cards,
        },
    ];

    const footnotes: string[] = [
        "All values are ranges per month (not guarantees).",
        `Conversion readiness multiplier: x${results.demand.conversion_readiness_m.toFixed(2)} (site + offer).`,
        "Demand preview + indices are benchmark-derived; Result 3 is goal-model driven.",
    ];

    return {
        snapshot,
        scenarios,
        footnotes,
        insightLine: results.insight_line ?? null,
        debugNotes: args.debugNotes,
    };
}
