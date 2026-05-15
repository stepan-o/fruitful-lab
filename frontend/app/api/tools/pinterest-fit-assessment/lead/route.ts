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

type PinterestFitLeadPayload = {
    email?: unknown;
    result?: unknown;
    source?: unknown;
};

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

export async function POST(request: Request) {
    let payload: PinterestFitLeadPayload;

    try {
        payload = (await request.json()) as PinterestFitLeadPayload;
    } catch {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    const source = typeof payload.source === "string" && payload.source.trim() ? payload.source.trim() : PINTEREST_FIT_LEAD_SOURCE;

    if (!isValidEmail(email) || !isPinterestFitResultLabel(payload.result)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    const groupId = process.env.MAILERLITE_PINTEREST_FIT_GROUP_ID ?? PINTEREST_FIT_MAILERLITE_DEFAULT_GROUP_ID;

    if (!apiKey || !groupId) {
        return NextResponse.json({ error: "Email capture is not configured" }, { status: 503 });
    }

    const [resultFieldKey, sourceFieldKey] = await Promise.all([
        fetchMailerLiteFieldKey({
            apiKey,
            fieldName: PINTEREST_FIT_MAILERLITE_FIELDS.result.name,
            fallbackKey: PINTEREST_FIT_MAILERLITE_FIELDS.result.fallbackKey,
        }),
        fetchMailerLiteFieldKey({
            apiKey,
            fieldName: PINTEREST_FIT_MAILERLITE_FIELDS.source.name,
            fallbackKey: PINTEREST_FIT_MAILERLITE_FIELDS.source.fallbackKey,
        }),
    ]);

    const subscribeResponse = await fetch(`${MAILERLITE_API_BASE_URL}/subscribers`, {
        method: "POST",
        headers: mailerLiteHeaders(apiKey),
        body: JSON.stringify({
            email,
            groups: [groupId],
            fields: {
                [resultFieldKey]: payload.result,
                [sourceFieldKey]: source,
            },
        }),
    });

    if (!subscribeResponse.ok) {
        return NextResponse.json({ error: "Email capture failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
}
