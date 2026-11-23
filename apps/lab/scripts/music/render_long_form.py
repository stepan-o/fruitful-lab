"""Render three dedicated, cyclical local score studies. No provider or game inputs."""
import argparse
from dataclasses import replace
from pathlib import Path
import json

from render_session_02 import DESCENT, SR, Hit, ffmpeg, kit, meter, perform, wav

TEMPO = 164
OUT = kit.PUBLIC / 'long-form'
# Menu and Conveyor use sixteen-bar blocks. Options changes its groove every eight.
FORM = {
    'menu': ('Statement, repeat, stretch, landing', 'Higher turn and landing', 'Dry drum feature',
             'Theme return and exchange', 'Bass feature, rebuild and landing'),
    'options': ('Menu pocket', 'Snare doubles', 'Low tom in half-time', 'Trade and return'),
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


CALL = (0, .25, .50, .75, 1)
LENGTHS = (.21, .21, .21, .21, 2.05)


def menu_groove(bar, hit, solo=False, light=False):
    # The same foot pattern grounds both the syncopated bass and the hands.
    hit(0, 'foot', .84)
    hit(2.5, 'foot', .62)
    for beat in (1, 3):
        hit(beat, 'snare', .66 if beat == 3 else .59, (bar + int(beat)) % 4, pan=.06)
    if solo:
        return  # The feature scores its own cymbal and pedal marks.
    for i in range(0, 8, 2 if light else 1):
        hit(i * .5, 'hat', (.135, .054, .085, .074)[i % 4], (i + bar) % 4, pan=-.24)
    if bar % 4 in (1, 3):
        hit(1.76, 'ghost', .17, bar % 4, pan=-.12)
    if bar % 8 == 7:
        if bar != 31 and not light:
            hit(3.50, 'open', .15, pan=.23)
        hit(3.76, 'ghost', .23, 2, pan=.1)


# Each stroke is a hand assignment. Kick and backbeat continue underneath.
# The empty space between figures is part of the break, especially before each run.
DRUM_SENTENCES = (
    ((.25, 'stick', 78, .47), (.5, 'stick', 74, .33), (.75, 'tom', 69, .50), (1, 'tom', 62, .52)),
    ((1.5, 'tom', 65, .45), (2.25, 'stick', 75, .38), (3.5, 'tom', 59, .55)),
    ((.5, 'stick', 77, .47), (1.75, 'ghost', 1, .28), (2.25, 'stick', 74, .45)),
    ((.75, 'tom', 69, .45), (2, 'tom', 65, .50), (2.75, 'tom', 59, .55)),
    ((0, 'stick', 76, .50), (.75, 'snare', 1, .32), (2.25, 'stick', 73, .48)),
    ((.5, 'ghost', 2, .25), (1.75, 'snare', 3, .38), (2, 'stick', 76, .46), (3.5, 'tom', 63, .48)),
    ((.25, 'stick', 77, .43), (.5, 'stick', 74, .34), (.75, 'tom', 68, .46), (1, 'tom', 61, .52)),
    ((.5, 'stick', 76, .43), (1.5, 'tom', 64, .45)),  # Leave the last beat for the snare roll.
    ((0, 'tom', 59, .42), (1.5, 'tom', 70, .51), (2.75, 'tom', 61, .58)),
    ((.75, 'tom', 66, .46), (2, 'tom', 60, .57), (3.5, 'stick', 74, .36)),
    ((.25, 'tom', 71, .52), (.5, 'tom', 68, .42), (.75, 'tom', 64, .46), (1, 'tom', 60, .56)),
    ((1.75, 'stick', 73, .42), (2.75, 'tom', 61, .55)),
    ((.5, 'stick', 76, .46), (1.5, 'tom', 65, .49), (2.75, 'snare', 2, .44)),
    ((.75, 'snare', 1, .40), (1.75, 'stick', 75, .41), (2, 'tom', 67, .47), (3.5, 'tom', 60, .53)),
    ((.25, 'stick', 77, .46), (.5, 'stick', 73, .38), (.75, 'tom', 66, .49), (1, 'tom', 59, .57)),
    ((.5, 'tom', 63, .50), (1.5, 'stick', 75, .45)),  # Leave two beats for the triplets.
)


def menu_drum_feature(pos, hit):
    for i, (at, voice, note, gain) in enumerate(DRUM_SENTENCES[pos]):
        hit(at, voice, gain, note, pan=(-.15, .16, .04, .20)[i % 4])
    if pos in (1, 9):
        hit(2, 'hat', .065, 1, pan=-.21)  # A single closed pedal mark.
    if pos == 7:
        # Eight 32nds. The regular backbeat supplies stroke one. Alternate
        # snare wires and rim, accenting the end of each double.
        for i, gain in enumerate((.25, .34, .43, .28, .43, .50, .54), start=1):
            voice = 'stick' if i in (3, 7) else 'roll'
            hit(3 + i / 8, voice, gain, 73 if voice == 'stick' else i % 4,
                pan=.15 if i % 2 else -.12)
    elif pos == 15:
        # Six strokes to a beat, across two beats. Beat four belongs to the
        # backbeat. The last low tom clears the downbeat for the lead.
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
    # After the reprise, the two voices take turns with the E to C-sharp tag.
    'exchange': (
        ('Dm6/9', ((1.5, 64, .63, .39), (2.5, 61, 1.15, .42))),
        ('Dm6/9', ((.5, 62, 1.32, .39), (2.25, 65, .57, .35), (3, 64, .78, .38))),
        ('Gm9', ((0, 69, 1.60, .42), (2.5, 67, .86, .35))),
        ('Gm9', ((1, 65, .90, .39), (2.5, 62, .76, .36))),
    ),
    'side_step': (
        ('Bbmaj9', ((0, 65, 1.70, .43), (2.75, 69, .72, .40))),
        ('Bbmaj9', ((.5, 72, 1.45, .44), (2.5, 70, .68, .39), (3.5, 69, .40, .36))),
        ('Gm9', ((0, 67, 2.25, .40),)),
        ('Gm9', ((.75, 65, .75, .36), (2, 62, 1.22, .39))),
    ),
    'low_turn': (
        ('Dm9', ((.5, 65, .70, .39), (1.5, 64, 1.70, .40))),
        ('Dm9', ((2, 60, 1.40, .36),)),
        ('A7b9', ((0, 61, 1.40, .42), (2.5, 64, .70, .35))),
        ('A7b9', ((0, 57, 2.15, .38),)),
    ),
    # This four-bar phrase is performed by the solo bass two octaves below score pitch.
    'bass_turn': (
        ('Dm6/9', ((0, 62, 1.05, .52), (1.75, 69, .55, .41), (2.5, 65, .85, .48))),
        ('Dm6/9', ((.5, 64, 1.00, .48), (2, 61, 1.45, .46))),
        ('Gm9', ((0, 67, .65, .52), (1, 65, .63, .45), (2.5, 62, 1.10, .48))),
        ('A7b9', ((0, 57, 1.70, .51), (2.75, 61, .65, .39))),
    ),
    'rebuild': (
        ('Dm6/9', ((2, 64, 1.25, .39),)),
        ('Dm6/9', ((.5, 65, 1.10, .37), (2.5, 69, .92, .42))),
        ('Bbmaj9', ((0, 70, 2.30, .43),)),
        ('Bbmaj9', ((1.5, 69, .65, .37), (2.5, 65, 1.08, .41))),
    ),
    'high_answer': (
        ('Gm9', ((.5, 67, .92, .37), (2, 69, .68, .41), (3, 70, .71, .40))),
        ('Gm9', ((0, 74, 1.65, .44), (2.25, 72, .58, .36), (3, 69, .70, .40))),
        ('Bbmaj9', ((0, 70, 1.65, .42), (2.5, 69, .81, .36))),
        ('Bbmaj9', ((0, 65, 2.60, .41),)),
    ),
}
MENU_VOICINGS = {
    'Dm6/9': (38, (53, 57, 59, 64)), 'Dm(add9)': (38, (53, 57, 64)),
    'Dm9': (38, (53, 57, 60, 64)), 'Gm9': (43, (53, 57, 58, 62)),
    'Bbmaj9': (34, (53, 57, 60, 62)), 'A7b9': (33, (52, 55, 58, 61)),
}
# First half preserves the approved melodic sequence. After the drum feature the
# band plays the theme once, then develops its tag and a solo-bass paraphrase.
MENU_FORM = (
    ('theme', 'theme', 'stretch', 'cadence'),
    ('theme', 'theme', 'lift', 'cadence'),
    (),  # Bars 33–48 are percussion only.
    ('theme', 'exchange', 'side_step', 'low_turn'),
    ('bass_turn', 'rebuild', 'high_answer', 'cadence'),
)


