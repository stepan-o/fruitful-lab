# STILETTO mounted-blade motion review — 13 October 2026

## Review and navigation

Game Design → Agents → Asset review library → STILETTO. Direct route: `/stepanoskin/loopforge/play/asset-review/stiletto`.

Every production review has the same direct model navigation: All models, LIMEN, Worker 01 and STILETTO. The selected model is identified with `aria-current`; links do not prefetch other players. Leaving a player aborts pending loading and disposes its Babylon scene. Only the selected model downloads. Each character retains its specific controls and review record.

STILETTO uses the actual Security/Forge renderer, starts paused on Running at 0.20 seconds, and offers all 18 source clips plus neutral. Five clips can switch between original and corrected arm curves at the same phase/camera angle. Pause, quarter speed, exact time, source-contact markers, blades independently visible, inspection highlighting, textured/clay/wireframe modes, three CCTV angles and evidence download support the review. Pose links retain clip/version/time; appearance and camera are included in the downloadable evidence. Recorded before/after pictures load only when opened. No main-play cast, BDI, saves or outcomes change.

## Owner acceptance and action meanings — 14 October 2026

The owner accepts STILETTO's prototype appearance, mounted blade arms and the
acting seen in the review player. All viewed animations appeared fixed. Record
this as visual acceptance of the current prototype, alongside the earlier
technical contact flags; no additional curves or collision checks were produced
by this acceptance pass.

Choose gameplay meaning from the equipped character's visible action. Meshy
catalog names remain provenance and do not dictate that meaning. The player now
shows the following labels with their source aliases; IDs, original animation
tracks, comparison poses, hashes and corrected alternatives remain unchanged.

| Gameplay reading | Existing review/source motion | Use with twin blades |
| --- | --- | --- |
| Alert | Idle (`Idle`) | Ready, watchful stance. |
| Idle | Alert (`Alert`) | Relaxed baseline stance. |
| Attack | Reprimand (`Shouting_Angrily`) | A physical strike; use the corrected arm variant. Do not present this as ordinary verbal discipline. |
| Threaten | Argument (`Stand_Talking_Angry`) | Coercive blade display directed at another agent. It can end without a strike. |

These bindings apply to STILETTO with blades. Welder-equipped acting and other
characters need their own reading; sharing a source clip does not grant the same
action or capability.

### Proposed supervisor–worker encounters

**Threaten:** STILETTO closes distance, faces a specific worker and displays her
blades. The worker may comply, freeze, retreat or refuse according to their
state and perception. An immediate return to work can coexist with lasting fear,
resentment or changed trust. These response branches are design proposals;
worker recoil/fear acting is still missing.

**Attack:** a separate intention requires a target, reach, space for both blades
and a committed contact time. The worker's recoil, injury or shutdown must match
the outcome admitted by the engine. Threatening must not automatically escalate
just because its animation finishes. A missed or interrupted strike needs its
own visible result.

The BDI engine owns the motive and action choice, reservations, interruption,
contact result and consequences. The renderer expresses the committed sequence;
random animation selection or mesh intersection does not create damage. Log the
actor, target, observation/belief, intention, selected action, contact result and
aftermath. The same threat may arise from an order, initiative, self-interest or
breakdown; the trace explains which. These paired encounters are not implemented
in the current single-character player.

## Published derivative

One shared body and texture set: 41,124 body triangles, two rigid 4,117-triangle blades, 49,358 rendered character triangles, 24 skin joints. Each blade is 55 cm long and attached to its corresponding forearm, with opposite roll and no mirrored geometry. The body remains handless. The welder module is not included in this mounted-blade review; its mechanical fit and interactions need a separate pass. Visor emission remains open.

The immutable `loopforge-stiletto-review` pack contains one 11,661,248-byte GLB (11.12 MiB), 18 unchanged source clips and five baked alternatives, audit JSON and responsive evidence pictures. Model SHA-256: `ad84c17431f6eea244b9a15f46296f0da63d7ae9726e2f7d2622f9d522b6f97b`. The reviewed bytes are copied without another geometry/animation optimization pass so the published audit remains tied to the exact tested file. Source FBXs, duplicate bodies and high-resolution masters stay outside deployments. Delivery temporarily uses the owner-authorized app-hosted path while CloudFront is pending; no S3 or access-policy changes.

## Corrected candidates

