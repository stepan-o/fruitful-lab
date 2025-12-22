// frontend/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { applyExperimentCookies } from "@/lib/growthbook/middleware";

const COOKIE_NAME = "fruitful_access_token";

/**
 * PROTECTED_PATHS must match your *actual* URL paths.
 *
 * With your current repo layout:
 * - frontend/app/(contractor)/cont/page.tsx                => /cont
 * - frontend/app/(contractor)/cont/fruitful-qa/page.tsx    => /cont/fruitful-qa
 *
 * So we protect /cont (which implicitly protects all /cont/*).
 */
const PROTECTED_PATHS = ["/dashboard", "/cont"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = PROTECTED_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
    );

    const shouldRunExperiments = pathname.startsWith("/tools/pinterest-potential");

    if (!isProtected) {
        const res = NextResponse.next();
        if (shouldRunExperiments) {
            await applyExperimentCookies(req, res);
        }
        return res;
    }

    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        // Preserve full intended return URL: pathname + search
        loginUrl.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    const res = NextResponse.next();
    if (shouldRunExperiments) {
        await applyExperimentCookies(req, res);
    }
    return res;
}

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",

        // Contractor area (your current layout)
        "/cont",
        "/cont/:path*",

        // Growthbook experiment cookie injection
        "/tools/pinterest-potential",
        "/tools/pinterest-potential/:path*",
    ],
};
