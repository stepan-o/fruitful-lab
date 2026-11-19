"""Build the console originals, editable layer stacks and native runtime sprites."""
import io
import json
import zipfile
import hashlib
import xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
PALETTE = dict(ink='#111a1b', shadow='#152527', frame='#26373a', steel='#435657',
               edge='#718080', mint='#a6bcad', glass='#21383a', deep='#101d20',
               brass='#8a6742', gold='#c29458', lamp='#f2cf83', warm='#c1a981',
               paper='#e2d2ac', ivory='#f1e3c1', print='#373a33', sage='#81917a',
               night='#23333d', slate='#425463', blue='#7f9a9e')
P = PALETTE
assets = []

def clipbox(x,y,r,b,n=3):
    return [(x+n,y),(r-n,y),(r,y+n),(r,b-n),(r-n,b),(x+n,b),(x,b-n),(x,y+n)]

def screw(d,x,y):
    d.rectangle((x,y,x+3,y+3),fill=P['ink'])
    d.line((x,y,x+2,y),fill=P['edge'])
    d.point((x,y+1),fill=P['steel'])
    d.point((x+2,y+1),fill=P['warm'])

def box(d,w,h,face='frame',lip='edge'):
    d.polygon(clipbox(0,0,w-1,h-1),fill=P['ink'])
    d.polygon(clipbox(1,1,w-3,h-3),fill=P[lip])
    d.polygon(clipbox(2,2,w-3,h-3),fill=P[face])
    d.line([(2,h-5),(4,h-3),(w-5,h-3),(w-3,h-5),(w-3,4)],fill=P['shadow'])
    d.line((6,3,18,3),fill=P[lip])

def corner(d,w,h,focus=False):
    for x,y,sx,sy in [(2,2,1,1),(w-3,2,-1,1),(w-3,h-3,-1,-1),(2,h-3,1,-1)]:
        for ofs in (0,1):
            d.line([(x,y+sy*(8-ofs)),(x,y),(x+sx*(8-ofs),y)],fill=P['ink'],width=4)
            d.line([(x,y+sy*(7-ofs)),(x,y),(x+sx*(7-ofs),y)],fill=P['lamp' if focus else 'mint'],width=2)
            d.point((x+sx*9,y),fill=P['ivory'])

def pngbytes(im):
    o=io.BytesIO();im.save(o,format='PNG',optimize=True);return o.getvalue()

class Sprite:
    def __init__(self,key,w,h):
        self.id='co-'+key; self.w=w; self.h=h; self.layers=[]
    def layer(self,name):
        im=Image.new('RGBA',(self.w,self.h));self.layers.append((name,im));return ImageDraw.Draw(im)
    def save(self,purpose,geom,slot=None):
        im=Image.new('RGBA',(self.w,self.h))
        for _,layer in self.layers: im.alpha_composite(layer)
        assert im.getbbox(),self.id
        src='masters/'+self.id+'.ora'; dst='exports/'+self.id+'.png'
        data=pngbytes(im); (ROOT/dst).write_bytes(data)
        root=ET.Element('image',{'w':str(self.w),'h':str(self.h),'name':self.id,'version':'0.0.3','xres':'72','yres':'72'})
        group=ET.SubElement(root,'stack')
        with zipfile.ZipFile(ROOT/src,'w') as archive:
            archive.writestr('mimetype','image/openraster')
            for i,(label,layer) in enumerate(reversed(self.layers)):
                fp=f'data/layer-{i}.png'
                ET.SubElement(group,'layer',{'name':label,'src':fp,'x':'0','y':'0','opacity':'1.0','visibility':'visible','composite-op':'svg:src-over'})
                archive.writestr(fp,pngbytes(layer))
            archive.writestr('stack.xml',ET.tostring(root,encoding='utf-8',xml_declaration=True))
            archive.writestr('mergedimage.png',data)
            thumb=im.copy();thumb.thumbnail((256,256));archive.writestr('Thumbnails/thumbnail.png',pngbytes(thumb))
        asset=dict(id=self.id,file=dst,size=[self.w,self.h],master=src,source="Original pixel drawing, console lane, 19 Nov 2026",purpose=purpose,sha256=hashlib.sha256(data).hexdigest(),**geom)
        if slot:asset['safeText']=slot
        assets.append(asset)

