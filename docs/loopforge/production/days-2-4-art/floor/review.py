"""Recompose every ORA, verify geometry and draw the non-runtime contact sheet."""
from hashlib import sha256
from io import BytesIO
from pathlib import Path
from xml.etree import ElementTree
from zipfile import ZipFile
import json
from PIL import Image, ImageDraw, ImageFont, ImageOps

HERE = Path(__file__).resolve().parent
manifest = json.loads((HERE/'manifest.json').read_text())
source = HERE.parent.parent/'day-one-sprite-calibration/01-style-B.zip'

def verify():
    for record in manifest['assets']:
        path=HERE/record['file']
        im=Image.open(path).convert('RGBA')
        assert list(im.size)==record['size'] and im.getextrema()[3]==(0,255),record['id']
        assert sha256(path.read_bytes()).hexdigest()==record['sha256'],record['id']
        with ZipFile(HERE/record['master']) as z:
            group=ElementTree.fromstring(z.read('stack.xml')).find('stack')
            assert len(group)>1
            merged=Image.new('RGBA',im.size)
            for layer in reversed(list(group)):
                merged.alpha_composite(Image.open(BytesIO(z.read(layer.get('src')))).convert('RGBA'))
            assert merged.tobytes()==im.tobytes(),record['id']
        for name in ('insets','safeText'):
            if name in record: assert len(record[name])==4
    print(f"Checked {len(manifest['assets'])} native exports, alpha channels, ORA layer recompositions and hashes.")

def draw_sheet():
    img=Image.new('RGB',(720,420),'#142426')
    draw=ImageDraw.Draw(img)
    regular=Path('/usr/share/fonts/liberation-mono-fonts/LiberationMono-Regular.ttf')
    bold=regular.with_name('LiberationMono-Bold.ttf')
    def label(x,y,t,s=12,c='#D8DFD3',strong=False):
        face=bold if strong else regular
        font=ImageFont.truetype(str(face),s) if face.exists() else ImageFont.load_default(size=s)
        draw.text((x,y),t,font=font,fill=c)
    def sprite(name):
        return Image.open(HERE/'exports'/('fl-'+name+'.png')).convert('RGBA')
    def put(x,y,im,scale=1):
        if scale!=1: im=im.resize(tuple(i*scale for i in im.size),Image.Resampling.NEAREST)
        img.paste(im,(x,y),im)
    label(14,12,'LOOPFORGE    LIVE FLOOR / SIGNAL PLATES',18,strong=True)
    label(14,40,'Art calibration · native raster artwork · enlarged 2×',12,'#A9B9AF')
    rooms=[('SECURITY / BOOM','security',['gate-check','gate-held','gate-released']),
           ('CONVEYOR / HANDOFF','forge',['handoff-ready','handoff-clear','handoff-rushed'])]
    with ZipFile(source) as z:
        for i,(title,room,names) in enumerate(rooms):
            x=14+i*352
            label(x,72,title,14,strong=True)
            tile=Image.open(BytesIO(z.read('B/'+room+'/floor.png'))).convert('RGB')
            img.paste(ImageOps.fit(tile,(338,88),method=Image.Resampling.NEAREST),(x,93))
            for j,name in enumerate(names):
                put(x+20+j*109,98,sprite(name),2)
                label(x+21+j*109,186,name.split('-')[-1],12)
    label(14,224,'POST',14,strong=True)
    for j,name in enumerate(['post-staffed','post-vacant']):
        put(16+j*84,258,sprite(name),2)
        label(14+j*84,306,name.split('-')[-1],12)
    label(216,224,'OUTPUT / THREE SOCKETS',14,strong=True)
    rack=Image.new('RGBA',(106,35))
    for i in range(3):
        x=2+i*35
        rack.alpha_composite(sprite('rack-cradle'),(x,11))
        if i<2: rack.alpha_composite(sprite('cortex-finished'),(x+4,2))
        rack.alpha_composite(sprite('rack-lip'),(x,11))
    put(215,245,rack,2)
    label(216,320,'two completed pieces',12)
    label(468,224,'SPEECH / CUT CORNER',14,strong=True)
    for j,name in enumerate(['bubble','bubble-interrupted']):
        put(470+j*120,250,sprite(name),2)
        put(478+j*120,258,sprite('bubble-nameplate'))
    label(467,335,'name field / paper edge',12)
    draw.line((14,380,706,380),fill='#506361')
    label(14,392,'B / RAKING LIGHT    64 NATIVE PX / METRE    19 NOV 2026',12,'#ACB9AA')
    img.save(HERE/'floor-review.png',optimize=True)

if __name__=='__main__':
    verify()
    if source.is_file():
        draw_sheet()
