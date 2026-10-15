"""Usage: python audit-cathexis-motion.py runtime.glb audit.json. Requires numpy, scipy and cc.
Samples final exported bytes; contact test excludes coplanar/tangent/contained contacts.
"""
from pathlib import Path
import sys,json,hashlib,ctypes,subprocess,tempfile
import numpy as np
from cathexis_motion_math import context,cloth_regions
from cathexis_drape import audit_hand_contacts
runtime=Path(sys.argv[1]);output=Path(sys.argv[2]);d=context(runtime);g=d['g'];acc=d['acc'];v=d['verts'];vh=np.c_[v,np.ones(len(v))]
f=acc(g['meshes'][0]['primitives'][0]['indices']).astype(np.uint32).reshape(-1,3)
cloth,legs=cloth_regions(v,f);cf=f[np.all(cloth[f],axis=1)];lf=f[np.all(legs[f],axis=1)];left=f[np.all((legs&(v[:,0]>0))[f],axis=1)];right=f[np.all((legs&(v[:,0]<0))[f],axis=1)]
temp=tempfile.TemporaryDirectory();libpath=Path(temp.name)/'contact.so'
subprocess.run(['cc','-O3','-shared','-fPIC',str(Path(__file__).with_name('cathexis_contacts.c')),'-lm','-o',str(libpath)],check=True)
lib=ctypes.CDLL(str(libpath));lib.contacts.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_int,ctypes.c_void_p,ctypes.c_int];lib.contacts.restype=ctypes.c_int
lib.leg_contacts.argtypes=lib.contacts.argtypes;lib.leg_contacts.restype=ctypes.c_int
reports=[]
for clip in g['animations']:
 correct=clip['name'].endswith('Corrected');prim=g['meshes'][int(correct)]['primitives'][0];skin=g['skins'][int(correct)];j=acc(prim['attributes']['JOINTS_0']).astype(int);w=acc(prim['attributes']['WEIGHTS_0']);ib=acc(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1);tr=d['tracks'](clip);dur=max(t[-1]for _,_,t,_ in tr);times=np.linspace(0,dur,round(dur*120)+1);hits=[];leg_hits=[];ground=[];ends=[];ankles=[];knees=[];knee_distances=[]
 for ix,t in enumerate(times):
  world=d['world_at'](tr,t);m=world[skin['joints']]@ib;p=sum(np.einsum('nij,nj->ni',m[j[:,k]],vh)*w[:,k,None]for k in range(4))[:,:3].copy();count=lib.contacts(p.ctypes.data,cf.ctypes.data,len(cf),lf.ctypes.data,len(lf));ground.append(float(p[legs,1].min()))
  leg_count=lib.leg_contacts(p.ctypes.data,left.ctypes.data,len(left),right.ctypes.data,len(right));ankles.append(float(world[1,0,3]-world[5,0,3]));knees.append(float(world[2,0,3]-world[6,0,3]));knee_distances.append(float(np.linalg.norm(world[2,:3,3]-world[6,:3,3])))
  if leg_count:leg_hits.append({'time':round(float(t),4),'crossingTriangles':leg_count})
  if count:hits.append({'time':round(float(t),4),'crossingTriangles':count})
  if ix==0 or ix==len(times)-1:ends.append(p)
 steps=[]
 for node,kind,_,values in tr:
  if kind=='rotation' and node in (1,2,3,5,6,7):
   q=values/np.linalg.norm(values,axis=1)[:,None];steps.extend(2*np.arccos(np.clip(abs(np.sum(q[1:]*q[:-1],axis=1)),0,1)))
 row={'clip':clip['name'],'samples':len(times),'costumeLegContactFrames':len(hits),'legLegContactFrames':len(leg_hits),'maxLegKeyRotationStepRadians':max(steps),'ankleLaneSeparationMinM':min(ankles),'ankleLaneSeparationMaxM':max(ankles),'kneeLaneSeparationMinM':min(knees),'kneeCentreDistanceMinM':min(knee_distances),'footMinM':min(ground),'footMaxM':max(ground),'endpointMaxM':float(np.linalg.norm(ends[1]-ends[0],axis=1).max())};reports.append(row);print({k:v for k,v in row.items()if k!='contacts'},flush=True)
output.write_text(json.dumps({'runtimeSHA256':hashlib.sha256(runtime.read_bytes()).hexdigest(),'method':'120 Hz non-coplanar edge/triangle crossings. Cloth versus both legs, plus left versus right leg surfaces, below 0.85m. World-X ankle/knee lane separation is diagnostic for these forward-facing clips. No other body contacts, cloth self-contact, blends or dynamics certified. Coplanar/tangent contact, full containment and velocity continuity are not certified.','handContacts':audit_hand_contacts(d),'clothTriangles':len(cf),'legTriangles':len(lf),'leftLegTriangles':len(left),'rightLegTriangles':len(right),'clips':reports},indent=2))
