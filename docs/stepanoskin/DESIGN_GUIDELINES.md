# Stepanoskin landing — design guidelines

Status: owner-directed brief, updated 3 October 2026 after visual feedback.
Applies to `/stepanoskin`. This revision supersedes the initial pastel/card
interpretation. The latest implementation remains a visual iteration for review.

## Purpose

A largely empty, almost fully flat white page: an airy pass-through launcher.
Show the high-level choices in one middle column. Simple, but alive.

Stepanoskin has its own identity. Loopforge owns its factory atmosphere and
project-specific navigation at `/stepanoskin/loopforge`.

## Owner's current requirements

- Almost entirely white and empty. No cards, tinted panels, surrounding
  illustrations, atmospheric gradients, decorative framing or extra ornament.
- All text occupies the middle column. Space around the column is deliberate.
- Letters are built from 3D blocks using procedural geometry. They provide the
  visual depth, with only a slight shadow.
- Every block points in the same direction: a coherent isometric feel and one
  shared projection, lighting direction and extrusion depth. Keep text baselines
  level; depth must come from the faces, not visibly rotated words.
- A twist on an old video-game menu, rather than a conventional portfolio layout.
- The primary destination reads **DATA SCIENCE**, with **professional CV** as
  a smaller, quieter clarification floating behind/beneath it in the same
  projection. Its navigation emphasis is the deeper, blacker block color, not
  a special container, button, badge or color accent.
- **Stepan Oskin** belongs at the top, slightly highlighted as the personal
  identity. This is not another navigation choice.
- Use **GAME MONETIZATION** and **GAME ENGINES AND LLMs** for the other project
  labels; keep About as their equal secondary peer.
- Give the block lettering finesse: solid joined fronts, clean exposed depth
  faces, restrained edge highlights and small shadows. Avoid noisy cube seams
  and the low-quality appearance of the first pixel-grid draft.
- Every other destination has the same secondary hierarchy and block treatment.
- Blocks float lightly at idle. Hovers should bring the world alive. Clicks have
  juice and reuse the existing selection sound.
- **Performance is paramount.** Keep the scene immediate and inexpensive.

## Navigation and hierarchy

Primary: DATA SCIENCE / professional CV at `/stepanoskin/production-systems`.
Secondary peers: GAME MONETIZATION at `/stepanoskin/game-monetization`,
GAME ENGINES AND LLMs at `/stepanoskin/loopforge`, and ABOUT at `/stepanoskin/about`.
The About destination remains a real placeholder; do not invent biography.
Keep project subnavigation inside each destination.

Use the same letter grid, block size, orientation and interaction language for
every menu choice. Only the CV uses near-black faces; secondary faces stay gray.
Supplementary copy, if needed, is minimal and stays inside the middle column.

## Motion and sound

- Idle: a few pixels of gentle floating, with coherent direction and restrained
  timing. Text remains readable and anchor hit areas stay still.
- Hover/focus: letters lift in a short stagger, with a corresponding subtle
  shadow/depth response. Keyboard focus gets equivalent feedback.
- Selection: a short compression/rebound before ordinary navigation, with the
  same owner-supplied `dobcommunications-metal-clang-284809.mp3` used by Loopforge.
  Preserve full audio decay across navigation. Hover and focus remain silent.
- Reuse the versioned sound/motion preferences and provide compact controls.
  No autoplay sound. Reduced motion/manual pause remove movement and the
  selection delay; links and optional click sound still work.
- Preserve ordinary modified clicks and new-tab behavior. Avoid repeated
  selection timers, leaked listeners or animation work after unmount.

## Performance and access

Precompute reusable geometry. Combine cube faces into paths instead of creating
one DOM node per cube. Animate a bounded number of groups with transform/opacity;
avoid runtime canvas/WebGL, new animation libraries, per-frame React updates,
large animated filters or video. Pause motion when hidden or offscreen.

Use real links with readable accessible names beneath the decorative geometry.
Support visible keyboard focus, touch targets of at least 44 × 44 CSS pixels,
localization and the existing `stepanoskin_locale_v1` cookie. Keep a complete
static presentation when motion or JavaScript is unavailable.

Review at desktop, 768px, 390px and 320px, including keyboard, touch, reduced
motion, localization, hover and selection. Measure actual production delivery;
report laboratory measurements as such. Field performance stays unmeasured
until actual visit data exists. Also follow the shared
[design and performance standards](../DESIGN_AND_PERFORMANCE_STANDARDS.md).

## Implementation ownership

- `apps/lab/app/(stepanoskin)/stepanoskin/StepanoskinLanding.tsx`: navigation,
  preference controls, language selection and bounded interaction lifecycle.
- `BlockWord.tsx`: original solid block alphabet, level shared projection and aggregated
  front/exposed-depth paths. No runtime font or image request for the block lettering.
- `launcher.module.css`: flat white layout, gray/black faces, float/lift/impact.
- `launcher-copy.ts`: localized accessible labels and supporting copy. In this
  iteration, geometric menu marks use English; selected-language names appear
  in the supporting label on hover/focus and are always the accessible names.
- About, the CV itself and the project readers retain their separate designs.

Update this document when the owner changes the direction; do not restore the
superseded pastel/card design in a later iteration.
