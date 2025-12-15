import { computeResult, computeScore, round, sum } from "@/lib/tools/pinterestPotential/compute";
import { Answers, Lead } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";

describe("Pinterest Potential – compute helpers", () => {
  it("sum() adds numbers", () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([])).toBe(0);
  });

  it("round() rounds to given decimals", () => {
    expect(round(1.234, 0)).toBe(1);
    expect(round(1.5, 0)).toBe(2);
    expect(round(1.234, 2)).toBe(1.23);
  });
});

// Helper: a fully valid base answer set using known weights
function makeValidAnswers(overrides: Partial<Answers> = {}): Required<Answers> {
  const base: Required<Answers> = {
    // Q1 Yes
    Q1: 1,
    // Q2 Canada
    Q2: [1_600_000],
    // Q3 Nursery & Home (0.2) + Feeding & Care (0.1)
    Q3: [0.2, 0.1],
    // Q4 Yes (0.35)
    Q4: 0.35,
    // Q5 Yes blog (1.15)
    Q5: 1.15,
    // Q6 Yes (1.3)
    Q6: 1.3,
    // Q7 1 (min)
    Q7: 1,
    // Q8 1 (min)
    Q8: 1,
    // Q9 Email (6) — not used in formula but required
    Q9: [6],
  };
  return { ...base, ...overrides };
}

const validLead: Lead = { name: "Ada Lovelace", email: "ada@example.com" };

describe("Pinterest Potential – validation gating via computeResult", () => {
  it("returns ok:false when a required question is missing", () => {
    const a: Answers = {};
    const r = computeResult(a, validLead);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors).toHaveProperty("Q1");
    }
  });

  it("returns ok:false when a multi-select is empty (Q2)", () => {
    const a = makeValidAnswers({ Q2: [] });
    const r = computeResult(a, validLead);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors).toHaveProperty("Q2");
    }
  });

  it("returns ok:false when a slider is out of bounds (Q7 < 1)", () => {
    const a = makeValidAnswers({ Q7: 0 });
    const r = computeResult(a, validLead);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors).toHaveProperty("Q7");
    }
  });

  it("returns ok:true when answers are valid even if lead is missing (lead gating handled by UI)", () => {
    const a = makeValidAnswers();
    const r = computeResult(a, undefined);
    expect(r.ok).toBe(true);
    if (r.ok) {
      // Should equal computeScore for the same inputs
      expect(r.score).toBe(computeScore(a));
    }
  });
});

describe("Pinterest Potential – golden cases (deterministic from spec weights)", () => {
  it("Golden A: Canada + Nursery & Home + Feeding & Care; all positive scalars; Q7=1, Q8=1", () => {
    const a = makeValidAnswers();
    // Expected math:
    // sum(Q3) = 0.2 + 0.1 = 0.3
    // sum(Q2) = 1,600,000
    // Base = 0.3 * 1,600,000 = 480,000
    // * Q1(1) = 480,000
    // * Q4(0.35) = 168,000
    // * Q5(1.15) = 193,200
    // * Q6(1.3) = 251,160
    // Seasonal factor (Q7=1): 1.175 - 0.175*1 = 1.0
    // Competition factor (Q8=1): 1.15 - 0.15*1 = 1.0
    // Result = 251,160 → round(0) = 251,160
    const r = computeResult(a, validLead);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.score).toBe(251160);
    }
  });

  it("Golden B: USA + (Travel & Mobility + Toys/Play); Q1=No; Q4=consider; Q5=guides; Q6=Not sure; Q7=2; Q8=3", () => {
    const a = makeValidAnswers({
      Q1: 0.7, // No
      Q2: [27_000_000], // USA
      Q3: [0.18, 0.15], // 0.33
      Q4: 0.2, // No, but could consider
      Q5: 1.05, // guides
      Q6: 1, // Not sure
      Q7: 2,
      Q8: 3,
    });

    // Expected math:
    // sum(Q3)=0.33, sum(Q2)=27,000,000 → 8,910,000
    // * Q1(0.7) = 6,237,000
    // * Q4(0.2) = 1,247,400
    // * Q5(1.05) = 1,309,770
    // * Q6(1) = 1,309,770
    // Seasonal(Q7=2): 1.175 - 0.35 = 0.825 → 1,080,560.25
    // Competition(Q8=3): 1.15 - 0.45 = 0.7 → 756,392.175
    // round(0) = 756,392
    const r = computeResult(a, validLead);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.score).toBe(756392);
    }
  });

  it("Golden C: Global + 3 categories; Q4=No; Q5=No and not planning; Q6=No; Q7=5; Q8=5", () => {
    const a = makeValidAnswers({
      Q2: [141_000_000], // Global
      Q3: [0.2, 0.17, 0.08], // 0.45
      Q4: 0.1, // No
      Q5: 0.8, // No and not planning to
      Q6: 0.9, // No
      Q7: 5,
      Q8: 5,
    });

    // Expected math:
    // sum(Q3)=0.45, sum(Q2)=141,000,000 → 63,450,000
    // * Q1(1) = 63,450,000
    // * Q4(0.1) = 6,345,000
    // * Q5(0.8) = 5,076,000
    // * Q6(0.9) = 4,568,400
    // Seasonal(Q7=5): 1.175 - 0.875 = 0.3 → 1,370,520
    // Competition(Q8=5): 1.15 - 0.75 = 0.4 → 548,208
    // round(0) = 548,208
    const r = computeResult(a, validLead);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.score).toBe(548208);
    }
  });
});
