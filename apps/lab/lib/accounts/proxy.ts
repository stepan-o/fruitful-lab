import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiOrigin } from "@/lib/auth";

export async function accountProxy(
  req: NextRequest,
  path: string,
  authenticated: boolean,
) {
  const token = (await cookies()).get("fruitful_access_token")?.value;
  const headers = {
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
  };
  const error = (detail: string, status: number) =>
    NextResponse.json({ detail }, { status, headers });
  if (authenticated && !token) return error("sign_in_required", 401);
  if (req.method !== "GET") {
    const origin = req.headers.get("origin");
    try {
      if (origin && new URL(origin).host !== req.headers.get("host"))
        return error("origin_forbidden", 403);
    } catch {
      return error("origin_forbidden", 403);
    }
    if (Number(req.headers.get("content-length") || 0) > 8192)
      return error("request_too_large", 413);
  }
  try {
    const body = req.method === "GET" ? undefined : await req.text();
    if (body && body.length > 8192) return error("request_too_large", 413);
    const response = await fetch(`${getApiOrigin()}${path}`, {
      method: req.method,
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
      headers: {
        ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body,
    });
    const data = await response
      .json()
      .catch(() => ({ detail: "service_unavailable" }));
    if (response.status >= 500 && data.detail !== "email_unavailable")
      return error("service_unavailable", 503);
    return NextResponse.json(data, { status: response.status, headers });
  } catch {
    return error("service_unavailable", 503);
  }
}
