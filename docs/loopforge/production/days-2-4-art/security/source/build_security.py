"""Raster artwork for Loopforge Security. Run with Python 3 and Pillow."""
from __future__ import annotations

import hashlib
import io
import json
import zipfile
from pathlib import Path
from xml.etree import ElementTree as XML

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CAL = ROOT.parents[1] / "day-one-sprite-calibration"
ARCHIVE = "01-style-B.zip"
HEAD_ENTRY = "bob/char-bob-neutral-se-r2-03-torso-head.png"
LIGHT_ENTRY = "bob/char-bob-neutral-se-r2-05-light-security.png"
EYE_ENTRY = "bob/char-bob-neutral-se-r2-07-emissive.png"
HEAD_BOX = (114, 141, 144, 167)
NEAREST = Image.Resampling.NEAREST
# Palette by material. Sharp plane changes and sparse upper-left highlights echo B.
INK, SEAM, IRON, RAIL, EDGE, GLEAM = ("#111b1e", "#213034", "#304447", "#516764", "#879a8d", "#b4b7a2")
DEEP, TEAL, ENAMEL, CYAN = ("#19383d", "#235651", "#45817c", "#96c4b2")
PAPER_SH, PAPER, STOCK, LIGHT = ("#958876", "#c4b7a0", "#dfd4b9", "#f1e8ce")
OXIDE, BRASS, AMBER = ("#654e3a", "#a47845", "#dfb977")
assets = []

def png(im):
    out = io.BytesIO()
    im.save(out, "PNG", optimize=True)
    return out.getvalue()

def digest(data):
    return hashlib.sha256(data).hexdigest()

def sha_file(path):
    return digest(path.read_bytes())

def layer(size):
    im = Image.new("RGBA", size)
    return im, ImageDraw.Draw(im)

def polygon(d, coords, fill):
    d.polygon(coords, fill)

def bevel(d, x, y, w, h, cut, fill):
    right, bottom = x+w-1, y+h-1
    polygon(d, [(x+cut,y),(right-cut,y),(right,y+cut),(right,bottom-cut),(right-cut,bottom),(x+cut,bottom),(x,bottom-cut),(x,y+cut)],fill)

def screw(d, x, y):
    d.rectangle((x,y,x+3,y+3), fill=SEAM)
    d.line((x,y,x+2,y),fill=EDGE)
    d.line((x+1,y+2,x+2,y+1),fill=IRON)

def ora(file, name, layers):
    width, height = layers[0][1].size
    root = XML.Element("image", version="0.0.3", w=str(width), h=str(height), name=name)
    stack = XML.SubElement(root, "stack")
    with zipfile.ZipFile(file,"w") as z:
        # OpenRaster readers expect the first uncompressed entry to be the mimetype.
        def write(path, data, compressed=True):
            member=zipfile.ZipInfo(path,(2026,11,19,0,0,0))
            member.compress_type=zipfile.ZIP_DEFLATED if compressed else zipfile.ZIP_STORED
            z.writestr(member,data)
        write("mimetype","image/openraster",False)
        for i, (title, im) in enumerate(reversed(layers)):
            path=f"data/layer-{i}.png"
            write(path,png(im))
            XML.SubElement(stack,"layer",name=title,src=path,x="0",y="0",opacity="1.0",visibility="visible",attrib={"composite-op":"svg:src-over"})
        write("stack.xml",XML.tostring(root,encoding="utf-8",xml_declaration=True))
        write("mergedimage.png",png(flatten(layers)))

def flatten(layers):
    im=Image.new("RGBA",layers[0][1].size)
    for _, art in layers:
        im.alpha_composite(art)
    return im

def emit(key, layers, purpose, *, placement, pivot=None, insets=None, slots=None, safe=None, portrait=False, **extra):
    key="sec-"+key
    export=ROOT / "exports" / (key+".png")
    master=ROOT / "masters" / (key+".ora")
    out=flatten(layers)
    out.save(export,optimize=True)
    ora(master,key,layers)
    rec={"id":key,"file":"exports/"+export.name,"size":list(out.size),"master":"masters/"+master.name,
         "purpose":purpose,"placement":placement,"sha256":sha_file(export),"source":["security-original-pixelwork"]}
    if portrait: rec["source"].append("bob-day-one-head")
    if pivot is not None: rec["pivot"]=pivot
    if insets is not None: rec["insets"]=insets
    if safe is not None: rec["safeText"]=safe
    if slots: rec["slots"]=slots
    rec.update(extra)
    assets.append(rec)

