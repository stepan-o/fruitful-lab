type ClickUpEnv = {
  CLICKUP_API_TOKEN?: string;
  CLICKUP_CONTACT_LIST_ID?: string;
};

type PagesFunctionContext = {
  request: Request;
  env: ClickUpEnv;
};

type ContactPayload = {
  name?: string;
  email?: string;
  website?: string;
  topic?: string;
  message?: string;
  signupPage?: string;
  company?: string;
};

type CleanContactPayload = {
  name: string;
  email: string;
  topic: string;
  message: string;
  website?: string;
  signupPage?: string;
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function cleanString(value: unknown, maxLength = 1000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanEmail(value: unknown) {
  const email = cleanString(value, 320).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function createTaskDescription(payload: CleanContactPayload) {
  return [
    "New Fruitful Pin contact form message.",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.website ? `Website / Brand: ${payload.website}` : "",
    `Topic: ${payload.topic}`,
    payload.signupPage ? `Submitted from: ${payload.signupPage}` : "",
    "",
    "Message:",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function onRequestPost(context: PagesFunctionContext) {
  const token = cleanString(context.env.CLICKUP_API_TOKEN, 500).replace(/^Bearer\s+/i, "");
  const listId = cleanString(context.env.CLICKUP_CONTACT_LIST_ID, 80);

  if (!token || !listId) {
    return jsonResponse({ ok: false, message: "The contact form is not configured yet. Please email hello@fruitfulpin.com." }, 500);
  }

  let payload: ContactPayload;

  try {
    payload = (await context.request.json()) as ContactPayload;
  } catch {
    return jsonResponse({ ok: false, message: "Please submit the form again." }, 400);
  }

  if (payload.company) {
    return jsonResponse({ ok: true });
  }

  const name = cleanString(payload.name, 120);
  const email = cleanEmail(payload.email);
  const website = cleanString(payload.website, 240);
  const topic = cleanString(payload.topic, 160) || "General question";
  const submittedMessage = cleanString(payload.message, 6000);
  const signupPage = cleanString(payload.signupPage, 240);

  if (!name || !email || !submittedMessage) {
    return jsonResponse({ ok: false, message: "Please add your name, email address, and message." }, 400);
  }

  const clickUpResponse = await fetch(`https://api.clickup.com/api/v2/list/${encodeURIComponent(listId)}/task`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: token,
    },
    body: JSON.stringify({
      name: `Fruitful Pin contact: ${topic}`.slice(0, 240),
      description: createTaskDescription({
        name,
        email,
        website,
        topic,
        message: submittedMessage,
        signupPage,
      }),
    }),
  });

  if (!clickUpResponse.ok) {
    const message =
      clickUpResponse.status === 401 || clickUpResponse.status === 403
        ? "ClickUp rejected the request. Please check the ClickUp API token permissions."
        : clickUpResponse.status === 404
          ? "ClickUp could not find the contact list. Please check the ClickUp list ID."
          : "ClickUp rejected the contact form request. Please try again or email hello@fruitfulpin.com.";

    return jsonResponse(
      {
        ok: false,
        message,
      },
      clickUpResponse.status >= 500 ? 502 : 400,
    );
  }

  return jsonResponse({ ok: true });
}

export function onRequest() {
  return jsonResponse({ ok: false, message: "Method not allowed." }, 405);
}
