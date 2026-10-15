"""Bake CATHEXIS's costume/ground/loop candidates; source is immutable.
Usage: python bake-cathexis-motion.py source.glb corrected-raw.glb
Requires numpy and scipy, offline only. No Blender or runtime cloth solver.
"""
from pathlib import Path
import json,struct,hashlib,copy,sys
import numpy as np
from cathexis_motion_math import context,cloth_regions
from cathexis_drape import refine_hands, drape_matrices
from cathexis_gait import refine_gait
source,output=map(Path,sys.argv[1:3]);assert hashlib.sha256(source.read_bytes()).hexdigest()=='a15bb25903042ca5830963f3231818df99101338ef4d6df960218995b8889dc1','Unexpected source revision'
d=context(source)
v=d['verts'];js=d['js'];ws=d['ws'];ib=d['ib'];g=copy.deepcopy(d['g']);joints=d['sk']['joints'];hip=22
f=d['acc'](d['prim']['indices']).astype(int).reshape(-1,3)
cloth,legs=cloth_regions(v,f)
assert len(v)==76010 and len(f)==51031 and g['nodes'][22]['name']=='mixamorig:Hips'
# Preserve complete source buffers and geometry; append alternate weights and baked curves.
data=bytearray(d['data']);g['buffers']=[{'byteLength':len(data)}]
def add(a,kind,component=5126):
 global data
 dt={5126:'<f4',5123:'<u2',5125:'<u4'}[component];a=np.asarray(a,dtype=dt);data.extend(b'\0'*((-len(data))%4));off=len(data);data.extend(a.tobytes());bv=len(g['bufferViews']);g['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':a.nbytes});ac={'bufferView':bv,'componentType':component,'count':len(a),'type':kind}
 if kind=='SCALAR' and component==5126:ac.update(min=[float(a.min())],max=[float(a.max())])
 g['accessors'].append(ac);return len(g['accessors'])-1
levels=np.array([.22,.38,.54,.70,.86,1.02]);newnodes=[]
for y in levels:
 i=len(g['nodes']);newnodes.append(i);g['nodes'].append({'name':f'Skirt_Clearance_{y:.2f}','scale':[100,100,100]});g['nodes'][24]['children'].append(i)
# Extra joints are neutral-identity controls, downstream of the existing source rig.
newib=np.concatenate([ib,np.tile(np.eye(4),(len(levels),1,1))]);skin=copy.deepcopy(g['skins'][0]);skin['name']='Corrected costume';skin['joints']+=newnodes;skin['inverseBindMatrices']=add(newib.transpose(0,2,1).reshape(-1,16),'MAT4');g['skins'].append(skin)
cjs=js.copy();cws=ws.copy();newbone=23
rear_top=(v[:,1]>=.82)&(v[:,1]<1.02)&(v[:,2]<.025)&(abs(v[:,0])<.26)
for i in np.flatnonzero(cloth|rear_top):
 y=v[i,1];hi=min(len(levels)-1,max(1,np.searchsorted(levels,y)));lo=hi-1;t=np.clip((y-levels[lo])/(levels[hi]-levels[lo]),0,1)
 # Blend over 20 cm up to the waist; rear fabric becomes independent of legs.
 a=np.clip((1.02-y)/.20,0,1);a=a*a*(3-2*a)
 # Rear fabric hangs from the waist; front panels follow their own thigh.
 rear=np.clip((.12-v[i,2])/.14,0,1);rear=rear*rear*(3-2*rear);a*=rear
 influences={}
 # Front panels follow their own thigh, never a blend of opposite legs.
 for j,w in zip(js[i],ws[i]):
  if w<=0:continue
  joint=(1 if v[i,0]>0 else 5) if int(j) in (1,5) else int(j)
  influences[joint]=influences.get(joint,0)+float(w*(1-a))
 for j,w in [(newbone+lo,(1-t)*a),(newbone+hi,t*a)]:influences[j]=influences.get(j,0)+w
 pairs=sorted(influences.items(),key=lambda x:-x[1])[:4];cjs[i]=0;cws[i]=0
 for k,(j,w) in enumerate(pairs):cjs[i,k]=j;cws[i,k]=w
 cws[i]/=cws[i].sum()
p=copy.deepcopy(g['meshes'][0]['primitives'][0]);p['attributes']['JOINTS_0']=add(cjs,'VEC4',5123);p['attributes']['WEIGHTS_0']=add(cws,'VEC4');g['meshes'].append({'name':'Corrected costume skin','primitives':[p]});g['nodes'].append({'name':'Corrected_Body','mesh':1,'skin':1});g['nodes'][24]['children'].append(len(g['nodes'])-1);g['nodes'][23]['name']='Source_Body'
vh=np.c_[v,np.ones(len(v))]
def skinv(world,ids=None):
 inds=np.arange(len(v)) if ids is None else np.flatnonzero(ids);m=world[joints]@ib
 return sum(np.einsum('nij,nj->ni',m[js[inds,k]],vh[inds])*ws[inds,k,None]for k in range(4))[:,:3]
