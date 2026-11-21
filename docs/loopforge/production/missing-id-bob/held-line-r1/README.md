# Missing ID · bob / The held line

The owner approved **E1 · The held line** for the dedicated Security event screen. [UI DESIGNER handoff](UI-DESIGNER.md) includes the interaction brief, exports and placements. [Original E](../selection-01/E/master.png) records the prior style selection.

[Clean landscape master](master.png) · [Clean portrait master](portrait.png) · [Review gallery](/loopforge-design/missing-id-bob/v1/index.html#held-line) · [Manifests and measurements](manifest.json)

## Character direction

LIMEN’s original small spike becomes a broad faceted cyan blade mounted to his anatomical right wrist. It points down the staff side, away from bob’s open palm. The lowered brow and square tooth row give his attention a stern, procedural quality. ed’s raised cranial crest, circular receiver and sliver of open jaw distinguish his head from LIMEN’s. The clerk stays over the open register.

The new portrait raises the held queue and register into the upper part of the frame. At 320 px, gus’s raised palm, the lowered boom, jo’s hat, bob’s lenses and LIMEN’s doubled-over posture carry the story. ed’s small jaw and the blade facets are easiest to judge in the larger proofs. The counter fascia takes the UI at the bottom. The two placement guides include both eye centres, the counter lip, crop limits and text-safe coordinates.

## Sources and checkpoints

| Input | Use |
| --- | --- |
| [E · The held line](../selection-01/E/master.png) | Composition, cast positions, wardrobe, room, grain and finish. Checkpoint `59b9964d`. |
| [LIMEN’s Security Operations painting](https://www.fruitfulab.net/media/files/42d2f07b9d72f8ce0bc776641a06047304a1eab567f5ca9c3efd3dd31619560a.webp) | LIMEN at left, ed at far right. Crops from its 1536 × 1024 master: LIMEN `461x600+45+113`, ed `412x473+1094+181`. |
| [ed’s cast portrait](https://www.fruitfulab.net/media/loopforge-cast/ed-1280.51ea5ec63125128f.webp) | Swept head silhouette, round ear disc and the jaw projecting below the face. Crop `773x590+84+0`, resized to 670 px wide. |
| [Original commission and source review](../README.md#direction-and-source-references) | Approved Security architecture, light and floor, dialogue, crew and leadership-call production precedent. |

The built-in image generator supplied all newly painted pixels. Its model version and seed were unavailable. [Construction prompt](prompt.txt) inputs in order: full E, full Security Operations, LIMEN crop, ed Operations crop, ed cast crop. [Construction checkpoint](construction.png) established an articulated hand and larger blade.

[Detail prompt](detail-prompt.txt) inputs in order: construction checkpoint, full Security Operations, LIMEN crop, blade crop, ed cast crop. The blade crop is `222x196+150+353` from the LIMEN crop, resized to 400 px wide. [Detail checkpoint](detail.png) supplies the squared skull, distinct clerk and energized blade.

The [landscape master](master.png) restores the original E outside three feathered areas using [regions.mvg](regions.mvg). All **1,422,899** pixels outside the mask are identical to E. Of the whole 1536 × 1024 plate, 91.25% of RGB pixel values match E exactly. Rebuild from this folder with ImageMagick 7:

```sh
magick -size 1536x1024 xc:black -draw @regions.mvg -colorspace Gray -blur 0x3 -depth 8 mask.png
magick ../selection-01/E/master.png detail.png mask.png -compose over -composite -alpha off -depth 8 -strip PNG24:rebuilt.png
```

The portrait is a [native 1024 × 1536 painting](portrait.png). Its [prompt](portrait-prompt.txt) received the protected E1 landscape, both skulls (`630x325+758+93`, resized to 545 px wide as JPEG) and right-arm detail (`465x305+916+398`, resized to 408 px wide as JPEG). Each checkpoint ID and full SHA-256 is in the [source manifest](manifest.json). Clean WebP exports use quality 87. The independent guide graphics are [landscape](landscape-guide.svg) and [portrait](portrait-guide.svg).

## Review sequence

The owner approved E1 on 21 November 2026. UI DESIGNER takes the landscape and portrait into the event-screen study. The proofs remain available for evaluating the assembled interface. The live floor has already been integrated.
