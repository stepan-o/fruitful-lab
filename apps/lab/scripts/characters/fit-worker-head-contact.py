"""Bake palm-led Worker scratch acting and a relaxed free arm.

Targets follow the actual head surface. A two-bone solve preserves the source
elbow bend plane while bounding flexion; the hand receives a complete contact
orientation instead of an unconstrained wrist fit. All work is offline.
"""
import argparse,struct
from worker_motion import *
from worker_acting import frame,unit,window,arm,palm_frame
p=argparse.ArgumentParser(description=__doc__);p.add_argument('input',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
b=Worker(args.input,True);g=b.g
assert [b.nodes[i]['name'] for i in [19,20,22,26]]==['RightArm','Head','RightForeArm','RightHand']
assert len(b.d['sk']['joints'])==34, 'Requires the accepted articulated Worker 01 rig.'
clip=next(c for c in g['animations']if c['name']=='Confused_Scratch_Corrected');source=next(c for c in g['animations']if c['name']=='Confused_Scratch')
ts,local,world=b.sample(clip,60);_,original,ow=b.sample(source,60)
# Derive the reaching arm from source. Retain lower-body cleanup; author the free arm below.
local[:,[19,22,26]]=original[:,[19,22,26]];world=b.world(local)
baseworld=world.copy()
digits={b.nodes[i]['name'].replace('Right',''):i for i in range(33,38)}
handids=b.region_ids['handR']
# Precompute the head surface in anatomical coordinates, rays hit actual triangles.
bindv=b.skin(b.bind);hframe=frame(b.bind,b,20);hv=(bindv-b.bind[20,:3,3])@hframe
hf=b.reg['head']

def surface(direction):
 origin=np.array([0,.075,.005]);d=unit(direction);a=hv[hf[:,0]];e1=hv[hf[:,1]]-a;e2=hv[hf[:,2]]-a
 q=np.cross(np.broadcast_to(d,e2.shape),e2);det=np.einsum('ij,ij->i',e1,q);inv=np.divide(1.,det,out=np.zeros_like(det),where=abs(det)>1e-9)
 s=origin-a;u=np.einsum('ij,ij->i',s,q)*inv;r=np.cross(s,e1);v=r@d*inv;t=np.einsum('ij,ij->i',e2,r)*inv
 good=(abs(det)>1e-9)&(u>=0)&(v>=0)&(u+v<=1)&(t>0);ids=np.flatnonzero(good);i=ids[np.argmax(t[ids])]
 n=unit(np.cross(e1[i],e2[i]));n*=np.sign(np.dot(n,d));return (hf[i],np.array([1-u[i]-v[i],u[i],v[i]]),n)
# Fit a real central palm triangle; the generated palm is tilted relative to the bone X axis.
localhand=np.c_[bindv,np.ones(len(bindv))]@np.linalg.inv(b.bind[26]).T
ji=b.d['sk']['joints'].index(26);rigid=(b.w*(b.j==ji)).sum(1)>.95
pf=b.f[np.all(rigid[b.f],axis=1)];pv=localhand[:,:3]
origin=np.array([-10,9.5,1.0]);ray=np.array([1.,0,0]);a=pv[pf[:,0]];e1=pv[pf[:,1]]-a;e2=pv[pf[:,2]]-a
q=np.cross(np.broadcast_to(ray,e2.shape),e2);det=np.einsum('ij,ij->i',e1,q);inv=np.divide(1.,det,out=np.zeros_like(det),where=abs(det)>1e-9)
d=origin-a;u=np.einsum('ij,ij->i',d,q)*inv;r=np.cross(d,e1);v=r@ray*inv;depth=np.einsum('ij,ij->i',e2,r)*inv
ids=np.flatnonzero((abs(det)>1e-9)&(u>=0)&(v>=0)&(u+v<=1)&(depth>0));ix=ids[np.argmax(depth[ids])]
palm_ids=pf[ix];palm_weights=np.array([1-u[ix]-v[ix],u[ix],v[ix]]);palm_normal=unit(np.cross(e1[ix],e2[ix]));palm_normal*=np.sign(palm_normal@ray)
palm_y=unit(np.array([0,1.,0])-palm_normal*palm_normal[1]);palm_basis=np.column_stack([palm_normal,palm_y,np.cross(palm_normal,palm_y)])
print('central palm',palm_weights@pv[palm_ids], 'normal',palm_normal,flush=True)

def hinge_arm(w,target,pole,orientation,weight):
 old=w.copy();q=w.copy();s,e,h=q[[19,22,26],:3,3]
 l1=np.linalg.norm(e-s);l2=np.linalg.norm(h-e);axis=unit(target-s)
 # At most 130 degrees of flexion: never fold the plated forearm into the upper arm.
 minimum=np.sqrt(l1*l1+l2*l2+2*l1*l2*np.cos(np.radians(130)))
 reach=np.clip(np.linalg.norm(target-s),minimum,l1+l2-.006);target=s+axis*reach
 lateral=unit(pole-s-axis*np.dot(pole-s,axis));along=(l1*l1-l2*l2+reach*reach)/(2*reach)
 elbow=s+axis*along+lateral*np.sqrt(max(0,l1*l1-along*along))
 def hinge_frame(a,z):
  y=unit(a);n=unit(np.cross(a,z));return np.column_stack([y,n,np.cross(y,n)])
 source=hinge_frame(e-s,h-e);dest=hinge_frame(elbow-s,target-elbow)
 b.rotate_chain(q,19,dest@source.T)
 from worker_correct import swing
 b.rotate_chain(q,22,swing(q[26,:3,3]-q[22,:3,3],target-q[22,:3,3]))
 cur=q[26,:3,:3];b.rotate_chain(q,26,orientation@np.linalg.inv(cur/np.linalg.norm(cur,axis=0)))
 for node in [19,22,26]:
  parent=b.parent[node];a=np.linalg.inv(old[parent])@old[node];z=np.linalg.inv(q[parent])@q[node];sc=np.linalg.norm(a[:3,:3],axis=0)
  ra=a[:3,:3]/sc;rz=z[:3,:3]/np.linalg.norm(z[:3,:3],axis=0);r=ra@R.from_rotvec(R.from_matrix(ra.T@rz).as_rotvec()*weight).as_matrix()
  b.rotate_chain(w,node,w[parent,:3,:3]@r@np.diag(sc)@np.linalg.inv(w[node,:3,:3]))

# Use a complete authored arm pose: a measured palm patch, restrained elbow pole,
# and a hand direction continuous with the forearm. No free per-frame wrist solve.
for k,t in enumerate(ts):
 w=world[k];basis=frame(w,b);hip=w[3,:3,3]
 target=hip+basis@np.array([.315,-.06,.10]);pole=hip+basis@np.array([.39,.13,-.02])
 arm(b,w,'L',target,pole)
 direction=unit(w[25,:3,3]-w[21,:3,3]);orientation=palm_frame(basis@np.array([-1,0,.12]),direction,1)
 cur=w[25,:3,:3];b.rotate_chain(w,25,orientation@np.linalg.inv(cur/np.linalg.norm(cur,axis=0)))
 for i in range(28,33):
  parent=b.parent[i];cur=np.linalg.inv(w[parent])@w[i];rot=R.from_rotvec([0,0,np.radians(26 if i==28 else 48)]).as_matrix();b.rotate_chain(w,i,w[parent,:3,:3]@rot@np.linalg.inv(cur[:3,:3])@np.linalg.inv(w[parent,:3,:3]))
 u=max(window(t,.45,.90,4.15,4.9),window(t,7.3,7.78,8.9,9.5))
 scratching=max(window(t,.45,.90,2.22,3.10),window(t,7.3,7.78,8.9,9.5))
 if u<1e-6:continue
 hb=frame(w,b,20);head=w[20,:3,3]
 for name,i in digits.items():
  parent=b.parent[i];cur=np.linalg.inv(w[parent])@w[i];angle=-np.radians({'Thumb':12,'Index':2,'Middle':4,'Ring':6,'Little':8}[name]);rot=R.from_rotvec([0,0,angle]).as_matrix();b.rotate_chain(w,i,w[parent,:3,:3]@rot@np.linalg.inv(cur[:3,:3])@np.linalg.inv(w[parent,:3,:3]))
 v=b.skin(w);hm=np.linalg.inv(w[26]);handlocal=np.c_[v[handids],np.ones(len(handids))]@hm.T
 landmark=palm_weights@(np.c_[v[palm_ids],np.ones(3)]@hm.T)
 ids,weights,n=surface([-.055,.1,.015])
 target=weights@v[ids]+hb@n*.012
 target+=hb[:,1]*.003*np.sin(2*np.pi*2.4*t)*scratching
 inward=-hb@n
 fingers=hb@np.array([.95,.3,0])
 orientation=palm_frame(inward,fingers,-1)@palm_basis.T
 wrist=target-orientation@(landmark[:3]*.01)
 pole=wrist-orientation[:,1]*np.linalg.norm(w[26,:3,3]-w[22,:3,3])+hb@np.array([0,-.025,.045])
 hinge_arm(w,wrist,pole,orientation,u)
 # Blend fingers out of the existing relaxed hand without changing bone lengths.
 for i in digits.values():
  parent=b.parent[i];base=np.linalg.inv(baseworld[k,parent])@baseworld[k,i];end=np.linalg.inv(w[parent])@w[i];scale=np.linalg.norm(end[:3,:3],axis=0);ra=base[:3,:3]/np.linalg.norm(base[:3,:3],axis=0);rz=end[:3,:3]/scale
  blend=ra@R.from_rotvec(R.from_matrix(ra.T@rz).as_rotvec()*u).as_matrix();desired=w[parent,:3,:3]@blend@np.diag(scale);b.rotate_chain(w,i,desired@np.linalg.inv(w[i,:3,:3]))
 if k%60==0:print(round(t,2),"palm contact",flush=True)

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
bake(clip,ts,out,[18,21,25,19,22,26,*range(28,38)])
g['buffers']=[{'byteLength':len(data)}];j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4)
args.output.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data)
