# Pinterest Potential Calculator — Deep Implementation Audit (Reality-First)

Status: Confirmed repository state as of 2026-01-10 17:59 (local)

Scope: Only the Pinterest Potential Calculator and its direct dependencies. Descriptive only. Unknowns are explicitly marked with missing evidence. Every meaningful claim includes file path + line range (or symbol name).

0) Quick Index (what to read first)

1. frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 32–61, 70–90)
2. frontend/middleware.ts (lines 76–90, 125–146)
3. frontend/lib/tools/pinterestPotentialConfig.ts (lines 5–18)
4. frontend/lib/experiments/config.ts (lines 43–53, 59–61)
5. frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (lines 18–36)
6. frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx (entire file)
7. frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 97–115, 239–366)
8. frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts (lines 8–15, 59–86, 91–98)
9. frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts (types at lines 17–85; QUESTIONS at line 287)
10. frontend/lib/tools/pinterestPotential/compute.ts (lines 56–75, 97–107, 114–126)
11. frontend/lib/tools/pinterestPotential/leadMode.ts (lines 4–12, 15–35)
12. frontend/lib/tools/pinterestPotential/leadToken.ts (lines 7–27)
13. frontend/lib/hooks/useToolAnalytics.ts (lines 10–35)
14. frontend/lib/gtm.ts (lines 11–44)

1) Entry + Routing Behavior (Server Side)

- Route: /tools/pinterest-potential
  - File: frontend/app/(flow)/tools/pinterest-potential/page.tsx (entire file)

Entry sequence (as implemented):
1. Request hits route page.tsx. Evidence: export default PinterestPotentialPage (lines 32–61).
2. Variant resolution by precedence (resolvePinterestPotentialVariant):
   - 1) searchParams.variant if valid
   - 2) cookie value from PINTEREST_POTENTIAL_VARIANT_COOKIE
   - 3) DEFAULT_VARIANT
   Evidence: resolvePinterestPotentialVariant (lines 70–81); normalizeVariant (lines 83–90); cookie read at lines 34–38.
3. Lead mode resolution by precedence (resolveLeadMode):
   - requested searchParams.leadMode
   - cookie ppc_lead_mode (if present)
   - isKnownLead (logged-in user via getCurrentUser or tokenLead)
   - default
   Evidence: lines 39–50 (resolveLeadMode import and call), cookie read at line 44, user via getCurrentUser at lines 40, 54–55 for initial lead.
4. Initial lead derivation:
   - From resolveLeadFromToken(searchParams.t) if token present and decodes
   - Else from logged-in user (name/email)
   - Else undefined
   Evidence: lines 41–55; resolveLeadFromToken imported at line 14.
5. Component rendered:
   - VariantComponent is chosen from mapping { v1 → PinterestPotentialV1, v2 → PinterestPotentialV2 } (lines 20–26, 57–61).
   - Props passed: leadMode and initialLead to VariantComponent (line 60).

Redirects on entry: None in this page. Middleware may set experiment cookie but does not redirect for this public route. Evidence: frontend/middleware.ts (lines 79–88 for public paths handling and experiment application).

2) Variant System (V1 vs V2)

- Where variants are defined: frontend/lib/tools/pinterestPotentialConfig.ts
  - Type/enum: PinterestPotentialVariant = "v1" | "v2" (line 5)
  - DEFAULT_VARIANT = "v1" (line 7)
  - ALL_VARIANTS = ["v1", "v2"] (lines 10–11)
  - Cookie name: PINTEREST_POTENTIAL_VARIANT_COOKIE = "pp_variant" (line 17)

- GrowthBook experiment config mapping: frontend/lib/experiments/config.ts
  - PINTEREST_POTENTIAL_EXPERIMENT with variants and default (lines 43–53)
  - Registry includes pinterest_potential_variant (lines 59–61)

- Precedence order used by page:
  - query param variant → valid cookie → DEFAULT_VARIANT. Evidence: page.tsx (lines 70–81), cookie read (line 35), requestedVariant from searchParams (line 36).

- Component mapping for variants:
  - v1 → PinterestPotentialV1 (import at line 9; mapping lines 20–26)
  - v2 → PinterestPotentialV2 (import at line 10; mapping lines 20–26)

