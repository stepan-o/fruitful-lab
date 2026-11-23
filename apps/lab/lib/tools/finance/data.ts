import { Observation, RateSnapshot, SOURCE_URL } from "./types";

export function torontoDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function parseObservations(payload: unknown, now = new Date()): Pick<RateSnapshot, "observations" | "omitted"> {
  if (!payload || typeof payload !== "object" || !("observations" in payload) || !Array.isArray(payload.observations)) {
    throw new Error("The source did not return an observation list.");
  }
  const observations: Observation[] = [];
  const seen = new Set<string>();
  let omitted = 0;
  for (const row of payload.observations) {
    if (!row || typeof row.d !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(row.d) ||
      !Number.isFinite(Date.parse(row.d)) || new Date(row.d).toISOString().slice(0, 10) !== row.d || row.d > torontoDate(now)) {
      throw new Error("The source contains an invalid or future observation date.");
    }
    if (seen.has(row.d)) throw new Error("The source contains duplicate dates.");
    seen.add(row.d);
    const raw = row.FXMXNCAD?.v;
    if (raw === undefined || raw === null || raw === "") { omitted++; continue; }
    const rate = Number(raw);
    if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(1 / rate)) throw new Error("The source contains an invalid exchange rate.");
    observations.push({ date: row.d, cadPerMxn: rate, mxnPerCad: 1 / rate });
  }
  observations.sort((a, b) => a.date.localeCompare(b.date));
  if (observations.length < 253) throw new Error("At least 253 valid daily observations are required.");
  return { observations, omitted };
}

export async function getRateSnapshot(): Promise<RateSnapshot> {
  const response = await fetch(SOURCE_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error("The Bank of Canada feed is unavailable.");
  const body = await response.text();
  if (body.length > 1_000_000) throw new Error("The source response exceeds the size limit.");
  const checkedAt = new Date().toISOString();
  return { ...parseObservations(JSON.parse(body), new Date(checkedAt)), checkedAt, source: "Bank of Canada" };
}