def chassis():
    w,h=192,116;s=Sprite('briefing-chassis',w,h);d=s.layer('Cast metal casing');box(d,w,h)
    d.polygon(clipbox(5,6,w-7,h-8,2),fill=P['brass']);d.polygon(clipbox(6,7,w-8,h-9,2),fill=P['shadow'])
    d.rectangle((9,10,w-11,h-13),fill=P['glass'])
    d=s.layer('Flange fasteners and contact rail')
    for x in (2,w-7):
        for y in (2,h-7):screw(d,x,y)
    for y in (10,h-19):
        d.rectangle((2,y,4,y+7),fill=P['steel']);d.point((2,y),fill=P['mint'])
    d.line((13,7,33,7),fill=P['warm']);d.line((12,h-9,27,h-9),fill=P['steel'])
    s.save('Recessed two-bid briefing board. Layout both candidates inside one assembly.',{'insets':[10,10,11,13]},[12,12,w-26,h-27])

def bid(state):
    w,h=124,77;s=Sprite('bid-'+state,w,h);d=s.layer('Enamel carrier and body')
    box(d,w,h,'frame','steel');d.polygon(clipbox(5,4,w-8,h-7,2),fill=P['deep'])
    d=s.layer('Selector key and contact metal');d.rectangle((5,7,7,h-9),fill=P['steel' if state=='idle' else 'gold'])
    d.rectangle((8,8,10,h-10),fill=P['shadow'])
    for y in (10,h-14):screw(d,w-10,y)
    x,y=4,6
    if state=='idle':
        d.rectangle((x,y,x+7,y+10),fill=P['ink']);d.rectangle((x+2,y+1,x+4,y+3),fill=P['edge'])
    elif state=='selected':
        d.polygon([(x,y),(x+5,y),(x+11,y+5),(x+5,y+10),(x,y+10)],fill=P['lamp']);d.line((x+2,y+2,x+6,y+5),fill=P['ivory'])
    else:
        d.rectangle((x,y,x+11,y+10),fill=P['sage']);d.line([(x+2,y+5),(x+4,y+7),(x+9,y+2)],fill=P['ivory'],width=2)
    s.save('Whole bid '+state+'; all rooms in this panel share one candidate selection.',{'insets':[17,17,13,15]},[18,10,w-34,h-21])

def room(key):
    s=Sprite('room-'+key,32,28);d=s.layer('Oxidized mounting casting');box(d,32,28,'glass' if key=='security' else 'frame','steel')
    d=s.layer('Enamel pictogram'); col=P['mint' if key=='security' else 'gold']
    if key=='security':
        # Closed gate and striped boom.
        d.rectangle((7,7,10,21),fill=P['edge']);d.rectangle((21,10,24,21),fill=P['steel'])
        d.rectangle((8,10,24,13),fill=col)
        for x in (12,18):d.line((x,10,x-2,13),fill=P['deep'],width=2)
        d.line((5,22,25,22),fill=P['brass']);d.rectangle((7,5,10,6),fill=P['lamp'])
    else:
        d.polygon([(6,15),(8,12),(24,12),(26,15),(24,18),(8,18)],fill=col)
        for x in (10,16,22):d.rectangle((x-1,14,x+1,16),fill=P['deep'])
        d.line((9,20,7,22),fill=P['edge'],width=2);d.line((22,20,24,22),fill=P['edge'],width=2)
        d.polygon([(13,8),(16,5),(20,8),(19,11),(13,11)],fill=P['warm'])
    s.save('Mount identifying '+key+' in the assignment panel.',{'pivot':[16,14]})

