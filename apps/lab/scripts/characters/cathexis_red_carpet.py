"""Red Carpet correction baked offline, with deliberate centre-line crossover.

Reference only Quick Walk's lateral ankle path. Preserve source knee-local
articulation by swinging the entire chain at the hip, retaining hip-to-ankle
length and source forward reach. Do not constrain feet to separate lanes.
A broad, smoothed clearance envelope avoids contact-triggered knee snaps.
The published clip needs no runtime IK or triangle collision processing.
"""
from pathlib import Path
import json,ctypes,subprocess,tempfile
import numpy as np
from scipy.interpolate import PchipInterpolator,CubicSpline
from scipy.signal import find_peaks
from scipy.ndimage import gaussian_filter1d,maximum_filter1d
from scipy.spatial.transform import Rotation as R
from cathexis_motion_math import cloth_regions
from cathexis_drape import swing

def rebuild_red_carpet(d,tracks,times):
 rotations={i:z for i,p,_,z in tracks if p=='rotation'}
 source=np.array([d['world_at'](tracks,t)for t in times]);parents={c:i for i,n in enumerate(d['g']['nodes'])for c in n.get('children',[])}
 root=Path(__file__).parent
 ref=json.loads((root/'cathexis-quick-walk-reference.json').read_text());points=np.array(ref['hipRelativeJointPositions']);points[-1]=points[0]
 curve=CubicSpline(ref['times'],points,axis=0,bc_type='periodic')
 reaches=[]
 for foot,phase in [(1,.9),(5,.367)]:
  for ix in find_peaks(source[:,foot,2,3]-source[:,22,2,3],prominence=.12)[0]:reaches.append((times[ix],phase))
 reaches.sort();knots=np.array([t for t,p in reaches]);phases=[]
 for _,p in reaches:
  while phases and p<=phases[-1]:p+=1
  phases.append(p)
 period=float(np.median(knots[2:]-knots[:-2]));phase=PchipInterpolator(np.r_[knots[0]-period,knots,knots[-1]+period],np.r_[phases[0]-1,phases,phases[-1]+1])(times)
 refs=curve(phase%1);ease=np.clip((times-(times[-1]-.3))/.3,0,1);ease=ease**3*(10-15*ease+6*ease**2);refs+=ease[:,None,None]*(refs[0]-refs[-1])
 base=[]
 for k,w in enumerate(source):
  row=[]
  for upper,lower,foot,offset,side in [(3,2,1,0,1),(7,6,5,3,-1)]:
   h,kn,ank=[w[i,:3,3]for i in (upper,lower,foot)];r=refs[k];scale=(np.linalg.norm(kn-h)+np.linalg.norm(ank-kn))/(np.linalg.norm(r[offset+1]-r[offset])+np.linalg.norm(r[offset+2]-r[offset+1]))
   original=ank-h;goal=original.copy();goal[0]=w[22,0,3]+r[offset+2,0]*scale+side*.003-h[0]
   goal[1]=-np.sqrt(max(.01,np.dot(original,original)-goal[0]**2-goal[2]**2))
   row.append(swing(original,goal))
  base.append(row)
 def pose(k,angle):
  w=source[k].copy()
  for index,(upper,lower,foot,toe,side) in enumerate([(3,2,1,0,1),(7,6,5,4,-1)]):
   # Rigidly swing the whole chain at the hip; knee-local curves stay source.
   turn=R.from_euler('z',side*angle)*base[k][index];h=w[upper,:3,3].copy()
   for j in (upper,lower,foot,toe):
    w[j,:3,3]=h+turn.apply(source[k,j,:3,3]-h);w[j,:3,:3]=turn.as_matrix()@source[k,j,:3,:3]
   # Counter-rotate the foot; keep the source sole/roll and toe articulation.
   restore=R.from_matrix(source[k,foot,:3,:3]/.01)*R.from_matrix(w[foot,:3,:3]/.01).inv()
   w[toe,:3,3]=w[foot,:3,3]+restore.apply(w[toe,:3,3]-w[foot,:3,3]);w[toe,:3,:3]=restore.as_matrix()@w[toe,:3,:3];w[foot,:3,:3]=source[k,foot,:3,:3]
  return w
 v=d['verts'];f=d['acc'](d['prim']['indices']).astype(np.uint32).reshape(-1,3);_,legs=cloth_regions(v,f);used=np.flatnonzero(legs);vh=np.c_[v[used],np.ones(len(used))]
 j=np.c_[d['js'],d['acc'](d['prim']['attributes']['JOINTS_1']).astype(int)][used];ws=np.c_[d['ws'],d['acc'](d['prim']['attributes']['WEIGHTS_1'])][used]
 left=f[np.all((legs&(v[:,0]>0))[f],axis=1)];right=f[np.all((legs&(v[:,0]<0))[f],axis=1)];vertices=np.zeros_like(v)
 with tempfile.TemporaryDirectory()as td:
  libpath=Path(td)/'contacts.so';subprocess.run(['cc','-O3','-shared','-fPIC',str(root/'cathexis_contacts.c'),'-lm','-o',str(libpath)],check=True);lib=ctypes.CDLL(str(libpath));hit=lib.leg_contacts;hit.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_int,ctypes.c_void_p,ctypes.c_int];hit.restype=ctypes.c_int
  def collides(k,angle):
   w=pose(k,angle);m=w[d['sk']['joints']]@d['ib'];vertices[used]=sum(np.einsum('nij,nj->ni',m[j[:,i]],vh)*ws[:,i,None]for i in range(8))[:,:3]
   return hit(vertices.ctypes.data,left.ctypes.data,len(left),right.ctypes.data,len(right))>0
  required=[]
  for k in range(len(times)-1):
   angle=0.
   while collides(k,angle)and angle<np.radians(12):angle+=np.radians(.25)
   required.append(angle)
  # Broaden clearance in time before smoothing: no contact-triggered snaps.
  envelope=gaussian_filter1d(maximum_filter1d(required,size=19,mode='wrap'),4,mode='wrap')+np.radians(.25)
  envelope=np.r_[envelope,envelope[0]]
  assert all(not collides(k,a)for k,a in enumerate(envelope)), 'Clearance envelope insufficient'
 result=[]
 for k,t in enumerate(times):
  w=pose(k,envelope[k]);result.append(w)
  for upper,lower,foot in [(3,2,1),(7,6,5)]:
   for node in (upper,foot):rotations[node][k]=(R.from_matrix(w[parents[node],:3,:3]/.01).inv()*R.from_matrix(w[node,:3,:3]/.01)).as_quat()
 for node in (1,3,5,7):
  q=rotations[node];q[-1]=q[0]
  for k in range(1,len(q)):
   if np.dot(q[k-1],q[k])<0:q[k]*=-1
 result=np.array(result);relative=result[:,:,:3,3]-result[:,22,None,:3,3]
 report={'maxClearanceSwingDeg':float(np.degrees(envelope).max()),'minClearanceSwingDeg':float(np.degrees(envelope).min()),'leftCentreCrossFrames':int((relative[:,1,0]<0).sum()),'rightCentreCrossFrames':int((relative[:,5,0]>0).sum()),'leftCrossMaxM':float(-relative[:,1,0].min()),'rightCrossMaxM':float(relative[:,5,0].max()),'kneeLocalCurves':'unchanged source after shared endpoint closure'}
 print('redcarpet',report,flush=True);return report
