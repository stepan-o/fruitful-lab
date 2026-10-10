/// <reference types="google.maps" />
"use client";
import {
  forwardRef,
  memo,
  useMemo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointer,
} from "react";
import {
  LocateFixed,
  Plus,
  Minus,
  Layers,
  Check,
  Crosshair,
  Map as MapIcon,
  X,
  TrainFront,
  CableCar,
} from "lucide-react";
import geography from "@/lib/mexico-city/geography.json";
import layers from "@/lib/mexico-city/map-layers.json";
import manifest from "@/lib/assets/generated/mexico-city.json";
import { STORIES, storyById } from "@/lib/mexico-city/content";
import { useLocale } from "@/lib/mexico-city/locale";
import {
  DEFAULT_CAMERA,
  loadGoogleMap,
  pathCoordinates,
  project,
  unproject,
  containsPoint,
  type Camera,
  type Coordinate,
} from "@/lib/mexico-city/map-engine";
import type { Discovery } from "@/lib/mexico-city/field-game";

export type MapHandle = {
  focus: (point: Coordinate, zoom?: number) => void;
  center: () => Coordinate;
};
type MapLayers = {
  metro: boolean;
  cable: boolean;
  areas: boolean;
  history: boolean;
};
type Props = {
  records: Discovery[];
  selected?: string;
  select: (id: string, kind: "story" | "record") => void;
  picking: boolean;
  pick: (point: Coordinate) => void;
  painted: boolean;
  compact?: boolean;
};
const art = (id: string) =>
  manifest.assets[id as keyof typeof manifest.assets].variants[0].src;
