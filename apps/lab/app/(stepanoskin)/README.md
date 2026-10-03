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
with Game Monetization and the Data Science & Production Systems profile. Art assets are sourced from the
Loopforge repository and published through the versioned media pipeline in
`assets/README.md`. The landing page pins its compiled manifest for an immediate
first render; hashed media URLs receive immutable caching. Legacy source URLs
under `public/stepanoskin/` remain available. The landing
page adds pointer depth, ambient embers, a short selection impact, and a
localized persistent sound toggle. The selection sound is Pixabay asset
`dobcommunications-metal-clang-284809.mp3`, supplied by the project owner under
the Pixabay Content License. Playback skips the source file's leading silence
and continues across client-side navigation so its full decay remains audible.
Audio loads only on an enabled menu activation; hover and focus are silent.
Resting logo effects use randomized runtime geometry for broad television-style
signal tears and regenerated SVG lightning paths. Five bands use moderated
displacement and bloom, with 1.5–4.5 second pauses between short bursts. Effects
stop when the visitor prefers reduced motion.

Parenthesized groups do not add a URL segment. Do not add a group-level
`page.tsx`, which would conflict with the existing `/` page.

## Sanctuary Economics

`/stepanoskin/game-monetization` is the illustrated reader overview. Chapters use
`?chapter=<stable-id>` for shareable links and browser history. Invalid IDs are
404s. The page renders its current chapter on the server and passes a small
content/asset subset to the client. Contents, previous/next links, source notes,
native image zoom, and two labeled hypothetical models are available.

Controls share the landing locale cookie. The editorial prose is currently
English, clearly disclosed in all six UI languages; it is not a completed
translation edition. Content and provenance: `docs/sanctuary/README.md`.

The public reader uses original procedural art by default: a mosaic devil with
glowing eyes/shared signal tears, plus a scene and diagram in every chapter. Fire
and embers run on a bounded canvas. Chapter changes reuse the landing clang;
reader sound and motion controls persist across both pages.

Publisher screenshots and promotional art are local research references only.
Run `npm run research:dev` with the private archive installed to view them on
loopback port 3101. There is no public mode switch; production and Vercel cannot
activate this mode. The archive is excluded from Git, public assets and server
tracing. See the Sanctuary README for installation and source provenance.


## Production systems profile · 2026-10-03

Public `/stepanoskin/production-systems` is a professional profile and methodology
presentation for Stepan Oskin, linked from the six-language `/stepanoskin` menu.
The profile is in English and sets its own language scope. It presents abstract
current-role context at Prodigy Education, publicly verifiable work, an original
production-loop diagram, four illustrative applications, primary-source notes,
and LinkedIn/print actions. It discloses no internal project details or results.
Static server content and scoped CSS contain most of the page; small client
components handle domain selection and printing. Profile actions reuse `cta_click`.
No auth, API, experiment assignment, dependencies, or other apps change.
See `docs/brands/lab/production-systems-profile.md` for the brief, sources and checks.