def menu(bar, hit):
    block, pos = divmod(bar, 16)
    if block == 2:
        menu_groove(bar, hit, solo=True)
        menu_drum_feature(pos, hit)
        return

    phrase_index, measure = divmod(pos, 4)
    name = MENU_FORM[block][phrase_index]
    phrase = MENU_PHRASES[name]
    harmony, melody = phrase[measure]
    root, chord = MENU_VOICINGS[harmony]
    if name == 'bass_turn':
        for at, note, duration, gain in melody:
            hit(at, 'bass', gain * 1.22, note - 24, duration)
        return

    menu_groove(bar, hit, light=name == 'rebuild')
    reed = name in ('stretch', 'lift', 'side_step', 'low_turn', 'rebuild')
    if name == 'exchange':
        reed = measure % 2 == 1
    voice = 'reply' if reed else 'signal'
    for at, note, duration, gain in melody:
        hit(at, voice, gain, note, duration, .06 if voice == 'reply' else -.03)
    landing = name == 'cadence' and measure == 3
    hit(0 if landing else .125, 'bass', .60, root, 1.70 if landing else 1.06)
    if name == 'rebuild':
        if measure % 2:
            hit(3, 'bass', .39, root + 7, .66)
    else:
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


# The first call quotes the approved Menu break. The following bars are written
# as answers with rests between them. Each tuple is beat, voice, note and gain.
OPTIONS_HANDS = (
    # Bars 1–8. Closed sidestick into descending shells, grounded in the Menu two-step.
    DRUM_SENTENCES[0],
    ((.75, 'ghost', 1, .21), (1.5, 'stick', 70, .35), (3.5, 'tom', 60, .42)),
    ((.25, 'stick', 77, .38), (.50, 'stick', 73, .29), (.75, 'tom', 66, .40)),
    ((1.75, 'ghost', 2, .22), (2.75, 'tom', 61, .40)),
    ((.5, 'stick', 74, .37), (1.75, 'stick', 70, .31), (2.25, 'ghost', 0, .20)),
    ((.75, 'tom', 67, .39), (2, 'tom', 63, .42), (3.5, 'stick', 72, .36)),
    ((.25, 'stick', 75, .35), (.75, 'tom', 66, .38), (1, 'tom', 61, .43)),
    ((1.75, 'ghost', 1, .22), (2.75, 'stick', 71, .33), (3.75, 'ghost', 3, .25)),
    # Bars 9–16. The stick takes the fourth beat as the other hand plays snare doubles.
    ((.75, 'ghost', 0, .19), (.875, 'roll', 1, .27), (2.25, 'stick', 75, .37)),
    ((.5, 'stick', 76, .37), (1.75, 'ghost', 2, .22), (3.5, 'snare', 1, .36)),
    ((.75, 'ghost', 3, .22), (.875, 'roll', 0, .30), (2, 'tom', 62, .43)),
    ((.5, 'tom', 66, .38), (2.75, 'ghost', 0, .23), (2.875, 'roll', 2, .29)),
    ((.25, 'stick', 77, .38), (.50, 'roll', 1, .30), (.75, 'roll', 3, .35)),
    ((1.5, 'stick', 74, .38), (2.25, 'snare', 1, .39), (3.5, 'tom', 61, .41)),
    ((.5, 'tom', 65, .38), (1.75, 'ghost', 2, .23)),
    ((.75, 'stick', 74, .36), (2, 'tom', 60, .41)),
    # Bars 17–24. A half-time snare leaves room for the low tom to answer.
    ((.25, 'tom', 70, .39), (.50, 'tom', 66, .35), (.75, 'tom', 62, .41), (1, 'tom', 58, .45)),
    ((1.5, 'stick', 70, .30),),
    ((.5, 'tom', 64, .42), (1.75, 'ghost', 0, .20), (3.5, 'tom', 58, .44)),
    ((.75, 'stick', 74, .32), (2.75, 'tom', 61, .40)),
    ((0, 'tom', 67, .42), (1.5, 'tom', 63, .38), (3, 'tom', 59, .43)),
    ((1.75, 'ghost', 1, .22), (3.5, 'stick', 71, .32)),
    ((.25, 'tom', 69, .38), (.75, 'tom', 64, .40), (1.5, 'tom', 60, .42)),
    ((2.5, 'stick', 73, .34), (3.25, 'ghost', 0, .23), (3.75, 'roll', 2, .31)),
    # Bars 25–32. Trade the opening figure between hands, then clear a beat at the join.
    ((.25, 'stick', 77, .39), (.50, 'roll', 1, .31), (.75, 'tom', 66, .43), (1, 'tom', 61, .44)),
    ((1.5, 'ghost', 2, .22), (1.75, 'stick', 72, .35), (3.5, 'tom', 60, .40)),
    ((.5, 'stick', 75, .37), (1.75, 'snare', 3, .36), (2.75, 'tom', 64, .41)),
    ((.75, 'ghost', 0, .23), (2.25, 'stick', 73, .36), (3.5, 'roll', 1, .30)),
    ((.25, 'tom', 68, .42), (.50, 'stick', 73, .31), (.75, 'tom', 63, .41)),
    ((.5, 'stick', 75, .35), (1.75, 'ghost', 1, .25), (2.75, 'tom', 61, .42)),
    ((.75, 'tom', 65, .39), (1.5, 'stick', 72, .33)),
    ((.5, 'tom', 59, .43),),
)


