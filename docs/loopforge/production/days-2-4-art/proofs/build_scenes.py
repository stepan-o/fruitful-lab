"""Compose art-direction stills with the approved calibration and shipped lane exports."""
from __future__ import annotations

import argparse
from collections import Counter
import io
import json
import math
import subprocess
from functools import lru_cache
from pathlib import Path
from zipfile import ZipFile

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
INK = "#152529"
PAPER = "#f6edd7"
MUTED = "#b1beb8"
AMBER = "#f4c57d"
SHADOW = "#102022"
NEAREST = Image.Resampling.NEAREST
SAMPLES = json.loads((HERE / "sampled-scenes.json").read_text())["samples"]

# Capture positions are authored world-metre positions on approved-factory/day-one-3.
# Room fixtures are read below directly from the measured floor.
STATES = {
    "desk-signal": ("Security", "Desk signal", "The desk holds the queue. Opening the signal costs no intervention."),
    "desk-open": ("Security", "Open pass decision", "The desk is still holding both lines while the player inspects the case."),
    "pass-issued": ("Security", "Daily pass issued", "bob can enter this shift. jo has stepped forward for his own check."),
    "custody": ("Security", "Detained for the shift", "LIMEN detains bob. jo steps forward and Wash remains uncovered."),
    "reply-delivered": ("Conveyor", "Reply delivered", "The reduced pace leaves time for sam to finish the reply to bob."),
    "reply-cut": ("Conveyor", "Reply interrupted", "STILETTO cuts sam off before the claim is delivered. Work continues at the press."),
    "line-clear": ("Conveyor", "All-clear handoff", "The crew waits for LIMEN’s clearance. Three new cortexes have arrived by the bell, six cumulative."),
    "line-rushed": ("Conveyor", "Rushed handoff", "STILETTO calls the next handoff. Five new cortexes have arrived by the bell, eight cumulative."),
    "back-limen": ("Security", "Public backing for LIMEN", "The two orders conflict. bob and the other three workers stay. mae is at the outfeed, outside earshot of the endorsement."),
    "back-stiletto": ("Security", "Public backing for STILETTO", "jo, kit and ben leave. bob waits and mae remains outside earshot at the outfeed."),
    "crew-decides": ("Security", "Crew decides", "The crew hears conflicting orders. jo departs, while bob, kit and ben stay."),
}
CHECKPOINT = {
    "desk-signal": "missing-id-open", "desk-open": "missing-id-open", "pass-issued": "missing-id-open",
    "custody": "missing-id-open", "reply-delivered": "sam-reply-at-wash", "reply-cut": "sam-reply-at-wash",
    "line-clear": "same-morning-bids", "line-rushed": "same-morning-bids",
    "back-limen": "security-clash", "back-stiletto": "security-clash", "crew-decides": "security-clash",
}
VIEWPORTS = {"desktop": (1280,720), "phone": (390,844), "narrow": (320,844)}


@lru_cache
def font(size, style="sans"):
    family = {"sans": "Liberation Sans", "bold": "Liberation Sans:style=Bold",
              "mono": "Liberation Mono", "mono-bold": "Liberation Mono:style=Bold"}[style]
    path = subprocess.check_output(["fc-match","-f","%{file}",family],text=True)
    return ImageFont.truetype(path,size)


def label(image, xy, value, sz=14, color=PAPER, style="sans"):
    ImageDraw.Draw(image).text(xy,value,font=font(sz,style),fill=color,anchor="lt")


def rect(image, box, color, outline=None, width=1):
    ImageDraw.Draw(image).rectangle(box,fill=color,outline=outline,width=width)


def ink_width(value, size=14, style="sans"):
    return math.ceil(font(size,style).getlength(value))


def wrap(value, max_width, size, style="sans"):
    lines = [""]
    for word in value.split():
        proposed = (lines[-1]+" "+word).strip()
        if lines[-1] and ink_width(proposed,size,style)>max_width:
            lines.append(word)
        else:
            lines[-1]=proposed
    return lines


def lines(image, at, value, max_width, size=14, color=PAPER, style="sans"):
    x,y=at
    for line in wrap(value,max_width,size,style):
        label(image,(x,y),line,size,color,style)
        y+=size+4
    return y


def mount(image, spr, pos, scale=1.0, pivot=(0,0)):
    if abs(scale-1)>.0001:
        spr=spr.resize((max(1,round(spr.width*scale)),max(1,round(spr.height*scale))),NEAREST)
    x=round(pos[0]-scale*pivot[0])
    y=round(pos[1]-scale*pivot[1])
    image.alpha_composite(spr,(x,y))


