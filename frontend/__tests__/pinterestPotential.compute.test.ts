import { computeResults } from "@/lib/tools/pinterestPotential/compute";
import {
    getNicheOptions,
    getPrimaryGoalOptions,
    makeGoalKey,
    type Answers,
    type Segment,
    type NicheSlug,
    type PrimaryGoal,
    type VolumeBucket,
    type VisualStrength,
    type SiteExperience,
    type OfferClarity,
    type GrowthMode,
} from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import { getBenchmark } from "@/lib/tools/pinterestPotential/benchmarks";
import { buildResultsUiModel } from "@/lib/tools/pinterestPotential/resultsUiAdapter";

function firstNiche(segment: Segment): NicheSlug {
    return getNicheOptions(segment)[0].id;
}

function firstGoal(segment: Segment): PrimaryGoal {
    return getPrimaryGoalOptions(segment)[0].id;
}

function makeValidAnswers(overrides: Partial<Answers> = {}): Answers {
    const segment: Segment = overrides.Q1 ?? "content_creator";

    const base: Answers = {
        Q1: segment,
        Q2: firstNiche(segment),
        Q3: "3-5" as VolumeBucket,
        Q4: "decent" as VisualStrength,
        Q5: "c" as SiteExperience,
        Q6: "somewhat" as OfferClarity,
        Q7: firstGoal(segment),
        Q8: "organic" as GrowthMode,
    };

    const nextSegment: Segment = overrides.Q1 ?? base.Q1!;
    const merged: Answers = { ...base, ...overrides, Q1: nextSegment };

    if (!overrides.Q2) merged.Q2 = firstNiche(nextSegment);
    if (!overrides.Q7) merged.Q7 = firstGoal(nextSegment);

    return merged;
}

