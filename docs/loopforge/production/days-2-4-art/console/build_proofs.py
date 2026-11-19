"""Recompose sized proof PNGs from native parts, proof source crops and example state."""
from pathlib import Path
from functools import lru_cache
import json
import zipfile
import hashlib
import io
import argparse
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageOps

ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[4]
SRC=ROOT/'proof-sources'
SRC.mkdir(exist_ok=True)
NEAR=Image.Resampling.NEAREST
manifest=json.loads((ROOT/'manifest.json').read_text())
assets={a['id'][3:]:a for a in manifest['assets']}
P=manifest['palette']
viewports={'desktop':(1280,720),'phone':(390,844),'narrow':(320,844)}
fields={}
source_records=[]
public=json.loads((ROOT.parent/'binding/samples.json').read_text())['snapshots']
hearing=json.loads((ROOT.parent/'binding/review-only-hearing.json').read_text())['endorsements']
capture=json.loads((SRC/'console-state.json').read_text())


def source(file,raw,origin,transform):
    im=Image.open(io.BytesIO(raw)).convert('RGBA')
    im=transform(im)
    im.save(SRC/file,optimize=True)
    source_records.append(dict(file='proof-sources/'+file,origin=origin,sourceSha256=hashlib.sha256(raw).hexdigest()))

def sources():
    cal=REPO/'docs/loopforge/production/day-one-sprite-calibration/03-fourth-id-check.zip'
    if not cal.exists():return
    with zipfile.ZipFile(cal) as z:
        for who in ('limen','stiletto'):
            inner=f'exports/actors/char-{who}/neutral-00.png'
            def portrait(im):
                frame=im.crop((0,0,256,256))
                # Use the upper body and head from the real first frame, retaining the lit silhouette.
                left,top,right,bottom=frame.getbbox()
                frame=frame.crop((left,top,right,top+59))
                return frame.crop(frame.getbbox())
            source(who+'.png',z.read(inner),f'Loopforge PR #155 / 03-fourth-id-check.zip / {inner}',portrait)
    for v in ('desktop','phone'):
        rel=Path('apps/lab/assets/sources/loopforge-producer-runtime')/('foundry-desk.png' if v=='desktop' else 'foundry-desk-mobile.png')
        def grade(im):
            size=(480,270) if v=='desktop' else (180,460)
            im=ImageOps.fit(im.convert('RGB'),size,Image.Resampling.LANCZOS)
            im=ImageEnhance.Color(im).enhance(.55)
            im=ImageEnhance.Brightness(im).enhance(.49)
            return im.quantize(colors=72,dither=Image.Dither.NONE).convert('RGB')
        source('desk-'+v+'.png',(REPO/rel).read_bytes(),str(rel),grade)
    (SRC/'sources.json').write_text(json.dumps(source_records,indent=2)+'\n')

@lru_cache
def font(kind,size):
    paths={'label':'/usr/share/fonts/adobe-source-code-pro-fonts/SourceCodePro-Semibold.otf','body':'/usr/share/fonts/liberation-sans-fonts/LiberationSans-Regular.ttf','bold':'/usr/share/fonts/liberation-sans-fonts/LiberationSans-Bold.ttf','display':'/usr/share/fonts/urw-base35/NimbusSansNarrow-Bold.otf'}
    return ImageFont.truetype(paths[kind],size)

@lru_cache
def tex(key):
    return Image.open(ROOT/assets[key]['file']).convert('RGBA')

def slices(key,size):
    im=tex(key); l,t,r,b=assets[key]['insets']; ow,oh=im.size;w,h=size
    assert w>=l+r+1 and h>=t+b+1,(key,size)
    out=Image.new('RGBA',size)
    x1=[0,l,ow-r,ow]; y1=[0,t,oh-b,oh]; x2=[0,l,w-r,w]; y2=[0,t,h-b,h]
    for j in range(3):
        for i in range(3):
            piece=im.crop((x1[i],y1[j],x1[i+1],y1[j+1]))
            out.paste(piece.resize((x2[i+1]-x2[i],y2[j+1]-y2[j]),NEAR),(x2[i],y2[j]))
    return out

