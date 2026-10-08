# Recorded sound pass — 8 October 2026

The design board has a **Sound library** tab at
`/stepanoskin/loopforge/design#sound-library`. Six playable edits include
source links, CC0 credits, exact crop notes, roles, review questions and remaining
sound needs. The complete reading copy and Markdown exports include the register.

Landing navigation uses the metal/concrete clang; RESET uses the motor contactor.
The first shift uses engagement for commitment, the contactor for startup and
release for shutdown, retaining the procedural cues when recordings are not ready.
The gate and 24-second atmosphere remain audition-only. No simulation changes.

## Checks

- Source pages for all five owner-selected recordings display CC0. Original
  download hashes, edited hashes and reproducible processing are recorded in
  `apps/lab/assets/sources/loopforge-sfx/`. Originals remain untouched.
- Inspected waveform envelopes and transient detail to place cuts around the
  mechanical gestures. Kept the menu's secondary contact, the engagement teeth,
  the release click/thud interval and the gate's complete movement.
- Decoded every compressed edit: intended duration, headroom below −3 dBFS for
  mechanisms and below −12 dBFS for atmosphere. Edits use boundary fades; the
  atmosphere has a two-second tail/head overlap. Six files total 592,197 bytes.
- App asset tests and integrity checks passed, including all 15 retained releases.
  All 62 Jest suites / 310 tests passed. Production build completed successfully.
  Focused audio lint passed. New tests cover mute/visibility, one landing voice,
  different menu/RESET assets, optional-load failures, late decode after disposal,
  repeated-event coalescing and bounded recorded voices.
- Browser: all six native previews decoded and played, with the authored
  durations. Unplayed previews remained unloaded. Starting a new clip stopped
  the previous one. Switching away from Sound library stopped the looping clip.
- Library layout checked at 320, 390, 768 and 1440 CSS pixels, with no horizontal
  page or audio-control overflow. Desktop and phone layouts visually inspected.
- Local production preview: sound enabled from a user gesture; first-shift
  adviser selection, plan commitment, startup, pause and mute worked without
  browser errors. Landing RESET moved from jammed to drive-engaging correctly.
- Both HTML reading surfaces have six lazy previews, unique IDs and valid local
  media/document links. Prepared edit hashes match the runtime manifest.
- A supplemental repository-wide `tsc --noEmit` reports existing test-type
  errors in unchanged Pinterest, Sanctuary and GrowthBook tests. The production
  build's type check and the actual Jest run pass; no unrelated tests were edited.

## Review boundary

These checks establish crop placement, file integrity, playback and interaction
behavior. They do **not** substitute for listening to the final mix on speakers
and headphones. The library exposes the edits for the owner's timbre and mix
review. Recorded conveyor motion, alarm, supervisor signatures, differentiated
follow/override, room beds and soundtrack remain incomplete and are listed in
the library rather than implied to be finished.
