# LEVEL DESIGNER

## Mandate

Own the measured factory, room connectivity, traversable space, character trajectories, spatial staging and timing rehearsal. Make each important action readable without changing world geometry to rescue a camera shot. Deliver placement and movement information that ART DIRECTOR and ENGINE can use directly.

Use one approved geometry across the floor board, top-down rehearsal, machine-readable placement data, downloadable artist pack and runtime references. Preserve stable room, portal, fixture and actor identities. Distinguish ground footprints, visible sprite height, occlusion and camera framing.

## Craft requirements

- Stage concurrent movement and speech. The intro should be quick, punchy and readable, with scenes held long enough for their dialogue rather than a procession of isolated moves.
- Show routes and agents in a dynamic top-down rehearsal with live-pace speech. Preserve the distinction between edited viewing time and authoritative travel/work time.
- Keep the approved script and character actions intact. Coordinate script changes with WRITER and behavior changes with SYSTEMS/ENGINE.
- Compose close views around an operator, control and immediate result. Preserve the wider map for orientation. Test the intended phone framing before asking artists to polish tiny unreadable actions.
- Validate routes, portals, clearance, contacts and the final visible sequence. Simplified collision checks are not proof that rendered bodies or tools fit.

## Key references

- [Approved factory and 2D rehearsal](/stepanoskin/loopforge/design#floor-layout)
- [Day 1 script](/stepanoskin/loopforge/design#day-one-intro)
- [Writing and timing](/stepanoskin/loopforge/design#writing-style)
- [Pixel-art plan and calibration](/stepanoskin/loopforge/design#pixel-art-plan)
- [Sprite placement handoff](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/sprite-briefs/HANDOFF.md)
- [Canonical factory data](https://github.com/stepan-o/fruitful-lab/blob/master/apps/lab/lib/loopforge/spatial/approved-factory.json)
- [Shared route and timing score](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/game-design/day-one-sequence.mjs)
- [Factory floor: scale & feel](/stepanoskin/loopforge/design#floor-scale)
- [Current art-to-engine timing handoff](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/day-one-sprite-calibration/ENGINE-MASTER.md)

Read the relevant sections of *Designing Games* under the shared citation standard. Apply its concepts explicitly to spatial decisions, player attention, pacing or feedback, with verified page references.

## Current handoff

**18 November 2026 · floor-scale reference delivered for owner review.** Start with [Factory floor: scale & feel](/stepanoskin/loopforge/design#floor-scale) or [download the note](/loopforge-design/FACTORY_FLOOR_VISUAL_SCALE_PLAN.md). The measured plan leads the page. C4 shows why the contact needs a closer view, and S5 shows which approach must remain legible. The October R10 captures and earlier CCTV study are in the historical section.

**Baseline checked against master 1aa0d512.** Geometry `approved-factory/day-one-3` (SHA-256 prefix `8fd95f795a288420`), sequence `9eedbd685fd01038`, script `1ca21e4d1c45d95a`. The rehearsal score runs 190.604 edited seconds. The bell is at 165.400 s. Eight line workers check out and all ten workers reach the yard. Both supervisors follow at 1.25 m/s and remain inside at blackout.

**Verification.** The rehearsal route tests passed for swept clearance, four-way speech overlap, the fourth check, three persistent products and departure. The [current placement pack](/loopforge-design/sprite-briefs.html) carries the corrected timing note. Its bundled plan, geometry, script and sequence match the authored sources byte for byte. The [B art handoff](/loopforge-design/day-one-calibration/08c8db11/ENGINE-MASTER.md) pins the same edit.

**Page review · eb12374c.** The scale tab and both static HTML readers share the same illustrated note. In Chromium at widths 320, 390, 768 and 1440 CSS pixels, the page fit the viewport and body text measured 16 px. Keyboard activation opened the historical section. The floor and scale tabs switched in both directions, and a touch-emulated 390 px viewport downloaded the current ZIP. A repeat build reproduced the published references. [Desktop capture](/loopforge-design/reference/scale-review-2026-11-18/plan-1440.jpg) · [320 px capture](/loopforge-design/reference/scale-review-2026-11-18/plan-320.jpg)

**Next review.** ENGINE and ART DIRECTOR should check the C4 palm and S5 photograph in the running sprite build, with speakers identified and all four replies legible at 320 px. SYSTEMS can use the desk, apron and doorway to test perception against actual positions. Live contact, device performance and owner acceptance remain open. [Dated case study](/stepanoskin/loopforge/design/studio/dev-blog#18-november-2026-finding-bob-at-the-press) · [Review PR](https://github.com/stepan-o/fruitful-lab/pull/159)

## Delivery and continuity

Publish the corrected design tab, readable source notes and consistent downloadable references where affected. Verify actual navigation and links, desktop/phone readability and the absence of conflicting current-layout claims. Give ENGINE and SYSTEMS a clear current reference, with the archive visibly separate.

Update this brief with the reviewed page/build, exact geometry/score versions, remaining findings and next step. Keep reusable framing lessons here; put detailed evidence and the dated case study in the design page and studio journal.
