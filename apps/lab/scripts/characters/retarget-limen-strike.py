"""Transfer the catalog right-arm slash onto the accepted LIMEN mesh and rig.

Inverse bind matrices, rather than the first displayed pose, define the mapping.
The native rig, materials and every existing motion remain intact.
"""
import json,sys,hashlib
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R,Slerp
from cathexis_motion_math import context,mat
from opening_worker_io import Writer
APP=Path(__file__).resolve().parents[2]
def rot(m):return m[...,:3,:3]/np.linalg.norm(m[...,:3,:3],axis=-2)[...,None,:]
def hierarchy(nodes):
 p={c:i for i,n in enumerate(nodes)for c in n.get('children',[])};order=[]
 def visit(i):
  order.append(i)
  for c in nodes[i].get('children',[]):visit(c)
 for i in range(len(nodes)):
  if i not in p:visit(i)
 return p,order
source=Path(sys.argv[1]);dest=Path(sys.argv[2]);s=context(source)
pack=json.loads((APP/'lib/assets/generated/loopforge-limen-motions.json').read_text());target=APP/('public'+pack['assets']['motions']['variants'][0]['src']);d=context(target)
sn={n.get('name'):i for i,n in enumerate(s['g']['nodes'])};tn={n.get('name'):i for i,n in enumerate(d['g']['nodes'])};nodes=d['g']['nodes'];parents,order=hierarchy(nodes)
sb=s['world_at']([],0);tb=d['world_at']([],0)
for data,bind in [(s,sb),(d,tb)]:
 for k,i in enumerate(data['sk']['joints']):bind[i]=np.linalg.inv(data['ib'][k])
clip=s['g']['animations'][0];tr=s['tracks'](clip);end=max(t[-1]for _,_,t,_ in tr);times=np.linspace(0,end,round(end*30)+1)
sw=np.array([s['world_at'](tr,t)for t in times]);swr=rot(sw);sbr=rot(sb);tbr=rot(tb)
mapnames={'Spine':'Spine02','Spine1':'Spine01','Spine2':'Spine','Neck':'neck','HeadTop_End':'head_end'}
matched={i:sn[mapnames.get(n['name'].replace('mixamorig:',''),n['name'].replace('mixamorig:',''))]for i,n in enumerate(nodes)if n.get('name','').startswith('mixamorig:')and mapnames.get(n['name'].replace('mixamorig:',''),n['name'].replace('mixamorig:',''))in sn}
assert len(matched)>=22
bindlocal=np.array([np.linalg.inv(tb[parents[i]])@tb[i]if i in parents else tb[i]for i in range(len(nodes))]);local=np.tile(bindlocal,(len(times),1,1,1));world=local.copy()
sleg=sum(np.linalg.norm(sb[sn[a],:3,3]-sb[sn[b],:3,3])for a,b in [('LeftUpLeg','LeftLeg'),('LeftLeg','LeftFoot')]);tleg=sum(np.linalg.norm(tb[tn['mixamorig:'+a],:3,3]-tb[tn['mixamorig:'+b],:3,3])for a,b in [('LeftUpLeg','LeftLeg'),('LeftLeg','LeftFoot')]);ratio=tleg/sleg
for i in order:
 pw=world[:,parents[i]]if i in parents else np.broadcast_to(np.eye(4),(len(times),4,4))
 if i in matched:
  si=matched[i];desired=swr[:,si]@sbr[si].T@tbr[i];lr=np.swapaxes(rot(pw),-1,-2)@desired
  local[:,i,:3,:3]=lr*np.linalg.norm(bindlocal[i,:3,:3],axis=0)[None,None,:]
  if i==tn['mixamorig:Hips']:
   position=tb[i,:3,3]+(sw[:,sn['Hips'],:3,3]-sb[sn['Hips'],:3,3])*ratio
   local[:,i,:3,3]=np.linalg.solve(pw[:,:3,:3],(position-pw[:,:3,3])[...,None])[...,0]
 world[:,i]=pw@local[:,i]
