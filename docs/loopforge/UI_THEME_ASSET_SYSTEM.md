# Loopforge interface themes and asset system

8 October 2026, latest owner scope: implement all four integrated console drafts as selectable skins and remove the old six themes/mixer from the player selector. [Producer console direction](PRODUCER_CONSOLE_DIRECTION.md) governs opening, geometry and native light. No winner selection is required. Matching legacy materials remain internal for focused screens and migration. Delivery and verification are underway; historical material checks do not establish complete four-skin acceptance.

## One game, four integrated consoles

Foundry desk, Broadcast control, Dispatch office and Obedience organ are the only player-selectable skins. Each has calibrated plate/glass/control geometry; Dispatch office retains one primary camera plus five, while the others use their six-pane profiles. All share the same rules, original room art, character identities, readable facts and task ownership. Skin changes do not alter production, motives, knowledge or difficulty.

`CONSOLES` owns the four IDs, names, material descriptions and default focused-screen mappings: foundry-desk → baseline; broadcast-control → broadcast-desk; dispatch-office → foundry-switchboard; obedience-organ → neural-diagnostics. `ThemeId` retains the six old values internally so existing focused primitives and valid historical recipes still resolve. Those values are not six extra choices in Settings.

The stack remains Next.js, React, TypeScript, native controls, CSS Modules and Web Audio. A new renderer or animation framework is unnecessary for equipment skins. A future tick-fed 3D factory remains a separate view over the same knowledge-filtered protocol. It can reuse semantic asset references without inheriting DOM layout or CSS.

```text
Deterministic world → knowledge-filtered snapshot/diffs → stable run controller
                                                        ↓
                                                semantic interface
                                                        ↓
                                       selected presentation recipe
                                                        ↓
                                  pinned assets + geometry + materials
```

The run controller is mounted above visual changes. Never key the game or its command surface by theme: doing so would reset the transcript, an unconfirmed assignment edit, dispatch selection, focus or event-cue history. The kernel and HTTP commands contain no theme, texture, DOM, sound or asset URL. Presentation changes do not increment the simulation tick or use its random stream.

## Where the player chooses

The start menu retains the original lobby, visible Loopforge floor insignia, Start shift, Settings and return to the landing. The preceding baseline's direct-to-call opening and six-housing wall are historical; the approved delivery enters an integrated producer console first.

The delivery contract is **Start → producer console → Answer leadership → existing cinematic call → Acknowledge quota → console → Choose adviser → roster/appointment → brief → placements**. Receiving the native ringing call is the sole opening gameplay action. Early close cannot unlock the selector or other gameplay; settings, mute and exit remain usable. Receiver and selector have distinct ownership. All four custom profiles share original live room feeds, read-only projected facts and local light; two feeds start live and four off. Final runtime verification remains to be recorded.

Retain the current full-screen original call artwork, soot framing, live lower captions and choreography across themes. It hides console equipment and beacon; first week uses the opening mandate, never fabricated prior-week results. The dedicated roster has five channels, two initially available; inspection precedes explicit appointment. Briefing and placements keep separate focused screens. Factory, Development and Records retain their jobs after the opening gate. Coherence comes from palette, character art, type and purposeful controls, not identical chrome on every interface.

In-run Settings pauses advance requests and exposes the same four skins as the menu. Menu/resume preserves the active in-memory session, not a promised cloud save; reload still begins a new playtest. Skin preference can persist locally. Restart is explicit. Acknowledgement and unconfirmed placement/dispatch choices must survive Settings, skin changes and menu/resume without a keyed remount. Changing equipment neither dismisses a pending call nor unlocks gameplay.

Show all four names and compact concept previews. Display loading, success and failure honestly. Do not mark a skin active until its full runtime plate and paired focused-screen assets decode. Failed or superseded requests keep the previous complete presentation. Applying a skin must not start/resume the conveyor. Sound, motion and readability preferences remain independent.

## Replace assemblies, preserve semantics

| Assembly | What can change | What stays fixed |
| --- | --- | --- |
| Console and camera region | Authored shared housing, material palette, glass and calibrated geometry for each of the four profiles | Six room identities, two-live/four-off opening state, camera art chosen from permitted facts; no six repeated cabinets |
| Leadership receiver / supervisor selector | Coherent physical assemblies and bounded local feedback | Distinct incoming versus internal communication, sole opening receive action, acknowledgement gate and dedicated roster ownership |
| Intercom | Frame treatment, portrait socket, speech-surface material | Character identity, current statement, selection/authority meaning, readable native text |
| Controls | Matching resting, hover/focus and pressed artwork; bounded physical response | Accessible name, action, disabled/pending state, focus order, minimum target size |
| Instruments | Material plate and a coherent icon family | Funds, workforce, condition and weekly delivery definitions; no invented gauges |
| Shared content | Room scenes, character portraits, room-label content, fonts and sounds | Shared across the first comparison so theme results are comparable |

