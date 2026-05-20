import { NextResponse } from "next/server";

import {
    PINTEREST_FIT_LEAD_SOURCE,
    PINTEREST_FIT_MAILERLITE_DEFAULT_GROUP_ID,
    PINTEREST_FIT_MAILERLITE_FIELDS,
    isPinterestFitResultLabel,
} from "@/lib/tools/pinterestFit/mailerLite";

const MAILERLITE_API_BASE_URL = "https://connect.mailerlite.com/api";

type MailerLiteField = {
    key?: string;
    name?: string;
};

type MailerLiteFieldsResponse = {
    data?: MailerLiteField[];
};

type MailerLiteFieldResponse = {
    data?: MailerLiteField;
};

type MailerLiteSubscriber = {
    id?: string;
    fields?: Record<string, unknown>;
};

type MailerLiteSubscriberResponse = {
    data?: MailerLiteSubscriber;
};

type PinterestFitLeadPayload = {
    email?: unknown;
    result?: unknown;
    topReason1?: unknown;
    topReason2?: unknown;
    topReason3?: unknown;
    pinterestRole?: unknown;
    recommendedNextStep?: unknown;
    source?: unknown;
};

type PinterestFitLeadFields = Record<string, string>;

const PINTEREST_FIT_PERSONALIZATION_HEADERS = {
    topReason1: "x-pinterest-fit-top-reason-1",
    topReason2: "x-pinterest-fit-top-reason-2",
    topReason3: "x-pinterest-fit-top-reason-3",
    pinterestRole: "x-pinterest-fit-role",
    recommendedNextStep: "x-pinterest-fit-recommended-next-step",
} as const;

function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function mailerLiteHeaders(apiKey: string) {
    return {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
    };
}

async function fetchMailerLiteFieldKey(params: {
    apiKey: string;
    fieldName: string;
    fallbackKey: string;
}) {
    const fieldsResponse = await fetch(`${MAILERLITE_API_BASE_URL}/fields?limit=100`, {
        headers: mailerLiteHeaders(params.apiKey),
    });

    if (!fieldsResponse.ok) {
        return params.fallbackKey;
    }

    const fields = (await fieldsResponse.json()) as MailerLiteFieldsResponse;
    const existingField = fields.data?.find((field) => {
        const nameMatches = field.name?.toLowerCase() === params.fieldName.toLowerCase();
        const keyMatches = field.key === params.fallbackKey;

        return nameMatches || keyMatches;
    });

    if (existingField?.key) {
        return existingField.key;
    }

    const createResponse = await fetch(`${MAILERLITE_API_BASE_URL}/fields`, {
        method: "POST",
        headers: mailerLiteHeaders(params.apiKey),
        body: JSON.stringify({
            name: params.fieldName,
            type: "text",
        }),
    });

    if (!createResponse.ok) {
        return params.fallbackKey;
    }

    const createdField = (await createResponse.json()) as MailerLiteFieldResponse;

    return createdField.data?.key ?? params.fallbackKey;
}

async function resolveMailerLiteSubscriberId(params: {
    apiKey: string;
    email: string;
    subscribeResponse: Response;
}) {
    const subscriber = (await params.subscribeResponse.json()) as MailerLiteSubscriberResponse;

    if (subscriber.data?.id) {
        return subscriber.data.id;
    }

    const lookupResponse = await fetch(`${MAILERLITE_API_BASE_URL}/subscribers/${encodeURIComponent(params.email)}`, {
        headers: mailerLiteHeaders(params.apiKey),
    });

    if (!lookupResponse.ok) {
        return null;
    }

    const lookupSubscriber = (await lookupResponse.json()) as MailerLiteSubscriberResponse;

    return lookupSubscriber.data?.id ?? null;
}

