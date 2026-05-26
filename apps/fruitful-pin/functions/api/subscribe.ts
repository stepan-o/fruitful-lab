type SubscribeFormType = "newsletter" | "fit-check" | "resource-interest";

type MailerLiteEnv = {
  MAILERLITE_API_TOKEN?: string;
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

const GROUP_IDS: Record<SubscribeFormType, string> = {
  newsletter: "188485775639184896",
  "fit-check": "188485791451710888",
  "resource-interest": "188485805978682885",
};

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
]);

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
  const groupId = formType ? GROUP_IDS[formType] : undefined;
  const email = cleanEmail(payload.email);
  const name = cleanString(payload.name);

  if (!groupId || !formType) {
    return jsonResponse({ ok: false, message: "This signup form is not configured yet." }, 400);
  }

  if (!email) {
    return jsonResponse({ ok: false, message: "Please enter a valid email address." }, 400);
  }

  const fields = cleanFields(payload);

  if (name) {
    fields.name = name;
  }

  const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email,
      fields,
      groups: [groupId],
      status: "active",
    }),
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
