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
    'menu': ('Call and first answer', 'Answers in conversation', 'Call and chord turn', 'Sixteen bars for the hands',
             'Hook returns', 'Upper and lower replies', 'Bass and reed exchange', 'Return'),
    'options': ('Hands on hats', 'Rim conversation', 'Hats and rests',
                'Low tom answer', 'Broken two-step', 'Pass it back'),
    'conveyor': ('Open weight', 'Long answer', 'Low current',
                 'Displaced accent', 'Upper echo', 'Return to weight'),
}


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


CALL = (0, .25, .50, .75, 1)
LENGTHS = (.21, .21, .21, .21, 2.05)


def menu_groove(bar, hit, solo=False):
    # The same foot pattern grounds both the syncopated bass and the hands.
    hit(0, 'foot', .84)
    hit(2.5, 'foot', .62)
    for beat in (1, 3):
        hit(beat, 'snare', .66 if beat == 3 else .59, (bar + int(beat)) % 4, pan=.06)
    for i in range(8):
        if solo and i in (3, 7):  # Leave these positions for the soloist's right hand.
            continue
        hit(i * .5, 'hat', (.135, .054, .085, .074)[i % 4], (i + bar) % 4, pan=-.24)
    if not solo and bar % 4 in (1, 3):
        hit(1.76, 'ghost', .17, bar % 4, pan=-.12)
    if not solo and bar % 8 == 7:
        hit(3.50, 'open', .15, pan=.23)
        hit(3.76, 'ghost', .23, 2, pan=.1)


def menu_drum_feature(pos, hit):
    # Four four-bar sentences. Within each, a call, two answers and a turnaround.
    section, measure = divmod(pos, 4)
    strokes = (
        ((.25, .5, .75), (1.5, 1.75, 2.25, 2.75), (.5, .75, 1.5), (2.75, 3.25, 3.5, 3.75)),
        ((.25, .5, .75), (1.5, 1.75, 1.875, 2.25), (.75, 1.5, 2.25, 2.75), (2.25, 2.75, 3.5, 3.625, 3.75)),
        ((.25, .5, .75), (.5, 1.5, 2.25), (.75, 1.25, 2.75, 3.5), (1.75, 2.25, 2.75, 3.25, 3.75)),
        ((.25, .5, .75), (.75, 1.5, 1.75, 2.75), (.5, 1.75, 2.25, 3.5), (2, 2.25, 2.5, 2.75, 3.5, 3.75)),
    )[section][measure]
    hands = (('rim', 'rim', 'tom', 'ghost'), ('ghost', 'snare', 'ghost', 'rim'),
             ('tom', 'tom', 'rim', 'open'), ('rim', 'ghost', 'tom', 'snare'))[section]
    for i, at in enumerate(strokes):
        voice = hands[(i + measure) % 4]
        note = (79, 74, 70, 65, 61, 57)[i] if voice in ('tom', 'rim') else (0 if voice == 'open' else i % 4)
        gain = (.42, .23, .34, .27, .37, .46)[i]
        hit(at, voice, gain, note, pan=(-.23, .18, -.08, .23)[i % 4])
    if measure == 0:
        # The bass drum supplies the first attack of the familiar five-hit rhythm.
        hit(1, 'tom', .43, 61, pan=.16)


