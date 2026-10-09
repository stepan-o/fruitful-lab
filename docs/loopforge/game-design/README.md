# Loopforge game design board

8 October expression-first pass: **Player desires & scenarios** (`#player-desires`) adds the owner’s seven expression anchors, three research frameworks, thirteen games and their developers, a qualitative player-discussion sample for four close references, and seven proposed situations mapped to UI, feedback and causal support. `player-desires.json` is the authored source; `player_desires.py` renders the tab and the generated `../PLAYER_DESIRES_AND_SCENARIOS.md`. The game and UI reading copies contain the same record. No gameplay implementation or representative audience survey is claimed.

Part 01 now tests four or five complete two-room days, roughly six to eight minutes, instead of the earlier three-day hypothesis. Exact pacing and funding remain open; expression, distinct payoffs and readiness determine the test. See the new tab before designing further screens or extending the simulation.


8 October next design pass: [one-minute loop inventory](../ONE_MINUTE_LOOP.md) gathers the whole-day flow, authority rules, interface ownership, implemented baseline and open decisions after the owner accepted the one-second loop as a good baseline. It is a working design brief, not a new implementation or balance decision.

8 October style review: **UI style studies** (`#ui-styles`) includes six separately generated directions: the parent baseline and five requested agent alternatives. `ui-styles.json` owns names and review notes; `style_review.py`, `style-review.js` and `style-review.css` build the responsive gallery and accessible comparison dialog. Images use the `loopforge-ui-studies` immutable pack. This review does not choose the production style or update the playable interface. See `../CAMERA_CONSOLE_ART_DIRECTION.md` and `../ONBOARDING_DESIGN.md` for the latest visual and tutorial rules.

8 October interface follow-up: [game interface job study](../INTERFACE_JOB_STUDY.md)
records the reference pass after the owner rejected PR #99's composition. It
precedes the next full-floor layouts, asset generation and first-turn rebuild.
The six-room overview and 10–20 minute capability-unlock target are the latest
owner direction; the whole day now targets about one minute routine, two to three for heavier days; earlier long-shift estimates are discarded.

The accepted local design board now lives at `/stepanoskin/loopforge/design` in the Lab app. This is an author-facing concept document with spoilers, proposals and open decisions; the playable first-day slice is `/stepanoskin/loopforge/play`.

- `design-data.json` is the authored source. It was preserved during migration and continues to receive design revisions here.
- `art.json` maps the original selected art to optimized immutable assets. `art-provenance.json` retains its source references.
- `build_board.py`, `board.js` and `styles.css` generate the board and reading copies in `apps/lab/public/loopforge-design/`.
- The published directory contains the interactive board, `full-record.html`, `GAME_DESIGN.md`, `UI_DESIGN.html`, `UI_DESIGN.md` and historical `sources/` snapshots.
- The UI document describes the full proposed design, not only features implemented by the first-day prototype.
- `sound-library.json` adds the playable **Sound library** tab (`#sound-library`). It joins authored cue roles and remaining gaps with the cropped-source provenance and the generated `loopforge-sfx` manifest. Six previews, source credits, exact crop notes and a `SOUND_LIBRARY.md` export are included. The gate and dark-room loop are audition-only; the other four edits are assigned in this revision. `sound-library.js` limits audition playback to one clip and pauses it when leaving the section or hiding the page.

From the repository root, regenerate with:

```sh
python docs/loopforge/game-design/build_board.py
```

When changing the selected optimized artwork, run `node apps/lab/scripts/publish-loopforge-design.mjs` afterward. It validates content hashes and registers the existing derivatives in the `loopforge-design` pack; it does not require or republish source masters. The migration adds only the Cortex plate's two derivatives; other illustrations reuse published files. No local repository or machine path is required to build the board.

Current delivery checks are recorded in [First-shift validation](../FIRST_SHIFT_VALIDATION.md). The notes below preserve the local design review history; their old localhost addresses and screenshots describe that earlier review, not required production dependencies.

## Current direction — 8 October 2026

