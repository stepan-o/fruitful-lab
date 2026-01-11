Evidence‑backed list of files that still reference v1/v2 variant names

Below is the concrete list of files that still reference the Pinterest Potential variant names "v1" and/or "v2". Each bullet includes the exact file path and the specific line(s) where the reference appears.

Runtime code
- frontend/lib/tools/pinterestPotentialConfig.ts
  - Line 16: type PinterestPotentialVariant = "v1" | "v2";
  - Lines 37–39: START_EXPERIENCE_TO_VARIANT mapping includes welcome: "v1" and no_welcome: "v2".
  - Lines 45–50: VARIANT_ALIASES includes { v1: "v1", v2: "v2", welcome: "v1", no_welcome: "v2" }.
  - Line 52: DEFAULT_VARIANT = "v1".
  - Lines 55–56: ALL_VARIANTS = ["v1", "v2"].
  - Line 66: Comment explicitly mentions ["v1","v2"].

- frontend/lib/experiments/config.ts
  - Lines 55–63: PINTEREST_POTENTIAL_EXPERIMENT.variants = PINTEREST_ALL_VARIANTS and defaultVariant uses PINTEREST_DEFAULT_VARIANT, which currently resolve to ["v1","v2"] and "v1" from pinterestPotentialConfig.ts.

- frontend/lib/growthbook/middleware.ts
  - Lines 21–26: normalizeVariant validates against the experiment’s variants (which currently are ["v1","v2"]).
  - Lines 68–76: Cookie is set to the chosen variant value; with current config this persists "v1"/"v2".

- frontend/app/(flow)/tools/pinterest-potential/page.tsx
  - Lines 88–95: normalizeVariant(value) accepts only values present in ALL_VARIANTS (currently ["v1","v2"]).
  - Note: No literal "v1"/"v2" strings here, but acceptance depends on the ALL_VARIANTS list above.

- frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx
  - Line 24: UI heading contains literal "v1": "… — {phase === "results" ? "Results" : "v1"}".

- frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx
  - Line 8: UI heading contains literal "v2": "… — v2 (placeholder)".

Tests
- frontend/__tests__/routes/pinterestPotentialPage.test.tsx
  - Lines 14–16: resolvePinterestPotentialVariant("v2", "v1") expectation.
  - Lines 25–28: expect(["v1", "v2"]).toContain(v) assertion.
  - Lines 32–33: expect(["v1", "v2"]).toContain(v) assertion.
  - Line 43: cookie mock value "v1".
  - Line 52: cookie mock value "v1".
  - Line 61: cookie mock value "v2".

- frontend/lib/experiments/__tests__/config.test.ts
  - Line 14: expect(exp.variants).toContain("v1").
  - Line 31: expect(PINTEREST_POTENTIAL_EXPERIMENT.variants).toEqual(["v1", "v2"]).
  - Line 37: const sum = ["v1", "v2"].reduce(…).

- frontend/lib/growthbook/__tests__/experiments.test.ts
  - Line 39: makeClient(true, "v1").
  - Line 41: expect({ variant: "v1", …}).
  - Line 54: expect(["v1", "v2"]).toContain(res.variant).

- frontend/lib/growthbook/__tests__/middleware.apply.test.ts
  - Line 45: expect(["v1", "v2"]).toContain(call.value).
  - Line 49: makeReq({ [PINTEREST_POTENTIAL_VARIANT_COOKIE]: "v1" }).

- frontend/lib/growthbook/__tests__/middleware.test.ts
  - Line 20: expect(normalizeVariant("v1")).toBe("v1").
  - Line 88: const valid = "v1".

- frontend/app/api/experiment-events/__tests__/route.test.ts
  - Line 59: variant: "v1".

Docs (non-runtime)
- docs/EXPRERIMENTS.md
  - Line 20: Variants: "v1", "v2".
  - Line 224: Value is "v1" or "v2".
  - Line 235: Cookie flips between "v1" and "v2".
  - Line 277: DEFAULT_VARIANT (likely "v1").
  - Line 296: variant: "v1" or "v2".
  - Line 327: Copy the value ("v1" or "v2").
  - Line 338: Example that defaults to "v1".

- docs/tools/pinterest-potential-calculator/PINTEREST_POTENTIAL_IMPLEMENTATION_AUDIT_PRE_V1.md
  - Lines 56–58: Explicitly lists PinterestPotentialVariant = "v1" | "v2"; DEFAULT_VARIANT = "v1"; ALL_VARIANTS = ["v1", "v2"].

- docs/_archived/tech_hub_v1_implementation_snapshot.md
  - Line 331: Mentions variants ["v1", "v2"].
  - Line 406: Uses variant key ("v1" or "v2").

- docs/REPO_GROUNDING_PACK.md
  - Line 99: pinterest_potential_variant aligns with tool variants ("v1","v2").

- docs/tools/pinterest-potential-calculator/PPC_VNEXT_REUSE_INSPECTION.md
  - Line 15: Notes experiment variants ["v1","v2"].

- docs/tools/pinterest-potential-calculator/pinterest-potential-calculator-v1.0-sprint-plan.md
  - Line 67: Mentions replacing ["v1","v2"] → ["welcome","no_welcome"].

Notes
- The strongest runtime source of truth for the remaining v1/v2 assumption is frontend/lib/tools/pinterestPotentialConfig.ts (type union, default, and list).
- Middleware and experiment plumbing (frontend/lib/experiments/config.ts and frontend/lib/growthbook/middleware.ts) derive their accepted/written values from that config; while they don’t hardcode the strings, they currently operate on ["v1","v2"].
- The page resolver’s normalizeVariant relies on ALL_VARIANTS from the same config, so it currently accepts only ["v1","v2"].
