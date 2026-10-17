"""Bake Worker 01 head contacts from original arm motion, with an unchanged elbow curve.

Two fingertip/scalp beats and a separate palm/temple gesture follow actual head
surface triangles. Offline only: no IK, collision queries or physics in the client.
Run after the source-arm rebuild. Only corrected Scratch shoulder, wrist and finger rotations are replaced.
The source elbow sampler is copied exactly: contact fitting cannot overfold it.
"""
import argparse,struct
from worker_motion import *
from worker_acting import frame,unit,window
from scipy.optimize import least_squares
from scipy.spatial import ConvexHull
p=argparse.ArgumentParser(description=__doc__);p.add_argument('input',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
b=Worker(args.input,True);g=b.g
assert [b.nodes[i]['name'] for i in [19,20,22,26]]==['RightArm','Head','RightForeArm','RightHand']
assert len(b.d['sk']['joints'])==34, 'Requires the accepted articulated Worker 01 rig.'
clip=next(c for c in g['animations']if c['name']=='Confused_Scratch_Corrected');source=next(c for c in g['animations']if c['name']=='Confused_Scratch')
ts,local,world=b.sample(clip,60);_,original,ow=b.sample(source,60)
# Always derive the acting arm from the original; keep the existing lower body and left arm.
local[:,[19,22,26]]=original[:,[19,22,26]];world=b.world(local)
baseworld=world.copy()
# Fingertip landmarks are the distal skin vertices, not a guessed wrist offset.
digits={b.nodes[i]['name'].replace('Right',''):i for i in range(33,38)}
handids=b.region_ids['handR'];landmarks={}
for name,node in digits.items():
 ji=b.d['sk']['joints'].index(node);ids=np.flatnonzero((b.w*(b.j==ji)).sum(1)>.95)
 v=b.skin(b.bind);p=(np.c_[v[ids],np.ones(len(ids))]@np.linalg.inv(b.bind[node]).T)[:,:3]
 landmarks[name]=ids[p[:,1]>=np.percentile(p[:,1],92)]
# Precompute the head surface in anatomical coordinates, rays hit actual triangles.
bindv=b.skin(b.bind);hframe=frame(b.bind,b,20);hv=(bindv-b.bind[20,:3,3])@hframe
hf=b.reg['head'];hull=ConvexHull(hv[b.region_ids['head']]);eq=hull.equations

def surface(direction):
 origin=np.array([0,.075,.005]);d=unit(direction);a=hv[hf[:,0]];e1=hv[hf[:,1]]-a;e2=hv[hf[:,2]]-a
 q=np.cross(np.broadcast_to(d,e2.shape),e2);det=np.einsum('ij,ij->i',e1,q);inv=np.divide(1.,det,out=np.zeros_like(det),where=abs(det)>1e-9)
 s=origin-a;u=np.einsum('ij,ij->i',s,q)*inv;r=np.cross(s,e1);v=r@d*inv;t=np.einsum('ij,ij->i',e2,r)*inv
 good=(abs(det)>1e-9)&(u>=0)&(v>=0)&(u+v<=1)&(t>0);ids=np.flatnonzero(good);i=ids[np.argmax(t[ids])]
 n=unit(np.cross(e1[i],e2[i]));n*=np.sign(np.dot(n,d));return (hf[i],np.array([1-u[i]-v[i],u[i],v[i]]),n)
patches={
 'scalp':[surface([-.075,.085,-.012]),surface([-.075,.085,.023])],
 'temple':[surface([-.12,.025,-.015]),surface([-.12,.025,.020])]
}
print('patches',[(key,[(weights@hv[ids]).tolist()for ids,weights,n in values])for key,values in patches.items()],flush=True)

prev=np.zeros(6)
for k,t in enumerate(ts):
 w=world[k];u=max(window(t,.45,.90,2.12,2.55),window(t,2.65,3.10,4.15,4.9),window(t,7.3,7.78,8.9,9.5))
 if u<1e-6:continue
 kind='temple'if 2.6<t<5 else 'scalp'
 # Digit plates remain relaxed: shape contact with the arm, not extreme wrist curl.
 for name,i in digits.items():
  parent=b.parent[i];cur=np.linalg.inv(w[parent])@w[i];angle=-np.radians({'Thumb':18,'Index':24,'Middle':27,'Ring':30,'Little':32}[name]);rot=R.from_rotvec([0,0,angle]).as_matrix();b.rotate_chain(w,i,w[parent,:3,:3]@rot@np.linalg.inv(cur[:3,:3])@np.linalg.inv(w[parent,:3,:3]))
 v=b.skin(w);hm=np.linalg.inv(w[26]);handlocal=np.c_[v[handids],np.ones(len(handids))]@hm.T
 tiplocal=np.array([(np.c_[v[landmarks[name]],np.ones(len(landmarks[name]))]@hm.T).mean(0)for name in ['Index','Middle']])
 if kind=='temple':
  # Bone-local coordinates are centimetres; world-space contact targets are metres.
  palm=handlocal[(handlocal[:,0]>1.5)&(handlocal[:,1]>7)&(handlocal[:,1]<11.5)]
  assert len(palm)>0, 'Palm landmarks changed; refit the regenerated geometry.'
  tiplocal=np.array([palm.mean(0),palm.mean(0)])
 # A constant material point follows head rotation/translation; small tangential stroke.
 hb=frame(w,b,20);head=w[20,:3,3];targets=np.array([weights@v[ids]+hb@n*.012 for ids,weights,n in patches[kind]])
 if kind=='scalp':targets+=hb[:,1]*.003*np.sin(2*np.pi*2.4*t)
 else:targets[:]=targets.mean(0)
 def pose(x):
  q=w.copy();sr=w[19,:3,:3]/np.linalg.norm(w[19,:3,:3],axis=0);b.rotate_chain(q,19,sr@R.from_rotvec(x[:3]).as_matrix()@sr.T)
  wr=q[26,:3,:3]/np.linalg.norm(q[26,:3,:3],axis=0);b.rotate_chain(q,26,wr@R.from_rotvec(x[3:]).as_matrix()@wr.T)
  return q
 def residual(x):
  q=pose(x);tips=(tiplocal@q[26].T)[:,:3];hp=(handlocal[::2]@q[26].T)[:,:3];pl=(hp-head)@hb
  sd=(pl@eq[:,:3].T+eq[:,3]).max(1)
  return np.r_[(tips-targets).ravel()*6,np.maximum(.008-sd,0)*12,x*np.array([.05,.05,.05,.015,.015,.015]),(x-prev)*.008]
 lo=np.array([-1.5,-1.5,-1.5,-1.65,-1.65,-1.65]);hi=-lo
 opt=least_squares(residual,np.clip(prev,lo,hi),bounds=(lo,hi),max_nfev=100,ftol=1e-7,xtol=1e-7,gtol=1e-7)
 prev=opt.x
 q=pose(opt.x);tips=(tiplocal@q[26].T)[:,:3];error=np.linalg.norm(tips-targets,axis=1)
 world[k]=pose(opt.x*u)
 # Fade each rigid finger hinge into its existing relaxed pose.
 for i in digits.values():
  parent=b.parent[i];base=np.linalg.inv(baseworld[k,parent])@baseworld[k,i];end=np.linalg.inv(world[k,parent])@world[k,i];scale=np.linalg.norm(end[:3,:3],axis=0);ra=base[:3,:3]/np.linalg.norm(base[:3,:3],axis=0);rz=end[:3,:3]/scale
  blend=ra@R.from_rotvec(R.from_matrix(ra.T@rz).as_rotvec()*u).as_matrix();desired=world[k,parent,:3,:3]@blend@np.diag(scale);b.rotate_chain(world[k],i,desired@np.linalg.inv(world[k,i,:3,:3]))
 if k%60==0:print(round(t,2),max(error)*1000,flush=True)

data=bytearray(b.d['data'])
def add(arr,kind):
 arr=np.asarray(arr,dtype='<f4');data.extend(b'\0'*((-len(data))%4));off=len(data);data.extend(arr.tobytes());g['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':arr.nbytes});a={'bufferView':len(g['bufferViews'])-1,'componentType':5126,'count':len(arr),'type':kind}
 if kind=='SCALAR':a.update(min=[float(arr.min())],max=[float(arr.max())])
 g['accessors'].append(a);return len(g['accessors'])-1

