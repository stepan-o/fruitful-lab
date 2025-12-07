// frontend/lib/auth.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "fruitful_access_token";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type CurrentUser = {
  id: number;
  email: string;
  full_name?: string | null;
  is_admin: boolean;
  is_active?: boolean;
};

/**
 * Server-side helper to read the current user using the auth cookie.
 * Returns null if there is no token or the token is invalid/expired.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const resp = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!resp.ok) {
      return null;
    }
    const user = (await resp.json()) as Partial<CurrentUser>;
    // Normalize is_admin to boolean
    const is_admin = Boolean((user as any)?.is_admin);
    return {
      id: (user.id as number) ?? 0,
      email: (user.email as string) ?? "",
      full_name: (user.full_name as string | null) ?? null,
      is_admin,
      is_active: Boolean((user as any)?.is_active),
    };
  } catch {
    return null;
  }
}
