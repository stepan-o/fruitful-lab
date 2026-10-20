from pathlib import Path
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'scripts/characters'))
from worker_motion import Worker,R,np,mat
p=ROOT/'lib/loopforge/agents/worker-checkpoint-recovery.json'
d=json.loads(p.read_text());wp=ROOT/'public/media/files'/f"{d['sources']['worker']}.glb"
assert hashlib.sha256(wp.read_bytes()).hexdigest()==d['sources']['worker']
w=Worker(wp,True);names={n.get('name'):i for i,n in enumerate(w.nodes)}
count=round(d['seconds']*d['fps'])+1
frames=np.repeat(np.array([mat(n)for n in w.nodes])[None,:,:,:],count,axis=0)
for t in d['tracks']:
 i=names[t['joint']];key='rotation' if 'rotation'in t else 'position';a=np.array(t[key]);assert len(a)==count and np.isfinite(a).all()
 if key=='rotation':
  assert np.max(np.abs(np.linalg.norm(a,axis=1)-1))<.00001
  scale=np.linalg.norm(frames[0,i,:3,:3],axis=0);frames[:,i,:3,:3]=R.from_quat(a).as_matrix()*scale
 else:frames[:,i,:3,3]=a
minimum=min(w.skin(w.world(f))[:,1].min()for f in frames)
assert minimum>-.001,f'Floor penetration {minimum}'
print(f'Worker recovery: {count} finite poses, {len(d["tracks"])} tracks, exact source SHA, minimum skinned floor {minimum:.6f} m. This does not certify self/partner collision.')
