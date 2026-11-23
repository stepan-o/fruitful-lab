import { NextRequest, NextResponse } from "next/server";
import { accountProxy } from "@/lib/accounts/proxy";
async function handle(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await context.params;
  const part = path.join("/");
  const allowed =
    req.method === "GET"
      ? !part
      : req.method === "PATCH"
        ? /^\d+$/.test(part)
        : !part || /^\d+\/setup-link$/.test(part);
  if (!allowed)
    return NextResponse.json({ detail: "not_found" }, { status: 404 });
  const search = new URLSearchParams();
  if (req.method === "GET")
    for (const key of ["search", "offset", "game_only"]) {
      const value = req.nextUrl.searchParams.get(key);
      if (value !== null) search.set(key, value);
    }
  return accountProxy(
    req,
    `/admin/users${part ? `/${part}` : ""}${search.size ? `?${search}` : ""}`,
    true,
  );
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
