"""Render the Day Two audition from original synthesis and the three approved MP3s.

Python 3.10+, NumPy, FFmpeg (libmp3lame). Pass --masters for editable PCM.
Cuts share one gapless MP3 reel. The manifest addresses decoded 48 kHz stereo frames.
"""
import argparse
from dataclasses import replace
from functools import lru_cache
import json
from pathlib import Path
import subprocess

import numpy as np
from render_long_form import MENU_PHRASES, MENU_VOICINGS, OPTIONS_HANDS, TEMPO, place
from render_session_02 import SR, ffmpeg, kit, meter, perform, wav

BEAT = 60 / TEMPO
BAR = 4 * BEAT
PUBLIC = kit.PUBLIC / 'day-two'
PARENTS = {
    'menu': ('LF-MUS-LONG-06-MENU', 'menu.mp3', 80, '84fc14665f980fbb060e77a5196267be87f69c9d5636ab3cfe8e2fbbef9dadc7'),
    'options': ('LF-MUS-LONG-02-OPTIONS', 'options.mp3', 32, 'ee9f68473b9f12ded28f8907f115ee02d873c6cd63448726626fa44923eb446d'),
    'security': ('LF-MUS-LONG-01-CONVEYOR', 'conveyor.mp3', 96, '438cc8403969308fc6f578b3fa60eef2b06bfda726b8bedb8f0134e8b61c2216'),
}
# Four four-bar sentences per section. Pitch, duration and harmony come from Menu 06.
FORM = (
    ('theme', 'exchange', 'bass_turn', 'cadence'),
    ('stretch', 'lift', 'side_step', 'high_answer'),
    ('exchange', 'low_turn', 'rebuild', 'cadence'),
    ('theme', 'bass_turn', 'lift', 'cadence'),
)
KICKS = (
    ((0, 3.25), (0, 1.75), (.5, 2.75), (0, 1.5, 3.5)),
    ((0, 2.5), (0, 1.75, 2.5), (0, 2.75), (.5, 2.5, 3.75)),
    ((0, 2.5), (.75, 2.5), (0, 1.5), (0, 2.75)),
    ((0, 1.5, 3.25), (0, 2.5), (.5, 2.75), (0, 1.75, 3.5)),
)


def battery(bar, section, lap, hit):
    slot = bar % 4
    kicks = KICKS[section][(slot + lap) % 4]
    for i, t in enumerate(kicks):
        hit(t, 'foot', .91 if i == 0 else .61)
    backbeat = (1, 3) if section == 1 or section == 3 and bar % 16 >= 8 else (2,)
    for t in backbeat:
        hit(t + .014, 'snare', .76 if len(backbeat) == 1 else .64, (bar + t) % 4, pan=.035)
        if t == 2 and slot == 3:
            hit(1.93, 'ghost', .17, 2, pan=-.12)
    # Offbeat foot and left-hand replies interlock. The solo inherits the actual
    # Options hands; its opening figure migrates to half-time before the wire roll.
    hands = OPTIONS_HANDS[(bar % 16 + lap * 8) % 32]
    if section == 2 or slot in (1, 3):
        for t, voice, note, gain in hands:
            hit(t + (.018 if t % 1 else 0), voice, gain * (1.26 if section == 2 else .61),
                note, pan=-.21 if voice == 'stick' else .19)
    for i in range(8):
        if (section == 2 and i % 2) or (section == 0 and slot < 2 and i in (1, 5)):
            continue
        hit(i / 2 + (.033 if i % 2 else 0), 'hat', (.164, .063, .12, .083)[(i + lap) % 4],
            (i + bar) % 4, pan=-.32)
    if bar % 8 == 6:
        for t, level in ((3.50, .15), (3.625, .27), (3.75, .35)):
            hit(t, 'roll', level, (bar + round(t * 8)) % 4, pan=.1)
    if bar % 8 == 7:
        hit(3.51, 'open', .19, pan=.26)