def options(bar, hit):
    section, pos = divmod(bar, 8)
    if section in (0, 3):
        menu_groove(bar, hit, solo=True)
    elif section == 1:
        hit(0, 'foot', .80)
        hit(2.5 if pos % 2 == 0 else 1.75, 'foot', .52)
        hit(1, 'snare', .55, pos % 4, pan=.06)
        hit(3, 'stick', .50, 70, pan=-.08)
    else:
        hit(0, 'foot', .76)
        if pos % 2:
            hit(2.5, 'foot', .45)
        hit(2, 'snare', .54, pos % 4, pan=.06)

    for at, voice, note, gain in OPTIONS_HANDS[bar]:
        pan = -.16 if voice == 'stick' else .12 if voice == 'tom' else .03
        hit(at, voice, gain, note, pan=pan)
    if bar in (1, 5, 10, 17, 21, 27):
        hit(.5, 'hat', .085, bar % 4, pan=-.20)
    if bar == 15:
        # Beat four has a side-stick downstroke. Six alternating wire strokes
        # answer it on the last three quarters of the beat.
        for i, gain in enumerate((.22, .27, .33, .24, .31, .38)):
            hit(3.25 + i / 8, 'roll', gain, i % 4, pan=(-.10, .09)[i % 2])
    if bar == 30:
        # The backbeat starts the sextuplet. Five more strokes walk down the kit.
        for i, (voice, note, gain) in enumerate((('roll', 0, .29), ('tom', 70, .43),
                ('roll', 2, .34), ('tom', 64, .46), ('tom', 59, .52)), start=1):
            hit(3 + i / 6, voice, gain, note, pan=-.17 + .06 * i)


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
    block_bars = 8 if name == 'options' else 16
    bars = len(blocks) * block_bars
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
    track = {'theme': name, 'file': export.name, 'bars': bars, 'frames': frames,
             'durationSeconds': frames / SR, 'blocks': list(blocks), 'sha256': kit.digest(export),
             'masterSha256': kit.digest(master), 'meter': levels}
    if name == 'menu':
        track['studyId'] = 'LF-MUS-LONG-06-MENU'
    elif name == 'options':
        track['studyId'] = 'LF-MUS-LONG-02-OPTIONS'
        track['blockBars'] = block_bars
    if name == 'conveyor':
        track.update(studyId='LF-MUS-LONG-01-CONVEYOR', currentRoom='security', reassigned='2026-11-22')
    return track


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--masters', required=True, type=Path)
    scope = parser.add_mutually_exclusive_group()
    scope.add_argument('--only', choices=FORM, help='Replace one theme and retain the other exports.')
    scope.add_argument('--menu-only', action='store_const', dest='only', const='menu',
                       help='Replace the Menu recording and retain the other measured exports.')
    args = parser.parse_args()
    args.masters.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = OUT / 'session.json'
    if args.only:
        record = json.loads(manifest.read_text())
        record['tracks'] = [render(args.only, args.masters) if track['theme'] == args.only else track
                            for track in record['tracks']]
    else:
        record = {'version':'long-form-01', 'tempo':TEMPO, 'sampleRate':SR, 'meter':'4/4',
              'providerRequests':0, 'costUSD':0, 'source':'original local synthesis',
              'tracks':[render(name, args.masters) for name in FORM]}
    manifest.write_text(json.dumps(record, indent=2) + '\n')
