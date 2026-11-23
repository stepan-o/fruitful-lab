#!/usr/bin/env python3
"""Tiny deterministic H2 construction; standard library, no body/engine import.

The same make_boxes parameters generate the mesh and analytic shell boxes.
Origin = mouth centre. +Y extraction, +Z outward, +X tangent. All metres.
"""
import hashlib
import json
import struct
from pathlib import Path

ROOT=Path(__file__).resolve().parent

def make_boxes(p):
    w,g,t,b,y,z0,z1=(p[k] for k in ('halfWidth','cardSlotHalfGap','wall','bottom','wellBottom','wellBack','wellFront'))
    x=w+t
    boxes=[]
    def box(name,lo,hi,contact=None):
        assert all(a<c for a,c in zip(lo,hi))
        boxes.append({'name':name,'lo':lo,'hi':hi,'intendedBodyContact':contact})
    # Narrow lower card guides; shoulders step out below the hand well.
    box('bottom_stop',[-x,b-t,-g-t],[x,b,g+t])
    box('lower_back',[-x,b,-g-t],[x,y-t,-g])
    box('lower_front',[-x,b,g],[x,y-t,g+t])
    box('lower_left',[-x,b,-g],[-w,y-t,g])
    box('lower_right',[w,b,-g],[x,y-t,g])
    box('back_shoulder',[-x,y-t,z0-t],[x,y,-g])
    box('front_shoulder',[-x,y-t,g],[x,y,z1+t])
    box('left_shoulder',[-x,y-t,-g],[-w,y,g])
    box('right_shoulder',[w,y-t,-g],[x,y,g])
    # Continuous opaque front/back lips, wide top opening, no crossbar/lid.
    box('well_back',[-x,y,z0-t],[x,0,z0])
    box('well_front',[-x,y,z1],[x,0,z1+t])
    box('well_left',[-x,y,z0],[-w,0,z1])
    box('well_right',[w,y,z0],[x,0,z1])
    # Separate external mount: only the rear pad faces are body-contact candidates.
    mx,mh=p['mountPadCentreX'],p['mountPadHalfWidth']
    my0,my1=p['mountPadY'];by0,by1=p['mountBridgeY'];mp=p['mountPlane']
    box('external_mount_bridge',[-mx-mh,by0,mp+t],[mx+mh,by1,-g-t])
    for sign,label in ((-1,'left'),(1,'right')):
        box('mount_pad_'+label,[sign*mx-mh,my0,mp],[sign*mx+mh,my1,mp+t],{'face':'-Z','plane':mp,'status':'proposed; support not measured'})
    return boxes

