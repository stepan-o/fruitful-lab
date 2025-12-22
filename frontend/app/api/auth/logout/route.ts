// frontend/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

const COOKIE_NAME = "fruitful_access_token";

export async function POST() {
    const res = NextResponse.json({ success: true });

    // Clear cookie by expiring it (match login attributes for reliability)
    res.cookies.set({
        name: COOKIE_NAME,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    return res;
}
