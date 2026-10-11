# Conveyor study delivery — 9 October 2026

Scope: design research, a proposal and a dedicated game-design tab; no gameplay kernel or production renderer changes.

- [x] Read current memory, established game design and original conveyor art.
- [x] Research production, spatial, risk and policy references using primary sources.
- [x] Separate owner direction, proposed rules and the implemented baseline.
- [x] Define fun, constraints, controls, development, supervision, feedback and deterministic boundaries.
- [x] Add original comparative floor schematics, including complete non-interactive reading copies.
- [x] Align current source docs and preserve historical implementation facts.
- [x] Regenerate and validate board/export consistency.
- [x] Inspect desktop and mobile, layout selection, keyboard access and static reading copies.
- [x] Complete relevant app validation.
- [x] Commit, push and open PR.

Open design decisions: precise floor scale, construction costs/duration, quota payment timing, policy reversal costs and actual play balance. No numerical performance or owner fun approval is claimed.

## Verification

- Existing asset test and 394 Jest tests passed (one stored snapshot passed).
- Browser comparison checked at 1440, 768, 390 and 320 CSS-pixel widths. No document-level horizontal overflow; schematics intentionally scroll within labelled regions on narrow screens.
- All three floor selections update the matching explanation; Enter activates the focused layout button. Mobile selection targets are at least 48 CSS pixels tall. No new animation is introduced.
- No browser console errors observed on the local design tab.
- All proposal rows, research entries and all three layouts are present in the interactive source, both HTML reading copies and both Markdown records. The dedicated proposal export matches its source-generated copy; local asset/link targets and conveyor IDs validated.
- The original explanatory diagrams are not production game art and do not report simulated numerical results. No new third-party artwork or renderer dependency was added.

Production build: passed after one interrupted attempt. The successful run compiled, completed type checking and prerendered the app. Existing middleware deprecation warning remains unrelated.

Published in [PR #102](https://github.com/stepan-o/fruitful-lab/pull/102). The built application route `/stepanoskin/loopforge/design#conveyor` was also checked locally. Preview deployment status is reported on the PR; no production release is claimed.

## Night-build follow-up

- [x] Verify original annotated floor map and canonical Sim4 adjacency; inspect Security artwork.
- [x] Place night building before morning briefing; distinguish the guided entry arc from repeatable learning loops.
- [x] Align the current board, UI guidance, daily loop and future engine boundary; preserve implemented baseline.
- [x] Regenerate and verify reading copies and responsive browser layout.
Publication and preview status are tracked in PR #102.

Security prop identities, starter funding, the first Conveyor module and minimum production chain remain proposals. No new game mechanics or assets are shipped by this follow-up.

Follow-up validation: all authored proposal rows and reference entries appear in the board and reading copies; generated exports match; diff whitespace checks pass. The expanded night-zero section was visually checked at 1440px and 390px with no page overflow; the learning-loop disclosure opens with Enter. No runtime, styles or dependency changes, so the earlier complete app test/build result remains the baseline rather than a newly repeated test claim.
