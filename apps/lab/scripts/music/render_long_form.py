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
    'menu': ('Switch on', 'Short reply', 'Pedal and turnaround', 'Sixteen bars for the hands',
             'Lean reprise', 'Full pocket', 'Bass call and answer', 'Return'),
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


# Rooted pedal chords. A moving inner voice supplies colour in a short stab.
MENU_CHORDS = ((53, 57, 64), (53, 59, 64), (55, 60, 65), (55, 61, 64))
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


def menu(bar, hit):
    block, pos = divmod(bar, 16)
    cell = pos % 8
    bass_only = block == 6 and pos < 4
    if not bass_only:
        menu_groove(bar, hit, solo=block == 3)
    if block == 3:
        menu_drum_feature(pos, hit)
        return

    # State the hook every eight bars. The four-bar bass feature plays it two octaves down.
    if cell == 0:
        if bass_only:
            line(hit, tuple(n - 24 for n in DESCENT), CALL, LENGTHS, .66, 'bass')
        else:
            line(hit, DESCENT, CALL, LENGTHS, .53, 'signal')
    elif cell == 4 and block in (1, 2, 4, 5, 6, 7):
        # The reply borrows the final two notes and leaves the next call clear.
        answer = (61, 64, 67, 69) if block in (1, 5, 7) else (61, 64, 67)
        n = len(answer)
        line(hit, answer, (.5, 1.25, 2.5, 3.25)[:n], (.38, .27, .47, .48)[:n], .31, 'signal')

    if bass_only:
        if pos:
            line(hit, (38, 45, (41, 40, 37)[pos - 1]), (0, 2.5, 3.25), (.85, .37, .42), .58, 'bass')
        return

    # D remains underneath the hook. A-G-D and the occasional A turnaround
    # put some answering motion in the bass without moving the kick.
    root = 38
    if block in (2, 5, 7) and cell in (5, 6, 7):
        root = (43, 38, 33)[cell - 5]
    hit(.125, 'bass', .60, root, 1.06 if cell % 2 == 0 else .67)
    hit(2.5, 'bass', .47, root + (7 if cell in (2, 6) else 0), .54)
    if cell in (3, 7):
        hit(3.50, 'bass', .42, root + (7 if cell == 3 else 5), .44)
    chord = MENU_CHORDS[(cell // 2 + (1 if block in (2, 5) else 0)) % 4]
    stabs = (.75, 2.75) if cell in (1, 5) else (1.5,) if cell % 2 == 0 else (2.75,)
    if block == 4 and cell % 2:
        return
    for at in stabs:
        for i, note in enumerate(chord):
            hit(at, 'chop', .21 if cell % 2 else .16, note, .44 if at == .75 else .29, (i - 1) * .16)


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
            track['studyId'] = 'LF-MUS-LONG-02-MENU'
    manifest.write_text(json.dumps(record, indent=2) + '\n')
