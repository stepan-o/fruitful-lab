// frontend/lib/tools/pinterestPotential/compute.ts
/**
 * v1.2 (Locked) — Canonical compute engine (config-driven, range outputs)
 *
 * STRICT CONTRACT (breaking; NO back-compat, NO defaults, NO fallbacks):
 *
 * 1) Demand is modeled in SESSIONS (not users).
 *    - demand_base_sessions_est (MACRO):
 *        Comes directly from benchmarks.ts (segment+niche slice of US+CA demand).
 *        No execution multipliers are applied to this number.
 *
 *    - distribution_capacity_m (MICRO):
 *        A single multiplier derived from Q3/Q4/Q8 + inferred indices (seasonality/competition)
 *        + explicit goal micro-adjust (keyed by GoalKey; no defaults).
 *
 *    - likely_pinterest_sessions_est (FINAL):
 *        demand_base_sessions_est * distribution_capacity_m
 *
 * 2) Post-click outcomes use a separate micro layer:
 *    - conversion_readiness_m (MICRO):
 *        Derived from Q5/Q6 (site experience + offer clarity).
 *
 * 3) Results bundles (v1.2):
 *    - results.demand: shared (Result 1), canonical sessions source is likely_pinterest_sessions_est
 *    - results.traffic: shared (Result 2), includes optional purchase_intent_sessions_est
 *    - results.segment_outcome: goal-driven for ALL segments, keyed by GoalKey (Result 3)
 *
 * 4) Goal outcomes:
 *    - Compute MUST treat GOAL_OUTCOME_MODEL as the ONLY source of truth for goal-driven outcomes.
 *    - Q7 is now enforced for product_seller + service_provider (no ignored goals).
 *    - Special case: content_creator + goal "traffic" still outputs email subscribers for Result 3
 *      (traffic itself is Result 2; Result 3 is list growth potential).
 *
 * Hard rules:
 * - 0 fallbacks, 0 defaults, 0 optional imports.
 * - Missing config must fail immediately (compile-time preferred; runtime only for dynamic keys).
 * - Lead gating is NOT handled here.
 */

import type { Answers, GoalKey, PrimaryGoal } from "./pinterestPotentialSpec";
import { makeGoalKey, validateAnswers } from "./pinterestPotentialSpec";
import { getBenchmark, type IndexLevel, type Range } from "./benchmarks";
import { buildInsightFromBenchmark } from "./insight";

import {
    COURSE_ENROLL_RATE_BY_PRICE,
    COURSE_PRICE_BUCKETS,
    GOAL_OUTCOME_MODEL,
    MULTIPLIERS,
    type AovBucket,
    type CoursePriceBucket,
    type GoalOutcomeAssumptionV2,
    type Range01,
} from "./multipliers";

export type DemandBundle = {
    /** Macro: niche demand slice in SESSIONS/month (no execution applied). */
    demand_base_sessions_est: Range;

    /** Micro: execution/distribution capacity derived from Q3/Q4/Q8 + inferred indices + goal micro-adjust. */
    distribution_capacity_m: number;

    /** Micro: post-click readiness derived from Q5/Q6. */
    conversion_readiness_m: number;

    /** Final: your likely Pinterest sessions (macro * distribution capacity). */
    likely_pinterest_sessions_est: Range;
};

export type TrafficBundle = {
    /**
     * Canonical "website sessions from Pinterest" number.
     * MUST mirror demand.likely_pinterest_sessions_est (no duplicate computation).
     */
    website_sessions_est: Range;

    /**
     * Optional traffic lens:
     * Present when relevant (at minimum: product_seller).
     * Used as Result 2 for product_seller + goal "sales".
     */
    purchase_intent_sessions_est?: Range;
};

// -------------------------------------
// v1.2 goal outcomes (Result 3)
// -------------------------------------

