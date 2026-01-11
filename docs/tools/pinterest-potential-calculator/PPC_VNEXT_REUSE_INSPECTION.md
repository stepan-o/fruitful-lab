------------------------------------------------------------
A) Tool entry / routing / variant plumbing (confirm + reuse points)
------------------------------------------------------------

What exists now
- Variant selection precedence for /tools/pinterest-potential:
  - 1) query (?variant) → 2) cookie → 3) default. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 64–81) function resolvePinterestPotentialVariant; normalizeVariant (lines 83–90).
- The page reads the variant cookie name from config and respects a search param override:
  - Cookie read: cookies().get(PINTEREST_POTENTIAL_VARIANT_COOKIE)?.value. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 34–38).
  - Cookie constant: PINTEREST_POTENTIAL_VARIANT_COOKIE = "pp_variant". Evidence: frontend/lib/tools/pinterestPotentialConfig.ts (lines 16–18).
- Variant cookie assignment via middleware on tool paths:
  - Middleware calls applyExperimentCookies for /tools/pinterest-potential routes. Evidence: frontend/middleware.ts (lines 79–87, 125–131, 133–146).
  - Cookie set with attributes: path="/", httpOnly=false, sameSite="lax", maxAge≈90 days. Evidence: frontend/lib/growthbook/middleware.ts (lines 71–77).
- Experiment key and variants registry (GrowthBook-aligned):
  - Experiment key: "pinterest_potential_variant"; variants: ["v1","v2"]; default from config. Evidence: frontend/lib/experiments/config.ts (lines 43–53).
- Local normalize/validation for variants used by middleware:
  - normalizeVariant ensures the cookie or query only accepts defined variants. Evidence: frontend/lib/growthbook/middleware.ts (lines 21–26).
- A/B enablement flag exists but currently disabled:
  - ENABLE_AB_SPLIT = false (documentation of future behavior). Evidence: frontend/lib/tools/pinterestPotentialConfig.ts (lines 12–15, 19–27).
- Lead-related params/cookies on entry:
  - searchParams include leadMode and t (token). Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 28–33, 40–55).
  - Optional future cookie "ppc_lead_mode" is read if present. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 44–49).
  - Lead mode resolved with resolveLeadMode(requested,cookie,isKnownLead). Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 45–49) and frontend/lib/tools/pinterestPotential/leadMode.ts (lines 15–35).
  - Known lead inferred from current user or a token decoded by resolveLeadFromToken. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 40–55) and frontend/lib/tools/pinterestPotential/leadToken.ts (lines 7–27).

Direct reuse candidates
- Variant resolver function resolvePinterestPotentialVariant. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 64–81).
- Experiment cookie plumbing (applyExperimentCookies + PINTEREST_POTENTIAL_VARIANT_COOKIE). Evidence: frontend/lib/growthbook/middleware.ts (lines 53–77); frontend/lib/tools/pinterestPotentialConfig.ts (lines 16–18).
- Experiment definition PINTEREST_POTENTIAL_EXPERIMENT for variant set. Evidence: frontend/lib/experiments/config.ts (lines 43–53).
- Lead mode resolver resolveLeadMode. Evidence: frontend/lib/tools/pinterestPotential/leadMode.ts (lines 15–35).
- Known lead token reader resolveLeadFromToken. Evidence: frontend/lib/tools/pinterestPotential/leadToken.ts (lines 7–27).


------------------------------------------------------------
B) Analytics / telemetry plumbing (new ppc_* event contract)
------------------------------------------------------------

What exists now
- GTM injection and dataLayer initialization:
  - window.dataLayer initialized and GTM script injected when NEXT_PUBLIC_GTM_ID is set. Evidence: frontend/app/layout.tsx (lines 32–53, 55–63).
- Generic pushEvent helper used for all analytics:
  - pushEvent(eventName, params) calls dataLayer.push({event,...}). Evidence: frontend/lib/gtm.ts (lines 11–15).
- Existing helpers and naming:
  - trackToolView → event "tool_view". Evidence: frontend/lib/gtm.ts (lines 17–19).
  - trackToolStart → event "tool_start". Evidence: frontend/lib/gtm.ts (lines 21–23).
  - trackLeadSubmit → event "lead_submit". Evidence: frontend/lib/gtm.ts (lines 25–31).
  - trackCtaClick → event "cta_click" with button_label, location, tool_name?. Evidence: frontend/lib/gtm.ts (lines 33–44).
