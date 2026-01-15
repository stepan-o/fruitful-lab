### Pinterest Potential Calculator — AS-IS Implementation Audit (code-as-truth)

1) Executive Snapshot
- Public route(s) and entry points
  - Route: frontend/app/(flow)/tools/pinterest-potential/page.tsx (default export: PinterestPotentialPage)
  - Variants → components mapping:
    - welcome → frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (export: PinterestPotentialV1)
    - no_welcome → frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx (export: PinterestPotentialV2)
- Current wizard step count + high-level flow
  - Steps (V1 only): 8 questions (Q1–Q8) implemented as separate step components and orchestrated by frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx.
  - Presentational views: WelcomeView, WizardView, ResultsView under frontend/components/tools/pinterestPotential/views are used for layout/presentation; business logic remains in the Wizard (V1 path).
  - Flow (V1/welcome variant): Welcome → Q1..Q8 → computeResults → results; optional lead gate depends on leadMode. WelcomeView shows "Start" or "Resume" based on a sessionStorage heuristic and exposes a Reset that clears PPC-related session keys.
  - Note on V2 (no_welcome variant): PinterestPotentialV2.tsx is currently a placeholder shell and does NOT render the Wizard or analytics hooks.
- Variant system summary (where resolved + how persisted)
  - Resolution on page (server): resolvePinterestPotentialVariant() inside page.tsx
    - Precedence: query ?variant → cookie pp_variant → DEFAULT_VARIANT (welcome)
  - Persistence: cookie name pp_variant (from frontend/lib/tools/pinterestPotentialConfig.ts)
  - Assignment middleware: frontend/lib/growthbook/middleware.ts (applyExperimentCookies); sets pp_variant and fp_anon_id
  - GrowthBook: Edge adapter used in middleware, server helper in frontend/lib/growthbook/experiments.ts for server-side experimentation
- Draft persistence summary (where stored + schema version)
  - Storage: sessionStorage under key pinterestPotential:draft:v2
  - Hook: frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts
- Tracking summary (core events + where fired)
  - Generic GTM events defined in frontend/lib/gtm.ts: tool_view, tool_start, lead_submit, cta_click
  - Fired:
    - tool_view: by useToolAnalytics hook (frontend/lib/hooks/useToolAnalytics.ts) on mount of PinterestPotentialV1. V2 does NOT fire tool_view (no hook present).
    - tool_start: PinterestPotentialV1 passes trackToolStart to Wizard via onStartAction; Wizard invokes onStartAction when the flow starts. V2 does not wire Wizard.
    - lead_submit: fired in Wizard when lead is submitted in both hard lock and soft lock panels (V1 only; V2 has no lead UI).
  - ppc_* events are defined in gtm.ts (ppc_view_start, ppc_start, ppc_answer, ppc_complete, ppc_cta_click, ppc_lead_view, etc.) but NOT referenced in the Wizard. DISCREPANCY: helpers exist; flow doesn’t use them yet.

2) File Map (Source of Truth Index)
- UI entry route/page/layout
  - frontend/app/(flow)/tools/pinterest-potential/page.tsx
    - Exports: default async function PinterestPotentialPage, resolvePinterestPotentialVariant, normalizeVariant
    - Responsibility: server-side variant resolution; leadMode resolution; initial lead derivation from user or token; choose variant component
- Wizard controller/component(s)
  - frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
    - Exports: default component
    - Responsibility: orchestrates steps Q1–Q8, state management, draft persistence integration, compute invocation, lead gating UI, analytics callbacks for start and lead submit; composes presentational views
- Variant shells
  - frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx
    - Exports: PinterestPotentialV1
    - Responsibility: wraps Wizard; tracks tool_view via useToolAnalytics; passes onStart (tool_start) and leadMode/initialLead
  - frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx
    - Exports: PinterestPotentialV2
    - Responsibility: placeholder shell for no_welcome (does NOT render Wizard, analytics hooks, or lead gating; renders a simple heading/paragraph only)
