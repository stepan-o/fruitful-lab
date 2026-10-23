#!/usr/bin/env python3
"""Deterministic, standard-library-only GLB writer. No Sam mesh buffers read.

Run from any directory: python3 /absolute/path/build_holder.py
Writes only beside this script. One rigid mesh, one material, five closed panels.
Local origin is mouth centre; +Y up, +Z outward, +X tangent. Metres.
"""
import hashlib
import json
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent
P = json.loads((ROOT / 'holder-parameters.json').read_text())
w, d, g, t = (P[k] for k in ('cavityWidth', 'cavityDepthUpAxis', 'cavityNormalGap', 'wallThickness'))
cw, ch, ct = P['cardDimensions']
assert all(v > 0 for v in (w, d, g, t, cw, ch, ct))
assert w >= cw + .010 - 1e-12 and g >= ct + .010 - 1e-12 and d >= ch
panels = [
    ('backing', [-w/2-t, -d-t, -g/2-t], [w/2+t, 0, -g/2]),
    ('front', [-w/2-t, -d-t, g/2], [w/2+t, 0, g/2+t]),
    ('left_rail', [-w/2-t, -d, -g/2], [-w/2, 0, g/2]),
    ('right_rail', [w/2, -d, -g/2], [w/2+t, 0, g/2]),
    ('bottom_stop', [-w/2-t, -d-t, -g/2], [w/2+t, -d, g/2]),
]
positions, normals, indices, ranges = [], [], [], []
# Each face: outward normal, tangent a, tangent b; a cross b = normal.
faces = [((1,0,0),(0,1,0),(0,0,1)), ((-1,0,0),(0,0,1),(0,1,0)),
         ((0,1,0),(0,0,1),(1,0,0)), ((0,-1,0),(1,0,0),(0,0,1)),
         ((0,0,1),(1,0,0),(0,1,0)), ((0,0,-1),(0,1,0),(1,0,0))]
for name, lo, hi in panels:
    start = len(indices)
    centre = [(a+b)/2 for a,b in zip(lo,hi)]
    half = [(b-a)/2 for a,b in zip(lo,hi)]
    for n,a,b in faces:
        offset = len(positions)
        for sa,sb in ((-1,-1),(1,-1),(1,1),(-1,1)):
            positions.append([centre[k] + half[k]*(n[k]+sa*a[k]+sb*b[k]) for k in range(3)])
            normals.append(n)
        indices.extend(offset+i for i in (0,1,2,0,2,3))
    ranges.append({'name':name,'min':lo,'max':hi,'firstIndex':start,'indexCount':len(indices)-start})

chunks = [struct.pack('<'+'f'*len(positions)*3, *(v for p in positions for v in p)),
          struct.pack('<'+'f'*len(normals)*3, *(v for n in normals for v in n)),
          struct.pack('<'+'H'*len(indices), *indices)]
views, binary = [], b''
for i,b in enumerate(chunks):
    binary += b'\0' * (-len(binary)%4)
    views.append({'buffer':0,'byteOffset':len(binary),'byteLength':len(b),'target':34963 if i==2 else 34962})
    binary += b
minimum = [min(p[k] for p in positions) for k in range(3)]
maximum = [max(p[k] for p in positions) for k in range(3)]
stored_y = -d + ch/2
withdrawn_y = ch/2 + P['withdrawnBottomAboveMouth']
def linear(v):
    return v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4
rgb = P['material']['referenceSRGB'].lstrip('#')
factor = [linear(int(rgb[i:i+2],16)/255) for i in (0,2,4)] + [1]
doc = {
    'asset':{'version':'2.0','generator':'LST-43 deterministic primitive recipe H1'},
    'scene':0,'scenes':[{'nodes':[0]}],
    'nodes':[{'name':'sam_holder_H1_unplaced','mesh':0,'children':[1,2,3],
              'extras':{'placement':'UNPLACED: do not attach without endpoint fit','units':'metres'}},
             {'name':'holder_mouth','translation':[0,0,0]},
             {'name':'stored_card','translation':[0,stored_y,0]},
             {'name':'withdrawn_card','translation':[0,withdrawn_y,0]}],
    'meshes':[{'name':'sam_holder_H1_panels','primitives':[{'attributes':{'POSITION':0,'NORMAL':1},'indices':2,'material':0,'mode':4}],
               'extras':{'panelIndexRanges':ranges,'construction':'Five closed panels with abutting seams; internal faces retained.'}}],
    'materials':[{'name':P['material']['name'],'pbrMetallicRoughness':{'baseColorFactor':factor,'metallicFactor':P['material']['metallicFactor'],'roughnessFactor':P['material']['roughnessFactor']},'alphaMode':'OPAQUE','doubleSided':False}],
    'buffers':[{'byteLength':len(binary)}],'bufferViews':views,
    'accessors':[{'bufferView':0,'componentType':5126,'count':len(positions),'type':'VEC3','min':minimum,'max':maximum},
                 {'bufferView':1,'componentType':5126,'count':len(normals),'type':'VEC3'},
                 {'bufferView':2,'componentType':5123,'count':len(indices),'type':'SCALAR','min':[0],'max':[max(indices)]}],
    'extras':{'proposalVersion':P['version'],'bodyFit':'NOT MEASURED','sameMeshFor':['portrait','floor','console']}
}
j = json.dumps(doc,sort_keys=True,separators=(',',':')).encode()
j += b' ' * (-len(j)%4)
binary += b'\0' * (-len(binary)%4)
out = struct.pack('<4sII',b'glTF',2,28+len(j)+len(binary)) + struct.pack('<II',len(j),0x4E4F534A) + j + struct.pack('<II',len(binary),0x004E4942) + binary
(ROOT/'sam-holder-H1.glb').write_bytes(out)
metrics = {'version':P['version'],'sha256':hashlib.sha256(out).hexdigest(),'bytes':len(out),
           'triangles':len(indices)//3,'vertices':len(positions),'meshPrimitives':1,'materials':1,'textures':0,'skins':0,'animations':0,
           'boundsMetres':{'min':minimum,'max':maximum,'size':[maximum[k]-minimum[k] for k in range(3)]},
           'cavityMetres':{'width':w,'depthUpAxis':d,'normalGap':g},'mouthMetres':[w,g],
           'storedCardCentreMetres':[0,stored_y,0],'withdrawnCardCentreMetres':[0,withdrawn_y,0],
           'withdrawalTravelMetres':withdrawn_y-stored_y,'cardTopRecessMetres':d-ch,
           'panels':ranges,'material':P['material'],'materialLinearBaseColorFactor':factor,
           'scope':'Authored geometry metrics only; no Sam fit, runtime, appearance or performance acceptance.'}
(ROOT/'holder-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n')
print(json.dumps({k:metrics[k] for k in ('version','sha256','bytes','triangles','vertices','withdrawalTravelMetres')}))