Treat a button's housing and all its interaction states as one assembly. Do not mix one theme's resting button with another's pressed state. A portrait is separate from its socket. A room scene is separate from its bezel. Text never lives in a full-screen raster. Generated blank tapes carry live Caveat handwriting, preserving semantic names and responsive wrapping. Speech uses Barlow Semi Condensed; instruments use IBM Plex Mono, self-hosted by Next font.

The current release includes six separately generated portrait sockets, shared original portraits and glass, cropped relief symbols from the baseline sheet, and separately generated blank tape and speech surfaces. Additional symbols must be explicitly catalogued; a style sheet is not evidence that every illustrated component has been implemented. The review boards themselves are never the playable scene or runtime sprite sheet.

Main-console hardware uses registered fragments cropped via CSS from the clean runtime plate. Do not describe these as separately generated transparent handsets or independent alpha control assets. Their motion, clipping and occlusion must retain registration and avoid duplicate edges. The separate sockets and button-state sheets above belong to the retained focused-screen material system.

## Asset contracts and delivery

Keep the existing immutable media pipeline. Each theme has a catalog of logical asset IDs, optimized responsive derivatives, a content-hashed manifest and a short-cached release pointer. Source masters and generation records live outside public media. Production consumes the published derivatives.

The registries own stable IDs, material palettes, compatible geometry and pinned build-time manifests. Generic asset manifests deliver files; geometry belongs in typed presentation adapters, never game rules. Each producer profile has calibrated glass, receiver, selector, production, fact and light regions. The old 1.65-ratio monitor openings remain internal to focused components, not the main console. `loopforge-producer-studies` supplies compact previews; `loopforge-producer-runtime` supplies plates keyed by the four console IDs. Existing focused material manifests remain pinned. No latest-pointer fetch silently changes a recipe; build-time checks verify hashes.

`ThemeRecipe` remains version 1 with additive optional `console`; `parseRecipe` returns a resolved ID. Foundry desk is the default. New `?console=` links take precedence and select a complete mapped recipe. Legacy `?theme=`/`controls` and saved version-1 choices retain valid internal material pairs and gain the corresponding console (baseline/field → Foundry, broadcast/submarine → Broadcast, foundry-switchboard → Dispatch, neural → Obedience). Invalid schema/IDs fall back to the default. Query strings cannot supply arbitrary asset URLs.

For each new asset retain: source and generation prompt, reference images, rights/use record, content hash, intended slot, state family, source dimensions, crop/trim recipe, scale variants, safe content inset, corner/slice geometry and review status. Control sheets are split into three equal-height rows, then transparent gutters are trimmed. Each control state renders in the same fixed native target and does not move its text or hit area when the image changes. Per-state source dimensions and exact crop regions remain in the preparation record. Keep cut lines out of corners and lettering. Do not stretch a complete monitor or character portrait to fit arbitrary aspect ratios.

Load only the selected skin's runtime plate and required focused family. Keep room/portrait assets shared and let hashes deduplicate bytes. Prepare interaction states before enabling the new family. Large style sheets remain author-only; do not prefetch four full plates or six legacy kits at entry. `prepareTheme` waits for the exact full plate used by the console even when focused assets use compact variants.

Resolve and validate a complete release before applying it. In-run switching stops advance requests, waits for the one pending command to settle, prepares the replacement material set, and commits it together. Failed or superseded loads never replace part of the screen. Keep the previous kit, expose retry and retain the user's run. A theme change does not replay factory sounds or past events.

Pinned recipes prevent a hybrid from silently combining three independently moving “latest” pointers. Publish files and manifests first; update the compatible recipe/registry together; retain prior immutable files. Roll back with a new deployment that references a retained release, not by deleting current media. Browser image decoding is a readiness check, not a claim of runtime cryptographic verification of every image; manifest integrity and build-time file hashes provide the existing delivery checks.

Font files need their own license records and self-hosted delivery. The current image/data manifest parser does not accept font extensions; do not pretend a font is an image. Font selection and readable sizes stay common during the first skin comparison.

## Historical combinations and retained internal compatibility

Player Settings offers four complete console skins and no material mixer. The preceding author mixer combined monitor/socket and control families; that is historical tooling, not the current player flow. Valid old recipes may retain their internal focused-screen mappings through migration without exposing those assemblies as new choices.

Factory Original monitors/sockets with Foundry Switchboard controls was one historical comparison. Retaining such a saved mapping does not select a new integrated-console hybrid. New player selections use their approved default pairing and avoid arbitrary per-element overrides.