- Presentational views (stateless)
  - frontend/components/tools/pinterestPotential/views/WelcomeView.tsx
    - Exports: default WelcomeView
    - Responsibility: renders hero/welcome; exposes onStart/onReset; shows Resume/Start label via sessionStorage heuristic; calls a local safeClearPpcSessionDrafts() to remove PPC-related keys on reset
  - frontend/components/tools/pinterestPotential/views/WizardView.tsx
    - Exports: default WizardView
    - Responsibility: presentational shell for step screens (progress bar, header, error banner, Back/Continue controls)
  - frontend/components/tools/pinterestPotential/views/ResultsView.tsx
    - Exports: default ResultsView
    - Responsibility: presentational results renderer for audience/opportunity/income cards and CTA hooks; no business logic
- Step definitions/spec (business model)
  - frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts
    - Exports (selected): Segment, LeadMode, LeadState, PrimaryGoal, Answers type, validateAnswers(), validateLead(), getNicheOptions(), getPrimaryGoalOptions(), prompts helpers
    - Responsibility: canonical spec for answers, validation, type guards
- Step UI components
  - frontend/components/tools/pinterestPotential/steps/Q1Segment.tsx … Q8GrowthMode.tsx and ppcV2Types.ts
    - Responsibility: UI for each step; emit onChange and onAutoAdvance to Wizard
- Draft hook/store + storage key(s)
  - frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts
    - Exports: DRAFT_STORAGE_KEY = "pinterestPotential:draft:v2", usePinterestPotentialDraft(initial)
    - Responsibility: sessionStorage v2 read/merge/persist/clear; schema guards
- Compute/scoring module(s)
  - frontend/lib/tools/pinterestPotential/compute.ts
    - Exports: computeResults(answers), computeResultsUnsafe(answers)
    - Responsibility: validate inputs, apply benchmarks and multipliers, return ranged results + inferred indices + optional insight
  - Dependencies:
    - frontend/lib/tools/pinterestPotential/benchmarks.ts (getBenchmark, BENCHMARK_MAP)
    - frontend/lib/tools/pinterestPotential/multipliers.ts (MULTIPLIERS, MULTIPLIER_INTENSITY, softenMultiplier, safeMultiplier)
    - frontend/lib/tools/pinterestPotential/insight.ts (buildInsightFromBenchmark)
    - frontend/lib/tools/pinterestPotential/audiencePreview.ts (audiencePreviewFromRange, getAudiencePreviewLevel) — used by Q2 UI badges; does not affect computeResults
- Lead capture + submission path
  - Lead validation: validateLead in pinterestPotentialSpec.ts
  - Lead submission event: trackLeadSubmit in frontend/lib/gtm.ts
  - Network submission: no API call implemented in Wizard (GAP). Only GTM lead_submit is fired.
- Analytics/tracking module(s)
  - frontend/lib/gtm.ts — pushEvent(), trackToolView, trackToolStart, trackLeadSubmit, trackCtaClick, plus ppc_* events (not used yet in Wizard)
  - frontend/lib/hooks/useToolAnalytics.ts — fires tool_view on mount; exposes trackToolStart
- GrowthBook/experiments integration
  - Config: frontend/lib/experiments/config.ts (PINTEREST_POTENTIAL_EXPERIMENT)
  - Server-side helper: frontend/lib/growthbook/experiments.ts (runServerExperiment)
  - Edge middleware: frontend/lib/growthbook/middleware.ts (applyExperimentCookies)
  - Flags adapter and tests: frontend/lib/growthbook/flags.ts, __tests__/flags.test.ts
- Middleware/cookie helpers
  - Variant cookie: pp_variant (from frontend/lib/tools/pinterestPotentialConfig.ts)
  - Experiment cookies helper: getExperimentCookieName in middleware.ts
  - Anonymous id cookie for bucketing: fp_anon_id

3) Runtime Flow Walkthrough (cold load → result)
- initial mount (server → client)
  - On request, middleware may set fp_anon_id and pp_variant if missing (applyExperimentCookies).
  - Page server component reads cookies() and searchParams; resolves variant using resolvePinterestPotentialVariant(requested, cookieValue).
  - Page resolves leadMode via resolveLeadMode({ requested: searchParams.leadMode, cookieValue: cookie, isKnownLead }), where isKnownLead is true if getCurrentUser() returns user or resolveLeadFromToken(searchParams.t) returns a Lead.
  - Page computes initialLead: token lead > user-derived lead > undefined; renders VariantComponent with props { leadMode, initialLead }.
