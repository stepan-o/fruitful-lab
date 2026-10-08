# Loopforge interface themes and asset system

8 October 2026. Owner direction: keep all six generated styles available and implement them in the game. Styles 01, 03 and 04 are promising, not an exclusion of the others. A game start menu and in-run settings expose the same theme selection. This record distinguishes the current implementation from later kit expansion.

## One game, six presentations

Factory Original, Field Instrument, Broadcast Desk, Foundry Switchboard, Submarine Watch and Neural Diagnostics use the same interface hierarchy, readable text, hit targets, rules, scenes and character identities. Each has its own authored camera chrome, portrait socket and control states. Theme selection changes material presentation; it never changes production, supervisor motives, knowledge or difficulty.

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

The start menu uses the original factory lobby with its Loopforge floor insignia, physical Start shift and Settings controls, and return to the Loopforge landing. The floor logo remains visible at desktop and phone sizes; narrow layouts place controls above the scene rather than cropping away the floor. Start opens a full-screen weekly leadership call with original artwork, soot framing and live lower captions. It announces the quota and returns to the paused factory with no assignments. Choosing an adviser remains the first meaningful decision. The factory shows compact facts and the Choose adviser control. Roster selection accommodates at least five candidates, with two available initially; the selected detail precedes explicit appointment. The appointed adviser’s brief and proposed placements are separate focused screens. Factory, Development and Records remain durable navigation destinations. Weekly-call artwork is shared across themes and deliberately hides monitor housings, instruments and the beacon. Coherence comes from palette, character art, type and physical controls rather than identical chrome on every interface.

In-run Settings pauses advance requests and exposes the same six themes. Menu access preserves an active in-memory run. Resume means that existing session, not a promised cloud save; reloading currently begins a new first-day prototype. Theme preference can persist locally even though game progress does not. Restarting a run is a separate explicit action.

Show all six names and material previews. Display loading, success and failure honestly. Do not mark a theme active until its required assets are ready. The old complete presentation remains usable if loading fails. Applying a theme must not accidentally start or resume the conveyor. Sound, motion and readability preferences are independent of theme.

## Replace assemblies, preserve semantics

| Assembly | What can change | What stays fixed |
| --- | --- | --- |
| Console and monitors | Authored bezel, surface palette, glass treatment and compatible framing geometry | Six positions, room identity, active/off state, camera art chosen from permitted facts |
| Intercom | Frame treatment, portrait socket, speech-surface material | Character identity, current statement, selection/authority meaning, readable native text |
| Controls | Matching resting, hover/focus and pressed artwork; bounded physical response | Accessible name, action, disabled/pending state, focus order, minimum target size |
| Instruments | Material plate and a coherent icon family | Funds, workforce, condition and weekly delivery definitions; no invented gauges |
| Shared content | Room scenes, character portraits, room-label content, fonts and sounds | Shared across the first comparison so theme results are comparable |

Treat a button's housing and all its interaction states as one assembly. Do not mix one theme's resting button with another's pressed state. A portrait is separate from its socket. A room scene is separate from its bezel. Text never lives in a full-screen raster. Generated blank tapes carry live Caveat handwriting, preserving semantic names and responsive wrapping. Speech uses Barlow Semi Condensed; instruments use IBM Plex Mono, self-hosted by Next font.

The current release includes six separately generated portrait sockets, shared original portraits and glass, cropped relief symbols from the baseline sheet, and separately generated blank tape and speech surfaces. Additional symbols must be explicitly catalogued; a style sheet is not evidence that every illustrated component has been implemented. The review boards themselves are never the playable scene or runtime sprite sheet.

## Asset contracts and delivery

Keep the existing immutable media pipeline. Each theme has a catalog of logical asset IDs, optimized responsive derivatives, a content-hashed manifest and a short-cached release pointer. Source masters and generation records live outside public media. Production consumes the published derivatives.

The theme registry owns stable IDs, display names, palette tokens, compatible geometry, preview references and a pinned build-time manifest. The theme adapter maps these to semantic presentation slots. The generic asset manifest remains a file-delivery contract; do not insert UI geometry or game rules into it. Geometry belongs to the typed presentation adapter alongside the registry. Whole monitor stage dimensions preserve a 1.65 aspect ratio inside responsive cells; calibrated safe openings cover each theme’s differently shaped bezel. The implementation bundles the six immutable manifest snapshots as small metadata imports; no runtime latest-pointer fetch can silently change a recipe. The asset check verifies file/manifest hashes at build time.

For each new asset retain: source and generation prompt, reference images, rights/use record, content hash, intended slot, state family, source dimensions, crop/trim recipe, scale variants, safe content inset, corner/slice geometry and review status. Control sheets are split into three equal-height rows, then transparent gutters are trimmed. Each control state renders in the same fixed native target and does not move its text or hit area when the image changes. Per-state source dimensions and exact crop regions remain in the preparation record. Keep cut lines out of corners and lettering. Do not stretch a complete monitor or character portrait to fit arbitrary aspect ratios.

Load only the selected theme's required files. Keep ordinary room/portrait assets shared and let content hashes deduplicate bytes. Prepare interaction states before enabling a newly selected control family so first hover does not flash. Large style sheets load only in the design review. Do not prefetch all six full kits at game entry.

