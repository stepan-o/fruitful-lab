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
  const allowed =
    req.method === "GET"
      ? operation === "state" ||
        operation === "community" ||
        (["photos", "public-photos"].includes(path[0]) &&
          path.length === 2 &&
          UUID.test(path[1]))
      : operation === "command" || operation === "register";
  if (!allowed)
    return NextResponse.json({ detail: "not_found" }, { status: 404 });
  const token = (await cookies()).get("fruitful_access_token")?.value;
  if (!publicRoute && !token)
    return NextResponse.json({ detail: "sign_in_required" }, { status: 401 });
  const origin = req.headers.get("origin");
  if (req.method === "POST" && origin) {
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
  if (req.method === "POST") {
    if (Number(req.headers.get("content-length") || 0) > 1_500_000)
      return NextResponse.json({ detail: "photo_size" }, { status: 413 });
    body = await req.text();
    if (body.length > 1_500_000)
      return NextResponse.json({ detail: "photo_size" }, { status: 413 });
  }
  try {
    const upstream = await fetch(`${getApiOrigin()}/discovery/${operation}`, {
      method: req.method,
      headers: {
        ...(token && !publicRoute ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
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