Differences (grounded by files):
- Entry component:
  - v1: frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (lines 18–36) renders the full wizard and wires analytics.
  - v2: frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx (entire file) is a placeholder shell with heading/paragraph only.

- Wizard component:
  - v1 uses PinterestPotentialWizard (V1 lines 30–35)
  - v2 has no wizard usage (placeholder)

- Step set and compute function:
  - v1 wizard uses QUESTIONS (spec) and computeResults from compute.ts. Evidence: Wizard imports QUESTIONS (lines 14–24) and computeResults (line 25), with usage at lines 354–356 and 364.
  - v2: no steps, no compute in placeholder.

Variant Table

| Variant | Entry component | Wizard component | Step set | Compute function used | Result output shape |
| - | - | - | - | - | - |
| v1 | PinterestPotentialV1.tsx (lines 18–36) | PinterestPotentialWizard.tsx | QUESTIONS from pinterestPotentialSpec.ts (line 287) | computeResults(answers) from compute.ts (line 97) | ResultsBundle { monthlyAudience, avgHouseholdIncome, avgCartSize } (compute.ts lines 80–85, 97–107) |
| v2 | PinterestPotentialV2.tsx (entire file) | None | None | None | None |

3) Wizard Architecture + Step Graph

- State machine overview: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
  - Local reducer state fields: stepIndex, answers, leadDraft, errors, finalResults/finalScore (lines 47–54)
  - Actions: SET_STEP, UPDATE_ANSWER, UPDATE_LEAD, SET_ERRORS, RESET_ERRORS, SET_SCORE, SET_RESULTS (lines 56–64; reducer at lines 65–95)
  - Step order source: QUESTIONS from spec (import lines 14–24); current step derived via state.stepIndex (e.g., lines 233–239 around current/steps usage)
  - Navigation: handlePrev reduces stepIndex by 1 if > 0 (lines 252–257); handleNext validates current step and advances or computes (lines 261–366)
  - Conditional step: Lead step exists as a question with type "lead" and is validated when encountered (lines 285–291 for validation; StepLead component wired in render paths — see StepLead import at line 37)
  - Validation rules per step are applied in handleNext and validateStepLocal (lines 99–115, 267–285)
  - Phase (wizard/results) is signaled to parent via onPhaseChange when results are set (lines 354–357)

Step sequence list (indices reference QUESTIONS array in spec; rendering implemented in Wizard):
- Step 0 → StepQ1.tsx
  - Inputs: single radio; answer key Q1 (Wizard updates via UPDATE_ANSWER)
  - Validation: required check at Wizard lines 268–273
- Step 1 → StepQ2.tsx
  - Inputs: checkbox; answer key Q2 (array of option ids)
  - Validation: required and non-empty array (Wizard lines 273–277)
- Step 2 → StepQ3.tsx
  - Inputs: checkbox; answer key Q3
  - Validation: same as Q2 (lines 273–277)
- Step 3 → StepQ4.tsx
  - Inputs: radio; Q4; validation (lines 268–273)
- Step 4 → StepQ5.tsx
  - Inputs: radio; Q5; validation (lines 268–273)
- Step 5 → StepQ6.tsx
  - Inputs: radio; Q6; validation (lines 268–273)
- Step 6 → StepQ7.tsx
  - Inputs: slider (1..5); Q7; validation including min/max bound check (lines 278–284)
- Step 7 → StepQ8.tsx
  - Inputs: slider (1..5); Q8; validation including min/max bound check (lines 278–284)
- Step 8 → StepQ9.tsx
  - Inputs: checkbox; Q9; validation (lines 273–277)
- Step 9 → StepLead.tsx
  - Inputs: name, email into leadDraft
  - Validation: validateEmail; required fields for name/email (lines 286–291)

Next condition: next advances when validation passes. On last step, compute and transition depends on lead mode (see section 6). Evidence: handleNext (lines 317–366).

4) State Model (Draft / Answers)

- Types and keys: frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts
  - QuestionType union (line 17)
  - Option type with id/value (lines 19–29)
  - Answers type with keys Q1..Q9 (lines 75–85); Q2/Q3/Q9 store option ids (comment lines 70–75)
  - Lead { name, email } (lines 87–90)