export type ContentCreatorGoalOutcomeV2 =
    | {
    kind: "traffic";
    /**
     * v1.2 special-case:
     * Primary goal is traffic, but Result 2 already shows sessions.
     * Result 3 must NOT be blank, so we show list growth potential here.
     */
    monthly_email_subscribers_est: Range;
    note: string;
}
    | {
    kind: "email_subscribers";
    monthly_email_subscribers_est: Range;
}
    | {
    kind: "affiliate_revenue";
    monthly_affiliate_revenue_usd_est: Range;
}
    | {
    kind: "course_product_sales";
    monthly_course_intent_sessions_est: Range;
    revenue_by_course_price_est: Record<CoursePriceBucket, Range>;
};

export type ProductSellerGoalOutcomeV2 =
    | {
    kind: "sales";
    revenue_by_aov_est: Record<AovBucket, Range>;
}
    | {
    kind: "email_subscribers";
    monthly_email_subscribers_est: Range;
}
    | {
    kind: "retargeting_pool";
    monthly_retargetable_visitors_est: Range;
}
    | {
    kind: "new_customer_discovery";
    monthly_new_to_brand_sessions_est: Range;
};

export type ServiceProviderGoalOutcomeV2 =
    | {
    kind: "leads_calls";
    monthly_discovery_calls_est: Range;
}
    | {
    kind: "email_subscribers";
    monthly_email_subscribers_est: Range;
}
    | {
    kind: "webinar_signups";
    monthly_webinar_signups_est: Range;
}
    | {
    kind: "authority_visibility";
    monthly_visibility_reach_est: Range;
};

// -------------------------------------
// v1.2 explainability (goal-specific)
// -------------------------------------

type ContentCreatorAssumptionsV2 =
    | {
    kind: "traffic" | "email_subscribers";
    optin_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "affiliate_revenue";
    rpm_usd: Range;
    conversion_readiness_m: number;
}
    | {
    kind: "course_product_sales";
    course_intent_share_of_sessions: Range01;
    enroll_rate_by_price: Record<CoursePriceBucket, Range01>;
    course_price_buckets: ReadonlyArray<{ id: CoursePriceBucket; label: string; low: number; high: number }>;
    conversion_readiness_m: number;
};

type ProductSellerAssumptionsV2 =
    | {
    kind: "sales";
    purchase_intent_share_of_sessions: Range01;
    ecommerce_cr_by_aov: Record<AovBucket, Range01>;
    aov_buckets: ReadonlyArray<{ id: AovBucket; label: string; low: number; high: number }>;
    conversion_readiness_m: number;
}
    | {
    kind: "email_subscribers";
    optin_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "retargeting_pool";
    retargetable_share_of_sessions: Range01;
}
    | {
    kind: "new_customer_discovery";
    new_to_brand_share_of_sessions: Range01;
};

type ServiceProviderAssumptionsV2 =
    | {
    kind: "leads_calls";
    call_book_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "email_subscribers";
    optin_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "webinar_signups";
    webinar_signup_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "authority_visibility";
    visibility_reach_per_session: Range;
};

export type SegmentOutcome =
    | {
    kind: "content_creator";
    goal_key: GoalKey;
    primary_goal: PrimaryGoal;
    goal_outcome: ContentCreatorGoalOutcomeV2;
    assumptions: ContentCreatorAssumptionsV2;
}
    | {
    kind: "product_seller";
    goal_key: GoalKey;
    primary_goal: PrimaryGoal;
    goal_outcome: ProductSellerGoalOutcomeV2;
    assumptions: ProductSellerAssumptionsV2;
}
    | {
    kind: "service_provider";
    goal_key: GoalKey;
    primary_goal: PrimaryGoal;
    goal_outcome: ServiceProviderGoalOutcomeV2;
    assumptions: ServiceProviderAssumptionsV2;
};

