// frontend/lib/auth.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "fruitful_access_token";
const API_BASE_URL = getApiOrigin();

export type CurrentUser = {
  id: number;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  is_active: boolean;
  groups: string[];
};

/**
 * Server-side helper to read the current user using the auth cookie.
 * Returns null if there is no token or the token is invalid/expired.
 * Never throws; fetch/network errors yield null.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as CurrentUser;
    return data;
  } catch {
    return null;
  }
}

export function getApiOrigin() {
    const raw = process.env.API_BASE_URL

    if (!raw) {
        throw new Error("API_BASE_URL not set")
    }

    // optional: for debugging
    // console.log("API:", raw);

    // enforces "absolute URL with scheme" (must include http:// or https://)
    return new URL(raw).origin;
}
