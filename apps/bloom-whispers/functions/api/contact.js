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

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return json({ ok: false, message: "Method not allowed." }, 405);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Please send a valid note." }, 400);
  }

  const type = clean(body.type) === "guest" ? "guest" : "contact";
  const name = clean(body.name) || "Bloom Whispers visitor";
  const email = clean(body.email).toLowerCase();
  const topic = clean(body.topic);
  const message = clean(body.message);

  if (!isEmail(email) || !message) {
    return json({ ok: false, message: "Please include your email and message." }, 400);
  }

  if (!env.CLICKUP_API_TOKEN || !env.CLICKUP_LIST_BLOOM_WHISPERS) {
    return json({ ok: false, message: "This form is almost connected. Please try again soon." }, 503);
  }

  const titlePrefix = type === "guest" ? "Guest idea" : "Contact note";
  const taskBody = {
    name: `[Bloom Whispers] ${titlePrefix}: ${name}`,
    description: [
      `Type: ${type}`,
      `Name: ${name}`,
      `Email: ${email}`,
      topic ? `Topic: ${topic}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
    tags: ["bloom-whispers", type],
  };

  const response = await fetch(`https://api.clickup.com/api/v2/list/${env.CLICKUP_LIST_BLOOM_WHISPERS}/task`, {
    method: "POST",
    headers: {
      authorization: env.CLICKUP_API_TOKEN,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(taskBody),
  });

  if (!response.ok) {
    return json({ ok: false, message: "We could not send that note yet. Please try again." }, 502);
  }

  return json({ ok: true, message: "Your note is in the garden. Thank you." });
}