def conveyor_score():
    events = []
    for bar in range(128):
        lap, pos = divmod(bar, 64)
        section, local = divmod(pos, 16)
        phrase, measure = divmod(local, 4)
        name = FORM[section][phrase]
        harmony, melody = MENU_PHRASES[name][measure]
        root, chord = MENU_VOICINGS[harmony]
        hit = place(bar, events)
        battery(bar, section, lap, hit)
        # Sub pedal stays on low D under the signature C-sharp.
        hit(0, 'pedal', .47 if section != 2 else .32, root - 12, 1.6 if measure % 2 else 3.55)
        for i, note in enumerate(chord):
            if section == 2 and measure != 3:
                continue
            inversion = 12 if lap and i == 0 else 0
            hit(.73 + .023 * i, 'reedkeys', .12, note + inversion, 2.4,
                -.45 + .26 * i)
        if section == 2:
            # E–C-sharp trades with the shells. Drop bass altogether for the snare pickup.
            if measure in (1, 3) and local != 15:
                hit(.51, 'growl', .62, 40, .63)
                hit(1.52, 'growl', .66, 37, 1.42 if phrase % 2 else .86)
            continue
        for t, note, dur, gain in melody:
            keys_lead = section == 1 and (phrase >= 2 or measure >= 2)
            if keys_lead:
                hit(t, 'reply', gain * 1.14, note, dur, .18)
            else:
                hit(t, 'bite' if lap else 'growl', gain * 1.72, note - 24,
                    dur * (.84 if lap and dur < 2 else 1), -.04)
        if section == 1 and (phrase >= 2 or measure >= 2):
            hit(1.5, 'growl', .50, root, .64)
            if measure % 2:
                hit(3.27, 'growl', .45, root + 7, .47)
        if section == 3 and name == 'theme' and measure == 2:
            hit(1.5, 'signal', .23, 73, .37, .30)
            hit(2.25, 'reply', .19, 69, .64, -.26)
        if local == 15:
            hit(3.27, 'stick', .37, 76, pan=-.25)
            hit(3.77, 'tom', .45, 60, pan=.17)
    return events


@lru_cache(maxsize=320)
def bass(voice, note, beats):
    t = kit.time_axis(beats * BEAT)
    phase = kit.TAU * kit.frequency(note) * t
    if voice == 'pedal':
        sound = .76 * np.sin(phase) + .14 * np.sin(2 * phase)
    else:
        # Articulated FM reed over a clean fundamental. The bite pass changes
        # articulation and overtone motion while preserving the pitch contour.
        rate = 1.5 if voice == 'bite' else 1
        mouth = .38 + .62 * (.5 + .5 * np.cos(kit.TAU * rate * t / BEAT)) ** 2
        index = .40 + 1.6 * mouth * np.exp(-t / .60) + .38 * np.exp(-t / .035)
        sound = .49 * np.sin(phase) + .50 * np.sin(2 * phase + index * np.sin(phase))
        sound += .15 * mouth * np.sin(5 * phase + .7 * np.sin(2 * phase))
    return kit.soften(sound, .006, min(.055, t[-1] * .3))


def play_score(events, bars):
    special = {'pedal', 'growl', 'bite'}
    total = round(bars * BAR * SR)
    # Render two bars before the loop so cymbals and echo cross its seam.
    lead = 8
    preroll = [replace(e, beat=e.beat - bars * 4) for e in events if e.beat >= bars * 4 - lead]
    timeline = [replace(e, beat=e.beat + lead) for e in preroll + events]
    array = perform([e for e in timeline if e.voice not in special], TEMPO, bars=bars + 2, ending_fade=False)
    for e in timeline:
        if e.voice not in special:
            continue
        start = round(e.beat * BEAT * SR)
        tone = bass(e.voice, e.note, e.length)
        count = min(len(array) - start, len(tone))
        angle = (1 + e.pan) * np.pi / 4
        array[start:start + count] += tone[:count, None] * e.gain * np.array([np.cos(angle), np.sin(angle)])
    first = round(lead * BEAT * SR)
    return (.83 * np.tanh(array[first:first + total])).astype('float32')


