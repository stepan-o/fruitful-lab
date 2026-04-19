# Pinterest Fit Assessment — Implementation Report

Date: 2026-04-09

## Purpose

This document describes the implemented Pinterest Fit Assessment in its full shipped scope:

- where it lives in the repo
- how it fits into the broader frontend architecture
- the stack and runtime model
- the tool's route strategy and UI flow
- the assessment domain model and scoring engine
- tracking, testing, and verification
- known TODOs and extension points

The source-of-truth product requirements remain in:

- `docs/tools/pinterest-fit-assessment/Pinterest Fit Assessment — Developer Brief-20260409.md`

This report documents the implementation that now exists in the codebase.

## High-Level Product Summary

The Pinterest Fit Assessment is a new public assessment tool for **product-based brands**. It is intentionally narrower than the legacy Pinterest Potential Calculator and does **not** reuse that product's multi-audience branching model.

The new tool:

- lives at `/tools/pinterest-fit-assessment`
- presents a fixed 7-question flow
- scores entirely on the client
- returns one of three outcomes:
  - `strong_fit`
  - `possible_fit`
  - `not_right_now`
- renders exactly 3 reasons, exactly 1 recommended role for Pinterest, and a single CTA model
- keeps all answer state in React component state only
- does not use backend scoring
- does not persist progress in local storage or session storage
- restarts from the intro on refresh

At the same time, the legacy calculator remains preserved and directly reachable at `/tools/pinterest-potential`, but it is no longer surfaced from the main `/tools` index.

## Project Structure and Stack

## Frontend Stack

The tool lives inside the `frontend/` app, which is a Next.js App Router project using:

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4 utilities plus shared global CSS tokens/styles
- Jest + React Testing Library for unit and component tests
- GTM/dataLayer-based client tracking helpers

Relevant package-level signals:

- `frontend/package.json`
- `frontend/lib/gtm.ts`
- `frontend/jest.config.cjs`

## Broad Frontend Architecture

The project follows a fairly standard split:

- `frontend/app/`
  - route entry points and page metadata
- `frontend/components/`
  - render-layer UI components
- `frontend/lib/`
  - reusable business logic, tracking, adapters, helpers, and domain modules
- `frontend/__tests__/`
  - route-level and domain-level tests
- `docs/`
  - implementation briefs, prompts, and now this report

For tools specifically, the codebase distinguishes between:

- route entry points under `frontend/app/(flow)/tools/...`
- shared marketing/index entry under `frontend/app/(site)/tools/page.tsx`
- tool-specific business logic under `frontend/lib/tools/...`
- tool-specific UI under `frontend/components/tools/...`

## How the Pinterest Fit Assessment Fits Into That Structure

The Pinterest Fit Assessment is implemented as a new assessment-specific vertical slice rather than an iteration of the older calculator.

Its implementation is centered in two new folders:

- `frontend/lib/tools/pinterestFit/`
- `frontend/components/tools/pinterestFit/`

This keeps the new tool's:

- types
- question config
- copy/config constants
- scoring engine
- result view model
- tracking helpers
- flow UI

separate from the legacy Pinterest Potential code under:

- `frontend/lib/tools/pinterestPotential/`
- `frontend/components/tools/pinterestPotential/`

That separation was intentional. The brief called for a greenfield assessment-specific implementation rather than trying to contort the old multi-audience calculator into the new product shape.

## Route Strategy

## Public Route

The live public entry point is:

- `frontend/app/(flow)/tools/pinterest-fit-assessment/page.tsx`

This route:

- exports assessment-specific metadata
- renders the new `PinterestFitAssessment` component directly
- avoids old variant/lead-mode/live-flow coupling

## Tools Index Integration

The main tools page is:

- `frontend/app/(site)/tools/page.tsx`

This page now:

- highlights the Pinterest Fit Assessment as the primary live tool
- links only to `/tools/pinterest-fit-assessment`
- describes the assessment in fit/readiness language
- no longer exposes the old Pinterest Potential Calculator

## Legacy Preservation

The previous calculator route still exists:

- `frontend/app/(flow)/tools/pinterest-potential/page.tsx`

That route remains directly visitable for compatibility/reference, but it is intentionally hidden from `/tools`.

## Implementation Modules

## Domain Layer

The domain layer lives under:

- `frontend/lib/tools/pinterestFit/types.ts`
- `frontend/lib/tools/pinterestFit/config.ts`
- `frontend/lib/tools/pinterestFit/questions.ts`
- `frontend/lib/tools/pinterestFit/copy.ts`
- `frontend/lib/tools/pinterestFit/engine.ts`
- `frontend/lib/tools/pinterestFit/results.ts`
- `frontend/lib/tools/pinterestFit/tracking.ts`
- `frontend/lib/tools/pinterestFit/index.ts`