| Motion | Sampled poses | Original blade/body | Original blade/floor | Corrected body / floor / blade |
| --- | ---: | ---: | ---: | --- |
| Running | 77 | 12 | 0 | 0 / 0 / 0 |
| Recoil | 326 | 1 | 0 | 0 / 0 / 0 |
| Reprimand | 861 | 3 | 0 | 0 / 0 / 0 |
| Rise from kneeling | 309 | 109 | 59 | 0 / 0 / 0 |
| Electrical collapse | 762 | 0 | 300 | 0 / 0 / 0 |

All 2,335 corrected poses were evaluated from the final exported GLB at 120 Hz, including intermediate poses between its 60 Hz authored keys. These counts are sampled poses, not numbers of distinct accidents or continuous collision guarantees.

- Running opens the upper arms by up to 14° and elbows by up to 7°. Original stride, body lean and loop seam remain.
- Recoil and reprimand apply small, smoothly bounded right-arm corrections around the offending gesture.
- Rise from kneeling holds blades outside the knees and above the floor. The source starts kneeling and rises; it is not a complete kneel-and-rise cycle.
- Electrical collapse lifts the forearms to avoid driving blades through the floor. The right-arm correction leads impact and is smoothed. The owner accepted the visible acting on 14 October; physical interaction and transition checks remain separate.

This is offline animation authoring. There is no runtime collision solver, IK or retargeter. All 18 original clips / 1,404 original tracks are exactly preserved; all 376 unedited tracks inside corrected variants are exactly preserved. Geometry, skin, mounting, source timing, leg curves and every translation/scale track are unchanged. Only selected arm rotations differ. Validation reports zero errors and one inherited `NODE_SKINNED_MESH_NON_ROOT` warning.

## What the checks establish

The dense pass tests distal blade triangles against the skinned body, the other blade and a flat floor. The intentional proximal collar/socket overlap is excluded (source blade X ≥ 0.7). Floor flags use y < −0.005 m. Non-coplanar interior edge/triangle crossings are detected; containment and coplanar contact are not certified. There is no swept-volume, animation-blend or machinery/worker/environment clearance guarantee.

The original 18-clip blade sweep uses 30 Hz (2,441 poses). In the player, the five corrected clips and their source comparisons use the denser 120 Hz counts. Other clips clearly retain the 30 Hz label. Body-only markers come from the earlier targeted closest-pose intake checks and are labeled separately. Hiding a blade does not change these recorded audit results.

## Still open

Body-to-body contact candidates remain in Grounded walk, Quick Walk, Forward sprint, Listening Gesture, Idle Turn Right, Electrical collapse and Injured walk. Arm corrections do not repair these gaits. Check precise foot planting, mechanical plate deformation, transitions and room contacts before gameplay acceptance. Source travel is preserved; horizontal subject-centering in the review is only a viewing transform.

The corrected acting has owner visual acceptance. Welder mounting, visor glow, worker encounters, factory-state integration and crowd/physical-device performance remain open. Passing sampled blade checks must not silently mark the entire character or every action production-ready.

## Provenance and repeatability

`lib/loopforge/agents/stiletto-review.json` records clip names, source FBX names/hashes, timing, source travel, body markers and concise blade results. The immutable pack also carries the full 120 Hz sample report, arm correction parameters, timing/rotation invariants, exact source-preservation checks, blade mounts and Khronos validator output. The original source and native audit work remain in the local `stiletto-download-audit` artifact archive.

`check-stiletto-review.mjs` pins the tested GLB hash, embedded-only dependencies, 24-joint skin, 18+5 motion inventory, blade mounts and all non-arm track invariants, and reconciles the visible result counts with the full recorded audit. This prevents an untested derivative from inheriting the current clearance claims. A new motion/model revision needs a new sampled audit and visual inspection.

## Delivery verification

Verification on 13 October: the bounded production build and scoped ESLint pass; 18 focused agent/layout tests and the asset-pipeline test pass. Browser checks cover design → library → all three models, existing LIMEN idle and Worker Hot Walk, STILETTO original/corrected comparison, neutral state, attachments, CCTV, sampled-result labels and a downloaded evidence record. Responsive checks at 320, 390, 768 and the desktop viewport show no horizontal overflow. No browser console errors were observed in this review. Before/after pose pictures are published in the immutable pack; interface captures remain in the local review evidence archive. Runtime frame statistics are laboratory observations including the factory room, not crowd or physical-phone certification. The page is a published review candidate, not promotion of these models into the playable simulation.