def bake(clip,ts,local,nodes):
 for c in clip['channels']:
  node=c['target']['node'];path=c['target']['path']
  if node not in nodes or path!='rotation':continue
  r=local[:,node,:3,:3];q=R.from_matrix(r/np.linalg.norm(r,axis=1)[:,None,:]).as_quat()
  for k in range(1,len(q)):
   if np.dot(q[k-1],q[k])<0:q[k]*=-1
  keep={0,len(ts)-1}
  def reduce(a,z):
   if z-a<2:return
   u=((ts[a+1:z]-ts[a])/(ts[z]-ts[a]))[:,None];pred=q[a]+u*(q[z]-q[a]);pred/=np.linalg.norm(pred,axis=1)[:,None];err=np.linalg.norm(pred-q[a+1:z],axis=1);k=int(err.argmax())+a+1
   if err.max()>1e-5:keep.add(k);reduce(a,k);reduce(k,z)
  reduce(0,len(ts)-1);ix=np.array(sorted(keep));s=clip['samplers'][c['sampler']];s.update(input=add(ts[ix],'SCALAR'),output=add(q[ix],'VEC4'))



out=world.copy()
for n in b.order:
 if n in b.parent:out[:,n]=np.linalg.inv(world[:,b.parent[n]])@world[:,n]
bake(clip,ts,out,[19,26,33,34,35,36,37])
# Copy the untouched source curve instead of numerically rebaking the joint.
source_elbow=next(c for c in source['channels']if c['target']=={'node':22,'path':'rotation'})
corrected_elbow=next(c for c in clip['channels']if c['target']=={'node':22,'path':'rotation'})
clip['samplers'][corrected_elbow['sampler']]=dict(source['samplers'][source_elbow['sampler']])
g['buffers']=[{'byteLength':len(data)}];j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4)
args.output.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data)
