// frontend/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const COOKIE_NAME = "fruitful_access_token";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
        return NextResponse.json(
            { detail: "Email and password are required" },
            { status: 400 },
        );
    }

    const loginUrl = `${API_BASE_URL}/auth/login`;

    const params = new URLSearchParams();
    params.set("username", body.email);
    params.set("password", body.password);

    const resp = await fetch(loginUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    if (!resp.ok) {
        const detail = (await resp.json().catch(() => null)) ?? {};
        return NextResponse.json(
            {
                detail:
                    detail.detail ?? "Invalid email or password. Please try again.",
            },
            { status: 401 },
        );
    }

    const data = await resp.json();
    const token = data.access_token as string;

    const nextUrl =
        typeof body.next === "string" && body.next.startsWith("/")
            ? body.next
            : "/dashboard";

    const res = NextResponse.json({ success: true, redirectTo: nextUrl });

    res.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 4, // 4 hours, adjust later if needed
    });

    return res;
}