describe("Pinterest Potential (v1.2) — computeResults()", () => {
    it("returns ok:false when a required question is missing", () => {
        const r = computeResults({});
        expect(r.ok).toBe(false);
        if (!r.ok) {
            expect(r.errors).toHaveProperty("Q1");
        }
    });

    it("returns ok:false when Q2 is missing (even if Q1 is set)", () => {
        const a: Answers = { Q1: "content_creator" };
        const r = computeResults(a);
        expect(r.ok).toBe(false);
        if (!r.ok) {
            expect(r.errors).toHaveProperty("Q2");
        }
    });

    it("returns ok:false when Q2 is not valid for the chosen segment", () => {
        const wrongNiche = getNicheOptions("product_seller")[0].id;

        const a = makeValidAnswers({
            Q1: "content_creator",
            Q2: wrongNiche,
        });

        const r = computeResults(a);
        expect(r.ok).toBe(false);
        if (!r.ok) {
            expect(r.errors).toHaveProperty("Q2");
        }
    });

    it("returns ok:false when Q7 is not valid for the chosen segment", () => {
        const wrongGoal = getPrimaryGoalOptions("service_provider")[0].id;

        const a = makeValidAnswers({
            Q1: "product_seller",
            Q7: wrongGoal,
        });

        const r = computeResults(a);
        expect(r.ok).toBe(false);
        if (!r.ok) {
            expect(r.errors).toHaveProperty("Q7");
        }
    });

    it("returns ok:true with internally consistent v1.2 bundles", () => {
        const a = makeValidAnswers();
        const r = computeResults(a);

        expect(r.ok).toBe(true);
        if (!r.ok) return;

        const { results } = r;

        expect(results.demand.demand_base_sessions_est.low).toBeLessThanOrEqual(
            results.demand.demand_base_sessions_est.high,
        );
        expect(results.demand.likely_pinterest_sessions_est.low).toBeLessThanOrEqual(
            results.demand.likely_pinterest_sessions_est.high,
        );
        expect(results.demographics.household_income_usd.low).toBeLessThanOrEqual(
            results.demographics.household_income_usd.high,
        );

        expect(Number.isInteger(results.demand.demand_base_sessions_est.low)).toBe(true);
        expect(Number.isInteger(results.demand.demand_base_sessions_est.high)).toBe(true);
        expect(Number.isInteger(results.demand.likely_pinterest_sessions_est.low)).toBe(true);
        expect(Number.isInteger(results.demand.likely_pinterest_sessions_est.high)).toBe(true);
        expect(Number.isInteger(results.demographics.household_income_usd.low)).toBe(true);
        expect(Number.isInteger(results.demographics.household_income_usd.high)).toBe(true);

        expect(results.traffic.website_sessions_est).toEqual(
            results.demand.likely_pinterest_sessions_est,
        );
        expect(results.segment_outcome.kind).toBe(a.Q1);
        expect(results.segment_outcome.goal_key).toBe(makeGoalKey(a.Q1!, a.Q7!));
        expect(Number.isFinite(results.demand.distribution_capacity_m)).toBe(true);
        expect(Number.isFinite(results.demand.conversion_readiness_m)).toBe(true);
        expect(results.inferred.seasonality_index).toMatch(/^(low|medium|high)$/);
        expect(results.inferred.competition_index).toMatch(/^(low|medium|high)$/);

        const il = results.insight_line;
        expect(il === undefined || il === null || typeof il === "string").toBe(true);
    });

    it("keeps benchmark-driven demand, demographics, and inferred indices aligned", () => {
        const a = makeValidAnswers({
            Q1: "content_creator",
            Q2: firstNiche("content_creator"),
            Q3: "6-10",
            Q4: "strong",
            Q5: "d",
            Q6: "yes",
            Q7: firstGoal("content_creator"),
            Q8: "later",
        });

        const r = computeResults(a);
        expect(r.ok).toBe(true);
        if (!r.ok) return;

        const row = getBenchmark(a.Q1!, a.Q2!);

        expect(r.results.inferred.seasonality_index).toBe(row.inferred.seasonality);
        expect(r.results.inferred.competition_index).toBe(row.inferred.competition);
        expect(r.results.demand.demand_base_sessions_est).toEqual(row.demand_base_sessions);
        expect(r.results.demographics.household_income_usd.low).toBe(Math.round(row.income.low));
        expect(r.results.demographics.household_income_usd.high).toBe(Math.round(row.income.high));
    });

    it("adds the purchase-intent traffic lens for product sellers", () => {
        const a = makeValidAnswers({
            Q1: "product_seller",
            Q2: firstNiche("product_seller"),
            Q3: "20+",
            Q4: "very_strong",
            Q5: "d",
            Q6: "yes",
            Q7: firstGoal("product_seller"),
            Q8: "ads",
        });

        const r = computeResults(a);
        expect(r.ok).toBe(true);
        if (!r.ok) return;

        expect(r.results.segment_outcome.kind).toBe("product_seller");
        expect(r.results.segment_outcome.primary_goal).toBe(a.Q7);
        expect(r.results.traffic.purchase_intent_sessions_est).toBeDefined();
        expect(r.results.traffic.purchase_intent_sessions_est?.low).toBeLessThanOrEqual(
            r.results.traffic.purchase_intent_sessions_est?.high ?? 0,
        );
    });

    it("builds a UI model from the compute result without contract drift", () => {
        const a = makeValidAnswers();
        const r = computeResults(a);
        expect(r.ok).toBe(true);
        if (!r.ok) return;

        const model = buildResultsUiModel({
            segment: a.Q1!,
            niche: a.Q2!,
            results: r.results,
        });

        expect(model.snapshot.segment).toBe(a.Q1);
        expect(model.snapshot.niche).toBe(a.Q2);
        expect(model.scenarios).toHaveLength(1);
        expect(model.scenarios[0]?.cards[0]).toEqual(
            expect.objectContaining({
                id: "result_1_demand",
                title: "Monthly demand in your niche (US+CA)",
            }),
        );
        expect(model.scenarios[0]?.cards[1]).toBeDefined();
        expect(model.scenarios[0]?.cards[2]).toBeDefined();
    });
});
