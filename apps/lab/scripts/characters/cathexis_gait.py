"""Clearance pose used by the accepted dress envelope and Happy Sway."""
import numpy as np
from scipy.spatial.transform import Rotation as R
from cathexis_drape import unit, swing


def refine_gait(d, tracks, times):
    """Keep the approved costume envelope and Happy Sway reproducible.

    Hot Walk subsequently restores its original leg rotations and is rebuilt
    by cathexis_hot_walk; this broad clearance pose is not its final gait.
    """
    rotations = {i: values for i, kind, _, values in tracks if kind == 'rotation'}
    parents = {c:i for i,n in enumerate(d['g']['nodes']) for c in n.get('children',[])}
    source = [d['world_at'](tracks,t) for t in times]
    centre = float(np.mean([(w[1,0,3]+w[5,0,3])/2 for w in source]))
    chains = [(3,2,1,1),(7,6,5,-1)]
    for k,t in enumerate(times):
        world = d['world_at'](tracks,t)
        goals = [world[foot,:3,3].copy() for _,_,foot,_ in chains]
        for goal,(_,_,foot,side) in zip(goals,chains):
            goal[0] = centre + side*.105 + (world[foot,0,3]-centre)*.10
        knee_x = np.array([world[lower,0,3]+.35*(goal[0]-world[foot,0,3])
                           for goal,(_,lower,foot,_) in zip(goals,chains)])
        needed = max(0., .13-(knee_x[0]-knee_x[1])) / 2
        knee_x += [needed,-needed]
        for goal,wanted_x,(upper,lower,foot,_) in zip(goals,knee_x,chains):
            hip,knee,ankle = [world[i,:3,3].copy() for i in (upper,lower,foot)]
            foot_rotation = R.from_matrix(world[foot,:3,:3]/.01)
            a,b = np.linalg.norm(knee-hip),np.linalg.norm(ankle-knee)
            direction=unit(goal-hip)
            distance=np.clip(np.linalg.norm(goal-hip),abs(a-b)+.001,a+b-.001)
            goal=hip+direction*distance
            along=(a*a-b*b+distance*distance)/(2*distance)
            circle=hip+direction*along
            radius=np.sqrt(max(0,a*a-along*along))
            lateral=unit(np.array([1.,0,0])-direction*direction[0])
            other=np.cross(direction,lateral)
            c=np.clip((wanted_x-circle[0])/max(radius*lateral[0],1e-8),-1,1)
            sign=1 if other[2]>=0 else -1
            target_knee=circle+radius*(lateral*c+other*sign*np.sqrt(max(0,1-c*c)))
            upper_rot=swing(knee-hip,target_knee-hip)*R.from_matrix(world[upper,:3,:3]/.01)
            rotations[upper][k]=(R.from_matrix(world[parents[upper],:3,:3]/.01).inv()*upper_rot).as_quat()
            world=d['world_at'](tracks,t)
            lower_rot=swing(world[foot,:3,3]-world[lower,:3,3],goal-world[lower,:3,3])*R.from_matrix(world[lower,:3,:3]/.01)
            rotations[lower][k]=(upper_rot.inv()*lower_rot).as_quat()
            rotations[foot][k]=(lower_rot.inv()*foot_rotation).as_quat()
            world=d['world_at'](tracks,t)
    for i in (1,2,3,5,6,7):
        q=rotations[i];q[-1]=q[0]
        for k in range(1,len(q)):
            if np.dot(q[k-1],q[k])<0:q[k]*=-1
