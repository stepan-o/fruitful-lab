import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";
const UUID = /^[a-f0-9-]{36}$/i;
async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const operation = path.join("/");
  const publicRoute =
    operation === "register" ||
    operation === "community" ||
    (path[0] === "public-photos" && path.length === 2 && UUID.test(path[1]));
  const saved =
    path[0] === "saved" &&
    ((req.method === "GET" &&
      (path.length === 1 ||
        operation === "saved/map" ||
        (path[1] === "items" &&
          UUID.test(path[2] || "") &&
          (path.length === 3 ||
            (path.length === 4 && path[3] === "image"))))) ||
      (req.method === "POST" &&
        (["saved/imports", "saved/collections"].includes(operation) ||
          (path.length === 4 &&
            path[1] === "items" &&
            UUID.test(path[2]) &&
            path[3] === "refresh"))) ||
      (req.method === "PATCH" &&
        ((path.length === 3 &&
          ["collections", "items"].includes(path[1]) &&
          UUID.test(path[2])) ||
          (path.length === 4 &&
            path[1] === "items" &&
            UUID.test(path[2]) &&
            path[3] === "personal"))) ||
      (req.method === "DELETE" &&
        path.length === 3 &&
        path[1] === "items" &&
        UUID.test(path[2])));
  const allowed =
    saved ||
    (req.method === "GET"
      ? operation === "state" ||
        operation === "community" ||
        (["photos", "public-photos"].includes(path[0]) &&
          path.length === 2 &&
          UUID.test(path[1]))
      : req.method === "POST" &&
        (operation === "command" || operation === "register"));
  if (!allowed)
    return NextResponse.json({ detail: "not_found" }, { status: 404 });
  const token = (await cookies()).get("fruitful_access_token")?.value;
  if (!publicRoute && !token)
    return NextResponse.json({ detail: "sign_in_required" }, { status: 401 });
  const origin = req.headers.get("origin");
  if (["POST", "PATCH", "DELETE"].includes(req.method) && origin) {
    try {
      // Next may normalize nextUrl to localhost behind a proxy; Host is the
      // browser-facing authority. Never accept a different website's origin.
      const source = new URL(origin);
      if (
        !["http:", "https:"].includes(source.protocol) ||
        source.host !== req.headers.get("host")
      )
        return NextResponse.json(
          { detail: "origin_forbidden" },
          { status: 403 },
        );
    } catch {
      return NextResponse.json({ detail: "origin_forbidden" }, { status: 403 });
    }
  }
  let body: string | undefined;
  if (["POST", "PATCH"].includes(req.method)) {
    if (Number(req.headers.get("content-length") || 0) > 1_500_000)
      return NextResponse.json({ detail: "photo_size" }, { status: 413 });
    body = await req.text();
    if (body.length > 1_500_000)
      return NextResponse.json({ detail: "photo_size" }, { status: 413 });
  }
  try {
    const upstream = await fetch(
      `${getApiOrigin()}/discovery/${operation}${saved ? req.nextUrl.search : ""}`,
      {
        method: req.method,
        headers: {
          ...(token && !publicRoute
            ? { Authorization: `Bearer ${token}` }
            : {}),
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      },
    );
    if (upstream.status === 204) return new Response(null, { status: 204 });
    const type = upstream.headers.get("content-type") || "application/json";
    if (type.startsWith("image/") && upstream.ok)
      return new Response(upstream.body, {
        headers: {
          "Content-Type": type,
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    const data = await upstream
      .json()
      .catch(() => ({ detail: "service_unavailable" }));
    return NextResponse.json(data, {
      status: upstream.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { detail: "service_unavailable" },
      { status: 503 },
    );
  }
}
export const GET = proxy;
export const POST = proxy;

export const PATCH = proxy;
export const DELETE = proxy;
