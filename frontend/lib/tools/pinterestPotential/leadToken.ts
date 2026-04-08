// frontend/lib/tools/pinterestPotential/leadToken.ts
import type { Lead } from "./pinterestPotentialSpec";

function isEmail(s: string): boolean {
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(s);
}

function decodeBase64Url(input: string): string | null {
    try {
        // base64url -> base64
        const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
        const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
        const normalized = b64 + pad;

        // browser-safe decode
        const decoded = typeof atob === "function"
            ? atob(normalized)
            : Buffer.from(normalized, "base64").toString("utf8"); // node fallback

        return decoded;
    } catch {
        return null;
    }
}

/**
 * v0.2: Known lead can be derived from a valid lead token in URL.
 * This is still a stub unless you add server verification/signing.
 */
export async function resolveLeadFromToken(token?: string): Promise<Lead | undefined> {
    if (!token) return undefined;

    // Optional explicit demo token for QA
    if (token === "demo") return { name: "Demo User", email: "demo@example.com" };

    // Accept base64/base64url encoding of "email:name" or just "email"
    const decoded = decodeBase64Url(token);
    if (!decoded) return undefined;

    const [emailRaw, nameRaw] = decoded.split(":");
    const email = (emailRaw ?? "").trim();
    const name = (nameRaw ?? "").trim();

    if (!isEmail(email)) return undefined;

    // name is optional
    return name ? { email, name } : { email };
}
