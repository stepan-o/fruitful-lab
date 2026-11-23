"""Rebuild the owner-supplied CC0 sound edits. Python stdlib + FFmpeg required.

Usage: python3 scripts/audio/crop-loopforge.py /path/to/original-downloads
Originals are read only. Only the named Loopforge source outputs are replaced.
The MP3s are committed build inputs; this script is not a deployment dependency.
"""

import array
import hashlib
import json
import math
import subprocess
import sys
from pathlib import Path

RATE = 44100
ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "assets/sources/loopforge-sfx"
SOURCES = {
    "metal": ("345080__metrostock99__fx-metal-clanking-on-concrete-501.wav", "metrostock99", "FX METAL CLANKING ON CONCRETE 501.wav", 345080),
    "gate": ("399449__celadon_noise__cemeterygate16.aiff", "celadon_noise", "cemeterygate16.aif", 399449),
    "starter": ("524908__engineer_815__starter_75hp.wav", "Engineer_815", "Starter_75hp.wav", 524908),
    "brake": ("818295__microman502__handbrake-engage-disengage.wav", "microman502", "Handbrake Engage, Disengage", 818295),
    "drone": ("748215__christmaskrumble666__punishment-sound.wav", "ChristmasKrumble666", "Punishment Sound", 748215),
}
# Keep real secondary contacts and the decay. Microfades avoid edit clicks;
# do not use a silence gate that chops resonance between mechanical contacts.
CUTS = [
    ("menu-clang", "metal", 0.604, 2.750, 0.002, 0.080, -3, "landing menu"),
    ("contactor", "starter", 1.023, 1.340, 0.002, 0.045, -3, "conveyor RESET / shift start"),
    ("ratchet-engage", "brake", 0.940, 1.160, 0.001, 0.025, -3, "first-shift commitment"),
    ("ratchet-release", "brake", 3.211, 3.940, 0.001, 0.045, -3, "first-shift shutdown"),
    ("gate-close-review", "gate", 0, 3.186508, 0.004, 0.100, -3, "unassigned audition only"),
    ("dark-room-review", "drone", 60, 86, 0, 0, -12, "unassigned audition loop only"),
]


def run(args, data=None):
    return subprocess.run(args, input=data, check=True, stdout=subprocess.PIPE).stdout


def pcm(data):
    result = array.array("f")
    result.frombytes(data)
    if sys.byteorder != "little":
        result.byteswap()
    return result


def le_bytes(samples):
    result = array.array("f", samples)
    if sys.byteorder != "little":
        result.byteswap()
    return result.tobytes()


def db(value):
    return round(20 * math.log10(max(value, 1e-10)), 2)


def sha(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def main():
    source_dir = Path(sys.argv[1])
    OUTPUT.mkdir(parents=True, exist_ok=True)
    inventory = {"license": "CC0-1.0", "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/", "verified": "2026-10-08", "sources": {}, "edits": []}
    for key, (filename, author, title, sound_id) in SOURCES.items():
        inventory["sources"][key] = {"filename": filename, "author": author, "title": title, "url": f"https://freesound.org/people/{author}/sounds/{sound_id}/", "sha256": sha(source_dir / filename)}
    for name, key, start, end, fade_in, fade_out, ceiling, use in CUTS:
        source = source_dir / SOURCES[key][0]
        loop = key == "drone"
        channels = 2 if loop else 1
        source_channels = int(run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=channels", "-of", "csv=p=0", str(source)]))
        filters = []
        if not loop and source_channels == 2:
            # Average, never sum the stereo pair: no +3 dB downmix overshoot.
            filters.append("pan=mono|c0=0.5*c0+0.5*c1")
        filters.append("highpass=f=30")
        raw = pcm(run(["ffmpeg", "-v", "error", "-ss", str(start), "-i", str(source), "-t", str(end-start), "-af", ",".join(filters), "-ac", str(channels), "-ar", str(RATE), "-f", "f32le", "pipe:1"]))
        if loop:
            # Rotate the loop: interior -> tail blended with head -> interior.
            # The seam is inside a 2-second equal-power crossfade, not a hard cut.
            n = 2 * RATE * channels
            blend = array.array("f")
            for i in range(n):
                u = (i // channels) / (n // channels - 1)
                blend.append(raw[-n+i] * math.cos(u*math.pi/2) + raw[i] * math.sin(u*math.pi/2))
            raw = raw[n:-n] + blend
        else:
            frames = len(raw) // channels
            for frame in range(frames):
                factor = min(1, frame / max(1, fade_in*RATE), (frames-1-frame) / max(1, fade_out*RATE))
                for c in range(channels):
                    raw[frame*channels+c] *= factor
        gain = 10**(ceiling/20) / max(abs(v) for v in raw)
        path = OUTPUT / (name + ".mp3")
        decoded = None
        for _ in range(3):
            run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(RATE), "-ac", str(channels), "-i", "pipe:0", "-map_metadata", "-1", "-c:a", "libmp3lame", "-b:a", "160k" if loop else "128k", str(path)], le_bytes(v * gain for v in raw))
            decoded = pcm(run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "pipe:1"]))
            peak = max(abs(v) for v in decoded)
            if peak <= 10**(-1/20):
                break
            gain *= 10**(-1.1/20) / peak
        assert decoded is not None
        peak = max(abs(v) for v in decoded)
        assert peak < 10**(-1/20), name + " exceeds decoded peak ceiling"
        window = RATE // 100 * channels
        entry = {"id": name, "source": key, "intervalSeconds": [start, end], "channels": channels, "highpassHz": 30, "fadeInMs": fade_in*1000, "fadeOutMs": fade_out*1000, "crossfadeMs": 2000 if loop else 0, "gainDb": db(gain), "use": use, "output": path.name, "sha256": sha(path), "bytes": path.stat().st_size, "decodedSeconds": round(len(decoded)/channels/RATE, 6), "decodedPeakDbfs": db(peak), "decodedRmsDbfs": db(math.sqrt(sum(v*v for v in decoded)/len(decoded))), "first10msPeakDbfs": db(max(abs(v) for v in decoded[:window])), "last10msPeakDbfs": db(max(abs(v) for v in decoded[-window:]))}
        inventory["edits"].append(entry)
        print(json.dumps(entry))
    (OUTPUT / "provenance.json").write_text(json.dumps(inventory, indent=2) + "\n")


if __name__ == "__main__":
    main()