def patch(im, size, borders):
    left,top,right,bottom=borders
    sw,sh=im.size
    w,h=size
    if w<left+right or h<top+bottom:
        return im.resize(size,NEAREST)
    oldx=[0,left,sw-right,sw];oldy=[0,top,sh-bottom,sh]
    newx=[0,left,w-right,w];newy=[0,top,h-bottom,h]
    out=Image.new("RGBA",size)
    for j in range(3):
        for i in range(3):
            box=(newx[i],newy[j],newx[i+1],newy[j+1])
            if box[2]<=box[0] or box[3]<=box[1]: continue
            tile=im.crop((oldx[i],oldy[j],oldx[i+1],oldy[j+1]))
            out.paste(tile.resize((box[2]-box[0],box[3]-box[1]),NEAREST),box)
    return out


class Art:
    def __init__(self,repo,archive_path,pack):
        self.geo=json.loads((repo/"apps/lab/lib/loopforge/spatial/approved-factory.json").read_text())
        self.zips=[ZipFile(next(archive_path.glob(f"0{i}-*.zip"))) for i in range(1,5)]
        self.pack=pack
        self.s5=json.loads(self.zips[2].read("exports/lane03-pose-manifest.json"))

    @lru_cache
    def raw(self,lane,path):
        return Image.open(io.BytesIO(self.zips[lane-1].read(path))).convert("RGBA")

    @lru_cache
    def export(self,asset):
        lane={"fl":"floor","co":"console","sec":"security"}[asset.split("-")[0]]
        return Image.open(self.pack/lane/"exports"/(asset+".png")).convert("RGBA")

    @lru_cache
    def actor(self,name,room,step=False):
        if name in ("LIMEN","STILETTO"):
            record=self.s5["poses"]["char-"+name.lower()][0]
            image=self.raw(3,"exports/"+record["body"]).copy()
            image.alpha_composite(self.raw(3,"exports/"+record["emissive"]))
            x,y,w,h=record["atlasRect"]
            return image.crop((x,y,x+w,y+h))
        if step:
            # Day One layered gait, restored into its untrimmed 256px master cell.
            desc=json.loads(self.zips[1].read("motion/reusable/char-bob-walk-S.json"))
            idx=3
            ax,ay,aw,ah=desc["entries"][idx]["atlasRect"]
            frame=Image.new("RGBA",(256,256))
            tx,ty,_,_=desc["trimRect"]
            for layer in desc["layerOrder"]+["security-light","emissive"]:
                strip=self.raw(2,"motion/reusable/"+desc["atlases"][layer])
                frame.alpha_composite(strip.crop((ax,ay,ax+aw,ay+ah)),(tx,ty))
            if name!="bob":
                ImageDraw.Draw(frame).rectangle((136,169,142,171),fill={"lou":"#ca9e93","kit":"#c4cc83","ben":"#91b2b9","mae":"#b49b80","jo":"#a3cece"}.get(name,"#cdb8a9"))
            return frame
        if name=="max":
            return self.raw(2,"max-master/SE/lit.png")
        if name=="bob":
            return self.raw(1,f"bob/char-bob-neutral-se-r2-{room}-glow-on.png")
        # Other named workers use the Day One artist-approved temporary silhouette.
        base=self.raw(1,f"bob/char-bob-neutral-se-r2-{room}-glow-on.png").copy()
        ImageDraw.Draw(base).rectangle((137,166,143,168),fill={"ed":"#f2d395","jo":"#acd0ca","sam":"#dcafa7","lou":"#ca9e93","kit":"#c4cc83","ben":"#91b2b9","mae":"#b49b80"}.get(name,"#acbab8"))
        return base

    def panel(self,asset,size,borders):
        return patch(self.export(asset),size,borders)