export type ResultsBundle = {
    demand: DemandBundle;

    traffic: TrafficBundle;

    segment_outcome: SegmentOutcome;

    /** Non-niche-specific demographic context (benchmark-driven). */
    demographics: {
        household_income_usd: Range;
        notes?: string[];
    };

    inferred: {
        seasonality_index: "low" | "medium" | "high";
        competition_index: "low" | "medium" | "high";
        tags?: string[];
    };

    insight_line?: string | null;
};

type ComputeOk = { ok: true; results: ResultsBundle };
type ComputeErr = { ok: false; errors: Record<string, string> };
export type ComputeResult = ComputeOk | ComputeErr;

// -----------------------------
// Helpers (fail-loud + ranges)
// -----------------------------

function roundInt(n: number): number {
    return Math.round(n);
}

function applyRange(r: Range, m: number): Range {
    return { low: roundInt(r.low * m), high: roundInt(r.high * m) };
}

function applyRate(r: Range, rate: Range01): Range {
    return { low: roundInt(r.low * rate.low), high: roundInt(r.high * rate.high) };
}

function applyRateAndScalar(r: Range, rate: Range01, scalar: number): Range {
    return { low: roundInt(r.low * rate.low * scalar), high: roundInt(r.high * rate.high * scalar) };
}

function mustFiniteNumber(v: unknown, label: string): number {
    if (typeof v !== "number" || !Number.isFinite(v)) {
        throw new Error(`Compute config error: ${label} must be a finite number, got ${String(v)}`);
    }
    return v;
}

function mulAll(values: Array<{ v: unknown; label: string }>): number {
    return values.reduce((acc, { v, label }) => acc * mustFiniteNumber(v, label), 1.0);
}

function mustGetRecordValue<V>(rec: Record<string, V>, key: string, label: string): V {
    if (!(key in rec)) {
        throw new Error(`Compute config error: Missing ${label} for key "${key}"`);
    }
    return rec[key] as V;
}

function mustGoalOutcomeModelEntry(goalKey: GoalKey): GoalOutcomeAssumptionV2 {
    if (!(goalKey in GOAL_OUTCOME_MODEL)) {
        throw new Error(`Compute config error: Missing GOAL_OUTCOME_MODEL entry for key "${goalKey}"`);
    }
    return GOAL_OUTCOME_MODEL[goalKey];
}

// -----------------------------
// Core multiplier logic (NO CLAMPS / NO DEFAULTS)
// -----------------------------

function mustGoalKey(a: Required<Answers>): GoalKey {
    // v1.2 strict contract: GoalKey formation is locked to the spec helper.
    const k = makeGoalKey(a.Q1, a.Q7);

    // Fail loud if spec/multipliers drift.
    if (!(k in MULTIPLIERS.goal_micro_adjust)) {
        throw new Error(`Missing goal micro-adjust for key "${k}"`);
    }
    if (!(k in GOAL_OUTCOME_MODEL)) {
        throw new Error(`Missing goal outcome model for key "${k}"`);
    }
    return k;
}

/**
 * distribution_capacity_m (MICRO)
 * - Q3 (volume) * Q4 (visual strength) * Q8 (growth mode)
 * - lightly adjusted by inferred indices (seasonality/competition)
 * - explicitly adjusted by goal_micro_adjust (explicit keys only)
 */
function computeDistributionCapacityMultiplier(
    a: Required<Answers>,
    inferred: { seasonality: IndexLevel; competition: IndexLevel }
): number {
    const goalKey = mustGoalKey(a);
    const goalMicro = MULTIPLIERS.goal_micro_adjust[goalKey];

    return mulAll([
        { v: MULTIPLIERS.volume_bucket[a.Q3], label: `MULTIPLIERS.volume_bucket[${a.Q3}]` },
        { v: MULTIPLIERS.visual_strength[a.Q4], label: `MULTIPLIERS.visual_strength[${a.Q4}]` },
        { v: MULTIPLIERS.growth_mode[a.Q8], label: `MULTIPLIERS.growth_mode[${a.Q8}]` },
        { v: MULTIPLIERS.seasonality[inferred.seasonality], label: `MULTIPLIERS.seasonality[${inferred.seasonality}]` },
        { v: MULTIPLIERS.competition[inferred.competition], label: `MULTIPLIERS.competition[${inferred.competition}]` },
        { v: goalMicro, label: `MULTIPLIERS.goal_micro_adjust[${goalKey}]` },
    ]);
}

