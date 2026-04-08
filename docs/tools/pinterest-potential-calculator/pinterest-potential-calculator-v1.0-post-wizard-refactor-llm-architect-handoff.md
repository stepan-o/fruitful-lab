# Pinterest Potential Calculator — Flow + Visual Handoff (v0.2 “V2 wizard” foundation)

**Date:** 2026-01-29
**Audience:** Next LLM Architect focusing on **flow + visuals** (tracking, GA/GTM, GrowthBook wiring, email integration handled later)

This doc describes the **current shipped structure** of the Pinterest Potential Calculator wizard + UI system, including state, variant behavior, lead gating UI, and styling tokens/animations.

---

## 1) What exists right now (high-level)

You have a **single calculator experience** implemented as:

* **Welcome (optional)** → **8-step wizard (Q1–Q8)** → **Results view**
* State is persisted **per session** via `sessionStorage` (draft v2)
* A/B “variant” controls whether the user sees the **Welcome screen**:

    * `variant="welcome"` → show Welcome first, then wizard
    * `variant="no_welcome"` → skip Welcome, wizard starts immediately
* Lead gating exists at Results:

    * **hard_lock**: must enter email to view results (blurred/disabled preview)
    * **soft_lock**: results are visible, optional “Email me my results” form
    * **known** lead: bypasses gates
* **Results celebration overlay** (CandyBurst):

    * triggers when **hard lock is unlocked** and when **optional results email is submitted**
    * uses a **portal** to `document.body`
    * respects **prefers-reduced-motion**

Key implementation choices:

* **NO randomization** for variant assignment (explicitly removed)
* Wizard steps are **small components**, wizard container owns validation + navigation + persistence
* “Flow + visuals” can evolve with minimal risk by editing the pure view components + step components.

---

## 2) Primary entry points + file map

### Core wizard container

* `frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx`

    * Owns: variant resolution, step navigation, validation, results compute, lead gating state, draft persistence

### Wrapper / page-level skeleton

* `frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx`

    * Displays header + mounts `PinterestPotentialWizard`
    * Tracks phase (`wizard` vs `results`) for title

### Views (pure UI shells)

* `frontend/components/tools/pinterestPotential/views/WelcomeView.tsx`
* `frontend/components/tools/pinterestPotential/views/WizardView.tsx`
* `frontend/components/tools/pinterestPotential/views/ResultsView.tsx` ✅ includes CandyBurst overlay + Results hero + gating blocks

### Steps (Q1–Q8)

* `frontend/components/tools/pinterestPotential/steps/Q1Segment.tsx`
* `frontend/components/tools/pinterestPotential/steps/Q2Niche.tsx`
* `frontend/components/tools/pinterestPotential/steps/Q3Volume.tsx`
* `frontend/components/tools/pinterestPotential/steps/Q4Visual.tsx`
* `frontend/components/tools/pinterestPotential/steps/Q5Site.tsx`
* `frontend/components/tools/pinterestPotential/steps/Q6Offer.tsx`
* `frontend/components/tools/pinterestPotential/steps/Q7Goal.tsx`
* `frontend/components/tools/pinterestPotential/steps/Q8GrowthMode.tsx`

### Draft persistence hook

* `frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts`

### Global styling + theme tokens + animations

* `frontend/app/globals.css`

### Spec + compute engine (logic layer)

* `frontend/lib/tools/pinterestPotential/pinterestPotentialSpec`
* `frontend/lib/tools/pinterestPotential/compute`
* Lead gating helpers:

    * `frontend/lib/tools/pinterestPotential/leadMode`
    * `frontend/lib/tools/pinterestPotential/leadGatingConfig`
    * `frontend/lib/tools/pinterestPotential/leadToken`
* Privacy snippet:

    * `frontend/lib/tools/pinterestPotential/copy` (`PRIVACY_MICROCOPY`)

---

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

* If **hard_lock** + lead is **new**:

    * Lead form appears (“Reveal your full snapshot”)
    * Results content is blurred/disabled using:

        * `opacity-90 blur-[6px] pointer-events-none select-none`
* If **soft_lock** + lead is **new**:

    * Results visible
    * Optional form appears (“Email me my results”)
* If lead is **known** (token or initialLead), gate is bypassed

### Results celebration overlay (CandyBurst)