### `types.ts`

This file defines the canonical contract for the tool:

- question ids
- answer unions for all seven questions
- stored score field names
- goal types
- outcome keys
- role keys
- reason keys
- CTA shape
- final result shape
- debug shape returned by the engine

Important design choice:

- the tool distinguishes between raw UI answer values like `home_decor` or `ready_now`
- and normalized scored values like `q1_category_fit = 4`

That separation makes the UI expressive while keeping the engine deterministic and easy to test.

### `config.ts`

This file holds small but important constants:

- assessment slug and name
- question count
- max score
- outcome score bands
- reason priority orders
- role priority order
- centralized Fit Call URL placeholder

The Fit Call URL is intentionally centralized here:

- `PINTEREST_FIT_CALL_URL`
- `PINTEREST_FIT_CALL_URL_PLACEHOLDER_TOKEN`

This avoids hardcoded booking links scattered across the flow.

### `questions.ts`

This file is the canonical fixed-flow assessment spec.

It defines:

- the 7 questions
- option labels
- option scores
- Q5 goal-type mapping
- stored score field metadata
- ordered question arrays and by-id lookup

This module is the single source for:

- flow order
- option text
- score assignments
- goal-type normalization

### `copy.ts`

This module holds:

- intro copy
- result copy by outcome
- reason copy by reason key
- role copy by role key
- CTA copy by outcome

The flow UI does not hardcode product messaging directly; it consumes this module so the assessment copy remains centralized and inspectable.

### `engine.ts`

This is the core business logic module. It:

- normalizes raw answers into scored values
- computes the total score
- derives the base outcome band
- applies guardrails
- evaluates each signal
- selects exactly 3 reasons
- resolves exactly 1 role
- returns a render-ready result object

The engine is fully synchronous and side-effect free.

### `results.ts`

This file converts the raw engine result into a presentation-friendly result view model used by the UI.

It also detects whether the booking URL is still a placeholder and exposes:

- `bookingUrlPending`
- a visible TODO message for the CTA area

### `tracking.ts`

This file wraps the generic GTM helper and defines the assessment-specific event model.

It owns:

- run id generation
- event names
- payload shapes
- helper functions for start/question/result/CTA events

## UI Layer

The UI layer lives under:

- `frontend/components/tools/pinterestFit/PinterestFitAssessment.tsx`
- `frontend/components/tools/pinterestFit/IntroScreen.tsx`
- `frontend/components/tools/pinterestFit/QuestionScreen.tsx`
- `frontend/components/tools/pinterestFit/ResultsScreen.tsx`
- `frontend/components/tools/pinterestFit/index.ts`

### `PinterestFitAssessment.tsx`

This is the client-side shell/state machine for the full flow.

It manages:

- current screen state:
  - intro
  - question
  - results
- in-memory answers
- computed result
- client-generated run id for analytics
- one-time result event emission protection

Important behavior implemented here:

- intro starts the assessment
- answers auto-advance
- back navigation is supported
- completion triggers engine scoring
- result display triggers completion/result tracking once per run
- restart clears state and returns to intro

### `IntroScreen.tsx`

The intro screen implements the brief's framing:

- assessment title
- short explanation
- product-based brand support line
- start button
- 2-minute expectation

It uses the shared brand visual system already present in the frontend rather than introducing a disconnected one-off style system.

### `QuestionScreen.tsx`

This screen handles the repeated single-question interaction pattern.

It renders:

- `Question X of 7`
- a percent progress display and progress bar
- one question prompt at a time
- selectable answer cards
- a back button

Important UX choices from the brief/default assumptions:

- one question per screen
- auto-advance on answer selection
- back navigation available
- selected answer preserved when navigating backward

### `ResultsScreen.tsx`

The result screen renders the fit-assessment outcome model, not a forecast calculator.

It displays:

- outcome label
- result headline
- intro paragraph
- top 3 reasons
- best role for Pinterest
- next-step CTA
- restart action

It also supports:

- optional caption only for `not_right_now`
- disabled CTA state if the booking URL is still a placeholder
- clickable CTA when a real URL is configured

## Full User Flow

The implemented user journey is:

1. Intro screen
2. Q1 Category fit
3. Q2 Product/collection proof
4. Q3 Content assets
5. Q4 Website readiness
6. Q5 Desired outcome
7. Q6 Readiness for expert support
8. Q7 Openness to paid ads
9. Results screen

No alternate paths are present for:

- creators
- service providers
- audience pre-screening
- gated lead capture

This matches the V1 scope.

## Scoring Model

## Base Score

The engine computes:

`totalScore = q1 + q2 + q3 + q4 + q5 + q6 + q7`

Maximum score:

- `25`

Outcome bands:

- `18-25` -> `strong_fit`
- `10-17` -> `possible_fit`
- `0-9` -> `not_right_now`

## Guardrails

After base scoring, three guardrails are applied.

### Guardrail A

If:

- goal type is `sales`
- support readiness <= 1
- ads openness <= 1

Then:

- `strong_fit` is downgraded to `possible_fit`

### Guardrail B

If:

- assets = 0
- website = 0

Then:

- final outcome becomes `not_right_now`

### Guardrail C

If:

- category fit = 1
- offer proven <= 1

Then:

- final outcome becomes `not_right_now`

## Reason Selection

The engine always returns **exactly 3 reasons**.

Reason selection is deterministic and outcome-aware:

- `strong_fit`
  - category reason
  - best foundation signal among offer/assets/website
  - best readiness/intent signal among support/ads/goal
- `possible_fit`
  - top positive signal
  - next positive or moderate signal
  - top blocker/caution not already selected
- `not_right_now`
  - top three blockers/cautions
  - if needed, fallback to next-lowest scored signals using deterministic tie-breaks

The implementation uses explicit fixed-length mapping for reason keys and rendered reason copy so the result contract is not just logically fixed, but also type-safe.

## Role Resolution

The engine always resolves **exactly 1 role** using a defined priority order:

1. `not_priority_yet`
2. `sales_with_ads_support`
3. `warm_audience_support`
4. `discovery_traffic`
5. `selective_test_channel`
6. `organic_first_ads_later`
7. `foundation_first`

This ensures every valid answer set maps to one outcome model the UI can explain cleanly.

## Result Model Returned by the Engine

The engine returns a normalized `AssessmentResult` including:

- total score
- max score
- base outcome
- final outcome
- outcome label/headline/intro
- 3 reason keys
- 3 rendered reasons
- role key
- rendered role copy
- CTA model
- debug metadata

The debug metadata includes:

- normalized answers
- triggered guardrails
- signal scores
- signal reason keys
- positive signals
- blocker signals
- moderate signals
- selected reason signals
- matched role

This makes the engine testable and easier to diagnose without requiring UI inspection.

## Tracking and Analytics

The assessment uses GTM/dataLayer tracking through:

- `frontend/lib/gtm.ts`
- `frontend/lib/tools/pinterestFit/tracking.ts`

Implemented assessment events:

- `assessment_started`
- `assessment_question_completed`
- `assessment_completed`
- `result_strong_fit`
- `result_possible_fit`
- `result_not_right_now`
- `cta_fit_call_clicked`

Tracked fields include:

- assessment slug/name
- route location
- run id
- question id
- selected answer
- step number
- final score
- final outcome
- result variant
- role key
- reason keys
- CTA label
- CTA URL

The run id is generated client-side with:

- `crypto.randomUUID()` when available
- a timestamp/random fallback otherwise

Important tracking behavior:

- result events fire once per completed run
- question events fire as the user answers each step
- CTA click tracking uses the final scored result payload

## Persistence and Runtime Constraints

The tool intentionally avoids several behaviors that existed or could have existed in other flows:

- no backend scoring endpoint
- no server-side submission dependency
- no local storage persistence
- no session storage persistence
- no resume-on-refresh
- no lead lock
- no user-auth dependency

Everything required for a completed result is present on the client:

- question spec
- copy
- scoring rules
- reason selection
- role assignment
- CTA model
- tracking payload generation

That makes the tool easy to host, test, and evolve without backend coordination.

## Legacy Calculator Relationship

One of the most important architectural decisions in this project was **not** replacing the old calculator in place.

The repo now contains:

- legacy Pinterest Potential Calculator implementation
- new Pinterest Fit Assessment implementation

The legacy code remains:

- preserved for direct access and future reference
- decoupled from the new assessment
- hidden from `/tools`

This gives the project a cleaner future path:

- the new tool can evolve independently
- the old tool can be retired later on a deliberate timeline
- no migration compromises were required inside the new assessment engine or UI

## Testing and QA Coverage

## Domain Tests

Engine coverage lives in:

- `frontend/__tests__/pinterestFit.engine.test.ts`

This test suite verifies:

- answer normalization
- base strong-fit behavior
- guardrail behavior
- deterministic reason selection
- deterministic role selection
- all 11 named QA scenarios from the brief

The full 11-scenario matrix now asserts the expected:

- outcome
- role where specified
- reason set where specified

## Flow and UI Tests

Component-level assessment tests live in:

- `frontend/components/tools/pinterestFit/__tests__/PinterestFitAssessment.test.tsx`

These cover:

- intro-to-results flow
- auto-advance behavior
- progress display
- back navigation
- restoring a previous answer when moving backward
- result rendering
- optional `Still want to talk it through?` caption behavior
- restart behavior
- pending placeholder CTA behavior
- clickable CTA behavior when a real booking URL exists
- tracking payloads for start/question/result/CTA events