- Default initialization in Wizard: initial draft via usePinterestPotentialDraft
  - Hook file: frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts
  - DraftState shape: { stepIndex: number; answers: Answers; leadDraft?: Partial<Lead> } (lines 10–14)
  - DRAFT_STORAGE_KEY: "pinterestPotential:draft:v1" (line 8)
  - Wizard calls hook with initial draft (Wizard lines 182–190 mention; hook import at line 26); draft updating via updateDraft (Wizard uses dispatch+updateDraft together — see mentions around lines 181–190)

- State updates:
  - Answers updated via reducer action UPDATE_ANSWER (lines 69–75)
  - Lead updated via reducer action UPDATE_LEAD (lines 76–79)
  - Errors set/reset via SET_ERRORS/RESET_ERRORS (lines 80–84)

Draft shape outline (confirmed from code):
- draft.stepIndex: number (0-based)
- draft.answers: { Q1?: number; Q2?: number[]; Q3?: number[]; Q4?: number; Q5?: number; Q6?: number; Q7?: number; Q8?: number; Q9?: number[] }
- draft.leadDraft?: { name?: string; email?: string }

5) Persistence (Session/Local/URL)

Confirmed: sessionStorage persistence via usePinterestPotentialDraft hook.

- Storage key: DRAFT_STORAGE_KEY = "pinterestPotential:draft:v1". Evidence: frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts (line 8).
- Hydration (load): on mount, reads window.sessionStorage.getItem(DRAFT_STORAGE_KEY), parses JSON, validates shape and canonical checkbox ids, then merges into state; invalid shapes are cleared. Evidence: lines 59–78 (load/validation and removal).
- Write timing: persists on any draft change via window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft)). Evidence: lines 80–85.
- Clearing: clearDraft removes the key from sessionStorage. Evidence: lines 91–95.
- URL param persistence: Not used for draft state (beyond variant/leadMode/t). No evidence of encoding draft into URL.

6) Lead Capture Flow (LeadMode + Token)

- LeadMode resolution: frontend/lib/tools/pinterestPotential/leadMode.ts
  - Modes: "gate_before_results" | "optional_after_results" | "prefilled_or_skip" (line 4)
  - normalizeLeadMode maps synonyms (lines 6–13)
  - resolveLeadMode precedence: requested → cookieValue → isKnownLead shortcut (prefilled_or_skip) → default (gate_before_results). Evidence: lines 15–35.

- Token-derived lead: frontend/lib/tools/pinterestPotential/leadToken.ts
  - resolveLeadFromToken(token) returns Lead | undefined based on minimal stub logic: token === "demo" or base64("email:name"). Evidence: lines 7–27.

- StepLead component and field collection:
  - File: frontend/components/tools/pinterestPotential/steps/StepLead.tsx
  - Fields: name (text), email (email). Evidence: inputs and onChange at lines 13–21 and 24–31; error display via FieldError (lines 21–22, 31–33); privacy microcopy from PRIVACY_MICROCOPY (line 35).

- What constitutes submit:
  - In Wizard, on successful validation of lead step within handleNext, emits analytics event lead_submit and then proceeds. Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 305–315 for analytics emission, 317–366 for progression logic).
  - No API call is made for lead submission in current code; analytics only.

- Lead lifecycle sequence (gate_before_results mode):
  1) User completes Q1–Q9 with validation per step.
  2) Lead step requires valid name/email; on Next, lead_submit is fired (Wizard lines 306–315).
  3) If isLastStep, validation of all answers occurs; computeResults runs; phase changes to results (Wizard lines 342–357).

Confirmed event emission: lead_submit
- Payload: { location, tool_name, button_label } with tool_name="pinterest_potential" and button_label either "Calculate" (if last step) or "Continue". Evidence: Wizard (lines 308–314).

7) Compute + Results Model

- Compute engine: frontend/lib/tools/pinterestPotential/compute.ts
  - sumCheckboxOptionValuesById translates checkbox selected ids to values using spec options (lines 44–55)
  - computeScore implements the documented formula including seasonal/competition factors (lines 56–75)
  - ResultsBundle shape (lines 80–85): { monthlyAudience, avgHouseholdIncome, avgCartSize }
  - computeResults builds ResultsBundle from answers via computeScore and spec helpers (lines 97–107)
  - computeResult validates via validateAnswers and returns either errors or { ok: true, score, results } (lines 114–126)

