import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "fruitful_access_token";

// Paths that require auth
const PROTECTED_PATHS = ["/dashboard"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = PROTECTED_PATHS.some((p) =>
        pathname === p || pathname.startsWith(`${p}/`),
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/dashboard"],
};
