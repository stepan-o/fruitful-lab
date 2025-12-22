// frontend/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const COOKIE_NAME = "fruitful_access_token";

// Canonical landing routes (server authority)
const DEFAULT_ADMIN_LANDING = "/dashboard";
const DEFAULT_CONTRACTOR_LANDING = "/contractor";
const DEFAULT_GENERAL_LANDING = "/tools";

type MeResponse = {
    is_admin: boolean;
    groups: string[];
};

function isSafeNext(next: unknown): next is string {
    return (
        typeof next === "string" &&
        next.startsWith("/") &&
        !next.startsWith("//")
    );
}

function isAllowedNextForRole(nextPath: string, role: "admin" | "contractor" | "general") {
    // NOTE: tighten/expand as policy evolves.
    if (role === "admin") {
        return (
            nextPath === "/dashboard" ||
            nextPath.startsWith("/dashboard/") ||
            nextPath === "/tools" ||
            nextPath.startsWith("/tools/") ||
            nextPath === "/contractor" ||
            nextPath.startsWith("/contractor/")
        );
    }

    if (role === "contractor") {
        return nextPath === "/contractor" || nextPath.startsWith("/contractor/");
    }

    // general
    return nextPath === "/tools" || nextPath.startsWith("/tools/");
}

function appendQueryParam(pathWithQuery: string, key: string, value: string) {
    // Works for relative paths by providing a dummy base.
    const u = new URL(pathWithQuery, "http://localhost");
    u.searchParams.set(key, value);
    const out = u.pathname + u.search;
    return out;
}

function roleDefault(role: "admin" | "contractor" | "general") {
    if (role === "admin") return DEFAULT_ADMIN_LANDING;
    if (role === "contractor") return DEFAULT_CONTRACTOR_LANDING;
    return DEFAULT_GENERAL_LANDING;
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
        return NextResponse.json(
            { success: false, detail: "Email and password are required", redirectTo: "/tools?flash=login_failed" },
            { status: 400 },
        );
    }

    // 1) Authenticate against backend /auth/login
    const loginUrl = `${API_BASE_URL}/auth/login`;

    const params = new URLSearchParams();
    params.set("username", body.email);
    params.set("password", body.password);

    const resp = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });

    if (!resp.ok) {
        const detail = (await resp.json().catch(() => null)) ?? {};
        // Contract: deterministic failure nav target
        return NextResponse.json(
            {
                success: false,
                detail: detail.detail ?? "Invalid email or password. Please try again.",
                redirectTo: "/tools?flash=login_failed",
            },
            { status: 401 },
        );
    }

    const data = await resp.json();
    const token = data.access_token as string;

    // 2) Set cookie (server authority)
    // NOTE: cookie must be set on the same response we return.
    // We'll compute redirectTo first, but cookie will be attached to the final response.
    let role: "admin" | "contractor" | "general" = "general";

    // 3) Identify role via /auth/me using the freshly issued token
    try {
        const meResp = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (meResp.ok) {
            const me = (await meResp.json()) as MeResponse;
            const groups = Array.isArray(me.groups) ? me.groups : [];
            if (me.is_admin) role = "admin";
            else if (groups.includes("contractor")) role = "contractor";
            else role = "general";
        } else {
            // fail-closed to least privilege
            role = "general";
        }
    } catch {
        // fail-closed to least privilege
        role = "general";
    }

    // 4) Decide redirect target: allowed next OR role default
    const requestedNext = isSafeNext(body.next) ? body.next : null;

    let redirectTo = roleDefault(role);

    if (requestedNext && isAllowedNextForRole(requestedNext, role)) {
        redirectTo = requestedNext;
    }

    // 5) Flash behavior:
    // - success should show a banner only on /tools (as per your desired UX)
    if (redirectTo === "/tools" || redirectTo.startsWith("/tools/")) {
        redirectTo = appendQueryParam(redirectTo, "flash", "login_success");
    }

    const res = NextResponse.json({ success: true, redirectTo });

    res.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 4, // 4 hours
    });

    return res;
}