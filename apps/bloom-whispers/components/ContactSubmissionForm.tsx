"use client";

import { FormEvent, useState } from "react";

type ContactSubmissionFormProps = {
  buttonClassName?: string;
  buttonLabel: string;
  className: string;
  defaultTopic?: string;
  messageLabel: string;
  messagePlaceholder: string;
  note: string;
  noteClassName: string;
  showTopic?: boolean;
  twoFieldsClassName: string;
  type: "contact" | "guest";
};

export function ContactSubmissionForm({
  buttonClassName,
  buttonLabel,
  className,
  defaultTopic = "",
  messageLabel,
  messagePlaceholder,
  note,
  noteClassName,
  showTopic = false,
  twoFieldsClassName,
  type,
}: ContactSubmissionFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      type,
      name: String(formData.get("name") || formData.get("guest-name") || ""),
      email: String(formData.get("email") || formData.get("guest-email") || ""),
      topic: String(formData.get("topic") || defaultTopic),
      message: String(formData.get("message") || formData.get("guest-pitch") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We could not send that note yet.");
      }

      setStatus("success");
      setMessage(result.message || "Your note is in the garden. Thank you.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not send that note yet.");
    }
  }

  return (
    <form className={className} onSubmit={submitContact}>
      <div className={twoFieldsClassName}>
        <label>
          <span>Your name</span>
          <input name={type === "guest" ? "guest-name" : "name"} placeholder="Your name" type="text" />
        </label>
        <label>
          <span>Your email</span>
          <input name={type === "guest" ? "guest-email" : "email"} placeholder="Your email" required type="email" />
        </label>
      </div>
      {showTopic ? (
        <label>
          <span>What&apos;s this about?</span>
          <select defaultValue="" name="topic" required>
            <option disabled value="">
              What&apos;s this about?
            </option>
            <option>General question</option>
            <option>Collaboration</option>
            <option>Flower meaning or story idea</option>
            <option>Press or partnership</option>
            <option>Something else</option>
          </select>
        </label>
      ) : null}
      <label>
        <span>{messageLabel}</span>
        <textarea
          name={type === "guest" ? "guest-pitch" : "message"}
          placeholder={messagePlaceholder}
          required
          rows={type === "guest" ? 4 : 5}
        />
      </label>
      <button className={buttonClassName} disabled={status === "submitting"} type="submit">
        {buttonLabel}
        <span aria-hidden="true">✦</span>
      </button>
      <p className={noteClassName}>{note}</p>
      {message ? (
        <p aria-live="polite" className={`form-status ${status === "error" ? "form-status--error" : ""}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
