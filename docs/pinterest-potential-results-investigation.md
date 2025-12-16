### Pinterest Potential — Results Computation, Storage, and Presentation

Last updated: 2025-12-16 08:54

---

#### TL;DR
- The Wizard computes and renders results locally using the canonical spec, not the legacy compute.ts path for Result 1.
- Answers for checkbox questions (Q2/Q3/Q9) store option IDs, which the Wizard translates to option values before math.
- Draft answers persist in sessionStorage under the key `pinterestPotential:draft:v1` and are rehydrated on load.
- The “Result 1 shows 1” issue is consistent with legacy drafts storing values (like 31,000,000) instead of IDs (like 4), which breaks id→value translation and collapses the score.

---

### 1) System overview

High-level flow of the Pinterest Potential calculator (v1):

1. User completes steps Q1–Q9 in the Wizard and optionally provides lead details depending on lead mode.
2. On Calculate, the Wizard validates answers and computes a results bundle locally, aligned with the spec:
   - Result 1: monthlyAudience
   - Result 2: avgHouseholdIncome
   - Result 3: avgCartSize
3. The results bundle is stored in component state; the Wizard renders the results plus a recap of answers.
4. Answers and step index are persisted as a per-session draft in sessionStorage to survive refreshes.

Key files:
- frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
- frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts
- frontend/lib/tools/pinterestPotential/compute.ts
- frontend/components/ui/forms/CheckboxCardGrid.tsx
- frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts

---

### 2) Data model and spec

The spec defines the canonical questions and the Answers model. Critical change: Q2/Q3/Q9 store selected option IDs, not option values.

```text
// frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts (excerpts)
export type Answers = {
  Q1?: number;     // radio → scalar value
  Q2?: number[];   // checkbox → selected option ids
  Q3?: number[];   // checkbox → selected option ids
  Q4?: number;     // radio
  Q5?: number;     // radio
  Q6?: number;     // radio
  Q7?: number;     // slider (1..5)
  Q8?: number;     // slider (1..5)
  Q9?: number[];   // checkbox → selected option ids
};

export const Q2 = {
  id: "Q2",
  type: "checkbox",
  options: [
    { id: 1, label: "Global", value: 141000000 },
    { id: 2, label: "USA", value: 27000000 },
    { id: 4, label: "Europe", value: 31000000 },
    // ...
  ],
} as const;

export const Q3 = {
  id: "Q3",
  type: "checkbox",
  options: [
    { id: 3, label: "Clothing & Accessories", value: 0.17 },
    { id: 4, label: "Toys...", value: 0.15 },
    // ...
  ],
} as const;
```

Checkbox UI emits IDs when provided, falling back to values only for legacy options without ids:

```text
// frontend/components/ui/forms/CheckboxCardGrid.tsx (excerpts)
const keyOf = (opt: CheckboxOption) => (typeof opt.id === "number" ? opt.id : opt.value);
```

---

### 3) Compute logic paths

There are two compute paths in the codebase:

1) Legacy compute engine (compute.ts)
- Provides `computeScore()` and a Sprint 5 `computeResults()` bundle.
- Assumes checkbox arrays contain raw values (legacy behavior).

```text
// frontend/lib/tools/pinterestPotential/compute.ts (excerpts)
export function computeScore(answers: Required<Answers>): number {
  const q2 = sum(answers.Q2); // legacy: assumes values
  const q3 = sum(answers.Q3); // legacy: assumes values
  const seasonalFactor = 1.175 - 0.175 * answers.Q7;
  const competitionFactor = 1.15 - 0.15 * answers.Q8;
  return round(
    q3 * q2 * answers.Q1 * answers.Q4 * answers.Q5 * answers.Q6 * seasonalFactor * competitionFactor,
    0
  );
}

export function computeResults(a: Required<Answers>): ResultsBundle {
  const monthlyAudience = computeScore(a);
  const avgHouseholdIncome = computeAvgHouseholdIncome(a.Q2);
  const avgCartSize = computeAvgCartSize(a.Q3, a.Q2);
  return { monthlyAudience, avgHouseholdIncome, avgCartSize };
}
```

2) Wizard-local compute (spec-aligned)
- Translates checkbox IDs to option values from the spec before applying the formula.
- Uses spec helpers for income and cart size that operate on IDs.

