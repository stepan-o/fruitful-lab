const GROUP_ENV = {
  "bloom-letter": "MAILERLITE_GROUP_BLOOM_LETTER",
  "shop-waitlist": "MAILERLITE_GROUP_SHOP_WAITLIST",
  quiz: "MAILERLITE_GROUP_QUIZ",
  "flower-guide": "MAILERLITE_GROUP_FLOWER_GUIDE",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return json({ ok: false, message: "Method not allowed." }, 405);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Please send a valid email address." }, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const group = typeof body.group === "string" ? body.group : "bloom-letter";

  if (!isEmail(email)) {
    return json({ ok: false, message: "Please enter a valid email address." }, 400);
  }

  const mailerLiteToken = env.MAILERLITE_API_KEY || env.MAILERLITE_API_TOKEN;

  if (!mailerLiteToken) {
    return json({ ok: false, message: "Email signup is almost connected. Please try again soon." }, 503);
  }

  const groupId = GROUP_ENV[group] ? env[GROUP_ENV[group]] : undefined;
  const payload = {
    email,
    fields: firstName ? { name: firstName } : undefined,
    groups: groupId ? [groupId] : undefined,
  };

  const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      authorization: `Bearer ${mailerLiteToken}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail = "MailerLite rejected the request.";

    try {
      const error = await response.json();
      detail = error.message || detail;
    } catch {
      // Keep the user-facing response calm if MailerLite returns non-JSON.
    }

    return json({ ok: false, message: "We could not save that email yet. Please try again.", detail }, 502);
  }

  return json({
    ok: true,
    grouped: Boolean(groupId),
    message: groupId
      ? "You're in. Watch your inbox for a note from the garden."
      : "You're in. Add the MailerLite group ID later to segment this signup.",
  });
}
