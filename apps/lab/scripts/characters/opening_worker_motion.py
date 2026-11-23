"""Offline geometry/contact adapter for the ten distinct opening workers.

Reuses the validated triangle-query backend, but resolves joints by name and
supports four- or eight-influence exports. No fixed Worker 01 node indices.
"""
from pathlib import Path
import ctypes, hashlib, subprocess, tempfile
import numpy as np
from worker_motion import Worker, ROOT, R
from cathexis_motion_math import context, mat

class OpeningWorker(Worker):
 def __init__(self,path):
  d=context(path);self.d=d;self.g=d['g'];self.nodes=d['g']['nodes'];self.names={n.get('name'):i for i,n in enumerate(self.nodes)}
  self.parent={c:i for i,n in enumerate(self.nodes)for c in n.get('children',[])};self.order=[]
  def visit(i):
   self.order.append(i)
   for c in self.nodes[i].get('children',[]):visit(c)
  for i in range(len(self.nodes)):
   if i not in self.parent:visit(i)
  self.bind=self.world(np.array([mat(n)for n in self.nodes]))
  attrs=d['prim']['attributes'];v=d['verts'];j=d['js'];w=d['ws']
  if 'JOINTS_1' in attrs:j=np.c_[j,d['acc'](attrs['JOINTS_1']).astype(int)];w=np.c_[w,d['acc'](attrs['WEIGHTS_1'])]
  else:j=np.c_[j,np.zeros_like(j)];w=np.c_[w,np.zeros_like(w)]
  _,ids,inv=np.unique(np.round(np.c_[v,j,w],7),axis=0,return_index=True,return_inverse=True)
  self.v=np.ascontiguousarray(v[ids]);self.j=np.ascontiguousarray(j[ids],dtype=np.uint32);self.w=np.ascontiguousarray(w[ids]);self.vh=np.c_[self.v,np.ones(len(ids))]
  self.f=inv[d['acc'](d['prim']['indices']).astype(int).reshape(-1,3)].astype(np.uint32)
  dom=np.array(d['sk']['joints'])[self.j[np.arange(len(ids)),self.w.argmax(1)]]
  groups={'head':['neck','Head','head_end','headfront'],'torso':['Hips','Spine02','Spine01','Spine']}
  for side,prefix in [('L','Left'),('R','Right')]:
   groups['leg'+side]=[prefix+n for n in ['UpLeg','Leg','Foot','ToeBase']]
   groups['fore'+side]=[prefix+'ForeArm',prefix+'Hand'];groups['hand'+side]=[prefix+'Hand'];groups['foot'+side]=[prefix+'Foot',prefix+'ToeBase']
  self.reg={};self.region_ids={}
  for key,names in groups.items():
   member=np.isin(dom,[self.names[n]for n in names]);self.reg[key]=np.ascontiguousarray(self.f[np.all(member[self.f],axis=1)]);self.region_ids[key]=np.flatnonzero(member)
  self.pairs=[('legL','legR'),('foreL','foreR'),('handL','head'),('handR','head'),('foreL','torso'),('foreR','torso'),('handL','legL'),('handR','legR'),('handL','legR'),('handR','legL')]
  cfile=ROOT/'scripts/characters/worker_contacts.c';so=Path(tempfile.gettempdir())/('loopforge-worker-'+hashlib.sha256(cfile.read_bytes()).hexdigest()[:16]+'.so')
  if not so.exists():subprocess.run(['cc','-O3','-shared','-fPIC',str(cfile),'-lm','-o',str(so)],check=True)
  self.lib=ctypes.CDLL(str(so));self.skinfn=self.lib.skin_vertices;self.skinfn.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_void_p,ctypes.c_int,ctypes.c_void_p,ctypes.c_void_p]
  self.hit=self.lib.contacts;self.hit.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_int,ctypes.c_void_p,ctypes.c_int];self.hit.restype=ctypes.c_int;self.anyhit=self.lib.any_contacts;self.anyhit.argtypes=self.hit.argtypes;self.anyhit.restype=ctypes.c_int
 def clearance(self,world,angle,kind):
  world=world.copy();hip=self.names['Hips'];basis=world[hip,:3,:3]@np.linalg.inv(self.bind[hip,:3,:3])
  # World forward is +Z for these GLBs; rotate limb roots around character forward.
  for sign,prefix in [(1,'Left'),(-1,'Right')]:
   root=self.names[prefix+('UpLeg'if kind=='legs'else'Arm')];foot=self.names[prefix+'Foot']if kind=='legs'else None
   self.rotate_chain(world,root,R.from_rotvec(basis[:,2]*(-sign)*angle).as_matrix(),foot)
  return world