class Camera:
    def __init__(self,size,room,centre,scale,anchor=.56):
        self.w,self.h=size
        self.scale=scale
        self.room=room
        self.x,self.y=centre
        self.anchor=anchor
        self.image=Image.new("RGBA",size)
        self.names={}

    def point(self,x,y):
        return round(self.w/2+(x-self.x)*self.scale),round(self.h*self.anchor+(y-self.y)*self.scale*.70)

    def lit(self,art):
        tile=art.raw(1,f"B/{self.room}/floor.png")
        w,h=round(4*self.scale),round(4*self.scale*.70)
        tile=tile.resize((w,h),NEAREST)
        origin=self.point(0,0)
        for x in range(origin[0]%w-w,self.w,w):
            for y in range(origin[1]%h-h,self.h,h):
                self.image.alpha_composite(tile,(x,y))

    def original(self,art,raw,xy,pivot=(128,208)):
        mount(self.image,raw,self.point(*xy),self.scale/64,pivot)

    def actor(self,art,name,xy,step=False):
        x,y=self.point(*xy)
        texture=art.actor(name,self.room,step)
        bounds=texture.getbbox()
        shadow=Image.new("RGBA",self.image.size)
        ImageDraw.Draw(shadow).ellipse((x-self.scale*.29,y-3,x+self.scale*.46,y+6),fill=(6,14,15,100))
        self.image.alpha_composite(shadow)
        self.original(art,texture,xy)
        self.names[name]=(x,y,round(y-(208-bounds[1])*self.scale/64))

    def hardware(self,art,asset,xy,pivot):
        self.original(art,art.export(asset),xy,pivot)

    def name(self,name,above=False):
        x,y,top=self.names[name]
        if x<6 or x>self.w-6 or y<-10 or y>self.h-8: return
        s=11 if self.w<500 else 13
        w=ink_width(name,s,"mono-bold")+12
        lx=max(2,min(self.w-w-2,x-w//2))
        ly=top-s-7 if above else y+5
        if ly<1 or ly+s+7>self.h:return
        rect(self.image,(lx,ly,lx+w,ly+s+5),"#17282a",outline="#768583")
        label(self.image,(lx+6,ly+3),name,s,"#f1ddaa","mono-bold")

    def bubble(self,art,name,words,x,y,width,interrupted=False):
        s=14 if self.w<560 else 17
        ht=10+17+len(wrap(words,width-18,s))*(s+4)+7
        anchor=self.names[name]
        target=(anchor[0],anchor[2]-3)
        start=(max(x+13,min(x+width-15,target[0])),y+ht-2)
        tail=art.export("fl-tail-left" if target[0]<start[0] else "fl-tail-right")
        # Art tails make the panel junction; the leader terminates at the same speaker's head.
        draw=ImageDraw.Draw(self.image)
        draw.line([start,(start[0],start[1]+8),target],fill="#203337",width=3)
        draw.line([start,(start[0],start[1]+8),target],fill="#ecdfb8",width=1)
        mount(self.image,tail,(start[0]-6,start[1]-1))
        bg=art.panel("fl-bubble-interrupted" if interrupted else "fl-bubble",(width,ht),[8,7,11,7])
        mount(self.image,bg,(x,y))
        nw=ink_width(name,11,"mono-bold")+15
        plate=art.panel("fl-bubble-nameplate",(nw,16),[5,3,5,3])
        mount(self.image,plate,(x+8,y+5))
        label(self.image,(x+15,y+8),name,11,PAPER,"mono-bold")
        lines(self.image,(x+9,y+26),words,width-18,s,INK,"sans")

    def secondary_actor(self,art,name,xy):
        self.actor(art,name,xy)
        self.name(name)


def s5(art,camera,pose,xy):
    key="exports/fixtures/sec-desks-S5-"+pose+".png"
    camera.original(art,art.raw(3,key),xy)


def gate(art,camera,closed):
    record=art.s5["boom"]
    iw,ih=record["atlasCellPx"]
    frame=24 if closed else 0
    x,y=frame%5*iw,frame//5*ih
    boom=art.raw(3,"exports/"+record["asset"]).crop((x,y,x+iw,y+ih))
    camera.original(art,boom,tuple(record["hinge"]),tuple(record["pivotPx"]))


def room_floor(art,camera):
    camera.lit(art)
    if camera.room=="security":
        for x in (123.31,130.31):
            camera.original(art,art.raw(3,"exports/fixtures/sec-rails-depth.png"),(x,127.2),(10,326))
        # Existing second desk reused as a calibrated skin on the measured register fixture.
        for x in (123.6,131.6):
            for layer in ("back","front"):
                s5(art,camera,layer,(x,131.9))
    else:
        for x in (119.7,123.7,127.7):
            conveyor(art,camera,x)


def conveyor(art,cam,xworld):
    r=cam.scale
    x,y=cam.point(xworld,146.2)
    dr=ImageDraw.Draw(cam.image)
    x0,x1=round(x-r*1.95),round(x+r*1.95);y0,y1=round(y-r*.31),round(y+r*.65)
    dr.rectangle((x0,y0,x1,y1),fill="#3d4641",outline="#aba387",width=2)
    dr.rectangle((x0+3,y0+4,x1-3,y1-7),fill="#4f5852",outline="#263532",width=2)
    for l in range(x0+6,x1-3,max(5,round(r*.15))):
        dr.line((l,y0+6,l,y1-9),fill="#86856f",width=max(1,round(r*.045)))
    dr.rectangle((x0+4,y1-7,x1-4,y1-3),fill="#9b875c")
    for xx in (x0+6,x1-6):
        dr.rectangle((xx-2,y1+1,xx+2,y1+max(5,round(r*.23))),fill="#283936")


def press(art,cam,actor=None):
    p=cam.point(131.7,144.4)
    k=cam.scale/64
    machine=(p[0]+19*k,p[1]+294*k)
    for part in ("mach-forge-C4-base","mach-forge-C4-rear-guard","mach-forge-C4-door-6","mach-forge-C4-control"):
        mount(cam.image,art.raw(4,"exports/fixture/"+part+".png"),machine,k,(160,420))
    if actor:
        cam.actor(art,actor,(131.7,144.4))
    mount(cam.image,art.raw(4,"exports/fixture/mach-forge-C4-front-guard.png"),machine,k,(160,420))

def security_scene(art, state, size):
    w,h=size
    clash=CHECKPOINT[state]=="security-clash"
    sample=SAMPLES[state]
    scale=(27 if w<385 else (30 if w<560 else 45)) if clash else (43 if w<385 else (50 if w<560 else 71))
    cx=127 if clash else 126.4
    cam=Camera(size,"security",(cx,129.15 if clash else 130.2),scale,.65 if clash else .64)
    room_floor(art,cam)
    resolved=state in ("custody","pass-issued")
    ids=["LIMEN","bob","jo","kit","ben","STILETTO"] if clash else ["ed","LIMEN","jo","bob"]
    if state=="custody":
        ids.remove("bob") # the insert is the contracted representation pending jail geometry
    actors={name:sample["agents"][name] for name in ids}
    # The four paired doors/queue shots share the same camera and measured placement.
    for name,actor in sorted(actors.items(),key=lambda kv:kv[1]["positionMm"][1]):
        xy=tuple(v/1000 for v in actor["positionMm"])
        is_step=actor["moving"] and name in ("lou","kit","ben","jo","bob")
        cam.actor(art,name,xy,step=is_step)
    gate(art,cam,not resolved)
    cam.hardware(art, "fl-gate-released" if resolved else "fl-gate-held",(124.9,134), (18,36))
    for name in actors:
        if not clash and not resolved and name=="LIMEN":continue
        cam.name(name,above=name=="ed" or cam.names[name][1]+26>=cam.h)
    if clash:
        bw=(w-32)//2 if w<560 else 280
        cam.bubble(art,"LIMEN","The crew stays here. Checks first.",10,12,bw)
        cam.bubble(art,"STILETTO","Crew. On the line. With me.",w-bw-10,12,bw)
    elif not resolved:
        bw=176 if w<385 else (196 if w<560 else 290)
        sx=11 if w<560 else max(9,(w-bw)//2-10)
        cam.bubble(art,"LIMEN","This worker is missing ID. Hold the line.",sx,14,bw)
    if not clash:
        # Screen-space signal is separate from the 44 CSS px input region.
        sx,sy=cam.point(123.7,131.55)
        s=art.export("sec-signal-report" if resolved else "sec-signal-action")
        mount(cam.image,s,(sx,sy-10),1,(12,23))
        if state=="desk-signal":
            mount(cam.image,art.panel("sec-focus-ring",(46,46),[9]*4),(sx-23,sy-44))
        if state=="pass-issued":
            x,y,_=cam.names["bob"];mount(cam.image,art.export("sec-pass-issued-world"),(x+6,y-26),scale/64)
    return cam.image


def conveyor_scene(art,state,size):
    w,h=size
    chat=CHECKPOINT[state]=="sam-reply-at-wash"
    scale=(35 if w<385 else (42 if w<560 else 66)) if chat else (40 if w<385 else (48 if w<560 else 66))
    cam=Camera(size,"forge",(123.0 if chat else 128.4,144.5),scale,.70)
    room_floor(art,cam)
    press(art,cam,actor="max")
    if chat:
        positions={"sam":(119.7,144.4),"bob":(123.7,144.4),"STILETTO":(126.3,142.2)}
    else:
        lead="LIMEN" if state=="line-clear" else "STILETTO"
        positions={"jo":(127.7,144.4),lead:(126.3,142.2)}
    for name,xy in sorted(positions.items(),key=lambda kv:kv[1][1]):cam.actor(art,name,xy)
    visible_speakers={"reply-cut":{"sam","STILETTO"},"reply-delivered":{"sam"},"line-clear":{"LIMEN"}}.get(state,set())
    for name in positions:
        if name not in visible_speakers:cam.name(name)
    if not chat:cam.name("max")
    if state=="reply-cut":
        # Two previously delivered beats, including the cutoff, are retained in the room's speech view.
        bw=(w-28)//2 if w<560 else 265
        cam.bubble(art,"sam","Heard something this morning.",8,11,bw,True)
        cam.bubble(art,"STILETTO","Hands on the line. Now.",w-bw-8,11,bw)
        cam.hardware(art,"fl-handoff-rushed",(124.8,146.0),(17,35))
    elif state=="reply-delivered":
        bw=(w-32) if w<560 else 324
        cam.bubble(art,"sam","ed logged a loose card. Ask at his desk.",14,11,min(270,bw))
        cam.hardware(art,"fl-handoff-ready",(124.8,146.0),(17,35))
    else:
        cam.hardware(art,"fl-handoff-clear" if state=="line-clear" else "fl-handoff-rushed",(128.55,145.65),(17,35))
        if state=="line-clear":
            cam.bubble(art,"LIMEN","All clear. Main belt.",12,14,min(210,w-24))
        # No incident or cry is invented for ordinary fast handoffs.
    return cam.image


def intake_feed(art,size):
    w,h=size
    r=35 if w<560 else 48
    cam=Camera(size,"forge",(120.8,144.8),r,.57)
    room_floor(art,cam)
    cam.secondary_actor(art,"sam",(119.7,144.4))
    cam.hardware(art,"fl-post-staffed",(120.5,145.40),(12,20))
    cam.hardware(art,"fl-handoff-ready",(120.9,146.4),(17,35))
    return cam.image


def staffing_feed(art,size,coverage):
    w,h=size
    r=33 if w<560 else 46
    cam=Camera(size,"forge",(121.7,144.85),r,.56)
    room_floor(art,cam)
    for i,station in enumerate(("Intake","Wash")):
        x=art.geo["stations"][i]["x"]
        holder=coverage[i]
        if holder:
            cam.secondary_actor(art,holder,(x,144.4))
        else:
            px,py=cam.point(x,144.4)
            tag="Vacant"
            tw=ink_width(tag,11,"mono-bold")+12
            rect(cam.image,(px-tw//2,py+4,px+tw//2,py+21),"#352f27",outline="#b99b67")
            label(cam.image,(px-tw//2+6,py+7),tag,11,PAPER,"mono-bold")
        cam.hardware(art,"fl-post-staffed" if holder else "fl-post-vacant",(x+.75,145.05),(12,20))
    return cam.image


def rack_feed(art,size,arrivals):
    w,h=size
    r=81 if w<560 else 88
    cam=Camera(size,"forge",(135.6,147),r,.58)
    cam.lit(art)
    rack=next(f["rect"] for f in art.geo["fixtures"] if f["id"]=="output")
    left,top=cam.point(rack["x"],rack["y"]+.7)
    right,bottom=cam.point(rack["x"]+rack["w"],rack["y"]+rack["h"]-.6)
    rect(cam.image,(left,top,right,bottom),"#3c4440",outline="#9d997c",width=2)
    rect(cam.image,(left+4,top+5,right-4,bottom-5),"#303733",outline="#62695b")
    for yy in range(top+12,bottom-6,12):
        ImageDraw.Draw(cam.image).line((left+8,yy,right-8,yy),fill="#485348")
    occupied=Counter(tuple(p["at"]) for p in arrivals)
    for i,xy in enumerate(art.geo["contact"]["outputSlots"]):
        cam.hardware(art,"fl-rack-cradle",xy,(17,13))
        if tuple(round(v*1000) for v in xy) in occupied:cam.hardware(art,"fl-cortex-finished",xy,(13,22))
        cam.hardware(art,"fl-rack-lip",xy,(17,13))
        count=occupied[tuple(round(v*1000) for v in xy)]
        if count:
            px,py=cam.point(*xy)
            caption=f"×{count}"
            tw=ink_width(caption,12,"mono-bold")+8
            rect(cam.image,(px-tw//2,py+16,px+tw//2,py+34),"#1c2c2b",outline="#7f8a79")
            label(cam.image,(px-tw//2+4,py+19),caption,12,PAPER,"mono-bold")
    return cam.image


def press_feed(art,size):
    w,h=size
    r=37 if w<560 else 46
    cam=Camera(size,"forge",(131.6,144.1),r,.56)
    room_floor(art,cam)
    press(art,cam,actor="max")
    cam.name("max")
    cam.hardware(art,"fl-post-staffed",(132.4,144.4),(12,20))
    return cam.image


def header(image,room,day):
    w=image.width
    rect(image,(0,0,w,61),"#192c2e")
    rect(image,(0,59,w,61),"#756e58")
    label(image,(13,11),"FACTORY FLOOR",10,"#c5bba2","mono-bold")
    label(image,(12,26),room,26,PAPER,"bold")
    day_label="SHIFT 0"+str(day)
    label(image,(w-ink_width(day_label,13,"mono-bold")-17,32),day_label,13,AMBER,"mono-bold")


def film_frame(image,xy,size,art,stamp):
    x,y=xy;w,h=size
    rect(image,(x-1,y-1,x+w,y+h),"#506262",outline="#8b876e")
    image.alpha_composite(art,(x,y))
    # The two edge index ticks belong to the feed housing, outside the artwork.
    for xx in (x+3,x+w-16):
        rect(image,(xx,y+h-2,xx+12,y+h-1),"#e1c091")


def screen_button(image,xy,width,value,focus=False,light=False,art=None):
    x,y=xy
    color="#d8c4a0" if light else "#293b3b"
    ink=INK if light else PAPER
    rect(image,(x,y,x+width-1,y+43),color,outline="#9a9981")
    txtw=ink_width(value,14,"bold")
    label(image,(x+(width-txtw)//2,y+14),value,14,ink,"bold")
    if focus:
        mount(image,art.panel("sec-focus-ring",(width+4,48),[9]*4),(x-2,y-2))


def event_card(art,image,box,state):
    x,y,w,h=box
    isclash=CHECKPOINT[state]=="security-clash"
    if state=="desk-open":
        asset="sec-panel-active";heading="SECURITY  /  OPEN"
    elif state in ("custody","pass-issued"):
        asset="sec-panel-committed";heading="SECURITY REPORT  /  LIMEN"
    elif isclash:
        asset="sec-panel-active" if state=="crew-decides" else "sec-panel-committed"
        heading="PUBLIC ADDRESS" if state!="crew-decides" else "SECURITY  /  ORDERS"
    elif state=="desk-signal":
        # A quiet world signal is the only foreground affordance before the player chooses.
        return
    else:
        asset="sec-panel-committed";heading="ROOM SPEECH" if state.startswith("reply-") else "CONVEYOR  /  HANDOFF"
    ordinary=state.startswith(("reply-","line-")) or state=="crew-decides"
    if ordinary:
        mount(image,art.panel("co-briefing-chassis",(w,h),[10,10,11,13]),(x,y))
        label(image,(x+14,y+12),heading,11,AMBER,"mono-bold")
    else:
        mount(image,art.panel(asset,(w,h),[24,23,8,8]),(x,y))
        label(image,(x+28,y+7),heading,11,"#e9d7a6","mono-bold")
    xx,yy=x+13,y+35
    if state=="desk-open":
        label(image,(xx,yy),"bob’s ID is missing",21,PAPER,"bold")
        lines(image,(xx,yy+31),"A pass admits bob through this shift’s bell.",w-26,15)
        bw=(w-38)//2
        screen_button(image,(xx,y+h-60),bw,"Issue daily pass",True,True,art)
        screen_button(image,(xx+bw+10,y+h-60),bw,"Keep watching")
    elif state=="pass-issued":
        scale=2
        mount(image,art.export("sec-pass-issued"),(xx,yy),scale)
        for n,(v,clr) in enumerate([("bob","#28332e"),("Producer","#28332e"),("Day 2","#374039")]):
            label(image,(xx+35,yy+10+21*n),v,10,clr,"mono-bold")
        dx=xx+142
        lines(image,(dx,yy+3),"Valid until the bell",w-(dx-x)-12,17,PAPER,"bold")
        label(image,(xx,y+h-33),"LIMEN",11,AMBER,"mono-bold")
        label(image,(xx+48,y+h-34),"bob cleared on a daily pass.",14,PAPER)
    elif state=="custody":
        mount(image,art.export("sec-custody-held"),(xx,yy),1.5)
        dx=xx+109
        lines(image,(dx,yy),"bob is in Security custody until the bell.",w-(dx-x)-12,16,PAPER,"bold")
        label(image,(xx,y+h-33),"WASH",11,AMBER,"mono-bold")
        label(image,(xx+44,y+h-34),"One operator short.",14,PAPER)
    elif isclash:
        val={"back-limen":"Follow LIMEN.","back-stiletto":"Follow STILETTO.","crew-decides":"The crew acts on the orders it heard."}[state]
        label(image,(xx,yy),"Producer" if state!="crew-decides" else "Security",12,AMBER,"mono-bold")
        lines(image,(xx,yy+21),val,w-26,20,PAPER,"bold")
        status={"back-limen":"bob, jo, kit and ben stay.","back-stiletto":"bob waits. jo, kit and ben leave.","crew-decides":"jo goes. bob, kit and ben wait."}[state]
        lines(image,(xx,y+h-66),status,w-26,14,PAPER)
        lines(image,(xx,y+h-41),"Intervention spent" if state!="crew-decides" else "Intervention available",w-26,14,MUTED)
    elif state.startswith("reply-"):
        label(image,(xx,yy),"bob",12,AMBER,"mono-bold")
        label(image,(xx,yy+24),"sam, seen my ID?",20,PAPER,"bold")
        val="sam’s reply arrived." if state=="reply-delivered" else "STILETTO interrupted sam’s reply."
        lines(image,(xx,y+h-47),val,w-26,14,MUTED)
    else:
        val="LIMEN" if state=="line-clear" else "STILETTO"
        label(image,(xx,yy),val,12,AMBER,"mono-bold")
        lines(image,(xx,yy+21),"Clear each handoff" if state=="line-clear" else "Run the line fast",w-26,22,PAPER,"bold")
        lines(image,(xx,y+h-42),"Main belt · jo at the control",w-26,14,MUTED)


def outfeed_witness(art,size,call):
    w,h=size
    scale=33 if w<560 else 40
    person=call["featured"]
    pos=tuple(v/1000 for v in person["positionMm"])
    cam=Camera(size,"forge",(134.8,143.4),scale,.55)
    room_floor(art,cam)
    # This second camera samples the public floor at the call tick, including
    # the real C4 operator. No private receipt is exposed in the player view.
    cam.secondary_actor(art,person["id"],pos)
    press(art,cam,actor=call["pressOperator"] or None)
    return cam.image


def secondary(art,state,size):
    if state in ("line-clear","line-rushed"):
        close=SAMPLES[state]["close"]
        n=len(close["new"])
        return rack_feed(art,size,close["occupants"]),"At the bell · Outfeed rack",f"{n} delivered this shift · {close['cumulative']} total"
    if state in ("custody","pass-issued"):
        coverage=SAMPLES[state]["washFollowup"]["coverage"]
        return staffing_feed(art,size,coverage),"Later this shift · Intake & Wash",("sam at Intake · bob at Wash" if coverage[1] else "sam at Intake · Wash unstaffed")
    if state.startswith("reply-"):
        return press_feed(art,size),"Forge press","max is working at the press."
    if CHECKPOINT[state]=="security-clash":
        return outfeed_witness(art,size,SAMPLES[state]["callFeed"]),"Conveyor · Outfeed","mae is standing by the outfeed."
    return intake_feed(art,size),"Conveyor · Intake","sam cleared earlier and is working at Intake."


def footer(image,state):
    w,h=image.size
    rect(image,(0,h-31,w,h),"#0e191b")
    label(image,(12,h-20),"LOOPFORGE  /  COMPOSITED ART PROOF",10,"#a9b4aa","mono")
    viewport=f"{w} × {h}"
    if w>360:label(image,(w-ink_width(viewport,10,"mono")-14,h-20),viewport,10,"#a9b4aa","mono")


def compose(art,key,size):
    w,h=size;desk=w>=700
    image=Image.new("RGBA",size,"#162426")
    room,title,_=STATES[key]
    header(image,room,4 if CHECKPOINT[key]=="security-clash" else 2)
    if desk:
        x=16;ww=round(w*.63);y=94;fh=h-y-56
        side_x=x+ww+18;side_w=w-side_x-16
        card=(side_x,94,side_w,200);sec_y=340 if key!="desk-signal" else 94
        sw=side_w;sh=220 if key!="desk-signal" else 314
    else:
        x=9;ww=w-18;y=89;fh=344
        side_x=x;side_w=ww;card=(x,445,ww,165)
        sec_y=646 if key!="desk-signal" else 478
        sw=ww;sh=105 if key!="desk-signal" else 210
    label(image,(x,y-17),"ROOM CAMERA   /   "+("REGISTER" if room=="Security" else "LINE FLOOR"),10,MUTED,"mono-bold")
    content=security_scene(art,key,(ww,fh)) if room=="Security" else conveyor_scene(art,key,(ww,fh))
    film_frame(image,(x,y),(ww,fh),content,room)
    event_card(art,image,card,key)
    other,place,report=secondary(art,key,(sw,sh))
    label(image,(side_x,sec_y-18),place,12,AMBER,"mono-bold")
    film_frame(image,(side_x,sec_y),(sw,sh),other,place)
    lines(image,(side_x+1,sec_y+sh+10),report,sw-3,14,MUTED)
    if key=="desk-signal":
        # In the closed state the room remains clear; use the baseline view control in the console rail.
        if desk:
            xx,yy=side_x,sec_y+sh+64
        else:
            xx,yy=x,sec_y+sh+53
        label(image,(xx,yy),"Security desk",13,AMBER,"mono-bold")
        lines(image,(xx,yy+21),"A report is ready at the register.",sw-2,16,PAPER)
    footer(image,key)
    return image.convert("RGB")


def main():
    parser=argparse.ArgumentParser(__doc__)
    parser.add_argument("--repo",type=Path,default=HERE.parents[4])
    parser.add_argument("--archives",type=Path)
    parser.add_argument("--pack",type=Path,default=HERE.parent)
    parser.add_argument("--out",type=Path,default=HERE)
    parser.add_argument("--states",nargs="*",choices=list(STATES))
    args=parser.parse_args()
    art=Art(args.repo,args.archives or args.repo/"docs/loopforge/production/day-one-sprite-calibration",args.pack)
    shots=[]
    for key in args.states or STATES:
        room,title,description=STATES[key]
        images={}
        for vp,size in VIEWPORTS.items():
            dest=args.out/vp/(key+".png")
            dest.parent.mkdir(parents=True,exist_ok=True)
            compose(art,key,size).save(dest,optimize=True)
            images[vp]=dest.relative_to(args.out).as_posix()
        shots.append({"id":key,"title":title,"room":room,"checkpoint":CHECKPOINT[key],"tick":SAMPLES[key]["tick"],
                      "description":description,"images":images})
    if not args.states:
        provenance={
            "class":"Authored static pixel-art compositions; camera framing and speech layout are authored; decisions, reported lines and output counts come from sampled-scene records.",
            "runtime":"Rendering uses frozen, sampled working-source observations in sampled-scenes.json. sample_engine.cjs regenerates those records from a matching source checkout. The primary belt view is taken during a handoff, with the outfeed inset at the common bell. In the clash plates the outfeed camera uses mae’s public position at the command instant, tick 9467. The reviewer annotation about receipt comes from the simulation’s private per-event hearing log, never inferred from the later position. Numeric socket counters reveal all committed cores which share each measured rack anchor. The pass and custody staffing insets are the same instant at tick 6100. The clash frame recalls both conflicting orders while showing workers seven ticks after resolution. These are static art compositions, not live gameplay.",
            "floor":"approved-factory/day-one-3","calibration":"08c8db11, PR155",
            "comparison":"Within each checkpoint the same camera, metric scale, lighting, cast and room anchors are used at a given viewport.",
            "sourceArt":"Day One B Security/Forge floors, bob and max, S5 supervisor plates, desk and boom, C4 press. Reused bob silhouette for sam, ed, jo, kit, ben and mae. Named gait stand-ins share the south-facing bob gait. Supervisor acting is provisional Day One S5 artwork; final character action and facing coverage is separate.",
            "placeholders":"Composite belt roller geometry for Intake/Wash/Belt; desk paint reused on the measured register fixture. Custody is a report insert.",
            "speech":"Room lines derive from the Days 2–4 ENGINE working source; the proof illustrator positions the bubbles. Blocked speech is never added. The receipt shows the earlier delivered question.",
            "touch":"The selected signal and actionable controls have at least 44 CSS px hit regions in the proposed layout.",
            "sizes":VIEWPORTS,"speed":"Still artwork; no playback speed.","color":"B/Raking light, nearest-neighbour sprite sampling.",
        }
        (args.out/"index.json").write_text(json.dumps({"provenance":provenance,"shots":shots},indent=2)+"\n")


if __name__=="__main__":main()