from scipy.spatial.transform import Rotation
reports=[];newclips=[]
for source in g['animations']:
 if source['name'] not in ['Confident_Walk','Happy_Sway_Standing']:continue
 name='Hot_Walk' if source['name']=='Confident_Walk' else 'Happy_Sway';source['name']=name+'_Source';tr=d['tracks'](source);dur=max(t[-1]for _,_,t,_ in tr)
 # Source samples remain byte-identical; corrected candidates use a periodic tangent blend at the seam.
 n=round(dur*60);ts=np.linspace(0,dur,n+1);out={'name':name+'_Corrected','samplers':[],'channels':[]};timeacc=add(ts,'SCALAR')
 corrected=[]
 for node,path,times,values in tr:
  if path=='rotation':
   from scipy.spatial.transform import Slerp
   vals=Slerp(times,Rotation.from_quat(values))(np.clip(ts,times[0],times[-1])).as_quat()
   # Correct only the end/start mismatch across a 0.2-second closing window.
   delta=Rotation.from_quat(vals[0])*Rotation.from_quat(vals[-1]).inv();ease=np.clip((ts-(dur-.25))/.25,0,1);ease=ease**3*(10-15*ease+6*ease**2)
   vals=(Rotation.from_rotvec(ease[:,None]*delta.as_rotvec())*Rotation.from_quat(vals)).as_quat()
   for k in range(1,len(vals)):
    if np.dot(vals[k-1],vals[k])<0:vals[k]*=-1
  else:
   vals=np.column_stack([np.interp(ts,times,values[:,j])for j in range(values.shape[1])]);ease=np.clip((ts-(dur-.25))/.25,0,1);ease=ease**3*(10-15*ease+6*ease**2);vals+=ease[:,None]*(vals[0]-vals[-1])
  corrected.append((node,path,ts,vals))
 refine_gait(d,corrected,ts)
 if name=='Hot_Walk':refine_hands(d,corrected,ts)
 worlds=[d['world_at'](corrected,t)for t in ts]
 floor=[skinv(world,legs)[:,1].min() for world in worlds]
 drapes,drape_report=drape_matrices(d,corrected,ts,levels,cloth,legs,skinv,clearance_floor=.20 if name=='Happy_Sway' else .14)
 floor=np.array(floor);ground=.002-floor;ground[-1]=ground[0]
 # Translate the pelvis globally; corrected leg articulation and source forward timing are retained.
 for node,path,_,vals in corrected:
  if node==22 and path=='translation':vals[:,1]+=ground*100
 for node,path,_,vals in corrected:
  sampler=len(out['samplers']);out['samplers'].append({'input':timeacc,'output':add(vals,'VEC4'if path=='rotation'else 'VEC3'),'interpolation':'LINEAR'});out['channels'].append({'sampler':sampler,'target':{'node':node,'path':'scale' if path=='scale' else path}})
 for bi,bnode in enumerate(newnodes):
  rots=[];trans=[]
  for k,t in enumerate(ts):
   M=drapes[k,bi].copy();M[1,3]+=ground[k]
   trans.append(M[:3,3]*100);rots.append(Rotation.from_matrix(M[:3,:3]).as_quat())
  rots=np.array(rots)
  for k in range(1,len(rots)):
   if np.dot(rots[k-1],rots[k])<0:rots[k]*=-1
  scales=np.tile([100*(1+.20*np.clip((1.02-levels[bi])/.65,0,1)),100,100],(len(ts),1))
  for path,vals in [('rotation',rots),('translation',trans),('scale',scales)]:
   sampler=len(out['samplers']);out['samplers'].append({'input':timeacc,'output':add(vals,'VEC4'if path=='rotation'else 'VEC3'),'interpolation':'LINEAR'});out['channels'].append({'sampler':sampler,'target':{'node':bnode,'path':path}})
 reports.append({'clip':name,'duration':dur,'samples':len(ts),'maxGroundAdjustmentM':float(abs(ground).max()),'drape':drape_report});newclips.extend([source,out])
g['animations']=newclips;g['buffers'][0]['byteLength']=len(data);j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4);out=struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data
output.write_bytes(out);output.with_suffix('.authoring.json').write_text(json.dumps(reports,indent=2));print(reports)
