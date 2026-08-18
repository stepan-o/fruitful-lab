const DEFAULT_SPREADSHEET_ID = "1YN2hC9Tap5S5Uk8blyP6NLjYu-FwdQIc8_HtR-FuunI";
const DEFAULT_SHEET_NAME = "Content HQ";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const APPS_SCRIPT_SOURCE = "google-apps-script";
const GOOGLE_SHEETS_SOURCE = "google-sheet";

let cachedToken = null;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function text(body, contentType = "text/plain; charset=utf-8", status = 200) {
  return new Response(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": contentType,
    },
  });
}

function corsHeaders(request) {
  const origin = request.headers.get("origin") || "";
  const isAllowedOrigin =
    origin === "https://bloomwhispers.com" ||
    origin === "https://www.bloomwhispers.com" ||
    /^https:\/\/[a-z0-9-]+\.bloom-whispers\.pages\.dev$/i.test(origin) ||
    /^http:\/\/localhost:\d+$/i.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d+$/i.test(origin);

  if (!isAllowedOrigin) return {};

  return {
    "access-control-allow-headers": "authorization, content-type",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-origin": origin,
    vary: "Origin",
  };
}

function withCors(response, request) {
  for (const [key, value] of Object.entries(corsHeaders(request))) {
    response.headers.set(key, value);
  }

  return response;
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function spreadsheetId(env) {
  return clean(env.BLOOM_CONTENT_HQ_SPREADSHEET_ID) || DEFAULT_SPREADSHEET_ID;
}

function sheetName(env) {
  return clean(env.BLOOM_CONTENT_HQ_SHEET_NAME) || DEFAULT_SHEET_NAME;
}

function appsScriptUrl(env) {
  return clean(env.BLOOM_CONTENT_HQ_APPS_SCRIPT_URL);
}

function appsScriptToken(env) {
  return clean(env.BLOOM_CONTENT_HQ_APPS_SCRIPT_TOKEN);
}

function usesAppsScriptBridge(env) {
  return Boolean(appsScriptUrl(env));
}

function requireAppsScriptConfig(env) {
  const bridgeUrl = appsScriptUrl(env);
  const bridgeToken = appsScriptToken(env);

  if (!bridgeUrl || !bridgeToken) {
    throw new Error("Content HQ Apps Script bridge is not fully configured in Cloudflare yet.");
  }

  return { bridgeToken, bridgeUrl };
}

function quoteSheetName(name) {
  return `'${name.replaceAll("'", "''")}'`;
}

function columnName(index) {
  let number = index + 1;
  let name = "";

  while (number > 0) {
    const remainder = (number - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    number = Math.floor((number - 1) / 26);
  }

  return name;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function readRequestToken(request, url) {
  const authorization = request.headers.get("authorization") || "";
  const bearerMatch = authorization.match(/^Bearer\s+(.+)$/i);
  return clean(bearerMatch?.[1] || url.searchParams.get("token") || "");
}

function allowedTokens(env, purpose) {
  const syncToken = clean(env.BLOOM_CONTENT_HQ_SYNC_TOKEN);

  if (purpose === "calendar") {
    const calendarToken = clean(env.BLOOM_CONTENT_HQ_CALENDAR_TOKEN);
    return [...new Set([calendarToken, syncToken].filter(Boolean))];
  }

  return syncToken ? [syncToken] : [];
}

function requireToken(request, env, url, purpose) {
  const tokens = allowedTokens(env, purpose);

  if (tokens.length === 0) {
    return {
      ok: false,
      response: json(
        {
          ok: false,
          message:
            purpose === "calendar"
              ? "Content HQ calendar feed token is not configured in Cloudflare yet."
              : "Content HQ sync token is not configured in Cloudflare yet.",
        },
        503,
      ),
    };
  }

  if (!tokens.includes(readRequestToken(request, url))) {
    return {
      ok: false,
      response: json(
        {
          ok: false,
          message:
            purpose === "calendar"
              ? "Content HQ calendar feed key is missing or incorrect."
              : "Content HQ sync key is missing or incorrect.",
        },
        401,
      ),
    };
  }

  return { ok: true };
}

function base64Url(value) {
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

async function signJwt(env) {
  const serviceAccountEmail = clean(env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  const privateKey = clean(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY).replace(/\\n/g, "\n");

  if (!serviceAccountEmail || !privateKey) {
    throw new Error("Google service account credentials are not configured in Cloudflare yet.");
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      aud: TOKEN_URL,
      exp: issuedAt + 3600,
      iat: issuedAt,
      iss: serviceAccountEmail,
      scope: SHEETS_SCOPE,
    }),
  );
  const unsignedToken = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKey),
    { hash: "SHA-256", name: "RSASSA-PKCS1-v1_5" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsignedToken));

  return `${unsignedToken}.${base64UrlBuffer(signature)}`;
}

async function getAccessToken(env) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token;
  }

  const assertion = await signJwt(env);
  const response = await fetch(TOKEN_URL, {
    body: new URLSearchParams({
      assertion,
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const body = await response.json();

  if (!response.ok || !body.access_token) {
    throw new Error(body.error_description || body.error || "Google rejected the service account token.");
  }

  cachedToken = {
    expiresAt: Date.now() + Number(body.expires_in || 3600) * 1000,
    token: body.access_token,
  };

  return cachedToken.token;
}

async function fetchBridgeJson(env, init) {
  const { bridgeToken, bridgeUrl } = requireAppsScriptConfig(env);
  const url = new URL(bridgeUrl);

  if (init?.method !== "POST") {
    url.searchParams.set("token", bridgeToken);
  }

  const response = await fetch(url.toString(), init);
  const body = await response.json();

  if (!response.ok || !body.ok) {
    throw new Error(body.message || "Content HQ Apps Script bridge request failed.");
  }

  return body;
}

async function fetchRowsFromAppsScript(env) {
  const body = await fetchBridgeJson(env);

  if (!Array.isArray(body.rows)) {
    throw new Error("Content HQ Apps Script bridge returned an invalid rows payload.");
  }

  return body.rows;
}

async function updateFieldWithAppsScript(env, { id, key, value }) {
  const { bridgeToken, bridgeUrl } = requireAppsScriptConfig(env);
  const response = await fetch(bridgeUrl, {
    body: JSON.stringify({
      id,
      key,
      token: bridgeToken,
      type: "update-field",
      value,
    }),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    method: "POST",
  });
  const body = await response.json();

  if (!response.ok || !body.ok) {
    throw new Error(body.message || "Could not write to the Content HQ Apps Script bridge.");
  }

  return body;
}

async function fetchSheetRows(env) {
  if (usesAppsScriptBridge(env)) {
    return fetchRowsFromAppsScript(env);
  }

  const accessToken = await getAccessToken(env);
  const range = `${quoteSheetName(sheetName(env))}!A1:AL`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId(env)}/values/${encodeURIComponent(range)}?majorDimension=ROWS`;
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: "application/json",
    },
  });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error?.message || "Could not read the Content HQ Google Sheet.");
  }

  return body.values || [];
}

async function batchUpdateValues(env, updates) {
  const accessToken = await getAccessToken(env);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId(env)}/values:batchUpdate`;
  const response = await fetch(url, {
    body: JSON.stringify({
      data: updates,
      valueInputOption: "USER_ENTERED",
    }),
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    method: "POST",
  });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error?.message || "Could not write to the Content HQ Google Sheet.");
  }

  return body;
}

