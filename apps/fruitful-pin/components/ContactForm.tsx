"use client";

import type { FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function ContactForm() {
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
        <span>Email Address*</span>
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>
      <label className="contact-form-field contact-form-field-wide">
        <span>Website / Brand</span>
        <input name="website" type="text" placeholder="https://yourwebsite.com" />
      </label>
      <label className="contact-form-field contact-form-field-wide">
        <span>What are you reaching out about?</span>
        <select name="topic" defaultValue="General question">
          <option>General question</option>
          <option>Pinterest services</option>
          <option>Podcast or speaking invitation</option>
          <option>Collaboration idea</option>
        </select>
      </label>
      <label className="contact-form-field contact-form-field-wide">
        <span>Message*</span>
        <textarea name="message" rows={6} placeholder="Tell me what you are hoping Pinterest can support." required />
      </label>
      <button className="button-primary min-h-12 rounded-md px-6 text-sm font-semibold" type="submit">
        Send Message
      </button>
    </form>
  );
}
