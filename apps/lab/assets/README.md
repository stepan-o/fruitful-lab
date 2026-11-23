# Versioned media

Asset catalogs are private build inputs. The generated files under `public/media`
are append-only releases served by the existing Vercel CDN. No new service or
credentials are required.

```
catalog -> optimized bytes -> files/<sha256>.<ext>
                          -> manifests/<pack>.<sha256>.json
                          -> pointers/<pack>.json
```

Files and manifests receive a one-year immutable cache policy. Pointers receive
30 seconds in the browser, 60 seconds at Vercel's edge, and a 30-second edge
stale-while-revalidate window. A browser client reuses a successful discovery for
30 seconds; a failed discovery may retry at the next scene boundary. This is
bounded eventual freshness, not an instantaneous switch.

## Publish

1. Keep high-resolution archival originals outside `public/`. Put selected build
   inputs in a non-public source directory and add an entry to a pack catalog.
   Existing `public/stepanoskin` paths remain as legacy compatibility URLs.
2. Use descriptive logical IDs, such as `seasonal-tooltip`. Image entries accept
   `widths`, WebP `quality` (default 88), optional `lossless: true` for exact pixel preservation,
   and `maxBytes` per variant. Default
   widths are 768/1536/2560, capped to the source dimensions; images are never
   enlarged. EXIF orientation is applied and metadata removed. Transparency is
   retained; an explicit `alphaQuality` can reduce alpha-channel size for artwork
   after visual review (the default is lossless alpha). Supply translated alt
   text/captions in the consuming content.
3. Run `npm run assets:build` or `npm run assets:build -- assets/<pack>.json`.
   Files are hashed after optimization, manifests after serialization. Audio and
   video bytes are preserved; prepare compressed source files before ingestion.
   JSON data is supported. Animated images are deliberately rejected.
4. Review visual quality at reading size and zoom size. Default budgets are
   900 KB/image variant and 5 MB/non-image file; override deliberately per entry.
   A build refuses oversize variants before publishing the pointer.
5. Run `npm run ci`, then commit the source/catalog changes, all new hashed files,
   the immutable manifest, pointer, and `lib/assets/generated/<pack>.json`.
   Deploy atomically. Every production build verifies all retained releases.

The CLI also exports `buildPack`, `activate`, and `checkAll` for an offline asset
library. Their optional `publicRoot`, `generatedRoot`, and `sourceRoot` paths let
the same pipeline prepare research assets without publishing them to the site.
Provenance, original files and licensing notes belong in the source inventory,
not in the public runtime manifest.

## Consume

For first-render images, import the generated pack and use `parseManifest`,
`imageAsset` and `AssetImage`. `sizes` is required; the component selects the
prebuilt variants using a native `srcset` with exact file widths, without a
second image transformation. React emits a responsive image preload for the
explicitly prioritized hero. Images are lazy by
default; use `preload` only for the main visible image. Width/height reserve
space. CSS textures use `assetUrl` and inherited CSS custom properties.

The landing page pins its compiled release, so it needs no manifest network
waterfall to show the logo. For later game scenes or independently loaded
content, `loadAssetPack(name, bundledFallback)` discovers the short-cached
pointer, verifies the manifest with fetch integrity, validates the schema, and
returns one complete release. Call at scene/navigation boundaries and hold that
object for the scene. Requests are deduplicated, time out after four seconds,
and fall back to the last successful or bundled release on failure. It does not
poll or prefetch the whole pack. Preload only the assets needed by the next
interaction, respecting sound preferences and data-saving settings.

## Rollback and retention

`npm run assets:activate -- <pack> <revision>` verifies a retained release,
updates the compiled fallback, and writes the pointer last. Commit and deploy
that change while keeping **all** previously published files and manifests.

Do not delete old releases as part of a normal build. An open page may still
refer to them even if it has not downloaded every image yet. Do not use an old
whole-deployment rollback as an asset rollback: it can remove files referenced
by newer open pages. Roll the pointer back in a new deployment containing the
retained files. Cleanup needs an explicit retention policy and usage evidence.

Git-backed assets suit the present library. Once binary churn or library size
justifies object storage, publish the same immutable files/manifests first,
then atomically replace the pointer. Add an explicitly allowed CDN origin to
the resolver and CORS/integrity checks at that time; do not turn this into an
unrestricted remote URL proxy. Pointers currently update through deployments.

## Validation

`assets:test` covers deterministic output, changes producing a new release,
retaining old assets, byte-for-byte audio, alpha, no upscaling, rollback,
integrity failures and over-budget rejection. Jest covers the reader's cache,
deduplication, validation and failure fallback. Check actual response headers
on the deployed pointer, manifest and file after publishing.

## Sanctuary public editorial selection — 3 October 2026

The `sanctuary-editorial` pack contains the 24 selected publisher images used by
the manuscript. `lib/sanctuary/editorial-media.json` records the publication
rationale; `npm run assets:publish-editorial` promotes reviewed archive entries,
adds mobile derivatives and activates the public pointer last. Public image files
and manifests are committed. The source archive stays ignored and optional for
production builds. New research imports do not grant publication automatically.
`assets:check` validates the decisions, public file integrity and archive boundary.

`sanctuary-context` holds separately reviewed cross-industry identifying assets.
Build it with `npm run assets:build -- assets/sanctuary-context.json`. Source
masters are committed under `assets/sources/sanctuary-context`; provenance and
editorial purpose live in `lib/sanctuary/context-media.json` and are included in
the public credits register. Its initial Netflix wordmark has lazy-loaded
154/309px derivatives under 4 KB each. Source shape, color and proportions are
preserved; surrounding schematic drawings are original.

`sanctuary-arcade` contains the five opening-chapter historical images and the
VCS / Combat pair in chapter 2. The latter use compact full-composition build
inputs; source records retain both original-scan and build-input hashes. Build with
`npm run assets:build -- assets/sanctuary-arcade.json`. The selected source masters
are in `assets/sources/sanctuary-arcade` and never served directly. The independent
`lib/sanctuary/arcade-media.json` records credits, publication rationale, hashes
and the Pong photograph’s CC BY 2.0 license. `assets:check` verifies the catalog,
manifest and source register together. This pack needs no private research archive.