function rowsToItems(rows) {
  const [headers = [], ...records] = rows;
  return records
    .filter((row) => row.some((value) => clean(value)))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function itemFromRow(headers, row) {
  return Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]));
}

function escapeIcsText(value) {
  return clean(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function compactDate(value) {
  const match = clean(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[1]}${match[2]}${match[3]}` : "";
}

function nextCompactDate(value) {
  const match = clean(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + 1));
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function foldIcsLine(line) {
  if (line.length <= 74) return line;
  const chunks = [];
  let rest = line;

  while (rest.length > 74) {
    chunks.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }

  chunks.push(rest);
  return chunks.join("\r\n");
}

function buildIcs(items) {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bloom Whispers//Content HQ//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Bloom Whispers Content HQ",
  ];

  for (const item of items) {
    const id = clean(item["HQ ID"]) || clean(item["Asset / Idea"]);
    const title = clean(item["Asset / Idea"]) || "Bloom Whispers content";
    const channel = clean(item["Ecosystem Area"]) || clean(item["Primary Channel"]);
    const stage = clean(item.Stage);
    const nextAction = clean(item["Next Action"]);
    const susyInput = clean(item["Susy Input"]);
    const publishUrl = clean(item["Publish URL"]);
    const description = [
      channel ? `Channel: ${channel}` : "",
      stage ? `Stage: ${stage}` : "",
      nextAction ? `Next action: ${nextAction}` : "",
      susyInput ? `Susy input: ${susyInput}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    for (const eventType of [
      { date: clean(item["Work Date"]), label: "Work" },
      { date: clean(item["Target Publish Date"]), label: "Publish" },
    ]) {
      const startDate = compactDate(eventType.date);
      const endDate = nextCompactDate(eventType.date);
      if (!startDate || !endDate) continue;

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${escapeIcsText(`${id}-${eventType.label.toLowerCase()}@bloomwhispers-content-hq`)}`);
      lines.push(`DTSTAMP:${timestamp}`);
      lines.push(`DTSTART;VALUE=DATE:${startDate}`);
      lines.push(`DTEND;VALUE=DATE:${endDate}`);
      lines.push(`SUMMARY:${escapeIcsText(`${eventType.label}: ${title}`)}`);
      if (description) lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
      if (publishUrl) lines.push(`URL:${publishUrl}`);
      lines.push("END:VEVENT");
    }
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

async function handleGet(request, env, url) {
  const format = clean(url.searchParams.get("format") || "json").toLowerCase();
  const auth = requireToken(request, env, url, format === "ics" ? "calendar" : "json");
  if (!auth.ok) return auth.response;

  const rows = await fetchSheetRows(env);
  const items = rowsToItems(rows);

  if (format === "ics") {
    return text(buildIcs(items), "text/calendar; charset=utf-8");
  }

  return json({
    ok: true,
    generatedAt: new Date().toISOString(),
    headers: rows[0] || [],
    items,
    source: usesAppsScriptBridge(env) ? APPS_SCRIPT_SOURCE : GOOGLE_SHEETS_SOURCE,
  });
}

async function handlePost(request, env, url) {
  const auth = requireToken(request, env, url, "json");
  if (!auth.ok) return auth.response;

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Please send valid JSON." }, 400);
  }

  const id = clean(body.id);
  const key = clean(body.key);
  const value = typeof body.value === "string" ? body.value : "";

  if (body.type !== "update-field" || !id || !key) {
    return json({ ok: false, message: "Send type, id, key, and value." }, 400);
  }

  if (usesAppsScriptBridge(env)) {
    const result = await updateFieldWithAppsScript(env, { id, key, value });

    return json({
      ok: true,
      item: result.item || {},
      savedAt: result.savedAt || new Date().toISOString(),
    });
  }

  const rows = await fetchSheetRows(env);
  const headers = rows[0] || [];
  const idColumn = headers.indexOf("HQ ID");
  const targetColumn = headers.indexOf(key);
  const lastUpdatedColumn = headers.indexOf("Last Updated");

  if (idColumn === -1) return json({ ok: false, message: "The Sheet is missing the HQ ID header." }, 500);
  if (targetColumn === -1) return json({ ok: false, message: `The Sheet is missing the ${key} header.` }, 400);

  const rowIndex = rows.findIndex((row, index) => index > 0 && clean(row[idColumn]) === id);
  if (rowIndex === -1) return json({ ok: false, message: `No Content HQ row found for ${id}.` }, 404);

  const rowNumber = rowIndex + 1;
  const sheet = quoteSheetName(sheetName(env));
  const savedAt = new Date().toISOString();
  const today = todayIso();
  const updates = [
    {
      range: `${sheet}!${columnName(targetColumn)}${rowNumber}`,
      values: [[value]],
    },
  ];
  const nextRow = [...rows[rowIndex]];
  nextRow[targetColumn] = value;

  if (lastUpdatedColumn !== -1 && key !== "Last Updated") {
    updates.push({
      range: `${sheet}!${columnName(lastUpdatedColumn)}${rowNumber}`,
      values: [[today]],
    });
    nextRow[lastUpdatedColumn] = today;
  }

  await batchUpdateValues(env, updates);

  return json({
    ok: true,
    item: itemFromRow(headers, nextRow),
    savedAt,
  });
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  try {
    let response;

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }), request);
    }

    if (request.method === "GET") {
      response = await handleGet(request, env, url);
      return withCors(response, request);
    }

    if (request.method === "POST") {
      response = await handlePost(request, env, url);
      return withCors(response, request);
    }

    return withCors(json({ ok: false, message: "Method not allowed." }, 405), request);
  } catch (error) {
    return withCors(
      json(
        {
          ok: false,
          message: error instanceof Error ? error.message : "Content HQ sync failed.",
        },
        500,
      ),
      request,
    );
  }
}
