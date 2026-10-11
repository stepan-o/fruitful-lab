"""Build the offline illustrated map from the retained public geographic sources."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/sources/mexico-city"


def project(point):
    return [(point[0] + 99.38) * 1900 * math.cos(math.radians(19.3)), (19.62 - point[1]) * 1900]


def simplify(points, epsilon=0.32):
    if len(points) < 3:
        return points
    a, b = points[0], points[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    squared = dx * dx + dy * dy

    def distance(point):
        t = max(0, min(1, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / squared)) if squared else 0
        return math.hypot(point[0] - a[0] - t * dx, point[1] - a[1] - t * dy)

    distances = [distance(point) for point in points]
    index = max(range(len(distances)), key=distances.__getitem__)
    return simplify(points[:index + 1], epsilon)[:-1] + simplify(points[index:], epsilon) if distances[index] > epsilon else [a, b]


def bounds(points):
    return [min(p[0] for p in points), min(p[1] for p in points), max(p[0] for p in points), max(p[1] for p in points)]


def path(points):
    return "M" + "L".join(f"{point[0]:.2f},{point[1]:.2f}" for point in points)


boroughs, all_points = [], []
for feature in json.loads((SOURCE / "alcaldias.geojson").read_text())["features"]:
    rings = [[project(p) for p in ring] for ring in feature["geometry"]["coordinates"]]
    points = [point for ring in rings for point in ring]
    all_points += points
    extent = bounds(points)
    boroughs.append({
        "id": feature["properties"]["cvegeo"], "name": feature["properties"]["nomgeo"],
        "path": "".join(path(simplify(ring)) + "Z" for ring in rings), "bounds": extent,
        "center": [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
    })
roads = []
for way in json.loads((SOURCE / "streets.json").read_text())["elements"]:
    points = [project([p["lon"], p["lat"]]) for p in way.get("geometry", [])]
    if len(points) > 1:
        roads.append(path(points))
output = {"boroughs": boroughs, "bounds": bounds(all_points), "roads": "".join(roads)}
(ROOT / "lib/mexico-city/geography.json").write_text(json.dumps(output, separators=(",", ":")) + "\n")
print(f"Built {len(boroughs)} boroughs and {len(roads)} road ways.")
