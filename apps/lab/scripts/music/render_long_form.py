"""Render three dedicated, cyclical local score studies. No provider or game inputs."""
import argparse
from dataclasses import replace
from pathlib import Path
import json

from render_session_02 import DESCENT, SR, Hit, ffmpeg, kit, meter, perform, wav

TEMPO = 164
OUT = kit.PUBLIC / 'long-form'
# Each block is 16 bars. The duration of each bar always follows the common fast grid.
FORM = {
    'menu': ('First contact', 'The reply', 'Chord turn', 'Kit in the clear',
             'Quiet double', 'Full break', 'Bass in the clear', 'Return'),
    'options': ('Hands on hats', 'Rim conversation', 'Hats and rests',
                'Low tom answer', 'Broken two-step', 'Pass it back'),
    'conveyor': ('Open weight', 'Long answer', 'Low current',
                 'Displaced accent', 'Upper echo', 'Return to weight'),
}
CHORD = {
    'Dm9': (53, 60, 64, 69), 'Dm6/9': (53, 59, 64, 69),
    'Gm9': (53, 58, 62, 69), 'Bbmaj9': (53, 57, 60, 62),
    'Em7b5': (55, 58, 62, 64), 'A7b9': (55, 58, 61, 64),
    'Fmaj9': (53, 57, 64, 67), 'G13': (53, 59, 64, 69),
}
BASS_ROOT = {'Dm9': 38, 'Dm6/9': 38, 'Gm9': 31, 'Bbmaj9': 34,
             'Em7b5': 40, 'A7b9': 33, 'Fmaj9': 41, 'G13': 31}
HOME = ('Dm9', 'Dm6/9', 'Gm9', 'Dm9')
AWAY = ('Bbmaj9', 'Gm9', 'Em7b5', 'A7b9')
LIGHT = ('Fmaj9', 'G13', 'Bbmaj9', 'A7b9')


def place(bar, events):
    def hit(at, voice, level, note=0, dur=0., pan=0.):
        events.append(Hit(bar * 4 + at, voice, note, dur, level, pan))
    return hit


def line(hit, notes, positions, durations, level, voice='lead'):
    for i, (note, at, dur) in enumerate(zip(notes, positions, durations, strict=True)):
        hit(at, voice, level * (1 - .04 * (i % 4)), note, dur, -.1 + .055 * i)


def breakbeat(hit, bar, style, energy=1):
    cell = bar % 4
    kicks = {
        'roll': ((0, 1.75, 2.5), (0, 2.54), (0, 1.51, 2.76), (0, 2.5)),
        'skip': ((0, 2.28), (.25, 1.75, 2.5), (0, 2.52), (0, 1.76, 3.5)),
        'light': ((0,), (0, 2.5), (0,), (0, 2.77)),
        'hands': ((0, 2.5),) * 4,
    }[style][cell]
    for j, at in enumerate(kicks):
        hit(at, 'kick', (.67 if j == 0 else .44) * energy)
    for at in (1, 3):
        hit(at + .016 + (cell % 2) * .012, 'snare', .49 * energy, bar % 4, pan=.06)
    hat_offsets = (0, 1, 2, 3) if style == 'light' else range(8)
    for j in hat_offsets:
        at = j if style == 'light' else j * .5
        hit(at + (.035 if at % 1 else 0), 'hat',
            (.109 if at % 1 == 0 else .05 + .012 * cell) * energy, (bar + j) % 4, pan=-.28)
    if cell in (1, 3) and style != 'light':
        hit(1.77, 'ghost', .10 * energy, cell, pan=-.18)
    if cell == 3 and style != 'light':
        hit(3.54, 'open', .109 * energy, pan=.34)
        if bar % 8 == 7:
            hit(3.78, 'ghost', .155 * energy, pan=.16)


