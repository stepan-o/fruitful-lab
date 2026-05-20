// frontend/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { applyExperimentCookies } from "@/lib/growthbook/middleware";
import { getApiOrigin } from "@/lib/auth";
import type { FlashReason } from "@/lib/flash";
import { isFlashReason } from "@/lib/flash";
import { ENABLE_AB_SPLIT } from "@/lib/tools/pinterestPotentialConfig";

const API_BASE_URL = getApiOrigin();
const COOKIE_NAME = "fruitful_access_token";

const PROTECTED_PATHS = ["/admin", "/contractor"] as const;

type Role = "admin" | "contractor" | "general";

type MeResponse = {
    is_admin: boolean;
    groups: string[];
};

const DEFAULT_FLASH_REASON: FlashReason = "auth_required";

function toFlashReason(v: unknown, fallback: FlashReason = DEFAULT_FLASH_REASON): FlashReason {
    if (typeof v !== "string") return fallback;
    if (isFlashReason(v)) return v;

    // dev signal, but don't break prod redirects
    if (process.env.NODE_ENV !== "production") {
        console.warn(`[middleware] invalid flash reason: ${v} (fallback: ${fallback})`);
    }
    return fallback;
}

// --- helpers

function isProtectedPath(pathname: string) {
    return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isAdminPath(pathname: string) {
    return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isContractorPath(pathname: string) {
    return pathname === "/contractor" || pathname.startsWith("/contractor/");
}

function computeRole(me: MeResponse): Role {
    const groups = Array.isArray(me.groups) ? me.groups : [];
    if (me.is_admin) return "admin";
    if (groups.includes("contractor")) return "contractor";
    return "general";
}

function roleAllowedForPath(role: Role, pathname: string) {
    if (isAdminPath(pathname)) return role === "admin";
    if (isContractorPath(pathname)) return role === "admin" || role === "contractor";
    return true;
}

function redirectToLogin(req: NextRequest, reason: FlashReason) {
    const safeReason = toFlashReason(reason);

    const loginUrl = new URL("/login", req.url);

    // next = original path, but strip Next's internal param
    const nextUrl = req.nextUrl.clone();
    nextUrl.searchParams.delete("_rsc");

    const nextPath = nextUrl.pathname + (nextUrl.search || "");
    loginUrl.searchParams.set("next", nextPath);
    loginUrl.searchParams.set("flash", safeReason);

    const res = NextResponse.redirect(loginUrl);

    // helpful when UI isn't showing it yet
    res.headers.set("x-fw-auth-redirect", safeReason);

    if (reason !== safeReason) {
        res.headers.set("x-fw-auth-redirect-invalid", reason);
    }

    return res;
}

async function fetchMe(token: string): Promise<MeResponse | null> {
    try {
        const url = new URL("/auth/me", API_BASE_URL);
        const resp = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            // middleware runtime: keep it no-store
            cache: "no-store",
        });

        if (!resp.ok) return null;
        const me = (await resp.json()) as MeResponse;

        // defensive shape checks
        return {
            is_admin: me.is_admin,
            groups: Array.isArray(me.groups) ? me.groups : [],
        };
    } catch {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // GrowthBook cookie injection for the Pinterest Potential tool entry
    const shouldRunExperiments =
        ENABLE_AB_SPLIT && pathname.startsWith("/tools/pinterest-potential");

    // ---- PUBLIC ROUTES
    if (!isProtectedPath(pathname)) {
        const res = NextResponse.next();
        if (shouldRunExperiments) {
            await applyExperimentCookies(req, res);
        }
        return res;
    }

    // ---- PROTECTED ROUTES: must have token
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
        return redirectToLogin(req, "auth_required");
    }

    // ---- PROTECTED ROUTES: role check via backend /auth/me
    const me = await fetchMe(token);

    // invalid/expired token → clear cookie + login
    if (!me) {
        const res = redirectToLogin(req, "logged_out");
        res.cookies.set({
            name: COOKIE_NAME,
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });
        return res;
    }

    const role = computeRole(me);

    // role not allowed → route-safe redirect
    // (we don't send to login because they're already authenticated)
    if (!roleAllowedForPath(role, pathname)) {
        const target =
            role === "admin"
                ? "/admin/analytics"
                : role === "contractor"
                    ? "/contractor"
                    : "/tools";
        return NextResponse.redirect(new URL(target, req.url));
    }

    const res = NextResponse.next();

    // If you ever want experiments on protected routes too, move this outside the protected block.
    if (shouldRunExperiments) {
        await applyExperimentCookies(req, res);
    }

    return res;
}

export const config = {
    matcher: [
        "/admin",
        "/admin/:path*",

        // Contractor area
        "/contractor",
        "/contractor/:path*",

        // Growthbook experiment cookie injection
        "/tools/pinterest-potential",
        "/tools/pinterest-potential/:path*",
    ],
};
