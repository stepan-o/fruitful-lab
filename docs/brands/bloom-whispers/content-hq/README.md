# Bloom Whispers Content HQ

Status: initial operating system from August 2026 repo audit.

This folder is the single overview layer for Bloom Whispers content. It does not replace the detailed article folders, Etsy production docs, ClickUp Pinterest batches, or Apple Notes capture. It points to them and keeps the open loops visible.

## Files

- `bloom-whispers-content-hq.csv` - master spreadsheet-ready tracker.
- `bloom-whispers-content-dashboard.html` - clickable visual dashboard generated from the tracker.
- `build-dashboard.mjs` - local generator for refreshing the dashboard after tracker updates.

## Drive Source Of Truth

The operational source of truth now lives in Bloom Whispers Drive:

- Folder: `https://drive.google.com/drive/folders/1cMprLKTUbv8qTnRNYHNO3RN02xl3GsQp`
- Google Sheet: `https://docs.google.com/spreadsheets/d/1YN2hC9Tap5S5Uk8blyP6NLjYu-FwdQIc8_HtR-FuunI/edit`

The hidden Bloom Whispers app route is `/content-hq`. The current implementation is static-export compatible, so it reads a generated snapshot from the repo tracker and links back to the Google Sheet. Browser edits in the app are local draft changes until they are synced into the Sheet.

True drag/drop write-back to the Google Sheet uses the Cloudflare Pages Function at `/api/content-hq`, because the public static app cannot safely expose Google credentials in the browser.

The preferred production bridge is a small Google Apps Script web app owned by the Bloom Whispers Google account. This avoids downloadable Google service-account keys, which Google Cloud may block with the `iam.disableServiceAccountKeyCreation` organization policy. The reusable Apps Script source lives in `apps-script-bridge-template.gs`.

Required Cloudflare Pages environment variables:

```txt
BLOOM_CONTENT_HQ_SPREADSHEET_ID=1YN2hC9Tap5S5Uk8blyP6NLjYu-FwdQIc8_HtR-FuunI
BLOOM_CONTENT_HQ_SHEET_NAME=Content HQ
BLOOM_CONTENT_HQ_SYNC_TOKEN=<private key Susy enters in the dashboard>
BLOOM_CONTENT_HQ_CALENDAR_TOKEN=<optional separate calendar key>
BLOOM_CONTENT_HQ_APPS_SCRIPT_URL=<deployed Apps Script web app URL>
BLOOM_CONTENT_HQ_APPS_SCRIPT_TOKEN=<private server-to-server bridge token>
```

Optional direct Google Sheets API fallback, only when service-account keys are allowed:

```txt
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service account email>
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<service account private key with \n line breaks>
```

Once deployed and configured, the dashboard writes changed fields to the `Content HQ` tab and updates `Last Updated`.

Apple Calendar integration is a subscribed calendar feed, not two-way editing. Use this URL after deployment:

```txt
https://bloomwhispers.com/api/content-hq?format=ics&token=<calendar-or-sync-token>
```

Plan and drag items inside Content HQ. Apple Calendar reflects `Work Date` and `Target Publish Date` from the Sheet.

## Operating Rule

The Content HQ answers five questions:

1. What should Susy work on today?
2. What is actually ready to publish?
3. What content exists but got forgotten mid-pipeline?
4. What needs Susy input?
5. What was last posted on Instagram, the blog, and Etsy?
6. What should move next by channel and priority?

If an idea, draft, research dossier, Etsy product, podcast concept, Pinterest recovery task, or Instagram post is not in this tracker, it is not operationally visible.

## Monthly Planning Rhythm

Around the 20th of each month, use this HQ thread as the Bloom Whispers content planner.

In that session, choose the ideas to execute for the next cycle across:

- Instagram
- Blog
- Etsy
- Podcast / YouTube

Not every month needs all four channels. Once the content is locked, update these tracker fields:

- `Planning Month`
- `Work Date`
- `Target Publish Date`
- `Priority`
- `Stage`
- `Next Action`
- `Susy Input`
- `Last Updated`

The `/content-hq` Home section is driven by `Work Date`: today and this week are content creation dates. `Target Publish Date` stays separate for publishing/scheduling.

## Source Of Truth

Use the tracker as the overview source of truth. Use the linked source files as the detailed source of truth.

