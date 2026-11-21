# A clearance at Forge

Owner-approved scope, 21 November 2026. Review the three clean close-ups on each device before turning on the annotations. The wide shot establishes the relative positions of Intake and Forge. The missed-call inset is a separate proposal.

[Review page](/loopforge-design/forge-study/index.html) · [Audit](/loopforge-design/forge-study/index.html#audit) · [Interface handoff](/stepanoskin/loopforge/design/studio/ui-designer)

## Sources and reproduction

The baseline is master e0adac548b00d45964a01b0dbddc9abef059031a. The gameplay source tree under apps/lab/lib/loopforge is 6d998b9866e0e8257b3f33dbe71c55d504b354ac. Original sprites, approved floor layers and station geometry are loaded from apps/lab/public. The study renderer reads positions and legal state from the saved projection. Its bezel, typography, keyed contact pose, die indicator and camera compositions are proposed presentation.

Run the following from a full checkout. The replay needs the app's TypeScript dependency and a review installation of @napi-rs/canvas. CANVAS_MODULE may name that installation. The plates use Pillow, Montserrat and Liberation Mono. These are offline production tools for the static study.

```sh
node docs/loopforge/game-design/forge-study/replay.cjs apps/lab apps/lab/public/loopforge-design/forge-study
python docs/loopforge/game-design/forge-study/plates.py apps/lab/public apps/lab/public/loopforge-design/forge-study
python docs/loopforge/game-design/forge-study/review.py
python docs/loopforge/game-design/studio_briefs.py
```

The ordinary board publisher includes the same panel through forge_study_entry.py. The scoped publisher inserts the entry beside Music in an existing board. The page, CSS and JS are editable in this directory. Raster downloads live under the public review directory.

The hosted recorder (capture.cjs) restores a seeded Day 2 through the normal Resume shift button on the canonical player in a fresh browser context, then selects Forge on phone and issues Clear. The [capture run](https://github.com/stepan-o/fruitful-lab/actions/runs/44873804988) retains the full source JPEGs and measured station labels. The public package contains review-sized WebP copies at their original pixel dimensions. The measurement precedes each screenshot, so its tick can differ from the visual frame. The exact-tick painter replay below each hosted example is a separate evidence source.

Use check-review.cjs with a review URL and a Playwright installation to test real keyboard activation, the paired static plates, all media and narrow-screen layout. Acceptance of the underlying experience belongs to the owner.
