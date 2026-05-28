import {
  normalizePinterestReadinessAnswers,
  scorePinterestReadinessCheck,
  type AssessmentAnswers,
} from "@/lib/pinterestReadinessCheck";

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

describe("Pinterest Readiness Check engine", () => {
  it("preserves the migrated answer normalization contract", () => {
    expect(
      normalizePinterestReadinessAnswers(
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

  it("returns the approved strong-fit result shape", () => {
    const result = scorePinterestReadinessCheck(makeAnswers());

    expect(result.score).toBe(25);
    expect(result.maxScore).toBe(25);
    expect(result.baseOutcome).toBe("strong_fit");
    expect(result.finalOutcome).toBe("strong_fit");
    expect(result.label).toBe("Strong Pinterest Fit");
    expect(result.roleKey).toBe("discovery_traffic");
    expect(result.reasonKeys).toEqual(["reason_category_strong", "reason_offer_proven", "reason_support_ready"]);
  });

  it("keeps the sales-plus-low-readiness guardrail", () => {
    const result = scorePinterestReadinessCheck(
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

  it("keeps the weak-assets-plus-weak-site guardrail", () => {
    const result = scorePinterestReadinessCheck(
      makeAnswers({
        q3: "weak",
        q4: "not_ready",
        q5: "traffic",
      }),
    );

    expect(result.finalOutcome).toBe("not_right_now");
    expect(result.roleKey).toBe("not_priority_yet");
    expect(result.reasonKeys).toEqual(["reason_site_not_ready", "reason_assets_weak", "reason_goal_traffic"]);
    expect(result.debug?.triggeredGuardrails).toEqual(["guardrail_b"]);
  });

  it("keeps the unclear-category-plus-early-offer guardrail", () => {
    const result = scorePinterestReadinessCheck(
      makeAnswers({
        q1: "other",
        q2: "early",
        q3: "decent",
        q4: "mostly_ready",
        q5: "discovery",
        q6: "open_start_lean",
        q7: "somewhat_open",
      }),
    );

    expect(result.finalOutcome).toBe("not_right_now");
    expect(result.debug?.triggeredGuardrails).toEqual(["guardrail_c"]);
  });

  it.each([
    {
      name: "clear strong fit",
      answers: makeAnswers(),
      expectedOutcome: "strong_fit",
    },
    {
      name: "strong category but weak foundation",
      answers: makeAnswers({
        q2: "early",
        q3: "weak",
        q4: "not_ready",
        q5: "traffic",
        q6: "open_start_lean",
        q7: "somewhat_open",
      }),
      expectedOutcome: "not_right_now",
      expectedRole: "not_priority_yet",
    },
    {
      name: "sales expectation but low readiness",
      answers: makeAnswers({
        q5: "sales",
        q6: "maybe_later",
        q7: "unsure",
      }),
      expectedOutcome: "possible_fit",
    },
    {
      name: "moderate fit",
      answers: makeAnswers({
        q1: "fashion_accessories",
        q2: "somewhat_proven",
        q3: "decent",
        q4: "somewhat_ready",
        q5: "launches",
        q6: "open_start_lean",
        q7: "somewhat_open",
      }),
      expectedOutcome: "possible_fit",
    },
    {
      name: "warm audience role",
      answers: makeAnswers({
        q2: "somewhat_proven",
        q3: "decent",
        q4: "mostly_ready",
        q5: "retargeting",
        q6: "just_exploring",
        q7: "not_open",
      }),
      expectedOutcome: "possible_fit",
      expectedRole: "warm_audience_support",
      expectedReasons: ["reason_category_strong", "reason_offer_some_traction", "reason_support_not_committed"],
    },
    {
      name: "foundation-first role",
      answers: makeAnswers({
        q3: "weak",
        q5: "traffic",
      }),
      expectedOutcome: "strong_fit",
      expectedRole: "foundation_first",
      expectedReasons: ["reason_category_strong", "reason_offer_proven", "reason_support_ready"],
    },
    {
      name: "selective test channel",
      answers: makeAnswers({
        q1: "other",
        q5: "discovery",
      }),
      expectedOutcome: "strong_fit",
      expectedRole: "selective_test_channel",
      expectedReasons: ["reason_category_weak", "reason_offer_proven", "reason_support_ready"],
    },
  ])("$name", ({ answers, expectedOutcome, expectedRole, expectedReasons }) => {
    const result = scorePinterestReadinessCheck(answers);

    expect(result.finalOutcome).toBe(expectedOutcome);

    if (expectedRole) {
      expect(result.roleKey).toBe(expectedRole);
    }

    if (expectedReasons) {
      expect(result.reasonKeys).toEqual(expectedReasons);
    }
  });
});