/**
 * conversion_readiness_m (MICRO)
 * - Q5 (site experience) * Q6 (offer clarity)
 */
function computeConversionReadinessMultiplier(a: Required<Answers>): number {
    return mulAll([
        { v: MULTIPLIERS.site_experience[a.Q5], label: `MULTIPLIERS.site_experience[${a.Q5}]` },
        { v: MULTIPLIERS.offer_clarity[a.Q6], label: `MULTIPLIERS.offer_clarity[${a.Q6}]` },
    ]);
}

// -----------------------------
// Goal outcome computations (v1.2; strict; GOAL_OUTCOME_MODEL-only)
// -----------------------------

function computeRevenueByAov(
    purchaseIntentSessions: Range,
    conversionReadinessM: number,
    conversionRateByAov: Record<AovBucket, Range01>,
    aovBuckets: ReadonlyArray<{ id: AovBucket; label: string; low: number; high: number }>
): Record<AovBucket, Range> {
    const out = {} as Record<AovBucket, Range>;

    for (const bucket of aovBuckets) {
        const id = bucket.id;

        const cr = mustGetRecordValue(
            conversionRateByAov as unknown as Record<string, Range01>,
            id,
            "conversion_rate_by_aov"
        );

        // Low = low sessions * low CR * conversion readiness * low AOV
        const low = purchaseIntentSessions.low * cr.low * conversionReadinessM * bucket.low;

        // High = high sessions * high CR * conversion readiness * high AOV
        const high = purchaseIntentSessions.high * cr.high * conversionReadinessM * bucket.high;

        out[id] = { low: roundInt(low), high: roundInt(high) };
    }

    return out;
}

function computeCourseRevenueByPrice(
    courseIntentSessions: Range,
    conversionReadinessM: number
): Record<CoursePriceBucket, Range> {
    const out = {} as Record<CoursePriceBucket, Range>;

    for (const bucket of COURSE_PRICE_BUCKETS) {
        const id = bucket.id;

        const enroll = mustGetRecordValue(
            COURSE_ENROLL_RATE_BY_PRICE as unknown as Record<string, Range01>,
            id,
            "COURSE_ENROLL_RATE_BY_PRICE"
        );

        // Low = low sessions * low enroll rate * conversion readiness * low price
        const low = courseIntentSessions.low * enroll.low * conversionReadinessM * bucket.low;

        // High = high sessions * high enroll rate * conversion readiness * high price
        const high = courseIntentSessions.high * enroll.high * conversionReadinessM * bucket.high;

        out[id] = { low: roundInt(low), high: roundInt(high) };
    }

    return out;
}

