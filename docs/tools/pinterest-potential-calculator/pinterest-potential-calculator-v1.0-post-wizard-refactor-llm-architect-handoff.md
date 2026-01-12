# Pinterest Potential Calculator — Flow + Visual Handoff (v0.2 “V2 wizard” foundation)

**Date:** 2026-01-12  
**Audience:** Next LLM Architect focusing on **flow + visuals** (tracking, GA/GTM, GrowthBook wiring, email integration handled later)

This doc describes the **current shipped structure** of the Pinterest Potential Calculator wizard + UI system, including state, variant behavior, lead gating UI, and styling tokens/animations.

## 1) What exists right now (high-level)

You have a **single calculator experience** implemented as:

- **Welcome (optional)** → **8-step wizard (Q1–Q8)** → **Results view**
- State is persisted **per session** via `sessionStorage` (draft v2)
- A/B “variant” controls whether the user sees the **Welcome screen**:
    - `variant="welcome"` → show Welcome first, then wizard
    - `variant="no_welcome"` → skip Welcome, wizard starts immediately
- Lead gating exists at Results:
    - **hard_lock**: must enter email to view results (blurred/disabled preview)
    - **soft_lock**: results are visible, optional “Email me my results” form
    - **known** lead: bypasses gates
- Visual system uses global CSS variables for **light/dark themes**, plus animations (welcome gradient drift, backdrop circles, etc.)

Key implementation choices:
- **NO randomization** for variant assignment (explicitly removed)
- Wizard steps are **small components**, wizard container owns validation + navigation + persistence
- “Flow + visuals” can evolve with minimal risk by editing the pure view components + step components.

## 2) Primary entry points + file map

### Core wizard container
- `frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx`
    - Owns: variant resolution, step navigation, validation, results compute, lead gating state, draft persistence

### Wrapper / page-level skeleton
- `frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx`
    - Displays header + mounts `PinterestPotentialWizard`
    - Tracks phase (`wizard` vs `results`) for title

### Views (pure UI shells)
- `frontend/components/tools/pinterestPotential/views/WelcomeView.tsx`
- `frontend/components/tools/pinterestPotential/views/WizardView.tsx`
- `frontend/components/tools/pinterestPotential/views/ResultsView.tsx`

### Steps (Q1–Q8)
- `frontend/components/tools/pinterestPotential/steps/Q1Segment.tsx`
- `frontend/components/tools/pinterestPotential/steps/Q2Niche.tsx`
- `frontend/components/tools/pinterestPotential/steps/Q3Volume.tsx`
- `frontend/components/tools/pinterestPotential/steps/Q4Visual.tsx`
- `frontend/components/tools/pinterestPotential/steps/Q5Site.tsx`
- `frontend/components/tools/pinterestPotential/steps/Q6Offer.tsx`
- `frontend/components/tools/pinterestPotential/steps/Q7Goal.tsx`
- `frontend/components/tools/pinterestPotential/steps/Q8GrowthMode.tsx`

### Draft persistence hook
- `frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts`

### Global styling + theme tokens + animations
- `frontend/app/globals.css`

### Spec + compute engine (logic layer)
- `frontend/lib/tools/pinterestPotential/pinterestPotentialSpec`
- `frontend/lib/tools/pinterestPotential/compute`
- Lead gating helpers:
    - `frontend/lib/tools/pinterestPotential/leadMode`
    - `frontend/lib/tools/pinterestPotential/leadGatingConfig`
    - `frontend/lib/tools/pinterestPotential/leadToken`
- Privacy snippet:
    - `frontend/lib/tools/pinterestPotential/copy` (`PRIVACY_MICROCOPY`)

## 3) Current user flows (exact behavior)

### Flow A — Welcome variant (default)
1. User lands on calculator
2. Sees **WelcomeView**
3. Clicks **Start** → sets draft `{ started: true, stepIndex: 1 }` → Q1 renders
4. Completes Q1–Q8
5. Clicks **Calculate** (or auto-advance completes Q8) → compute → ResultsView

