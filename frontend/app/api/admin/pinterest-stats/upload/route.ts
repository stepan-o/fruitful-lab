// frontend/app/api/admin/pinterest-stats/upload/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const COOKIE_NAME = "fruitful_access_token";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, detail: "Not authenticated" },
            { status: 401 },
        );
    }

    // Incoming request is multipart/form-data from the browser.
    let form: FormData;
    try {
        form = await req.formData();
    } catch {
        return NextResponse.json(
            { success: false, detail: "Invalid form data" },
            { status: 400 },
        );
    }

    const accountName = form.get("account_name");
    const file = form.get("file");

    if (typeof accountName !== "string" || !accountName.trim()) {
        return NextResponse.json(
            { success: false, detail: "account_name is required" },
            { status: 400 },
        );
    }

    if (!(file instanceof File)) {
        return NextResponse.json(
            { success: false, detail: "file is required" },
            { status: 400 },
        );
    }

    // Forward multipart to FastAPI as-is (still FormData).
    const upstream = new FormData();
    upstream.set("account_name", accountName.trim());
    upstream.set("file", file, file.name);

    const resp = await fetch(`${API_BASE_URL}/admin/pinterest-stats/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            // NOTE: do NOT manually set Content-Type for FormData;
            // fetch will set the boundary correctly.
        },
        body: upstream,
        cache: "no-store",
    });

    const payload = await resp.json().catch(() => null);

    if (!resp.ok) {
        return NextResponse.json(
            {
                success: false,
                detail: payload?.detail ?? "Upload failed",
            },
            { status: resp.status },
        );
    }

    return NextResponse.json({ success: true, ...payload });
}
