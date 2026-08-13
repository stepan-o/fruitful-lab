# Marigold Site Implementation V1

Status: approved for live publish / production deployment in progress
Date: 2026-08-13
Implemented by: Bloom Whispers Editorial Orchestrator, with Publisher QA sub-agent checklist

## Scope

Placed the approved V6 Marigold article into the Bloom Whispers app and prepared it for live publishing.

Live publishing was authorized by Susy on 2026-08-13. Pinterest and Metricool scheduling remain a post-publish step.

## Public Preview Routes

Clean canonical route:

```txt
/marigold-meaning/
```

Internal journal route:

```txt
/journal/marigold-meaning/
```

Canonical production URL once live-published:

```txt
https://bloomwhispers.com/marigold-meaning/
```

## Implemented App Files

- `apps/bloom-whispers/lib/journalPosts.ts`
- `apps/bloom-whispers/public/assets/marigold/marigold-placement-meaning-changes-final.png`
- `apps/bloom-whispers/public/assets/marigold/marigold-comparison-cempasuchil-vs-calendula-final.png`
- `apps/bloom-whispers/public/assets/marigold/marigold-title-7-ways-culture-place-final.png`
- `apps/bloom-whispers/public/assets/marigold/marigold-title-4-things-wrong-final.png`
- `apps/bloom-whispers/public/assets/marigold/marigold-quote-grief-path-light-final.png`

## Content Source

Source of truth:

```txt
docs/brands/bloom-whispers/content-pipeline/marigold/writer-draft-v6.md
```

The implementation preserves the V6 public copy, including:

- approved H1;
- approved reader-arrival opening;
- Quick Meaning;
- Key Takeaways;
- visible safety notes;
- Bloom Whisper;
- Bloom Wisdom;
- FAQ;
- Sources And Further Reading;
- accented public spellings such as `cempasúchil`, `Día de Muertos`, and `ánimas`.

## Media Source

Approved media handoff:

```txt
docs/brands/bloom-whispers/content-pipeline/marigold/media/selected-media-handoff-v1.md
```

Implemented media:

- keyword-led title-pin graphic as featured image / Open Graph image;
- placement infographic moved into the first article section where placement meaning is explained;
- comparison graphic in early article body;
- quote graphic near Bloom Wisdom;
- second title-pin asset staged for Pinterest/social launch package.

## Metadata

Slug:

```txt
marigold-meaning
```

SEO title:

```txt
Marigold Meaning: 7 Things That Will Surprise You
```

Meta description:

```txt
Think marigolds only mean joy and sunshine? These seven marigold meanings may surprise you, from Día de Muertos paths to calendula grief and wedding garlands.
```

Public H1:

```txt
Marigold Meaning: 7 Things That Will Surprise You
```

Revision note:

Susy's preview feedback rejected the old poetic title and the placement infographic as the hero image. A follow-up preview rejection also rejected the bland title handling and the too-poetic public heading "The Bloom Whisper: Small Stored Suns." The current implementation uses the direct curiosity-led title Susy asked for, tightens the first screen and Quick Meaning, replaces the poetic Bloom Whisper heading with a plain curiosity heading, uses the title-pin graphic as the hero, places the meaning-by-placement infographic inside the article where that concept is explained, adds two in-body quiz CTAs, and expands related/internal links to the Flower Meaning Guide, Queen Anne's lace, red spider lily, spider lily colors, and hibiscus.

## Validation

Completed:

- `git diff --check` across the Marigold article, journal metadata routes, and Marigold pipeline docs
- `npm run lint` from `apps/bloom-whispers`
- `npm run build` from `apps/bloom-whispers`
- image dimensions checked with `sips`; all five selected assets are 1024 x 1536 PNGs
- local route check: `/marigold-meaning/` returned `200 OK`
- local route check: `/journal/marigold-meaning/` returned `200 OK`
- local media asset checks returned `200 OK` for the title-pin hero, placement infographic, comparison graphic, and quote graphic
- rendered HTML check confirmed revised public H1, canonical, metadata, title-pin hero graphic, Open Graph image, Twitter image, placement infographic in body, comparison graphic, quote graphic, both quiz CTAs, expanded internal links, FAQ, `FAQPage` schema, source list, and UNICACH record/abstract caveat.

Build note:

The first build attempt failed because the sandbox could not fetch Google Fonts for `next/font`. The build passed after rerunning with network permission, matching the repo's documented local build behavior.

## Open Gates

- Production deploy/live URL verification.
- Bloom Whispers Pinterest/Metricool scheduling workflow after publish.
