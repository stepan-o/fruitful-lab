# ENGINE renderer binding

**Entry point** `shift-art.mjs` · **Public protocol** `loopforge_shifts_ts` / `shift_floor_1`

Pass the committed Frame returned by `apps/lab/lib/loopforge/shifts/wire.ts::read` to `selectShiftArt`. Process full snapshots and ordered diffs with ENGINE’s recovery and hashing logic before rendering. The adapter is a pure selection step: it constructs neither a Run nor a clock. Room, open panel, locally previewed bid and bubble display duration belong to the viewer.

```js
import {selectShiftArt, commandPayload, drawAsset} from './binding/shift-art.mjs';

const ui = {room: 'security', openCase: null};
// Within the authenticated/verified frame handler:
const view = selectShiftArt(frame, ui);
// Draw the small signal using the projected desk anchor and the sprite pivot.
// images is a map from each entry.atlas string to its decoded CanvasImageSource.
if (view.signal) {
  const art = manifest.assets[view.signal];
  const [px, py] = art.pivot;
  drawAsset(ctx, manifest, images, view.signal, deskX - px * scale, deskY - py * scale, {scale});
}

// On desk button activation (tap or keyboard), rerender with this local state.
ui.openCase = frame.scene.world.caseId;

// Only after the separate pass button is committed:
const payload = commandPayload(frame, ui, 'issue-pass', 'bob', commandId);
if (payload) worker.postMessage(envelope('INPUT_COMMAND', nextSequence(), payload));
```

Resolve `entry.atlas` relative to the release manifest URL. The canvas destination is top-left; `scale` converts native pixels to host canvas units. Provide `width` and `height` to stretch a panel's centre/edges while preserving its corner pixels. Source rectangles in `manifest.assets[id].rect` are atlas-local. Safe text areas and font sizes belong to the lane manifest. Keep interactive buttons in the semantic UI with a visible focus outline and 44 × 44 CSS px minimum target. The desk icon can be smaller.

## Public binding contract

| Public value | Skin behavior |
| --- | --- |
| `world.phase`, `day`, `lead` | Show the morning bid tray, live rooms or shift-close docket. On successive mornings render the next-shift plate. A bid previews both assignments. The committed pair comes from the active shift. |
| `world.caseId`, `status`, `deadline`, `spent`, `called`, `pressure` | Both desks hold during the open case. A report-only desk cue remains available when the mandate is spent. The open panel's valid commit controls come from `choices`. A resolved case can be read to inspect its result. |
| `pass`, `agents[].duty`, `custody.release`, `credential.returned` | Bind holder, issuer and shift from the pass; switch to expired at the bell. A detained worker uses a Security custody insert. Returned-original art requires the witnessed register event. The holder's inventory and beliefs stay out of floor overlays. |
| `queue.advanced`, `agents[].moving/x/y` | `nextStep` identifies the physical first step by the worker behind bob. Continue drawing all visible actors from their public positions; `case.resolved` alone supplies no next-worker clearance. |
| `coverage`, `items[].stage/status`, `handoff.*` | A staffed station and its current workpiece determine eligibility for a handoff plate. Show the rushed or all-clear variant when the corresponding work starts. `waitingForClear` can drive a live label alongside the ready indicator. Never interpret a vacancy as a worked cycle. |
| `completed`, `shiftOutput`, `items[].at` | Draw inherited and new rack items at ENGINE’s committed millimetre coordinates. Multiple IDs can share one of the three anchors. Sort at the station, paint cradle, contents, then lip. Keep the shift output and cumulative count distinct. In briefing, `rack.thisShift` is empty. |
| `speech.delivered`, `chat.interrupted`, `endorsement.public` | A separate tail and live name follow each visible speaker. Only complete, delivered pieces supply words. Interruption changes the last active bubble of its subject; it never reveals the missing next piece. Public backing anchors the Producer to the desk. Another room receives no local speech bubble. |
| `report.received` | Render the report's real speaker and text away from the desk. The latest same-day attributed report survives eviction through `world.report`. Merge it with same-day public report events by sequence. Current deliveries have an empty audience; if an addressed set is supplied, only a report including the Producer is displayed. Returning after the bell shows the retained report for that shift. A new day starts its own report window. |
| `choices` | Supports `appoint`, `issue-pass`, `accelerate`, `slow`, `rush` and `endorse`. Select a proposal or open a panel locally. On explicit commit, send one new command ID. Retry the identical payload for an uncertain delivery; show a rejection reason and wait for the next verified frame. |
| `local:'inspection'` worker message | Only the separate reviewer inspector may read private evidence and motives. Public `audience` is the addressed set for a speech mark. Actual hearing and belief consolidation remain worker-owned. The player adapter never copies a debug payload into report or speech slots. |

Speech lifetime is viewer policy. The selector defaults to 60 ticks (3 s at 20 Hz); pass `ui.bubbleTicks` to match the active painter. Draw tails first, then flexible boxes and live highlighted names. Pack artwork supplies framing and anchors. The host owns collision avoidance, actor interpolation, hit targets and panel focus restoration. Clear `openCase` on checkpoint reset or shift change. The adapter retains no simulation data.

## Reproduce or inspect

`samples.json` contains full public snapshots and real domain command results from the development checkout. Each snapshot passed the engine's hash verifier. The capture also fed the initial, post-command, first-diff and terminal frames from all nine official replay fixtures through the same adapter. `engineFixtures` records their filenames, byte digests and public state hashes. The relative runtime route is `/loopforge-shifts/fixtures/` in ENGINE’s review build. The `sourceSha256` register in `samples.json` pins the exact shift sources used, including `wire.ts`, `simulation.ts` and the inherited Day One state. The source files can evolve while integration continues. Compare hashes before adopting exact ticks or counts as current golden results.

**Frozen review cut.** All evidence uses simulation `c5dab5869165`, public wire `56c7872c62d5`, Conveyor `ef0b0308c68b` and navigation `a808ba4f3be5`. The nine scenario files regenerated by ENGINE’s replay script match the nine fixture files in its development review directory byte for byte. That script subsequently failed its gameplay expectation that sam did not hear STILETTO’s public endorsement. At tick 9467 the engine recorded sam as hearing it and mae as the sole worker outside hearing, for either endorsement. The producer-facing adapter receives no private hearing set. The separate developer record in `review-only-hearing.json` captures both actual hearing lists and their source revision. The public-frame and diff checks passed independently of this witness-regression finding.

- `node binding/smoke.mjs` exercises the checked-in snapshots. Pass the release `manifest.json` as an optional argument to check all selected asset references and atlas rectangles.
- `node binding/capture.cjs /absolute/path/to/ENGINE-checkout` regenerates all public examples using that checkout's TypeScript hook, simulation, review checkpoints and wire reader. Its app dependencies must be installed. This also resubmits the exact same pass command and checks that no second event is produced.
- `desk-open`, `pass-issued`, `next-worker`, `detained`, `desk-spent`, `pass-expired`, `released`, `next-morning` and `renewal-open` follow the same captured failed check or a clone of it. `reply-interrupted` and `reply-delivered` fork one Conveyor chat. The two `first-handoff-*` / `rack-*` comparisons start with the same late queue and identify the accepted morning adviser in the suffix. `clash-open`, `endorsement` and the three `crew-*` examples start from the same Day 4 checkpoint.
- Actual rendering, elapsed decision-window comprehension and worker reactions require the live game. A reviewer's private earshot trace belongs to ENGINE. Physical jail placement belongs to LEVEL/ENGINE. The art adapter can show the custody insert before a floor anchor is assigned.