- Dedupe guards for view/start on tools:
  - useToolAnalytics fires trackToolView once using a ref guard and exposes a memoized trackToolStart. Evidence: frontend/lib/hooks/useToolAnalytics.ts (lines 10–25, 27–35).
- Existing CTA click usage pattern on tools index:
  - trackCtaClick("Open calculator →", { location: "/tools" }). Evidence: frontend/app/(site)/tools/page.tsx (lines 72–82, 111–121 with call at lines 73–75).
- Event naming convention in current helpers: snake_case (tool_view, tool_start, lead_submit, cta_click). Evidence: frontend/lib/gtm.ts (lines 17–44).

Repo searches specific to vNext telemetry
- No existing events starting with "ppc_" found in code (outside the spec docs). Evidence: repo search results show only documentation references in the spec and audits; no runtime code files with ppc_*.
  - Search hit confirming only docs mention: docs/tools/pinterest-potential-calculator/pinterest-potential-calculator-v1.0-spec.md (multiple lines including 516–517, 541).

Direct reuse candidates
- pushEvent helper for new ppc_* events. Evidence: frontend/lib/gtm.ts (lines 11–15).
- useToolAnalytics dedupe pattern for view/start-like events. Evidence: frontend/lib/hooks/useToolAnalytics.ts (lines 10–25, 27–35).
- CTA click tracking pattern trackCtaClick for results CTA. Evidence: frontend/lib/gtm.ts (lines 33–44) and usage in frontend/app/(site)/tools/page.tsx (lines 73–75).


------------------------------------------------------------
C) Shared UI primitives inventory (avoid rebuilding chips/sheets/progress/forms)
------------------------------------------------------------

What exists now
- Buttons:
  - Button (default export). Path: frontend/components/ui/Button.tsx. Props: variant ("primary" | "secondary"), href (link mode) or onClick/type (button mode). Evidence: lines 6–27, 73–92.

- Theme toggle (segmented control-like UI):
  - ThemeToggle (default export). Path: frontend/components/ui/ThemeToggle.tsx. Two-segment toggle Light/Dark, manages localStorage and prefers-color-scheme. Evidence: lines 34–47, 80–107.

- Form primitives under forms/:
  - RadioPillGroup (default export). Path: frontend/components/ui/forms/RadioPillGroup.tsx. Props: name, value?: number, options: {label,value}[], onChange(value), errorId?, describedBy?, disabled?, className?. Evidence: lines 5–16, 18–27, 31–60.
  - CheckboxCardGrid (default export). Path: frontend/components/ui/forms/CheckboxCardGrid.tsx. Props: values: number[], options: {label,value,id?}[], onChange(values), columns?:1|2|3, showSelectedCount?, describedBy?, className?, disabled?. Evidence: lines 5–21, 23–33.
  - SliderWithTicks (default export). Path: frontend/components/ui/forms/SliderWithTicks.tsx. Evidence: file exists; imported by tool steps. Specific prop signature not shown here.
  - FieldError (default export). Path: frontend/components/ui/forms/FieldError.tsx. Props: id, message?, className?. Evidence: lines 5–12, 14–26.
  - HelperText (default export). Path: frontend/components/ui/forms/HelperText.tsx. Evidence: file exists; imported by tool steps.

- Existing use in Pinterest Potential steps:
  - StepRadio imports RadioPillGroup, StepCheckbox imports CheckboxCardGrid, StepSlider imports SliderWithTicks, StepLead uses FieldError. Evidence: imports in respective step files (e.g., frontend/components/tools/pinterestPotential/steps/StepRadio.tsx lines 3–5; StepCheckbox.tsx lines 3–5; StepSlider.tsx lines 3–4; StepLead.tsx lines 3–4).