### Flow B — No-welcome variant
1. User lands on calculator with `variant=no_welcome` (or cookie resolves to it)
2. Wizard is forced `started=true` immediately
3. Q1 renders right away

### Results gating behavior (UI-level)
- If **hard_lock** + lead is **new**:
    - Results content is blurred/disabled (opacity + blur + pointer-events none)
    - Lead form appears “Unlock your results”
- If **soft_lock** + lead is **new**:
    - Results visible
    - Optional form appears “Email me my results”
- If lead is **known** (token or initialLead), gate is bypassed

## 4) Variant resolution (welcome vs no_welcome) — locked rules

**Variants:** `"welcome"` | `"no_welcome"`

**Precedence (highest → lowest):**
1) Query param:
    - `?variant=welcome|no_welcome`
    - `?pp_variant=...`
    - `?ppcVariant=...`
2) Existing persisted draft variant (`sessionStorage` v2)
3) Experiment cookie (best-effort):
    - canonical cookie: `PINTEREST_POTENTIAL_VARIANT_COOKIE` (imported from `@/lib/tools/pinterestPotentialConfig`)
    - fallbacks: `pp_variant`, `ppc_variant`, `pinterest_potential_variant`
4) Default: `"welcome"`

Important behavior:
- If resolved variant is `"no_welcome"`, wizard **forces** `started=true` (skips welcome)
- No random assignment exists anywhere (explicitly removed)

Where implemented:
- `PinterestPotentialWizard.tsx`:
    - `normalizeVariant`, `readVariantCookie`, `useEffect` for variant persistence

## 5) Draft persistence (sessionStorage v2) — shape + key

**Storage key:** `pinterestPotential:draft:v2`

Hook:
- `usePinterestPotentialDraft(initialDraft)`
    - Hydrates once from sessionStorage (safe read + JSON parse)
    - Validates shape with `isDraftShape` (no `any`)
    - Persists draft on any change

Draft shape (`DraftStateV2`):
- `stepIndex: number` (1..8)
- `started: boolean`
- `answers: AnswersV2`
- `variant?: "welcome" | "no_welcome"`

Reset fix (important):
- Previously `clearDraft()` removed sessionStorage but state would repersist old draft immediately.
- Now resets do:
    - `clearDraft()` **and** `setDraft(INITIAL_DRAFT)` (and local state resets)

Where used:
- WelcomeView “Reset”
- ResultsView “Start over”

## 6) Wizard navigation + validation model (what you can safely change)

Wizard container owns:
- `answers` local state
- `stepIndex`
- per-step errors (`errors`)
- results state (`results`, `resultsErrors`)

Validation exists in two layers:
1) **UI step validation** (`validateStep(stepIndex, answers)`)
    - Ensures required fields exist before continuing
    - Errors stored under keys: `Q1..Q8`
2) **Spec-level validation** via `validateAnswers(specAnswers)`
    - Canonical validation against spec types
3) Compute:
    - `computeResults(specAnswers)` -> `ResultsBundle`

Auto-advance behavior:
- Steps call `onAutoAdvance` immediately after selection
- Wizard uses:
    - `autoAdvance(patch)` → pre-commits patch to state
    - `setTimeout(..., 140ms)` → calls `goNext(nextAnswers)`
- This exists to avoid the “state not committed yet” race.

Back behavior:
- In welcome variant:
    - If `started=false` → Back disabled
    - If `started=true` and `stepIndex=1` → Back returns to Welcome (`started=false`)
- In no_welcome variant:
    - Back disabled only at `stepIndex=1`

## 7) Step components (Q1–Q8) — UX patterns currently used

### Common step UX patterns
- Most steps are “choose one option” with immediate selection highlight
- Many steps auto-advance on selection (via `onAutoAdvance`)
- Several steps use shared UI component:
    - `RadioPillGroup` for pill-style radios (Q3, Q5, Q6, Q8)

