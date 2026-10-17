"""Check head proximity and exact source elbow preservation at 120 Hz."""
from worker_motion import *
from scipy.spatial import cKDTree
import argparse,hashlib
p=argparse.ArgumentParser(description=__doc__);p.add_argument('asset',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
b=Worker(args.asset,True);src=next(c for c in b.g['animations']if c['name']=='Confused_Scratch');clip=next(c for c in b.g['animations']if c['name']=='Confused_Scratch_Corrected')
def elbow_sampler(c):
 channel=next(ch for ch in c['channels']if ch['target']=={'node':22,'path':'rotation'})
 return c['samplers'][channel['sampler']]
a,z=elbow_sampler(src),elbow_sampler(clip)
for key in ['input','output']:assert np.array_equal(b.d['acc'](a[key]),b.d['acc'](z[key])), 'Source elbow '+key+' changed'
assert a.get('interpolation','LINEAR')==z.get('interpolation','LINEAR')
ts,sl,sw=b.sample(src,120);_,cl,cw=b.sample(clip,120);gaps=[];deltas=[];flex=[]
for k,t in enumerate(ts):
 v=b.skin(cw[k]);gaps.append(float(cKDTree(v[b.region_ids['head']]).query(v[b.region_ids['handR']])[0].min()))
 a=sl[k,22,:3,:3];a=a/np.linalg.norm(a,axis=0);z=cl[k,22,:3,:3];z=z/np.linalg.norm(z,axis=0)
 deltas.append(float(R.from_matrix(z@a.T).magnitude()))
 s,e,h=cw[k,[19,22,26],:3,3];u=e-s;v=h-e
 flex.append(float(np.degrees(np.arccos(np.clip(np.dot(u,v)/np.linalg.norm(u)/np.linalg.norm(v),-1,1)))))
beats=[]
for name,start,end in [('first scratch',.9,2.12),('temple',3.1,4.15),('second scratch',7.78,8.9)]:
 d=np.array(gaps)[(ts>=start)&(ts<=end)];assert d.max()<.015,(name,d.max())
 beats.append({'name':name,'start':start,'end':end,'samples':len(d),'minimumGapMetres':float(d.min()),'maximumGapMetres':float(d.max())})
assert max(deltas)<1e-6,max(deltas)
r={'sha256':hashlib.sha256(args.asset.read_bytes()).hexdigest(),'sampleRate':120,'method':'Nearest exported hand/head vertices during three authored contact holds; 15 mm proximity gate. Source right-elbow input/output arrays and interpolation must match exactly. Shoulder/wrist contact fitting cannot alter elbow flexion or twist. Proximity alone is not visual acceptance.','exactSourceElbow':True,'maximumElbowDeltaRadians':max(deltas),'maximumElbowFlexionDegrees':max(flex),'beats':beats}
args.output.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
