"""Compose static review plates from the delivered sprites and a public-floor replay.
Usage: python plates.py apps/lab/public apps/lab/public/loopforge-design/forge-study
Pillow, Montserrat Bold/Black Italic, and Liberation Mono Regular are required.
"""
import argparse
import json
import math
import random
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

NEAR = Image.Resampling.NEAREST
INK = '#101b1b'
PAPER = '#f6ecce'
MINT = '#99daca'
TEAL = '#255551'
GOLD = '#f5c472'
MONO = '/usr/share/fonts/liberation-mono-fonts/LiberationMono-Regular.ttf'
BOLD = '/usr/share/fonts/julietaula-montserrat-fonts/Montserrat-Bold.otf'
TITLE = '/usr/share/fonts/julietaula-montserrat-fonts/Montserrat-BlackItalic.otf'


@lru_cache(None)
def font(size, face=MONO):
    return ImageFont.truetype(face, size)


def label(d, at, s, size, fill=PAPER, face=MONO, anchor='la'):
    d.text(at, s, font=font(size, face), fill=fill, anchor=anchor, stroke_width=0)


def cut_plate(d, box, fill, edge=None, bevel=9):
    x,y,r,b = box
    pts = [(x,y),(r,y),(r,b-bevel),(r-bevel,b),(x,b)]
    d.polygon(pts, fill, edge)
    return pts


def screw(d,x,y):
    d.ellipse((x-5,y-5,x+5,y+6),fill='#101817')
    d.ellipse((x-4,y-4,x+4,y+4),fill='#696b5b',outline='#959380')
    d.line((x-2,y+2,x+2,y-2),fill='#242c29',width=2)


