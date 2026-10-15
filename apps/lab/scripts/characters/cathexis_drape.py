"""Offline drape and hand contacts for the pinned CATHEXIS source rig.

All distances are metres in the neutral character frame. The source skeleton
uses centimetres (0.01 world scale). No geometry or runtime solver is added.
"""
import numpy as np
from scipy.spatial.transform import Rotation as R, Slerp
from scipy.ndimage import gaussian_filter1d, maximum_filter1d

HIP_PALM = np.array([.168, 1.035, .171, 1])
TEMPLE_PALM = np.array([-.100, 1.615, .105, 1])
PALM_FROM_WRIST = np.array([0, .080, 0])


def unit(v):
    return v / max(np.linalg.norm(v), 1e-10)


def swing(a, b):
    a, b = unit(a), unit(b)
    q = np.r_[np.cross(a, b), 1 + np.dot(a, b)]
    return R.from_quat(q / np.linalg.norm(q)) if np.linalg.norm(q) > 1e-8 else R.from_rotvec([np.pi, 0, 0])


def mix(a, b, t):
    return Slerp([0, 1], R.from_quat([a.as_quat(), b.as_quat()]))([np.clip(t, 0, 1)])[0]


def smooth(x):
    x = np.clip(x, 0, 1)
    return x * x * x * (10 + x * (-15 + 6 * x))


def refine_hands(d, tracks, times):
    """Two-bone IK preserves limb lengths and the source's forearm twist.

    Left palm follows the hip throughout Hot Walk. Right palm approaches the
    temple from 1.35–1.85s, holds until 4.5s, then releases by 5.1s. Only the
    shoulder/elbow/wrist rotation curves change; Happy Sway keeps its acting.
    """
    nodes = d['g']['nodes']
    parents = {child: i for i, node in enumerate(nodes) for child in node.get('children', [])}
    rotations = {i: values for i, kind, _, values in tracks if kind == 'rotation'}
    bind = d['world_at']([], 0)
    for k, t in enumerate(times):
        world = d['world_at'](tracks, t)
        hip = world[22] @ np.linalg.inv(bind[22])
        head = world[17] @ np.linalg.inv(bind[17])
        contacts = [
            (10, 9, 8, 1., hip @ HIP_PALM,
             hip[:3, :3] @ [-.12, -1, .06], hip @ [.42, 1.19, .07, 1]),
            (14, 13, 12, smooth((t - 1.35) / .5) * smooth((5.10 - t) / .6), head @ TEMPLE_PALM,
             head[:3, :3] @ [.08, 1, -.23], head @ [-.36, 1.42, .04, 1]),
        ]
        for upper, fore, hand, amount, anchor, fingers, pole in contacts:
            if amount < 1e-6:
                continue
            hand_rotation = R.from_matrix(world[hand, :3, :3] / .01)
            desired = swing(hand_rotation.apply([0, 1, 0]), unit(fingers)) * hand_rotation
            wrist_rotation = mix(hand_rotation, desired, amount)
            goal = anchor[:3] - desired.apply(PALM_FROM_WRIST)
            goal = world[hand, :3, 3] * (1 - amount) + goal * amount
            shoulder, elbow, wrist = [world[i, :3, 3] for i in (upper, fore, hand)]
            upper_length, fore_length = np.linalg.norm(elbow - shoulder), np.linalg.norm(wrist - elbow)
            distance = np.clip(np.linalg.norm(goal - shoulder), abs(upper_length - fore_length) + .001, upper_length + fore_length - .002)
            direction = unit(goal - shoulder)
            goal = shoulder + direction * distance
            bend = unit(pole[:3] - shoulder - direction * np.dot(pole[:3] - shoulder, direction))
            along = (upper_length ** 2 - fore_length ** 2 + distance ** 2) / (2 * distance)
            target_elbow = shoulder + direction * along + bend * np.sqrt(max(0, upper_length ** 2 - along ** 2))
            upper_rotation = swing(elbow - shoulder, target_elbow - shoulder) * R.from_matrix(world[upper, :3, :3] / .01)
            rotations[upper][k] = (R.from_matrix(world[parents[upper], :3, :3] / .01).inv() * upper_rotation).as_quat()
            world = d['world_at'](tracks, t)
            fore_rotation = swing(world[hand, :3, 3] - world[fore, :3, 3], goal - world[fore, :3, 3]) * R.from_matrix(world[fore, :3, :3] / .01)
            rotations[fore][k] = (upper_rotation.inv() * fore_rotation).as_quat()
            rotations[hand][k] = (fore_rotation.inv() * wrist_rotation).as_quat()
            world = d['world_at'](tracks, t)
    for i in (8, 9, 10, 12, 13, 14):
        values = rotations[i]
        values[-1] = values[0]
        for k in range(1, len(values)):
            if np.dot(values[k - 1], values[k]) < 0:
                values[k] *= -1


