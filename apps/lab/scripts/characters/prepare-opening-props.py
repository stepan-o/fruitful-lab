"""Bake card-holding derivatives onto each approved worker rig.
Preserve source pelvis/legs and left-arm acting. A two-bone solution places the
right palm ahead of that body's actual chest envelope. No runtime IK or new rig.
"""
import argparse,json
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from opening_worker_motion import OpeningWorker
from opening_worker_io import Writer

def rotation(m):return m[...,:3,:3]/np.linalg.norm(m[...,:3,:3],axis=-2)[...,None,:]
def swing(a,b):
 a=a/np.linalg.norm(a);b=b/np.linalg.norm(b);d=np.dot(a,b)
 return R.from_quat(np.r_[np.cross(a,b),1+d]).as_matrix()if d>-.99999 else R.from_rotvec([np.pi,0,0]).as_matrix()
def reach(b,w,desired,pole):
 a=b.names['RightArm'];e=b.names['RightForeArm'];h=b.names['RightHand'];p=w[a,:3,3].copy();v=desired-p
 l1=np.linalg.norm(w[e,:3,3]-p);l2=np.linalg.norm(w[h,:3,3]-w[e,:3,3]);d=np.linalg.norm(v);axis=v/d;d=np.clip(d,abs(l1-l2)+.01,(l1+l2)*.975);target=p+axis*d
 bend=pole-axis*np.dot(axis,pole);bend/=np.linalg.norm(bend)
 along=(l1*l1-l2*l2+d*d)/(2*d);elbow=p+axis*along+bend*np.sqrt(max(0,l1*l1-along*along))
 b.rotate_chain(w,a,swing(w[e,:3,3]-p,elbow-p));b.rotate_chain(w,e,swing(w[h,:3,3]-w[e,:3,3],target-w[e,:3,3]));return target
ap=argparse.ArgumentParser();ap.add_argument('directory',type=Path);ap.add_argument('workers',nargs='+');args=ap.parse_args()
sockets={}
for name in args.workers:
 folder=args.directory/name;b=OpeningWorker(folder/(name+'-motion-fitted-v1.glb'));writer=Writer(b.d);records=[]
 source={c['name']:c for c in b.g['animations']};bindskin=b.skin(b.bind);torso=bindskin[b.region_ids['torso']]
 chest=b.names['Spine'];hip=b.names['Hips'];width=abs(b.bind[b.names['LeftArm'],0,3]-b.bind[b.names['RightArm'],0,3]);front=np.quantile(torso[:,2],.95)-b.bind[chest,2,3]
 sockets[name]={}
 for side,prefix in [('left','Left'),('right','Right')]:
  h=b.names[prefix+'Hand'];ids=b.region_ids['hand'+('L'if side=='left'else'R')];hv=np.c_[bindskin[ids],np.ones(len(ids))]@np.linalg.inv(b.bind[h]).T
  low,high=np.quantile(hv[:,:3],[.05,.95],axis=0);length=high[1]-low[1];palm=hv[(hv[:,1]>low[1]+length*.15)&(hv[:,1]<low[1]+length*.5)]
  sockets[name][side]=[0,float(low[1]+length*.48),float(np.quantile(palm[:,2],.05)-1)]
 for dest,src in [('ID_Ready','idle'),('ID_Walk','walking_2_inplace')]+([('ID_Limp','injured_walk')]if name=='bob'else[]):
  ts,local,out=b.sample(source[src],30);errors=[];contacts=[]
  for i,w in enumerate(out):
   basis=rotation(w[chest])@rotation(b.bind[chest]).T;original=w.copy();target=None
   # Keep oversized forearms forward of the painted chest plates. Inspect the
   # actual mesh after each candidate, not just the skeleton's centre line.
   for extra in np.arange(0,.181,.02):
    w=original.copy();target=w[chest,:3,3]+basis@np.array([-width*.3,-.12,front+.13+extra]);pole=basis@np.array([-.8,-.5,.05]);reached=reach(b,w,target,pole)
    hand=b.names['RightHand'];wanted=basis@np.diag([-1,1,-1]);b.rotate_chain(w,hand,wanted@rotation(w[hand]).T)
    hits=b.intersects(b.skin(w),[p for p in b.pairs if 'R' in p[0] or 'R' in p[1]])
    if not hits:break
   out[i]=w;errors.append(float(np.linalg.norm(reached-target)));contacts.append(bool(hits))
  for j in b.order:local[:,j]=np.linalg.inv(out[:,b.parent[j]])@out[:,j]if j in b.parent else out[:,j]
  tracks=[(j,'rotation',R.from_matrix(rotation(local[:,j])).as_quat())for j in b.d['sk']['joints']];tracks.append((hip,'translation',local[:,hip,:3,3]))
  writer.clip(dest,ts,tracks,{'origin':src,'status':'card contact candidate','authored':'right-arm two-bone reach; source feet and left arm retained'})
  records.append({'clip':dest,'source':src,'samples':len(ts),'maxTargetErrorM':max(errors),'remainingContactFrames':sum(contacts)})
 writer.save(folder/(name+'-motion-contact-v1.glb'));(folder/'card-contact-v1.json').write_text(json.dumps({'worker':name,'clips':records},indent=2)+'\n');print(name,json.dumps(records),flush=True)

Path(__file__).resolve().parents[2].joinpath('lib/loopforge/agents/opening-worker-sockets.json').write_text(json.dumps(sockets,indent=2)+'\n')
