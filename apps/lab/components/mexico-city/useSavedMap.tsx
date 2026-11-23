"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, House } from "lucide-react";
import { useLocale } from "@/lib/mexico-city/locale";
import {
  savedApi,
  savedMarker,
  type SavedItem,
  type SavedKind,
  type SavedList,
} from "@/lib/mexico-city/saved-city";
import type { MapBounds } from "./FieldMap";
export default function useSavedMap(enabled: boolean) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [bounds, setBounds] = useState<MapBounds>({
    west: -99.4,
    east: -98.9,
    south: 19.2,
    north: 19.7,
  });
  const [items, setItems] = useState<SavedItem[]>([]),
    [collections, setCollections] = useState<SavedList["collections"]>([]),
    [collection, setCollection] = useState("");
  const [types, setTypes] = useState<SavedKind[]>(["activity", "rent", "buy"]),
    [refresh, setRefresh] = useState(0),
    [error, setError] = useState(false),
    [truncated, setTruncated] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    savedApi<SavedList>("?limit=1")
      .then((s) => {
        if (active) setCollections(s.collections);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [enabled, refresh]);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const query = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(bounds).map(([k, v]) => [k, String(v)]),
      ),
      ...(collection ? { collection } : {}),
    });
    fetch(`/api/mexico-city/saved/map?${query}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: { items: SavedItem[]; truncated: boolean }) => {
        if (!controller.signal.aborted) {
          setItems(data.items);
          setTruncated(data.truncated);
          setError(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setItems([]);
          setError(true);
        }
      });
    return () => controller.abort();
  }, [enabled, bounds, collection, refresh]);
  useEffect(() => {
    if (!enabled) return;
    const onFocus = () => {
      if (!document.hidden) setRefresh((n) => n + 1);
    };
    const id = window.setInterval(onFocus, 30000);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [enabled]);
  const markers = useMemo(
    () =>
      enabled
        ? items
            .filter((i) => types.includes(i.kind))
            .map((i) => savedMarker(i, locale))
            .filter((i) => i !== null)
        : [],
    [items, types, locale, enabled],
  );
  const changed = useCallback(() => setRefresh((n) => n + 1), []);
  const layers = enabled ? (
    <div className="city-saved-layers">
      <strong>{say("Mis lugares guardados", "My saved places")}</strong>
      {(
        [
          ["activity", "Actividades", "Activities", CalendarDays],
          ["rent", "Vivienda · renta", "Housing · rent", House],
          ["buy", "Vivienda · compra", "Housing · buy", House],
        ] as const
      ).map(([kind, es, en, Icon]) => (
        <button
          key={kind}
          aria-pressed={types.includes(kind)}
          onClick={() =>
            setTypes((s) =>
              s.includes(kind) ? s.filter((k) => k !== kind) : [...s, kind],
            )
          }
        >
          <Icon size={18} />
          <span>{say(es, en)}</span>
          {types.includes(kind) && <Check size={16} />}
        </button>
      ))}
      <label>
        {say("Colección", "Collection")}
        <select
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
        >
          <option value="">
            {say("Mías y compartidas", "Mine and shared")}
          </option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      {truncated && (
        <small>
          {say(
            "Acerca el mapa para ver más lugares.",
            "Zoom in to see more saved places.",
          )}
        </small>
      )}
      {error && (
        <button onClick={changed}>
          {say("Reintentar cargar lugares", "Retry loading saved places")}
        </button>
      )}
    </div>
  ) : undefined;
  return { markers, layers, setBounds, collections, changed };
}