# The complete opening marks large arrivals. Its answers start from the held C-sharp
# or the E above it. Each row is (beat within the phrase, MIDI note, length in beats).
MENU_CALL_BARS = (0, 32, 64, 112)
REPLIES = {
    'lift': ((.5, 61, .65), (1.5, 64, .85), (2.75, 65, .4), (3.5, 69, 1.6),
             (5.5, 67, .7), (6.5, 64, 1.7), (9, 62, 1.35)),
    'turn': ((0, 64, 1.45), (2, 67, .55), (2.75, 69, .75), (4, 72, 1.7),
             (6, 71, .55), (6.75, 69, .8), (8.5, 65, 1.2), (10, 64, 1.4)),
    'thread': ((1, 69, 1.6), (3.25, 67, .5), (4, 64, 1.8), (6.5, 67, .8),
               (8, 70, 1.65), (10.25, 69, .45), (11, 65, .75), (12, 64, 1.8)),
    'low': ((0, 57, 1.8), (2.5, 60, .75), (3.5, 62, 1.65), (5.75, 64, .65),
            (7, 67, 1.25), (9, 65, .65), (10, 62, 1.25)),
}
# The second statement of a reply can close on another scale degree, giving the
# next phrase a different point of departure. Placement is authored in zero-based bars.
MENU_ANSWERS = {
    4: ('lift', 62), 11: ('turn', 64),
    16: ('low', 64), 21: ('thread', 62), 27: ('lift', 69),
    36: ('turn', 67), 42: ('thread', 61),
    68: ('low', 62), 75: ('lift', 65),
    80: ('turn', 69), 85: ('thread', 67), 91: ('low', 61),
    100: ('lift', 62), 105: ('thread', 64),
    116: ('turn', 65), 123: ('low', 61),
}
# Bass root and the upper voices of each keys voicing, one chord per two bars.
MENU_VOICINGS = {
    'Dm9': (38, (53, 57, 60, 64)), 'Dm6/9': (38, (53, 57, 59, 64)),
    'C/D': (38, (52, 55, 60, 64)), 'G13': (43, (53, 57, 59, 64)),
    'Gm9': (43, (53, 57, 58, 62)), 'Bbmaj9': (34, (53, 57, 60, 62)),
    'A7b9': (33, (52, 55, 58, 61)),
}
MENU_CHANGES = (
    ('Dm9', 'Dm6/9', 'C/D', 'Dm6/9', 'Dm9', 'G13', 'Gm9', 'Dm6/9'),
    ('Dm9', 'C/D', 'Dm6/9', 'G13', 'Gm9', 'Bbmaj9', 'Gm9', 'A7b9'),
    ('Dm9', 'Dm6/9', 'Gm9', 'Bbmaj9', 'G13', 'Gm9', 'Dm6/9', 'A7b9'),
    (),  # Solo drums.
    ('Dm9', 'Dm6/9', 'C/D', 'Dm6/9', 'Dm9', 'C/D', 'Gm9', 'Dm6/9'),
    ('Dm9', 'G13', 'Gm9', 'Bbmaj9', 'Dm6/9', 'G13', 'Gm9', 'A7b9'),
    ('Dm9', 'Dm6/9', 'Dm9', 'C/D', 'Gm9', 'Bbmaj9', 'Gm9', 'A7b9'),
    ('Dm9', 'Dm6/9', 'C/D', 'Gm9', 'Dm9', 'G13', 'Dm6/9', 'A7b9'),
)


def menu(bar, hit):
    block, pos = divmod(bar, 16)
    if 96 <= bar < 100:
        # Four bars of answering bass. The rhythmic echo opens out after the E.
        solo = (
            ((45, 43, 40), (0, .5, 1.5), (.43, .77, 2.1)),
            ((38, 41, 45), (0, 1.5, 2.5), (.9, .65, 1.0)),
            ((43, 40, 37), (.5, 2, 3), (.85, .7, .8)),
            ((38, 45, 40, 37), (0, 1.5, 2.5, 3.5), (.9, .65, .65, .4)),
        )[pos]
        line(hit, *solo, .60, 'bass')
        return

    menu_groove(bar, hit, solo=block == 3)
    if block == 3:
        menu_drum_feature(pos, hit)
        return

    if bar in MENU_CALL_BARS:
        line(hit, DESCENT, CALL, LENGTHS, .50, 'signal')
    if bar in MENU_ANSWERS:
        name, landing = MENU_ANSWERS[bar]
        melody = REPLIES[name]
        for i, (at, note, duration) in enumerate(melody):
            last = i == len(melody) - 1
            level = .40 if i in (0, 3) or last else .34
            hit(at, 'reply', level, landing if last else note, duration, .09)

    root, chord = MENU_VOICINGS[MENU_CHANGES[block][pos // 2]]
    hit(.125, 'bass', .60, root, 1.06 if pos % 2 == 0 else .67)
    hit(2.5, 'bass', .47, root + (7 if pos % 4 == 2 else 0), .54)
    if pos % 4 == 3:
        hit(3.50, 'bass', .40, root + (7 if pos % 8 == 3 else 5), .44)

    # A single attack can carry across the barline. Two quieter beat-three
    # entries in each 16 bars leave room around the previous phrase's ending.
    if pos % 2 == 0:
        at = 2 if pos in (6, 12) else 0
        duration = (4.5 if at else 6.25) if block != 4 else 3.75
        for i, note in enumerate(chord):
            hit(at, 'reedkeys', .145 if block != 4 else .125, note, duration, (i - 1.5) * .17)


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
    parser.add_argument('--menu-only', action='store_true',
                        help='Replace the Menu recording and retain the other measured exports.')
    args = parser.parse_args()
    args.masters.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = OUT / 'session.json'
    if args.menu_only:
        record = json.loads(manifest.read_text())
        record['tracks'] = [render('menu', args.masters) if track['theme'] == 'menu' else track
                            for track in record['tracks']]
    else:
        record = {'version':'long-form-01', 'tempo':TEMPO, 'sampleRate':SR, 'meter':'4/4',
              'providerRequests':0, 'costUSD':0, 'source':'original local synthesis',
              'tracks':[render(name, args.masters) for name in FORM]}
    for track in record['tracks']:
        if track['theme'] == 'menu':
            track['studyId'] = 'LF-MUS-LONG-03-MENU'
    manifest.write_text(json.dumps(record, indent=2) + '\n')
