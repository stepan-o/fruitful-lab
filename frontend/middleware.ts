import { NextRequest, NextResponse } from "next/server";
import { applyExperimentCookies } from "@/lib/growthbook/middleware";

const COOKIE_NAME = "fruitful_access_token";

// Paths that require auth
const PROTECTED_PATHS = ["/dashboard"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = PROTECTED_PATHS.some((p) =>
        pathname === p || pathname.startsWith(`${p}/`),
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
        loginUrl.searchParams.set("next", pathname);
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
        "/dashboard/:path*",
        "/dashboard",
        "/tools/pinterest-potential",
        "/tools/pinterest-potential/:path*",
    ],
};