# Ground the one-step attack without changing its stance or flattening the knees.
verts=np.c_[d['verts'],np.ones(len(d['verts']))];minimum=[]
joints=d['js'];weights=d['ws'];attrs=d['prim']['attributes']
if 'JOINTS_1'in attrs:joints=np.c_[joints,d['acc'](attrs['JOINTS_1']).astype(int)];weights=np.c_[weights,d['acc'](attrs['WEIGHTS_1'])]
for w in world:
 matrices=w[d['sk']['joints']]@d['ib'];p=np.zeros((len(verts),3))
 for col in range(joints.shape[1]):p+=np.einsum('vij,vj->vi',matrices[joints[:,col]],verts)[:,:3]*weights[:,col,None]
 minimum.append(p[:,1].min())
offset=.002-np.array(minimum)
hip=tn['mixamorig:Hips'];pw=world[:,parents[hip]];local[:,hip,:3,3]+=np.linalg.solve(pw[:,:3,:3],np.c_[np.zeros(len(times)),offset,np.zeros(len(times))][...,None])[...,0]
writer=Writer(d);writer.g['animations']=[a for a in writer.g['animations']if a['name']not in ['Right_Hand_Sword_Slash','Checkpoint_Strike']];tracks=[]
for i in d['sk']['joints']:
 tracks.extend([(i,'rotation',R.from_matrix(rot(local[:,i])).as_quat()),(i,'translation',local[:,i,:3,3]),(i,'scale',np.linalg.norm(local[:,i,:3,:3],axis=1))])
writer.clip('Right_Hand_Sword_Slash',times,tracks,{'origin':'Meshy catalog 219','taskId':'01a15ee2-7090-7621-9825-4f5a7a21be37','retarget':'inverse-bind world rotation','status':'contact audition'})
# Lower the right-arm arc to the small worker's upper body. The correction is
# baked, continuous and local to this performance; the catalog take stays intact.
fit=local.copy();fw=fit.copy()
for i in order:
 if i in parents:fw[:,i]=fw[:,parents[i]]@fit[:,i]
arm=tn['mixamorig:RightArm'];children=[]
def branch(i):
 children.append(i)
 for child in nodes[i].get('children',[]):branch(child)
branch(arm)
def ease(x):x=np.clip(x,0,1);return x*x*(3-2*x)
weights=ease((times-.12)/.25)*(1-ease((times-.72)/.3))
for f,a in enumerate(weights*np.radians(22)):
 turn=R.from_rotvec([a,0,0]).as_matrix();origin=fw[f,arm,:3,3].copy()
 fw[f,children,:3,3]=(fw[f,children,:3,3]-origin)@turn.T+origin
 fw[f,children,:3,:3]=turn@fw[f,children,:3,:3]
for i in order:fit[:,i]=np.linalg.inv(fw[:,parents[i]])@fw[:,i]if i in parents else fw[:,i]
ft=[]
for i in d['sk']['joints']:ft.extend([(i,'rotation',R.from_matrix(rot(fit[:,i])).as_quat()),(i,'translation',fit[:,i,:3,3]),(i,'scale',np.linalg.norm(fit[:,i,:3,:3],axis=1))])
writer.clip('Checkpoint_Strike',times,ft,{'origin':'Right_Hand_Sword_Slash','fit':'22 degree lower right-arm arc; one contact at 0.60 s','status':'paired rehearsal candidate'})
dest.parent.mkdir(parents=True,exist_ok=True);writer.save(dest)
report={'clip':'Right_Hand_Sword_Slash','catalogAction':219,'seconds':float(end),'frames':len(times),'mappedJoints':len(matched),'targetJoints':len(d['sk']['joints']),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'targetSha256':hashlib.sha256(target.read_bytes()).hexdigest(),'floorOffsetRange':[float(offset.min()),float(offset.max())],'acceptance':'contact and blade review pending'}
dest.with_suffix('.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
