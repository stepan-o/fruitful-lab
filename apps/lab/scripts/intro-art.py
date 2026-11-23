"""Pack the four pinned calibration archives into registered, lossless runtime sheets."""
import hashlib
import io
import json
import math
import zipfile
from functools import lru_cache
from pathlib import Path
from PIL import Image

app = Path(__file__).resolve().parents[1]
src = app.parents[1] / 'docs/loopforge/production/day-one-sprite-calibration'
out = app / 'public/loopforge-intro'
out.mkdir(exist_ok=True)
packs = []
for lane in json.loads((src/'calibration-index.json').read_text())['lanes']:
    archive = src / lane['archive']
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == lane['sha256']
    packs.append(zipfile.ZipFile(archive))
style, walk, check, press = packs
def data(z, path):
    return json.loads(z.read(path))
@lru_cache(maxsize=32)
def layer(z, path):
    return Image.open(io.BytesIO(z.read(path))).convert('RGBA')
def stack(images):
    result = images[0].copy()
    for image in images[1:]:
        result.alpha_composite(image)
    return result

meta = {}
def sheet(name, frames, pivot=(128,208)):
    boxes = [f.getbbox() for f in frames if f.getbbox()]
    box = (min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes))
    w,h = box[2]-box[0], box[3]-box[1]
    cols = min(12,len(frames))
    canvas = Image.new('RGBA',(cols*w, math.ceil(len(frames)/cols)*h))
    for i,frame in enumerate(frames):
        canvas.paste(frame.crop(box),(i%cols*w,i//cols*h))
    canvas.save(out/(name+'.webp'), lossless=True, method=5)
    meta[name] = [w,h,cols,pivot[0]-box[0],pivot[1]-box[1]]
def single(z,path,name,pivot=(128,208)):
    sheet(name,[layer(z,path)],pivot)
for room in ['security','forge']:
    single(style,'B/'+room+'/floor.png','tile-'+room,(0,0))
    single(style,'B/'+room+'/body.png','bob-'+room)
for actor in ['bob','max']:
    for direction in ['N','S']:
        root='motion/reusable/'
        stem='char-'+actor+'-walk-'+direction
        base=data(walk,root+stem+'.json')
        for clip in [stem]+[p[len(root):-5] for p in walk.namelist() if p.startswith(root+'char-'+actor+'-') and p.endswith(direction+'.json') and 'walk-'+direction not in p]:
            overlay=data(walk,root+clip+'.json')
            frames=[]
            for e in overlay['entries']:
                pos=e['atlasRect']
                parts=[]
                for key in ['shadow']+base['layerOrder']+['security-light','emissive']:
                    use=overlay if key in overlay['atlases'] else base
                    path=root+use['atlases'][key]
                    rect=pos if use is overlay else base['entries'][e['gaitFrame']]['atlasRect']
                    x,y,w,h=rect
                    parts.append(layer(walk,path).crop((x,y,x+w,y+h)))
                frames.append(stack(parts))
            x,y,*_=base['trimRect']
            sheet(clip,frames,(128-x,208-y))

s5=data(check,'exports/lane03-pose-manifest.json')
(out/'sec-rails-depth.png').write_bytes(check.read('exports/'+s5['rails']['file']))
for actor, poses in s5['poses'].items():
    frames = []
    for p in poses:
        x,y,w,h = p['atlasRect']
        frames.append(stack([layer(check,'exports/'+p[k]).crop((x,y,x+w,y+h)) for k in ['body','emissive']]))
    sheet(actor+'-check',frames)
for name,path in [('desk-back',s5['fixture']['back']),('desk-front',s5['fixture']['front']),('credential',s5['credential']['file'])]:
    single(check,'exports/'+path,name,(2,17) if name=='credential' else (128,208))
boom=layer(check,'exports/'+s5['boom']['asset'])
bw,bh=s5['boom']['atlasCellPx']
sheet('boom',[boom.crop((i%5*bw,i//5*bh,(i%5+1)*bw,(i//5+1)*bh)) for i in range(25)],s5['boom']['pivotPx'])
s5track=[[f['actors'][key]['pose'] for key in ['char-limen','char-max','char-stiletto']]+
         ([f['credential']['visualHolder'],*f['credential']['pivotNativePx']] if f['credential'] else []) for f in s5['frames']]
machine=data(press,'palm-unjam-manifest.json')
track=data(press,'display-track.json')['frames']
files=machine['files']
unique={}
for f in track:
    indices=tuple(f[k] for k in ['baseIndex','lightIndex','emissionIndex'])
    if indices not in unique: unique[indices]=len(unique)
    f['sprite']=unique[indices]
sheet('bob-press',[stack([layer(press,files[i]['path']) for i in indices]) for indices in unique])
root='exports/fixture/mach-forge-C4-'
sheet('press-back',[stack([layer(press,root+'base.png'),layer(press,root+'rear-guard.png'),layer(press,root+'door-'+str(i)+'.png'),layer(press,root+'control.png')]) for i in range(7)],(160,420))
single(press,root+'front-guard.png','press-front',(160,420))
(out/'sprites.json').write_text(json.dumps(dict(sheets=meta,checkpoint=s5track,palm=[f['sprite'] for f in track]),separators=(',',':'))+'\n')