Resolve and validate a complete release before applying it. In-run switching stops advance requests, waits for the one pending command to settle, prepares the replacement material set, and commits it together. Failed or superseded loads never replace part of the screen. Keep the previous kit, expose retry and retain the user's run. A theme change does not replay factory sounds or past events.

Pinned recipes prevent a hybrid from silently combining three independently moving “latest” pointers. Publish files and manifests first; update the compatible recipe/registry together; retain prior immutable files. Roll back with a new deployment that references a retained release, not by deleting current media. Browser image decoding is a readiness check, not a claim of runtime cryptographic verification of every image; manifest integrity and build-time file hashes provide the existing delivery checks.

Font files need their own license records and self-hosted delivery. The current image/data manifest parser does not accept font extensions; do not pretend a font is an image. Font selection and readable sizes stay common during the first skin comparison.

## Combining themes

Player Settings offers complete named themes. An explicitly labelled author mixer combines a monitor-and-socket kit with a complete control family using only registered compatible sets. It is presentation tooling, not a new game mechanic. Begin by comparing the six complete themes; then vary one assembly at a time.

A useful currently supported candidate is Factory Original's monitors and sockets with Foundry Switchboard's controls. Independent socket mixing can be added later with its own validated recipe version. This is an experiment, not a chosen final direction. A successful combination becomes a named, versioned recipe after checking light direction, material scale, corner geometry, icon readability and mobile composition. Avoid a permanent collection of arbitrary per-element overrides.

The first mixer may expose only assemblies actually implemented; label shared or unavailable families honestly. Never imply the small style-sheet specimens are usable production assets merely because their names appear in a selector. Invalid recipe IDs fall back to a known complete theme; query strings cannot supply arbitrary asset URLs or executable styles.

## A fair practical comparison

Hold content, layout, type size, sound mix, event timing and commands constant for the first pass. Record engine/schema version, seed and command transcript separately from theme/asset revision, viewport, density, motion and sound settings. The same transcript must yield the same state hash under every theme. Side-by-side review uses frozen projections, not two live clients issuing competing commands.

Use the unassigned first turn, adviser briefing, a changed assignment, an adviser-owned automatic event, a director decision, dispatch and debrief. Include long text, keyboard focus, loading failure, disabled controls, sound-off and reduced-motion states. A six-active-room composition can test later visual density, but remains an author fixture, not a claim that later progression is implemented. Do not expose private worker/supervisor components in a player snapshot to make a richer demo.

Judge whether the player finds adviser choice, understands delegated authority, sees the affected room and consequence, can read speech, recognizes a committed action and enjoys the physical response. Record missed controls, hesitation, mistaken expectations and preference; do not confuse faster clicking with better decisions. Counterbalance the order of themes so familiarity does not automatically favour the last one. Owner judgment leads until real audience testing exists.

Test 320, 390, 768 and desktop widths; fit common desktop heights without hiding the core action. Preserve at least 44px targets, visible focus, semantic labels and no accidental horizontal page overflow. Closed rooms remain unpowered glass with only their tape name. Off/disabled states cannot depend only on colour. No theme may disclose hidden stats or obscure known consequences.

Measure the complete opening, not just individual file sizes: selected image bytes, decoded image memory, first visible frame, first hover, switch latency, layout shifts and interaction response. Initial image targets remain 350 KB on a typical phone and 800 KB on desktop; document measured exceptions and remedy them. Use bounded transform/opacity effects, stop hidden/offscreen work and preserve a complete still state. These are lab checks; field Core Web Vitals remain unmeasured until traffic supports them.

## Implementation sequence and gate

1. Record this contract and preserve the immutable asset pipeline.
2. Generate and inspect six matching monitor/control sets from the six sheets; retain prompts and crop recipes.
3. Add a typed theme registry, validated loader, shared semantic components and local presentation preference.
4. Add the start menu and in-run selector. Keep the run controller alive and make switching transactional.
5. Expose compatible assembly mixing for author review; keep ordinary player settings simple.
6. Publish the runtime links in UI style studies and the architecture in a Themes & assets tab, UI document and engine notes.
7. Verify complete first-day flow, all six presets, an actual hybrid, pending-command/failed-load behaviour, persisted preference and mobile/keyboard access. Run repo checks and update the draft PR.

The broader playable UI quality gate remains separate from “six themes load.” The owner judges the final composition and enjoyment. Material changes must not be presented as completed Act 1 mechanics or a live 3D factory.

## Rotating light feedback

The shared overhead beacon is a separate semantic feedback layer across all themes. It is dark between event-driven rotations: cyan for sparse inactivity, green for confirmed production, red for actual accidents, ember/amber for attention. The design workbench can preview all four impulses without creating a game event. See [the light contract](CONSOLE_LIGHT_FEEDBACK.md) for priorities, geometry, timing and accessibility.


## Focused console composition release

The former material-only revision retained the rejected action column. That composition is superseded by `FOCUSED_CONSOLE_REBUILD.md`. Six cameras and compact action access are now the default; the roster is a separate workspace. The active workspace uses its own composition; it does not accumulate additional columns beside the wall. Portrait socket masters and the shared surfaces live in `apps/lab/assets/sources/loopforge-focused/`, with exact prompts, references and derivative recipes. Original dispatch, logistics and lobby scenes are reused outside the six-room management grid. Read-only `/play/console-study` compares first-turn, six-active-feed and five-adviser density under every kit without starting a run.