- client mount
  - useToolAnalytics fires tool_view once per mount for the tool path and tool name "pinterest_potential".
  - V1 only: Wizard mounts; it integrates usePinterestPotentialDraft, which rehydrates sessionStorage key pinterestPotential:draft:v2 if present; otherwise starts from provided initial.
  - V2: Placeholder component only; no wizard/draft/analytics wiring.
- variant selection (priority order)
  - On the server page: ?variant query → pp_variant cookie → DEFAULT_VARIANT (welcome). No GrowthBook call on the page itself.
  - On middleware: If pp_variant cookie absent, tries GrowthBook Edge client; if disabled/unavailable, falls back to local weights; persists pp_variant.
- wizard initialization (default state)
  - usePinterestPotentialDraft(initial) is called with an initial DraftStateV2 from the Wizard (includes stepIndex, started, answers, and optional variant). The hook merges any stored draft if shape-valid; otherwise uses provided initial and clears invalid JSON.
- step transitions and validation gates
  - Each step component emits onChange and optional onAutoAdvance, Wizard updates draft.answers and navigates to next step.
  - Input validation for compute is enforced prior to computing via validateAnswers in computeResults; UI also performs local validation per step components (e.g., ensuring selections).
  - Lead validation uses validateLead before firing lead_submit.
- persistence writes (when/what)
  - usePinterestPotentialDraft useEffect persists the entire draft state to sessionStorage on every draft change, key pinterestPotential:draft:v2.
  - The hook’s safeWriteSession guards against SSR and storage exceptions.
- compute invocation timing
  - Wizard constructs specAnswers and calls computeResults(specAnswers) when moving to results screen. If invalid, computeResults returns { ok: false, errors } and Wizard handles errors; otherwise ok with ResultsBundle.
- lead step behavior
  - Hard lock: A capture panel is shown before results; requires email (and name if configured). On submit, validateLead is run; on success, trackLeadSubmit(...) is fired; actual network submission is TODO; state setLeadSubmitted(true) unlocks results.
  - Soft lock: Results are visible; optional email panel allows sending the snapshot; clicking submit validates email only if provided; trackLeadSubmit is fired on submit; no network call.
  - Known lead: LEAD_GATING_CONFIG.known_lead_behavior == "skip"; capture UI is skipped; lead_mode still provided in telemetry contexts.
- final result rendering
  - V1: After compute ok, the Wizard renders results using ResultsView; opportunity label inferred using helper opportunityLabel in Wizard; also uses compute results’ inferred indices and insight.
  - V2: No results rendering path (placeholder only).
- refresh/back/new tab behavior
  - Refresh/new tab within same session: sessionStorage draft ensures persistence (pinterestPotential:draft:v2). Hook merges parsed draft onto initial state if shape-valid. Invalid JSON or shape clears the storage key.
  - Browser back/forward: routing is a single-page wizard; step index presumably stored in draft.stepIndex; moving back should honor the stored index. UNVERIFIED: precise back button handling location in Wizard not extracted here; would inspect how navigation UI updates stepIndex.
- welcome view specifics (welcome variant)
  - WelcomeView computes a hasDraft flag via a sessionStorage heuristic that searches for keys matching /(pinterestPotential|pinterest_potential|ppc).*(draft|state|wizard|progress)/i and attempts to parse progress. This switches the primary CTA label to "Resume" when progress exists.
  - WelcomeView handleReset() calls onReset() from the parent, then clears PPC-related sessionStorage keys using safeClearPpcSessionDrafts() and updates local UI state immediately.

4) Variant Resolution: Exact Precedence + Storage
- Supported variants (exact string literals)
  - "welcome" | "no_welcome" (frontend/lib/tools/pinterestPotentialConfig.ts)
- Precedence (page resolver resolvePinterestPotentialVariant):
  1) query param ?variant=welcome|no_welcome
  2) cookie pp_variant if valid
  3) DEFAULT_VARIANT (welcome)
- Cookie read/write
  - Read: page.tsx via cookies().get(PINTEREST_POTENTIAL_VARIANT_COOKIE)
  - Write: middleware applyExperimentCookies() sets pp_variant if missing
  - Cookie options in middleware: path "/", httpOnly: false, sameSite: "lax", maxAge ≈ 90 days
