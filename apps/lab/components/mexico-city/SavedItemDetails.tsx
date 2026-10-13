"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Camera,
  ExternalLink,
  MapPin,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useLocale } from "@/lib/mexico-city/locale";
import {
  savedApi,
  distanceKm,
  money,
  monthlyCost,
  SAVED_ERRORS,
  type SavedItem,
  type SavedData,
  type SavedCollection,
} from "@/lib/mexico-city/saved-city";
import { directions } from "@/lib/mexico-city/map-engine";
import type { MapHandle } from "./FieldMap";
const FieldMap = dynamic(() => import("./FieldMap"), { ssr: false });
import { Capture, newDraft, type Draft } from "./FieldTasks";

export default function SavedItemDetails({
  id,
  collections,
  changed,
  close,
  openItem,
}: {
  id: string;
  collections: SavedCollection[];
  changed: () => void;
  close: () => void;
  openItem?: (id: string) => void;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [item, setItem] = useState<SavedItem | null>(null),
    [editing, setEditing] = useState(false),
    [fields, setFields] = useState<SavedData>({});
  const [kind, setKind] = useState("activity"),
    [collection, setCollection] = useState("");
  const [note, setNote] = useState(""),
    [status, setStatus] = useState("saved"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [picking, setPicking] = useState(false),
    [draft, setDraft] = useState<Draft | null>(null),
    [confirmDelete, setConfirmDelete] = useState(false);
  const map = useRef<MapHandle>(null);
  const [nearby, setNearby] = useState<{ item: SavedItem; distance: number }[]>(
    [],
  );
  const [nearbyError, setNearbyError] = useState(false);
  const lat = item?.data.lat,
    lng = item?.data.lng,
    isHome = !!item && item.kind !== "activity";
  useEffect(() => {
    if (!isHome || lat == null || lng == null) return;
    let active = true;
    savedApi<{ items: SavedItem[] }>(
      `/map?south=${lat - 0.046}&north=${lat + 0.046}&west=${lng - 0.05}&east=${lng + 0.05}`,
    )
      .then((result) => {
        if (!active) return;
        setNearby(
          result.items
            .filter(
              (i) =>
                i.kind === "activity" &&
                i.data.lat != null &&
                i.data.lng != null,
            )
            .map((i) => ({
              item: i,
              distance: distanceKm(
                { lat, lng },
                { lat: i.data.lat!, lng: i.data.lng! },
              ),
            }))
            .filter((i) => i.distance <= 5)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5),
        );
        setNearbyError(false);
      })
      .catch(() => {
        if (active) setNearbyError(true);
      });
    return () => {
      active = false;
    };
  }, [id, isHome, lat, lng]);
  useEffect(() => {
    let active = true;
    savedApi<SavedItem>(`/items/${id}`)
      .then((i) => {
        if (active) {
          setItem(i);
          setNote(i.note);
          setStatus(i.status);
          setKind(i.kind);
          setCollection(i.collectionId);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  const pending = ["queued", "running"].includes(item?.job?.state || "");
  useEffect(() => {
    if (!pending || editing || draft) return;
    let active = true;
    const timer = window.setInterval(() => {
      if (!document.hidden)
        savedApi<SavedItem>(`/items/${id}`)
          .then((i) => {
            if (active) setItem(i);
          })
          .catch(() => {});
    }, 3000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [id, pending, editing, draft]);
  const report = (e: unknown) =>
    setError(e instanceof Error ? e.message : "service_unavailable");
  async function act(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      report(e);
    } finally {
      setBusy(false);
    }
  }
  function startEdit() {
    if (!item) return;
    const { evidence, locationSource, ...d } = item.data;
    void evidence;
    void locationSource;
    setFields(d);
    setEditing(true);
  }
  const field = (key: keyof SavedData, value: string, numeric = false) =>
    setFields((s) => ({
      ...s,
      [key]: value === "" ? null : numeric ? Number(value) : value,
    }));
  if (!item)
    return (
      <div className="city-detail">
        <h2>{say("Tu lugar guardado", "Your saved place")}</h2>
        <p role={error ? "alert" : "status"}>
          {error
            ? say(...(SAVED_ERRORS[error] || SAVED_ERRORS.service_unavailable))
            : say("Cargando…", "Loading…")}
        </p>
      </div>
    );
  const data = item.data,
    monthly = monthlyCost(item);
  const label = (key: string) =>
    ({
      title: say("Nombre", "Title"),
      description: say("Descripción", "Description"),
      address: say("Dirección o colonia", "Address or neighborhood"),
      price: say("Precio anunciado", "Advertised price"),
      maintenance: say("Mantenimiento mensual", "Monthly maintenance"),
      deposit: say("Depósito", "Deposit"),
      bedrooms: say("Recámaras", "Bedrooms"),
      bathrooms: say("Baños", "Bathrooms"),
      area: say("Superficie · m²", "Area · m²"),
      furnished: say("Amueblado", "Furnished"),
      availability: say("Disponibilidad anunciada", "Advertised availability"),
      startDate: say("Comienza · fecha y hora", "Starts · date and time"),
      endDate: say("Termina · fecha y hora", "Ends · date and time"),
      schedule: say("Horario", "Schedule"),
      category: say("Categoría", "Category"),
    })[key] || key;
  const kindLabel =
    item.kind === "activity"
      ? say("Actividad", "Activity")
      : item.kind === "rent"
        ? say("En renta", "For rent")
        : say("En venta", "For sale");
  const renderField = (key: keyof SavedData, numeric = false) => (
    <label key={key}>
      {label(key)}
      <input
        type={numeric ? "number" : "text"}
        min={numeric ? 0 : undefined}
        step={numeric ? "any" : undefined}
        value={String(fields[key] ?? "")}
        onChange={(e) => field(key, e.target.value, numeric)}
        maxLength={key === "title" ? 300 : 500}
      />
    </label>
  );
  return (
    <div className="city-detail">
      <span className="city-eyebrow">{kindLabel}</span>
      <h2>{data.title || new URL(item.url).hostname}</h2>
      {data.reviewedAt && (
        <p className="city-source-note">
          {say("Investigación del", "Researched on")} {data.reviewedAt}.
          {data.fetchWarning && (
            <>
              {" "}
              {say(
                "La web no permitió una lectura actual; se muestra la ficha investigada.",
                "The website could not be read now; this is the researched snapshot.",
              )}
            </>
          )}
          {data.locationSource === "openstreetmap" && (
            <>
              {" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
              >
                © OpenStreetMap contributors · ODbL
              </a>
            </>
          )}
        </p>
      )}
      {data.sourceNote && <p className="city-source-note">{data.sourceNote}</p>}
      {error && (
        <p className="city-error" role="alert">
          {say(...(SAVED_ERRORS[error] || SAVED_ERRORS.service_unavailable))}
        </p>
      )}
      {notice && (
        <p className="city-notice" role="status">
          {notice}
        </p>
      )}
      {picking ? (
        <>
          <div className="city-picker">
            <FieldMap
              ref={map}
              records={[]}
              select={() => {}}
              painted={false}
              picking
              pick={(point) => {
                if (draft) setDraft({ ...draft, point });
                else
                  setFields({
                    ...fields,
                    ...point,
                    precision: fields.precision || "exact",
                  });
                setPicking(false);
              }}
              compact
              pickLabel={say("Guardar ubicación", "Save location")}
            />
          </div>
          <button className="city-secondary" onClick={() => setPicking(false)}>
            {say("Volver a la ficha", "Back to details")}
          </button>
        </>
      ) : draft ? (
        <>
          <button className="city-secondary" onClick={() => setDraft(null)}>
            {say("Volver a la ficha", "Back to details")}
          </button>
          <Capture
            draft={draft}
            change={setDraft}
            pick={() => setPicking(true)}
            busy={busy}
            guest={false}
            submit={() =>
              void act(async () => {
                if (!draft.point) return;
                await fetch("/api/mexico-city/command", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    kind: "record",
                    id: draft.id,
                    title: draft.title,
                    category: draft.category,
                    note: draft.note,
                    place: draft.place,
                    lat: draft.point.lat,
                    lng: draft.point.lng,
                    photo: draft.photo,
                    publish: false,
                  }),
                }).then(async (r) => {
                  if (!r.ok)
                    throw new Error(
                      (await r.json()).detail || "service_unavailable",
                    );
                });
                const updated = await savedApi<SavedItem>(
                  `/items/${id}/personal`,
                  "PATCH",
                  { note, status: "visited", recordId: draft.id },
                );
                setItem(updated);
                setStatus("visited");
                setDraft(null);
                setNotice(
                  say(
                    "Visita guardada en tu bitácora · +30 puntos",
                    "Visit saved to your logbook · +30 points",
                  ),
                );
                changed();
              })
            }
          />
        </>
      ) : editing ? (
        <form
          className="city-form"
          onSubmit={(e) => {
            e.preventDefault();
            void act(async () => {
              const allowed = [
                "title",
                "description",
                "address",
                "category",
                "price",
                "currency",
                "pricePeriod",
                "maintenance",
                "deposit",
                "bedrooms",
                "bathrooms",
                "area",
                "areaType",
                "furnished",
                "availability",
                "schedule",
                "startDate",
                "endDate",
                "lat",
                "lng",
                "precision",
              ];
              const delta = Object.fromEntries(
                Object.entries(fields).filter(
                  ([k, v]) =>
                    allowed.includes(k) &&
                    JSON.stringify(v) !==
                      JSON.stringify(data[k as keyof SavedData]),
                ),
              );
              if ("lat" in delta || "lng" in delta) {
                delta.lat = fields.lat ?? null;
                delta.lng = fields.lng ?? null;
                delta.precision =
                  fields.precision === "approximate" ? "approximate" : "exact";
              }
              setItem(
                await savedApi<SavedItem>(`/items/${id}`, "PATCH", {
                  revision: item.revision,
                  fields: delta,
                  kind,
                  collectionId: collection,
                }),
              );
              setEditing(false);
              changed();
              setNotice(say("Cambios guardados.", "Changes saved."));
            });
          }}
        >
          <label>
            {say("Tipo", "Type")}
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="activity">{say("Actividad", "Activity")}</option>
              <option value="rent">{say("Renta", "Rent")}</option>
              <option value="buy">{say("Compra", "Purchase")}</option>
            </select>
          </label>
          {renderField("title")}
          <label>
            {label("description")}
            <textarea
              value={fields.description || ""}
              maxLength={2500}
              rows={4}
              onChange={(e) => field("description", e.target.value)}
            />
          </label>
          {renderField("address")}
          <div className="city-form-row">
            <button
              className="city-secondary"
              type="button"
              onClick={() => {
                setPicking(true);
                setTimeout(() => {
                  if (fields.lat != null && fields.lng != null)
                    map.current?.focus(
                      { lat: fields.lat, lng: fields.lng },
                      16,
                    );
                }, 100);
              }}
            >
              <MapPin size={17} />
              {say("Colocar en el mapa", "Place on map")}
            </button>
            <label>
              {say("Precisión", "Precision")}
              <select
                value={fields.precision === "exact" ? "exact" : "approximate"}
                onChange={(e) =>
                  setFields({
                    ...fields,
                    precision: e.target.value,
                    lat: fields.lat,
                    lng: fields.lng,
                  })
                }
              >
                <option value="exact">
                  {say("Ubicación exacta", "Exact location")}
                </option>
                <option value="approximate">
                  {say("Zona aproximada", "Approximate area")}
                </option>
              </select>
            </label>
          </div>
          {fields.lat != null && (
            <small>
              {fields.lat.toFixed(5)}, {fields.lng?.toFixed(5)}
            </small>
          )}
          <div className="city-form-grid">
            {renderField("price", true)}
            <label>
              {say("Moneda", "Currency")}
              <select
                value={fields.currency || ""}
                onChange={(e) => field("currency", e.target.value)}
              >
                <option value="">{say("Por confirmar", "Unknown")}</option>
                {["MXN", "USD", "CAD", "EUR"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              {say("Periodo del precio", "Price period")}
              <select
                value={fields.pricePeriod || ""}
                onChange={(e) => field("pricePeriod", e.target.value)}
              >
                <option value="">{say("Por confirmar", "Unknown")}</option>
                {[
                  ["month", "Mensual", "Monthly"],
                  ["night", "Por noche", "Per night"],
                  ["week", "Semanal", "Weekly"],
                  ["total", "Total", "Total"],
                ].map(([v, es, en]) => (
                  <option value={v} key={v}>
                    {say(es, en)}
                  </option>
                ))}
              </select>
            </label>
            {kind === "activity" ? (
              <>
                {renderField("startDate")}
                {renderField("endDate")}
                {renderField("schedule")}
                {renderField("category")}
              </>
            ) : (
              <>
                {[
                  "maintenance",
                  "deposit",
                  "bedrooms",
                  "bathrooms",
                  "area",
                ].map((k) => renderField(k as keyof SavedData, true))}
                <label>
                  {say("Tipo de superficie", "Area basis")}
                  <select
                    value={fields.areaType || ""}
                    onChange={(e) => field("areaType", e.target.value)}
                  >
                    <option value="">{say("Por confirmar", "Unknown")}</option>
                    <option value="floor">
                      {say("Construcción", "Floor area")}
                    </option>
                    <option value="land">{say("Terreno", "Land area")}</option>
                  </select>
                </label>
                {renderField("furnished")}
              </>
            )}
            {renderField("availability")}
          </div>
          <label>
            {say("Colección", "Collection")}
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            >
              {collections
                .filter((c) => c.canAdd || c.id === item.collectionId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.groupId ? say(" · compartida", " · shared") : ""}
                  </option>
                ))}
            </select>
          </label>
          <div className="city-form-row">
            <button disabled={busy} className="city-primary">
              {say("Guardar cambios", "Save changes")}
            </button>
            <button
              type="button"
              className="city-secondary"
              onClick={() => setEditing(false)}
            >
              {say("Cancelar", "Cancel")}
            </button>
          </div>
        </form>
      ) : (
        <>
          {item.hasImage && (
            <figure className="city-item-photo">
              <img
                src={`/api/mexico-city/saved/items/${id}/image`}
                alt={data.title || ""}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.hidden = true;
                }}
              />
              <figcaption>
                {say(
                  "Imagen de la página de origen",
                  "Image from the source page",
                )}{" "}
                · {new URL(item.url).hostname}
              </figcaption>
            </figure>
          )}
          <div className="city-detail-price">
            {money(data, locale)}
            {data.pricePeriod && (
              <small>
                {" "}
                /{" "}
                {
                  {
                    month: say("mes", "month"),
                    night: say("noche", "night"),
                    week: say("semana", "week"),
                    total: say("total", "total"),
                  }[data.pricePeriod]
                }
              </small>
            )}
          </div>
          {data.description && (
            <p className="city-description">{data.description}</p>
          )}
          <p className="city-address">
            <MapPin size={18} />
            {data.address || say("Dirección por confirmar", "Address unknown")}
          </p>
          {data.lat == null ? (
            <p className="city-muted">
              {say(
                "Falta ubicar este lugar para mostrarlo en el mapa.",
                "This item needs a location before it can appear on the map.",
              )}
            </p>
          ) : (
            <p className="city-muted">
              {data.precision !== "exact"
                ? say(
                    "Ubicación aproximada o indicada por el anuncio.",
                    "Approximate location or position supplied by the listing.",
                  )
                : say("Ubicación exacta guardada.", "Exact location saved.")}
            </p>
          )}
          <dl className="city-facts">
            {(item.kind === "activity"
              ? [
                  ...(data.startDate || data.endDate
                    ? ["startDate", "endDate"]
                    : []),
                  "schedule",
                  "category",
                  "availability",
                ]
              : [
                  "bedrooms",
                  "bathrooms",
                  "area",
                  "maintenance",
                  "deposit",
                  "furnished",
                  "availability",
                ]
            ).map((k) => (
              <div key={k}>
                <dt>{label(k)}</dt>
                <dd>
                  {String(
                    data[k as keyof SavedData] ??
                      say("Por confirmar", "Unknown"),
                  )}
                  {["maintenance", "deposit"].includes(k) &&
                  data[k as keyof SavedData] != null
                    ? ` ${data.currency || "?"}`
                    : ""}
                </dd>
              </div>
            ))}
            {monthly != null && (
              <div>
                <dt>{say("Renta + mantenimiento", "Rent + maintenance")}</dt>
                <dd>
                  {money({ price: monthly, currency: data.currency }, locale)} /{" "}
                  {say("mes", "month")}
                </dd>
              </div>
            )}
          </dl>
          {isHome && lat != null && (
            <section className="city-nearby">
              <h3>
                {say("Tus actividades cerca de aquí", "Your activities nearby")}
              </h3>
              <p className="city-muted">
                {say(
                  "A menos de 5 km en línea recta. Las ubicaciones aproximadas también afectan esta distancia.",
                  "Within 5 km in a straight line. Approximate locations also affect this distance.",
                )}
              </p>
              {nearby.map(({ item: i, distance }) => (
                <button
                  key={i.id}
                  className="city-secondary"
                  onClick={() => openItem?.(i.id)}
                >
                  {i.data.title} <small>{distance.toFixed(1)} km</small>
                </button>
              ))}
              {!nearby.length && (
                <p>
                  {nearbyError
                    ? say(
                        "No se pudieron cargar las actividades cercanas.",
                        "Nearby activities could not be loaded.",
                      )
                    : say(
                        "Todavía no tienes actividades guardadas en esta zona.",
                        "You haven’t saved activities in this area yet.",
                      )}
                </p>
              )}
            </section>
          )}
          <div className="city-actions">
            <a
              className="city-secondary"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={17} />
              {say("Ver fuente", "Open source")}
            </a>
            {data.lat != null && data.lng != null && (
              <a
                className="city-secondary"
                target="_blank"
                rel="noreferrer"
                href={directions({ lat: data.lat, lng: data.lng }, "transit")}
              >
                <MapPin size={17} />
                {say("Cómo llegar", "Directions")}
              </a>
            )}
            {item.canEdit && (
              <button className="city-secondary" onClick={startEdit}>
                <Pencil size={17} />
                {say("Editar datos", "Edit details")}
              </button>
            )}
          </div>
          <form
            className="city-personal city-form"
            onSubmit={(e) => {
              e.preventDefault();
              void act(async () => {
                setItem(
                  await savedApi<SavedItem>(`/items/${id}/personal`, "PATCH", {
                    note,
                    status,
                    recordId: item.recordId,
                  }),
                );
                changed();
                setNotice(
                  say("Tus notas están guardadas.", "Your notes are saved."),
                );
              });
            }}
          >
            <h3>{say("Tu mirada", "Your own notes")}</h3>
            <p>
              {say(
                "Sólo tú puedes ver estas notas y tu seguimiento.",
                "Only you can see these notes and your progress.",
              )}
            </p>
            <label>
              {say("Seguimiento", "Progress")}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {[
                  ["saved", "Guardado", "Saved"],
                  ["planned", "Planeado", "Planned"],
                  ["shortlisted", "Favorito", "Shortlisted"],
                  ["contacted", "Contactado", "Contacted"],
                  ["viewing", "Visita agendada", "Viewing arranged"],
                  ["visited", "Visitado", "Visited"],
                  ["discarded", "Descartado", "Discarded"],
                ].map(([v, es, en]) => (
                  <option key={v} value={v}>
                    {say(es, en)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {say("Notas personales", "Personal notes")}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={4000}
                rows={3}
              />
            </label>
            <button className="city-primary" disabled={busy}>
              {say("Guardar notas", "Save notes")}
            </button>
          </form>
          <button
            className="city-secondary"
            onClick={() =>
              setDraft({
                ...newDraft(),
                title: data.title || "",
                place: data.address || "",
                point:
                  data.lat != null && data.lng != null
                    ? { lat: data.lat, lng: data.lng }
                    : null,
                note,
              })
            }
          >
            <Camera size={19} />
            {say(
              "Registrar una visita con foto",
              "Record a visit with a photo",
            )}
          </button>
          {item.recordId && (
            <p className="city-muted">
              {say(
                "Esta ficha está vinculada a una visita de tu bitácora.",
                "This item is linked to a visit in your logbook.",
              )}
            </p>
          )}
          <details className="city-sources">
            <summary>{say("Fuentes y cambios", "Sources and changes")}</summary>
            <p>
              {say("Consultado", "Checked")}:{" "}
              {item.checkedAt
                ? new Date(item.checkedAt).toLocaleString(
                    locale === "es" ? "es-MX" : "en-US",
                  )
                : say("Pendiente", "Pending")}
            </p>
            {item.job?.error && (
              <p>
                {say(
                  ...(SAVED_ERRORS[item.job.error] ||
                    SAVED_ERRORS.source_unreadable),
                )}
              </p>
            )}
            {Object.entries(data.evidence || {})
              .filter(
                ([key]) =>
                  ![
                    "locationSource",
                    "locationExpiresAt",
                    "precision",
                  ].includes(key),
              )
              .map(([key, e]) => (
                <div key={key}>
                  <strong>{label(key)}</strong>
                  <p>{e.text}</p>
                  {e.source === "user" ? (
                    <small>{say("Edición manual", "Manual edit")}</small>
                  ) : (
                    <a href={e.source} target="_blank" rel="noreferrer">
                      {say("Página de origen", "Source page")}
                    </a>
                  )}
                </div>
              ))}
            {item.history?.map((h, index) => (
              <p key={`${h.at}-${index}`}>
                {new Date(h.at).toLocaleDateString(
                  locale === "es" ? "es-MX" : "en-US",
                )}{" "}
                · {money(h.data, locale)} {h.data.availability || ""}
              </p>
            ))}
          </details>
          {item.canEdit && (
            <div className="city-actions">
              <button
                className="city-secondary"
                disabled={
                  busy || ["queued", "running"].includes(item.job?.state || "")
                }
                onClick={() =>
                  void act(async () => {
                    setItem(
                      await savedApi<SavedItem>(`/items/${id}/refresh`, "POST"),
                    );
                    changed();
                    setNotice(
                      say(
                        "Volveremos a consultar la página. Tus cambios se conservan.",
                        "We’ll check the page again. Your edits are preserved.",
                      ),
                    );
                  })
                }
              >
                <RefreshCw size={17} />
                {say("Actualizar desde la fuente", "Refresh from source")}
              </button>
              <button
                className="city-text"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={16} />
                {say("Eliminar", "Delete")}
              </button>
            </div>
          )}
          {confirmDelete && (
            <div className="city-delete">
              <p>
                {say(
                  "Se eliminará de esta colección para quienes la comparten. Las visitas de tu bitácora se conservan.",
                  "This item will be removed for everyone in this collection. Logbook visits are preserved.",
                )}
              </p>
              <button
                className="city-primary"
                disabled={busy}
                onClick={() =>
                  void act(async () => {
                    await savedApi(`/items/${id}`, "DELETE");
                    changed();
                    close();
                  })
                }
              >
                {say("Eliminar de la colección", "Delete from collection")}
              </button>
              <button
                className="city-secondary"
                onClick={() => setConfirmDelete(false)}
              >
                {say("Cancelar", "Cancel")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