* Triggers:

    * when `locked` transitions **true → false** (hard unlock)
    * when `optionalLeadSubmitted` transitions **false → true** (soft “emailed” submit)
* Implementation notes:

    * uses `createPortal(…, document.body)`
    * closes on click, Escape, or auto timeout
    * reduced motion: shows briefly then closes (no heavy animation)
    * all state changes that start the overlay are **deferred** (setTimeout/requestAnimationFrame) to avoid React timing issues.

---

## 4) Variant resolution (welcome vs no_welcome) — locked rules

**Variants:** `"welcome"` | `"no_welcome"`

**Precedence (highest → lowest):**

1. Query param:

* `?variant=welcome|no_welcome`
* `?pp_variant=...`
* `?ppcVariant=...`

2. Existing persisted draft variant (`sessionStorage` v2)
3. Experiment cookie (best-effort):

* canonical cookie: `PINTEREST_POTENTIAL_VARIANT_COOKIE` (imported from `@/lib/tools/pinterestPotentialConfig`)
* fallbacks: `pp_variant`, `ppc_variant`, `pinterest_potential_variant`

4. Default: `"welcome"`

Important behavior:

* If resolved variant is `"no_welcome"`, wizard **forces** `started=true` (skips welcome)
* No random assignment exists anywhere (explicitly removed)

Where implemented:

* `PinterestPotentialWizard.tsx`:

    * `normalizeVariant`, `readVariantCookie`, `useEffect` for variant persistence

---

## 5) Draft persistence (sessionStorage v2) — shape + key

**Storage key:** `pinterestPotential:draft:v2`

Hook:

* `usePinterestPotentialDraft(initialDraft)`

    * Hydrates once from sessionStorage (safe read + JSON parse)
    * Validates shape with `isDraftShape` (no `any`)
    * Persists draft on any change

Draft shape (`DraftStateV2`):

* `stepIndex: number` (1..8)
* `started: boolean`
* `answers: AnswersV2`
* `variant?: "welcome" | "no_welcome"`

Reset fix (important):

* Previously `clearDraft()` removed sessionStorage but state would repersist old draft immediately.
* Now resets do:

    * `clearDraft()` **and** `setDraft(INITIAL_DRAFT)` (and local state resets)

Where used:

* WelcomeView “Reset”
* ResultsView “Start over”

---

## 6) Wizard navigation + validation model (what you can safely change)

Wizard container owns:

* `answers` local state
* `stepIndex`
* per-step errors (`errors`)
* results state (`results`, `resultsErrors`)

Validation exists in two layers:

1. **UI step validation** (`validateStep(stepIndex, answers)`)

* Ensures required fields exist before continuing
* Errors stored under keys: `Q1..Q8`

2. **Spec-level validation** via `validateAnswers(specAnswers)`

* Canonical validation against spec types

3. Compute:

* `computeResults(specAnswers)` -> `ResultsBundle`

Auto-advance behavior:

* Steps call `onAutoAdvance` immediately after selection
* Wizard uses:

    * `autoAdvance(patch)` → pre-commits patch to state
    * `setTimeout(..., 140ms)` → calls `goNext(nextAnswers)`
* This exists to avoid the “state not committed yet” race.

Back behavior:

* In welcome variant:

    * If `started=false` → Back disabled
    * If `started=true` and `stepIndex=1` → Back returns to Welcome (`started=false`)
* In no_welcome variant:

    * Back disabled only at `stepIndex=1`

---

## 7) Step components (Q1–Q8) — UX patterns currently used

### Common step UX patterns

* Most steps are “choose one option” with immediate selection highlight
* Many steps auto-advance on selection (via `onAutoAdvance`)
* Several steps use shared UI component:

    * `RadioPillGroup` for pill-style radios (Q3, Q5, Q6, Q8)

### Q1Segment

* Card-like buttons with icon + subtitle (“Traffic / Subscribers”, etc.)
* Shows “Selected” badge

### Q2Niche

* Inline chips (first 7 niches) + “More” opens a `BottomSheet`
* Shows a “PreviewMeter” (Focused/Medium/Broad) once selected

### Q3Volume

* Segment-aware prompt string (creator vs seller vs provider)
* Uses `RadioPillGroup`

### Q4Visual