def drape_matrices(d, tracks, times, levels, cloth, legs, skin_vertices):
    """One smooth waist-hung arc replaces six unrelated horizontal offsets.

    The tangent starts and ends vertical, with a broad curved middle that
    yields behind the legs. Arc length is preserved before skin blending.
    Front opening weights stay with the source stride. The lower rear drape
    progressively rejects pelvis tilt so it hangs down instead of hinging up.
    A shared periodic envelope prevents bands from pulsing independently.
    """
    vertices = d['verts']
    pivot = np.array([0, .91, .10])
    depths = pivot[1] - levels
    worlds = [d['world_at'](tracks, t) for t in times]
    hips = np.array([world[22] @ d['ib'][0] for world in worlds])
    angles = []
    for world, hip in zip(worlds, hips):
        leg_vertices = skin_vertices(world, legs)
        local = (np.linalg.inv(hip) @ np.c_[leg_vertices, np.ones(len(leg_vertices))].T).T[:, :3]
        required = []
        for y, depth in zip(levels, depths):
            lower_leg = local[(abs(local[:, 1] - y) < .12) & (abs(local[:, 0]) < .24)]
            fabric = vertices[cloth & (abs(vertices[:, 1] - y) < .08) & (abs(vertices[:, 0]) < .17) & (vertices[:, 2] < -.025)]
            if len(lower_leg) and len(fabric) and y < .65:
                required.append(max(0, np.quantile(fabric[:, 2], .85) - lower_leg[:, 2].min() + .025) / max(depth, .1))
        angles.append(min(.62, max(required, default=0) * 1.1))
    angles = gaussian_filter1d(maximum_filter1d(angles[:-1], size=17, mode='wrap'), sigma=5, mode='wrap')
    angles = np.r_[angles, angles[0]]
    result = []
    for hip, theta in zip(hips, angles):
        root = R.from_matrix(hip[:3, :3])
        yaw = R.from_euler('y', np.arctan2(hip[0, 2], hip[2, 2]))
        waist = (hip @ np.r_[pivot, 1])[:3]
        rows = []
        for y, depth in zip(levels, depths):
            u = np.linspace(0, depth, 41)
            angle = theta * np.sin(np.pi * np.clip(u / .69, 0, 1))
            dy, dz = -np.trapezoid(np.cos(angle), u), -np.trapezoid(np.sin(angle), u)
            base = mix(root, yaw, .75 * np.clip(depth / .69, 0, 1))
            rotation = base * R.from_euler('x', theta * np.sin(np.pi * np.clip(depth / .69, 0, 1)))
            center = waist + base.apply([0, dy, dz])
            transform = np.eye(4)
            transform[:3, :3] = rotation.as_matrix()
            transform[:3, 3] = center - rotation.apply([0, y, .10])
            rows.append(transform)
        result.append(rows)
    return np.array(result), {
        'maxArcAngleRadians': float(max(angles)),
        'minArcAngleRadians': float(min(angles)),
        'method': 'continuous length-preserving arc, tangent-aligned controls and damped shared envelope',
    }


def audit_hand_contacts(d):
    """Verify palm proxy anchors after export, not arbitrary hand/body contact."""
    clip = next(c for c in d['g']['animations'] if c['name'] == 'Hot_Walk_Corrected')
    tracks = d['tracks'](clip)
    duration = max(t[-1] for _, _, t, _ in tracks)
    bind = d['world_at']([], 0)
    hip_errors, temple_errors = [], []
    for t in np.linspace(0, duration, round(duration * 120) + 1):
        world = d['world_at'](tracks, t)
        for hand, frame, anchor, errors in ((8, 22, HIP_PALM, hip_errors), (12, 17, TEMPLE_PALM, temple_errors)):
            if hand == 12 and not 1.85 <= t <= 4.5:
                continue
            palm = world[hand, :3, 3] + world[hand, :3, :3] @ (PALM_FROM_WRIST * 100)
            target = (world[frame] @ np.linalg.inv(bind[frame]) @ anchor)[:3]
            errors.append(float(np.linalg.norm(palm - target)))
    return {
        'method': '120 Hz wrist-relative palm proxy versus body-relative contact target; not finger or mesh collision certification.',
        'hipPalmErrorMaxM': max(hip_errors), 'templePalmErrorMaxM': max(temple_errors),
        'hipSamples': len(hip_errors), 'templeSamples': len(temple_errors),
    }
