# Day Two music · ENGINE handoff

23 November 2026 · Local production audition 01 · Owner listening review open

[Play the listening desk](/loopforge-design/music-audition/day-two/index.html) · [Frame manifest](/loopforge-design/music-audition/day-two/cues.json) · [Playable campaign](/stepanoskin/loopforge/play)

## Recordings and approval history

| Target | Recording | Native development |
| --- | --- | --- |
| Menu | LF-MUS-LONG-06-MENU | 80 bars. Two statements, stretched phrase, dry drum feature, reprise and bass turn. |
| Options | LF-MUS-LONG-02-OPTIONS | 32 bars. The Menu break moves through doubles, low toms and a two-step return. |
| Security | LF-MUS-LONG-01-CONVEYOR | 96 bars. Open sub, prolonged answer, thinner middle, displaced kick, upper echo and return. The original filename and digest are retained. |
| Day Two Conveyor | LF-MUS-D2-CONVEYOR-01 | Two 64-bar passes at 164 BPM with half-time felt at 82. The second changes bass articulation, kick placement, hand voicing and chord inversions. |

The November 21 approval of Menu 06 and Options 02 covers composition and arrangement. On November 22 the owner reassigned the merged Conveyor recording to Security. On November 23 the owner selected bass first and approved the finite build. The new performance and transitions await an owner listening verdict.

The bass plays the Menu opening, exchanges its E–C♯ tag and quotes its solo-bass turn. Bars 17–32 stretch the tune through Gm9 and B♭maj9. At bar 33 the shells borrow hand assignments from Options 02. The bass answers in the holes. The reprise starts at bar 49. One arc takes 93.659 seconds. Both supervisors use the same piece.

## Cue map for the ordinary game

Day One timings are edited seconds at 1×. Eight station confirmations can extend wall time indefinitely. Day Two timing comes from the merged Rust campaign at e0327811. The work windows run for 2,400 and 4,800 ticks at 20 Hz for LIMEN and STILETTO respectively, subject to tutorial holds, pause and replay. The desk compresses this sequence for listening.

| Public context | Bed or musical transition | Scene cue and interruption |
| --- | --- | --- |
| Menu ↔ Options | Full recordings. One-bar drum bridge in each direction. Remember the outgoing musical position. | Opening or closing Settings cancels any pending musical entrance. No scene announcement. |
| Factory entry → morning walk · 0 | Door release into a 16-bar day bed. Two-note calls exchange pitch, register and placement. | Leave the blackout and first words room. Fire the opener once per narrated entry. |
| Gate · 16.3 / fallen card · 25 | Stay in the day bed and thin it under presented dialogue. | One dry gate marker. Keep the strike and card action clear. |
| First brain · 40.1 / two volunteers · 76.6 / second brain · 95.3 | First line reveal uses the floor marker. Later camera returns inherit the bed. | Station confirmations can hold indefinitely. Use the quiet bed and release it immediately on confirmation. |
| Fourth check · 125.1 / crew fills in · 138.3 / Run it · 151 | Thin the bed under the check. Restore its paired notes as the crew fills in. | These cuts leave the voice and press attacks available. |
| End of shift · 165.4 / register · 171.041 / outside · 178.654 / end · 190.604 | Close the work bed with the departure cadence. Let the yard tail decay. | Skip goes directly to the console. Drop outstanding Day One cues. |
| Day Two console / call / appointment | Eight-bar console pulse. Duck on speech onset. Call close restores the pulse. | Play the appointment taps on confirmed posting. Re-entering Security uses its musical head alone. |
| Security ↔ Conveyor | Full autonomous room takes. Choose the directional bridge or independent room head and tail. | A focus change can supersede either immediately. An off-camera ID check stays silent. |
| Wait / resume / speech | The 16-bar waiting bed drops forward bass. Conveyor speech has a separate low kit and pedal. Other arrangements duck and low-pass. | A visible wait→running change earns the pickup. Unknown production keeps the ordinary groove. |
| Bell → results → return | Leave a beat for the real bell, then answer E–C♯. Results alternate open intervals over eight bars. | One release per public bell. Return to menu cancels it at any position. |

## Audio interface

Decode the half-open frame ranges in cues.json against 48 kHz stereo. Convert source frames to seconds before using a resampled audio context. Each room and bed loops between its start and exclusive end. A one-shot's tail lies within its range. The reel has 125 ms guard gaps between cuts. Entries and exits are independently playable. Each bridge spans one bar. For a fresh destination continue at the following bar. The Options→Menu bridge quotes Menu bar 49 and the Conveyor→Security bridge quotes Security bar 17. On a revisit, restore the remembered phrase. Fade the displaced sound over 45 ms and stop it by 50 ms.

Use the existing MusicInputs v1 ordered snapshot. Surface, listening focus, current speech, pause and publicly observable running/waiting suffice. The only required discrete game event for this pass is a confirmed shift bell. Scene markers follow forward crossings of visible scene boundaries. A restored snapshot sets the bed directly. Deduplicate by session, sequence and receipt ID. Cancel pending one-shots on seek, branch and stop. Resume from the held musical position with fresh public state. Keep music mute independent of voices. No private beliefs, supervisor identity, quota estimate or station-by-station feed is needed.

The desk uses manual listening inputs, a shortened route and the existing LIMEN welcome on a separate voice path. The release leaves its first beat free for the game's bell. ENGINE owns the Rust/KVP-0001 simulation, replay, public projection and connection to real speech, effects and clock state. Music emits no simulation commands. A slow decode, missed beat or interrupted tail never holds a game event.

## Production and edit sources

Run `python apps/lab/scripts/music/render_day_two.py --masters /tmp/loopforge-music-pcm` from the repo with NumPy and FFmpeg. The renderer imports the approved phrase library and kit, checks the three parent MP3 digests and produces two masters plus each cue as an individual WAV. The web review uses two MP3s. The manifest includes encoded and PCM SHA-256, levels, source IDs and sample offsets. The route and timing map lives beside the renderer in day_two_map.json.

Keep session 02's 164/82 traversal as the original doorway and restart comparison. Its carrier movement at beat 185.5 and bass answer at 186 were authored. The matched 6.96-second Forge clip is the speech comparison. The 170/85 edits and Take A remain historical alternatives. New room bridges are edits from the hash-checked recordings. The new work, waiting, speech and scene parts use original synthesis. The reused welcome retains its separate voice provenance. New provider calls and spending are zero. Commercial release clearance, owner listening acceptance and integration testing in actual gameplay remain open.

First listen to the uninterrupted take. Does the drum exchange at 0:47 make the bass return at 1:10 feel earned?
