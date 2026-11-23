"""Draw the native floor skin as independently editable OpenRaster layers."""
from io import BytesIO
from pathlib import Path
from hashlib import sha256
import json
import xml.etree.ElementTree as ET
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED, ZIP_STORED
from PIL import Image, ImageDraw, ImageOps

HERE = Path(__file__).resolve().parent
INK = "#12292B"
DEEP = "#193335"
STEEL = "#32494A"
METAL = "#61736A"
EDGE = "#ABB09A"
PATINA = "#85C7BB"
GLASS = "#152B2D"
IVORY = "#F4E8CD"
BONE = "#D9C9A9"
PAPER = "#EFE2C6"
AMBER = "#FFBE5E"
OXIDE = "#715941"
BRONZE = "#AB7850"

class Plate:
    def __init__(self, width, height):
        self.size = width, height
        self.layers = []
    def draw(self, label):
        bitmap = Image.new("RGBA", self.size)
        self.layers.append((label, bitmap))
        return ImageDraw.Draw(bitmap)
    def merge(self):
        out = Image.new("RGBA", self.size)
        for _, bitmap in self.layers:
            out.alpha_composite(bitmap)
        return out

def png(image):
    stream = BytesIO()
    image.save(stream, format="PNG", optimize=True)
    return stream.getvalue()

def member(archive, name, value, compressed=True):
    info = ZipInfo(name, (2026, 11, 19, 0, 0, 0))
    info.compress_type = ZIP_DEFLATED if compressed else ZIP_STORED
    archive.writestr(info, value)

def bevel(draw, box, top, face, lower):
    x, y, right, bottom = box
    draw.polygon([(x+2,y), (right-1,y), (right,y+1), (right,bottom-1),
                  (right-1,bottom), (x+1,bottom), (x,bottom-1), (x,y+2)], fill=face)
    draw.line([(x,y+2),(x+2,y),(right-1,y)], fill=top)
    draw.line([(right,y+1),(right,bottom-1),(right-1,bottom),(x+1,bottom)], fill=lower)

def rivet(draw, x, y, bright=EDGE):
    draw.point((x, y), fill=bright)
    draw.point((x+1, y+1), fill=INK)

def gate(state):
    plate = Plate(36,38)
    d = plate.draw("01 Cast base and hinge socket")
    d.polygon([(8,32),(13,29),(22,29),(29,33),(29,35),(25,37),(8,37),(6,35)], fill=INK)
    d.polygon([(8,32),(14,30),(21,30),(27,33),(24,35),(9,35)], fill=STEEL)
    d.line([(9,32),(15,30),(21,30)], fill=METAL)
    d.rectangle((15,22,21,33), fill=INK)
    d.rectangle((16,22,19,32), fill=METAL)
    d.line((16,25,16,32), fill=EDGE)
    d.line((11,34,14,34), fill=METAL)
    d=plate.draw("02 Enamel semaphore case and cut-metal visor")
    bevel(d,(2,2,33,25),INK,INK,INK)
    bevel(d,(3,3,32,23),EDGE,STEEL,DEEP)
    d.polygon([(5,3),(30,3),(32,5),(29,7),(5,7),(3,6)],fill=METAL)
    d.line((6,3,28,3),fill=EDGE)
    d.rectangle((6,8,29,20),fill=GLASS)
    d.line((6,21,29,21),fill=METAL)
    d.line((30,9,30,19),fill=INK)
    d.line((4,8,4,18),fill="#52645F")
    rivet(d,4,21); rivet(d,30,21)
    d=plate.draw("03 Mechanical vane and state mark")
    if state=="check":
        # A little inspection lens, with a visibly hollow aperture and a solid angled handle.
        d.polygon([(12,8),(18,8),(21,11),(21,15),(18,18),(12,18),(9,15),(9,11)],fill=IVORY)
        d.polygon([(13,10),(17,10),(19,12),(19,14),(17,16),(13,16),(11,14),(11,12)],fill=GLASS)
        d.line([(20,16),(24,19)],fill=IVORY,width=3)
        d.line([(12,10),(13,9),(17,9)],fill=PATINA)
    if state=="held":
        # Closed mechanical shutter. A dark lock stripe cuts the horizontal vane.
        d.polygon([(7,12),(27,12),(29,14),(27,17),(8,17),(6,15)],fill=BRONZE)
        d.rectangle((8,12,27,15),fill=AMBER)
        for x in (12,20):
            d.line((x,12,x-2,15),fill=OXIDE,width=2)
        d.line((8,12,11,12),fill=IVORY)
        d.rectangle((16,9,19,11),fill=EDGE)
        d.rectangle((16,18,19,19),fill=METAL)
    if state=="released":
        # Shutter swings clear. An upturned arm exposes the aperture beneath.
        d.polygon([(10,17),(21,8),(25,8),(25,10),(13,20),(10,20)],fill=PATINA)
        d.line([(11,16),(21,8),(24,8)],fill=IVORY)
        d.rectangle((9,17,12,19),fill=METAL)
        d.point((10,17),fill=IVORY)
        d.line((18,19,27,19),fill=METAL)
    return plate

