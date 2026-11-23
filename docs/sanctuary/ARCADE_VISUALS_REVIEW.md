# Arcade visual citations — 4 October 2026

The opening now moves through five archival images with distinct editorial jobs:

1. Pong production cabinet — the shared screen, rotary controls and coin slot.
2. A staged photograph from the German 1973 Pong Doubles brochure — electronic
   play introduced through tennis’s familiar social setting. This is the later
   four-player game; neither image is presented as the tavern prototype.
3. Gauntlet gameplay — separate score/health counters, unoccupied player slots
   and the displayed exchange of one coin for 700 health.
4. Gauntlet’s 1985 four-player flyer front — the fantasy and physical gathering.
5. Its reverse — the same manufacturer selling cooperation and operator earnings.

The existing manual page follows the operator-settings discussion. The room
illustration stays before the prose; the cabinet model follows the participation
paragraph. Full source compositions and notices are preserved. The gameplay
outlines are optional, reversible and separate from the original image.

## Sources and publication records

- [Pong photograph](https://commons.wikimedia.org/wiki/File:Atari_Pong_arcade_game_cabinet.jpg):
  Rob Boudon; crop/retouching by Ubcule; CC BY 2.0. Source, creator, license and
  modifications are recorded publicly. The photograph dates to 2011.
- [Pong Doubles brochure](https://flyers.arcade-museum.com/videogames/show/5116):
  Atari / Löwen Automaten, catalogued 1973; archive contributors Steffen and Laschek.
- [Gauntlet frame](https://www.atarimuseum.de/443.htm): Atari Games; the capture
  author/date are not supplied. The 700-health allowance is specific to the frame.
- [Gauntlet flyer](https://flyers.arcade-museum.com/videogames/show/409): Atari Games,
  1985, archive contributor Dphower. Advertising is evidence of the pitch, not
  proof that it delivered the promised profits.

`apps/lab/lib/sanctuary/arcade-media.json` contains source URLs, hashes, named
credits, editorial purposes, treatment and publication bases. The public credits
page includes these entries. This retains the owner-authorized criticism/review
basis for the publisher imagery, without claiming bespoke permission. The Pong
photograph’s separate CC license is identified explicitly.

## Delivery and review

- Independent `sanctuary-arcade` pack; content-hashed WebP files, an immutable
  manifest and the existing short-cached pointer policy. No deleted releases.
- Five non-public source masters; sixteen public variants. No third-party runtime
  image hosts, extra animation loops or new package dependencies.
- Gauntlet gameplay: 336 × 240, 7,376 bytes, lossless. Decoded RGBA pixels were
  compared with the source and match exactly. Inspection scales the native grid
  with CSS; it does not invent detail.
- Other reading derivatives at 480px: Pong cabinet 26,504 bytes; Pong Doubles
  photograph 28,156; Gauntlet flyer front 60,012; reverse 81,426.
- At 390 × 844 and DPR 1, the Pong reading pair selected the 480px files, shown
  at 322 CSS pixels. With the gameplay frame, these first three source images
  total 62,036 bytes. The later flyer pair is lazy-loaded separately. This is
  observed file selection, not a claim of measured field loading time.
- Desktop 1101 × 900 / DPR 1 selected those same Pong derivatives at 354 CSS pixels;
  the gameplay display was 728 CSS pixels. The existing manual remains unchanged.
- Reviewed at 320, 390 and 768 CSS pixels plus desktop: no horizontal page overflow;
  all three detail buttons have 44px activation height. Archive pairs stack on phones.
- Enter selects a detail; selection is exposed through `aria-pressed` and a polite
  readout. Native image inspection closes with Escape and returns focus to the opener.
  Source/credit destinations and the CC license link resolve. Shared motion pause
  keeps the figures usable; the new figures themselves have no continuous motion.
- Fresh-load and reload reading views were reviewed locally. Per-resource transfer
  timings were not exposed by the browser harness. Browser cache timing and field
  Core Web Vitals remain unmeasured; image identity/bytes are from the manifest.
- Validation: scoped lint, asset-pipeline test and all 44 app test suites / 192 tests
  passed; production build passed. A final build rechecks the preserved sizing hints
  for existing full-width figures after the visual review.

Local review captures: `pong-archive-desktop.png`, `gauntlet-details-desktop.png`,
`gauntlet-details-phone.png` and `gauntlet-flyers-desktop.png` in the task’s
`outputs/sanctuary-evening` folder. These are review evidence, not runtime assets.