class Camera:
    def __init__(self, root, ledger):
        self.root = root
        self.ledger = ledger
        self.sheets = json.loads((root/'loopforge-intro/sprites.json').read_text())['sheets']
        self.floor = root/'loopforge-design/floor-correction/v1'
        self.pack = json.loads((self.floor/'manifest.json').read_text())['rooms']['conveyor']

    @lru_cache(None)
    def sprite(self, key, frame=0):
        w,h,cols,*_ = self.sheets[key]
        x,y = frame%cols*w, frame//cols*h
        return Image.open(self.root/'loopforge-intro'/f'{key}.webp').convert('RGBA').crop((x,y,x+w,y+h))

    def room(self,w,h,wide,mobile,beat):
        # The staging uses the exact factory-metre positions from the checkpoint.
        scale = (w/20.5 if wide else (76 if mobile else 112))
        cam_x = 126.7 if wide else (131.65 if mobile else 131.15)
        cam_y = 144.4
        ground = h*(.56 if wide else .57)
        def xy(x,y):
            return round(w/2+(x-cam_x)*scale),round(ground+(y-cam_y)*scale*.67)
        room = Image.new('RGB',(w,h),'#362d26')
        for layer in ('material','room'):
            item=self.pack[layer]
            tile=Image.open(self.floor/item['file']).convert('RGBA')
            x0,y0=xy(*item['originM'])
            dw,dh=item['extentM']
            tw,th=round(dw*scale),round(dh*scale*.67)
            if layer=='material':
                tile=tile.resize((tw,th),NEAR)
                for y in range(y0%th-th,h,th):
                    for x in range(x0%tw-tw,w,tw):
                        room.paste(tile,(x,y),tile)
            else:
                # Crop in source pixels before enlargement, preserving the room registration.
                sx,sy=tw/tile.width,th/tile.height
                x1,y1=max(0,math.floor(-x0/sx)),max(0,math.floor(-y0/sy))
                x2,y2=min(tile.width,math.ceil((w-x0)/sx)),min(tile.height,math.ceil((h-y0)/sy))
                if x2>x1 and y2>y1:
                    patch=tile.crop((x1,y1,x2,y2)).resize((round((x2-x1)*sx),round((y2-y1)*sy)),NEAR)
                    room.paste(patch,(round(x0+x1*sx),round(y0+y1*sy)),patch)
        d=ImageDraw.Draw(room)
        def patch(im,x,y,k,pivot):
            px,py=pivot
            im=im.resize((max(1,round(im.width*k)),max(1,round(im.height*k))),NEAR)
            room.paste(im,(round(x-px*k),round(y-py*k)),im)
        def actor(key,f,x,y,k):
            patch(self.sprite(key,f),x,y,k,self.sheets[key][3:5])
        def quad(x1,y1,x2,y2,fill):
            d.rectangle((*xy(x1,y1),*xy(x2,y2)),fill)
        quad(118,145,135.5,147.4,'#323736')
        for j,(sx,metal) in enumerate([(119.7,'#827856'),(123.7,'#426a6d'),(127.7,'#667377')]):
            quad(sx-1.30,145.65,sx+1.30,147.12,metal)
            quad(sx-1.30,147.12,sx+1.30,147.40,'#212e30')
            if j==0:
                x,y=xy(sx,145.7); d.rectangle((x-5,y-4,x+5,y+2),fill='#eec79a',outline='#302b29')
        px,py=xy(132,144.4); k=scale/64
        register=py+294*k
        actor('press-back',0 if beat=='stroke' else 6,px,register,k)
        # Enlarged witness marks on the same press expose travel and carrier contact.
        x,y=xy(132.02,144.45)
        C=lambda n: round(n*k)
        y+=C(35)
        d.rectangle((x+C(10),y-C(28),x+C(44),y+C(4)),fill='#192422',outline='#59635a',width=max(1,C(2)))
        tip=y-C(3 if beat=='stroke' else 17)
        d.rectangle((x+C(21),y-C(26),x+C(32),tip),fill='#abb3a2')
        d.rectangle((x+C(14),tip-C(3),x+C(39),tip),fill='#d6ae70')
        d.rectangle((x+C(16),y-C(1),x+C(37),y+C(2)),fill='#bb8584',outline='#e4bd93')
        # A visible edge catches the raised toe plate when the load is waiting.
        fx,fy=xy(131.7,144.4)
        for a in sorted(self.ledger[0]['crew'],key=lambda a:a['y']):
            ident=a['id']; ax,ay=xy(a['x'],a['y'])
            if ax < -scale or ax > w+scale: continue
            d.ellipse((ax-C(16),ay-C(4),ax+C(16),ay+C(4)),fill='#2c2b25')
            if ident=='max':
                down=beat=='stroke'
                toe=(ax+C(21),ay+C(4 if down else -7))
                d.polygon([(ax-C(7),ay+C(7)),(ax+C(27),ay+C(7)),(ax+C(30),ay+C(13)),(ax-C(8),ay+C(13))],fill='#222f30',outline='#87938a')
                d.line((ax-C(5),ay+C(5),*toe), fill='#282a25',width=max(3,C(7)))
                d.line((ax-C(5),ay+C(4),toe[0],toe[1]-1),fill=GOLD,width=max(2,C(3)))
                if down:
                    # A proposed contact key made from max’s existing body and boot.
                    # Plant the far leg, turn his head to the die, articulate the near leg.
                    pose=self.sprite('char-max-check',0).copy()
                    sx,sy=self.sheets['char-max-check'][3:5]
                    head=pose.crop((sx-18,0,sx+17,32))
                    pose.paste((0,0,0,0),(sx-18,0,sx+17,32))
                    pose.paste(ImageOps.mirror(head),(sx-16,4))
                    pose.paste((0,0,0,0),(sx,sy-24,sx+17,sy+4))
                    patch(pose,ax,ay+2*k,k,(sx,sy))
                    pts=[(ax+C(3),ay-C(24)),(ax+C(14),ay-C(18)),(ax+C(13),ay+C(2))]
                    d.line(pts,fill='#16202a',width=max(4,C(8)))
                    d.line(pts,fill='#42627c',width=max(2,C(4)))
                    d.line((ax+C(12),ay+C(2),ax+C(22),ay+C(3)),fill='#233f52',width=max(3,C(5)))
                else:
                    actor('char-max-walk-S',0,ax,ay,k)
            elif ident=='LIMEN': actor('char-limen-check',5 if beat=='call' else 0,ax,ay,k)
            else: actor('bob-forge',0,ax,ay,k)
        actor('press-front',0,px,register,k)
        # The roller's front returns above the back plate. The operator stays visible.
        for rx in [135.2,135.75,136.3]:
            ax,ay=xy(rx,145.48);d.rounded_rectangle((ax-C(11),ay-C(5),ax+C(11),ay+C(3)),radius=max(1,C(2)),fill='#243635',outline='#9c9c81')
            d.ellipse((ax-C(7),ay-C(9),ax+C(7),ay-C(2)),fill='#c49d79')
        return room,xy,scale


