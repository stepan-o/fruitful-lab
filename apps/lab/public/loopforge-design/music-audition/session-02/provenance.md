# Theme study 02 · review provenance

21 November 2026. Direction approved, tempo and production instrumentation pending listening. Zero ElevenLabs requests, zero credits used, US$0 incurred and zero account changes. No paid ceiling has been set.

| IDs | Source and edits | Use and review |
| --- | --- | --- |
| LF-MUS-02-GRID-170 and LF-MUS-02-GRID-164 | An original 48-bar event score in apps/lab/scripts/music/render_session_02.py uses the project’s original kit functions from render_landing.py. Session 01 B supplied the composed pitches. Both tempos use identical score events and seeded kit construction. Original synthesis, no sampled break or provider music. Stereo 48 kHz 16-bit private WAV to 128 kbps MP3. | Internal musical exploration. The two tempos use a common loudness target. Authorship and release clearance of any future distributed master go in the whole-product inventory. |
| LF-MUS-02-SPEECH-170 and LF-MUS-02-SPEECH-164 | Derived from bar 37 of the respective score. During the welcome, the low pedal takes over the bass part and the attacks recede. Reused the encoded video from the public first-playthrough LIMEN Forge-clear recording at 1×. Both cuts mix the identical existing LIMEN welcome at +1.250 s. MP4 uses stereo AAC and copied H.264 frames. An alternate WebM uses lossless VP9 picture and Opus from the same PCM speech bed and voice. | Editorial listening fixture. The original picture has no audio stream. The welcome is deliberately placed over Forge for this test. Neither the spoken words nor the musical timing are a receipt from this scene. Existing voice has separate commercial clearance pending with PRODUCER. |
| LF-MUS-LANDING-01-A and LF-MUS-LANDING-01-B | Separate historical package and generator, with the original master and MP3 hashes in its manifest. | B is the accepted note. A remains the dated E-flat alternative. |
| Music toolchain | Python 3.10, NumPy 2.2.6, FFmpeg 8.1.3 and its MP3/AAC encoders are offline authoring tools. The browser uses its native media controls. | No authoring binary, provider SDK, model or sample library is distributed with the game. |

[Export hashes, master hashes, controls, picture and voice source hashes](session.json) · [Original game recording](/loopforge-shifts/review/first-playthrough/limen/opening-Forge-clear.mp4) · [Unmixed LIMEN reading](/loopforge-shifts/limen-welcome.mp3) · [Historical session](../provenance.md).

The original and all four delivered picture streams decode to the same 174 frames in 6.960 seconds. Their FFmpeg framehash listings have SHA-256 133e3dd2f0b7be020fa31acfdca29538a25468c8d1d3709c65939433dd8d9dbc. The score-only pair differs by 0.01 LUFS, the MP4 speech pair by 0.21 LUFS and the WebM pair by 0.25 LUFS.

The score contains 192 fast beats in 4/4. Menu starts at zero-based beat 0, Options at 64 and Conveyor at 128. Wait at 176 and carrier movement at 185.5 are manual observations authored into the review edit. The answer lands at 186. Recorded edits fade to an ending. Production loop markers, phase-compatible stems and commercial clearance have not been established.

To reproduce, supply the public assets directory containing the two named source files and run `python apps/lab/scripts/music/render_session_02.py --masters /tmp/loopforge-session-02`. SHA-256 applies to the recorded build. Different encoder versions can change output bytes.