- Where results are rendered:
  - Wizard sets finalResults and signals onPhaseChange("results"). Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 354–357).
  - V1 entry component reflects phase in heading text. Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (lines 18–26).

8) Copy + Content Sources

- Copy sources are primarily inline in step components and spec labels. Evidence:
  - Spec question labels/options: frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts (question and option labels across file; see types and question constants preceding QUESTIONS at line 287).
  - StepLead uses PRIVACY_MICROCOPY from copy module. Evidence: frontend/components/tools/pinterestPotential/steps/StepLead.tsx (line 5).
  - Copy module path referenced: frontend/lib/tools/pinterestPotential/copy (import in StepLead). Note: the exact file content is not shown in this audit; only usage is confirmed.
  - V1 heading and description copy inline. Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (lines 22–28).

Variant-specific copy branching:
- None implemented in V2 (placeholder). V1 displays phase-dependent heading. Evidence: V1 (line 24).

9) Analytics (Tool Contract as Implemented)

Helpers: frontend/lib/gtm.ts
- pushEvent(eventName, params) (lines 11–15)
- trackToolView(tool_name, location) (lines 17–19)
- trackToolStart(tool_name, location) (lines 21–23)
- trackLeadSubmit({ location, button_label, tool_name? }) (lines 25–31)
- trackCtaClick(button_label, extras?) (lines 33–44)

Hook: frontend/lib/hooks/useToolAnalytics.ts
- Fires tool_view once on mount with guard (useRef). Evidence: lines 20–25.
- Exposes trackToolStart callback computing location. Evidence: lines 27–33.

Callsites within this tool:
- tool_view: Fired when V1 mounts (through useToolAnalytics in V1). Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (lines 19–35) in combination with hook (lines 20–25).
- tool_start: Fired on first successful Next in wizard via onStart callback from V1. Evidence: Wizard (lines 297–304: guarded by hasStartedRef) and V1 passing onStart={trackToolStart} (V1 lines 30–35).
- lead_submit: Fired when lead step passes validation. Evidence: Wizard (lines 305–315).
- cta_click (outside tool page but related to opening it): Tools index page primary link click. Evidence: frontend/app/(site)/tools/page.tsx (lines 72–76) with trackCtaClick("Open calculator →", { location: "/tools" }).

Guards to prevent double firing:
- tool_view: useRef firedRef prevents double firing (useToolAnalytics.ts lines 12–25).
- tool_start: hasStartedRef in Wizard ensures first successful interaction only (Wizard lines 259, 297–304).
- lead_submit: No explicit dedupe guard beyond step type check and validation path (Wizard lines 305–315).

Timeline trace of a typical session:
1) tool_view → useToolAnalytics fires on V1 mount with payload { tool_name: "pinterest_potential", location: "/tools/pinterest-potential" } (hook lines 20–25; V1 lines 19–35)
2) tool_start → on first successful Next in Wizard, payload { tool_name: "pinterest_potential", location: pathname } (Wizard lines 297–304; hook lines 27–33)
3) lead_submit (if lead step completed) → payload { location, tool_name: "pinterest_potential", button_label } (Wizard lines 308–314)
4) cta_click (from tools index when opening) → payload { button_label: "Open calculator →", location: "/tools" } (tools/page.tsx lines 72–76)

No direct window.dataLayer.push outside helpers was found. Evidence: search for "dataLayer.push" returned none in app code (see Mandatory Repo Searches below).

10) External Dependencies (What the tool imports from outside itself)

Dependency table (selected imports and purpose):

| external module | why used | risk if rewritten (descriptive) |
| - | - | - |
| frontend/lib/hooks/useToolAnalytics.ts | Emits tool_view and provides trackToolStart used by V1 | Replacing could affect analytics semantics and dedupe guards |
| frontend/lib/gtm.ts | Canonical GTM event push helpers | Direct analytics contract for GA4/GTM events |
| frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts | Types, questions, and validation; used by Wizard and compute | Source of truth for step labels/options and validation |
| frontend/lib/tools/pinterestPotential/compute.ts | Deterministic scoring and results | Changing would alter results |
| frontend/lib/tools/pinterestPotential/leadMode.ts | Lead gating behavior resolution | Impacts when lead step is required/optional |
| frontend/lib/tools/pinterestPotential/leadToken.ts | Token-to-lead resolution | Impacts prefilled lead behavior |
| frontend/components/ui/forms/FieldError | UI error display in StepLead | UI feedback behavior in lead step |
| next/navigation (useSearchParams) | Reads query string in Wizard (import present) | Impacts any param-aware behavior in client wizard if used |
| next/headers cookies() | Server-side cookie read in page.tsx | Affects variant and lead mode resolution via cookie |
| frontend/lib/experiments/config.ts | Experiment registry and variant list | Impacts experiment cookie assignment consistency |
| frontend/lib/growthbook/middleware.ts | Middleware experiment cookie setter | Impacts variant cookie persistence |