```text
// frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (excerpts)
function sumCheckboxOptionValues(questionId: "Q2" | "Q3", selectedIds: number[]): number {
  const q = QUESTIONS.find(q => q.id === questionId);
  if (!q || q.type !== "checkbox") return 0;
  const valueById = new Map(q.options.map(o => [o.id, o.value]));
  const values = selectedIds.map(id => valueById.get(id)).filter((v): v is number => typeof v === "number");
  return values.reduce((a, b) => a + b, 0);
}

function computeMonthlyAudienceFromAnswers(a: Required<Answers>): number {
  const q2 = sumCheckboxOptionValues("Q2", a.Q2);
  const q3 = sumCheckboxOptionValues("Q3", a.Q3);
  const seasonalFactor = 1.175 - 0.175 * a.Q7;
  const competitionFactor = 1.15 - 0.15 * a.Q8;
  const result = q3 * q2 * a.Q1 * a.Q4 * a.Q5 * a.Q6 * seasonalFactor * competitionFactor;
  return Math.round(result);
}

function computeResultsFromAnswers(a: Required<Answers>) {
  const monthlyAudience = computeMonthlyAudienceFromAnswers(a);
  const avgHouseholdIncome = computeAvgHouseholdIncomeFromAnswers(a); // spec helper (IDs)
  const avgCartSize = computeAvgCartSizeFromAnswers(a);               // spec helper (IDs)
  return { monthlyAudience, avgHouseholdIncome, avgCartSize };
}
```

Takeaway: The Wizard is the source of truth for displayed results and correctly expects IDs for Q2/Q3.

---

### 4) Validation and gating

The Wizard validates per-step and again at calculation time depending on lead mode. After computing results, it stores both the bundle and a `finalScore` mirror of monthlyAudience to preserve historical gating logic.

```text
// frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (excerpts)
case "SET_RESULTS":
  return {
    ...state,
    finalResults: action.results,
    finalScore: action.results.monthlyAudience, // preserve old gate behavior
  };

// Render gate
if (state.finalScore !== undefined) {
  const r = state.finalResults;
  return r ? (
    // Render 3 results
  ) : (
    // Fallback to legacy Score display
  );
}
```

---

### 5) Draft persistence (sessionStorage)

The Wizard persists the draft (step index, answers, leadDraft) in sessionStorage under a versioned key. It loads on mount and saves on changes.

```text
// frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts (excerpts)
export const DRAFT_STORAGE_KEY = "pinterestPotential:draft:v1";

useEffect(() => {
  const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  if (isDraftShape(parsed)) setDraft(prev => ({ ...prev, ...parsed }));
  else window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
}, []);

useEffect(() => {
  window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}, [draft]);
```

Implication: If the stored draft predates the spec change (values instead of IDs for Q2/Q3), the Wizard will rehydrate mismatched shapes unless we migrate them.

---

### 6) Presentation of results

When results are present, the Wizard displays three KPIs and a recap of all answers. The recap uses labels resolved via the spec, correctly handling IDs for checkboxes.

```text
// frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (excerpts)
<div className="grid gap-3 sm:grid-cols-3">
  <Kpi title="Monthly Pinterest Audience" value={r.monthlyAudience} />
  <Kpi title="Avg Household Income" value={`$${r.avgHouseholdIncome.toLocaleString()}`} />
  <Kpi title="Avg Cart Size" value={`$${r.avgCartSize.toLocaleString()}`} />
</div>

// Recap uses getCheckboxLabels with IDs → labels via spec options
```

---

### 7) Investigation — “Result 1 shows 1”

Observed symptoms (from UI screenshot and replicate runs):
- Result 1 shows 1.
- Avg Household Income shows $30,000.
- Avg Cart Size shows $240.

Interpretation using current logic:
- Income defaulted to 30,000 indicates the primary region was undefined → the spec helper falls back to Global.
- Cart Size ≈ 240 indicates a base category around 200 with a 1.2 multiplier and region multiplier of 1.0 (Global), e.g., Q3 includes id 4 (base 200): round(200 × 1.0 × 1.2) = 240.
- Monthly audience ≈ 1 indicates the region sum term used in the formula is effectively zeroed (or near-zero), collapsing the product.