def menu(bar, hit):
    block, pos = divmod(bar, 16)
    form = (HOME, HOME, AWAY, HOME, LIGHT, AWAY, AWAY, HOME)[block]
    harmony = form[pos // 4]
    if block != 6:  # Bass-only passage leaves the drummer out.
        style = ('roll', 'roll', 'skip', 'hands', 'light', 'skip', 'light', 'roll')[block]
        breakbeat(hit, bar, style, (.92, .98, 1.02, .86, .67, 1.06, 0, .93)[block])
    if block == 3:
        if pos % 4 in (0, 2):
            line(hit, (81, 76, 72, 65), (.52, .79, 1.53, 2.78), (0.,)*4,
                 .24 if pos < 8 else .18, 'rim' if pos < 8 else 'tom')
        return
    root = BASS_ROOT[harmony]
    if block == 6:
        figure = (root, root + 7, root + 10, root + 7) if pos % 4 == 0 else (root, root + 3)
        if pos % 4 == 3:
            line(hit, (33, 36, 37), (.5, 2.27, 3.5), (.95, .5, .45), .48, 'bass')
        else:
            line(hit, figure, (0, 1.78, 2.54, 3.53)[:len(figure)],
                 (1.17, .50, .61, .34)[:len(figure)], .55, 'bass')
        return
    hit(0, 'bass', .48, root, 2.12 if block == 4 else 1.38)
    if pos % 4 != 2:
        hit(2.54, 'bass', .39, root + (7 if pos % 2 else 0), .81)
    if pos % 2 == 0:
        for i, note in enumerate(CHORD[harmony]):
            hit((1.5 if pos % 4 == 0 else .75) + .018 * i, 'tine',
                .145 if block != 4 else .105, note, 3.44, (i - 1.5) * .22)
    # Give the opening a recognisable, rhythmically independent answer.
    if pos == 0 and block in (0, 7):
        line(hit, DESCENT, (0, .25, .50, .75, 1), (.31, .27, .27, .27, 3.2), .43)
    elif block in (1, 2, 4, 5, 7) and pos in (2, 10):
        notes = (64, 69, 72, 71) if block in (1, 7) else (62, 65, 69, 67)
        line(hit, notes, (.77, 1.53, 2.78, 3.5), (.56, .92, .48, 1.55),
             .23 if block == 4 else .33)
    elif block in (1, 4, 5) and pos in (5, 13):
        line(hit, (69, 67, 64), (.52, 2, 3.27), (.93, .72, 1.5), .25)
    elif pos == 14 and block in (0, 2, 7):
        line(hit, (64, 61), (1.78, 2.52), (.45, 1.55), .255)


def options(bar, hit):
    block, pos = divmod(bar, 16)
    style = ('hands', 'hands', 'light', 'hands', 'skip', 'hands')[block]
    level = (.85, .94, .62, .83, .97, .79)[block]
    breakbeat(hit, bar, style, level)
    # The second hand can rest for a whole bar, leaving the kick legible.
    if pos % 4 == 3:
        if pos in (7, 15) and block in (1, 3, 4):
            line(hit, (75, 72, 68), (2.78, 3.27, 3.78), (0.,)*3, .19, 'tom')
        return
    if pos % 2 == 0:
        pitches = (79, 76, 72, 67, 61)
        offsets = ((.27, .53, .78, 1.27, 1.78), (.53, .79, 1.28, 2.04, 2.79),
                   (.77, 1.28, 2.03, 2.78, 3.53))[pos // 4 % 3]
        hands = (('hat',)*4 + ('rim',), ('rim',)*5, ('hat', 'rim', 'ghost'),
                 ('tom',)*5, ('rim', 'ghost', 'tom', 'rim', 'tom'),
                 ('hat', 'rim', 'rim', 'tom', 'tom'))[block]
        for i, voice in enumerate(hands):
            note = pitches[i] if voice in ('rim', 'tom') else (i + pos) % 4
            hit(offsets[i], voice, (.21 - .014 * i) * level, note, pan=.31 - i * .13)
    elif block != 2:
        hit(2.78, 'ghost', .135, pos % 4, pan=-.12)
        if block == 3 or (pos == 13 and block == 5):
            hit(3.55, 'tom', .21, 61, pan=-.20)


def conveyor(bar, hit):
    block, pos = divmod(bar, 16)
    hit(2.02, 'snare', (.67, .61, .49, .64, .56, .66)[block], pos % 4, pan=.025)
    hit(0, 'kick', .65 if block != 2 else .46)
    if pos % 4 == 3 and block in (0, 3, 5):
        hit(3.28, 'kick', .42)
    for j in range(8):
        if j % 2 and (block in (1, 2, 4) or pos % 3):
            continue
        hit(j / 2 + (.025 if j % 2 else 0), 'hat', .073 if j % 2 == 0 else .042,
            (j + pos) % 4, pan=-.20)
    cell = pos % 4
    if cell == 0:
        line(hit, (33, 31, 29), (0, 1.52, 3.27), (.81, .65, .47), .70, 'sub')
    elif cell == 1:
        line(hit, (28, 25), (.77, 2.78), (.57, 2.75 if block in (1, 2, 4) else .93), .68, 'sub')
    elif cell == 2:
        if block not in (1, 2, 4):
            hit(.28, 'sub', .73, 25, 2.83)
        if block in (1, 4):
            line(hit, (64, 61), (.77, 2.52), (.50, 1.32), .19)
    elif block != 2:
        hit(.5 if block != 3 else 1.26, 'sub', .64, 26, 1.65)
        if pos % 8 == 7:
            hit(3.51, 'rim', .17, 76, pan=.3)
    if block == 3 and pos % 4 == 1:
        hit(1.76, 'ghost', .155, 2, pan=-.14)
    if block == 4 and pos % 8 == 4:
        hit(1.53, 'tine', .15, 65, 3.0, pan=.21)


def render(name, masters):
    blocks = FORM[name]
    bars = len(blocks) * 16
    events = []
    compose = {'menu': menu, 'options': options, 'conveyor': conveyor}[name]
    for bar in range(bars):
        compose(bar, place(bar, events))
    # Carry ringing voices across the return. The first downbeat has a real preceding bar.
    lead = 8
    preroll = [replace(e, beat=e.beat - (bars * 4 - lead))
               for e in events if e.beat >= bars * 4 - lead]
    padded = perform(preroll + [replace(e, beat=e.beat + lead) for e in events],
                     TEMPO, bars=bars + 2, ending_fade=False)
    first = round(lead * 60 / TEMPO * SR)
    audio = padded[first:]
    frames = len(audio)  # The pre-roll and end are rounded on the same sample timeline.
    master = masters / f'{name}.wav'
    wav(master, audio)
    levels = meter(master)
    gain = min(-17 - levels['lufs'], -2 - levels['dBTP'])
    audio *= 10 ** (gain / 20)
    wav(master, audio)
    export = OUT / f'{name}.mp3'
    ffmpeg('-i', master, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-q:a', '5', export)
    levels = meter(export)
    if levels['dBTP'] > -1:
        raise ValueError(f'{name} peak exceeds review target')
    return {'theme':name, 'file':export.name, 'bars':bars, 'frames':frames,
            'durationSeconds':frames / SR, 'blocks':list(blocks), 'sha256':kit.digest(export),
            'masterSha256':kit.digest(master), 'meter':levels}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--masters', required=True, type=Path)
    args = parser.parse_args()
    args.masters.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    record = {'version':'long-form-01', 'tempo':TEMPO, 'sampleRate':SR, 'meter':'4/4',
              'providerRequests':0, 'costUSD':0, 'source':'original local synthesis',
              'tracks':[render(name, args.masters) for name in FORM]}
    (OUT / 'session.json').write_text(json.dumps(record, indent=2) + '\n')
