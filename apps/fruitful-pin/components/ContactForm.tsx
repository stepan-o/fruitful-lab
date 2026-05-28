"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

const PINTEREST_SUPPORT_TOPIC = "I want to explore Pinterest support";

type FormStatus = "idle" | "submitting" | "success" | "error";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function ContactForm() {
  const [topic, setTopic] = useState(PINTEREST_SUPPORT_TOPIC);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = getField(formData, "name");
    const email = getField(formData, "email");
    const website = getField(formData, "website");
    const topic = getField(formData, "topic") || "General question";
    const message = getField(formData, "message");
    const company = getField(formData, "company");

    if (!name || !email || !message) {
      setStatus("error");
      setMessage("Please add your name, email address, and message.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          website,
          topic,
          message,
          company,
          signupPage: window.location.pathname,
        }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Please try again.");
      }

      form.reset();
      setTopic(PINTEREST_SUPPORT_TOPIC);
      setStatus("success");
      setMessage("Thank you. Your message has been sent.");
      trackEvent("contact_form_submitted", {
        topic,
        has_website: Boolean(website),
        page_path: window.location.pathname,
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again or email hello@fruitfulpin.com.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input className="hidden" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
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
      <button className="button-primary" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
      {message ? (
        <p className={`form-status-message ${status === "success" ? "is-success" : "is-error"}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