* Tile meter (1–4 blocks) and bronze fill indicator

### Q5Site

* A/B/C/D options describing mobile clarity
* Uses `RadioPillGroup`

### Q6Offer

* Segment-aware question copy
* Uses `RadioPillGroup`

### Q7Goal

* 2-column grid buttons
* Adds a small helper line when active (“We’ll prioritize …”)

### Q8GrowthMode

* “Organic only / Maybe later / Yes (ads) 🚀”
* Uses `RadioPillGroup`

---

## 8) Views (pure UI) — what to edit for visuals without breaking logic

### WelcomeView

* Animated gradient layer: `<div className="ppc-welcome-gradient ...">`
* Two glow blobs with traverse animations (`ppc-welcome-glow-1/2`)
* “Start” + “Reset” buttons
* A tiny inline SVG “bar chart” hero

**Safe iteration areas:**

* Layout, typography, illustration, microcopy
* CTA styling
* Reduce or simplify motion
* Add trust elements (e.g., “No spam”, “Instant results”) without touching logic

### WizardView

* Progress bar (percent + Step X of 8)
* Header title
* Renders `stepContent` (the step components)
* Single inline error badge

**Safe iteration areas:**

* Progress UI (dots, segmented steps, sticky header, etc.)
* Error styling per theme
* Mobile spacing + tap targets
* Add step helper text slots, etc.

### ResultsView ✅ (current shipped structure)

ResultsView is now organized around:

1. **Results hero**

* `ResultsHero` with a **variant**:

    * `"locked"` (hard gate present)
    * `"ready"` (soft gate present)
    * `"unlocked"` (fully visible)
    * `"emailed"` (soft email submitted)
* Includes a prominent CTA: **Book a Strategy Call**

2. **Segment funnel cards**

* Uses `FunnelCard` + `FunnelArrow`
* Always begins with “STEP 1: REACH” using `results.demand.likely_pinterest_sessions_est`
* Segment-specific middle/bottom steps:

    * content_creator: reach → traffic estimate → conversions placeholder
    * product_seller: reach → purchase intent → revenue example (AOV bucket)
    * service_provider: reach → traffic estimate → discovery calls

3. **Product seller extra block**

* “Revenue by price point” list (AOV buckets)

4. **Audience income block**

* Shows `incomeRangeLabel` + niche label from recap

5. **Lead capture blocks**

* Hard lock: “Reveal your full snapshot”
* Soft lock: “Email me my results”

6. **Footer CTA + “How we calculated this” + “Your answers”**

* “How we calculated this” is a `<details>` with platform size + assumptions
* “Your answers” is a `<details>` recap grid

7. **Celebration overlay**

* `CandyBurstOverlay` is rendered at top-level of ResultsView
* Triggers on unlock + emailed (see section 3)

**Safe iteration areas:**

* Results hierarchy (hero → funnel → income → recap)
* Funnel visuals (icons, spacing, explanation copy)
* Gating UI clarity and aesthetics (but keep the same gating logic)
* Celebration overlay aesthetics (but keep motion + fallbacks intact; see section 11)

---

## 9) Global styling + theme system (what’s already in globals.css)

Theme tokens:

* Light defaults in `:root`
* Dark tokens in `:root[data-theme="dark"], html[data-theme="dark"]`
* OS fallback only applies when NO explicit `data-theme` attribute:

    * `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { ... } }`

Key tokens used by calculator UI:

* `--background`, `--foreground`, `--foreground-muted`, `--border`
* Brand:

    * `--brand-raspberry` (primary CTA / focus ring)
    * `--brand-bronze` (accent fills / meters)
    * `--brand-heading`, `--brand-alabaster`, `--brand-rust`

Results glow wrapper:

* `.ppc-hero-glow` uses a gradient drift (`ppcHeroGlow`) and has reduced-motion guard

Global reduced motion guard:

* Forces animations/transitions to near-zero across the app under `prefers-reduced-motion: reduce`

---

## 10) Lead gating + lead resolution (UI behavior only; backend later)

Inputs:

* `leadMode` prop passed into wizard (defaults from `LEAD_GATING_CONFIG`)
* Query params:

    * lead mode: `leadMode`, `lead_mode`, `leadmode`
    * token: `leadToken`, `lead_token`, `token`
