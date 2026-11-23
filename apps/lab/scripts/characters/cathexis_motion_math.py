"""Offline glTF skin evaluation used by CATHEXIS baking and clearance checks."""
import json,struct,math
import numpy as np

def load(path):
 b=path.read_bytes();n=struct.unpack_from('<I',b,12)[0];g=json.loads(b[20:20+n]);data=memoryview(b)[28+n:]
 return g,data

def accessor(g,data,i):
 a=g['accessors'][i];v=g['bufferViews'][a['bufferView']];size={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']];dt=np.dtype({5126:'<f4',5125:'<u4',5123:'<u2',5121:'u1'}[a['componentType']]);return np.ndarray((a['count'],size),dtype=dt,buffer=data,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',dt.itemsize*size),dt.itemsize)).astype(float)
def qm(q):
 q=q/np.linalg.norm(q);x,y,z,w=q;return np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
def mat(n):
 if 'matrix'in n:return np.array(n['matrix']).reshape(4,4).T
 a=np.eye(4);a[:3,:3]=qm(n.get('rotation',[0,0,0,1]))@np.diag(n.get('scale',[1,1,1]));a[:3,3]=n.get('translation',[0,0,0]);return a
def world_at(nodes,tr,t):
 parents={c:i for i,n in enumerate(nodes)for c in n.get('children',[])}
 local=[dict(n)for n in nodes]
 for i,kind,ks,vs in tr:
  ix=max(0,min(len(ks)-1,np.searchsorted(ks,t,side='right')-1));iy=min(len(ks)-1,ix+1);z=0 if iy==ix else np.clip((t-ks[ix])/(ks[iy]-ks[ix]),0,1);a,b=vs[ix].copy(),vs[iy].copy()
  if kind=='rotation':
   a/=np.linalg.norm(a);b/=np.linalg.norm(b);d=np.dot(a,b)
   if d<0:b=-b;d=-d
   if d>.9995:v=a+(b-a)*z;v/=np.linalg.norm(v)
   else:th=math.acos(min(1,d));v=(math.sin((1-z)*th)*a+math.sin(z*th)*b)/math.sin(th)
  else:v=a+(b-a)*z
  local[i][kind]=v
 w={}
 def get(i):
  if i not in w:w[i]=(get(parents[i])if i in parents else np.eye(4))@mat(local[i])
  return w[i]
 return np.array([get(i)for i in range(len(nodes))])

def cloth_regions(v,f):
 from scipy.sparse import coo_matrix
 from scipy.sparse.csgraph import connected_components
 u,inv=np.unique(np.round(v,5),axis=0,return_inverse=True);ff=inv[f[np.all(v[f,1]<.85,axis=1)]]
 ii=ff[:,[0,1,2]].ravel();jj=ff[:,[1,2,0]].ravel();_,labels=connected_components(coo_matrix((np.ones(len(ii)),(ii,jj)),shape=(len(u),len(u))),directed=False);labels=labels[inv]
 ids,counts=np.unique(labels,return_counts=True);ordered=ids[np.argsort(-counts)];cloth=labels==ordered[0];legs=np.isin(labels,ordered[1:3])
 assert cloth.sum()==23889 and legs.sum()==7498, 'Geometry segmentation changed; inspect before baking.'
 return cloth,legs

def context(path):
 g,data=load(path);acc=lambda i:accessor(g,data,i);nodes=g['nodes'];prim=g['meshes'][0]['primitives'][0];verts=acc(prim['attributes']['POSITION']);sk=g['skins'][0]
 return dict(g=g,data=data,acc=acc,verts=verts,js=acc(prim['attributes']['JOINTS_0']).astype(int),ws=acc(prim['attributes']['WEIGHTS_0']),ib=acc(sk['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1),sk=sk,prim=prim,tracks=lambda c:[(x['target']['node'],x['target']['path'],acc(c['samplers'][x['sampler']]['input'])[:,0],acc(c['samplers'][x['sampler']]['output']))for x in c['channels']],world_at=lambda tr,t:world_at(nodes,tr,t))