- GrowthBook invocation
  - Middleware: uses edgeAdapter growthbookAdapter (frontend/lib/growthbook/edgeAdapter via import path alias) to eval enable_{gbKey} and gbKey; attributes include { id: anonId } where anonId persists in fp_anon_id cookie
  - Server helper: frontend/lib/growthbook/experiments.ts runServerExperiment(def) uses growthbookAdapter from flags.ts, identify(), enable flag enable_{def.gbKey}, returns { variant, source: "growthbook" | "fallback" }
  - Fallback behavior: if GB disabled or errors, choose via local weights (equal split) or random if weights invalid
- Variant effects in UI
  - page.tsx chooses VariantComponent from VARIANT_COMPONENTS mapping; how component behavior differs is by component implementation.
    - V1: Heading appends " — Results" in the results phase; uses shared Wizard component and presentational views.
    - V2: Placeholder; does not invoke Wizard at all.

5) Wizard Steps: Canonical Step List
- Ordered steps and mapping
  1) Q1 — ./steps/Q1Segment.tsx → writes answers.segment (Segment)
  2) Q2 — ./steps/Q2Niche.tsx → writes answers.niche (string slug)
  3) Q3 — ./steps/Q3Volume.tsx → writes answers.volume_bucket (VolumeBucket)
  4) Q4 — ./steps/Q4Visual.tsx → writes answers.visual_strength (VisualStrength)
  5) Q5 — ./steps/Q5Site.tsx → writes answers.site_experience (SiteExperience)
  6) Q6 — ./steps/Q6Offer.tsx → writes answers.offer_clarity (OfferClarity)
  7) Q7 — ./steps/Q7Goal.tsx → writes answers.primary_goal (string; mapped to spec slugs in Wizard via mapGoalToSpec)
  8) Q8 — ./steps/Q8GrowthMode.tsx → writes answers.growth_mode (GrowthMode)
- Validation rules
  - Step UI ensures a selection before auto-advance; compute-time validation via validateAnswers in pinterestPotentialSpec.ts (lines 403–447)
  - validateLead for capture steps (pinterestPotentialSpec.ts lines 449–460)
- Branching
  - Prompts in Q3 & Q6 adapt to segment (prompt helpers in spec: getQ3Prompt, getQ6Prompt). No evidence of step skipping/branch paths beyond prompt variation. UNVERIFIED: if variant=no_welcome skips a welcome screen, Wizard likely sets started differently; steps remain 8.
- Number of steps defined in code
  - 8 step components are imported and referenced in Wizard; DraftStateV2 stepIndex validated to 1..8 (usePinterestPotentialDraft.ts lines 29–45)

6) Draft Persistence: Schema + Safety
- Storage mechanism
  - sessionStorage
- Storage key(s)
  - pinterestPotential:draft:v2 (DRAFT_STORAGE_KEY)
- Draft schema shape (types/fields)
  - DraftStateV2 in usePinterestPotentialDraft.ts lines 28–36:
    - stepIndex: number (1..8)
    - started: boolean
    - answers: AnswersV2 { segment?, niche?, volume_bucket?, visual_strength?, site_experience?, offer_clarity?, primary_goal?, growth_mode? }
    - variant?: "welcome" | "no_welcome"
- Versioning, migration/cleanup logic
  - v2 key baked into storage key
  - On load: JSON.parse + isDraftShape strict validation; if invalid shape or JSON, storage key is removed (safeRemoveSession) and initial provided state is used
- Merge strategy when loading existing draft
  - If parsed draft is shape-valid, returned value is { ...initial, ...parsed } — i.e., parsed draft overlays initial to preserve default for new fields
- Clear/reset behavior
  - clearDraft() removes storage key; Wizard could reset state accordingly
- Edge cases
  - Invalid JSON: caught and removed; initial returned
  - Schema mismatch: isDraftShape rejects and removes key
  - SSR guards: safeReadSession/write/remove early-return if window undefined; try/catch around storage operations

7) Compute/Scoring: Inputs → Outputs
- Compute entrypoint and signature
  - computeResults(answers: Answers): ComputeResult (ok/results or ok=false/errors)
  - computeResultsUnsafe(answers: Answers): ResultsBundle or throws
