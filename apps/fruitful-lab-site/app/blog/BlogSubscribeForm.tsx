"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

type BlogSubscribeFormProps = {
  compact?: boolean;
};

export function BlogSubscribeForm({ compact = false }: BlogSubscribeFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const subject = encodeURIComponent("Fruitful Lab notes request");
    const body = encodeURIComponent(`Please add me to future Fruitful Lab notes when the list is ready.

Email: ${email}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <form className={`flbp-subscribe-form${compact ? " flbp-subscribe-form-compact" : ""}`} onSubmit={handleSubmit}>
      <label>
        <span>Email address</span>
        <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </label>
      <button type="submit">Send me the notes</button>
      {submitted ? <p role="status">Your email draft is ready. Send it to join future Lab notes.</p> : null}
    </form>
  );
}