def construct(p):
    boxes=make_boxes(p);positions=[];normals=[];indices=[]
    faces=[((1,0,0),(0,1,0),(0,0,1)),((-1,0,0),(0,0,1),(0,1,0)),
           ((0,1,0),(0,0,1),(1,0,0)),((0,-1,0),(1,0,0),(0,0,1)),
           ((0,0,1),(1,0,0),(0,1,0)),((0,0,-1),(0,1,0),(1,0,0))]
    for box in boxes:
        box['firstIndex']=len(indices);box['indexCount']=36
        c=[(a+b)/2 for a,b in zip(box['lo'],box['hi'])];h=[(b-a)/2 for a,b in zip(box['lo'],box['hi'])]
        for n,a,b in faces:
            off=len(positions)
            for sa,sb in ((-1,-1),(1,-1),(1,1),(-1,1)):
                positions.append([c[k]+h[k]*(n[k]+sa*a[k]+sb*b[k]) for k in range(3)]);normals.append(n)
            indices.extend(off+k for k in (0,1,2,0,2,3))
    binary=b'';views=[]
    for raw,target in ((struct.pack('<'+'f'*len(positions)*3,*(x for v in positions for x in v)),34962),
                       (struct.pack('<'+'f'*len(normals)*3,*(x for v in normals for x in v)),34962),
                       (struct.pack('<'+'H'*len(indices),*indices),34963)):
        binary+=b'\0'*(-len(binary)%4);views.append({'buffer':0,'byteOffset':len(binary),'byteLength':len(raw),'target':target});binary+=raw
    lo=[min(v[k] for v in positions) for k in range(3)];hi=[max(v[k] for v in positions) for k in range(3)]
    rgb=p['material']['srgb'].lstrip('#')
    def linear(n):
        s=n/255;return s/12.92 if s<=.04045 else ((s+.055)/1.055)**2.4
    nodes=[{'name':'sam_holder_H2_unfitted','mesh':0,'children':[1,2,3,4,5],'extras':{'bodyAnchor':None,'units':'metres'}},
           {'name':'holder_mouth','translation':[0,0,0]},
           {'name':'stored_card','translation':p['storedCard']},
           {'name':'withdrawn_card','translation':p['withdrawnCard']}]
    for sign,label in ((-1,'left'),(1,'right')):
        nodes.append({'name':'mount_contact_'+label,'translation':[sign*p['mountPadCentreX'],sum(p['mountPadY'])/2,p['mountPlane']]})
    d={'asset':{'version':'2.0','generator':'H2 deterministic primitive recipe'},'scene':0,'scenes':[{'nodes':[0]}],
       'nodes':nodes,'meshes':[{'name':'sam_holder_H2','primitives':[{'attributes':{'POSITION':0,'NORMAL':1},'indices':2,'material':0,'mode':4}], 'extras':{'boxes':boxes}}],
       'materials':[{'name':p['material']['name'],'alphaMode':'OPAQUE','doubleSided':False,'pbrMetallicRoughness':{'baseColorFactor':[linear(int(rgb[i:i+2],16)) for i in (0,2,4)]+[1],'metallicFactor':p['material']['metallic'],'roughnessFactor':p['material']['roughness']}}],
       'buffers':[{'byteLength':len(binary)}],'bufferViews':views,'accessors':[
         {'bufferView':0,'componentType':5126,'count':len(positions),'type':'VEC3','min':lo,'max':hi},
         {'bufferView':1,'componentType':5126,'count':len(normals),'type':'VEC3'},
         {'bufferView':2,'componentType':5123,'count':len(indices),'type':'SCALAR','min':[0],'max':[max(indices)]}],
       'extras':{'version':p['version'],'status':p['status'],'sameMeshFor':['portrait','floor','console']}}
    j=json.dumps(d,sort_keys=True,separators=(',',':')).encode();j+=b' '*(-len(j)%4);binary+=b'\0'*(-len(binary)%4)
    glb=struct.pack('<4sII',b'glTF',2,28+len(j)+len(binary))+struct.pack('<II',len(j),0x4E4F534A)+j+struct.pack('<II',len(binary),0x004E4942)+binary
    return glb,boxes,{'min':lo,'max':hi,'size':[hi[k]-lo[k] for k in range(3)]}

def main():
    p=json.loads((ROOT/'parameters.json').read_text());glb,boxes,bounds=construct(p)
    (ROOT/'sam-holder-H2.glb').write_bytes(glb)
    (ROOT/'shell-boxes.json').write_text(json.dumps({'version':p['version'],'units':'metres','tolerance':p['shellSurfaceTolerance'],'strictVolumeInset':p['strictVolumeInset'],'boxes':boxes},indent=2)+'\n')
    metrics={'version':p['version'],'sha256':hashlib.sha256(glb).hexdigest(),'bytes':len(glb),'boxes':len(boxes),'triangles':len(boxes)*12,'vertices':len(boxes)*24,'primitives':1,'materials':1,'textures':0,'boundsMetres':bounds,'bodyFit':'NOT RUN','visualFit':'NOT RUN'}
    (ROOT/'metrics.json').write_text(json.dumps(metrics,indent=2)+'\n');print(json.dumps(metrics))

if __name__=='__main__':main()
