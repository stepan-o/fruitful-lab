export type SavedKind = "activity" | "rent" | "buy";
export type SavedData = {
  method?: string;
  reviewedAt?: string;
  sourceNote?: string;
  fetchWarning?: string;
  title?: string | null;
  description?: string | null;
  address?: string | null;
  price?: number | null;
  currency?: string | null;
  pricePeriod?: string | null;
  maintenance?: number | null;
  deposit?: number | null;
  area?: number | null;
  areaType?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  furnished?: string | null;
  availability?: string | null;
  category?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  schedule?: string | null;
  lat?: number | null;
  lng?: number | null;
  precision?: string | null;
  locationSource?: string;
  evidence?: Record<string, { source: string; text: string }>;
};
export type SavedItem = {
  id: string;
  kind: SavedKind;
  state: string;
  owner: string;
  collectionId: string;
  url: string;
  data: SavedData;
  revision: number;
  canEdit: boolean;
  status: string;
  note: string;
  recordId?: string | null;
  hasImage: boolean;
  createdAt: number;
  updatedAt: number;
  checkedAt: number | null;
  job: { state: string; phase: string; error: string | null } | null;
  history?: { at: number; data: SavedData }[];
};
export type SavedCollection = {
  id: string;
  name: string;
  groupId: string | null;
  access: "view" | "contribute";
  owner: string;
  canManage: boolean;
  canAdd: boolean;
};
export type SavedList = {
  items: SavedItem[];
  collections: SavedCollection[];
  groups: { id: string; name: string }[];
  hasMore: boolean;
};
export type SavedMarker = {
  id: string;
  kind: SavedKind;
  title: string;
  label: string;
  lat: number;
  lng: number;
  approximate: boolean;
  provider?: string;
};
export async function savedApi<T>(
  path = "",
  method = "GET",
  body?: unknown,
): Promise<T> {
  const response = await fetch(`/api/mexico-city/saved${path}`, {
    method,
    cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 401) throw new Error("sign_in_required");
  if (response.status === 204) return undefined as T;
  const data = await response
    .json()
    .catch(() => ({ detail: "service_unavailable" }));
  if (!response.ok)
    throw new Error(
      typeof data.detail === "string" ? data.detail : "invalid_details",
    );
  return data as T;
}
export function money(d: SavedData, locale = "es") {
  if (d.price === null || d.price === undefined)
    return locale === "es" ? "Precio por confirmar" : "Price unknown";
  const amount = new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
    maximumFractionDigits: 2,
  }).format(d.price);
  return `${amount} ${d.currency || "?"}`;
}
export function savedMarker(i: SavedItem, locale = "es"): SavedMarker | null {
  if (i.data.lat == null || i.data.lng == null) return null;
  return {
    id: i.id,
    kind: i.kind,
    title: i.data.title || new URL(i.url).hostname,
    label:
      i.kind === "activity"
        ? i.data.title || "Actividad"
        : money(i.data, locale),
    lat: i.data.lat,
    lng: i.data.lng,
    approximate: i.data.precision !== "exact",
    provider: i.data.locationSource,
  };
}
export function monthlyCost(i: SavedItem) {
  return i.kind === "rent" &&
    i.data.pricePeriod === "month" &&
    i.data.price != null &&
    i.data.maintenance != null
    ? i.data.price + i.data.maintenance
    : null;
}
export const SAVED_ERRORS: Record<string, [string, string]> = {
  sign_in_required: [
    "Inicia sesión para ver tus lugares.",
    "Sign in to see your saved places.",
  ],
  service_unavailable: [
    "No pudimos conectar con tus lugares. Puedes volver a intentarlo.",
    "We couldn’t reach your saved places. You can try again.",
  ],
  not_found: [
    "Este lugar ya no está disponible para tu cuenta.",
    "This item is no longer available to your account.",
  ],
  read_only: [
    "Esta colección permite consultar sus lugares. Su creador puede habilitar las aportaciones.",
    "This collection is view-only. Its owner can enable contributions.",
  ],
  owner_required: [
    "Sólo quien guardó el lugar o creó la colección puede cambiarlo.",
    "Only the person who saved the item or owns the collection can change it.",
  ],
  changed_elsewhere: [
    "Hay una versión más reciente. Cierra la ficha y ábrela de nuevo antes de guardar.",
    "There is a newer version. Close and reopen this item before saving.",
  ],
  invalid_url: [
    "Pega un enlace completo que empiece por https://.",
    "Paste a complete link beginning with https://.",
  ],
  unsafe_url: [
    "Este enlace no lleva a una página pública compatible.",
    "This link does not lead to a supported public page.",
  ],
  source_restricted: [
    "La página impide la lectura automática. Puedes completar la ficha con su descripción.",
    "The page blocks automatic reading. You can fill in the item from its description.",
  ],
  source_removed: [
    "La página de origen ya no está disponible. Conservamos lo que habías guardado.",
    "The source page is no longer available. Your saved details are preserved.",
  ],
  source_unreachable: [
    "No pudimos abrir la página de origen.",
    "We couldn’t reach the source page.",
  ],
  source_unreadable: [
    "No pudimos leer esta página. Puedes completar sus datos aquí.",
    "We couldn’t read this page. You can fill in its details here.",
  ],
  refresh_wait: [
    "Espera un minuto antes de volver a consultar la fuente.",
    "Wait a minute before checking the source again.",
  ],
  import_limit: [
    "Llegaste al límite de 30 enlaces por hora. Tus enlaces guardados siguen disponibles.",
    "You’ve reached 30 links this hour. Your saved links remain available.",
  ],
  already_saved: [
    "El enlace ya está en esa colección.",
    "That link is already in this collection.",
  ],
};

/** Straight-line distance, deliberately not a travel-time estimate. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const rad = Math.PI / 180;
  const dlat = (b.lat - a.lat) * rad,
    dlng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dlng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
