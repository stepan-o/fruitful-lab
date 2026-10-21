"""Bake sam's paired assistance from the untouched Meshy kneel source.

The fitted bank is shared by the reviewer and the encounter. Local pelvic
balance shifts are preserved, with contact expressed in the shared scene frame.
"""
import json,hashlib
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R,Slerp
from opening_worker_motion import OpeningWorker
from opening_worker_io import Writer
from cathexis_motion_math import mat

def rotation(m):return m[..., :3, :3]/np.linalg.norm(m[..., :3, :3],axis=-2)[...,None,:]
def smooth(x):
 x=np.clip(x,0,1);return x*x*(3-2*x)
def swing(a,b):
 a=a/np.linalg.norm(a);b=b/np.linalg.norm(b)
 return R.from_quat(np.r_[np.cross(a,b),1+np.dot(a,b)]).as_matrix()
def reach(b,w,side,target,pole):
 a,e,h=[b.names[side+n]for n in ['Arm','ForeArm','Hand']];p=w[a,:3,3].copy();v=target-p;length=np.linalg.norm(v);axis=v/max(length,1e-8)
 l1=np.linalg.norm(w[e,:3,3]-p);l2=np.linalg.norm(w[h,:3,3]-w[e,:3,3]);d=np.clip(length,abs(l1-l2)+.005,(l1+l2)*.995)
 bend=pole-axis*np.dot(axis,pole);bend/=np.linalg.norm(bend);along=(l1*l1-l2*l2+d*d)/(2*d)
 elbow=p+axis*along+bend*np.sqrt(max(0,l1*l1-along*along));end=p+axis*d
 b.rotate_chain(w,a,swing(w[e,:3,3]-p,elbow-p));b.rotate_chain(w,e,swing(w[h,:3,3]-w[e,:3,3],end-w[e,:3,3]))
 return float(np.linalg.norm(end-target))
def write_world(writer,b,name,times,world,extras):
 local=world.copy()
 for j in b.order:
  if j in b.parent:local[:,j]=np.linalg.inv(world[:,b.parent[j]])@world[:,j]
 tracks=[(j,'rotation',R.from_matrix(rotation(local[:,j])).as_quat())for j in b.d['sk']['joints']]
 h=b.names['Hips'];tracks.append((h,'translation',local[:,h,:3,3]));writer.clip(name,times,tracks,extras)

root=Path(__file__).resolve().parents[4];folder=root/'output/opening-cast/sam';source=folder/'sam-kneel-source-v1.glb';bank=folder/'sam-motion-contact-v1.glb'
src=OpeningWorker(source);b=OpeningWorker(bank);writer=Writer(b.d)
names=['Kneel_Source','Kneel_To_Help','Attend_Bob','Rise_From_Help'];writer.g['animations']=[c for c in writer.g['animations']if c['name']not in names]
for name,j in b.names.items():
 if j in b.d['sk']['joints']and not np.allclose(b.bind[j],src.bind[src.names[name]],atol=2e-5):raise ValueError('Rig mismatch: '+name)
ts,sl,_=src.sample(src.g['animations'][0],30)
locals=np.tile(np.array([mat(n)for n in b.nodes]),(len(ts),1,1,1))
for j in b.d['sk']['joints']:locals[:,j]=sl[:,src.names[b.nodes[j]['name']]]
native=b.world(locals);digest=hashlib.sha256(source.read_bytes()).hexdigest()
write_world(writer,b,'Kneel_Source',ts,native,{'origin':'Meshy Action 365','sourceSha256':digest,'status':'untouched source'})
scale=1.65/np.ptp(b.skin(b.bind)[:,1]);anchor=np.array([122.87,111.18]);contact=np.array([123.6294,111.4365,.35]);delta=contact[:2]-anchor
yaw=np.arctan2(-delta[0],delta[1]);horizontal=R.from_euler('z',-yaw).apply(np.r_[delta,0])[:2]/scale
target=np.array([horizontal[0],contact[2]/scale,horizontal[1]])
# Flat palm on the shoulder: fingers forward, palm surface down.
palm=np.array([[-1.,0,0],[0,0,1],[0,1,0]])
sockets=json.loads((root/'apps/lab/lib/loopforge/agents/opening-worker-sockets.json').read_text())['sam'];moving=[]
def visit(j):
 moving.append(j)
 for child in b.nodes[j].get('children',[]):visit(child)
visit(b.names['Hips']);legs=np.unique(np.r_[b.region_ids['legL'],b.region_ids['legR']]);errors=[]
def source_at(t):
 local=locals[0].copy()
 for j in b.d['sk']['joints']:
  local[j,:3,:3]=Slerp(ts,R.from_matrix(rotation(locals[:,j])))([t]).as_matrix()[0]*np.linalg.norm(local[j,:3,:3],axis=0)
  local[j,:3,3]=[np.interp(t,ts,locals[:,j,k,3])for k in range(3)]
 return b.world(local)
