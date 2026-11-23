// frontend/lib/utils/http.ts

export function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Something went wrong when parsing the error.";
}

export async function safeJson(res: Response): Promise<unknown> {
    try {
        return await res.json();
    } catch {
        return null;
    }
}

export type UploadResponse = {
    inserted?: number;
    updated?: number;
    detail?: string;
}

export function parseUploadResponse(x: unknown): UploadResponse {
    if (typeof x !== "object" || x === null) return {};
    const obj = x as Record<string, unknown>;
    return {
        inserted: typeof obj.inserted === "number" ? obj.inserted: undefined,
        updated: typeof obj.updated === "number" ? obj.updated: undefined,
        detail: typeof obj.detail === "string" ? obj.detail: undefined,
    };
}