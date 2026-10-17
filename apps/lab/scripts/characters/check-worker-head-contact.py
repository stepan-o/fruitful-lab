"""Check baked head proximity and original elbow bend-plane preservation at 120 Hz."""
from worker_motion import *
from scipy.spatial import cKDTree
import argparse,hashlib
p=argparse.ArgumentParser(description=__doc__);p.add_argument('asset',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
b=Worker(args.asset,True);src=next(c for c in b.g['animations']if c['name']=='Confused_Scratch');clip=next(c for c in b.g['animations']if c['name']=='Confused_Scratch_Corrected')
ts,sl,sw=b.sample(src,120);_,cl,cw=b.sample(clip,120);gaps=[];hinge=[]
for k,t in enumerate(ts):
 v=b.skin(cw[k]);gaps.append(float(cKDTree(v[b.region_ids['head']]).query(v[b.region_ids['handR']])[0].min()))
 # Correction may flex the source elbow, but cannot introduce a new twist/pole.
 a=sl[k,22,:3,:3];a/=np.linalg.norm(a,axis=0);z=cl[k,22,:3,:3];z/=np.linalg.norm(z,axis=0)
 delta=R.from_matrix(z@a.T).as_rotvec();s,e,h=sw[k,[19,22,26],:3,3];axis=np.cross(e-s,h-e);axis=np.linalg.inv(sw[k,19,:3,:3])@axis;axis/=np.linalg.norm(axis)
 hinge.append(float(np.linalg.norm(delta-axis*np.dot(delta,axis))))
beats=[]
for name,start,end in [('first scratch',.9,2.12),('temple',3.1,4.15),('second scratch',7.78,8.9)]:
 d=np.array(gaps)[(ts>=start)&(ts<=end)];assert d.max()<.015,(name,d.max())
 beats.append({'name':name,'start':start,'end':end,'samples':len(d),'minimumGapMetres':float(d.min()),'maximumGapMetres':float(d.max())})
assert max(hinge)<.002,max(hinge)
r={'sha256':hashlib.sha256(args.asset.read_bytes()).hexdigest(),'sampleRate':120,'method':'Nearest exported hand/head vertices during the three authored contact holds; 15 mm proximity gate. Elbow correction is restricted to flexion about the original source bend-plane normal. Proximity alone is not visual acceptance.','maximumHingeOffAxisRadians':max(hinge),'beats':beats}
args.output.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