- Inputs consumed
  - Spec answers Q1–Q8 based on pinterestPotentialSpec.Answers; Wizard maps UI answers to spec slugs (notably Q7 via mapGoalToSpec(segment, raw))
- Output model
  - ResultsBundle fields:
    - audience_est: Range {low, high}
    - opportunity_est: { type: OpportunityType; low: number; high: number }
    - income_est: Range
    - inferred: { seasonality_index, competition_index, tags? }
    - insight_line?: string | null
- Constants/spec tables
  - Benchmarks: frontend/lib/tools/pinterestPotential/benchmarks.ts — rows keyed by (segment,niche), flattened into BENCHMARK_MAP; getBenchmark throws if missing
  - Multipliers: frontend/lib/tools/pinterestPotential/multipliers.ts — config for volume_bucket, visual_strength, site_experience, offer_clarity, growth_mode, plus seasonality/competition and optional goal_micro_adjust; intensities enforce subtlety; softening + clamps in compute
  - Insight: frontend/lib/tools/pinterestPotential/insight.ts — builds one-line planning-advantage insight from benchmark row
- Determinism
  - Given the same inputs and static configs, computeResults is deterministic and pure (no random sources). Randomness only exists in experiment fallback variant choice.

8) Analytics & Tracking (precise)
- Defined events in frontend/lib/gtm.ts
  - tool_view(location, tool_name)
  - tool_start(location, tool_name)
  - lead_submit({ location, button_label, tool_name? })
  - cta_click(button_label, { location?, tool_name? })
  - ppc_* family (context-rich):
    - ppc_view_start, ppc_start, ppc_answer, ppc_complete, ppc_cta_click, ppc_lead_view (see gtm.ts for payloads). Payloads include tool_name (default "pinterest_potential"), location, variant, lead_mode, lead_state, segment, niche, primary_goal, and inferred indices for completion/cta.
- Actual triggers in the calculator flow (AS-IS)
  - tool_view: fired by useToolAnalytics inside PinterestPotentialV1. PinterestPotentialV2 does NOT import/use this hook; no tool_view fired on the V2 path.
  - tool_start: PinterestPotentialV1 passes onStartAction={trackToolStart} to Wizard; Wizard calls onStartAction() at flow start. V2 does not wire Wizard.
  - lead_submit: fired in Wizard’s hard lock and soft lock submit handlers (V1 only).
  - cta_click: defined but not found in Wizard; search for trackCtaClick in Wizard returned nothing. GAP
  - ppc_* events: defined but unused in Wizard (search for "ppc_" returned nothing). GAP
- Client/server
  - All GTM events in gtm.ts push to window.dataLayer on client only (guarded by getDataLayer). No server-side firing.
- Experiments exposure logging
  - frontend/lib/growthbook/flags.ts registers tracking callback; __tests__/flags.test.ts verifies that exposures call logExperimentEvent with type: "exposure", experimentKey: "pinterest_potential_variant", variant, source: "growthbook". The adapter implementation itself not shown here but tests assert contract.

9) API / Network Calls
- Experiment events endpoint
  - frontend/lib/experiments/track.ts → logExperimentEvent(payload) posts JSON to /api/experiment-events (POST)
- trackConversion(eventName, props?) → convenience wrapper
- Calculator/lead network calls
  - None implemented in Wizard; explicit TODO comment before setLeadSubmitted(true). Lead submission currently only tracked via GTM lead_submit event.
- GrowthBook
  - Edge and server adapters initialize GB clients; no explicit network calls visible here beyond adapter initialize; not audited further.

10) Test Coverage
- Variant resolver/page tests
  - frontend/__tests__/routes/pinterestPotentialPage.test.tsx
    - Asserts resolver precedence (query over cookie, cookie used when present, default fallback) and rendering of mocked variant components
- GrowthBook server experiment helper tests
  - frontend/lib/growthbook/__tests__/experiments.test.ts
    - Asserts GB enable flag gating, value usage, fallback to local weights, and identify() call
- GrowthBook flags adapter exposure tracking tests
  - frontend/lib/growthbook/__tests__/flags.test.ts
    - Asserts tracking callback registered and forwards to logExperimentEvent; dev logs only in development
