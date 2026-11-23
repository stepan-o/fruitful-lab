"""Rebuild named map layers from retained SGIRPC and OSM sources; no network."""
import json
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/sources/mexico-city'
helpers = runpy.run_path(str(Path(__file__).with_name('mexico-city-map.py')))
project, path, simplify = [helpers[key] for key in ('project', 'path', 'simplify')]
load = lambda name: json.loads((SOURCE / name).read_text())
styles = {s['value']: '#' + ''.join(f'{c:02x}' for c in s['symbol']['color'][:3]) for s in load('metro-style.json')}
lines = []
for f in load('metro-lines.geojson')['features']:
    p = f['properties']
    coordinates = f['geometry']['coordinates']
    parts = [coordinates] if f['geometry']['type'] == 'LineString' else coordinates
    line = p['linea'].lstrip('0')
    lines.append({'id': line, 'route': p['ruta'], 'color': styles[line], 'path': ''.join(path(simplify([project(c) for c in part], 0.06)) for part in parts)})
stations = []
for f in load('metro-stations.geojson')['features']:
    p = f['properties']
    stations.append({'id': p['cve_est'], 'name': p['nombre'], 'line': p['linea'].lstrip('0'), 'point': [round(v, 3) for v in project(f['geometry']['coordinates'])]})
areas = []
for f in load('neighborhoods.geojson')['features']:
    p = f['properties']
    rings = f['geometry']['coordinates']
    if f['geometry']['type'] == 'MultiPolygon':
        rings = [ring for polygon in rings for ring in polygon]
    if not rings: continue
    ring = max(rings, key=len)
    pts = [project(c) for c in ring]
    # Polygon centroid anchors a caption; the polygons remain geographic context.
    cross = [a[0]*b[1]-b[0]*a[1] for a,b in zip(pts,pts[1:])]
    area = sum(cross)
    center = [sum((a[i]+b[i])*c for a,b,c in zip(pts,pts[1:],cross))/(3*area) for i in (0,1)] if area else pts[0]
    areas.append({'id': p['cve_col'].strip(), 'name': p['nombre'].title(), 'point': [round(v,3) for v in center], 'path': ''.join(path(simplify([project(c) for c in r], 0.12))+'Z' for r in rings)})
names = {
    'Avenida Paseo de la Reforma': 'Paseo de la Reforma',
    'Avenida Insurgentes Centro': 'Insurgentes', 'Avenida Insurgentes Sur': 'Insurgentes',
    'Avenida Juárez': 'Av. Juárez', 'Avenida 20 de Noviembre': '20 de Noviembre',
    'Avenida José María Pino Suárez': 'Pino Suárez', 'Avenida José María Izazaga': 'José María Izazaga',
    'Avenida Chapultepec': 'Av. Chapultepec', 'Avenida de la República': 'Av. de la República',
    'Avenida Bucareli': 'Bucareli', 'Calzada Mahatma Gandhi': 'Calz. Gandhi',
    'Calle Tacuba': 'Tacuba', 'Avenida 5 de Mayo': '5 de Mayo',
}
roads = {}
for way in load('named-streets.json')['elements']:
    name = names.get(way.get('tags', {}).get('name'))
    if not name: continue
    pts = [project([p['lon'],p['lat']]) for p in way.get('geometry',[])]
    if len(pts)<2: continue
    roads.setdefault(name, []).append(pts)
streets = [{'name': name, 'path': ''.join(path(simplify(p,0.05)) for p in parts), 'points': [[round(v,2) for v in p] for part in parts for p in part]} for name,parts in roads.items()]
cable = []
for f in load('cable-lines.geojson')['features']:
    coordinates = f['geometry']['coordinates']
    parts = [coordinates] if f['geometry']['type'] == 'LineString' else coordinates
    cable.append({'id': str(f['properties']['id']), 'line': f['properties']['linea'], 'route': f['properties']['ruta'], 'path': ''.join(path([project(c) for c in part]) for part in parts)})
out = {'sourceDate': '2026-10-10', 'lines': lines, 'stations': stations, 'cable': cable, 'areas': areas, 'streets': streets}
(ROOT/'lib/mexico-city/map-layers.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))+'\n')
print(f'Built {len(lines)} Metro lines, {len(stations)} line-station records, {len(areas)} areas, {len(streets)} named streets.')
