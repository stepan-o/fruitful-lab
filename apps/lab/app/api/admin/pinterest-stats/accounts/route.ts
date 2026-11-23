import { NextRequest, NextResponse } from "next/server";
import { getApiOrigin } from "@/lib/auth";

const COOKIE_NAME = "fruitful_access_token";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.json({ error: "unauthorized"}, { status: 401 });
    }

    const apiOrigin = getApiOrigin();
    const url = new URL("/admin/pinterest-stats/accounts", apiOrigin);

    const upstream = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    const body = await upstream.text();

    return new NextResponse(body, {
        status: upstream.status,
        headers: {
            "content-type": upstream.headers.get("content-type") ?? "application/json",
            "cache-control": "no-store",
        }
    });
}