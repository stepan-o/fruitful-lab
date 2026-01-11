// frontend/app/(flow)/tools/pinterest-potential/page.tsx
// Version-switching entry point for the Pinterest Potential Calculator flow.

import {
    DEFAULT_VARIANT,
    ALL_VARIANTS,
    type PinterestPotentialVariant,
    PINTEREST_POTENTIAL_VARIANT_COOKIE,
} from "@/lib/tools/pinterestPotentialConfig";

import { PinterestPotentialV1 } from "@/components/tools/pinterestPotential/PinterestPotentialV1";
import { PinterestPotentialV2 } from "@/components/tools/pinterestPotential/PinterestPotentialV2";

import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { resolveLeadMode } from "@/lib/tools/pinterestPotential/leadMode";
import { resolveLeadFromToken } from "@/lib/tools/pinterestPotential/leadToken";
import type { Lead } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import type { ComponentType } from "react";

// This page must be dynamic to respect query param overrides like ?variant=no_welcome
export const dynamic = "force-dynamic";

type VariantProps = {
    leadMode: ReturnType<typeof resolveLeadMode>;
    initialLead?: Lead;
};

const VARIANT_COMPONENTS: Record<PinterestPotentialVariant, ComponentType<VariantProps>> = {
    welcome: PinterestPotentialV1,
    no_welcome: PinterestPotentialV2,
};

type PageProps = {
    searchParams?: { variant?: string; leadMode?: string; t?: string };
};

export default async function PinterestPotentialPage({ searchParams }: PageProps) {
    // Read the cookie set by middleware-based assignment
    const cookieStore = await cookies();
    const cookieVariant = cookieStore.get(PINTEREST_POTENTIAL_VARIANT_COOKIE)?.value;
    const requestedVariant = searchParams?.variant;
    const variant = resolvePinterestPotentialVariant(requestedVariant, cookieVariant);

    // Lead mode resolution
    const user = await getCurrentUser();
    const token = searchParams?.t;
    const tokenLead: Lead | undefined = await resolveLeadFromToken(token);

    const isKnownLead = !!user || !!tokenLead;

    const cookieLeadMode = cookieStore.get("ppc_lead_mode")?.value; // optional future cookie
    const leadMode = resolveLeadMode({
        requested: searchParams?.leadMode,
        cookieValue: cookieLeadMode,
        isKnownLead,
    });

    const initialLead: Lead | undefined = tokenLead
        ? tokenLead
        : user
            ? { name: user.full_name || user.email.split("@")[0], email: user.email }
            : undefined;

    const VariantComponent = VARIANT_COMPONENTS[variant];
    return <VariantComponent leadMode={leadMode} initialLead={initialLead} />;
}

/**
 * Variant resolution order for the calculator (no GrowthBook calls here):
 * 1) If a valid ?variant= is provided, honor it (debug/QA override).
 * 2) Otherwise, if a valid cookie value exists, use it (middleware-assigned).
 * 3) Otherwise, fall back to DEFAULT_VARIANT.
 */
export function resolvePinterestPotentialVariant(
    requested?: string,
    cookieValue?: string,
): PinterestPotentialVariant {
    const reqNorm = normalizeVariant(requested);
    if (reqNorm) return reqNorm;

    const cookieNorm = normalizeVariant(cookieValue);
    if (cookieNorm) return cookieNorm;

    return DEFAULT_VARIANT;
}

function isPinterestPotentialVariant(v: string): v is PinterestPotentialVariant {
    return (ALL_VARIANTS as readonly string[]).includes(v);
}

export function normalizeVariant(value?: string): PinterestPotentialVariant | undefined {
    if (!value) return undefined;
    const lower = value.toLowerCase();
    return isPinterestPotentialVariant(lower) ? lower : undefined;
}