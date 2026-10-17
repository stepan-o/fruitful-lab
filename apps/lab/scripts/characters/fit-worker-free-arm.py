"""Give Scratch the connected, hanging left-arm chain from Alert.

The approved scratching arm and every other clip remain byte-identical.
Only left arm/forearm/hand/finger rotations are replaced. Alert supplies the
resting posture; lowered beats mirror the approved right-arm swing through
the bind frames. The original clavicle and torso still drive the chain.
There is no pinned wrist target or runtime solver.
"""
import argparse,struct
from worker_motion import *
from worker_acting import window,frame
p=argparse.ArgumentParser(description=__doc__);p.add_argument('input',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
b=Worker(args.input,True);g=b.g
clip=next(c for c in g['animations']if c['name']=='Confused_Scratch_Corrected')
reference=next(c for c in g['animations']if c['name']=='Alert_Corrected')
names={'LeftArm','LeftForeArm','LeftHand','LeftThumb','LeftIndex','LeftMiddle','LeftRing','LeftLittle'}
duration=max(t[-1]for _,_,t,_ in b.d['tracks'](clip));refduration=max(t[-1]for _,_,t,_ in b.d['tracks'](reference))
reftracks={(n,path):(t,v) for n,path,t,v in b.d['tracks'](reference)}
data=bytearray(b.d['data'])
def add(arr,kind):
 arr=np.asarray(arr,dtype='<f4');data.extend(b'\0'*((-len(data))%4));off=len(data);data.extend(arr.tobytes());g['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':arr.nbytes});a={'bufferView':len(g['bufferViews'])-1,'componentType':5126,'count':len(arr),'type':kind}
 if kind=='SCALAR':a.update(min=[float(arr.min())],max=[float(arr.max())])
 g['accessors'].append(a);return len(g['accessors'])-1
# Alert supplies the resting posture. During the source's lowered-arm beats,
# mirror the approved right chain so both arms follow the same body recoil.
# Reflection is expressed through each joint's bind frame; lengths stay intact.
ts,local,_=b.sample(clip,60)
reflection=np.diag([-1.,1.,1.])
def rotation(m):return m[:3,:3]/np.linalg.norm(m[:3,:3],axis=0)
mirror={18:19,21:22,25:26}
curves={}
for n,r in mirror.items():
 pre=rotation(b.bind[b.parent[n]]).T@reflection@rotation(b.bind[b.parent[r]])
 post=rotation(b.bind[r]).T@reflection@rotation(b.bind[n])
 t,v=reftracks[(n,'rotation')];base=Slerp(t,R.from_quat(v))(np.clip(ts*refduration/duration,t[0],t[-1])).as_matrix()
 source=pre@(local[:,r,:3,:3]/np.linalg.norm(local[:,r,:3,:3],axis=1)[:,None,:])@post
 # Avoid mirroring any head-reaching or puzzled pointing motion.
 weight=np.array([max(window(x,4.65,5.25,5.9,6.6),window(x,9.65,10.25,100,101))for x in ts])
 delta=R.from_matrix(base.transpose(0,2,1)@source).as_rotvec()*weight[:,None]
 q=R.from_matrix(base@R.from_rotvec(delta).as_matrix()).as_quat()
 for k in range(1,len(q)):
  if q[k-1]@q[k]<0:q[k]*=-1
 curves[n]=(ts,q)
# A small whole-chain shoulder arc clears the thigh during the release blend.
# The elbow/hand relation stays intact; no pointwise contact pushing.
blended=local.copy()
for n,(tt,q) in curves.items():
 blended[:,n,:3,:3]=R.from_quat(q).as_matrix()*np.linalg.norm(local[:,n,:3,:3],axis=1)[:,None,:]
w=b.world(blended)
for k,t in enumerate(ts):
 angle=np.radians(3)*window(t,4.5,4.75,5.0,5.25)
 b.rotate_chain(w[k],18,R.from_rotvec(frame(w[k],b)[:,2]*angle).as_matrix())
parent=b.parent[18]
newlocal=np.linalg.inv(w[:,parent])@w[:,18]
q=R.from_matrix(newlocal[:,:3,:3]/np.linalg.norm(newlocal[:,:3,:3],axis=1)[:,None,:]).as_quat()
for k in range(1,len(q)):
 if q[k-1]@q[k]<0:q[k]*=-1
curves[18]=(ts,q)
changed=[]
for c in clip['channels']:
 n=c['target']['node'];path=c['target']['path']
 if b.nodes[n].get('name')not in names or path!='rotation':continue
 t,v=curves[n] if n in curves else reftracks[(n,path)]
 scale=1 if n in curves else duration/refduration
 # Reuse the full source curve and interpolation; only stretch its time domain.
 sampler=clip['samplers'][c['sampler']];sampler.update(input=add(t*scale,'SCALAR'),output=add(v,'VEC4'))
 changed.append(b.nodes[n]['name'])
assert set(changed)==names,changed
g['buffers']=[{'byteLength':len(data)}];j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4)
args.output.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data)
print('Alert-referenced free arm; approved scratch unchanged:',changed)
