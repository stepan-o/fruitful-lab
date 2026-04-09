# Pinterest Fit Assessment — Codex Thread Prompts

## How to use this doc
Use the generic prompt first in every new Codex thread, then append exactly one chunk prompt from the sequence below.

These chunks are designed as a waterfall build:
- each thread owns a narrow slice
- later threads build on earlier ones
- broad QA is intentionally deferred until the final thread

## Generic prompt for every new thread
```text
You are implementing one chunk of the Pinterest Fit Assessment in:
/Users/stpn/Documents/repos/my_projects/fruitful-lab

Read these two docs first:
1. /Users/stpn/Documents/repos/my_projects/fruitful-lab/docs/tools/pinterest-fit-assessment/Pinterest Fit Assessment — Developer Brief-20260409.md
2. /Users/stpn/Documents/repos/my_projects/fruitful-lab/docs/tools/pinterest-fit-assessment/Pinterest Fit Assessment — Codex Thread Prompts-20260409.md

Treat the developer brief as source of truth.

Route decision override for implementation:
- Do not replace the live experience at `/tools/pinterest-potential`.
- Build the new assessment at a new public route: `/tools/pinterest-fit-assessment`.
- Leave the old calculator reachable only by directly visiting `/tools/pinterest-potential`.
- Update the `/tools` index so it links only to the new assessment and no longer exposes the old calculator.

Global implementation rules:
- Build this as a new assessment-specific implementation, not as another iteration of the old multi-audience calculator.
- Preserve the old Pinterest Potential Calculator code in the repo; do not delete or rewrite it.
- Product-based brands only. Fixed 7-question flow. No creator path. No service-provider path. No pre-screen in V1.
- No backend scoring, no local/session storage persistence, no resume-on-refresh behavior.
- Prefer new modules under `frontend/lib/tools/pinterestFit/` and `frontend/components/tools/pinterestFit/`.
- Keep scoring deterministic and pure.
- Keep unresolved shipping values centralized. If the real Fit Call URL is still unknown, use a single obvious placeholder/TODO constant instead of hardcoding guesses in multiple files.

Default assumptions for open spec gaps unless the chunk overrides them:
- Off-target visitors are allowed to complete the tool as-is in V1; rely on the intro support line rather than adding a gate.
- Answers auto-advance to the next question.
- Back navigation is available on question screens.
- Progress is shown as `Question X of 7`.
- Results include a restart action.

Working style for this thread:
- Make the requested code changes directly.
- Keep the change set scoped to this chunk.
- Do not run a full regression pass unless this chunk explicitly asks for it.
- If you add tests before the final QA thread, keep them tightly scoped to the files you touched.

At the end:
- summarize what changed
- list touched files
- note any assumptions or follow-up items for the next thread
```

## Recommended chunk order
1. Assessment foundation and config contract
2. Pure scoring engine
3. Client flow shell and question UI
4. Results rendering and CTA behavior
5. Tracking instrumentation
6. Live route and tools index integration
7. Final QA, scenario coverage, and cleanup

## Thread 1 prompt — Assessment foundation and config contract
```text
Task: create the new assessment-specific foundation layer for the Pinterest Fit Assessment without touching the live route yet.

Own this thread's implementation in:
- `frontend/lib/tools/pinterestFit/`

Goals:
- Define the canonical TypeScript types for question ids, answer values, scoreable answers, outcome keys, role keys, reason keys, CTA config, and assessment result shape.
- Create a small assessment config/spec module for the fixed 7-question flow, including question copy, option copy, stored field names, option scores, and the Q5 goal type mapping.
- Create a copy/config module for result headlines, intros, reason copy, role copy, CTA labels/subtext, and a centralized Fit Call URL placeholder constant/TODO.
- Keep this layer assessment-specific and easy for later UI/engine threads to consume.

Important constraints:
- Do not reuse the old `pinterestPotential` spec types except as a loose reference for code style.
- Do not implement scoring logic yet.
- Do not implement UI yet.
- Do not add or swap live routes yet.

Suggested deliverable shape:
- `types.ts`
- `questions.ts`
- `copy.ts`
- `config.ts` or equivalent small modules
- a barrel export if helpful

Verification:
- lightweight type/lint sanity only if needed
- no full test run

Leave the next thread with:
- a clean canonical contract for answers and outputs
- no ambiguity about question order or stored answer metadata
```

