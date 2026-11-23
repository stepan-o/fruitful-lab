"""Fit ed's pickup contact and author restrained credential stowing derivatives.

Source Action 276 remains untouched as Male_Bend_Over_Pick_Up. All corrections
are offline joint curves; the encounter commits custody at the recorded contact.
"""
import argparse, json, hashlib
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R, Slerp
from scipy.ndimage import maximum_filter1d, gaussian_filter1d
from opening_worker_motion import OpeningWorker
from opening_worker_io import Writer

def rotation(m):
 return m[..., :3, :3] / np.linalg.norm(m[..., :3, :3], axis=-2)[..., None, :]
def smooth(t):
 t=np.clip(t,0,1);return t*t*(3-2*t)
def swing(a,b):
 a=a/np.linalg.norm(a);b=b/np.linalg.norm(b);d=np.dot(a,b)
 return R.from_quat(np.r_[np.cross(a,b),1+d]).as_matrix() if d>-.99999 else R.from_rotvec([np.pi,0,0]).as_matrix()
def reach(b,w,target,pole):
 a,e,h=[b.names[n] for n in ['RightArm','RightForeArm','RightHand']]
 p=w[a,:3,3].copy();v=target-p;length=np.linalg.norm(v);axis=v/max(length,1e-8)
 l1=np.linalg.norm(w[e,:3,3]-p);l2=np.linalg.norm(w[h,:3,3]-w[e,:3,3])
 d=np.clip(length,abs(l1-l2)+.005,(l1+l2)*.998);end=p+axis*d
 bend=pole-axis*np.dot(axis,pole);bend/=np.linalg.norm(bend)
 along=(l1*l1-l2*l2+d*d)/(2*d);elbow=p+axis*along+bend*np.sqrt(max(0,l1*l1-along*along))
 b.rotate_chain(w,a,swing(w[e,:3,3]-p,elbow-p))
 b.rotate_chain(w,e,swing(w[h,:3,3]-w[e,:3,3],end-w[e,:3,3]))
 return float(np.linalg.norm(end-target))
def blend_rotation(a,b,t):
 return Slerp([0,1],R.from_matrix([a,b]))([float(np.clip(t,0,1))]).as_matrix()[0]
def write_world(writer,b,name,ts,world,extras):
 local=world.copy()
 for j in b.order:
  if j in b.parent:local[:,j]=np.linalg.inv(world[:,b.parent[j]])@world[:,j]
 tracks=[(j,'rotation',R.from_matrix(rotation(local[:,j])).as_quat()) for j in b.d['sk']['joints']]
 h=b.names['Hips'];tracks.append((h,'translation',local[:,h,:3,3]))
 writer.clip(name,ts,tracks,extras)

ap=argparse.ArgumentParser();ap.add_argument('worker',choices=['ed','jo']);ap.add_argument('--task',required=True);args=ap.parse_args()
root=Path(__file__).resolve().parents[4];folder=root/'output/opening-cast'/args.worker
source_path=folder/(args.worker+'-pickup-source-v1.glb')
src=OpeningWorker(source_path);b=OpeningWorker(folder/(args.worker+'-motion-contact-v1.glb'))
writer=Writer(b.d);replace={'Male_Bend_Over_Pick_Up','Pickup_Card','Stow_Card','Stow_ID','Draw_ID'}
writer.g['animations']=[c for c in writer.g.get('animations',[]) if c.get('name') not in replace]
for name,j in b.names.items():
 if j in b.d['sk']['joints'] and not np.allclose(b.bind[j],src.bind[src.names[name]],atol=2e-5):
  raise ValueError('Rig changed: '+name)
ts,source_local,source_world=src.sample(src.g['animations'][0],30)
# Remap native locals by joint name; retain delivery-bank non-joint parents.
local=np.repeat(np.array([np.eye(4) for _ in b.nodes])[None],len(ts),axis=0)
from cathexis_motion_math import mat
for j,n in enumerate(b.nodes):local[:,j]=mat(n)
for j in b.d['sk']['joints']:local[:,j]=source_local[:,src.names[b.nodes[j]['name']]]
native=np.array([b.world(x)for x in local])
digest=hashlib.sha256(source_path.read_bytes()).hexdigest()
write_world(writer,b,'Male_Bend_Over_Pick_Up',ts,native,{'origin':'Meshy Action 276','sourceSha256':digest,'status':'original source'})
minima=np.array([b.skin(w)[:,1].min()for w in native])
lift=gaussian_filter1d(maximum_filter1d(.002-minima,size=5,mode='nearest'),1,mode='nearest')
lift=np.maximum(lift,.002-minima);world=native.copy()
moving=[]
def descendants(j):
 moving.append(j)
 for child in b.nodes[j].get('children',[]):descendants(child)
