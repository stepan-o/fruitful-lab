# Sanctuary Economics: editorial edition

Public route: `/stepanoskin/game-monetization`. Chapter links append
`?chapter=<stable-id>`; an unknown ID returns 404. The route is rendered by the
Lab app, without authentication or backend dependencies.

## Content contract

`apps/lab/lib/sanctuary/content.ts` contains 21 self-contained chapters in seven
parts, source notes, figures and ten closing rules. `types.ts` owns the chapter
contract and URL helper. `ui.ts` has the six-language navigation dictionary.
The manuscript is an English editorial edition, disclosed in every UI language.
Review the prose before producing full localized editions. Do not present
translated controls as a translated manuscript.

The text reauthors the supplied Sanctuary Economics handoff. It adds primary
research, short comparisons and explicitly hypothetical models. The source
notes distinguish documentation, interpretation and claims that are still
unverified. Important boundaries:

- Seasonal-to-Eternal transfer is not described as deletion. The current Rebirth
  confirmation and exact objective gating have not been captured.
- The Reliquary holding cap of 99 Favor is not a lifetime earning cap. Launch-era
  rules and prices are not silently labeled as current-season rules.
- Owner-provided current screenshots were captured 1 October 2026. Exact build
  and platform remain unknown. Historical handoff images keep unknown dates.
- The store uses CAD, per the owner. The pack calculator uses historical visible
  prices, a hypothetical item, a zero starting balance and one selected pack. It
  is not a live price quote or optimal multi-pack purchasing recommendation.
- Loot probability assumes independent trials at a fixed hypothetical rate.
  It is not a Diablo drop-rate model or evidence of a spending effect.
- Concord's documented launch, closure and refunds are used without speculative
  budget, sales or minimum-player figures. Business-model claims do not infer
  private motives or establish causation from screenshots.
- Prototype and promotional images are labeled. Publisher imagery remains
  publisher-owned; it is not a newly licensed reusable artwork library.

## Original public edition and internal research mode

Public and production pages render our own procedural mosaic devil, original
scene illustrations and chapter-specific diagrams. Every chapter requires a
`visual` definition in `lib/sanctuary/visual-content.ts`: one original scene, one
diagram and a research screenshot reference. Original scenes are clearly labeled
as illustrations, not game captures. The Lilith promotional art is inside the
first chapter of the internal edition, never on the public cover.

The research edition is an explicit **local development execution mode**. It
cannot be enabled through a public switch, URL or cookie. Its server policy
requires all three: `STEPANOSKIN_RESEARCH_MODE=1`, `NODE_ENV=development`, and
no `VERCEL` environment. Production and Vercel previews always use original art.

From `apps/lab`, run `npm run research:dev`, then open
`http://127.0.0.1:3101/stepanoskin/game-monetization`. It binds to loopback, uses
`.next-research/` separately from normal development, and checks the archive
before starting. GTM is disabled in this execution mode. The reader has no
commerce or platform integrations; source links remain ordinary explicit links.
Do not expose or tunnel this local server to the internet.

Publisher files live only in the gitignored `apps/lab/assets/research/` archive.
The compiled manifest contains metadata, not image bytes. Production file
tracing excludes the archive too. Only the local research route
`/research-media/<sha256>.webp` can read it, with `private, no-store`, edge
`no-store` and `noindex, noarchive` headers. It accepts only exact hashed WebP
filenames and returns 404 outside research mode. Public image URLs and the
public Sanctuary manifest/pointer have been removed.

On another workstation, install the archive explicitly:

```sh
npm run research:import -- /path/to/sanctuary-assets /path/to/concord-reveal.jpg
npm run research:dev
```

The gallery is the owner-provided optimized offline research library. The Concord
source is the image identified in `asset-provenance.json`. This import is local,
does not download anything and does not copy files into `public/`. A normal
clone, CI run and production build work without the archive. Do not force-add it.

The existing owner-supplied Loopforge branding and licensed Pixabay clang remain
available on the public site. This mode controls which media the app delivers;
it is not a legal determination about every possible use of third-party works.
Removing files from the active deployment does not erase earlier Git history,
old deployments or copies already cached by browsers. This explicit rights-driven
withdrawal is an exception to the usual append-only public asset retention rule.

## Media and performance

The optional internal pack now contains 23 research images and 50 optimized WebP
variants totaling 6,047,804 bytes. `asset-provenance.json` records original hashes,
dates, credits and source URLs without publishing local user paths. Source
originals and the wider gallery remain outside the repository. Public pages
request none of these images. `assets:check` rejects any research variant found
under `public/` and verifies the local archive when installed.

The server sends only the current chapter, navigation titles, cited sources and,
in research mode, that chapter's image metadata. Research images use exact-width
native `srcset`, lazy loading and on-demand full-size zoom. Navigation disables
bulk chapter prefetching. Original scenes and diagrams use SVG/HTML geometry;
the mosaic shares its geometry across glitch bands with SVG `use` elements.
There is no new chart or animation dependency.

The ambient fire/ember canvas caps pixel density at 1.5, particles at 64 and
rendering near 30 fps. It stops while the document is hidden. Shared signal
tears stop offscreen and follow the landing's moderated timing. Reduced-motion
preferences and the reader's persistent motion control disable animations.
Sound and motion preferences are shared with the landing page. Chapter activation
uses the same exact clang, loaded only after an enabled user gesture; hover and
focus remain silent. The public CDN pipeline still serves owner-controlled and
licensed landing assets with immutable files and short-cached pointers.

## Review and validation

The reader provides source disclosures, native contents/zoom dialogs, direct
chapter links, a responsive contents rail, previous/next navigation and reduced
motion support. Tests exercise all content references, navigation language,
dialog controls, mathematical endpoints and currency shortfalls. Run the Lab
CI gate plus targeted lint before publishing. Check desktop/mobile reading,
image zoom, keyboard dismissal and the landing menu route in the browser.

Further content iterations can add the current Rebirth confirmation, exact
seasonal objective requirements and Reliquary purchase/claim screens. Those
claims are intentionally absent or bounded until the evidence is available.
