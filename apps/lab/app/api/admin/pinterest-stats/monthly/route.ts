// frontend/app/api/admin/pinterest-stats/monthly/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiOrigin } from "@/lib/auth";

const API_BASE_URL = getApiOrigin();

const COOKIE_NAME = "fruitful_access_token";

export async function GET(req: NextRequest) {

    const accountName = req.nextUrl.searchParams.get("account_name")?.trim() ?? "";

    if (!accountName) {
        return NextResponse.json(
            { success: false, detail: "account_name is required" },
            { status: 400 },
        );
    }

    const apiOrigin = getApiOrigin();
    const url = new URL("/admin/pinterest-stats/monthly", apiOrigin);
    url.searchParams.set("account_name", accountName);

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, detail: "Not authenticated" },
            { status: 401 },
        );
    }

    // const url = new URL(req.url);
    // const accountName = (url.searchParams.get("account_name") || "").trim();

    const upstreamUrl = new URL(
        `${API_BASE_URL}/admin/pinterest-stats/monthly`,
    );
    upstreamUrl.searchParams.set("account_name", accountName);

    const resp = await fetch(upstreamUrl.toString(), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    const payload = await resp.json().catch(() => null);

    if (!resp.ok) {
        return NextResponse.json(
            { success: false, detail: payload?.detail ?? "Request failed" },
            { status: resp.status },
        );
    }

    // FastAPI returns a list of rows; we wrap it consistently.
    return NextResponse.json({ success: true, rows: payload });
}
