"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  FolderPlus,
  House,
  Layers,
  Link2,
  List,
  Map as MapIcon,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import {
  LocaleProvider,
  LanguageSwitch,
  useLocale,
} from "@/lib/mexico-city/locale";
import {
  savedApi,
  savedMarker,
  money,
  monthlyCost,
  SAVED_ERRORS,
  type SavedKind,
  type SavedList,
  type SavedItem,
  type SavedCollection,
} from "@/lib/mexico-city/saved-city";
import AccountForm from "@/components/accounts/AccountForm";
import GameDialog from "./GameDialog";
const SavedItemDetails = dynamic(() => import("./SavedItemDetails"));
import type { MapHandle } from "./FieldMap";
const FieldMap = dynamic(() => import("./FieldMap"), { ssr: false });
const EMPTY: SavedList = {
  items: [],
  collections: [],
  groups: [],
  hasMore: false,
};
export function itemState(item: SavedItem, es: boolean) {
  if (item.job?.state === "running")
    return es ? "Leyendo el enlace…" : "Reading the link…";
  if (item.job?.state === "queued") return es ? "En proceso" : "Processing";
  if (item.state === "unavailable")
    return es ? "Fuente no disponible" : "Source unavailable";
  if (item.state === "needs_review")
    return es ? "Por completar" : "Needs details";
  return item.data.precision !== "exact"
    ? es
      ? "Ubicación aproximada"
      : "Approximate location"
    : es
      ? "En el mapa"
      : "On the map";
}
function Library({
  initialKind,
  signedIn,
}: {
  initialKind: SavedKind;
  signedIn: boolean;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const activity = initialKind === "activity";
  const periods: Record<string, string> = {
    month: say("mes", "month"),
    night: say("noche", "night"),
    week: say("semana", "week"),
    total: say("total", "total"),
  };
  const [authenticated, setAuthenticated] = useState(signedIn),
    [state, setState] = useState<SavedList>(EMPTY),
    [kind, setKind] = useState<SavedKind>(initialKind);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const [collection, setCollection] = useState(""),
    [scope, setScope] = useState("all"),
    [query, setQuery] = useState(""),
    [mapView, setMapView] = useState(false),
    [filters, setFilters] = useState(false);
  const [min, setMin] = useState(""),
    [max, setMax] = useState(""),
    [currency, setCurrency] = useState("MXN"),
    [beds, setBeds] = useState(""),
    [date, setDate] = useState("");
  const [panel, setPanel] = useState<"save" | "collection" | "compare" | null>(
      null,
    ),
    [selected, setSelected] = useState("");
  const [url, setUrl] = useState(""),
    [saveKind, setSaveKind] = useState<SavedKind>(initialKind),
    [saveCollection, setSaveCollection] = useState("");
  const [editingCollection, setEditingCollection] =
      useState<SavedCollection | null>(null),
    [collectionName, setCollectionName] = useState(""),
    [group, setGroup] = useState(""),
    [access, setAccess] = useState("view");
  const [compare, setCompare] = useState<string[]>([]);
  const map = useRef<MapHandle>(null),
    generation = useRef(0);
  const loadedCount = useRef(100);
  const load = useCallback(async (more = false) => {
    const run = ++generation.current;
    try {
      const target = loadedCount.current + (more ? 100 : 0);
      let next: SavedList = EMPTY;
      const items: SavedItem[] = [];
      for (let offset = 0; offset < target; offset += 100) {
        next = await savedApi<SavedList>(`?limit=100&offset=${offset}`);
        items.push(...next.items);
        if (!next.hasMore || run !== generation.current) break;
      }
      if (run !== generation.current) return;
      loadedCount.current = Math.max(100, items.length);
      setState({
        ...next,
        items: [...new Map(items.map((i) => [i.id, i])).values()],
      });
      setError("");
    } catch (e) {
      if (run === generation.current)
        setError(e instanceof Error ? e.message : "service_unavailable");
      if (e instanceof Error && e.message === "sign_in_required") {
        setAuthenticated(false);
        setState(EMPTY);
      }
    } finally {
      if (run === generation.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (authenticated) void load();
    else setLoading(false);
  }, [authenticated, load]);
  const pending = state.items.some((i) =>
    ["queued", "running"].includes(i.job?.state || ""),
  );
  useEffect(() => {
    if (!authenticated) return;
    const refresh = () => {
      if (!document.hidden) void load();
    };
    const timer = window.setInterval(refresh, pending ? 3000 : 30000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [authenticated, pending, load]);
  const visible = useMemo(
    () =>
      state.items.filter((i) => {
        const c = state.collections.find((c) => c.id === i.collectionId),
          d = i.data;
        return (
          i.kind === kind &&
          (!collection || i.collectionId === collection) &&
          (scope === "all" ||
            (scope === "mine" && !c?.groupId) ||
            (scope === "group" && c?.groupId)) &&
          (!query ||
            `${d.title || ""} ${d.address || ""}`
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase())) &&
          ((!min && !max) ||
            (d.price != null &&
              d.currency === currency &&
              (!min || d.price >= Number(min)) &&
              (!max || d.price <= Number(max)))) &&
          (!beds || (d.bedrooms != null && d.bedrooms >= Number(beds))) &&
          (!date ||
            (!!d.startDate &&
              d.startDate.slice(0, 10) <= date &&
              (d.endDate || d.startDate).slice(0, 10) >= date))
        );
      }),
    [state, kind, collection, scope, query, min, max, currency, beds, date],
  );
  const markers = useMemo(
    () => visible.map((i) => savedMarker(i, locale)).filter((i) => i !== null),
    [visible, locale],
  );
  const unknown = visible.filter((i) => i.data.lat == null).length;
  const activeCollection = state.collections.find((c) => c.id === collection);
  async function act(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "service_unavailable");
    } finally {
      setBusy(false);
    }
  }
  function editCollection(c?: SavedCollection) {
    setEditingCollection(c || null);
    setCollectionName(c?.name || "");
    setGroup(c?.groupId || "");
    setAccess(c?.access || "view");
    setPanel("collection");
  }
  function add() {
    setSaveKind(kind);
    setSaveCollection(
      activeCollection?.canAdd
        ? activeCollection.id
        : state.collections.find(
            (c) =>
              c.canAdd &&
              state.items.some(
                (i) => i.kind === kind && i.collectionId === c.id,
              ),
          )?.id || "",
    );
    setPanel("save");
  }
  const title = activity
    ? say("Actividades", "Activities")
    : say("Vivienda", "Housing");
  return (
    <main
      className={`city-library ${activity ? "is-activities" : "is-housing"}`}
    >
      <header className="city-top">
        <Link href="/mexico-city/explore">
          <ArrowLeft size={19} />
          {say("Explorar", "Explore")}
        </Link>
        <Link className="city-map-return" href="/mexico-city/play">
          <MapIcon size={18} />
          {say("Mapa del juego", "Game map")}
        </Link>
        <LanguageSwitch />
      </header>
      <section className="city-library-heading">
        <div>
          <span className="city-eyebrow">
            {say("TUS COLECCIONES DE LA CIUDAD", "YOUR CITY COLLECTIONS")}
          </span>
          <h1>
            {title}
            <span>{activity ? <CalendarDays /> : <House />}</span>
          </h1>
          <p>
            {activity
              ? say(
                  "Las exposiciones, los talleres y los lugares que vas encontrando, reunidos para cuando tengas una tarde libre.",
                  "The exhibitions, workshops and places you come across, gathered for an afternoon you have to spare.",
                )
              : say(
                  "Los anuncios que vale la pena volver a mirar, con espacio para tus preguntas y lo que descubras en cada visita.",
                  "The listings worth another look, with room for your questions and what you learn at each viewing.",
                )}
          </p>
        </div>
        {authenticated && (
          <button className="city-primary" onClick={add}>
            <Plus size={20} />
            {say("Guardar enlace", "Save a link")}
          </button>
        )}
      </section>
      {!authenticated ? (
        <section className="city-login">
          <h2>
            {say(
              "Tus lugares se guardan en tu cuenta.",
              "Your places belong to your account.",
            )}
          </h2>
          <AccountForm
            next={`/mexico-city/${activity ? "activities" : "housing"}`}
            success={async () => {
              setAuthenticated(true);
            }}
          />
        </section>
      ) : (
        <>
          {error && (
            <div className="city-error" role="alert">
              <p>
                {say(
                  ...(SAVED_ERRORS[error] || SAVED_ERRORS.service_unavailable),
                )}
              </p>
              <button
                className="city-secondary"
                onClick={() => {
                  if (error === "sign_in_required") setAuthenticated(false);
                  else void load();
                }}
              >
                {say("Volver a intentar", "Try again")}
              </button>
            </div>
          )}
          {notice && (
            <p className="city-notice" role="status">
              {notice}
            </p>
          )}
          <div className="city-toolbar">
            <div className="city-kind-tabs">
              {!activity &&
                [
                  ["rent", "Renta", "Rent"],
                  ["buy", "Compra", "Buy"],
                ].map(([v, es, en]) => (
                  <button
                    key={v}
                    aria-pressed={kind === v}
                    onClick={() => {
                      setKind(v as SavedKind);
                      setCompare([]);
                    }}
                  >
                    {say(es, en)}
                  </button>
                ))}
            </div>
            <label className="city-search">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={say(
                  "Buscar lugar o colonia",
                  "Find a place or neighborhood",
                )}
                aria-label={say("Buscar guardados", "Search saved items")}
              />
            </label>
            <button
              className="city-icon"
              aria-label={say("Filtros", "Filters")}
              aria-expanded={filters}
              onClick={() => setFilters(!filters)}
            >
              <SlidersHorizontal size={20} />
            </button>
            <button
              className="city-icon"
              aria-label={
                mapView
                  ? say("Ver lista", "List view")
                  : say("Ver mapa", "Map view")
              }
              aria-pressed={mapView}
              onClick={() => setMapView(!mapView)}
            >
              {mapView ? <List size={20} /> : <MapIcon size={20} />}
            </button>
          </div>
          <div className="city-collection-bar">
            <label>
              <Layers size={17} />
              <select
                aria-label={say("Colección", "Collection")}
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
              >
                <option value="">
                  {say("Todas las colecciones", "All collections")}
                </option>
                {state.collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.groupId ? " · ↗" : ""}
                  </option>
                ))}
              </select>
            </label>
            <select
              aria-label={say("Visibilidad", "Audience")}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="all">
                {say("Mías y compartidas", "Mine and shared")}
              </option>
              <option value="mine">{say("Privadas", "Private")}</option>
              <option value="group">
                {say("Con mi grupo", "With my group")}
              </option>
            </select>
            <button className="city-text" onClick={() => editCollection()}>
              <FolderPlus size={19} />
              {say("Nueva colección", "New collection")}
            </button>
            {activeCollection?.canManage && (
              <button
                className="city-text"
                onClick={() => editCollection(activeCollection)}
              >
                <Users size={17} />
                {say("Compartir / editar", "Share / edit")}
              </button>
            )}
          </div>
          {filters && (
            <div className="city-filter-panel city-form-grid">
              <label>
                {say("Desde", "Minimum price")}
                <input
                  type="number"
                  min="0"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                />
              </label>
              <label>
                {say("Hasta", "Maximum price")}
                <input
                  type="number"
                  min="0"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </label>
              <label>
                {say("Moneda", "Currency")}
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {["MXN", "USD", "CAD", "EUR"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              {activity ? (
                <label>
                  {say("Fecha", "Date")}
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
              ) : (
                <label>
                  {say("Recámaras mínimas", "Minimum bedrooms")}
                  <input
                    type="number"
                    min="0"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                  />
                </label>
              )}
              <button
                className="city-text"
                onClick={() => {
                  setMin("");
                  setMax("");
                  setBeds("");
                  setDate("");
                  setQuery("");
                }}
              >
                {say("Limpiar filtros", "Clear filters")}
              </button>
            </div>
          )}
          {activity && !loading && (
            <details className="city-starter">
              <summary>
                {say(
                  "Hockey en el valle · tres pistas para empezar",
                  "Hockey in the valley · three rinks to start with",
                )}
              </summary>
              <p>
                {say(
                  "Santa Fe, Interlomas y Buenavista. Fichas investigadas el 12 de octubre de 2026, con enlaces a sus clubes y ubicaciones aproximadas de los centros comerciales.",
                  "Santa Fe, Interlomas and Buenavista. Researched on October 12, 2026, with club sources and approximate mall locations.",
                )}
              </p>
              <button
                className="city-secondary"
                disabled={busy}
                onClick={() =>
                  void act(async () => {
                    let c = state.collections.find(
                      (c) =>
                        c.name === "Hockey en el valle" &&
                        c.canManage &&
                        !c.groupId,
                    );
                    if (!c)
                      c = await savedApi<SavedCollection>(
                        "/collections",
                        "POST",
                        { name: "Hockey en el valle" },
                      );
                    for (const url of [
                      "https://pistadehielosantafe.com/clubes-y-servicios/hockey/",
                      "https://isk8.mx/hockey/",
                      "https://www.ice-station.com.mx/",
                    ]) {
                      await savedApi("/imports", "POST", {
                        url,
                        kind: "activity",
                        collectionId: c.id,
                      });
                    }
                    setCollection(c.id);
                    await load();
                    setNotice(
                      say(
                        "Las tres pistas están en tu colección. Preparando sus fichas…",
                        "The three rinks are in your collection. Preparing details…",
                      ),
                    );
                  })
                }
              >
                {say("Guardar las tres pistas", "Save all three rinks")}
              </button>
            </details>
          )}
          <div className="city-results-caption">
            <span>
              {visible.length}{" "}
              {visible.length === 1
                ? say("lugar", "place")
                : say("lugares", "places")}
              {unknown > 0
                ? ` · ${unknown} ${say("por ubicar", "awaiting a location")}`
                : ""}
            </span>
            {pending && (
              <span className="city-processing" role="status">
                {say("Preparando tus enlaces…", "Preparing your links…")}
              </span>
            )}
            {compare.length > 0 && (
              <button className="city-text" onClick={() => setPanel("compare")}>
                {say("Comparar", "Compare")} ({compare.length})
                <ArrowUpRight size={16} />
              </button>
            )}
          </div>
          {loading ? (
            <p role="status">
              {say("Cargando tus colecciones…", "Loading your collections…")}
            </p>
          ) : mapView ? (
            <div className="city-collection-map">
              <FieldMap
                ref={map}
                records={[]}
                savedMarkers={markers}
                selectSaved={setSelected}
                select={() => {}}
                painted={false}
                picking={false}
                pick={() => {}}
                compact
              />
              <button
                className="city-map-focus city-secondary"
                disabled={!markers.length}
                onClick={() => {
                  const m = markers[0];
                  if (m) map.current?.focus(m, 14);
                }}
              >
                <MapPin size={17} />
                {say("Ver un lugar guardado", "Find a saved place")}
              </button>
            </div>
          ) : visible.length ? (
            <div className="city-item-grid">
              {visible.map((i) => (
                <article className={`city-item-card is-${i.kind}`} key={i.id}>
                  <button
                    className="city-card-open"
                    onClick={() => setSelected(i.id)}
                  >
                    <div className="city-card-top">
                      <span>
                        {i.kind === "activity" ? (
                          <CalendarDays size={21} />
                        ) : (
                          <House size={21} />
                        )}
                      </span>
                      <small>
                        {
                          state.collections.find((c) => c.id === i.collectionId)
                            ?.name
                        }
                      </small>
                      <ArrowUpRight size={18} />
                    </div>
                    <h2>{i.data.title || new URL(i.url).hostname}</h2>
                    <p>
                      {i.data.address ||
                        say("Ubicación por confirmar", "Location unknown")}
                    </p>
                    <strong className="city-card-price">
                      {money(i.data, locale)}
                      {i.data.pricePeriod === "month" ? (
                        <small> / {say("mes", "month")}</small>
                      ) : (
                        ""
                      )}
                    </strong>
                    <span className="city-card-state">
                      <i
                        className={
                          i.job?.state === "running" ||
                          i.job?.state === "queued"
                            ? "is-pending"
                            : ""
                        }
                      />
                      {itemState(i, locale === "es")}
                    </span>
                  </button>
                  {!activity && (
                    <label className="city-compare-toggle">
                      <input
                        type="checkbox"
                        checked={compare.includes(i.id)}
                        disabled={
                          !compare.includes(i.id) && compare.length >= 4
                        }
                        onChange={(e) =>
                          setCompare(
                            e.target.checked
                              ? [...compare, i.id]
                              : compare.filter((id) => id !== i.id),
                          )
                        }
                      />
                      {say("Comparar", "Compare")}
                    </label>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="city-empty">
              <div>
                {activity ? (
                  <CalendarDays size={48} strokeWidth={1.2} />
                ) : (
                  <House size={48} strokeWidth={1.2} />
                )}
              </div>
              <h2>
                {state.items.some((i) => i.kind === kind)
                  ? say(
                      "No hay lugares con estos filtros.",
                      "No places match these filters.",
                    )
                  : activity
                    ? say(
                        "El próximo plan puede empezar con un enlace.",
                        "Your next outing can begin with a link.",
                      )
                    : say(
                        "Una dirección para empezar.",
                        "An address to start with.",
                      )}
              </h2>
              <p>
                {state.items.some((i) => i.kind === kind)
                  ? say(
                      "Prueba otra colección o cambia los filtros.",
                      "Try another collection or change the filters.",
                    )
                  : say(
                      "Guarda una página y prepararemos su ficha. Si falta algún dato, podrás completarlo aquí.",
                      "Save a page and we’ll prepare its details. You can fill in anything missing here.",
                    )}
              </p>
              <button className="city-primary" onClick={add}>
                <Link2 size={18} />
                {say("Guardar enlace", "Save a link")}
              </button>
            </div>
          )}
          {state.hasMore && (
            <button className="city-secondary" onClick={() => void load(true)}>
              {say(
                "Cargar más lugares para ver y filtrar",
                "Load more places to view and filter",
              )}
            </button>
          )}
        </>
      )}
      {(panel || selected) && (
        <GameDialog
          label={
            selected
              ? say("Lugar guardado", "Saved place")
              : panel === "save"
                ? say("Guardar enlace", "Save a link")
                : panel === "compare"
                  ? say("Comparar viviendas", "Compare homes")
                  : say("Colección", "Collection")
          }
          close={() => {
            setPanel(null);
            setSelected("");
            setError("");
          }}
          className="mc-task-dialog city-dialog"
        >
          {selected ? (
            <SavedItemDetails
              key={selected}
              openItem={setSelected}
              id={selected}
              collections={state.collections}
              changed={() => void load()}
              close={() => setSelected("")}
            />
          ) : panel === "save" ? (
            <form
              className="city-form city-sheet"
              onSubmit={(e) => {
                e.preventDefault();
                void act(async () => {
                  let cid = saveCollection;
                  if (!cid) {
                    const c = await savedApi<SavedCollection>(
                      "/collections",
                      "POST",
                      { name: say("Mis lugares", "My places") },
                    );
                    cid = c.id;
                    setSaveCollection(cid);
                  }
                  await savedApi<SavedItem>("/imports", "POST", {
                    url,
                    kind: saveKind,
                    collectionId: cid,
                  });
                  setPanel(null);
                  setUrl("");
                  setNotice(
                    say(
                      "Enlace guardado. Puedes seguir explorando mientras preparamos la ficha.",
                      "Link saved. You can keep exploring while we prepare its details.",
                    ),
                  );
                  await load();
                });
              }}
            >
              <span className="city-eyebrow">
                {say("DE UN ENLACE AL MAPA", "FROM A LINK TO THE MAP")}
              </span>
              <h2>{say("Guardar un lugar", "Save a place")}</h2>
              <label>
                {say("Enlace de la página", "Page link")}
                <input
                  autoFocus
                  required
                  type="url"
                  maxLength={2048}
                  placeholder="https://…"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </label>
              <label>
                {say("Qué estás guardando", "What you’re saving")}
                <select
                  value={saveKind}
                  onChange={(e) => setSaveKind(e.target.value as SavedKind)}
                >
                  <option value="activity">
                    {say("Actividad", "Activity")}
                  </option>
                  <option value="rent">
                    {say("Vivienda en renta", "Home for rent")}
                  </option>
                  <option value="buy">
                    {say("Vivienda en venta", "Home for sale")}
                  </option>
                </select>
              </label>
              <label>
                {say("Colección", "Collection")}
                <select
                  value={saveCollection}
                  onChange={(e) => setSaveCollection(e.target.value)}
                >
                  <option value="">
                    {say(
                      "Nueva colección privada: Mis lugares",
                      "New private collection: My places",
                    )}
                  </option>
                  {state.collections
                    .filter((c) => c.canAdd)
                    .map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name}
                        {c.groupId ? say(" · compartida", " · shared") : ""}
                      </option>
                    ))}
                </select>
              </label>
              <p>
                {saveCollection &&
                state.collections.find((c) => c.id === saveCollection)?.groupId
                  ? say(
                      "Quienes comparten esta colección podrán ver la ficha. Tus notas personales seguirán siendo privadas.",
                      "People sharing this collection will see the item. Your personal notes remain private.",
                    )
                  : say(
                      "Esta ficha quedará en una colección privada.",
                      "This item will go into a private collection.",
                    )}
              </p>
              <button className="city-primary" disabled={busy}>
                {busy
                  ? say("Guardando…", "Saving…")
                  : say("Guardar enlace", "Save link")}
              </button>
            </form>
          ) : panel === "collection" ? (
            <form
              className="city-form city-sheet"
              onSubmit={(e) => {
                e.preventDefault();
                void act(async () => {
                  await savedApi(
                    `/collections${editingCollection ? `/${editingCollection.id}` : ""}`,
                    editingCollection ? "PATCH" : "POST",
                    { name: collectionName, groupId: group || null, access },
                  );
                  setPanel(null);
                  await load();
                });
              }}
            >
              <span className="city-eyebrow">
                {say("UN LUGAR PARA TUS PLANES", "A PLACE FOR YOUR PLANS")}
              </span>
              <h2>
                {editingCollection
                  ? say("Tu colección", "Your collection")
                  : say("Nueva colección", "New collection")}
              </h2>
              <label>
                {say("Nombre", "Name")}
                <input
                  autoFocus
                  required
                  maxLength={100}
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder={say("Depas para visitar", "Homes to visit")}
                />
              </label>
              <label>
                {say("Quién puede verla", "Who can see it")}
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                >
                  <option value="">{say("Sólo yo", "Only me")}</option>
                  {state.groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </label>
              {group && (
                <label>
                  {say("Permisos del grupo", "Group permissions")}
                  <select
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                  >
                    <option value="view">
                      {say(
                        "Consultar y tomar notas privadas",
                        "View and keep private notes",
                      )}
                    </option>
                    <option value="contribute">
                      {say("También agregar lugares", "Also add places")}
                    </option>
                  </select>
                </label>
              )}
              {!state.groups.length && (
                <p>
                  {say(
                    "Los grupos que crees en Amigos aparecerán aquí.",
                    "Groups you create in Friends will appear here.",
                  )}
                </p>
              )}
              <p>
                {say(
                  "La visibilidad se aplica a todas las fichas de la colección. Cada persona conserva sus propias notas privadas.",
                  "Visibility applies to every item in the collection. Each person keeps their own private notes.",
                )}
              </p>
              <button className="city-primary" disabled={busy}>
                <Check size={18} />
                {say("Guardar colección", "Save collection")}
              </button>
            </form>
          ) : (
            <div className="city-sheet">
              <span className="city-eyebrow">
                {say("TUS OPCIONES", "YOUR OPTIONS")}
              </span>
              <h2>{say("Una junto a otra", "Side by side")}</h2>
              <p>
                {say(
                  "Precios anunciados; los espacios vacíos siguen por confirmar. Las cifras conservan su moneda y periodo.",
                  "Advertised prices; missing details remain unknown. Figures retain their currency and billing period.",
                )}
              </p>
              <div
                className="city-comparison"
                role="region"
                aria-label={say(
                  "Comparación de viviendas",
                  "Housing comparison",
                )}
                tabIndex={0}
              >
                <table>
                  <thead>
                    <tr>
                      <th>{say("Vivienda", "Home")}</th>
                      {state.items
                        .filter((i) => compare.includes(i.id))
                        .map((i) => (
                          <th key={i.id}>
                            <button
                              onClick={() => {
                                setPanel(null);
                                setSelected(i.id);
                              }}
                            >
                              {i.data.title || new URL(i.url).hostname}
                            </button>
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "price",
                      "monthly",
                      "area",
                      "bedrooms",
                      "bathrooms",
                      "address",
                    ].map((key) => (
                      <tr key={key}>
                        <th>
                          {
                            {
                              price: say("Precio", "Price"),
                              monthly: say(
                                "Renta + mantenimiento / mes",
                                "Rent + maintenance / month",
                              ),
                              area: say("Superficie · m²", "Area · m²"),
                              bedrooms: say("Recámaras", "Bedrooms"),
                              bathrooms: say("Baños", "Bathrooms"),
                              address: say("Dirección", "Address"),
                            }[key]
                          }
                        </th>
                        {state.items
                          .filter((i) => compare.includes(i.id))
                          .map((i) => (
                            <td key={i.id}>
                              {key === "price"
                                ? `${money(i.data, locale)} / ${periods[i.data.pricePeriod || ""] || say("periodo por confirmar", "period unknown")}`
                                : key === "monthly"
                                  ? monthlyCost(i) != null
                                    ? money(
                                        {
                                          price: monthlyCost(i),
                                          currency: i.data.currency,
                                        },
                                        locale,
                                      )
                                    : "—"
                                  : String(
                                      i.data[
                                        key as
                                          | "area"
                                          | "bedrooms"
                                          | "bathrooms"
                                          | "address"
                                      ] ?? "—",
                                    )}
                              {key === "area" && i.data.areaType
                                ? ` · ${i.data.areaType === "land" ? say("terreno", "land") : say("construcción", "floor")}`
                                : ""}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {error && (
            <p className="city-error" role="alert">
              {say(
                ...(SAVED_ERRORS[error] || SAVED_ERRORS.service_unavailable),
              )}
            </p>
          )}
        </GameDialog>
      )}
    </main>
  );
}
export default function SavedCity(props: {
  initialKind: SavedKind;
  signedIn: boolean;
}) {
  return (
    <LocaleProvider>
      <Library {...props} />
    </LocaleProvider>
  );
}
