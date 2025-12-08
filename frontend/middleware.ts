import { NextRequest, NextResponse } from "next/server";
// Future experiments (currently no-op helper):
// import { applyExperimentCookies } from "@/lib/growthbook/middleware";

const COOKIE_NAME = "fruitful_access_token";

// Paths that require auth
const PROTECTED_PATHS = ["/dashboard"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = PROTECTED_PATHS.some((p) =>
        pathname === p || pathname.startsWith(`${p}/`),
    );

    if (!isProtected) {
        // For now, we don’t run any experiments in middleware.
        // Future-us: uncomment this when we’re ready to assign variants here.
        //
        // const res = NextResponse.next();
        // return applyExperimentCookies(req, res);
        //
        return NextResponse.next();
    }

    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Same note as above – keep experiments separate from auth redirects.
    // const res = NextResponse.next();
    // return applyExperimentCookies(req, res);
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/dashboard"],
};