def read_portrait():
    with zipfile.ZipFile(CAL/ARCHIVE) as z:
        layers=[]
        hashes={}
        for name in (HEAD_ENTRY,LIGHT_ENTRY,EYE_ENTRY):
            data=z.read(name)
            im=Image.open(io.BytesIO(data)).convert("RGBA").crop(HEAD_BOX)
            layers.append((name,im))
            hashes[name]=digest(data)
        # Both overlays were painted for the full assembled body. Mask them to the
        # approved head/torso pixels so neighboring limb highlights cannot enter.
        p=layers[0][1].copy()
        for _, illumination in layers[1:]:
            clipped=Image.new("RGBA",p.size)
            clipped.paste(illumination,(0,0),layers[0][1].getchannel('A'))
            p.alpha_composite(clipped)
        return p,hashes

def issue_id(portrait):
    size=(40,56)
    plate,d=layer(size)
    bevel(d,1,1,38,54,3,INK);bevel(d,2,1,36,52,2,PAPER_SH);bevel(d,3,2,34,49,2,STOCK)
    d.line((5,3,32,3),fill=LIGHT);d.line((3,7,3,45),fill=LIGHT)
    # Punched and reinforced lanyard slot. It is an actual alpha cutout.
    d.rectangle((14,4,24,7),fill=PAPER_SH);d.line((15,7,24,7),fill=LIGHT)
    d.rectangle((15,5,23,6),fill=(0,0,0,0))
    d.rectangle((4,9,35,11),fill=DEEP)
    label,dd=layer(size)
    dd.rectangle((6,13,32,34),fill=OXIDE);dd.rectangle((7,14,31,33),fill=RAIL)
    # Printed cyan half-tone surrounds the dossier photograph.
    for y in range(15,33,3):
        for x in range(8+(y%2),31,3): dd.point((x,y),fill=EDGE)
    dd.line((5,36,33,36),fill=PAPER_SH);dd.rectangle((4,47,35,50),fill=IRON)
    for x in (6,8,9,13,15,18,19,24,27,29,30,33):
        dd.line((x,47,x,49),fill=GLEAM)
    photo,_=layer(size);photo.alpha_composite(portrait.resize((25,21),NEAREST),(7,13))
    trim,tt=layer(size)
    tt.line((6,14,6,33),fill=BRASS);tt.line((7,34,32,34),fill=LIGHT)
    tt.rectangle((31,27,35,32),fill=PAPER);tt.rectangle((32,28,34,31),fill=TEAL)
    tt.point((33,28),fill=CYAN);tt.line((4,42,4,46),fill=PAPER_SH)
    emit("id-bob",[("Laminated stock and lanyard cut",plate),("Printed mount and code strip",label),("bob, registered SE head crop",photo),("Worn foil and corners",trim)],
         "Inspectable original credential belonging to bob",placement="Player-visible credential close-up, only when public custody/inspection permits.",pivot=[20,49],safe=[6,37,28,9],slots={"holder":[6,37,28,9]},portrait=True,scale="Integer 2x or larger for live holder text.")
    size=(15,19)
    plate,d=layer(size);bevel(d,0,0,15,19,1,INK);bevel(d,1,1,13,16,1,STOCK)
    d.line((1,4,13,4),fill=RAIL);d.line((5,2,9,2),fill=SEAM)
    d.rectangle((3,5,11,13),fill=RAIL);d.line((2,16,12,16),fill=IRON)
    photo,_=layer(size);photo.alpha_composite(portrait.resize((9,8),NEAREST),(3,5))
    seam,dd=layer(size);dd.line((1,18,13,18),fill=PAPER_SH);dd.line((3,14,9,14),fill=TEAL)
    emit("id-bob-world",[("Laminate",plate),("bob, registered SE head crop",photo),("Code and bevel",seam)],
         "Desk/hand original credential",placement="Hand or desk socket when the original is publicly visible. A hidden stowed item has no world sprite.",pivot=[7,17],portrait=True)