## Thread 2 prompt — Pure scoring engine
```text
Task: implement the pure Pinterest Fit Assessment scoring engine against the new foundation modules from Thread 1.

Own this thread's implementation in:
- `frontend/lib/tools/pinterestFit/engine.ts`
- closely related helper files under `frontend/lib/tools/pinterestFit/`

Goals:
- Implement total score calculation.
- Implement base outcome bands.
- Implement guardrails A, B, and C exactly as written in the brief.
- Implement deterministic reason selection for all three outcomes.
- Implement deterministic role assignment with the exact priority order from the brief.
- Return a normalized result object that the UI can render directly: score, base outcome, final outcome, selected reason keys, rendered reason copy, role key, rendered role copy, CTA model, and any useful debug metadata.

Important constraints:
- The engine must be pure and side-effect free.
- Treat the brief's QA scenarios as the contract, but do not do the full final test matrix in this thread.
- Do not build UI here.
- Do not touch routes here.

If you add tests:
- keep them tightly focused on engine behavior
- prefer a small contract test file over a broad UI/integration pass

Verification:
- targeted engine sanity only
- no full regression pass yet

Leave the next thread with:
- one importable engine function that can score a complete answer set end-to-end
- stable output shapes for UI consumption
```

## Thread 3 prompt — Client flow shell and question UI
```text
Task: build the new client-side Pinterest Fit Assessment flow shell and question experience, using the new `pinterestFit` config and engine modules.

Own this thread's implementation in:
- `frontend/components/tools/pinterestFit/`

Goals:
- Build the assessment shell for the exact screen order in the brief: intro, Q1-Q7, results.
- Implement intro screen copy from the brief.
- Implement one-question-per-screen UI with answer cards/buttons.
- Implement auto-advance on answer selection.
- Implement back navigation on question screens.
- Implement progress UI as `Question X of 7`.
- Keep answer state local to the component tree only.
- On completion, call the real scoring engine from Thread 2 and transition into results state.

Important constraints:
- No old audience selector, no creator/service-provider logic, no persistence copy, no draft storage hook.
- Do not wire tracking yet beyond any minimal placeholders needed to avoid churn.
- Keep the components cleanly separated from the scoring engine.
- Keep styling aligned with the existing site system rather than inventing an unrelated design language.

Suggested deliverable shape:
- `PinterestFitAssessment.tsx`
- `IntroScreen.tsx`
- `QuestionScreen.tsx`
- shared option/progress/navigation primitives if useful

Verification:
- lightweight component smoke testing only if needed
- do not run the full suite yet

Leave the next thread with:
- a functioning assessment flow that reaches a basic results state using real scoring
- no route integration yet unless absolutely required for local rendering
```

## Thread 4 prompt — Results rendering and CTA behavior
```text
Task: complete the results experience for the Pinterest Fit Assessment and make the output match the brief exactly.

Own this thread's implementation in:
- `frontend/components/tools/pinterestFit/`
- any small view-model helpers under `frontend/lib/tools/pinterestFit/`

Goals:
- Render the final outcome label, headline, intro paragraph, top 3 reasons, best-role block, CTA block, and restart action.
- Ensure the correct CTA label is always `Book a Fit Call`.
- Add the optional `Still want to talk it through?` caption only for `not_right_now`.
- Render CTA subtext by result state.
- Use the centralized booking URL placeholder/config from the foundation layer.
- Make the results screen clearly about fit/readiness/role, not forecasted traffic or revenue.

Important constraints:
- Do not resurrect any old calculator concepts like growth snapshots, modeled traffic ranges, or lead gating.
- Do not broaden scope into analytics or route integration yet.
- Preserve restart behavior as a clean reset to intro.

Verification:
- local visual/behavior sanity only
- no full regression pass yet

Leave the next thread with:
- a complete, user-facing results screen that reflects the new assessment framing
```

