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
    'menu': ('Statement, repeat, stretch, landing', 'Higher turn and landing', 'Early return before the drums', 'Rim, rolls and toms',
             'Statement after the break', 'Higher turn', 'Bass states the theme', 'Landing into the loop'),
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
    if solo:
        return  # The feature scores its own cymbal and pedal marks.
    for i in range(8):
        hit(i * .5, 'hat', (.135, .054, .085, .074)[i % 4], (i + bar) % 4, pan=-.24)
    if bar % 4 in (1, 3):
        hit(1.76, 'ghost', .17, bar % 4, pan=-.12)
    if bar % 8 == 7:
        hit(3.50, 'open', .15, pan=.23)
        hit(3.76, 'ghost', .23, 2, pan=.1)


# Each stroke is a hand assignment. Kick and backbeat continue underneath.
# The empty space between figures is part of the break, especially before each run.
DRUM_SENTENCES = (
    ((.25, 'rim', 78, .47), (.5, 'rim', 74, .33), (.75, 'tom', 69, .50), (1, 'tom', 62, .52)),
    ((1.5, 'tom', 65, .45), (2.25, 'rim', 75, .38), (3.5, 'tom', 59, .55)),
    ((.5, 'rim', 77, .47), (1.75, 'ghost', 1, .28), (2.25, 'rim', 74, .45)),
    ((.75, 'tom', 69, .45), (2, 'tom', 65, .50), (2.75, 'tom', 59, .55), (3.5, 'bell', 0, .34)),
    ((0, 'rim', 76, .50), (.75, 'snare', 1, .32), (2.25, 'rim', 73, .48)),
    ((.5, 'ghost', 2, .25), (1.75, 'snare', 3, .38), (2, 'rim', 76, .46), (3.5, 'tom', 63, .48)),
    ((.25, 'rim', 77, .43), (.5, 'rim', 74, .34), (.75, 'tom', 68, .46), (1, 'tom', 61, .52)),
    ((.5, 'rim', 76, .43), (1.5, 'tom', 64, .45)),  # Leave the last beat for the snare roll.
    ((0, 'bell', 0, .33), (1.5, 'tom', 70, .51), (2.75, 'tom', 61, .58)),
    ((.75, 'tom', 66, .46), (2, 'tom', 60, .57), (3.5, 'rim', 74, .36)),
    ((.25, 'tom', 71, .52), (.5, 'tom', 68, .42), (.75, 'tom', 64, .46), (1, 'tom', 60, .56)),
    ((.5, 'bell', 0, .30), (1.75, 'rim', 73, .42), (2.75, 'tom', 61, .55)),
    ((.5, 'rim', 76, .46), (1.5, 'tom', 65, .49), (2.75, 'snare', 2, .44)),
    ((.75, 'snare', 1, .40), (1.75, 'rim', 75, .41), (2, 'tom', 67, .47), (3.5, 'tom', 60, .53)),
    ((.25, 'rim', 77, .46), (.5, 'rim', 73, .38), (.75, 'tom', 66, .49), (1, 'tom', 59, .57)),
    ((.5, 'tom', 63, .50), (1.5, 'rim', 75, .45)),  # Leave two beats for the triplets.
)


def menu_drum_feature(pos, hit):
    for i, (at, voice, note, gain) in enumerate(DRUM_SENTENCES[pos]):
        hit(at, voice, gain, note, pan=(-.15, .16, .04, .20)[i % 4])
    if pos in (0, 2, 4, 6, 12, 14):
        hit(2, 'hat', .095, 1, pan=-.21)  # A single closed pedal mark.
    if pos == 7:
        # Eight 32nds. The regular backbeat supplies stroke one. Alternate
        # snare wires and rim, accenting the end of each double.
        for i, gain in enumerate((.25, .34, .43, .28, .43, .50, .54), start=1):
            voice = 'rim' if i in (3, 7) else 'roll'
            hit(3 + i / 8, voice, gain, 73 if voice == 'rim' else i % 4,
                pan=.15 if i % 2 else -.12)
    elif pos == 15:
        # Six strokes to a beat, across two beats. Beat four belongs to the
        # backbeat. The final low tom launches the bell on the next downbeat.
        drums = (('tom', 72), ('tom', 69), ('roll', 1), ('tom', 67), ('tom', 65), ('roll', 2),
                 ('snare', 0), ('roll', 1), ('tom', 65), ('tom', 63), ('roll', 2), ('tom', 59))
        for i, (voice, note) in enumerate(drums):
            if i != 6:
                hit(2 + i / 6, voice, (.51, .34, .42)[i % 3] + i * .009, note,
                    pan=-.22 + .04 * i)