def ticket_body(d,w,h,expired,small):
    margin=1
    if small: cut=1; ticketcolor=STOCK
    else: cut=3; ticketcolor=STOCK
    right=w-(4 if expired and small else 10 if expired else 1)
    bevel(d,0,2,right+1,h-3,cut,OXIDE)
    bevel(d,1,1,right-1,h-4,cut,ticketcolor)
    if not small:
        d.line((4,2,right-5,2),fill=LIGHT)
        d.line((2,7,2,h-8),fill=PAPER)
    if expired:
        # Perforation has been torn: expired silhouette is shorter and jagged.
        for i,y in enumerate(range(3,h-3,3)):
            d.rectangle((right-(1+i%2),y,right,y+1),fill=(0,0,0,0))
    else:
        # Stub has semicircular cutter bites top and bottom.
        x=right-(5 if small else 12);r=1 if small else 3
        d.ellipse((x-r,0,x+r,2+r),fill=(0,0,0,0))
        d.ellipse((x-r,h-4-r,x+r,h-2),fill=(0,0,0,0))

def pass_art(expired):
    state="expired" if expired else "issued"
    size=(64,40)
    stock,d=layer(size);ticket_body(d,*size,expired,False)
    ink,dd=layer(size);dd.rectangle((4,6,14,32),fill=IRON if expired else TEAL)
    dd.line((4,6,14,6),fill=EDGE if expired else ENAMEL)
    # Split chevron of the shift, pressed into the left stripe.
    dd.line([(6,14),(10,18),(6,22)],fill=STOCK,width=2)
    dd.line([(8,13),(12,17)],fill=AMBER if not expired else PAPER)
    dd.line((6,27,12,27),fill=GLEAM);dd.line((6,29,10,29),fill=GLEAM)
    dd.line((16,12,48,12),fill=PAPER);dd.line((16,23,48,23),fill=PAPER)
    dd.line((4,35,48,35),fill=PAPER_SH)
    control,cc=layer(size)
    if not expired:
        for y in range(8,33,4):cc.line((51,y,51,y+1),fill=PAPER_SH)
        cc.rectangle((54,8,59,31),fill=BRASS)
        for y in (9,13,14,17,21,24,25,30):cc.line((55,y,58,y),fill=LIGHT)
        cc.line((54,6,58,6),fill=OXIDE)
    else:
        cc.line((4,8,14,28),fill=PAPER_SH,width=2);cc.line((14,8,4,28),fill=LIGHT,width=2)
    slots={"holder":[17,4,31,8],"issuer":[17,14,31,8],"validThrough":[17,25,31,8]}
    emit("pass-"+state,[("Cut stock, stub, tear profile",stock),("Printed shift stripe and rules",ink),("Stub / cancellation overprint",control)],
         ("Expired shift permission after bell" if expired else "Confirmed shift-only permission, valid to bell"),placement="Inspection insert. Live case data owns the holder, issuer and date. Render a readable external label when showing a compact card.",pivot=[31,34],safe=[17,4,31,29],slots=slots,scale="At least 2x in an inspection insert; 3x for full-length issuer names.")
    size=(21,13)
    paper,d=layer(size);ticket_body(d,*size,expired,True)
    stripe,ss=layer(size);ss.rectangle((2,3,5,8),fill=IRON if expired else TEAL)
    ss.line((7,4,13,4),fill=PAPER_SH)
    if expired: ss.line((2,3,5,8),fill=LIGHT);ss.line((5,3,2,8),fill=LIGHT)
    else:
        ss.line((15,4,15,8),fill=PAPER_SH);ss.line((17,4,17,8),fill=BRASS)
        ss.point((3,5),fill=LIGHT)
    emit("pass-"+state+"-world",[("Perforated paper",paper),("Stripe and tear status",stripe)],"Room-scale daily pass "+state,placement="Dedicated permission/desk insert or temporary pass socket. A permission record cannot move the original credential.",pivot=[10,10])

