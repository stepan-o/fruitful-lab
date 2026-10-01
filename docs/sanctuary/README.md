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

## Media and performance

The `sanctuary` pack contains 17 selected illustrations and 38 WebP variants,
5,066,276 bytes total. Originals and the wider 81-image research gallery remain
outside `public/`. `asset-provenance.json` records original hashes, dates,
credits and source URLs without publishing local user paths.

This first release imports already optimized bytes from the offline research
library. The manifest is validated by the same `assets:check` pipeline as the
landing pack. It does not require the original Downloads folder to build.
For new images or a replacement edition, create a private source catalog and
run `npm run assets:build -- assets/<pack>.json` as documented in
`apps/lab/assets/README.md`. Keep all previously published hashed files and
manifests; change the pointer and compiled manifest together in a deployment.
Do not overwrite a published content-hashed file or regenerate its JSON in place.

The server sends only the current chapter, navigation titles, its cited sources
and its image metadata. Images use native exact-width `srcset` and lazy loading;
the overview cover alone is prioritized. Full-resolution zoom mounts only on
request. Navigation disables bulk chapter prefetching. A page pins its compiled
manifest and avoids a first-render manifest request. There is no runtime fetch of
the entire image library and no additional chart or animation dependency.

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
