type SubscribeFormType = "newsletter" | "fit-check" | "resource-interest" | "readiness-check";

type MailerLiteEnv = {
  MAILERLITE_API_TOKEN?: string;
  MAILERLITE_READINESS_CHECK_GROUP_ID?: string;
};

type PagesFunctionContext = {
  request: Request;
  env: MailerLiteEnv;
};

type SubscribePayload = {
  formType?: SubscribeFormType;
  email?: string;
  name?: string;
  website?: string;
  signupPage?: string;
  leadSource?: string;
  resourceInterest?: string;
  fields?: Record<string, string | number | boolean | null | undefined>;
  company?: string;
};

const GROUP_IDS: Record<Exclude<SubscribeFormType, "readiness-check">, string> = {
  newsletter: "188485775639184896",
  "fit-check": "188485791451710888",
  "resource-interest": "188485805978682885",
};

const FORM_TYPES = new Set<SubscribeFormType>(["newsletter", "fit-check", "resource-interest", "readiness-check"]);

const ALLOWED_FIELD_KEYS = new Set([
  "website",
  "lead_source",
  "signup_page",
  "resource_interest",
  "fit_result",
  "fit_score",
  "fit_max_score",
  "fit_goal",
  "fit_offer_readiness",
  "fit_content_readiness",
  "fit_website_readiness",
  "fit_support_interest",
  "fit_ads_interest",
  "pinterest_readiness_result",
  "readiness_score",
  "readiness_max_score",
  "readiness_outcome",
  "readiness_role_key",
  "top_reason_1",
  "top_reason_2",
  "top_reason_3",
  "pinterest_role",
  "recommended_next_step",
]);

const READINESS_FIELD_LABELS: Record<string, string> = {
  pinterest_readiness_result: "Pinterest Readiness Result",
  readiness_score: "Readiness Score",
  readiness_max_score: "Readiness Max Score",
  readiness_outcome: "Readiness Outcome",
  readiness_role_key: "Readiness Role Key",
  top_reason_1: "Top Reason 1",
  top_reason_2: "Top Reason 2",
  top_reason_3: "Top Reason 3",
  pinterest_role: "Pinterest Role",
  recommended_next_step: "Recommended Next Step",
};

type MailerLiteField = {
  key?: string;
  name?: string;
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

function cleanEmail(value: unknown) {
  const email = cleanString(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function cleanFields(payload: SubscribePayload) {
  const fields: Record<string, string | number> = {};
  const submittedFields = payload.fields ?? {};

  for (const [key, value] of Object.entries(submittedFields)) {
    if (!ALLOWED_FIELD_KEYS.has(key) || value === null || value === undefined || typeof value === "boolean") {
      continue;
    }

    fields[key] = typeof value === "number" ? value : cleanString(value);
  }

  const website = cleanString(payload.website);
  const signupPage = cleanString(payload.signupPage);
  const leadSource = cleanString(payload.leadSource) || "fruitful-pin-website";
  const resourceInterest = cleanString(payload.resourceInterest);

  if (website) {
    fields.website = website;
  }

  if (signupPage) {
    fields.signup_page = signupPage;
  }

  fields.lead_source = leadSource;

  if (resourceInterest) {
    fields.resource_interest = resourceInterest;
  }

  return fields;
}

function getGroupId(formType: SubscribeFormType, env: MailerLiteEnv) {
  if (formType === "readiness-check") {
    return cleanString(env.MAILERLITE_READINESS_CHECK_GROUP_ID) || GROUP_IDS["resource-interest"];
  }

  return GROUP_IDS[formType];
}

function normalizeFieldLookup(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function extractMailerLiteFields(body: unknown): MailerLiteField[] {
  if (!body || typeof body !== "object") {
    return [];
  }

  const maybeData = (body as { data?: unknown }).data;

  if (Array.isArray(maybeData)) {
    return maybeData.filter((field): field is MailerLiteField => Boolean(field && typeof field === "object"));
  }

  if ("key" in body || "name" in body) {
    return [body as MailerLiteField];
  }

  if (maybeData && typeof maybeData === "object") {
    return [maybeData as MailerLiteField];
  }

  return [];
}

async function getMailerLiteFields(token: string) {
  const response = await fetch("https://connect.mailerlite.com/api/fields?limit=100", {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  return extractMailerLiteFields(await response.json().catch(() => null));
}

async function createMailerLiteField(token: string, name: string) {
  const response = await fetch("https://connect.mailerlite.com/api/fields", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      type: "text",
    }),
  });

  if (!response.ok) {
    return undefined;
  }

  return extractMailerLiteFields(await response.json().catch(() => null))[0];
}

async function resolveReadinessFieldKeys(token: string, fields: Record<string, string | number>) {
  const readinessKeys = Object.keys(fields).filter((key) => READINESS_FIELD_LABELS[key]);

  if (readinessKeys.length === 0) {
    return fields;
  }

  const existingFields = await getMailerLiteFields(token);
  const resolvedFields = { ...fields };

  for (const fallbackKey of readinessKeys) {
    const label = READINESS_FIELD_LABELS[fallbackKey];
    const matchingField = existingFields.find((field) => {
      if (field.key === fallbackKey) {
        return true;
      }

      return field.name ? normalizeFieldLookup(field.name) === normalizeFieldLookup(label) : false;
    });

    if (matchingField?.key) {
      if (matchingField.key !== fallbackKey) {
        resolvedFields[matchingField.key] = resolvedFields[fallbackKey];
        delete resolvedFields[fallbackKey];
      }
      continue;
    }

    const createdField = await createMailerLiteField(token, label);

    if (createdField?.key && createdField.key !== fallbackKey) {
      resolvedFields[createdField.key] = resolvedFields[fallbackKey];
      delete resolvedFields[fallbackKey];
      continue;
    }

    if (!createdField?.key) {
      delete resolvedFields[fallbackKey];
    }
  }

  return resolvedFields;
}

export async function onRequestPost(context: PagesFunctionContext) {
  const token = context.env.MAILERLITE_API_TOKEN;

  if (!token) {
    return jsonResponse({ ok: false, message: "MailerLite is not configured yet." }, 500);
  }

  let payload: SubscribePayload;

  try {
    payload = (await context.request.json()) as SubscribePayload;
  } catch {
    return jsonResponse({ ok: false, message: "Please submit the form again." }, 400);
  }

  if (payload.company) {
    return jsonResponse({ ok: true });
  }

  const formType = payload.formType;
  const email = cleanEmail(payload.email);
  const name = cleanString(payload.name);

  if (!formType || !FORM_TYPES.has(formType)) {
    return jsonResponse({ ok: false, message: "This signup form is not configured yet." }, 400);
  }

  if (!email) {
    return jsonResponse({ ok: false, message: "Please enter a valid email address." }, 400);
  }

  let fields = cleanFields(payload);

  if (name) {
    fields.name = name;
  }

  fields = await resolveReadinessFieldKeys(token, fields);

  const groupId = getGroupId(formType, context.env);
  const subscriberPayload: {
    email: string;
    fields: Record<string, string | number>;
    status: "active";
    groups?: string[];
  } = {
    email,
    fields,
    status: "active",
  };

  if (groupId) {
    subscriberPayload.groups = [groupId];
  }

  const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subscriberPayload),
  });

  if (!response.ok) {
    return jsonResponse(
      {
        ok: false,
        message: "Something went sideways. Please try again or email hello@fruitfulpin.com.",
      },
      response.status >= 500 ? 502 : 400,
    );
  }

  return jsonResponse({ ok: true });
}

export function onRequest() {
  return jsonResponse({ ok: false, message: "Method not allowed." }, 405);
}