def handoff(state):
    plate=Plate(34,37)
    d=plate.draw("01 Press mounting foot and cable")
    d.line([(5,27),(5,31),(9,35),(13,35)],fill=INK,width=2)
    d.line([(6,29),(6,31),(9,34)],fill=METAL)
    d.rectangle((13,21,19,34),fill=INK)
    d.rectangle((14,23,17,33),fill=OXIDE)
    bevel(d,(8,32,25,35),METAL,STEEL,INK)
    d=plate.draw("02 Riveted hot-side signal housing")
    bevel(d,(1,2,32,27),INK,INK,INK)
    bevel(d,(2,3,31,25),EDGE,OXIDE,"#382E26")
    d.polygon([(4,4),(28,4),(30,6),(28,8),(3,8)],fill=BRONZE)
    d.line((6,4,23,4),fill=BONE)
    bevel(d,(5,8,28,22),"#403D36",GLASS,METAL)
    for x in (3,29): rivet(d,x,23)
    for x in (11,14,17,20): d.point((x,24),fill=INK)
    d=plate.draw("03 Mechanical signal face")
    if state=="ready":
        # A single empty receiving cup and suspended solid material.
        d.rectangle((9,14,10,18),fill=BONE)
        d.rectangle((24,14,25,18),fill=BONE)
        d.rectangle((10,18,24,20),fill=EDGE)
        d.rectangle((15,10,19,14),fill=IVORY)
        d.point((15,10),fill=PATINA)
    if state=="clear":
        d.polygon([(7,15),(10,12),(15,16),(23,9),(26,11),(15,21)],fill=PATINA)
        d.line([(8,15),(10,13),(15,17),(23,10)],fill=IVORY)
    if state=="rushed":
        for x in (8,17):
            d.polygon([(x,10),(x+4,10),(x+10,15),(x+4,20),(x,20),(x+6,15)],fill=AMBER)
            d.line([(x+1,10),(x+4,10),(x+9,15)],fill=IVORY)
    return plate

def coverage(staffed):
    plate=Plate(24,21)
    d=plate.draw("01 Base clip and steel bezel")
    d.polygon([(2,5),(5,2),(18,2),(22,5),(22,17),(17,19),(7,19),(2,17)],fill=INK)
    d.polygon([(3,5),(6,3),(18,3),(21,5),(21,16),(17,17),(6,17),(3,16)],fill=STEEL)
    d.line([(3,5),(6,3),(16,3)],fill=EDGE)
    d.rectangle((6,5,18,15), fill=GLASS)
    d.line((7,16,17,16),fill=METAL)
    d=plate.draw("02 Mechanical occupancy tag")
    if staffed:
        # Badge silhouette with a punched hole; resembles the tag on the dark board.
        d.polygon([(9,7),(11,5),(14,5),(16,7),(16,14),(9,14)],fill=PATINA)
        d.line((10,7,11,6),fill=IVORY)
        d.point((12,7),fill=GLASS)
        d.line((10,13,15,13),fill=IVORY)
    else:
        # The tag is gone. Two bright empty bracket arms expose a dark central space.
        d.line([(10,6),(8,6),(8,13),(10,13)],fill=IVORY,width=2)
        d.line([(15,6),(17,6),(17,13),(15,13)],fill=IVORY,width=2)
        d.line((11,10,14,10),fill=AMBER)
    return plate

