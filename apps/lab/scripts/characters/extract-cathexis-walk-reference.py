"""Extract the measured reference: python extract-cathexis-walk-reference.py STILETTO.glb."""
from pathlib import Path
import json, hashlib, sys
from cathexis_motion_math import context
import numpy as np
p=Path(sys.argv[1]);assert hashlib.sha256(p.read_bytes()).hexdigest()=='ad84c17431f6eea244b9a15f46296f0da63d7ae9726e2f7d2622f9d522b6f97b','Unexpected Quick Walk reference'
d=context(p);clip=next(c for c in d['g']['animations'] if c['name']=='Quick_Walk');tr=d['tracks'](clip);times=np.linspace(0,1,121)
# First full one-second stride, not the three repeated cycles of the clip.
points=[]
for t in times:
 w=d['world_at'](tr,t);points.append((w[[4,7,10,5,8,11],:3,3]-w[3,:3,3]).tolist())
Path(__file__).with_name('cathexis-quick-walk-reference.json').write_text(json.dumps({'sourceSHA256':hashlib.sha256(p.read_bytes()).hexdigest(),'clip':'Quick_Walk','cycleSeconds':1,'order':['LeftUpLeg','LeftLeg','LeftFoot','RightUpLeg','RightLeg','RightFoot'],'times':times.tolist(),'hipRelativeJointPositions':points},separators=(',',':')))
