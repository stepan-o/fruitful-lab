"""Ten rigid digit hinges fitted to the accepted Worker 01 mesh. Source skin is retained."""
from worker_motion import *

def add_fingers(b):
 d=b.d;g=b.g;v=d['verts'];j=np.c_[d['js'],d['acc'](d['prim']['attributes']['JOINTS_1']).astype(int)];weights=np.c_[d['ws'],d['acc'](d['prim']['attributes']['WEIGHTS_1'])];rest=b.world(np.array([mat(n)for n in b.nodes]));ib=list(d['ib']);joints=list(d['sk']['joints']);meta=[]
 for hand,side in [(25,'Left'),(26,'Right')]:
  handjoint=joints.index(hand);mask=(weights*(j==handjoint)).sum(1)>.8;p=np.c_[v,np.ones(len(v))]@ (np.linalg.inv(rest[hand])@rest[2]).T;p=p[:,:3]
  # Local Y runs wrist→fingers; both imported hands use the same digit ordering.
  sign=1;q=p.copy()
  # Boundaries follow the four actual gaps at the knuckles, plus thumb web.
  finger=np.full(len(v),-1);finger[mask&(q[:,2]<-4)&(q[:,1]>5.8)]=0
  for k,(lo,hi,base)in enumerate([(-4,-.35,13.6),(-.35,2.5,13.6),(2.5,4.65,12.8),(4.65,10,11.4)],1):finger[mask&(q[:,2]>=lo)&(q[:,2]<hi)&(q[:,1]>base)]=k
  pivots=[(6,-4),(14,-2.2),(14,1),(13.1,3.5),(11.8,5.2)]
  for k,((y,z),name)in enumerate(zip(pivots,['Thumb','Index','Middle','Ring','Little'])):
   ix=np.flatnonzero(finger==k);assert len(ix)>15,(side,name,len(ix))
   # Palm-plane thickness varies: hinge uses the median at the base ring.
   near=ix[np.argsort(abs(q[ix,1]-y))[:min(25,len(ix))]];pivot=[float(np.median(p[near,0])),y,z*sign]
   node=len(g['nodes']);g['nodes'].append({'name':side+name,'translation':pivot,'rotation':[0,0,0,1]});g['nodes'][hand].setdefault('children',[]).append(node)
   local=np.eye(4);local[:3,3]=pivot;world=rest[hand]@local
   ji=len(joints);joints.append(node);ib.append(np.linalg.inv(world)@rest[2])
   # One rigid finger plate per visible digit. The mesh has no mid-finger hinge loops.
   j[ix]=0;weights[ix]=0;j[ix,0]=ji;weights[ix,0]=1
   # A small curl about hand-local Z brings rigid fingers toward the palm.
   # Left and right hand frames have opposite palmar X direction.
   meta.append({'node':node,'hand':hand,'name':side+name,'sign':1 if side=='Left'else -1,'vertices':len(ix),'pivot':pivot})
 return j,weights,np.array(ib),joints,meta
