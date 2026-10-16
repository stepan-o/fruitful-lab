"""Sample raw audition surfaces at 30 Hz; report problems without granting acceptance."""
from pathlib import Path
import sys,json,hashlib,ctypes,subprocess,tempfile
import numpy as np
from cathexis_motion_math import context,cloth_regions
runtime=Path(sys.argv[1]);out=Path(sys.argv[2]);d=context(runtime);g=d['g'];acc=d['acc'];v=d['verts'];vh=np.c_[v,np.ones(len(v))];p=d['prim'];sk=d['sk'];f=acc(p['indices']).astype(np.uint32).reshape(-1,3)
cloth,legs=cloth_regions(v,f);cf=f[np.all(cloth[f],axis=1)];lf=f[np.all(legs[f],axis=1)];left=f[np.all((legs&(v[:,0]>0))[f],axis=1)];right=f[np.all((legs&(v[:,0]<0))[f],axis=1)]
j=np.c_[d['js'],acc(p['attributes']['JOINTS_1']).astype(int)];w=np.c_[d['ws'],acc(p['attributes']['WEIGHTS_1'])];assert np.max(abs(w.sum(1)-1))<1e-6
with tempfile.TemporaryDirectory() as td:
 libpath=Path(td)/'contact.so';subprocess.run(['cc','-O3','-shared','-fPIC',str(Path(__file__).with_name('cathexis_contacts.c')),'-lm','-o',str(libpath)],check=True);lib=ctypes.CDLL(str(libpath))
 for name in ['contacts','leg_contacts']:
  fn=getattr(lib,name);fn.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_int,ctypes.c_void_p,ctypes.c_int];fn.restype=ctypes.c_int
 reports=[]
 for clip in g['animations']:
  tr=d['tracks'](clip);dur=max(t[-1]for _,_,t,_ in tr);times=np.linspace(0,dur,round(dur*30)+1);hits=[];cross=[];floor=[];ends=[]
  for ix,t in enumerate(times):
   world=d['world_at'](tr,t);ms=world[sk['joints']]@d['ib'];pts=sum(np.einsum('nij,nj->ni',ms[j[:,k]],vh)*w[:,k,None]for k in range(8))[:,:3].copy();assert np.isfinite(pts).all()
   h=lib.contacts(pts.ctypes.data,cf.ctypes.data,len(cf),lf.ctypes.data,len(lf));l=lib.leg_contacts(pts.ctypes.data,left.ctypes.data,len(left),right.ctypes.data,len(right))
   if h:hits.append({'seconds':round(float(t),3),'crossings':h})
   if l:cross.append({'seconds':round(float(t),3),'crossings':l})
   floor.append(float(pts[legs,1].min()))
   if ix in [0,len(times)-1]:ends.append(pts)
  row={'clip':clip['name'],'samples':len(times),'dressLegFrames':len(hits),'legLegFrames':len(cross),'dressLegWorst':max(hits,key=lambda x:x['crossings'],default=None),'legLegWorst':max(cross,key=lambda x:x['crossings'],default=None),'lowestSoleM':min(floor),'highestSupportingSoleM':max(floor),'endpointMaxM':float(np.linalg.norm(ends[-1]-ends[0],axis=1).max())};reports.append(row);print(row,flush=True)
 out.write_text(json.dumps({'runtimeSHA256':hashlib.sha256(runtime.read_bytes()).hexdigest(),'method':'30 Hz non-coplanar edge/triangle tests below 0.85m: skirt/legs and left/right legs. Excludes tangency, containment, upper body, hand/face, cloth self-contact, blends and dynamics. Source audition only; no correction or approval implied.','clips':reports},indent=2)+'\n')
