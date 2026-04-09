import {
    normalizePinterestFitAnswers,
    scorePinterestFitAssessment,
    type AssessmentAnswers,
} from "@/lib/tools/pinterestFit";

function makeAnswers(overrides: Partial<AssessmentAnswers> = {}): AssessmentAnswers {
    return {
        q1: "home_decor",
        q2: "very_proven",
        q3: "strong",
        q4: "ready",
        q5: "discovery",
        q6: "ready_now",
        q7: "very_open",
        ...overrides,
    };
}

describe("Pinterest Fit Assessment engine", () => {
    it("normalizes answer values into stored scores and goal type", () => {
        expect(
            normalizePinterestFitAnswers(
                makeAnswers({
                    q2: "somewhat_proven",
                    q5: "sales",
                    q6: "maybe_later",
                    q7: "unsure",
                }),
            ),
        ).toEqual({
            q1_category_fit: 4,
            q2_offer_proven: 3,
            q3_assets: 4,
            q4_website: 4,
            q5_goal_fit: 2,
            q5_goal_type: "sales",
            q6_support_readiness: 1,
            q7_ads_openness: 1,
        });
    });

    it("returns a clear strong-fit result", () => {
        const result = scorePinterestFitAssessment(makeAnswers());

        expect(result.score).toBe(25);
        expect(result.baseOutcome).toBe("strong_fit");
        expect(result.finalOutcome).toBe("strong_fit");
        expect(result.roleKey).toBe("discovery_traffic");
        expect(result.reasonKeys).toEqual([
            "reason_category_strong",
            "reason_offer_proven",
            "reason_support_ready",
        ]);
    });

    it("applies guardrail A for sales-driven respondents with low readiness", () => {
        const result = scorePinterestFitAssessment(
            makeAnswers({
                q5: "sales",
                q6: "maybe_later",
                q7: "unsure",
            }),
        );

        expect(result.baseOutcome).toBe("strong_fit");
        expect(result.finalOutcome).toBe("possible_fit");
        expect(result.debug?.triggeredGuardrails).toEqual(["guardrail_a"]);
    });

    it("selects possible-fit reasons and retargeting role deterministically", () => {
        const result = scorePinterestFitAssessment(
            makeAnswers({
                q2: "somewhat_proven",
                q3: "decent",
                q4: "mostly_ready",
                q5: "retargeting",
                q6: "just_exploring",
                q7: "not_open",
            }),
        );

        expect(result.finalOutcome).toBe("possible_fit");
        expect(result.roleKey).toBe("warm_audience_support");
        expect(result.reasonKeys).toEqual([
            "reason_category_strong",
            "reason_offer_some_traction",
            "reason_support_not_committed",
        ]);
    });

    it("uses blocker-first not-right-now reasons and fallback ordering when needed", () => {
        const result = scorePinterestFitAssessment(
            makeAnswers({
                q3: "weak",
                q4: "not_ready",
                q5: "traffic",
            }),
        );

        expect(result.finalOutcome).toBe("not_right_now");
        expect(result.roleKey).toBe("not_priority_yet");
        expect(result.reasonKeys).toEqual([
            "reason_site_not_ready",
            "reason_assets_weak",
            "reason_goal_traffic",
        ]);
        expect(result.debug?.triggeredGuardrails).toEqual(["guardrail_b"]);
    });

    it("falls back to foundation_first when the score is strong but the role rules stay unmet", () => {
        const result = scorePinterestFitAssessment(
            makeAnswers({
                q3: "weak",
                q5: "traffic",
            }),
        );

        expect(result.finalOutcome).toBe("strong_fit");
        expect(result.roleKey).toBe("foundation_first");
        expect(result.reasonKeys).toEqual([
            "reason_category_strong",
            "reason_offer_proven",
            "reason_support_ready",
        ]);
    });

    it("assigns selective_test_channel for strong foundations in weaker-fit categories", () => {
        const result = scorePinterestFitAssessment(
            makeAnswers({
                q1: "other",
                q5: "discovery",
            }),
        );

        expect(result.finalOutcome).toBe("strong_fit");
        expect(result.roleKey).toBe("selective_test_channel");
        expect(result.reasonKeys).toEqual([
            "reason_category_weak",
            "reason_offer_proven",
            "reason_support_ready",
        ]);
    });
});