descendants(b.names['Hips'])
for i,w in enumerate(world):w[moving,:3,3]+=np.array([0,lift[i],0])
h=b.names['RightHand'];e=b.names['RightForeArm'];a=b.names['RightArm'];hip=b.names['Hips']
socket=json.loads((root/'apps/lab/lib/loopforge/agents/opening-worker-sockets.json').read_text())[args.worker]['right']
edge=np.array([socket[0],socket[1]*2.1,socket[2],1.])
contact_index=int(np.abs(ts-1.5).argmin())
# The native fingers reach down to the floor. Fit a corner grip around them,
# allowing the card to lie flat at first contact without forcing an unreachable
# flat-palm arm pose. The same local grip follows the hand during the rise.
unit=np.linalg.norm(world[contact_index,h,:3,:3],axis=0)
desired_card=np.array([-.17,.003,.51])
card_rotation=R.from_euler('xy',[-90,25],degrees=True).as_matrix()
edge=(np.linalg.inv(world[contact_index,h])@np.r_[desired_card,1.])
edge_rotation=rotation(world[contact_index,h]).T@card_rotation
# Mesh-fitted ed fingertip correction (LST-3, 2026-10-22): close the
# 2.76–3.83 mm runtime gap across portrait/floor/console, retaining the grip
# orientation. 0.365 joint units = 3.65 mm at source scale; at ed's runtime
# height the fingertip sits 0.10–1.16 mm inside the 3 mm card thickness.
# The fixed floor target remains unchanged; custody's existing lift blend
# absorbs this ~4 mm hand attachment shift. Refit if the body mesh changes.
if args.worker=='ed':edge[:3]+=edge_rotation[:,2]*.365
grip_path=root/'apps/lab/lib/loopforge/agents/opening-worker-grips.json'
grips=json.loads(grip_path.read_text()) if grip_path.exists() else {}
grips[args.worker]={'edge':{'position':edge[:3].tolist(),'quaternion':R.from_matrix(edge_rotation).as_quat().tolist()},'pickup':{'contactSeconds':1.5,'position':desired_card.tolist(),'yaw':25,'sourceHeight':float(np.ptp(b.skin(b.bind)[:,1])),'rootMotionRemovedPosition':[float(desired_card[0]-world[contact_index,hip,0,3]),float(desired_card[1]),float(desired_card[2]-world[contact_index,hip,2,3])]},'stow':{'contactSeconds':1.6,'duration':3.6}}

pickup_error=float(np.linalg.norm((world[contact_index,h]@edge)[:3]-desired_card))
write_world(writer,b,'Pickup_Card',ts,world,{'origin':'Meshy Action 276','sourceSha256':digest,'status':'contact candidate','contactSeconds':1.5})
clips={c['name']:c for c in b.g['animations']}
_,_,ready=b.sample(clips['ID_Ready'],30);_,_,idle=b.sample(clips['idle'],30)
stow_times=np.linspace(0,3.6,109);stow_reports=[];pouch_local=None;pouch_rotation=None
for name,base in [('Stow_Card',world[-1]),('Stow_ID',ready[0])]:
 out=np.repeat(base[None],len(stow_times),axis=0);errors=[];hits=[]
 torso=b.skin(base)[b.region_ids['torso']]
 hip_p=base[hip,:3,3];band=torso[(torso[:,1]>hip_p[1]-.08)&(torso[:,1]<hip_p[1]+.13)]
 front=float(np.quantile(band[:,2],.95))
 if pouch_local is None:
  pouch_card=hip_p+np.array([-.18,.01,front-hip_p[2]+.03])
  pouch_local=(np.linalg.inv(base[hip])@np.r_[pouch_card,1.])[:3]
  pouch_rotation=rotation(base[hip]).T
  grips[args.worker]['pouch']={'position':pouch_local.tolist(),'quaternion':R.from_matrix(pouch_rotation).as_quat().tolist()}
 else:pouch_card=(base[hip]@np.r_[pouch_local,1.])[:3]
 pouch_world_rotation=rotation(base[hip])@pouch_rotation
 if name=='Stow_Card':
  downward=pouch_world_rotation@R.from_euler('y',180,degrees=True).as_matrix()@edge_rotation.T
  wrist_target=pouch_card-downward@(unit*edge[:3])
 else:
  downward=pouch_world_rotation@R.from_euler('z',180,degrees=True).as_matrix()
  wrist_target=pouch_card-downward@(unit*np.array(socket))
 start_p=base[h,:3,3];start_r=rotation(base[h]);release=base[h,:3,3].copy()
 for i,t in enumerate(stow_times):
  weight=smooth(t/1.1);insert=smooth((t-1.1)/.5);end=smooth((t-2.1)/1.5)
  target_p=start_p*(1-weight)+(wrist_target+np.array([0,.14,0]))*weight-np.array([0,.14,0])*insert
  target_p=target_p*(1-end)+release*end
  w=out[i];errors.append(reach(b,w,target_p,np.array([-.75,-.7,.15])))
  wanted=blend_rotation(start_r,downward,weight)
  wanted=blend_rotation(wanted,start_r,end)
  b.rotate_chain(w,h,wanted@rotation(w[h]).T)
  hits.append(bool(b.intersects(b.skin(w),[p for p in b.pairs if 'R' in p[0] or 'R' in p[1]])))
 write_world(writer,b,name,stow_times,out,{'origin':'authored from approved pickup/ID hold','contactSeconds':1.6,'status':'contact candidate'})
 if name=='Stow_ID':
  write_world(writer,b,'Draw_ID',stow_times,out[::-1].copy(),{'origin':'reverse authored ID stow','contactSeconds':2.,'status':'contact candidate'})
 stow_reports.append({'clip':name,'duration':3.6,'contactSeconds':1.6,'maxTargetErrorM':max(errors),'rightArmContactFrames':sum(hits),'contactTimes':[round(float(t),3)for t,hit in zip(stow_times,hits)if hit],'pouchTarget':pouch_card.tolist(),'wristTarget':wrist_target.tolist()})
grip_path.write_text(json.dumps(grips,indent=2)+'\n')
writer.save(folder/(args.worker+'-motion-contact-v1.glb'))
actual_card=(world[contact_index,h]@edge)[:3]
report={'sourceTask':args.task,'action':276,'sourceSha256':digest,'duration':float(ts[-1]),'contactSeconds':1.5,'pickupHand':'right','originalMinimumY':float(minima.min()),'fittedMinimumY':float(min(b.skin(w)[:,1].min()for w in world)),'cardAtContact':actual_card.tolist(),'targetCard':desired_card.tolist(),'maxTargetErrorM':pickup_error,'stowing':stow_reports,'status':'candidate; visual contact/transition review pending'}
(folder/'pickup-contact-v1.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