def signal(action):
    size=(24,24)
    housing,d=layer(size);bevel(d,2,3,20,20,3,INK);bevel(d,2,2,19,19,2,RAIL);bevel(d,4,4,15,15,1,DEEP)
    d.line((5,2,17,2),fill=EDGE);d.line((3,6,3,16),fill=EDGE)
    d.rectangle((9,20,14,22),fill=IRON);d.line((9,20,14,20),fill=RAIL)
    icon,i=layer(size)
    if action:
        # Raised amber mechanical flag: pointer + thick vertical staff.
        i.rectangle((7,6,8,15),fill=STOCK);polygon(i,[(9,5),(15,5),(17,7),(14,10),(9,10)],AMBER)
        i.line((9,5,15,5),fill=LIGHT);i.line((6,16,11,16),fill=ENAMEL)
    else:
        # Closed report card with folded corner, low-luminance white on blue.
        polygon(i,[(7,5),(12,5),(16,9),(16,16),(7,16)],GLEAM)
        i.line((12,6,12,9,15,9),fill=TEAL);i.line((9,11,13,11),fill=RAIL);i.line((9,13,12,13),fill=RAIL)
    emit("signal-"+("action" if action else "report"),[("Desk annunciator housing",housing),("Raised flag" if action else "Filed paper",icon)],
         "Desk case available for action" if action else "Read-only desk report",placement="Anchor to local desk; composite above fixture/actors and below speech, with at least 44 x 44 CSS px semantic hit area. No automatic opening.",pivot=[12,23])

def custody(held):
    size=(64,48)
    housing,d=layer(size);bevel(d,1,1,62,46,3,INK);bevel(d,2,1,60,44,3,RAIL);bevel(d,4,3,56,39,2,IRON)
    d.line((5,3,57,3),fill=EDGE);d.rectangle((8,8,54,36),fill=SEAM)
    d.rectangle((10,10,53,34),fill=DEEP);d.line((11,10,51,10),fill=TEAL)
    d.rectangle((8,38,54,41),fill=SEAM)
    for x in (8,52):screw(d,x,4)
    symbol,ss=layer(size)
    # A steel-held personnel slip. Detention/release is an administrative status
    # insert; no physical jail coordinates are implied by its artwork.
    polygon(ss,[(16,13),(35,13),(40,18),(40,31),(16,31)],PAPER_SH)
    polygon(ss,[(17,13),(34,13),(39,18),(39,29),(17,29)],STOCK)
    ss.line((34,14,34,18,38,18),fill=PAPER_SH)
    ss.rectangle((20,17,24,22),fill=TEAL);ss.line((27,19,32,19),fill=OXIDE)
    ss.line((20,25,33,25),fill=PAPER_SH)
    mechan,mm=layer(size)
    if held:
        # Crossbolt serves as a mechanical obstruction even with hue removed.
        mm.rectangle((9,21,53,26),fill=INK);mm.rectangle((10,21,52,24),fill=EDGE)
        mm.line((11,21,51,21),fill=GLEAM);mm.rectangle((41,18,48,28),fill=BRASS)
        mm.rectangle((43,20,46,24),fill=OXIDE);mm.line((44,22,45,22),fill=AMBER)
        mm.rectangle((12,39,23,39),fill=AMBER)
    else:
        mm.rectangle((47,21,54,26),fill=INK);mm.rectangle((47,21,53,24),fill=EDGE)
        mm.line((43,18,47,22,43,26),fill=CYAN,width=2)
        mm.line((34,28,43,28),fill=ENAMEL)
        mm.rectangle((43,39,51,39),fill=CYAN)
    emit("custody-"+("held" if held else "released"),[("Stamped report bezel",housing),("Personnel slip",symbol),("Crossbolt position",mechan)],"Security custody held" if held else "Release registered at the shift boundary",placement="UI insert inside an attributed Security report, alongside live worker/shift text; no scenery or movement anchor.",pivot=[32,44])

