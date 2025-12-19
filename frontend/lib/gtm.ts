"use client";

export type GTMEventParams = Record<string, unknown>;

function getDataLayer(): Array<Record<string, unknown>> | null {
    if (typeof window === "undefined") return null;
    window.dataLayer ??= [];
    return window.dataLayer;
}

export function pushEvent(eventName: string, params: GTMEventParams = {}): void {
    const dl = getDataLayer();
    if (!dl) return;
    dl.push({ event: eventName, ...params });
}

export function trackToolView(tool_name: string, location: string): void {
    pushEvent("tool_view", { tool_name, location });
}

export function trackToolStart(tool_name: string, location: string): void {
    pushEvent("tool_start", { tool_name, location });
}

export function trackLeadSubmit(params: {
    location: string;
    button_label: string;
    tool_name?: string;
}): void {
    pushEvent("lead_submit", params);
}

export function trackCtaClick(
    button_label: string,
    extras?: { location?: string; tool_name?: string }
): void {
    const location =
        extras?.location ?? (typeof window !== "undefined" ? window.location.pathname : "");
    pushEvent("cta_click", {
        button_label,
        location,
        ...(extras?.tool_name ? { tool_name: extras.tool_name } : {}),
    });
}