Most likely cause:
- A legacy draft in sessionStorage has Q2 stored as values (e.g., `[31000000]`) instead of IDs (e.g., `[4]`).
- The Wizard translates IDs → values. When given raw values, lookup by id fails, making sum(Q2) = 0. As a result:
  - Result 2 reverts to Global (30,000)
  - Result 3 uses Global region multiplier 1.0
  - Result 1 product shrinks toward 0 and can round to 1 depending on other factors

Call chain confirmation:
```text
handleNext() → computeResultsFromAnswers() → computeMonthlyAudienceFromAnswers()
  → sumCheckboxOptionValues("Q2", a.Q2)
  → dispatch(SET_RESULTS) → render results panel
```

---

### 8) Reproduction and validation checklist

To confirm the storage-mismatch hypothesis:
1. Run with an existing session (do nothing): Observe Result 1 = 1.
2. Hard refresh (without clearing sessionStorage): Problem likely persists.
3. Clear sessionStorage key `pinterestPotential:draft:v1` and refresh:
   - Expect Q2/Q3 to be stored as IDs.
   - Re-enter answers; Result 1 should scale to a large number consistent with selected region(s) and categories.

Programmatic spot-checks at compute time (temporary, non-committed logging):
- Log `state.answers.Q2` and `state.answers.Q3` before `SET_RESULTS`.
- Expect small integers (IDs like 4), not large values (like 31,000,000).

---

### 9) Mitigations and fix options

Short-term (operational):
- Instruct users to clear the session draft (`sessionStorage.removeItem("pinterestPotential:draft:v1")`).

Robust improvements (code):
- Draft migration on load: Detect legacy shapes for Q2/Q3 (entries ≥ 10,000) and convert values → IDs using the spec.
- Defensive compute: Where the Wizard translates IDs → values, add a fallback path that treats large numbers as values, reverse-maps them to IDs (or uses them directly for the sum) to avoid zeros.
- UI guardrail: If sum(Q2) = 0 but Q2 has entries, show a non-blocking note that the draft was migrated.

---

### 10) Appendix — Key snippets

Monthly audience formula (spec-aligned):
```text
round(
  sum(Q3 values) * sum(Q2 values) * Q1 * Q4 * Q5 * Q6 * (1.175 - 0.175 * Q7) * (1.15 - 0.15 * Q8),
  0
)
```

Primary region and result helpers (IDs):
```text
// frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts
export function getPrimaryRegionId(answers: Answers): number | undefined {
  const ids = answers.Q2;
  return Array.isArray(ids) && ids.length > 0 ? ids[0] : undefined;
}

export const REGION_META = {
  1: { label: "Global", avgHouseholdIncome: 30000, cartMultiplier: 1.0 },
  2: { label: "USA", avgHouseholdIncome: 75000, cartMultiplier: 1.15 },
  4: { label: "Europe", avgHouseholdIncome: 45000, cartMultiplier: 0.95 },
  // ...
} as const;

export function computeAvgHouseholdIncomeFromAnswers(a: Answers): number {
  const primary = getPrimaryRegionId(a) ?? 1;
  return REGION_META[primary as keyof typeof REGION_META]?.avgHouseholdIncome ?? 30000;
}

export function computeAvgCartSizeFromAnswers(a: Answers): number {
  const selected = Array.isArray(a.Q3) ? a.Q3 : [];
  const bases = selected
    .map(id => PRODUCT_CART_BASE[id as keyof typeof PRODUCT_CART_BASE])
    .filter((v): v is number => typeof v === "number" && v > 0);
  const avgBase = bases.length > 0 ? bases.reduce((x, y) => x + y, 0) / bases.length : 0;
  const primaryRegionId = getPrimaryRegionId(a) ?? 1;
  const regionMult = REGION_META[primaryRegionId as keyof typeof REGION_META]?.cartMultiplier ?? 1.0;
  return Math.round(avgBase * regionMult * 1.2);
}
```

---

### 11) References
- docs/pinterest-potential-v1-sprint-plan.md
- frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
- frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts
- frontend/lib/tools/pinterestPotential/compute.ts
- frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts
- frontend/components/ui/forms/CheckboxCardGrid.tsx
