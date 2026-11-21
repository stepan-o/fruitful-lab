# Landing 01 · internal game audition record

21 November 2026 · Owner review of the unresolved landing. These listening copies belong to the game-design review. No soundtrack release has been accepted.

| Item | Source and lineage | Review status |
| --- | --- | --- |
| LF-MUS-LANDING-01 | Original note events, drum patterns, harmony, arrangement and DSP authored in this project for this audition. The source is apps/lab/scripts/music/render_landing.py. The kit uses seeded noise, tonal resonances and envelopes. Keys use synthesized tines. Bass uses additive harmonics. There are no external recordings, samples, soundfonts, voices, reference masters or ElevenLabs outputs in either mix. | Reproducible project source, dated this revision. Owner decides the musical choice. PRODUCER records ownership and confirms the release basis before commercial distribution. |
| LF-MUS-LANDING-01-A | Session composition and common backing plus an E-flat landing. Stereo PCM master → 192 kbps MP3 listening edit. Master and export hashes are in session.json. | Private production master reproducible from source. Review MP3 only. |
| LF-MUS-LANDING-01-B | Same source, same performance, same master gain and export chain. C-sharp replaces the held E-flat. | Same review disposition. |
| Authoring and playback dependencies | Python, NumPy and FFmpeg with libmp3lame are offline authoring/encoding tools. No tool, sample bank or encoder binary is bundled in the game. Browser playback uses the native audio element. Record actual versions below and review any future bundled decoder separately. | ENGINE and PRODUCER retain whole-product dependency and rights review. |

Build used NumPy 2.3.5 and FFmpeg 8.1.3. Run the source with a private masters directory to reproduce both 48 kHz, 16-bit stereo master WAVs and the listening exports. The two mixes share a single normalization gain. The manifest records SHA-256 for each file, decoded true peak and integrated loudness. These timed audition edits end with a fade. They have no shipping loop points.

Provider calls, account changes, credits and cost are all zero. Human listening acceptance, dialogue intelligibility and in-game behavior still require separate reviews.