def rack(front):
    plate=Plate(34,22)
    if front:
        d=plate.draw("01 Front rail silhouette")
        d.polygon([(0,14),(3,14),(4,15),(29,15),(30,14),(33,14),(33,18),(30,20),(3,20),(0,18)],fill=INK)
        d=plate.draw("02 Roller guard and return")
        d.polygon([(1,14),(3,11),(5,11),(4,16)],fill=METAL)
        d.polygon([(28,16),(28,12),(30,11),(32,13),(32,16)],fill=METAL)
        d.line((3,15,29,15),fill=BONE)
        d.rectangle((3,16,29,18),fill=OXIDE)
        d.line((4,18,26,18),fill=METAL)
        for x in (3,29):
            d.line((x,15,x,19),fill=STEEL);rivet(d,x,16)
        return plate
    d=plate.draw("01 Feet and rear rack body")
    d.polygon([(2,13),(31,13),(32,17),(27,19),(26,21),(23,21),(23,18),(9,18),(8,21),(5,21),(4,18),(2,17)],fill=INK)
    d.polygon([(1,7),(6,2),(28,2),(32,6),(33,14),(29,17),(3,17),(0,14)],fill=INK)
    d.polygon([(2,7),(7,3),(27,3),(31,6),(31,13),(28,15),(3,15)],fill=STEEL)
    d=plate.draw("02 Socket bed, rollers and rear backstop")
    d.polygon([(4,8),(8,5),(26,5),(29,7),(27,14),(4,14)],fill="#372F27")
    for x in (6,11,16,21,26):
        d.line([(x+2,6),(x,12)],fill=METAL,width=2)
        d.line([(x+1,7),(x,10)],fill=EDGE)
    d.line([(1,7),(6,2),(27,2)],fill=EDGE)
    d.line((7,4,26,4),fill=OXIDE)
    d.line((1,9,1,13),fill=METAL)
    d.line((31,8,31,12),fill=BRONZE)
    return plate

def cortex():
    plate=Plate(27,23)
    d=plate.draw("01 Shadow under cortex and press collar")
    d.polygon([(5,17),(9,15),(18,15),(23,17),(23,20),(18,22),(8,21),(4,19)],fill=INK)
    d.polygon([(5,17),(10,16),(21,16),(22,18),(17,20),(9,20),(5,19)],fill=METAL)
    d.line((8,18,13,19),fill=EDGE)
    d=plate.draw("02 Compact pressed hemispheres")
    d.polygon([(2,13),(3,8),(6,5),(9,4),(12,2),(16,2),(18,3),(22,4),(24,7),(25,10),(24,15),(21,17),(15,19),(9,18),(6,17),(3,16)],fill="#513D37")
    d.polygon([(3,12),(4,8),(8,5),(11,5),(13,3),(16,3),(18,5),(21,5),(23,7),(24,10),(22,14),(19,16),(15,17),(10,16),(7,16),(4,14)],fill="#B88466")
    d.polygon([(4,11),(5,8),(9,6),(11,6),(13,4),(16,4),(16,6),(14,7),(14,11),(12,13),(7,14),(5,13)],fill="#DEAC82")
    d.polygon([(18,5),(21,6),(22,8),(24,9),(22,12),(18,14),(15,14),(15,10)],fill="#CE9978")
    d=plate.draw("03 Fold shadows and upper raking glints")
    d.line([(12,5),(13,6),(12,9),(13,10),(12,13),(14,15)],fill="#764D40")
    d.line([(6,9),(8,8),(10,9),(9,11),(6,12)],fill="#8B5C49")
    d.line([(16,8),(18,7),(20,8),(19,10),(17,11)],fill="#8B5C49")
    d.line([(15,14),(18,15),(20,13),(22,12)],fill="#865440")
    d.line([(5,8),(8,6),(10,6)],fill="#F3CF9E")
    d.line([(13,4),(15,4)],fill="#F3CF9E")
    d.line([(16,9),(17,8)],fill="#E8B68B")
    d.line([(7,13),(9,12)],fill="#E8B68B")
    return plate

