# Security desk and shift credentials

Version 1.0.0 · Loopforge Days 2–4 · B / Raking light

The native PNGs are straight-alpha sRGB pixel artwork. Each PNG has a same-sized, independently editable OpenRaster master. The manifest indexes all fifteen exports and gives their checksums, insets or pivots, text areas, source rights and placements. Pixel coordinates use a top-left origin. The two custody graphics depict an administrative record in Security. They can ship while LEVEL and ENGINE determine a physical detention location.

## Binding the case

| Public state from ENGINE | Screen treatment | Player action |
| --- | --- | --- |
| LIMEN has yet to discover a missing credential, or clearance skipped the check | The desk remains in its usual state. | Keep watching. |
| LIMEN discovers the discrepancy and the shift intervention remains available | Anchor `sec-signal-action` at the ID desk. The raised brass flag, name and event are readable without sound. Everyone behind bob waits. Workers cleared earlier may move and work. | Open the panel through a 44 × 44 CSS px control or the equivalent keyboard action. Looking leaves the intervention available and the simulation running. |
| Player inspects the open case | `sec-panel-active` with the public reason, “Issue daily pass” when admitted, and “Keep watching”. Retain the view of LIMEN, bob and the queue. | Close/reopen the free panel, or submit the action while the case is current. Late or duplicate commands are reconciled against ENGINE’s current state. |
| ENGINE confirms issuance | `sec-panel-committed` with `sec-pass-issued` and the live holder, issuer and shift validity. At hand/desk scale use `sec-pass-issued-world`. The next worker steps forward for their own check. | Review the attributed account. The original and bob’s search persist. Custody remains private until witnessed. |
| The case closes without a pass | `sec-panel-expired` reports that the intervention opportunity closed. Show `sec-custody-held` only with the public Security account of the detention, and `sec-signal-report` as its read affordance. | Read the case. Any unused intervention remains available elsewhere. |
| The shift intervention has already been spent | `sec-panel-spent` and the case’s live status. A discovered case can still yield `sec-signal-report`. | Read the account while Security resolves the case. |
| Shift ends | `sec-pass-expired` shows a punched, torn stub. `sec-custody-released` retracts the crossbolt if a release has occurred. Work resumes after the worker actually arrives. | Read the shift result. A fresh inspection may give rise to a new case next shift. |

The open, committed, expired and spent panel plates form a shared component for Security, Conveyor pace and public endorsement. Set the header, reason, actor, room and choices from the committed public record. An expired **opportunity** and an expired **pass** are different records; they can have different timing. A hidden item or an actor’s private belief cannot create a public icon. The read-only document and raised flag have distinct silhouettes. Never flash the signal or open the panel automatically.

## Registration and rendering

| Family | Registration | Draw order and scale |
| --- | --- | --- |
| `sec-id-bob-world`, `sec-pass-*-world` | 15 × 19 original, 21 × 13 permissions. Keep the PNG pivot at the public desk/hand socket. | Existing desk rear, actor/hand socket, visible card, existing foreground lip and grip. World scale follows the current camera’s CSS px per metre divided by 64. |
| `sec-id-bob`, `sec-pass-issued`, `sec-pass-expired` | 40 × 56 original and 64 × 40 tickets. Each has an inspection-specific composition and a clear holder/issuer/day slot as applicable. | Draw at an integer scale when possible. At small physical sizes use a live holder and “Valid through shift …” / “Expired” caption next to the card. Match the reported issuer. |
| `sec-signal-*` | Native 24 × 24, pivot at (12,23). | Screen-space marker at the local desk anchor. Reserve the speaker bubbles’ highest layer. Hit area and semantic role live in the UI. |
| `sec-custody-*` | Native 64 × 48. | Screen-space Security record beside the worker’s live name and status. Read the bar position in grayscale. A release record does not imply that the operator has arrived at a station. |
| `sec-panel-*` | Native 144 × 88. Insets L24/T23/R8/B8. | Opaque enamel beneath UI text. Preserve the edges at native scale. Place the live heading 27 px from the left, 6 px from the top, with 11 px right clearance. Body margins are 10 px L/R/B and 26 px top. Expand the panel vertically for long copy. Never bake translations into runtime art. |
| `sec-focus-ring` | Native 24 × 24, insets 9 px on each side. | Uppermost layer of the focus target, centered on at least a 44 × 44 CSS px control. Support native DOM focus and accessibility naming as well. |

The physical die-cut and stub differ between original and day pass. bob’s portrait uses the approved southeast head and Security light from the original calibration layers. The original’s punch hole, laminated portrait, bottom code strip and guard rails survive at the world scale. The temporary pass uses a landscape ticket with an issuance stub; expiration removes the stub and cancels its stripe. The values printed on inspection slots remain dynamic.

## Inspection and sources

- `proofs/panel-320.png` is a static UI composition at 320 × 150 px. The example targets are 160 × 44 and 116 × 44 CSS px. It previews keyboard focus and body text at native phone size. Rendered text in this proof is fixture copy.
- `proofs/pass-records-320.png` composites the issued and expired permission records at 320 CSS px. The exact same ticket template binds live holder, issuer and day inside three 93 × 24 CSS px slots at 3× native sprite scale. The values are **bob**, **Producer** and **Day 2 bell**. The asset builder asserts actual glyph bounds against each slot, including the expired ticket’s shorter right edge. If a later translated name exceeds the slot, show the full value alongside the card. The branch currently uses Producer as pass issuer and LIMEN as the attributed expiry event actor. Read the issuer from the permission record in both views.
- `proofs/pass-records.json` contains captured permission values and relevant ordered events from a real early-seed run of the in-progress ENGINE shift simulation. Day 2 starts with LIMEN’s accepted bid. After bob’s open case an admitted pass command produces `pass.issued` at tick 5671. Stepping the same run to the bell produces `pass.expired` at tick 7263. The JSON includes ENGINE source digests and the two actual commands. The PNG is an art composition driven by those records. Integrated playback and the public protocol are reviewed in ENGINE’s build.
- `proofs/security-contact-sheet.png` shows the full native part family with enlargements. This is an asset review plate. Live reaction and decision timing are verified in ENGINE’s playable build.
- `exports/` contains runtime-only art; `masters/` contains flat-canvas OpenRaster layer stacks. The ORA layers expose the paper or enamel, cut geometry, portrait, stripe, stamp, state insert or cancellation, depending on the asset. All masters use straight-alpha RGBA.
- `source/build_security.py` reconstructs the masters and native export family in this checkout and validates every layer stack against its export. Running requires Python 3, Pillow, the merged calibration `01-style-B.zip`, and Liberation Sans for proof captions. Font pixels never enter the runtime sprites. Source and coordinate details are recorded in `manifest.json`.
