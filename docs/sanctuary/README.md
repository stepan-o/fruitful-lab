# Sanctuary Economics: editorial edition

Public route: `/stepanoskin/game-monetization`. Chapter links append
`?chapter=<stable-id>`; an unknown ID returns 404. The route is rendered by the
Lab app, without authentication or backend dependencies.

Design reference: [Sanctuary design system](DESIGN_SYSTEM.md) and the
[visual reference sheet](design-system/index.html). Version 1.3 captures the
approved local opening illustration, materials, typography, component states,
editorial rules and motion/performance contracts. Later chapters are still
adopting the opening's latest level of detail; this is not a publication marker.

## Content contract

Audience direction, revised 3 October 2026: the essay keeps its industry depth
while introducing key games, organizations and systems for readers unfamiliar
with games. See [Audience and wider context](AUDIENCE_AND_CONTEXT.md) for the
research brief, bounded comparisons and chapter-level introduction audit. An initial pass now reaches all 21 chapters. The opening compares BG3 and D4,
then the campaign/seasonal duality inside D4; history, funding and motivation
carry the wider context. This edition is prepared for PR review; prose remains open to iteration.

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

## Public editorial edition and optional source archive

The normal route shows the original mosaic devil, 21 original scene studies,
interactive diagrams and all 24 selected publisher images. The opening juxtaposes
BG3 and D4 key art, then preserves the approved animated original diptych. No
research flag, cookie or special URL is required to see screenshots.

The public [rights and credits page](/stepanoskin/game-monetization/credits)
links each image to its source, owner and editorial use. See the
[media-rights review](EDITORIAL_MEDIA_RIGHTS.md) for the publication decision;
source quotations are versioned locally, not fetched at runtime.

`lib/sanctuary/editorial-media.json` controls selection. From `apps/lab`, run
`npm run assets:publish-editorial` after an explicit record review. It copies
selected optimized files from the optional source archive, adds 480px variants,
writes an immutable `sanctuary-editorial` manifest, verifies it and moves the
short-cached pointer last. Normal builds use committed public files and do not
require the private archive. Only current-chapter asset metadata is serialized.
The opening pair is prioritized; other figures load lazily and inspection masters
mount only when requested. Every chapter retains its original illustration.

The ignored `assets/research/` archive remains useful for source masters and
future unselected candidates. Its loopback-only `research:dev` command and
`/research-media/<hash>.webp` endpoint retain their environment guards, but the
reader itself now uses the same public selection. This is no longer an alternative
screenshot edition. An import into the archive does not publish it automatically.

On another workstation, install the archive explicitly:

```sh
npm run research:import -- /path/to/sanctuary-assets /path/to/concord-reveal.jpg /path/to/bg3-key-art.jpg
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

The public editorial pack contains 24 images and 76 optimized WebP
variants totaling 6,964,936 bytes across the entire library, not a page load.
`asset-provenance.json` records original hashes, dates and source URLs. The
publication register adds each image's analytical purpose and rights assessment.
`assets:check` verifies public hashes and reviewed selection, and the optional
archive when installed. The smallest variant for every image is 480 pixels wide.

The server sends only the current chapter, navigation titles, cited sources and
that chapter's selected image metadata. Native `srcset` selects exact widths;
below-fold figures load lazily and full-size inspection mounts on demand.
Navigation disables
bulk chapter prefetching. Original scenes and diagrams use SVG/HTML geometry;
the mosaic shares its geometry across glitch bands with SVG `use` elements.
There is no new chart or animation dependency. Plate inspection mounts enlarged
geometry only on demand; deterministic integer noise avoids hydration drift.
Twenty exhibits have purposeful controls; Concord retains a documented timeline.
The loot and price models are integrated into their exhibits, not duplicated.

The ember canvas caps pixel density at 1.5, particles at 64 and rendering near
30 fps. The separate WebGL hearth uses a backbuffer no larger than 960×256 and
a heat field no larger than 512×192; its restrained fire fringe appears only
at the actual document end. The opening plate adds a separate atmospheric
canvas capped at 960×566 and 30 fps over static vector geometry. Its cached
sprites initialize only when visible, and its loop stops offscreen or behind
the inspector. These renderers stop while the document is hidden. Shared signal
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