Historical style-sheet specimens remain references, not proof of production completeness. New plate/control geometry must be checked in the complete running skin; adding a selector card or loading an asset alone does not establish acceptance.

## A fair practical comparison

Compare all four integrated profiles with the same state, commands and interaction requirements, allowing their approved architecture and visual style to differ. Record engine/schema version, seed and transcript separately from skin/asset revision, viewport, density, motion and sound. The same transcript must yield the same state hash under every skin. Side-by-side author review uses frozen projections, not competing clients.

Use the unassigned first turn, adviser briefing, a changed assignment, an adviser-owned automatic event, a director decision, dispatch and debrief. Include long text, keyboard focus, loading failure, disabled controls, sound-off and reduced-motion states. A six-active-room composition can test later visual density, but remains an author fixture, not a claim that later progression is implemented. Do not expose private worker/supervisor components in a player snapshot to make a richer demo.

For every skin, verify the receiver is discoverable and only explicit quota acknowledgement unlocks gameplay. Exercise early close, Settings/skin switching/menu preservation, roster choice, delegation, affected-room feedback and readable speech. Record hesitation, mistaken expectations and preference; faster clicking is not necessarily better decisions. Existing material tests do not establish this new flow. Owner judgment remains decisive without imposing another pre-implementation selection gate.

Test 320, 390, 768 and desktop widths; fit common desktop heights without hiding the core action. Preserve at least 44px targets, visible focus, semantic labels and no accidental horizontal page overflow. Closed rooms remain unpowered glass with only their tape name. Off/disabled states cannot depend only on colour. No theme may disclose hidden stats or obscure known consequences.

Responsive delivery combines four dedicated portrait-art plates with adaptive modes: wide shows the full six-camera console; tall portrait uses native 2×3 glass plus control bay; small/short shows one selected camera with six channels; compact landscape places the large camera left and controls right. All four portrait plates are generated, catalogued under `<skin-id>-mobile` in `loopforge-producer-runtime`, and implemented; final calibration and visual QA remain underway. The review gallery uses the smallest optimized portrait variant for thumbnails and opens the full variant on demand. The selected camera, run, acknowledgement, pending decision and draft choices survive resizing/rotation without a keyed remount. Plate/geometry choice belongs to presentation; it never issues a command or changes world state. Validate transitions in both directions while a call or decision is pending, including image readiness and touch/focus continuity.

Measure the complete opening, not just individual file sizes: selected image bytes, decoded image memory, first visible frame, first hover, switch latency, layout shifts and interaction response. Initial image targets remain 350 KB on a typical phone and 800 KB on desktop; document measured exceptions and remedy them. Use bounded transform/opacity effects, stop hidden/offscreen work and preserve a complete still state. These are lab checks; field Core Web Vitals remain unmeasured until traffic supports them.

## Historical material-system implementation sequence

The sequence below describes the preceding six-kit implementation. It does not mark the four-skin delivery, receiver gate or integrated geometry complete.

1. Record this contract and preserve the immutable asset pipeline.
2. Generate and inspect six matching monitor/control sets from the six sheets; retain prompts and crop recipes.
3. Add a typed theme registry, validated loader, shared semantic components and local presentation preference.
4. Add the start menu and in-run selector. Keep the run controller alive and make switching transactional.
5. Expose compatible assembly mixing for author review; keep ordinary player settings simple.
6. Publish the runtime links in UI style studies and the architecture in a Themes & assets tab, UI document and engine notes.
7. Verify complete first-day flow, all six presets, an actual hybrid, pending-command/failed-load behaviour, persisted preference and mobile/keyboard access. Run repo checks and update the draft PR.

The broader playable UI quality gate remains separate from “six themes load.” The owner judges the final composition and enjoyment. Material changes must not be presented as completed Act 1 mechanics or a live 3D factory.

## Beacon feedback: retained semantics, revised construction

The almost-flat overhead fixture and broad sweep are historical baseline construction. Each integrated skin needs a native local beacon: lens glare, reflections and shadows agree with its source and perspective. It is dark most of the time; cyan means idle life, green confirmed output, red actual accident, amber attention. Signal previews create no game event and do not validate alignment. See [the light contract](CONSOLE_LIGHT_FEEDBACK.md).


## Preceding focused-console composition release

The material-only action column was replaced by the preceding focused rebuild. Its separate roster, briefing, placements, incidents, dispatch and records remain, now paired with each console's internal material family. Its repeated-monitor overview is being replaced by the approved four profiles. Socket masters and shared surfaces stay in `apps/lab/assets/sources/loopforge-focused/`. Dispatch/logistics/lobby scenes are not extra managed rooms. Read-only `/play/console-study` records historical density studies and does not validate the current runtime delivery.