function computeContentCreatorOutcomeBundle(
    goalKey: GoalKey,
    likelyPinterestSessions: Range,
    conversionReadinessM: number
): { goal_outcome: ContentCreatorGoalOutcomeV2; assumptions: ContentCreatorAssumptionsV2 } {
    const model = mustGoalOutcomeModelEntry(goalKey);

    if (model.kind === "traffic") {
        const monthly_email_subscribers_est = applyRateAndScalar(
            likelyPinterestSessions,
            model.optin_rate_from_sessions,
            conversionReadinessM
        );

        return {
            goal_outcome: {
                kind: "traffic",
                monthly_email_subscribers_est,
                note: "Traffic is shown as Result 2 (website sessions). Result 3 shows list growth potential.",
            },
            assumptions: {
                kind: "traffic",
                optin_rate_from_sessions: model.optin_rate_from_sessions,
                conversion_readiness_m: conversionReadinessM,
            },
        };
    }

    if (model.kind === "email_subscribers") {
        const monthly_email_subscribers_est = applyRateAndScalar(
            likelyPinterestSessions,
            model.optin_rate_from_sessions,
            conversionReadinessM
        );

        return {
            goal_outcome: { kind: "email_subscribers", monthly_email_subscribers_est },
            assumptions: {
                kind: "email_subscribers",
                optin_rate_from_sessions: model.optin_rate_from_sessions,
                conversion_readiness_m: conversionReadinessM,
            },
        };
    }

    if (model.kind === "affiliate_revenue") {
        // Revenue modeled via RPM ($ per 1,000 sessions), lightly nudged by conversion readiness.
        const low = (likelyPinterestSessions.low / 1000) * model.rpm_usd.low * conversionReadinessM;
        const high = (likelyPinterestSessions.high / 1000) * model.rpm_usd.high * conversionReadinessM;

        return {
            goal_outcome: {
                kind: "affiliate_revenue",
                monthly_affiliate_revenue_usd_est: { low: roundInt(low), high: roundInt(high) },
            },
            assumptions: {
                kind: "affiliate_revenue",
                rpm_usd: model.rpm_usd,
                conversion_readiness_m: conversionReadinessM,
            },
        };
    }

    if (model.kind === "course_product_sales") {
        const monthly_course_intent_sessions_est = applyRate(likelyPinterestSessions, model.course_intent_share_of_sessions);

        const revenue_by_course_price_est = computeCourseRevenueByPrice(monthly_course_intent_sessions_est, conversionReadinessM);

        return {
            goal_outcome: {
                kind: "course_product_sales",
                monthly_course_intent_sessions_est,
                revenue_by_course_price_est,
            },
            assumptions: {
                kind: "course_product_sales",
                course_intent_share_of_sessions: model.course_intent_share_of_sessions,
                enroll_rate_by_price: COURSE_ENROLL_RATE_BY_PRICE,
                course_price_buckets: COURSE_PRICE_BUCKETS,
                conversion_readiness_m: conversionReadinessM,
            },
        };
    }

    // Strict contract: if goal keys drift (or a new kind is introduced), fail loud.
    throw new Error(`Compute contract error: Unexpected model.kind="${String((model as any).kind)}" for ${goalKey}`);
}

function computeProductSellerOutcomeBundle(
    goalKey: GoalKey,
    likelyPinterestSessions: Range,
    conversionReadinessM: number
): { goal_outcome: ProductSellerGoalOutcomeV2; assumptions: ProductSellerAssumptionsV2 } {
    const model = mustGoalOutcomeModelEntry(goalKey);

    if (model.kind === "sales") {
        const purchase_intent_sessions_est = applyRate(likelyPinterestSessions, model.purchase_intent_share_of_sessions);

        const revenue_by_aov_est = computeRevenueByAov(
            purchase_intent_sessions_est,
            conversionReadinessM,
            model.conversion_rate_by_aov,
            model.aov_buckets
        );

        return {
            goal_outcome: { kind: "sales", revenue_by_aov_est },
            assumptions: {
                kind: "sales",
                purchase_intent_share_of_sessions: model.purchase_intent_share_of_sessions,
                ecommerce_cr_by_aov: model.conversion_rate_by_aov,
                aov_buckets: model.aov_buckets,
                conversion_readiness_m: conversionReadinessM,
            },
        };
    }

    if (model.kind === "email_subscribers") {
        const monthly_email_subscribers_est = applyRateAndScalar(
            likelyPinterestSessions,
            model.optin_rate_from_sessions,
            conversionReadinessM
        );

        return {
            goal_outcome: { kind: "email_subscribers", monthly_email_subscribers_est },
            assumptions: {
                kind: "email_subscribers",
                optin_rate_from_sessions: model.optin_rate_from_sessions,
                conversion_readiness_m: conversionReadinessM,
            },
        };
    }

    if (model.kind === "retargeting_pool") {
        const monthly_retargetable_visitors_est = applyRate(likelyPinterestSessions, model.retargetable_share_of_sessions);

        return {
            goal_outcome: { kind: "retargeting_pool", monthly_retargetable_visitors_est },
            assumptions: {
                kind: "retargeting_pool",
                retargetable_share_of_sessions: model.retargetable_share_of_sessions,
            },
        };
    }

    if (model.kind === "new_customer_discovery") {
        const monthly_new_to_brand_sessions_est = applyRate(likelyPinterestSessions, model.new_to_brand_share_of_sessions);

        return {
            goal_outcome: { kind: "new_customer_discovery", monthly_new_to_brand_sessions_est },
            assumptions: {
                kind: "new_customer_discovery",
                new_to_brand_share_of_sessions: model.new_to_brand_share_of_sessions,
            },
        };
    }

    throw new Error(`Compute contract error: Unexpected model.kind="${String((model as any).kind)}" for ${goalKey}`);
}

