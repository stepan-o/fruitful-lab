# Loopforge recorded sound sources

Six edited MP3 build inputs from five owner-selected Freesound downloads.
All five source pages displayed **CC0** on 8 October 2026. Titles, authors,
URLs, original SHA-256 hashes, crop intervals, processing and output measurements
are in `provenance.json`. Original downloads are preserved outside the repository.

From `apps/lab`, with Python 3.11+ and FFmpeg installed:

```sh
python3 scripts/audio/crop-loopforge.py /path/to/original-downloads
npm run assets:build -- assets/loopforge-sfx.json
```

Then regenerate the board from the repository root:

```sh
python3 docs/loopforge/game-design/build_board.py
```

The script uses explicit stereo averaging for the mono mechanism cues, a gentle
30 Hz high-pass, per-edit fades, and peak normalization before MP3 encoding.
It checks the **decoded** MP3 sample peak remains below −1 dBFS; current outputs
are below −3 dBFS for one-shots and −12 dBFS for the atmosphere. This is a sample
peak check, not a claim of equal perceived loudness or a true-peak mastering pass.
No compression, pitch change, silence gate or time stretching is applied.

The menu keeps both contacts and their decay. Engagement and release are separate
handbrake gestures. The starter loses its idle pre-roll. The gate was already
trimmed, so its complete gesture remains. The 24-second atmosphere uses a
two-second equal-power tail/head overlap from a 26-second excerpt; it remains
an audition candidate. Final listening and mix approval belong to the owner.

Only the four assigned cues are used in the app. The gate and atmosphere are
available on request in the design board. The first shift fetches just its three
short cues (23,536 bytes) after sound is enabled; failed/slow assets preserve the
procedural fallback without a late sound playing out of context.

The public catalog uses immutable hashed copies. Never remove earlier releases
when revising a crop. Rebuild and publish a new pack instead.
