"""Rebuild from original Hot Walk using phase-matched Quick Walk lateral paths."""
from pathlib import Path
import json
import numpy as np
from scipy.interpolate import PchipInterpolator, CubicSpline
from scipy.signal import find_peaks
from scipy.spatial.transform import Rotation as R
from cathexis_drape import unit, swing

def rebuild_hot_walk(d, tracks, times, original):
    rotation={i:values for i,kind,_,values in tracks if kind=='rotation'}
    for i,kind,_,values in original:
        if kind=='rotation' and i in (1,2,3,5,6,7):rotation[i][:]=values
    source=np.array([d['world_at'](tracks,t)for t in times])
    reference=json.loads(Path(__file__).with_name('cathexis-quick-walk-reference.json').read_text())
    points=np.array(reference['hipRelativeJointPositions']);points[-1]=points[0]
    curve=CubicSpline(reference['times'],points,axis=0,bc_type='periodic')
    # Pair each source left/right forward reach with the same event in the
    # reference cycle. Retain the source's variable stride timing and duration.
    reaches=[]
    for foot,phase in [(1,.9),(5,.367)]:
        z=source[:,foot,2,3]-source[:,22,2,3]
        for ix in find_peaks(z,prominence=.12)[0]:reaches.append((times[ix],phase))
    reaches.sort()
    assert len(reaches)>=6, 'Hot Walk stride events changed; inspect phase matching.'
    knots=np.array([a for a,b in reaches]);phases=[]
    for _,p in reaches:
        while phases and p<=phases[-1]:p+=1
        phases.append(p)
    phases=np.array(phases);period=float(np.median(knots[2:]-knots[:-2]));
    phase_curve=PchipInterpolator(np.r_[knots[0]-period,knots,knots[-1]+period],np.r_[phases[0]-1,phases,phases[-1]+1])
    refs=curve(phase_curve(times)%1)
    ease=np.clip((times-(times[-1]-.25))/.25,0,1);ease=ease**3*(10-15*ease+6*ease**2)
    refs+=ease[:,None,None]*(refs[0]-refs[-1])
    parents={c:i for i,n in enumerate(d['g']['nodes'])for c in n.get('children',[])}
    for k,t in enumerate(times):
        world=source[k];r=refs[k];solutions=[]
        for upper,lower,foot,offset in [(3,2,1,0),(7,6,5,3)]:
            hip,knee,ankle=[world[i,:3,3].copy()for i in (upper,lower,foot)]
            a,b=np.linalg.norm(knee-hip),np.linalg.norm(ankle-knee)
            scale=(a+b)/(np.linalg.norm(r[offset+1]-r[offset])+np.linalg.norm(r[offset+2]-r[offset+1]))
            goal=ankle.copy();goal[0]=world[22,0,3]+r[offset+2,0]*scale+(1 if offset==0 else -1)*.040
            direction=unit(goal-hip);distance=np.linalg.norm(goal-hip);cap=a+b-.004;distance=cap-.004*np.logaddexp(0,(cap-distance)/.004)
            goal=hip+direction*distance;along=(a*a-b*b+distance*distance)/(2*distance)
            circle=hip+direction*along;radius=np.sqrt(max(0,a*a-along*along))
            plane=unit(np.cross(r[offset+1]-r[offset],r[offset+2]-r[offset+1]))
            bend=unit(np.cross(direction,plane))
            target=circle+radius*bend
            solutions.append([upper,lower,foot,hip,knee,goal,circle,radius,direction,target])
        # CATHEXIS has broader knee armour than the reference. Add only the
        # local clearance needed while those shells pass, not fixed foot lanes.
        for _ in range(3):
            left,right=solutions[0][-1],solutions[1][-1]
            yz=float(np.sum((left[1:]-right[1:])**2))
            required=np.sqrt(max(0,.130**2-yz))
            correction=.003*np.logaddexp(0,(required-(left[0]-right[0]))/.003)/2
            for side,solution in zip((1,-1),solutions):
                circle,radius,direction,target=solution[-4:]
                hint=target+np.array([side*correction,0,0])
                solution[-1]=circle+radius*unit(hint-circle-direction*np.dot(hint-circle,direction))
        for upper,lower,foot,hip,knee,goal,circle,radius,direction,target in solutions:
            upper_rot=swing(knee-hip,target-hip)*R.from_matrix(world[upper,:3,:3]/.01)
            rotation[upper][k]=(R.from_matrix(world[parents[upper],:3,:3]/.01).inv()*upper_rot).as_quat()
            updated=d['world_at'](tracks,t)
            lower_rot=swing(updated[foot,:3,3]-updated[lower,:3,3],goal-updated[lower,:3,3])*R.from_matrix(updated[lower,:3,:3]/.01)
            rotation[lower][k]=(upper_rot.inv()*lower_rot).as_quat()
            rotation[foot][k]=(lower_rot.inv()*R.from_matrix(world[foot,:3,:3]/.01)).as_quat()
    for i in (1,2,3,5,6,7):
        q=rotation[i];q[-1]=q[0]
        for k in range(1,len(q)):
            if np.dot(q[k-1],q[k])<0:q[k]*=-1