function computeServiceProviderOutcomeBundle(
    goalKey: GoalKey,
    likelyPinterestSessions: Range,
    conversionReadinessM: number
): { goal_outcome: ServiceProviderGoalOutcomeV2; assumptions: ServiceProviderAssumptionsV2 } {
    const model = mustGoalOutcomeModelEntry(goalKey);

    if (model.kind === "leads_calls") {
        const monthly_discovery_calls_est = applyRateAndScalar(
            likelyPinterestSessions,
            model.book_rate_from_sessions,
            conversionReadinessM
        );

        return {
            goal_outcome: { kind: "leads_calls", monthly_discovery_calls_est },
            assumptions: {
                kind: "leads_calls",
                call_book_rate_from_sessions: model.book_rate_from_sessions,
                conversion_readiness_m: conversionReadinessM,
            },
        };
    }

    if (model.kind === "email_subscribers") {
        const monthly_email_subscribers_est = applyRateAndScalar(
            likelyPinterestSessions,
            model.optin_rate_from_sessions,
            conversionReadinessM
        );

        return {
            goal_outcome: { kind: "email_subscribers", monthly_email_subscribers_est },
            assumptions: {
                kind: "email_subscribers",
                optin_rate_from_sessions: model.optin_rate_from_sessions,
                conversion_readiness_m: conversionReadinessM,
            },
        };
    }

    if (model.kind === "webinar_signups") {
        const monthly_webinar_signups_est = applyRateAndScalar(
            likelyPinterestSessions,
            model.webinar_signup_rate_from_sessions,
            conversionReadinessM
        );

        return {
            goal_outcome: { kind: "webinar_signups", monthly_webinar_signups_est },
            assumptions: {
                kind: "webinar_signups",
                webinar_signup_rate_from_sessions: model.webinar_signup_rate_from_sessions,
                conversion_readiness_m: conversionReadinessM,
            },
        };
    }

    if (model.kind === "authority_visibility") {
        // Visibility is not a conversion rate; conversion_readiness_m is intentionally NOT applied.
        const low = likelyPinterestSessions.low * model.visibility_reach_per_session.low;
        const high = likelyPinterestSessions.high * model.visibility_reach_per_session.high;

        return {
            goal_outcome: {
                kind: "authority_visibility",
                monthly_visibility_reach_est: { low: roundInt(low), high: roundInt(high) },
            },
            assumptions: {
                kind: "authority_visibility",
                visibility_reach_per_session: model.visibility_reach_per_session,
            },
        };
    }

    throw new Error(`Compute contract error: Unexpected model.kind="${String((model as any).kind)}" for ${goalKey}`);
}

// -----------------------------
// Public API
// -----------------------------