- Blog/article state: `apps/bloom-whispers/lib/journalPosts.ts` plus topic pipeline folders.
- Instagram state: `instagram-content-pipeline-tracker-2026-08-02.csv`.
- Research state: dossiers and `research-library.md`.
- Etsy state: `docs/brands/bloom-whispers/etsy-90-day-operating-plan-2026-08-18.md`, category scorecards, Etsy SOPs, listing trackers, and shop review notes.
- Pinterest state: ClickUp for batch execution, plus repo diagnosis and Metricool workflow docs.
- Podcast/YouTube state: pilot CSVs until a newer audio tracker exists.

## Production Shortcuts

The `/content-hq` app includes quick links for production tools such as Canva, Drive, the tracker Sheet, Bloom Whispers, Etsy, Pinterest, and Metricool.

Canva is a production workspace, not the HQ. Track the useful Canva references in these fields:

- `Canva Design URL`
- `Canva Template URL`
- `Visual Asset Status`

When an item reaches `Ready To Produce` or `In Production`, paste the Canva design URL into the item detail card so future publishing, review, and optimization work can find the visual asset quickly.

## Device And App Roles

### Apple Notes

Use Apple Notes as the lowest-friction capture inbox.

Recommended folder:

```txt
Bloom Whispers - Idea Inbox
```

Suggested voice-note title patterns:

```txt
IG idea - dandelion wish
Blog idea - poisonous flowers
Etsy idea - dark botanical print
Podcast thought - bedtime flower story
Question - is this worth researching
```

Do not over-format capture notes. The point is to catch the thought before it leaves.

### Apple Calendar

Use a dedicated `Bloom Whispers` calendar for time reality:

- publish dates;
- production blocks;
- review dates;
- batch planning sessions;
- Etsy listing review dates;
- podcast recording or edit blocks.

Do not put every raw idea on the calendar.

### Trello

Do not use Trello as the source of truth yet.

If Trello earns its place, use it only as a visual month-planning board:

```txt
Inbox / Maybe
August
September
October
November
December
```

A Trello card means: "I am considering working on this in this month." It does not replace the Content HQ stage.

### ClickUp

ClickUp remains useful for Pinterest batch execution and existing operational workflows. It should receive selected tasks from Content HQ. It should not be the whole creative command center.

### Codex

Codex maintains the system:

- refreshes the tracker from repo docs and app code;
- finds forgotten drafts and stale loops;
- turns selected ideas into production packets;
- updates status after articles, pins, products, or episodes move forward;
- surfaces the smallest useful weekly action list.

## Stages

Use the detailed tracker stages below. The dashboard rolls them into the practical workflow:

```txt
Captured
Idea Bank
Needs Research
Research Complete
Selected
Drafted
Editor Review
Ready To Produce
In Production
Ready To Schedule
Scheduled
Published
Monitoring
Repurpose Candidate
Hold
Archived
```

Dashboard workflow:

```txt
Capture -> Research -> Draft -> Edit -> Assets -> Schedule -> Published -> Monitor -> Repurpose -> Archive
```

`Ready To Schedule` means ready to publish: nothing missing.

`Published` means done enough to go live. After that, the work becomes revision, optimization, monitoring, and selective repurposing.

Only blog and podcast items automatically create repurpose opportunities.

## Priority

Use priority as a decision filter, not as decoration.

```txt
P0 - active this week
P1 - next best move
P2 - strong backlog
P3 - someday / parking lot
Hold - deliberately paused
Done - published or implemented
```

## Weekly Review

Once a week, ask Codex:

```txt
Refresh Bloom Whispers Content HQ from the repo. Show me:
1. P0/P1 open loops.
2. Anything ready but forgotten.
3. Anything blocked by me.
4. The 3 best things to push this week.
5. Anything that should be archived or held.
```

Then calendar the work blocks. Do not try to rescue every idea in one sitting.

## Monitoring

Keep this HQ dashboard light. It should show whether each lane has the right signals captured, not replace a full metrics dashboard.

Metrics to capture:

- Blog: published URL, indexed status, page views, traffic, affiliate clicks.
- Pinterest: saves, impressions, outbound clicks, engagement rate.
- Instagram: reach, saves, follows, likes.
- Etsy: views, favorites, sales, conversion.
- Podcast: episode status, downloads/listens.

A separate metrics dashboard can go deeper later.

## Daily Use

Before working, ask:

```txt
From Content HQ, what are the top 3 Bloom Whispers actions for today?
```

After working, tell Codex what changed:

```txt
Update Content HQ: I finished X, Y is blocked by Z, and I want to push A next.
```

The system works only if finished work and blocked work come back into the tracker.
