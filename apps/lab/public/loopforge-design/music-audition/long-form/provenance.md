# Dedicated room studies · 21 November 2026

Three dated exploratory recordings at 164 BPM. Conveyor feels the same grid at 82 BPM. The owner approved the C-sharp landing, the tempo and each room’s musical purpose. Long-form phrasing and production timbre await listening. All variation in these recordings is authored. There are no game inputs, speech overdubs, provider calls, charges or account changes.

| ID | Score and performance | Intended listen |
| --- | --- | --- |
| LF-MUS-LONG-03-MENU | 128 bars. Four full lead calls, sixteen multi-bar replies, sustained on-beat keys and grounded two-step. Solo drums at bar 49 and four bass-only bars at 97. | Hear whether the counterline can carry the music until the full call returns at bar 33. |
| LF-MUS-LONG-01-OPTIONS | 96 bars. Hat-led question, rim answers, quieter gaps, low tom reply, displaced kicks, a mixed-kit return. Only percussion voices enter. | Notice whether a quieter group gives attention back to the settings and whether the hand figure stays interesting. |
| LF-MUS-LONG-01-CONVEYOR | 96 bars. Spaced bass descent, sustained C-sharp, thinner middle, displaced response, upper voice, heavy return. | Listen to ordinary, uninterrupted work. The separate session 02 fixture is available for wait/restart and speech judgments. |

Menu revision 03 replaces the revision 02 recording from [PR #189](https://github.com/stepan-o/fruitful-lab/pull/189). Both are original local syntheses. The authored kick and sixteen bars for solo drums carry forward. New elements are the counterlines, electric-key voicings, reply timbre and bass phrasing. Revision 02 had replaced LF-MUS-LONG-01-MENU at the owner’s request. The earlier decoded measurements, hash and listening verdict can be traced to [PR #188](https://github.com/stepan-o/fruitful-lab/pull/188) and the current theme study. Run the renderer with --menu-only to replace this recording independently.

Authored in apps/lab/scripts/music/render_long_form.py with the existing original kit from render_landing.py and rendering functions from render_session_02.py. The new source writes dry note events, velocities, articulations, panning and an original form for each room. No external samples, artist recordings or provider output. Python 3.10, NumPy 2.2.6 and FFmpeg 8.1.3 were offline authoring tools. No dependency is bundled with the game.

Private stereo PCM masters are 48 kHz, 16-bit. The last two bars are rendered as pre-roll before the first downbeat so ringing parts can cross the boundary. The full-cycle MP3s carry encoder delay/padding metadata and have no ending fade. Browser repeat allows continuous audition; a production loop still requires a seam and timing check on the intended audio host. All three start at frame zero of their respective PCM masters. End-exclusive frame counts, exact durations, hashes and decoded loudness/peaks are in [session.json](session.json). Rebuild with `python apps/lab/scripts/music/render_long_form.py --masters /tmp/loopforge-dedicated-masters` using the recorded versions.

The project owns its source history. PRODUCER and MUSIC DIRECTOR must establish the release basis of any eventual shipped asset. Keep these listening files separate from the proposed ElevenLabs pilot and from validated game assets. Session 01 and session 02 retain their original media.