def panel(status):
    size=(144,88)
    metal,d=layer(size);bevel(d,0,0,144,88,4,INK);bevel(d,1,0,142,85,3,RAIL);bevel(d,3,2,138,81,2,IRON)
    d.line((6,1,136,1),fill=EDGE);d.line((1,8,1,76),fill=EDGE)
    d.line((6,84,138,84),fill=SEAM);d.line((139,5,139,78),fill=SEAM)
    face,f=layer(size);f.rectangle((6,4,137,81),fill="#233537")
    f.rectangle((6,4,137,21),fill="#254345");f.line((7,4,135,4),fill=RAIL)
    f.line((6,21,137,21),fill=SEAM);f.line((6,22,137,22),fill="#445450")
    f.line((6,80,137,80),fill=SEAM)
    # Small upper-left state instrument projects into the header, away from copy.
    bezel,b=layer(size);bevel(b,5,4,19,16,2,SEAM);bevel(b,6,5,17,14,1,RAIL)
    b.rectangle((8,7,20,16),fill=DEEP)
    # Static registration details stay within nine-slice end caps.
    b.line((137,25,137,30),fill=RAIL);b.line((137,32,137,33),fill=RAIL)
    b.line((8,82,20,82),fill=EDGE);b.point((6,82),fill=BRASS)
    glyph,g=layer(size)
    if status=="active":
        g.rectangle((10,8,11,15),fill=LIGHT);polygon(g,[(12,8),(17,8),(19,10),(16,12),(12,12)],AMBER)
    elif status=="committed":
        g.line([(9,12),(12,15),(19,8)],fill=CYAN,width=2);g.point((18,8),fill=LIGHT)
    elif status=="expired":
        g.line((10,8,18,8),fill=GLEAM);g.line((10,15,18,15),fill=GLEAM)
        g.line((11,9,16,14),fill=AMBER);g.line((17,9,12,14),fill=AMBER)
    else:
        g.rectangle((10,9,18,14),outline=EDGE);g.rectangle((12,11,16,12),fill=GLEAM)
    slots={"stateHeader":[27,6,106,13],"content":[10,26,124,52]}
    emit("panel-"+status,[("Die-cast chassis",metal),("Inset enamel and text field",face),("Status lens and fittings",bezel),("State glyph",glyph)],
         "Contextual room intervention / "+status,placement="Overlay at lower edge of selected room, beneath frontmost semantic text/controls. Use live issuer/room/action labels, no world pausing.",insets=[24,23,8,8],safe=[10,26,124,52],slots=slots,
         stretch="Stretch center and edges independently with nearest sampling. Header safe area uses 27px left, 11px right. Body uses 10px left/right, 26px top, 10px bottom. Glyph and bevel retain their native dimensions.")
def focus():
    size=(24,24)
    shadow,d=layer(size);hi,h=layer(size)
    for x,y,sx,sy in ((1,1,1,1),(22,1,-1,1),(1,22,1,-1),(22,22,-1,-1)):
        d.line((x,y,x+sx*7,y),fill=INK,width=3);d.line((x,y,x,y+sy*7),fill=INK,width=3)
        h.line((x,y,x+sx*6,y),fill=LIGHT,width=2);h.line((x,y,x,y+sy*6),fill=LIGHT,width=2)
        h.point((x+sx,y+sy),fill=AMBER)
    emit("focus-ring",[("Dark keyline",shadow),("Raised corner brackets",hi)],"Keyboard, switch or controller focus",placement="Final overlay around the interactive target; keep the center transparent.",insets=[9,9,9,9],safe=[9,9,6,6],stretch="Nine-slice at target bounds. Never stretch the corner brackets.")

def nine(im, target, insets):
    """Scale edge spans and center while preserving all four native corners."""
    w,h=im.size;dw,dh=target
    left,top,right,bottom=insets
    xx=[0,left,w-right,w]; yy=[0,top,h-bottom,h]
    X=[0,left,dw-right,dw];Y=[0,top,dh-bottom,dh]
    out=Image.new("RGBA",target)
    for j in range(3):
        for i in range(3):
            src=im.crop((xx[i],yy[j],xx[i+1],yy[j+1]))
            dst=(X[i+1]-X[i],Y[j+1]-Y[j])
            if min(dst)>0:
                out.alpha_composite(src.resize(dst,NEAREST),(X[i],Y[j]))
    return out

