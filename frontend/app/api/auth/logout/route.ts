// frontend/app/api/auth/logout/route.ts

import { NextResponse } from "next/server";

const COOKIE_NAME = "fruitful_access_token";

export async function POST() {
    const res = NextResponse.json({ success: true });
    // Clear cookie by setting maxAge=0
    res.cookies.set({
        name: COOKIE_NAME,
        value: "",
        maxAge: 0,
        path: "/",
    });
    return res;
}
