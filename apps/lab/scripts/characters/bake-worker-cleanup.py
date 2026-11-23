"""Authoring entry point: Python + NumPy/SciPy + a C compiler. No Blender/runtime IK required."""
from worker_motion import *
from worker_fingers import add_fingers
import copy,struct,hashlib
import argparse
from worker_correct import correct
from worker_acting import refine
parser=argparse.ArgumentParser(description='Bake Worker 01 corrections and articulated-hand studies; preserve the source bank.')
parser.add_argument('--clearance-only',action='store_true',help='Emit the baseline clearance bank before contact acting.');parser.add_argument('--reuse-acting',action='store_true',help='Reuse inspected acting arrays without reauthoring.');parser.add_argument('output_directory',type=Path);parser.add_argument('--reuse',action='store_true',help='Reuse per-clip intermediate arrays after an inspected refinement.')
args=parser.parse_args();workdir=args.output_directory;workdir.mkdir(parents=True,exist_ok=True)
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()=='299587fb5eefb1fa1dc725118d4edd17ae058ea4231610c19d079bde3c991933','Worker source changed: inspect before rebaking.'
b=Worker();records={}
if not args.reuse:
 for clip in b.g['animations']:
  records[clip['name']]=correct(b,clip,workdir)
  (workdir/'authoring.json').write_text(json.dumps(records,indent=2))
authored={}
for clip in b.g['animations']:
 x=np.load(workdir/(clip['name']+'.npz'));cache=workdir/(clip['name']+'.acting.npz')
 if args.clearance_only:
  curl={'run_fast_10_inplace':22,'Angry_Stomp':24,'Carry_Heavy_Object_Walk_inplace':28,'Confused_Scratch':9,'Push_Forward_and_Stop':4,'Victory_Cheer':6}.get(clip['name'],14);authored[clip['name']]=(x['local'],np.full(len(x['times']),curl))
 elif args.reuse_acting and cache.exists():
  a=np.load(cache);authored[clip['name']]=(a['local'],a['curls'])
 else:
  authored[clip['name']]=refine(b,x['times'],x['local'],clip['name']);np.savez_compressed(cache,local=authored[clip['name']][0],curls=authored[clip['name']][1])
 print(clip['name'],'contact acting authored',flush=True)
g=b.g;data=bytearray(b.d['data']);source_nodes=copy.deepcopy(g['nodes']);source_clips=copy.deepcopy(g['animations']);js,ws,ib,joints,fingers=add_fingers(b)
def add(arr,kind,component=5126):
 arr=np.asarray(arr,dtype={5126:'<f4',5123:'<u2'}[component]);data.extend(b'\0'*((-len(data))%4));offset=len(data);data.extend(arr.tobytes());g['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':arr.nbytes});ac={'bufferView':len(g['bufferViews'])-1,'componentType':component,'count':len(arr),'type':kind}
 if kind=='SCALAR':ac.update(min=[float(arr.min())],max=[float(arr.max())])
 g['accessors'].append(ac);return len(g['accessors'])-1
skin=copy.deepcopy(g['skins'][0]);skin['joints']=joints;skin['inverseBindMatrices']=add(ib.transpose(0,2,1).reshape(-1,16),'MAT4');skin['name']='Worker 01 articulated hands';g['skins'].append(skin)
p=copy.deepcopy(b.d['prim'])
for k in range(2):
 p['attributes'][f'JOINTS_{k}']=add(js[:,k*4:k*4+4],'VEC4',5123);p['attributes'][f'WEIGHTS_{k}']=add(ws[:,k*4:k*4+4],'VEC4')
g['meshes'][0]['name']='Worker source';g['meshes'].append({'name':'Worker corrected','primitives':[p]});g['nodes'].append({'name':'WorkerCorrected','mesh':1,'skin':1});g['nodes'][0]['children'].append(len(g['nodes'])-1)
records=[]
def append(name,ts,local,hand_angles):
 out={'name':name,'channels':[],'samplers':[]};ta=add(ts,'SCALAR')
 def channel(node,path,v):
  v=np.array(v)
  if path=='rotation':
   for k in range(1,len(v)):
    if np.dot(v[k-1],v[k])<0:v[k]*=-1
  keep={0,len(ts)-1}
  def reduce(a,z):
   if z-a<2:return
   u=((ts[a+1:z]-ts[a])/(ts[z]-ts[a]))[:,None];pred=v[a]+u*(v[z]-v[a])
   if path=='rotation':pred/=np.linalg.norm(pred,axis=1)[:,None]
   error=np.linalg.norm(pred-v[a+1:z],axis=1);k=int(error.argmax())+a+1
   if error.max()>1e-5:keep.add(k);reduce(a,k);reduce(k,z)
  reduce(0,len(ts)-1);ix=np.array(sorted(keep));vt=add(ts[ix],'SCALAR')
  sampler=len(out['samplers']);out['samplers'].append({'input':vt,'output':add(v[ix],'VEC4'if path=='rotation'else'VEC3'),'interpolation':'LINEAR'});out['channels'].append({'sampler':sampler,'target':{'node':node,'path':path}})
 for i,n in enumerate(source_nodes):
  if i in [0,1,2]:continue
  sc=np.linalg.norm(local[:,i,:3,:3],axis=1)
  for path,v in [('rotation',R.from_matrix(local[:,i,:3,:3]/sc[:,None,:]).as_quat()),('translation',local[:,i,:3,3]),('scale',sc)]:channel(i,path,v)
 for f in fingers:
  angles=hand_angles[:,0 if f['hand']==25 else 1] if hand_angles.ndim==2 else hand_angles
  amount=angles*np.array([.6,1,1.1,1.2,1.3])[['Thumb','Index','Middle','Ring','Little'].index(f['name'].replace('Left','').replace('Right',''))];q=R.from_rotvec(np.array([0,0,f['sign']])[None,:]*np.radians(amount)[:,None]).as_quat();channel(f['node'],'rotation',q)
 g['animations'].append(out)
for clip in source_clips:
 path=workdir/(clip['name']+'.npz')
 assert path.exists(),f'Missing correction: {path}'
 x=np.load(path);ts=x['times'];name=clip['name']
 local,curls=authored[name]
 append(name+'_Corrected',ts,local,curls)
 print(name,'contact acting baked',flush=True)
for name,start,end in [('Hand_Relax',0,14),('Hand_Grip',14,40),('Hand_Release',40,0)]:
 ts=np.linspace(0,2,121);u=np.clip(ts/1.4,0,1);u=u*u*(3-2*u);local=np.tile(np.array([mat(n)for n in source_nodes]),(len(ts),1,1,1));append(name,ts,local,start+(end-start)*u)
g['buffers']=[{'byteLength':len(data)}];g.setdefault('asset',{})['extras']={'workerCleanup':'2026-10-16','sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'fingerJoints':10,'sourceSkinPreserved':True}
j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4);out=workdir/'worker-corrected.glb';out.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data)
(workdir/'fingers.json').write_text(json.dumps(fingers,indent=2));print(len(data),len(g['animations']),out)
