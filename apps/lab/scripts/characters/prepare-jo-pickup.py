"""Keep Action 276 intact and add a floor-aligned pickup on jo's existing rig."""
import json,hashlib
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R
from scipy.ndimage import maximum_filter1d,gaussian_filter1d
from opening_worker_motion import OpeningWorker
from opening_worker_io import Writer
from cathexis_motion_math import mat
folder=Path(__file__).resolve().parents[4]/'output/opening-cast/jo'
src=OpeningWorker(folder/'jo-pickup-source-v1.glb');dst=OpeningWorker(folder/'jo-motion-contact-v1.glb');writer=Writer(dst.d)
# This is the same Meshy rig, but exported root nodes are allowed to have different
# indices. Require identical bind transforms before copying native local tracks.
for name,i in dst.names.items():
 if name in src.names and i in dst.d['sk']['joints']:
  if not np.allclose(dst.bind[i],src.bind[src.names[name]],atol=2e-5):raise ValueError('Rig changed: '+name)
c=src.g['animations'][0];ts,local,w=src.sample(c,30);minima=np.array([src.skin(v)[:,1].min()for v in w]);lift=gaussian_filter1d(maximum_filter1d(.002-minima,size=5,mode='nearest'),1,mode='nearest');lift=np.maximum(lift,.002-minima)
for name,corrected in [('Male_Bend_Over_Pick_Up',False),('Pickup_Card',True)]:
 tracks=[]
 for i in dst.d['sk']['joints']:
  sn=src.names[dst.nodes[i]['name']];m=local[:,sn].copy()
  if corrected and dst.nodes[i]['name']=='Hips':
   parent=src.parent[sn];delta=np.zeros((len(ts),3));delta[:,1]=lift;m[:,:3,3]+=np.linalg.solve(w[:,parent,:3,:3],delta[...,None])[...,0]
  rot=m[:,:3,:3]/np.linalg.norm(m[:,:3,:3],axis=-2)[:,None,:]
  tracks.append((i,'rotation',R.from_matrix(rot).as_quat()))
  if dst.nodes[i]['name']=='Hips':tracks.append((i,'translation',m[:,:3,3]))
 writer.clip(name,ts,tracks,{'origin':'Meshy Action 276','sourceSha256':hashlib.sha256((folder/'jo-pickup-source-v1.glb').read_bytes()).hexdigest(),'status':'floor-aligned candidate'if corrected else'original source'})
writer.save(folder/'jo-motion-contact-v1.glb')
report={'sourceTask':'01a15fc7-8380-70c7-af64-c965ed8f7b7d','action':276,'duration':float(ts[-1]),'contactSeconds':1.5,'pickupHand':'right','originalMinimumY':float(minima.min()),'fittedMinimumY':float((minima+lift).min()),'floorLiftRange':lift[[np.argmin(lift),np.argmax(lift)]].tolist(),'status':'candidate; card edge grip and transition review pending'}
(folder/'pickup-contact-v1.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
