"""Measure candidate animation contacts. A zero sample count is not visual approval."""
import argparse,json
from pathlib import Path
from opening_worker_motion import OpeningWorker,np
ap=argparse.ArgumentParser();ap.add_argument('directory',type=Path);ap.add_argument('--workers',nargs='+',default=['bob']);ap.add_argument('--hz',type=int,default=30);args=ap.parse_args()
for name in args.workers:
 folder=args.directory/name;w=OpeningWorker(folder/(name+'-motion-candidate-v1.glb'));rows=[]
 for clip in w.g['animations']:
  if clip['name']=='Rig_Source' or clip['name'].startswith('Meshy_'):continue
  ts,local,world=w.sample(clip,args.hz);counts=np.zeros(len(w.pairs),int);peaks=np.zeros(len(w.pairs),int);markers=np.zeros(len(w.pairs));floor=1e9;below=0;floor_t=0
  for t,pose in zip(ts,world):
   v=w.skin(pose);y=float(v[:,1].min());below+=int(y<-.003)
   if y<floor:floor=y;floor_t=float(t)
   hits=np.array(w.contacts(v));counts+=hits>0
   for i in np.flatnonzero(hits>peaks):peaks[i]=hits[i];markers[i]=t
  row={'clip':clip['name'],'samples':len(ts),'minimumY':round(floor,5),'minimumAt':round(floor_t,3),'floorPenetrationFrames':below,'contacts':[{'pair':'/'.join(pair),'frames':int(count),'peakTriangles':int(peak),'peakAt':round(float(t),3)}for pair,count,peak,t in zip(w.pairs,counts,peaks,markers)if count]};rows.append(row)
  print(name,clip['name'],'floor',round(floor,3),'contact frames',int(counts.sum()),flush=True)
 (folder/'motion-contact-audit-v1.json').write_text(json.dumps({'worker':name,'sampleHz':args.hz,'method':'Skinned mesh triangle crossings for separated limb/body regions; full mesh vs flat floor. Does not certify blends, props, environment, or aesthetic quality.','clips':rows},indent=2)+'\n')
