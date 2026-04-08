// frontend/lib/flash.ts

export type FlashReason =
    | "login_failed"
    | "login_success"
    | "logged_out"
    | "auth_required"
    | "session_expired"
    | "auth_unavailable"
    | "auth_misconfig";

export function isFlashReason(v: string | null): v is FlashReason {
    return v === "login_failed" || v === "login_success" || v === "logged_out" || v === "auth_required" || v === "session_expired" || v === "auth_unavailable" || v === "auth_misconfig";
}
