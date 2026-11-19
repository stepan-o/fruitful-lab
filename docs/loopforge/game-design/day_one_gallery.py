"""Publish the approved delivery bytes and render the Day One gallery."""
import hashlib
import json
import shutil
import subprocess
from pathlib import Path
from string import Template
from zipfile import ZipFile

REVISION = "08c8db112ce08c5236e721f30dd534488d8f5472"
PUBLIC_DIR = Path("day-one-calibration") / REVISION[:8]
PACKS = {
    "01-style-B.zip": (
        None, ("proofs/native/B-security.png", "proofs/native/B-forge.png")),
    "02-morning-walk.zip": (
        ("manifest.json", "files"),
        ("proofs/morning-1280x720-speech.mp4", "proofs/morning-inspection-speech.mp4")),
    "03-fourth-id-check.zip": (
        ("file-manifest.json", "files"),
        ("review/fourth-id-check-1280x720-lit.mp4", "review/fourth-key-1280.png")),
    "04-jammed-press.zip": (
        ("verification.json", "fullDecodeChecks"),
        ("proofs/forge-room-1280x720-lit-1x.mp4", "proofs/forge-contact-inspection-lit-1x.mp4")),
}
# Labels, output dimensions and poster times refer to the delivered cuts.
PLAYERS = {
    "reel": ("Loopforge-Day-One-Screening.mp4", "Day One screening reel", 1280, 720, 0),
    "walk": ("morning-1280x720-speech.mp4", "Morning walk, room view", 1280, 720, 1),
    "gait": ("morning-inspection-speech.mp4", "Morning walk, gait and expression inspection", 1120, 620, 1),
    "press": ("forge-room-1280x720-lit-1x.mp4", "Jammed press, room view", 1280, 720, 7.6),
    "contact": ("forge-contact-inspection-lit-1x.mp4", "Jammed press, palm-contact inspection", 960, 640, 7.6),
    "check": ("fourth-id-check-1280x720-lit.mp4", "Fourth ID check, room view", 1280, 720, 8),
}


def verify(data, record, name):
    if hashlib.sha256(data).hexdigest() != record["sha256"] or len(data) != record.get("bytes", len(data)):
        raise ValueError(f"Delivery hash or size mismatch: {name}")


def build_gallery(root, out):
    source = root.parent / "production/day-one-sprite-calibration"
    register = json.loads((source / "calibration-index.json").read_text())
    dest = out / PUBLIC_DIR
    dest.mkdir(parents=True, exist_ok=True)
    for lane in register["lanes"]:
        name = lane["archive"]
        verify((source / name).read_bytes(), lane, name)
        shutil.copyfile(source / name, dest / name)
        manifest, members = PACKS[name]
        with ZipFile(dest / name) as archive:
            records = {}
            if manifest:
                filename, key = manifest
                records = {r["path"]: r for r in json.loads(archive.read(filename))[key]}
            for member in members:
                # ZipFile also verifies the member CRC. The style register pins the whole pack.
                data = archive.read(member)
                if manifest:
                    verify(data, records[member], member)
                (dest / Path(member).name).write_bytes(data)

    reel = register["screening"]["path"]
    verify((source / reel).read_bytes(), register["screening"], reel)
    for name in [reel, "ENGINE-MASTER.md", "calibration-index.json"]:
        shutil.copyfile(source / name, dest / name)

    media = f"/loopforge-design/{PUBLIC_DIR}"
    players = {}
    for key, (file, label, width, height, second) in PLAYERS.items():
        poster = f"{key}-poster.webp"
        # Posters are still frames of this immutable release. A clean rebuild needs ffmpeg.
        if not (dest / poster).exists():
            subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", str(second), "-i", str(dest / file),
                            "-frames:v", "1", "-c:v", "libwebp", "-lossless", "1",
                            "-threads", "1", "-y", str(dest / poster)], check=True)
        players[key] = (f'<video controls playsinline preload="none" tabindex="0" aria-label="{label}" '
                        f'width="{width}" height="{height}" style="aspect-ratio:{width}/{height}" '
                        f'data-poster="{media}/{poster}" src="{media}/{file}">'
                        f'<a href="{media}/{file}">Open the {label} video</a></video>')
    return Template((root / "day-one-gallery.html").read_text()).substitute(
        media=media, revision=REVISION, **players)