The **Player experience**, **UI structure**, **UI & mechanics**, **Engine boundary**, **Core loops** and **Foundations / open decisions** sections distinguish the current asset-driven interfaces from the future live 3D factory. Adviser selection, illustrated structured briefing, assignments, incidents, allocation and debrief must carry a playable core loop with room artwork. The 3D view will add continuous cinematic observation of the same simulation; it is not a prerequisite or replacement for those interfaces.

Almost every visible game element should use authored assets, starting with the original sim-sim UI materials and modules. Native text, semantics and responsive controls remain. The first entry target is the paused factory console, with opening facts, weekly quota, no assignments and the adviser choice. Separate welcome/handover gates are superseded. The director-console implementation now follows this entry/material direction. Agent verification is recorded in `../UI_REBUILD_VALIDATION.md`; owner visual/play acceptance remains pending. The board continues to describe the broader game, beyond this one-day slice.

The generated board, complete HTML/Markdown record and UI HTML/Markdown document must be regenerated together. Historical `sources/` snapshots and prior validation evidence retain their original wording. The approved long arcs and simulation rules are unchanged; a stale station-staffing example in the minute loop was corrected to match the existing no-station-staffing decision.

Verification for this documentation revision: repeated generation produced identical files; all three HTML exports have unique IDs and all five reading/interactive exports contain the new scope, entry and asset sections. Browser review covered Player experience, UI structure and UI & mechanics on desktop and a 390-pixel phone viewport, with no horizontal overflow or broken visible images. Asset checks and all 62 test suites / 310 tests passed. The initial CI process was interrupted during the build; the production build passed when rerun separately with `API_BASE_URL=http://localhost:8000`. These checks validate the documentation delivery, not the pending game-interface redesign.

## Prior local review history

Verified 7 October 2026: all eight sections at 320, 390, 768, 1440 and 2560 pixel widths without page overflow or broken visible images; all stage, trajectory, supervisor and rumour controls; complete static reading copy; local links; all 40 artwork variant hashes. Visual checks included desktop stress/Thrum views and the mobile supervisor profile.


7 October addition: the accident aftermath is a major Act 1 fork. New BDI and Episode arcs sections include three authored response comparisons and six conditional episode beats, with links to the Producer Vision, Emotional Arc Engine and Stagemaker sources. These are conceptual review examples, not a live BDI engine or recorded gameplay. The new and affected sections were checked at 320, 390, 768 and 1440 pixel widths; all three BDI choices and six episode choices were verified.

7 October experience and architecture addition: recorded the approved paused-planning / continuous-shift / decision-pause rhythm, shared room/factory/episode views, mobile behaviour, migration findings and missing-art policy. Added a dated comparison of Babylon.js, Three.js / R3F, PixiJS, PlayCanvas and Phaser, with Babylon.js proposed for the first representative scene. No renderer benchmark or playable migration is claimed. The Engine boundary section preserves KVP, Rust-native state discipline, independent model services, recorded model admission, evaluation and player-knowledge filtering. Four original KVP/engine/live-contract documents were added to the source library.

The two new sections were checked at 320, 390, 768, 1440 and 2560 pixels with no page overflow. Desktop and mobile layouts were visually reviewed, all generated local links and IDs checked, and the complete reading copy and Markdown record regenerated. `engine-boundary-review.png` records the desktop architecture view.

7 October loops and UI addition: added second/minute/session attention horizons, the shift cycle, six connected layers, feedback loops, conditional safety/output examples and a proposed three-shift pacing test. Added fifteen mechanic-to-UI-to-engine mappings, an end-to-end command/consequence trace and the dedicated UI design document. Exact shift timing, live orders and unlock thresholds remain proposals or open decisions. The legacy UX and Director Console UI specs are retained as source snapshots, with their superseded assumptions called out.

Verified all three horizon controls and fifteen mechanic selectors; checked the new sections at 320, 390, 768, 1440 and 2560 pixels without page overflow. Visually reviewed desktop and mobile layouts, verified the complete UI reading copy, and checked all generated local references, unique IDs and full-record content. `loops-review.png` and `ui-mechanics-review.png` record the desktop views. Source of truth for these documents is `design-data.json`; regenerate all HTML and Markdown records with `build_board.py`.