class Page:
    def __init__(self,shot,view):
        self.W,self.H=viewports[view]; self.wide=view=='desktop'; self.view=view; self.shot=shot
        bg=Image.open(SRC/('desk-desktop.png' if self.wide else 'desk-phone.png'))
        self.im=ImageOps.fit(bg,(self.W,self.H),NEAR).convert('RGBA')
        self.d=ImageDraw.Draw(self.im); self.interactive=[];self.boundRegions=[]
        self.x=136 if self.wide else 8; self.y=32 if self.wide else 14
        self.w=self.W-self.x*2;self.h=self.H-self.y-(47 if self.wide else 53)
        self.put('briefing-chassis',self.x,self.y,self.w,self.h)
        self.l=self.x+(40 if self.wide else 14);self.r=self.x+self.w-(40 if self.wide else 14)
        self.light=P['ivory'];self.dim='#aebdb1';self.accent=P['lamp']
    def put(self,key,x,y,w,h):
        self.im.alpha_composite(slices(key,(w,h)),(x,y))
    def label(self,x,y,v,size=13,col=None,kind='label'):
        self.d.text((x,y),v,font=font(kind,size),fill=col or self.light,anchor='lt')
    def right(self,x,y,v,size=13,col=None,kind='label'):
        self.d.text((x,y),v,font=font(kind,size),fill=col or self.light,anchor='rt')
    def rule(self,x,y,x2,color=None):
        self.d.line((x,y,x2,y),fill=color or P['steel'])
    def wrapped(self,x,y,width,value,size=16,col=None,kind='body',leading=None):
        words=value.split();lines=[''];ft=font(kind,size)
        for word in words:
            v=(lines[-1]+' '+word).strip()
            if ft.getlength(v)>width and lines[-1]:lines.append(word)
            else:lines[-1]=v
        lh=leading or size+5
        for i,line in enumerate(lines):self.label(x,y+i*lh,line,size,col,kind)
        return y+len(lines)*lh
    def header(self,kicker,title,summary):
        y=self.y+(24 if self.wide else 18)
        self.label(self.l,y,kicker,15 if self.wide else 12,self.accent)
        y+=26 if self.wide else 24
        self.label(self.l,y,title,46 if self.wide else 35,self.light,'display')
        y+=56 if self.wide else 44
        y=self.wrapped(self.l,y,self.r-self.l,summary,18 if self.wide else 15,self.dim)
        self.rule(self.l,y+11,self.r);return y+25
    def hit(self,key,x,y,w,h):
        assert w>=44 and h>=44 and 0<=x and 0<=y and x+w<=self.W and y+h<=self.H,(key,x,y,w,h)
        self.interactive.append({'id':key,'rect':[x,y,w,h]})
    def seal(self):
        y=self.H-27
        self.label(self.x,y,'ART COMPOSITION  /  ENGINE STATE',12 if self.wide else 10,'#f0dfb9')
        self.right(self.W-self.x,y,f'{self.W} × {self.H}',12 if self.wide else 10,'#f0dfb9')
        key=self.shot+'-'+self.view+'.png';self.im.convert('RGB').save(ROOT/'proofs'/key,optimize=True)
        fields[self.shot+'-'+self.view]={'viewport':[self.W,self.H],'activationAreas':self.interactive,'source':PROVENANCE[self.shot]}
        return 'proofs/'+key

def icon(p,key,x,y,w,h):
    p.im.alpha_composite(tex(key).resize((w,h),NEAR),(x,y))

