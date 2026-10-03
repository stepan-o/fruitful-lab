"""Compile two figure studies from Racknitz's public-domain 1789 plate III.

Usage: python scripts/profile-engraving.py /path/to/Racknitz_-_The_Turk_3.jpg
Requires Pillow only. This is an offline authoring step, not part of the web build.
Source: https://commons.wikimedia.org/wiki/File:Racknitz_-_The_Turk_3.jpg
The output contains only vector geometry; it includes no bitmap or image URL.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps, ImageFilter
import hashlib
import json
import sys

source = Path(sys.argv[1])
image = Image.open(source).convert('RGB').resize((1000, 911), Image.Resampling.LANCZOS)
# Silhouettes selected on the source plate; preserve the actual working posture.
studies = {
 'operator': {'box': (495, 493, 676, 754), 'outline': [(605,499),(635,498),(650,508),(658,523),(658,540),(664,553),(669,561),(661,578),(650,586),(647,607),(643,643),(640,675),(647,697),(646,713),(635,725),(612,732),(573,741),(548,749),(530,748),(516,750),(501,750),(498,744),(504,737),(517,730),(533,726),(554,715),(566,706),(574,685),(554,682),(542,671),(535,654),(530,636),(532,616),(538,598),(540,586),(540,578),(548,569),(556,565),(565,569),(570,579),(566,591),(566,602),(578,614),(584,599),(591,584),(605,568),(593,562),(586,556),(589,549),(584,546),(589,537),(590,527),(593,514)]},
 'automaton': {'box': (198, 92, 668, 447), 'outline': [(414,416),(368,415),(377,388),(386,366),(392,341),(383,322),(365,332),(348,338),(330,340),(318,348),(303,350),(284,361),(266,368),(249,374),(241,385),(231,399),(221,405),(213,407),(206,417),(204,402),(207,381),(214,367),(226,356),(237,349),(249,343),(273,330),(293,320),(307,309),(317,300),(334,293),(348,273),(361,255),(386,238),(414,226),(436,219),(432,207),(419,204),(411,194),(406,179),(407,161),(413,150),(416,140),(416,112),(450,102),(470,98),(487,109),(490,132),(508,144),(516,167),(514,190),(504,202),(505,217),(530,224),(550,242),(571,269),(596,292),(624,302),(645,314),(653,337),(658,361),(658,381),(653,400),(653,418),(647,434),(643,441),(638,436),(638,421),(634,437),(629,440),(628,426),(623,438),(618,438),(620,418),(620,405),(626,393),(626,380),(620,363),(614,350),(608,344),(598,342),(587,335),(570,326),(553,316),(546,327),(554,353),(565,387),(576,415)]}
}
result = {'source': 'Racknitz, 1789, plate III; Humboldt University Library / Wikimedia Commons', 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'studies': {}}
for name, cfg in studies.items():
    x0,y0,x1,y1=cfg['box']; width,height=x1-x0,y1-y0
    crop=image.crop(cfg['box'])
    mask=Image.new('L',(width,height)); points=[(x-x0,y-y0) for x,y in cfg['outline']]
    ImageDraw.Draw(mask).polygon(points, fill=255)
    gray=ImageOps.autocontrast(crop.convert('L'), cutoff=1).filter(ImageFilter.GaussianBlur(.25))
    # Continuous scan-line engraving. Two densities recover paper, midtone and ink;
    # runs are batched into two paths instead of creating a node for each stroke.
    layers=[]
    for threshold, step in [(188,1),(92,1)]:
        runs=[]
        for y in range(0,height,step):
            start=None
            for x in range(width+1):
                dark=x<width and mask.getpixel((x,y))>0 and gray.getpixel((x,y))<threshold
                if dark and start is None: start=x
                if not dark and start is not None:
                    if x-start>0: runs.append(f'M{start} {y}h{x-start}')
                    start=None
        layers.append(''.join(runs))
    outline='M'+' '.join(f'{x},{y}' for x,y in points)+'Z'
    result['studies'][name]={'width':width,'height':height,'outline':outline,'mid':layers[0],'ink':layers[1]}
out=Path(__file__).resolve().parents[1]/'lib/production-systems/figure-studies.json'
out.write_text(json.dumps(result,separators=(',',':'))+'\n')
print(f'{out.name}: {out.stat().st_size} bytes, source sha256 {result["sha256"]}')
