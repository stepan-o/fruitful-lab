import { AnswerId, calculateQuizOutcome } from "@/lib/flowerMessageQuiz";

function outcomeFor(answerIds: AnswerId[]) {
  return calculateQuizOutcome(answerIds).outcome;
}

describe("Bloom Whispers flower message quiz scoring", () => {
  it("returns the top single flower when no approved Power Duo qualifies", () => {
    const outcome = outcomeFor([
      "q2_violet_flame",
      "q3_work_speaks",
      "q4_quiet_elegance",
      "q5_clear_thing",
      "q8_stand_on_own",
    ]);

    expect(outcome.kind).toBe("single");
    expect(outcome.flowerName).toBe("Camellia");
  });

  it("captures Heliotrope through the revised useful-beauty pathway", () => {
    const summary = calculateQuizOutcome([
      "q3_sentence_clean",
      "q5_hold_your_care",
      "q6_honest_letter",
      "q8_turn_face",
    ]);

    expect(summary.resultScores.heliotrope).toBe(6);
    expect(summary.resultScores.bluebell).toBe(1);
    expect(summary.outcome.kind).toBe("single");
    expect(summary.outcome.flowerName).toBe("Heliotrope");
  });

  it("triggers an approved Power Duo only from close result scores", () => {
    const outcome = outcomeFor([
      "q2_cold_room",
      "q3_quieter_evening",
      "q5_good_gate",
      "q6_narrow_path",
      "q8_quieter_room",
    ]);

    expect(outcome.kind).toBe("power_duo");
    expect(outcome.flowerName).toBe("Hellebore + Foxglove");
  });

  it("captures hidden intent tags separately from result scoring", () => {
    const summary = calculateQuizOutcome(["q1_story", "q7_strange_story"]);

    expect(summary.intentScores.intent_story_lover).toBe(6);
    expect(summary.resultScores.hellebore).toBe(0);
    expect(summary.resultScores.snowdrop).toBe(0);
    expect(summary.outcome.kind).toBe("single");
  });
});