7 October UI structure addition: proposed Factory, Development and Records screens within one persistent director’s console. The new tab includes selectable structural diagrams, an instance/interface/component taxonomy, development projects tied to base currencies and capability, overlay/time rules, five interaction journeys, mobile behaviour and growth across acts. The inspection-pause policy and consultation commitment boundary remain proposals. No gameplay screen or engine is implemented by this document update.

Verified the three screen selectors and key disclosures, with responsive checks at 320, 390, 768, 1440 and 2560 pixels. A narrow-phone label collision found during visual review was corrected with stacked selectors. Desktop and mobile diagrams were visually reviewed; the complete UI reading document exposes all three screens without inactive controls. All generated documents have unique IDs and valid local links, and both Markdown records retain all fifteen mechanic mappings. `ui-structure-review.png` records the desktop tab.

7 October adviser planning addition: Supervisors and reports now proposes a carried-forward roster, a chosen adviser's staffing recommendation within the daily consultation, selective overrides and follow-through against recorded outcomes. Three authored comparisons distinguish advice, belief, personal stakes and communication. The proposal is linked into the core loop, mechanic mappings and UI document. Forecasts remain subjective; internal traces are development records subject to player knowledge rules. Verified all three selectors and the reasoning disclosure, checked widths 320–2560, visually reviewed desktop and phone layouts, and validated complete static/Markdown records. Added content-versioned stylesheet/script URLs so local preview reloads pick up revisions. `adviser-planning-review.png` records the comparison.

7 October daily adviser revision and long-arc prose pass: the owner's clarified loop supersedes the earlier player-defined brief and cost-free override proposal. Direct factual results precede the primary daily adviser choice. The adviser selects the priority, assesses yesterday, proposes placements and guides event responses all day; their assigned room resolves automatically, while responses elsewhere can be overridden. Individual reactions affect respect, loyalty and confidence under the knowledge rules. The board and UI record now include selection guidance, early sincere teaching, later revelation, an authority example and a proposed bounded prose-generation budget. No model pricing benchmark, paid calls or gameplay implementation are claimed.

Rewrote player-experience prose across stages 01–05, including stage 05's hidden developments. Kept commissioning and disclosure design requirements in design sections. Added the distinction between underlying complexity and clear communication, with enjoyable play judged first by the owner in a working prototype. Verified all five stage selections, the three adviser examples and new record content; reviewed desktop and phone layouts and checked reading-copy completeness, local links and unique IDs. `daily-adviser-authority-review.png` and `long-arc-prose-review.png` show the results. Stage 05 is left selected for review.

## Parts 01–03 and weekly commitments — 7 October 2026

Rewrote the first three stages around an unassigned adviser-first opening, a weekly quota and irreversible daily production allocation. Parts 01–02 carry equipment damage without a repair interface; Part 03 introduces Witch as the first engineer, with time and production opportunity competing against Brewery work. Early unindoctrinated worker histories survive Theatre opening and can be discovered through informed briefings before direct Act 2 inspection.

Updated the related trajectories, forks, recovery examples, economy, adviser rules, UI contracts and generated reading copies. Added a compact opening-rules reference and four proposed supervisor combinations. Model reasoning must demonstrate value against authored deterministic BDI; generated prose alone is a separate comparison. Payment timing and excess-output terms remain open. No daily repair bill, retained-worker liquidation or station staffing controls are assumed.

Validation: regenerated all documents; checked script syntax, unique HTML IDs, local file references, all stage fields and new rules in the complete records. Reviewed the three stage selectors and the new combination/model criteria disclosures in the browser. Visually checked desktop, 390px and 320px phone layouts, and the interface diagram at 768px; no page overflow at those widths. This is a local design revision, not a gameplay implementation or balance test.

Validation for the expression-first addition: all seven scenarios, thirteen comparisons and four player-feedback summaries are present in the interactive board and complete game/UI reading copies. Generated HTML IDs and local links pass; regeneration is identical. Browser review checked expanded player evidence and a Part 02 scenario on desktop and phone, keyboard disclosure, tab navigation, and 320/390/768/1440 pixel widths without page overflow. These checks verify the design artifact, not gameplay balance or audience demand.