def make_proofs():
    reg="/usr/share/fonts/liberation-sans-fonts/LiberationSans-Regular.ttf"
    bold="/usr/share/fonts/liberation-sans-fonts/LiberationSans-Bold.ttf"
    def font(n,strong=False): return ImageFont.truetype(bold if strong else reg,n)
    def img(key):return Image.open(ROOT/"exports"/("sec-"+key+".png")).convert("RGBA")
    example=Image.new("RGBA",(320,150),INK)
    example.alpha_composite(nine(img("panel-active"),(312,146),[24,23,8,8]),(4,2))
    d=ImageDraw.Draw(example)
    d.text((33,6),"SECURITY",font=font(13,True),fill=LIGHT)
    d.text((17,32),"LIMEN",font=font(13,True),fill=AMBER)
    d.text((17,53),"bob has no ID. The line is held.",font=font(16),fill=LIGHT)
    # Native console focus is shown on a real 44 CSS-pixel-high target.
    d.rectangle((16,85,175,128),fill=TEAL,outline=ENAMEL)
    d.rectangle((185,85,300,128),fill=IRON,outline=RAIL)
    d.text((96,107),"Issue daily pass",font=font(15,True),anchor="mm",fill=LIGHT)
    d.text((242,107),"Keep watching",font=font(14),anchor="mm",fill=LIGHT)
    example.alpha_composite(nine(img("focus-ring"),(164,48),[9,9,9,9]),(14,83))
    example.save(ROOT/"proofs"/"panel-320.png",optimize=True)
    records=json.loads((ROOT/"proofs"/"pass-records.json").read_text())
    passes=Image.new("RGBA",(320,348),INK)
    pen=ImageDraw.Draw(passes)
    for index, key in enumerate(("issued","expired")):
        record=records[key]["pass"]
        yy=6+index*172
        passes.alpha_composite(nine(img("panel-"+("committed" if record["valid"] else "expired")),(312,162),[24,23,8,8]),(4,yy))
        pen.text((34,yy+5),"DAILY PASS   /   "+("ISSUED" if record["valid"] else "EXPIRED"),font=font(13,True),fill=LIGHT)
        scale=3
        card=img("pass-"+key)
        cx,cy=108,yy+29
        passes.alpha_composite(card.resize((card.width*scale,card.height*scale),NEAREST),(cx,cy))
        labels=("Holder","Issuer","Valid through" if record["valid"] else "Expired at")
        values=(record["holder"],record["issuer"],f'Day {record["day"]} bell')
        art=next(a for a in assets if a["id"]=="sec-pass-"+key)
        for (name,slot),label,value in zip(art["slots"].items(),labels,values):
            x,y,ww,hh=slot
            left=cx+x*scale; top=cy+y*scale
            pen.text((16,top+hh*scale//2),label,font=font(13),fill=STOCK,anchor="lm")
            anchor=(left+2,top+hh*scale//2)
            f=font(15 if name=="holder" else 14,name=="holder")
            rect=pen.textbbox(anchor,value,font=f,anchor="lm")
            assert rect[0]>=left and rect[2]<=left+ww*scale and rect[1]>=top and rect[3]<=top+hh*scale,(key,name,rect,slot)
            pen.text(anchor,value,font=f,fill=INK,anchor="lm")
    passes.save(ROOT/"proofs"/"pass-records-320.png",optimize=True)
    sheet=Image.new("RGB",(936,552),"#142024")
    d=ImageDraw.Draw(sheet)
    d.text((20,16),"SECURITY   /   NATIVE PARTS",font=font(17,True),fill=LIGHT)
    d.text((20,39),"Source-scale inspection study • labels appear only in the proof",font=font(14),fill=GLEAM)
    def show(key,xx,yy,mul,caption):
        a=img(key); b=a.resize((a.width*mul,a.height*mul),NEAREST)
        sheet.paste(b,(xx,yy),b);d.text((xx,yy+b.height+5),caption,font=font(13),fill=STOCK)
    show("id-bob",20,77,2,"bob’s original")
    show("pass-issued",139,77,2,"shift pass / live")
    show("pass-expired",295,77,2,"shift pass / expired")
    show("custody-held",495,77,2,"custody record / held")
    show("custody-released",674,77,2,"custody record / released")
    show("signal-action",20,246,2,"open case")
    show("signal-report",139,246,2,"report")
    show("id-bob-world",308,245,2,"original")
    show("pass-issued-world",404,245,2,"issued")
    show("pass-expired-world",498,245,2,"expired")
    show("focus-ring",678,245,2,"focus overlay")
    sheet.paste(example.convert("RGB"),(20,365))
    d.text((20,522),"320 CSS px / keyboard focus on issue",font=font(13),fill=STOCK)
    for j,state in enumerate(("active","committed","expired","spent")):
        xx=378+(j%2)*240; yy=357+(j//2)*89
        a=nine(img("panel-"+state),(215,65),[24,23,8,8]);sheet.paste(a,(xx,yy),a)
        d.text((xx+29,yy+5),state.upper(),font=font(12,True),fill=LIGHT)
    sheet.save(ROOT/"proofs"/"security-contact-sheet.png",optimize=True)

def main():
    for dirname in ("exports","masters","proofs"):
        (ROOT/dirname).mkdir(exist_ok=True)
    portrait,head_hashes=read_portrait()
    issue_id(portrait)
    for expired in (False,True):pass_art(expired)
    for state in (True,False):signal(state);custody(state)
    for state in ("active","committed","expired","spent"):panel(state)
    focus()
    notes={
        "version":"1.0.0","family":"security","idPrefix":"sec-","units":"native integer pixels; rectangles [x,y,w,h], origin top-left. Pivot denotes anchor relative to source canvas.",
        "palette":"B / Raking light. Cool oxidised enamel and brushed steel; upper-left light, matte paper, restrained brass and high-contrast ivory status shapes. Screen-space pieces are prelit.",
        "origins":{
            "security-original-pixelwork":{"creator":"Loopforge Days 2–4 Security art lane, 2026-11-19","method":"Original per-pixel authored raster and layer geometry. No external stock or font pixels in exports.","rights":"Original commissioned project art supplied to the owner for Loopforge."},
            "bob-day-one-head":{"creator":"Loopforge Day One calibration / bob r2","rights":"Owner-supplied Loopforge art from merged PR #155, reused according to the Day One handoff.","commit":"08c8db11","archive":ARCHIVE,"sha256":sha_file(CAL/ARCHIVE),"layers":head_hashes,"sourceCrop":list(HEAD_BOX),"cropConvention":"left,top,right exclusive,bottom exclusive","transform":"Neutral SE head/torso with Security light and emission clipped to body alpha, nearest-neighbour crop. No max pixels reused."}
        },
        "assets":assets,"documentation":"README.md","proofs":["proofs/panel-320.png","proofs/security-contact-sheet.png","proofs/pass-records-320.png","proofs/pass-records.json"],
    }
    (ROOT/"manifest.json").write_text(json.dumps(notes,ensure_ascii=False,indent=2)+"\n")
    make_proofs()
    # Check all native exports against independently read OpenRaster layer stacks.
    for a in assets:
        with zipfile.ZipFile(ROOT/a["master"]) as z:
            pngs=XML.fromstring(z.read("stack.xml")).find("stack").findall("layer")
            assert len(pngs)>=2
            layers=[(l.attrib["name"],Image.open(io.BytesIO(z.read(l.attrib["src"]))).convert("RGBA")) for l in reversed(pngs)]
            export=Image.open(ROOT/a["file"]).convert("RGBA")
            assert flatten(layers).tobytes()==export.tobytes()
            assert list(export.size)==a["size"]
            assert export.getchannel("A").getextrema()==(0,255)
            for px,py,width,height in a.get("slots",{}).values():
                assert px>=0 and py>=0 and px+width<=export.width and py+height<=export.height
    print(f"Validated {len(assets)} layered masters, exports and text slots.")

if __name__=="__main__":
    main()
