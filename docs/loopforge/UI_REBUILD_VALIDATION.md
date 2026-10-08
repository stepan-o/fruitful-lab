# Director console — implementation and gate record

8 October 2026. Branch `codex/loopforge-director-console`, based on merged PR #96
and integrated with `b61796d` (merged Sanctuary PR #97).
This record distinguishes the agent’s implementation/quality assessment from
owner enjoyment approval. The latter remains a playtest decision.

## What changed

`/stepanoskin/loopforge/play` opens in the paused console, with opening facts,
weekly delivery and unassigned advisers. There is no arrival or handover gate.
The same factory scene supports adviser choice, labelled portrait dialogue,
assignment approval/override, operation, delegated actions, director decisions,
permanent dispatch and debrief. The record foregrounds decisions and offers
routine batch receipts separately. Development is visible but sealed.

The `loopforge-console` pack contains original sim-sim metal/glass/instrument
materials and icons, new identity-preserving LIMEN/STILETTO portraits, a sliced
monitor frame and authored resting/hover/pressed controls. Text and interactions
remain native. Source inputs, hashes, exact prompts and preparation are retained
under `apps/lab/assets/sources/loopforge-console/`.

The implementation is split into `FirstShift` (run/presentation lifecycle),
`ConsoleParts` (materials, instruments, cameras) and `CommandDeck` (phase UI).
The API, deterministic kernel, worker components, public schema and game balance
are unchanged. No graphics framework, model call or new resource mechanic was
added. The author-facing engine notes now have their own stylesheet.

## Flow evidence

The browser sends explicit commands through `useRun` to
`POST /api/loopforge/first-shift`; the server replays the bounded transcript,
projects permitted facts, and returns a hash-checked snapshot/diff. The console
only presents a commitment after that response. Local development requests
returned HTTP 200; the existing authority/replay suite exercises malformed
inputs, state transitions, worker entities and reconstruction.

| Browser path | Observed result |
| --- | --- |
| LIMEN, accept placements, override Security to wave crew through | LIMEN automatically eased the conveyor at beat 12. Security paused at beat 30. 11 produced, 0 lost, condition 82 → 76. Split 5 retained / 6 delivered; final workforce 29 and quota 6/60. LIMEN explicitly objected to the clearance exception. |
| STILETTO, swap placements, accept pressure recommendation | STILETTO moved to Security and objected to the opening override. Conveyor required a director response at beat 12. Security was resolved automatically by STILETTO at beat 30. 12 produced, 0 lost, condition 82 → 73. All 12 delivered; workforce 24, quota 12/60. |
| STILETTO, accept placements, override Security to verify records (production build) | Automatically kept pressure on the Conveyor. Security paused and the director chose verification, losing three production beats. 22 produced, 0 lost, condition 82 → 67. Split 11 retained / 11 delivered; final workforce 35, quota 11/60. LIMEN welcomed the verified records; STILETTO objected to stopping for badges. |
| Settings during the revised STILETTO shift | Shift remained at beat 25 while the dialog was open. Atmosphere could be disabled, sound enabled and muted; Escape closed the dialog and returned focus to Settings. |
| Dispatch | Slider/presets only changed the preview. Review showed both destinations and irreversibility; only Seal dispatch order sent the commitment. Controls were unavailable afterward. |
| Record | Named automatic actors and director overrides remained readable with causal disclosures. No hidden supervisor trait values or conditioning records were exposed. |

These are observed sample runs, not claims that every seed produces those totals.

## Accessibility and rendering controls

Native buttons, inputs, disclosure summaries and a modal dialog retain keyboard
semantics. Phase headings receive focus; mobile reading position follows the
current decision rather than jumping above the camera. At phone widths, the
compact camera precedes the command deck; secondary room controls follow it.
Running playback controls move beside the camera and remain reachable.

Both effects-off and `prefers-reduced-motion` remove animations/transitions.
Hidden tabs, settings, other console screens, manual pause and connection errors
stop advancement. Hidden tabs suspend audio. Offscreen cameras pause their
scan/record animation through IntersectionObserver. Scene changes retain the
last image behind a connecting state until the replacement loads; failures offer
an image retry. No animation loop updates React every frame.

The existing sound pack is reused; no new soundtrack or recorded cue was added.
Activation, mute and lifecycle are tested here. No new listening-based timbre or
final-mix approval is claimed.

## Checks and limits

- Targeted UI tests cover immediate entry, changed assignments, event override,
  two-step dispatch and preserving confirmed facts through connection failure.
- The first full parallel suite run passed 314 tests and failed one unrelated
  timing assertion in `PinterestFitAssessment.test.tsx` (scrollIntoView had not
  been observed). No Pinterest code was changed. Serial rerun passed all 315.
  After integrating PR #97, the full suite passed **340 tests / 66 suites** and
  one snapshot. Two intermediate local processes ended with SIGTERM; the final
  attached-terminal run completed normally in 112 seconds.
- Required immutable-asset tests passed. The integrated production build passed,
  including TypeScript and prerendering. All 22 retained asset releases verified.
- Scoped ESLint passed without warnings. `git diff --check` passed. The final
  cleanup removes one unused style reference and constrains the development grid.
- A standalone whole-repository `tsc --noEmit` encountered existing test-file
  typing errors in Pinterest, Sanctuary and GrowthBook. No console source error
  remained in that output. The production build is the required app type check.
- This remains one day, two supervisors and two event fixtures. Reload starts a
  new run. The broader Act 1 arcs, later rooms, live 3D and LLM admission are
  design work beyond this UI pass.

## Visual and performance evidence

The production UI was inspected at 320×740, 390×844, 768×1024, 1280×720,
1440×900 and 2560×1440, DPR 1. Corrected the tablet portrait label, short-laptop
composition, small-phone selector width, header touch areas and camera receipt
spacing during this pass. Primary first-turn actions fit the 1280×720 laptop and
390×844 phone; the narrowest phone deliberately scrolls. Phone selectors become
two columns. Visible opening buttons measure at least 44×44 CSS pixels.

Screenshots in `review/director-console/` show the actual rendered application.
The same neutral camera context persists through briefing and choices; no
legacy outcome painting is used to imply an outcome the engine did not produce.

| Selected first-view media | Image and active texture bytes | Selection |
| --- | ---: | --- |
| Cold 390×844 phone, DPR 1 | 217,324 | 480px room, 240px portraits, 72px icons; six shared skin textures/plates |
| Desktop after 2560px review, DPR 1 | 741,550 | Browser retained cached 1536px room and 720px portraits at 1440px; includes the same skin |

Both are below the 350 KB phone / 800 KB desktop targets. Totals use actual DOM
`currentSrc` and computed background/border sources matched to file byte counts;
they are compressed WebP payloads, not decoded GPU memory. The desktop number is
conservative because the browser retained larger cached variants. Hover and
pressed plates add 33,772 bytes on interaction. Later room images mount when
needed; audio loads only after user activation. Source masters are outside
`public` and are not imported into runtime code.

The local production document returned HTTP 200 in 146 ms on the measured cold
origin; it shows a connection state before the authoritative opening snapshot.
Warm revisits reuse the immutable media. These observations are local laboratory
checks, not mobile-network or field Core Web Vitals measurements. Field LCP, INP
and CLS remain unmeasured; existing Speed Insights is unchanged.

## Gate assessment

| Gate | Agent assessment |
| --- | --- |
| First impression and materials | Pass: direct console, original project materials, newly authored portraits and three-state controls, no arrival gate. |
| Choice clarity and complete loop | Pass: adviser priority, assignment/authority change, automatic action, other-room override, irreversible dispatch and causal debrief exercised. |
| Tangible feedback and knowledge | Pass: projected facts drive visible changes and sound; UI imports no kernel/private state; no newly exposed hidden traits. |
| Responsive access | Pass: stated viewport set reviewed; native controls, keyboard selection, dialog dismissal/focus, optional sound and motion-off operation checked. Reduced-motion CSS also reviewed. |
| Performance | Pass for this prototype: selected media within budgets, bounded effects and no frame-driven React work; field performance is explicitly unmeasured. |
| Reliability | Pass: full tests, immutable asset checks, scoped lint and production build; recovery preserves confirmed facts in focused UI tests. |
| Owner enjoyment | Pending owner playtest. The agent's assessment is not a claim of audience validation. |

The reviewable scope is the first-day interface. It does not claim that later
Act 1 mechanics, a soundtrack, live 3D, long-run balance or model-generated
adviser dialogue are implemented. Preview deployment is checked after publication.

## Hosted delivery

[PR #99](https://github.com/stepan-o/fruitful-lab/pull/99) is a mergeable draft
against `master`. Vercel deployment `dpl_EnSkRtod6L4KZMKBh2bbGt1k7HwV` reached
READY for application commit `2e073a679b6bfa2e36689d33622c00ab24c410b6`.
[Open the verified console](https://fruitful-audhnq2ms-stepan-oskins-projects.vercel.app/stepanoskin/loopforge/play).

The hosted browser completed LIMEN selection, original placements, continuous
playback, automatic conveyor easing, the Security decision, a 5/5 dispatch and
debrief. Final confirmed totals: 10 produced, 29 factory workers, 5/60 delivered,
condition 76%, no workers lost. Both supervisors' reactions appeared. No browser
errors or warnings were captured. Existing preview access worked; no protection
change or new share link was needed. `hosted-opening.jpg` and
`hosted-dispatch.jpg` capture that deployment. The subsequent delivery-record
commit changes documentation/evidence only.
