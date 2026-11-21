"""Render the original Loopforge landing-note A/B. Requires NumPy and FFmpeg.

Run from any directory. --masters keeps private review WAVs outside the public app.
The rhythm, pitches and synthesis are authored here; there are no sampled inputs.
"""
import argparse
import hashlib
import json
import re
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 48_000
BPM = 170
BEAT = 60 / BPM
LENGTH = 24 * SR  # 17 bars in 4/4
PUBLIC = Path(__file__).resolve().parents[2] / 'public/loopforge-design/music-audition'
TAU = 2 * np.pi


def time_axis(seconds):
    return np.arange(round(seconds * SR)) / SR


def frequency(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def band_noise(t, rng, low, high):
    """Give a synthesized noise burst a controllable drum-shell or cymbal colour."""
    spectrum = np.fft.rfft(rng.normal(size=len(t)))
    hz = np.fft.rfftfreq(len(t), 1 / SR)
    spectrum *= (1 - np.exp(-(hz / low) ** 4)) * np.exp(-(hz / high) ** 4)
    burst = np.fft.irfft(spectrum, n=len(t))
    return burst / max(np.sqrt(np.mean(burst ** 2)), 0.001)


def soften(x, attack=.003, release=.018):
    a = min(len(x), round(SR * attack))
    r = min(len(x), round(SR * release))
    if a:
        x[:a] *= np.linspace(0, 1, a) ** 2
    if r:
        x[-r:] *= np.linspace(1, 0, r) ** 2
    return x


def kick(rng):
    t = time_axis(.34)
    cycle = 48 * t + 5.2 * (1 - np.exp(-t / .032))
    body = np.sin(TAU * cycle) * np.exp(-t / .087)
    beater = .16 * band_noise(t, rng, 1300, 6100) * np.exp(-t / .004)
    return soften(np.tanh(1.45 * body) + beater, .0008)


def snare(rng, ghost=False):
    t = time_axis(.13 if ghost else .27)
    tone = (np.sin(TAU * (187 * t + .64 * (1 - np.exp(-t / .021)))) +
            .36 * np.sin(TAU * 332 * t)) * np.exp(-t / .051)
    wire = band_noise(t, rng, 850, 9500) * np.exp(-t / (.037 if ghost else .067))
    slap = band_noise(t, rng, 550, 3000) * np.exp(-np.abs(t - .012) / .011)
    return soften(np.tanh(1.28 * (.49 * tone + .67 * wire + .23 * slap)), .0012)


def metal(rng, opened):
    t = time_axis(.24 if opened else .105)
    colour = band_noise(t, rng, 4600, 14000)
    partials = np.sin(TAU * 5887 * t + 2.2 * np.sin(TAU * 2461 * t))
    return soften((.69 * colour + .21 * partials) * np.exp(-t / (.067 if opened else .018)), .001)


def rim(note):
    t = time_axis(.14)
    phase = TAU * frequency(note) * t
    return soften((np.sin(phase) + .53 * np.sin(2.73 * phase) + .22 * np.sin(5.17 * phase))
                  * np.exp(-t / .024), .0009)


def keys(note, beats, lead=False):
    t = time_axis(beats * BEAT)
    phase = TAU * frequency(note) * t
    index = (1.3 if lead else .85) * np.exp(-t / .19) + .12
    tine = np.sin(phase + index * np.sin(2 * phase)) + .15 * np.sin(2.003 * phase)
    envelope = .72 * np.exp(-t / (.68 if lead else .49)) + .18 * np.exp(-t / 1.7)
    return soften(tine * envelope, .0028, min(.11, len(t) / SR / 3))


def bass(note, beats, weight):
    t = time_axis(beats * BEAT)
    phase = TAU * frequency(note) * t
    body = np.sin(phase) + .20 * np.sin(2 * phase)
    # Only upper harmonics open and close. The mono fundamental keeps its weight.
    opening = .42 + .35 * np.sin(TAU * (t / BEAT * .69) - .85)
    reed = sum(np.sin(h * phase + .05 * h) * opening ** (h / 3) / np.sqrt(h)
               for h in (3, 4, 5, 7, 9, 11))
    return soften(np.tanh(1.13 * (body + weight * reed)) * (.81 + .19 * np.exp(-t / .1)),
                  .012, min(.065, len(t) / SR / 4))


def mix(bus, beat, sound, level, pan=0.):
    start = round(beat * BEAT * SR)
    if start >= len(bus):
        return
    length = min(len(sound), len(bus) - start)
    angle = (pan + 1) * np.pi / 4
    bus[start:start + length] += (level * sound[:length])[:, None] * np.array([np.cos(angle), np.sin(angle)])


def space(bus, echoes):
    result = bus.copy()
    for beats, gain in echoes:
        step = round(BEAT * beats * SR)
        result[step:] += gain * bus[:-step, ::-1]
    return result


def backing():
    rng = np.random.default_rng(17085)
    drums = np.zeros((LENGTH, 2))
    chords = np.zeros_like(drums)
    low = np.zeros_like(drums)
    kicks = kick(rng)
    snares = [snare(rng) for _ in range(4)]
    ghosts = [snare(rng, True) for _ in range(4)]
    hats = [metal(rng, False) for _ in range(8)]
    open_hats = [metal(rng, True) for _ in range(3)]
    voicings = [[53, 60, 64, 69], [55, 60, 65, 69], [53, 59, 64, 69]]
    for bar in range(17):
        beat = 4 * bar
        options = 6 <= bar < 10
        floor = bar >= 10
        for i in range(8):
            pos = beat + i / 2 + (.019 if i % 2 else 0)
            level = ([.13, .052, .082, .06, .105, .055, .078, .061][i] *
                     (.72 if floor else .88 if options else 1))
            mix(drums, pos, hats[(bar + i) % 8], level, -.19 + .09 * (i % 3))
        if bar % 2 or options:
            mix(drums, beat + 3.5, open_hats[bar % 3], .115 if options else .09, .3)
        if bar in [3, 7, 9, 15]:
            mix(drums, beat + 3.77, hats[2], .074, .27)
        kick_pattern = [[0, 1.75, 2.5], [0, 2.5, 3.75], [0, 1.5, 2.75], [0, 2.5]][bar % 4]
        if floor:
            kick_pattern = [0, 3.25] if bar % 2 else [0, 1.5]
        if options:
            kick_pattern = [0, 2.75] if bar % 2 else [0, 2.5]
        for i, offset in enumerate(kick_pattern):
            mix(drums, beat + offset, kicks, (.72 if i == 0 else .54) * (.75 if options else 1))
        for offset in ([2] if floor else [1, 3]):
            mix(drums, beat + offset + .010, snares[bar % 4], .67 if floor else .45 if options else .55, .035)
        if not floor or bar % 2:
            for i, off in enumerate(([1.77, 2.27, 3.77] if options else [1.76, 3.51])):
                mix(drums, beat + off, ghosts[(bar + i) % 4], [.115, .077, .09][i], -.16 + .1 * i)
        if options:
            if bar % 2 == 0:
                for i, note in enumerate([86, 82, 76, 71, 65]):
                    mix(drums, beat + i / 4, rim(note), .18 - i * .014, .25 - .12 * i)
            else:
                mix(drums, beat + 2.77, rim(68), .105, -.35)
            continue
        if bar < 6 and bar % 2 == 0:
            for i, note in enumerate(voicings[bar // 2]):
                mix(chords, beat + 1.5 + i * .022, keys(note, 3.0), .155, (i - 1.5) * .24)
                if bar:
                    mix(chords, beat + 5.23 + i * .015, keys(note, 1.32), .103, (1.5 - i) * .18)
        if not floor:
            for offset, note, dur in [(0,38,1.28), (1.77,38,.51), (2.55,33 if bar % 2 else 36,1.02)]:
                mix(low, beat + offset, bass(note, dur, .36), .60 if bar else .44)
        else:
            # The wait starts at beat 48. The carrier restarts at 56.5 and bass answers at 57.
            pattern = [(0,26,1.55), (2.75,33,.85)] if bar % 2 == 0 else [(0,26,.85),(1.25,29,.78),(3,26,.7)]
            if bar in (12, 13):
                pattern = []
            elif bar == 14:
                pattern = [(1,26,1.4),(2.75,29,.81)]
            for off, note, dur in pattern:
                mix(low, beat + off, bass(note, dur, 1.6), .78)
                mix(low, beat + off, bass(note + 12, dur, 1.25), .13, .12)
    # A short ambience glues the kit together without washing out the snare.
    return space(drums, [(.07,.061), (.13,.037)]) + space(chords, [(.75,.19),(1.5,.085)]) + low


def motif(landing):
    lead = np.zeros((LENGTH, 2))
    for start, gain in [(0, .56), (16, .39), (64, .48)]:
        for i, note in enumerate([69,67,65,64,landing]):
            mix(lead, start + i / 4, keys(note, 3.0 if i == 4 else .27, True),
                gain * [1,.91,.88,.83,1][i], -.07 + .035 * i)
    return space(lead, [(.75,.18), (1.5,.077)])


def write_wav(path, audio):
    raw = np.round(np.clip(audio, -1, 1) * 32767).astype('<i2')
    with wave.open(str(path), 'wb') as out:
        out.setparams((2, 2, SR, LENGTH, 'NONE', 'not compressed'))
        out.writeframes(raw.tobytes())


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def render(masters):
    PUBLIC.mkdir(parents=True, exist_ok=True)
    masters.mkdir(parents=True, exist_ok=True)
    bed = backing()
    takes = [np.tanh((bed + motif(note)) * .94) for note in (63, 61)]
    gain = .80 / max(np.max(np.abs(take)) for take in takes)
    manifest = {'revision':'landing-01', 'bpm':BPM, 'sampleRateHz':SR, 'stereoFrames':LENGTH,
                'bars':17, 'generatedRequests':0, 'providerCostUsd':0,
                'backingHash':hashlib.sha256(np.round(bed * 32767).astype('<i4').tobytes()).hexdigest(),
                'editPointsBeats':{'menu':0,'options':24,'conveyor':40,'wait':48,'carrierMoved':56.5,'bassAnswer':57},
                'takes':[]}
    for label, note, take in zip(('a','b'), ('E-flat','C-sharp'), takes):
        take *= gain
        take[-int(.18 * SR):] *= np.linspace(1, 0, int(.18 * SR))[:, None]
        wav = masters / f'landing-{label}.wav'
        mp3 = PUBLIC / f'landing-{label}.mp3'
        write_wav(wav, take)
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-map_metadata','-1','-codec:a','libmp3lame',
                        '-b:a','192k',str(mp3)], check=True)
        meter = subprocess.run(['ffmpeg','-hide_banner','-i',str(mp3),'-af','loudnorm=print_format=json',
                                '-f','null','-'],capture_output=True,text=True,check=True).stderr
        measurement = json.loads(re.findall(r'\{[^{}]+\}',meter)[-1])
        manifest['takes'].append({'id':label,'landing':note,'file':mp3.name,'masterSha256':digest(wav),
             'sha256':digest(mp3),'integratedLufs':float(measurement['input_i']),
             'truePeakDbtp':float(measurement['input_tp']),'rightsId':'LF-MUS-LANDING-01-'+label.upper()})
    a,b = manifest['takes']
    if abs(a['integratedLufs'] - b['integratedLufs']) > 1 or max(a['truePeakDbtp'], b['truePeakDbtp']) > -1:
        raise ValueError('Review export violates comparative level or peak target')
    (PUBLIC/'session.json').write_text(json.dumps(manifest,indent=2)+'\n')
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--masters',type=Path)
    args = parser.parse_args()
    with tempfile.TemporaryDirectory() as tmp:
        print(json.dumps(render(args.masters or Path(tmp)),indent=2))