def fitted(w,weight,seconds=0):
 # The lowest leg surface, not a dangling finger, establishes floor contact.
 w=w.copy()
 # Widen the stock standing knees by at most four degrees, tapering to zero
 # before the supported kneel. One smooth curve avoids framewise solver jitter.
 angle=-4*smooth((w[b.names['Hips'],1,3]-.78)/.15)
 w=b.clearance(w,np.deg2rad(angle),'legs')
 w[moving,1,3]+=.002-b.skin(w)[legs,1].min()
 lean=40*weight+np.sin(seconds*2*np.pi/6)*.8*weight
 b.rotate_chain(w,b.names['Spine02'],R.from_euler('x',lean*.6,degrees=True).as_matrix());b.rotate_chain(w,b.names['Spine01'],R.from_euler('x',lean*.4,degrees=True).as_matrix())
 # Counter some of the torso pitch so sam looks toward bob's face.
 b.rotate_chain(w,b.names['neck'],R.from_euler('x',-10*weight,degrees=True).as_matrix())
 if seconds:b.rotate_chain(w,b.names['Head'],R.from_euler('y',2*np.sin(seconds*2*np.pi/6),degrees=True).as_matrix())
 skin=b.skin(w);knee=w[b.names['LeftLeg'],:3,3];leg=skin[b.region_ids['legL']];near=leg[np.linalg.norm(leg[:,[0,2]]-knee[[0,2]],axis=1)<.11]
 brace=knee.copy();brace[1]=near[:,1].max()+.012;brace[2]-=.03
 for side,goal,pole in [('Right',target,[-1,-.2,-.1]),('Left',brace,[1,-.5,-.2])]:
  hand=b.names[side+'Hand'];offset=np.array(sockets[side.lower()])*.01;start=w[hand].copy();desired=goal-palm@offset
  desired=start[:3,3]*(1-weight)+desired*weight
  if side=='Left':
   desired[1]+=.18*np.sin(np.pi*weight)
   desired[0]+=.22*np.sin(np.pi*weight)
  errors.append(reach(b,w,side,desired,np.array(pole)))
  handrot=Slerp([0,1],R.from_matrix([rotation(start),palm]))([weight]).as_matrix()[0];b.rotate_chain(w,hand,handrot@rotation(w[hand]).T)
 return w
lower_t=np.linspace(0,2.4,73);lower=np.array([fitted(source_at(2.2-2*smooth(t/2.4)),smooth((t-.25)/2.15))for t in lower_t])
hold_t=np.linspace(0,6,181);hold=np.array([fitted(source_at(.2),1,float(t))for t in hold_t]);rise=lower[::-1].copy()
metadata={'origin':'fitted Meshy Action 365','sourceSha256':digest,'rootMotion':'preserve','status':'contact candidate'}
for name,times,world in [('Kneel_To_Help',lower_t,lower),('Attend_Bob',hold_t,hold),('Rise_From_Help',lower_t,rise)]:write_world(writer,b,name,times,world,metadata)
writer.save(bank)
qa=[]
for name,times,world in [('Kneel_To_Help',lower_t,lower),('Attend_Bob',hold_t,hold),('Rise_From_Help',lower_t,rise)]:
 hits={str(pair):[]for pair in b.pairs}
 for t,w in zip(times,world):
  counts=b.contacts(b.skin(w))
  for pair,count in zip(b.pairs,counts):
   if count:hits[str(pair)].append(round(float(t),3))
 qa.append({'clip':name,'duration':float(times[-1]),'minimumY':float(min(b.skin(w)[:,1].min()for w in world)),'contactFrames':{p:len(v)for p,v in hits.items()},'contactTimes':{p:v for p,v in hits.items()if v}})
hand=b.names['RightHand'];socket=np.r_[sockets['right'],1.]
palm_errors=[float(np.linalg.norm((w[hand]@socket)[:3]-target))for w in hold]
report={'supportPalmErrorM':max(palm_errors),'sourceTask':'01a16027-0b35-751f-bf47-fa5951663447','action':365,'sourceSha256':digest,'anchor':anchor.tolist(),'yaw':float(np.rad2deg(yaw)%360),'bobShoulderWorld':contact.tolist(),'localPalmTarget':target.tolist(),'maxReachErrorM':max(errors),'poseQA':qa,'status':'candidate; paired scene visual review pending'}
(folder/'help-contact-v1.json').write_text(json.dumps(report,indent=2)+'\n')
(root/'apps/lab/lib/loopforge/agents/opening-worker-pairs.json').write_text(json.dumps({'sam-bob':{'samAnchor':anchor.tolist(),'samYaw':float(np.rad2deg(yaw)%360),'bobAnchor':[123.55,111.7],'bobYaw':180,'bobClip':'Electrocuted_Fall','bobTime':6.333,'contact':contact.tolist(),'lowerDuration':2.4,'holdDuration':6,'riseDuration':2.4}},indent=2)+'\n')
print(json.dumps({**report,'poseQA':[{k:v for k,v in q.items()if k!='contactTimes'}for q in qa]}))
