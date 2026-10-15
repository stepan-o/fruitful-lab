"""Offline calm standing performance with floor-fixed sole transforms.

The source remains untouched. Pelvis travel and torso rocking are reduced around
mean poses; head and arm acting survive. Two-bone leg solves are baked, not run
per character at runtime. This is a standing clip, not locomotion.
"""
import numpy as np
from scipy.spatial.transform import Rotation as R
from cathexis_drape import unit, swing


def calm_stance(d, tracks, times):
    rotations = {i: values for i, kind, _, values in tracks if kind == 'rotation'}
    translations = {i: values for i, kind, _, values in tracks if kind == 'translation'}
    parents = {c: i for i, n in enumerate(d['g']['nodes']) for c in n.get('children', [])}
    # Keep expressive arms/head; tone down the body sway for a repeatable info-screen idle.
    hips = translations[22]
    mean = hips[:-1].mean(axis=0)
    hips[:] = mean + (hips - mean) * [.42, .60, .42]
    for j in (22, 21, 20, 19):
        q = R.from_quat(rotations[j]); centre = q[:-1].mean()
        rotations[j][:] = (centre * R.from_rotvec((centre.inv() * q).as_rotvec() * .58)).as_quat()
    # Existing clearance pose supplies a narrow staggered stance. Lock each entire
    # foot, including toe, to its first planted orientation instead of chasing hips.
    first = d['world_at'](tracks, 0)
    goals, foot_rotations = {}, {}
    vh = np.c_[d['verts'], np.ones(len(d['verts']))]
    m = first[d['sk']['joints']] @ d['ib']
    p = sum(np.einsum('nij,nj->ni',m[d['js'][:,k]],vh)*d['ws'][:,k,None] for k in range(4))[:,:3]
    for foot, toe, side in ((1, 0, 1), (5, 4, -1)):
        goal = first[foot,:3,3].copy()
        sole = (d['verts'][:,1] < .15) & (d['verts'][:,0]*side > 0)
        goal[1] += .002 - p[sole,1].min()
        goals[foot] = goal
        foot_rotations[foot] = R.from_matrix(first[foot,:3,:3]/.01)
        rotations[toe][:] = rotations[toe][0]
    worlds = [d['world_at'](tracks,t) for t in times]
    # Lower the pelvis only enough to keep both fixed ankle targets reachable.
    for k, world in enumerate(worlds):
        shift = 0.
        for upper, lower, foot in ((3,2,1),(7,6,5)):
            h, knee, ankle = [world[j,:3,3] for j in (upper,lower,foot)]
            reach = np.linalg.norm(knee-h) + np.linalg.norm(ankle-knee) - .012
            horizontal = np.linalg.norm((goals[foot]-h)[[0,2]])
            max_y = goals[foot][1] + np.sqrt(max(.001,reach*reach-horizontal*horizontal))
            shift = min(shift, max_y-h[1])
        hips[k,1] += shift*100
    for k,t in enumerate(times):
        world = d['world_at'](tracks,t)
        for upper, lower, foot, side in ((3,2,1,1),(7,6,5,-1)):
            h,knee,ankle = [world[j,:3,3] for j in (upper,lower,foot)]
            goal=goals[foot];a,b=np.linalg.norm(knee-h),np.linalg.norm(ankle-knee)
            direction=unit(goal-h);distance=np.linalg.norm(goal-h)
            assert distance < a+b and distance > abs(a-b)
            along=(a*a-b*b+distance*distance)/(2*distance)
            # Stable forward bend plane with a small outward allowance for armour.
            pole=np.array([side*.20,0,1.])
            bend=unit(pole-direction*np.dot(pole,direction))
            target=h+direction*along+bend*np.sqrt(max(0,a*a-along*along))
            upper_rot=swing(knee-h,target-h)*R.from_matrix(world[upper,:3,:3]/.01)
            rotations[upper][k]=(R.from_matrix(world[parents[upper],:3,:3]/.01).inv()*upper_rot).as_quat()
            world=d['world_at'](tracks,t)
            lower_rot=swing(world[foot,:3,3]-world[lower,:3,3],goal-world[lower,:3,3])*R.from_matrix(world[lower,:3,:3]/.01)
            rotations[lower][k]=(upper_rot.inv()*lower_rot).as_quat()
            rotations[foot][k]=(lower_rot.inv()*foot_rotations[foot]).as_quat()
            world=d['world_at'](tracks,t)
    for _,kind,_,values in tracks:
        values[-1]=values[0]
        if kind=='rotation':
            for k in range(1,len(values)):
                if np.dot(values[k-1],values[k])<0:values[k]*=-1
