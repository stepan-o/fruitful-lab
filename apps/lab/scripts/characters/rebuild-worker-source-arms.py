"""Rebuild rejected arm acting from the untouched source channels.

Only Scratch's right arm and Fall's left arm change. Preserve source-local elbow
curves exactly; shoulder clearance rotates a complete chain, never an elbow pole.
Run after the general contact fitter and before immutable asset publication.
"""
import struct,copy,argparse
from worker_motion import *
from worker_acting import unit,window,frame
from worker_correct import swing
from scipy.ndimage import gaussian_filter1d, maximum_filter1d
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('input',type=Path);parser.add_argument('output',type=Path)
args=parser.parse_args();b=Worker(args.input,corrected=True)
assert [b.nodes[n]['name']for n in [18,19,21,22,25,26]]==['LeftArm','RightArm','LeftForeArm','RightForeArm','LeftHand','RightHand']
assert len(b.d['sk']['joints'])==34,'Use the articulated Worker 01 bank.'
g=b.g;data=bytearray(b.d['data'])
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

for name in ['Confused_Scratch','Electrocuted_Fall']:
 src=next(c for c in g['animations']if c['name']==name);clip=next(c for c in g['animations']if c['name']==name+'_Corrected')
 ts,local,world=b.sample(clip,120);_,original,ow=b.sample(src,120)
 nodes=[19,22,26] if name=='Confused_Scratch' else [18,21,25]
 local[:,nodes]=original[:,nodes]
 world=b.world(local)
 digits=[i for i,n in enumerate(b.nodes)if n.get('name','')in [hand+d for hand in ['Right'] for d in ['Thumb','Index','Middle','Ring','Little']]]
 for k,t in enumerate(ts):
  w=world[k]
  if name=='Confused_Scratch':
   # Preserve all original elbow rotations, and the middle puzzled gesture.
   u=max(window(t,.55,1.05,2.12,2.65),window(t,7.5,8.02,8.82,9.42))
   # Flex through the source wrist's palm axis, without adding a new twist.
   cur=w[26,:3,:3].copy();cur/=np.linalg.norm(cur,axis=0)
   b.rotate_chain(w,26,cur@R.from_rotvec([0,0,-np.radians(65)*u]).as_matrix()@cur.T)
   # Loose fingers at rest, gentler bend during the open puzzled gesture.
   for i in digits:
    digit=b.nodes[i]['name'].replace('Left','').replace('Right','');factor=[.6,1,1.1,1.2,1.3][['Thumb','Index','Middle','Ring','Little'].index(digit)]
    angle=-(20+22*u)*factor
    parent=b.parent[i];current=np.linalg.inv(w[parent])@w[i];q=R.from_rotvec([0,0,np.radians(angle)]).as_matrix();b.rotate_chain(w,i,w[parent,:3,:3]@q@np.linalg.inv(current[:3,:3])@np.linalg.inv(w[parent,:3,:3]))
 if name=='Confused_Scratch':
  offsets=np.zeros(len(ts));directions=[]
  for k,w in enumerate(world):
   direction=unit(frame(w,b,20)@np.array([-1,.15,.15]));directions.append(direction)
   for h in np.arange(0,.181,.004):
    q=w.copy();v=q[26,:3,3]-q[19,:3,3];b.rotate_chain(q,19,swing(v,v+direction*h))
    if not b.intersects(b.skin(q),[('handR','head'),('foreR','torso'),('handR','legR')]):offsets[k]=h;break
   else:raise RuntimeError(f'Scratch needs manual clearance at {ts[k]:.3f}s')
  offsets=gaussian_filter1d(maximum_filter1d(offsets,size=17),sigma=3)
  for k,w in enumerate(world):
   v=w[26,:3,3]-w[19,:3,3];b.rotate_chain(w,19,swing(v,v+directions[k]*offsets[k]))
  print('Scratch clearance offset',offsets.max(),flush=True)
 # Minimal smooth shoulder lift keeps the source wrist and elbow intact.
 if name=='Electrocuted_Fall':
  offsets=np.zeros(len(ts))
  for k,w in enumerate(world):
   if ts[k]<3.4:continue
   for h in np.arange(0,.201,.002):
    q=w.copy();v=q[25,:3,3]-q[18,:3,3];b.rotate_chain(q,18,swing(v,v+np.array([0,h,0])))
    if b.skin(q)[b.region_ids['handL'],1].min()>=.003:offsets[k]=h;break
   else:raise RuntimeError(f'Fall needs manual floor fitting at {ts[k]:.3f}s')
  offsets=gaussian_filter1d(maximum_filter1d(offsets,size=15),sigma=3)
  for k,w in enumerate(world):
   v=w[25,:3,3]-w[18,:3,3];b.rotate_chain(w,18,swing(v,v+np.array([0,offsets[k],0])))
  print('Fall shoulder lift',offsets.max())
 out=world.copy()
 for n in b.order:
  if n in b.parent:out[:,n]=np.linalg.inv(world[:,b.parent[n]])@world[:,n]
 exact=[22] if name=='Confused_Scratch' else [21,25]
 bake(clip,ts,out,[n for n in nodes if n not in exact]+(digits if name=='Confused_Scratch'else []))
 # Reuse the actual source samples, not a resampled approximation of the hinge.
 for c in clip['channels']:
  if c['target']['node'] in exact and c['target']['path']=='rotation':
   source=next(x for x in src['channels']if x['target']==c['target'])
   clip['samplers'][c['sampler']]=copy.deepcopy(src['samplers'][source['sampler']])
 print(name,'rebuilt')
g['buffers']=[{'byteLength':len(data)}];j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4)
args.output.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data)
