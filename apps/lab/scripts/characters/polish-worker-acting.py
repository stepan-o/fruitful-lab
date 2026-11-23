"""Fit authored hand contacts against the exported, articulated worker mesh.

This pass adjusts only arm rotations. It measures the actual skinned triangles,
then smooths small wrist offsets before baking them. Source tracks stay untouched.
"""
from worker_motion import *
from worker_acting import arm,frame,unit
from worker_correct import swing
import argparse,struct
p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('output',type=Path);p.add_argument('--clips',nargs='*');p.add_argument('--rate',type=int,default=20);a=p.parse_args()
b=Worker(a.source,True);g=b.g;data=bytearray(b.d['data']);records=[]
def shifted(w,offsets):
 q=w.copy()
 for side,hand,elbow in [('L',25,21),('R',26,22)]:
  v=offsets[0 if side=='L'else 1]
  if np.linalg.norm(v)<1e-8:continue
  m=w[hand,:3,:3];rot=m/np.linalg.norm(m,axis=0)
  if active_name in ['Angry_Stomp','Catching_Breath','Discuss_While_Moving','Listening_Gesture','idle','Alert','Idle_Turn_Left','Idle_Turn_Right']:
   upper=18 if side=='L'else 19;direction=w[hand,:3,3]-w[upper,:3,3];b.rotate_chain(q,upper,swing(direction,direction+v))
  else:arm(b,q,side,w[hand,:3,3]+v,w[elbow,:3,3]+v*.6,rot)
 return q

def requirement(w,name):
 basis=frame(w,b);x,y,z=basis.T;offset=np.zeros((2,3));q=w.copy()
 for repeat in range(3):
  hits=b.contacts(b.skin(q));changed=False
  for i,(left,right)in enumerate(b.pairs):
   if i==0 or not hits[i]:continue
   directions=np.zeros((2,3))
   if (left,right)==('foreL','foreR'):
    if name=='Angry_Stomp':directions[0]=unit(-frame(q,b,12)[:,1]+frame(q,b,12)[:,2]*.3)
    else:directions[0]=x;directions[1]=-x
   elif right=='head':
    side=0 if left=='handL'else 1;hand=25+side;directions[side]=unit(q[hand,:3,3]-q[20,:3,3])
   elif right=='torso':directions[0 if left=='foreL'else 1]=z
   elif right.startswith('leg'):
    side=0 if left=='handL'else 1;directions[side]=unit(x*(1 if side==0 else -1)+z*.3)
   candidates=[directions]
   if right.startswith('leg'):
    side=0 if left=='handL'else 1;sg=1 if side==0 else -1
    for direction in [x*sg,z,-z,x*sg+z,x*sg-z,-y+x*sg*.2]:
     option=np.zeros((2,3));option[side]=unit(direction);candidates.append(option)
   best=None
   for directions in candidates:
    low=0.
    for high in [.008,.016,.03,.05,.08,.12]:
     test=shifted(w,offset+directions*high)
     if not b.intersects(b.skin(test),[(left,right)]):
      for _ in range(5):
       mid=(low+high)/2
       if b.intersects(b.skin(shifted(w,offset+directions*mid)),[(left,right)]):low=mid
       else:high=mid
      if best is None or high<best[0]:best=(high,directions)
      break
     low=high
   if best is None:continue
   amount,directions=best;offset+=directions*(amount+.004);q=shifted(w,offset);changed=True
  # The floor is an actual surface, not one of the body-region pairs.
  if name=='Electrocuted_Fall':
   v=b.skin(q)
   for ix,key in enumerate(['handL','handR']):
    low=v[b.region_ids[key],1].min()
    if low<.002:offset[ix,1]+=.002-low;changed=True
   q=shifted(w,offset)
  if not changed:break
 return offset

def add(arr,kind):
 arr=np.asarray(arr,dtype='<f4');data.extend(b'\0'*((-len(data))%4));offset=len(data);data.extend(arr.tobytes());g['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':arr.nbytes});v={'bufferView':len(g['bufferViews'])-1,'componentType':5126,'count':len(arr),'type':kind}
 if kind=='SCALAR':v.update(min=[float(arr.min())],max=[float(arr.max())])
 g['accessors'].append(v);return len(g['accessors'])-1
for clip in g['animations']:
 if not clip['name'].endswith('_Corrected'):continue
 name=clip['name'].removesuffix('_Corrected');active_name=name
 if a.clips and name not in a.clips:continue
 ts,local,ws=b.sample(clip,120);probe,_,pws=b.sample(clip,a.rate);req=np.array([requirement(w,name)for w in pws]);
 # Smooth signed offsets without reversing their direction near a contact.
 envelope=np.empty_like(req)
 for side in range(2):
  for axis in range(3):
   positive=gaussian_filter1d(maximum_filter1d(np.maximum(req[:,side,axis],0),size=5),.7)
   negative=gaussian_filter1d(maximum_filter1d(np.maximum(-req[:,side,axis],0),size=5),.7)
   envelope[:,side,axis]=positive-negative
 offsets=np.array([[np.interp(ts,probe,envelope[:,i,j])for j in range(3)]for i in range(2)]).transpose(2,0,1)
 out=np.array([shifted(w,v)for w,v in zip(ws,offsets)]);newlocal=local.copy()
 for i in b.order:
  if i in b.parent:newlocal[:,i]=np.linalg.inv(out[:,b.parent[i]])@out[:,i]
 for n in [18,19,21,22,25,26]:
  sc=np.linalg.norm(newlocal[:,n,:3,:3],axis=1);q=R.from_matrix(newlocal[:,n,:3,:3]/sc[:,None,:]).as_quat()
  for k in range(1,len(q)):
   if np.dot(q[k-1],q[k])<0:q[k]*=-1
  # Retain the high-rate contact samples without storing redundant keys.
  kept={0,len(ts)-1}
  def reduce(a,z):
   if z-a<2:return
   u=((ts[a+1:z]-ts[a])/(ts[z]-ts[a]))[:,None];pred=q[a]+u*(q[z]-q[a]);pred/=np.linalg.norm(pred,axis=1)[:,None]
   error=np.linalg.norm(pred-q[a+1:z],axis=1);k=int(error.argmax())+a+1
   if error.max()>1e-6:kept.add(k);reduce(a,k);reduce(k,z)
  reduce(0,len(ts)-1);keep=np.array(sorted(kept))
  ch=next(ch for ch in clip['channels']if ch['target']=={'node':n,'path':'rotation'});idx=len(clip['samplers']);clip['samplers'].append({'input':add(ts[keep],'SCALAR'),'output':add(q[keep],'VEC4'),'interpolation':'LINEAR'});ch['sampler']=idx
 bad=sum(b.intersects(b.skin(w),b.pairs)for w in out);record={'clip':name,'maxOffsetCm':float(np.linalg.norm(offsets,axis=2).max()*100),'remainingContactFrames120Hz':int(bad)};records.append(record);print(record,flush=True)
 g['buffers']=[{'byteLength':len(data)}];j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4);a.output.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data)
 a.output.with_suffix('.contacts.json').write_text(json.dumps(records,indent=2))
