"""Convert audited ufbx dumps to CATHEXIS source auditions, preserving FBX skinning.
Usage: python import-cathexis-auditions.py APPROVED.glb mirror.json carpet.json raw.glb
Requires numpy/scipy and dumps from fbx-motion-dump.c compiled against ufbx.
"""
import sys,json,copy,struct,hashlib
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree
from scipy.spatial.transform import Rotation
from cathexis_motion_math import context,mat,world_at
base,mirror,carpet,out=map(Path,sys.argv[1:5]);d=context(base);g=copy.deepcopy(d['g']);data=bytearray(d['data']);joints=d['sk']['joints'];nodes=g['nodes'];root=24
assert hashlib.sha256(base.read_bytes()).hexdigest()=='156f11fff75c4eba27c74d953b5b1c5b9246786aa15785e3e2b0fd9295245cc5'
names={'Spine02':'Spine','Spine01':'Spine1','Spine':'Spine2','neck':'Neck'}
def canonical(n):return 'headfront' if n=='headfront' else 'mixamorig:'+names.get(n,n)
def affine(v):
 m=np.eye(4);m[:3,:]=np.asarray(v).reshape(4,3).T;return m

def add(a,kind,component=5126):
 a=np.asarray(a,dtype={5126:'<f4',5123:'<u2'}[component]);data.extend(b'\0'*((-len(data))%4));offset=len(data);data.extend(a.tobytes());g['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':a.nbytes});acc={'bufferView':len(g['bufferViews'])-1,'componentType':component,'count':len(a),'type':kind}
 if kind=='SCALAR':acc.update(min=[float(a.min())],max=[float(a.max())])
 g['accessors'].append(acc);return len(g['accessors'])-1

inputs=[json.loads(p.read_text())for p in [mirror,carpet]]
a=inputs[0]['meshes'][0];b=inputs[1]['meshes'][0];assert a==b,'Different FBX bodies or weights: do not consolidate'
sourceverts=np.asarray(a['vertices'])*.01;dist,near=cKDTree(sourceverts).query(d['verts']);assert dist.max()<2e-7
clusters=a['skins'][0]['clusters'];index={nodes[n]['name']:i for i,n in enumerate(joints)};cluster_joint={i:index[canonical(inputs[0]['nodes'][c['node']]['name'])]for i,c in enumerate(clusters)if canonical(inputs[0]['nodes'][c['node']]['name'])in index}
weights=np.zeros((len(sourceverts),23))
for i,ws in enumerate(a['skins'][0]['weights']):
 for j,w in ws:
  if j not in cluster_joint:assert w<1e-8
  else:weights[i,cluster_joint[j]]+=w
idx=np.argsort(-weights,axis=1)[:,:8];ws=np.take_along_axis(weights,idx,axis=1);loss=1-ws.sum(1);ws/=ws.sum(1)[:,None]
primitive=g['meshes'][0]['primitives'][0]
for k in range(2):
 primitive['attributes'][f'JOINTS_{k}']=add(idx[near,k*4:k*4+4],'VEC4',5123)
 primitive['attributes'][f'WEIGHTS_{k}']=add(ws[near,k*4:k*4+4],'VEC4')
# One source body. Approved body/skins and their clips stay in their own immutable pack.
g['meshes']=g['meshes'][:1];g['skins']=g['skins'][:1];g['nodes']=g['nodes'][:25];g['nodes'][root]['children']=[23,22];g['nodes'][23]['name']='Source_Body';g['animations']=[]
parents={c:i for i,n in enumerate(g['nodes'])for c in n.get('children',[])};canonical_bind=np.linalg.inv(d['ib']);scale=np.diag([.01,.01,.01,1]);invscale=np.diag([100,100,100,1]);report=[]
for f,label in zip(inputs,['Mirror_Viewing','Red_Carpet_Walk']):
 clip=f['clips'][0];frames=clip['frames'];ts=np.asarray([x['t']for x in frames]);fn=f['nodes'];tracks={n:[]for n in joints};max_shear=0;max_pose_error=0
 for fi,frame in enumerate(frames):
  world=[]
  for n,trs in zip(fn,frame['local']):
   local=mat({'translation':trs[:3],'rotation':trs[3:7],'scale':trs[7:]});world.append((world[n['parent']]if n['parent']>=0 else np.eye(4))@local)
  desired={root:mat(nodes[root])};deform=np.tile(np.eye(4),(23,1,1))
  for ci,ji in cluster_joint.items():
   c=clusters[ci];deform[ji]=scale@world[c['node']]@affine(c['inverse'])@invscale
   desired[joints[ji]]=deform[ji]@canonical_bind[ji]
  for n in joints:
   local=np.linalg.inv(desired[parents[n]])@desired[n];sc=np.linalg.norm(local[:3,:3],axis=0);rot=local[:3,:3]/sc
   max_shear=max(max_shear,float(np.max(np.abs(rot.T@rot-np.eye(3)))))
   tracks[n].append(np.r_[local[:3,3],Rotation.from_matrix(rot).as_quat(),sc])
  if fi in [0,len(frames)//4,len(frames)//2,3*len(frames)//4,len(frames)-1]:
   # Compare the exact delivered eight-weight deformation to all FBX weights.
   vh=np.c_[d['verts'],np.ones(len(d['verts']))];full=np.zeros((len(vh),3));trim=np.zeros_like(full)
   for ji in range(23):full+=(vh@deform[ji].T)[:,:3]*weights[near,ji,None]
   for k in range(8):trim+=np.einsum('nij,nj->ni',deform[idx[near,k]],vh)[:,:3]*ws[near,k,None]
   max_pose_error=max(max_pose_error,float(np.linalg.norm(full-trim,axis=1).max()))
 assert max_shear<2e-5
 animation={'name':label+'_Source','channels':[],'samplers':[]};time=add(ts,'SCALAR');max_step=0
 for n,values in tracks.items():
  values=np.asarray(values);q=values[:,3:7]
  for k in range(1,len(q)):
   if np.dot(q[k-1],q[k])<0:q[k]*=-1
  max_step=max(max_step,float(np.degrees(2*np.arccos(np.clip(np.abs(np.sum(q[:-1]*q[1:],axis=1)),0,1))).max()))
  for path,v,typ in [('translation',values[:,:3],'VEC3'),('rotation',q,'VEC4'),('scale',values[:,7:],'VEC3')]:
   sampler=len(animation['samplers']);animation['samplers'].append({'input':time,'output':add(v,typ),'interpolation':'LINEAR'});animation['channels'].append({'sampler':sampler,'target':{'node':n,'path':path}})
 g['animations'].append(animation);report.append({'clip':label,'fbxClip':clip['name'],'duration':float(ts[-1]),'samples':len(ts),'maxLocalShearError':max_shear,'maxEightWeightPoseErrorM':max_pose_error,'maxJointKeyStepDegrees':max_step,'rootStart':frames[0]['world'][3],'rootEnd':frames[-1]['world'][3]})
g['buffers']=[{'byteLength':len(data)}];j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4);out.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data)
record={'baseRuntimeSHA256':hashlib.sha256(base.read_bytes()).hexdigest(),'vertexMatchMaxM':float(dist.max()),'maxDiscardedWeight':float(loss.max()),'clips':report};out.with_suffix('.json').write_text(json.dumps(record,indent=2));print(json.dumps(record,indent=2))