## Thread 5 prompt — Tracking instrumentation
```text
Task: add the Pinterest Fit Assessment tracking layer and instrument the new assessment flow.

Own this thread's implementation in:
- `frontend/lib/gtm.ts` or a new adjacent tracking helper if cleaner
- `frontend/components/tools/pinterestFit/`

Goals:
- Implement the minimum events from the brief:
  - `assessment_started`
  - `assessment_question_completed`
  - `assessment_completed`
  - `result_strong_fit`
  - `result_possible_fit`
  - `result_not_right_now`
  - `cta_fit_call_clicked`
- Define a simple payload contract for these events, including a client-generated run/session id.
- Include the brief's recommended minimum payloads where applicable:
  - question id
  - selected answer
  - step number
  - run/session id
  - final score
  - final outcome
  - role key
  - reason keys where useful
- Fire the result-specific event when results are shown.
- Fire the CTA event with the result variant payload when the button is clicked.

Important constraints:
- Keep the implementation lightweight and client-safe.
- Do not add backend event plumbing.
- Avoid breaking existing generic GTM helpers used elsewhere in the site.

Verification:
- targeted sanity only
- no full regression pass yet

Leave the next thread with:
- a fully instrumented assessment flow using the new event names from the brief
```

## Thread 6 prompt — Live route and tools index integration
```text
Task: swap the live website flow over to the new Pinterest Fit Assessment while preserving the old calculator code in the repo.

Own this thread's implementation in:
- `frontend/app/(flow)/tools/pinterest-fit-assessment/page.tsx`
- `frontend/app/(flow)/tools/pinterest-potential/page.tsx`
- `frontend/app/(site)/tools/page.tsx`
- any minimal supporting files needed for the new route entry

Goals:
- Make `/tools/pinterest-fit-assessment` render the new assessment experience.
- Remove old variant/lead-mode/live-flow coupling from this route if it is no longer relevant to the new assessment.
- Keep the old `frontend/components/tools/pinterestPotential/` and `frontend/lib/tools/pinterestPotential/` code preserved in the repo unless a tiny compatibility adjustment is required.
- Update the `/tools` index card copy from Pinterest Potential Calculator framing to Pinterest Fit Assessment framing.
- Ensure the live route messaging matches the new product-brand-only positioning.

Important constraints:
- Do not delete the old calculator implementation.
- Add a new route for the assessment at `/tools/pinterest-fit-assessment`.
- Keep `/tools/pinterest-potential` intact as the legacy direct URL for the old calculator.
- Update `/tools` so it only links to the new assessment and does not expose the old calculator.
- Prefer simplifying the new route over preserving unused experiment plumbing in the new experience.

Verification:
- targeted route rendering sanity only
- full testing still deferred to the final thread

Leave the final QA thread with:
- the new assessment live at `/tools/pinterest-fit-assessment`
- the `/tools` page pointing only to the new assessment
- the old calculator code still available in the repo for reference
```

## Thread 7 prompt — Final QA, scenario coverage, and cleanup
```text
Task: run the full hardening pass for the Pinterest Fit Assessment now that the entire spec has been implemented.

You may touch any `frontend/components/tools/pinterestFit/`, `frontend/lib/tools/pinterestFit/`, route, or test files that need final fixes.

Goals:
- Add or complete the full scenario coverage from the brief's QA section.
- Verify all 11 named scenarios resolve to the expected outcome, role, and reasons where specified.
- Add route-level and flow-level tests where they provide useful protection, including the new route and tools index behavior.
- Run the main test pass for the touched frontend code now that the feature is complete.
- Fix any defects discovered during the final pass.
- Do a final wording sweep so the new live surface uses fit-assessment language while the legacy calculator remains hidden from the `/tools` page.
- Leave obvious TODO documentation for any still-missing production booking URL if it has not been supplied yet.

Suggested testing focus:
- engine scenario matrix
- route rendering for `/tools/pinterest-fit-assessment`
- tools index linking only to the new assessment
- user flow from intro to results
- CTA click behavior
- restart behavior

Verification:
- run the relevant frontend tests for real in this thread
- if feasible, also run the relevant build/lint sanity for the touched area

Final output should include:
- what was verified
- what was fixed during QA
- any residual follow-up items that are product decisions rather than implementation defects
```