* Cookie (best-effort): `pp_lead_mode` or `pinterest_potential_lead_mode`

Known lead sources:

* `initialLead` prop (already known lead)
* `leadToken` → `resolveLeadFromToken(token)` (async)

Gating computation:

* `resolveLeadGatingContext(...)` returns:

    * `lead_mode` (effective)
    * `lead_state` (e.g., `known` vs `new`)

Results locking:

* `hard_lock` + new lead → gate form + blurred/disabled results preview
* `soft_lock` + new lead → results shown + optional email capture section

Submission placeholders (no backend yet):

* `onUnlock` and `onEmailResults` validate email (and name if required), then set local flags:

    * `setLeadSubmitted(true)`
    * `setOptionalLeadSubmitted(true)`
* Both fire a `trackLeadSubmit(...)` call (plumbing exists; downstream handled later)

---

## 11) Known quirks + “don’t trip on this” notes

1. **Celebration overlay CSS var safety (important)**

* CandyBurst animation relies on CSS custom props (`--dx`, `--dur`, etc.) set inline.
* If any CSS var is missing/invalid, some browsers will treat the whole `transform` as invalid and the animation can “freeze”.
* **Guardrail:** always provide:

    * defaults on `.ppc-candy` (e.g., `--dx: 0px`)
    * fallbacks in every `var()` usage (e.g., `var(--dx, 0px)`)

2. **Portal + document access**

* `CandyBurstOverlay` uses `createPortal(..., document.body)`
* Must not assume `document` exists during SSR; component guards with `typeof document === "undefined"`

3. **Reduced motion**

* Reduced motion path intentionally avoids heavy animation and auto-closes quickly.
* Don’t remove the reduce-motion guard unless you replace it with equivalent behavior.

4. **Edit answers jumps to step 8**

* If this still exists in the wizard container, it’s a shortcut, not ideal UX.
* Consider a recap-edit mode or “jump to Q1/Q2” approach if redesigning.

5. **Error styling may look off in light theme**

* If error colors are hardcoded for dark mode, replace with semantic tokens or theme-aware variants.

6. **Q2/Q3/Q6/Q7 depend on segment**

* Wizard shows “Select your business type first” if segment missing.
* If you change flow order, keep dependencies in mind.

7. **Auto-advance delay is fixed at 140ms**

* If you change transitions/motion, you may adjust, but keep the race-safe “nextAnswers” pattern.

8. **Reset is “true reset” now**

* When you add new draft fields, ensure `INITIAL_DRAFT` includes them so reset clears them.

---

## 12) Suggested next iterations (flow + visual), aligned with current architecture

### Welcome

* Add clearer value props (still lightweight):

    * “Instant snapshot”, “No login”, “Modeled estimate—not a promise”
* Consider “Reset” as subtle text, keep “Start” primary
* Optional: add a 3-bullet “what you’ll get” block without expanding height too much

### Wizard flow

* Add a 1-line “step context” under header per step
* Add a compact recap strip after Q1 (“Segment: … | Niche: …”)
* Improve Back behavior clarity (especially returning to welcome)

### Step visuals

* Unify selection styling (raspberry border + subtle fill)
* Ensure active states read well in light theme
* Q2: if niche list grows, add search in the sheet

### Results

* Tighten story:

    * Hero → Funnel → “What this means” → Next action
* Improve funnel explanations (especially “reach vs impressions” clarity)
* Make gating feel intentional:

    * hard lock could show a single teaser card and lock the rest (optional)

### Celebration overlay

* Keep it GPU-friendly (simple transforms, no expensive filters)
* Keep CSS var fallbacks intact
* Respect reduced motion

---

## 13) Guardrails (what NOT to break while iterating on visuals)

* Keep **variant rules** (no random assignment) intact.
* Keep draft key `pinterestPotential:draft:v2` unless you intentionally migrate.
* Don’t remove the `goNext(nextAnswers)` pattern unless you replace it with an equivalent race-safe approach.
* Don’t move spec/compute calls into view components; keep views “pure UI”.
* Any new UI fields that affect compute must be:

    1. added to `AnswersV2`
    2. validated in `validateStep`
    3. mapped in `buildSpecAnswers`
    4. represented in Results recap
* Lead capture remains **UI-only** for now; backend wiring is deferred.
