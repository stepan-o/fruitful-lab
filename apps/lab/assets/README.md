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
   `widths`, WebP `quality` (default 88), and `maxBytes` per variant. Default
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