export function computeResults(answers: Answers): ComputeResult {
    const v = validateAnswers(answers);
    if (!v.ok) return { ok: false, errors: v.errors };

    const a = answers as Required<Answers>;
    const row = getBenchmark(a.Q1, a.Q2);

    const inferred = {
        seasonality: row.inferred.seasonality,
        competition: row.inferred.competition,
    };

    const distribution_capacity_m = computeDistributionCapacityMultiplier(a, inferred);
    const conversion_readiness_m = computeConversionReadinessMultiplier(a);

    // v1.2 strict goal wiring (ALL segments)
    const goal_key = mustGoalKey(a);
    const primary_goal = a.Q7;

    // -----------------------------
    // 1) Demand (macro + micro + final) — SESSIONS
    // -----------------------------
    const demand_base_sessions_est: Range = row.demand_base_sessions;
    const likely_pinterest_sessions_est: Range = applyRange(demand_base_sessions_est, distribution_capacity_m);

    // -----------------------------
    // 2) Traffic (shared, non-duplicated)
    // -----------------------------
    const traffic: TrafficBundle = {
        website_sessions_est: likely_pinterest_sessions_est,
    };

    if (a.Q1 === "product_seller") {
        // v1.2 strict rule: purchase-intent lens is modeled via the explicit SALES goal entry.
        // This keeps the traffic lens anchored to GOAL_OUTCOME_MODEL (no separate compute defaults).
        const salesKey = makeGoalKey("product_seller", "sales");
        const salesModel = mustGoalOutcomeModelEntry(salesKey);

        if (salesModel.kind !== "sales") {
            throw new Error(`Compute contract error: Expected sales model for ${salesKey}, got ${String((salesModel as any).kind)}`);
        }

        traffic.purchase_intent_sessions_est = applyRate(likely_pinterest_sessions_est, salesModel.purchase_intent_share_of_sessions);
    }

    // -----------------------------
    // 3) Segment outcomes (goal-driven; Result 3)
    // -----------------------------
    let segment_outcome: SegmentOutcome;

    if (a.Q1 === "content_creator") {
        const { goal_outcome, assumptions } = computeContentCreatorOutcomeBundle(
            goal_key,
            likely_pinterest_sessions_est,
            conversion_readiness_m
        );

        segment_outcome = {
            kind: "content_creator",
            goal_key,
            primary_goal,
            goal_outcome,
            assumptions,
        };
    } else if (a.Q1 === "product_seller") {
        const { goal_outcome, assumptions } = computeProductSellerOutcomeBundle(
            goal_key,
            likely_pinterest_sessions_est,
            conversion_readiness_m
        );

        segment_outcome = {
            kind: "product_seller",
            goal_key,
            primary_goal,
            goal_outcome,
            assumptions,
        };
    } else {
        // service_provider
        const { goal_outcome, assumptions } = computeServiceProviderOutcomeBundle(
            goal_key,
            likely_pinterest_sessions_est,
            conversion_readiness_m
        );

        segment_outcome = {
            kind: "service_provider",
            goal_key,
            primary_goal,
            goal_outcome,
            assumptions,
        };
    }

    // -----------------------------
    // 4) Demographic context (benchmark-driven)
    // -----------------------------
    const demographics = {
        household_income_usd: row.income,
        notes: [
            "Context only: this does not predict your buyer income.",
            "Used to frame US+CA Pinterest audience demographics at a high level.",
        ],
    };

    return {
        ok: true,
        results: {
            demand: {
                demand_base_sessions_est,
                distribution_capacity_m,
                conversion_readiness_m,
                likely_pinterest_sessions_est,
            },
            traffic,
            segment_outcome,
            demographics,
            inferred: {
                seasonality_index: row.inferred.seasonality,
                competition_index: row.inferred.competition,
                tags: row.inferred.tags,
            },
            insight_line: buildInsightFromBenchmark({ segment: a.Q1, niche: a.Q2 }),
        },
    };
}

export function computeResultsUnsafe(answers: Answers): ResultsBundle {
    const r = computeResults(answers);
    if (!r.ok) throw new Error(`Invalid answers: ${JSON.stringify(r.errors)}`);
    return r.results;
}
