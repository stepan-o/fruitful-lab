"""Build a raw inspection bank from audited Meshy FBX dumps. Requires NumPy and Pillow.
Usage: python prepare-limen-motions.py extracted-directory
Then run import-limen-motions.mjs to optimize and publish the embedded asset.
"""
from pathlib import Path
import json,struct,hashlib,io
import numpy as np
from PIL import Image
import sys
P=Path(sys.argv[1])
# Inputs are original ufbx v0.21.3 dumps from fbx-motion-dump.c, with archived FBX and textures retained privately.
files=sorted(P.glob('*Animation*.json'));d=json.loads(files[0].read_text());mesh=d['meshes'][1];skin=mesh['skins'][0]
g={'asset':{'version':'2.0','generator':'Local FBX intake inspection; not a production release'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[],'meshes':[],'skins':[],'animations':[],'accessors':[],'bufferViews':[],'buffers':[],'materials':[{'name':'LIMEN source PBR','pbrMetallicRoughness':{'baseColorTexture':{'index':0},'metallicFactor':.35,'roughnessFactor':.65}}],'textures':[{'source':0}],'images':[]}
data=bytearray()
def block(b):
 data.extend(b'\0'*((-len(data))%4));view=len(g['bufferViews']);g['bufferViews'].append({'buffer':0,'byteOffset':len(data),'byteLength':len(b)});data.extend(b);return view
def add(a,kind,ctype=5126):
 a=np.asarray(a,dtype={5126:'<f4',5123:'<u2',5125:'<u4'}[ctype]);acc={'bufferView':block(a.tobytes()),'componentType':ctype,'count':len(a),'type':kind}
 if kind in ['SCALAR','VEC3']:acc.update(min=np.min(a,axis=0).reshape(-1).tolist(),max=np.max(a,axis=0).reshape(-1).tolist())
 g['accessors'].append(acc);return len(g['accessors'])-1
for n in d['nodes']:
 t=n['trs'];g['nodes'].append({'name':n['name'] or 'FBX_units','translation':t[:3],'rotation':t[3:7],'scale':t[7:]})
g['nodes'][0]['scale']=[.01]*3
for i,n in enumerate(d['nodes']):
 if n['parent']>=0:g['nodes'][n['parent']].setdefault('children',[]).append(i)
# The exported unskinned icosphere is a helper, not part of the character.
g['nodes'][2].update(mesh=0,skin=0,translation=[0,0,0],rotation=[0,0,0,1],scale=[1,1,1])
g['nodes'][0]['children'].remove(2);g['scenes'][0]['nodes'].append(2)
def matrix(t):
 x,y,z,w=t[3:7];r=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
 m=np.eye(4);m[:3,:3]=r@np.diag(t[7:]);m[:3,3]=t[:3];return m
geometry_to_world=np.diag([.01,.01,.01,1])@matrix(d['nodes'][2]['trs'])
ix=np.asarray(mesh['indices']);verts=np.asarray(mesh['vertices']);ws=np.zeros((len(verts),len(skin['clusters'])))
for i,w in enumerate(skin['weights']):
 for j,v in w:ws[i,j]=v
order=np.argsort(-ws,axis=1)[:,:8];weights=np.take_along_axis(ws,order,axis=1);loss=1-weights.sum(1);weights/=weights.sum(1)[:,None];order[weights==0]=0
worldverts=(np.c_[verts,np.ones(len(verts))]@geometry_to_world.T)[:,:3];worldnormals=np.asarray(mesh['normals'])@np.linalg.inv(geometry_to_world[:3,:3]);worldnormals/=np.linalg.norm(worldnormals,axis=1)[:,None]
attrs={'POSITION':add(worldverts[ix],'VEC3'),'NORMAL':add(worldnormals,'VEC3'),'TEXCOORD_0':add(np.asarray(mesh['uv'])*[1,-1]+[0,1],'VEC2')}
for k in range(2):
 attrs[f'JOINTS_{k}']=add(order[ix,k*4:k*4+4],'VEC4',5123);attrs[f'WEIGHTS_{k}']=add(weights[ix,k*4:k*4+4],'VEC4')
for accessor in attrs.values():g['bufferViews'][g['accessors'][accessor]['bufferView']]['target']=34962
g['meshes']=[{'name':'LIMEN source body 9752 triangles','primitives':[{'attributes':attrs,'material':0}]}]
inv=[]
for c in skin['clusters']:
 m=np.eye(4);m[:3,:]=np.array(c['bind']).reshape(4,3).T;inv.append(np.linalg.inv(np.diag([.01,.01,.01,1])@m).T.reshape(-1))
g['skins']=[{'joints':[c['node']for c in skin['clusters']],'inverseBindMatrices':add(inv,'MAT4')}]
im=Image.open(P/'Meshy_AI_LIMEN_security_chief_biped_texture_0.png').convert('RGB');b=io.BytesIO();im.save(b,format='JPEG',quality=92);g['images']=[{'bufferView':block(b.getvalue()),'mimeType':'image/jpeg'}]
records=[]
for f in files:
 src=json.loads(f.read_text());sm=src['meshes'][1];ss=sm['skins'][0]
 assert ss==skin and sm['indices']==mesh['indices']
 position_error=float(np.max(np.abs(np.asarray(sm['vertices'])-verts)))
 a=src['clips'][0];frames=a['frames'];full=np.asarray([x['local']for x in frames]);world=np.asarray([x['world']for x in frames])*.01
 fi=list(range(0,len(frames),2));
 if fi[-1]!=len(frames)-1:fi.append(len(frames)-1)
 times=[frames[i]['t']for i in fi];values=full[fi];anim={'name':a['name'],'samplers':[],'channels':[]};time=add(times,'SCALAR')
 for n in range(3,len(g['nodes'])):
  for path,sl,kind in [('translation',slice(0,3),'VEC3'),('rotation',slice(3,7),'VEC4'),('scale',slice(7,10),'VEC3')]:
   v=values[:,n,sl].copy()
   if path=='rotation':
    v/=np.linalg.norm(v,axis=1)[:,None]
    for k in range(1,len(v)):
     if np.dot(v[k],v[k-1])<0:v[k]*=-1
   si=len(anim['samplers']);anim['samplers'].append({'input':time,'output':add(v,kind),'interpolation':'LINEAR'});anim['channels'].append({'sampler':si,'target':{'node':n,'path':path}})
 g['animations'].append(anim)
 hips=next(i for i,n in enumerate(src['nodes'])if n['name']=='mixamorig:Hips');traj=world[:,hips];q=full[:,:,3:7];q/=np.linalg.norm(q,axis=2)[:,:,None]
 ranges=2*np.arccos(np.clip(np.abs((q*q[:1]).sum(2)),0,1));fingers=[i for i,n in enumerate(src['nodes'])if any(s in n['name']for s in ['Thumb','Pinky','Ring','Middle','Index'])]
 positive=(ws>1e-6).any(0)
 records.append({'clip':a['name'],'durationSeconds':round(a['end']-a['start'],3),'samples60Hz':len(frames),'triangles':sm['triangles'],'skinJoints':len(ss['clusters']),'weightedJoints':int(positive.sum()),'maxDiscardedEightWeight':float(max(loss)),'positionDifferenceAcrossExportsM':position_error,'hipsStartM':traj[0].round(4).tolist(),'hipsEndM':traj[-1].round(4).tolist(),'hipsNetTravelM':float(np.linalg.norm((traj[-1]-traj[0])[[0,2]])),'hipsHorizontalSpanM':np.ptp(traj[:,[0,2]],axis=0).round(4).tolist(),'hipsVerticalSpanM':round(float(np.ptp(traj[:,1])),4),'animatedFingerNodesOver1Degree':int((ranges[:,fingers].max(0)>np.deg2rad(1)).sum()),'finiteData':bool(np.isfinite(full).all())})
g['buffers']=[{'byteLength':len(data)}];j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4)
(P/'review.glb').write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data)
(P/'motion-audit.json').write_text(json.dumps(records,indent=2));print(json.dumps(records,indent=2))