### Q1Segment
- Card-like buttons with icon + subtitle (“Traffic / Subscribers”, etc.)
- Shows “Selected” badge

### Q2Niche
- Inline chips (first 7 niches) + “More” opens a `BottomSheet`
- Shows a “PreviewMeter” (Focused/Medium/Broad) once selected

### Q3Volume
- Segment-aware prompt string (creator vs seller vs provider)
- Uses `RadioPillGroup`

### Q4Visual
- Tile meter (1–4 blocks) and bronze fill indicator

### Q5Site
- A/B/C/D options describing mobile clarity
- Uses `RadioPillGroup`

### Q6Offer
- Segment-aware question copy
- Uses `RadioPillGroup`

### Q7Goal
- 2-column grid buttons
- Adds a small helper line when active (“We’ll prioritize …”)

### Q8GrowthMode
- “Organic only / Maybe later / Yes (ads) 🚀”
- Uses `RadioPillGroup`

## 8) Views (pure UI) — what to edit for visuals without breaking logic

### WelcomeView
- Animated gradient layer: `<div className="ppc-welcome-gradient ...">`
- Two glow blobs with traverse animations (`ppc-welcome-glow-1/2`)
- “Start” + “Reset” buttons
- A tiny inline SVG “bar chart” hero

**Safe iteration areas:**
- Layout, typography, illustration, microcopy
- CTA styling
- Reduce or simplify motion
- Add trust elements (e.g., “No spam”, “Instant results”) without touching logic

### WizardView
- Progress bar (percent + Step X of 8)
- Header title
- Renders `stepContent` (the step components)
- Single inline error badge (currently red text uses `text-red-200`, which is more “dark-theme friendly”)

**Safe iteration areas:**
- Progress UI (dots, segmented steps, sticky header, etc.)
- Error styling per theme
- Mobile spacing + tap targets
- Add step helper text slots, etc.

### ResultsView
- 3 top cards: audience range, opportunity range, income range
- Optional `results.insight_line` callout box
- Small “Seasonality” + “Competition” line
- Lead capture blocks:
    - Hard lock: Unlock form
    - Soft lock: Email form
- Recap section (“Your answers”) as cards
- Footer actions: Start over / Edit answers
- “Draft saved” line

**Safe iteration areas:**
- Results hierarchy (cards → chart → narrative)
- Improve recap density
- Improve gating UI clarity
- “Edit answers” target step is currently step 8 (see Known quirks)

## 9) Global styling + theme system (what’s already in globals.css)

Theme tokens:
- Light defaults in `:root`
- Dark tokens in `:root[data-theme="dark"], html[data-theme="dark"]`
- OS fallback only applies when NO explicit `data-theme` attribute:
    - `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { ... } }`

Key tokens used by calculator UI:
- `--background`, `--foreground`, `--foreground-muted`, `--border`
- Brand:
    - `--brand-raspberry` (primary CTA / focus ring)
    - `--brand-bronze` (accent fills / meters)
    - `--brand-heading`, `--brand-alabaster`, `--brand-rust`

Backdrop circles fix:
- `.lab-backdrop-circle` uses filter tokens
- `mix-blend-mode: screen` applied based on **effective theme**, not OS preference only

ThemeToggle segmented control styles:
- `.theme-toggle` + pseudo-element thumb
- `.theme-toggle-dot` hidden

Pinterest Potential welcome animation (moved from inline styles):
- `.ppc-welcome-gradient` with `::before` and `::after` radial layers
- `ppcWaveA` + `ppcWaveB`
- corner glow traverse `ppcGlowTraverse1/2`
- `prefers-reduced-motion` disables these

Global reduced motion guard:
- Forces animations/transitions to near-zero across the app under `prefers-reduced-motion: reduce`

## 10) Lead gating + lead resolution (UI behavior only; backend later)

Inputs:
- `leadMode` prop passed into wizard (defaults from `LEAD_GATING_CONFIG`)
- Query params:
    - lead mode: `leadMode`, `lead_mode`, `leadmode`
    - token: `leadToken`, `lead_token`, `token`
