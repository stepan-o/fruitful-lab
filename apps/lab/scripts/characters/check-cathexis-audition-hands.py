"""Check Mirror Viewing palm clearance, contact targets and arm continuity."""
from pathlib import Path
import sys,json,ctypes,subprocess,tempfile,hashlib
import numpy as np
from scipy.spatial.transform import Rotation as R
from cathexis_motion_math import context
runtime=Path(sys.argv[1]);out=Path(sys.argv[2]);d=context(runtime);g=d['g'];acc=d['acc'];v=d['verts'];vh=np.c_[v,np.ones(len(v))];f=acc(d['prim']['indices']).astype(np.uint32).reshape(-1,3);p=g['meshes'][1]['primitives'][0];sk=g['skins'][1];ib=acc(sk['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1);js=np.c_[acc(p['attributes']['JOINTS_0']).astype(int),acc(p['attributes']['JOINTS_1']).astype(int)];ws=np.c_[acc(p['attributes']['WEIGHTS_0']),acc(p['attributes']['WEIGHTS_1'])]
names={n['name']:i for i,n in enumerate(g['nodes'])};hands=[names['mixamorig:LeftHand'],names['mixamorig:RightHand']];handj=[sk['joints'].index(j)for j in hands];handids=np.sum(np.isin(js,handj)*ws,axis=1)>.65;hf=f[np.all(handids[f],axis=1)];body=(abs(v[:,0])<.26)&(v[:,1]>.85)&(v[:,1]<1.52)&~handids;bf=f[np.all(body[f],axis=1)];used=np.unique(np.r_[hf.ravel(),bf.ravel()]);clip=next(x for x in g['animations']if x['name']=='Mirror_Viewing_Corrected');tr=d['tracks'](clip);dur=max(x[2][-1]for x in tr);ts=np.linspace(0,dur,round(dur*120)+1);bind=d['world_at']([],0);hipnode=names['mixamorig:Hips'];hits=[];gap=[];steps=[]
with tempfile.TemporaryDirectory() as td:
 libpath=Path(td)/'contact.so';subprocess.run(['cc','-O3','-shared','-fPIC',str(Path(__file__).with_name('cathexis_contacts.c')),'-lm','-o',str(libpath)],check=True);lib=ctypes.CDLL(str(libpath));fn=lib.contacts;fn.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_int,ctypes.c_void_p,ctypes.c_int];fn.restype=ctypes.c_int
 for t in ts:
  w=d['world_at'](tr,t);m=w[sk['joints']]@ib;pts=np.zeros_like(v);pts[used]=sum(np.einsum('nij,nj->ni',m[js[used,k]],vh[used])*ws[used,k,None]for k in range(8))[:,:3];n=fn(pts.ctypes.data,bf.ctypes.data,len(bf),hf.ctypes.data,len(hf))
  if n:hits.append({'seconds':float(t),'crossings':n})
  if 1.1<=t<=6.1:
   hip=w[hipnode]@np.linalg.inv(bind[hipnode])
   for j,side in zip(hands,[1,-1]):
    palm=w[j,:3,3]+R.from_matrix(w[j,:3,:3]/.01).apply([0,.08,0]);target=(hip@[side*.18,1.045,.19,1])[:3];gap.append(float(np.linalg.norm(palm-target)))
 for node,path,ks,z in tr:
  if path=='rotation' and any(x in g['nodes'][node]['name'] for x in ['Arm','Hand']):
   q=R.from_quat(z);angles=np.degrees((q[1:]*q[:-1].inv()).magnitude());steps.append({'joint':g['nodes'][node]['name'],'maxKeyStepDegrees':float(angles.max())})
 report={'runtimeSHA256':hashlib.sha256(runtime.read_bytes()).hexdigest(),'clip':clip['name'],'samples':len(ts),'handTorsoCrossingFrames':len(hits),'worst':max(hits,key=lambda x:x['crossings'],default=None),'maxPalmTargetErrorM':max(gap),'armSteps':steps,'method':'120 Hz hand mesh vs central torso/waist (rest x ±0.26m, y 0.85–1.52m) non-coplanar triangle crossings. Palm targets tested during full-contact 1.10–6.10s. Excludes tangency, containment, cloth, arm/head, blends and dynamics.'};out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report),flush=True)
