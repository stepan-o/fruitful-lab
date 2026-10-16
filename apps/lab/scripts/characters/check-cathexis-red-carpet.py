"""Guard the acting, centre crossing and already-approved Mirror clip.

Usage: python check-cathexis-red-carpet.py published.glb previous-approved.glb report.json
This supplements the separate triangle-contact audit and visual review.
"""
from pathlib import Path
import hashlib, json, sys
import numpy as np
from scipy.spatial.transform import Rotation as R
from cathexis_motion_math import context
from cathexis_drape import smooth

runtime, previous, output = map(Path, sys.argv[1:4])
d, old = context(runtime), context(previous)

def tracks(ctx, name):
    clip = next(c for c in ctx['g']['animations'] if c['name'] == name)
    return ctx['tracks'](clip)

def named(ctx, motion):
    return {(ctx['g']['nodes'][i]['name'], p): (t, v) for i, p, t, v in motion}

# Approved Mirror and the two review sources remain exactly as delivered.
for name in ['Mirror_Viewing_Corrected', 'Mirror_Viewing_Source', 'Red_Carpet_Walk_Source']:
    left, right = named(d, tracks(d, name)), named(old, tracks(old, name))
    assert left.keys() == right.keys()
    for key in left:
        assert all(np.array_equal(a, b) for a, b in zip(left[key], right[key])), (name, key)
# Same surface, UVs, textures and skin weights: changing just the clip cannot
# silently degrade Mirror's previously approved costume or hand contact.
for key in ['meshes', 'skins']:
    for new_item, old_item in zip(d['g'][key], old['g'][key]):
        if key == 'meshes':
            p, q = new_item['primitives'][0], old_item['primitives'][0]
            assert p['attributes'].keys() == q['attributes'].keys()
            for attr in p['attributes']:
                assert np.array_equal(d['acc'](p['attributes'][attr]), old['acc'](q['attributes'][attr])), attr
            assert np.array_equal(d['acc'](p['indices']), old['acc'](q['indices']))
        else:
            assert np.array_equal(d['acc'](new_item['inverseBindMatrices']), old['acc'](old_item['inverseBindMatrices']))

source = tracks(d, 'Red_Carpet_Walk_Source')
corrected = tracks(d, 'Red_Carpet_Walk_Corrected')
src, dst = named(d, source), named(d, corrected)
times = corrected[0][2]; ease = smooth((times - (times[-1] - .3)) / .3)
knees = []
for name in ['mixamorig:LeftLeg', 'mixamorig:RightLeg']:
    raw = src[name, 'rotation'][1]; actual = dst[name, 'rotation'][1]
    delta = R.from_quat(raw[0]) * R.from_quat(raw[-1]).inv()
    closed = R.from_rotvec(ease[:, None] * delta.as_rotvec()) * R.from_quat(raw)
    error = (closed.inv() * R.from_quat(actual)).magnitude()
    assert error.max() < 1e-6, 'Knee articulation must stay source; no per-frame bend-plane replacement'
    knees.append({'joint': name, 'maxSourceClosureErrorDeg': float(np.degrees(error).max())})
# Pelvis rotation, lateral/forward sway, upper-body acting and tempo remain source.
for (name, prop), (t, raw) in src.items():
    if name.endswith(('LeftUpLeg', 'RightUpLeg', 'LeftFoot', 'RightFoot')):
        continue
    actual = dst[name, prop][1]
    if prop == 'rotation':
        delta = R.from_quat(raw[0]) * R.from_quat(raw[-1]).inv()
        closed = R.from_rotvec(ease[:, None] * delta.as_rotvec()) * R.from_quat(raw)
        assert (closed.inv() * R.from_quat(actual)).magnitude().max() < 1e-6
    else:
        closed = raw + ease[:, None] * (raw[0] - raw[-1])
        axes = [0, 2] if name == 'mixamorig:Hips' and prop == 'translation' else [0, 1, 2]
        assert np.allclose(closed[:, axes], actual[:, axes], atol=1e-5)
    assert np.array_equal(t, dst[name, prop][0]), 'Original timing changed'

world = np.array([d['world_at'](corrected, t) for t in times])
node = {n['name']: i for i, n in enumerate(d['g']['nodes'])}
x = {side: world[:, node['mixamorig:' + side + 'Foot'], 0, 3] - world[:, node['mixamorig:Hips'], 0, 3] for side in ['Left', 'Right']}
left, right = float(-x['Left'].min()), float(x['Right'].max())
assert left > .02 and right > .02, 'Both feet must cross centre, not stay in separate lanes'
report = {'runtimeSHA256': hashlib.sha256(runtime.read_bytes()).hexdigest(), 'clip': 'Red_Carpet_Walk_Corrected', 'sourceKeys': len(times), 'leftCrossMaxM': left, 'rightCrossMaxM': right, 'kneeArticulation': knees, 'originalActingAndTempoPreserved': True, 'mirrorChannelsAndSkinIdentical': True, 'bothSourceClipsIdentical': True, 'method': 'Source-key joint curves. Preserve source articulation except shared final 0.3s closure; compare approved Mirror channels and surface/skin arrays exactly. Centre crossing is intentional and must not be rejected by a signed lane-gap test. Surface collision and visual acting acceptance are separate checks.'}
output.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