- Cookie (best-effort): `pp_lead_mode` or `pinterest_potential_lead_mode`

Known lead sources:
- `initialLead` prop (already known lead)
- `leadToken` → `resolveLeadFromToken(token)` (async)

Gating computation:
- `resolveLeadGatingContext(...)` returns:
    - `lead_mode` (effective)
    - `lead_state` (e.g., `known` vs `new`)

Results locking:
- `hard_lock` + new lead → gate overlays, results blurred/disabled
- `soft_lock` + new lead → results shown + optional email capture section

Submission placeholders (no backend yet):
- `onUnlock` and `onEmailResults` validate email (and name if required), then set local flags:
    - `setLeadSubmitted(true)`
    - `setOptionalLeadSubmitted(true)`
- Both fire a `trackLeadSubmit(...)` call (plumbing exists; downstream handled later)

## 11) Known quirks + “don’t trip on this” notes

1) **Edit answers jumps to step 8**
    - `onEditAnswers={() => { setResults(null); setStepIndex(8); ... }}`
    - This is intentional as a shortcut but may not be ideal UX.
    - If you redesign “Edit answers”, consider a recap-edit mode or jump to Q1.

2) **Error styling may look off in light theme**
    - WizardView error badge uses `text-red-200` which is light text.
    - Consider theme-aware error tokens (or use CSS variables).

3) **Q2/Q3/Q6/Q7 depend on segment**
    - Wizard shows “Select your business type first” if segment missing.
    - If you change flow order, keep dependencies in mind.

4) **Auto-advance delay is fixed at 140ms**
    - If you change transitions/motion, you may want to adjust or remove delay.
    - The delay exists mainly to avoid race conditions; the `nextAnswers` approach already helps.

5) **Reset is “true reset” now**
    - When you add new draft fields, ensure `INITIAL_DRAFT` includes them so reset clears them.

## 12) Suggested next iterations (flow + visual), aligned with current architecture

### Welcome
- Add clearer value props (still lightweight):
    - “Instant snapshot”, “No login”, “Not a forecast—an estimate”
- Consider “Start” as primary CTA; “Reset” could be a subtle text button
- Optional: add a mini “what you’ll get” list (3 bullets) without increasing height too much

### Wizard flow
- Consider a “Step context” line (1 sentence) under header, per step
- Add a compact recap strip (“Business type: …”) after Q1 to reduce uncertainty
- Improve Back behavior clarity (especially returning to welcome)

### Step visuals
- Unify selection styling (some steps use ring, some border+shadow)
- Make active state more obvious in light theme (raspberry border + subtle fill)
- Q2: consider replacing “More” BottomSheet with search inside sheet if niche list grows

### Results
- Improve hierarchy:
    - Big number → interpretation → next action
- Add a “What to do next” block based on `results.inferred.*` (pure UI copy now; logic later if needed)
- Make gating less jarring:
    - For hard_lock: show **one** teaser number and lock the rest
    - Improve blur/opacity so it feels intentional

### Theming
- Normalize error color tokens across light/dark
- Ensure focus rings always pass contrast on light background
- Consider introducing CSS vars for semantic roles: `--accent`, `--danger`, `--success`

### Accessibility / motion
- Confirm all tap targets are ≥44px height where possible
- Ensure reduced-motion remains respected (already globally guarded)

## 13) Guardrails (what NOT to break while iterating on visuals)

- Keep **variant rules** (no random assignment) intact.
- Keep draft key `pinterestPotential:draft:v2` unless you intentionally migrate.
- Don’t remove the `goNext(nextAnswers)` pattern unless you replace it with an equivalent race-safe approach.
- Don’t move spec/compute calls into view components; keep views “pure UI”.
- Any new UI fields that affect compute must be:
    1) added to `AnswersV2`
    2) validated in `validateStep`
    3) mapped in `buildSpecAnswers`
    4) represented in Results recap
- Lead capture remains **UI-only** for now; backend wiring is deferred.