def bubble(cut):
    plate=Plate(60,40)
    d=plate.draw("01 Offset ink edge")
    d.polygon([(0,4),(4,0),(54,0),(58,4),(58,5),(59,6),(59,34),(55,39),(5,39),(1,35),(0,34)],fill=INK)
    d=plate.draw("02 Fiber face")
    d.polygon([(2,5),(5,2),(53,2),(56,5),(56,33),(53,36),(5,36),(2,33)],fill=PAPER)
    d.line([(2,6),(2,5),(5,2),(51,2)],fill=IVORY)
    d.line([(5,36),(53,36),(56,33)],fill=BONE)
    d=plate.draw("03 Stamped seam and state")
    d.line((2,9,2,13),fill="#C6B79B")
    d.point((4,4),fill=IVORY)
    if cut:
        # Two slash perforations at the lower-right corner: visible after any nine-slice.
        edge=[(49,0),(49,4),(52,3),(52,6),(55,5),(55,8),(58,7)]
        d.line(edge,fill=INK,width=2)
        bite=[(49,0),(59,0),(59,7),(56,7),(56,4),(53,5),(53,2),(50,3),(50,0)]
        for _,bitmap in plate.layers:
            ImageDraw.Draw(bitmap).polygon(bite,fill=(0,0,0,0))
        d.line((49,35,52,32),fill="#49372D",width=2)
        d.line((52,36,55,33),fill="#49372D",width=2)
    else:
        d.line((53,35,55,33),fill="#BFAD8E")
    return plate

def nameplate():
    plate=Plate(34,16)
    d=plate.draw("01 Pin and enamel body")
    d.polygon([(0,3),(3,0),(31,0),(33,2),(33,12),(30,15),(3,15),(0,12)],fill=INK)
    d=plate.draw("02 Lacquer face and top highlight")
    d.polygon([(1,3),(3,1),(30,1),(32,3),(32,12),(29,14),(3,14),(1,12)],fill=DEEP)
    d.line([(2,3),(4,1),(29,1)],fill=METAL)
    d.line((2,6,2,10),fill=PATINA)
    return plate

def tail(right):
    plate=Plate(12,12)
    d=plate.draw("01 Ink outline of pointing fold")
    d.polygon([(0,0),(11,0),(7,6),(3,10),(0,11),(1,5)],fill=INK)
    d=plate.draw("02 Paper continuation")
    d.polygon([(2,0),(9,0),(6,4),(2,8)],fill=PAPER)
    if right:
        plate.layers=[(label, ImageOps.mirror(im)) for label,im in plate.layers]
    return plate

def save_plate(identifier, plate, purpose, unit, registration, extra=None):
    stem="fl-"+identifier
    export="exports/"+stem+".png"
    master="masters/"+stem+".ora"
    merged=png(plate.merge())
    (HERE/export).write_bytes(merged)
    root=ET.Element("image", w=str(plate.size[0]), h=str(plate.size[1]), name=stem, version="0.0.3")
    stack=ET.SubElement(root,"stack")
    with ZipFile(HERE/master,"w") as archive:
        member(archive,"mimetype",b"image/openraster",False)
        for i,(label,bitmap) in enumerate(reversed(plate.layers)):
            name="data/layer%02d.png"%i
            ET.SubElement(stack,"layer", name=label, src=name, x="0",y="0",
                          opacity="1.0",visibility="visible",**{"composite-op":"svg:src-over"})
            member(archive,name,png(bitmap))
        member(archive,"stack.xml",ET.tostring(root,encoding="utf-8",xml_declaration=True))
        member(archive,"mergedimage.png",merged)
        member(archive,"Thumbnails/thumbnail.png",merged)
    record = {"id":stem,"file":export,"size":list(plate.size),**registration,"space":unit,
              "master":master,"source":"Original pixel linework in draw.py; Day One B room material references.",
              "purpose":purpose,"sha256":sha256(merged).hexdigest()}
    if extra:
        record.update(extra)
    return record