def headshot(p,who,x,y,w,h):
    p.put('supervisor-slot',x,y,w,h)
    im=Image.open(SRC/(who.lower()+'.png')).convert('RGBA')
    f=min((w-16)/im.width,(h-13)/im.height)
    im=im.resize((round(im.width*f),round(im.height*f)),NEAR)
    p.im.alpha_composite(im,(x+(w-im.width)//2,y+h-7-im.height))

def button(p,x,y,w,label,pressed=False,focus=False):
    h=50 if p.wide else 46
    p.put('commit-pressed' if pressed else 'commit-ready',x,y,w,h)
    if focus:p.put('focus-ring',x,y,w,h)
    col=P['ivory'] if pressed else P['ink'];ft=font('bold',18 if p.wide else 16)
    p.d.text((x+w//2+2,y+h//2-1),label,font=ft,fill=col,anchor='mm')
    p.hit('ack' if pressed else 'commit',x,y,w,h)
    return y+h

def bidcard(p,x,y,w,h,who,selected,committed):
    state='committed' if committed and selected else 'selected' if selected else 'idle'
    p.put('bid-'+state,x,y,w,h)
    if not committed:p.hit('bid-'+who,x,y,w,h)
    m=24 if p.wide else 17; yy=y+(20 if p.wide else 14)
    sz=72 if p.wide else 49
    headshot(p,who,x+m,yy,sz,sz)
    tx=x+m+sz+10
    p.label(tx,yy+2,'COMMITTED' if state=='committed' else ('SELECTED' if selected else 'ALTERNATE BID'),13 if p.wide else 10,p.accent if selected else p.dim)
    p.label(tx,yy+(27 if p.wide else 18),who,31 if p.wide else 23,p.light,'display')
    yy+=sz+(15 if p.wide else 8)
    pitch='Individual ID checks at Security.' if who=='LIMEN' else 'Fast clearance at Security.'
    p.label(x+m,yy,pitch,19 if p.wide else 15,p.light,'body')
    yy+=38 if p.wide else 27
    p.rule(x+m,yy-5,x+w-m)
    for room,which in [('Security',who),('Conveyor','STILETTO' if who=='LIMEN' else 'LIMEN')]:
        ih=28 if p.wide else 22;iw=32 if p.wide else 25
        icon(p,'room-'+room.lower(),x+m,yy+2,iw,ih)
        p.label(x+m+iw+7,yy+7,room,18 if p.wide else 14,p.dim,'body')
        p.right(x+w-m,yy+7,which,17 if p.wide else 13,p.light)
        yy+=39 if p.wide else 30
    return yy

def morning(p,committed):
    if committed:
        bid=capture['morningCommit']
        y=p.header(f"MORNING  /  DAY {bid['day']:02d}",'Posts assigned',f"{bid['lead']}’s bid assigns both supervisors for this shift.")
    else:
        y=p.header('MORNING  /  DAY 02','Appoint an adviser','Choose the bid that assigns both rooms for this shift.')
    x=p.l;w=p.r-p.l
    if p.wide:
        cw=(w-16)//2;ch=264
        for i,who in enumerate(('LIMEN','STILETTO')):
            bidcard(p,x+i*(cw+16),y,cw,ch,who,who==capture['morningCommit']['lead'],committed)
        bottom=y+ch+24
    else:
        ch=180 if p.W==320 else 186
        for i,who in enumerate(('LIMEN','STILETTO')):
            bidcard(p,x,y+i*(ch+8),w,ch,who,who==capture['morningCommit']['lead'],committed)
        bottom=y+2*(ch+8)+10
    label='Enter the floor' if committed else 'Appoint LIMEN'
    button(p,x,bottom,250 if p.wide else w,label,committed,not committed)
    note='Shift intervention available'
    p.label(x,bottom+(67 if p.wide else 61),note,15 if p.wide else 13,p.dim)

def card_content(p,kind,x,y,w,h,title,main,detail):
    p.put(kind,x,y,w,h)
    xx=x+33 if not p.wide else x+39
    ink=P['print']
    p.label(xx,y+12,title,14 if p.wide else 11,ink)
    p.label(xx,y+33,main,32 if p.wide else 24,ink,'display')
    end=p.wrapped(xx,y+(74 if p.wide else 63),w-(xx-x)-14,detail,17 if p.wide else 14,ink)
    assert end<y+h+2,(kind,end,y+h)
    return end

def rack(p,x,y,count):
    fld=ROOT.parent/'floor'/'exports'
    keys=['fl-rack-cradle','fl-cortex-finished','fl-rack-lip']
    for i in range(count):
        ox=x+i*35
        for j,key in enumerate(keys):
            path=fld/(key+'.png');im=Image.open(path if path.exists() else SRC/(key+'.png')).convert('RGBA');ax,ay=(17,13) if j!=1 else (13,22)
            p.im.alpha_composite(im,(ox-ax,y-ay))

def close(p):
    f=public['released'];world=f['state']['world'];report=world['report']
    total=len(world['completed']);added=world['shiftOutput']
    countLabel=f'{added} finished this shift';countDetail=f'{total-added} carried in · {total} on rack at the bell.'
    coverage='Wash uncovered' if not world['coverage'][1] else 'Wash staffed'
    y=p.header(f"BELL  /  DAY {world['day']:02d}",'Shift record','The bell releases bob from Security. Wash was open during his detention.')
    x=p.l;w=p.r-p.l;dh=388 if p.wide else 484
    p.put('close-docket',x,y,w,dh)
    xx=x+20;ww=w-44;yy=y+21
    p.label(xx,yy,'CONVEYOR  /  PRODUCTION',14 if p.wide else 11,P['print'])
    yy+=29
    if p.wide:
        tw=(ww-12)//2;hh=133
        card_content(p,'output-ticket',xx,yy,tw,hh,'RACK RECEIPT',countLabel,countDetail)
        card_content(p,'attendance-ticket',xx+tw+12,yy,tw,hh,'ATTENDANCE',coverage,'bob was detained through the bell.')
        yy+=hh+13; rack(p,xx+34,yy+20,total);yy+=59
    else:
        hh=104;card_content(p,'output-ticket',xx,yy,ww,hh,'RACK RECEIPT',countLabel,countDetail)
        yy+=hh+4;rack(p,xx+22,yy+18,total);yy+=43
        card_content(p,'attendance-ticket',xx,yy,ww,101,'ATTENDANCE',coverage,'bob was detained through the bell.')
        yy+=107
    hh=104 if p.wide else 133
    p.put('witness-slip',xx,yy,ww,hh)
    p.label(xx+31,yy+13,report['actor']+'  /  '+report['room'].upper(),14 if p.wide else 11,P['print'])
    p.wrapped(xx+31,yy+39,ww-45,'“'+report['text']+'”',19 if p.wide else 15,P['print'])
    bottom=y+dh+17
    button(p,x,bottom,244 if p.wide else w,'Read overnight record',False,True)

def rollover(p,pass_expiry=False):
    x=p.l;w=p.r-p.l
    if pass_expiry:
        bell=public['pass-expired']['state']['world'];renewal=public['renewal-open']['state']['world']
        assert not bell['pass']['valid'] and renewal['status']=='open'
        y=p.header('SHIFT RECORD  /  DAYS 02—03','Pass expired','The daily pass lasted through the bell. The morning desk has opened another check.')
        phases=[('overnight',f"END OF DAY {bell['day']:02d}",'Pass expired',
                 f"{bell['pass']['holder']}’s day {bell['pass']['day']} pass expired. {bell['shiftOutput']} finished this shift · {len(bell['completed'])} total."),
                ('next-shift',f"DAY {renewal['day']:02d}  /  SECURITY",'Fresh ID check',
                 'LIMEN holds the queue at bob’s check. The new shift has an intervention available.')]
    else:
        end=public['released'];morning=capture['releasedMorning']
        assert any(e['kind']=='custody.release' for e in end['state']['events']) and morning['bobDuty']=='standing'
        y=p.header('SHIFT RECORD  /  DAYS 02—03','Overnight','Detention expires at the bell. bob can join the next shift.')
        phases=[('overnight',f"END OF DAY {end['state']['world']['day']:02d}",'Detention ended','bob was released from Security at the bell.'),
                ('next-shift',f"START OF DAY {morning['day']:02d}",'Available for work','bob is back for the morning briefing. His next ID check is still ahead.')]
    rows=166 if p.wide else 177
    for i,(key,t,name,detail) in enumerate(phases):
        yy=y+i*(rows+9);p.put(key,x,yy,w,rows)
        xx=x+(77 if p.wide else 71);cw=w-(xx-x)-13
        p.label(xx,yy+27,t,15 if p.wide else 12,p.accent)
        p.label(xx,yy+52,name,35 if p.wide else 24,p.light,'display')
        end=p.wrapped(xx,yy+(103 if p.wide else 87),cw,detail,19 if p.wide else 15,p.dim)
        assert end<yy+rows,(key,end,yy+rows)
    yy=y+2*(rows+9)+12
    button(p,x,yy,252 if p.wide else w,'Return to shift record' if pass_expiry else 'Open morning briefing',False,True)

def inspect(p):
    trace=capture['developerInspection']['decision']
    endorsement=next(e for e in public['endorsement']['state']['events'] if e['kind']=='endorsement.public')
    heard=next(h for h in hearing if h['backing']==endorsement['subject'])
    assert trace['actor'] in heard['heard'] and 'witnessed earlier concession' in trace['evidence']
    y=p.header('DEVELOPER  /  REVIEW ONLY','Decision inspection','Private decision trace for the selected worker.')
    x=p.l;w=p.r-p.l;h=388 if p.wide else 426
    p.put('review-instrument',x,y,w,h)
    xx=x+(55 if p.wide else 51);ww=x+w-xx-17;yy=y+27
    p.label(xx,yy,f"DAY {trace['day']:02d}  /  TICK {trace['tick']}",15 if p.wide else 12,p.accent);yy+=34
    for label,detail in [('Selected actor',trace['actor']),('Public order heard',endorsement['actor']+' · “'+endorsement['text']+'”'),
                         ('Personal evidence','Witnessed an earlier concession.'),('Decision score',trace['why'].replace(';',' ·')),
                         ('Chosen action',trace['intent'].capitalize()+'.')]:
        p.label(xx,yy,label.upper(),13 if p.wide else 11,'#a0b5b3');yy+=19
        yy=p.wrapped(xx,yy,ww,detail,20 if p.wide else 16,p.light,'body')
        p.rule(xx,yy+4,x+w-19);yy+=16
    assert yy<=y+h-4
    button(p,x,y+h+17,244 if p.wide else w,'Return to review',False,True)
PROVENANCE={
    'morning':['binding/samples.json#morning','reviewer selected LIMEN locally'],
    'committed':['console/proof-sources/console-state.json#morningCommit'],
    'close':['binding/samples.json#released'],
    'overnight':['binding/samples.json#released','console/proof-sources/console-state.json#releasedMorning'],
    'pass-expiry':['binding/samples.json#pass-expired','binding/samples.json#renewal-open'],
    'inspector':['binding/samples.json#endorsement','binding/review-only-hearing.json','console/proof-sources/console-state.json#developerInspection']}
SHOTS=[
 ('morning','Morning bids','The selector compares whole assignments. A focused commit key appoints the selected adviser.',lambda p:morning(p,False)),
 ('committed','Appointment confirmed','LIMEN’s confirmed bid keeps him in Security and STILETTO at Conveyor. The appointment leaves the shift intervention available.',lambda p:morning(p,True)),
 ('close','Shift close','The detained branch ends with zero finished this shift and three carried in. LIMEN’s attributed report remains readable at the bell.',close),
 ('overnight','Overnight and next shift','The case ends at the bell and the next morning carries the released worker forward.',rollover),
 ('pass-expiry','Daily pass expiry','The matched pass branch closes at seven newly finished and ten total. The next actual ID check can open another pass decision.',lambda p:rollover(p,True)),
 ('inspector','Review-only actor inspection','The internal inspector shows bob’s actual hearing, prior concession evidence and decision score at tick 9617. The player ledger uses public reports.',inspect)]
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--view',choices=viewports);ap.add_argument('--shot',choices=[s[0] for s in SHOTS]);args=ap.parse_args()
    if not (SRC/'desk-desktop.png').exists():sources()
    shots=[]
    for key,title,description,render in SHOTS:
        if args.shot and key!=args.shot:continue
        record={'id':key,'title':title,'description':description,'images':{},'source':PROVENANCE[key]}
        for view in viewports:
            if args.view and args.view!=view:continue
            p=Page(key,view);render(p);record['images'][view]=p.seal()
        shots.append(record)
    if not args.view and not args.shot:
        (ROOT/'proof-index.json').write_text(json.dumps({'shots':shots},indent=2)+'\n')
        (ROOT/'proofs'/'layout.json').write_text(json.dumps({'classification':'Static art compositions using verified public ENGINE snapshots. The inspector uses the separately marked internal decision trace.','byView':fields},indent=2)+'\n')
if __name__=='__main__':main()