# Each four-bar phrase owns the foreground melody and the harmony below it.
# Entries give the local beat, MIDI pitch, sounding length and velocity.
OPENING = tuple(zip(CALL, DESCENT, LENGTHS, (.50, .48, .46, .44, .50), strict=True))
MENU_PHRASES = {
    'theme': (
        ('Dm6/9', OPENING),
        ('Dm6/9', ((2, 64, .90, .34),)),
        ('Dm(add9)', ((0, 61, 2.50, .40),)),
        ('Dm(add9)', ()),
    ),
    'stretch': (
        ('Dm9', ((0, 69, 1.35, .47), (1.5, 67, .75, .39), (2.5, 65, 1.15, .42))),
        ('Dm9', ((0, 64, 1.65, .41), (2.5, 65, .70, .35), (3.5, 67, .40, .39))),
        ('Gm9', ((0, 69, 2.45, .46), (3, 67, .85, .36))),
        ('Gm9', ((0, 65, 1.35, .41), (2, 64, 1.15, .34))),
    ),
    'lift': (
        ('Dm9', ((0, 69, 1.35, .47), (1.5, 67, .75, .39), (2.5, 65, 1.15, .42))),
        ('Dm9', ((0, 64, 1.65, .41), (2.5, 65, .70, .35), (3.5, 69, .40, .39))),
        ('Bbmaj9', ((0, 72, 2.35, .46), (3, 70, .75, .37))),
        ('Bbmaj9', ((0, 69, 1.40, .42), (2, 65, 1.25, .35))),
    ),
    'cadence': (
        ('Gm9', ((0, 69, 1.55, .44), (2, 67, 1.45, .39))),
        ('Gm9', ((0, 65, 2.70, .43),)),
        ('A7b9', ((0, 64, 2.85, .43),)),
        ('Dm6/9', ((0, 61, 2.75, .48),)),
    ),
}
MENU_VOICINGS = {
    'Dm6/9': (38, (53, 57, 59, 64)), 'Dm(add9)': (38, (53, 57, 64)),
    'Dm9': (38, (53, 57, 60, 64)), 'Gm9': (43, (53, 57, 58, 62)),
    'Bbmaj9': (34, (53, 57, 60, 62)), 'A7b9': (33, (52, 55, 58, 61)),
}
# The cadence always leads directly to the opening. Ahead of the drum solo,
# shorten the development so the pitched theme can return before the handoff.
MENU_FORM = (
    ('theme', 'theme', 'stretch', 'cadence'),
    ('theme', 'theme', 'lift', 'cadence'),
    ('theme', 'theme', 'cadence', 'theme'),
    (),  # Existing sixteen-bar percussion solo.
    ('theme', 'theme', 'stretch', 'cadence'),
    ('theme', 'theme', 'lift', 'cadence'),
    ('theme', 'theme', 'stretch', 'cadence'),
    ('theme', 'theme', 'lift', 'cadence'),
)


def menu(bar, hit):
    block, pos = divmod(bar, 16)
    if block == 3:
        menu_groove(bar, hit, solo=True)
        menu_drum_feature(pos, hit)
        return

    phrase_index, measure = divmod(pos, 4)
    name = MENU_FORM[block][phrase_index]
    phrase = MENU_PHRASES[name]
    harmony, melody = phrase[measure]
    root, chord = MENU_VOICINGS[harmony]
    if 96 <= bar < 100:
        # The first statement after the cadence is played by the bass alone.
        for at, note, duration, gain in melody:
            hit(at, 'bass', gain * 1.22, note - 24, duration)
        if measure == 3:
            hit(0, 'bass', .47, root, 1.35)
            hit(2.5, 'bass', .39, root + 7, .53)
        return

    menu_groove(bar, hit)
    if bar == 64:
        hit(0, 'bell', .38, pan=.24)
    voice = 'reply' if name in ('stretch', 'lift') else 'signal'
    for at, note, duration, gain in melody:
        hit(at, voice, gain, note, duration, .06 if voice == 'reply' else -.03)
    landing = name == 'cadence' and measure == 3
    hit(0 if landing else .125, 'bass', .60, root, 1.70 if landing else 1.06)
    hit(2.5, 'bass', .47, root + (7 if measure == 2 else 0), .54)
    if measure == 3 and not landing:
        hit(3.50, 'bass', .40, root + 5, .44)

    if measure % 2 == 0 or harmony != phrase[measure - 1][0]:
        next_harmony = phrase[(measure + 1) % 4][0]
        duration = 6.25 if measure < 3 and next_harmony == harmony else 3.65
        if landing:
            duration = 2.75  # Release the keys with the lead before the new downbeat.
        for i, note in enumerate(chord):
            hit(0, 'reedkeys', .135 if block != 4 else .115, note, duration, (i - (len(chord) - 1) / 2) * .17)


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
            track['studyId'] = 'LF-MUS-LONG-05-MENU'
    manifest.write_text(json.dumps(record, indent=2) + '\n')