Primitives NOT FOUND (searched frontend/components/ui and forms)
- Sheet/Drawer/Modal components: NOT FOUND (searched paths frontend/components/ui/**).
- Progress bar component: NOT FOUND (no generic Progress under ui; current wizard renders inline progress text). Evidence: search for "Progress" only shows wizard usage. See frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 233, 610–612).
- Chip/Badge/Pill dedicated component beyond RadioPillGroup: NOT FOUND (no generic Chip/Badge export in ui/; radio pills are present).
- Segmented control dedicated primitive: ThemeToggle exists but is theme-specific; no generic segmented control found under ui/.
- Toasts/Notifications primitive: NOT FOUND (no ui/toast or similar present under ui/).

Direct reuse candidates
- Button (frontend/components/ui/Button.tsx) for primary/secondary CTAs.
- RadioPillGroup (frontend/components/ui/forms/RadioPillGroup.tsx) for card/segmented radio selectors.
- CheckboxCardGrid (frontend/components/ui/forms/CheckboxCardGrid.tsx) for card selectors and niche chip picker.
- SliderWithTicks (frontend/components/ui/forms/SliderWithTicks.tsx) for Q7/Q8 scales.
- FieldError and HelperText for inline validation text.


------------------------------------------------------------
D) Lead capture infra (do we already have a submission endpoint/pattern?)
------------------------------------------------------------

What exists now
- Frontend API routes present for auth and debug/experiments only:
  - /app/api/auth/login (cookie writer) and /app/api/auth/logout. Evidence: frontend/app/api/auth/login/route.ts (entire file); frontend/app/api/auth/logout/route.ts (file exists per search results).
  - /app/api/debug/growthbook and /app/api/experiment-events. Evidence: search hits (frontend/app/api/debug/growthbook/route.ts; frontend/app/api/experiment-events/route.ts).
- Backend routers include auth and stats only; no lead/newsletter endpoints:
  - Included routers: auth, stats. Evidence: backend/main.py (lines 33–36).
  - Router files show /auth/* and /pinterest-stats* routes. Evidence: backend/routers/auth.py (entire file), backend/routers/stats.py (entire file).

Conclusion based on inspected code
- NO LEAD SUBMISSION ENDPOINT FOUND (missing evidence of any /lead, /subscribe, /newsletter, or provider integration) in frontend/app/api/** or backend/routers/**.


------------------------------------------------------------
E) Existing Pinterest Potential tool internals (to retire safely; confirm any dependencies)
------------------------------------------------------------

What exists now
- Entry page selects variant and passes lead props into variant component:
  - Maps variant to components v1/v2; passes leadMode and initialLead to variant. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 20–26, 57–61).

- V1 entry component wires analytics and renders the wizard:
  - Uses useToolAnalytics to fire tool_view and supply onStart; renders PinterestPotentialWizard; manages phase. Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (lines 18–35).

- Wizard fundamentals:
  - Client component with reducer, per-step validation, and sessionStorage persistence. Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 1–11, 46–55, 56–95, 240–257, 317–357).
  - Progress text and layout are inline (no shared progress primitive). Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 233, 610–612).
  - Emits lead_submit event on successful lead step. Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 305–315).

- Draft persistence:
  - usePinterestPotentialDraft with storage key DRAFT_STORAGE_KEY = "pinterestPotential:draft:v1"; hydration and write on change to sessionStorage; canonical validation of checkbox IDs. Evidence: frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts (lines 8–9, 59–78, 80–87).

- Lead mode and known lead token behavior:
  - Lead mode values and resolution: gate_before_results | optional_after_results | prefilled_or_skip. Evidence: frontend/lib/tools/pinterestPotential/leadMode.ts (lines 4–13, 15–35).
  - Token decoding stub supports "demo" and base64 email:name. Evidence: frontend/lib/tools/pinterestPotential/leadToken.ts (lines 7–22).

- Compute and spec dependencies:
  - computeResults and computeScore; results bundle includes monthlyAudience, avgHouseholdIncome, avgCartSize. Evidence: frontend/lib/tools/pinterestPotential/compute.ts (lines 56–75, 97–107).
  - Spec types/questions/validation for Q1–Q9. Evidence: frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts (file headers and types at lines 17–85; validation helpers at lines 101–109, 110–124+).

- External imports (potential cross-repo dependencies):
  - Steps import UI primitives under frontend/components/ui/forms/*. Evidence: imports in step files (e.g., StepCheckbox.tsx lines 3–5; StepRadio.tsx lines 3–5; StepSlider.tsx lines 3–4).
  - Wizard imports trackLeadSubmit from lib/gtm; leadMode and spec/compute from lib/tools/pinterestPotential. Evidence: wizard imports at lines 24–26, 38–44.

- Tests that reference this tool:
  - compute unit tests and an optional-after-results test. Evidence: search hits: frontend/__tests__/pinterestPotential.compute.test.ts (import lines 1–2); frontend/__tests__/pinterestPotential.optionalAfterResults.test.tsx (lines 4–7).

- Repo-wide imports of pinterestPotential modules:
  - Entry page imports variant components (V1/V2); V1 imports Wizard; tests import compute and Wizard; step files import spec. Evidence: search results under docs and frontend paths (multiple hits including app/(flow)/tools/pinterest-potential/page.tsx lines 9–10 and tests listed above).


------------------------------------------------------------
F) Output: “Reuse vs Tear-down map” (descriptive, evidence-based)
------------------------------------------------------------

Reuse as-is
- frontend/lib/gtm.ts → pushEvent and CTA/tool analytics wrappers; generic GTM interface. Evidence: lines 11–15 (pushEvent), 33–44 (trackCtaClick), 17–23 (tool_view/start).
- frontend/lib/hooks/useToolAnalytics.ts → one-shot tool_view + start handler. Evidence: lines 10–25, 27–35.
- frontend/lib/experiments/config.ts (PINTEREST_POTENTIAL_EXPERIMENT) → variant keys and defaults. Evidence: lines 43–53.
- frontend/lib/growthbook/middleware.ts → applyExperimentCookies and normalizeVariant for variant cookie. Evidence: lines 21–26, 53–77.
- frontend/lib/tools/pinterestPotentialConfig.ts → constants for variants and cookie name. Evidence: lines 5–11, 16–18.
- frontend/components/ui/forms/RadioPillGroup.tsx → radio pill selector. Evidence: lines 5–16, 18–27, 31–60.
- frontend/components/ui/forms/CheckboxCardGrid.tsx → checkbox card grid selector. Evidence: lines 5–21, 23–33, 54–66, 68–79.
- frontend/components/ui/forms/SliderWithTicks.tsx → slider with ticks (used in steps). Evidence: file presence and imports in StepSlider.tsx (lines 3–4).
- frontend/components/ui/forms/FieldError.tsx → inline error message. Evidence: lines 11–26.
- frontend/components/ui/forms/HelperText.tsx → helper text block (imported in steps). Evidence: file presence via imports in StepRadio/StepCheckbox.

Reuse but modify
- frontend/app/(flow)/tools/pinterest-potential/page.tsx → keep entry and cookie/query resolution, adapt to new variants (welcome vs no_welcome mapping) and ppc_* analytics usage if needed in server props. Evidence: lines 28–38 (searchParams), 64–81 (variant resolver), 40–55 (lead init).
- frontend/lib/tools/pinterestPotential/leadMode.ts → modes exist; map spec’s hard/soft/known-lead to current values. Evidence: lines 4–13, 15–35.
- frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx → current 9-step (Q1–Q9 + lead) flow; vNext targets 8 Qs with new gating/analytics; structure can inform rewrite. Evidence: lines 56–95 (state), 240–257 (nav), 297–315 (analytics), 317–357 (results phase).

Tool-specific to delete/retire (once vNext is implemented)
- frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx → v1-specific wrapper around Wizard. Evidence: lines 18–35.
- frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx → placeholder shell. Evidence: entire file (lines 1–16).
- frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts → v1 draft persistence keyed to v1; superseded by vNext state model. Evidence: lines 8–9 (key), 59–87 (hydration/write), 91–97 (clear).
- frontend/components/tools/pinterestPotential/steps/* (Q1–Q9, StepLead, StepRadio/Checkbox/Slider) → specific to v1 question set. Evidence: directory listing and imports throughout step files.
- frontend/lib/tools/pinterestPotential/* (compute.ts, pinterestPotentialSpec.ts, copy.ts, leadToken.ts) → v1/v5 spec-bound types and compute; may be replaced by config-driven vNext engines. Evidence: per-file lines referenced above (e.g., compute.ts lines 56–75, 97–107; spec types lines 17–85).


UNKNOWNs / missing evidence
- No generic Sheet/Drawer/Modal, Progress bar, Segmented control (generic), or Toast primitives found under frontend/components/ui/**. Marked NOT FOUND based on directory search and file inspection.
- No existing ppc_* analytics events in runtime code; only present in the spec document. Search did not surface any such events in frontend/lib/gtm.ts or call sites.
- No lead submission endpoint present in frontend/app/api/** or backend/routers/**; if an external provider is intended (e.g., ConvertKit), no integration code was found in this repo.

Notes on evidence collection
- File paths and line ranges refer to the latest repository state as reviewed in-session. Where function names are unique, the function header and nearby lines are used to anchor behavior.