def slot():
    s=Sprite('supervisor-slot',52,50);d=s.layer('Dark slide well');box(d,52,50,'ink','steel');d.rectangle((5,5,46,43),fill=P['glass'])
    d=s.layer('Cast retaining clips');d.line((5,44,46,44),fill=P['brass'])
    for x in (3,46):
        for y in (5,36):d.rectangle((x,y,x+2,y+4),fill=P['warm'])
    s.save('Empty live cast token/portrait aperture; mask portrait within documented rect.',{'insets':[7,7,7,8],'portraitRect':[8,7,36,35]})

def focus():
    s=Sprite('focus-ring',42,24);d=s.layer('Dark keyline');d.rectangle((0,0,41,23),outline=P['ink'],width=2)
    d=s.layer('Amber focus corners');corner(d,42,24,True)
    s.save('Keyboard focus overlay; place around the focused control above all control states.',{'insets':[12,10,12,10]})
def commit(state):
    w,h=100,28;s=Sprite('commit-'+state,w,h);d=s.layer('Switch cradle');box(d,w,h,'brass','warm')
    d=s.layer('Actuator cap and thumb tang');x=4;y=5 if state=='pressed' else 3
    d.polygon(clipbox(x,y,w-6,h-7 if state=='ready' else h-5,2),fill=P['brass' if state=='pressed' else 'gold'])
    d.line((8,y+1,22,y+1),fill=P['warm' if state=='pressed' else 'lamp'])
    for xx in (9,12,15):d.line((xx,y+6,xx,y+12),fill=P['brass' if state=='ready' else 'shadow'])
    s.save('Physical confirm key, '+state+'. Commit both room assignments together.',{'insets':[19,8,9,8]},[21,5,69,16])
def paperface(d,w,h,paper,edge):
    d.polygon([(1,1),(w-8,1),(w-2,7),(w-2,h-3),(3,h-3),(1,h-6)],fill=P['shadow'])
    d.polygon([(1,0),(w-9,0),(w-3,6),(w-3,h-5),(1,h-5)],fill=P[paper])
    d.line((2,1,w-11,1),fill=P['ivory']);d.polygon([(w-10,0),(w-10,7),(w-3,7)],fill=P[edge])
def docket():
    w,h=178,98;s=Sprite('close-docket',w,h);d=s.layer('Printer bezel');box(d,w,h,'shadow','edge')
    d=s.layer('Fan-fold stock');d.rectangle((7,5,w-9,h-10),fill=P['paper']);d.line((8,7,w-11,7),fill=P['ivory'])
    for x in (10,w-17):
        for y in (10,15,h-23,h-18):d.rectangle((x,y,x+2,y+2),fill=P['brass'])
    d.line((15,10,15,h-13),fill=P['warm']);d.line((w-20,10,w-20,h-13),fill=P['warm'])
    d=s.layer('Paper exit and pressure roller')
    d.line((6,h-9,w-8,h-9),fill=P['ink'],width=2);d.line((9,h-8,w-11,h-8),fill=P['steel'])
    s.save('Continuous shift ledger with punch margins and bottom pressure roller.',{'insets':[17,20,21,24]},[20,10,w-45,h-25])
def ticket(key,desc):
    w,h=98,43;s=Sprite(key,w,h);d=s.layer('Printed stock')
    paperface(d,w,h,'ivory' if key=='witness-slip' else 'paper','warm')
    d=s.layer('Band and embossed identifying mark')
    d.rectangle((4,4,22,h-8),fill=P['glass' if key=='witness-slip' else 'brass'])
    c=P['ivory'];k=P['shadow']
    if key=='output-ticket':
        for x,y in ((8,18),(15,18),(11,12)):
            d.polygon([(x,y+1),(x+2,y-2),(x+4,y-1),(x+5,y+2),(x+3,y+4),(x+1,y+4)],fill=c)
        d.line((7,25,20,25),fill=c,width=2);d.point((7,27),fill=c);d.point((20,27),fill=c)
    elif key=='attendance-ticket':
        d.rectangle((9,12,16,17),fill=c);d.line((11,10,15,10),fill=c)
        d.polygon([(8,25),(8,21),(11,19),(15,19),(19,22),(19,25)],fill=c);d.line((7,27,20,27),fill=c)
    else:
        d.polygon([(7,13),(19,13),(19,21),(14,21),(10,25),(10,21),(7,21)],fill=c)
        d.line((10,16,16,16),fill=k);d.line((10,18,14,18),fill=k)
    s.save(desc,{'insets':[24,32,11,8]},[27,7,w-39,h-19])
