"""Fit inherited motion to new worker proportions. Output remains review-only.

Small shoulder/hip envelopes repair incidental crossings without rewriting the
source elbow/knee curves. Explicit contact acting and floor placement are
recorded separately; unresolved samples remain visible in the report.
"""
import argparse,json
from pathlib import Path
from scipy.ndimage import gaussian_filter1d,maximum_filter1d
from scipy.spatial.transform import Rotation as R
from opening_worker_motion import OpeningWorker,np
from opening_worker_io import Writer

def rotation(m):return m[...,:3,:3]/np.linalg.norm(m[...,:3,:3],axis=-2)[...,None,:]
def swing(a,b):
 a=a/np.linalg.norm(a);b=b/np.linalg.norm(b);d=np.dot(a,b)
 return R.from_quat(np.r_[np.cross(a,b),1+d]).as_matrix()if d>-.99999 else R.from_rotvec([np.pi,0,0]).as_matrix()
def arm_pose(b,w,a):
 w=w.copy();chest=b.names['Spine'];basis=rotation(w[chest])@rotation(b.bind[chest]).T
 for sign,prefix in [(1,'Left'),(-1,'Right')]:
  upper=b.names[prefix+'Arm'];hand=b.names[prefix+'Hand'];delta=w[hand,:3,3]-w[upper,:3,3]
  b.rotate_chain(w,upper,swing(delta,delta+sign*basis[:,0]*a))
 return w
ap=argparse.ArgumentParser();ap.add_argument('directory',type=Path);ap.add_argument('--workers',nargs='+',default=['bob']);ap.add_argument('--clips',nargs='*');args=ap.parse_args()
for name in args.workers:
 folder=args.directory/name;b=OpeningWorker(folder/(name+'-motion-candidate-v1.glb'));writer=Writer(b.d);writer.g['animations']=[];records=[]
 for c in b.g['animations']:
  if c['name']=='Rig_Source' or c['name'].startswith('Meshy_') or (args.clips and c['name']not in args.clips):writer.g['animations'].append(c);continue
  ts,local,original=b.sample(c,30);out=original.copy();report={};cyclic=c['name']in ['walking_2_inplace','run_fast_10_inplace','Carry_Heavy_Object_Walk_inplace','Hot_Walk','injured_walk','idle','Alert'];mode='wrap'if cyclic else'nearest'
  for kind,maximum,step in [('legs',np.radians(6),np.radians(.5)),('arms',.12,.01)]:
   pairs=b.pairs[:1]if kind=='legs'else b.pairs[1:];pose=(lambda w,a:b.clearance(w,a,'legs'))if kind=='legs'else(lambda w,a:arm_pose(b,w,a));needs=[]
   for w in out:
    a=0.
    while b.intersects(b.skin(pose(w,a)),pairs)and a<maximum:a+=step
    needs.append(a)
   needs=np.array(needs);envelope=gaussian_filter1d(maximum_filter1d(needs,size=9,mode=mode),1.5,mode=mode)
   if envelope.max()>0:envelope+=step*.3
   before=out.copy()
   for iteration in range(3):
    out=np.array([pose(w,a)for w,a in zip(before,envelope)]);hits=np.array([b.intersects(b.skin(w),pairs)for w in out])
    if not hits.any():break
    envelope=np.minimum(maximum+step,envelope+gaussian_filter1d(maximum_filter1d(hits.astype(float),size=7,mode=mode),1,mode=mode)*step)
   report[kind]={'maximum':float(envelope.max()),'unit':'radians'if kind=='legs'else'metres','remainingFrames':int(hits.sum()),'limitFrames':int((needs>=maximum).sum())}
  # New eyes and forearms require their own floor clearance. Keep this correction
  # in the baked pelvis curve; the review camera and world floor never chase it.
  minima=np.array([b.skin(w)[:,1].min()for w in out]);floor_offset=np.full(len(ts),.002-float(minima.min()))
  if c['name']=='Electrocuted_Fall':
   # Follow support geometry during collapse, smooth the clearance envelope,
   # then guarantee no sampled vertex passes through the stationary floor.
   floor_offset=gaussian_filter1d(maximum_filter1d(.002-minima,size=5,mode='nearest'),1,mode='nearest');floor_offset=np.maximum(floor_offset,.002-minima)
  joints=b.d['sk']['joints'];out[:,joints,1,3]+=floor_offset[:,None]
  for i in b.order:local[:,i]=np.linalg.inv(out[:,b.parent[i]])@out[:,i]if i in b.parent else out[:,i]
  tracks=[(i,'rotation',R.from_matrix(rotation(local[:,i])).as_quat())for i in joints];tracks.append((b.names['Hips'],'translation',local[:,b.names['Hips'],:3,3]))
  writer.clip(c['name'],ts,tracks,{'origin':'opening worker retarget','status':'fit candidate','contactAcceptance':False})
  report.update(clip=c['name'],samples=len(ts),floorOffsetRange=[float(floor_offset.min()),float(floor_offset.max())],minimumY=float((minima+floor_offset).min()));records.append(report)
  print(name,c['name'],json.dumps(report),flush=True)
 writer.g['asset']['extras']['revision']='motion-fit/1';writer.save(folder/(name+'-motion-fitted-v1.glb'))
 (folder/'motion-fitting-v1.json').write_text(json.dumps({'worker':name,'status':'candidate; targeted acting, blends and final high-frequency validation pending','clips':records},indent=2)+'\n')