def build():
    (HERE/"masters").mkdir(exist_ok=True)
    (HERE/"exports").mkdir(exist_ok=True)
    records=[]
    for key,meaning in (
        ("check","A hollow inspection lens indicates the desk is checking the called worker."),
        ("held","The shutter crosses the aperture while Security holds the workers behind bob."),
        ("released","The semaphore arm lifts following the confirmed release or next check.")):
        records.append(save_plate("gate-"+key,gate(key),meaning,"world",{"pivot":[18,36]},
                                  {"anchor":"gate.hinge","role":"passive indicator on the existing boom housing"}))
    for key,meaning in (
        ("ready","Receiving cup and suspended piece indicate a staffed stage can accept a handoff."),
        ("clear","A broad check vane marks the supervisor's delivered all-clear for this handoff."),
        ("rushed","Twin feed arrows mark an active rushed handoff.")):
        records.append(save_plate("handoff-"+key,handoff(key),meaning,"world",{"pivot":[17,35]},
                                  {"anchor":"station control face","role":"state of an actual handoff at this station"}))
    for key,staffed,meaning in (
        ("staffed",True,"A hung occupancy tag means an operator has physically reached this control."),
        ("vacant",False,"Empty clips and a dash mark an uncovered operator post.")):
        records.append(save_plate("post-"+key,coverage(staffed),meaning,"world",{"pivot":[12,20]},
                                  {"anchor":"operator post side of station control face"}))
    rack_origin={"anchor":"ENGINE-projected output slot at carrier height","depthGroup":"rack","nativeSlotPitchPx":35.2}
    for key,face,drawingOrder in (("cradle",False,0),("lip",True,2)):
        records.append(save_plate("rack-"+key,rack(face),
                                  "Socket rollers and rear bed." if not face else "Separate foreground roller guard.",
                                  "world",{"pivot":[17,13]},dict(**rack_origin,drawOrder=drawingOrder)))
    records.append(save_plate("cortex-finished",cortex(),"Finished cortex and press collar at their contact socket.",
                              "world",{"pivot":[13,22]},dict(**rack_origin,drawOrder=1)))
    for key,cut in (("bubble",False),("bubble-interrupted",True)):
        records.append(save_plate(key,bubble(cut),
                                  "Interrupted utterance with torn corner and cutoff hatching." if cut else "Live addressed speech, parchment face.",
                                  "screen",{"insets":[8,7,11,7],"safeText":[8,7,41,26]},
                                  {"padding":[8,7,11,7],"bodyInk":"#17282A","nameplate":"fl-bubble-nameplate","scaling":"nine-slice-nearest"}))
    records.append(save_plate("bubble-nameplate",nameplate(),"Highlighted field behind the live speaker name.",
                              "screen",{"insets":[5,3,5,3],"safeText":[5,3,24,10]},
                              {"textInk":"#F4E8CD","scaling":"nine-slice-nearest"}))
    for key,right in (("left", False), ("right",True)):
        records.append(save_plate("tail-"+key,tail(right),"Pointed paper tail linking the bubble to its speaker.",
                                  "screen",{"pivot":[11 if right else 0,11]},
                                  {"panelSeam":[4 if right else 7,0],"scaling":"fixed pixel size"}))
    manifest={
        "version":"loopforge.days-2-4.floor-art/1","palette":"Day One B / Raking light",
        "sourceRights":"Original commissioned Loopforge floor art. Room materials reference owner-provided calibration; no external stock or fonts.",
        "geometry":"approved-factory/day-one-3","worldPixelsPerMetre":64,
        "sourceInputs":["PR 155 / 08c8db11 / 01-style-B.zip / floor-palette-roles-r02.json",
            "PR 155 / 08c8db11 / 03-fourth-id-check.zip / exports/fixtures/sec-boom-states.png",
            "docs/loopforge/production/sprite-briefs/briefs.json#mach-output,prop-brain-cortex",
            "apps/lab/lib/loopforge/spatial/approved-factory.json"],
        "nativeAxes":"x east, world y south. Floor Y flattens during projection. Upright sprites scale uniformly after projecting their anchor.",
        "worldAnchors":{"gateHingeM":[124.9,134],"operatorPostsM":{"intake":[119.7,144.4],"wash":[123.7,144.4],
            "belt":[127.7,144.4],"forge":[131.7,144.4]},"outputSlotsM":[[135.05,147],[135.60,147],[136.15,147]],
            "outputPlaneM":0.72,
            "placement":"Read slot positions from the running view. Project each occupied or empty socket; composite rear, item, lip at the same projected point."},
        "screenRules":"See README.md for nine-slice, concurrent speech, cutoff and observer visibility.",
        "assets":records}
    (HERE/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")

if __name__=="__main__":
    build()