def quiet_score(name, bars):
    events = []
    for bar in range(bars):
        hit = place(bar, events)
        phase = bar % 4
        note = (62, 64, 61, 57, 65, 64, 67, 61)[bar % 8]
        if name in ('speech', 'waiting'):
            hit(0 if phase != 2 else .5, 'foot', .34 if name == 'speech' else .27)
            hit(2.02, 'stick', .31, 66 if phase % 2 else 70, pan=.18)
            if bar % 2:
                hit(3.52, 'hat', .12, bar % 4, pan=-.28)
            if name == 'speech' and phase in (0, 3):
                hit(.78, 'pedal', .46, 26 if phase == 0 else 33, 1.6)
            if name == 'waiting' and bar in (3, 7, 11, 15):
                hit(3.23, 'tine', .11, note, .56, .34)
        elif name in ('day-one', 'console', 'results'):
            if phase in (0, 2):
                hit(.5, 'reedkeys', .24, note, 2.6, -.25)
                hit(.53, 'reedkeys', .16, note - (7 if phase == 0 else 5), 2.4, .25)
            if phase == 3:
                hit(2.52, 'tine', .17, 64 if bar < 7 else 61, .72, .31)
            if name != 'results':
                hit(0, 'foot' if name == 'day-one' else 'stick', .24, 0 if name == 'day-one' else 65)
                if bar % 2:
                    hit(2.77, 'hat', .13, bar % 4)
    return play_score(events, bars)


def decode(path):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le',
                                   '-ar', str(SR), '-ac', '2', '-'])
    return np.frombuffer(raw, '<f4').reshape(-1, 2)


def clip(track, bar, count):
    start = round(bar * BAR * SR)
    return track[start:start + round(count * BAR * SR)].copy()


def edge(audio, attack=.008, release=.18):
    out = audio.copy()
    for side, seconds in ((out, attack), (out[::-1], release)):
        n = min(len(side), round(SR * seconds))
        if n:
            side[:n] *= np.linspace(0, 1, n)[:, None]
    return out


def bridge(a, b):
    ramp = np.linspace(0, np.pi / 2, len(a))[:, None]
    return edge((a * np.cos(ramp) + b * np.sin(ramp)) * .83, release=.035)


