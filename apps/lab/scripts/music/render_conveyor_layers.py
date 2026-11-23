"""Render the Conveyor's three aligned 32-bar arrangements plus its listening take.

Run after render_day_two.py, or use the checked-in first take as the opening.
python render_conveyor_layers.py --masters /path/to/masters
"""
import argparse
import json
from functools import lru_cache
from pathlib import Path

import numpy as np

import render_day_two as session
from render_day_two import BAR, BEAT, PUBLIC, SR, OPTIONS_HANDS, battery, clip, decode, export, kit, meter, place, play_score, wav
from render_long_form import OPENING

NAMES = ('two', 'four', 'full')
FIRST = '7bdbfabdbfd07a4b0b67dbacc4fac8ff8575d923b8ef2da56be46b53c33c3603'
original_bass = session.bass


@lru_cache(maxsize=256)
def line_bass(voice, note, beats):
    if voice == 'pedal':
        return original_bass(voice, note, beats)
    t = kit.time_axis(beats * BEAT)
    p = kit.TAU * kit.frequency(note) * t
    if voice == 'growl':
        # Keep the opening reed/fundamental pairing at the sparse stage.
        return original_bass(voice, note, beats)
    # The pulse opens and closes around a fixed pitch. Reeds and drive live
    # above the fundamental so a phone and a subwoofer hear the same phrase.
    rate = 2 if voice == 'bite' else 1
    jaw = (.5 + .5 * np.cos(kit.TAU * rate * t / BEAT)) ** 2
    transient = np.exp(-t / .085)
    mid = np.sin(2*p + (.8 + 2.4*jaw + transient) * np.sin(p))
    edge = np.sin(4*p + (1.4 + jaw) * np.sin(2*p))
    sound = .53*np.sin(p) + .49*np.tanh(1.9*mid + (.19 + .24*jaw)*edge)
    return kit.soften(sound, .005, min(.048, t[-1]*.28))


def score(level):
    events = []
    # Each eight-bar sentence states the call, gives its last two notes room,
    # then turns the bass back towards D. No pitched line takes over the lead.
    for bar in range(32):
        hit = place(bar, events)
        sentence, m = divmod(bar, 8)
        solo = bar == 15 or (bar == 30 and level > 0)
        battery(bar, 0, 0, hit)
        if solo:
            hands = OPTIONS_HANDS[7 if bar == 15 else 23]
            for t, voice, note, gain in hands:
                hit(t, voice, 1.18*gain, note, pan=-.21 if voice == 'stick' else .19)
            for t, note, gain in ((.75,64,.45),(1.5,60,.52),(2.75,57,.50),(3.5,53,.59)):
                hit(t, 'tom', gain, note, pan=.17-.06*(t-1))
            continue
        if level and bar % 2:
            hit(1.5 if sentence % 2 == 0 else 1.75, 'foot', .46)
            hit(3.26, 'ghost', .19, 2, pan=-.12)
        if level == 2 and m in (3,4,5):
            hit(1.012, 'snare', .51, 2, pan=-.07)
            hit(3.016, 'snare', .49, 1, pan=.07)
            for t in (.75, 2.75, 3.75):
                hit(t+.021, 'hat', .105, 2, pan=.29)
        pedal_len = (3.48,1.44,2.8,.86)[m%4]
        hit(0, 'pedal', (.42,.46,.45)[level], 26, pedal_len)
        if level and m in (2,3,6):
            hit(2.52, 'pedal', .38, 26, .87 if level == 1 else 1.21)
        def note(t, pitch, length, accent=1):
            hit(t, 'growl' if level == 0 else 'bite', .77*accent, pitch, length, -.035)
            if level == 2 and pitch >= 37:
                hit(t+.012, 'growl', .32*accent, pitch-12, length*.91, .04)
        if m in (0,4):
            # The opening's exact five pitches and attack pattern are the hook.
            for t, pitch, length, gain in OPENING:
                note(t, pitch-24, length*(.79 if m==4 and sentence in (1,2) else 1), gain/.5)
        elif m in (1,5):
            note(.5 if sentence in (1,3) else 1, 40, .69, .88)
            note(2, 37, 1.63 if m==1 else .94, 1)
            if level and m==5:
                note(3.43, 37, .38, .72)
        elif m in (2,6):
            # The low register answers the same F–E–C-sharp turn.
            for t, pitch, dur in ((0,41,.81),(1.50,40,.61),(2.5,37,1.22)):
                note(t, pitch-(12 if sentence in (1,2) and m==6 else 0), dur, .92)
        elif m==3:
            note(.25, 38, 1.27, .91)
            if sentence % 2:
                note(2.72, 26, .80, .83)
        else:
            # The drummer owns the space after the cadence. A two-stroke
            # octave break happens only once in the full-line pass.
            if bar == 23 and level == 2:
                note(2.5,45,.32,.82)
                note(3,50,.36,.73)
            else:
                note(0,37,1.34,.92)
            hit(3.25,'roll',.29,1,pan=-.16)
            hit(3.75,'tom',.40,56,pan=.13)
    return events


def render(masters):
    masters.mkdir(parents=True, exist_ok=True)
    parent = PUBLIC / 'conveyor-day-two.mp3'
    if kit.digest(parent) != FIRST:
        raise ValueError('Conveyor opening source digest mismatch')
    opening = clip(decode(parent),0,16)
    parts = [opening]
    levels = {}
    start = len(opening)
    session.bass = line_bass
    for idx, name in enumerate(NAMES):
        audio = play_score(score(idx),32)
        master = masters / ('conveyor-'+name+'.wav')
        wav(master,audio)
        measured = meter(master)
        audio *= 10**(min(-17 - measured['lufs'], -1.9 - measured['dBTP'])/20)
        wav(master,audio)
        parts.append(audio)
        levels[name] = dict(frames=[start,start+len(audio)],bars=32,**meter(master))
        start += len(audio)
    master = masters / 'conveyor-line-02.wav'
    wav(master,np.concatenate(parts))
    track = dict(id='LF-MUS-CONVEYOR-LINE-02',file='conveyor-line-02.mp3',bars=112,
                 loopFrames=levels['two']['frames'], openingFrames=[0,len(opening)],
                 openingParent='LF-MUS-D2-CONVEYOR-01', openingParentSha256=FIRST,
                 layers=levels,**export(PUBLIC/'conveyor-line-02.mp3',master))
    (masters/'conveyor-track.json').write_text(json.dumps(track,indent=2)+'\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--masters',type=Path,required=True)
    render(parser.parse_args().masters)
