"""Offline worker skin evaluation and geometric contact queries. Never imported by the web client."""
from pathlib import Path
import sys,json,ctypes,subprocess
import numpy as np
from scipy.spatial.transform import Rotation as R,Slerp
from scipy.ndimage import maximum_filter1d,gaussian_filter1d
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'scripts/characters'))
from cathexis_motion_math import context,mat
SOURCE=ROOT/'public/media/files/299587fb5eefb1fa1dc725118d4edd17ae058ea4231610c19d079bde3c991933.glb'
class Worker:
 def __init__(self,path=SOURCE,corrected=False):
  d=context(path);self.d=d;self.g=g=d['g'];self.nodes=g['nodes'];
  if corrected:
   d['prim']=g['meshes'][1]['primitives'][0];d['sk']=g['skins'][1];d['verts']=d['acc'](d['prim']['attributes']['POSITION']);d['js']=d['acc'](d['prim']['attributes']['JOINTS_0']).astype(int);d['ws']=d['acc'](d['prim']['attributes']['WEIGHTS_0']);d['ib']=d['acc'](d['sk']['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
  self.parent={c:i for i,n in enumerate(self.nodes)for c in n.get('children',[])}
  self.order=[]
  def walk(i):
   self.order.append(i)
   for c in self.nodes[i].get('children',[]):walk(c)
  for i in range(len(self.nodes)):
   if i not in self.parent:walk(i)
  self.bind=self.world(np.array([mat(n)for n in self.nodes]));
  v=d['verts'];j=np.c_[d['js'],d['acc'](d['prim']['attributes']['JOINTS_1']).astype(int)];w=np.c_[d['ws'],d['acc'](d['prim']['attributes']['WEIGHTS_1'])]
  # Dedup by all skin attributes, not position alone (seams can have distinct weights).
  _,ids,inv=np.unique(np.round(np.c_[v,j,w],6),axis=0,return_index=True,return_inverse=True)
  self.v=v[ids];self.j=j[ids];self.w=w[ids];self.vh=np.c_[self.v,np.ones(len(ids))];self.f=inv[d['acc'](d['prim']['indices']).astype(int).reshape(-1,3)].astype(np.uint32)
  dom=np.array(d['sk']['joints'])[self.j[np.arange(len(ids)),self.w.argmax(1)]]; names=np.array([n.get('name','')for n in self.nodes])[dom]
  self.reg={}
  groups={'legL':[4,7,10,13],'legR':[5,8,11,14],'armL':[18,21,25],'armR':[19,22,26],'foreL':[21,25],'foreR':[22,26],'handL':[25],'handR':[26],'head':[20,23,24],'torso':[3,6,9,12]}
  for side,hand in [('L','Left'),('R','Right')]:
   digits=[i for i,n in enumerate(self.nodes)if n.get('name','').startswith(hand)and n.get('name','').replace(hand,'')in ['Thumb','Index','Middle','Ring','Little']]
   for k in ['arm','fore','hand']:groups[k+side]+=digits
  for k,ns in groups.items():self.reg[k]=np.ascontiguousarray(self.f[np.all(np.isin(dom,ns)[self.f],axis=1)])
  self.pairs=[('legL','legR'),('foreL','foreR'),('handL','head'),('handR','head'),('foreL','torso'),('foreR','torso'),('handL','legL'),('handR','legR'),('handL','legR'),('handR','legL')]
  self.inf=[]
  for ji in range(len(d['sk']['joints'])):
   weights=(self.w*(self.j==ji)).sum(1);ix=np.flatnonzero(weights>1e-8);self.inf.append((ix,weights[ix]))
  import tempfile,hashlib
  cfile=ROOT/'scripts/characters/worker_contacts.c'
  so=Path(tempfile.gettempdir())/('loopforge-worker-'+hashlib.sha256(cfile.read_bytes()).hexdigest()[:16]+'.so')
  if not so.exists():subprocess.run(['cc','-O3','-shared','-fPIC',str(cfile),'-lm','-o',str(so)],check=True)
  self.j=np.ascontiguousarray(self.j,dtype=np.uint32);self.v=np.ascontiguousarray(self.v);self.w=np.ascontiguousarray(self.w);
  self.lib=ctypes.CDLL(str(so));self.skinfn=self.lib.skin_vertices;self.skinfn.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_void_p,ctypes.c_int,ctypes.c_void_p,ctypes.c_void_p];self.hit=self.lib.contacts;self.hit.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_int,ctypes.c_void_p,ctypes.c_int];self.hit.restype=ctypes.c_int;self.anyhit=self.lib.any_contacts;self.anyhit.argtypes=self.hit.argtypes;self.anyhit.restype=ctypes.c_int
  self.region_ids={k:np.unique(f)for k,f in self.reg.items()}
 def sample(self,clip,hz=60):
  tr=self.d['tracks'](clip);end=max(t[-1]for _,_,t,_ in tr);ts=np.linspace(0,end,round(end*hz)+1)
  local=np.tile(np.array([mat(n)for n in self.nodes]),(len(ts),1,1,1));rot={}
  for n,p,t,v in tr:
   if p=='rotation':
    q=Slerp(t,R.from_quat(v))(np.clip(ts,t[0],t[-1]));local[:,n,:3,:3]=q.as_matrix()*np.linalg.norm(local[:,n,:3,:3],axis=1)[:,None,:];rot[n]=q.as_quat()
   elif p=='translation':local[:,n,:3,3]=np.array([np.interp(ts,t,v[:,k])for k in range(3)]).T
   elif p=='scale':
    scale=np.array([np.interp(ts,t,v[:,k])for k in range(3)]).T;local[:,n,:3,:3]*=scale[:,None,:]/np.linalg.norm(local[:,n,:3,:3],axis=1)[:,None,:]
  world=self.world(local);return ts,local,world
 def world(self,l):
  w=l.copy()
  for i in self.order:
   if i in self.parent:w[...,i,:,:]=w[...,self.parent[i],:,:]@l[...,i,:,:]
  return w
 def skin(self,w):
  m=w[self.d['sk']['joints']]@self.d['ib'];out=np.zeros_like(self.v)
  self.skinfn(self.v.ctypes.data,self.j.ctypes.data,self.w.ctypes.data,len(self.v),np.ascontiguousarray(m).ctypes.data,out.ctypes.data)
  return np.ascontiguousarray(out)
 def contacts(self,p,pairs=None):
  out=[]
  for a,b in pairs or self.pairs:
   pa,pb=p[self.region_ids[a]],p[self.region_ids[b]]
   if np.any(pa.max(0)<pb.min(0))or np.any(pb.max(0)<pa.min(0)):
    out.append(0);continue
   fa,fb=self.reg[a],self.reg[b]
   out.append(self.hit(p.ctypes.data,fa.ctypes.data,len(fa),fb.ctypes.data,len(fb))if len(fa)and len(fb)else 0)
  return out
 def intersects(self,p,pairs):
  for a,b in pairs:
   pa,pb=p[self.region_ids[a]],p[self.region_ids[b]]
   if np.any(pa.max(0)<pb.min(0))or np.any(pb.max(0)<pa.min(0)):continue
   fa,fb=self.reg[a],self.reg[b]
   if self.anyhit(p.ctypes.data,fa.ctypes.data,len(fa),fb.ctypes.data,len(fb)):return True
  return False
 def rotate_chain(self,w,root,rotation,keepfoot=None):
  o=w[root,:3,3].copy();children=[]
  def walk(i):
   children.append(i)
   for c in self.nodes[i].get('children',[]):walk(c)
  walk(root)
  foot=w[keepfoot].copy()if keepfoot else None
  w[children,:3,3]=(w[children,:3,3]-o)@rotation.T+o;w[children,:3,:3]=rotation@w[children,:3,:3]
  if keepfoot:
   restore=foot[:3,:3]@np.linalg.inv(w[keepfoot,:3,:3]);self.rotate_chain(w,keepfoot,restore)
  return w
 def clearance(self,w,angle,kind):
  w=w.copy();basis=w[3,:3,:3]@np.linalg.inv(self.bind[3,:3,:3])
  for side,root,foot in [(1,4,10),(-1,5,11)]if kind=='legs'else[(1,18,None),(-1,19,None)]:
   turn=R.from_rotvec(basis[:,2]*side*angle).as_matrix();self.rotate_chain(w,root,turn,foot)
  return w