## Route Tests

Route-level protection lives in:

- `frontend/__tests__/routes/pinterestFitPage.test.tsx`
- `frontend/__tests__/routes/toolsIndexPage.test.tsx`

These verify:

- new route metadata and render wiring
- `/tools` linking to the new assessment
- `/tools` no longer exposing the old calculator
- fit-assessment language on the tools index

## Verification Run

During the final hardening pass, the following were verified successfully:

- focused Jest suite for engine, flow, route, and tools index coverage
- targeted eslint on touched files
- production `next build`

One useful implementation note from QA:

- the build surfaced tuple-typing issues in the engine that Jest did not catch
- the engine was then tightened so its 3-reason output is explicitly typed as fixed-length tuples

That was a real quality improvement produced by the final pass.

## Known TODOs / Open Production Inputs

## Booking URL

The real Fit Call booking URL is still not configured.

Current state:

- placeholder token is centralized in `frontend/lib/tools/pinterestFit/config.ts`
- results screen visibly indicates the TODO when the placeholder is still present
- CTA stays disabled until the URL is replaced

This is an intentional shipping safeguard.

## Not a Defect: Off-Target Visitors

V1 does not gate off-target visitors.

Current behavior:

- the intro simply states the tool is built for product-based brands
- anyone can still complete the assessment

That follows the current product decision from the brief.

## Not Implemented by Design

The following are not missing features; they are deliberate V1 exclusions:

- backend scoring
- saved progress
- resume after refresh
- audience pre-screen
- creator path
- service-provider path
- lead gating before results

## Suggested Future Extension Points

Because the implementation is modular, the following future changes are straightforward:

- add or restore a pre-screen before Q1
- replace the booking placeholder with a production URL
- add deeper analytics dimensions or richer GTM wrappers
- add server-side submission or CRM forwarding later if desired
- localize or revise copy in `copy.ts` without changing engine logic
- add extra result rendering variations without rewriting the scoring model
- broaden the route into a more public/general-purpose tool later

The existing module boundaries support those changes cleanly:

- `questions.ts` for flow/config changes
- `copy.ts` for content changes
- `engine.ts` for scoring logic changes
- `tracking.ts` for analytics changes
- components for UX/layout changes

## File Map

### Core Routes

- `frontend/app/(flow)/tools/pinterest-fit-assessment/page.tsx`
- `frontend/app/(site)/tools/page.tsx`
- `frontend/app/(flow)/tools/pinterest-potential/page.tsx`

### Assessment Domain

- `frontend/lib/tools/pinterestFit/types.ts`
- `frontend/lib/tools/pinterestFit/config.ts`
- `frontend/lib/tools/pinterestFit/questions.ts`
- `frontend/lib/tools/pinterestFit/copy.ts`
- `frontend/lib/tools/pinterestFit/engine.ts`
- `frontend/lib/tools/pinterestFit/results.ts`
- `frontend/lib/tools/pinterestFit/tracking.ts`
- `frontend/lib/tools/pinterestFit/index.ts`

### Assessment UI

- `frontend/components/tools/pinterestFit/PinterestFitAssessment.tsx`
- `frontend/components/tools/pinterestFit/IntroScreen.tsx`
- `frontend/components/tools/pinterestFit/QuestionScreen.tsx`
- `frontend/components/tools/pinterestFit/ResultsScreen.tsx`
- `frontend/components/tools/pinterestFit/index.ts`

### Tests

- `frontend/__tests__/pinterestFit.engine.test.ts`
- `frontend/components/tools/pinterestFit/__tests__/PinterestFitAssessment.test.tsx`
- `frontend/__tests__/routes/pinterestFitPage.test.tsx`
- `frontend/__tests__/routes/toolsIndexPage.test.tsx`

### Specification / History

- `docs/tools/pinterest-fit-assessment/Pinterest Fit Assessment — Developer Brief-20260409.md`
- `docs/tools/pinterest-fit-assessment/Pinterest Fit Assessment — Codex Thread Prompts-20260409.md`
- `docs/tools/pinterest-fit-assessment/Pinterest Fit Assessment — Implementation Report-20260409.md`

## Final Summary

The Pinterest Fit Assessment is now implemented as a self-contained, assessment-specific tool inside the broader Fruitful Lab frontend.

Its key architectural characteristics are:

- new public route
- legacy calculator preserved separately
- product-brand-only positioning
- fixed 7-question client flow
- deterministic pure scoring engine
- centralized copy/config
- assessment-specific tracking
- route, flow, and engine test coverage

This gives the project a cleaner, more maintainable tool surface than trying to keep evolving the older multi-audience calculator in place.