- Experiments tracking helper tests
  - frontend/lib/experiments/__tests__/track.test.ts
    - Asserts POST shape and payload for exposure and conversion
- Gaps (high priority)
  - No tests for PinterestPotentialWizard runtime (step transitions, compute invocation, lead gating UIs)
  - No tests for sessionStorage draft behavior (rehydration/merge/clear on invalid JSON)
  - No tests asserting GTM tool_start invocation timing within Wizard
  - No tests for ppc_* analytics firing (not implemented in Wizard)
  - No API tests for lead submission (feature not implemented)

11) Known Risks / Sharp Edges (from code)
- Analytics drift
  - ppc_* analytics defined but not used → insight loss and attribution gaps vs spec; tool relies on generic events only.
- Lead submission not wired
  - GTM event emitted but no backend submission; risk of losing leads if GTM blocked or dataLayer not processed.
- Variant feature flag ENABLE_AB_SPLIT
  - frontend/lib/tools/pinterestPotentialConfig.ts exports ENABLE_AB_SPLIT=false but page resolver doesn’t consult it; middleware assigns pp_variant regardless. DISCREPANCY: flag unused in resolver path.
- Variant V2 path is a placeholder
  - The no_welcome variant currently renders a placeholder shell without Wizard, analytics, or compute wiring. If traffic is routed to this variant, users will not see the intended flow and analytics coverage will be lost.
- SessionStorage persistence
  - Autosave every draft change; if large objects or frequent updates, can cause write churn; however hook is guarded and minimal.
  - Shape validation strictness means any extra fields added by future versions will be dropped unless initial provides defaults.
- Compute dependency gaps
  - getBenchmark throws if missing; UI should guard niche set. Wizard likely ensures Q2 chosen, but if not, compute would return error via validateAnswers; safe.
- Edge-mode GrowthBook
  - If edge adapter initialize throws, middleware falls back to local weights; deterministic exposure logging may be absent in that path.
- Unverified navigation/back behavior
  - It’s assumed Wizard manages stepIndex consistently; precise back button logic not documented here.

12) Recommendations (post-audit; no changes made now)
- P0 (low-risk fixes)
  - Wire ppc_* events in Wizard at key points (view start, start, per-answer, complete, cta clicks) using helpers in frontend/lib/gtm.ts. Files to touch: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (emit events) and optionally views/WelcomeView.tsx for view start context.
  - Respect ENABLE_AB_SPLIT in page resolver/middleware or remove it to avoid dead code. Files: frontend/lib/tools/pinterestPotentialConfig.ts, frontend/app/(flow)/tools/pinterest-potential/page.tsx (document behavior), and optionally middleware docstring.
  - Add minimal network submission for leads with error handling. File: Wizard, create backend endpoint under frontend/app/api/leads/route.ts (if architecture allows) or reuse existing backend.
  - Either (a) hide/disable the no_welcome variant in assignment, or (b) implement V2 to wrap the Wizard similarly to V1 so behavior and analytics are consistent. Files: frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx and assignment strategy.
- P1 (small refactors)
  - Extract a canonical StepSpec array in Wizard to drive ordered steps and ids; aids testing and analytics mapping. File: PinterestPotentialWizard.tsx.
  - Add a thin analytics wrapper in Wizard that enriches events with variant, lead_mode, lead_state, and current answers (segment/niche/goal) so ppc_* events have consistent payloads.
  - Add tests for resolveLeadMode paths and known_lead behavior. Files: frontend/lib/tools/pinterestPotential/leadMode.ts tests.
- P2 (deeper improvements)
  - Implement server-side lead capture with signed lead token returned to support known-lead revisit flows. Files: new API route, enhance resolveLeadFromToken with signing/verification.
  - Introduce analytics provider abstraction to optionally mirror events to an internal endpoint for auditability.

UNVERIFIED items and next inspection targets
- Exact back button and stepIndex management → inspect full PinterestPotentialWizard.tsx for navigation handlers.
- Variant-specific branches inside Wizard (welcome vs no_welcome) → search within Wizard for draft.started and draft.variant usage.
- V2 shell: VERIFIED placeholder — frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx renders only a heading/paragraph and does not wire Wizard or analytics.
