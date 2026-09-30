# Stepanoskin route group

This top-level App Router group holds public Stepanoskin pages in the Lab sandbox.
Its layout inherits the app root layout and renders children without adding a shell.

The public landing page is at `/stepanoskin`, implemented in
`stepanoskin/page.tsx` and `stepanoskin/StepanoskinLanding.tsx`. It is accessible
without login. Its native translation dictionary supports English, French,
Spanish, Russian, Mandarin Chinese, and Thai. English is the default; the
visitor's explicit choice is saved in the versioned `stepanoskin_locale_v1`
browser cookie so the server can render the selected language immediately.

The game-style menu is data-driven and sized for three to five future entries,
while currently showing only Game Monetization. Art assets under
`public/stepanoskin/` are sourced from the Loopforge repository. The landing
page adds pointer depth, ambient embers, a short selection impact, and a
localized persistent sound toggle. The selection sound is Pixabay asset
`dobcommunications-metal-clang-284809.mp3`, supplied by the project owner under
the Pixabay Content License. Playback skips the source file's leading silence
and continues across client-side navigation so its full decay remains audible.
Resting logo effects use randomized runtime geometry for broad television-style
signal tears and regenerated SVG lightning paths. Five bands use moderated
displacement and bloom, with 1.5–4.5 second pauses between short bursts. Effects
stop when the visitor prefers reduced motion.

Parenthesized groups do not add a URL segment. Do not add a group-level
`page.tsx`, which would conflict with the existing `/` page.