def overview(d,x,y,w,h,mobile,wide,beat):
    cut_plate(d,(x,y,x+w,y+h),'#142322','#52605a')
    label(d,(x+12,y+7),'CONVEYOR  /  WIDE VIEW' if wide else '‹  WIDE VIEW',12,MINT,BOLD)
    left=x+15 if mobile else x+140
    right=x+w-15
    by=y+(39 if mobile else h//2)
    sw=(right-left)/4
    for j,name in enumerate(('Intake','Wash','Belt','Forge')):
        m=beat['machines'][j]; cx=round(left+(j+.5)*sw)
        line='#64716a'
        if j<3:d.line((cx,by,round(cx+sw),by),fill=line,width=2)
        if name=='Forge' and not wide:
            d.rectangle((cx-8,by-8,cx+8,by+8),outline=PAPER,width=2)
        if m['carrier']:
            d.polygon([(cx,by-5),(cx+5,by),(cx,by+5),(cx-5,by)],fill=GOLD if m['canClear'] else '#c0aca0')
            if not m['canClear']: d.line((cx-3,by,cx+3,by),fill=INK,width=2)
        else:d.ellipse((cx-3,by-3,cx+3,by+3),fill='#66756e')
        label(d,(cx,by+10),name,11 if mobile else 14,PAPER if m['carrier'] else '#a0aca4',MONO,'ma')
    if not mobile:label(d,(x+12,y+h-21),'CAMERA SELECT',10,'#9aaba3')
    if mobile and wide:
        for j,m in enumerate(beat['machines']):
            col,row=j%2,j//2
            bx=x+9+col*(w//2-1); by=y+71+row*54
            cut_plate(d,(bx,by,bx+w//2-17,by+47),'#293936','#718377' if m['canClear'] else '#40504a',6)
            label(d,(bx+8,by+5),m['name'].upper(),13,PAPER,BOLD)
            label(d,(bx+8,by+26),'Ready  /  '+m['carrier'][-2:] if m['canClear'] else 'No carrier',11,GOLD if m['canClear'] else '#b1b8a6')



def render(camera, device, mode, out):
    mobile=device=='phone'
    w,h=(390,620) if mobile else (1120,640)
    stageid={'wide':0,'wait':0,'call':1,'stroke':2,'miss':0}[mode]
    event=camera.ledger[stageid]
    wide=mode=='wide'
    im=Image.new('RGB',(w,h),'#222d2a');d=ImageDraw.Draw(im)
    # Machine finish is deterministic and static at all motion settings.
    rng=random.Random(24)
    for y in range(h):
        t=round(9*math.cos(y/h*2.6))
        d.line((0,y,w,y),fill=(55+t,61+t,55+t))
    for _ in range(w*3):
        x,y=rng.randrange(w),rng.randrange(h)
        d.line((x,y,x+rng.randrange(1,8),y), fill=rng.choice(('#3c453e','#454d44','#3c423b','#313b35')))
    edge=12 if mobile else 21
    for x,y in [(7,8),(w-8,8),(7,h-9),(w-8,h-9)]:screw(d,x,y)
    label(d,(edge+7,10),'LOOPFORGE',15 if mobile else 18,PAPER,TITLE)
    label(d,(w-edge-6,13),'PRODUCER  /  DAY 02',10 if mobile else 12,'#d8d7be',MONO,'ra')
    top=41 if mobile else 47
    bottom=(309 if wide else 447) if mobile else 504
    d.rounded_rectangle((edge-4,top-5,w-edge+4,bottom+5),radius=9,fill='#111916',outline='#909180',width=2)
    sw,sh=w-edge*2,bottom-top
    room,xy,scale=camera.room(sw,sh,wide,mobile,mode)
    im.paste(room,(edge,top)); d=ImageDraw.Draw(im)
    X=lambda x:x+edge
    Y=lambda y:y+top
    # Station identity is printed at the edge of the instrument.
    block=171 if mobile else 235
    cut_plate(d,(edge,top,edge+block,top+(64 if mobile else 80)),INK)
    d.rectangle((edge,top,edge+4,top+(64 if mobile else 80)),fill=GOLD)
    label(d,(edge+13,top+7),'CAM 02   /   WIDE' if wide else 'CAM 02   /   DETAIL 04',11,MINT)
    label(d,(edge+10,top+19),'CONVEYOR' if wide else 'FORGE',24 if mobile and wide else (34 if mobile else 44),PAPER,TITLE)
    d.ellipse((w-edge-50,top+16,w-edge-45,top+21),fill=MINT)
    label(d,(w-edge-9,top+10),'LIVE',11,'#e1e7d3',BOLD,'ra')
    # Floor labels and small open corners show selectable subjects.
    def station_pin(name,sx,sy):
        ax,ay=xy(sx,sy); ax=X(ax);ay=Y(ay)
        d.line((ax,ay+2,ax,ay+12),fill=GOLD,width=2)
        tw=48 if mobile else 70
        cut_plate(d,(ax-tw//2,ay+12,ax+tw//2,ay+34),'#20302b',GOLD,4)
        label(d,(ax,ay+16),name,10 if mobile else 12,PAPER,BOLD,'ma')
    if wide:
        station_pin('INTAKE',119.7,146.8);station_pin('FORGE',132,146.8)
        for name,sx,sy in [('LIMEN',126.3,142.2),('max',131.7,144.4)]:
            ax,ay=xy(sx,sy); ax=X(ax); ay=Y(ay)-round(scale*1.5)-20
            tw=42 if name=='LIMEN' else 30
            cut_plate(d,(ax-tw//2,ay,ax+tw//2,ay+15),INK)
            label(d,(ax,ay+1),name,10,PAPER,MONO,'ma')
    else:
        # Etched focus corners hug the station, leaving the face and foot clear.
        corner='#b6c7b7'
        fx,fy=xy(131.7,144.4); fx=X(fx); fy=Y(fy)
        for ex,ey,dx,dy in [(fx-round(scale*.55),fy-round(scale*1.5),1,1),
                              (min(w-edge-6,fx+round(scale*1.7)),min(bottom-9,fy+round(scale*.65)),-1,-1)]:
            d.line((ex,ey+dy*9,ex,ey,ex+dx*11,ey),fill=corner,width=1)
        # Keep the operating point and the state word in the same camera.
        ax,ay=xy(131.7,144.4); ax=X(ax);ay=Y(ay)
        namex=ax-15;namey=ay-round((1.45 if mode!='stroke' else 1.40)*scale)-22
        cut_plate(d,(namex-23,namey,namex+22,namey+19),INK,None,4)
        label(d,(namex,namey+2),'max',13,PAPER,MONO,'ma')
        left=X(8) if mobile else X(20)
        low=bottom-12
        boxw=169 if mobile else 235
        cmd={'wait':'Clear','call':'Calling max','stroke':'Working','miss':'Call missed'}[mode]
        cut_plate(d,(left,low-49,left+boxw,low),GOLD if mode=='wait' else INK,PAPER if mode=='wait' else '#b4af8f',9)
        label(d,(left+12,low-42),'FORGE   /   C2',10,INK if mode=='wait' else MINT)
        label(d,(left+12,low-28),cmd,17 if mobile else 19,INK if mode=='wait' else PAPER,BOLD)
        d.line((left+boxw+2,low-25,ax-15,low-25,ax+3,ay+9),fill='#cfbc8d',width=1)
    # A tap on a station changes only the framing. The audio port carries
    # the visible speaker's room speech even when the actor is out of crop.
    audio_y=bottom+11
    audio_h=62 if mobile else 49
    cut_plate(d,(edge,audio_y,w-edge,audio_y+audio_h),'#172422','#637367')
    portrait=camera.sprite('char-limen-check',5 if mode=='call' else 0).crop((14,0,61,43))
    s=37 if mobile else 36
    portrait=portrait.resize((s,s),NEAR); im.paste(portrait,(edge+9,audio_y+7),portrait)
    label(d,(edge+56,audio_y+6),'CONVEYOR AUDIO   /   LIMEN',10,MINT,MONO)
    label(d,(edge+55,audio_y+23),event['speech'] if mode!='miss' else 'Forge, all clear. max.',15 if mobile else 17,PAPER,BOLD)
    y=audio_y+audio_h+7
    overview(d,edge,y,w-edge*2,h-y-15,mobile,wide,event)
    im.save(out/f'{device}-{mode}.webp',quality=88,method=6)


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('public',type=Path);parser.add_argument('output',type=Path)
    args=parser.parse_args(); cam=Camera(args.public,json.loads((args.output/'checkpoint.json').read_text()))
    for device in ('desktop','phone'):
        for mode in ('wide','wait','call','stroke'):
            render(cam,device,mode,args.output)
    render(cam,'phone','miss',args.output)
