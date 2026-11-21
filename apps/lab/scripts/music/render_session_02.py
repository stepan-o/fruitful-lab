"""Render listening session 02. Original performances, no online services.

Run with --masters DIR for private PCM listening masters. --assets points to the
lab public directory containing the previously published picture and voice.
Requires Python 3.10+, NumPy and FFmpeg with libmp3lame and AAC.
"""
import argparse
import json
import re
import subprocess
import wave
from dataclasses import asdict, dataclass
from functools import lru_cache
from pathlib import Path

import numpy as np
import render_landing as kit

SR = kit.SR
BARS = 48
OUTPUT = kit.PUBLIC / 'session-02'
PICTURE = 'loopforge-shifts/review/first-playthrough/limen/opening-Forge-clear.mp4'
VOICE = 'loopforge-shifts/limen-welcome.mp3'
DESCENT = (69, 67, 65, 64, 61)
SPEECH_BAR = 36  # Zero-based. Start both speech edits on bar 37.


@dataclass(frozen=True)
class Hit:
    beat: float
    voice: str
    note: int
    length: float
    gain: float
    pan: float


def score():
    hits = []
    for bar in range(BARS):
        phrase = bar % 16
        def hit(at, voice, gain, note=0, length=0., pan=0.):
            hits.append(Hit(bar * 4 + at, voice, note, length, gain, pan))

        options = 16 <= bar < 32
        floor = bar >= 32
        # The hats carry tempo across both doors; swing applies to offbeats.
        for i, gain in enumerate((.14, .052, .081, .06, .119, .058, .09, .065)):
            if floor and i % 2 and (phrase + i) % 3:
                continue
            if options and phrase in (6, 14) and i >= 5:
                continue
            hit(i * .5 + (.024 if i % 2 else 0), 'hat', gain * (.8 if options else 1),
                note=(i + bar) % 4, pan=-.24 + (i % 3) * .12)
        kicks = ((0, 1.75, 2.5), (0, 2.5), (0, 1.5, 2.75), (0, 2.5, 3.75))[bar % 4]
        if options:
            kicks = (0, 2.5)
        if floor:
            kicks = (0, 3.25) if phrase % 4 == 3 else (0,)
        for i, at in enumerate(kicks):
            hit(at, 'kick', (.69 if i == 0 else .48) * (.72 if options else 1))
        for at in ((2,) if floor else (1, 3)):
            hit(at + .012, 'snare', .68 if floor else .39 if options else .53, bar % 4, pan=.035)
        if floor:
            # Twelve uninterrupted bars. The last four demonstrate a labelled wait and restart.
            if phrase in (12, 13):
                continue
            if phrase == 14:
                hit(2, 'sub', .73, 37, 1.55)  # Motion at 46:1.5, answer at 46:2 (zero based).
            elif phrase % 4 == 0:
                for at, note, dur in ((0, 33, .72), (1.5, 31, .58), (3.25, 29, .43)):
                    hit(at, 'sub', .71, note, dur)
            elif phrase % 4 == 1:
                hit(.75, 'sub', .70, 28, .56)
                hit(2.75, 'sub', .65, 25, .75 if phrase == 1 else 2.9)
            elif phrase % 4 == 2:
                hit(.25, 'sub', .72, 25, 2.82)
                hit(.25, 'tine', .12, 62, 3.1, -.24)
            else:
                hit(.5, 'sub', .68, 26, 1.3)
                hit(3.52, 'rim', .17, 76, pan=.35)
            if phrase in (3, 7, 11):
                hit(3.77, 'ghost', .12, phrase % 4, pan=-.2)
            continue

        if options:
            # One hand figure visits three timbres, then plays them as one contour.
            if phrase % 2 == 0:
                for i, at in enumerate((.26, .51, .76, 1.26, 1.77)):
                    voice = ('hat', 'rim', 'tom', ('hat', 'rim', 'rim', 'tom', 'tom')[i])[phrase // 4]
                    note = i % 4 if voice == 'hat' else (76, 72, 69, 65, 61)[i]
                    hit(at, voice, (.23 if voice != 'hat' else .18) * (1 - i * .07),
                        note, pan=.34 - .16 * i)
            elif phrase not in (7, 15):
                for i, at in enumerate((1.77, 2.27, 3.76)[:1 + phrase % 3]):
                    hit(at, 'ghost', .11 - .017 * i, (i + phrase) % 4, pan=-.14)
            if phrase in (3, 11):
                hit(3.52, 'open', .115, pan=.30)
            if phrase == 15:
                hit(3.5, 'tom', .24, 53, pan=-.20)
            continue

        # Menu: two 8-bar phrases; a moving inner voice answers the held C-sharp.
        harmony = ((53, 60, 64, 69), (53, 59, 64, 69), (55, 60, 65, 69), (53, 60, 64, 67))
        if phrase % 2 == 0:
            notes = harmony[(phrase // 2 + (1 if phrase >= 8 else 0)) % 4]
            for i, note in enumerate(notes):
                hit(1.48 + i * .024, 'tine', .14, note, 3.8, -.44 + i * .28)
        if phrase in (0, 8):
            for i, note in enumerate(DESCENT):
                hit(i * .25, 'lead', .46 if phrase == 0 else .34, note,
                    3.2 if i == 4 else .27, -.09 + i * .04)
        if phrase in (5, 13):
            hit(.76, 'lead', .19, 64, .5, .25)
            hit(1.51, 'lead', .21, 61, 1.6, .12)
        for at, note, dur in ((0, 38, 1.38), (2.54, (33, 36, 35, 38)[bar % 4], .89)):
            hit(at, 'bass', .53, note, dur)
        if phrase % 4 in (1, 3):
            hit(1.77, 'ghost', .12, phrase % 4, pan=-.18)
        if phrase % 4 == 3:
            for at, gain in ((3.50, .17), (3.77, .22)):
                hit(at, 'ghost', gain, 1, pan=.14)
    return hits


def perform(events, bpm, *, bars=BARS, ending_fade=True):
    beat = 60 / bpm
    rng = np.random.default_rng(20261121)
    drums = {'kick': [kit.kick(rng)], 'snare': [kit.snare(rng) for _ in range(4)],
             'ghost': [kit.snare(rng, True) for _ in range(4)],
             'hat': [kit.metal(rng, False) for _ in range(4)], 'open': [kit.metal(rng, True)]}

    @lru_cache(maxsize=256)
    def instrument(name, note, length):
        if name == 'foot':
            # A shorter tail leaves space for the second bass attack.
            full = drums['kick'][0]
            t = kit.time_axis(.155)
            beater = .12 * np.sin(kit.TAU * 990 * t) * np.exp(-t / .007)
            return kit.soften(full[:len(t)] * np.exp(-t / .16) + beater, .0007, .016)
        if name in ('signal', 'reply', 'reedkeys'):
            t = kit.time_axis(length * beat)
            phase = kit.TAU * kit.frequency(note) * t
            if name == 'signal':
                wave = np.sin(phase) + .42 * np.sin(2 * phase) + .24 * np.sin(3 * phase)
                envelope = .39 + .55 * np.exp(-t / .11)
                return kit.soften(wave * envelope, .002, min(.038, t[-1] / 3))
            if name == 'reply':
                # A close, round reed gives the counterline a different articulation.
                wave = np.sin(phase + (.38 + .48 * np.exp(-t / .14)) * np.sin(2 * phase))
                envelope = .43 + .44 * np.exp(-t / .24)
                return kit.soften(wave * envelope, .014, min(.088, t[-1] / 4))
            # Warm electric keys, held on the direct bus with no delay return.
            wave = np.sin(phase + (.12 + .52 * np.exp(-t / .24)) * np.sin(2 * phase))
            envelope = .48 * np.exp(-t / .68) + .39 * np.exp(-t / 2.1)
            return kit.soften(wave * envelope, .012, min(.16, t[-1] / 4))
        if name in drums:
            return drums[name][note]
        if name == 'rim':
            return kit.rim(note)
        if name == 'tom':
            t = kit.time_axis(.32)
            phase = kit.TAU * (kit.frequency(note - 12) * t + 1.4 * (1 - np.exp(-t / .035)))
            return kit.soften(np.sin(phase) * np.exp(-t / .075), .001)
        if name in ('tine', 'lead'):
            return kit.keys(note, length * beat / kit.BEAT, name == 'lead')
        t = kit.time_axis(length * beat)
        phase = kit.TAU * kit.frequency(note) * t
        colour = .35 + .24 * np.sin(kit.TAU * t / (beat * 2) - .8)
        wavelet = np.sin(phase) + .30 * np.sin(2 * phase) + colour * np.sin(3 * phase)
        if name == 'sub':
            wavelet += colour ** 2 * (np.sin(5 * phase) + .5 * np.sin(7 * phase))
        return kit.soften(np.tanh(wavelet), .009, min(.085, len(t) / SR / 3))

    length = round(bars * 4 * beat * SR)
    texture = np.zeros((length, 2), dtype=np.float32)
    rhythm = np.zeros_like(texture)
    for e in events:
        sound = instrument(e.voice, e.note, e.length)
        start = round(e.beat * beat * SR)
        count = min(len(sound), length - start)
        angle = (e.pan + 1) * np.pi / 4
        stereo = np.array([np.cos(angle), np.sin(angle)]) * e.gain
        target = texture if e.voice in ('tine', 'lead') else rhythm
        target[start:start + count] += sound[:count, None] * stereo
    delay = round(.75 * beat * SR)
    rhythm += texture
    rhythm[delay:] += .16 * texture[:-delay, ::-1]
    if ending_fade:
        rhythm[-round(.15 * SR):] *= np.linspace(1, 0, round(.15 * SR))[:, None]
    return np.tanh(rhythm) * .82


def wav(path, x):
    with wave.open(str(path), 'wb') as f:
        f.setparams((2, 2, SR, len(x), 'NONE', 'not compressed'))
        f.writeframes(np.rint(np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


def ffmpeg(*args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *map(str, args)], check=True)


def meter(path):
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(path), '-vn', '-af',
                          'loudnorm=print_format=json', '-f', 'null', '-'],
                         check=True, capture_output=True, text=True).stderr
    data = json.loads(re.findall(r'\{[^{}]+\}', log)[-1])
    return {'lufs': float(data['input_i']), 'dBTP': float(data['input_tp'])}


def web_copy(picture, bed, voice, output):
    # The lossless picture encode preserves every decoded source frame.
    ffmpeg('-i', picture, '-i', bed, '-i', voice, '-filter_complex',
           '[2:a]adelay=1250:all=1,volume=0.84[v];[1:a][v]amix=inputs=2:normalize=0:duration=first[a]',
           '-map', '0:v:0', '-map', '[a]', '-c:v', 'libvpx-vp9', '-lossless', '1',
           '-cpu-used', '4', '-threads', '2', '-c:a', 'libopus', '-b:a', '128k', output)


def render(masters, assets):
    import hashlib
    masters.mkdir(parents=True, exist_ok=True)
    OUTPUT.mkdir(exist_ok=True)
    score_events = score()
    score_hash = hashlib.sha256(json.dumps([asdict(e) for e in score_events],
                                           sort_keys=True).encode()).hexdigest()
    manifest = {'revision': 'theme-study-02', 'bars': BARS, 'meter': '4/4', 'sampleRate': SR,
                'scoreSha256': score_hash, 'source': 'local synthesis', 'providerCalls': 0,
                'costUSD': 0, 'fixtureBeats': {'options': 64, 'conveyor': 128, 'wait': 176,
                                              'movement': 185.5, 'bassAnswer': 186},
                'picture': {'path': PICTURE, 'sha256': kit.digest(assets / PICTURE)},
                'voice': {'path': VOICE, 'sha256': kit.digest(assets / VOICE), 'offsetSeconds': 1.25},
                'exports': []}
    for bpm in (170, 164):
        audio = perform(score_events, bpm)
        master = masters / f'grid-{bpm}.wav'
        wav(master, audio)
        peak = meter(master)
        gain = min(-17 - peak['lufs'], -1.8 - peak['dBTP'])
        audio *= 10 ** (gain / 20)
        wav(master, audio)
        out = OUTPUT / f'grid-{bpm}.mp3'
        ffmpeg('-i', master, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', out)

        # Re-orchestrate the fixed speech window with a low pedal and fewer attacks.
        seconds = 6.96
        start = round(SPEECH_BAR * 4 * 60 / bpm * SR)
        clip = audio[start:start + round(seconds * SR)].copy()
        clock = np.arange(len(clip)) / SR
        space = np.minimum(np.clip((clock - 1.13) / .12, 0, 1),
                           np.clip((4.72 - clock) / .19, 0, 1))
        pedal = np.sin(kit.TAU * kit.frequency(26) * clock)
        clip = clip * (1 - .87 * space[:, None]) + .085 * (space * pedal)[:, None]
        clip[-round(.12 * SR):] *= np.linspace(1, 0, round(.12 * SR))[:, None]
        bed = masters / f'speech-bed-{bpm}.wav'
        wav(bed, clip)
        video = OUTPUT / f'speech-{bpm}.mp4'
        ffmpeg('-i', assets / PICTURE, '-i', bed, '-i', assets / VOICE, '-filter_complex',
               '[2:a]adelay=1250:all=1,volume=0.84[v];[1:a][v]amix=inputs=2:normalize=0:duration=first[a]',
               '-map', '0:v:0', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k',
               '-movflags', '+faststart', video)
        for file in (out, video):
            manifest['exports'].append({'file': file.name, 'tempo': bpm, 'sha256': kit.digest(file),
                'rightsId': 'LF-MUS-02-' + file.stem.upper(), **meter(file)})
        manifest['exports'][-2].update({'frames': len(audio), 'masterSha256': kit.digest(master)})
        web = video.with_suffix('.webm')
        web_copy(assets / PICTURE, bed, assets / VOICE, web)
        manifest.setdefault('alternateEncodings', []).append({
            'file': web.name, 'sameEditAs': video.name, 'sha256': kit.digest(web), **meter(web)})
    for a, b in zip(manifest['exports'][:2], manifest['exports'][2:]):
        if abs(a['lufs'] - b['lufs']) > 1 or max(a['dBTP'], b['dBTP']) > -1:
            raise ValueError(f'Level comparison failed: {a}, {b}')
    (OUTPUT / 'session.json').write_text(json.dumps(manifest, indent=2) + '\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--masters', type=Path, required=True)
    parser.add_argument('--assets', type=Path, default=kit.PUBLIC.parents[1])
    args = parser.parse_args()
    render(args.masters, args.assets)
