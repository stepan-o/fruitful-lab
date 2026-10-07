"use client";

import { FormEvent, useState } from "react";

type GuestInterestFormProps = {
  className: string;
};

export function GuestInterestForm({ className }: GuestInterestFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "guest",
          email,
          topic: "Guest contributor interest",
          message: "Guest contributor interest from the About page.",
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We could not send that note yet.");
      }

      setStatus("success");
      setMessage(result.message || "Your note is in the garden. Thank you.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not send that note yet.");
    }
  }

  return (
    <form className={className} onSubmit={submitInterest}>
      <label htmlFor="guest-email">Your email address</label>
      <div>
        <input
          id="guest-email"
          name="guest-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          required
          type="email"
          value={email}
        />
        <button disabled={status === "submitting"} type="submit">
          Become a Guest Contributor
        </button>
      </div>
      <p>We&apos;d love to hear from you.</p>
      {message ? (
        <p aria-live="polite" className={`form-status ${status === "error" ? "form-status--error" : ""}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
