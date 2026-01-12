import { computeResults } from "@/lib/tools/pinterestPotential/compute";
import {
    getNicheOptions,
    getPrimaryGoalOptions,
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

    // If overrides change Q1, ensure we recompute Q2/Q7 defaults for that segment
    const nextSegment: Segment = overrides.Q1 ?? base.Q1!;
    const merged: Answers = { ...base, ...overrides, Q1: nextSegment };

    // If caller didn’t specify Q2/Q7 explicitly, keep them valid for the (possibly overridden) segment
    if (!overrides.Q2) merged.Q2 = firstNiche(nextSegment);
    if (!overrides.Q7) merged.Q7 = firstGoal(nextSegment);

    return merged;
}

describe("Pinterest Potential (v0.2) — computeResults()", () => {
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
        // Pick a niche from a different segment to ensure invalidity
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
        // Pick a goal from a different segment to ensure invalidity
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

    it("returns ok:true and produces well-formed ranges + inferred indices", () => {
        const a = makeValidAnswers();
        const r = computeResults(a);

        expect(r.ok).toBe(true);
        if (!r.ok) return;

        const { results } = r;

        // Ranges exist and are ordered
        expect(results.audience_est.low).toBeLessThanOrEqual(results.audience_est.high);
        expect(results.income_est.low).toBeLessThanOrEqual(results.income_est.high);
        expect(results.opportunity_est.low).toBeLessThanOrEqual(results.opportunity_est.high);

        // Integers (rounded)
        expect(Number.isInteger(results.audience_est.low)).toBe(true);
        expect(Number.isInteger(results.audience_est.high)).toBe(true);
        expect(Number.isInteger(results.income_est.low)).toBe(true);
        expect(Number.isInteger(results.income_est.high)).toBe(true);
        expect(Number.isInteger(results.opportunity_est.low)).toBe(true);
        expect(Number.isInteger(results.opportunity_est.high)).toBe(true);

        // Inferred indices are present
        expect(results.inferred.seasonality_index).toMatch(/^(low|medium|high)$/);
        expect(results.inferred.competition_index).toMatch(/^(low|medium|high)$/);

        // insight_line is optional (string or null/undefined)
        const il = results.insight_line;
        expect(il === undefined || il === null || typeof il === "string").toBe(true);
    });

    it("matches benchmark telemetry fields and keeps income benchmark-driven (multiplier = 1.0)", () => {
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

        // Telemetry fields should reflect benchmark row inference
        expect(r.results.inferred.seasonality_index).toBe(row.inferred.seasonality);
        expect(r.results.inferred.competition_index).toBe(row.inferred.competition);

        // Opportunity type should come from benchmark row
        expect(r.results.opportunity_est.type).toBe(row.opportunity.type);

        // Income multiplier is 1.0 in v0.2, so income should be benchmark-derived (rounded)
        expect(r.results.income_est.low).toBe(Math.round(row.income.low));
        expect(r.results.income_est.high).toBe(Math.round(row.income.high));
    });

    it("keeps audience multiplier in the subtle clamp band (≈ ±15%)", () => {
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

        const row = getBenchmark(a.Q1!, a.Q2!);

        // Compute effective multiplier from baseline → output (allow tiny rounding slop)
        const eps = 0.02;

        const mLow = r.results.audience_est.low / row.audience_base.low;
        const mHigh = r.results.audience_est.high / row.audience_base.high;

        expect(mLow).toBeGreaterThanOrEqual(0.85 - eps);
        expect(mLow).toBeLessThanOrEqual(1.15 + eps);

        expect(mHigh).toBeGreaterThanOrEqual(0.85 - eps);
        expect(mHigh).toBeLessThanOrEqual(1.15 + eps);
    });

    it("keeps opportunity multiplier in the subtle clamp band (≈ ±20%)", () => {
        const a = makeValidAnswers({
            Q1: "service_provider",
            Q2: firstNiche("service_provider"),
            Q3: "0-2",
            Q4: "limited",
            Q5: "a",
            Q6: "no",
            Q7: firstGoal("service_provider"),
            Q8: "organic",
        });

        const r = computeResults(a);
        expect(r.ok).toBe(true);
        if (!r.ok) return;

        const row = getBenchmark(a.Q1!, a.Q2!);

        const eps = 0.02;

        const mLow = r.results.opportunity_est.low / row.opportunity.low;
        const mHigh = r.results.opportunity_est.high / row.opportunity.high;

        expect(mLow).toBeGreaterThanOrEqual(0.8 - eps);
        expect(mLow).toBeLessThanOrEqual(1.2 + eps);

        expect(mHigh).toBeGreaterThanOrEqual(0.8 - eps);
        expect(mHigh).toBeLessThanOrEqual(1.2 + eps);
    });
});
