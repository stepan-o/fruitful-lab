### Pinterest Potential — Sprint 1 compliance audit and compute source-of-truth fix

Last updated: 2025-12-16

---

#### TL;DR
- Spec stores checkbox answers (Q2/Q3/Q9) as option IDs. The legacy compute engine summed arrays directly (treating them as values), which is incorrect under the new spec.
- The Wizard had a local, spec-aligned compute path that translated IDs → values, creating duplication/drift.
- We made compute.ts the canonical source of truth again (Sprint 1 principle: compute perfectly before UX), translating IDs inside the engine and updating the Wizard to call it.

---

### A) Spec representation (reality check)

- Spec file: frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts
- Answers model:
  - Q2, Q3, Q9: number[] of selected option IDs (not values)
  - Q1, Q4, Q5, Q6: radio scalar numbers (values)
  - Q7, Q8: slider 1–5
- Options include: id, label, value
- Helpers provided (IDs-aware):
  - computeAvgHouseholdIncomeFromAnswers(answers)
  - computeAvgCartSizeFromAnswers(answers)

### B) Compute engine status before fix (drift)

- File: frontend/lib/tools/pinterestPotential/compute.ts
- Problem: computeScore(answers) did `sum(answers.Q2)` and `sum(answers.Q3)` directly, assuming arrays of values. Under the current spec, Q2/Q3 are IDs, so this would sum small integers rather than weights/region values.
- Result 2/3 were also implemented locally in compute.ts using legacy tables, instead of the spec helpers.

### C) Wizard compute path (before fix)

- File: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
- Wizard converted Q2/Q3 IDs → option values then computed monthlyAudience locally; Results 2/3 called spec helpers. This path produced correct UI results but duplicated core compute.

### D) Decision: single source of truth

- Sprint 1 non‑negotiable: compute perfectly before UX, return { ok:false, errors } for invalid inputs.
- We centralized compute in compute.ts (IDs → values inside the engine) and made the Wizard call the canonical engine.

---

## Minimal patch (implemented)

1) Make compute.ts spec‑aligned and canonical
- Translate checkbox IDs → values within computeScore using spec options (Q2/Q3 from spec):
  - Added internal helper sumCheckboxOptionValuesById(selectedIds, opts)
  - computeScore now sums translated values
- Results bundle now sources:
  - Result 1: monthlyAudience = computeScore(answers)
  - Result 2: avgHouseholdIncome = computeAvgHouseholdIncomeFromAnswers(answers)
  - Result 3: avgCartSize = computeAvgCartSizeFromAnswers(answers)
- Left computeResult(answers, lead) validation behavior intact: it calls validateAnswers and returns { ok:false, errors } when invalid.
- Updated module header comments to declare this file the canonical compute source of truth.

2) Update Wizard to call the centralized compute
- Removed wizard‑local compute helpers (ID→value translation and local monthlyAudience formula).
- Import and call computeResults from lib compute.ts after validation in handleNext().
- Kept lead gating, validation, state, recap, and results UI unchanged.

---

## Where to look (key lines)

- compute.ts
  - Canonical translation helper: sumCheckboxOptionValuesById()
  - computeScore(): sums Q2/Q3 values via ID translation and applies the formula
  - computeResults(): delegates Income/Cart Size to spec helpers
- PinterestPotentialWizard.tsx
  - handleNext(): now calls computeResults(...) from the engine
  - No local formula; ResultsBundle type imported from the engine

---

## Acceptance criteria (met)

- Correct Result 1 when Q2/Q3 store IDs (spec‑compliant): YES — engine translates IDs to values.
- Wizard results still show the same 3 outputs: YES — unchanged UI, centralized compute.
- Validation behavior: invalid/missing answers → { ok:false, errors }: YES — computeResult() behavior preserved; Wizard’s own validation/gating unchanged.
- No changes to lead modes/gating: YES — untouched.

---

## Notes for next cycle (tests to add)

1) Validation: empty multi‑select (Q2/Q3)
   - Given Answers missing Q2 or Q3 selections, computeResult() should return ok:false with proper errors.
2) Slider bounds (Q7/Q8)
   - Values outside 1..5 should be rejected by validateAnswers (or clamped if spec changes) and cause ok:false.
3) Golden cases (Outgrow parity)
   - Provide 3–5 known input → output pairs covering typical and edge combinations (e.g., Europe + Clothing; USA + multiple categories; high seasonality and high competition).
4) Multi‑select regions influence on Results 2/3
   - Ensure spec helpers behave as intended (primary or averaged semantics) and produce stable outputs.
5) ID/value shape regressions
   - Confirm computeScore produces the same result when IDs are mapped versus when values are (hypothetically) pre‑translated; engine should be robust given IDs per spec.

---

## Other callers of compute engine (inventory)

- Primary caller: PinterestPotentialWizard.tsx (after this change) via computeResults().
- No other pages/components currently import compute.ts for output; this centralization avoids future drift.

---

## Conclusion

We restored Sprint 1 compliance by making lib compute canonical and IDs‑aware. The Wizard now delegates to the engine, eliminating duplicated formula logic and preventing future source‑of‑truth drift.
