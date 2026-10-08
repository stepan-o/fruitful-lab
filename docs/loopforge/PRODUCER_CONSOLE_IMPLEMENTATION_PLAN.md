# Integrated console skins — execution checklist

8 October 2026, owner continuation after the concept pass: implement every new draft as a selectable console skin. Remove the six earlier themes from the player-facing selector. No winner needs to be chosen first.

## Scope and sequence

- [x] Create four independently briefed concepts and review them in the design presentation.
- [x] Produce faithful clean runtime plates: no baked factory state, camera imagery, numbers or permanently lit signals. Preserve each composition and medium.
- [x] Add four console recipes with geometry and matching focused-screen equipment. Keep the simulation and active run above appearance changes.
- [x] Replace theme selection with Foundry desk, Broadcast control, Dispatch office and Obedience organ. Support direct review links, safe saved-preference migration and transactional loading.
- [x] Build the factory workspace as one integrated console, with original room feeds, facts, native receiver, supervisor selector, production control and localized beacon. Retain focused roster/brief/plan/incident/dispatch/records jobs.
- [x] Implement console-first entry and mandatory opening-call acknowledgement. Returning early, Settings, switching skins and resuming cannot bypass or repeat an acknowledged mandate.
- [x] Author a phone arrangement using the same art parts with readable controls, six-channel awareness and separate focused views.
- [x] Validate the first-day flow, switching without losing drafts, all four skins, keyboard, small phones, effects-off and local light.
- [x] Update system/UI/design records from concept proposals to the actual delivered boundary. Keep remaining omissions explicit.
- [x] Run required checks, publish the existing scoped PR and inspect its hosted preview.

## Acceptance boundary

The four new skins change the main console's physical composition, camera geometry and materials. They share commands, factual projections, sounds and signal meanings. The underlying six legacy equipment packs may supply compatible assets to focused interfaces, but are no longer separate options offered to players. Historical style sheets remain design records.

The current one-day kernel and KVP endpoint remain unchanged. Opening acknowledgement is a session presentation gate; it is not authentication or a new engine command. A later multi-week mandate will require an explicit engine contract. No later rooms, hidden traits, cloud saves or advanced BDI are invented to fill the console.

Art and visual checks must happen on rendered interfaces. Successful build checks alone do not clear the visual or enjoyment bar.

## Responsive continuation

The owner explicitly requested mobile-specific art plus adaptation to arbitrary window dimensions. All four portrait plates are produced. The renderer crops registered regions of those plates into a camera bay and three controls, with independent DOM facts/labels and a native beacon. Available space selects the composition; no device or user-agent branch changes game logic. Under 360 CSS pixels wide, or under 520 pixels of available portrait height, one feed and six named channel keys replace thumbnails. Wide but under 470 pixels of console height uses the compact landscape arrangement. Wide layouts preserve their source ratio; portrait glass and the control bay can grow independently. Live resizing retains the selected feed, acknowledged call, adviser and current run.

Local rendered checks so far: 1440×900 wide Foundry/Broadcast/Dispatch/Organ; 390×844 portrait Foundry/Organ; 320×740 one-feed view; 844×390 compact landscape. Exact page scroll bounds equal the viewport in the tested responsive cases. Opening call, acknowledgement, adviser selection and cross-skin state retention were exercised. Remaining publication checks are tracked above.

The full suite passed: 371 tests across 71 suites, one snapshot, immutable asset checks and production build. A final CSS-only rebuild follows fixes found during play: Dispatch operator/REC labels in compact modes, and adviser speech in a paused decision dialog. Server-backed browser run: STILETTO / unchanged proposal / delegated conveyor response / Security override / 22 produced / 11 retained / 11 delivered / condition 82 → 67 / all workers survived. A stopped local server also exercised reconnection without losing the approved plan. Hardware/animation limitations are explicit in the direction doc.

Hosted verification on `b27fb02`: Vercel READY; 2555×1310 console and 320×740 / 390×844 phone modes fit the viewport. Mandate acknowledgement persisted through resize. A complete STILETTO run with Security override reached debrief with the same 22 / 11 / 11 outcome. Decision speech remained visible; no browser errors recorded. PR #99 is ready for owner review.