def export(path, master):
    ffmpeg('-i', master, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-q:a', '5', path)
    return dict(sha256=kit.digest(path), masterSha256=kit.digest(master), **meter(path))


def main(masters):
    masters.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(exist_ok=True, parents=True)
    tracks, sounds = {}, {}
    for key, (study, filename, bars, digest) in PARENTS.items():
        source = kit.PUBLIC / 'long-form' / filename
        if kit.digest(source) != digest:
            raise ValueError(f'Approved parent changed: {filename}')
        sounds[key] = decode(source)
        tracks[key] = dict(id=study, file='../long-form/' + filename, bars=bars, sha256=digest,
                           loopFrames=[0, len(sounds[key])], originalTheme='conveyor' if key == 'security' else key)
    audio = play_score(conveyor_score(), 128)
    main_wav = masters / 'day-two-conveyor.wav'
    wav(main_wav, audio)
    level = meter(main_wav)
    audio *= 10 ** (min(-17 - level['lufs'], -2 - level['dBTP']) / 20)
    wav(main_wav, audio)
    tracks['conveyor'] = dict(id='LF-MUS-D2-CONVEYOR-01', file='conveyor-day-two.mp3',
                             bars=128, arcBars=64, loopFrames=[0, len(audio)],
                             **export(PUBLIC / 'conveyor-day-two.mp3', main_wav))
    sounds['conveyor'] = audio
    cues, segments, pos = {}, [], 0

    def add(key, label, kind, data, parents, tail=0):
        nonlocal pos
        n = len(data)
        cues[key] = dict(label=label, kind=kind, frames=[pos, pos+n], tailFrames=round(tail*SR),
                         sources=parents)
        segments.extend([data, np.zeros((SR//8, 2), dtype='float32')])
        pos += n + SR//8

    for key, label in (('day-one','Day One · walk and floor'), ('console','Console · leadership'),
                       ('speech','Speech · low arrangement'), ('waiting','Waiting · stopped line'),
                       ('results','Results · suspended cadence')):
        add(key, label, 'loop', quiet_score(key, 16 if key in ('waiting','speech','day-one') else 8)*.73, ['original-score'])
    # Musical head and tail edits can be requested on any visit, independently of a scene opener.
    for key, bar in (('menu', 79), ('options', 31), ('security', 95), ('conveyor', 63)):
        add(key+'-in', key.title()+' · track entry', 'entry', edge(clip(sounds[key], 0, 1), release=.025),
            [tracks[key]['id']], .025)
        add(key+'-out', key.title()+' · track exit', 'exit', edge(clip(sounds[key], bar, 1), release=.33),
            [tracks[key]['id']], .33)
    for key, a, ab, b, bb in (
        ('menu-options','menu',32,'options',0), ('options-menu','options',31,'menu',48),
        ('security-conveyor','security',15,'conveyor',0), ('conveyor-security','conveyor',63,'security',16)):
        add(key, a.title()+' → '+b.title(), 'bridge', bridge(clip(sounds[a],ab,1),clip(sounds[b],bb,1)),
            [tracks[a]['id'],tracks[b]['id']],.035)
    gestures = {
        'factory-open': ('Factory door', [(0,'foot',.58,0,0),(.5,'tine',.28,64,.65),(1.5,'reedkeys',.33,61,2.2)]),
        'gate': ('Gate and fallen card', [(.5,'stick',.35,69,0),(1.25,'tine',.2,61,1.15)]),
        'floor': ('First brain · line reveal', [(0,'tom',.31,62,0),(.75,'tine',.22,64,1.1),(2,'pedal',.32,26,1.2)]),
        'depart': ('Day One · leave the floor', [(0,'reedkeys',.32,64,1.25),(1.5,'reedkeys',.26,61,2.1),(1.52,'pedal',.32,26,1.8)]),
        'appointment': ('Day Two · appointment posted', [(.25,'stick',.31,72,0),(1.,'tom',.38,62,0)]),
        'restart': ('Work resumes · pickup', [(0,'foot',.40,0,0),(.5,'tom',.40,65,0),(.75,'stick',.36,71,0),(1.,'growl',.46,37,.85)]),
        'bell-release': ('Shift bell · musical release', [(1,'reedkeys',.30,64,.95),(2.25,'reedkeys',.25,61,1.48),(2.25,'pedal',.29,26,1.3)]),
    }
    for key,(label, notes) in gestures.items():
        ev = []
        hit = place(0,ev)
        for t, voice, gain, note, dur in notes:
            hit(t,voice,gain,note,dur)
        add(key,label,'event' if key=='restart' else 'scene',edge(play_score(ev,1),release=.15),['original-score'],.15)
    cuts_dir = masters / 'cuts'
    cuts_dir.mkdir(exist_ok=True)
    for key, segment in zip(cues, segments[::2], strict=True):
        wav(cuts_dir / (key + '.wav'), segment)
    atlas = np.concatenate(segments)
    reel = masters/'cue-reel.wav'
    wav(reel,atlas)
    manifest = dict(version='day-two-audition-1', sampleRate=SR, tempo=164, feltTempo=82,
                    tracks=tracks, reel=dict(file='cue-reel.mp3', frames=len(atlas), **export(PUBLIC/'cue-reel.mp3',reel)),
                    cues=cues, providerCalls=0, spendUSD=0, clearance='local composition review')
    manifest['arrangement'] = json.loads(Path(__file__).with_name('day_two_map.json').read_text())
    (PUBLIC/'cues.json').write_text(json.dumps(manifest,indent=2)+'\n')


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--masters',type=Path,required=True)
    main(parser.parse_args().masters)