function normalizeOptionalText(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function decodeHeaderText(value: string | null) {
    if (!value) {
        return "";
    }

    try {
        return decodeURIComponent(value).trim();
    } catch {
        return value.trim();
    }
}

function hasSavedLeadFields(subscriber: MailerLiteSubscriber | undefined, fields: PinterestFitLeadFields) {
    return Object.entries(fields).every(([key, value]) => subscriber?.fields?.[key] === value);
}

export async function POST(request: Request) {
    let payload: PinterestFitLeadPayload;
    const requestHeaders = request.headers as Headers | undefined;

    try {
        payload = (await request.json()) as PinterestFitLeadPayload;
    } catch {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    const source = typeof payload.source === "string" && payload.source.trim() ? payload.source.trim() : PINTEREST_FIT_LEAD_SOURCE;
    const topReason1 =
        normalizeOptionalText(payload.topReason1) ||
        decodeHeaderText(requestHeaders?.get(PINTEREST_FIT_PERSONALIZATION_HEADERS.topReason1) ?? null);
    const topReason2 =
        normalizeOptionalText(payload.topReason2) ||
        decodeHeaderText(requestHeaders?.get(PINTEREST_FIT_PERSONALIZATION_HEADERS.topReason2) ?? null);
    const topReason3 =
        normalizeOptionalText(payload.topReason3) ||
        decodeHeaderText(requestHeaders?.get(PINTEREST_FIT_PERSONALIZATION_HEADERS.topReason3) ?? null);
    const pinterestRole =
        normalizeOptionalText(payload.pinterestRole) ||
        decodeHeaderText(requestHeaders?.get(PINTEREST_FIT_PERSONALIZATION_HEADERS.pinterestRole) ?? null);
    const recommendedNextStep =
        normalizeOptionalText(payload.recommendedNextStep) ||
        decodeHeaderText(requestHeaders?.get(PINTEREST_FIT_PERSONALIZATION_HEADERS.recommendedNextStep) ?? null);

    if (!isValidEmail(email) || !isPinterestFitResultLabel(payload.result)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    const groupId = process.env.MAILERLITE_PINTEREST_FIT_GROUP_ID ?? PINTEREST_FIT_MAILERLITE_DEFAULT_GROUP_ID;

    if (!apiKey || !groupId) {
        return NextResponse.json({ error: "Email capture is not configured" }, { status: 503 });
    }

    const requestedMailerLiteFields = [
        ["result", PINTEREST_FIT_MAILERLITE_FIELDS.result],
        ["source", PINTEREST_FIT_MAILERLITE_FIELDS.source],
        ...(topReason1 ? ([ ["topReason1", PINTEREST_FIT_MAILERLITE_FIELDS.topReason1] ] as const) : []),
        ...(topReason2 ? ([ ["topReason2", PINTEREST_FIT_MAILERLITE_FIELDS.topReason2] ] as const) : []),
        ...(topReason3 ? ([ ["topReason3", PINTEREST_FIT_MAILERLITE_FIELDS.topReason3] ] as const) : []),
        ...(pinterestRole ? ([ ["pinterestRole", PINTEREST_FIT_MAILERLITE_FIELDS.pinterestRole] ] as const) : []),
        ...(recommendedNextStep ? ([ ["recommendedNextStep", PINTEREST_FIT_MAILERLITE_FIELDS.recommendedNextStep] ] as const) : []),
    ] as const;

    const fieldEntries = await Promise.all(
        requestedMailerLiteFields.map(async ([id, field]) => {
            const key = await fetchMailerLiteFieldKey({
                apiKey,
                fieldName: field.name,
                fallbackKey: field.fallbackKey,
            });

            return [id, key] as const;
        }),
    );
    const fieldKeys = Object.fromEntries(fieldEntries) as Partial<Record<keyof typeof PINTEREST_FIT_MAILERLITE_FIELDS, string>>;

    const leadFields = {
        [fieldKeys.result ?? PINTEREST_FIT_MAILERLITE_FIELDS.result.fallbackKey]: payload.result,
        [fieldKeys.source ?? PINTEREST_FIT_MAILERLITE_FIELDS.source.fallbackKey]: source,
    };

    if (topReason1 && fieldKeys.topReason1) {
        leadFields[fieldKeys.topReason1] = topReason1;
    }

    if (topReason2 && fieldKeys.topReason2) {
        leadFields[fieldKeys.topReason2] = topReason2;
    }

    if (topReason3 && fieldKeys.topReason3) {
        leadFields[fieldKeys.topReason3] = topReason3;
    }

    if (pinterestRole && fieldKeys.pinterestRole) {
        leadFields[fieldKeys.pinterestRole] = pinterestRole;
    }

    if (recommendedNextStep && fieldKeys.recommendedNextStep) {
        leadFields[fieldKeys.recommendedNextStep] = recommendedNextStep;
    }

    const subscribeResponse = await fetch(`${MAILERLITE_API_BASE_URL}/subscribers`, {
        method: "POST",
        headers: mailerLiteHeaders(apiKey),
        body: JSON.stringify({
            email,
            groups: [groupId],
            fields: leadFields,
        }),
    });

    if (!subscribeResponse.ok) {
        return NextResponse.json({ error: "Email capture failed" }, { status: 502 });
    }

    const subscriberId = await resolveMailerLiteSubscriberId({
        apiKey,
        email,
        subscribeResponse,
    });

    if (!subscriberId) {
        return NextResponse.json({ error: "Email capture failed" }, { status: 502 });
    }

    const updateSubscriberResponse = await fetch(`${MAILERLITE_API_BASE_URL}/subscribers/${encodeURIComponent(subscriberId)}`, {
        method: "PUT",
        headers: mailerLiteHeaders(apiKey),
        body: JSON.stringify({
            fields: leadFields,
        }),
    });

    if (!updateSubscriberResponse.ok) {
        return NextResponse.json({ error: "Email capture failed" }, { status: 502 });
    }

    const assignGroupResponse = await fetch(
        `${MAILERLITE_API_BASE_URL}/subscribers/${encodeURIComponent(subscriberId)}/groups/${encodeURIComponent(groupId)}`,
        {
            method: "POST",
            headers: mailerLiteHeaders(apiKey),
        },
    );

    if (!assignGroupResponse.ok) {
        return NextResponse.json({ error: "Email capture failed" }, { status: 502 });
    }

    const verifySubscriberResponse = await fetch(`${MAILERLITE_API_BASE_URL}/subscribers/${encodeURIComponent(subscriberId)}`, {
        headers: mailerLiteHeaders(apiKey),
    });

    if (!verifySubscriberResponse.ok) {
        return NextResponse.json({ error: "Email capture failed" }, { status: 502 });
    }

    const verifiedSubscriber = (await verifySubscriberResponse.json()) as MailerLiteSubscriberResponse;

    if (!hasSavedLeadFields(verifiedSubscriber.data, leadFields)) {
        return NextResponse.json({ error: "Email capture failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
}