11) Tests Covering Pinterest Potential

Test files (by search results):
- frontend/__tests__/pinterestPotential.compute.test.ts — covers compute engine (naming implies validation of computeResults/computeScore). Evidence: file path present in search results for "pinterestPotential".
- frontend/__tests__/pinterestPotential.optionalAfterResults.test.tsx — covers optional-after-results behavior (naming implies lead mode flow). Evidence: file path present in search results.
- frontend/__tests__/routes/pinterestPotentialPage.test.tsx — covers route/variant resolution and rendering. Evidence: file path present in search results.

Assertions content is not shown in this audit; only file existence is confirmed.

12) Known Unknowns / Ambiguities (Pinterest Potential Only)

- Exposure tracking (GrowthBook): Unknown. No explicit exposure event or tracking callback observed in tool code. Missing evidence: a client/server GrowthBook exposure callback invocation.
- Lead submission destination: No API call is made in lead step; only analytics event is fired. If any backend persistence is intended, it is not present here. Missing evidence: API routes for lead capture requests.
- Copy module content: StepLead imports PRIVACY_MICROCOPY but the underlying copy file content is not shown in this audit. Only usage is confirmed.

Mandatory Repo Searches (outcomes)

- usePinterestPotentialDraft
  - Hits:
    - frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts (definition at line 55)
    - frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (import at line 26; usage around line 182)

- sessionStorage and localStorage inside pinterestPotential files
  - sessionStorage hits:
    - frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts (getItem line 64, removeItem lines 71, 75, setItem line 83, removeItem line 93)
    - frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (comment references at line 4 and 181)
  - localStorage: No hits within pinterestPotential tool files confirmed by search (no evidence found).

- resolveLeadFromToken
  - Hits:
    - frontend/app/(flow)/tools/pinterest-potential/page.tsx (import at line 14, usage at lines 41–43)
    - frontend/lib/tools/pinterestPotential/leadToken.ts (definition at lines 7–27)

- leadMode
  - Hits:
    - frontend/app/(flow)/tools/pinterest-potential/page.tsx (import at line 13; resolveLeadMode used at lines 45–49)
    - frontend/lib/tools/pinterestPotential/leadMode.ts (normalize/resolve definitions at lines 6–13, 15–35)

- trackToolView / tool_view
  - trackToolView helper in frontend/lib/gtm.ts (lines 17–19)
  - Emission via useToolAnalytics.ts (lines 20–25)
  - V1 uses hook (frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx lines 19–35)

- trackToolStart / tool_start
  - trackToolStart helper in frontend/lib/gtm.ts (lines 21–23)
  - Emission via useToolAnalytics.ts trackStart (lines 27–33); Wizard triggers via onStart (lines 297–304 in Wizard)

- trackLeadSubmit / lead_submit
  - trackLeadSubmit helper in frontend/lib/gtm.ts (lines 25–31)
  - Emission in Wizard (frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx lines 306–315)

- pp_variant
  - Defined in frontend/lib/tools/pinterestPotentialConfig.ts (line 17)
  - Used by middleware cookie setter: frontend/lib/growthbook/middleware.ts (lines 59–76); page.tsx reads cookie (line 35)

- ?variant parsing
  - normalizeVariant in page.tsx handles requested variant (lines 83–90)
  - resolvePinterestPotentialVariant precedence function (lines 70–81)

- References to window.dataLayer and dataLayer.push
  - GTM injection defines window.dataLayer in frontend/app/layout.tsx (lines 45–51) and noscript tag (lines 55–63)
  - All pushes are via helpers (frontend/lib/gtm.ts). No direct window.dataLayer.push usage found elsewhere (search yielded none).

— End of Audit —
