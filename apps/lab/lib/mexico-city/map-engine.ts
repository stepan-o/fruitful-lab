export type Coordinate = { lat: number; lng: number };
export type Camera = Coordinate & { zoom: number };
const X_SCALE = 1900 * Math.cos((19.3 * Math.PI) / 180);
export const DEFAULT_CAMERA: Camera = { lat: 19.431, lng: -99.151, zoom: 13 };
export function project(p: Coordinate): [number, number] {
  return [(p.lng + 99.38) * X_SCALE, (19.62 - p.lat) * 1900];
}
export function unproject(p: readonly number[]): Coordinate {
  return { lng: p[0] / X_SCALE - 99.38, lat: 19.62 - p[1] / 1900 };
}
export function pathCoordinates(path: string): Coordinate[][] {
  return path
    .split("M")
    .filter(Boolean)
    .map((part) =>
      [...part.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((match) =>
        unproject([Number(match[1]), Number(match[2])]),
      ),
    );
}
export function directions(
  p: Coordinate,
  travelmode: "walking" | "transit" = "walking",
) {
  return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", destination: `${p.lat},${p.lng}`, travelmode })}`;
}
let googlePromise: Promise<void> | null = null;
export function loadGoogleMap(key: string): Promise<void> {
  if (
    typeof window.google !== "undefined" &&
    typeof window.google.maps?.importLibrary === "function"
  )
    return Promise.resolve();
  if (googlePromise) return googlePromise;
  googlePromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const w = window as Window & {
      cdmxGoogleReady?: () => void;
      gm_authFailure?: () => void;
    };
    const timer = window.setTimeout(
      () => reject(new Error("map_timeout")),
      15000,
    );
    w.cdmxGoogleReady = () => {
      clearTimeout(timer);
      resolve();
    };
    w.gm_authFailure = () => {
      clearTimeout(timer);
      window.dispatchEvent(new Event("cdmx-map-auth-failed"));
      reject(new Error("map_auth"));
    };
    script.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({ key, v: "weekly", loading: "async", callback: "cdmxGoogleReady", language: "es", region: "MX" })}`;
    script.async = true;
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error("map_load"));
    };
    document.head.append(script);
  });
  return googlePromise;
}

export function containsPoint(point: Coordinate, ring: Coordinate[]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (
      a.lat > point.lat !== b.lat > point.lat &&
      point.lng <
        ((b.lng - a.lng) * (point.lat - a.lat)) / (b.lat - a.lat) + a.lng
    )
      inside = !inside;
  }
  return inside;
}
