from worker_motion import *
from worker_correct import arm_pose
import argparse
parser=argparse.ArgumentParser(description='Refine the remaining exported arm contacts, then rebake with --reuse.')
parser.add_argument('workdir',type=Path);parser.add_argument('asset',type=Path);args=parser.parse_args();workdir=args.workdir
b=Worker(args.asset,True);records=json.loads((workdir/'audit.json').read_text())['clips'];requested=[]
for record in records:
 if not record['correctedContactFrames']or(requested and record['id']not in requested):continue
 name=record['id'];c=next(c for c in b.g['animations']if c['name']==name+'_Corrected');ts,local,world=b.sample(c,120);required=[]
 for w in world:
  a=0
  while b.intersects(b.skin(arm_pose(b,w,a)),b.pairs[1:])and a<.15:a+=.0025
  required.append(a)
 env=gaussian_filter1d(maximum_filter1d(required,size=33,mode='nearest'),5,mode='nearest')
 env+=np.where(env>1e-6,.003,0)
 out=np.array([arm_pose(b,w,a)for w,a in zip(world,env)])
 for i in b.order:
  local[:,i]=np.linalg.inv(out[:,b.parent[i]])@out[:,i]if i in b.parent else out[:,i]
 bad=sum(b.intersects(b.skin(w),b.pairs[1:])for w in out);print(name,'arm padding cm',env.max()*100,'remaining',bad,flush=True)
 assert bad==0,'Refinement did not clear contacts';previous=np.load(workdir/(name+'.npz'));np.savez_compressed(workdir/(name+'.npz'),times=ts,local=local[:,:28],source=previous['source'])