const Geometry = memo(function Geometry({
  zoom,
  settings,
  colors,
}: {
  zoom: number;
  settings: MapLayers;
  colors: Record<string, string>;
}) {
  return (
    <>
      {geography.boroughs.map((b) => (
        <path
          key={b.id}
          d={b.path}
          className="mc-borough-shape"
          style={colors[b.id] ? { fill: colors[b.id] } : undefined}
        />
      ))}
      <path d={geography.roads} className="mc-reference-road" />
      {settings.areas &&
        zoom > 12 &&
        layers.areas.map((a) => (
          <path key={a.id} d={a.path} className="mc-neighborhood-shape" />
        ))}
      {zoom > 12 &&
        layers.streets.map((s) => (
          <path key={s.name} d={s.path} className="mc-major-street" />
        ))}
      {settings.metro &&
        layers.lines.map((l) => (
          <path
            key={l.id}
            d={l.path}
            fill="none"
            stroke={l.color}
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      {settings.cable &&
        layers.cable.map((l, i) => (
          <path
            key={i}
            d={l.path}
            fill="none"
            stroke="#53aaba"
            strokeDasharray="4 4"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
    </>
  );
});

const FieldMap = forwardRef<MapHandle, Props>(function FieldMap(
  { records, selected, select, picking, pick, painted, compact = false },
  ref,
) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const container = useRef<HTMLDivElement>(null),
    googleContainer = useRef<HTMLDivElement>(null);
  const googleMap = useRef<google.maps.Map | null>(null);
  const cameraRef = useRef<Camera>({ ...DEFAULT_CAMERA });
  const [camera, setCamera] = useState<Camera>(DEFAULT_CAMERA);
  const [size, setSize] = useState({ width: 600, height: 700 });
  const [provider, setProvider] = useState<
    "reference" | "loading" | "google" | "failed"
  >("reference");
  const neighborhoodsVisible = camera.zoom >= 14;
  const [settings, setSettings] = useState<MapLayers>({
    metro: true,
    cable: false,
    areas: true,
    history: false,
  });
  const [layerMenu, setLayerMenu] = useState(false);
  const [position, setPosition] = useState<
    (Coordinate & { accuracy: number }) | null
  >(null);
  const [locationMessage, setLocationMessage] = useState("");
  const watch = useRef<number | null>(null),
    follow = useRef(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const currentProps = useRef({ select, pick, picking });
  useEffect(() => {
    currentProps.current = { select, pick, picking };
  }, [select, pick, picking]);
  const providerRef = useRef(provider);
  useEffect(() => {
    providerRef.current = provider;
  }, [provider]);
  const visible = useRef(true);
  const colors = useMemo(() => {
    if (!painted) return {};
    const result: Record<string, string> = {};
    for (const b of geography.boroughs) {
      const rings = pathCoordinates(b.path);
      const count = records.filter((r) =>
        rings.some((ring) => containsPoint(r, ring)),
      ).length;
      if (count) result[b.id] = count > 3 ? "#b4cd92" : "#d4dfb8";
    }
    return result;
  }, [painted, records]);
  const scale = Math.pow(2, camera.zoom - 11);
  const center = project(camera),
    tx = size.width / 2 - center[0] * scale,
    ty = size.height / 2 - center[1] * scale;
  function move(next: Camera) {
    const bounded = {
      ...next,
      zoom: Math.max(9, Math.min(19, next.zoom)),
      lat: Math.max(18.6, Math.min(20.1, next.lat)),
      lng: Math.max(-100.1, Math.min(-98.4, next.lng)),
    };
    cameraRef.current = bounded;
    setCamera(bounded);
    if (googleMap.current && providerRef.current === "google")
      googleMap.current.moveCamera({ center: bounded, zoom: bounded.zoom });
  }
  function focusBorough(path: string) {
    const points = pathCoordinates(path).flat().map(project);
    const xs = points.map((p) => p[0]),
      ys = points.map((p) => p[1]);
    const x0 = Math.min(...xs),
      x1 = Math.max(...xs),
      y0 = Math.min(...ys),
      y1 = Math.max(...ys);
    const scale =
      Math.min(size.width / (x1 - x0), size.height / (y1 - y0)) * 0.75;
    follow.current = false;
    move({
      ...unproject([(x0 + x1) / 2, (y0 + y1) / 2]),
      zoom: Math.log2(scale) + 11,
    });
  }
  useImperativeHandle(ref, () => ({
    focus(point, zoom = 15) {
      follow.current = false;
      move({ ...point, zoom });
    },
    center() {
      return { lat: cameraRef.current.lat, lng: cameraRef.current.lng };
    },
  }));
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
    if (!key || !mapId) return;
    let cancelled = false;
    let failedToLoad = false;
    let tilesTimer: ReturnType<typeof setTimeout> | undefined;
    queueMicrotask(() => setProvider("loading"));
    const failed = () => {
      failedToLoad = true;
      clearTimeout(tilesTimer);
      if (!cancelled) setProvider("failed");
    };
    window.addEventListener("cdmx-map-auth-failed", failed);
    loadGoogleMap(key)
      .then(async () => {
        const { Map } = (await google.maps.importLibrary(
          "maps",
        )) as google.maps.MapsLibrary;
        await google.maps.importLibrary("marker");
        if (cancelled || failedToLoad || !googleContainer.current) return;
        const map = new Map(googleContainer.current, {
          center: cameraRef.current,
          zoom: cameraRef.current.zoom,
          mapId,
          renderingType: google.maps.RenderingType.VECTOR,
          tilt: 0,
          heading: 0,
          tiltInteractionEnabled: false,
          headingInteractionEnabled: false,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          keyboardShortcuts: true,
          minZoom: 9,
          maxZoom: 20,
          backgroundColor: "#f5f6ef",
        });
        googleMap.current = map;
        map.addListener("idle", () => {
          const c = map.getCenter();
          if (c) {
            const next = {
              lat: c.lat(),
              lng: c.lng(),
              zoom: map.getZoom() || 13,
            };
            cameraRef.current = next;
            setCamera(next);
          }
        });
        map.addListener("dragstart", () => {
          follow.current = false;
        });
        // A loaded SDK does not mean the key/map is authorized. Wait for a
        // rendered basemap before creating game overlays or Advanced Markers.
        const ready = () => {
          if (cancelled || failedToLoad) return;
          clearTimeout(tilesTimer);
          setProvider("google");
        };
        google.maps.event.addListenerOnce(map, "tilesloaded", ready);
        tilesTimer = setTimeout(failed, 20_000);
      })
      .catch(failed);
    return () => {
      cancelled = true;
      clearTimeout(tilesTimer);
      window.removeEventListener("cdmx-map-auth-failed", failed);
      if (googleMap.current)
        google.maps.event.clearInstanceListeners(googleMap.current);
      googleMap.current = null;
    };
  }, []);
  useEffect(() => {
    const map = googleMap.current;
    if (provider !== "google" || !map) return;
    const objects: (
      google.maps.Polygon | google.maps.Polyline | google.maps.Circle
    )[] = [];
    for (const b of geography.boroughs) {
      const polygon = new google.maps.Polygon({
        map,
        paths: pathCoordinates(b.path),
        strokeColor: "#8da393",
        strokeOpacity: 0.4,
        strokeWeight: 1,
        fillColor: colors[b.id] || "#c5d5ad",
        fillOpacity: colors[b.id] ? 0.28 : 0.035,
        clickable: false,
      });
      objects.push(polygon);
    }
    if (settings.metro)
      for (const l of layers.lines)
        for (const path of pathCoordinates(l.path))
          objects.push(
            new google.maps.Polyline({
              map,
              path,
              strokeColor: l.color,
              strokeWeight: 3,
              strokeOpacity: 0.85,
              clickable: false,
            }),
          );
    if (settings.cable)
      for (const l of layers.cable)
        for (const path of pathCoordinates(l.path))
          objects.push(
            new google.maps.Polyline({
              map,
              path,
              strokeColor: "#339fae",
              strokeWeight: 3,
              clickable: false,
            }),
          );
    if (settings.areas && neighborhoodsVisible)
      for (const a of layers.areas)
        objects.push(
          new google.maps.Polygon({
            map,
            paths: pathCoordinates(a.path),
            strokeColor: "#a4b49b",
            strokeOpacity: 0.25,
            strokeWeight: 1,
            fillOpacity: 0,
            clickable: false,
          }),
        );
    if (position)
      objects.push(
        new google.maps.Circle({
          map,
          center: position,
          radius: Math.min(position.accuracy, 500),
          fillColor: "#4c88b1",
          fillOpacity: 0.12,
          strokeColor: "#4c88b1",
          strokeWeight: 1,
          clickable: false,
        }),
        new google.maps.Circle({
          map,
          center: position,
          radius: 7,
          fillColor: "#397aaf",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
          clickable: false,
        }),
      );
    return () => objects.forEach((o) => o.setMap(null));
  }, [
    provider,
    settings.metro,
    settings.cable,
    settings.areas,
    colors,
    position,
    neighborhoodsVisible,
  ]);
  useEffect(() => {
    const map = googleMap.current;
    if (provider !== "google" || !map) return;
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    const add = (
      id: string,
      point: Coordinate,
      title: string,
      image: string,
      kind: "story" | "record",
    ) => {
      const content = document.createElement("button");
      content.type = "button";
      content.className = `mc-map-pin ${selected === id ? "is-selected" : ""} ${kind === "record" ? "is-photo" : ""}`;
      content.setAttribute("aria-label", title);
      const img = document.createElement("img");
      img.src = image;
      img.alt = "";
      img.draggable = false;
      content.appendChild(img);
      const caption = document.createElement("span");
      caption.textContent = title;
      content.appendChild(caption);
      content.addEventListener("click", () => {
        if (!currentProps.current.picking)
          currentProps.current.select(id, kind);
      });
      markers.push(
        new google.maps.marker.AdvancedMarkerElement({
          map,
          position: point,
          content,
          title,
          zIndex: selected === id ? 20 : kind === "record" ? 5 : 2,
          collisionBehavior:
            google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
        }),
      );
    };
    STORIES.forEach((s) =>
      add(
        s.id,
        { lng: s.coordinate[0], lat: s.coordinate[1] },
        storyById(s.id, locale).place,
        art(s.id),
        "story",
      ),
    );
    records
      .slice(-150)
      .forEach((r) => add(r.id, r, r.title, r.photo, "record"));
    return () =>
      markers.forEach((m) => {
        m.map = null;
      });
  }, [provider, records, locale, selected]);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      if (providerRef.current === "google") return;
      if ((event.target as Element).closest("button, input, .mc-layer-panel"))
        return;
      event.preventDefault();
      follow.current = false;
      const previous = cameraRef.current;
      const zoom = Math.max(
        9,
        Math.min(19, previous.zoom - event.deltaY * 0.002),
      );
      const rect = element.getBoundingClientRect(),
        dx = event.clientX - rect.left - rect.width / 2,
        dy = event.clientY - rect.top - rect.height / 2;
      const p = project(previous),
        oldScale = 2 ** (previous.zoom - 11),
        newScale = 2 ** (zoom - 11);
      const coordinate = unproject([
        p[0] + dx / oldScale - dx / newScale,
        p[1] + dy / oldScale - dy / newScale,
      ]);
      cameraRef.current = { ...coordinate, zoom };
      setCamera(cameraRef.current);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, []);
  useEffect(() => {
    const visibility = () => {
      visible.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      if (watch.current !== null)
        navigator.geolocation?.clearWatch(watch.current);
    };
  }, []);
  function locate() {
    if (!navigator.geolocation) {
      setLocationMessage(
        say(
          "La ubicación no está disponible. Puedes colocar el pin a mano.",
          "Location is unavailable. You can place the pin manually.",
        ),
      );
      return;
    }
    setLocationMessage(say("Buscando tu ubicación…", "Finding your location…"));
    follow.current = true;
    if (watch.current !== null) navigator.geolocation.clearWatch(watch.current);
    watch.current = navigator.geolocation.watchPosition(
      (result) => {
        if (!visible.current) return;
        const point = {
          lat: result.coords.latitude,
          lng: result.coords.longitude,
          accuracy: result.coords.accuracy,
        };
        setPosition(point);
        setLocationMessage(
          say(
            `Precisión aproximada: ${Math.round(point.accuracy)} m`,
            `Approximate accuracy: ${Math.round(point.accuracy)} m`,
          ),
        );
        if (
          point.lat < 18.6 ||
          point.lat > 20.1 ||
          point.lng < -100.1 ||
          point.lng > -98.4
        ) {
          setLocationMessage(
            say(
              "Estás fuera del área de CDMX. Puedes explorar el mapa y colocar un pin a mano.",
              "You’re outside the CDMX area. You can explore and place a pin manually.",
            ),
          );
          follow.current = false;
          return;
        }
        if (follow.current) move({ ...point, zoom: 16 });
      },
      () => {
        setLocationMessage(
          say(
            "No pudimos obtener tu ubicación. Mueve el mapa para colocar el pin.",
            "We couldn’t get your location. Move the map to place the pin.",
          ),
        );
        follow.current = false;
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  }
  function pointerDown(event: ReactPointer<HTMLDivElement>) {
    if (
      provider === "google" ||
      (event.target as Element).closest("button, a, input, .mc-layer-panel")
    )
      return;
    follow.current = false;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: ReactPointer<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    const old = [...pointers.current.values()];
    const previous = pointers.current.get(event.pointerId)!;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const updated = [...pointers.current.values()],
      camera = cameraRef.current;
    const p = project(camera),
      oldScale = 2 ** (camera.zoom - 11);
    if (old.length === 1)
      move({
        ...unproject([
          p[0] - (event.clientX - previous.x) / oldScale,
          p[1] - (event.clientY - previous.y) / oldScale,
        ]),
        zoom: camera.zoom,
      });
    else if (old.length === 2) {
      const distance = (v: { x: number; y: number }[]) =>
        Math.hypot(v[0].x - v[1].x, v[0].y - v[1].y);
      const zoom = Math.max(
        9,
        Math.min(
          19,
          camera.zoom +
            Math.log2(
              Math.max(1, distance(updated)) / Math.max(1, distance(old)),
            ),
        ),
      );
      const rect = container.current!.getBoundingClientRect();
      const midpoint = (v: { x: number; y: number }[]) => [
        (v[0].x + v[1].x) / 2 - rect.left - rect.width / 2,
        (v[0].y + v[1].y) / 2 - rect.top - rect.height / 2,
      ];
      const a = midpoint(old),
        b = midpoint(updated),
        nextScale = 2 ** (zoom - 11);
      move({
        ...unproject([
          p[0] + a[0] / oldScale - b[0] / nextScale,
          p[1] + a[1] / oldScale - b[1] / nextScale,
        ]),
        zoom,
      });
    }
  }
  const screenPoint = (p: readonly number[]) => ({
    left: p[0] * scale + tx,
    top: p[1] * scale + ty,
  });
  const inView = (p: readonly number[], padding = 80) => {
    const x = p[0] * scale + tx,
      y = p[1] * scale + ty;
    return (
      x > -padding &&
      x < size.width + padding &&
      y > -padding &&
      y < size.height + padding
    );
  };
  const labelBoxes: { x: number; y: number; width: number; height: number }[] =
    [];
  if (!picking) {
    for (const point of [
      ...STORIES.map((story) =>
        project({ lng: story.coordinate[0], lat: story.coordinate[1] }),
      ),
      ...records.map(project),
    ]) {
      const x = point[0] * scale + tx,
        y = point[1] * scale + ty;
      labelBoxes.push({ x: x - 55, y: y - 100, width: 110, height: 120 });
    }
  }
  // Estimate text bounds before rendering so long names and station captions
  // never stack on each other or cover a photographic/illustrated pin.
  const reserveLabel = (
    point: readonly number[],
    name: string,
    height = 22,
  ) => {
    const x = point[0] * scale + tx,
      y = point[1] * scale + ty;
    const width = name.length * 6 + 18;
    const box = { x: x - width / 2, y: y - height / 2, width, height };
    if (
      box.x < 8 ||
      box.y < 8 ||
      box.x + width > size.width - 8 ||
      box.y + height > size.height - 8
    )
      return false;
    if (
      labelBoxes.some(
        (b) =>
          box.x < b.x + b.width + 6 &&
          box.x + width + 6 > b.x &&
          box.y < b.y + b.height + 6 &&
          box.y + height + 6 > b.y,
      )
    )
      return false;
    labelBoxes.push(box);
    return true;
  };
  const seenAreas = new Set<string>();
  const areaLabels =
    settings.areas && camera.zoom >= 13
      ? layers.areas
          .map((a) => ({
            ...a,
            name: a.name.replace(/\s+(?:I|II|III|IV|V|VI|VII|VIII|IX|X)$/i, ""),
          }))
          .sort((a, b) => a.name.length - b.name.length)
          .filter((a) => {
            if (
              seenAreas.size >= (size.width < 500 ? 5 : 18) ||
              seenAreas.has(a.name) ||
              !reserveLabel(a.point, a.name)
            )
              return false;
            seenAreas.add(a.name);
            return true;
          })
      : [];
  const streetLabels =
    camera.zoom > 14
      ? layers.streets
          .filter(
            (s) =>
              s.points.length &&
              reserveLabel(s.points[Math.floor(s.points.length / 2)], s.name),
          )
          .slice(0, 6)
      : [];
  const seenStations = new Set<string>();
  const stationLabels =
    settings.metro && camera.zoom >= 14
      ? layers.stations
          .filter((s) => {
            if (
              seenStations.has(s.name) ||
              !reserveLabel(s.point, `Ⓜ ${s.name}`)
            )
              return false;
            seenStations.add(s.name);
            return true;
          })
          .slice(0, 30)
      : [];
  return (
    <div
      ref={container}
      className={`mc-field-map ${compact ? "is-compact" : ""} ${picking ? "is-picking" : ""}`}
      tabIndex={0}
      role="region"
      aria-label={say("Mapa interactivo de la ciudad", "Interactive city map")}
      onKeyDown={(e) => {
        if (provider === "google" || e.target !== e.currentTarget) return;
        const offsets: Record<string, [number, number]> = {
          ArrowUp: [0, -60],
          ArrowDown: [0, 60],
          ArrowLeft: [-60, 0],
          ArrowRight: [60, 0],
        };
        const offset = offsets[e.key];
        if (offset) {
          e.preventDefault();
          const p = project(cameraRef.current),
            s = 2 ** (cameraRef.current.zoom - 11);
          move({
            ...unproject([p[0] + offset[0] / s, p[1] + offset[1] / s]),
            zoom: cameraRef.current.zoom,
          });
        }
      }}
      data-map-provider={provider}
      data-map-zoom={camera.zoom.toFixed(1)}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={(e) => pointers.current.delete(e.pointerId)}
      onPointerCancel={(e) => pointers.current.delete(e.pointerId)}
    >
      <div
        ref={googleContainer}
        className="mc-google-canvas"
        hidden={provider === "reference" || provider === "failed"}
      />
      {provider !== "google" && (
        <>
          <svg
            className="mc-reference-canvas"
            width={size.width}
            height={size.height}
            role="img"
            aria-label={say(
              "Mapa geográfico de referencia. Arrastra para explorar.",
              "Geographic reference map. Drag to explore.",
            )}
          >
            <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
              <Geometry
                zoom={Math.floor(camera.zoom)}
                settings={settings}
                colors={colors}
              />
            </g>
          </svg>
          <div className="mc-map-labels">
            {camera.zoom < 13 &&
              geography.boroughs
                .filter((b) => inView(b.center))
                .map((b) => (
                  <button
                    className="mc-borough-label"
                    key={b.id}
                    style={screenPoint(b.center)}
                    onClick={() => focusBorough(b.path)}
                  >
                    {b.name}
                  </button>
                ))}
            {areaLabels.map((a) => (
              <span key={a.id} style={screenPoint(a.point)}>
                {a.name}
              </span>
            ))}
            {streetLabels.map((s) => (
              <span
                className="is-street"
                key={s.name}
                style={screenPoint(s.points[Math.floor(s.points.length / 2)])}
              >
                {s.name}
              </span>
            ))}
            {stationLabels.map((s) => (
              <span
                className="is-station"
                key={s.id}
                style={screenPoint(s.point)}
              >
                Ⓜ {s.name}
              </span>
            ))}
          </div>
          {!picking && (
            <div className="mc-map-markers">
              {STORIES.filter((s) =>
                inView(project({ lng: s.coordinate[0], lat: s.coordinate[1] })),
              ).map((s) => (
                <button
                  key={s.id}
                  className={`mc-map-pin ${selected === s.id ? "is-selected" : ""}`}
                  style={screenPoint(
                    project({ lng: s.coordinate[0], lat: s.coordinate[1] }),
                  )}
                  onClick={() => select(s.id, "story")}
                  aria-label={storyById(s.id, locale).place}
                >
                  <img src={art(s.id)} alt="" draggable={false} />
                  <span>{storyById(s.id, locale).place}</span>
                </button>
              ))}
              {records
                .filter((r) => inView(project(r)))
                .slice(-100)
                .map((r) => (
                  <button
                    key={r.id}
                    className={`mc-map-pin is-photo ${selected === r.id ? "is-selected" : ""}`}
                    style={screenPoint(project(r))}
                    onClick={() => select(r.id, "record")}
                    aria-label={r.title}
                  >
                    <img src={r.photo} alt="" />
                    <span>{r.title}</span>
                  </button>
                ))}
            </div>
          )}
          {position && (
            <span
              className="mc-location-dot"
              style={screenPoint(project(position))}
              aria-label={say("Tu ubicación", "Your location")}
            />
          )}
        </>
      )}
      {settings.history && (
        <div className="mc-map-history">
          <img
            src={art("archive-tenochtitlan")}
            alt={say(
              "Mapa histórico de Tenochtitlan, 1524; imagen de referencia sin georreferenciar",
              "Historical map of Tenochtitlan, 1524; reference image, not georeferenced",
            )}
          />
          <span>
            {say(
              "Tenochtitlan · 1524 · referencia, no alineada al mapa actual",
              "Tenochtitlan · 1524 · reference, not aligned to today’s map",
            )}
          </span>
        </div>
      )}
      <div className="mc-map-tools">
        <button
          onClick={() => setLayerMenu(!layerMenu)}
          aria-expanded={layerMenu}
          aria-label={say("Capas del mapa", "Map layers")}
        >
          <Layers size={20} />
        </button>
        <button onClick={locate} aria-label={say("Ubicarme", "Locate me")}>
          <LocateFixed size={20} />
        </button>
        <button
          onClick={() =>
            move({ ...cameraRef.current, zoom: cameraRef.current.zoom + 1 })
          }
          aria-label={say("Acercar mapa", "Zoom in")}
        >
          <Plus size={20} />
        </button>
        <button
          onClick={() =>
            move({ ...cameraRef.current, zoom: cameraRef.current.zoom - 1 })
          }
          aria-label={say("Alejar mapa", "Zoom out")}
        >
          <Minus size={20} />
        </button>
        <button
          onClick={() => move({ lat: 19.34, lng: -99.13, zoom: 10 })}
          aria-label={say("Ver toda la ciudad", "Show the whole city")}
        >
          <MapIcon size={19} />
        </button>
      </div>
      {layerMenu && (
        <div className="mc-layer-panel">
          <div className="mc-row">
            <strong>{say("Tu mapa, a tu modo", "Your map, your way")}</strong>
            <button
              onClick={() => setLayerMenu(false)}
              aria-label={say("Cerrar capas", "Close layers")}
            >
              <X size={18} />
            </button>
          </div>
          {(
            [
              ["metro", "Metro", "Metro", TrainFront],
              ["cable", "Cablebús", "Cablebús", CableCar],
              ["areas", "Colonias", "Neighborhoods", MapIcon],
              ["history", "Mirada histórica", "Historical view", Layers],
            ] as const
          ).map(([id, es, en, Icon]) => (
            <button
              key={id}
              onClick={() => setSettings({ ...settings, [id]: !settings[id] })}
              aria-pressed={settings[id]}
            >
              <Icon size={18} />
              <span>{say(es, en)}</span>
              {settings[id] && <Check size={16} />}
            </button>
          ))}
          <small>
            {say(
              "Transporte de referencia · 10 oct 2026. Consulta al operador para cambios de servicio.",
              "Reference transit · 10 Oct 2026. Check the operator for service changes.",
            )}
          </small>
        </div>
      )}
      {picking && (
        <>
          <span className="mc-crosshair">
            <Crosshair size={38} />
          </span>
          <div className="mc-pick-confirm">
            <p>
              {say(
                "Mueve el mapa hasta el lugar exacto",
                "Move the map to the exact place",
              )}
            </p>
            <button
              className="mc-primary"
              onClick={() =>
                pick({ lat: cameraRef.current.lat, lng: cameraRef.current.lng })
              }
            >
              <Check size={18} />
              {say("Aquí fue", "It happened here")}
            </button>
          </div>
        </>
      )}
      {locationMessage && (
        <div className="mc-location-notice" role="status">
          {locationMessage}
          <button
            onClick={() => setLocationMessage("")}
            aria-label={say("Cerrar aviso", "Dismiss notice")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="mc-map-credit">
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          {provider === "google"
            ? say("Capas del juego: CDMX / OSM", "Game layers: CDMX / OSM")
            : provider === "loading"
              ? say("Conectando mapa…", "Connecting map…")
              : say(
                  "Mapa de referencia · oct 2026 · CDMX / © OpenStreetMap",
                  "Reference map · Oct 2026 · CDMX / © OpenStreetMap",
                )}
        </a>
      </div>
    </div>
  );
});
export default FieldMap;
