"""Clip-specific offline clearance envelopes. Preserve source knee curves and expressive timing."""
from worker_motion import *

def swing(a,b):
 a=a/np.linalg.norm(a);b=b/np.linalg.norm(b);axis=np.cross(a,b);d=np.dot(a,b)
 return R.from_quat(np.r_[axis,1+d]).as_matrix()if d>-.99999 else R.from_rotvec([np.pi,0,0]).as_matrix()
def arm_pose(b,w,amount):
 w=w.copy();basis=w[12,:3,:3]@np.linalg.inv(b.bind[12,:3,:3])
 for side,upper,hand in [(1,18,25),(-1,19,26)]:
  delta=w[hand,:3,3]-w[upper,:3,3];goal=delta+side*basis[:,0]*amount
  b.rotate_chain(w,upper,swing(delta,goal))
 return w

def correct(b,c,workdir):
 ts,l,ws=b.sample(c);out=ws.copy();results={};name=c['name'];
 # Reduce wrist kinks only in locomotion/rest; leave contact gestures authored.
 wrist_limit=np.radians(28)
 if name in ['idle','Alert','walking_2_inplace','run_fast_10_inplace','injured_walk']:
  for w in out:
   for fore,hand in [(21,25),(22,26)]:
    axis=w[hand,:3,3]-w[fore,:3,3];axis/=np.linalg.norm(axis);fwd=w[hand,:3,1];fwd=fwd/np.linalg.norm(fwd);angle=np.arccos(np.clip(np.dot(axis,fwd),-1,1))
    if angle>wrist_limit:
     turn=R.from_matrix(swing(fwd,axis));b.rotate_chain(w,hand,R.from_rotvec(turn.as_rotvec()*(1-wrist_limit/angle)).as_matrix())

 for kind,limit,step in [('legs',np.radians(14),np.radians(.5)),('arms',.24,.005)]:
  pairs=b.pairs[:1]if kind=='legs'else b.pairs[1:]
  pose=(lambda w,a:b.clearance(w,a,'legs'))if kind=='legs'else(lambda w,a:arm_pose(b,w,a))
  req=[];fails=[]
  for k,w in enumerate(out):
   a=0.
   while b.intersects(b.skin(pose(w,a)),pairs)and a<limit:a+=step
   req.append(a)
   if a>=limit:fails.append(k)
  req=np.array(req);mode='wrap'if name in ['walking_2_inplace','run_fast_10_inplace','Carry_Heavy_Object_Walk_inplace']else'nearest';envelope=gaussian_filter1d(maximum_filter1d(req,size=19,mode=mode),3,mode=mode)
  if envelope.max()>0:envelope+=step*.6
  before=out.copy()
  # Validate smoothed path: clearance can be nonmonotonic as limbs pass each other.
  for iteration in range(4):
   out=np.array([pose(w,a)for w,a in zip(before,envelope)])
   hits=np.array([b.intersects(b.skin(w),pairs)for w in out]);
   if not hits.any():break
   envelope+=gaussian_filter1d(maximum_filter1d(hits.astype(float),size=13),2)*step*2
  results[kind]={'max':round(float(np.degrees(envelope).max()if kind=='legs'else envelope.max()*100),3),'unit':'degrees'if kind=='legs'else'cm','remainingFrames':int(hits.sum()),'limitFrames':len(fails)}
 # Restore source lowest-sole height without erasing jumps, limp or collapse.
 legverts=np.unique(np.r_[b.reg['legL'].ravel(),b.reg['legR'].ravel()]);floor=[]
 for original,repaired in zip(ws,out):floor.append(b.skin(original)[legverts,1].min()-b.skin(repaired)[legverts,1].min())
 floor=gaussian_filter1d(floor,1,mode='nearest')
 out[:,:,:3,3]+=np.array([0,1,0])[None,None,:]*floor[:,None,None]
 results['maxGroundAdjustmentMm']=round(float(abs(floor).max()*1000),3)
 # Restore the source lowest-sole height with a small whole-pose vertical adjustment.
 # Preserve source body root, knee locals and duration.
 local=l.copy()
 for i in b.order:
  local[:,i]=np.linalg.inv(out[:,b.parent[i]])@out[:,i]if i in b.parent else out[:,i]
 print(name,results,flush=True)
 np.savez_compressed(workdir/(name+'.npz'),times=ts,local=local,source=l)
 return results