def transit(state):
    w,h=118,58;s=Sprite(state,w,h);d=s.layer('Status lens housing');box(d,w,h,'night','edge');d.polygon(clipbox(5,5,w-7,h-8,2),fill=P['deep'])
    d=s.layer('Clock winding and shift symbol')
    d.ellipse((6,10,40,44),fill=P['steel'],outline=P['brass'],width=2);d.ellipse((10,14,36,40),fill=P['night'])
    if state=='overnight':
        d.ellipse((16,18,30,32),fill=P['paper']);d.ellipse((21,15,35,29),fill=P['night'])
        d.point((15,34),fill=P['blue']);d.point((30,33),fill=P['mint'])
    else:
        d.pieslice((16,22,30,36),180,360,fill=P['lamp']);d.line((13,30,32,30),fill=P['gold'])
        for line in [(23,18,23,20),(13,22,15,24),(31,24,33,22)]:d.line(line,fill=P['lamp'])
    for x,y in [(23,12),(8,27),(23,42),(38,27)]:d.point((x,y),fill=P['mint'])
    s.save('Shift transition instrument: '+state+'. Keep dates, expiries and releases in live text.',{'insets':[43,45,9,9]},[46,10,w-58,h-23])
def inspector():
    w,h=139,78;s=Sprite('review-instrument',w,h);d=s.layer('Service bay case');box(d,w,h,'slate','blue')
    d.polygon(clipbox(6,7,w-8,h-9,3),fill=P['ink'])
    d.rectangle((10,11,w-12,h-13),fill=P['deep'])
    d=s.layer('Technician probe contacts')
    for y in (8,h-19):
        for x in range(9,29,5):d.line((x,y,x+3,y+3),fill=P['mint'],width=2)
    for x in (1,w-6):
        for y in (1,h-6):screw(d,x,y)
    s.save('Private reviewer instrument. Show only on explicit inspection; display Review only in live type.',{'insets':[32,14,12,20]},[13,17,w-29,h-38])

def main():
    (ROOT/'exports').mkdir(exist_ok=True);(ROOT/'masters').mkdir(exist_ok=True)
    chassis()
    for name in ('idle','selected','committed'):bid(name)
    focus();slot();room('security');room('conveyor')
    for name in ('ready','pressed'):commit(name)
    docket()
    ticket('output-ticket','Rack count/shift production instrument. Draw only actual completed and retained counts.')
    ticket('attendance-ticket','Worker availability report. Use confirmed public attendance evidence.')
    ticket('witness-slip','Public attributed account. Fill speaker, room and delivered words from public report.')
    transit('overnight');transit('next-shift');inspector()
    manifest={'version':'1.0.0','lane':'console','pixelArt':'B / Raking light; straight RGBA sRGB palette; nearest-neighbor; highlights top left. All native exports contain graphics only.','palette':PALETTE,'rights':'Original project-authored hardware and icon drawings commissioned for Loopforge. Original Day One cast and Foundry plates are used solely as contextual proof material.','coordinates':'Rect = [x,y,width,height], native px, upper left origin. Insets = [left,top,right,bottom]. Nine-slice native borders at 1x minimum, plateau center may stretch. Render text separately in CSS px. Focus restores to the initiating control.','zOrder':['assembly backing','bid / docket','ticket / cast socket','runtime cast or values','focus ring'],'assets':assets}
    (ROOT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
if __name__=='__main__':main()
