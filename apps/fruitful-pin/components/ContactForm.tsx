"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

const PINTEREST_SUPPORT_TOPIC = "I want to explore Pinterest support";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function ContactForm() {
  const [topic, setTopic] = useState(PINTEREST_SUPPORT_TOPIC);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = getField(formData, "name");
    const email = getField(formData, "email");
    const website = getField(formData, "website");
    const topic = getField(formData, "topic") || "General question";
    const message = getField(formData, "message");

    const body = [
      name ? `Name: ${name}` : "",
      email ? `Email: ${email}` : "",
      website ? `Website / Brand: ${website}` : "",
      `Topic: ${topic}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Fruitful Pin: ${topic}`)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label className="contact-form-field">
        <span>Name*</span>
        <input name="name" type="text" placeholder="Your name" required />
      </label>
      <label className="contact-form-field">
        <span>Email address*</span>
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>
      <label className="contact-form-field contact-form-field-wide">
        <span>Website / Brand</span>
        <input name="website" type="text" placeholder="https://yourwebsite.com" />
      </label>
      <label className="contact-form-field contact-form-field-wide">
        <span>What are you reaching out about?</span>
        <select name="topic" value={topic} onChange={(event) => setTopic(event.target.value)}>
          <option>{PINTEREST_SUPPORT_TOPIC}</option>
          <option>I have a general question</option>
          <option>Collaboration or partnership</option>
          <option>Podcast or speaking invitation</option>
          <option>Press or media</option>
          <option>Other</option>
        </select>
      </label>
      {topic === PINTEREST_SUPPORT_TOPIC ? <p className="contact-form-helper">For Pinterest support, you may get a faster next step by booking a Fit Call.</p> : null}
      <label className="contact-form-field contact-form-field-wide">
        <span>Message*</span>
        <textarea name="message" rows={6} placeholder="Tell me what you are hoping Pinterest can support, or what question you would like to ask." required />
      </label>
      <button className="button-primary" type="submit">
        Send Message
      </button>
    </form>
  );
}
